// ==UserScript==
// @name         Sonkwo-AutoCheckin
// @namespace    https://www.sonkwo.cn/
// @license      WTFPL
// @description  Auto Checkin Script for Sonkwo
// @version      0.0.2
// @author       Hiiro
// @match        https://www.sonkwo.cn/
// @match        https://limestart.cn/
// @icon         https://www.sonkwo.cn/favicon.ico
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/486321/Sonkwo-AutoCheckin.user.js
// @updateURL https://update.greasyfork.org/scripts/486321/Sonkwo-AutoCheckin.meta.js
// ==/UserScript==


(function () {
    'use strict';
    GM_registerMenuCommand('清除本地存储', removeDateStore)
    const isSonkwoPage = (window.location.href.toString().indexOf('https://www.sonkwo.cn/') != -1)
    const date = new Date().getDate()
    function SetDateStore() {
        localStorage.setItem('SONKWO-SCRIPT-LAST-RUN', date)
    }
    function CompareDateStore() {
        return localStorage.getItem('SONKWO-SCRIPT-LAST-RUN') == date
    }
    function removeDateStore() {
        localStorage.removeItem('SONKWO-SCRIPT-LAST-RUN')
        document.location.reload()
        DetectAndRun()
    }
    function DoCheckin() {
        document.getElementsByClassName('orange')[0].click()
    }
    function isCookieExists(name) {
        // 获取当前页面的所有cookies组成的字符串
        var cookies = document.cookie.split('; ');

        for (var i = 0; i < cookies.length; i++) {
            // 分割每个cookie为键和值
            var cookiePair = cookies[i].split('=');

            // 清除键名前后的空白字符并转换为小写（因为cookie名称是大小写敏感的）
            var cookieName = cookiePair[0].trim().toLowerCase();

            // 如果找到匹配的cookie名称，则返回true
            if (cookieName === name.toLowerCase()) {
                return true;
            }
        }

        // 如果遍历完所有cookie都未找到匹配项，则返回false
        return false;
    }
    function DetectAndRun() {
        if (CompareDateStore()) {
            return
        }
        if (!isSonkwoPage) {
            SetDateStore()
            window.location.href = 'https://www.sonkwo.cn/'
        }
        var timer = setInterval(() => {
            if (!isCookieExists('access_token')) {
                window.location.href = 'https://www.sonkwo.cn/sign_in?return_addr=%2F'
                clearInterval(timer)
            } else if (document.getElementsByClassName('orange').length != 0) {
                if (document.getElementsByClassName('orange')[0].innerHTML == '签到赚积分') {
                    DoCheckin()
                    SetDateStore()
                    clearInterval(timer)
                } else if (document.getElementsByClassName('light-gray')[0]?.innerHTML == '已签到') {
                    SetDateStore()
                    clearInterval(timer)
                }
            }
        }, 3000)
    }
    window.onload = function () {
        DetectAndRun()
    }
})();
