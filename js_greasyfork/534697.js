// ==UserScript==
// @name         移除半竹小说广告3
// @name:zh-CN   移除半竹小说广告3
// @namespace    https://greasyfork.org/users/cj920815
// @version      1.0.3
// @description  移除半竹小说网站上的广告，包括特定尺寸的底部广告
// @description:zh-CN 移除半竹小说网站上的广告，包括特定尺寸的底部广告
// @author       cj920815
// @match        https://www.banzhu333333.com/*
// @match        *://*.banzhu333333.com/*
// @grant        none
// @license      MIT
// @supportURL   https://greasyfork.org/zh-CN/scripts/
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/534697/%E7%A7%BB%E9%99%A4%E5%8D%8A%E7%AB%B9%E5%B0%8F%E8%AF%B4%E5%B9%BF%E5%91%8A3.user.js
// @updateURL https://update.greasyfork.org/scripts/534697/%E7%A7%BB%E9%99%A4%E5%8D%8A%E7%AB%B9%E5%B0%8F%E8%AF%B4%E5%B9%BF%E5%91%8A3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个样式来隐藏广告
    const style = document.createElement('style');
    style.textContent = `
        div[style*="position: fixed"][style*="bottom"][style*="z-index: 2147483646"],
        div[style*="position:fixed"][style*="bottom"][style*="z-index:2147483646"],
        div[style*="position: fixed"][style*="bottom: 0"][style*="height: 33px"],
        div[style*="position:fixed"][style*="bottom:0"][style*="height:33px"] {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // 创建一个函数来移除广告
    function removeAds() {
        // 查找所有带有 slide-baidu class 的元素
        const slideAds = document.getElementsByClassName('slide-baidu');
        while(slideAds.length > 0) {
            slideAds[0].remove();
        }

        // 移除特定尺寸和z-index的底部广告
        function removeBottomAd() {
            const allDivs = document.getElementsByTagName('div');
            for(let div of allDivs) {
                const style = window.getComputedStyle(div);
                const rect = div.getBoundingClientRect();
                
                // 检查是否符合特定广告的特征
                if (
                    // 检查定位方式
                    style.position === 'fixed' &&
                    // 检查z-index值（支持字符串和数字类型）
                    (style.zIndex === '2147483646' || parseInt(style.zIndex) === 2147483646) &&
                    // 检查尺寸（允许2px的误差）
                    (Math.abs(rect.width - 41) <= 2 && Math.abs(rect.height - 33) <= 2) &&
                    // 确保元素在底部
                    (rect.bottom >= window.innerHeight - 50 || style.bottom === '0px' || style.bottom === '0')
                ) {
                    // 先禁用点击事件和隐藏元素
                    div.style.setProperty('pointer-events', 'none', 'important');
                    div.style.setProperty('display', 'none', 'important');
                    div.style.setProperty('opacity', '0', 'important');
                    div.style.setProperty('visibility', 'hidden', 'important');
                    // 然后移除元素
                    div.remove();
                    console.log('找到并移除底部广告:', div.outerHTML);
                }

                // 检查父元素是否是广告容器
                if (div.children.length > 0 && style.position === 'fixed' && style.bottom === '0px') {
                    for (let child of div.children) {
                        const childRect = child.getBoundingClientRect();
                        if (Math.abs(childRect.width - 41) <= 2 && Math.abs(childRect.height - 33) <= 2) {
                            div.remove();
                            console.log('找到并移除广告容器:', div.outerHTML);
                            break;
                        }
                    }
                }
            }
        }

        // 立即执行一次
        removeBottomAd();

        // 创建观察器来处理动态加载的广告
        const observer = new MutationObserver((mutations) => {
            let needCheck = false;
            for(let mutation of mutations) {
                if(mutation.addedNodes.length > 0) {
                    needCheck = true;
                    break;
                }
            }
            if(needCheck) {
                removeBottomAd();
            }
        });

        // 配置观察器
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['style', 'class']
        });
    }

    // 确保在DOM开始加载时就运行脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', removeAds);
    } else {
        removeAds();
    }

    // 为了确保广告被移除，定期检查
    setInterval(removeAds, 500);

    // 在页面大小改变时也检查一次
    window.addEventListener('resize', removeAds);

    // 在页面滚动时检查
    window.addEventListener('scroll', removeAds);
})(); 