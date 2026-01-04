// ==UserScript==
// @name         天津继续医学教育培训快速8倍速刷-好医生
// @namespace    http://www.31ho.com/
// @version      1.0
// @description  秒播+自动答题 （继续医学教育培训）
// @author       keke31h
// @match        https://tjsjxyxjy.cmechina.net/*
// @match        *://*.cmechina.net/cme/*
// @match        http://tjs.cmechina.net/*
// @match        cme.haoyisheng.com/cme/*
// @icon         ttps://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496908/%E5%A4%A9%E6%B4%A5%E7%BB%A7%E7%BB%AD%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E5%BF%AB%E9%80%9F8%E5%80%8D%E9%80%9F%E5%88%B7-%E5%A5%BD%E5%8C%BB%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/496908/%E5%A4%A9%E6%B4%A5%E7%BB%A7%E7%BB%AD%E5%8C%BB%E5%AD%A6%E6%95%99%E8%82%B2%E5%9F%B9%E8%AE%AD%E5%BF%AB%E9%80%9F8%E5%80%8D%E9%80%9F%E5%88%B7-%E5%A5%BD%E5%8C%BB%E7%94%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义一个函数来处理video元素
    function handleVideo() {
        var videoElements = document.querySelectorAll('video');
        videoElements.forEach(function(video) {
            video.muted = true;               // 设置视频为静音
            video.playbackRate = 8;          // 设置视频播放速度为8倍速
            if (video.duration > 3) {
                video.currentTime = video.duration - 3; // 如果视频时长大于3秒，跳转到视频的最后3秒
            }
        });
    }

    // 定义一个函数来处理input元素
    function handleInput() {
        var elements = document.querySelectorAll('input[type="radio"][value="1"]');
        elements.forEach(function(element) {
            element.checked = true;
            console.log('检测到符合条件的单选按钮并已选中');
        });
    }

    // 初始调用，以处理当前已加载的元素
    handleVideo();
    handleInput();

    // 创建一个MutationObserver来监听DOM的变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // 如果是子节点的添加或删除，检查是否有新的video或input元素
                mutation.addedNodes.forEach(function(node) {
                    if (node.tagName === 'VIDEO') {
                        handleVideo(); // 如果有新的video元素，调用handleVideo函数
                    }
                    if (node.tagName === 'INPUT' && node.type === 'radio' && node.value === '1') {
                        handleInput(); // 如果有新的符合条件的input元素，调用handleInput函数
                    }
                });
            }
        });
    });

    // 配置MutationObserver的选项
    var observerConfig = {
        childList: true,
        subtree: true
    };

    // 将observer应用到document.body，以监控整个文档的DOM变化
    observer.observe(document.body, observerConfig);

    // 定时器，用于处理可能在页面加载后动态添加的video元素
    setInterval(handleVideo, 5000);
})();