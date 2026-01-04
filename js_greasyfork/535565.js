// ==UserScript==
// @name         Ylilauta NavbarFix
// @namespace    https://greasyfork.org/
// @version      2.5
// @description  Kiinteä navbar & sidebar, scroll offset ja scroll-margin-top, mobiili safe-area tuki.
// @description:en Fixed navbar & sidebar, scroll offset and scroll-margin-top, with mobile safe-area support.
// @author       ChatGPT
// @match        https://ylilauta.org/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535565/Ylilauta%20NavbarFix.user.js
// @updateURL https://update.greasyfork.org/scripts/535565/Ylilauta%20NavbarFix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const navbarHeight = document.getElementById('navbar')?.offsetHeight || 40;
    document.documentElement.style.setProperty('--navbar-height', `${navbarHeight}px`);

    GM_addStyle(`
        #navbar {
            position: fixed;
            top: 0;
            width: 100%;
            height: var(--navbar-height);
            z-index: 1000;
        }
        body {
            padding-top: var(--navbar-height);
        }
        #sidebar {
            position: fixed;
            top: calc(var(--navbar-height) + env(safe-area-inset-top, 0));
            bottom: env(safe-area-inset-bottom, 0);
            overflow-y: auto;
        }
        .post {
            scroll-margin-top: calc(var(--navbar-height) + 16px) !important;
        }
    `);

    function scrollToHighlighted() {
        const el = document.querySelector('.post.highlighted');
        if (el) {
            const metaHeight = 32;
            const margin = 5;
            const y = window.scrollY + el.getBoundingClientRect().top - navbarHeight - metaHeight - margin;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    }

    window.addEventListener('load', () => {
        setTimeout(scrollToHighlighted, 200);
    });

    document.addEventListener('click', e => {
        const ref = e.target.closest('.ref');
        if (ref && ref.dataset.postId) {
            setTimeout(scrollToHighlighted, 200);
        }
    });

    window.addEventListener('hashchange', () => {
        setTimeout(scrollToHighlighted, 200);
    });

})();