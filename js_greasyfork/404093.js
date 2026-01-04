// ==UserScript==
// @name         Voscreen Keyboard Shortcut
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Shortcut keys for common operations in Voscreen.com
// @author       Vidocq
// @match        http*://www.voscreen.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404093/Voscreen%20Keyboard%20Shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/404093/Voscreen%20Keyboard%20Shortcut.meta.js
// ==/UserScript==

function getClass(key){
    //1 for first button
    //2 for second button
    //3 for next question
    //4 for replay
    var elements;
    console.log(key);
    if (key === 1){
        elements = document.getElementsByClassName('c-player-subtitle-question o-player__subtitle-question');
        if (elements.length !== 0) elements[0].click();
        else{
            elements = document.getElementsByClassName('c-player-answer o-player__answer');
            elements[0].click();
        }
    }
    if (key === 2){
        elements = document.getElementsByClassName('c-player-subtitle-question o-player__subtitle-question');
        if (elements.length !== 0) elements[1].click();
        else {
            elements = document.getElementsByClassName('c-player-answer o-player__answer');
            elements[1].click();
        }
    }
    if (key === 3){
        elements = document.getElementsByClassName('c-player-next o-player__next');
        if (elements.length !== 0) elements[0].click();
    }
    if (key === 4){
        elements = document.getElementsByClassName('c-player-play o-player__play');
        if (elements.length !== 0) elements[0].click();
    }
}
(function() {
    window.addEventListener('keydown',event=>{
        if (event.keyCode === 49) getClass(1);
        if (event.keyCode === 50) getClass(2);
        if (event.keyCode === 70) getClass(3);
        if (event.keyCode === 82) getClass(4);
    })
})()