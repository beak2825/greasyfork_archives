// ==UserScript==
// @name         Remove Bilibili video page Live ads
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  Remove element by class on specific webpage
// @author       BlueSlot
// @match        https://www.bilibili.com/video/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480575/Remove%20Bilibili%20video%20page%20Live%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/480575/Remove%20Bilibili%20video%20page%20Live%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeElement() {
        // 获取所有具有指定类名的元素
        var elements = document.getElementsByClassName("pop-live-small-mode part-undefined");

        // 循环遍历并移除每个元素
        for (var i = 0; i < elements.length; i++) {
            elements[i].parentNode.removeChild(elements[i]);
        }
        // var elements2 = document.getElementsByClassName("ad-report ad-floor-exp");
        //
        // for (var k = 0; k < elements2.length; k++) {
        //     elements2[k].parentNode.removeChild(elements2[k]);
        // }
        // var elements3 = document.getElementsByClassName("video-page-game-card-small");
        //
        // for (var j = 0; j < elements3.length; j++) {
        //     elements3[j].parentNode.removeChild(elements3[j]);
        // }
        var elements4 = document.getElementsByClassName("ad-report video-card-ad-small");
        for (var h = 0; h < elements4.length; h++) {
            let child = elements4[h].querySelector(".vcd")
            child.parentNode.removeChild(child);
            console.log(child);
            // elements4[h].parentNode.removeChild(elements4[h]);
        }
    }
    // window.onload = function (){
    //
    // }
    // 创建一个 MutationObserver 实例，并指定要观察的目标节点
    var targetNode = document.body; // 监听整个 body 元素
    var config = { childList: true, subtree: true }; // 配置项，表示监听子节点的变化，以及监听整个子树的变化
    var observer = new MutationObserver(removeElement);

    // 启动 MutationObserver，并在节点变化时执行 removeElement 函数
    observer.observe(targetNode, config);

    // 设置一个定时器，用于在页面加载后的一定时间后停止观察
    setTimeout(function() {
        observer.disconnect();
    }, 10000); // 在这里设置一个适当的时间，确保足够长以覆盖元素加载的延迟
})();