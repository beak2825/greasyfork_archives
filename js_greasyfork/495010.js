// ==UserScript==
// @name         Remove siemens login
// @namespace    http://tampermonkey.net/
// @version      0.0.2
// @description  Remove siemens login, 自己学着编的, 不一定稳定, 如果不成功可以适当调整延时时间
// @author       MJZXIN
// @license      MIT
// @match        *://www.ad.siemens.com.cn/service/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=siemens.com.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/495010/Remove%20siemens%20login.user.js
// @updateURL https://update.greasyfork.org/scripts/495010/Remove%20siemens%20login.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            let html_raw = document.getElementsByTagName("html")[0];
            try {
                html_raw.style.removeProperty("overflow");

                document.getElementById("divMaskingOutLoginTip").style.display = 'none';
            } catch {
                return
            }
        }, 750)
    })

})();