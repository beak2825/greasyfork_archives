// ==UserScript==
// @name               Chillfaucet.in Auto faucet
// @namespace          bekerja pada Tampermonkey maupun Violentmonkey
// @version            0.4
// @description        Auto Login, Auto Claim, Auto Redirect, Anti-Batas Klaim, dan Pemaksaan Referral
// @author             Ojo Ngono
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_addStyle
// @grant              GM_setClipboard
// @grant              GM_registerMenuCommand
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require            https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match              https://chillfaucet.in/*
// @license            Copyright OjoNgono
// @antifeature        referral-link Directs to a referral link when not logged in
// @icon               https://i.ibb.co/XJSPdz0/large.png
// @downloadURL https://update.greasyfork.org/scripts/512475/Chillfaucetin%20Auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/512475/Chillfaucetin%20Auto%20faucet.meta.js
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
    const isLoggedIn = !!document.querySelector('button[onclick="logout()"]');
    const hasReferral = location.search.includes('r=2090');
    const currentUrl = window.location.href;

    // 🔁 Paksa redirect ke referral jika belum login dan belum pakai referal kita
    if (!isLoggedIn && !hasReferral) {
      location.href = 'https://chillfaucet.in/?r=2090';
      return;
    }

    // 🛑 Paksa logout jika sudah login tapi belum isi email FaucetPay
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
        const logoutButton = document.querySelector('button[onclick="logout()"]');
        if (logoutButton) logoutButton.click();
      });
      return;
    }

    // 🔔 Peringatan saat belum login & email belum diisi
    if (!isLoggedIn && (!email || email === '')) {
      Swal.fire({
        icon: 'info',
        title: 'Pengaturan Diperlukan',
        html: `Silakan buka menu <b>'Pengaturan Cryptoads'</b> dari ikon 🐵 userscript di browser Anda,<br>lalu isi Email FaucetPay.`,
        confirmButtonText: 'OK',
      });
      return;
    }

    // ➡️ Redirect dari /dashboard ke /faucet?currency=xxx
    if (isLoggedIn && currentUrl.includes('/app/dashboard')) {
      const faucetUrl = `https://chillfaucet.in/app/faucet?currency=${crypto}`;
      if (currentUrl !== faucetUrl) {
        window.location.href = faucetUrl;
        return;
      }
    }

    // ✅ Auto klik tombol claim jika captcha sudah lolos
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

    // ✅ Deteksi pesan batas klaim dan redirect ke shortlink
    function cleanText(text) {
      return text.replace(/\s+/g, " ").trim();
    }

    function checkForMessage() {
      const messageContainers = document.querySelectorAll('.swal2-html-container');
      if (messageContainers.length === 0) return;

      for (const container of messageContainers) {
        const messageText = cleanText(container.innerText || "");
        const keywords = [
          "After every",
          "faucet claims",
          "Shortlink must be completed"
        ];

        const isTargetMessage = keywords.every(kw => messageText.includes(kw));
        if (isTargetMessage) {
          console.log("✅ Deteksi pesan batas klaim:", messageText);
          const match = window.location.href.match(/currency=([A-Z]+)/i);
          const currency = match ? match[1].toLowerCase() : 'doge';

          setTimeout(() => {
            window.location.href = `https://chillfaucet.in/app/links?currency=${currency}`;
          }, 1500);

          break;
        }
      }
    }

    setInterval(checkForMessage, 1000);
  });
})();