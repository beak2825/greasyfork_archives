// ==UserScript==
// @name         Quizlet set copier
// @namespace    http://tampermonkey.net/
// @version      0.11
// @license      MIT
// @description  Ctrl + Shift + I -> go to console and copy the output
// @author       You
// @match        https://quizlet.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=quizlet.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/465854/Quizlet%20set%20copier.user.js
// @updateURL https://update.greasyfork.org/scripts/465854/Quizlet%20set%20copier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let output = "";

    const spanTermTexts = document.querySelectorAll("span.TermText");

    if(spanTermTexts.length == 0) {
        console.log("No pairs were found. Please go to the main page of a quizlet set!");
        return
    }

    const textArr = Array.prototype.slice.call(spanTermTexts).map(x => x.innerText);

    textArr.forEach((x, i) => {
        output += (i%2 == 0) ? `${x} : ` : `${x}\n`;

    });

    console.log(output);

})();