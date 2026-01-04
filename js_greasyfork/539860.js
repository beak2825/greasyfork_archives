// ==UserScript==
// @name         Google搜索结果新标签页打开
// @namespace    https://github.com/xiaoma
// @version      1.0.0
// @description  让Google搜索结果自动在新标签页中打开
// @author       xiaoma
// @license      MIT
// @match        https://www.google.com/search*
// @match        https://www.google.com.hk/search*
// @match        https://www.google.co.jp/search*
// @match        https://www.google.co.uk/search*
// @match        https://www.google.ca/search*
// @match        https://www.google.com.au/search*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/539860/Google%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/539860/Google%E6%90%9C%E7%B4%A2%E7%BB%93%E6%9E%9C%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    /**
     * 为Google搜索结果添加新标签页打开属性
     */
    function hookGoogle() {
        // 选择搜索结果区域的所有链接
        const searchLinks = document.querySelectorAll("#center_col a, #rso a");
        
        searchLinks.forEach(link => {
            // 只处理搜索结果链接，排除Google内部链接
            if (!link.getAttribute("target") && 
                !link.href.includes("google.com") && 
                !link.href.includes("accounts.google") &&
                !link.href.includes("support.google")) {
                
                link.setAttribute("target", "_blank");
                // 添加安全属性，防止新页面访问原页面
                link.setAttribute("rel", "noopener noreferrer");
            }
        });
    }
    
    /**
     * 初始化脚本
     */
    function init() {
        // 页面加载完成后立即执行一次
        hookGoogle();
        
        // 定期检查新加载的搜索结果（处理动态加载内容）
        const observer = new MutationObserver((mutations) => {
            let shouldHook = false;
            
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldHook = true;
                }
            });
            
            if (shouldHook) {
                setTimeout(hookGoogle, 100);
            }
        });
        
        // 监听搜索结果区域的变化
        const searchContainer = document.querySelector("#center_col") || document.querySelector("#rso");
        if (searchContainer) {
            observer.observe(searchContainer, {
                childList: true,
                subtree: true
            });
        }
        
        // 兜底方案：定期执行
        setInterval(hookGoogle, 1000);
    }
    
    // 确保页面完全加载后再执行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    console.log('Google搜索结果新标签页脚本已启动');
})();