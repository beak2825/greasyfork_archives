// ==UserScript==
// @name         自动跳过QQ网址拦截
// @version      1.0.0
// @description  自动跳过QQ网址拦截,保护隐私，移除QQ号等信息（参数）, F_U_C_K
// @author       Jack.Chan (fulicat@qq.com)
// @namespace    http://fulicat.com
// @url          https://greasyfork.org/zh-CN/scripts/429764-%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87qq%E7%BD%91%E5%9D%80%E6%8B%A6%E6%88%AA
// @match        *://c.pc.qq.com/middlem.html*
// @icon         https://www.google.com/s2/favicons?domain=qq.com
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/429764/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87QQ%E7%BD%91%E5%9D%80%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/429764/%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BF%87QQ%E7%BD%91%E5%9D%80%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getParams(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return '';
    }
    var url = getParams('pfurl');
    if (url) {
        window.location.replace(url);
    }
})();