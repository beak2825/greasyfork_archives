// ==UserScript==
// @name         完整显示子网页标题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  针对中大电信院官网所有子网页标题被缩略而影响观感的问题，本脚本对其子网页标题进行完整显示。
// @author       HubertSing
// @license      MIT
// @match        http://seit.sysu.edu.cn/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/439584/%E5%AE%8C%E6%95%B4%E6%98%BE%E7%A4%BA%E5%AD%90%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/439584/%E5%AE%8C%E6%95%B4%E6%98%BE%E7%A4%BA%E5%AD%90%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

(function () {
    'use strict';
    GM_addStyle(`
        .field-content.textellipsis{
            overflow: visible;
            white-space: normal;
        }
        .blockheight320{
            height:440px
        }
        .blockheight270{
            height:390px
        }
    `)
})();