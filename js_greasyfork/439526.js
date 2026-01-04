// ==UserScript==
// @name         AC そのまさかだよ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  AtCoder の [AC] 表記が [AC そのまさかだよ] に変更されます。
// @author       Shiroha
// @icon         https://pbs.twimg.com/media/EMTnDBZUEAAHE8i?format=png&name=4096x4096
// @grant        none
// @match        https://atcoder.jp/contests/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439526/AC%20%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%95%E3%81%8B%E3%81%A0%E3%82%88.user.js
// @updateURL https://update.greasyfork.org/scripts/439526/AC%20%E3%81%9D%E3%81%AE%E3%81%BE%E3%81%95%E3%81%8B%E3%81%A0%E3%82%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Array.from(document.getElementsByClassName("label-success")).forEach(r => {
        r.innerText = "AC そのまさかだよ";
    });
})();
