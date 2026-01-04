// ==UserScript==
// @name         Deepseek Arabic Support
// @name:ar      دعم العربية لـ Deepseek
// @namespace    https://github.com/nvkq/deepseek-arab
// @version      1.2
// @description  دعم متكامل للغة العربية مع تحسين التنسيق
// @author       smsm
// @match        https://chat.deepseek.com/*
// @icon         https://raw.githubusercontent.com/nvkq/deepseek-arab/main/deepseek-arab.png
// @grant        GM_addStyle
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/533637/Deepseek%20Arabic%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/533637/Deepseek%20Arabic%20Support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ------ التعديلات الأساسية ------
    const arabicCSS = `
        body, .message, .input-area {
            direction: rtl;
            font-family: 'Segoe UI', 'Noto Sans Arabic', sans-serif;
            text-align: right !important;
        }

        /* تحسين المسافات البينية للعربية */
        *:not(code):not(pre) {
            letter-spacing: 0.02em !important;
            word-spacing: 0.1em !important;
        }

        /* إصلاح اتجاه الأيقونات */
        .button-group, .action-icons {
            left: 5px !important;
            right: auto !important;
        }

        /* الحفاظ على اتجاه الأكواد */
        pre, code {
            direction: ltr !important;
            text-align: left !important;
            font-family: 'JetBrains Mono', monospace !important;
        }
    `;

    // ------ تطبيق التعديلات ------
    if (typeof GM_addStyle !== "undefined") {
        GM_addStyle(arabicCSS);
    } else {
        const style = document.createElement('style');
        style.textContent = arabicCSS;
        document.head.appendChild(style);
    }

    // ------ تحميل الخطوط العربية (اختياري) ------
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

})(); // <-- هنا أقواس الإغلاق الصحيحة (واحدة فقط)