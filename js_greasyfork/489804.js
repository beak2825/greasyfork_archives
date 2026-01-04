// ==UserScript==
// @name        ultra-hotkeys
// @namespace   Violentmonkey Scripts
// @include     https://www.messenger.com/*
// @include     https://app.standardnotes.com*
// @include     https://anilist.co/*
// @include     https://genius.com/*
// @include     https://web.whatsapp.com*
// @include     https://*pinterest.com*
// @include     https://hexdocs.pm/*
// @include     https://pipx.pypa.io/*
// @include     https://weebcentral.com*
// @include     https://watch.crafty.moe/*
// @include     https://weblab.tudelft.nl/docs/java/*
// @include     https://docs.oracle.com/en/java/*
// @include     https://jqwik.net/docs/*
// @include     https://javadoc.io/*
// @include     https://www.scala-lang.org/api/*
// @version     3.10
// @author      KraXen72
// @description hotkeys for various sites
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/489804/ultra-hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/489804/ultra-hotkeys.meta.js
// ==/UserScript==

// general hotkey system based on: https://github.com/KraXen72/fabric-moodboard/blob/master/src/ui-toolbar.ts
// messenger hotkeys loosly based on: https://github.com/guoguo12/messenger-shortcuts by Allen Guo

const hotkeyController = new AbortController()
const { signal } = hotkeyController

// message input auto-focuses after switching a chat, so it's ok

const registeredHotkeys = []
const debug = true

/** Helper functions **/
function click(targetNode) { fireMouseEvent(targetNode, 'click'); }

// Modified from http://stackoverflow.com/a/2706236
function fireMouseEvent(targetNode, event, opts = {}) {
  document.activeElement.blur()
  const eventObj = new Event(event, Object.assign({ bubbles: true, cancelable: false }, opts))
  targetNode.dispatchEvent(eventObj);
}

function fireKeybEvent(targetNode, event, opts = {}) {
  document.activeElement.blur()
  const eventObj = new KeyboardEvent(event, Object.assign({ bubbles: true, cancelable: false }, opts))
  if (debug) console.log(event, eventObj, targetNode)
  targetNode.dispatchEvent(eventObj);
  eventObj.preventDefault()
}

// sometimes you might need to pass custom code/which, check https://keycode.info
function fireKeybEventH(targetNode, key, opts = {}) {
  const _key = opts?.shiftKey ?? false ? key.toUpperCase() : key.toLowerCase()
  const which = opts?.which ?? key.toUpperCase().charCodeAt(0)
  const newOpts = Object.assign({
    key: _key,
    keyCode: `Key${key.toUpperCase()}`,
    which,
    code: opts?.code ?? which
  }, opts)
  fireKeybEvent(targetNode, 'keydown', newOpts)
}
// fireKeybEvent(document.body, 'keydown', { altKey: true, key: 'k', code: 'KeyK', which: 75 })
// click(qs(`#side ._1EUay > button[tabindex]`))

const captureOrigins = ["https://docs.google.com"];

document.addEventListener('keydown', (ev) => {
  if (debug) console.log("ultra hotkeys: keydown");
	for (let i = 0; i < registeredHotkeys.length; i++) {
		const hotkey = registeredHotkeys[i];
		const executeHotkey = () => {
      if (debug) console.log("running hotkey", hotkey.code, hotkey.constraints)
			if (hotkey?.constraints?.preventDefault === true ?? false) {
				ev.preventDefault()
			}
			hotkey.callback()
		}
		if (ev.code.toLowerCase() === hotkey.code.toLowerCase()) {
			if (typeof hotkey.constraints !== "undefined" && hotkey.constraints) {
				if (hotkey.constraints.exclusive) {
					if (![ev.ctrlKey, ev.shiftKey, ev.altKey].includes(true)) executeHotkey()
				} else {
					let valid = true
					if (hotkey.constraints.ctrlKey && hotkey.constraints.ctrlKey !== ev.ctrlKey) valid = false
					if (hotkey.constraints.altKey && hotkey.constraints.altKey !== ev.altKey) valid = false
					if (hotkey.constraints.shiftKey && hotkey.constraints.shiftKey !== ev.shiftKey) valid = false
					if (valid) executeHotkey()
				}
			} else {
				executeHotkey()
			}
		}
	}
}, { signal, capture: captureOrigins.includes(window.location.origin) });

function registerHotkey(keycode, callback, constraints) {
	const htk = { code: keycode, callback }
	if (typeof constraints !== "undefined" && constraints) htk.constraints = constraints
	registeredHotkeys.push(htk)
}

// page actions
switch (window.location.origin) {
    case "https://app.standardnotes.com":
      registerHotkey('keyk', standardnotesFocusSearch, { ctrlKey: true })
      registerHotkey('semicolon', () => document.getElementById("note-text-editor").focus(), { ctrlKey: true })
      registerHotkey('f1', standardnotesToggleFocusMode, { ctrlKey: true, preventDefault: true })
      break;
    case "https://www.messenger.com":
      registerHotkey('keyk', () => {document.querySelector(`input[type="search"]`).focus()}, { ctrlKey: true })
      registerHotkey('semicolon', () => click(document.querySelector(`div[contenteditable="true"][role="textbox"][tabindex="0"]`)), { ctrlKey: true })
      break;
    case "https://web.whatsapp.com":
      registerHotkey('keyk', () => fireKeybEventH(document.body, 'k', { altKey: true }), { ctrlKey: true })
      break;
    case "https://anilist.co":
      registerHotkey('keyk', () => click(document.querySelector('#nav div.search')), { ctrlKey: true })
      break;
    case "https://genius.com":
      registerHotkey('keyk', () => document.querySelector(`input[name="q"]`).focus(), { ctrlKey: true })
      break;
    case "https://www.pinterest.com":
      registerHotkey("keyk", () => document.querySelector("#searchBoxContainer input[type=text]").focus(), { ctrlKey: true })
      break;
    case "https://pipx.pypa.io":
      registerHotkey("keyk", () => document.querySelector("input.md-search__input").focus(), { ctrlKey: true })
      break;
    case "https://weebcentral.com":
      registerHotkey("keyk", () => document.querySelector("#quick-search-input").focus(), { ctrlKey: true })
      break;
    case "https://watch.crafty.moe":
      registerHotkey("keyk", () => document.querySelector("button.headerSearchButton").click(), { ctrlKey: true })
      break;
    case "https://hexdocs.pm":
      registerHotkey("keyk", () => document.getElementById("search-input").focus(), { ctrlKey: true });
      registerHotkey("escape", () => {
        if (document.activeElement === document.getElementById("search-input")) gleamEscapeSearch()
      });
      break;
    case "https://javadoc.io":
    case "https://docs.oracle.com":
    case "https://weblab.tudelft.nl":
    case "https://jqwik.net":
      registerHotkey("keyk", () => document.getElementById("search-input").focus(), { ctrlKey: true });
      break;
    case "https://docs.google.com": // experiment. doesen't really work = currently disabled by @includes
      registerHotkey("keym", () => {
        console.log("next bookmark");
        fireKeybEventH(document.body, 'n', { ctrlKey: true, altKey: true });
        setTimeout(() => fireKeybEventH(document.body, 'b', { ctrlKey: true, altKey: true }), 50);
      }, { ctlrKey: true, preventDefault: true })

      registerHotkey("keyn", () => {
        console.log("previous bookmark");
        fireKeybEventH(document.body, 'p', { ctrlKey: true, altKey: true });
        setTimeout(() => fireKeybEventH(document.body, 'b', { ctrlKey: true, altKey: true }), 50);
      }, { ctlrKey: true, preventDefault: true })
      break;
    case "https://www.scala-lang.org": {
      registerHotkey("keyk", () => {
        if (window.location.href.includes("/api/2")) {
          document.querySelector("input#index-input").focus();
        } else {
           document.getElementById("search-toggle").click()
        }
      }, { ctrlKey: true });
      break;
    }

    default:
      console.log(`no hotkeys defined for ${window.location.origin}, but the script includes it's url`)
      break;
}

// site specific helpers
function standardnotesToggleFocusMode() {
  fireKeybEventH(document.body, 'f', { ctrlKey: true, shiftKey: true })
}
function gleamEscapeSearch() {
  document.body.focus()
  document.documentElement.classList.remove("search-active");
}

function standardnotesFocusSearch() {
  if (document.body.classList.contains("focus-mode")) standardnotesToggleFocusMode()
  document.querySelector(`input#search-bar`).focus();
}

console.log("initialized ultra hotkeys");


