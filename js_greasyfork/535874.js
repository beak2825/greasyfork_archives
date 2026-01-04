// ==UserScript==
// @name         Shopee & momo 回饋複製工具
// @namespace    AOScript
// @version      4.0
// @description  在蝦皮與 momo 商品頁使用按鈕，複製價格的百分比。
// @author       AO-AO
// @match        https://shopee.tw/*
// @match        https://www.momoshop.com.tw/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535874/Shopee%20%20momo%20%E5%9B%9E%E9%A5%8B%E8%A4%87%E8%A3%BD%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/535874/Shopee%20%20momo%20%E5%9B%9E%E9%A5%8B%E8%A4%87%E8%A3%BD%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 字體載入
    function loadNotoSansTC() {
        const existingLink = document.querySelector('link[href*="fonts.googleapis.com"][href*="Noto+Sans+TC"]');

        if (!existingLink) {
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap';
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    }

    // 套用字體到按紐
    function injectFontStyle() {
        const existingStyle = Array.from(document.querySelectorAll('style')).find(style =>
            style.textContent.includes('.aos-copy-btn') &&
            style.textContent.includes('font-family: "Noto Sans TC"')
        );

        if (!existingStyle) {
            const style = document.createElement('style');
            style.textContent = `
                .aos-copy-btn {
                    font-family: "Noto Sans TC", sans-serif !important;
                    font-size: 14px !important;
                    font-weight: 500 !important;
                    line-height: 1.4 !important;
                    letter-spacing: 0.5px !important;
                }
            `;

            document.head.appendChild(style);
        }
    }

    loadNotoSansTC();
    injectFontStyle();

    function createButton(label, percent, color, offsetY, getPriceFn) {
        const btn = document.createElement('button');
        btn.innerText = `複製價格的 ${label}`;
        btn.style.setProperty('font-family', '"Noto Sans TC", sans-serif', 'important');
        btn.className = 'aos-copy-btn'

        // 統一樣式設定
        Object.assign(btn.style, {
            position: 'fixed',
            top: `${offsetY}px`,
            right: '20px',
            zIndex: '9999',
            padding: '8px 12px',
            backgroundColor: color,
            color: '#fff',
            fontSize: '15px',
            //fontFamily: 'Arial, sans-serif',
            fontWeight: '500',
            lineHeight: '1.4',
            letterSpacing: '0.5px',
            textAlign: 'center',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        });

        btn.onclick = () => {
            const price = getPriceFn();

            if (isNaN(price)) {
                alert("價格解析失敗");
                return;
            }

            const result = Math.round(price * percent / 100);

            // 剪貼簿
            navigator.clipboard.writeText(result.toString())
                .then(() => {
                btn.innerText = `已複製（${price}）：${result}`;

                setTimeout(() => {
                    btn.innerText = `複製價格的 ${label}`;
                }, 1500);
            });
        };

        document.body.appendChild(btn);
    }

    function initShopee() {
        setTimeout(() => {
            const getShopeePrice = () => {
                const el = document.querySelector('div.IZPeQz.B67UQ0');

                if (!el) return NaN;

                const text = el.textContent.trim().replace(/[^0-9.]/g, '');
                return parseFloat(text);
            };

            createButton('5%', 2.5, '#E06E8E', 90, getShopeePrice);
            createButton('10%', 5, '#DB346D', 145, getShopeePrice);
        }, 2000);
    }

    function getTPPrice() {
        const priceContainer = document.querySelector('.goods-detail-price');

        if (!priceContainer) {
            console.log('[TP價格解析] 沒有找到價格容器');
            return NaN;
        }

        const priceSpans = priceContainer.querySelectorAll('span.text-ec_4xl, span.market-price');

        if (priceSpans.length === 0) {
            console.log('[TP價格解析] 沒有找到價格');
            return NaN;
        }

        const firstText = priceSpans[0].textContent.trim().replace(/[^0-9]/g, '');
        const firstPrice = parseInt(firstText, 10);
        //console.log('[TP價格解析] 抓到的價格列表:', Array.from(priceSpans).map(span => span.textContent.trim()));
        //console.log('[TP價格解析] 第一個價格:', firstPrice);
        return firstPrice;
    }

    function initMomo() {
        setTimeout(() => {
            const isTPPage = location.pathname.includes('/TP/');

            if (isTPPage) {
                createButton('3%', 3, '#F0864C', 90, getTPPrice);
                return;
            }

            const triggerHover = () => {
                const promoTrigger = document.querySelector('em[highlight][htmatch*="下單再折"]');

                if (promoTrigger) {
                    const event = new MouseEvent('mouseover', { bubbles: true, cancelable: true, view: window });
                    promoTrigger.dispatchEvent(event);
                }
            };

            let aferPromoPriceCache = null;

            triggerHover();

            const waitForPrice = () => {
                const aferPromoEl = document.querySelector('td.aferPromoPrice');

                if (aferPromoEl && aferPromoEl.offsetParent !== null) {
                    const text = aferPromoEl.textContent.trim().replace(/[^0-9]/g, '');

                    if (text) {
                        aferPromoPriceCache = parseInt(text, 10);
                        clearInterval(waiter);
                    }
                }
            };

            const waiter = setInterval(waitForPrice, 300);
            setTimeout(() => clearInterval(waiter), 5000);

            const getMomoPrice = () => {
                if (aferPromoPriceCache) return aferPromoPriceCache;

                const promoEl = document.querySelector('.priceArea .promoPrice');

                if (promoEl) {
                    const text = promoEl.textContent.trim().replace(/[^0-9]/g, '');
                    if (text) return parseInt(text, 10);
                }

                const seoEl = document.querySelector('span.seoPrice');

                if (seoEl) {
                    const text = seoEl.textContent.trim().replace(/[^0-9]/g, '');

                    if (text) return parseInt(text, 10);
                }

                return NaN;
            };

            createButton('3%', 3, '#86AEDB', 90, getMomoPrice);
            createButton('5%', 5, '#6074DC', 145, getMomoPrice);
            createButton('7%', 7, '#6D4ADB', 200, getMomoPrice);
            createButton('8%', 8, '#293E89', 255, getMomoPrice);
        }, 2000);
    }

    if (location.hostname.includes('shopee.tw')) {
        initShopee();
    } else if (location.hostname.includes('momoshop.com.tw')) {
        initMomo();
    }

})();