/**
  The MIT License (MIT)

  Copyright (c) 2016 Michael Charles Aubrey

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
// @id           NotoJapaneseFontforMemrise
// @name         Noto Japanese Font for Memrise
// @namespace    http://michaelcharl.es
// @version      0.0.2
// @description  Force the Memrise website to use Google's Noto Japanese Font
// @author       Michael Aubrey
// @icon         http://res.cloudinary.com/mca62511/image/upload/v1475628438/beautifulfav_i4nkpi.png
// @icon64       http://res.cloudinary.com/mca62511/image/upload/v1475628438/beautifulfav_i4nkpi.png
// @domain       memrise.com
// @domain       www.memrise.com
// @match        https://www.memrise.com/*
// @match        https://memrise.com/*
// @match        http://www.memrise.com/*
// @match        http://memrise.com/*
// @grant        none
// @license         MIT

// @downloadURL https://update.greasyfork.org/scripts/23735/Noto%20Japanese%20Font%20for%20Memrise.user.js
// @updateURL https://update.greasyfork.org/scripts/23735/Noto%20Japanese%20Font%20for%20Memrise.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

addGlobalStyle('@import url(http://fonts.googleapis.com/earlyaccess/notosansjapanese.css);');
addGlobalStyle('body { font-family: "Noto Sans Japanese", sans-serif !important; font-weight: 200;}');

