// ==UserScript==
// @name         Z-library for NeoDB
// @namespace    http://tampermonkey.net/
// @version      0.25.6
// @description  Add a shortcut link to search in Z-library on NeoDB book pages.
// @author       shinechn
// @homepageURL  https://github.com/shinechn
// @supportURL   https://github.com/shinechn/zlibrary-for-neodb-script
// @match        https://neodb.social/book/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=neodb.social
// @grant        GM_xmlhttpRequest
// @connect      api.to-ma-to.workers.dev
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/501440/Z-library%20for%20NeoDB.user.js
// @updateURL https://update.greasyfork.org/scripts/501440/Z-library%20for%20NeoDB.meta.js
// ==/UserScript==

let targetUrl = '';

function insertZLibraryLink() {
  const linkElement = document.querySelector("div[id='item-title'] .site-list");
  const bookTitleElement = document.querySelector("div[id='item-title'] h1");

  if (linkElement && bookTitleElement && targetUrl) {
    const bookTitle = bookTitleElement.textContent.trim();
    const searchLink = document.createElement('a');
    searchLink.href = `${targetUrl}/s/${encodeURIComponent(bookTitle)}`;
    searchLink.textContent = 'Z-library';
    searchLink.target = '_blank';
    searchLink.style.cssText = `
      margin-left: 10px;
      padding: 2px 4px;
      color: #fff;
      background-color: #72ADCE;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.85em;
    `;
    linkElement.appendChild(searchLink);
  }
}

// Fetch config
GM_xmlhttpRequest({
  method: 'GET',
  url: 'https://api.to-ma-to.workers.dev/',
  responseType: 'json',
  onload: function (response) {
    const config = response.response;
    targetUrl = config.zlib;

    // Wait for the page to load before inserting the link
    window.addEventListener('load', insertZLibraryLink());
  },
});
