// ==UserScript==
// @name         Modern States Speed Options
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Additional Speed options for modern states courses
// @author       Mitchell Sharma
// @match        https://courses.modernstates.org/courses/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457152/Modern%20States%20Speed%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/457152/Modern%20States%20Speed%20Options.meta.js
// ==/UserScript==

function addOptions(){
    let menu = document.querySelector('.video-speeds,.menu');
    let speedOptions = ["1.75", "2.00", "2.25", "2.50"];
    for (let i = 0; i < 4; i++){
        let newOptionDiv = `<li data-speed="${speedOptions[i]}"><button class="control speed-option" tabindex="-1" aria-pressed="false">${speedOptions[i]}x</button></li>`
        menu.insertAdjacentHTML("afterbegin",newOptionDiv);
    }
}

(function main() {
    addOptions(); // Add options on initial load
    var target = document.querySelector('head > title');
    var observer = new MutationObserver(function(mutations) { // listen for page change (based on page title)
        addOptions(); // add options again on page change
    });
    observer.observe(target, { subtree: true, characterData: true, childList: true });
}
)();