// ==UserScript==
// @name         AutoLightsail
// @namespace    http://tampermonkey.net/
// @version      2025-3-1
// @description  Read Lightsail books automatically without triggering the anti-bot check!!!
// @author       Au0727
// @match        https://lightsailed.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lightsailed.com
// @grant        unsafeWindow
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/493891/AutoLightsail.user.js
// @updateURL https://update.greasyfork.org/scripts/493891/AutoLightsail.meta.js
// ==/UserScript==

(function() {

    // 原有按钮和状态声明
    var toggleButton = document.createElement('button');
    toggleButton.innerText = '0';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.left = '10px';
    toggleButton.style.zIndex = '9999';
    document.body.appendChild(toggleButton);
    var autoReadEnabled = false;

    var toggleButton1 = document.createElement('button');
    toggleButton1.innerText = '<<0';
    toggleButton1.style.position = 'fixed';
    toggleButton1.style.top = '10px';
    toggleButton1.style.left = '40px';
    toggleButton1.style.zIndex = '9999';
    document.body.appendChild(toggleButton1);
    var pullBackEnabled = false;

    var toggleButton2 = document.createElement('button');
    toggleButton2.innerText = '>>0';
    toggleButton2.style.position = 'fixed';
    toggleButton2.style.top = '10px';
    toggleButton2.style.left = '80px';
    toggleButton2.style.zIndex = '9999';
    document.body.appendChild(toggleButton2);
    var pullForwardEnabled = false;

    // 防检测系统
    function antiCheck(){
        const window = unsafeWindow;
        const blackList = new Set(["visibilitychange", "blur", "pagehide", "mouseleave"]);
        const isDebug = false;
        const log = console.log.bind(console, "[阻止切屏检测]");
        const debug = isDebug ? log : () => { };
        function patchToString(obj, ref) {
            return;
            obj.toString = () => ref.toString();
            obj.toString.toString = () => ref.toString.toString();
            obj.toString.toString.toString = obj.toString.toString;
        }
        function patchAddEventListener(obj, name) {
            obj._addEventListener = obj.addEventListener;
            obj.addEventListener = (...args) => {
                if (!blackList.has(args[0])) {
                    debug(`allow ${name}.addEventListener`, ...args);
                    return obj._addEventListener(...args);
                } else {
                    log(`block ${name}.addEventListener`, ...args);
                    return undefined;
                }
            };
            patchToString(obj.addEventListener, obj._addEventListener);
        }
        patchAddEventListener(window, "window");
        patchAddEventListener(document, "document");
        document.addEventListener("DOMContentLoaded", () => {
            patchAddEventListener(document.body, "document.body");
        }, { once: true, passive: true, capture: true });
        log("addEventListener hooked!");
        if (isDebug) {
            window._setInterval = window.setInterval;
            window.setInterval = (...args) => {
                const id = window._setInterval(...args);
                debug("calling window.setInterval", id, ...args);
                return id;
            };
            debug("setInterval hooked!");
            window._setTimeout = window.setTimeout;
            window.setTimeout = (...args) => {
                const id = window._setTimeout(...args);
                debug("calling window.setTimeout", id, ...args);
                return id;
            };
            debug("setTimeout hooked!");
        }
        Object.defineProperties(document, {
            hidden: { value: false },
            visibilityState: { value: "visible" },
            hasFocus: { value: () => true },
            onvisibilitychange: { get: () => undefined, set: () => { } },
            onblur: { get: () => undefined, set: () => { } },
            onmouseleave: { get: () => undefined, set: () => { } },
        });
        log("document properties set!");
        Object.defineProperties(window, {
            onblur: { get: () => undefined, set: () => { } },
            onpagehide: { get: () => undefined, set: () => { } },
        });
        log("window properties set!");
    }

    // 原有功能函数
    function clozes(){
        var elements = document.getElementsByClassName('cloze-assessment-pending');
        for(var i = 0; i < elements.length; i++) {
            elements[i].style.opacity = '0.2';
        }
    }

    function clickButton() {
        var button = document.querySelector('button.reader-button-next.btn');
        if (button && autoReadEnabled) button.click();
        var button1 = document.querySelector('button.reader-button-prev.btn');
        if (button1 && autoReadEnabled) button1.click();
    }

    function focused(){
        var closeButton = document.querySelector('button.close.pointer');
        if (closeButton) closeButton.click();
    }

    function pullBack(){
        var button1 = document.querySelector('button.reader-button-prev.btn');
        var button2 = document.querySelector('button.reader-button-next.btn');
        if (button1 && pullBackEnabled) button1.click();
        if (!button1 && autoReadEnabled) {
            pullBackEnabled = false;
            toggleButton1.innerText = '<<0';
        }
        if (!button2 && autoReadEnabled && button1) {
            pullBackEnabled = true;
            toggleButton1.innerText = '<<1';
            pullForwardEnabled = false;
            toggleButton2.innerText = '>>0';
        }
    }

    function pullForward(){
        var button2 = document.querySelector('button.reader-button-next.btn');
        if (button2 && pullForwardEnabled) button2.click();
    }

    // 新增自动答题功能
    function checkAndSubmit() {
        // 精准定位编辑框
        var editor = document.querySelector('div.ql-editor.ql-blank[data-placeholder="Your Reply"]');
        if (editor) {
            // 修改内容并移除空白状态
            editor.innerHTML = '<p>a</p>';
            editor.classList.remove('ql-blank');
        }
    }

    function Submit(){
        // 精准定位并点击提交按钮
        var submitBtn = document.querySelector('button.btn.btn-primary.w-100.mb');
        if (submitBtn) submitBtn.click();
    }

    // 初始化
    antiCheck();
    setInterval(clickButton, 100000);
    setInterval(clozes, 500);
    setInterval(focused, 6000);
    setInterval(pullBack, 50);
    setInterval(pullForward, 50);
    setInterval(checkAndSubmit, 1000); // 新增定时任务
    setInterval(Submit, 1000);

    // 按钮事件绑定
    toggleButton.addEventListener('click', () => {
        autoReadEnabled = !autoReadEnabled;
        toggleButton.innerText = autoReadEnabled ? '1' : '0';
    });
    toggleButton1.addEventListener('click', () => {
        pullBackEnabled = !pullBackEnabled;
        toggleButton1.innerText = pullBackEnabled ? '<<1' : '<<0';
    });
    toggleButton2.addEventListener('click', () => {
        pullForwardEnabled = !pullForwardEnabled;
        toggleButton2.innerText = pullForwardEnabled ? '>>1' : '>>0';
    });

})();