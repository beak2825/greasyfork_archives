// ==UserScript==
// @name         Manamah`s online call highlighter
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  highlights element
// @author       Manamah
// @match        https://my.livechatinc.com/*
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435233/Manamah%60s%20online%20call%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/435233/Manamah%60s%20online%20call%20highlighter.meta.js
// ==/UserScript==
(async function() {
'use strict';
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

for (;;) {
 await sleep(10)

     let headerSelector = ".css-xskz6u"
     let textSelector = ".answer span"
     let triggerTextRus = "Онлайн-звонок"
     let triggerTextEng = "Online call"
     let bgColor = '#D64646' //Цвет подсветки

     let textElem = document.querySelector(textSelector)
     let callElem = document.querySelector(headerSelector)

     if(callElem && textElem){
        if(textElem.innerText == triggerTextRus || textElem.innerText == triggerTextEng){
            callElem.style.backgroundColor = bgColor
          }
        }
}
    })
();