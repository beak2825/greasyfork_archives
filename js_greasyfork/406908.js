// ==UserScript==
// @name         5ch　スレ一覧　改行
// @name:en      5ch thread list linebreaker
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  全スレ一覧のページを読みやすくするために各スレ名の間に改行を入れます
// @description:en  adds linebreaks to thread list to aid legibility
// @author       You
// @match        https://*.5ch.net/*/subback.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406908/5ch%E3%80%80%E3%82%B9%E3%83%AC%E4%B8%80%E8%A6%A7%E3%80%80%E6%94%B9%E8%A1%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/406908/5ch%E3%80%80%E3%82%B9%E3%83%AC%E4%B8%80%E8%A6%A7%E3%80%80%E6%94%B9%E8%A1%8C.meta.js
// ==/UserScript==

var small = document.querySelector('small#trad');
var alla = small.querySelectorAll('a');
for (let i = alla.length-1;i>-1;i--){alla[i].innerHTML+='<br>';}