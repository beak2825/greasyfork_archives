// ==UserScript==
// @name         Huo
// @namespace    http://tampermonkey.net/
// @version      0.2.9
// @description  auto check member balance.
// @author       Qiu
// @license      MIT
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466633/Huo.user.js
// @updateURL https://update.greasyfork.org/scripts/466633/Huo.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (/gc.tf-api-\w+.com/.test(location.host)) {
        setInterval(huoCheck, 60000);
        setInterval(reload, 5 * 60000);
    }
    if (window.apiDomainList && window.apiDomainList.length === 2) {
        setInterval(pmCheck, 60000);
        setInterval(reload, 5 * 60000);
    }

    if (sessionStorage.getItem('SelectedGameCategory') || sessionStorage.getItem('SelectedProduct')) {
        setInterval(reload, 5 * 60000);
    }

    if (/ps3838.com/.test(location.host)) {
        setInterval(autoLoginByPs, 5 * 60000);
    }

    if (/mos011.com/.test(location.host) || /hga\d+.com/.test(location.host) || /[\d\.]+/.test(location.host)) {
        setInterval(autoLoginByFr, 30 * 1000);
    }
    function huoCheck() {
        try {
            var config = sessionStorage.getItem('vuex');
            if (config) {
                config = JSON.parse(config);
                var settings = config.settings.settings;
                if (!settings.token) return;
                fetch(
                    `${settings.priBaseUrl}game-client/v4/wallet/`,
                    {
                        "headers": {
                            "accept": "application/json, text/plain, */*",
                            "q-xxid": `${settings.memberCode}`,
                            "authorization": `Token ${settings.token}`
                        },
                        "referrer": `https://${settings.parentUrl}/events`,
                        "body": null,
                        "method": "GET",
                    }
                );
            } else {
                console.log('user login expried')
            }
        } catch (e) {
            console.error(e);
        }
    }

    function pmCheck() {
        try {
            if (window.APP_BASE_URL && localStorage.getItem('vuex')) {
                fetch(
                    `${window.APP_BASE_URL}/game/balance`,
                    {
                        "headers": {
                            "accept": "application/json, text/plain, */*",
                            "token": JSON.parse(localStorage.getItem('vuex')).user.token
                        },
                        "referrer": location.href,
                        "referrerPolicy": "no-referrer-when-downgrade",
                        "body": null,
                        "method": "GET"
                    }
                );
            }
        } catch (e) {
        }
    }

    function reload() {
        location.reload();
    }

    function autoLoginByPs() {
        // 没有发现登录页面，刷新页面并返回
        if (!document.querySelector(".LoginComponent button.btn-primary")) {
            reload();
            return;
        }
        const account = localStorage.getItem('huo_account');
        const password = localStorage.getItem('huo_password');
        if (!account || !password) {
            alert('账号密码没有配置，不能自动登录');
        }

        document.querySelector(".LoginComponent input#loginId").value = account;
        document.querySelector(".LoginComponent input#pass").value = password;
        document.querySelector(".LoginComponent button.btn-primary").click();
    }

    function autoLoginByFr() {
        // 防止被alert弹窗block
        if (document.querySelector('#C_alert_confirm.on')) {
            document.querySelector('#C_alert_confirm #C_no_btn').click()
        }
        // # 账号被踢
        if (document.querySelector('#alert_kick.on.popup_kick') || !top['userData'].uid) {
            const account = localStorage.getItem('huo_account');
            const password = localStorage.getItem('huo_passwrod');
            if (!account || !password) {
                alert('账号密码没有配置，不能自动登录');
            }

            document.querySelector("input#usr").value = account;
            document.querySelector("input#pwd").value = password;
            document.querySelector("input#btn_login").click();
        }
    }
})();