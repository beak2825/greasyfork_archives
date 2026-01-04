// ==UserScript==
// @name        Uncommon Gifts Promotion
// @namespace   https://uncommongifts.in/
// @version     1.0
// @description Insert a promotional link and description for Uncommon Gifts
// @author      Your Name
// @match       *://*/*
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/500914/Uncommon%20Gifts%20Promotion.user.js
// @updateURL https://update.greasyfork.org/scripts/500914/Uncommon%20Gifts%20Promotion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const htmlSnippet = `
        <a href="https://uncommongifts.in/">Uncommon Gifts</a> – where every product delivers happiness! Explore a diverse range of high-quality, trend-setting gifts tailored to suit every personality and occasion. Whether you're shopping for tech-savvy colleagues, stylish home décor, delightful kids' presents, or fashionable accessories, we've got you covered. Personalize your gifts with ease and make every occasion special. With fast shipping and exceptional service, Uncommon Gifts ensures your shopping experience is seamless and satisfying. Visit us online today and find the perfect gift that makes a lasting impression.
    `;

    // For demonstration purposes, let's append this to the body
    const div = document.createElement('div');
    div.innerHTML = htmlSnippet;
    document.body.appendChild(div);
})();
