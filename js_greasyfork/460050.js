// ==UserScript==
// @name         Fuck Wechat or zhihu
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  自动重定向被微信/知乎拦截的链接
// @author       zheng-kun@foxmail.com
// @match        *://weixin110.qq.com/*
// @match        *://link.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460050/Fuck%20Wechat%20or%20zhihu.user.js
// @updateURL https://update.greasyfork.org/scripts/460050/Fuck%20Wechat%20or%20zhihu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //setTimeout(redirect, 1000)
    redirect()

    function getUrl(){
        const targetEl2 = document.querySelector(".weui-msg__desc")
        const targetEl = document.querySelector(".weui-msg .weui-msg__text-area .ui-ellpisis-content p");
        const zhihuLinkEl = document.querySelector(".link")
        const targetText = targetEl?.innerText
        const targetText2 = targetEl2?.innerText
        const zhihuTargetText = zhihuLinkEl?.innerText
        const urlReg = /^(http:|https:)/img;
        if(urlReg.test(targetText)) {
            return targetText
        }else if(urlReg.test(targetText2)) {
            return targetText2
        }else if(urlReg.test(zhihuTargetText)){
            return zhihuTargetText
        }
        return null;
    }

    function redirect() {
        const url = getUrl()
        if(url) { window.location.href = url }
    }
})();