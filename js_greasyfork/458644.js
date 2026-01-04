// ==UserScript==
// @name         TU Graz Auto-Login
// @namespace    http://tampermonkey.net/
// @version      0.6.4
// @description  Füllt Benutzername, Kennwort und OTP automatisch aus (tugraz, tugrazonline, tug, teachcenter, TUbe)
// @author       o___o
// @license      GPL-3.0
// @match        https://sso.tugraz.at/idp/profile/*
// @match        https://auth.tugraz.at/auth/realms/*
// @match        https://tc.tugraz.at/*
// @match        https://tube.tugraz.at/*
// @match        https://online.tugraz.at/tug_online/ee/ui/ca2/app/desktop/*
// @match        https://online.tugraz.at/tug_online/co/public/sec/auth/*
// @icon         https://icons.duckduckgo.com/ip2/tugraz.at.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/458644/TU%20Graz%20Auto-Login.user.js
// @updateURL https://update.greasyfork.org/scripts/458644/TU%20Graz%20Auto-Login.meta.js
// ==/UserScript==

if (location.hostname === 'tc.tugraz.at' && document.querySelector('.login')) {
  location.href = 'https://tc.tugraz.at/main/login/index.php?return=' + encodeURIComponent(location.href);
} else if (location.hostname === 'tube.tugraz.at') {
  setInterval(() => {
    document.querySelector('.header__login')?.click();
  }, 1000);
} else if (location.href.startsWith('https://online.tugraz.at/tug_online/ee/ui/ca2/app/desktop/#/login')) {
  setInterval(() => {
    document.querySelector('ca-login-shibboleth-component .btn-primary')?.click();
  }, 1000);
}

const loginForm = document.forms.loginform || document.forms['kc-form-login'];
const otpForm = document.forms.form1 || document.forms['kc-otp-login-form'];

let username = GM_getValue('username');
let password = GM_getValue('password');
let secret = GM_getValue('secret');

if (!secret) {
  secret = prompt('OTP Secret eingeben:');
  GM_setValue('secret', secret);
}

if (loginForm) {
  if (username && password) {
    document.querySelector('#username').value = username;
    document.querySelector('#password').value = password;
    document.querySelector('#rememberMe')?.click();
    loginForm.submit();
  } else {
    const { submit } = loginForm;
    loginForm.submit = function() {
      GM_setValue('username', document.querySelector('#username').value);
      GM_setValue('password', document.querySelector('#password').value);
      return submit.call(this);
    }
  }
} else if (otpForm) {
  import('https://esm.run/totp-generator@0.0.14').then(({ default: totp }) => {
    const token = totp(secret, { algorithm: 'SHA-256', digits: 6, period: 60 });
    document.querySelector('input[name=j_tokenNumber],input[name=otp]').value = token;

    const lastLogin = GM_getValue('lastLogin', 0);
    if (Date.now() - lastLogin >= 5000) {
      GM_setValue('lastLogin', Date.now());
      otpForm.querySelector('[type=submit]').click();
    }
  });
}