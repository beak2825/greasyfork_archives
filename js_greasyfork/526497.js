// ==UserScript==
// @name         Udemy Express Checkout Link Generator
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a direct express checkout link for Udemy courses with coupon codes
// @author       ikigaiDH
// @match        https://www.udemy.com/course/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=udemy.com
// @grant        none
// @license      GPL-3.0-only
// @downloadURL https://update.greasyfork.org/scripts/526497/Udemy%20Express%20Checkout%20Link%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/526497/Udemy%20Express%20Checkout%20Link%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createExpressCheckoutLink(courseId, couponCode) {
        const link = document.createElement('a');
        link.href = `https://www.udemy.com/payment/checkout/express/course/${courseId}/?discountCode=${couponCode}`;
        link.textContent = '⚡ Express Checkout';
        link.style.position = 'fixed';
        link.style.top = '75px';
        link.style.right = '10px';
        link.style.zIndex = '9999';
        link.style.backgroundColor = '#3e4143';
        link.style.color = 'white';
        link.style.padding = '12px 20px';
        link.style.borderRadius = '4px';
        link.style.fontWeight = 'bold';
        link.style.textDecoration = 'none';
        link.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
        link.style.fontFamily = 'Arial, sans-serif';
        link.style.fontSize = '14px';
        link.style.cursor = 'pointer';
        link.addEventListener('mouseover', () => {
            link.style.backgroundColor = '#A9A5A5';
        });
        link.addEventListener('mouseout', () => {
            link.style.backgroundColor = '#3e4143';
        });

        document.body.appendChild(link);
    }

    function extractCouponCode() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('couponCode');
    }

    function init() {
        const courseElement = document.querySelector('[data-clp-course-id]');
        const couponCode = extractCouponCode();

        if (courseElement && couponCode) {
            const courseId = courseElement.dataset.clpCourseId;
            createExpressCheckoutLink(courseId, couponCode);
        }
    }

    // Wait for page to load completely
    window.addEventListener('load', init);
})();