// ==UserScript==
// @name         BrainScape Unblur
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unlock Brainscape Answers
// @author       Skippy
// @match        https://www.brainscape.com/flashcards/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=brainscape.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446830/BrainScape%20Unblur.user.js
// @updateURL https://update.greasyfork.org/scripts/446830/BrainScape%20Unblur.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const elements = document.getElementsByClassName('card-face-overlay');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    const el = document.getElementsByClassName('card-answer-text');
    for (let i = 0; i < el.length; i++){
    el[i].style.color='black'
    el[i].style.textShadow='0 0 black'
    }
})();