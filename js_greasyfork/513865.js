// ==UserScript==
// @name         🤔知乎自动展开全文/免登录查看内容😀/浏览优化
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  帮助自动去除点击链接时的弹窗和自动展开全文，无痕浏览体验增强，如需留言需手动登录😔
// @author       hukker
// @match        https://zhuanlan.zhihu.com/p/*
// @match        https://www.zhihu.com/question/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513865/%F0%9F%A4%94%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E5%86%85%E5%AE%B9%F0%9F%98%80%E6%B5%8F%E8%A7%88%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/513865/%F0%9F%A4%94%E7%9F%A5%E4%B9%8E%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87%E5%85%8D%E7%99%BB%E5%BD%95%E6%9F%A5%E7%9C%8B%E5%86%85%E5%AE%B9%F0%9F%98%80%E6%B5%8F%E8%A7%88%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==    
(function() {
    'use strict';
    
    
    const addTransitionStyles = () => {
        const styleEl = document.createElement('style');
        styleEl.textContent = `
            .RichContent, .RichContent-inner, .ContentItem-content, .ContentItem-content > div {
                max-height: none !important;
                height: auto !important;
                overflow: visible !important;
                transition: none !important; 
            }
            .RichContent-mask, .ContentItem-image {
                display: none !important;
            }
            .Button--expand, .ContentItem-expandButton, .RichContent-collapsedText, .RichContent-expandButton {
                display: none !important;
                opacity: 0 !important;
                pointer-events: none !important;
            }
        `;
        document.head.appendChild(styleEl);
    };
    
    
    document.addEventListener('DOMContentLoaded', function() {
        addTransitionStyles();
        setTimeout(() => {
            removeDebugDivs();
            preventLoginPopups();
            removeLoginElements();
            expandContentImmediately();
        }, 50); 
    });
    
    
    window.addEventListener('load', function() {
        setupMutationObserver();
    });
    
    
    const removeDebugDivs = () => {
        const debugDivs = document.querySelectorAll('div[class^="css-fxar"], div[class^="css-"]'); 
        debugDivs.forEach(div => div.remove());
    };
    
    
    const preventLoginPopups = () => {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (!link.hasAttribute('data-processed')) {
                link.setAttribute('data-processed', 'true');
                link.addEventListener('click', function(event) {
                    if (link.href.includes('login') || link.href.includes('signin')) {
                        event.preventDefault();
                    }
                });
            }
        });
    };
    
    
    const removeLoginElements = () => {
        const elementsToRemove = [
            '.signFlowModal-container',
            '.Modal-backdrop',
            '.Modal-wrapper',
            '.Modal',
            '[class*="Login-"]', 
            '.wucaiCommentIcon',
            '.Button.Modal-closeButton',
            '.Modal-enter-done',
            '.css-1ynzxqw', 
            '.RichContent-image--login', 
            '.QuestionHeader-content--login', 
            '.Button.AttentionButton.ContentItem-rightButton.AttentionButton--gray', 
        ];

        elementsToRemove.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => element.remove());
        });

        
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    };
    
    
    const expandContentImmediately = () => {
        
        const expandButtons = document.querySelectorAll('.Button--expand, .ContentItem-expandButton, .RichContent-collapsedText, .RichContent-expandButton');
        expandButtons.forEach(button => {
            if (button && button.style.display !== 'none') {
                button.click();
                button.style.display = 'none';
            }
        });
        
        
        const collapsedContents = document.querySelectorAll('.RichContent--collapsed, .RichContent-inner--collapsed');
        collapsedContents.forEach(content => {
            content.classList.remove('RichContent--collapsed');
            content.classList.remove('RichContent-inner--collapsed');
        });
        
        
        const elementsWithHeightLimit = [
            '.RichContent',
            '.RichContent-inner',
            '.ContentItem-content',
            '.SearchResult-content',
            '.AuthorInfo',
            '[style*="max-height"]', 
            '[style*="height"]' 
        ];
        
        elementsWithHeightLimit.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element.style) {
                    element.style.maxHeight = 'none'; 
                    element.style.height = 'auto'; 
                    element.style.overflow = 'visible'; 
                }
            });
        });
    };
    
    
    const setupMutationObserver = () => {
        
        const observer = new MutationObserver((mutations) => {
            let needsExpand = false;
            let needsRemoveLogin = false;
            
            mutations.forEach(mutation => {
                
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { 
                            if (node.classList && (node.classList.contains('Modal') || 
                                 node.classList.contains('signFlowModal-container') ||
                                 node.classList.contains('Modal-backdrop') ||
                                 node.classList.contains('RichContent-image--login'))) { 
                                needsRemoveLogin = true;
                                needsExpand = true; 
                            }
                            
                            if (node.querySelector) {
                                if (node.querySelector('.RichContent--collapsed, .RichContent-inner--collapsed, .Button--expand, .ContentItem-expandButton')) {
                                    needsExpand = true;
                                }
                            }
                        }
                    });
                }
            });
            
            if (needsRemoveLogin) {
                removeLoginElements();
            }
            
            if (needsExpand) {
                expandContentImmediately();
            }
            
            
            preventLoginPopups();
        });
        
        const config = { 
            childList: true,
            subtree: true, 
            attributes: true 
        };
        
        
        observer.observe(document.body, config);
        
        
        setInterval(() => {
            removeLoginElements();
            expandContentImmediately();
        }, 2000); 
    };
})();