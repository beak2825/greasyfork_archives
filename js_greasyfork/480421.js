// ==UserScript==
// @name         QQ跳转
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  qq跳转
// @license      MIT
// @description  try to take over the world!
// @author       HellSherry
// @match        https://c.pc.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/480421/QQ%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/480421/QQ%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

function getQueryString(name) {
    var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return unescape(r[2]);
    }
    return null;
}

(function() {
    'use strict';
   window.location.href=getQueryString('pfurl')
//console.log(getQueryString('pfurl'))
    // Your code here...
})();