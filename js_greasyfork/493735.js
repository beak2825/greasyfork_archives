// ==UserScript==
// @name         fc2live auto browser fit
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  custom fc2
// @author       You
// @match        https://live.fc2.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=fc2.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493735/fc2live%20auto%20browser%20fit.user.js
// @updateURL https://update.greasyfork.org/scripts/493735/fc2live%20auto%20browser%20fit.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("UserScript test");
    setTimeout(()=> {
        // 自動ブラウザフィット
        let btnBrowserFit = document.querySelector("#js-videoControlsBox > div.c-controls > div.c-controls_right > div:nth-child(9) > div > div > ul > li.js-resizePlayerBtn_fit > span");
        if (btnBrowserFit) {
            btnBrowserFit.click();
        }
        // 自動ログイン
        let btnLogin = document.querySelector("body > div > div.m-hder-ni.js-head > div > div.m-hder01_in-tp > div > div > div:nth-child(1) > a");
        if (btnLogin) {
            if (btnLogin.textContent == "ログイン") {
                btnLogin.click();
            }
        }
        // ログインページは履歴に残さない
        if (window.location.pathname == "/login/") {
            history.replaceState(null, null, "/");
        }
    }, 1000);

    // Your code here...
})();