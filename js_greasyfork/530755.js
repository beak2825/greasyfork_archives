// ==UserScript==
// @name         Hotkeys for next page/previous page on christmas.musetechnical.com
// @version      1.0
// @description  Add navigation hotkeys for catalogue archive
// @author       CodeFox
// @namespace    https://github.com/ChristopherLeitner
// @match        https://christmas.musetechnical.com/*
// @grant        none
// @license MIT
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/530755/Hotkeys%20for%20next%20pageprevious%20page%20on%20christmasmusetechnicalcom.user.js
// @updateURL https://update.greasyfork.org/scripts/530755/Hotkeys%20for%20next%20pageprevious%20page%20on%20christmasmusetechnicalcom.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowRight') {
        var nextBtn = document.querySelector("#btnNextPage");
        if (nextBtn) {
          	console.log("Going to next page");
            nextBtn.click();
        }
    }
    if (event.code === 'ArrowLeft') {
        var prevBtn = document.querySelector("#btnPrevPage");
        if (prevBtn) {
            prevBtn.click();
        }
    }
}, true);