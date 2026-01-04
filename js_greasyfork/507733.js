// ==UserScript==
// @name         已访问链接颜色标记
// @version      2.1
// @description  标记已访问链接的颜色，支持多种自定义颜色设置
// @author       DeepSeek
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @run-at       document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/507733/%E5%B7%B2%E8%AE%BF%E9%97%AE%E9%93%BE%E6%8E%A5%E9%A2%9C%E8%89%B2%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/507733/%E5%B7%B2%E8%AE%BF%E9%97%AE%E9%93%BE%E6%8E%A5%E9%A2%9C%E8%89%B2%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置数据 ====================
    
    // 预设颜色配置
    const PRESET_COLORS = {
        '红色': '#FF0000',
        '蓝色': '#0066CC',
        '绿色': '#00AA00',
        '紫色': '#800080',
        '橙色': '#FF6600',
        '粉色': '#FF1493',
        '深蓝': '#00008B',
        '灰色': '#808080',
        '金色': '#FFD700'
    };

    // 颜色名称映射（支持中英文）
    const COLOR_NAME_MAP = {
        // 中文名称
        '红色': '#FF0000', '蓝色': '#0000FF', '绿色': '#00FF00',
        '黄色': '#FFFF00', '黑色': '#000000', '白色': '#FFFFFF',
        '灰色': '#808080', '橙色': '#FFA500', '紫色': '#800080',
        '青色': '#00FFFF', '粉色': '#FFC0CB', '棕色': '#8B4513',
        '深红': '#8B0000', '深蓝': '#00008B', '深绿': '#006400',
        '浅蓝': '#ADD8E6', '浅绿': '#90EE90', '浅灰': '#D3D3D3',
        '金色': '#FFD700', '银色': '#C0C0C0', '青色': '#00FFFF',
        '品红': '#FF00FF', '茶色': '#D2B48C', '橄榄色': '#808000',
        // 英文名称
        'red': '#FF0000', 'blue': '#0000FF', 'green': '#00FF00',
        'yellow': '#FFFF00', 'black': '#000000', 'white': '#FFFFFF',
        'gray': '#808080', 'orange': '#FFA500', 'purple': '#800080',
        'cyan': '#00FFFF', 'pink': '#FFC0CB', 'brown': '#8B4513',
        'darkred': '#8B0000', 'darkblue': '#00008B', 'darkgreen': '#006400',
        'lightblue': '#ADD8E6', 'lightgreen': '#90EE90', 'lightgray': '#D3D3D3',
        'gold': '#FFD700', 'silver': '#C0C0C0', 'magenta': '#FF00FF',
        'beige': '#D2B48C', 'olive': '#808000',
        // 特殊值
        '透明': 'transparent', 'transparent': 'transparent'
    };

    // ==================== 状态管理 ====================
    
    // 当前用户设置
    const userSettings = {
        color: '#FF0000'
    };

    // 已访问链接集合（使用Set提高性能）
    let visitedLinks = new Set();

    // ==================== 核心功能 ====================
    
    /**
     * 初始化脚本
     */
    function initializeScript() {
        loadSavedData();
        setupEventListeners();
        createStyleSheet();
        registerMenuCommands();
        applyInitialStyles();
    }

    /**
     * 加载保存的数据
     */
    function loadSavedData() {
        // 加载用户设置
        userSettings.color = GM_getValue('linkColor', '#FF0000');
        
        // 加载已访问链接
        try {
            const savedLinks = GM_getValue('visitedLinks', '[]');
            const linksArray = JSON.parse(savedLinks);
            visitedLinks = new Set(linksArray);
        } catch (error) {
            console.warn('加载已访问链接失败:', error);
            visitedLinks = new Set();
        }
    }

    /**
     * 创建样式表
     */
    function createStyleSheet() {
        const css = `
            /* 已访问链接基础样式 - 仅修改颜色 */
            a.visited-link-color {
                color: ${userSettings.color} !important;
            }
            
            /* 增强选择器以覆盖更多场景 */
            button a.visited-link-color,
            div a.visited-link-color,
            span a.visited-link-color,
            li a.visited-link-color,
            td a.visited-link-color,
            .link a.visited-link-color,
            .btn a.visited-link-color,
            .menu-item a.visited-link-color,
            .nav-link a.visited-link-color,
            .item a.visited-link-color,
            .title a.visited-link-color,
            .content a.visited-link-color {
                color: ${userSettings.color} !important;
            }
        `;
        
        GM_addStyle(css);
    }

    /**
     * 更新样式表
     */
    function updateStyleSheet() {
        // 移除旧样式
        const oldStyle = document.getElementById('visited-links-color-style');
        if (oldStyle) oldStyle.remove();
        
        // 添加新样式
        const newCss = `
            <style id="visited-links-color-style">
                a.visited-link-color {
                    color: ${userSettings.color} !important;
                }
                
                button a.visited-link-color,
                div a.visited-link-color,
                span a.visited-link-color,
                li a.visited-link-color,
                td a.visited-link-color,
                .link a.visited-link-color,
                .btn a.visited-link-color {
                    color: ${userSettings.color} !important;
                }
            </style>
        `;
        document.head.insertAdjacentHTML('beforeend', newCss);
    }

    /**
     * 标记链接为已访问
     */
    function markLinkAsVisited(linkElement) {
        if (!linkElement || !linkElement.href) return;
        
        const linkUrl = linkElement.href;
        
        // 如果已经标记过，跳过
        if (visitedLinks.has(linkUrl)) return;
        
        // 添加到集合并添加样式类
        visitedLinks.add(linkUrl);
        linkElement.classList.add('visited-link-color');
        
        // 延迟保存以优化性能
        debouncedSaveVisitedLinks();
    }

    /**
     * 应用初始样式到已访问链接
     */
    function applyInitialStyles() {
        // 等待页面完全加载
        setTimeout(() => {
            const allLinks = document.querySelectorAll('a[href]');
            
            allLinks.forEach(link => {
                if (visitedLinks.has(link.href)) {
                    link.classList.add('visited-link-color');
                }
            });
        }, 1000);
    }

    // ==================== 事件处理 ====================
    
    /**
     * 设置事件监听器
     */
    function setupEventListeners() {
        // 主点击事件（左键）
        document.addEventListener('click', handleClickEvent);
        
        // 中键点击事件
        document.addEventListener('auxclick', handleMiddleClick);
        
        // 监听动态添加的内容
        setupMutationObserver();
    }

    /**
     * 处理点击事件
     */
    function handleClickEvent(event) {
        const clickedElement = event.target;
        
        // 如果是链接直接标记
        if (clickedElement.tagName === 'A' && clickedElement.href) {
            markLinkAsVisited(clickedElement);
            return;
        }
        
        // 查找最近的链接元素
        const nearestLink = clickedElement.closest('a');
        if (nearestLink && nearestLink.href) {
            markLinkAsVisited(nearestLink);
            return;
        }
        
        // 检查按钮内是否包含链接
        const buttonElement = clickedElement.closest('button');
        if (buttonElement) {
            const linkInButton = buttonElement.querySelector('a[href]');
            if (linkInButton) {
                markLinkAsVisited(linkInButton);
            }
        }
    }

    /**
     * 处理中键点击
     */
    function handleMiddleClick(event) {
        if (event.button === 1) { // 中键
            handleClickEvent(event);
        }
    }

    /**
     * 设置DOM变化观察器
     */
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 元素节点
                        // 检查新节点中的链接
                        const links = node.querySelectorAll ? 
                                     node.querySelectorAll('a[href]') : [];
                        links.forEach(link => {
                            if (visitedLinks.has(link.href)) {
                                link.classList.add('visited-link-color');
                            }
                        });
                        
                        // 如果节点本身就是链接
                        if (node.tagName === 'A' && node.href && 
                            visitedLinks.has(node.href)) {
                            node.classList.add('visited-link-color');
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ==================== 用户界面 ====================
    
    /**
     * 注册菜单命令
     */
    function registerMenuCommands() {
        // 预设颜色菜单
        Object.entries(PRESET_COLORS).forEach(([name, color]) => {
            GM_registerMenuCommand(`使用${name}`, () => {
                applyPresetColor(color, name);
            });
        });

        // 自定义颜色
        GM_registerMenuCommand('自定义颜色', () => {
            showColorCustomizationDialog();
        });

        // 清除记录
        GM_registerMenuCommand('清除访问记录', () => {
            clearAllRecords();
        });

        // 重置为默认设置
        GM_registerMenuCommand('重置为红色', () => {
            resetToDefaultColor();
        });
    }

    /**
     * 应用预设颜色
     */
    function applyPresetColor(color, name) {
        userSettings.color = color;
        GM_setValue('linkColor', color);
        updateStyleSheet();
        refreshAllVisitedLinks();
        
        alert(`已应用颜色：${name}`);
    }

    /**
     * 显示颜色自定义对话框
     */
    function showColorCustomizationDialog() {
        const promptMessage = generateColorPromptMessage();
        const currentValue = userSettings.color;
        const userInput = prompt(promptMessage, currentValue);
        
        if (userInput === null) return; // 用户取消
        
        const colorValue = parseColorInput(userInput.trim());
        
        if (validateColor(colorValue)) {
            userSettings.color = colorValue;
            GM_setValue('linkColor', colorValue);
            updateStyleSheet();
            refreshAllVisitedLinks();
            alert('颜色已更新！');
        } else {
            alert('无效的颜色值！请使用有效的颜色名称或十六进制代码。');
        }
    }

    /**
     * 生成颜色提示信息
     */
    function generateColorPromptMessage() {
        let message = '请输入颜色值：\n\n';
        message += '当前颜色：' + userSettings.color + '\n\n';
        message += '支持以下格式：\n';
        message += '1. 颜色名称（中英文均可）\n';
        message += '2. 十六进制值（如 #FF0000 或 #F00）\n';
        message += '3. RGB值（如 rgb(255,0,0)）\n';
        message += '4. RGBA值（如 rgba(255,0,0,0.5)）\n\n';
        message += '常用颜色名称：\n';
        
        // 显示常用颜色，每行4个
        const commonColors = [
            '红色/red', '蓝色/blue', '绿色/green', '黄色/yellow',
            '黑色/black', '白色/white', '灰色/gray', '橙色/orange',
            '紫色/purple', '粉色/pink', '棕色/brown', '金色/gold',
            '银色/silver', '青色/cyan', '品红/magenta'
        ];
        
        for (let i = 0; i < commonColors.length; i += 4) {
            const line = commonColors.slice(i, i + 4)
                .map(color => color.padEnd(15))
                .join(' ');
            message += line + '\n';
        }
        
        message += '\n提示：输入"透明"或"transparent"可隐藏已访问链接';
        
        return message;
    }

    // ==================== 工具函数 ====================
    
    /**
     * 解析颜色输入
     */
    function parseColorInput(input) {
        // 检查是否为预设的颜色名称
        const lowerInput = input.toLowerCase();
        for (const [name, value] of Object.entries(COLOR_NAME_MAP)) {
            if (name.toLowerCase() === lowerInput) {
                return value;
            }
        }
        
        // 检查是否为十六进制颜色（3位、6位或8位）
        if (/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(input)) {
            // 如果是3位十六进制，转换为6位
            if (input.length === 4) { // #加上3位
                const r = input[1];
                const g = input[2];
                const b = input[3];
                return `#${r}${r}${g}${g}${b}${b}`;
            }
            return input;
        }
        
        // 检查是否为RGB/RGBA颜色
        if (/^rgba?\(/i.test(input)) {
            return input;
        }
        
        // 检查是否为HSL/HSLA颜色
        if (/^hsla?\(/i.test(input)) {
            return input;
        }
        
        // 检查是否为颜色关键字
        if (CSS.supports('color', input)) {
            return input;
        }
        
        // 返回原输入（将在验证阶段检查）
        return input;
    }

    /**
     * 验证颜色值
     */
    function validateColor(color) {
        // 如果是transparent，直接返回true
        if (color.toLowerCase() === 'transparent') return true;
        
        // 使用CSS.supports检查颜色有效性
        if (CSS && CSS.supports) {
            return CSS.supports('color', color);
        }
        
        // 降级方案：创建临时元素测试
        const testElement = document.createElement('div');
        testElement.style.color = 'rgb(0, 0, 0)'; // 先设置一个默认值
        testElement.style.color = color;
        return testElement.style.color !== 'rgb(0, 0, 0)';
    }

    /**
     * 刷新所有已访问链接的样式
     */
    function refreshAllVisitedLinks() {
        const visitedElements = document.querySelectorAll('.visited-link-color');
        visitedElements.forEach(element => {
            element.classList.remove('visited-link-color');
            // 强制重绘
            void element.offsetWidth;
            element.classList.add('visited-link-color');
        });
    }

    /**
     * 清除所有记录
     */
    function clearAllRecords() {
        if (confirm('确定要清除所有已访问链接的记录吗？\n此操作不可撤销。')) {
            visitedLinks.clear();
            GM_deleteValue('visitedLinks');
            
            // 移除所有样式类
            const visitedElements = document.querySelectorAll('.visited-link-color');
            visitedElements.forEach(element => {
                element.classList.remove('visited-link-color');
            });
            
            alert('已清除所有访问记录！');
        }
    }

    /**
     * 重置为默认颜色
     */
    function resetToDefaultColor() {
        if (confirm('确定要重置为默认颜色（红色）吗？')) {
            userSettings.color = '#FF0000';
            GM_setValue('linkColor', '#FF0000');
            updateStyleSheet();
            refreshAllVisitedLinks();
            alert('已重置为默认颜色（红色）！');
        }
    }

    // ==================== 性能优化 ====================
    
    /**
     * 防抖保存函数
     */
    let saveTimeout;
    function debouncedSaveVisitedLinks() {
        clearTimeout(saveTimeout);
        saveTimeout = setTimeout(() => {
            saveVisitedLinksToStorage();
        }, 1500);
    }

    /**
     * 保存已访问链接到存储
     */
    function saveVisitedLinksToStorage() {
        try {
            const linksArray = Array.from(visitedLinks);
            GM_setValue('visitedLinks', JSON.stringify(linksArray));
        } catch (error) {
            console.warn('保存已访问链接失败:', error);
        }
    }

    // ==================== 启动脚本 ====================
    
    // 延迟初始化以确保页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        // 如果文档已经加载完成，等待一小段时间再初始化
        setTimeout(initializeScript, 500);
    }

})();