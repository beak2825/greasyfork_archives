// ==UserScript==
// @name         Copy Code to Clipboard
// @version      0.1
// @description  Click the codeheader to copy the content to your clipboard
// @author       TryNinja
// @match        https://bitcointalk.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bitcointalk.org
// @namespace https://greasyfork.org/users/1070272
// @downloadURL https://update.greasyfork.org/scripts/465798/Copy%20Code%20to%20Clipboard.user.js
// @updateURL https://update.greasyfork.org/scripts/465798/Copy%20Code%20to%20Clipboard.meta.js
// ==/UserScript==

(function() {
      'use strict';
  
      const codeheaders = document.querySelectorAll('.codeheader');
  
      const copyCode = id => {
          const header = document.querySelector(`.${id}`);
          const copyBtn = document.querySelector(`.${id} > button`);
          const code = header.nextElementSibling;
          navigator.clipboard.writeText(code.innerText).then(() => {
              copyBtn.textContent = 'Code: (copied!)';
          });
      }
  
      for (const codeheader of codeheaders) {
          const rand = Math.floor(Math.random() * 10e6);
          const id = `code-${rand}`;
          codeheader.classList.add(id);
          codeheader.innerHTML = `<button type="button" style="border: 0; background: none; color: rgb(136, 169, 195); font-weight: bold;">Code: (click to copy)</button>`;
          const copyBtn = document.querySelector(`.${id} > button`);
          copyBtn.addEventListener('click', () => copyCode(id));
      }
  })();