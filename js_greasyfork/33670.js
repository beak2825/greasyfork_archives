/**
 * @license
 * MIT License
 * 
 * Copyright (c) 2016 Xiao Huang Fan
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
 
// ==UserScript==
// @name        Piperka Open All
// @namespace   https://github.com/NAR8789
// @description Adds an open all button to piperka updates page
// @version     1.0.1
// @grant       none
// @match       http://piperka.net/updates.html
// @match       https://piperka.net/updates.html
// @downloadURL https://update.greasyfork.org/scripts/33670/Piperka%20Open%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/33670/Piperka%20Open%20All.meta.js
// ==/UserScript==

// this script relies on jquery, but does not @require it...
// potentially it ought to, but piperka already includes jquery on the page

$(function() {
    var piperkaList = $('#piperka_list');
    var links = piperkaList.find('a[target="_blank"]');

    var openAll = $(document.createElement("input")).attr({
        type: "button",
        value: "Open All"
    }).click(function() {
        links.each(function(i,link) {
            window.open(link.href, link.target);
        });
    });

    openAll.insertBefore(piperkaList);
});
