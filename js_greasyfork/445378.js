// ==UserScript==
// @name         Typeracer Make Unselectable Text Selectable
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  better Typeracer
// @author       Renne
// @license      GPL-3.0
// @match        https://play.typeracer.com/*
// @icon         https://www.google.com/s2/favicons?domain=typeracer.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445378/Typeracer%20Make%20Unselectable%20Text%20Selectable.user.js
// @updateURL https://update.greasyfork.org/scripts/445378/Typeracer%20Make%20Unselectable%20Text%20Selectable.meta.js
// ==/UserScript==

// ==UserScript==
// @name         Typeracer Make Unselectable Text Selectable
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  better Typeracer
// @author       Renne
// @license      GPL-3.0
// @match        https://play.typeracer.com/*
// @icon         https://www.google.com/s2/favicons?domain=typeracer.com
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @grant        none
// ==/UserScript==

(function() {

    var interval = setInterval(function() {
            document.querySelector("#userInfo > div > div.profilePicContainer > img").src=image_link
            var text1 = document.querySelector("#gwt-uid-259 > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div > span.TASMWRGW")
            var text2 = document.querySelector("#gwt-uid-259 > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(1) > td > div > div > span:nth-child(2)")
                text1.unselectable=off
                text2.unselectable=off
    }, 100)
    document.addEventListener('keydown', (e) => {
    if (e.code == 'Tab') {
        let leaveBtn = document.querySelector('[title="Keyboard shortcut: Ctrl+Alt+K"]');
        let startBtn = document.querySelector('[title="Keyboard shortcut: Ctrl+Alt+O"]');
        if (leaveBtn == null) {
            startBtn.click();
        } else {
            leaveBtn.click();
        }
    };
})})();