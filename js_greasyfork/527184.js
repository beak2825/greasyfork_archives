// ==UserScript==
// @name         通用新标签页打开链接
// @version      2.1
// @description  智能判断链接是否需要在新标签页打开
// @author       BeeThor
// @match        *://*/*
// @license      MIT
// @namespace https://github.com/yourusername
// @downloadURL https://update.greasyfork.org/scripts/527184/%E9%80%9A%E7%94%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/527184/%E9%80%9A%E7%94%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 配置项
    const config = {
        // 需要排除的容器类名或ID（导航栏、侧边栏、工具栏等）
        excludeContainers: [
            'nav', 'navigation', 'navbar', 'header', 'footer',
            'sidebar', 'menu', 'toolbar', 'timeline', 'pagination',
            'breadcrumb', 'dropdown', 'modal', 'dialog'
        ],
        
        // 需要排除的链接类型
        excludeLinkTypes: [
            'menu-item', 'nav-item', 'button', 'tab', 'logo',
            'icon', 'avatar', 'profile', 'search', 'login',
            'signup', 'download'
        ],
        
        // 主要内容区域的类名特征
        mainContentClasses: [
            'content', 'main', 'article', 'post', 'topic',
            'thread', 'list', 'body'
        ]
    };
    
    // 判断元素是否在指定的容器中
    function isInExcludedContainer(element) {
        let current = element;
        while (current && current !== document.body) {
            // 检查类名
            if (current.classList) {
                for (const className of config.excludeContainers) {
                    if (current.classList.toString().toLowerCase().includes(className)) {
                        return true;
                    }
                }
            }
            // 检查ID
            if (current.id) {
                for (const className of config.excludeContainers) {
                    if (current.id.toLowerCase().includes(className)) {
                        return true;
                    }
                }
            }
            // 检查标签名
            if (config.excludeContainers.includes(current.tagName.toLowerCase())) {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }
    
    // 判断链接是否应该被排除
    function shouldExcludeLink(element) {
        // 检查类名
        if (element.classList) {
            for (const type of config.excludeLinkTypes) {
                if (element.classList.toString().toLowerCase().includes(type)) {
                    return true;
                }
            }
        }
        
        // 检查是否是功能性链接
        if (element.href) {
            const href = element.href.toLowerCase();
            if (href.includes('#') || // 锚点链接
                href.includes('javascript:') || // JavaScript 链接
                href.endsWith('.zip') || // 下载链接
                href.endsWith('.pdf') || // PDF 文件
                href.includes('login') || // 登录相关
                href.includes('logout') || // 登出相关
                href.includes('signup') || // 注册相关
                href.includes('account')) { // 账户相关
                return true;
            }
        }
        
        return false;
    }
    
    // 判断链接是否在主要内容区域
    function isInMainContent(element) {
        let current = element;
        while (current && current !== document.body) {
            if (current.classList) {
                for (const className of config.mainContentClasses) {
                    if (current.classList.toString().toLowerCase().includes(className)) {
                        return true;
                    }
                }
            }
            current = current.parentElement;
        }
        return false;
    }
    
    // 使用事件委托处理所有点击事件
    document.addEventListener('click', function(e) {
        // 查找被点击的链接元素
        let target = e.target;
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        // 如果找到了链接元素
        if (target && target.tagName === 'A') {
            const href = target.getAttribute('href');
            
            // 如果链接有效
            if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
                // 判断是否应该在新标签页打开
                if (!isInExcludedContainer(target) && 
                    !shouldExcludeLink(target) &&
                    isInMainContent(target)) {
                    
                    // 阻止默认行为
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // 获取完整URL
                    const fullUrl = new URL(href, window.location.origin).href;
                    
                    // 在新标签页中打开
                    window.open(fullUrl, '_blank');
                }
            }
        }
    }, true);
})(); 