// ==UserScript==
// @name         Hotkeys for e621 navigation
// @version      1.0
// @description  Add navigation hotkeys for e621.net
// @author       CodeFox
// @match        https://e621.net/*
// @grant        none
// @run-at       document-idle
// @license MIT
// @namespace https://greasyfork.org/users/1015085
// @downloadURL https://update.greasyfork.org/scripts/477479/Hotkeys%20for%20e621%20navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/477479/Hotkeys%20for%20e621%20navigation.meta.js
// ==/UserScript==

document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowRight') {
        var nextBtn = document.querySelector("[class*='next']");
        if (nextBtn) {
          	console.log("Going to next page");
            nextBtn.click();
        }
    }
    if (event.code === 'ArrowLeft') {
        var prevBtn = document.querySelector("[class*='prev']");
        if (prevBtn) {
            prevBtn.click();
        }
    }
}, true);