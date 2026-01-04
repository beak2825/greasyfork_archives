// ==UserScript==
// @name         图搜图-f
// @namespace    http://tampermonkey.net/
// @version      2024-03-12.23
// @description  淘宝以图搜图跳转找家纺
// @author       song
// @match        https://search.zhaojiafang.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhaojiafang.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489636/%E5%9B%BE%E6%90%9C%E5%9B%BE-f.user.js
// @updateURL https://update.greasyfork.org/scripts/489636/%E5%9B%BE%E6%90%9C%E5%9B%BE-f.meta.js
// ==/UserScript==


(function() {
    'use strict';
var searchInfo = location.search
const priceFlag = searchInfo.includes('price')
var price = searchInfo.substr(searchInfo.lastIndexOf("&") + 7,9999)
var domLENGTH = 0
// 目标节点
const targetNode = document.documentElement;
    console.log(targetNode)

// 观察器的配置（需要观察什么变动）
const config = { attributes: true, childList: true, subtree: true };

// 当观察到变动时执行的回调函数
const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            let doms = document.getElementsByClassName('mb-8')
            console.log(domLENGTH)
            if(domLENGTH!=0||!priceFlag)return
            for(let i=0;i<doms.length;i++) {
                doms[i].innerHTML+=`<span style='color:#f86300;font-size:16px;font-weight:bolder'>淘：${price}</span>`
                domLENGTH = doms.length
            }
        }
    }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 开始观察目标节点
observer.observe(targetNode, config);

    // Your code here...
})();