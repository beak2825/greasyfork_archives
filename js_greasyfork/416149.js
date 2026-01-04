// ==UserScript==
// @name         Bypass taobao overseas block(绕过淘宝屏蔽海外用户)
// @description  当访问禁止出口的淘宝商品时，取消自动跳转
// @icon         https://img.alicdn.com/favicon.ico
// @version      0.2.1
// @author       foomango
// @match        *item.taobao.com/*
// @match        *detail.tmall.com/*
// @grant        none
// @namespace    https://greasyfork.org/users/705411-foomango
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/416149/Bypass%20taobao%20overseas%20block%28%E7%BB%95%E8%BF%87%E6%B7%98%E5%AE%9D%E5%B1%8F%E8%94%BD%E6%B5%B7%E5%A4%96%E7%94%A8%E6%88%B7%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416149/Bypass%20taobao%20overseas%20block%28%E7%BB%95%E8%BF%87%E6%B7%98%E5%AE%9D%E5%B1%8F%E8%94%BD%E6%B5%B7%E5%A4%96%E7%94%A8%E6%88%B7%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Loading bypass-taobao-overseas-block.js')
    const beforeUnloadListener = (event) => {
        event.preventDefault()

        // Only prevent page redirection fired by Taotao
        removeEventListener('beforeunload', beforeUnloadListener, {capture: true})
        /*eslint-disable */
        return event.returnValue = 'Are you sure you want to exit?'
        /*eslint-enable */
    }
    alert('点击确定（OK）按钮后，请在屏幕上快速移动并随机连续点击几次。')
    addEventListener('beforeunload', beforeUnloadListener, {capture: true});

    console.log('Finish loading bypass-taobao-overseas-block.js')
})();