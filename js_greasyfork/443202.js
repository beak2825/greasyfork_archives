// ==UserScript==
// @name         自动登录+跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  121.40.105.93:8070自动登录和跳转
// @author       You
// @match        http://121.40.105.93:8070/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=105.93
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443202/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%2B%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/443202/%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%2B%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

window.onload = (function () {
    let me_t = setInterval(function () {
        urlL = location.href
        if (urlL === 'http://121.40.105.93:8070/Account/Login') {
            try {
                document.querySelector('#LoginName').value = '王贞丰';
                document.querySelector('#Password').value = '123456';
                document.querySelector('.login-button').click();
            } catch (error) {
                location.reload;

            }
        } else if (urlL === 'http://121.40.105.93:8070/Home/Index') {
            try {
                let ifr = document.querySelectorAll("iframe")[1].contentWindow
                let tag = ifr.document.querySelector(".head_tit").tag.textContent
                if (tag === 'PC构件企业 信息化管理系统 - 实时生产监控看板') {
                    clearInterval(me_t)
                }
            } catch (error) {
                document.querySelector("#_easyui_tree_2").click()
                clearInterval(me_t)
            }
        }
    }, 1000);
})

