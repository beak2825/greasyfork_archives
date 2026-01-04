// ==UserScript==
// @name         Computer Purchase Info
// @namespace    http://yourdomain.example.com/
// @version      1.0
// @description  Adds a paragraph about computer purchasing to the page
// @author       Your Name
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537719/Computer%20Purchase%20Info.user.js
// @updateURL https://update.greasyfork.org/scripts/537719/Computer%20Purchase%20Info.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const container = document.createElement('div');
    container.innerHTML = `
        <h1>Making the Right Computer Purchase</h1>
        <p>
            Buying a computer requires careful thought about your needs and budget to ensure you choose the right device.
            Whether it's a laptop for studying, a gaming desktop, or a professional workstation, important features like processor
            power, memory, storage type, and graphics performance should be considered. It's also wise to compare different brands,
            read user reviews, and check for solid warranty and customer service options. With the right balance of performance and
            cost, you can select a computer that meets your requirements without going over budget.
        </p>
    `;

    // Style it a bit (optional)
    container.style.padding = '20px';
    container.style.backgroundColor = '#f0f0f0';
    container.style.fontFamily = 'Arial, sans-serif';

    // Insert into body
    document.body.prepend(container);
})();