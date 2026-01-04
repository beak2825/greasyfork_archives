// ==UserScript==
// @name                Freeltc.fun Auto faucet
// @namespace           bekerja pada Tampermonkey maupun Violentmonkey
// @version             0.5
// @description         Auto Login, Auto Claim, Auto Redirect, Anti-Batas Klaim
// @author              Ojo Ngono
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_addStyle
// @grant               GM_setClipboard
// @grant               GM_registerMenuCommand
// @require             https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require             https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match               https://freeltc.fun/*
// @license             Copyright OjoNgono
// @antifeature         referral-link Directs to a referral link when not logged in
// @icon                https://i.ibb.co/XJSPdz0/large.png
// @downloadURL https://update.greasyfork.org/scripts/512552/Freeltcfun%20Auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/512552/Freeltcfun%20Auto%20faucet.meta.js
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
        doge: "DOGE", ltc: "LTC", sol: "SOL", trx: "TRX", usdt: "USDT",
        bch: "BCH", dgb: "DGB", bnb: "BNB", eth: "ETH", dash: "DASH",
        zec: "ZEC", fey: "FEY"
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

    const loginButton = document.querySelector('button[type="submit"]');
    const isLoggedIn = !loginButton || loginButton.textContent.trim().toLowerCase() !== 'login & start earning'; 
    const hasReferral = location.search.includes('r=1294');
    const currentUrl = window.location.href;

    // 🔁 Redirect
    if (!isLoggedIn && !hasReferral) {
      location.href = 'https://freeltc.fun/?r=1294';
      return;
    }

    // 🛑 Sudah
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
        window.location.href = "https://freeltc.fun/logout";
      });
      return;
    }

    // 🔔 Belum
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
    if (isLoggedIn && currentUrl.includes('/dashboard')) {
      const faucetUrl = `https://freeltc.fun/faucet/currency/${crypto.toLowerCase()}`;
      if (currentUrl !== faucetUrl) {
        window.location.href = faucetUrl;
        return;
      }
    }

    // ✅ Auto
    if (isLoggedIn && currentUrl.includes('/faucet')) {
    const claimChecker = setInterval(() => {
    const claimBtn = document.querySelector('button#subbutt, button.claim-button');
    const goClaimBtn = document.querySelector('a.btn.btn-primary[href*="/faucet/currency/"]');
    const captchaBox = document.querySelector('.iconcaptcha-widget');
    const captchaPassed = document.querySelector('.iconcaptcha-widget.iconcaptcha-success');
    const captchaNotFound = !captchaBox;

    // 🔽 Scroll
    if (captchaBox && !captchaPassed) {
      captchaBox.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // ✅ Jika
    if ((captchaPassed || captchaNotFound) && claimBtn && !claimBtn.disabled) {
      claimBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        claimBtn.click();
      }, 800);
      clearInterval(claimChecker);
      return;
    }

    // ✅ Jika
    if (goClaimBtn && goClaimBtn.offsetParent !== null) {
      goClaimBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      setTimeout(() => {
        goClaimBtn.click();
      }, 800);
      clearInterval(claimChecker);
    }
  }, 1000);
}

    // ✅ Auto
    if (!isLoggedIn && email) {
      const waitForElm = (sel, timeout = 15000) =>
        new Promise((res, rej) => {
          const el = document.querySelector(sel);
          if (el) return res(el);
          const obs = new MutationObserver(() => {
            const found = document.querySelector(sel);
            if (found) {
              obs.disconnect();
              res(found);
            }
          });
          obs.observe(document.body, { childList: true, subtree: true });
          setTimeout(() => { obs.disconnect(); rej(); }, timeout);
        });

      (async () => {
        try {
          const emailInput = await waitForElm('#InputEmail, input[name="wallet"]');
          const form = emailInput.closest('form');
          const submitBtn = form?.querySelector('button[type="submit"]');

          emailInput.value = email;
          ['input', 'change'].forEach(ev =>
            emailInput.dispatchEvent(new Event(ev, { bubbles: true }))
          );

          const check = setInterval(() => {
            const captchaOK = document.querySelector('.iconcaptcha-widget.iconcaptcha-success');
            const noCaptcha = !document.querySelector('.iconcaptcha-widget');
            if ((captchaOK || noCaptcha) && submitBtn) {
              submitBtn.click();
              clearInterval(check);
            }
          }, 800);
        } catch (e) {
          console.warn('⏰ Input email tidak ditemukan!');
        }
      })();
    }

    // ✅ Deteksi
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
            const match = window.location.href.match(/(?:currency\/|currency=)([a-z]+)/i);
            const currency = match ? match[1].toLowerCase() : 'doge';
            setTimeout(() => {
            window.location.href = `https://freeltc.fun/links/currency/${currency}`;
            }, 1500);
            return;
          }
        }
      }
    }

    setInterval(checkForMessage, 1000);
  });
})();

function removeAdblockOverlay() {
  const adblockDiv = document.getElementById('adblock-locker');
  if (adblockDiv) {
    adblockDiv.remove();
    console.log("🚫 Adblock overlay dihapus.");
  }
}

removeAdblockOverlay();
const adblockInterval = setInterval(removeAdblockOverlay, 1000);
setTimeout(() => clearInterval(adblockInterval), 10000);