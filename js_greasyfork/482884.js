// ==UserScript==
// @name         Bilibili No Login Pop
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  watch bilibili video smothly without login
// @author       Admingyu
// @match        https://www.bilibili.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/482884/Bilibili%20No%20Login%20Pop.user.js
// @updateURL https://update.greasyfork.org/scripts/482884/Bilibili%20No%20Login%20Pop.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //强制继续播放
    window.player.pause = function(){
        console.log('不许暂停哦');
    }
    window.player.play();

    const elementsToRemove = document.querySelectorAll('.bili-mini-mask');
    // 遍历并移除这些元素
    for (const element of elementsToRemove) {
        element.remove();
    }

    // 定义一个MutationObserver来监视DOM更改
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // 在每个mutation中查找具有类名 "bili-mini-mask" 的元素并删除它们
            const elementsToRemove = mutation.target.querySelectorAll('.bili-mini-mask');
            for (const element of elementsToRemove) {
                element.remove();
                console.log('我就不登陆');
            }
        });
    });
    // 监视整个文档
    const targetNode = document.documentElement;
    const config = { childList: true, subtree: true };
    observer.observe(targetNode, config);
})();