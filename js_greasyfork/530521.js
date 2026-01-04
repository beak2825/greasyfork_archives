// ==UserScript==
// @name         Chrome Extension Button Enabler
// @name:zh-CN   Chrome扩展按钮启用器
// @name:en      Chrome Extension Button Enabler
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Enables the "Add to Chrome" button for extensions marked as not following best practices
// @description:zh-CN  启用被标记为"未遵循最佳实践"的Chrome扩展的"添加至Chrome"按钮
// @description:en  Enables the "Add to Chrome" button for extensions marked as not following best practices
// @author       h7ml <h7ml@qq.com>
// @match        https://chrome.google.com/webstore/detail/*
// @match        https://chromewebstore.google.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/530521/Chrome%20Extension%20Button%20Enabler.user.js
// @updateURL https://update.greasyfork.org/scripts/530521/Chrome%20Extension%20Button%20Enabler.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 国际化支持: 支持多种语言的"添加到Chrome"按钮文本
    // Internationalization support: "Add to Chrome" button text in multiple languages
    const buttonTexts = {
        'en': 'Add to Chrome',
        'zh-CN': '添加至 Chrome',
        'zh-TW': '新增至 Chrome',
        'ja': 'Chromeに追加',
        'ko': 'Chrome에 추가',
        'de': 'Zu Chrome hinzufügen',
        'fr': 'Ajouter à Chrome',
        'es': 'Añadir a Chrome',
        'pt': 'Adicionar ao Chrome',
        'ru': 'Добавить в Chrome',
        'it': 'Aggiungi a Chrome',
        'ar': 'إضافة إلى Chrome',
        'hi': 'Chrome में जोड़ें',
        'tr': 'Chrome\'a ekle',
        'nl': 'Toevoegen aan Chrome',
        'pl': 'Dodaj do Chrome',
        'vi': 'Thêm vào Chrome',
        'th': 'เพิ่มใน Chrome'
    };
    
    // 启用按钮函数: 查找并启用被禁用的"添加到Chrome"按钮
    // Function to enable the button: Find and enable the disabled "Add to Chrome" button
    function enableButton() {
        // 通过多种方法定位目标按钮
        // Target the specific button using various methods
        let addButton = null;
        
        // 方法1: 使用提供的选择器
        // Method 1: Using the provided selector
        addButton = document.querySelector('button.UywwFc-LgbsSe.UywwFc-LgbsSe-OWXEXe-dgl2Hf.UywwFc-StrnGf-YYd4I-VtOx3e[jsname="wQO0od"]');
        
        if (!addButton) {
            // 方法2: 尝试通过可能常见的类名模式查找
            // Method 2: Try to find by class name patterns that might be common
            addButton = document.querySelector('button[disabled][jsname="wQO0od"]');
        }
        
        if (!addButton) {
            // 方法3: 尝试通过不同语言的按钮文本内容查找
            // Method 3: Try to find by content in different languages
            for (const lang in buttonTexts) {
                const buttonByText = Array.from(document.querySelectorAll('button')).find(
                    button => button.textContent.includes(buttonTexts[lang])
                );
                
                if (buttonByText) {
                    addButton = buttonByText;
                    break;
                }
            }
        }
        
        if (!addButton) {
            // 方法4: 查找任何可能是安装按钮的禁用按钮
            // Method 4: Find any disabled button that might be the install button
            const disabledButtons = document.querySelectorAll('button[disabled]');
            for (const button of disabledButtons) {
                // 检查是否可能是安装按钮(通常具有一些独特的类或属性)
                // Check if it's likely the install button (usually has some distinctive classes or attributes)
                if (button.classList.contains('UywwFc-LgbsSe') || 
                    button.hasAttribute('jscontroller') ||
                    button.querySelector('.UywwFc-vQzf8d')) {
                    addButton = button;
                    break;
                }
            }
        }
        
        if (addButton) {
            // 移除禁用属性
            // Remove the disabled attribute
            addButton.removeAttribute('disabled');
            
            // 使按钮在视觉上显示为启用状态
            // Make the button visually appear enabled
            addButton.style.opacity = '1';
            addButton.style.cursor = 'pointer';
            addButton.style.pointerEvents = 'auto';
            
            // 移除可能阻止点击的类
            // Remove classes that might prevent clicking
            const classesToRemove = ['UywwFc-LgbsSe-OWXEXe-QVCGsb', 'UywwFc-LgbsSe-OWXEXe-QVCGsb-Rt6MAe'];
            classesToRemove.forEach(className => {
                if (addButton.classList.contains(className)) {
                    addButton.classList.remove(className);
                }
            });
            
            // 如果可能，设置aria-disabled为false
            // Set aria-disabled to false if possible
            if (addButton.hasAttribute('aria-disabled')) {
                addButton.setAttribute('aria-disabled', 'false');
            }
            
            // 添加点击事件监听器，处理可能的覆盖层问题
            // Add click event listener to handle potential overlay issues
            addButton.addEventListener('click', function(e) {
                // 有时可能有不可见的覆盖层阻止点击
                // 这段代码帮助确保点击能够通过
                // Sometimes there might be invisible overlays preventing clicks
                // This code helps ensure the click gets through
                if (!e.isTrusted) {
                    return; // 只处理真实的用户点击 / Only process real user clicks
                }
                
                // 如果Chrome有额外的JS检查，尝试模拟一个干净的点击
                // In case Chrome has additional JS checks, try to simulate a clean click
                setTimeout(() => {
                    const clickEvent = new MouseEvent('click', {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    });
                    addButton.dispatchEvent(clickEvent);
                }, 100);
            });
            
            return true; // 表示成功找到并启用按钮 / Indicate successful button finding and enabling
        } else {
            setTimeout(enableButton, 1000);
            return false; // 表示未找到按钮 / Indicate button not found
        }
    }
    
    // 初始化函数
    // Initialization function
    function initialize() {
        // 初次尝试启用按钮
        // Initial try to enable button
        enableButton();
        
        // 设置定期检查，以防按钮动态加载
        // Set up a periodic check in case the button loads dynamically
        const checkInterval = setInterval(function() {
            const possibleButtons = document.querySelectorAll('button[disabled]');
            let needToEnable = false;
            
            possibleButtons.forEach(button => {
                // 检查是否与已知的按钮文本匹配
                // Check for any text match with our known button texts
                for (const lang in buttonTexts) {
                    if (button.textContent.includes(buttonTexts[lang])) {
                        needToEnable = true;
                        break;
                    }
                }
                
                // 同时检查我们已知的特定类
                // Also check for the specific class we know about
                if (button.classList.contains('UywwFc-LgbsSe')) {
                    needToEnable = true;
                }
            });
            
            if (needToEnable) {
                enableButton();
            }
        }, 2000);
        
        // 30秒后停止检查，避免不必要的处理
        // Stop checking after 30 seconds to avoid unnecessary processing
        setTimeout(() => {
            clearInterval(checkInterval);
        }, 30000);
        
        // 设置变异观察器，检测按钮可能被动态添加的情况
        // Set up a mutation observer to detect when the button might be added dynamically
        const observer = new MutationObserver(function(mutations) {
            let shouldEnableButton = false;
            
            mutations.forEach(function(mutation) {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    // 检查是否添加了禁用的按钮
                    // Check if any disabled buttons were added
                    for (let i = 0; i < mutation.addedNodes.length; i++) {
                        const node = mutation.addedNodes[i];
                        if (node.nodeType === 1) { // 元素节点 / Element node
                            if (node.tagName === 'BUTTON' && node.hasAttribute('disabled')) {
                                shouldEnableButton = true;
                                break;
                            } else if (node.querySelector && node.querySelector('button[disabled]')) {
                                shouldEnableButton = true;
                                break;
                            }
                        }
                    }
                } else if (mutation.type === 'attributes' && 
                          mutation.attributeName === 'disabled' && 
                          mutation.target.tagName === 'BUTTON') {
                    // 如果按钮的disabled属性发生变化
                    // If a button's disabled attribute changes
                    shouldEnableButton = true;
                }
            });
            
            if (shouldEnableButton) {
                enableButton();
            }
        });
        
        // 开始观察文档主体的变化
        // Begin observing the document body for changes
        observer.observe(document.body, { 
            childList: true,      // 监听子节点添加或删除 / Monitor child node additions or removals
            subtree: true,        // 监听所有后代节点 / Monitor all descendant nodes
            attributes: true,     // 监听属性变化 / Monitor attribute changes
            attributeFilter: ['disabled'] // 只监听disabled属性 / Only monitor the disabled attribute
        });
    }
    
    // 判断文档是否已经加载完成
    // Check if document is already loaded
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
    
    // 确保在页面完全加载后也尝试启用按钮
    // Ensure we also try to enable the button after the page is fully loaded
    window.addEventListener('load', function() {
        enableButton();
    });
    
    // 导出启用函数到全局，方便在控制台手动调用
    // Export enable function to global scope for manual calls from console
    window.__chromeButtonEnabler = {
        enableButton: enableButton
    };
})();
