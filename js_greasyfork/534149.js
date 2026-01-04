// ==UserScript==
// @name        抖音联盟榜单
// @name:zh-CN  抖音联盟榜单
// @namespace   抖音联盟榜单
// @description 抖音联盟榜单爆款榜排名列表展示销量信息
// @description:zh-CN   抖音联盟榜单爆款榜排名列表展示销量信息
// @include     https://buyin.jinritemai.com/*
// @version     1.2.0
// @grant       GM_xmlhttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-start
// @license     MPL-2.0
// @icon        https://lf1-fe.ecombdstatic.com/obj/eden-cn/upelogps/bitbug_favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/534149/%E6%8A%96%E9%9F%B3%E8%81%94%E7%9B%9F%E6%A6%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/534149/%E6%8A%96%E9%9F%B3%E8%81%94%E7%9B%9F%E6%A6%9C%E5%8D%95.meta.js
// ==/UserScript==

(async() => {
    'use strict';

    // 默认配置
    const defaultConfig = {
        enableSaleYesterday: true,
        enableSaleDayBeforeYesterday: true,
        targetScript: "garfish_6ae3fa27.js",
        injectScript: "54128_764752b0c7.js"
    };

    // 配置管理
    function getConfig() {
        return {
            enableSaleYesterday: GM_getValue('enableSaleYesterday', defaultConfig.enableSaleYesterday),
            enableSaleDayBeforeYesterday: GM_getValue('enableSaleDayBeforeYesterday', defaultConfig.enableSaleDayBeforeYesterday),
            targetScript: GM_getValue('targetScript', defaultConfig.targetScript),
            injectScript: GM_getValue('injectScript', defaultConfig.injectScript)
        };
    }

    // 设置界面组件
    function createSettingsPanel() {
        const config = getConfig();
        const container = document.createElement('div');
        const shadow = container.attachShadow({ mode: 'open' });

        shadow.innerHTML = `
            <style>
                .tm-settings-container {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: white;
                    padding: 25px;
                    border-radius: 8px;
                    box-shadow: 0 0 15px rgba(0,0,0,0.2);
                    z-index: 9999;
                    font-family: Arial, sans-serif;
                    min-width: 400px;
                }
                .tm-settings-section {
                    margin: 20px 0;
                }
                .tm-settings-title {
                    font-size: 18px;
                    margin-bottom: 15px;
                    color: #333;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                .tm-settings-row {
                    margin: 15px 0;
                }
                .tm-settings-label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #555;
                }
                .tm-settings-input {
                    width: 100%;
                    padding: 8px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                .tm-settings-checkbox {
                    margin-right: 8px;
                }
                .tm-settings-buttons {
                    margin-top: 25px;
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                }
                .tm-settings-button {
                    padding: 8px 20px;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: all 0.2s;
                    font-size: 14px;
                }
                .tm-settings-save {
                    background: #007bff;
                    color: white;
                    border: none;
                }
                .tm-settings-save:hover {
                    background: #0056b3;
                }
                .tm-settings-cancel {
                    background: #f8f9fa;
                    border: 1px solid #ddd;
                }
                .tm-settings-cancel:hover {
                    background: #e9ecef;
                }
            </style>
            <div class="tm-settings-container">
                <div class="tm-settings-section">
                    <h3 class="tm-settings-title">销量显示设置</h3>
                    <div class="tm-settings-row">
                        <label class="tm-settings-label">
                            <input type="checkbox" 
                                   class="tm-settings-checkbox"
                                   id="tm-sale-yesterday" 
                                   ${config.enableSaleYesterday ? 'checked' : ''}>
                            显示昨日销量
                        </label>
                    </div>
                    <div class="tm-settings-row">
                        <label class="tm-settings-label">
                            <input type="checkbox" 
                                   class="tm-settings-checkbox"
                                   id="tm-sale-before-yesterday" 
                                   ${config.enableSaleDayBeforeYesterday ? 'checked' : ''}>
                            显示前日销量
                        </label>
                    </div>
                </div>

                <div class="tm-settings-section">
                    <h3 class="tm-settings-title">高级设置</h3>
                    <div class="tm-settings-row">
                        <label class="tm-settings-label">
                            目标脚本匹配：
                            <input type="text" 
                                   class="tm-settings-input"
                                   id="tm-target-script" 
                                   value="${config.targetScript}"
                                   placeholder="输入目标脚本文件名">
                        </label>
                    </div>
                    <div class="tm-settings-row">
                        <label class="tm-settings-label">
                            注入脚本匹配：
                            <input type="text" 
                                   class="tm-settings-input"
                                   id="tm-inject-script" 
                                   value="${config.injectScript}"
                                   placeholder="输入注入脚本路径">
                        </label>
                    </div>
                </div>

                <div class="tm-settings-buttons">
                    <button class="tm-settings-button tm-settings-cancel" id="tm-cancel">取消</button>
                    <button class="tm-settings-button tm-settings-save" id="tm-save">保存设置</button>
                </div>
            </div>
        `;

        // 事件绑定
        shadow.getElementById('tm-save').addEventListener('click', saveSettings);
        shadow.getElementById('tm-cancel').addEventListener('click', hideSettings);

        // 关闭处理
        document.addEventListener('click', (e) => !container.contains(e.target) && hideSettings());
        document.addEventListener('keyup', (e) => e.key === 'Escape' && hideSettings());

        return container;
    }

    // 设置面板控制
    let settingsPanel = null;
    function showSettings() {
        if (!document.body) return setTimeout(showSettings, 100);
        if (!settingsPanel) settingsPanel = createSettingsPanel();
        document.body.appendChild(settingsPanel);
    }

    function hideSettings() {
        settingsPanel?.remove();
        settingsPanel = null;
    }

    // 保存配置
    function saveSettings() {
        const shadow = settingsPanel.shadowRoot;
        const newConfig = {
            enableSaleYesterday: shadow.getElementById('tm-sale-yesterday').checked,
            enableSaleDayBeforeYesterday: shadow.getElementById('tm-sale-before-yesterday').checked,
            targetScript: shadow.getElementById('tm-target-script').value.trim(),
            injectScript: shadow.getElementById('tm-inject-script').value.trim()
        };

        // 配置验证
        if (!newConfig.targetScript || !newConfig.injectScript) {
            alert('脚本配置不能为空');
            return;
        }

        // 保存配置
        GM_setValue('enableSaleYesterday', newConfig.enableSaleYesterday);
        GM_setValue('enableSaleDayBeforeYesterday', newConfig.enableSaleDayBeforeYesterday);
        GM_setValue('targetScript', newConfig.targetScript);
        GM_setValue('injectScript', newConfig.injectScript);

        // 刷新页面使配置生效
        if (confirm('需要刷新页面才能应用新配置，是否立即刷新？')) {
            window.location.reload();
        } else {
            hideSettings();
        }
    }

    // 初始化系统
    function init() {
        GM_registerMenuCommand('打开设置', showSettings);
    }

    // 启动逻辑
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 核心注入逻辑
    new MutationObserver(async (mutations, observer) => {
        const config = getConfig();
        const targetScript = mutations
            .flatMap(e => [...e.addedNodes])
            .find(n => n.tagName === 'SCRIPT' && n.src?.includes(config.targetScript));

        if (targetScript) {
            observer.disconnect();
            targetScript.remove();

            try {
                const originalText = await fetch(targetScript.src).then(r => r.text());
                const modifiedText = modifyScript(originalText, config);
                
                const newScript = document.createElement('script');
                newScript.textContent = modifiedText;
                document.head.appendChild(newScript);
            } catch (e) {
                console.error('脚本加载失败:', e);
            }
        }
    }).observe(document, { childList: true, subtree: true });

    // 脚本修改函数（修正正则版）
    function modifyScript(scriptText, config) {
        const injectionTemplates = [];
        
        // 生成需要注入的列配置
        if (config.enableSaleYesterday) {
            injectionTemplates.push(`{
                title: "昨日销量",
                key: "7",
                align: "right",
                className: __CLASS_NAME_PLACEHOLDER__,
                render: e => (0, _.jsx)("div", {
                    children: [JSON.stringify(e.board_data.axis.slice(-1)[0].y)]
                })
            }`);
        }
        
        if (config.enableSaleDayBeforeYesterday) {
            injectionTemplates.push(`{
                title: "前日销量",
                key: "8",
                align: "right",
                className: __CLASS_NAME_PLACEHOLDER__,
                render: e => (0, _.jsx)("div", {
                    children: [JSON.stringify(e.board_data.axis.slice(-2)[0].y)]
                })
            }`);
        }

        // 修正后的正则表达式
        const targetRegex = /execScript\((\w+),\w+\=\{\}.*?\{/;
        const replaceRegex = /(?<=,)\.{3}\w+===\w+\.\w+\.hot_rec/g;
        // const replaceRegex = /(?<=,)(\.\.\.\w+===(\w+\.\w+\.hot_rec))(?![\w.])(?:\s*\|\|\s*\.\.\.\w+===(\w+\.\w+\.hot_rec))*/g;

        return scriptText.replace(targetRegex, (match, codeVar) => `
            ${match}
            // 注入检测逻辑
            const isMatchJs = arguments[2]?.includes('/${config.injectScript}');
            if (isMatchJs) {
                // 获取样式类名
                const cssMatch = ${codeVar}.match(/className:\\s*(\\w+)\\.topVertical/);
                const className = cssMatch ? \`\${cssMatch[1]}.topVertical\` : '';
                
                // 替换目标代码
                ${codeVar} = arguments[0].replace(
                    ${replaceRegex},
                    // 不管有没有追加数据这里末尾都加个逗号
                    match => {
                        const injection = ${(JSON.stringify(injectionTemplates))}
                            .map(tpl => tpl.replace(/__CLASS_NAME_PLACEHOLDER__/g, className))
                            .join(',');

                        return injection ? \`\${injection},\${match}\` : match;
                        // return injection ? \`\${injection},\${match}\` : match;
                    }
                );

                // alert(${replaceRegex}.test(${codeVar}))
            }
        `);
    }
})();