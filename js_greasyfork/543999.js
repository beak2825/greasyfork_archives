// ==UserScript==
// @name         south-plus域名自动替换 (v2.0)
// @namespace    https://github.com/qgdyyg/automatically-replace-southplus-domain
// @version      2.0
// @description  自动替换域名并支持自定义替换规则
// @author       qgdyyg
// @match        *://*/*
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_webRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/543999/south-plus%E5%9F%9F%E5%90%8D%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%20%28v20%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543999/south-plus%E5%9F%9F%E5%90%8D%E8%87%AA%E5%8A%A8%E6%9B%BF%E6%8D%A2%20%28v20%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 初始化存储的替换规则
    const DEFAULT_RULES = [
        { source: 'south-plus.net', target: 'bbs.imoutolove.me' },
        { source: 'north-plus.net', target: 'bbs.imoutolove.me' },
        { source: 'white-plus.net', target: 'bbs.imoutolove.me' },
        { source: 'blue-plus.net', target: 'bbs.imoutolove.me' },
        { source: 'snow-plus.net', target: 'bbs.imoutolove.me' },
        { source: 'spring-plus.net', target: 'bbs.imoutolove.me' }
    ];

    // 从存储加载用户规则，如果没有则使用默认规则
    let REPLACEMENT_RULES = GM_getValue('replacementRules', DEFAULT_RULES);

    // 配置区域
    const CONFIG = {
        debug: false,
        autoRefresh: true,
        refreshDelay: 1500
    };

    // 保存规则到存储
    const saveRules = () => {
        GM_setValue('replacementRules', REPLACEMENT_RULES);
        if (CONFIG.debug) {
            console.log('[规则保存] 替换规则已保存', REPLACEMENT_RULES);
        }
    };

    // 重置为默认规则
    const resetToDefault = () => {
        REPLACEMENT_RULES = [...DEFAULT_RULES];
        saveRules();
        alert('已重置为默认替换规则');
    };

    // 添加新规则
    const addRule = () => {
        const source = prompt('请输入要替换的源域名 (例如: example.com)', '');
        if (!source) return;
        
        const target = prompt('请输入替换后的目标域名 (例如: newdomain.com)', 'bbs.imoutolove.me');
        if (!target) return;
        
        // 确保域名格式正确
        const cleanSource = source.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
        const cleanTarget = target.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
        
        if (!cleanSource || !cleanTarget) {
            alert('域名格式不正确，请重新输入');
            return;
        }
        
        // 检查是否已存在相同源域名的规则
        const exists = REPLACEMENT_RULES.some(rule => rule.source === cleanSource);
        if (exists) {
            if (!confirm(`已存在源域名为 "${cleanSource}" 的规则，是否覆盖？`)) {
                return;
            }
            REPLACEMENT_RULES = REPLACEMENT_RULES.filter(rule => rule.source !== cleanSource);
        }
        
        REPLACEMENT_RULES.push({ source: cleanSource, target: cleanTarget });
        saveRules();
        alert(`已添加新规则:\n${cleanSource} → ${cleanTarget}`);
    };

    // 编辑现有规则
    const editRule = () => {
        if (REPLACEMENT_RULES.length === 0) {
            alert('当前没有可用的替换规则');
            return;
        }
        
        const ruleList = REPLACEMENT_RULES.map((rule, i) => 
            `${i + 1}. ${rule.source} → ${rule.target}`
        ).join('\n');
        
        const index = prompt(
            '请输入要编辑的规则编号:\n\n' + ruleList, 
            '1'
        );
        
        if (!index) return;
        
        const ruleIndex = parseInt(index) - 1;
        if (isNaN(ruleIndex) || ruleIndex < 0 || ruleIndex >= REPLACEMENT_RULES.length) {
            alert('无效的规则编号');
            return;
        }
        
        const currentRule = REPLACEMENT_RULES[ruleIndex];
        const newSource = prompt('修改源域名:', currentRule.source);
        if (newSource === null) return; // 用户点击了取消
        
        const newTarget = prompt('修改目标域名:', currentRule.target);
        if (newTarget === null) return; // 用户点击了取消
        
        // 确保域名格式正确
        const cleanSource = newSource.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
        const cleanTarget = newTarget.replace(/^https?:\/\//, '').replace(/\/.*$/, '').trim();
        
        if (!cleanSource || !cleanTarget) {
            alert('域名格式不正确，请重新输入');
            return;
        }
        
        // 检查是否已存在相同源域名的规则（除了当前规则）
        const exists = REPLACEMENT_RULES.some((rule, i) => 
            i !== ruleIndex && rule.source === cleanSource
        );
        
        if (exists) {
            if (!confirm(`已存在源域名为 "${cleanSource}" 的规则，是否覆盖？`)) {
                return;
            }
            REPLACEMENT_RULES = REPLACEMENT_RULES.filter((_, i) => i !== ruleIndex);
            REPLACEMENT_RULES.push({ source: cleanSource, target: cleanTarget });
        } else {
            REPLACEMENT_RULES[ruleIndex] = { 
                source: cleanSource, 
                target: cleanTarget 
            };
        }
        
        saveRules();
        alert(`规则已更新:\n${cleanSource} → ${cleanTarget}`);
    };

    // 删除规则
    const deleteRule = () => {
        if (REPLACEMENT_RULES.length === 0) {
            alert('当前没有可用的替换规则');
            return;
        }
        
        const ruleList = REPLACEMENT_RULES.map((rule, i) => 
            `${i + 1}. ${rule.source} → ${rule.target}`
        ).join('\n');
        
        const index = prompt(
            '请输入要删除的规则编号:\n\n' + ruleList, 
            '1'
        );
        
        if (!index) return;
        
        const ruleIndex = parseInt(index) - 1;
        if (isNaN(ruleIndex) || ruleIndex < 0 || ruleIndex >= REPLACEMENT_RULES.length) {
            alert('无效的规则编号');
            return;
        }
        
        const rule = REPLACEMENT_RULES[ruleIndex];
        if (confirm(`确定要删除规则吗?\n${rule.source} → ${rule.target}`)) {
            REPLACEMENT_RULES = REPLACEMENT_RULES.filter((_, i) => i !== ruleIndex);
            saveRules();
            alert('规则已删除');
        }
    };

    // 显示当前规则
    const showCurrentRules = () => {
        if (REPLACEMENT_RULES.length === 0) {
            alert('当前没有配置替换规则');
            return;
        }
        
        const ruleList = REPLACEMENT_RULES.map(rule => 
            `• ${rule.source} → ${rule.target}`
        ).join('\n');
        
        alert(
            `当前替换规则 (${REPLACEMENT_RULES.length}条):\n\n` +
            ruleList + 
            '\n\n点击 plus.net 域名链接将自动替换为目标域名'
        );
    };

    // 注册右键菜单
    GM_registerMenuCommand('🛠️ 配置自动替换规则', () => {
        const options = [
            '1. 查看当前规则',
            '2. 添加新规则',
            '3. 编辑现有规则',
            '4. 删除规则',
            '5. 重置为默认规则',
            '6. 退出'
        ].join('\n');
        
        const choice = prompt(
            `请选择操作:\n\n${options}`, 
            '1'
        );
        
        switch (choice) {
            case '1':
                showCurrentRules();
                break;
            case '2':
                addRule();
                break;
            case '3':
                editRule();
                break;
            case '4':
                deleteRule();
                break;
            case '5':
                if (confirm('确定要重置为默认规则吗？当前自定义规则将丢失')) {
                    resetToDefault();
                }
                break;
            default:
                // 任何其他选择或取消都视为退出
                break;
        }
    });

    // 1. 点击链接时替换域名
    document.addEventListener('click', function (e) {
        if (e.target.tagName.toLowerCase() === 'a') {
            try {
                const url = new URL(e.target.href);
                const matchedRule = REPLACEMENT_RULES.find(rule => 
                    url.hostname.endsWith(rule.source)
                );

                if (matchedRule) {
                    const oldUrl = e.target.href;
                    url.hostname = matchedRule.target;
                    const newUrl = url.toString();
                    
                    if (CONFIG.debug) {
                        console.log(`[自动替换] ${oldUrl} → ${newUrl}`);
                    }
                    
                    e.preventDefault();
                    GM_openInTab(newUrl, {
                        active: true,
                        insert: true,
                        setParent: true
                    });
                }
            } catch (error) {
                console.warn('[链接解析失败]', e.target.href, error);
            }
        }
    });

    // 2. 使用 webRequest API 重定向请求
    const rules = REPLACEMENT_RULES.map(rule => ({
        selector: `*://*.${rule.source}/*`,
        action: {
            type: "redirect",
            redirectUrl: (details) => {
                const url = new URL(details.url);
                url.hostname = rule.target;
                const newUrl = url.toString();
                
                if (CONFIG.debug) {
                    console.log(`[请求重定向] ${details.url} → ${newUrl}`);
                }
                
                return newUrl;
            }
        }
    }));

    GM_webRequest(rules);

    // 3. 自动刷新失败页面功能
    if (CONFIG.autoRefresh) {
        const checkPageStatus = () => {
            const isEmpty = !document.body || 
                           (document.body.textContent || '').trim() === '' ||
                           document.body.innerHTML === '';
            
            const hasError = document.body && (
                document.body.textContent.includes('404') ||
                document.body.textContent.includes('Not Found') ||
                document.body.textContent.includes('Connection refused') ||
                document.body.textContent.includes('Unable to connect') ||
                document.body.textContent.includes('This site can’t be reached')
            );
            
            const currentDomain = window.location.hostname;
            const isTargetDomain = REPLACEMENT_RULES.some(rule => 
                currentDomain.endsWith(rule.source)
            );
            
            if (isTargetDomain && (isEmpty || hasError)) {
                if (CONFIG.debug) {
                    console.log('[自动刷新] 检测到加载失败页面，尝试刷新...');
                }
                
                try {
                    const url = new URL(window.location.href);
                    const matchedRule = REPLACEMENT_RULES.find(rule => 
                        currentDomain.endsWith(rule.source)
                    );
                    
                    if (matchedRule) {
                        url.hostname = matchedRule.target;
                        const newUrl = url.toString();
                        
                        if (CONFIG.debug) {
                            console.log(`[自动刷新] 尝试重定向: ${window.location.href} → ${newUrl}`);
                        }
                        
                        setTimeout(() => {
                            window.location.replace(newUrl);
                        }, CONFIG.refreshDelay);
                    }
                } catch (error) {
                    console.error('[自动刷新] 重定向失败:', error);
                }
            }
        };
        
        window.addEventListener('load', checkPageStatus);
        setInterval(checkPageStatus, 3000);
    }
    
    // 4. 添加视觉指示器（脚本运行状态提示）
    GM_addStyle(`
        .vm-plusnet-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 9999;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            cursor: pointer;
            animation: vm-pulse 2s infinite;
            user-select: none;
        }
        @keyframes vm-pulse {
            0% { opacity: 0.7; }
            50% { opacity: 1; }
            100% { opacity: 0.7; }
        }
    `);
    
    const indicator = document.createElement('div');
    indicator.className = 'vm-plusnet-indicator';
    indicator.textContent = `自动替换已启用 (${REPLACEMENT_RULES.length}条规则) ✅`;
    indicator.title = '点击显示当前规则';
    indicator.addEventListener('click', showCurrentRules);
    document.body.appendChild(indicator);
})();