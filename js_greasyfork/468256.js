// ==UserScript==
// @name          You are beautiful
// @namespace    http://tampermonkey-auto-login-poe
// @version      1
// @description   1，不要对外分享脚本， 避免滥用。  2，正常使用之后关闭脚本， 避免资源浪费，影响网络速度。关闭这个不会影响正常使用。 等不能用的时候再把它打开。
// @match        https://poe.com/*
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js
// @downloadURL https://update.greasyfork.org/scripts/468256/You%20are%20beautiful.user.js
// @updateURL https://update.greasyfork.org/scripts/468256/You%20are%20beautiful.meta.js
// ==/UserScript==

(async function () {
  'use strict';

  const customDecode = (data) => {
    return atob(data);
  };

  const customDecryptFunc = (encryptedUrl, key) => {
    return CryptoJS.AES.decrypt(encryptedUrl, CryptoJS.enc.Utf8.parse(key), { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
  };

  const customEncryptedUrl = 'Z0cwL28rUDNwUkk3SXpndTZuNHNEcDQyOThPRkpyK3FZdk1lU1k5MDJQU3kzcWN0Z0lReW1ZYlRRWkU3OGl1eg';
  const encryptedUrl = customDecode(customEncryptedUrl);

  const fetchDataFunc = async () => {
    return new Promise((resolve, reject) => {
      const decryptedUrl = customDecryptFunc(encryptedUrl, encryptionKey);
      GM_xmlhttpRequest({
        method: 'GET',
        url: decryptedUrl,
        onload: (response) => {
          const data = JSON.parse(response.responseText);
          resolve(data);
        },
        onerror: (error) => {
          reject(error);
        },
      });
    });
  };

  const mainFunc = () => {
    if (isValidWebsiteFunc() && !isAuthenticatedFunc()) {
      authenticateFunc();
    }
  };

  const customEncryptedKey = 'c2RtcG93dWV1cXdlaHFvdw';
  const encryptionKey = customDecode(customEncryptedKey);

  const { encodedVal, customCode } = await fetchDataFunc();

  const decodedEncVal = atob(encodedVal);
  const decodedCustomCode = atob(customCode);

  const customDecryptVal = (encVal, customDecryptionCode) => {
    return CryptoJS.AES.decrypt(encVal, CryptoJS.enc.Utf8.parse(customDecryptionCode), { mode: CryptoJS.mode.ECB }).toString(CryptoJS.enc.Utf8);
  };

  const decryptedVal = customDecryptVal(decodedEncVal, decodedCustomCode);

  const isAuthenticatedFunc = () => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith("p-b=") && cookie.includes(decryptedVal)) {
        return true;
      }
    }
    return false;
  };

  const maintainSessionFunc = () => {
    setInterval(() => {
      window.location.reload();
    }, 12 * 60 * 60 * 1000);
  };

  const authenticateFunc = () => {
    document.cookie = `p-b=${decryptedVal}; domain=poe.com; path=/; secure;`;
    maintainSessionFunc();
  };

  const isValidWebsiteFunc = () => {
    return window.location.hostname === "poe.com";
  };

  mainFunc();
})();