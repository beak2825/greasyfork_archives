/**
Copyright 2018 Erik Larson

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
of the Software, and to permit persons to whom the Software is furnished to do 
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.

**/
// ==UserScript==
// @name         Furigana Blur NHK News Web Easy
// @version      1.1
// @description  Blur all furigana, reveal on mouse hover, for NHK News Web Easy
// @author       Erik Larson
// @match        https://www3.nhk.or.jp/news/easy/*
// @license      MIT
// @namespace https://greasyfork.org/users/215109
// @downloadURL https://update.greasyfork.org/scripts/372538/Furigana%20Blur%20NHK%20News%20Web%20Easy.user.js
// @updateURL https://update.greasyfork.org/scripts/372538/Furigana%20Blur%20NHK%20News%20Web%20Easy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = "rt {filter: blur(3px);} rt:hover {filter: blur(0px); }"

    document.body.appendChild(css);
})();