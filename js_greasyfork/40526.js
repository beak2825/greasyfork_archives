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
// @id           RRP
// @name         Furigana for Redesigned Reddit
// @version      0.0.1
// @description  Adds furigana back to the r/LearnJapanese subreddit even if you're using the redesign.
// @icon         http://res.cloudinary.com/mca62511/image/upload/v1522768999/redditicon_bl8cs9.png
// @icon64       http://res.cloudinary.com/mca62511/image/upload/v1522768999/redditicon_bl8cs9.png
// @author       Michael Aubrey
// @match        https://www.reddit.com/r/LearnJapanese/*
// @match        https://reddit.com/r/LearnJapanese/*
// @match        http://www.reddit.com/r/LearnJapanese/*
// @match        http://reddit.com/r/LearnJapanese/*
// @grant        none
// @license         MIT

// @namespace https://greasyfork.org/users/43445
// @downloadURL https://update.greasyfork.org/scripts/40526/Furigana%20for%20Redesigned%20Reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/40526/Furigana%20for%20Redesigned%20Reddit.meta.js
// ==/UserScript==
/* global $ */

(function() {
    'use strict';
    var css = 'a[href$="#fg"]{cursor:default!important;text-decoration:none;line-height:1;text-align:center;display:inline-block;color:inherit!important}a[href$="#fg"]:before,a[href$="/fg"]:before{font-size:.7em;font-weight:400;line-height:1.2;cursor:pointer;text-decoration:none;display:block;content:attr(title)}';
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
