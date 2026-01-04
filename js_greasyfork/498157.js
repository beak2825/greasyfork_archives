// ==UserScript==
// @name         跳转NGA广告
// @namespace    http://tampermonkey.net/
// @version      20240704
// @description  NGA广告没事跳一下太烦人了，这个javascript自动跳转
// @author       是海獭不是海懒
// @match        https://bbs.nga.cn/misc/adpage_insert_2.html?*
// @match        https://nga.178.com/misc/adpage_insert_2.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nga.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/498157/%E8%B7%B3%E8%BD%ACNGA%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/498157/%E8%B7%B3%E8%BD%ACNGA%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var matches = /adpage_insert.+?\?(.+)/g.exec(window.location.href);
    if(matches[1]){
        window.location.href = matches[1];
    }
})();