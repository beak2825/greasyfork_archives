// ==UserScript==
// @name         Twitter Minimal 阅读优化、去除干扰  
// @author       Efficient Lazy Panda
// @description  为大屏优化Twitter阅读体验：宽屏布局、自动展开、字体美化、简化界面 （隐藏曝光量、转发数等干扰信息）
// @version      1.2
// @namespace   https://example.com/efficient-lazy-panda
// @match        https://twitter.com/*
// @match        https://x.com/*
// @run-at       document-start
// @grant        GM_addStyle 
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547415/Twitter%20Minimal%20%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96%E3%80%81%E5%8E%BB%E9%99%A4%E5%B9%B2%E6%89%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/547415/Twitter%20Minimal%20%E9%98%85%E8%AF%BB%E4%BC%98%E5%8C%96%E3%80%81%E5%8E%BB%E9%99%A4%E5%B9%B2%E6%89%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义CSS样式
    GM_addStyle(`
        /* 宽屏布局优化 - 响应式设计 */
        [data-testid="primaryColumn"] {
            max-width: 1000px !important;
        }
        
        /* 推文内容区域扩展 */
        article[data-testid="tweet"] {
            max-width: none !important;
            padding: 12px 24px !important;
        }
        
        /* 推文文本区域宽度 - 保守设置，保持响应式 */
        [data-testid="tweetText"] {
            max-width: none !important;
        }
        
        /* 应用 iA Writer Mono S 字体 */
        [data-testid="tweetText"],
        [data-testid="tweetText"] span,
        [data-testid="tweetText"] div {
            font-family: "iA Writer Mono S", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace !important;
            font-size: 16px !important;
            line-height: 1.6 !important;
            letter-spacing: 0.3px !important;
        }
        
        /* 隐藏不需要的指标 */
        [data-testid="analytics"],
        [data-testid="views"],
        [aria-label*="次查看"],
        [aria-label*="views"],
        [data-testid="share"],
        [aria-label*="分享"],
        [aria-label*="Share"] {
            display: none !important;
        }
        
        /* 按钮区域处理 - 保持原位置，只隐藏转发按钮 */
        [data-testid="tweet"] [role="group"]:last-child {
            display: flex !important;
            justify-content: space-between !important;
        }
        
        /* 只隐藏转发按钮，保留like和bookmark */
        [data-testid="retweet"],
        [data-testid="unretweet"] {
            display: none !important;
        }
        
        /* 确保like和bookmark按钮显示 */
        [data-testid="like"],
        [data-testid="unlike"],
        [data-testid="bookmark"],
        [data-testid="removeBookmark"] {
            display: flex !important;
        }
        
        /* 自动展开的推文样式 */
        [data-testid="tweetText"] > div {
            max-height: none !important;
            height: auto !important;
            overflow: visible !important;
        }
        
        /* 移除文本截断限制 */
        [data-testid="tweetText"] div[style*="height"] {
            height: auto !important;
            max-height: none !important;
        }
        
        /* 确保长推文能够完全显示 */
        [data-testid="tweet"] [dir="ltr"] {
            max-height: none !important;
            overflow: visible !important;
        }
        
        /* 确保媒体内容也适应宽屏 */
        [data-testid="tweetPhoto"],
        [data-testid="videoPlayer"] {
            max-width: 100% !important;
        }
        
        /* 响应式设计 - 确保小屏幕正常显示 */
        @media (max-width: 1000px) {
            [data-testid="primaryColumn"] {
                max-width: 100% !important;
            }
            
            article[data-testid="tweet"] {
                padding: 8px 16px !important;
            }
        }
        
        @media (max-width: 768px) {
            [data-testid="primaryColumn"] {
                max-width: 100% !important;
            }
            
            article[data-testid="tweet"] {
                padding: 6px 12px !important;
            }
        }
    `);

    // 自动展开"显示更多"功能 
    function autoExpandTweets() {
        try {
            // 查找特定的"显示更多"按钮
            const showMoreButtons = document.querySelectorAll('[role="button"]:not([data-expanded])');
            let expandedCount = 0;
            
            showMoreButtons.forEach(button => {
                if (expandedCount >= 5) return; // 限制每次最多处理5个
                
                const text = button.textContent.trim();
                if (text === '显示更多' || text === 'Show more' || 
                    text === '显示此线程' || text === 'Show this thread') {
                    
                    button.setAttribute('data-expanded', 'true');
                    expandedCount++;
                    
                    setTimeout(() => {
                        try {
                            button.click();
                            console.log('自动展开:', text);
                        } catch (e) {
                            console.log('展开失败:', e);
                        }
                    }, 300 * expandedCount); // 错开点击时间
                }
            });

            // 通过CSS移除高度限制
            const tweets = document.querySelectorAll('[data-testid="tweet"]');
            tweets.forEach(tweet => {
                const textElements = tweet.querySelectorAll('[data-testid="tweetText"] > div');
                textElements.forEach(element => {
                    if (element.style.height && element.style.height !== 'auto') {
                        element.style.height = 'auto';
                        element.style.maxHeight = 'none';
                    }
                });
            });
            
        } catch (error) {
            console.log('自动展开出错:', error);
        }
    }

    // 不再重排按钮，保持原始位置确保可点击性

    function initObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // 延迟执行以确保元素完全加载
                    setTimeout(() => {
                        autoExpandTweets();
                    }, 200);
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                initObserver();
                autoExpandTweets(); 
            }, 1500);
        });
    } else {
        setTimeout(() => {
            initObserver();
            autoExpandTweets(); 
        }, 1500);
    }

    setInterval(() => {
        autoExpandTweets();
    }, 5000); // 改为5秒一次，减少性能影响

})();

