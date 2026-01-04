// ==UserScript==
// @name         HDPornComics Keyboard Support
// @namespace    http://tampermonkey.net/
// @version      2024-11-22
// @description  Allows to change pages left and right by pressing the keys A/D
// @author       Manu
// @match        https://hdporncomics.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hdporncomics.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518546/HDPornComics%20Keyboard%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/518546/HDPornComics%20Keyboard%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.addEventListener("keypress",(e)=>{
        const btnL = document.querySelector(".pswp__button--arrow--left");
        const btnR = document.querySelector(".pswp__button--arrow--right");
        if(!btnL || !btnR) return;
        switch (e.key) {
            case "a":
                console.log("KEY A PRESSED");
                btnL.click();
                break;
            case "d":
                console.log("KEY D PRESSED");
                btnR.click();
                break;
            default:
                console.log(e.key);
                break;
        }
    })
})();