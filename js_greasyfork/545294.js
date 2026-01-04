// ==UserScript==
// @name         hanime1界面优化
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  让hanime1的视频封面可以被看图插件例如浮图秀读取，让过大播放界面变成合适大小
// @author       coccvo
// @match        https://hanime1.me/*
// @icon         https://vdownload.hembed.com/image/icon/tab_logo.png?secure=EJYLwnrDlidVi_wFp3DaGw==,4867726124
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545294/hanime1%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/545294/hanime1%E7%95%8C%E9%9D%A2%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const targetClasses = [
        'col-xs-6 col-sm-4 col-md-2 search-doujin-videos hidden-xs hover-lighter multiple-link-wrapper',
        'related-watch-wrap multiple-link-wrapper'
    ];

    targetClasses.forEach(targetClass => {
        const elements = document.querySelectorAll(`.${targetClass.replace(/ /g, '.')}`);
        elements.forEach(element => {
            const overlay = element.querySelector('a.overlay');
            const relativeDiv = element.querySelector('div[style*="position: relative"]');
            if (overlay && relativeDiv) {
                element.insertBefore(relativeDiv, overlay);
            }
        });
    });

// 使用MutationObserver监听DOM变化（低占用方式）
    const observer = new MutationObserver(function(mutations) {
        // 只在有变化时检查，减少性能消耗
        checkVideoSize();
    });

    // 配置观察选项：只观察目标节点的属性变化
    const config = { attributes: true, childList: true, subtree: true };

    // 目标节点（先从document开始观察，等找到video后再调整）
    let targetNode = document.documentElement;
    let videoElement = null;

    // 检查视频尺寸的函数（防抖处理）
    const checkVideoSize = _.debounce(function() {
        if (!videoElement) {
            videoElement = document.getElementById('player');
            if (videoElement) {
                // 找到video后改为直接观察video元素
                observer.disconnect();
                observer.observe(videoElement, config);
            }
        }

        if (videoElement && videoElement.clientHeight > 860) {
            videoElement.style.height = '860px';
        }
    }, 300); // 300ms防抖间隔

    // 初始观察整个文档
    observer.observe(targetNode, config);

    // 初始检查一次
    checkVideoSize();

    // 添加resize事件监听（使用防抖）
    window.addEventListener('resize', checkVideoSize);

    // 页面卸载时清理
    window.addEventListener('beforeunload', function() {
        observer.disconnect();
        window.removeEventListener('resize', checkVideoSize);
    });

    // 获取video元素
    //     const videoElement = document.getElementById('player');
    //     setTimeout(() => {
    //         if (videoElement) {
    //             const currentStyle = videoElement.getAttribute('style');
    //             if (currentStyle) {
    //                 const newStyle = currentStyle.replace(/\s*width\s*:\s*100%;\s*/, '/* width: 100%; */');
    //                 videoElement.setAttribute('style', newStyle);
    //             }
    //         }
    //     }, 2000);
})();