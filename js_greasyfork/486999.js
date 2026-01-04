// ==UserScript==
// @name        Base64 Auto Decoder
// @namespace   Wiki-Index
// @match       *://wiki-index.pages.dev/*
// @grant       none
// @version     1.0
// @description Decode base64-encoded links
// @downloadURL https://update.greasyfork.org/scripts/486999/Base64%20Auto%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/486999/Base64%20Auto%20Decoder.meta.js
// ==/UserScript==

setTimeout(() => {
  'use strict';
  const base64Regex = /^[A-Za-z0-9+/]+=*$/;
  const isURL = (str) => /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(str);
  const decodeAndDisplay = (element) => {
    const content = element.textContent.trim();
    if (base64Regex.test(content)) {
      const decodedString = atob(content).trim();
      if (isURL(decodedString)) {
        element.innerHTML = `<a href="${decodedString}" target="_self">${decodedString}</a>`;
      }
    }
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        decodeAndDisplay(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });
  document.querySelectorAll('code, p').forEach(element => {
    observer.observe(element);
  });
}, 5000);