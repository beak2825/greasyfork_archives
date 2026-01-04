// ==UserScript==
// @name         Taipower Captcha Unlocker
// @namespace    https://greasyfork.org/users/abc0922001
// @version      1.0.0
// @description  自動解鎖「台電停電查詢」頁面的驗證碼輸入框，省去先查詢失敗的步驟。
// @author       abc0922001
// @match        https://service.taipower.com.tw/nds/ndsWeb/ndft112.aspx*
// @icon         https://service.taipower.com.tw/nds/ndsWeb/images/TaipowerLogo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542030/Taipower%20Captcha%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/542030/Taipower%20Captcha%20Unlocker.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const custNoInput  = document.getElementById('TextBox_CustNo');
    const captchaInput = document.getElementById('TextBox_Captcha');

    if (!custNoInput || !captchaInput) { return; }

    /** 判斷電號輸入長度滿 11 碼就解鎖驗證碼欄位 */
    const unlock = () => {
        captchaInput.disabled = custNoInput.value.trim().length < 11;
    };

    /* 支援手打、貼上、表單自動填 */
    custNoInput.addEventListener('input', unlock);
    window.addEventListener('load', unlock);
})();
