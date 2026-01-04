// ==UserScript==
// @name         在线之家广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  屏蔽在线之家的广告
// @author       You
// @match        https://www.zxzj.site/*
// @match        https://www.zxzj.pro/*
// @match        https://www.zxzj.org/*
// @match        https://www.zxzj.vip/*
// @match        https://www.1993s.top/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zxzj.pro
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457980/%E5%9C%A8%E7%BA%BF%E4%B9%8B%E5%AE%B6%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/457980/%E5%9C%A8%E7%BA%BF%E4%B9%8B%E5%AE%B6%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 当 dom 加载完成后，删除顶部 banner
var d = document.getElementsByClassName("none")[0];
        d.parentNode.removeChild(d);
        console.log("已删除顶部广告");
    // 配置观察器，当 body 中添加了左广告和右广告时，删除
     // 选择需要观察变动的节点
    const targetNode = document.getElementsByTagName("body")[0];

    // 只观察 body 子节点的变动
    const config = {childList: true };
    const callback =(mutationList,observer)=>{
        // 删除左侧广告
        targetNode.removeChild(document.getElementsByTagName("body")[0].childNodes[3]);
        // 删除右侧广告
        targetNode.removeChild(document.getElementsByTagName("body")[0].childNodes[4]);
        console.log("广告已删除");
    }
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);

    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);

})();