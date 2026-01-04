// ==UserScript==
// @name         web被拦截链接自动跳转
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  PC上使用浏览器点开微信链接，在提示非微信官方链接页面自动打开对应的链接，增加，微信，掘金，csdn等
// @author       huapeng222
// @match        https://weixin110.qq.com/*
// @match        https://link.juejin.cn/*
// @match        https://link.csdn.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466628/web%E8%A2%AB%E6%8B%A6%E6%88%AA%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/466628/web%E8%A2%AB%E6%8B%A6%E6%88%AA%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 微信
    function winxin() {
        if (document.location.hostname !== "weixin110.qq.com") {
            return
        }
        const wechatTargets = document.getElementsByClassName("weui-msg__desc")
        let isWechatLink = false;
        let linkUrl = ""
        if (wechatTargets && wechatTargets.length > 0) {
            for (let i = 0; i< wechatTargets.length ;i++ ) {
                const e = wechatTargets[i];
                if (e.className === "ui-ellpisis weui-msg__desc") {
                    linkUrl = e.textContent;
                }
                if (e.textContent.indexOf("非微信官方网页") >= 0) {
                    isWechatLink = true;
                    break;
                }
                if (e.className === 'weui-msg__desc') {
                    // 抖音类地址
                    linkUrl = e.textContent;
                    isWechatLink = true;
                }
            }
        }
        if (isWechatLink) {
            window.location.href = linkUrl;
        }
    }
    // 掘金
    function juejin() {
        if (document.location.hostname !== "link.juejin.cn") {
            return
        }
        const url = new URL(document.location.href)
        const linkUrl = url.searchParams.get("target")
        if (linkUrl && linkUrl.length > 0) {
            window.location.href = linkUrl;
        }
    }
    // csdn,https://link.csdn.net/
    function csdn() {
        if (document.location.hostname !== "link.csdn.net") {
            return
        }
        const url = new URL(document.location.href)
        const linkUrl = url.searchParams.get("target")
        if (linkUrl && linkUrl.length > 0) {
            window.location.href = linkUrl;
        }
    }
    winxin()
    juejin()
    csdn()
})();