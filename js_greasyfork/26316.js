// ==UserScript==
// @name         Tieba百度贴吧楼中楼(回复楼)的楼主标识
// @namespace    http://nickdoth.cc/
// @version      0.5.0
// @description  在贴吧楼中楼回复者中标识出楼主，效果类似手机版
// @compatible   chrome
// @compatible   firefox
// @compatible   safari
// @license      MIT
// @author       nickdoth
// @match        http://tieba.baidu.com/p/*
// @match        https://tieba.baidu.com/p/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/26316/Tieba%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%A5%BC%E4%B8%AD%E6%A5%BC%28%E5%9B%9E%E5%A4%8D%E6%A5%BC%29%E7%9A%84%E6%A5%BC%E4%B8%BB%E6%A0%87%E8%AF%86.user.js
// @updateURL https://update.greasyfork.org/scripts/26316/Tieba%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E6%A5%BC%E4%B8%AD%E6%A5%BC%28%E5%9B%9E%E5%A4%8D%E6%A5%BC%29%E7%9A%84%E6%A5%BC%E4%B8%BB%E6%A0%87%E8%AF%86.meta.js
// ==/UserScript==

// MIT License
//
// Copyright (c) 2020 nickdoth
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

/// <reference path="./tieba-louzhu-marks.d.ts" />

(async function() {
    'use strict';

    // Sheet
    /** @type {*} */
    var styleEl = unsafeWindow.document.createElement('style');
    unsafeWindow.document.head.appendChild(styleEl);
    /** @type {CSSStyleSheet} */
    var sheet = styleEl.sheet;

    const firstPageHtml = await (fetch(`/p/${unsafeWindow.PageData.thread.thread_id}`, { credentials: 'include' }).then(res => res.text()));
    const firstPageDoc = (new DOMParser).parseFromString(firstPageHtml, 'text/html');

    const qJLouzhuBiaoshi = '.j_louzhubiaoshi';
    /** @type {Tieba.DataFieldTypes.DataField} */
    const result = eval(`(${$(firstPageDoc).find(qJLouzhuBiaoshi).parents('[data-field]')[0].dataset.field})`);

    const portrait = result.author.portrait.split('?')[0];

    sheet.insertRule(`a.at[data-field*="${portrait}"]:after, a.at[portrait="${portrait}"]:after {
        content: "楼主";
        background: #17a;
        color: #fff;
        border: 1px transparent solid;
        border-radius: 5px;
        padding: 2px 4px;
        margin-left: 1px;
        margin-right: 1px;
        font-size: 12px;
    }`, 0);
})();