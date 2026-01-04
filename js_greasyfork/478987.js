// ==UserScript==
// @name         B站广告动态屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  基于关键词实现的广告动态屏蔽
// @author       QingMu_
// @match        https://t.bilibili.com/*
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/478987/B%E7%AB%99%E5%B9%BF%E5%91%8A%E5%8A%A8%E6%80%81%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/478987/B%E7%AB%99%E5%B9%BF%E5%91%8A%E5%8A%A8%E6%80%81%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const keywords = ["京东", "淘宝", "红包", "优惠", "划算", "特惠"]
    const observerConfig = {childList: true, subtree: true ,characterData:true ,attributes:true}
    const observer = new MutationObserver(blockBox);
    setTimeout(function(){
        blockBox()
        observer.observe(document.querySelector(".bili-dyn-list"), observerConfig);
    },2000)

    function getTextBox() {
        return document.querySelectorAll(".bili-dyn-item__main")
    }

    function checkKeywords(text) {
        let flag = false
        keywords.forEach((item,index)=>{
            if(text.indexOf(item) !== -1){
                flag = true
            }
        })
        return flag
    }

    function blockBox() {
        let boxs = getTextBox()
        boxs.forEach((item) => {
            if (checkKeywords(item.innerText)) {
                item.innerHTML=""
            }
        })
    }
})();