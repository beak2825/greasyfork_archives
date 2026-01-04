// ==UserScript==
// @name         ⭐⭐⭐ 无图模式 ⭐⭐⭐
// @version      0.2
// @description  隐藏网页上所有的图片，摸鱼专用
// @author       蛋挞
// @include         *
// @grant              GM_addStyle
// @require          https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @namespace https://greasyfork.org/users/1112252
// @downloadURL https://update.greasyfork.org/scripts/469460/%E2%AD%90%E2%AD%90%E2%AD%90%20%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F%20%E2%AD%90%E2%AD%90%E2%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/469460/%E2%AD%90%E2%AD%90%E2%AD%90%20%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F%20%E2%AD%90%E2%AD%90%E2%AD%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_addStyle(`
        img {
            opacity: 0 !important;
        }
        
        * {
            background-image: none !important;
        }
    `);

})();
