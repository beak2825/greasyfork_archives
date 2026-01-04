// ==UserScript==
// @name         Accesskeys for public-inbox
// @namespace    https://github.com/rybak
// @description  Faster access to the features on websites running public-inbox, like public-inbox.org and lore.kernel.org
// @match        https://lore.kernel.org/*
// @match        https://public-inbox.org/*
// @version      8
// @author       Andrei Rybak
// @license      MIT
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/458141/Accesskeys%20for%20public-inbox.user.js
// @updateURL https://update.greasyfork.org/scripts/458141/Accesskeys%20for%20public-inbox.meta.js
// ==/UserScript==

/*
 * Copyright (c) 2023 Andrei Rybak
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

(function() {
    'use strict';

    function setUpAccesskey(key, selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.setAttribute("accesskey", key);
        }
    }

    GM_addStyle(
        `a[accesskey]:hover:after {
            content: " [" attr(accesskey) "]";
            text-transform: uppercase;
            white-space: pre;
            font-family: monospace;
            margin-right: 0.5ex;
        }`
    );

    // go to front page from a thread link
    setUpAccesskey("z", "body > pre > a[href$='../']");
    // "latest" link == go to front page from a next/prev pagination
    setUpAccesskey("z", "a[href='.'");

    // search text field
    setUpAccesskey("s", "input[name='q']");
    // flat thread view link
    setUpAccesskey("f", "a[href^='../../'][href$='/T/#u'], a[href='T/#u']");
    // nested thread view link
    setUpAccesskey("n", "a[href^='../../'][href$='/t/#u'], a[href='t/#u']");
    // [thread overview] link on singular email view
    setUpAccesskey("t", "a[href='#r']");

    // "next (older)" link and ...
    setUpAccesskey("n", "a[rel='next']");
    // ... "prev (newer)" link
    setUpAccesskey("p", "a[rel='prev']");

    /*
     * In flat & nested thread views link for "jump to thread overview at the bottom"
     * can't be selected with pure CSS selectors, so an ad-hoc solution is needed.
     */
    for (const a of document.querySelectorAll("body > pre:nth-child(2) > a")) {
        const t = a.innerText;
        /*
         * Extra careful link text check to reduce likelihood of
         * false-positives.
         */
        if (t.includes('sibling') && /* also covers "siblings" */
            t.includes('repl') && /* "reply" and "replies" */
            (t.includes("messages in thread") || t.includes("only message in thread")))
        {
            a.setAttribute("accesskey", "t");
            break;
        }
    }

    // for threads at the top of the page
    const threadLinks = document.querySelectorAll("body > pre > a[href$='T/#t']")
    for (let i = 0; i < threadLinks.length && i < 9; i++) {
        // 49 is ASCII code for '1'
        threadLinks[i].setAttribute("accesskey", String.fromCharCode(i + 49));
    }
    // tenth thread needs to be defined separately
    if (threadLinks.length >= 9) {
        threadLinks[9].setAttribute("accesskey", "0");
    }
})();