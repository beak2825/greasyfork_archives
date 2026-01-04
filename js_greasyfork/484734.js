// ==UserScript==
// @name         mikanBlocker
// @namespace    shadows
// @version      0.1.6
// @description  屏蔽搬运组
// @author       shadows
// @match        https://mikanani.me/Home/Classic
// @match        https://mikanani.me/Home/Classic/*
// @icon         https://mikanani.me/images/favicon.ico?v=2
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/484734/mikanBlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/484734/mikanBlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 195 冷番补完字幕组；305 GMTeam；312 MCE；314 天月动漫&发布组；329 Lilith-Raws ；351 DBD组；359 ANi；392 Kirara Fantasia ; 415 沸羊羊;410 贩卖机汉化组（只做繁体）;988 H-Enc;997,不当舔狗制作组(AI超分);1003 搬运组Prejudice-Studio
const blockIds = [195,305,312,314,329,351,359,392,415,410,988,997,1003];
// XK SPIRITS 真人特摄；B-Global Donghua 国漫
const blockPatterns = [/jibaketa合成|六四位元字幕组|沸班亚马|SubsPlease|VonEncodes|国语中字|多国字幕|b站弹幕|2160p|BDMV/i,/整理(搬运|时间)/,/XK SPIRITS/,/B-Global Donghua/i];
const rows = Array.from(document.querySelector('table').tBodies[0].rows);
for (let r of rows) {
    const idElements = Array.from(r.cells[1].querySelectorAll('a[href]'));
    if (idElements.length>0){
        const ids = idElements.map((e)=>parseInt(e.href.split('/').at(-1)));
        if( ids.some((i)=>blockIds.includes(i))){
            r.remove();
            continue;
        }
    }

    const title = r.cells[2].children[0].text;
    if(blockPatterns.some((p)=> p.test(title))){
        r.remove();
        continue;
    }
}

})();