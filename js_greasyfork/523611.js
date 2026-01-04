// ==UserScript==
// @name               ClaimCrypto Auto faucet
// @namespace          bekerja pada Tampermonkey maupun Violentmonkey
// @version            0.3
// @description        Automatically Login and Click Faucet
// @author             Ojo Ngono
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_addStyle
// @grant              GM_setClipboard
// @grant              GM_registerMenuCommand
// @require            https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require            https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match              https://claimcrypto.in/*
// @license            Copyright OjoNgono
// @antifeature        referral-link Directs to a referral link when not logged in
// @icon               https://i.ibb.co/XJSPdz0/large.png
// @downloadURL https://update.greasyfork.org/scripts/523611/ClaimCrypto%20Auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/523611/ClaimCrypto%20Auto%20faucet.meta.js
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
        pepe: "PEPE", dgb: "DGB", bnb: "BNB", eth: "ETH", tara: "TARA",
        xmr: "XMR", fey: "FEY", usdc: "USDC", dash: "DASH", xlm: "XLM",
        ada: "ADA", pol: "POL", ton: "TON", xrp: "XRP", bch: "BCH", zec: "ZEC",
        trump: "TRUMP"
      },
      default: "LTC"
    }
  }
});

(function () {
  'use strict';

  window.addEventListener('load', () => {

    const email = cfg.get('Email');
    const selectedCrypto = cfg.get('cryptoChoice');

    if (!email || email.trim() === '') {
      enforceLogoutWithWarning();
    } else {
      enforceReferralUrl();
      setTimeout(() => {
        if (!isLoggedIn()) {
          fillLoginForm(email);
        } else {
          redirectToCrypto(selectedCrypto);
        }
      }, 1000);
    }

    if (!isLoggedIn() && (!email || email === '')) {
      Swal.fire({
        icon: 'info',
        title: 'Pengaturan Diperlukan',
        html: `Silakan buka menu <b>'Pengaturan Cryptoads'</b> dari ikon 🐵 userscript di browser Anda,<br>lalu isi Email FaucetPay.`,
        confirmButtonText: 'OK',
      });
      return;
    }

  });

  function isLoggedIn() {
    const loginButton = document.querySelector('button.cta-btn[type="submit"]');
    return !(loginButton && loginButton.textContent.trim().toLowerCase() === "login");
  }

  function enforceLogoutWithWarning() {
    if (isLoggedIn()) {
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
        const logoutButton = document.querySelector('a[href="https://claimcrypto.in/logout"]');
        if (logoutButton) {
          logoutButton.click();
        } else {
          window.location.replace("https://claimcrypto.in/logout");
        }
      });
    }
  }

  function enforceReferralUrl() {
    if (window.location.href.startsWith("https://claimcrypto.in") && !window.location.href.includes("?r=626")) {
      if (!isLoggedIn()) {
        window.location.replace("https://claimcrypto.in/?r=626");
      }
    }
  }

  function fillLoginForm(email) {
    const form = document.querySelector('form.user');
    if (!form) return;

    const input = form.querySelector('input[name="wallet"]');
    const submit = form.querySelector('button[type="submit"]');

    if (input) {
      input.value = email;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    if (submit) {
      const checker = setInterval(() => {
        const captchaPassed = document.querySelector('.iconcaptcha-widget.iconcaptcha-success');
        if (captchaPassed || !document.querySelector('.iconcaptcha-widget')) {
          submit.click();
          clearInterval(checker);
        }
      }, 1000);
    }
  }

  function redirectToCrypto(crypto) {
    if (window.location.pathname === "/dashboard") {
      window.location.href = `https://claimcrypto.in/faucet/currency/${crypto}`;
    }
  }

  function clickClaimNow() {
    const claimNowButton = document.querySelector('#subbutt');
    if (claimNowButton && claimNowButton.innerText.includes('Claim Now')) {
      window.scrollTo({
        top: claimNowButton.offsetTop - window.innerHeight / 2,
        behavior: 'smooth'
      });

      setTimeout(() => {
        claimNowButton.click();
      }, 3000);
    }
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      clickClaimNow();
    }, 2000);
  });

  function autoGoClaim() {
    const crypto = cfg.get('cryptoChoice');
    if (!window.location.href.includes(`/faucet/currency/${crypto}`)) return;

    const goClaimInterval = setInterval(() => {
      const buttons = document.querySelectorAll('a.btn');
      for (const btn of buttons) {
        if (btn.textContent.trim().toLowerCase() === 'go claim') {
          console.log("✅ Tombol 'Go Claim' ditemukan, klik dalam 1 detik...");
          clearInterval(goClaimInterval);
          setTimeout(() => btn.click(), 1000);
          return;
        }
      }
    }, 1000);
  }

  autoGoClaim();
})();

function cleanText(text) {
  return text.replace(/\s+/g, ' ').trim();
}

let checkInterval;

function checkForMessage() {
  const messageSelectors = ['.swal2-html-container', '.swal-text', '.swal-title'];
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

      const isTargetMessage = keywords.some(kw =>
        messageText.toLowerCase().includes(kw.toLowerCase())
      );

      if (isTargetMessage) {
        console.log("✅ Deteksi pesan batas klaim:", messageText);

        const match = window.location.href.match(/currency\/([a-z]+)/i);
        const currency = match ? match[1].toLowerCase() : 'ltc';

        clearInterval(checkInterval);
        setTimeout(() => {
          window.location.href = `https://claimcrypto.in/links/currency/${currency}`;
        }, 1500);
        return;
      }
    }
  }
}

checkInterval = setInterval(checkForMessage, 1000);

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