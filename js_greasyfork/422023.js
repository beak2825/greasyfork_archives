// MIT License
//
// Copyright (c) 2021 EAirPeter
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

// ==UserScript==
// @name        Bangumi URL Sanitizer
// @namespace   https://github.com/EAirPeter/UserScripts
// @version     0.1
// @description Convert various bangumi URL to https://*.bangumi.tv/* form
// @author      EAirPeter
// @include     /^https?:\/\/(([0-9_a-z]+\.)*)(bangumi\.tv|bgm\.tv|chii\.in)(.*)$/
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/422023/Bangumi%20URL%20Sanitizer.user.js
// @updateURL https://update.greasyfork.org/scripts/422023/Bangumi%20URL%20Sanitizer.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // See: https://regexr.com/5mtc3
  var pattern = /^https?:\/\/(([0-9_a-z]+\.)*)(bangumi\.tv|bgm\.tv|chii\.in)(.*)$/;

  var url = location.href.replace(pattern, 'https://$1bangumi.tv$4');
  if (url != location.href) {
    console.log('Replace the current URL with:', url);
    location.replace(url);
  }
})();
