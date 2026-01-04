// ==UserScript==
// @name         其乐轮播图广告指示器/keylol ad pointer
// @namespace    http://tampermonkey.net/
// @version      0.0.4
// @author       ltymxty@gmail.com
// @match        https://keylol.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=keylol.com
// @grant        none
// @license      GPLv3
// @description 受不了其乐在轮播图里插育碧和别的玩意的外链广告，做个指示器免得误点。
// @downloadURL https://update.greasyfork.org/scripts/475362/%E5%85%B6%E4%B9%90%E8%BD%AE%E6%92%AD%E5%9B%BE%E5%B9%BF%E5%91%8A%E6%8C%87%E7%A4%BA%E5%99%A8keylol%20ad%20pointer.user.js
// @updateURL https://update.greasyfork.org/scripts/475362/%E5%85%B6%E4%B9%90%E8%BD%AE%E6%92%AD%E5%9B%BE%E5%B9%BF%E5%91%8A%E6%8C%87%E7%A4%BA%E5%99%A8keylol%20ad%20pointer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.styleSheets[document.styleSheets.length - 1].insertRule(
    `.ubi_warn {
        position: absolute;
        bottom: 32px;
        left: 0px;
        color: red;
        font-weight: bolder;
        font-size: 2em;
        padding-left: 1em;
        width: 100%;
        background: rgba(0,0,0,0.6);
    }`)
    Array.from(document.querySelectorAll('.slideshow a'))
        .filter(a_el => !a_el.href.includes('keylol.com') || a_el.querySelector("img").title.includes("活动推广") || a_el.querySelector("img").title.includes("板块: 杉果"))
        .forEach(a_el => a_el.insertAdjacentHTML('afterend', '<span class="ubi_warn">此条为广告！</span>'))
})();