// ==UserScript==
// @name         PT 站自定义已访问链接颜色
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  PT 站：自定义种子列表已访问链接颜色，兼容 NexusPHP 站点。
// @author       ShaoxiongXu
// @match        *://*/*/torrents.php*
// @match        *://*/torrents.php*
// @match        *://*/*/movie.php*
// @match        *://*/movie.php*
// @match        *://*/*/music.php*
// @match        *://*/music.php*
// @match        *://*/*/offers.php*
// @match        *://*/offers.php*
// @match        *://*/*/seek.php*
// @match        *://*/seek.php*
// @match        *://*/*/adult.php*
// @match        *://*/adult.php*
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @license      GPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/481997/PT%20%E7%AB%99%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B7%B2%E8%AE%BF%E9%97%AE%E9%93%BE%E6%8E%A5%E9%A2%9C%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/481997/PT%20%E7%AB%99%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B7%B2%E8%AE%BF%E9%97%AE%E9%93%BE%E6%8E%A5%E9%A2%9C%E8%89%B2.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function setStyle() {
        GM_addStyle(`
            .torrents a:visited {
                /* 你想要的已访问链接颜色，可以是颜色名称、十六进制颜色码等，替换 #70ada7 比如 red */
                color: #70ada7 !important;
            }
        `)
    }

    if (document.readyState === "loading") {
        document.addEventListener('DOMContentLoaded', function () {
            setStyle()
        });
    } else {
        setStyle()
    }

})();
