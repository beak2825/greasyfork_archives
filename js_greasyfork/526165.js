// ==UserScript==
// @name         Learning Go 下載工具
// @namespace    http://tampermonkey.net/
// @version      2025-02-08
// @description  Try
// @author       hchou
// @match        https://learninggo.com.tw/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=learninggo.com.tw
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/526165/Learning%20Go%20%E4%B8%8B%E8%BC%89%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/526165/Learning%20Go%20%E4%B8%8B%E8%BC%89%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const video1 = document.getElementById("my-player");
    const source = video1.querySelector("source").src.replace("_720P", "");


    var html = `<div style="margin-top: 30px"><video src="${source}" style="width: 50px;"></video>下載影片：左邊小圖按「右鍵」「另存影片」</div>`;
    const container = document.querySelector(".video-container");
    container.insertAdjacentHTML("beforeend", html);

})();