// ==UserScript==
// @name         Amazon Vine Menu Link (Account Dropdown)
// @namespace    https://greasyfork.org/en/users/50935-neonhd
// @version      1.3
// @author       Prismaris
// @description  Add Amazon Vine link to the Account & Lists dropdown under Your Account on all Amazon domains
// @match        https://www.amazon.com/*
// @match        https://www.amazon.ca/*
// @match        https://www.amazon.co.uk/*
// @match        https://www.amazon.de/*
// @match        https://www.amazon.fr/*
// @match        https://www.amazon.it/*
// @match        https://www.amazon.es/*
// @match        https://www.amazon.in/*
// @match        https://www.amazon.com.au/*
// @match        https://www.amazon.com.br/*
// @match        https://www.amazon.com.mx/*
// @match        https://www.amazon.nl/*
// @match        https://www.amazon.pl/*
// @match        https://www.amazon.sg/*
// @match        https://www.amazon.tr/*
// @match        https://www.amazon.ae/*
// @match        https://www.amazon.se/*
// @match        https://www.amazon.sa/*
// @match        https://www.amazon.be/*
// @match        https://www.amazon.eg/*
// @match        https://www.amazon.cn/*
// @match        https://www.amazon.jp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540059/Amazon%20Vine%20Menu%20Link%20%28Account%20Dropdown%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540059/Amazon%20Vine%20Menu%20Link%20%28Account%20Dropdown%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addVineLink() {
        // Find the "Your Account" section's <ul>
        const ul = document.querySelector('#nav-al-your-account ul');
        if (ul && !ul.querySelector('.amazon-vine-link')) {
            const li = document.createElement('li');
            const link = document.createElement('a');
            // Dynamically construct the Vine link for the current Amazon domain
            const vineUrl = window.location.origin.replace(/\/$/, '') + '/vine/';
            link.href = vineUrl;
            link.textContent = 'Amazon Vine';
            link.className = 'amazon-vine-link nav-link nav-item';
            link.style.color = 'rgb(68, 68, 68)';
            link.style.fontWeight = 'bold';
            li.appendChild(link);
            ul.appendChild(li); // Add at the end
        }
    }
    // Listen for mouseover on the Account & Lists menu
    document.getElementById('nav-link-accountList')?.addEventListener('mouseenter', addVineLink);
    // Also run on focus for accessibility
    document.getElementById('nav-link-accountList')?.addEventListener('focusin', addVineLink);
})();