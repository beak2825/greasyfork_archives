// ==UserScript==
// @name         去简书网站的广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  简书广告删除，网页加载后，每100ms查询一次广告DOM，自动删除，默认查到并删除后，或查询2000ms后停止
// @author       Email：290930511@qq.com
// @license MIT
// @match    *://*.jianshu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466324/%E5%8E%BB%E7%AE%80%E4%B9%A6%E7%BD%91%E7%AB%99%E7%9A%84%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/466324/%E5%8E%BB%E7%AE%80%E4%B9%A6%E7%BD%91%E7%AB%99%E7%9A%84%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const body = document.body;
    const aTagTitle = "动力广告联盟";
    // 最大轮询次数 一般2秒内广告的DOM已经加载进来了，避免无限循环
    let maxTimes = 20;
    // 每间隔多少毫秒轮询一次
    const intervalTime = 100;

    // 定义循环定时器器
    const s = setInterval(() => {
        maxTimes--;
        if (maxTimes === 0) {
            clearInterval(s);
        }

        deleteAdDom();
        deleteAdIframe();
    }, intervalTime)

    // 删除iframe级别广告
    function deleteAdIframe() {
        var iframes = document.querySelectorAll('iframe')
        iframes.forEach(iframe => {
            // 如果匹配到广告地址
            if (iframe.src.match("chuzushijian.cn")) {
                console.log(iframe, "iframe")
                const rootDiv = getRootDiv(iframe);
                rootDiv.remove();
            }
        })
    }

    // 删除DOM级别广告
    function deleteAdDom() {
        const adTags = document.querySelectorAll(`a[title="${aTagTitle}"]`)

        if (adTags.length > 0) {
            // 清空循环定时器
            clearInterval(s);
            // 删除广告根节点
            adTags.forEach(aTag => {
                const rootDiv = getRootDiv(aTag);
                rootDiv && rootDiv.remove();
            })
        }
    }

    // 获取到body下广告节点的根节点的div
    function getRootDiv(dom) {
        const parentDom = dom.parentNode;
        let resultDom;
        if(parentDom === body) {
            resultDom = dom;
        } else {
            resultDom = getRootDiv(parentDom);
        }
        return resultDom;
    }

    // Your code here...
})();