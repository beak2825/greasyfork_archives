/**
  The MIT License (MIT)

  Copyright (c) 2018 Michael Charles Aubrey
  
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
// @id           HRP
// @name         Hide Reddit Promos (Redesign)
// @version      0.4.4
// @description  Hide promo links from the Reddit redesign.
// @author       Michael Aubrey
// @domain       reddit.com
// @domain       www.reddit.com
// @match        https://www.reddit.com/*
// @match        https://reddit.com/*
// @match        http://www.reddit.com/*
// @match        http://reddit.com/*
// @grant        none
// @license         MIT

// @namespace https://greasyfork.org/users/43445
// @downloadURL https://update.greasyfork.org/scripts/40527/Hide%20Reddit%20Promos%20%28Redesign%29.user.js
// @updateURL https://update.greasyfork.org/scripts/40527/Hide%20Reddit%20Promos%20%28Redesign%29.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';
    var css = '.promotedlink {display:none;}';
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    if (s.styleSheet) {   // IE
        s.styleSheet.cssText = css;
    } else {                // the world
        s.appendChild(document.createTextNode(css));
    }
    head.appendChild(s);
})();
