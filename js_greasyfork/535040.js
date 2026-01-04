// ==UserScript==
// @name         Betfury – BTTC → USDT
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Swap BTTC→USDT, préremplit l'input et fixe la balance à $1,0000
// @author       Codego
// @match        https://betfury.io/*
// @grant        none
// @run-at       document-start
// @license MIT
// ==License==
// MIT License
// 
// Copyright (c) 2025 Codego002
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
// ==/License==
// @downloadURL https://update.greasyfork.org/scripts/535040/Betfury%20%E2%80%93%20BTTC%20%E2%86%92%20USDT.user.js
// @updateURL https://update.greasyfork.org/scripts/535040/Betfury%20%E2%80%93%20BTTC%20%E2%86%92%20USDT.meta.js
// ==/UserScript==

(function() {
    'use strict';
  
    // ─── 1) Hijack fetch pour rediriger bttc.svg → usdt.svg ───
    const origFetch = window.fetch;
    window.fetch = function(input, init) {
      try {
        let url = (input instanceof Request) ? input.url
                  : (typeof input === 'string' ? input : '');
        if (url.includes('bttc.svg')) {
          const newUrl = url.replace('bttc.svg', 'usdt.svg');
          input = (input instanceof Request)
                  ? new Request(newUrl, input)
                  : newUrl;
        }
      } catch(e) {
        console.error('SwapFetchError', e);
      }
      return origFetch.call(this, input, init);
    };
  
    // ─── 2) Swap d'une <img> individuelle ───
    function swapImg(img) {
      try {
        const src = img.getAttribute('src') || '';
        if (src.includes('coin/bttc.svg')) {
          img.setAttribute('src', src.replace('bttc.svg', 'usdt.svg'));
          img.setAttribute('alt', 'USDT');
        }
      } catch(e) {
        console.warn('SwapImgError', e, img);
      }
    }
  
    // ─── 3) Préremplir l'input et fixer la balance ───
    function setInputAndBalance() {
      try {
        const inp = document.querySelector('input.inp-number');
        if (inp) {
          inp.value = '1.00000000';
          inp.dispatchEvent(new Event('input',  { bubbles: true }));
          inp.dispatchEvent(new Event('change', { bubbles: true }));
        }
        document.querySelectorAll('span.balance').forEach(span => {
          span.textContent = '$1,0000';
        });
      } catch(e) {
        console.warn('SetValError', e);
      }
    }
  
    // ─── 4) Initial + observer pour images dynamiques ───
    function replaceAllImages() {
      document
        .querySelectorAll('img[src*="coin/bttc.svg"]')
        .forEach(swapImg);
    }
  
    function initObserver() {
      const observer = new MutationObserver(() => {
        replaceAllImages();
        setInputAndBalance();
      });
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true
      });
    }
  
    // ─── 5) Lancement au bon moment ───
    document.addEventListener('DOMContentLoaded', () => {
      replaceAllImages();
      setInputAndBalance();
      initObserver();
      console.log('🦊 Script v1.2 activé : swap, input & balance OK');
    });
  
  })();
  