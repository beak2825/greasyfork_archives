// ==UserScript==
// @name         ニコニコ大百科、繋がってる自動リンクを判別
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  繋がってる自動リンク（いわゆるシロナガスクジラ現象）をマウスオーバーしなくても分かるようにします。
// @author       cbxm
// @match        https://dic.nicovideo.jp/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438323/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E3%80%81%E7%B9%8B%E3%81%8C%E3%81%A3%E3%81%A6%E3%82%8B%E8%87%AA%E5%8B%95%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E5%88%A4%E5%88%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/438323/%E3%83%8B%E3%82%B3%E3%83%8B%E3%82%B3%E5%A4%A7%E7%99%BE%E7%A7%91%E3%80%81%E7%B9%8B%E3%81%8C%E3%81%A3%E3%81%A6%E3%82%8B%E8%87%AA%E5%8B%95%E3%83%AA%E3%83%B3%E3%82%AF%E3%82%92%E5%88%A4%E5%88%A5.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    const autos= document.getElementsByClassName("auto");
    for(let a of autos){
        if(a.nextSibling==null||a.nextSibling.className!="auto"){
         continue;
        }

        const span=document.createElement("span");
        a.insertAdjacentElement("beforebegin",span);

        span.appendChild(a);

        span.style.borderRight="1px solid";
        span.style.color="#00000";

    }
})();