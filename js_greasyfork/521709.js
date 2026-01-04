// ==UserScript==
// @name         copy it rightly
// @namespace    http://tampermonkey.net/
// @version      2024-12-18
// @description  copy it rightly!
// @license      MIT
// @author       konyakest
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521709/copy%20it%20rightly.user.js
// @updateURL https://update.greasyfork.org/scripts/521709/copy%20it%20rightly.meta.js
// ==/UserScript==

// before using: 给定 l,r,xl,r,x，对 l≤i≤rl≤i≤r，在序列 aiai​ 前面插入元素 xx
// after using: 给定 l,r,x，对 l≤i≤r，在序列 ai​ 前面插入元素 x

setInterval(_=>{for(let i of document.getElementsByClassName("katex-mathml"))i.remove();},200);