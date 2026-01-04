// ==UserScript==
// @name         白色模式 light（系统识别版）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  劫持 系统 自动 light 模式
// @author       Dahi（AI）
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/545386/%E7%99%BD%E8%89%B2%E6%A8%A1%E5%BC%8F%20light%EF%BC%88%E7%B3%BB%E7%BB%9F%E8%AF%86%E5%88%AB%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/545386/%E7%99%BD%E8%89%B2%E6%A8%A1%E5%BC%8F%20light%EF%BC%88%E7%B3%BB%E7%BB%9F%E8%AF%86%E5%88%AB%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 劫持 matchMedia API - 更完善的实现
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = function(mediaQuery) {
        if (typeof mediaQuery === 'string' && mediaQuery.includes('prefers-color-scheme')) {
            // 处理所有可能的颜色方案查询
            const isLightQuery = mediaQuery.includes('light');
            const isDarkQuery = mediaQuery.includes('dark');
            
            const fakeMediaQueryList = Object.create(MediaQueryList.prototype, {
                matches: {
                    value: isLightQuery || !isDarkQuery, // 如果是light查询或非dark查询返回true
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

    // 2. 劫持 CSS.supports API - 更全面的处理
    const originalCSSSupports = CSS.supports;
    CSS.supports = function(property, value) {
        // 处理两种调用方式: supports(property, value) 和 supports(condition)
        if (arguments.length === 1 && typeof property === 'string') {
            if (property.includes('prefers-color-scheme')) {
                return property.includes('light') || !property.includes('dark');
            }
        } else if (arguments.length === 2) {
            if (property === 'prefers-color-scheme' && value === 'light') {
                return true;
            }
            if (property === 'prefers-color-scheme' && value === 'dark') {
                return false;
            }
        }
        return originalCSSSupports.apply(this, arguments);
    };

    // 3. 劫持 getComputedStyle - 更安全的实现
    const originalGetComputedStyle = window.getComputedStyle;
    window.getComputedStyle = function(element, pseudoElt) {
        const styles = originalGetComputedStyle(element, pseudoElt);
        if (element === document.documentElement || element === document.body) {
            return new Proxy(styles, {
                get(target, prop) {
                    if (typeof prop === 'string') {
                        const lowerProp = prop.toLowerCase();
                        if (lowerProp === 'colorscheme' || lowerProp === 'color-scheme') {
                            return 'light';
                        }
                        if (lowerProp === 'background-color' && target[prop] === 'rgb(0, 0, 0)') {
                            return 'rgb(255, 255, 255)';
                        }
                    }
                    return Reflect.get(target, prop);
                }
            });
        }
        return styles;
    };

    // 4. 监听动态样式添加 - 更全面的替换
    const originalInsertRule = CSSStyleSheet.prototype.insertRule;
    CSSStyleSheet.prototype.insertRule = function(rule, index) {
        if (typeof rule === 'string' && rule.includes('prefers-color-scheme')) {
            rule = rule.replace(/(prefers-color-scheme:\s*)(dark|default)/gi, '$1light');
        }
        return originalInsertRule.call(this, rule, index);
    };

    // 5. 覆盖 localStorage/sessionStorage - 更健壮的实现
    const originalSetItem = Storage.prototype.setItem;
    Storage.prototype.setItem = function(key, value) {
        if (typeof key === 'string' && typeof value === 'string') {
            const lowerKey = key.toLowerCase();
            if (/(theme|mode|colorscheme|appearance)/i.test(lowerKey)) {
                value = value.replace(/(dark|default|night)/gi, 'light');
            }
        }
        return originalSetItem.call(this, key, value);
    };

    // 6. 添加对document.cookie的支持
    const originalCookieDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie');
    Object.defineProperty(document, 'cookie', {
        get: originalCookieDescriptor.get,
        set: function(value) {
            if (typeof value === 'string') {
                const parts = value.split(';');
                const [nameVal, ...options] = parts;
                const [name, val] = nameVal.split('=');
                
                if (name && /(theme|mode|colorscheme)/i.test(name.trim())) {
                    const newVal = val.replace(/(dark|default|night)/gi, 'light');
                    value = `${name}=${newVal};${options.join(';')}`;
                }
            }
            return originalCookieDescriptor.set.call(this, value);
        },
        configurable: true,
        enumerable: true
    });

    // 7. 监听DOM变化以处理动态创建的元素
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('dark')) {
                    target.classList.remove('dark');
                    target.classList.add('light');
                }
            }
        });
    });

    observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
        subtree: true
    });
})();