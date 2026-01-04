// ==UserScript==
// @name         Jisho kun/on switch
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Switches the position of the kunyomi and onyomi readings to match that of anki droid.
// @author       You
// @match        https://jisho.org/*
// @icon         https://shimox.s-ul.eu/RKGXemM1
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444467/Jisho%20kunon%20switch.user.js
// @updateURL https://update.greasyfork.org/scripts/444467/Jisho%20kunon%20switch.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener("load", () => {
        let kun = document.querySelector(".kun")
        let on = document.querySelector(".on")

        if(kun){
            kun.style.transform = `translate(0, ${on.clientHeight}px)`;
            on.style.transform = `translate(0, -${kun.clientHeight}px)`;
        }
    }, false)
})();