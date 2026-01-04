// ==UserScript==
// @name         YouTube Studio - Non-Rounded Design (2023)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Mengembalikan desain YouTube Studio ke tampilan non-rounded seperti pada tahun 2023.
// @author       You (Giovanno Felix Cahyadi)
// @match        https://studio.youtube.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/530150/YouTube%20Studio%20-%20Non-Rounded%20Design%20%282023%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530150/YouTube%20Studio%20-%20Non-Rounded%20Design%20%282023%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS untuk menghilangkan rounded corners
    GM_addStyle(`
        /* Menghilangkan rounded corners pada elemen utama */
        ytd-studio,
        ytd-studio #content,
        ytd-studio #page-content,
        ytd-studio #secondary-content {
            border-radius: 0 !important;
        }

        /* Menghilangkan rounded corners pada card dan panel */
        ytd-card,
        ytd-panel-layout,
        paper-material {
            border-radius: 0 !important;
        }

        /* Menghilangkan rounded corners pada tombol dan input */
        paper-button,
        paper-input,
        paper-textarea {
            border-radius: 0 !important;
        }

        /* Menghilangkan rounded corners pada dialog dan pop-up */
        paper-dialog,
        paper-menu-button,
        paper-listbox {
            border-radius: 0 !important;
        }

        /* Menghilangkan rounded corners pada tab */
        paper-tabs {
            border-radius: 0 !important;
        }

        /* Tambahkan aturan CSS lain jika diperlukan untuk elemen spesifik */
    `);
})();
