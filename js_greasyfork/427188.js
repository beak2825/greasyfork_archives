// ==UserScript==
// @name         OPGG 取消微信登陆
// @namespace    https://yinr.cc/
// @version      0.1
// @description  取消 OPGG 微信登陆限制
// @author       Yinr
// @icon         https://www.opgg.cn/favicon.ico
// @match        http*://www.opgg.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427188/OPGG%20%E5%8F%96%E6%B6%88%E5%BE%AE%E4%BF%A1%E7%99%BB%E9%99%86.user.js
// @updateURL https://update.greasyfork.org/scripts/427188/OPGG%20%E5%8F%96%E6%B6%88%E5%BE%AE%E4%BF%A1%E7%99%BB%E9%99%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 方案一：每两秒执行一次(思路简单，但稍微占用一些资源)
    // setInterval(() => {
    //     document.getElementsByClassName('wechat-login')[0].remove()
    // }, 2000)

    // 方案二：监听页面添加元素事件，有出现微信登陆则删除
    // 参考文档：https://developer.mozilla.org/zh-CN/docs/Web/API/MutationObserver
    //         或搜索 MutationObserver
    const observeFunc = () => {
        const wechat = document.getElementsByClassName('wechat-login')
        if (wechat.length > 0) {
            wechat[0].remove()
        }
    }
    const observer = new MutationObserver(observeFunc)
    observer.observe(document.body, {childList: true, subtree: true})
})();