// ==UserScript==
// @name        Telegram Translations - Fix auto scroll
// @description When switching entry, a function that focus and select the text will also scroll the translation textbox under the page header and cause issues. This script fixes this problem while keep the "focus and select" part of that function.
// @namespace   RainSlide
// @author      RainSlide
// @license     blessing
// @version     1.0
// @icon        https://translations.telegram.org/img/website_icon.svg
// @match       https://translations.telegram.org/*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/489182/Telegram%20Translations%20-%20Fix%20auto%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/489182/Telegram%20Translations%20-%20Fix%20auto%20scroll.meta.js
// ==/UserScript==

"use strict";

$.fn.focusAndSelectAll = function() {

	// Reference: $.fn.focusAndSelect() in https://translations.telegram.org/js/jquery-ex.js
	var field = this.get(0), len = this.value().length;
	if (field.classList.contains("key-add-suggestion-field")) {
		this.focusField();
		if (len > 0) {
			if (this.is('[contenteditable]')) {
				var range = document.createRange(), sel;
				range.selectNodeContents(field);
				sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);
			} else if (field.setSelectionRange) {
				field.setSelectionRange(0, len);
		  }
		}
		// Skip the scrollIntoView() part for .key-add-suggestion-field
	} else {
		return this.focusAndSelect(true);
	}

};
