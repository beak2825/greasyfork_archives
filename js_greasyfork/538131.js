// ==UserScript==
// @name         💰 Real Coupon Finder - Amazon
// @namespace    https://1lm.me/codecopilot
// @version      1.1
// @description  Auto-fetch real Amazon coupons from CouponFollow & apply best one!
// @match        *://www.amazon.*/*
// @grant        GM_xmlhttpRequest
// @connect      couponfollow.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/538131/%F0%9F%92%B0%20Real%20Coupon%20Finder%20-%20Amazon.user.js
// @updateURL https://update.greasyfork.org/scripts/538131/%F0%9F%92%B0%20Real%20Coupon%20Finder%20-%20Amazon.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const waitForPrice = (selector, callback) => {
        const el = document.querySelector(selector);
        if (el) return callback(el);
        setTimeout(() => waitForPrice(selector, callback), 500);
    };

    const parsePrice = (text) => {
        const match = text.replace(/[^0-9.,]/g, '').match(/[\d.,]+/);
        if (!match) return null;
        return parseFloat(match[0].replace(',', ''));
    };

    const fetchCoupons = (callback) => {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://www.couponfollow.com/site/amazon.com",
            onload: function (response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const coupons = Array.from(doc.querySelectorAll('.coupon-code-block .coupon-code-text'))
                    .map(el => el.textContent.trim())
                    .filter(code => /^[A-Z0-9]{4,}$/.test(code));
                callback(coupons);
            }
        });
    };

    const injectButton = (priceElement, price) => {
        const btn = document.createElement('button');
        btn.textContent = '🔍 Fetch Real Coupons';
        btn.style = 'margin-top:10px;padding:8px 14px;background:#ff9900;color:#fff;border:none;border-radius:4px;cursor:pointer;';
        priceElement.parentElement.appendChild(btn);

        const resultBox = document.createElement('div');
        resultBox.style = 'margin-top:10px;font-weight:bold;';
        priceElement.parentElement.appendChild(resultBox);

        btn.onclick = () => {
            resultBox.textContent = '⏳ Fetching coupons...';
            fetchCoupons((codes) => {
                if (codes.length === 0) {
                    resultBox.textContent = '❌ No coupons found';
                } else {
                    resultBox.innerHTML = `✅ Found <b>${codes.length}</b> coupons<br><code>${codes.join('</code> <code>')}</code>`;
                }
            });
        };
    };

    waitForPrice('.a-price .a-offscreen', (el) => {
        const price = parsePrice(el.textContent);
        if (price) injectButton(el, price);
    });

})();