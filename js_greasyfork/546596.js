// ==UserScript==
// @name         dk-ticket
// @namespace    dk-ticket
// @version      0.0.1
// @description  get dk lck ticket fast
// @author       AndrewWang
// @match        https://dpluskia.bstage.in/shop/kr/products/*
// @match        https://dpluskia.bstage.in/shop/kr/checkout/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bstage.in
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546596/dk-ticket.user.js
// @updateURL https://update.greasyfork.org/scripts/546596/dk-ticket.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let flag = true;
    let flag2 = true;
    const observer = new MutationObserver((mutationsList, observer) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('mutation');
                // 偵測到新節點加入，可在此處執行你的邏輯
                const row = document.querySelector(
                    'div[class^="TicketOptionDetail_stringButtons__"] > div:not([class*="ClickableArea_disabled__"])'
                );
                if (row && flag === true) {
                    flag = false;
                    row.click();

                    setTimeout(() => {
                        const orderBtn = document.querySelector('div[class^="ProductButton_wrapper__"] button');
                        if (orderBtn) {
                            console.log(orderBtn);
                            orderBtn.click();
                        }
                    }, 100);
                }


                const check = document.querySelector(
                    'div[data-id="checkout-terms"] input[type="checkbox"]'
                );
                if (check && flag2 === true) {
                    flag2 = false;
                    if (check && !check.checked) {
                        //check.checked = true;
                        check.click();

                        check.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }
            }
        }
    });

    // 偵測整個 body 內的子元素變動
    observer.observe(document.body, { childList: true, subtree: true });
})();