// ==UserScript==
// @name         ouo.io Auto Skipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  يتخطى إعلانات ouo.io بالنقر على زر "Skip Ad" تلقائيًا
// @author       You
// @match        *://ouo.io/*
// @match        *://ouo.press/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539790/ouoio%20Auto%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/539790/ouoio%20Auto%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // متغير للتحقق مما إذا تم النقر بالفعل (لتجنب التكرار)
    let clicked = false;

    // دالة للنقر على الزر
    function clickSkipButton() {
        // البحث عن زر "Skip Ad" (يمكن تعديله حسب تغييرات الموقع)
        const skipButton = document.querySelector('.btn-main.btn, a.btn[href*="go.php"]');
        
        if (skipButton && !clicked) {
            console.log("تم العثور على زر التخطي، جاري النقر...");
            skipButton.click();
            clicked = true; // تم النقر
        }
    }

    // 1. جرب النقر فور تحميل الصفحة
    clickSkipButton();

    // 2. مراقبة تغييرات DOM (إذا كان الزر يظهر بعد تأخير)
    const observer = new MutationObserver(function(mutations) {
        clickSkipButton();
    });

    // بدء المراقبة على <body> وجميع العناصر الفرعية
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 3. إعادة المحاولة كل ثانية (حسب الحاجة)
    setInterval(clickSkipButton, 1000);
})();