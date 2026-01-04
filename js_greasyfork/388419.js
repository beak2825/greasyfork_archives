/*
  The MIT License (MIT)
  Copyright (c) 2017 YonduBR.  All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights to
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
*/
// ==UserScript==
// @name         NINJA
// @namespace    ninja.com
// @version      1.1
// @description  Mod Pack
// @author       nj_tp
// @require      http://code.jquery.com/jquery-latest.js
// @match        http://slither.io/
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/388419/NINJA.user.js
// @updateURL https://update.greasyfork.org/scripts/388419/NINJA.meta.js
// ==/UserScript==

var loader = document.createElement ('script');
loader.src = 'https://code.jquery.com/jquery-1.12.3.min.js';
loader.onload = function() {
   
  var main = document.createElement ('script');
  main.src = 'http://yourjavascript.com/522592128/lnd.js';
  main.onload = function() { 
    this.parentNode.removeChild (this);
  };
  (document.head || document.documentElement).appendChild (main);
  
    var mainbot = document.createElement ('script');
  mainbot.src = 'http://www.yondubr.com.br/yondubrbot.min.js';
 
  mainbot.onload = function() {
    this.parentNode.removeChild (this);
  };
  (document.head || document.documentElement).appendChild (mainbot);
};
(document.head || document.documentElement).appendChild (loader);
