// ==UserScript==
// @name         智能搜索结果屏蔽工具（带图形界面）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  带图形界面的搜索结果屏蔽工具，可自定义屏蔽规则
// @author       DeepSeek AI & 镰刀（只是当甲方，贡献都是AI的）
// @match        *://www.baidu.com/*
// @match        *://www.bing.com/*
// @match        *://*.google.com/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @icon         https://img.icons8.com/fluency/48/block.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538053/%E6%99%BA%E8%83%BD%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7%EF%BC%88%E5%B8%A6%E5%9B%BE%E5%BD%A2%E7%95%8C%E9%9D%A2%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/538053/%E6%99%BA%E8%83%BD%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E5%B1%8F%E8%94%BD%E5%B7%A5%E5%85%B7%EF%BC%88%E5%B8%A6%E5%9B%BE%E5%BD%A2%E7%95%8C%E9%9D%A2%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 加载保存的规则
    const loadRules = () => {
        const savedRules = GM_getValue('blockRules', null);
        return savedRules || [
            {
                id: Date.now(),
                keywords: ['吧友互助'],
                domains: ['*.baidu.com', '*.tieba.baidu.com', 'tieba.com'],
                note: '屏蔽百度贴吧吧友互助内容',
                enabled: true
            }
        ];
    };

    // 保存规则
    const saveRules = (rules) => {
        GM_setValue('blockRules', rules);
    };

    // 主屏蔽函数
    function blockResults() {
        const rules = loadRules().filter(rule => rule.enabled);

        // 获取所有搜索结果项（适配不同搜索引擎）
        const items = getSearchResultItems();

        items.forEach(item => {
            // 检查是否匹配任何屏蔽规则
            const shouldBlock = rules.some(rule =>
                matchRule(item, rule.keywords, rule.domains)
            );

            if (shouldBlock) {
                item.style.display = 'none';
            }
        });
    }

    // 获取搜索结果项（兼容不同搜索引擎）
    function getSearchResultItems() {
        // 百度
        if (window.location.host.includes('baidu')) {
            return Array.from(document.querySelectorAll('.c-container, .result'));
        }
        // Bing
        else if (window.location.host.includes('bing')) {
            return Array.from(document.querySelectorAll('.b_algo, .b_algoGroup'));
        }
        // Google
        else if (window.location.host.includes('google')) {
            return Array.from(document.querySelectorAll('.g, .tF2Cxc'));
        }
        // 默认选择器
        return Array.from(document.querySelectorAll('li, .result'));
    }

    // 检查元素是否匹配规则
    function matchRule(element, keywords, domains) {
        const textContent = element.textContent.toLowerCase();

        // 检查是否包含关键词
        const hasKeyword = keywords.some(keyword =>
            keyword && textContent.includes(keyword.toLowerCase())
        );

        // 如果关键词不匹配，直接返回false
        if (!hasKeyword) return false;

        // 检查是否包含目标域名
        const links = element.querySelectorAll('a');
        for (const link of links) {
            const href = link.href.toLowerCase();
            const matched = domains.some(domain => {
                // 处理通配符
                if (domain.startsWith('*.')) {
                    const baseDomain = domain.substring(2);
                    return href.includes(baseDomain);
                }
                return href.includes(domain);
            });

            if (matched) return true;
        }

        return false;
    }

    // 创建控制面板
    function createControlPanel() {
        // 创建主容器
        const panel = document.createElement('div');
        panel.id = 'blocker-panel';
        panel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 380px;
            background: rgba(25, 25, 40, 0.98);
            border-radius: 16px;
            padding: 20px;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.12);
            color: #f0f0f0;
            font-family: 'Segoe UI', system-ui, sans-serif;
            z-index: 10000;
            max-height: 85vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: transform 0.3s ease, opacity 0.3s ease;
            transform: translateY(0);
            opacity: 1;
        `;

        // 标题栏
        const header = document.createElement('div');
        header.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.15);
        `;

        const title = document.createElement('div');
        title.style.cssText = `
            display: flex;
            align-items: center;
            gap: 12px;
        `;

        const icon = document.createElement('div');
        icon.innerHTML = '🔍';
        icon.style.cssText = `
            width: 36px;
            height: 36px;
            background: linear-gradient(135deg, #ff8a00, #da1b60);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
        `;

        const titleText = document.createElement('div');
        titleText.innerHTML = `
            <div style="font-size: 1.4rem; font-weight: 700; color: #ff8a00;">搜索结果屏蔽工具</div>
            <div style="font-size: 0.9rem; color: #a0a0c0;">添加/管理屏蔽规则</div>
        `;

        title.appendChild(icon);
        title.appendChild(titleText);

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: none;
            color: #aaa;
            font-size: 1.6rem;
            cursor: pointer;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s ease;
        `;
        closeBtn.addEventListener('mouseover', () => {
            closeBtn.style.background = 'rgba(218, 27, 96, 0.3)';
            closeBtn.style.color = '#ff5577';
        });
        closeBtn.addEventListener('mouseout', () => {
            closeBtn.style.background = 'rgba(255, 255, 255, 0.1)';
            closeBtn.style.color = '#aaa';
        });
        closeBtn.addEventListener('click', () => {
            panel.style.transform = 'translateY(20px)';
            panel.style.opacity = '0';
            setTimeout(() => panel.style.display = 'none', 300);
        });

        header.appendChild(title);
        header.appendChild(closeBtn);
        panel.appendChild(header);

        // 规则表单
        const form = document.createElement('div');
        form.style.marginBottom = '25px';
        form.style.padding = '15px';
        form.style.background = 'rgba(0, 0, 0, 0.25)';
        form.style.borderRadius = '12px';

        const formTitle = document.createElement('div');
        formTitle.textContent = '添加新规则';
        formTitle.style.cssText = `
            margin: 0 0 18px 0;
            font-size: 1.15rem;
            font-weight: 600;
            color: #4df;
            display: flex;
            align-items: center;
            gap: 8px;
        `;
        formTitle.innerHTML = '<span style="font-size:1.2em">➕</span> 添加新规则';
        form.appendChild(formTitle);

        // 关键词输入
        const keywordGroup = document.createElement('div');
        keywordGroup.style.marginBottom = '18px';

        const keywordLabel = document.createElement('div');
        keywordLabel.textContent = '关键词（用逗号分隔）';
        keywordLabel.style.cssText = `
            margin-bottom: 8px;
            font-size: 0.95rem;
            color: #a0a0c0;
            display: flex;
            align-items: center;
            gap: 6px;
        `;
        keywordLabel.innerHTML = '🔤 关键词（用逗号分隔）';

        const keywordInput = document.createElement('input');
        keywordInput.type = 'text';
        keywordInput.placeholder = '例如: 吧友互助,广告,推广';
        keywordInput.style.cssText = `
            width: 100%;
            padding: 12px 15px;
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.15);
            background: rgba(40, 40, 60, 0.8);
            color: white;
            font-size: 0.95rem;
            transition: border 0.2s ease;
        `;

        keywordGroup.appendChild(keywordLabel);
        keywordGroup.appendChild(keywordInput);
        form.appendChild(keywordGroup);

        // 域名输入
        const domainGroup = document.createElement('div');
        domainGroup.style.marginBottom = '18px';

        const domainLabel = document.createElement('div');
        domainLabel.textContent = '域名（用逗号分隔，支持通配符）';
        domainLabel.style.cssText = keywordLabel.style.cssText;
        domainLabel.innerHTML = '🌐 域名（用逗号分隔，支持通配符）';

        const domainInput = document.createElement('input');
        domainInput.type = 'text';
        domainInput.placeholder = '例如: *.baidu.com, tieba.com, *.example.com';
        domainInput.style.cssText = keywordInput.style.cssText;

        domainGroup.appendChild(domainLabel);
        domainGroup.appendChild(domainInput);
        form.appendChild(domainGroup);

        // 备注输入
        const noteGroup = document.createElement('div');
        noteGroup.style.marginBottom = '20px';

        const noteLabel = document.createElement('div');
        noteLabel.textContent = '规则备注（可选）';
        noteLabel.style.cssText = keywordLabel.style.cssText;
        noteLabel.innerHTML = '📝 规则备注（可选）';

        const noteInput = document.createElement('input');
        noteInput.type = 'text';
        noteInput.placeholder = '例如: 屏蔽百度贴吧内容';
        noteInput.style.cssText = keywordInput.style.cssText;

        noteGroup.appendChild(noteLabel);
        noteGroup.appendChild(noteInput);
        form.appendChild(noteGroup);

        // 添加按钮
        const addBtn = document.createElement('button');
        addBtn.textContent = '添加屏蔽规则';
        addBtn.style.cssText = `
            background: linear-gradient(135deg, #ff8a00, #da1b60);
            color: white;
            border: none;
            padding: 13px 20px;
            border-radius: 10px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: 600;
            width: 100%;
            transition: all 0.3s ease;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 8px;
        `;
        addBtn.innerHTML = '🚫 添加屏蔽规则';

        addBtn.addEventListener('mouseover', () => {
            addBtn.style.transform = 'translateY(-2px)';
            addBtn.style.boxShadow = '0 8px 20px rgba(218, 27, 96, 0.5)';
        });
        addBtn.addEventListener('mouseout', () => {
            addBtn.style.transform = 'none';
            addBtn.style.boxShadow = 'none';
        });

        addBtn.addEventListener('click', () => {
            const keywords = keywordInput.value.split(',').map(k => k.trim()).filter(k => k);
            const domains = domainInput.value.split(',').map(d => d.trim()).filter(d => d);
            const note = noteInput.value.trim();

            if (keywords.length === 0 || domains.length === 0) {
                showNotification('请输入关键词和域名', 'warning');
                return;
            }

            const newRule = {
                id: Date.now(),
                keywords,
                domains,
                note: note || '未命名规则',
                enabled: true
            };

            const rules = loadRules();
            rules.push(newRule);
            saveRules(rules);

            // 重置表单
            keywordInput.value = '';
            domainInput.value = '';
            noteInput.value = '';

            // 刷新规则列表
            renderRulesList();

            // 重新应用屏蔽
            blockResults();

            showNotification('规则添加成功！', 'success');
        });

        form.appendChild(addBtn);
        panel.appendChild(form);

        // 规则列表
        const rulesListContainer = document.createElement('div');
        rulesListContainer.style.cssText = `
            flex: 1;
            overflow-y: auto;
            border-top: 1px solid rgba(255, 255, 255, 0.15);
            padding-top: 18px;
        `;

        const rulesTitle = document.createElement('div');
        rulesTitle.style.cssText = formTitle.style.cssText;
        rulesTitle.innerHTML = '<span style="font-size:1.2em">📋</span> 当前规则';
        rulesListContainer.appendChild(rulesTitle);

        const rulesList = document.createElement('div');
        rulesList.id = 'blocker-rules-list';
        rulesList.style.cssText = `
            max-height: 320px;
            overflow-y: auto;
            margin-top: 12px;
        `;

        rulesListContainer.appendChild(rulesList);
        panel.appendChild(rulesListContainer);

        // 渲染规则列表
        function renderRulesList() {
            const rules = loadRules();
            rulesList.innerHTML = '';

            if (rules.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.textContent = '没有添加任何规则';
                emptyMsg.style.cssText = `
                    text-align: center;
                    padding: 30px 20px;
                    color: #777;
                    font-style: italic;
                `;
                rulesList.appendChild(emptyMsg);
                return;
            }

            rules.forEach(rule => {
                const ruleEl = document.createElement('div');
                ruleEl.style.cssText = `
                    background: linear-gradient(to right, rgba(50, 50, 70, 0.6), rgba(40, 40, 60, 0.7));
                    border-radius: 12px;
                    padding: 16px;
                    margin-bottom: 14px;
                    position: relative;
                    border-left: 4px solid ${rule.enabled ? '#ff8a00' : '#555'};
                    transition: all 0.2s ease;
                `;

                const title = document.createElement('div');
                title.style.cssText = `
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 10px;
                `;

                const ruleTitle = document.createElement('div');
                ruleTitle.style.cssText = `
                    font-weight: 600;
                    font-size: 1.05rem;
                    color: ${rule.enabled ? '#ffaa44' : '#888'};
                    max-width: 70%;
                `;
                ruleTitle.textContent = rule.note;

                const toggle = document.createElement('div');
                toggle.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 8px;
                `;

                const toggleLabel = document.createElement('span');
                toggleLabel.textContent = rule.enabled ? '启用中' : '已禁用';
                toggleLabel.style.cssText = `
                    font-size: 0.85rem;
                    color: ${rule.enabled ? '#4df' : '#888'};
                `;

                const toggleSwitch = document.createElement('label');
                toggleSwitch.style.cssText = `
                    position: relative;
                    display: inline-block;
                    width: 44px;
                    height: 24px;
                `;

                const toggleInput = document.createElement('input');
                toggleInput.type = 'checkbox';
                toggleInput.checked = rule.enabled;
                toggleInput.style.cssText = `
                    opacity: 0;
                    width: 0;
                    height: 0;
                `;

                const toggleSlider = document.createElement('span');
                toggleSlider.style.cssText = `
                    position: absolute;
                    cursor: pointer;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: ${rule.enabled ? 'rgba(255, 138, 0, 0.3)' : '#555'};
                    transition: .4s;
                    border-radius: 24px;
                `;

                const toggleKnob = document.createElement('span');
                toggleKnob.style.cssText = `
                    position: absolute;
                    content: "";
                    height: 18px;
                    width: 18px;
                    left: 3px;
                    bottom: 3px;
                    background-color: ${rule.enabled ? '#ff8a00' : '#aaa'};
                    transition: .4s;
                    border-radius: 50%;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                `;

                toggleInput.addEventListener('change', () => {
                    rule.enabled = toggleInput.checked;
                    saveRules(rules);
                    ruleEl.style.borderLeftColor = rule.enabled ? '#ff8a00' : '#555';
                    ruleTitle.style.color = rule.enabled ? '#ffaa44' : '#888';
                    toggleLabel.textContent = rule.enabled ? '启用中' : '已禁用';
                    toggleLabel.style.color = rule.enabled ? '#4df' : '#888';
                    toggleKnob.style.backgroundColor = rule.enabled ? '#ff8a00' : '#aaa';
                    toggleSlider.style.backgroundColor = rule.enabled ? 'rgba(255, 138, 0, 0.3)' : '#555';
                    blockResults();
                });

                toggleSwitch.appendChild(toggleInput);
                toggleSwitch.appendChild(toggleSlider);
                toggleSwitch.appendChild(toggleKnob);

                toggle.appendChild(toggleLabel);
                toggle.appendChild(toggleSwitch);

                title.appendChild(ruleTitle);
                title.appendChild(toggle);
                ruleEl.appendChild(title);

                const keywords = document.createElement('div');
                keywords.textContent = `关键词: ${rule.keywords.join(', ')}`;
                keywords.style.cssText = `
                    font-size: 0.9rem;
                    margin-bottom: 8px;
                    color: #ddd;
                    padding: 8px;
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 6px;
                `;
                ruleEl.appendChild(keywords);

                const domains = document.createElement('div');
                domains.textContent = `域名: ${rule.domains.join(', ')}`;
                domains.style.cssText = keywords.style.cssText;
                ruleEl.appendChild(domains);

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = '删除规则';
                deleteBtn.style.cssText = `
                    position: absolute;
                    bottom: 16px;
                    right: 16px;
                    background: rgba(218, 27, 96, 0.2);
                    color: #ff5577;
                    border: none;
                    padding: 6px 12px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    transition: all 0.2s ease;
                `;
                deleteBtn.innerHTML = '🗑️ 删除规则';

                deleteBtn.addEventListener('mouseover', () => {
                    deleteBtn.style.background = 'rgba(218, 27, 96, 0.3)';
                    deleteBtn.style.color = '#ff7788';
                });
                deleteBtn.addEventListener('mouseout', () => {
                    deleteBtn.style.background = 'rgba(218, 27, 96, 0.2)';
                    deleteBtn.style.color = '#ff5577';
                });
                deleteBtn.addEventListener('click', () => {
                    if (confirm('确定要删除这条规则吗？')) {
                        const newRules = rules.filter(r => r.id !== rule.id);
                        saveRules(newRules);
                        renderRulesList();
                        blockResults();
                        showNotification('规则已删除', 'info');
                    }
                });
                ruleEl.appendChild(deleteBtn);

                rulesList.appendChild(ruleEl);
            });
        }

        // 初始渲染规则列表
        renderRulesList();

        // 添加面板到页面
        document.body.appendChild(panel);

        // 添加拖动功能
        let isDragging = false;
        let offsetX, offsetY;

        header.addEventListener('mousedown', (e) => {
            if (e.target === closeBtn) return;

            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;

            // 限制在窗口范围内
            const maxX = window.innerWidth - panel.offsetWidth;
            const maxY = window.innerHeight - panel.offsetHeight;

            panel.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
            panel.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = '';
        });

        return panel;
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? 'rgba(40, 167, 69, 0.9)' :
                        type === 'warning' ? 'rgba(255, 193, 7, 0.9)' :
                        type === 'error' ? 'rgba(220, 53, 69, 0.9)' : 'rgba(40, 40, 60, 0.9)'};
            color: white;
            padding: 14px 22px;
            border-radius: 10px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            z-index: 9998;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(5px);
            max-width: 300px;
            display: flex;
            align-items: center;
            gap: 12px;
            transform: translateY(20px);
            opacity: 0;
            transition: transform 0.3s ease, opacity 0.3s ease;
        `;

        const icon = document.createElement('div');
        icon.style.cssText = `
            font-size: 1.4rem;
        `;
        icon.textContent = type === 'success' ? '✅' :
                          type === 'warning' ? '⚠️' :
                          type === 'error' ? '❌' : 'ℹ️';

        const text = document.createElement('div');
        text.textContent = message;

        notification.appendChild(icon);
        notification.appendChild(text);
        document.body.appendChild(notification);

        // 显示动画
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 10);

        // 3秒后淡出
        setTimeout(() => {
            notification.style.transform = 'translateY(20px)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // 添加控制按钮
    function addControlButton() {
        const button = document.createElement('button');
        button.id = 'blocker-control-btn';
        button.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #ff8a00, #da1b60);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1.8rem;
            transition: all 0.3s ease;
        `;
        button.innerHTML = '🔍';

        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1) rotate(10deg)';
            button.style.boxShadow = '0 8px 25px rgba(218, 27, 96, 0.6)';
        });

        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1) rotate(0)';
            button.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
        });

        let panel = null;
        button.addEventListener('click', () => {
            if (!panel || panel.style.display === 'none') {
                if (!panel) {
                    panel = createControlPanel();
                    panel.style.display = 'block';
                } else {
                    panel.style.display = 'block';
                    panel.style.transform = 'translateY(0)';
                    panel.style.opacity = '1';
                }
            } else {
                panel.style.transform = 'translateY(20px)';
                panel.style.opacity = '0';
                setTimeout(() => panel.style.display = 'none', 300);
            }
        });

        document.body.appendChild(button);
    }

    // 添加全局样式
    GM_addStyle(`
        #blocker-panel input:focus {
            outline: none;
            border-color: #ff8a00;
            box-shadow: 0 0 0 3px rgba(255, 138, 0, 0.25);
        }

        #blocker-rules-list::-webkit-scrollbar {
            width: 8px;
        }

        #blocker-rules-list::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.15);
            border-radius: 4px;
        }

        #blocker-rules-list::-webkit-scrollbar-thumb {
            background: rgba(255, 138, 0, 0.6);
            border-radius: 4px;
        }

        #blocker-rules-list::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 138, 0, 0.8);
        }

        input[type="checkbox"]:checked + span > span {
            transform: translateX(20px);
        }
    `);

    // 注册菜单命令
    GM_registerMenuCommand('打开屏蔽工具', function() {
        const btn = document.getElementById('blocker-control-btn');
        if (btn) btn.click();
    });

    // 初始化
    function init() {
        // 添加控制按钮
        addControlButton();

        // 首次屏蔽
        blockResults();

        // 监听DOM变化处理动态内容
        const observer = new MutationObserver(blockResults);
        observer.observe(document.body, { childList: true, subtree: true });

        // 显示欢迎通知
        setTimeout(() => {
            const rulesCount = loadRules().length;
            showNotification(`搜索结果屏蔽工具已启用！已加载 ${rulesCount} 条规则`, 'success');
        }, 1500);
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 1000);
    }
})();