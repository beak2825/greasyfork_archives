// ==UserScript==
// @name         Bitrix auto read lession
// @namespace    https://www.example.com
// @version      1.0
// @description  Скроллит уроки и автоматически нажимает "Прочитано"
// @match        https://dev.1c-bitrix.ru/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470355/Bitrix%20auto%20read%20lession.user.js
// @updateURL https://update.greasyfork.org/scripts/470355/Bitrix%20auto%20read%20lession.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function slowScrollTo(element, duration, delay) {
        setTimeout(function() {
            var start = window.pageYOffset;
            var end = element.getBoundingClientRect().top + window.pageYOffset;
            var distance = end - start;
            var startTime = null;

            function scrollStep(timestamp) {
                if (!startTime) startTime = timestamp;
                var progress = timestamp - startTime;
                var scrollOffset = easeInOutQuad(progress, start, distance, duration);
                window.scrollTo(0, scrollOffset);
                if (progress < duration) {
                    window.requestAnimationFrame(scrollStep);
                }
            }

            function easeInOutQuad(t, b, c, d) {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            }

            window.requestAnimationFrame(scrollStep);
        }, delay);
    }

    var button = document.querySelector('.course-content-footer-button-next');
    slowScrollTo(button, 45000, 500);
     // Wait for the page to load
    window.addEventListener('load', function() {
        // Find the div element by its ID and click on it
        var div = document.getElementById('course-lesson-exp-btn');
        if (div) {
            setTimeout(function() {
                simulateClick(div);
            }, 30000); // Delay in milliseconds (e.g., 2000 = 2 seconds)
        }
    });

    // Simulate a click event on the specified element
    function simulateClick(element) {
        var clickEvent = new MouseEvent('click', {
            view: window,
            bubbles: true,
            cancelable: true
        });
        element.dispatchEvent(clickEvent);

        // After clicking the div, wait for the OK button and click on it
        var okButton = document.querySelector('.read-popup-btn');
        if (okButton) {
            setTimeout(function() {
                simulateClick(okButton);
            }, 4000); // Delay in milliseconds (e.g., 2000 = 3 seconds)
        }

         var closeIcon = document.querySelector('.popup-window-close-icon');
        if (closeIcon) {
            setTimeout(function() {
                simulateClick(closeIcon);
            }, 5000); // Delay in milliseconds (e.g., 2000 = 3 seconds)
        }

         var nextLessonButton = document.querySelector('.course-content-footer-button-next');
        if (nextLessonButton) {
            setTimeout(function() {
                simulateClick(nextLessonButton);
            }, 6000); // Delay in milliseconds (e.g., 2000 = 2 seconds)
        }
    }


})();
