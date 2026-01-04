// ==UserScript==
// @name         智能新标签页打开
// @name:en      Smart Tab Opener
// @name:zh-CN   智能新标签页打开
// @version      1.17
// @description  自动在新标签页打开链接，但保持导航类链接在当前页面跳转
// @description:en  Automatically open links in new tabs, but keep navigation class links on the current page
// @description:zh-CN  自动在新标签页打开链接，但保持导航类链接在当前页面跳转
// @author       dal
// @match        *://*/*
// @grant        none
// @license      MIT
// @icon         data:image/png;base64,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
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/518319/%E6%99%BA%E8%83%BD%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/518319/%E6%99%BA%E8%83%BD%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const NAV_RELATED_ELEMENTS = [
        'nav',
        'menu',
        'dropdown',
        'header',
        'select',
        'navigat',
        'section',
        'button',
    ];

    const DO_NOTHING_ELEMENTS = [
        'input',
        'button'
    ];
    
    // 导航相关的类名关键字
    const NAV_RELATED_CLASS_KEYWORDS = [
        'nav',
        'menu',
        'dropdown',
        'header',
        'select',
        'navigat',
        'breadcrumb',
        'section',
        'chapter',
        'tree',
        'n-tab-links',
        'channel',
        'side-bar',
        'sidebar',
        'wrapper',
        'outline',
        'folder'
    ];

    document.addEventListener('click', function(e) {
        console.log('点击事件触发:', e.target);
        
        // 查找被点击元素的最近的 A 标签父元素
        let target = e.target;
        if (DO_NOTHING_ELEMENTS.includes(target.tagName.toLowerCase())){
            console.log("什么也不做!");
            return;
        }
        while (target && target.tagName !== 'A') {
            target = target.parentElement;
        }
        
        // 如果找到了链接元素
        if (target && target.tagName === 'A') {
            let href = target.href;
            if (!href || href === '' || href.indexOf("#") != -1 ||
                href.startsWith('javascript')) {
                console.log('锚点跳转', target.href);
                return;
            }
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('找到链接元素:', target);
            console.log('链接href:', target.href);
            
            let isNavLink = false;
            
            // 检查父元素
            let parent = target;
            for (let depth = 0; depth < 5; depth++) {
                if (!parent) break;
                
                console.log(`检查第 ${depth + 1} 层父元素:`, parent.tagName, 
                    parent.classList ? Array.from(parent.classList) : '无类名',
                );
                
                // 检查标签名
                if (NAV_RELATED_ELEMENTS.includes(parent.tagName.toLowerCase())) {
                    console.log(`与导航相关的标签名:`, parent.tagName);
                    isNavLink = true;
                    break;
                }
                
                // 检查类名
                if (parent.classList && parent.classList.length > 0) {
                    if (NAV_RELATED_CLASS_KEYWORDS.some(navClass => 
                        Array.from(parent.classList).some(cls => 
                            cls.toLowerCase().includes(navClass.toLowerCase())
                        )
                    )) {
                        console.log(`与导航相关的类名:`, 
                            parent.classList ? Array.from(parent.classList) : '无类名',
                        );
                        isNavLink = true;
                        break;
                    }
                }
                
                // 检查链接本身的 ID
                if (parent.id) {
                    if (NAV_RELATED_CLASS_KEYWORDS.some(keyword => 
                        parent.id.toLowerCase().includes(keyword.toLowerCase())
                    )) {
                        console.log('与导航相关的的ID:', parent.id);
                        isNavLink = true;
                        break;
                    }
                }
                
                parent = parent.parentElement;
            }
            
            const url = target.href;
            if (url && !url.startsWith('javascript:')) {
                // 如果是导航链接
                if (isNavLink) {
                    console.log('这是一个导航链接');
                    // 检查是否设置为新标签页打开
                    if (target.target === '_blank') {
                        console.log('原本是新标签页打开，改为当前页面打开');
                        window.location.href = url;
                    } else {
                        window.location.href = url;
                        console.log('保持默认打开方式');
                    }
                } else {
                    // 非导航链接，在新标签页打开
                    console.log('非导航链接，在新标签页打开');
                    window.open(url, '_blank');
                }
            }
        }
    }, true);
})();