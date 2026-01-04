// ==UserScript==
// @name         Leetcode relative line number
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make relative line number available on leetcode
// @author       You
// @match        https://leetcode.com/problems/*
// @icon         https://www.google.com/s2/favicons?domain=leetcode.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433003/Leetcode%20relative%20line%20number.user.js
// @updateURL https://update.greasyfork.org/scripts/433003/Leetcode%20relative%20line%20number.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const ACTIVE_LINE = "CodeMirror-activeline-gutter"
    function setRelativeLineNumber() {
        let allLines = Array.from(document.querySelectorAll("div.CodeMirror-linenumber"));
        let activeLineIndex = allLines.findIndex(line => line.parentNode.classList.contains(ACTIVE_LINE));
        if (allLines[activeLineIndex].innerHTML == ' ') {
            return;
        }
        for (let i = 0; i < allLines.length; i++) {
            let line = allLines[i];
            line.innerHTML = Math.abs(i - activeLineIndex).toString();
            if (line.innerHTML == "0") {
                line.innerHTML = " ";
            }
        }
    };
    setInterval(setRelativeLineNumber, 300);
    document.addEventListener('click', setRelativeLineNumber);

})();