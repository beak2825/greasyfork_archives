// ==UserScript==
// @name         komga webreader滚轮控制
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  komga webreader 添加滚轮控制
// @author       AKMT77
// @license      MIT
// @match        *://*/book/*/read*
// @match        *://*:*/book/*/read*
// @icon         https://www.google.com/s2/favicons
// @homepage     
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525937/komga%20webreader%E6%BB%9A%E8%BD%AE%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/525937/komga%20webreader%E6%BB%9A%E8%BD%AE%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("komga webreader wheel controller init");

    document.body.addEventListener("wheel", (e) => {
        //console.log("滚轮");
        let deltaY = e.deltaY;
        let isDown = deltaY > 0;
        let left = document.querySelector(".left-quarter");
        let right = document.querySelector(".right-quarter");
        if (isDown) {
            right.click();
        } else {
            left.click();
        }


    });

})();