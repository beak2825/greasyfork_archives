// ==UserScript==
// @name               Earncryptowrs.in Auto faucet
// @namespace          bekerja pada Tampermonkey maupun Violentmonkey
// @version            0.7
// @description        Auto Login, Auto Claim, Auto Redirect, Anti-Batas Klaim
// @author             Ojo Ngono
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_addStyle
// @grant              GM_setClipboard
// @grant              GM_registerMenuCommand
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require            https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match              https://earncryptowrs.in/*
// @license            Copyright OjoNgono
// @antifeature        referral-link Directs to a referral link when not logged in
// @icon               https://i.ibb.co/XJSPdz0/large.png
// @downloadURL https://update.greasyfork.org/scripts/509471/Earncryptowrsin%20Auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/509471/Earncryptowrsin%20Auto%20faucet.meta.js
// ==/UserScript==


const cfg = new MonkeyConfig({
  title: 'Pengaturan Cryptoads',
  menuCommand: 'Buka Pengaturan',
  shadowWidth: '650px',
  shadowHeight: '500px',
  iframeWidth: '620px',
  iframeHeight: '450px',
  params: {
    Email: {
      label: "Email FaucetPay",
      type: "text",
      default: "",
      column: 'top'
    },
    cryptoChoice: {
          label: "Pilih Crypto",
          type: "select",
          choices: {
            doge: "DOGE",
            ltc: "LTC",
            sol: "SOL",
            trx: "TRX",
            usdt: "USDT",
            pepe: "PEPE",
            dgb: "DGB",
            bnb: "BNB"
          },
          default: "LTC"
    }
  }
});

(function () {
  'use strict';

  window.addEventListener('load', () => {
    const email = cfg.get('Email')?.trim();
    const crypto = cfg.get('cryptoChoice')?.toUpperCase() || 'LTC';
    const logoutButton = document.querySelector('a[href*="/logout"]');
    const loginButton = document.querySelector('button[type="submit"].btn.btn-responsive');
    const isLoggedIn = !loginButton || loginButton.textContent.trim().toLowerCase() !== 'login';
    const hasReferral = location.search.includes('r=2215');
    const currentUrl = window.location.href;

    // 🔁 Paksa 
    if (!isLoggedIn && !hasReferral) {
      location.href = 'https://earncryptowrs.in/?r=2215';
      return;
    }

    // 🛑 Paksa 
    if (isLoggedIn && (!email || email === '')) {
  Swal.fire({
    icon: 'warning',
    title: 'Email FaucetPay belum diisi!',
    text: 'Anda sudah login, tetapi belum mengisi Email FaucetPay di pengaturan.',
    confirmButtonText: 'Ya, logout',
    confirmButtonColor: '#d33',
    allowOutsideClick: false,
    allowEscapeKey: false,
    allowEnterKey: false
  }).then(() => {
    if (logoutButton) logoutButton.click();
  });
  return;
}


    // 🔔 Peringatan
    if (!isLoggedIn && (!email || email === '')) {
      Swal.fire({
        icon: 'info',
        title: 'Pengaturan Diperlukan',
        html: `Silakan buka menu <b>'Pengaturan Cryptoads'</b> dari ikon 🐵 userscript di browser Anda,<br>lalu isi Email FaucetPay.`,
        confirmButtonText: 'OK',
      });
      return;
    }

    // ➡️ Redirect 
    if (isLoggedIn && currentUrl.includes('/app/dashboard')) {
      const faucetUrl = `https://earncryptowrs.in/app/faucet?currency=${crypto}`;
      if (currentUrl !== faucetUrl) {
        window.location.href = faucetUrl;
        return;
      }
    }

    // ✅ Auto 
    if (isLoggedIn && currentUrl.includes('/app/faucet')) {
      const claimBtn = document.querySelector('button.claim-button');

      const captchaChecker = setInterval(() => {
        const captchaBox = document.querySelector('.iconcaptcha-widget');
        if (captchaBox) {
          captchaBox.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        const captchaPassed = document.querySelector('.iconcaptcha-widget.iconcaptcha-success');
        const captchaNotFound = !captchaBox;

        if ((captchaPassed || captchaNotFound) && claimBtn) {
          claimBtn.click();
          clearInterval(captchaChecker);
        }
      }, 1000);
    }

    // ✅ Auto login
    const form = document.querySelector('form[action*="auth/validation"]');
    const emailInput = document.querySelector('input[name="wallet"]');
    const submitButton = form?.querySelector('button[type="submit"]');

    if (form && emailInput && submitButton && email) {
      emailInput.value = email;

      const checker = setInterval(() => {
        const captchaPassed = document.querySelector('.iconcaptcha-widget.iconcaptcha-success');
        const captchaNotPresent = !document.querySelector('.iconcaptcha-widget');

        if (captchaPassed || captchaNotPresent) {
          submitButton.click();
          clearInterval(checker);
        }
      }, 1000);
    }

    // ✅ Deteksi 
    function cleanText(text) {
      return text.replace(/\s+/g, " ").trim();
    }

    // ✅
    function checkForMessage() {
      const messageSelectors = [
        '.swal2-html-container',
        '.swal-text',
        '.swal-title'
      ];

      const keywords = [
        "After every",
        "faucet claims",
        "Shortlink must be completed"
      ];

      for (const selector of messageSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const el of elements) {
          const messageText = el.innerText?.replace(/\s+/g, " ").trim();
          if (!messageText) continue;

          const isTargetMessage = keywords.some(kw => messageText.toLowerCase().includes(kw.toLowerCase()));
          if (isTargetMessage) {
            console.log("✅ Deteksi pesan batas klaim:", messageText);
            const match = window.location.href.match(/currency=([A-Z]+)/i);
            const currency = match ? match[1].toLowerCase() : 'doge';

            setTimeout(() => {
              window.location.href = `https://earncryptowrs.in/app/links?currency=${currency}`;
            }, 1500);

            return;
          }
        }
      }
    }

    setInterval(checkForMessage, 1000);
  });
})();