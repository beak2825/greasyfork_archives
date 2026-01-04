// ==UserScript==
// @name                No Hover Preview & Yes Right-Click on Tiktok 
// @namespace           https://greasyfork.org/en/users/1505331-jonas0
// @version             1.1
// @description         Disables video cards from playing previews on hover, and restores right-click functionality, on Tiktok
// @license             MIT
// @author              Jonas0
// @include             *://*.tiktok.com/*
// @grant               none
// @icon                https://www.tiktok.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/546102/No%20Hover%20Preview%20%20Yes%20Right-Click%20on%20Tiktok.user.js
// @updateURL https://update.greasyfork.org/scripts/546102/No%20Hover%20Preview%20%20Yes%20Right-Click%20on%20Tiktok.meta.js
// ==/UserScript==

(function() {
  'use strict';
  
    /*!
  * Copyright (c) 2025 - 3000, Jonas0. All rights reserved.
  *
  * Permission is hereby granted, free of charge, to any person obtaining a copy
  * of this software and associated documentation files (the "Software"), to deal
  * in the Software without restriction, including without limitation the rights
  * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  * copies of the Software, and to permit persons to whom the Software is
  * furnished to do so, subject to the following conditions:
  *
  * The above copyright notice and this permission notice shall be included in
  * all copies or substantial portions of the Software.
  *
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  *
  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  * SOFTWARE.
  */
  
  // Disable Preview Playback on Hover
  const style = document.createElement('style');
  style.textContent = 'a video { display: none !important; }';
  document.head.appendChild(style);
  
  // Enable Right Click
  const style2 = document.createElement('style');
  style2.textContent = '[id*="column-item-video-container-"] a > div[class*="DivPlayerContainer"] { pointer-events: none !important; }';
  document.head.appendChild(style2);
  
})();