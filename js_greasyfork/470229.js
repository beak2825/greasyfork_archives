// ==UserScript==
// @name         cVerificação
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Impede um erro de acontecer, é extremamente necessário que isso seja executado!
// @author       Mikill
// @match        https://animefire.net/*
// @icon         https://animefire.net/uploads/cmt/317030_1688556659.webp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470229/cVerifica%C3%A7%C3%A3o.user.js
// @updateURL https://update.greasyfork.org/scripts/470229/cVerifica%C3%A7%C3%A3o.meta.js
// ==/UserScript==

(function() {
  'use strict';

  function removeDuplicateCookies(cookieName) {
    const cookies = document.cookie.split(';');
    const cookieValues = new Set();

    cookies.forEach(cookie => {
      const trimmedCookie = cookie.trim();
      if (trimmedCookie.indexOf(cookieName) === 0) {
        const cookieValue = trimmedCookie.substring(cookieName.length + 1);
        if (cookieValues.has(cookieValue)) {
          document.cookie = `${trimmedCookie}; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        } else {
          cookieValues.add(cookieValue);
        }
      }
    });
  }

  function checkCookies() {
    removeDuplicateCookies('block');
    removeDuplicateCookies('aprovados');
  }

  setInterval(checkCookies, 1000);
})();