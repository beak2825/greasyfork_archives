// ==UserScript==
// @name         v2free
// @namespace    https://v2free.org/user
// @version      0.124
// @description  v2free自動點擊簽到。
// @author       You
// @license MIT
// @match        https://v2free.net/user
// @match        https://w1.v2free.top/user
// @match        https://cdn.v2free.top/user
// @match        https://v2free.org/user
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463297/v2free.user.js
// @updateURL https://update.greasyfork.org/scripts/463297/v2free.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //v2free   https://greasyfork.org/zh-CN/scripts/463297-v2free
var count = 0;
    // 在每次定时器周期内，count变量会自增1，并检查是否已经执行了12次。如果是，就使用clearInterval函数取消定时器的运行。
var iId = setInterval(function() {
    count++;
    if (count >= 6) {
        clearInterval(iId);
    }
    // 下面是setInterval函数所要执行的代码

    var btn=document.querySelector('#checkin');
    btn.click();
}, 1000); // 每隔1秒执行一次
 
    // window.setInterval(function (){
    // var btn=document.querySelector('#checkin');
   // var btna=document.querySelector('#recaptcha-anchor');
    // btn.click();
    // },2000); 每隔2秒执行一次

})();




