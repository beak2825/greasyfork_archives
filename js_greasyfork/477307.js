// ==UserScript==
// @name         IME2Furigana
// @namespace    ime2furigana
// @version      1.8.3
// @description  Adds furigana markup functionality to Discourse. When inputting kanji with an IME, furigana markup is automatically added.
// @author       Sinyaven, quickfix by polv
// @license      MIT-0
// @match        https://community.wanikani.com/*
// @homepageURL  https://community.wanikani.com/t/39109
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477307/IME2Furigana.user.js
// @updateURL https://update.greasyfork.org/scripts/477307/IME2Furigana.meta.js
// ==/UserScript==

(async function() {
	"use strict";

	/* global require, exportFunction */
	/* eslint no-multi-spaces: "off" */

	//////////////
	// settings //
	//////////////

	const ASK_BEFORE_CONVERTING_RUBY_TO_FURIGANA_MARKUP = false;
	const TEXT_UNDO_COMPATIBILITY = true;

	//////////////

	const DISCOURSE_REPLY_BOX_ID = "reply-control";
	const DISCOURSE_REPLY_AREA_CLASS = "reply-area";
	const DISCOURSE_BUTTON_BAR_CLASS = "d-editor-button-bar";
	const NO_BACK_CONVERSION_CLASS_FLAG = "ruby-to-furigana-markup-disabled";
	const RUBY_TEMPLATE = "<ruby lang = 'ja-JP'>$1<rp>(</rp><rt>$2</rt><rp>)</rp></ruby>";
	const RUBY_SPOILER_TEMPLATE = "<ruby lang = 'ja-JP'>$1<rp>(</rp><rt><span class='spoiler'>$2</span></rt><rp>)</rp></ruby>";
	const FURIGANA_REGEX = /^[\p{scx=Hiragana}\p{scx=Katakana}]+$/u;
	const KANJI_REGEX = /([\p{sc=Han}\p{N}々〆ヵヶ]+)/u;
	const RUBY_REGEX = /<ruby\b[^>]*>((?:(?!<\/?ruby\b)[^])+)<\/ruby>/; // using [^] as a complete wildcard (as opposed to . which does not match newlines without the dotAll flag)
	const SPOILER_BBCODE_REGEX = /^\[spoiler\]([^]*)\[\/spoiler\]$/;
	const SPOILER_HTML_REGEX = /^<span\b[^>]*\bclass\s*=\s*["'][^"']*\bspoiler\b[^"']*["'][^>]*>([^]*)<\/span>$/;
	const COOK_SEARCH_REGEX = /<(?!\s)((?:<\/?\b[^<>]*>(?!\[)|[^<>])*)>\[(?!spoiler\s*\])([^\]]*)\]/g;
	const COOK_SPOILER_SEARCH_REGEX = /<(?!\s)((?:<\/?\b[^<>]*>(?!{)|[^<>])*)>{([^}]*)}/g;

	// negative lookbehind might not be supported (e.g. Waterfox) - in that case use an insufficient regex and hope for the best
	let greaterThan_regex = null;
	try { greaterThan_regex = new RegExp("(?<!<\\/?\\b[^<>]*)>", "g"); } catch (e) { greaterThan_regex = /^>/g; }

	const MODES = ["off", "on", "blur"];

	let mode = 1;
	let furigana = "";
	let bMode = null;
	let tText = null;
	let dBanner = null;
	let alreadyInjected = false;

	// ---STORAGE--- //

	mode = parseInt(localStorage.getItem("furiganaMode") || mode);
	addEventListener("storage", e => e.key === "furiganaMode" ? modeValueChangeHandler(parseInt(e.newValue)) : undefined);

	function modeValueChangeHandler(newValue) {
		mode = newValue;
		if (!bMode) return;

		updateButton();
		// trigger _updatePreview() by appending a space, dispatching a change event, and then removing the space
		let textValue = tText.value;
		let selectionStart = tText.selectionStart;
		let selectionEnd = tText.selectionEnd;
		let selectionDirection = tText.selectionDirection;
		tText.value += " ";
		tText.dispatchEvent(new Event("change", {bubbles: true, cancelable: true}));
		tText.value = textValue;
		tText.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
		tText.dispatchEvent(new Event("change", {bubbles: true, cancelable: true}));
	}

	function setModeValue(newValue) {
		modeValueChangeHandler(newValue);
		localStorage.setItem("furiganaMode", mode);
	}

	// ---REPLY BOX AND TEXT AREA DETECTION--- //

	let dObserverTarget = await waitFor(DISCOURSE_REPLY_BOX_ID, 1000, 30); // Greasemonkey seems to inject script before reply box is available, so we might have to wait
	let observer = new MutationObserver(m => m.forEach(handleMutation));
	observer.observe(dObserverTarget, {childList: true, subtree: true});

	addCss();

	// text area might already be open
	setupForTextArea(document.querySelector("textarea.d-editor-input"));
	addButton(document.getElementsByClassName(DISCOURSE_BUTTON_BAR_CLASS)[0]);

	function handleMutation(mutation) {
		let addedNodes   = [...mutation.addedNodes];
		let removedNodes = [...mutation.removedNodes];
		// those forEach() are executed at most once
		addedNodes.filter(n => n.tagName === "TEXTAREA").forEach(setupForTextArea);
		addedNodes.filter(n => n.classList && n.classList.contains(DISCOURSE_BUTTON_BAR_CLASS)).forEach(addButton);
		removedNodes.filter(n => n.classList && n.classList.contains(DISCOURSE_REPLY_AREA_CLASS)).forEach(cleanup);
	}

	function setupForTextArea(textArea) {
		const CLASS = "ime2furigana-is-listening";
		if (!textArea || textArea.classList.contains(CLASS)) return;
		tText = textArea;
		tText.classList.add(CLASS);
		tText.addEventListener("compositionupdate", updateFurigana);
		tText.addEventListener("compositionend", addFurigana);
		tText.addEventListener("keydown", e => e.ctrlKey && e.shiftKey && e.key.toUpperCase() === "F" ? cycleMode() : undefined);
		tText.addEventListener("input", e => { if (e.currentTarget.value === "") bMode?.classList.remove("markup-found"); });
		injectIntoDiscourse();
	}

	async function waitFor(elementId, checkInterval = 1000, waitCutoff = Infinity) {
		let result = null;
		while (--waitCutoff > 0 && !(result = document.getElementById(elementId))) await sleep(checkInterval);
		return result;
	}

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	// ---MAIN LOGIC--- //

	function addButton(div) {
		if (!div || document.getElementById("ime2furigana-button")) return;
		bMode = document.createElement("button");
		bMode.id = "ime2furigana-button";
		bMode.className = "btn no-text btn-icon ember-view";
		bMode.textContent = "F";
		updateButton();
		bMode.addEventListener("click", cycleMode);
		div.appendChild(bMode);
	}

	function cycleMode() {
		setModeValue((mode + 1) % MODES.length);
		if (tText) tText.focus();
	}

	function updateButton() {
		bMode.classList.toggle("active", mode);
		bMode.classList.toggle("blur", mode === 2);
		bMode.title = "IME2Furigana - " + MODES[mode];
	}

	function updateFurigana(event) {
		if (FURIGANA_REGEX.test(event.data)) {
			furigana = event.data;
		}
	}

	function addFurigana(event) {
		if (!mode || event.data.length === 0) return;
		furigana = [...furigana.replace(/ｎ/g, "ん")].map(c => katakanaToHiragana(c)).join("");
		let parts = event.data.split(KANJI_REGEX);
		if (parts.length === 1) return;
		let hiraganaParts = parts.map(p => [...p].map(c => katakanaToHiragana(c)).join(""));
		let regex = new RegExp(`^${hiraganaParts.map((p, idx) => `(${idx & 1 ? ".+" : p})`).join("")}$`);
		let rt = furigana.match(regex);
		if (!rt) {
			parts = [event.data];
			rt = [null, furigana];
		}
		rt.shift();
		let rtStart = mode === 2 ? "{" : "[";
		let rtEnd   = mode === 2 ? "}" : "]";
		let markup  = parts.map((p, idx) => idx & 1 ? "<" + p + ">" + rtStart + rt[idx] + rtEnd : p).join("");
		if (TEXT_UNDO_COMPATIBILITY && document.execCommand) {
			event.target.setSelectionRange(event.target.selectionStart - event.data.length, event.target.selectionStart);
			event.target.focus();
			document.execCommand("insertText", false, markup);
		} else {
			event.target.setRangeText(markup, event.target.selectionStart - event.data.length, event.target.selectionStart, "end");
		}
	}

	function katakanaToHiragana(k) {
		let c = k.charCodeAt(0);
		return c >= 12449 && c <= 12531 ? String.fromCharCode(k.charCodeAt(0) - 96) : k;
	}

	function cleanup() {
		furigana = "";
		bMode = null;
		tText = null;
		dBanner = null;
	}

	// ---CONVERTING BACK TO FURIGANA MARKUP--- //

	function removeBanner() {
		if (dBanner) dBanner.parentElement.removeChild(dBanner);
		dBanner = null;
	}

	function checkForRubyTags() {
		if (tText.parentElement.parentElement.classList.contains(NO_BACK_CONVERSION_CLASS_FLAG)) return;
		if (!RUBY_REGEX.test(tText.value)) return removeBanner();
		if (dBanner) return;
		dBanner = document.createElement("div");
		let bConvert = document.createElement("button");
		let bCancel = document.createElement("button");
		dBanner.id = "ime2furigana-conversion-banner";
		dBanner.textContent = "Convert <ruby> to furigana markup?";
		bConvert.textContent = "\u2714";
		bCancel.textContent = "\u274C";
		dBanner.appendChild(bConvert);
		dBanner.appendChild(bCancel);
		bConvert.addEventListener("click", () => { rubyToFuriganaMarkup(); removeBanner(); });
		bCancel.addEventListener("click", () => { tText.parentElement.parentElement.classList.add(NO_BACK_CONVERSION_CLASS_FLAG); removeBanner(); });
		tText.insertAdjacentElement("beforebegin", dBanner);
	}

	function rubyToFuriganaMarkup() {
		let parts = tText.value.split(RUBY_REGEX);
		if (parts.length === 1) return;
		tText.value = parts.map((p, idx) => idx & 1 ? rubyContentToFuriganaMarkup(p) : p).join("");
		tText.dispatchEvent(new Event("change", {bubbles: true, cancelable: true}));
	}

	function rubyContentToFuriganaMarkup(ruby) {
		// should be able to handle both interleaved and tabular markup
		// remove <rp>...</rp> or <rp>...<rt>
		ruby = ruby.split(/<rp\s*>/).map((part, idx) => idx === 0 ? part : part.substr(part.search(/<\/rp\s*>|<rt\s*>/))).join("").replace(/<\/rp\s*>/g, "");
		// get rt content
		let rt = ruby.split(/<rt\s*>/).map(part => part.substr(0, part.concat("<rb>").search(/<rb\s*>|<\/rt\s*>/)));
		rt.shift();
		// get rb content
		let rb = ruby.split(/(?:<\/rt\s*>\s*)?<rb\s*>|<\/rt\s*>/).map(part => part.substr(0, part.concat("<rt>").search(/(?:<\/rb\s*>\s*)?<rt\s*>/))).filter(part => !/^\s*$/.test(part));
		// add furigana markup brackets to rt
		rt = rt.map(v => (SPOILER_BBCODE_REGEX.exec(v) || SPOILER_HTML_REGEX.exec(v))?.[1].replace(/[^]*/, "{$&}") || `[${v}]`);
		// sanitize rb ("<" not allowed except for tags)
		rb = rb.map(v => v.replace(/<(?!\/?\b[^<>]*>)/g, "&lt;"));
		// sanitize rb (">" not allowed except for tags)
		rb = rb.map(v => v.replace(greaterThan_regex, "&gt;"));
		// sanitize rt ("]" or "}" not allowed)
		rt = rt.map(v => v[0] === "[" ? v.replace(/\](?!$)/, "&rsqb;") : v.replace(/}(?!$)/, "&rcub;"));
		// pad rt/rb to be the same length
		let result = rb.reduce((total, v, idx) => total + "<" + v + ">" + (rt[idx] || "[]"), "");
		result += rt.slice(rb.length).reduce((total, v) => total + "<>" + v, "");
		return result;
	}

	// ---COOKING RULE INJECTION--- //

	function injectIntoDiscourse() {
		// greasemonkey workaround: unsafeWindow + exportFunction
		let w = typeof unsafeWindow === "undefined" ? window : unsafeWindow;
		let e = typeof exportFunction === "undefined" ? o => o : exportFunction;
		if (!w.require) { contentContextFallback(); return; }
		if (alreadyInjected) return;
		alreadyInjected = true;
		injectCustomCook(w, e);
		injectCustomSave(w, e);
	}

	async function injectCustomCook(w, e) {
		let oldCook;
    while (!(oldCook = w.require("pretty-text/pretty-text").default.prototype.cook)) {
      await new Promise(r=>setTimeout(r, 100));
    }
		w.require("pretty-text/pretty-text").default.prototype.cook = async function (raw, ...ops) {
      return oldCook.apply(this, [customCook(raw), ...ops]);
    };
	}

	function injectCustomSave(w, e) {
		let oldSave = w.require("discourse/controllers/composer").default.prototype.save;
		w.require("discourse/controllers/composer").default.prototype.save = e(function(t) { applyCustomCookToInput(); oldSave.call(this, t); }, w);
	}

	function customCook(raw) {
		if (!mode) {
			removeBanner();
			return raw;
		}
		ASK_BEFORE_CONVERTING_RUBY_TO_FURIGANA_MARKUP ? checkForRubyTags() : rubyToFuriganaMarkup();
		let halfCooked = raw.replace(COOK_SEARCH_REGEX, RUBY_TEMPLATE);
		halfCooked = halfCooked.replace(COOK_SPOILER_SEARCH_REGEX, RUBY_SPOILER_TEMPLATE);
		bMode?.classList.toggle("markup-found", halfCooked !== raw);
		return halfCooked;
	}

	function applyCustomCookToInput() {
		tText.value = customCook(tText.value);
		tText.dispatchEvent(new Event("change", {bubbles: true, cancelable: true}));
	}

	// ---FALLBACK IF WE CANNOT ACCESS JAVASCRIPT OBJECTS FROM PAGE CONTEXT--- //

	function contentContextFallback() {
		console.warn("IME2Furigana: No access to objects in page context. Using fallback method which might be a bit slower, can cause text flickering, and pauses the instant preview during IME input.");
		const bSave = document.querySelector(".save-or-cancel button");
		let fallbackIgnoreChange = false;
		async function callback() {
			if (fallbackIgnoreChange || !mode) return;
			fallbackIgnoreChange = true;
			const original           = tText.value;
			const selectionStart     = tText.selectionStart;
			const selectionEnd       = tText.selectionEnd;
			const selectionDirection = tText.selectionDirection;
			applyCustomCookToInput();
			await true;
			tText.value = original;
			tText.setSelectionRange(selectionStart, selectionEnd, selectionDirection);
			fallbackIgnoreChange = false;
		}
		function delayedCallback() {
			if (fallbackIgnoreChange || !mode) return;
			setTimeout(callback);
		}
		tText.addEventListener("compositionstart", () => { fallbackIgnoreChange = true; });
		tText.addEventListener("compositionend"  , () => { fallbackIgnoreChange = false; });
		tText.addEventListener("input" , callback);
		tText.addEventListener("change", delayedCallback);
		tText.addEventListener("keyup" , delayedCallback);
		bSave.addEventListener("click" , applyCustomCookToInput);
		callback();
	}

	// ---ADD CSS--- //

	function addCss() {
		let style = document.createElement("style");
		style.textContent = `
			#ime2furigana-conversion-banner { transform: translateY(-0.25em); padding: 0.2em 0.6em; border-bottom: 1px solid gray; background-color: var(--tertiary-low, rgba(163, 225, 255, 0.5)); }
			#ime2furigana-conversion-banner > button { background-color: transparent; border: none; }
			#ime2furigana-button.active.markup-found { border-bottom: 4px solid var(--tertiary, blue); padding-bottom: calc(0.5em - 3px); }
			#ime2furigana-button.active { background-color: #00000042; }
			#ime2furigana-button.blur { filter: blur(2px); }`;
		document.head.appendChild(style);
	}
})();
