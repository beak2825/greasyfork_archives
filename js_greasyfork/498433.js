// ==UserScript==
// @name         学习公社
// @namespace    http://tampermonkey.net/
// @version      2024-06-20
// @description  个人学习专用
// @author       You
// @match        https://study.enaea.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=enaea.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498433/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/498433/%E5%AD%A6%E4%B9%A0%E5%85%AC%E7%A4%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var log = function(...args){
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const formattedDateTime = `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
        console.log(formattedDateTime, ...args);
    };
    var interval = 1000;

    function main(){
        log("油猴脚本加载...");
        function click(){
            log("click...");
            // 继续学习
            var btn_study = document.querySelector("#rest_tip > table > tbody > tr:nth-child(2) > td.td-content > div.dialog-button-container > button");
            if (btn_study) {
                btn_study.click();
                log("btn_study", btn_study);
            }
        }
        var intervalID = setInterval(click, interval);
    }
    if (document.readyState === "complete") {
        // DOM 已经加载完成
        main();
    } else {
        // DOM 还未加载完成
        window.onload = main;
    }
})();