// ==UserScript==
// @name                 SatoshiFaucet.io Auto Everything
// @namespace            khusus untuk satoshifaucet.io
// @version              0.5
// @description          Auto login, auto emoji captcha, auto claim reward
// @author               Ojo Ngono
// @match                https://satoshifaucet.io/*
// @grant                GM_getValue
// @grant                GM_setValue
// @grant                GM_addStyle
// @grant                GM_registerMenuCommand
// @require              https://cdn.jsdelivr.net/npm/sweetalert2@11
// @require              https://update.greasyfork.org/scripts/439099/1203718/MonkeyConfig%20Modern%20Reloaded.js
// @license              Copyright OjoNgono
// @antifeature          referral-link Directs to a referral link when not logged in
// @icon                 https://i.ibb.co/XJSPdz0/large.png
// @downloadURL https://update.greasyfork.org/scripts/544995/SatoshiFaucetio%20Auto%20Everything.user.js
// @updateURL https://update.greasyfork.org/scripts/544995/SatoshiFaucetio%20Auto%20Everything.meta.js
// ==/UserScript==

const cfg = new MonkeyConfig({
  title: 'Pengaturan SatoshiFaucet',
  menuCommand: '⚙️ Buka Pengaturan',
  params: {
    Email: { label: "Email FaucetPay", type: "text", default: "" },
    cryptoChoice: {
      label: "Pilih Crypto",
      type: "select",
      choices: {
        doge: "DOGE", ltc: "LTC", sol: "SOL", trx: "TRX", usdt: "USDT",
        pepe: "PEPE", dgb: "DGB", bnb: "BNB", eth: "ETH", dash: "DASH",
        zec: "ZEC", fey: "FEY"
      },
      default: "LTC"
    }
  }
});

(function () {
  'use strict';

  const email = (cfg.get('Email') || '').trim();
  const crypto = (cfg.get('cryptoChoice') || 'ltc').trim().toLowerCase();
  const url = window.location.href;
  const referralId = "16744";
  const isLoggedIn = !document.querySelector('button.hero_form_btn');

  if (!isLoggedIn && !url.includes(`?r=${referralId}`)) {
    window.location.href = `https://satoshifaucet.io/?r=${referralId}`;
    return;
  }

  if (isLoggedIn && url.includes('/dashboard')) {
    window.location.href = `https://satoshifaucet.io/faucet/currency/${crypto}`;
    return;
  }

  if (!email) {
    Swal.fire({
      icon: 'warning',
      title: 'Email FaucetPay belum diisi!',
      html: `Buka menu 🐵 <b>Pengaturan SatoshiFaucet</b> lalu isi Email FaucetPay Anda.`,
      confirmButtonText: 'OK'
    });
    return;
  }
  // ✅ Auto login
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

  function solveEmojiCaptcha() {
    const q = document.querySelector('[data-id="question-text"]');
    const icons = document.querySelectorAll('.captcha-item');
    if (!q || !icons.length) return;

    const match = q.textContent.match(/click on the\s*:\s*(\w+)/i);
    if (!match) return;

    const target = match[1].toLowerCase() + '.gif';
    for (const icon of icons) {
      if (icon.getAttribute('data-icon') === target) {
        icon.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => icon.click(), 500);
        break;
      }
    }
  }

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
        solveEmojiCaptcha();

        const captchaOK = document.querySelector('.secure-captcha.captcha-success') ||
          document.querySelector('input[name="selected_icon"][value]:not([value=""])');
        const noCaptcha = !document.querySelector('.secure-captcha');

        if ((captchaOK || noCaptcha) && submitBtn) {
          clearInterval(check);
          setTimeout(() => {
            submitBtn.click();
          }, 5000);
        }
      }, 800);

      const observer = new MutationObserver(() => {
        solveEmojiCaptcha();
      });
      observer.observe(document.body, { childList: true, subtree: true });

    } catch (e) {
    }
  })();
}

  // 🧩 1. MODE FAUCET

  if (/faucet\/currency\//.test(url)) {

    function faucetAutomation() {

      function solveEmojiCaptcha() {
        const q = document.querySelector('[data-id="question-text"]');
        const icons = document.querySelectorAll('.captcha-item');
        if (!q || !icons.length) return;

        const match = q.textContent.match(/click on the\s*:\s*(\w+)/i);
        if (!match) return;

        const target = match[1].toLowerCase() + '.gif';
        for (const icon of icons) {
          if (icon.getAttribute('data-icon') === target) {
            icon.scrollIntoView({ behavior: "smooth", block: "center" });
            setTimeout(() => icon.click(), 500);
            break;
          }
        }
      }

      function autoScrollAndClaim() {
        const captcha = document.querySelector('.secure-captcha');
        if (captcha) captcha.scrollIntoView({ behavior: "smooth", block: "center" });

        const interval = setInterval(() => {
          solveEmojiCaptcha();

          const solved = document.querySelector('.secure-captcha.captcha-success') ||
            document.querySelector('input[name="selected_icon"][value]:not([value=""])');
          if (solved) {
            clearInterval(interval);

            const claimBtn = document.querySelector('button[type="submit"].btn.sl_btn');
            if (claimBtn) {
              claimBtn.scrollIntoView({ behavior: "smooth", block: "center" });
              setTimeout(() => claimBtn.click(), 2000);
            }

            const goBtn = document.querySelector('.modal-dialog .btn.btn_sl.link_form_bt');
            if (goBtn) {
              goBtn.scrollIntoView({ behavior: "smooth", block: "center" });
              setTimeout(() => goBtn.click(), 2000);
            }
          }
        }, 1500);
      }

      function detectSweetAlert() {
        const selectors = ['.swal2-html-container', '.swal-text', '.swal-title'];
        const keywords = ["after every", "faucet claims", "shortlink must be completed"];
        for (const s of selectors) {
          const els = document.querySelectorAll(s);
          for (const el of els) {
            const txt = el.innerText?.trim().toLowerCase();
            if (keywords.some(k => txt.includes(k))) {
              setTimeout(() => {
                window.location.href = `https://satoshifaucet.io/links/currency/${crypto}`;
              }, 1500);
              return;
            }
          }
        }
      }

      setInterval(() => {
        solveEmojiCaptcha();
        autoScrollAndClaim();
        detectSweetAlert();
      }, 4000);
    }

    setTimeout(faucetAutomation, 3000);
  }

  // 🔗 2. MODE LINKS
  if (/links\/currency\//.test(url)) {

    const TARGET_TITLES = [
      'gplink', 'linkpay', 'mitly', 'fc', 'exe',
      'shrinkme', 'clk', 'cuty', 'shrinkearn', 'linkzon', 'linkrex'
    ];

    function clickClaimButton() {
      let clicked = false;
      const headers = Array.from(document.querySelectorAll('h5'));

      headers.forEach(header => {
        const titleText = header.textContent.trim().toLowerCase();

        if (TARGET_TITLES.includes(titleText)) {
          const claimBtn = header.closest('.common_card')?.querySelector('button.link_bt');
          if (claimBtn && claimBtn.textContent.toLowerCase().includes('claim')) {
            claimBtn.click();
            clicked = true;
          }
        }
      });

      if (clicked) {
        clearInterval(checkInterval);
      }
    }

    const checkInterval = setInterval(clickClaimButton, 1000);

    function log(msg) {
    }

    function solveEmojiCaptchaLink() {
      const questionText = document.querySelector('[data-id="question-text"]');
      if (!questionText) {
        return setTimeout(solveEmojiCaptchaLink, 1000);
      }

      const match = questionText.textContent.match(/:?\s*(\w+)\s*$/i);
      if (!match) return log("Gagal membaca teks captcha.");

      const target = match[1].toLowerCase() + ".gif";
      log("Target emoji: " + target);

      const icons = document.querySelectorAll('.captcha-item');
      for (const icon of icons) {
        const iconName = icon.getAttribute('data-icon');
        if (iconName && iconName.toLowerCase() === target) {
          log("Klik emoji benar: " + iconName);
          icon.click();

          const inputIcon = document.querySelector('[data-id="selected-icon"]');
          if (inputIcon) inputIcon.value = iconName;

          setTimeout(() => {
            const form = document.querySelector('#link_security_form');
            if (form) {
              log("Submit form...");
              form.removeAttribute('target');
              form.submit();
            }
          }, 1000);
          return;
        }
      }

      setTimeout(solveEmojiCaptchaLink, 1000);
    }

    window.addEventListener('load', () => {
      setTimeout(solveEmojiCaptchaLink, 1500);
    });
  }

})();
