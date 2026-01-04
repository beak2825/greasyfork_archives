// ==UserScript==
// @name         NGA楼主标识
// @namespace    http://nickdoth.cc/
// @version      0.1.7
// @description  简单的对NGA(nga.cn)楼主进行一个标注
// @compatible   chrome
// @compatible   firefox
// @compatible   safari
// @license      MIT
// @author       nickdoth
// @match        http://bbs.nga.cn/*
// @match        https://bbs.nga.cn/*
// @match        http://nga.178.com/*
// @match        https://nga.178.com/*
// @grant        window
// @downloadURL https://update.greasyfork.org/scripts/443563/NGA%E6%A5%BC%E4%B8%BB%E6%A0%87%E8%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/443563/NGA%E6%A5%BC%E4%B8%BB%E6%A0%87%E8%AF%86.meta.js
// ==/UserScript==

// MIT License
//
// Copyright (c) 2022 nickdoth
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

// @ts-check


(
/**
 * @param {Window & { __COLOR: { [k: string]: string } }} window
 */
async function(window) {
    'use strict';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Query Theme Colors
    const ngaDark = window.__COLOR.uitxt1 ?? '';
    const ngaLight = window.__COLOR.border2 ?? ''; // bg1

    // Sheet
    /** @type {*} */
    let styleEl = undefined;


    const tidCb = async (tid, sheet) => {
        const firstPageHtml = await (fetch(`/read.php?tid=${tid}`, { credentials: 'include' }).then(res => res.text()));
        const firstPageDoc = (new DOMParser).parseFromString(firstPageHtml, 'text/html');

        const qUid = '#postauthor0';
        /** @type {HTMLAnchorElement | null} */
        const elUid = firstPageDoc.querySelector(qUid);
        const uid = /uid=(\d+)/.exec(elUid?.href ?? '')?.[1];

        console.debug('楼主', uid);

        sheet.insertRule(`a.b[href*="uid=${uid}"]:after {
            content: "楼主";
            background: ${ngaDark};
            color: #fff;
            border: 1px transparent solid;
            border-radius: 5px;
            padding: 2px 4px;
            margin-left: 1px;
            margin-right: 1px;
            font-size: 12px;
        }`, 0);

        sheet.insertRule(`a.b[href*="uid=${uid}"] {
            background: ${ngaLight};
            padding: 2.7px 0px;
            border-radius: 5px;
            color: #000;
        }`, 1);
    };

    let currTid;
    while (true) {
        await sleep(160);

        const tid = /tid=(\d+)/.exec(location.search ?? '')?.[1];
        if (tid === currTid) continue;

        currTid = tid;

        // cleanup
        if (styleEl && window.document.head) {
            console.debug('cleanup style');
            styleEl.remove();
        }

        if (!currTid) continue;

        styleEl = window.document.createElement('style');
        window.document.head.appendChild(styleEl);
        /** @type {CSSStyleSheet} */
        let sheet = styleEl.sheet;

        await tidCb(currTid, sheet);
    }

})(unsafeWindow);