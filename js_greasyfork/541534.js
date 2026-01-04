// ==UserScript==
// @name        ArtStation 作者的projects项目界面跳转到artwork界面的按钮
// @namespace   artstation-jump
// @match       https://*.artstation.com/projects/*
// @description 在ArtStation projects项目页面左上角添加跳转按钮，点击跳转到对应的artstation.com页面
// @version     1.1
// @grant       none
// @run-at      document-end
// @icon        https://www.artstation.com/favicon.ico
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/541534/ArtStation%20%E4%BD%9C%E8%80%85%E7%9A%84projects%E9%A1%B9%E7%9B%AE%E7%95%8C%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%88%B0artwork%E7%95%8C%E9%9D%A2%E7%9A%84%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/541534/ArtStation%20%E4%BD%9C%E8%80%85%E7%9A%84projects%E9%A1%B9%E7%9B%AE%E7%95%8C%E9%9D%A2%E8%B7%B3%E8%BD%AC%E5%88%B0artwork%E7%95%8C%E9%9D%A2%E7%9A%84%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建跳转按钮
    function createJumpButton() {
        const button = document.createElement('div');
        button.id = 'artstation-jump-btn';
        button.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>跳转ArtStation</span>
        `;

        // 添加点击事件
        button.addEventListener('click', function() {
            jumpToArtStation();
        });

        return button;
    }

    // 跳转到ArtStation
    function jumpToArtStation() {
        const currentUrl = window.location.href;

        // 从*.artstation.com/projects/xxx提取项目ID
        const projectMatch = currentUrl.match(/\/projects\/([^\/\?]+)/);

        if (projectMatch && projectMatch[1]) {
            const projectId = projectMatch[1];
            const artstationUrl = `https://www.artstation.com/artwork/${projectId}`;

            // 在新标签页中打开
            window.open(artstationUrl, '_blank');

            console.log(`跳转到ArtStation: ${artstationUrl}`);
        } else {
            console.error('无法从当前URL提取项目ID');
            alert('无法获取项目ID，请检查当前页面URL');
        }
    }

    // 添加样式
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #artstation-jump-btn {
                position: fixed;
                top: 20px;
                left: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 16px;
                border-radius: 8px;
                cursor: pointer;
                z-index: 9999;
                display: flex;
                align-items: center;
                gap: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
                user-select: none;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            #artstation-jump-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
                background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
            }

            #artstation-jump-btn:active {
                transform: translateY(0);
                box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
            }

            #artstation-jump-btn svg {
                flex-shrink: 0;
            }

            #artstation-jump-btn span {
                white-space: nowrap;
            }

            /* 响应式设计 */
            @media (max-width: 768px) {
                #artstation-jump-btn {
                    top: 10px;
                    left: 10px;
                    padding: 8px 12px;
                    font-size: 12px;
                }

                #artstation-jump-btn span {
                    display: none;
                }

                #artstation-jump-btn svg {
                    width: 20px;
                    height: 20px;
                }
            }

            /* 确保按钮不被其他元素遮挡 */
            #artstation-jump-btn {
                pointer-events: auto;
            }
        `;
        document.head.appendChild(style);
    }

    // 检查URL是否匹配
    function isValidUrl() {
        const currentUrl = window.location.href;
        // 检查是否是artstation.com的子域名且包含/projects/
        return currentUrl.includes('artstation.com/projects/');
    }

    // 检查是否已经是主站
    function isMainArtStation() {
        return window.location.hostname === 'www.artstation.com';
    }

    // 初始化
    function init() {
        if (!isValidUrl()) {
            console.log('当前页面不是ArtStation项目页面，脚本不运行');
            return;
        }

        // 如果已经是主站，不显示按钮
        if (isMainArtStation()) {
            console.log('当前已在ArtStation主站，无需跳转');
            return;
        }

        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                addStyles();
                const button = createJumpButton();
                document.body.appendChild(button);
            });
        } else {
            addStyles();
            const button = createJumpButton();
            document.body.appendChild(button);
        }

        console.log('ArtStation 跳转按钮已加载');
    }

    // 启动脚本
    init();
})();