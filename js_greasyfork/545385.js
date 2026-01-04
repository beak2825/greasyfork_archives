// ==UserScript==
// @name         黑色模式 dark（系统识别版）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  劫持 系统 自动 dark 模式
// @author       Dahi（AI）
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545385/%E9%BB%91%E8%89%B2%E6%A8%A1%E5%BC%8F%20dark%EF%BC%88%E7%B3%BB%E7%BB%9F%E8%AF%86%E5%88%AB%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545385/%E9%BB%91%E8%89%B2%E6%A8%A1%E5%BC%8F%20dark%EF%BC%88%E7%B3%BB%E7%BB%9F%E8%AF%86%E5%88%AB%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 劫持 matchMedia API - 强制返回dark模式
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = function(mediaQuery) {
        if (typeof mediaQuery === 'string' && mediaQuery.includes('prefers-color-scheme')) {
            // 处理所有可能的颜色方案查询
            const isDarkQuery = mediaQuery.includes('dark');
            const isLightQuery = mediaQuery.includes('light');
            
            const fakeMediaQueryList = Object.create(MediaQueryList.prototype, {
                matches: {
                    value: isDarkQuery || !isLightQuery, // 如果是dark查询或非light查询返回true
                    writable: false,
                    enumerable: true
                },
                media: {
                    value: mediaQuery,
                    writable: false,
                    enumerable: true
                },
                onchange: {
                    value: null,
                    writable: true,
                    enumerable: true
                }
            });
            
            // 添加必要的方法
            fakeMediaQueryList.addListener = function() {};
            fakeMediaQueryList.removeListener = function() {};
            fakeMediaQueryList.addEventListener = function() {};
            fakeMediaQueryList.removeEventListener = function() {};
            fakeMediaQueryList.dispatchEvent = function() { return true; };
            
            return fakeMediaQueryList;
        }
        return originalMatchMedia.apply(this, arguments);
    };

    // 2. 劫持 CSS.supports API - 强制返回支持dark模式
    const originalCSSSupports = CSS.supports;
    CSS.supports = function(property, value) {
        // 处理两种调用方式: supports(property, value) 和 supports(condition)
        if (arguments.length === 1 && typeof property === 'string') {
            if (property.includes('prefers-color-scheme')) {
                return property.includes('dark') || !property.includes('light');
            }
        } else if (arguments.length === 2) {
            if (property === 'prefers-color-scheme' && value === 'dark') {
                return true;
            }
            if (property === 'prefers-color-scheme' && value === 'light') {
                return false;
            }
        }
        return originalCSSSupports.apply(this, arguments);
    };

    // 3. 劫持 getComputedStyle - 强制返回dark模式相关值
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function(element, pseudoElt) {
        const styles = originalGetComputedStyle(element, pseudoElt);
        if (element === document.documentElement || element === document.body) {
            return new Proxy(styles, {
                get(target, prop) {
                    if (typeof prop === 'string') {
                        const lowerProp = prop.toLowerCase();
                        if (lowerProp === 'colorscheme' || lowerProp === 'color-scheme') {
                            return 'dark';
                        }
                        if (lowerProp === 'background-color' && target[prop] === 'rgb(255, 255, 255)') {
                            return 'rgb(0, 0, 0)';
                        }
                    }
                    return Reflect.get(target, prop);
                }
            });
        }
        return styles;
    };

    // 4. 监听动态样式添加 - 替换为dark模式
    const originalInsertRule = CSSStyleSheet.prototype.insertRule;
    CSSStyleSheet.prototype.insertRule = function(rule, index) {
        if (typeof rule === 'string' && rule.includes('prefers-color-scheme')) {
            rule = rule.replace(/(prefers-color-scheme:\s*)(light|default)/gi, '$1dark');
        }
        return originalInsertRule.call(this, rule, index);
    };

    // 5. 覆盖 localStorage/sessionStorage - 强制dark模式
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        if (typeof key === 'string' && typeof value === 'string') {
            const lowerKey = key.toLowerCase();
            if (/(theme|mode|colorscheme|appearance)/i.test(lowerKey)) {
                value = value.replace(/(light|default|day)/gi, 'dark');
            }
        }
        return originalSetItem.call(this, key, value);
    };

    // 6. 添加对document.cookie的支持 - 强制dark模式
    const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    Object.defineProperty(document, 'cookie', {
        get: originalCookieDescriptor.get,
        set: function(value) {
            if (typeof value === 'string') {
                const parts = value.split(';');
                const [nameVal, ...options] = parts;
                const [name, val] = nameVal.split('=');
                
                if (name && /(theme|mode|colorscheme)/i.test(name.trim())) {
                    const newVal = val.replace(/(light|default|day)/gi, 'dark');
                    value = `${name}=${newVal};${options.join(';')}`;
                }
            }
            return originalCookieDescriptor.set.call(this, value);
        },
        configurable: true,
        enumerable: true
    });

    // 7. 监听DOM变化以处理动态创建的元素 - 强制dark类
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('light')) {
                    target.classList.remove('light');
                    target.classList.add('dark');
                }
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true
    });

    // 8. 初始时设置html标签的dark类
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
})();