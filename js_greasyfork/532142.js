// ==UserScript==
// @name         Pixeldrain Bypass
// @namespace    https://github.com/nazdridoy
// @version      2.0.1
// @description  Automatically redirects PixelDrain URLs to a faster mirror
// @author       nazdridoy
// @license      MIT
// @match        https://pixeldrain.com/u/*
// @icon         https://pixeldrain.com/favicon.ico
// @grant        none
// @run-at       document-start
// @homepageURL  https://github.com/nazdridoy/pixeldrain-bypass
// @supportURL   https://github.com/nazdridoy/pixeldrain-bypass/issues
// @downloadURL https://update.greasyfork.org/scripts/532142/Pixeldrain%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/532142/Pixeldrain%20Bypass.meta.js
// ==/UserScript==

/* 
MIT License

Copyright (c) 2023 nazDridoy

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
    
    // Extract the file ID from the current URL
    const currentUrl = window.location.href;
    const fileIdMatch = currentUrl.match(/pixeldrain\.com\/u\/([a-zA-Z0-9]+)/);
    
    if (fileIdMatch && fileIdMatch[1]) {
        const fileId = fileIdMatch[1];
        const newUrl = `https://pd.1drv.eu.org/${fileId}`;
        
        // Redirect to the new URL
        window.location.replace(newUrl);
    }
})();
