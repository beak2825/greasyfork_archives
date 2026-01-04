// ==UserScript==
// @name       Goku/AniWatch Auto Sign
// @namespace  http://tampermonkey.net/
// @version    4.5
// @ author    longkidkoolstar
// @description  Automatically clicks the Sign In button for Goku.sx and for Aniwatch.to after 10 seconds, and fills in the email and password fields if provided by the user.
// @match       https://goku.sx/*
// @match      https://aniwatch.to/*
// @grant      GM_getValue
// @grant      GM_setValue
// @license    GPL-3.0
// @icon        https://cdn.dribbble.com/users/289074/screenshots/1614713/sans_titre_-_2.png
// @require https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/459134/GokuAniWatch%20Auto%20Sign.user.js
// @updateURL https://update.greasyfork.org/scripts/459134/GokuAniWatch%20Auto%20Sign.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function generateRandomKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let key = '';
    for (let i = 0; i < 16; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return key;
  }

  function encryptData(data, key) {
    const encrypted = CryptoJS.AES.encrypt(data, key);
    return encrypted.toString();
  }

  function decryptData(encryptedData, key) {
    const decrypted = CryptoJS.AES.decrypt(encryptedData, key);
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  window.addEventListener('load', function() {
    const emailInput = document.querySelector('input[name="email"]');
    const passwordInput = document.querySelector('input[name="password"]');
    const key = GM_getValue('goku.to.key');

    if (emailInput && passwordInput) {
      const encryptedEmail = localStorage.getItem('goku.to.email');
      const encryptedPassword = localStorage.getItem('goku.to.password');

      if (encryptedEmail && encryptedPassword) {
        const email = decryptData(encryptedEmail, key);
        const password = decryptData(encryptedPassword, key);

        emailInput.value = email;
        passwordInput.value = password;
      } else {
        const newEmail = prompt('Enter your email for the website:', '');
        const newPassword = prompt('Enter your password for the website:', '');
        if (newEmail && newPassword) {
          const newKey = generateRandomKey();
          const encryptedNewEmail = encryptData(newEmail, newKey);
          const encryptedNewPassword = encryptData(newPassword, newKey);

          GM_setValue('goku.to.key', newKey);
          localStorage.setItem('goku.to.email', encryptedNewEmail);
          localStorage.setItem('goku.to.password', encryptedNewPassword);

          emailInput.value = newEmail;
          passwordInput.value = newPassword;
        }
      }
    }

    const button = document.querySelector('.account-button .btn.btn-blank');
    if (button) {
      button.click();
    }
  });

  if (window.location.href.startsWith('https://goku.sx/login')) {
    let secondsToWait = null;
    const storedSeconds = localStorage.getItem('goku.to.autosign.seconds');
    if (storedSeconds !== null) {
      secondsToWait = parseInt(storedSeconds, 10);
    }
    if (!secondsToWait) {
      const input = prompt('Enter the number of seconds to wait before clicking the "Sign In" button. Default is 10 seconds.', '10');
      if (!input) return;
      secondsToWait = parseInt(input, 10);
      if (isNaN(secondsToWait)) {
        secondsToWait = 10;
      }
      localStorage.setItem('goku.to.autosign.seconds', secondsToWait.toString());
    }
    setTimeout(function() {
      const key = GM_getValue('goku.to.key');
      const button = document.querySelector('.btn.btn-block.btn-primary.position-relative');
      if (button) {
        button.click();
      }
    }, secondsToWait * 1000);
  }

})();