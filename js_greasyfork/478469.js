// ==UserScript==
// @name         Google productID from FC2,FANZA
// @version      0.1
// @description  replace pID to hyperLink
// @author       SWIU
// @match        https://adult.contents.fc2.com/article/*
// @match        https://www.dmm.co.jp/*/detail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dmm.co.jp
// @run-at       document-start
// @namespace https://greasyfork.org/users/1196626
// @downloadURL https://update.greasyfork.org/scripts/478469/Google%20productID%20from%20FC2%2CFANZA.user.js
// @updateURL https://update.greasyfork.org/scripts/478469/Google%20productID%20from%20FC2%2CFANZA.meta.js
// ==/UserScript==

(function () {
  'use strict';
  document.addEventListener(`DOMContentLoaded`, doAll, { once: true });
  const additionalWords = ` jav -site:www.dmm.co.jp  -site:javtrailers.com -site:adult.contents.fc2.com -site:twitter.com -site:www.mgstage.com -site:duga.jp `;
  let cid = { raw: null, formatted: null }, productName, productNameElm, siteName = checkDomain();

  async function doAll() {
    for (const func of [replaceProductName, replacecid]) {
      try {
        func.call();
      } catch (e) {
        console.log(e);
      }
    }
  }

  function replaceProductName() {
    if (siteName === `FANZA`) {
      productNameElm = document.querySelector(`#title`);
      productName = productNameElm.textContent;
    } else if (siteName === `FC2`) {
      const _productNameElm = document.querySelector(`.items_article_headerInfo h3`);
      [..._productNameElm.childNodes].map(e => e.nodeName === `#text` && e.remove());
      productNameElm = document.createElement(`span`);
      _productNameElm.appendChild(productNameElm);
      productName = document.title.match(/(.+) /)[1];
    }
    const query = `${productName} ${additionalWords}`;
    const hyperlinkedElm = createLink(query, productName);
    console.log(productNameElm, hyperlinkedElm);
    productNameElm.replaceWith(hyperlinkedElm);
    productNameElm = hyperlinkedElm.parentElement;
  }

  async function replacecid() {
    let cidElm, query;
    if (siteName === `FANZA`) {
      cidElm = [...document.querySelectorAll(`.nw`)].find(e => e.textContent.includes(`品番：`)).nextElementSibling;
      cid.raw = cidElm.textContent.trim();
      cid.formatted = formatcid(cid.raw);
      query = cid.formatted ? `"${cid.raw}" OR "${cid.formatted}"` : cid.raw;

      function formatcid(rawcode) {
        let cidFormatMatch = rawcode.match(/(\D+)(\d+\D?)$/);
        const charPart = cidFormatMatch[1].toUpperCase();
        const numPart = cidFormatMatch[2].padStart(5, 0).replace(/^00/, ``);
        return `${charPart}-${numPart}`;
      }
    } else if (siteName === `FC2`) {
      cid.raw = document.querySelector(`title`).textContent.split(` `).at(-1).split(`-`).at(-1);
      cid.formatted = document.title.split(` `).at(-1);
      productNameElm.insertAdjacentHTML(`afterend`, `<div>品番：<span id="ftzcid">${cid.formatted}</span></div>`);
      cidElm = document.querySelector(`#ftzcid`);
      query = `"${cid.raw}" OR "${cid.formatted}"`;
    }
    const hyperlinkedElm = createLink(query, cid.formatted);
    cidElm.replaceWith(hyperlinkedElm);
  }

  function createLink(query, txt) {
    const a = document.createElement(`a`);
    a.textContent = txt;
    a.href = `https://www.google.co.jp/search?tbm=vid&nfpr=1&q=${encodeURIComponent(query + additionalWords)}`;
    a.target = `_blank`;
    return a;
  }

  function checkDomain() {
    let result = `unknown`;
    if (location.host.includes(`adult.contents.fc2.com`)) {
      result = `FC2`;
    } else if (location.host.includes(`dmm.co.jp`)) {
      result = `FANZA`;
    }
    return result;
  }
})();