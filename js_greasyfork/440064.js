// ==UserScript==
// @name         Online call highlighter
// @namespace    http://tishka.xyz/
// @version      2.0
// @description  highlights element[also english]
// @author       Tishka
// @match        https://my.livechatinc.com/*
// @icon         https://www.google.com/s2/favicons?domain=mozilla.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440064/Online%20call%20highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/440064/Online%20call%20highlighter.meta.js
// ==/UserScript==

(async function() {

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    'use strict';
for (;;) {
 await sleep(10)

     let headerSelector = ".css-3wctr9";
     let textSelector = ".answer span";
     let triggerText = "Онлайн-звонок";
	 let triggerTextEn = "Online call";
     let bgColor = '#D64646' //Цвет подсветки;

     let textElem = document.querySelector(textSelector);
     let callElem = document.querySelector(headerSelector);

     if(callElem && textElem){
        if(textElem.innerText == triggerText || textElem.innerText == triggerTextEn){
            callElem.style.backgroundColor = bgColor;
          }
        }
}
    })
();