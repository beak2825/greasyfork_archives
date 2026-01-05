// ==UserScript==
// @name         Steam DRM Highlighter Revenant
// @namespace    bf83963f-fffc-4c93-98ee-bc11e23e2176
// @author       Rebecca Menessec (fr. Denilson Sá)
// @version      1.8.0
// @description  Highlight DRM-related words in Steam Store pages.
// @icon         data:image/png;base64,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
// @encoding     utf-8
// @include      http://store.steampowered.com/app/*
// @include      http://store.steampowered.com/sub/*
// @include      https://store.steampowered.com/app/*
// @include      https://store.steampowered.com/sub/*
// @downloadURL https://update.greasyfork.org/scripts/16785/Steam%20DRM%20Highlighter%20Revenant.user.js
// @updateURL https://update.greasyfork.org/scripts/16785/Steam%20DRM%20Highlighter%20Revenant.meta.js
// ==/UserScript==
! function() {
	// Adds a new match to the found_in_this_page array.
	// Returns the added element.
	function add_match_to_page_list(text, element) {
		var new_match = {
			text: text.trim(),
			element: element,
			index: found_in_this_page.length,
			id: "bad_word_" + this.index
		};
		return found_in_this_page.push(new_match), new_match
	}
	// Creates and returns a new element like this:
	// <span class="bad_word" id="bad_word_3">text</span>
	function createBadWordElement(text) {
		var elem = document.createElement("span"),
			found = add_match_to_page_list(text, elem);
		return elem.setAttribute("class", "bad_word"), elem.setAttribute("id", found.id), elem.appendChild(document.createTextNode(text)), elem
	}
	// This function receives a list of text elements, and makes the highlight
	// in-place, directly in those elements. However, while doing so, some
	// elements are created and others are deleted. Thus, this function also
	// returns a new list of text elements (that can be passed again for
	// highlighting other words).
	//
	// This function was loosely based on:
	// http://userscripts.org/scripts/show/64232
	function find_highlight_in_elements(bad_word_regexp, text_elements) {
		for (var new_text_elements = [], i = 0; i < text_elements.length; i++)
			for (var current = text_elements[i];;) {
				// current is a TextNode always attached to the document tree
				var match = bad_word_regexp.exec(current.nodeValue);
				if (!match) // no match
				{
					new_text_elements.push(current);
					break
				}
				var current_text = current.nodeValue,
					before_text = current_text.substring(0, match.index),
					middle_text = match[0],
					after_text = current_text.substring(bad_word_regexp.lastIndex),
					before = document.createTextNode(before_text),
					hl_node = createBadWordElement(middle_text),
					after = document.createTextNode(after_text),
					par = current.parentNode;
				par.insertBefore(before, current), par.insertBefore(hl_node, current), par.insertBefore(after, current), par.removeChild(current), new_text_elements.push(before), current = after,
					// Making it restart from the beginning.
					bad_word_regexp.lastIndex = 0
			}
		return new_text_elements
	}
	// This is basically the main function of this script.
	// It finds all text nodes in the document and, for each one, tries
	// to find and highlight the bad_words.
	function highlight_words_in_document() {
		for (var result = document.evaluate("//body//text()", // XPath expression
				document, // contextNode
				null, // namespaceResolver
				XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null), result_len = result.snapshotLength, text_i = 0; result_len > text_i; text_i++) {
			var text = result.snapshotItem(text_i);
			// Ignoring hidden text inside some elements:
			if (!(1 == text.parentNode.nodeType && text.parentNode.nodeName.toLowerCase() in ignored_tags))
				for (var text_elements = [text], i = 0; i < bad_words.length; i++) text_elements = find_highlight_in_elements(bad_words[i], text_elements)
		}
	}
	// Adds a <style> element to the <head>
	function add_style_to_head() {
		var head = document.getElementsByTagName("head")[0];
		if (head) {
			var style = document.createElement("style");
			style.setAttribute("type", "text/css"), style.appendChild(document.createTextNode("span.bad_word { background: #c00 !important; color: white !important; }div#bad_word_msg { background: #c00; color: white; padding: 0.5em; position: absolute; top: 0; left: 200px; z-index: 999999999; font-size: 11px; line-height: normal; }div#bad_word_msg a { text-decoration: underline; color: inherit; font: inherit; }div#bad_word_msg ul, div#bad_word_msg li { list-style: disc; padding: 0; margin: 0; font: inherit; }div#bad_word_msg ul { display: none; margin-left: 2em; }div#bad_word_msg:hover ul { display: block; }")), head.appendChild(style)
		}
	}

	function ignore_case_comparison(a, b) {
		return a = a.toLowerCase(), b = b.toLowerCase(), a > b ? 1 : b > a ? -1 : 0
	}

	function add_message_at_page() {
		var body = document.getElementsByTagName("body")[0];
		if (body) {
			for (var keys = {}, words = [], i = 0; i < found_in_this_page.length; i++) {
				var text = found_in_this_page[i].text;
				keys[text.toLowerCase()] = text
			}
			for (var i in keys) words.push(keys[i]);
			words.sort(ignore_case_comparison);
			for (var words_ul_list = "", i = 0; i < words.length; i++) words_ul_list += "<li>" + words[i] + "</li>";
			var div = document.createElement("div");
			div.setAttribute("id", "bad_word_msg"), div.innerHTML = 'Warning: Some DRM-related words were found! (<a href="http://forums.steampowered.com/forums/showthread.php?t=1537801">forum</a>, <a href="http://steamdrm.flibitijibibo.com/the-big-drm-list/">list</a>)';
			var ul = document.createElement("ul");
			ul.innerHTML = words_ul_list, div.appendChild(ul), body.appendChild(div)
		}
	}
	var bad_words = [
			/3rd-party DRM/gi, /\bSecuROM.?\b/gi, /\bTAGES\b/gi, /\bGameShield\b/gi, /\bSolidshield\b/gi, /\bStarforce\b/gi, /\bUniloc\b/gi, /\bUplay\b/gi, /\b\origin\.com\b/gi, /\bOrigin\b/g, /\bStardock\.com\b/gi, /Denuvo/gi, /Kalypso Launcher/gi, /FrontLine ProActive/gi, /Square Enix account/gi, /(Microsoft ?)?Games For Windows( ?. ?)?( ?LIVE)/gi, /www\.gamesforwindows\.com/gi, /activate\.ea\.com(\/deauthorize)?/gi, /EA (Access|Account)/gi, /Kalypso account/gi, /Microsoft SSA/gi, /Ubisoft’?s? Online Services?( Platform)?/gi, /(permanent |persistent )(high speed )?Internet( connection| access)?/gi, /SINGLE-USE SERIAL CODE/gi, /revoke license/gi, /INTERNET CONNECTION.* REQUIRED TO PLAY/gi, /CREATION OF( A| AN)? UBISOFT ACCOUNT/gi, /([0-9]+ |unlimited )?(per (week|month|year) |total )?(machines? )( limit)?/gi

			// Reality Pump fine tuning
			// Matching whitespace to reduce false-positives.
			, /^\s*\bReality Pump\b\s*$/gi
			// This version matches in http://store.steampowered.com/sub/13656/
			, /DRM Reality Pump\b/gi
			// This entry has no mention of the DRM on the store page http://store.steampowered.com/app/253880
			, /^\s*Earth 2150 Trilogy\s*$/g


			// These games use SecuRom, but that's not described on their store pages
			, /^\s*Blood Bowl.? Legendary Edition\s*$/g

			// These games use TAGES/SolidShield, but that's not described on their
			// store pages
			, /^\s*Gothic.? 3\s*$/g, /^\s*Jack Keane\s*$/g, /^\s*Risen\s*$/g, /^\s*S.T.A.L.K.E.R.: Clear Sky\s*$/g, /^\s*Silverfall\s*$/g, /^\s*Silverfall: Earth Awakening\s*$/g, /^\s*Silverfall: Complete\s*$/g

			// These games use Game For Windows, but that's not described on their
			// store pages
			, /^\s*Kane (&|and) Lynch: Dead Men.?\s*$/g, /^\s*Section 8\s*$/g, /^\s*Stormrise\s*$/g, /^\s*The Club.?\s*$/g

			// These games use Denuvo Anti-Tamper, but that's not described
			// on their store pages
			, /^\s*Far Cry.? Primal\s*$/g, /^\s*METAL GEAR SOLID V: THE PHANTOM PAIN\s*$/g, /^\s*Batman.?: Arkham Knight\s*$/g, /^\s*Rise of the Tomb Raider.?\s*$/g, /^\s*Mad Max\s*$/g, /^\s*Lords Of The Fallen.?\s*$/g, /^\s*Just Cause.? 3\s*$/g

			// These games use other DRM like VMProtect, homegrown online activation, etc 
			// but that's not described on their store pages
			, /^\s*Arma 3\s*$/g, /^\s*Fritz Chess 14\s*$/g, /^\s*Monster Trucks Nitro\s*$/g, /^\s*Tales of Symphonia\s*$/g


			//Postal III is iffy, wiki links to a DRM removal from the devs that 404s,
			//might have been added into the game itself but can't find anything about it.
			//Due to general sketchiness of all involved, I'm going to assume ACTControl is still active.
			, /^\s*Postal III\s*$/g
		],
		ignored_tags = {
			embed: "",
			object: "",
			applet: "",
			style: "",
			script: "",
			input: "",
			textarea: "",
			button: "",
			select: "",
			option: ""
		},
		found_in_this_page = [];
	add_style_to_head(), highlight_words_in_document(), found_in_this_page.length > 0 && add_message_at_page()
}();
