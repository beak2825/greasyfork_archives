// ==UserScript==
// @name                 satoshifaucet.io auto claim faucet
// @namespace            bekerja pada Tampermonkey maupun Violentmonkey
// @version              0.2
// @description          Auto Login, Auto Claim, Auto Redirect, Anti-Batas Klaim
// @author               Ojo Ngono
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_addStyle
// @grant                GM_setClipboard
// @grant                GM_registerMenuCommand
// @require              https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require              https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match                https://satoshifaucet.io/*
// @license              Copyright caknoor
// @antifeature          referral-link Directs to a referral link when not logged in
// @icon                 https://i.ibb.co/XJSPdz0/large.png
// @downloadURL https://update.greasyfork.org/scripts/547499/satoshifaucetio%20auto%20claim%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/547499/satoshifaucetio%20auto%20claim%20faucet.meta.js
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
        bnb: "BNB"
      },
      default: "ltc"
    }
  }
});

(function () {
  'use strict';

  const email = cfg.get('Email')?.trim();
  const crypto = cfg.get('cryptoChoice')?.toLowerCase() || 'ltc';
  const currentUrl = window.location.href;

  const isLoginPage = Array.from(document.querySelectorAll('button[type="submit"]')).some(btn =>
    btn.textContent.trim().toLowerCase() === "login & start earning"
  );
  const isDashboard = currentUrl.includes("/multi/dashboard");
  const isFaucetPage = currentUrl.includes("/multi/faucet/currency/");
  const hasReferral = location.search.includes('r=3517');

  function logout() {
    location.href = 'https://satoshifaucet.io/multi/logout';
  }

  // Redirect 
  if (!isLoginPage && !hasReferral && !isDashboard && !isFaucetPage) {
    location.href = 'https://satoshifaucet.io/multi/?r=3517';
    return;
  }

  // Peringatan 
  if (isDashboard && (!email || email === '')) {
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
      logout();
    });
    return;
  }

  // Peringatan 
  if (isLoginPage && (!email || email === '')) {
    Swal.fire({
      icon: 'info',
      title: 'Pengaturan Diperlukan',
      html: `Silakan buka menu <b>'Pengaturan Cryptoads'</b> dari ikon 🐵 userscript di browser Anda,<br>lalu isi Email FaucetPay.`,
      confirmButtonText: 'OK',
    });
    return;
  }

  // Auto 
  if (isLoginPage && email) {
    const loginInterval = setInterval(() => {
      const emailInput = document.querySelector('input[name="wallet"]');
      const loginBtn = document.querySelector('button[type="submit"]');
      if (emailInput && loginBtn) {
        clearInterval(loginInterval);
        emailInput.value = email;
        console.log("✅ Email diisi. Login...");
        loginBtn.click();
      }
    }, 1000);
  }

  // Redirect 
  if (isDashboard && email && !isFaucetPage) {
    console.log("✅ Berada di dashboard dan email sudah diisi di pengaturan.");
    setTimeout(() => {
      console.log(`🔁 Mengarahkan ke halaman faucet: ${crypto.toUpperCase()}`);
      location.href = `https://satoshifaucet.io/multi/faucet/currency/${crypto}`;
    }, 3000); 
  }

  // ======= 
  if (isFaucetPage) {
    console.log("📍 Berada di halaman faucet");

    const delay = (min, max) => new Promise(resolve => {
      const time = Math.floor(Math.random() * (max - min + 1)) + min;
      console.log(`⏳ Menunggu ${time} detik...`);
      setTimeout(resolve, time * 1000);
    });

    async function autoClaim() {
      await delay(2, 3);

      // Scroll 
      window.scrollTo({
        top: document.body.scrollHeight / 2,
        behavior: "smooth"
      });
      console.log("🖱️ Scroll ke tengah halaman...");

      await delay(6, 7);

      const claimBtn = document.querySelector('#subbutt');
      if (claimBtn && !claimBtn.disabled) {
        console.log("✅ Tombol klaim ditemukan dan aktif. Mengklik...");
        claimBtn.scrollIntoView({ behavior: "smooth", block: "center" });
        claimBtn.click();
      } else {
        console.log("⚠️ Tombol 'Claim Now' tidak tersedia atau masih nonaktif.");
      }
    }

    autoClaim();
  }
  
  // Cek 
    const observeGoClaim = setInterval(() => {
      const goClaimBtn = Array.from(document.querySelectorAll("button, a")).find(el => 
        el.textContent.trim().toLowerCase() === "go claim"
      );

      if (goClaimBtn) {
        console.log("🚀 Tombol 'Go Claim' ditemukan. Mengklik...");
        goClaimBtn.scrollIntoView({ behavior: "smooth", block: "center" });
        goClaimBtn.click();
        clearInterval(observeGoClaim);
      }
    }, 1000); 
  
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

      const isTargetMessage = keywords.some(kw =>
        messageText.toLowerCase().includes(kw.toLowerCase())
      );

      if (isTargetMessage) {
        console.log("✅ Deteksi pesan batas klaim:", messageText);

        // Ambil 
        const match = window.location.href.match(/currency\/([a-z]+)/i);
        const currency = match ? match[1].toLowerCase() : 'ltc';

        // Hentikan 
        clearInterval(checkInterval);

        // Redirect 
        setTimeout(() => {
          window.location.href = `https://satoshifaucet.io/multi/links/currency/${currency}`;
        }, 1500);

        return;
      }
    }
  }
}

// Mulai 
const checkInterval = setInterval(checkForMessage, 1000);
})();