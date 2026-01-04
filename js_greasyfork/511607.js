// ==UserScript==
// @name         StreetVoice - Dark Mode Applies Instantly
// @name:zh-TW   StreetVoice 街聲 - 即時套用深色模式
// @name:zh-CN   StreetVoice 街聲 - 即时套用深色模式
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Apply dark mode to StreetVoice instantly, even when you are not logged in
// @description:zh-TW  即時在 StreetVoice 套用深色模式，亦可適用於未登入的狀態
// @description:zh-CN  即时在 StreetVoice 套用深色模式，亦可适用于未登入的状态
// @icon         https://akstatic.streetvoice.com/asset/images/ico/favicon.ico?v=20210901
// @author       yijiun
// @match        https://streetvoice.com/*
// @grant        none
// @license      BSD-3-Clause

// @downloadURL https://update.greasyfork.org/scripts/511607/StreetVoice%20-%20Dark%20Mode%20Applies%20Instantly.user.js
// @updateURL https://update.greasyfork.org/scripts/511607/StreetVoice%20-%20Dark%20Mode%20Applies%20Instantly.meta.js
// ==/UserScript==

/*
Copyright (c) 2024 yijiun, All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

(function() {
    'use strict';

    // 動態插入深色模式樣式表
    function applyDarkModeCss(isDarkMode) {
        // 確保樣式表只被插入一次
        let linkElement = document.getElementById("js-css");
        if (!linkElement) {
            linkElement = document.createElement("link");
            linkElement.id = "js-css";
            linkElement.rel = "stylesheet";
            document.head.appendChild(linkElement);
        }

        // 更新樣式表的 href 連結，選擇深色或亮色
        linkElement.href = isDarkMode
            ? "https://akstatic.streetvoice.com/asset/style/bootstrap-dark.css?v=20240913"
            : "https://akstatic.streetvoice.com/asset/style/bootstrap.css?v=20240913";

        // 更新深色模式狀態顯示
        const darkModeText = document.querySelector(".js-dark-mode");
        if (darkModeText) {
            darkModeText.textContent = isDarkMode ? "深色模式：開啟" : "深色模式：關閉";
            darkModeText.dataset.darkMode = isDarkMode ? "1" : "0";
        }
    }

    // 設置或檢查 cookie，並應用深色模式
    function enableDarkMode() {
        const darkModeCookie = document.cookie.match(/dark_css=([^;]+)/);
        const isDarkMode = darkModeCookie ? darkModeCookie[1] === '1' : false;

        // 如果尚未設定深色模式，則設置 cookie 並立即啟用深色模式
        if (!darkModeCookie || darkModeCookie[1] !== '1') {
            document.cookie = "dark_css=1;path=/"; // 設置 cookie
            applyDarkModeCss(true); // 立即應用深色模式
        } else {
            applyDarkModeCss(isDarkMode); // 檢查 cookie 並應用相應模式
        }
    }

    // 執行深色模式邏輯
    enableDarkMode();
})();
