// ==UserScript==
// @name          Eye-Catching Amazon Purchase Info
// @license        Zlib/Libpng License
// @version       0.1
// @description   Makes Amazon purchase information more eye-catching with bold red font and 10px font size.
// @match          *://www.amazon.com/*
// @match          *://www.amazon.ca/*
// @match          *://www.amazon.co.uk/*
// @match          *://www.amazon.de/*
// @match          *://www.amazon.fr/*
// @match          *://www.amazon.it/*
// @match          *://www.amazon.es/*
// @grant         GM_addStyle
// @namespace https://greasyfork.org/users/934737
// @downloadURL https://update.greasyfork.org/scripts/477664/Eye-Catching%20Amazon%20Purchase%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/477664/Eye-Catching%20Amazon%20Purchase%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .eye-catching {
            font-weight: bold;
            color: FireBrick !important;
            font-size: 18px !important;
        }
    `);

    function stylePurchaseInfo() {
        const purchaseInfoElements = document.querySelectorAll('.a-row.a-size-base span');
        for (const element of purchaseInfoElements) {
            const text = element.innerText.toLowerCase();
            if (text.includes('bought in past')) {
                element.classList.add('eye-catching');
            }
        }
    }

    stylePurchaseInfo();
    const observer = new MutationObserver(stylePurchaseInfo);
    observer.observe(document, { subtree: true, childList: true });
})();
