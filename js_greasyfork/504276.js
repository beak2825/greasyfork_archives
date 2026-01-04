// ==UserScript==
// @name         Focus bing search bar ctrl + /
// @namespace    http://tampermonkey.net/
// @version      2024-08-19
// @author       paolodelfino
// @match        *://*.bing.com/search*
// @match        *://*.bing.com/videos/search?q=*
// @match        *://*.bing.com/images/search?q=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @description  Focus bing's search bar
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504276/Focus%20bing%20search%20bar%20ctrl%20%2B%20.user.js
// @updateURL https://update.greasyfork.org/scripts/504276/Focus%20bing%20search%20bar%20ctrl%20%2B%20.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('keydown', function(event) {

        if (event.ctrlKey && event.key === '/') {
            const textArea = document.getElementById('sb_form_q');
   
            if (document.activeElement != textArea) {
                textArea.focus();
 
                textArea.setSelectionRange(textArea.value.length, textArea.value.length);
                event.preventDefault();
            }
        }
    });
})();
