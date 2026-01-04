// ==UserScript==
// @name         bilibili商品推广屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @license          MIT
// @description  屏蔽哔哩哔哩用户页面上带有商品推广的广告
// @match        https://t.bilibili.com/*
// @match        https://space.bilibili.com/*/dynamic*
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/528699/bilibili%E5%95%86%E5%93%81%E6%8E%A8%E5%B9%BF%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/528699/bilibili%E5%95%86%E5%93%81%E6%8E%A8%E5%B9%BF%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 广告关键词列表
    const adKeywords = [
        'UP主的推荐','妙界','按摩仪','颐莲','流量卡','电信卡','联通卡','移动卡','肯德基','麦当劳','必胜客','饿了吗','美团','百度外卖','京东','淘宝','拼多多','唯品会','苏宁易购','国美','蘑菇街','神气小鹿',
    ];

    function removeAds() {
        const dynamicItems = document.querySelectorAll('.bili-dyn-list__item');
        
        dynamicItems.forEach(item => {
            const hasGoodsElement = item.querySelector('.bili-dyn-card-goods');
            
            let matchedKeyword = '';
            const hasAdKeyword = Array.from(item.querySelectorAll('span')).some(span => {
                return adKeywords.some(keyword => {
                    if (span.textContent.includes(keyword)) {
                        matchedKeyword = keyword;
                        return true;
                    }
                    return false;
                });
            });
            
            if ((hasGoodsElement || hasAdKeyword) && !item.hasAttribute('data-ad-processed')) {
                item.setAttribute('data-ad-processed', 'true');
                
                const style = document.createElement('style');
                style.textContent = `
                    .bili-dyn-list__item[data-ad-processed] {
                        position: relative;
                        padding: 8px 16px !important;
                        background: #f8f8f8;
                        border-radius: 4px;
                        margin: 8px 0;
                    }
                    .bili-dyn-list__item[data-ad-processed] .bili-dyn-item__main {
                        display: none;
                    }
                    .bili-dyn-list__item[data-ad-processed].ad-expanded .bili-dyn-item__main {
                        display: block;
                    }
                    .bili-dyn-list__item[data-ad-processed]::before {
                        content: '广告' attr(data-ad-reason);
                        color: #999;
                        font-size: 14px;
                    }
                    .bili-dyn-list__item .toggle-ad-btn {
                        position: absolute;
                        top: 4px;
                        right: 16px;
                        padding: 4px 12px;
                        background: #fff;
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        cursor: pointer;
                        color: #666;
                        font-size: 12px;
                    }
                    .bili-dyn-list__item .toggle-ad-btn:hover {
                        background: #f0f0f0;
                    }
                    .bili-dyn-list__item.ad-collapsed {
                        max-height: 80px;
                        overflow: hidden;
                    }
                    .bili-dyn-list__item.ad-collapsed .bili-dyn-card-goods {
                        opacity: 0.6;
                    }
                    .bili-dyn-list__item.ad-expanded {
                        max-height: none;
                    }
                `;
                document.head.appendChild(style);
                
                const userNameElement = item.querySelector('.bili-dyn-title__text');
                const userName = userNameElement ? userNameElement.textContent.trim() : '未知用户';

                const adReason = hasGoodsElement ? '（商品推广）' : `（关键词：${matchedKeyword}）`;
                item.setAttribute('data-ad-reason', `@${userName}${adReason}`);
                
                const toggleButton = document.createElement('button');
                toggleButton.className = 'toggle-ad-btn';
                toggleButton.textContent = '显示内容';
                item.appendChild(toggleButton);
                
                toggleButton.addEventListener('click', () => {
                    if (!item.classList.contains('ad-expanded')) {
                        item.classList.remove('ad-collapsed');
                        item.classList.add('ad-expanded');
                        toggleButton.textContent = '隐藏内容';
                    } else {
                        item.classList.remove('ad-expanded');
                        item.classList.add('ad-collapsed');
                        toggleButton.textContent = '显示内容';
                    }
                });
            }
        });
    }

    removeAds();

    const observer = new MutationObserver((mutations) => {
        let shouldCheck = false;
        
        mutations.forEach(mutation => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                for (let i = 0; i < mutation.addedNodes.length; i++) {
                    const node = mutation.addedNodes[i];
                    if (node.nodeType === 1) {
                        if (node.classList && node.classList.contains('bili-dyn-list__item')) {
                            shouldCheck = true;
                            break;
                        }
                        if (node.querySelector && node.querySelector('.bili-dyn-list__item')) {
                            shouldCheck = true;
                            break;
                        }
                    }
                }
            }
        });
        
        if (shouldCheck) {
            removeAds();
        }
    });

    const config = { childList: true, subtree: true };

    observer.observe(document.body, config);

    window.addEventListener('scroll', function() {
        clearTimeout(window.scrollTimer);
        window.scrollTimer = setTimeout(function() {
            removeAds();
        }, 300);
    });

})();