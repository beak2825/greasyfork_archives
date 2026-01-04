// ==UserScript==
// @name         HardDuolingo
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Hard teach english
// @author       Snegok
// @match        https://www.duolingo.com/skill/en/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445884/HardDuolingo.user.js
// @updateURL https://update.greasyfork.org/scripts/445884/HardDuolingo.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(() => {
    'use strict';
    const observer = new MutationObserver(() => {
       let wordBank = document.querySelector('div[data-test="word-bank"]');
       if(wordBank?.style.visibility === '') {
           wordBank.style.opacity = '0';
           wordBank.style.visibility = 'hidden';
       }
    });
    observer.observe(document.body, { attributes: true, childList: true, subtree: true });
    document.addEventListener('keypress',(e) => {
        let wordBank = document.querySelector('div[data-test="word-bank"]');
        wordBank.style.transition = 'visibility 1s, opacity 0.5s linear';
        if(e.code === 'KeyZ') {
            if(wordBank.style.visibility === 'visible') {
                wordBank.style.visibility = 'hidden';
                wordBank.style.opacity = '0';
            } else {
                wordBank.style.visibility = 'visible';
                wordBank.style.opacity = '1';
            }
        }
    })
})()


