// ==UserScript==
// @name                 Claimcoin.in/multi Auto Faucet
// @namespace            bekerja pada Tampermonkey maupun Violentmonkey
// @version              0.3
// @description          Auto Login, Auto Claim, Auto Redirect, Anti-Batas Klaim
// @author               Ojo Ngono
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_addStyle
// @grant                GM_setClipboard
// @grant                GM_registerMenuCommand
// @require              https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require              https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match                https://claimcoin.in/*
// @license              Copyright OjoNgono
// @antifeature          referral-link Directs to a referral link when not logged in
// @icon                 https://i.ibb.co/XJSPdz0/large.png
// @downloadURL https://update.greasyfork.org/scripts/514634/Claimcoininmulti%20Auto%20Faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/514634/Claimcoininmulti%20Auto%20Faucet.meta.js
// ==/UserScript==


(function () {
  'use strict';

  let cfg;
  try {
    cfg = new MonkeyConfig({
      title: 'Pengaturan ClaimCoin/Multi',
      menuCommand: 'Buka Pengaturan',
      params: {
        Email: {
          label: "Email FaucetPay",
          type: "text",
          default: ""
        }
      }
    });
  } catch (e) {
    console.warn("MonkeyConfig gagal dimuat, fallback ke GM_getValue/GM_setValue");
    cfg = {
      get: key => GM_getValue(key, ""),
      set: (key, val) => GM_setValue(key, val)
    };
    GM_registerMenuCommand("Set Email FaucetPay", () => {
      const email = prompt("Masukkan Email FaucetPay:", cfg.get("Email"));
      if (email !== null) cfg.set("Email", email.trim());
    });
  }

  const email = cfg.get('Email')?.trim() || "";
  const currentUrl = location.href;

  const isLoginPage = /login\s*&?\s*start\s*earning/i.test(document.body.innerText);
  const isDashboard = currentUrl.endsWith("/dashboard");
  const isFaucetPage = currentUrl.includes("/multi/faucet/currency/");

  const urlParams = new URLSearchParams(window.location.search);
  const referral = urlParams.get('r');

  function isLoggedIn() {
    return document.querySelector('a[href*="/multi/logout"]') !== null;
  }

  function logout() {
    location.href = 'https://claimcoin.in/multi/logout';
  }

  if (
    !isLoginPage &&
    referral !== '3517' &&
    !isDashboard &&
    !isFaucetPage &&
    !currentUrl.includes("/multi/links/currency/") &&
    !currentUrl.includes("/multi/links/check/")
  ) {
    location.href = 'https://claimcoin.in/multi/?r=3517';
    return;
  }

  if (isDashboard && !email) {
    Swal.fire({
      icon: 'warning',
      title: 'Email FaucetPay belum diisi!',
      text: 'Silakan isi Email FaucetPay di pengaturan.',
      confirmButtonText: 'Logout',
      confirmButtonColor: '#d33'
    }).then(() => {
      logout();
    });
    return;
  }

  if (isLoginPage && !email) {
    Swal.fire({
      icon: 'info',
      title: 'Pengaturan Diperlukan',
      html: `Buka menu <b>'Pengaturan ClaimCoin/Multi'</b> di ikon 🐵,<br>lalu isi Email FaucetPay.`,
      confirmButtonText: 'OK'
    });
    return;
  }

  if (isLoginPage && email) {
    const loginInterval = setInterval(() => {
      const emailInput = document.querySelector('input[name="wallet"]');
      const loginBtn = Array.from(document.querySelectorAll('button[type="submit"]'))
        .find(btn => /login\s*&?\s*start\s*earning/i.test(btn.textContent));

      if (emailInput && loginBtn) {
        clearInterval(loginInterval);
        emailInput.value = email;
        loginBtn.click();
      }
    }, 1000);
  }

  const url = window.location.href;
  const isDashboardPage = url.includes("/multi/dashboard");

  const rotatorLinks = [
    "https://claimcoin.in/multi/faucet/currency/ltc",
    "https://claimcoin.in/multi/faucet/currency/doge",
    "https://claimcoin.in/multi/faucet/currency/trx",
    "https://claimcoin.in/multi/faucet/currency/sol",
    "https://claimcoin.in/multi/faucet/currency/bnb",
    "https://claimcoin.in/multi/faucet/currency/usdt"
  ];

  let currentIndex = parseInt(localStorage.getItem("rotatorIndex") || "0");

  function rotatorURL() {
    if (currentIndex < rotatorLinks.length) {
      localStorage.setItem("rotatorIndex", currentIndex + 1);
      window.location.href = rotatorLinks[currentIndex];
    } else {
      console.log("📌 Sudah sampai akhir rotator, menuju USDT links...");
      localStorage.setItem("rotatorIndex", 0);
      window.location.href = "https://claimcoin.in/multi/links/currency/usdt";
    }
  }

  function checkForMessage() {
    const messageSelectors = [
      '.swal2-html-container',
      '.swal-text',
      '.swal-title',
      '.alert.alert-danger.text-center'
    ];
    const keywords = [
      "After every",
      "faucet claims",
      "Shortlink must be completed",
      "Daily claim limit",
      "The faucet does not have sufficient funds"
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
          clearInterval(checkInterval);

          if (isFaucetPage) {
            setTimeout(() => {
              window.location.href = "https://claimcoin.in/multi/dashboard";
            }, 1500);
          }
          else if (isDashboardPage) {
            setTimeout(rotatorURL, 1500);
          }
          return;
        }
      }
    }
  }
  const checkInterval = setInterval(checkForMessage, 1000);

  if (isDashboardPage) {
    setTimeout(rotatorURL, 2000);
  }

  const isLinkPage = url.includes("/multi/links/check/");

if (isFaucetPage || isLinkPage) {
  const delay = (min, max) => new Promise(resolve => {
    const time = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, time * 1000);
  });

  const microDelay = (min, max) => new Promise(resolve => {
    const time = Math.floor(Math.random() * (max - min + 1)) + min;
    setTimeout(resolve, time);
  });

  async function moveCursorToElement(el) {
    const rect = el.getBoundingClientRect();
    const targetX = rect.left + rect.width / 2;
    const targetY = rect.top + rect.height / 2;

    let currentX = Math.random() * window.innerWidth;
    let currentY = Math.random() * window.innerHeight;

    const steps = 15 + Math.floor(Math.random() * 10);
    for (let i = 0; i < steps; i++) {
      currentX += (targetX - currentX) / (steps - i);
      currentY += (targetY - currentY) / (steps - i);

      el.dispatchEvent(new MouseEvent("mousemove", {
        bubbles: true,
        clientX: currentX,
        clientY: currentY
      }));

      await microDelay(15, 30);
    }

    el.dispatchEvent(new MouseEvent("mouseover", {
      bubbles: true,
      clientX: targetX,
      clientY: targetY
    }));
  }

  async function autoClaim() {
    await delay(3, 5);
    window.scrollTo({
      top: document.body.scrollHeight / 2,
      behavior: "smooth"
    });
    await delay(7, 9);

    const claimBtn = document.querySelector('#subbutt');
    if (claimBtn && !claimBtn.disabled) {
      claimBtn.scrollIntoView({ behavior: "smooth", block: "center" });
      await moveCursorToElement(claimBtn);
      await microDelay(150, 300);
      claimBtn.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
      await microDelay(100, 250);
      claimBtn.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      await microDelay(80, 200);
      claimBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    }
  }

  autoClaim();

    const observeGoClaim = setInterval(() => {
      const goClaimBtn = Array.from(document.querySelectorAll("button, a")).find(el =>
        el.textContent.trim().toLowerCase() === "go claim"
      );

      if (goClaimBtn) {
        goClaimBtn.scrollIntoView({ behavior: "smooth", block: "center" });
        goClaimBtn.click();
        clearInterval(observeGoClaim);
      }
    }, 1000);
  }

  if (isDashboard) {
    setTimeout(rotatorURL, 3000);
  }


})();
