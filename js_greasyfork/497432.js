// ==UserScript==
// @name         Focus bing search bar
// @namespace    http://tampermonkey.net/
// @version      2024-06-09
// @author       paolodelfino
// @match        *://*.bing.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @description  Focus bing's search bar
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/497432/Focus%20bing%20search%20bar.user.js
// @updateURL https://update.greasyfork.org/scripts/497432/Focus%20bing%20search%20bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keydown', function(event) {
        if (event.shiftKey && event.keyCode === 55) {
        const textArea = document.getElementById('sb_form_q')
            if (document.activeElement != textArea) {
              textArea.focus()
              event.preventDefault()
            }
        }
    });
})();