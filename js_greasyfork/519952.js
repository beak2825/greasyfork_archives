// ==UserScript==
// @name         Jable missav 多行标题
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  asl
// @author       You
// @match        https://jable.tv/*/*
// @match        https://missav.*/*
// @match        https://missav.ws/*
// @match        https://missav.ai/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jable.tv
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/519952/Jable%20missav%20%E5%A4%9A%E8%A1%8C%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/519952/Jable%20missav%20%E5%A4%9A%E8%A1%8C%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function xnode(path) {
        let xResults = document.evaluate(
            path,
            document.body,
            null,
            XPathResult.ORDERED_NODE_ITERATOR_TYPE,
            null
        ); // 这是个 xpathResult 对象
        let el;
        let els = [];
        while ((el = xResults.iterateNext())) {
            els.push(el);
        }
        return els;
    }
    document.querySelectorAll('h6.title > a').forEach( function (nod){
        nod.setAttribute('target','_blank')
    });
    // Your code here...
    GM_addStyle(`
        .video-img-box .title {
            white-space: normal;
        }
        div.my-2.text-sm.text-nord4.truncate {
            white-space: normal;
        }
        h6>a {
            font-size: 20px !important;
            color: #dc3545;
        }
    `);
})();