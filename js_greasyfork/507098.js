// ==UserScript==
// @name         Speed Github Releases
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  加速 github releases 页面的下载
// @author       CBK
// @license      GPL-3.0
// @match        https://github.com/*/releases*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/507098/Speed%20Github%20Releases.user.js
// @updateURL https://update.greasyfork.org/scripts/507098/Speed%20Github%20Releases.meta.js
// ==/UserScript==

// 模仿块级作用域
// (function() {
//     'use strict';

//     // Your code here...
// })();

"use strict";

main();

function main() {
    logger("开始");
    observe_assets();
    speed();
}

function speed() {
    // 寻找 release 地址
    // let elems = document.querySelectorAll("[href]");
    let mirror_url = "https://github.moeyy.xyz/";
    let pattern = /https:\/\/github.com\/.+\/.+\/releases\/download.+/;
    let elems = document.querySelectorAll("a.Truncate");
    for (let elem of elems) {
        if (elem.href.match(pattern)) {
            // 修改
            let url = elem.href.match(pattern)[0];
            // let url = elem.href;
            elem.href = mirror_url + url;
            // }
        }
    }
}

function observe_assets() {
    // Observer
    let assets_elems = document.querySelectorAll(
        'div[data-view-component="true"]',
    );
    let observer = new MutationObserver((mutationRecords) => {
        // console.log("有变化");
        // console.log(mutationRecords);
        logger(`${mutationRecords.length} 个元素发生变化`);
        speed();
    });

    for (let elem of assets_elems) {
        observer.observe(elem, {
            childList: true,
            subtree: true, // 及其更低的后代节点
        });
    }
}

function logger(msg) {
    console.log(`[${new Date().toISOString()}] ${msg}`);
}