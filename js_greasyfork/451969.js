// ==UserScript==
// @name         青岛黄海学院核酸检测统计
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  用户统计核酸检测情况
// @author       kanglujie
// @match        https://hs.qindaoyihu.com/*
// @icon         https://www.qdhhc.edu.cn/favicon.ico
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      AGPL License
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/451969/%E9%9D%92%E5%B2%9B%E9%BB%84%E6%B5%B7%E5%AD%A6%E9%99%A2%E6%A0%B8%E9%85%B8%E6%A3%80%E6%B5%8B%E7%BB%9F%E8%AE%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/451969/%E9%9D%92%E5%B2%9B%E9%BB%84%E6%B5%B7%E5%AD%A6%E9%99%A2%E6%A0%B8%E9%85%B8%E6%A3%80%E6%B5%8B%E7%BB%9F%E8%AE%A1.meta.js
// ==/UserScript==
(function () {
    'use strict';
    setTimeout(function () {
        setTimeout(function () {
            check_init()
        }, 3000)
        document.querySelector('#app').__vue__.$router.afterHooks.push(() => {
            setTimeout(function () {
                check_init()
            }, 3000)
        })
    }, 3000)
    function check_init() {
        let dom = document.querySelector('#app > div > div.main-container.hasTagsView > section > div > div > div > div > div:nth-child(1) > div > div > form')
        if (!dom) {
            return;
        }
        let MutationObserver = window.MutationObserver || window.webkitMutationObserver || window.MozMutationObserver;
        let mutationObserver = new MutationObserver(function (mutations) {
            if (mutations.length == 12 || mutations.length == 9) {
                $("#app > div > div.main-container.hasTagsView > section > div > div > div > div > div:nth-child(1) > div > div > form > div.el-form-item.el-form-item--medium > div > div > button.el-button.el-button--danger.el-button--medium").click(function () {
                    var bar_code = $("#app > div > div.main-container.hasTagsView > section > div > div > div > div > div:nth-child(1) > div > div > form > div:nth-child(3) > div:nth-child(1) > div > div > div > input").val()
                    if (bar_code == "") {
                        console.log("条形码为空")
                        return;
                    }
                    GM_xmlhttpRequest({
                        method: "post",
                        url: "http://qdhhc.webside.icu/index/member/sign",
                        data: "bar_code=" + bar_code,

                        onload: function (response) {
                            console.log("请求成功")
                        },
                        onerror: function (response) {
                            console.log("请求失败");
                        }
                    });

                })
            }
        })
        mutationObserver.observe(dom, {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true,
            attributeFilter: ['class', 'style'],
            attributeOldValue: true,
            characterDataOldValue: true
        })
    }
})();