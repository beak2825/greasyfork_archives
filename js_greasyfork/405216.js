// ==UserScript==
// @name         SCUT iam ok auto click
// @name:zh-TW   華南理工報平安自動點擊
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  For scut iam ok auto click
// @description:zh-TW  華南理工 iam ok 保平安自動點擊
// @author       A scut student
// @match        *://iamok.scut.edu.cn/iamok/web/mobile/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405216/SCUT%20iam%20ok%20auto%20click.user.js
// @updateURL https://update.greasyfork.org/scripts/405216/SCUT%20iam%20ok%20auto%20click.meta.js
// ==/UserScript==
var delayInMilliseconds = 200;
var waitInMili = 5000;
(function () {
    'use strict';
console.warn("scut iam ok start")

  setTimeout(function(){clickConfirm();}, waitInMili);
  //setInterval(clickConfirm,delayInMilliseconds);
  
})();

function clickConfirm() {
    'use strict';
    var elements2 = document.getElementsByClassName("btn");
console.warn(elements2.length);
    for(var i = 0; i < elements2.length; i++) {
        try {
            var element = elements2[i];
 console.warn(element.innerHTML);


            if(element.innerHTML == " 一切安好，一键上报 ") {
                element.click();
                console.warn("clicked!");
                break;
            }
        }
        catch(e){}
    }
}