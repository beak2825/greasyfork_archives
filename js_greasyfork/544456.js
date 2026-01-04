// ==UserScript==
// @name                Cryptoads.in Auto Faucet Rotator
// @namespace           Violentmonkey Scripts
// @match               https://cryptoads.in/*
// @version             0.4
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_addStyle
// @grant               GM_registerMenuCommand
// @require             https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require             https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @description         Auto login + rotator faucet + deteksi limit harian Cryptoads.in
// @author              OjoNgono
// @license             Copyright OjoNgono
// @antifeature         referral-link Directs to a referral link when not logged in
// @icon                https://i.ibb.co/XJSPdz0/large.png
// @downloadURL https://update.greasyfork.org/scripts/544456/Cryptoadsin%20Auto%20Faucet%20Rotator.user.js
// @updateURL https://update.greasyfork.org/scripts/544456/Cryptoadsin%20Auto%20Faucet%20Rotator.meta.js
// ==/UserScript==


(function () {
  'use strict';

  // Konfigurasi
  const cfg = new MonkeyConfig({
    title: 'Pengaturan Cryptoads',
    menuCommand: 'Buka Pengaturan',
    params: {
      Email: {
        label: "Email FaucetPay",
        type: "text",
        default: ""
      }
    }
  });

  const email = cfg.get('Email');
  const REFERRAL = 'https://cryptoads.in/?r=158';

  // Cek
  function isLoggedIn() {
    return !document.querySelector('header a.btn.btn-accent[href="/"]');
  }

  // Isi
  function fillLoginForm(email) {
    const form = document.querySelector('form.user');
    if (!form) return;
    const input = form.querySelector('input[name="wallet"]');
    const submit = form.querySelector('button[type="submit"]');
    if (input) input.value = email;
    if (submit) {
      const checker = setInterval(() => {
        if (document.querySelector('.iconcaptcha-widget.iconcaptcha-success')) {
          submit.click();
          clearInterval(checker);
        }
      }, 1000);
    }
  }

  // Cek
  function checkLoginReferral() {
    const loggedIn = isLoggedIn();
    if (loggedIn && (!email || email === '')) {
      Swal.fire({
        icon: 'warning',
        title: 'Email FaucetPay belum diisi!',
        confirmButtonText: 'Ya, logout',
      }).then(() => window.location.href = "https://cryptoads.in/logout");
      return;
    }
    if (!loggedIn && (!email || email === '')) {
      Swal.fire({
        icon: 'info',
        title: 'Isi Email FaucetPay di Pengaturan Userscript',
        confirmButtonText: 'OK',
      });
      return;
    }
    if (!loggedIn && !window.location.href.includes("?r=")) {
      window.location.href = REFERRAL;
    } else if (!loggedIn && email) {
      fillLoginForm(email);
    }
  }

  // Daftar
  const urls = [
    "https://cryptoads.in/faucet/currency/doge",
    "https://cryptoads.in/faucet/currency/ltc",
    "https://cryptoads.in/faucet/currency/sol",
    "https://cryptoads.in/faucet/currency/trx"
  ];

  function checkDailyLimitReached() {
  const alertBox = document.querySelector('.alert.alert-danger.text-center');
  const currentUrl = window.location.href;
  const lastFaucetUrl = urls[urls.length - 1];

  // ✅ Cek pesan 
  if (alertBox && alertBox.textContent.includes("Daily claim limit for this coin reached")) {
  if (currentUrl === lastFaucetUrl) {
    console.log("🔁 Limit terakhir tercapai. Pindah ke /links/currency/trx");
    window.location.href = "https://cryptoads.in/links/currency/trx";
  } else {
    console.log("🔁 Limit tercapai. Pindah ke dashboard untuk rotasi berikutnya");
    window.location.href = "https://cryptoads.in/dashboard";
  }
  return;
}

// ✅ Cek pesan 
const swalContainer = document.querySelector('.swal2-container');
if (swalContainer && swalContainer.textContent.includes("The faucet does not have sufficient funds")) {
  console.log("❌ Faucet kehabisan saldo. Pindah ke dashboard.");
  window.location.href = "https://cryptoads.in/dashboard";
  return;
}


  // ✅ Cek S
  const messageSelectors = [
    '.swal2-html-container',
    '.swal-text',
    '.swal-title'
  ];

  const keywords = [
    "After every",
    "faucet claims",
    "Shortlink must be completed",
    "The faucet does not have sufficient funds"
  ];

  for (const selector of messageSelectors) {
    const elements = document.querySelectorAll(selector);
    for (const el of elements) {
      const messageText = el.innerText?.replace(/\s+/g, " ").trim();
      if (!messageText) continue;

      const isTargetMessage = keywords.some(kw => messageText.toLowerCase().includes(kw.toLowerCase()));
      if (isTargetMessage) {
        console.log("⚠️ Terdeteksi pesan SweetAlert batas shortlink atau klaim:");
        console.log(`📩 Pesan: ${messageText}`);

        // Redirect 
        if (currentUrl === lastFaucetUrl) {
          console.log("🔁 SweetAlert limit terakhir. Pindah ke /links/currency/trx");
          window.location.href = "https://cryptoads.in/links/currency/trx";
        } else {
          console.log("🔁 SweetAlert limit. Pindah ke dashboard");
          window.location.href = "https://cryptoads.in/dashboard";
        }
        return;
      }
    }
  }
}

  // Fungsi
  function rotateUrls() {
    const loggedIn = isLoggedIn();
    const onDashboard = window.location.pathname === "/dashboard";

    if (loggedIn && onDashboard) {
      let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;
      const targetUrl = urls[currentIndex];

      console.log(`🔁 Rotating to: ${targetUrl}`);
      localStorage.setItem('currentIndex', (currentIndex + 1) % urls.length);
      window.location.href = targetUrl;
    } else {
      console.log("⏳ Menunggu di dashboard untuk rotator...");
    }
  }

  // Auto
  let claimClicked = false;

  function clickClaimFaucet() {
    if (claimClicked) return;

    const btn = document.getElementById('subbutt');
    const isCaptchaSolved = document.querySelector('.iconcaptcha-widget.iconcaptcha-success');

    if (btn && isCaptchaSolved && !btn.disabled) {
      console.log("✅ Captcha selesai. Klik tombol claim...");
      btn.click();
      claimClicked = true;
    }

    const goClaim = [...document.querySelectorAll("a.btn")].find(a => a.textContent.toLowerCase().includes("go claim"));
    if (goClaim) goClaim.click();
  }

  // Inisialisasi
  window.addEventListener('load', () => {
  checkLoginReferral();

  setTimeout(() => {
    checkDailyLimitReached();
    rotateUrls();
  }, 1500);

  setInterval(clickClaimFaucet, 1000);

  ShortlinkClaim();
    autoClickSubbuttAfterCaptcha();
});
})();

    function ShortlinkClaim() {
  // Deteksi
  if (!window.location.pathname.startsWith("/links/currency/")) return;

  const interval = setInterval(() => {
    const buttons = document.querySelectorAll('a.btn');

    for (const btn of buttons) {
      const text = btn.innerText.trim().toLowerCase();

      if (/claim\s[1-5]\/5/i.test(text)) {
        console.log(`🔍 Menemukan tombol: ${text}`);
        btn.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (!btn.disabled && btn.offsetParent !== null) {
          console.log("✅ Klik tombol klaim sekarang...");
          clearInterval(interval);
          setTimeout(() => {
            btn.click();
          }, 1000);
        }
        return;
      }
    }
  }, 1000);
}

function autoClickSubbuttAfterCaptcha() {
  const path = window.location.pathname;
  const regex = /^\/links\/check\/2\/[a-zA-Z]+$/;

  if (!regex.test(path)) return; // Hanya jalan di /links/check/2/coin

  console.log("🔍 Memeriksa captcha dan tombol #subbutt...");

  const interval = setInterval(() => {
    const isCaptchaSolved = document.querySelector('.iconcaptcha-widget.iconcaptcha-success');
    const subbutt = document.getElementById('subbutt');

    if (isCaptchaSolved && subbutt && !subbutt.disabled) {
      console.log("✅ Captcha selesai. Mengklik tombol #subbutt...");
      subbutt.scrollIntoView({ behavior: 'smooth', block: 'center' });
      subbutt.click();
      clearInterval(interval);
    }
  }, 1000);
}