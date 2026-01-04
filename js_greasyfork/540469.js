// ==UserScript==
// @name         全能网页限制解除工具（Sky & 丁大大）
// @namespace    https://greasyfork.org/zh-CN/users/240922-dingzz3
// @version      2.0.2
// @description  解除网页对复制、切屏检测、全屏等限制
// @author       Sky & 丁大大
// @run-at       document-start
// @match        *://*/*
// @icon         data:image/png;base64,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
// @exclude      *://*.youtube.com/*
// @exclude      *://*.wikipedia.org/*
// @exclude      *://mail.qq.com/*
// @exclude      *://translate.google.*
// @exclude      *://*.bing.*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540469/%E5%85%A8%E8%83%BD%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E5%B7%A5%E5%85%B7%EF%BC%88Sky%20%20%E4%B8%81%E5%A4%A7%E5%A4%A7%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540469/%E5%85%A8%E8%83%BD%E7%BD%91%E9%A1%B5%E9%99%90%E5%88%B6%E8%A7%A3%E9%99%A4%E5%B7%A5%E5%85%B7%EF%BC%88Sky%20%20%E4%B8%81%E5%A4%A7%E5%A4%A7%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const key = encodeURIComponent('全能网页限制解除工具:执行判断');
    if (window[key]) return;
    window[key] = true;
    //My PN：18643100778
    // ===== 复制限制解除部分 =====
    const default_rule = {
        name: "default",
        hook_eventNames: "select|selectstart|copy|cut|dragstart",
        unhook_eventNames: "mousedown|mouseup|keydown|keyup",
        dom0: true,
        hook_addEventListener: true,
        hook_preventDefault: true,
        hook_set_returnValue: true,
        add_css: true
    };

    let hook_eventNames, unhook_eventNames, eventNames;
    const storageName = getRandStr(
        'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM',
        parseInt(Math.random() * 12 + 8)
    );

    const EventTarget_addEventListener = EventTarget.prototype.addEventListener;
    const document_addEventListener = document.addEventListener;
    const Event_preventDefault = Event.prototype.preventDefault;

    function addEventListener(type, func, useCapture) {
        const _addEventListener = this === document 
            ? document_addEventListener 
            : EventTarget_addEventListener;

        if (hook_eventNames.includes(type)) {
            _addEventListener.call(this, type, returnTrue, useCapture);
        } else if (unhook_eventNames.includes(type)) {
            const funcsName = storageName + type + (useCapture ? 't' : 'f');
            if (!this[funcsName]) {
                this[funcsName] = [];
                _addEventListener.call(
                    this, 
                    type, 
                    useCapture ? unhook_t : unhook_f, 
                    useCapture
                );
            }
            this[funcsName].push(func);
        } else {
            _addEventListener.apply(this, arguments);
        }
    }

    function clearLoop() {
        const elements = getElements();
        elements.forEach(element => {
            eventNames.forEach(eventName => {
                const prop = 'on' + eventName;
                if (element[prop] && element[prop] !== onxxx) {
                    if (unhook_eventNames.includes(eventName)) {
                        element[storageName + prop] = element[prop];
                        element[prop] = onxxx;
                    } else {
                        element[prop] = null;
                    }
                }
            });
        });
    }

    function returnTrue(e) {
        return true;
    }

    function unhook_t(e) {
        return unhook(e, this, storageName + e.type + 't');
    }

    function unhook_f(e) {
        return unhook(e, this, storageName + e.type + 'f');
    }

    function unhook(e, self, funcsName) {
        (self[funcsName] || []).forEach(fn => fn(e));
        e.returnValue = true;
        return true;
    }

    function onxxx(e) {
        this[storageName + 'on' + e.type](e);
        e.returnValue = true;
        return true;
    }

    function getRandStr(chars, len) {
        return Array.from({length: len}, () => 
            chars[Math.floor(Math.random() * chars.length)]
        ).join('');
    }

    function getElements() {
        return Array.from(document.getElementsByTagName('*')).concat(document);
    }

    function addStyle(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // ===== 切屏检测解除部分 =====
    function disableBlurDetection() {
        window.addEventListener('blur', function(e) {
            e.stopImmediatePropagation();
        }, true);

        Object.defineProperty(document, 'hidden', {
            get: function() { return false; }
        });

        Object.defineProperty(document, 'visibilityState', {
            get: function() { return 'visible'; }
        });

        // 覆盖可能存在的检测函数
        if (window.addEventListener) {
            const originalAddEventListener = window.addEventListener;
            window.addEventListener = function(type, listener, options) {
                if (type === 'visibilitychange' || type === 'blur' || type === 'focus') {
                    return;
                }
                originalAddEventListener.call(window, type, listener, options);
            };
        }
    }

    // ===== 全屏限制解除部分 =====
    function enableFullscreen() {
        // 覆盖全屏API检查
        if (Element.prototype.requestFullscreen) {
            const originalRequestFullscreen = Element.prototype.requestFullscreen;
            Element.prototype.requestFullscreen = function() {
                return originalRequestFullscreen.call(this);
            };
        }

        // 覆盖webkit全屏API
        if (Element.prototype.webkitRequestFullscreen) {
            const originalWebkitRequestFullscreen = Element.prototype.webkitRequestFullscreen;
            Element.prototype.webkitRequestFullscreen = function() {
                return originalWebkitRequestFullscreen.call(this);
            };
        }

        // 移除全屏变化事件监听
        document.addEventListener('fullscreenchange', function(e) {
            e.stopImmediatePropagation();
        }, true);

        document.addEventListener('webkitfullscreenchange', function(e) {
            e.stopImmediatePropagation();
        }, true);
    }

    // ===== 主初始化函数 =====
    function init() {
        const rule = default_rule;

        hook_eventNames = rule.hook_eventNames.split('|');
        unhook_eventNames = rule.unhook_eventNames.split('|');
        eventNames = [...hook_eventNames, ...unhook_eventNames];

        // 复制限制解除初始化
        if (rule.dom0) {
            setInterval(clearLoop, 30000);
            setTimeout(clearLoop, 2500);
            window.addEventListener('load', clearLoop, true);
            clearLoop();
        }

        if (rule.hook_addEventListener) {
            EventTarget.prototype.addEventListener = addEventListener;
            document.addEventListener = addEventListener;
        }

        if (rule.hook_preventDefault) {
            Event.prototype.preventDefault = function() {
                if (!eventNames.includes(this.type)) {
                    Event_preventDefault.apply(this, arguments);
                }
            };
        }

        if (rule.hook_set_returnValue) {
            Object.defineProperty(Event.prototype, 'returnValue', {
                set: function(value) {
                    if (value !== true && eventNames.includes(this.type)) {
                        return;
                    }
                    this._returnValue = value;
                },
                get: function() {
                    return this._returnValue;
                }
            });
        }

        if (rule.add_css) {
            addStyle('html,*{user-select:text!important;-webkit-user-select:text!important;-moz-user-select:text!important;-ms-user-select:text!important;}');
        }

        // 切屏检测解除
        disableBlurDetection();
        
        // 全屏限制解除
        enableFullscreen();
    }

    // 使用MutationObserver持续监测和解除限制
    const observer = new MutationObserver(function(mutations) {
        disableBlurDetection();
        enableFullscreen();
    });

    // 初始化
    init();

    // 页面加载完成后再次确保所有限制被解除
    window.addEventListener('load', function() {
        disableBlurDetection();
        enableFullscreen();
        
        // 开始观察DOM变化
        observer.observe(document, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
    });

    // 立即执行一次
    disableBlurDetection();
    enableFullscreen();
})();