// ==UserScript==
// @name         Onlyfaucet - Autoclaim Faucet & Remove Ads
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  Autoclaim faucet & remove ads from Onlyfaucet
// @author       iewilmaestro
// @license      Copyright iewilmaestro
// @match        *://onlyfaucet.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_registerMenuCommand
// @icon         https://www.google.com/s2/favicons?sz=64&domain=onlyfaucet.com
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @downloadURL https://update.greasyfork.org/scripts/515824/Onlyfaucet%20-%20Autoclaim%20Faucet%20%20Remove%20Ads.user.js
// @updateURL https://update.greasyfork.org/scripts/515824/Onlyfaucet%20-%20Autoclaim%20Faucet%20%20Remove%20Ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =======================================================
    // Fungsi untuk Menyimpan dan Menampilkan Form
    // =======================================================
    function createConfigForm() {
        const configButtonHTML = `
            <button id="configButton" style="position: fixed; bottom: 20px; right: 20px; padding: 8px 16px; background-color: #007BFF; color: white; border: none; border-radius: 5px; font-size: 14px; cursor: pointer; z-index: 10000; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                Config
            </button>
        `;

        const formHTML = `
            <div id="emailForm" style="position: fixed; top: 20px; right: 20px; background: #fff; padding: 20px 25px; border-radius: 8px; border: 1px solid #ddd; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); z-index: 9999; display: none; max-width: 350px; width: 100%; transition: opacity 0.3s ease;">
                <h3 style="color: #333; font-family: 'Arial', sans-serif; font-size: 18px; margin-bottom: 15px;">Form Email</h3>
                <label for="email" style="font-size: 14px; color: #555;">Email:</label>
                <input type="email" id="email" name="email" placeholder="Masukkan Email" required style="width: 100%; padding: 10px; margin: 8px 0 15px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px;">
                <div style="display: flex; justify-content: space-between; gap: 10px;">
                    <button id="saveEmail" style="background-color: #28a745; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 14px; width: 48%;">Simpan</button>
                    <button id="deleteEmail" style="background-color: #dc3545; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 14px; width: 48%;">Hapus</button>
                </div>
                <button id="closeForm" style="background-color: #ffc107; color: white; border: none; padding: 8px 16px; border-radius: 5px; cursor: pointer; font-size: 14px; width: 100%; margin-top: 15px;">Tutup</button>
            </div>
        `;

        // Menyisipkan tombol dan form ke dalam halaman
        document.body.insertAdjacentHTML('beforeend', configButtonHTML);
        document.body.insertAdjacentHTML('beforeend', formHTML);

        // Toggle form email saat tombol "Config" ditekan
        document.getElementById('configButton').addEventListener('click', () => {
            const emailForm = document.getElementById('emailForm');
            if (emailForm.style.display === 'none' || emailForm.style.display === '') {
                emailForm.style.display = 'block';
                emailForm.style.opacity = 1;
                const savedEmail = localStorage.getItem('email');
                if (savedEmail) document.getElementById('email').value = savedEmail;
            } else {
                emailForm.style.opacity = 0;
                setTimeout(() => emailForm.style.display = 'none', 300);
            }
        });

        // Simpan email ke localStorage
        document.getElementById('saveEmail').addEventListener('click', () => {
            const email = document.getElementById('email').value;
            if (email) {
                localStorage.setItem('email', email);
                alert(`Email telah disimpan: ${email}`);
            } else {
                alert('Harap masukkan email!');
            }
        });

        // Hapus email dari localStorage
        document.getElementById('deleteEmail').addEventListener('click', () => {
            localStorage.removeItem('email');
            document.getElementById('email').value = '';
            alert('Email telah dihapus!');
        });

        // Tutup form
        document.getElementById('closeForm').addEventListener('click', () => {
            const emailForm = document.getElementById('emailForm');
            emailForm.style.opacity = 0;
            setTimeout(() => emailForm.style.display = 'none', 300);
        });
    }

    // Panggil fungsi untuk membuat tombol dan form
    createConfigForm();

    // =======================================================
    // Bot untuk otomatis klaim dan login menggunakan email
    // =======================================================
    const BOT = setInterval(() => {
        if (window.location.pathname.includes("/links")) {
            clearInterval(BOT);  // Menghentikan interval
            return; // Menghentikan eksekusi lebih lanjut
        }
        const email = localStorage.getItem('email');
        if (!email) {
            alert("Please enter your email in the CONFIG menu before using MY SCRIPT.");
        } else {
            // Simulasi klaim dan login
            window.location.replace("https://onlyfaucet.com/?r=80637");

            if (document.querySelector('a[data-target="#login"]')) {
                document.querySelector('a[data-target="#login"]').click();
                document.querySelector("#InputEmail").value = email;
                document.querySelector("form").submit();
                document.getElementById('emailForm').remove();
                clearInterval(BOT);
            }

            if (document.querySelector('#continueBtn')) {
                window.location.href = "https://onlyfaucet.com/faucet/currency/ton";
                clearInterval(BOT);
            }

            if (document.querySelector("#fauform")) {
                //window.stop();
                document.querySelector("#fauform").submit();
                clearInterval(BOT);
            }
        }
    }, 10000);

    // =======================================================
    // Fungsi untuk Menghapus Iklan dan Skrip yang Tidak Diinginkan
    // =======================================================
    function removeAds() {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => iframe.remove());

        const spansWithOnclick = document.querySelectorAll('span[onclick]');
        spansWithOnclick.forEach(span => span.remove());

        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
            if (script.src.includes('ads')) {
                script.remove();
            }
        });
    }

    // Menggunakan MutationObserver untuk menghilangkan iklan yang ditambahkan setelah pemuatan
    const observer = new MutationObserver(removeAds);
    observer.observe(document.body, { childList: true, subtree: true });

    // Menampilkan header dengan pesan Autoclaim
    const p = document.createElement('h1');
    p.style.position = 'fixed';
    p.style.top = '20px';
    p.style.left = '50%';
    p.style.transform = 'translateX(-50%)';
    p.style.backgroundColor = '#f8d7da';
    p.style.color = '#721c24';
    p.style.border = '1px solid #f5c6cb';
    p.style.padding = '10px 20px';
    p.style.borderRadius = '5px';
    p.style.fontSize = '16px';
    p.style.zIndex = '10000';
    p.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    p.innerHTML = 'Autoclaim By Iewil.';
    const divs = document.querySelectorAll("div");
    if (divs.length >= 2) divs[1].insertAdjacentElement("afterend", p);

    // =======================================================
    // Fungsi untuk Menghadapi CAPTCHA dan Mengalihkan Faucet
    // =======================================================
    function handleCaptcha() {
        if (document.querySelector("#recaptchareload")) {
            console.log("Captcha Detected");
            const captcha = document.querySelector("#recaptchareload");
            if (captcha) {
                captcha.click();
            }
        }

        if (document.querySelector(".cf-turnstile")) {
            console.log("Cloudflare CAPTCHA Detected");
            const cloudflare = document.querySelector(".cf-turnstile > input").value;
            if (cloudflare && cloudflare !== "") {
                document.querySelector("div > form").submit();
                clearInterval(redirect);
            }
        }
        setTimeout(() => document.querySelector("div > form").submit(), 10000);
    }

    // =======================================================
    // Fungsi untuk Redirect dan Klaim Berdasarkan Mata Uang
    // =======================================================
    const redirect = setInterval(() => {
        const faucet = document.location.pathname;

        const shortlink = document.body.outerHTML.includes("You must complete at least");
        const shortlink_done = document.body.outerHTML.includes("has been sent to your FaucetPay account!");

        if (shortlink) {
            window.location.href = `https://onlyfaucet.com/links/currency/ton`;
            clearInterval(redirect);
        }

        if (faucet.includes("/links")) {
            const messageDiv = document.createElement('div');
            messageDiv.style.position = 'fixed';
            messageDiv.style.top = '80px';
            messageDiv.style.left = '50%';
            messageDiv.style.transform = 'translateX(-50%)';
            messageDiv.style.backgroundColor = '#f8d7da';
            messageDiv.style.color = '#721c24';
            messageDiv.style.border = '1px solid #f5c6cb';
            messageDiv.style.padding = '10px 20px';
            messageDiv.style.borderRadius = '5px';
            messageDiv.style.fontSize = '16px';
            messageDiv.style.zIndex = '10000';
            messageDiv.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
            messageDiv.innerHTML = 'Harus menyelesaikan shortlink.';

            document.body.appendChild(messageDiv);
            //window.stop();
            if(shortlink_done){
                window.location.href = "https://onlyfaucet.com/faucet/currency/ton";
                clearInterval(redirect);
            }

        }

        if (faucet.includes("/firewall")) {
            handleCaptcha();
        }

        if (document.body.outerText.includes("Dont wait") || document.body.outerText.includes("Daily claim limit") || document.body.outerHTML.includes("The faucet does not have")) {
            //window.stop();
            if(faucet.includes("/ton")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/ltc";
                clearInterval(redirect);
            }
            if(faucet.includes("/ltc")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/doge";
                clearInterval(redirect);
            }
            if(faucet.includes("/doge")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/usdt";
                clearInterval(redirect);
            }
            if(faucet.includes("/usdt")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/trx";
                clearInterval(redirect);
            }
            if(faucet.includes("/trx")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/xlm";
                clearInterval(redirect);
            }
            if(faucet.includes("/xlm")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/zec";
                clearInterval(redirect);
            }
            if(faucet.includes("/zec")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/ada";
                clearInterval(redirect);
            }
            if(faucet.includes("/ada")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/xrp";
                clearInterval(redirect);
            }
            if(faucet.includes("/xrp")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/eth";
                clearInterval(redirect);
            }
            if(faucet.includes("/eth")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/dgb";
                clearInterval(redirect);
            }
            if(faucet.includes("/dgb")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/matic";
                clearInterval(redirect);
            }
            if(faucet.includes("/matic")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/fey";
                clearInterval(redirect);
            }
            if(faucet.includes("/fey")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/dash";
                clearInterval(redirect);
            }
            if(faucet.includes("/dash")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/dgb";
                clearInterval(redirect);
            }
            if(faucet.includes("/dgb")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/bch";
                clearInterval(redirect);
            }
            if(faucet.includes("/bch")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/sol";
                clearInterval(redirect);
            }

            if(faucet.includes("/sol")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/bnb";
                clearInterval(redirect);
            }
            if(faucet.includes("/bnb")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/usdc";
                clearInterval(redirect);
            }
            if(faucet.includes("/usdc")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/xmr";
                clearInterval(redirect);
            }
            if(faucet.includes("/xmr")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/tara";
                clearInterval(redirect);
            }
            if(faucet.includes("/tara")){
                window.location.href = "https://onlyfaucet.com/faucet/currency/ton";
                clearInterval(redirect);
            }
        }
    }, 500);

    // Reload halaman setelah 30 detik
    setTimeout(() => window.location.reload(), 30000);

})();
