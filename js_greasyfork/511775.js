// ==UserScript==
// @name         自用广告移除
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  自用测试网页广告移除
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/511775/%E8%87%AA%E7%94%A8%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/511775/%E8%87%AA%E7%94%A8%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 覆盖 DisableDevtool 函数，阻止开发者工具检测
    window.DisableDevtool = function(options) {
        console.log('已阻止开发者工具检测');
        // 这里可以自定义实现或保持空函数
    };

    /**
     * 日志模块
     * 统一管理日志输出
     */
    const removalCount = {}; // 用于记录每个选择器的移除次数

    function logMessage(message) {
        console.log(message);
    }

    function logDomainMatchAndRemoval(domain, selectors, actualSelectors) {
        const formattedSelectors = actualSelectors.map((selector, index) => {
            const count = removalCount[selector] || 0;
            return `${index + 1}. ${selector}${count > 1 ? ` (${count} 次)` : ''}`;
        }).join('\n');
        const count = actualSelectors.length;
        if (count > 0) {
            logMessage(`匹配到域名 ${domain}，发现并移除以下广告 (${count} 个):\n\n${formattedSelectors}\n\n`);
        } else {
            logMessage('该域名暂未添加广告配置！');
        }
    }

    function logGlobalRulesAndRemoval(selectors, actualSelectors) {
        const formattedSelectors = actualSelectors.map((selector, index) => {
            const count = removalCount[selector] || 0;
            return `${index + 1}. ${selector}${count > 1 ? ` (${count} 次)` : ''}`;
        }).join('\n');
        const count = actualSelectors.length;
        if (count > 0) {
            logMessage(`全局规则生效，发现并移除以下广告 (${count} 个):\n\n${formattedSelectors}\n\n`);
        } else {
            logMessage('未发现已知的全局广告！');
        }
    }

    /**
     * 主控制模块
     * 负责启动脚本的各个部分
     */
    function main() {
        let adsFound = false; // 用于追踪是否发现广告

        // 无论域名如何，都移除特定的元素
        if (removeSpecificElements()) {
            adsFound = true;
        }

        // 根据域名执行特定操作
        if (handleDomainSpecificAds()) {
            adsFound = true;
        }
    }

    /**
     * 通用工具模块
     * 这里可以放置一些通用的工具函数
     */
    function removeElements(selectors) {
        const actualSelectors = [];
        selectors.forEach(selector => {
            try {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    actualSelectors.push(selector);
                    elements.forEach(element => {
                        element.remove(); // 删除目标元素
                    });

                    // 更新选择器的移除次数
                    if (removalCount[selector]) {
                        removalCount[selector]++;
                    } else {
                        removalCount[selector] = 1;
                    }
                }
            } catch (error) {
                logMessage(`Error removing selector ${selector}: ${error}`);
            }
        });
        return actualSelectors;
    }

    /**
     * 监听 DOM 变化的函数
     * @param {Array} selectors - 需要移除的选择器数组
     */
    function observeDomChanges(selectors) {
        const observer = new MutationObserver(mutations => {
            const actualSelectors = [];
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    selectors.forEach(selector => {
                        if (node.matches && node.matches(selector)) {
                            actualSelectors.push(selector);
                            node.remove(); // 删除目标元素

                            // 更新选择器的移除次数
                            if (removalCount[selector]) {
                                removalCount[selector]++;
                            } else {
                                removalCount[selector] = 1;
                            }
                        } else {
                            const elements = document.querySelectorAll(selector);
                            elements.forEach(element => {
                                if (element.isConnected) {
                                    actualSelectors.push(selector);
                                    element.remove(); // 删除目标元素

                                    // 更新选择器的移除次数
                                    if (removalCount[selector]) {
                                        removalCount[selector]++;
                                    } else {
                                        removalCount[selector] = 1;
                                    }
                                }
                            });
                        }
                    });
                });
            });
            if (actualSelectors.length > 0) {
                logGlobalRulesAndRemoval(selectors, actualSelectors);
            }
        });
        const observerConfig = {
            childList: true, // 观察直接子节点的变化
            subtree: true // 观察所有子孙节点的变化
        };

        // 优化：只监听特定的广告容器
        const container = document.querySelector('#ad-container');
        if (container) {
            observer.observe(container, observerConfig);
        } else {
            observer.observe(document.body, observerConfig);
        }

        // 可选：在页面卸载时断开观察
        window.addEventListener('beforeunload', () => {
            observer.disconnect();
        });
    }

    /**
     * 特定元素移除模块
     * 负责移除与域名无关的特定元素，可以是任意选择器
     * @returns {boolean} 是否有广告被移除
     */
    function removeSpecificElements() {
        const specificSelectors = [
            '.h5p-recommend-wrap', // 例如 h5 播放器上的广告元素
            // 可以继续添加需要无条件移除的其他元素选择器
        ];

        const actualSelectors = removeElements(specificSelectors);
        observeDomChanges(specificSelectors);
        logGlobalRulesAndRemoval(specificSelectors, actualSelectors);
        return actualSelectors.length > 0;
    }

    /**
     * 域名处理模块
     * 负责定义不同域名对应的操作
     */
    const domainActions = [
        {
            domain: 'waipian', // 目标域名
            selectors: [
                '#dy_card_dy', // 最上层的广告
                '.player-rm.rm-two.rm-list', // 播放器下面的广告
                '.player_pic_link', // 暂停出现的广告
                '.close-player_pic', // 暂停出现的广告的关闭按钮
                '.ppppplayer_pic_link'
            ],
            action: function () {
                const actualSelectors = removeElements(this.selectors);
                if (actualSelectors.length > 0) {
                    observeDomChanges(this.selectors);
                    logDomainMatchAndRemoval(this.domain, this.selectors, actualSelectors);
                    return true;
                }
                return false;
            }
        },
        {
            domain: 'example', // 示例域名，可以根据实际需要添加
            selectors: [
                '.example-ad',
                '.example-popup'
            ],
            action: function () {
                const actualSelectors = removeElements(this.selectors);
                if (actualSelectors.length > 0) {
                    observeDomChanges(this.selectors);
                    logDomainMatchAndRemoval(this.domain, this.selectors, actualSelectors);
                    return true;
                }
                return false;
            }
        }
        // 可以继续添加更多域名及其对应的广告移除规则
    ];

    /**
     * 域名检查和广告移除模块
     * 负责检查域名，并执行相应的操作
     * @returns {boolean} 是否有广告被移除
     */
    function handleDomainSpecificAds() {
        const currentDomain = window.location.hostname;
        let actionExecuted = false;

        domainActions.forEach(domainAction => {
            if (currentDomain.includes(domainAction.domain)) {
                if (domainAction.action()) {
                    actionExecuted = true;
                }
            }
        });

        return actionExecuted;
    }

    // 启动主控制函数
    main();

})();
