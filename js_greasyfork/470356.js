// ==UserScript==
// @name         Bitrix auto proeb lession
// @namespace    https://www.example.com
// @version      1.0
// @description  Автоматически пропускает уроки 
// @match        https://dev.1c-bitrix.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470356/Bitrix%20auto%20proeb%20lession.user.js
// @updateURL https://update.greasyfork.org/scripts/470356/Bitrix%20auto%20proeb%20lession.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', function() {
        var div = document.getElementById('course-lesson-exp-btn');
        if (div) {
            setTimeout(function() {
                simulateClick(div);
            }, 1000);
        }
    });


    function simulateClick(element) {
        var clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(clickEvent);


        var okButton = document.querySelector('.read-popup-btn');
        if (okButton) {
            setTimeout(function() {
                simulateClick(okButton);
            }, 2000);
        }

         var closeIcon = document.querySelector('.popup-window-close-icon');
        if (closeIcon) {
            setTimeout(function() {
                simulateClick(closeIcon);
            }, 2000);
        }

         var nextLessonButton = document.querySelector('.course-content-footer-button-next');
        if (nextLessonButton) {
            setTimeout(function() {
                simulateClick(nextLessonButton);
            }, 2000);
        }
    }


})();