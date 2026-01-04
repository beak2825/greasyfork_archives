// ==UserScript==
// @name         微信Bilibili小程序链接转直链
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在PC端看公众号文章时，将文章中的Bilibili小程序链接转为视频链接，方便电脑观看
// @author       Cesaryuan
// @license MIT
// @match        https://mp.weixin.qq.com/s/*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435812/%E5%BE%AE%E4%BF%A1Bilibili%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%93%BE%E6%8E%A5%E8%BD%AC%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/435812/%E5%BE%AE%E4%BF%A1Bilibili%E5%B0%8F%E7%A8%8B%E5%BA%8F%E9%93%BE%E6%8E%A5%E8%BD%AC%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // wait for element with max wait time
    function waitForEle(selector, callback, maxWaitTime) {
        var waitTime = 0;
        var interval = setInterval(function () {
            var element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                console.log('waitForEle: ' + selector + ' found');
                callback(element);
            } else if (waitTime >= maxWaitTime) {
                clearInterval(interval);
            } else {
                waitTime += 100;
            }
        }, 100);
    }
    waitForEle('a[data-miniprogram-path]', () => {
        document.querySelectorAll('a').forEach(function (a) {
            if (a.hasAttribute('data-miniprogram-path')) {
                const href = a.getAttribute('data-miniprogram-path');
                if (href.includes('avid')) {
                    var url = 'https://www.bilibili.com/video/' + 'av' + new URL("https://www.bilibili.com/" + href).searchParams.get('avid');
                    const newA = document.createElement('a');
                    newA.href = url;
                    newA.target = '_blank';
                    newA.appendChild(a.children[0]);
                    a.replaceWith(newA);
                }
            }
        })
    }, 5000);
})();