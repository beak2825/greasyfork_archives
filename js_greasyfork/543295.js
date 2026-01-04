// ==UserScript==
// @name         Disable ChatGPT Login Popup
// @name:en      Disable ChatGPT Login Popup
// @namespace    Violentmonkey Scripts
// @version      1.0
// @description  Menghilangkan popup login & "Sign up" di chatgpt.com dengan lebih agresif menggunakan CSS injection dan MutationObserver.
// @description:en Aggressively removes the login & "Sign up" popup on chatgpt.com using CSS injection and MutationObserver.
// @author       3xploiton3
// @match        https://chatgpt.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543295/Disable%20ChatGPT%20Login%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/543295/Disable%20ChatGPT%20Login%20Popup.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Selektor untuk popup dan elemen pengganggu lainnya.
    // Ini mungkin perlu disesuaikan jika OpenAI mengubah desain situsnya.
    // ---
    // Selectors for the popup and other intrusive elements.
    // These may need to be adjusted if OpenAI changes the site design.
    const SELECTORS_TO_REMOVE = [
        '[data-testid="modal-no-auth-welcome-back"]', // Popup utama "Welcome back" // Main "Welcome back" popup
        '.group.fixed.bottom-3.right-3', // Tombol "Get help" yang mengambang // Floating "Get help" button
        'div.w-full.text-center.text-xs' // Banner "Sign up to chat" di bawah // "Sign up to chat" banner at the bottom
    ];

    // Selektor untuk backdrop/overlay yang menggelapkan dan mengunci halaman.
    // ---
    // Selector for the backdrop/overlay that darkens and locks the page.
    const BACKDROP_SELECTOR = 'div[data-radix-portal] + div';

    // --- Langkah 1: Sembunyikan Elemen Secara Instan dengan CSS ---
    // @run-at document-start memastikan CSS ini diterapkan sebelum halaman dirender.
    // Ini adalah cara paling efektif untuk mencegah "flash" atau kemunculan singkat popup.
    // ---
    // --- Step 1: Instantly Hide Elements with CSS ---
    // @run-at document-start ensures this CSS is applied before the page is rendered.
    // This is the most effective way to prevent a "flash" or brief appearance of the popup.
    GM_addStyle(`
        ${SELECTORS_TO_REMOVE.join(',\n')} {
            display: none !important;
            opacity: 0 !important;
            pointer-events: none !important;
        }
        ${BACKDROP_SELECTOR} {
            display: none !important;
        }
    `);

    // --- Langkah 2: Hapus Elemen dari DOM & Perbaiki Scroll ---
    // MutationObserver akan memantau setiap perubahan pada halaman.
    // ---
    // --- Step 2: Remove Elements from the DOM & Fix Scrolling ---
    // The MutationObserver will monitor any changes on the page.
    const observer = new MutationObserver((mutations) => {
        let popupFound = false;

        // Loop untuk mencari dan menghapus semua elemen yang tidak diinginkan.
        // ---
        // Loop to find and remove all unwanted elements.
        for (const selector of SELECTORS_TO_REMOVE) {
            const element = document.querySelector(selector);
            if (element) {
                element.remove();
                popupFound = true; // Tandai jika salah satu elemen ditemukan & dihapus // Mark if an element was found & removed
            }
        }

        // Cari dan hapus backdrop secara terpisah.
        // ---
        // Find and remove the backdrop separately.
        const backdrop = document.querySelector(BACKDROP_SELECTOR);
        if (backdrop) {
            backdrop.remove();
            popupFound = true;
        }

        // Jika popup atau backdrop ditemukan dan dihapus,
        // pastikan scroll halaman diaktifkan kembali.
        // ---
        // If a popup or backdrop was found and removed,
        // ensure page scrolling is re-enabled.
        if (popupFound) {
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';
        }
    });

    // Mulai amati perubahan dari root elemen (<html>) sesegera mungkin.
    // ---
    // Start observing changes from the root element (<html>) as soon as possible.
    observer.observe(document.documentElement, {
        childList: true, // Amati penambahan/penghapusan elemen anak // Observe addition/removal of child elements
        subtree: true    // Amati seluruh sub-pohon (semua elemen di dalam <html>) // Observe the entire subtree (all elements within <html>)
    });

})();