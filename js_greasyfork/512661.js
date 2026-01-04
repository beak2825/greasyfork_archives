// ==UserScript==
// @name         YX-Auto-login
// @namespace    http://tampermonkey.net/
// @version      2024-10-15T11
// @description  For auto login, data are stored locally
// @author       Movelocity
// @match        http://1.1.1.3/ac_portal/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/512661/YX-Auto-login.user.js
// @updateURL https://update.greasyfork.org/scripts/512661/YX-Auto-login.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const xorEncryptDecrypt = (input, key) => {
    let output = '';
    for (let i = 0; i < input.length; i++) {
      output += String.fromCharCode(input.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return output;
  };

  const base64Encode = (str) => btoa(unescape(encodeURIComponent(str)));
  const base64Decode = (str) => decodeURIComponent(escape(atob(str)));

  const scheduleRun = (func, time) => {
    return new Promise((resolve, reject) => {
      setTimeout(()=>{
        func();
        resolve();
      }, time);
    });
  };

  const loginAndJump = async () => {
    await scheduleRun(() => {
      document.querySelector("#password_submitBtn").click();
    }, 1000);

    await scheduleRun(() => {
      const jump = document.createElement('a');
      jump.href = 'https://cn.bing.com/';
      jump.click();
    }, 1000);

    scheduleRun(() => { window.close(); }, 500);
  };

  const uname_input = document.querySelector("#password_name");
  const pwd_input = document.querySelector("#password_pwd");
  if(!uname_input || !pwd_input) return

  const app_name = localStorage.getItem('app_name');
  const app_key = localStorage.getItem('app_key');
  const encryptionKey = 'makeiteasy'; // Replace with your actual secret key

  if (app_name && app_key) {
    uname_input.value = xorEncryptDecrypt(base64Decode(app_name), encryptionKey);
    pwd_input.value = xorEncryptDecrypt(base64Decode(app_key), encryptionKey);
    loginAndJump();
  } else {
    document.querySelector("#password_submitBtn").addEventListener('click', () => {
      const encryptedName = base64Encode(xorEncryptDecrypt(uname_input.value, encryptionKey));
      const encryptedKey = base64Encode(xorEncryptDecrypt(pwd_input.value, encryptionKey));

      localStorage.setItem('app_name', encryptedName);
      localStorage.setItem('app_key', encryptedKey);
    });
  }
})();