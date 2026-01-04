// ==UserScript==
// @name         Hide the [1], [2], [3]... number system for better copying
// @namespace    https://greasyfork.org//
// @version      1
// @description  This will hide the [1], [2], [3]... number system for better copying
// @match        https://www.perplexity.ai/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460373/Hide%20the%20%5B1%5D%2C%20%5B2%5D%2C%20%5B3%5D%20number%20system%20for%20better%20copying.user.js
// @updateURL https://update.greasyfork.org/scripts/460373/Hide%20the%20%5B1%5D%2C%20%5B2%5D%2C%20%5B3%5D%20number%20system%20for%20better%20copying.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) <year> <copyright holder>

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

(function() {
    'use strict';

    // Define the CSS selector for the div element to be hidden
    const selector = 'div.inline.light.text-xs.font-bold.tracking-widest.font-mono.leading-none.uppercase.text-zinc-500.selection\\:bg-super.selection\\:text-white.dark\\:selection\\:bg-opacity-50.selection\\:bg-opacity-70';

    // Add custom CSS rules to hide the element
    GM_addStyle(selector + ' { display: none !important; }');
})();
