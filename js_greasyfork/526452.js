// ==UserScript==
// @name         Google Search Sponsored Products - Bypass Google Ad Services
// @namespace    https://e-z.bio/pnda
// @version      1.0.0
// @description  Bypass Google Sponsored Products' tracking links, by removing the links that contain "aclk?" in the URL. This is in no way optimized for performance, contact me if you have any suggestions. This script is licensed under the MIT License.
// @author       Pnda (https://e-z.bio/pnda, https://greasyfork.org/en/users/1362722-pnda)
// @match        *://www.google.com/search?*
// @match        *://www.google.co.uk/search?*
// @match        *://www.google.de/search?*
// @match        *://www.google.nl/search?*
// @match        *://www.google.fr/search?*
// @match        *://www.google.dk/search?*
// @match        *://www.google.co.jp/search?*
// @match        *://www.google.es/search?*
// @match        *://www.google.ca/search?*
// @match        *://www.google.it/search?*
// @match        *://www.google.com.au/search?*
// @match        *://www.google.com.tw/search?*
// @match        *://www.google.com.br/search?*
// @match        *://www.google.com.tr/search?*
// @match        *://www.google.be/search?*
// @match        *://www.google.com.gr/search?*
// @match        *://www.google.co.in/search?*
// @match        *://www.google.com.mx/search?*
// @match        *://www.google.com.ar/search?*
// @match        *://www.google.ch/search?*
// @match        *://www.google.cl/search?*
// @match        *://www.google.at/search?*
// @match        *://www.google.ie/search?*
// @match        *://www.google.com.co/search?*
// @match        *://www.google.pl/search?*
// @match        *://www.google.pt/search?*
// @match        *://www.google.com.pk/search?*
// @match        *://www.google.co.kr/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.google.com
// @license      MIT
// @charset      UTF-8
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526452/Google%20Search%20Sponsored%20Products%20-%20Bypass%20Google%20Ad%20Services.user.js
// @updateURL https://update.greasyfork.org/scripts/526452/Google%20Search%20Sponsored%20Products%20-%20Bypass%20Google%20Ad%20Services.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /**
   * MIT License
   * 
   * Copyright (c) 2024 Panda (https://e-z.bio/pnda). All rights reserved.
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   * 
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   * 
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */

  window.addEventListener('load', (event) => {
    for (const item of document.querySelectorAll('.pla-unit')) {
      const removeTrackedLinks = (element) => {
        if (element.href && element.href.includes('aclk?')) {
          element.remove();
          console.log('removed');
          return;
        }
        for (const child of element.children) {
          removeTrackedLinks(child);
        }
      };

      removeTrackedLinks(item);
    }
  });
})();