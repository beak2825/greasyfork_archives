// ==UserScript==
// @name         Adblocker with URL-based Detection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Block ads using URL pattern matching
// @author       iewilmaestro
// @license      Copyright iewilmaestro
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520886/Adblocker%20with%20URL-based%20Detection.user.js
// @updateURL https://update.greasyfork.org/scripts/520886/Adblocker%20with%20URL-based%20Detection.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Daftar URL atau pola URL yang sering digunakan untuk iklan
    const adUrls = [
        'ads',            // Mengandung kata 'ads' dalam URL (misalnya, 'example.com/ads')
        'doubleclick.net', // Iklan dari doubleclick.net
        'googlesyndication.com', // Iklan dari Google Adsense
        'adservice.google.com', // Iklan Google
        'amazon-adsystem.com',  // Iklan Amazon
        'pubmatic.com',  // Iklan PubMatic
        'cdn.bmcdn6.com'
        // Tambahkan pola URL lainnya jika perlu
    ];

    // Fungsi untuk menyembunyikan atau menghapus elemen iklan berdasarkan URL
    function hideAdsByUrl() {
        // Periksa iframe, img, dan elemen dengan src yang mengandung URL iklan
        const elementsToCheck = document.querySelectorAll('iframe, img, a, div');

        elementsToCheck.forEach(element => {
            let url = '';

            // Untuk iframe dan gambar, ambil URL dari atribut 'src'
            if (element.tagName === 'IFRAME' || element.tagName === 'IMG') {
                url = element.src;
            }
            // Untuk link (a) ambil URL dari atribut 'href'
            else if (element.tagName === 'A') {
                url = element.href;
            }

            // Jika URL mengandung pola iklan, sembunyikan atau hapus elemen
            if (url && adUrls.some(pattern => url.includes(pattern))) {
                element.style.display = 'none'; // Menyembunyikan elemen
                // element.remove(); // Bisa juga dihapus dari DOM jika diinginkan
            }
        });
    }

    // MutationObserver untuk memantau perubahan di DOM
    const observer = new MutationObserver(hideAdsByUrl);

    // Opsi observer: Memantau perubahan pada subtree dan atribut
    const config = {
        childList: true,
        subtree: true
    };

    // Mulai memantau perubahan pada body
    observer.observe(document.body, config);

    // Jalankan hideAdsByUrl pertama kali untuk menghapus iklan yang sudah ada saat halaman dimuat
    hideAdsByUrl();
})();
