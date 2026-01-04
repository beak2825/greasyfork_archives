// ==UserScript==
// @name         Google Translate: focus on window focus
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Focus on translating from textarea on window focus.
// @author       Omar Hussein
// @match        https://translate.google.com/*
// @icon         https://www.google.com/s2/favicons?domain=translate.google.com
// @license      WTFPL
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426514/Google%20Translate%3A%20focus%20on%20window%20focus.user.js
// @updateURL https://update.greasyfork.org/scripts/426514/Google%20Translate%3A%20focus%20on%20window%20focus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const textarea = document.querySelector("textarea.er8xn")
    function focusOnTextarea() { textarea.focus() }

    window.addEventListener("focus", focusOnTextarea)
})();