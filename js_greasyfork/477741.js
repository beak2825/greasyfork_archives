/**
  The MIT License (MIT)

  Copyright (c) 2014 Jeppe Rune Mortensen

  Permission is hereby granted, free of charge, to any person obtaining a copy of
  this software and associated documentation files (the "Software"), to deal in
  the Software without restriction, including without limitation the rights to
  use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
  the Software, and to permit persons to whom the Software is furnished to do so,
  subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
  FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
  IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
  CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

// ==UserScript==
// @name         removes banner ads
// @namespace    https://qu.ax/fQsW.png
// @version      1.2
// @description  removes annoying banner ads from dump.li
// @match        https://dump.li/*
// @grant        none
// @icon         https://i.ibb.co/6wbGzmN/prohibited-1f6ab.png
// @run-at          document_end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477741/removes%20banner%20ads.user.js
// @updateURL https://update.greasyfork.org/scripts/477741/removes%20banner%20ads.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imagesToRemove = [
        '/torzon.jpeg',
        '/cypher.png',
        '/monkey.jpeg',
        '/hub.jpeg',
        '/best.jpeg'
    ];

    const imgElements = document.querySelectorAll('img');

    imgElements.forEach(function(img) {
        const src = img.getAttribute('src');
        if (imagesToRemove.includes(src)) {
            img.remove();
        }
    });
})();
