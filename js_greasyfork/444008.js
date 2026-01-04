// ==UserScript==
// @name         MEST Login
// @namespace    joyings.com.cn
// @version      1.1.7
// @description  美尔斯通自动登录
// @author       zmz125000
// @match       http://*/mest/?autologin=1*
// @icon          http://www.google.com/s2/favicons?domain=openwrt.org
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/444008/MEST%20Login.user.js
// @updateURL https://update.greasyfork.org/scripts/444008/MEST%20Login.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Your code here...
    function waitForElm(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(mutations => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }

    document.cookie.split(";").forEach(function (c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    // localStorage.clear();
    (async function () {
        while (!document.querySelector('[placeholder="用户名"]')) {
            await sleep(200);
        }
        var url = new URL(window.location.href);
        var username = url.searchParams.get("username");
        var password = url.searchParams.get("password");
        var scd = url.searchParams.get("scd");
        document.querySelector('[placeholder="用户名"]').value = username;
        document.querySelector('[placeholder="用户名"]').dispatchEvent(new Event("input", {
            bubbles: true
        }));
        document.querySelector('[placeholder="密码"]').value = password;
        document.querySelector('[placeholder="密码"]').dispatchEvent(new Event("input", {
            bubbles: true
        }));

        if ($('span:contains("记住账户")')[0]) {
            $('span:contains("记住账户")')[0].click();
        }

        async function checkList() {
            if (document.querySelector('.el-select-dropdown__item') == null) {
                document.querySelector('[placeholder="用户名"]').focus();
                document.querySelector('[placeholder="用户名"]').click();
                await sleep(200);
                document.querySelector('.el-select').click();
                checkList();
            } else {
                document.querySelector('.el-select-dropdown__item').click();
            }
        }
        checkList();
        await sleep(200);

        async function checkFlag() {
            if ($('input[placeholder="请选择账套"]')[0] && $('input[placeholder="请选择账套"]')[0].hasAttribute("readonly") && !$('button:contains("登录")')[0].hasAttribute("disabled")) {
                $('button:contains("登录")')[0].click();
            } else {
                await sleep(500);
                checkFlag();
                return;
            }
            if (document.querySelector('[placeholder="用户名"]')) {
                await sleep(2000);
                checkFlag();
                return;
            }
        }
        checkFlag();
        history.pushState(null, "", location.href.split("?")[0]);

    })();
})();