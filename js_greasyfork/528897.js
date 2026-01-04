// ==UserScript==
// @name         Select Website
// @namespace    http://example.com
// @version      1.3
// @description  1 tap to select the hole website, 2 taps to copy
// @author       L.M.M.
// @match        *://*/*
// @downloadURL https://update.greasyfork.org/scripts/528897/Select%20Website.user.js
// @updateURL https://update.greasyfork.org/scripts/528897/Select%20Website.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button = document.createElement('button');
    button.innerText = "Select Text";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.zIndex = "1000";
    button.style.padding = "10px";
    button.style.backgroundColor = "#34302D";
    button.style.color = "white";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.boxShadow = "0px 2px 4px rgba(0,0,0,0.2)";
    button.style.fontSize = "16px";
    button.style.cursor = "pointer";

    button.addEventListener('click', function() {
        let body = document.body;

        let sel = window.getSelection();
        let range = document.createRange();
        range.selectNodeContents(body);
        sel.removeAllRanges();
        sel.addRange(range);
    });

    document.body.appendChild(button);
})();