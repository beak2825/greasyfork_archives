// ==UserScript==
// @name          Gemini 界面拓宽
// @namespace     http://tampermonkey.net/
// @version       0.1
// @description   拓宽 Gemini 聊天界面的回复内容区域。
// @author        bro9
// @match         https://gemini.google.com/app/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant         GM_addStyle
// @license       MIT 
// @downloadURL https://update.greasyfork.org/scripts/540695/Gemini%20%E7%95%8C%E9%9D%A2%E6%8B%93%E5%AE%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/540695/Gemini%20%E7%95%8C%E9%9D%A2%E6%8B%93%E5%AE%BD.meta.js
// ==/UserScript==

(function () {
  "use strict";
  GM_addStyle(`
          .conversation-container {
              max-width: none !important; /* 强制覆盖 max-width 为 none */
          }
          user-query {
              max-width: none !important; /* 强制覆盖 max-width 为 none */
          }
      `);
  console.log("gemini界面修改完成by hy");
})();

/*
MIT License

Copyright (c) [2025] [hy]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

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
