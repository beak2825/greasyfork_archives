// ==UserScript==
// @name         115 Cookie登录
// @namespace    115_cookie_login
// @author       Gloduck
// @license MIT
// @version      1.5
// @description  115Cookie登录
// @match        *://*.115.com/*
// @grant        GM_cookie
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/474459/115%20Cookie%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/474459/115%20Cookie%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const requireCookieNames = [
        "UID", "CID", "SEID"
    ];

    const supportCookieNames = [
        "KID"
    ];

    const extCookieNames = [
        "USERSESSIONID", "PHPSESSID"
    ];


    function removeBrowserCookie() {
        requireCookieNames.concat(supportCookieNames).concat(extCookieNames).forEach(value => {
            GM_cookie.delete({name: value}, function (error) {
                if (error) {
                    alert("删除cookie失败，请检查是否支持GM_cookie函数（目前只有beta版支持）")
                }
            });
        });
        setTimeout(function () {
            location.reload();
        }, 1000);
    }

    /**
     * Alter展示Cookie
     */
    function showCookie() {
        // 使用GM_cookie函数获取Cookie
        GM_cookie.list({domain: ".115.com"}, function (cookieInfos, error) {
            if (!error) {
                let cookieOutputs = [];
                cookieInfos.forEach(function (cookieInfo) {
                    if (requireCookieNames.includes(cookieInfo.name) || supportCookieNames.includes(cookieInfo.name)) {
                        cookieOutputs.push(`${cookieInfo.name}=${cookieInfo.value}`);
                    }
                })
                alert(`Cookie信息为：\n---------------------------\n${cookieOutputs.join("\n")}\n---------------------------\n内容已复制到剪切板！`);
                GM_setClipboard(`${cookieOutputs.join(";")};`);
            } else {
                alert("获取cookie失败，请检查是否支持GM_cookie函数（目前只有beta版支持）")
            }
        });
    }

    /**
     * 初始化复制Cookie按钮
     */
    function initCopyCookieButton() {
        let btnGroupDiv = document.querySelector('div.left-tvf[rel="left_tvf"]');
        if (!btnGroupDiv) {
            return;
        }
        // 创建复制 Cookie 按钮
        let copyButton = document.createElement('a');
        copyButton.href = 'javascript:;';
        copyButton.className = 'button btn-line btn-upload';
        copyButton.innerHTML = '<i class="icon-operate ifo-copy"></i><span>复制Cookie</span>';

        // 点击显示Cookie
        copyButton.addEventListener('click', showCookie);

        btnGroupDiv.appendChild(copyButton);
    }

    function initBrowserLogoutButton() {
        let cupBoxDiv = document.querySelector('div.cup-box');
        if (!cupBoxDiv) {
            return;
        }
        let logoutDiv = document.createElement('div');
        logoutDiv.className = 'cup-quit';
        let logoutA = document.createElement('a');
        logoutA.href = 'javascript:;';
        logoutA.innerHTML = '<i class="icon-info ifo-quit"></i><span>浏览器退出</span>';
        logoutDiv.appendChild(logoutA);
        cupBoxDiv.appendChild(logoutDiv);
        logoutA.addEventListener('click', removeBrowserCookie);
    }


    /**
     * 获取Cookie需要的列
     * @param requireFields {Array}
     * @param cookie {string}
     * @returns {Map<any, any>}
     */
    function getRequireFieldFromCookie(requireFields, cookie) {
        let resMap = new Map();
        if (!cookie) {
            return resMap;
        }
        let cookies = cookie.split(";");
        cookies.forEach(function (cookie) {
            if (!cookie) {
                return;
            }
            let kv = cookie.split("=");
            if (kv.length != 2) {
                return;
            }
            let key = kv[0].trim();
            if (requireFields.includes(key)) {
                resMap.set(key, kv[1]);
            }
        })
        return resMap;
    }

    /**
     * Cookie登录
     * @param requireCookieMap {Map}
     * @param validDuration {number}
     */
    function handleCookieLogin(requireCookieMap, validDuration) {
        requireCookieMap.forEach((value, key) => {
            GM_cookie.delete({name: key}, function (error) {
                if (error) {
                    alert(`清除Cookie：[${key}]失败！请检查是否支持GM_cookie函数（目前只有beta版支持）`);
                }
            });
            GM_cookie.set({
                // url: '.115.com',
                name: key,
                value: value,
                domain: '.115.com',
                path: '/',
                secure: false,
                httpOnly: true,
                expirationDate: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * validDuration) // Expires in 30 days
            }, function (error) {
                if (error) {
                    alert(`设置Cookie：[${key}]失败，值为：[${value}]！请检查是否支持GM_cookie函数（目前只有beta版支持）`);
                }
            });
        })
        setTimeout(function () {
            location.reload();
        }, 1000);
    }

    /**
     * 显示Cookie登录的输入框
     */
    function showCookieLoginInputDialog() {
        let inputCookie = prompt('请输入 Cookie：');
        let fetchCookieNames = requireCookieNames.concat(supportCookieNames);
        let fetchCookieMap = getRequireFieldFromCookie(fetchCookieNames, inputCookie);
        let missReqireNames = requireCookieNames.filter(name => !fetchCookieMap.has(name));
        if (missReqireNames.length != 0) {
            alert(`输入的Cookie需包含[${missReqireNames.join(",")}]，请重新输入！`);
            return;
        }
        let missSupportNames = supportCookieNames.filter(name => !fetchCookieMap.has(name));
        if (missSupportNames.length != 0) {
            alert(`输入的Cookie未包含[${missSupportNames.join(",")}]，可能导致无法登陆，如果无法正常跳转，请确认Cookie！`);
        }
        let defaultValidDuration = 30;
        let inputValidDuration = prompt("请输入Cookie有效天数：", defaultValidDuration);
        let validDuration = parseInt(inputValidDuration, 10) || defaultValidDuration;
        handleCookieLogin(fetchCookieMap, validDuration);
    }


    /**
     * 初始化Cookie登录按钮
     */
    function initCookieLoginButton() {
        let loginFooter = document.querySelector('div.login-footer[rel="login_footer"]');
        if (!loginFooter) {
            return;
        }
        // 分隔符
        let splitField = document.createElement('i');
        splitField.textContent = '|';
        // 登录按钮
        let loginSpan = document.createElement('span');
        let loginButton = document.createElement('a');
        loginButton.textContent = '使用 Cookie 登录';
        loginButton.href = 'javascript:;';
        loginButton.addEventListener('click', showCookieLoginInputDialog);
        loginSpan.appendChild(loginButton);
        loginFooter.insertBefore(splitField, loginFooter.firstElementChild);
        loginFooter.insertBefore(loginButton, loginFooter.firstElementChild);
    }


    setTimeout(function () {
        initCookieLoginButton();
    }, 1000);
    // initCookieLoginButton();
    initCopyCookieButton();
    initBrowserLogoutButton();

})();