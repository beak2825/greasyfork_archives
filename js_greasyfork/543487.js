// ==UserScript==
// @name         Hide beauty ratings on LMD
// @version      1.0.1
// @description  Hides beauty ratings for Logic Masters Germany puzzles
// @author       SudokuFan
// @match        https://logic-masters.de/*
// @match        https://logic-masters.de/*.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=logic-masters.de
// @grant        none
// @run-at       document-end
// @license      GNU GPLv3
// @namespace https://greasyfork.org/users/1457017
// @downloadURL https://update.greasyfork.org/scripts/543487/Hide%20beauty%20ratings%20on%20LMD.user.js
// @updateURL https://update.greasyfork.org/scripts/543487/Hide%20beauty%20ratings%20on%20LMD.meta.js
// ==/UserScript==

// // @match        https://logic-masters.de/Raetselportal/*
// // @match        https://logic-masters.de/Raetselportal/*.*
(function() {
    'use strict';
    function isRating(elem) {
        const words = elem.innerHTML.split("&nbsp;")
        if (words.length != 2) {
            return false
        }
        if (words[1] != "%") {
            return false
        }
        return !isNaN(words[0])
    }
    const spans = document.querySelectorAll("span")
    for (const span of spans) {
        if (isRating(span)) {
            span.innerHTML = "(beauty rating hidden)"
            span.title = "(description of beauty rating hidden)"
            console.log("beauty rating hidden:", span)
        } else {
            console.log("not a beauty rating: ", span)
        }
    }
    document.querySelector("html").classList.add("script_loaded")
    console.log("beauty ratings hidden")

})();