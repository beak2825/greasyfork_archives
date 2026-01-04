// ==UserScript==
// @name        YouTube Studio Restorer (Pra-Juni 2023)
// @namespace   Violentmonkey Scripts
// @match       https://studio.youtube.com/*
// @grant       GM_addStyle
// @version     1.0
// @author      Anda (Giovanno Felix Cahyadi)
// @description Mengembalikan tampilan YouTube Studio ke versi pra-Juni 2023 berdasarkan gambar.
// @downloadURL https://update.greasyfork.org/scripts/530173/YouTube%20Studio%20Restorer%20%28Pra-Juni%202023%29.user.js
// @updateURL https://update.greasyfork.org/scripts/530173/YouTube%20Studio%20Restorer%20%28Pra-Juni%202023%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Gaya untuk mengembalikan elemen visual utama
    GM_addStyle(`
        /* Gaya untuk header dan navigasi */
        ytd-topbar-menu-button.style-scope.ytd-topbar-menu-button-renderer {
            background-color: #f0f0f0;
            border: 1px solid #ddd;
            padding: 8px 16px;
            border-radius: 4px;
            margin-right: 8px;
            font-weight: bold;
        }

        ytd-topbar-menu-button-renderer.style-scope.ytd-topbar-menu-button-renderer:hover {
            background-color: #e0e0e0;
        }

        /* Gaya untuk sidebar */
        ytd-guide-renderer.style-scope.ytd-app {
            background-color: #f9f9f9;
            border-right: 1px solid #eee;
            width: 240px;
        }

        /* Gaya untuk konten utama */
        ytd-browse.style-scope.ytd-page-manager {
            padding: 20px;
        }

        /* Gaya untuk kartu konten */
        ytd-video-renderer.style-scope.ytd-grid-video-renderer {
            border: 1px solid #eee;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 20px;
        }

        /* Gaya untuk ikon dan tombol */
        .yt-icon.style-scope.yt-icon-button {
            color: #666;
        }

        yt-icon-button.style-scope.paper-icon-button {
            padding: 8px;
        }

        /* Gaya untuk elemen lain sesuai gambar */
        /* ... tambahkan gaya lain sesuai kebutuhan ... */
    `);

    // Fungsi untuk mengubah struktur DOM (jika diperlukan)
    function restoreLayout() {
        // Contoh: Mengubah posisi elemen atau menambahkan elemen baru
        // ... kode JavaScript untuk memanipulasi DOM ...
    }

    // Panggil fungsi restoreLayout saat halaman dimuat
    restoreLayout();
})();
