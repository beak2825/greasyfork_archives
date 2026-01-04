// ==UserScript==
// @name         AC Array Checker
// @namespace    http://tampermonkey.net/
// @version      2024-02-20
// @description  AtCoderのTaskページにおいて配列の要素の最大値が指定した数より小さい場合に強調します。
// @author       You
// @license mit
// @match        https://atcoder.jp/contests/*/tasks/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487805/AC%20Array%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/487805/AC%20Array%20Checker.meta.js
// ==/UserScript==

const main = (function() {
    'use strict';

    // 10^7
    const maximum = 10000000;

    document.querySelectorAll("annotation[encoding=\"application/x-tex\"]").forEach((ele) => {
        if(ele.aac_checked) { return; }
        ele.aac_checked = true;
        const match = ele.innerHTML.match(/[0-9]+[\s\t]*\\[gl]?eq[\s\t]+[a-zA-Z]+\_[a-zA-Z]+[\s\t]*\\[gl]?eq[\s\t]+(.*)/);
        if(match) {
            const exp = new Function("return " + match[1].replaceAll("\\times", "*").replaceAll("\\cdot", "/").replaceAll("^", "**"));
            console.log(exp);
            if(exp() <= maximum) {
                ele.parentNode.parentNode.parentNode.parentNode.style += ";color:red;font-size: 20pt;";
            }
        }
    });

});

setInterval(main, 100);
