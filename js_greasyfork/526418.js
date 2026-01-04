// ==UserScript==
// @name         Fubon more | Home - Set 5 minutes to jump to events page
// @name:zh-TW   富邦幸福 more | 首頁 - 自動跳轉到任務總覽
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Set 5 minutes to jump to events page.
// @description:zh-TW  5 分鐘後自動跳轉到任務總覽
// @icon         https://fmo.fubonlife.com.tw/favicon.ico
// @author       yijiun
// @match        https://fmo.fubonlife.com.tw/*
// @grant        none
// @license      BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/526418/Fubon%20more%20%7C%20Home%20-%20Set%205%20minutes%20to%20jump%20to%20events%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/526418/Fubon%20more%20%7C%20Home%20-%20Set%205%20minutes%20to%20jump%20to%20events%20page.meta.js
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
    // 設定 5 分鐘 (300,000 毫秒) 後跳轉到指定網址
    setTimeout(function() {
        window.location.href = 'https://fmo.fubonlife.com.tw/events/all';
    }, 300000);
})();
