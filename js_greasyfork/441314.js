// ==UserScript==
// @name         Manamah`s Group highlighter
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  highlights Group
// @author       Manamah
// @match        https://my.livechatinc.com/*
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441314/Manamah%60s%20Group%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/441314/Manamah%60s%20Group%20highlighter.meta.js
// ==/UserScript==
(async function() {
    'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    for (;;) {
        await sleep(10)

        let headerSelector = ".css-mw56rr" // из какого блока
        let textSelector = ".css-1caczvn.css-1sbvcrk0" //из какой строки
        let colorSelector = ".css-yyvg9d" //где меняем цвет

        let textElem = document.querySelector(textSelector)
        let colorElem = document.querySelector(colorSelector)

        if(colorElem && textElem){
            if(textElem.innerText == "FRESH Casino"){
                colorElem.style.backgroundColor = '#6ea600'}

            if(textElem.innerText == "VULCAN Casino" || textElem.innerText == "VOLNA Casino"){
                colorElem.style.backgroundColor = '#95c1d5' }

            if(textElem.innerText == "SOL Casino"){
                colorElem.style.backgroundColor = '#d68229'}

            if(textElem.innerText == "ROX Casino"){
                colorElem.style.backgroundColor = '#f1ca8d'}
        }
    }
})
();