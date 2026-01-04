// ==UserScript==
// @name         Make Ctrl+Shift+C Copy
// @namespace    garyguo.net
// @version      0.1
// @description  Make Ctrl+Shift+C perform copy instead of open developer tool
// @author       Gary Guo
// @match        *://*/*
// @grant        none
// @license      Unlicense
// @downloadURL https://update.greasyfork.org/scripts/464318/Make%20Ctrl%2BShift%2BC%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/464318/Make%20Ctrl%2BShift%2BC%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.body.addEventListener('keydown', function(evt){
        if (evt.ctrlKey && evt.shiftKey && evt.key == "C"){
            // Copy the selection to the clipboard
            document.execCommand('copy');
            // Throw away this event and don't do the default stuff
            evt.stopPropagation();
            evt.preventDefault();
        }
    }, false);

    document.body.addEventListener('keyup', function(evt){
        if (evt.ctrlKey && evt.shiftKey && evt.key == "C"){
            // Throw away this event and don't do the default stuff
            evt.stopPropagation();
            evt.preventDefault();
        }
    }, false);
})();