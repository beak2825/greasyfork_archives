// ==UserScript==
// @name         Auto Claim Faucet helpfpcoin
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Clicks on the Claim Now button automatically
// @author       You
// @match        http://helpfpcoin.site/faucet*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539497/Auto%20Claim%20Faucet%20helpfpcoin.user.js
// @updateURL https://update.greasyfork.org/scripts/539497/Auto%20Claim%20Faucet%20helpfpcoin.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // دالة للتحقق من أن الزر متاح للنقر
    function isButtonReady() {
        const claimBtn = document.getElementById('claimBtn');
        return claimBtn && !claimBtn.disabled && isElementVisible(claimBtn);
    }

    // دالة للتحقق من أن العنصر مرئي
    function isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    // دالة للنقر على الزر
    function clickClaimButton() {
        const claimBtn = document.getElementById('claimBtn');
        if (isButtonReady()) {
            claimBtn.click();
            console.log('تم النقر على زر Claim Now بنجاح');
            return true;
        }
        return false;
    }

    // المراقبة والتكرار
    function checkAndClick() {
        if (isButtonReady()) {
            clickClaimButton();
        }
    }

    // مراقبة تغيرات DOM
    const observer = new MutationObserver(function(mutations) {
        checkAndClick();
    });

    // بدء المراقبة
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['disabled', 'style', 'class']
    });

    // التحقق فور تحميل الصفحة
    window.addEventListener('load', function() {
        checkAndClick();
        // التحقق كل 500 مللي ثانية للاحتياط
        setInterval(checkAndClick, 500);
    });

    console.log('تم تفعيل سكريبت المطالبة التلقائية');
})();