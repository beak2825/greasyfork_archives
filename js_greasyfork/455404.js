// ==UserScript==
// @name         jQuery调试
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  jQuery调试专用
// @author       myaijarvis
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL-3.0 License
// @run-at       document-end
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chenzhongtech.com
// @require      https://cdn.bootcss.com/jquery/2.2.1/jquery.js
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/455404/jQuery%E8%B0%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/455404/jQuery%E8%B0%83%E8%AF%95.meta.js
// ==/UserScript==

//this.$ = this.jQuery = jQuery.noConflict(true); // 控制台$无效就注释这条代码

// 使用的时候再开启，不使用的时候请关闭
(function() {
    'use strict';

    console.log('jQuery调试');
    console.log($);

})();