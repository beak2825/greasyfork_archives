// ==UserScript==
// @name         liteonion
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  Autoclaim faucet, login manual
// @author       iewilmaestro
// @license      Copyright iewilmaestro
// @match        *://liteonion.online/instant/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=liteonion.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518767/liteonion.user.js
// @updateURL https://update.greasyfork.org/scripts/518767/liteonion.meta.js
// ==/UserScript==

(function() {
    'use strict';

   // Pilih semua elemen <a> di halaman
    const links = document.querySelectorAll('a');
    // Ambil href dan filter yang mengandung '/faucet/'
    const faucetList = Array.from(links)
                              .map(link => link.href)  // Ambil href dari tiap link
                              .filter(href => href.includes('/faucet/'));  // Filter yang mengandung '/faucet/'
    //let faucetLinks = [...new Set(faucetList)]  // Menghilangkan duplikat
    //.filter(url => !url.includes('#faucet') && !url.includes('#links'));  // Menyaring URL yang mengandung '#faucet' atau '#links'
    //console.log(faucetLinks);

    let faucetLinks = [
        "https://liteonion.online/instant/faucet/currency/ltc",
        "https://liteonion.online/instant/faucet/currency/doge",
        "https://liteonion.online/instant/faucet/currency/usdt",
        "https://liteonion.online/instant/faucet/currency/sol",
        "https://liteonion.online/instant/faucet/currency/trx",
        "https://liteonion.online/instant/faucet/currency/bnb",
        "https://liteonion.online/instant/faucet/currency/bch",
        "https://liteonion.online/instant/faucet/currency/dash",
        "https://liteonion.online/instant/faucet/currency/dgb",
        "https://liteonion.online/instant/faucet/currency/eth",
        "https://liteonion.online/instant/faucet/currency/fey",
        "https://liteonion.online/instant/faucet/currency/zec",
        "https://liteonion.online/instant/faucet/currency/matic",
        "https://liteonion.online/instant/faucet/currency/xmr",
        "https://liteonion.online/instant/faucet/currency/ton"
    ];

    if (faucetLinks.length > 0) {
        let currentIndex = localStorage.getItem('currentIndex') ? parseInt(localStorage.getItem('currentIndex')) : 0;

        function navigateToNextLink() {

            checkForFirewall();

            if (document.querySelector('a[href="https://liteonion.online/instant/withdraw"]')) {
                window.location.href = faucetLinks[currentIndex];
            }

            // Cek jika faucet memiliki batas klaim harian yang tercapai
            const Daily = document.body.outerText.includes('Daily claim limit');
            const Bankrut = document.body.outerText.includes("The faucet does not have");
            const Please = document.body.outerText.includes("Please wait");
            const Invalid = document.body.outerText.includes("Invalid");
            const go = document.body.outerText.includes("Go Claim");
            const success = document.body.outerText.includes("has been sent to you");

            if(Daily || Bankrut){
                faucetLinks = faucetLinks.filter(link => link !== window.location.href);

                console.log(faucetLinks); // Cek hasil setelah filter
            }

            if (Daily || Bankrut || Please || Invalid || go || success) {
                // Pindah ke URL faucet berikutnya jika ada
                if (faucetLinks.length > 0) {
                    let currentAwal = currentIndex;
                    currentIndex = (currentIndex + 1) % faucetLinks.length;  // Naikkan currentIndex
                    localStorage.setItem('currentIndex', currentIndex);  // Simpan currentIndex ke localStorage
                    if(currentAwal == currentIndex){
                        currentIndex = (currentIndex + 1) % faucetLinks.length;  // Naikkan currentIndex
                        localStorage.setItem('currentIndex', currentIndex);  // Simpan currentIndex ke localStorage
                    }
                    console.log(`Menavigasi ke: ${faucetLinks[currentIndex]}`);
                    window.location.href = faucetLinks[currentIndex];
                }
                return; // Jangan lanjutkan lebih jauh jika faucet ini sudah diblokir
            }

            const currentUrl = window.location.href;
            const urlStorage = localStorage.getItem('currentUrl');
            let isClaimClicked = localStorage.getItem('isClaimClicked') === 'true';
            if (faucetLinks.length > 1 && currentUrl !== urlStorage) {
                localStorage.removeItem('isClaimClicked');
                localStorage.removeItem('currentUrl');
                console.log('URL saat ini berbeda dengan yang ada di localStorage.');
                // Lakukan aksi sesuai kebutuhan di sini
            } else {
                console.log('URL saat ini sama dengan yang ada di localStorage.');
                return;
            }

            // Mengecek apakah faucet saat ini sudah selesai CAPTCHA-nya
            const recaptchav3 = document.querySelector('input[name="recaptchav3"]')?.value;
            const turnstile = document.querySelector('input[name="cf-turnstile-response"]')?.value;
            const recaptcha = document.querySelector('input[name="g-recaptcha-response"]')?.value;
            const hcaptcha = document.querySelector('input[name="h-captcha-response"]')?.value;

                    // Cek apakah salah satu captcha sudah terisi
            if ((!recaptchav3 || recaptchav3.trim() === "") && (!turnstile || turnstile.trim() === "") && (!recaptcha || recaptcha.trim() === "") && (!hcaptcha || hcaptcha.trim() === "")) {
                console.log('Captcha belum diselesaikan. Tunggu...');
                return; // Tunggu tanpa reload halaman jika keduanya belum diisi
            }

            setTimeout(() => {
                const claimButton = document.querySelector('#subbutt');

                if (claimButton && claimButton.innerText.includes('Claim Now') && !isClaimClicked) {
                    console.log('Captcha selesai, mengklik tombol Claim Now');
                    claimButton.click();

                    localStorage.setItem('currentUrl', window.location.href);
                    localStorage.setItem('isClaimClicked', 'true');

                    // Tambahkan observer untuk memantau perubahan halaman
                    observePageLoad();
                    checkPageTransition(); // Memeriksa apakah halaman berpindah
                } else {
                    console.log('Tombol Claim Now tidak ditemukan atau sudah diklik sebelumnya');
                }
            }, 6000); // Tunggu 6 detik setelah halaman dimuat
        }

        // Fungsi untuk mengecek adanya firewall atau proteksi berdasarkan pathname URL
        function checkForFirewall() {
            setTimeout(() => {
                // Mengecek apakah pathname URL mengandung 'firewall'
                if (document.location.pathname.includes('firewall')) {
                    console.log('Firewall atau proteksi terdeteksi berdasarkan pathname URL.');

                    // Mengambil nilai dari input captcha berdasarkan 'name'
                    const turnstile = document.querySelector('input[name="cf-turnstile-response"]')?.value;
                    const iframeHcap = document.querySelector('iframe[src*="hcaptcha.com"]');
                    const hcaptcha = iframeHcap?.getAttribute('data-hcaptcha-response');

                    // Recaptcha ribet
                    console.log("hcaptcha " + hcaptcha)
                    console.log("turnstile " + turnstile)
                    // Cek apakah salah satu captcha sudah terisi
                    if ((!turnstile || turnstile.trim() === "") && (!hcaptcha || hcaptcha.trim() === "")) {
                        console.log('Captcha firewall belum diselesaikan. Tunggu...');
                        return; // Tunggu tanpa reload halaman jika keduanya belum diisi
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
            }, 6000); // Tunggu 6 detik setelah tombol diklik untuk memeriksa firewall
        }

        setInterval(navigateToNextLink, 10000);
    } else {
        console.log('Tidak ditemukan URL faucet!');
    }
})();