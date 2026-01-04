// ==UserScript==
// @name         天凤(4K)游戏昵称隐藏
// @namespace    http://tampermonkey.net/
// @version      6.7
// @description  可配置的隐私保护功能，只支持天凤4K版
// @author       馒头卡
// @match        *://tenhou.net/4/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540886/%E5%A4%A9%E5%87%A4%284K%29%E6%B8%B8%E6%88%8F%E6%98%B5%E7%A7%B0%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/540886/%E5%A4%A9%E5%87%A4%284K%29%E6%B8%B8%E6%88%8F%E6%98%B5%E7%A7%B0%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐私保护配置
    const config = {
        HIDE_NICKNAME: true,  // 是否隐藏昵称
        HIDE_RANK: true,  // 是否隐藏段位
        HIDE_RT: true  // 是否隐藏RT值
    };

    const NonCanvasProtector = {
        debounceTimer: null, // 防抖计时器
        observer: null,      // MutationObserver实例
        gameContainer: null, // 游戏主容器

        // 处理玩家信息
        processPlayerInfo: function(div) {
            const originalHTML = div.innerHTML;
            let newHTML = originalHTML;

            // 隐藏昵称
            if (config.HIDE_NICKNAME) {
                newHTML = newHTML.replace(
                    /<span style="[^"]*font-weight:bold;color:#CCC[^>]*>([^<]*)<\/span>/g,
                    '<span style="color:transparent">***</span>'
                );
                newHTML = newHTML.replace(
                    /(class="bbg5"[\s\S]*?>)([^<]+?)(<table)/g,
                    '$1***$3'
                );
            }

            // 隐藏段位
            if (config.HIDE_RANK) {
                newHTML = newHTML.replace(
                    /<\/span> .段 <span/g,
                    '</span> <span'
                );
            }

            // 隐藏RT值
            if (config.HIDE_RT) {
                newHTML = newHTML.replace(
                    /<span style="[^"]*color:#888[^>]*>R<\/span>\d+/g,
                    ''
                );
            }

            // 更新内容
            if (newHTML !== originalHTML) {
                div.innerHTML = newHTML;
            }
        },

        // 处理终局特殊表格
        handleFinalScore: function() {
            if (!config.HIDE_NICKNAME) return;

            const scoreTables = document.querySelectorAll('td.bbg5 > table');
            scoreTables.forEach(table => {
                const td = table.closest('td');
                if (td) {
                    for (const node of td.childNodes) {
                        if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
                            node.textContent = '***';
                            break;
                        }
                    }
                }
            });
        },

        // 监控游戏状态变化
        monitorGameStates: function() {
            // 清除现有的观察器
            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }

            // 尝试查找游戏主容器
            this.gameContainer = document.querySelector('body > div:nth-child(5)');
            if (!this.gameContainer) return;

            const observer = new MutationObserver((mutations) => {
                // 防抖处理：避免高频触发
                clearTimeout(this.debounceTimer);
                this.debounceTimer = setTimeout(() => {
                    this.handleGameStates();
                    this.handleFinalScore();
                }, 300);
            });

            // 只监控特定区域
            observer.observe(this.gameContainer, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });

            this.observer = observer;
        },

        // 处理游戏状态
        handleGameStates: function() {
            const targetSelector = 'body > div:nth-child(5) > div:nth-child(9) > div > div:nth-child(6) > table > tbody';
            const element = document.querySelector(targetSelector);

            if (element) {
                const playerDivs = element.querySelectorAll('div.bbg5');
                playerDivs.forEach(div => this.processPlayerInfo(div));
            }

            this.handleFinalScore();
        },

        // 清理所有资源
        cleanup: function() {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = null;

            if (this.observer) {
                this.observer.disconnect();
                this.observer = null;
            }
        },

        init: function() {
            this.cleanup();
            this.monitorGameStates();
            this.handleGameStates();
        }
    };

    // 主初始化函数
    function init() {
        NonCanvasProtector.init();
    }

    // 页面加载完成后执行
    if (document.readyState === 'complete') {
        setTimeout(init, 1500);
    } else {
        window.addEventListener('load', () => setTimeout(init, 1500));
    }

    // 页面卸载时清理资源
    window.addEventListener('unload', function() {
        NonCanvasProtector.cleanup();
    });
})();
