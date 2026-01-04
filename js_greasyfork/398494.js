// ==UserScript==
// @name         bilibili antiBv
// @namespace    mscststs.com
// @version      0.5
// @description  拒绝 BV ，自动跳转到 AV
// @author       mscststs
// @match        https://www.bilibili.com/video/BV*
// @match        https://www.bilibili.com/video/bV*
// @match        https://www.bilibili.com/video/Bv*
// @match        https://www.bilibili.com/video/bv*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398494/bilibili%20antiBv.user.js
// @updateURL https://update.greasyfork.org/scripts/398494/bilibili%20antiBv.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let aid = window.aid || window.__INITIAL_STATE__.aid;
    if(aid){
        window.location.replace(`https://www.bilibili.com/video/av${aid}${location.search}`)
    }
})();