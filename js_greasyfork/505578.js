// ==UserScript==
// @name        penguinreaders下载pdf
// @namespace   https://greasyfork.org
// @match       https://www.penguinreaders.co.uk/ladybird-books/*
// @grant       GM_setClipboard
// @run-at      document-start
// @version     1.0
// @author      Gwen0x4c3
// @description 免费下载penguinreaders的书pdf
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/505578/penguinreaders%E4%B8%8B%E8%BD%BDpdf.user.js
// @updateURL https://update.greasyfork.org/scripts/505578/penguinreaders%E4%B8%8B%E8%BD%BDpdf.meta.js
// ==/UserScript==
(function() {
  'use strict';

  function sel(selector) {
    return document.querySelector(selector);
  }

  function sels(selector) {
    return document.querySelectorAll(selector);
  }

  async function getBookUrl(nonce, prod_id) {
    const formData = new FormData();
    formData.append('action', 'get_pdf_url');
    formData.append('nonce', nonce);
    formData.append('prod_id', prod_id);
    return await fetch(`https://www.penguinreaders.co.uk/wp-admin/admin-ajax.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
      },
      body: new URLSearchParams(formData).toString()
    }).then(res => res.json());
  }

  function hookRequest() {
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      if (url.includes('generate_pdf_button')) {
        this.addEventListener('readystatechange', async function() {
          if (this.readyState == 4) {
            const nonceRegex = /nonce:\s*'([^']+)'/;
            const prodIdRegex = /prod_id:\s*(\d+)/;

            const nonceMatch = this.responseText.match(nonceRegex);
            const prodIdMatch = this.responseText.match(prodIdRegex);

            if (nonceMatch && nonceMatch[1] && prodIdMatch && prodIdMatch[1]) {
              const nonce = nonceMatch[1];
              const prodId = parseInt(prodIdMatch[1], 10);

              const res = await getBookUrl(nonce, prodId);
              if (!res.result) {
                return;
              }
              const bookUrl = res.url;
              console.log(bookUrl)

              const buttonRow = sel('.button-row');
              const button = document.createElement('button');
              button.className = 'link-button'
              button.textContent = 'DOWNLOAD BOOK';
              button.onclick = e => {
                // const a = document.createElement('a');
                // a.href = bookUrl;
                // a.download = sel('.section-hero-book .section-title').innerText;
                GM_setClipboard(sel('.section-hero-book .section-title').innerText, 'text/plain');
                // a.target = '_blank';
                // a.click();
                window.open(bookUrl + `&prod_id=${prodId}&label=View%20Book`);
              }
              buttonRow.prepend(button);

            } else {
              console.error('未获取到呢');
            }
          }
        })
      }
      originalOpen.apply(this, arguments);
    }
  }

  function remove() {
    if (!sel('.download-bar')) {
      return setTimeout(remove, 300);
    }
    const fades = sels('.download-bar-fade');
    for (const fade of fades) {
      fade.remove();
    }
  }
  remove();
  hookRequest();
})();