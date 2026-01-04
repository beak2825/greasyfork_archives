// ==UserScript==
// @name         淘宝摸鱼
// @namespace    http://tampermonkey.net/
// @version      2024-11-24
// @description  淘宝摸鱼任务
// @author       mattpower
// @match        https://huodong.taobao.com/wow/z/tbhome/pc-growth/fishing*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/518686/%E6%B7%98%E5%AE%9D%E6%91%B8%E9%B1%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/518686/%E6%B7%98%E5%AE%9D%E6%91%B8%E9%B1%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var button = document.querySelector('.btn--kCZdTvdu')
    if (button) {
                button.click();
            }
})();