// ==UserScript==
// @name         已访问链接样式修改（带预设和自定义）
// @namespace    https://scriptcat.org/zh-CN/search
// @version      0.7
// @description  让点击过的链接变色并显示下划线，支持预设样式和自定义（含中文输入），支持鼠标中键点击和按钮内链接
// @tag          链接 工具 link tools
// @license      MIT
// @author       zzzwq&AI
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @icon         https://img.soogif.com/6QlDQPIFsYakXFhmBt1a02vNk9G5ecYf.gif
// @downloadURL https://update.greasyfork.org/scripts/546240/%E5%B7%B2%E8%AE%BF%E9%97%AE%E9%93%BE%E6%8E%A5%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%EF%BC%88%E5%B8%A6%E9%A2%84%E8%AE%BE%E5%92%8C%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546240/%E5%B7%B2%E8%AE%BF%E9%97%AE%E9%93%BE%E6%8E%A5%E6%A0%B7%E5%BC%8F%E4%BF%AE%E6%94%B9%EF%BC%88%E5%B8%A6%E9%A2%84%E8%AE%BE%E5%92%8C%E8%87%AA%E5%AE%9A%E4%B9%89%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 预设选项（保留字体粗度不变）
    const presets = {
        '红色实线': { color: '#FF0000', underline: 'solid' },
        '蓝色虚线': { color: '#0000FF', underline: 'dashed' },
        '绿色波浪线': { color: '#00FF00', underline: 'wavy' },
        '紫色双下划线': { color: '#800080', underline: 'double' },
        '橙色点状线': { color: '#FFA500', underline: 'dotted' }
    };

    // 中文映射表（保留字体粗度不变）
    const colorMap = {
        '红色': '#FF0000',
        '蓝色': '#0000FF',
        '绿色': '#00FF00',
        '黄色': '#FFFF00',
        '黑色': '#000000',
        '白色': '#FFFFFF',
        '灰色': '#808080',
        '橙色': '#FFA500',
        '紫色': '#800080',
        '青色': '#00FFFF',
        '品红': '#FF00FF',
        '透明': 'transparent',
        'red': '#FF0000',
        'blue': '#0000FF',
        'green': '#00FF00',
        'yellow': '#FFFF00',
        'black': '#000000',
        'white': '#FFFFFF',
        'gray': '#808080',
        'orange': '#FFA500',
        'purple': '#800080',
        'cyan': '#00FFFF',
        'magenta': '#FF00FF',
        'transparent': 'transparent'
    };

    const underlineMap = {
        '实线': 'solid',
        '虚线': 'dashed',
        '波浪线': 'wavy',
        '双线': 'double',
        '点状线': 'dotted',
        '无下划线': 'none',
        'solid': 'solid',
        'dashed': 'dashed',
        'wavy': 'wavy',
        'double': 'double',
        'dotted': 'dotted',
        'none': 'none'
    };

    // 获取当前设置
    const settings = {
        color: GM_getValue('linkColor', '#FF0000'),
        underline: GM_getValue('underlineType', 'solid'),
        weight: GM_getValue('linkWeight', '400')
    };

    // 使用Set存储已访问链接（性能优化）
    let visitedLinks = new Set();
    
    // 初始化已访问链接数据
    function initVisitedLinks() {
        try {
            const stored = GM_getValue('visitedLinks', '[]');
            const links = JSON.parse(stored);
            visitedLinks = new Set(links);
        } catch (e) {
            console.warn('Failed to load visited links:', e);
            visitedLinks = new Set();
        }
    }
    
    // 保存已访问链接到存储
    function saveVisitedLinks() {
        try {
            GM_setValue('visitedLinks', JSON.stringify([...visitedLinks]));
        } catch (e) {
            console.warn('Failed to save visited links:', e);
        }
    }

    // 生成提示信息的辅助函数 - 优化显示
    function generatePromptMessage(map, type) {
        const keys = Object.keys(map);
        const half = Math.ceil(keys.length / 2);
        let message = '支持输入以下值（中文/英文均可）：\n';
        
        for (let i = 0; i < half; i++) {
            const key1 = keys[i];
            const key2 = keys[i + half];
            const value1 = map[key1];
            const value2 = key2 ? map[key2] : '';
            
            // 格式化显示为两列
            const col1 = `${key1} (${value1})`;
            const col2 = key2 ? `${key2} (${value2})` : '';
            message += `${col1.padEnd(18)}${col2}\n`;
        }
        
        message += `\n其他格式：${type === 'color' ? '十六进制/RGB' : 'CSS标准值'}`;
        return message;
    }

    // 更新样式（使用更具体的选择器提高优先级）
    function updateStyles() {
        const css = `
            a.visited-link {
                color: ${settings.color} !important;
                text-decoration: ${settings.underline} underline !important;
                font-weight: ${settings.weight} !important;
            }
            
            /* 针对特殊网站增加更具体的选择器 */
            .menu-list a.visited-link,
            .nav-item a.visited-link,
            .list-item a.visited-link,
            .item a.visited-link,
            li a.visited-link,
            td a.visited-link,
            span a.visited-link,
            p a.visited-link,
            div a.visited-link {
                color: ${settings.color} !important;
                text-decoration: ${settings.underline} underline !important;
                font-weight: ${settings.weight} !important;
            }
        `;
        
        // 移除旧样式（如果存在）
        const oldStyle = document.getElementById('visited-links-style');
        if (oldStyle) {
            oldStyle.remove();
        }
        
        // 添加新样式
        GM_addStyle(css);
    }

    // 注册设置菜单
    function registerMenuCommands() {
        // 添加预设选项（不修改字体粗度）
        Object.entries(presets).forEach(([name, style]) => {
            GM_registerMenuCommand(`预设：${name}`, () => {
                settings.color = style.color;
                settings.underline = style.underline;
                GM_setValue('linkColor', style.color);
                GM_setValue('underlineType', style.underline);
                updateStyles();
                applyVisitedStyles(); // 重新应用样式
            });
        });

        // 自定义颜色（支持中文）
        GM_registerMenuCommand('自定义颜色', () => {
            const promptMessage = generatePromptMessage(colorMap, 'color');
            const input = prompt(promptMessage, settings.color);
            if (input) {
                const color = colorMap[input] || input;
                if (isValidColor(color)) {
                    settings.color = color;
                    GM_setValue('linkColor', color);
                    updateStyles();
                    applyVisitedStyles(); // 重新应用样式
                } else {
                    alert('无效的颜色值！');
                }
            }
        });

        // 自定义下划线（支持中文）
        GM_registerMenuCommand('自定义下划线', () => {
            const promptMessage = generatePromptMessage(underlineMap, 'underline');
            const input = prompt(promptMessage, settings.underline);
            if (input) {
                const underline = underlineMap[input] || input;
                if (isValidUnderline(underline)) {
                    settings.underline = underline;
                    GM_setValue('underlineType', underline);
                    updateStyles();
                    applyVisitedStyles(); // 重新应用样式
                } else {
                    alert('无效的下划线样式！');
                }
            }
        });

        // 自定义字体粗度（独立设置）
        GM_registerMenuCommand('自定义字体粗度', () => {
            const input = prompt('请输入字体粗度（100-900之间的整数）：', settings.weight);
            if (input) {
                const weight = parseInt(input);
                if (weight >= 100 && weight <= 900 && !isNaN(weight)) {
                    settings.weight = weight.toString();
                    GM_setValue('linkWeight', weight);
                    updateStyles();
                    applyVisitedStyles(); // 重新应用样式
                } else {
                    alert('请输入100到900之间的整数！');
                }
            }
        });

        // 清除已访问链接记录
        GM_registerMenuCommand('清除已访问链接记录', () => {
            if (confirm('确定要清除所有已访问链接的记录吗？')) {
                visitedLinks.clear();
                GM_deleteValue('visitedLinks');
                
                // 使用更高效的方式移除类
                const visitedElements = document.querySelectorAll('.visited-link');
                for (let i = 0; i < visitedElements.length; i++) {
                    visitedElements[i].classList.remove('visited-link');
                }
            }
        });
    }

    // 验证函数
    function isValidColor(value) {
        // 创建临时元素测试颜色值
        const temp = document.createElement('div');
        temp.style.color = 'rgb(0, 0, 0)';
        temp.style.color = value;
        return temp.style.color !== 'rgb(0, 0, 0)';
    }

    function isValidUnderline(value) {
        const validValues = ['solid', 'dashed', 'wavy', 'double', 'dotted', 'none'];
        return validValues.includes(value);
    }

    // 处理链接标记
    function markLinkAsVisited(link) {
        const href = link.href;
        if (!href || visitedLinks.has(href)) return;
        
        visitedLinks.add(href);
        link.classList.add('visited-link');
        
        // 使用防抖保存，避免频繁写入
        clearTimeout(window.visitedLinksSaveTimeout);
        window.visitedLinksSaveTimeout = setTimeout(saveVisitedLinks, 1000);
    }

    // 处理链接交互的通用函数
    function handleLinkInteraction(target) {
        // 向上查找最近的链接
        let link = target.closest('a');
        if (link && link.href) {
            markLinkAsVisited(link);
        }
    }

    // 初始应用样式 - 增强版本
    function applyVisitedStyles() {
        // 使用更高效的选择器
        const links = document.querySelectorAll('a[href]');
        const { length } = links;
        
        for (let i = 0; i < length; i++) {
            const link = links[i];
            if (visitedLinks.has(link.href)) {
                link.classList.add('visited-link');
            }
        }
    }

    // 检查并修复样式应用
    function checkAndFixStyles() {
        const visitedElements = document.querySelectorAll('.visited-link');
        for (let i = 0; i < visitedElements.length; i++) {
            const element = visitedElements[i];
            // 检查是否实际应用了样式
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.color !== settings.color.replace(/\s+/g, '') && 
                computedStyle.textDecorationLine.indexOf('underline') === -1) {
                // 重新添加类
                element.classList.remove('visited-link');
                setTimeout(() => {
                    element.classList.add('visited-link');
                }, 10);
            }
        }
    }

    // 初始化
    function init() {
        // 初始化已访问链接
        initVisitedLinks();
        
        // 更新样式
        updateStyles();
        
        // 注册菜单命令
        registerMenuCommands();
        
        // 初始应用样式
        setTimeout(applyVisitedStyles, 500); // 延迟执行以确保DOM完全加载

        // 使用事件委托提高性能
        document.addEventListener('click', function(e) {
            handleLinkInteraction(e.target);
        });

        // 中键点击事件处理
        document.addEventListener('auxclick', function(e) {
            if (e.button === 1) { // 鼠标中键
                handleLinkInteraction(e.target);
            }
        });

        // 按钮点击事件处理
        document.addEventListener('click', function(e) {
            const button = e.target.closest('button');
            if (button) {
                // 查找按钮内的链接
                const linkInButton = button.querySelector('a[href]');
                if (linkInButton) {
                    markLinkAsVisited(linkInButton);
                }
            }
        });

        // 使用更高效的DOM变化观察
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    // 只对新添加的节点应用样式
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) { // 元素节点
                            const links = node.querySelectorAll ? node.querySelectorAll('a[href]') : [];
                            for (let i = 0; i < links.length; i++) {
                                if (visitedLinks.has(links[i].href)) {
                                    links[i].classList.add('visited-link');
                                }
                            }
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        // 添加定期检查机制，确保样式正确应用（更温和的方式）
        let checkCount = 0;
        const maxChecks = 5;
        const checkInterval = setInterval(() => {
            if (checkCount >= maxChecks) {
                clearInterval(checkInterval);
                return;
            }
            checkAndFixStyles();
            checkCount++;
        }, 1000);
    }

    // 延迟初始化以提高页面加载性能
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100); // 延迟执行以减少对页面加载的影响
    }
})();