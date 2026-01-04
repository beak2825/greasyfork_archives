// ==UserScript==
// @name         earncryptowrs - Autoclaim Faucet
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Autoclaim faucet, login manual
// @author       iewilmaestro
// @license      Copyright iewilmaestro
// @match        *://earncryptowrs.in/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=earncryptowrs.in
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518530/earncryptowrs%20-%20Autoclaim%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/518530/earncryptowrs%20-%20Autoclaim%20Faucet.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Array dengan elemen-elemen yang ingin dihapus berdasarkan class, id, name, atau href
    const selectors = [
        '.link',              // class
        '.advertisement',   // class
        '.ads',
        '.block',
        '.link-image',
        '#popup-ad',        // id
        '#popup-content',
        '#cryptocoinsad',
        '[name="ad-banner"]', // name
        'a[href*="advertisement"]', // href
        'a[href*="click.php"]',
    ];

    // Menghapus semua elemen yang sesuai dengan selector
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            console.log(`Menghapus elemen: ${selector}`);
            element.remove();
        });
    });

    // Apapun dengan element src
    const allElementsWithSrc = document.querySelectorAll('[src]');
    allElementsWithSrc.forEach(element => {
        if (element.src && element.src.includes('ads_banner') || element.src.includes('fpadserver')) {
            console.log('Menghapus elemen dengan src yang mengandung ads_banner');
            element.remove();
        }
    });

    // Mengambil semua tautan (anchor tags) dengan kelas 'collapse-item'
    const links = document.querySelectorAll('a.collapse-item');

    // Filter URL yang mengandung path 'faucet'
    const faucetLinks = Array.from(links)
                              .map(link => link.href)
                              .filter(href => href.includes('/faucet/'));

    // Mengecek jika ada URL yang ditemukan
    if (faucetLinks.length > 0) {
        // Mengambil currentIndex dari localStorage jika ada, atau set ke 0 jika tidak ada
        let currentIndex = localStorage.getItem('currentIndex') ? parseInt(localStorage.getItem('currentIndex')) : 0;

        // Fungsi untuk berpindah ke URL berikutnya setelah captcha diselesaikan
        function navigateToNextLink() {

            checkForFirewall();

            if (document.location.pathname.includes('dashboard')) {
                window.location.href = faucetLinks[currentIndex];
            }

            // Cek jika faucet memiliki batas klaim harian yang tercapai
            const Daily = document.body.outerText.includes('Daily claim limit');
            const Bankrut = document.body.outerText.includes("The faucet does not have");
            const Please = document.body.outerText.includes("Please wait");

            if (Daily || Bankrut || Please) {
                console.log('Batas klaim harian tercapai, menghapus URL faucet ini dari array dan melanjutkan ke URL berikutnya');

                // Pindah ke URL faucet berikutnya jika ada
                if (faucetLinks.length > 0) {
                    currentIndex = (currentIndex + 1) % faucetLinks.length;  // Naikkan currentIndex
                    localStorage.setItem('currentIndex', currentIndex);  // Simpan currentIndex ke localStorage

                    console.log(`Menavigasi ke: ${faucetLinks[currentIndex]}`);
                    window.location.href = faucetLinks[currentIndex];
                }
                return; // Jangan lanjutkan lebih jauh jika faucet ini sudah diblokir
            }

            // Mengecek apakah faucet saat ini sudah selesai CAPTCHA-nya
            const turnstile = document.querySelector('input[name="cf-turnstile-response"]')?.value;
            const antibotlinks = document.querySelector('input[name="antibotlinks"]')?.value;

            // Cek jika kedua captcha sudah terisi dengan kondisi:
            if (!turnstile || !antibotlinks || turnstile.length === "" || antibotlinks.length < 12) {
                console.log('Captcha belum diselesaikan. Tunggu...');
                return; // Tunggu tanpa reload halaman
            }

            // Tunggu sedikit waktu setelah berpindah halaman untuk memastikan halaman dimuat sepenuhnya
            setTimeout(() => {
                // Mencari tombol dengan ID 'subbutt'
                const claimButton = document.querySelector('#subbutt');

                if (claimButton && claimButton.innerText.includes('Claim Now')) {
                    console.log('Captcha selesai, mengklik tombol Claim Now');
                    claimButton.click(); // Klik tombol Claim Now
                } else {
                    console.log('Tombol Claim Now tidak ditemukan');
                }
            }, 2000); // Tunggu 2 detik setelah halaman dimuat
        }

        // Fungsi untuk mengecek adanya firewall atau proteksi berdasarkan pathname URL
        function checkForFirewall() {
            setTimeout(() => {
                // Mengecek apakah pathname URL mengandung 'firewall'
                if (document.location.pathname.includes('firewall')) {
                    console.log('Firewall atau proteksi terdeteksi berdasarkan pathname URL.');

                    // Mengambil nilai dari input captcha berdasarkan 'name'
                    const turnstile = document.querySelector('input[name="cf-turnstile-response"]')?.value;

                    // Cek apakah captcha sudah terisi
                    if (!turnstile || turnstile.trim() === "") {
                        console.log('Captcha firewall belum diselesaikan. Tunggu...');
                        return; // Tunggu tanpa reload halaman
                    }

                    // Cari tombol 'Unlock' dan klik
                    const unlockButton = document.querySelector('button.btn.btn-primary.w-md');
                    if (unlockButton && unlockButton.innerText.includes('Unlock')) {
                        console.log('Captcha firewall selesai, mengklik tombol Unlock');
                        unlockButton.click(); // Klik tombol Unlock
                    }
                } else {
                    console.log('Tidak ada indikasi firewall pada pathname URL.');
                    // Lanjutkan dengan alur berikutnya
                }
            }, 3000); // Tunggu 3 detik setelah tombol diklik untuk memeriksa firewall
        }

        // Menjalankan fungsi navigateToNextLink setiap 5 detik
        setInterval(navigateToNextLink, 3000);
    } else {
        console.log('Tidak ditemukan URL faucet!');
    }
})();
