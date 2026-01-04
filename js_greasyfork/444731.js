// ==UserScript==
// @name         わ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  WA
// @author       Shiroha
// @match        https://atcoder.jp/contests/*
// @icon         https://pbs.twimg.com/media/FSQi-fIaAAAIvEe?format=png&name=small
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444731/%E3%82%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/444731/%E3%82%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    Array.from(document.getElementsByClassName("label-warning")).forEach(r => {
        if(r.innerText === "WA"){
            console.log(r.clientWidth);
            const p = r.parentElement;
            const y = Math.min(28, p.clientHeight - 16);
            const x = y * 400 / 250;
            p.removeChild(p.firstChild);
            const img = document.createElement("img");
            img.src = "https://pbs.twimg.com/media/FSQi-fIaAAAIvEe?format=png&name=small"
            img.height = y;
            img.width = x;
            p.appendChild(img);
        }
    });
})();