// ==UserScript==
// @name         反反广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  出于对张老师这个随机标签十分感兴趣，本着研究的精神，写了一个反hack的自用方案，在此留一下记录，代码仅供娱乐，请不要用于其他用途
// @author       You
// @match        https://www.zhangxinxu.com/*
// @icon         https://www.google.com/s2/favicons?domain=zhangxinxu.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438459/%E5%8F%8D%E5%8F%8D%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/438459/%E5%8F%8D%E5%8F%8D%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const regx= /^[a-z]{4}-[a-z]{2}$/;
    let bodyNodes = document.querySelector('body').children;
    let values = Object.values(JSON.stringify(bodyNodes));
    let targetNode = Object.values(bodyNodes).map((e) => e["localName"]).findIndex((e)=> regx.test(e));
    bodyNodes[targetNode].style.display = 'none';
})();