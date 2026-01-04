// ==UserScript==
// @name         NGA楼主标识红色版
// @version      0.0.5
// @namespace    https://greasyfork.org/zh-CN/users/170891
// @description  把NGA楼主标识成红底白字，修改自https://greasyfork.org/zh-CN/scripts/443563
// @compatible   chrome
// @compatible   firefox
// @compatible   safari
// @license      MIT
// @author       oscawty
// @match        http://bbs.nga.cn/*
// @match        https://bbs.nga.cn/*
// @match        http://nga.178.com/*
// @match        https://nga.178.com/*
// @grant        window
// @downloadURL https://update.greasyfork.org/scripts/511346/NGA%E6%A5%BC%E4%B8%BB%E6%A0%87%E8%AF%86%E7%BA%A2%E8%89%B2%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/511346/NGA%E6%A5%BC%E4%B8%BB%E6%A0%87%E8%AF%86%E7%BA%A2%E8%89%B2%E7%89%88.meta.js
// ==/UserScript==

(
/**
 * @param {Window & { __COLOR: { [k: string]: string } }} window
 */
async function(window) {
    'use strict';

    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));


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
            background: #FF0000;
            color: #fff;
            border: 1px transparent solid;
            border-radius: 5px;
            padding: 2px 4px;
            margin-left: 1px;
            margin-right: 1px;
            font-size: 10px;
        }`, 0);


        sheet.insertRule(`a.b[href*="uid=${uid}"] {
        }`, 1);
    };


    let currTid;
    while (true) {
        await sleep(100);

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