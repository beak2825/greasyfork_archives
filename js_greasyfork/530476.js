// ==UserScript==
// @name            DuckDuckGo RTL Enhancer
// @name:fa         داک‌داک‌گو با پشتیبانی راست به چپ
// @name:ar         داک داک جو - دعم الكتابة من اليمين إلى اليسار
// @version         1.0
// @description     Automatically applies RTL direction to DuckDuckGo results with Persian or Arabic text
// @description:fa  به طور خودکار جهت راست به چپ را برای نتایج جستجوی داک‌داک‌گو با متن فارسی اعمال می‌کند
// @description:ar  يطبق تلقائيًا اتجاه من اليمين إلى اليسار على نتائج بحث داك داك جو مع النص العربي
// @author          Zen
// @match           https://duckduckgo.com/*
// @run-at          document-start
// @license         MIT
// @supportURL      https://github.com/Zen-CloudLabs/UserScripts/issues
// @homepageURL     https://github.com/Zen-CloudLabs/UserScripts
// @namespace https://greasyfork.org/users/1425911
// @downloadURL https://update.greasyfork.org/scripts/530476/DuckDuckGo%20RTL%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/530476/DuckDuckGo%20RTL%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    if (localStorage.getItem("rtlAutoEnabled") === "false") {
        return;
    }

    const style = document.createElement('style');
    style.innerHTML = '@import url("https://fonts.googleapis.com/css2?family=Vazirmatn&display=swap");';
    document.head.appendChild(style);

    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    if (window.location.hostname === 'duckduckgo.com') {
        document.cookie = "t=Vazirmatn; domain=duckduckgo.com; path=/; expires=" + 
            oneYearFromNow.toUTCString() + "; secure; SameSite=Lax;";
    }

    const rtlCharRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g;
    const targetSelectors = '.PBQZNIcKgp0FJ_yxBVaB, .IwPq3HoxJc8guGUBwTKv';
    const excludedClass = 'JRDRiEf5NPKWK43sArdC';

    function processElement(element) {
        if (!element || element.dataset.rtlApplied || element.classList.contains(excludedClass)) {
            return;
        }

        const text = element.textContent.trim();
        if (!text) return;

        const cleanText = text.replace(/\s/g, '');
        const totalChars = cleanText.length;
        if (totalChars === 0) return;

        const rtlChars = cleanText.match(rtlCharRegex);
        const rtlCharCount = rtlChars ? rtlChars.length : 0;
        const rtlRatio = rtlCharCount / totalChars;

        if (rtlRatio >= 0.4) {
            element.style.direction = "rtl";
            element.dataset.rtlApplied = "true";
        }
    }

    function processAllElements() {
        document.querySelectorAll(targetSelectors).forEach(processElement);
    }

    function handleMutations(mutationsList) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches && node.matches(targetSelectors)) {
                            processElement(node);
                        }
                        node.querySelectorAll(targetSelectors).forEach(processElement);
                    }
                });
            }
            else if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.matches && target.matches(targetSelectors)) {
                    processElement(target);
                }
            }
        }
    }

    const observer = new MutationObserver(handleMutations);
    const observerConfig = {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["class"]
    };

    function initialize() {
        processAllElements();
        observer.observe(document.body, observerConfig);
    }

    if (document.readyState !== 'loading') {
        initialize();
    } else {
        document.addEventListener("DOMContentLoaded", initialize);
    }

    setInterval(processAllElements, 500);
})();
