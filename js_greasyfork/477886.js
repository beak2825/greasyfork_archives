// ==UserScript==
// @name         PC豆瓣广告移除
// @namespace    https://www.cnblogs.com/zhiders/
// @version      0.3
// @description  尝试移除豆瓣页面上的百度广告，主要自用。
// @author       ZHider
// @match        https://movie.douban.com/*
// @match        https://www.douban.com/*
// @icon         https://movie.douban.com/favicon.ico
// @require      https://greasyfork.org/scripts/477884-elementgetter-gf/code/ElementGetter_gf.js?version=1267853
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/477886/PC%E8%B1%86%E7%93%A3%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/477886/PC%E8%B1%86%E7%93%A3%E5%B9%BF%E5%91%8A%E7%A7%BB%E9%99%A4.meta.js
// ==/UserScript==
/* globals elmGetter */

(function() {
    'use strict';

    /**
     * @param {HTMLElement} elm
     * @param {boolean} isInserted
     */
    function elmCallBack(elm, isInserted) {
        // console.log("Found ad, delete: ");
        // console.log(elm);
        elm.parentElement.removeChild(elm);
    }

    elmGetter.selector('xpath');
    elmGetter.each('//*[starts-with(@id, "dale")]', document, elmCallBack);
})();