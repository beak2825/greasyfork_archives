// ==UserScript==
// @name                Claim.ourcoincash.xyz Auto faucet
// @namespace           bekerja pada Tampermonkey maupun Violentmonkey
// @version             1.2
// @description         Auto Login, Auto Claim, Auto Redirect, Anti-Batas Klaim
// @author              Ojo Ngono
// @grant               GM_getValue
// @grant               GM_setValue
// @grant               GM_addStyle
// @grant               GM_setClipboard
// @grant               GM_registerMenuCommand
// @require             https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require             https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @match               https://claim.ourcoincash.xyz/*
// @license             Copyright OjoNgono
// @antifeature         referral-link Directs to a referral link when not logged in
// @icon                https://i.ibb.co.com/XJSPdz0/large.png
// @downloadURL https://update.greasyfork.org/scripts/511122/Claimourcoincashxyz%20Auto%20faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/511122/Claimourcoincashxyz%20Auto%20faucet.meta.js
// ==/UserScript==


const cfg = new MonkeyConfig({
  title: 'Pengaturan Claimourcoincashxyz',
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
    }
  }
});

(function () {
  'use strict';

  window.addEventListener('load', () => {
    const email = cfg.get('Email')?.trim();
    const loginButton = document.querySelector('button[type="submit"]');
    const isLoggedIn = !loginButton || loginButton.textContent.trim().toLowerCase() !== 'login';
    const hasReferral = location.search.includes('r=4803');

    if (!isLoggedIn && !hasReferral) {
      location.href = 'https://claim.ourcoincash.xyz/?r=4803';
      return;
    }

    if (!isLoggedIn && (!email || email === '')) {
      Swal.fire({
        icon: 'info',
        title: 'Pengaturan Diperlukan',
        html: `Silakan buka menu <b>'Pengaturan Claimourcoincashxyz'</b> dari ikon 🐵 userscript di browser Anda,<br>lalu isi Email FaucetPay.`,
        confirmButtonText: 'OK',
      });
      return;
    }

if (!isLoggedIn && email) {
  fillLoginForm(email);
  return;
}

    function fillLoginForm(email) {
  const form = document.querySelector('form.user');
  if (form) {
    const emailInput = form.querySelector('input[name="wallet"]');
    if (emailInput) {
      emailInput.value = email;
    }

    const loginButton = form.querySelector('button[type="submit"]');
    if (loginButton) {
      setTimeout(() => {
        loginButton.click();
      }, 1000);
    }
  }
}

if (isLoggedIn && (!email || email === '')) {
  Swal.fire({
    icon: 'warning',
    title: 'Email Belum Diset',
    html: `Anda sudah login, tetapi belum mengisi <b>Email FaucetPay</b> di menu <b>Pengaturan Claimourcoincashxyz</b>.<br>
           Demi keamanan, Anda akan logout otomatis.`,
    confirmButtonText: 'Logout Sekarang',
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then(() => {
    forceLogout();
  });
  return;
}

    function forceLogout() {
  const logoutButton = document.querySelector('a[href="https://claim.ourcoincash.xyz/auth/logout"]');
  if (logoutButton) {
    logoutButton.click();
  } else {
    window.location.href = "https://claim.ourcoincash.xyz/logout";
  }
}

    const urls = [
      "https://claim.ourcoincash.xyz/faucet/currency/doge",
      "https://claim.ourcoincash.xyz/faucet/currency/pepe",
      "https://claim.ourcoincash.xyz/faucet/currency/xlm",
      "https://claim.ourcoincash.xyz/faucet/currency/xrp"
    ];

    let currentIndex = parseInt(localStorage.getItem('currentIndex')) || 0;
    const rotateUrls = () => {
      const loggedIn = document.querySelector('#logoutModal') || document.querySelector('a[href*="logout"]');
      if (loggedIn && window.location.href === "https://claim.ourcoincash.xyz/") {
        window.location.href = urls[currentIndex];
        currentIndex = (currentIndex + 1) % urls.length;
        localStorage.setItem('currentIndex', currentIndex);
      }
    };
    rotateUrls();

    let claimClicked = false;
function submitClaimForm() {
  const form = document.querySelector('#fauform');
  if (form && !claimClicked) {
    claimClicked = true;
    setTimeout(() => {
      form.submit();
    }, 500);
  }
}
setInterval(submitClaimForm, 1000);

let goClaimClicked = false;
function goClaimWithRefresh() {
  const goClaimButton = document.querySelector('h4.next-button a.btn.btn-primary');
  if (goClaimButton && goClaimButton.innerText.includes('Go Claim') && !goClaimClicked) {
    goClaimClicked = true;
    window.location.href = goClaimButton.href;
  }
}
setInterval(goClaimWithRefresh, 1000);

    function checkForMessage() {
      const swalPopup = document.querySelector('.swal2-popup.swal2-show');
      if (swalPopup) {
        const msgContainer = swalPopup.querySelector('.swal2-html-container');
        const message = msgContainer?.innerText || "";
        const limitMsgs = [
          "You have been rate-limited. Please try again in a few seconds.",
          "The faucet does not have sufficient funds for this transaction."
        ];
        if (limitMsgs.some(msg => message.includes(msg))) {
          window.location.href = "https://claim.ourcoincash.xyz";
        }
      }

      const alertDanger = document.querySelector('.alert-danger');
      const alertText = alertDanger?.innerText || "";
      if (alertText.includes("Daily claim limit")) {
        setTimeout(() => {
          window.location.replace("https://claim.ourcoincash.xyz");
        }, 1000);
      }
    }
    setInterval(checkForMessage, 1000);

    function clickTryAgain() {
      const tryAgainButton = document.querySelector('a.btn.btn-primary');
      if (tryAgainButton && tryAgainButton.textContent.includes('Try Again')) {
        tryAgainButton.click();
      }
    }
    setInterval(clickTryAgain, 2000);
  });
})();
