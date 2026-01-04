// ==UserScript==
// @name         Fubon more | Events - Auto Refresh Page and Auto Click Button
// @name:zh-TW   富邦幸福 more | 任務總覽 - 自動重新整理及簽到
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatic page refresh every 2 minutes and automatic check-in at 6am
// @description:zh-TW  每 2 分鐘自動重新整理頁面，並在早上 6 點時自動簽到
// @icon         https://fmo.fubonlife.com.tw/favicon.ico
// @author       yijiun
// @match        https://fmo.fubonlife.com.tw/events/all
// @grant        none
// @license      BSD-3-Clause
// @downloadURL https://update.greasyfork.org/scripts/514291/Fubon%20more%20%7C%20Events%20-%20Auto%20Refresh%20Page%20and%20Auto%20Click%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/514291/Fubon%20more%20%7C%20Events%20-%20Auto%20Refresh%20Page%20and%20Auto%20Click%20Button.meta.js
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

    const refreshInterval = 120000; // 2 分鐘

    setTimeout(() => {
        location.reload();
    }, refreshInterval);

    function autoClickButton() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();

        // 早上 6 點時自動簽到
        if (hours === 6 && minutes === 0) {
            const targetButton = document.querySelector('div.absolute.md\\:relative.md\\:pl-2\\.5.-bottom-5.md\\:-bottom-1.md\\:flex.items-end.right-0.shrink-0 > button.btn-primary.btn.rounded-full.text-base.font-normal.text-white.btn-sm.min-w-\\[3\\.75rem\\].text-sm.md\\:h-\\[2\\.5rem\\].md\\:text-base');

            if (targetButton) {
                targetButton.click();
                console.log("目標按鈕已於 6 點自動點擊！");
            } else {
                console.log("找不到目標按鈕。");
            }
        }
    }

    // 每 30 秒檢查一次是否需要簽到
    setInterval(autoClickButton, 60000); // 30 秒
})();
