// ==UserScript==
// @name         关闭B站APP下载提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可以关闭Bilibili网站的APP下载提示
// @author       MaayaSis
// @include	   	 *://www.bilibili.com/**
// @include      *://search.bilibili.com/**
// @include      *://space.bilibili.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/481858/%E5%85%B3%E9%97%ADB%E7%AB%99APP%E4%B8%8B%E8%BD%BD%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/481858/%E5%85%B3%E9%97%ADB%E7%AB%99APP%E4%B8%8B%E8%BD%BD%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删除B站客户端下载提示
    const bodyNode = document.querySelector('body')
    const tipNode = document.getElementById('tipWrap')
    const config = { childList: true }
    const callback = function (flag) {
        return function(mutationList, observe) {
            for (let mutation of mutationList) {
                if (mutation.addedNodes && mutation.addedNodes[0]) {
                    if(mutation.addedNodes[0].className === flag) {
                        console.log('执行删除', flag)
                        mutation.addedNodes[0].parentNode.removeChild(mutation.addedNodes[0])
                        break
                    }
                }
            }
        }
    }
    const bodyObserver = new MutationObserver(callback('desktop-download-tip'))
    bodyObserver.observe(bodyNode, config)

    const tipObserver = new MutationObserver(callback('wrap-box'))
    tipObserver.observe(tipNode, config)
})();