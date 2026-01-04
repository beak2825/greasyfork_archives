/**
  The MIT License (MIT)

  Copyright (c) 2017 Michael Charles Aubrey

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
// @id           WaniKaniHandwritingFont
// @name         Handwriting Font for WaniKani
// @name:en      Handwriting Font for WaniKani
// @namespace    http://michaelcharl.es
// @version      0.0.1
// @description  Display WaniKani Items in a handwriting font.
// @author       Michael Aubrey
// @domain       wanikani.com
// @domain       www.wanikani.com
// @match        https://www.wanikani.com/*
// @match        https://wanikani.com/*
// @match        http://www.wanikani.com/*
// @match        http://wanikani.com/*
// @grant        none
// @locale       en
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/35210/Handwriting%20Font%20for%20WaniKani.user.js
// @updateURL https://update.greasyfork.org/scripts/35210/Handwriting%20Font%20for%20WaniKani.meta.js
// ==/UserScript==
/* global $ */
(function() {
    'use strict';
    var $newStyles = $("<style>#character span { font-family: KSO }</style>");
    var $jFonts = $("<link rel='stylesheet prefetch' href='https://mca62511.github.io/japanese-handwriting/ja-fonts/mikes-japanese-fonts.css'>");
    $("head").append($jFonts);
    $("head").append($newStyles);
})();