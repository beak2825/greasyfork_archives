// ==UserScript==
// @name         voscreen keyboard
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  best way to practise English.
// @author       You
// @match        https://www.voscreen.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/426880/voscreen%20keyboard.user.js
// @updateURL https://update.greasyfork.org/scripts/426880/voscreen%20keyboard.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //添加键盘事件
    document.body.addEventListener('keydown',event => {
        var sub = document.querySelector(".c-player-subtitle-question")
        var a = document.querySelectorAll("div.c-player-answer.o-player__answer")  
        var d = document.querySelector('.c-player-next.o-player__next')
        var r = document.querySelector('.c-player-play.o-player__play')
        var v = document.querySelector('.o-player__like-container')

        switch (event.key){

            case 'e':
                sub.click()
                break;
            case 'a':
                a[0].click();
                break;    
            case 's':
                a[1].click();
                break;    
            case 'd':
                d.click();
                break;
            case 'r':
                r.click();
                break;  
            case 'v':
                v.click();
                break;      
        }
    }
    )


})();