// ==UserScript==
// @name        AI Chat Font & Direction Fixer
// @name:fa     اصلاح فونت و جهت‌دهی چت‌بات‌ها
// @namespace   https://github.com/gemini-user/ai-chat-styler
// @version     4.1
// @description Dynamically fixes RTL/LTR direction, justifies Persian text, and allows font switching on AI chatbots.
// @description:fa اصلاح پویای جهت نوشتار، ترازبندی متن فارسی و امکان انتخاب فونت در چت‌بات‌های هوش مصنوعی.
// @author      Your Assistant
// @match       https://chatgpt.com/*
// @match       https://gemini.google.com/*
// @match       https://chat.qwen.ai/*
// @match       https://grok.com/*
// @match       https://chat.deepseek.com/*
// @match       https://copilot.chat.github.com/*
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-body
// @downloadURL https://update.greasyfork.org/scripts/547051/AI%20Chat%20Font%20%20Direction%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/547051/AI%20Chat%20Font%20%20Direction%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- بخش اول: تنظیمات فونت و منو ---

    const fonts = {
        vazirmatn: {
            menuName: 'انتخاب فونت: وزیرمتن',
            cssName: "'Vazirmatn'",
            cdnUrl: 'https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css'
        },
        vazirCode: {
            menuName: 'انتخاب فونت: وزیر کد',
            cssName: "'Vazir Code'",
            cdnUrl: 'https://cdn.jsdelivr.net/npm/vazir-code-font@1.1.2/dist/font-face.css'
        },
        iranSans: {
            menuName: 'انتخاب فونت: ایران سنس',
            cssName: "'IRANSans-medium'",
            cdnUrl: 'https://cdn.jsdelivr.net/npm/react-super-app@5.0.5/iransans/font.css'
        }
    };

    const selectedFontKey = GM_getValue('selectedFont', 'vazirmatn');
    const selectedFont = fonts[selectedFontKey];

    Object.keys(fonts).forEach(key => {
        GM_registerMenuCommand(fonts[key].menuName, () => {
            GM_setValue('selectedFont', key);
            window.location.reload();
        });
    });

    // --- بخش دوم: استایل‌های پایه (فونت و کد) ---

    const css = `
        @import url('${fonts.vazirmatn.cdnUrl}');
        @import url('${fonts.vazirCode.cdnUrl}');
        @import url('${fonts.iranSans.cdnUrl}');

        /* اعمال فونت انتخاب شده به تمام بخش‌های متنی */
        body, button, input, textarea, div, p, span, li,
        h1, h2, h3, h4, h5, h6, a, label, strong, td, th {
            font-family: ${selectedFont.cssName}, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
        }

        /* استایل ثابت برای بلوک‌های کد */
        pre, code, kbd, samp, pre *, code * {
            font-family: 'Consolas', 'Menlo', 'monospace' !important;
            direction: ltr !important;
            text-align: left !important;
        }
    `;
    GM_addStyle(css);

    // --- بخش سوم: منطق هوشمند جاوااسکریپت برای اصلاح جهت‌دهی و ترازبندی ---

    const persianRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/;

    function fixDirection(element) {
        // از دستکاری بلوک‌های کد و منوهای قابل ویرایش خودداری کن
        if (!element || element.nodeType !== 1 || element.isContentEditable || element.closest('pre, code, nav, [role="navigation"], [role="menu"]')) {
            return;
        }

        // فقط عناصر متنی اصلی را بررسی کن
        if (element.matches('p, li, h1, h2, h3, h4, h5, h6, blockquote, td, th, div')) {
            // بررسی کن آیا خود عنصر یا فرزندانش متن فارسی دارند
            const hasPersian = persianRegex.test(element.textContent);

            if (hasPersian) {
                element.style.direction = 'rtl';
                element.style.textAlign = 'justify'; // <--- تغییر اصلی: ترازبندی دوطرفه برای متن فارسی
            } else {
                // اگر هیچ متن فارسی در عنصر و فرزندانش نبود، به حالت پیش‌فرض برگردان
                if (!element.querySelector('[style*="direction: rtl"]')) {
                    element.style.direction = 'ltr';
                    element.style.textAlign = 'left';
                }
            }
        }
    }

    // مشاهده‌گر برای شناسایی تغییرات زنده در صفحه (مثل پاسخ‌های جدید چت‌بات)
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) { // اگر یک عنصر HTML بود
                    fixDirection(node); // خود عنصر را بررسی کن
                    node.querySelectorAll('p, li, h1, h2, h3, h4, div').forEach(fixDirection); // فرزندانش را هم بررسی کن
                }
            });
        });
    });

    // مشاهده‌گر را روی کل بدنه صفحه فعال کن
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // یک اسکن اولیه برای محتوایی که از قبل در صفحه وجود دارد
    document.querySelectorAll('p, li, h1, h2, h3, h4, div').forEach(fixDirection);

})();
