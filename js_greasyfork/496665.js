// ==UserScript==
// @name         Belhasa Bypass v1.1
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Small Project
// @author       Saif Alshehhi
// @match        https://rakelearning.bdc.ae/ar/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496665/Belhasa%20Bypass%20v11.user.js
// @updateURL https://update.greasyfork.org/scripts/496665/Belhasa%20Bypass%20v11.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var waitForVerificationProcess = false;

    function enableAndClickNextButton() {
        var nextButton = document.querySelector('.next.ctrlbtn');
        if (nextButton) {
            enableNextButton();
            setTimeout(function() {
                nextButton.click();
            }, 300);
        }
    }

    function enableNextButton() {
        var nextButton = document.querySelector('.next.ctrlbtn');
        if (nextButton && nextButton.disabled) {
            nextButton.removeAttribute('disabled');
        }
    }

    function clickOnH3Element() {
        var h3Elements = document.querySelectorAll('h3');
        h3Elements.forEach(function(h3) {
            if (h3.textContent.trim() === 'تقبل أخطاء الآخرين') {
                h3.click();
            }
        });
    }

    function clickOnH4Element() {
        var h4Elements = document.querySelectorAll('h4');
        h4Elements.forEach(function(h4) {
            if (h4.textContent.trim() === 'الدخول المفاجئ والخروج من حركة مرور السيارات بدون إشارة') {
                h4.click();
            }
        });
    }

    function clickOnLabelElementAndNext() {
        var label = document.querySelector('label.label_item[for="rd-1"]');
        if (label) {
            label.click();
            enableAndClickNextButton();
        }
    }

    function waitForVerificationProcessPages() {
        var currentUrl = window.location.href;
        if (currentUrl.includes('otp.php') || currentUrl.includes('otp_pin.php') ||
            currentUrl.includes('otp2.php') || currentUrl.includes('otp_pin2.php')) {
            waitForVerificationProcess = true;
        }
    }

    var message = document.createElement('div');
    message.textContent = 'Code injected successfully!';
    message.style.position = 'fixed';
    message.style.top = '20px';
    message.style.left = '20px';
    message.style.padding = '10px';
    message.style.backgroundColor = '#33cc33';
    message.style.color = '#fff';
    message.style.borderRadius = '5px';
    message.style.zIndex = '9999';

    document.body.appendChild(message);

    setTimeout(function() {
        message.parentNode.removeChild(message);
    }, 3000);

    clickOnH3Element();
    clickOnH4Element();
    waitForVerificationProcessPages();

    if (!waitForVerificationProcess) {
        enableAndClickNextButton();
        clickOnLabelElementAndNext();
    }

})();
