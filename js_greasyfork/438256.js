// ==UserScript==
// @name         Fuck QQ Alert
// @namespace    http://tampermonkey.net/
// @version      0.3
// @license      gpl-3.0
// @description  QQ拦截页面自动重定向
// @author       PRO
// @match        https://c.pc.qq.com/middlem.html*
// @icon         https://3gimg.qq.com/tele_safe/static/tmp/ic_alert_blue.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438256/Fuck%20QQ%20Alert.user.js
// @updateURL https://update.greasyfork.org/scripts/438256/Fuck%20QQ%20Alert.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getParams(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return '';
    }
    let url = getParams('pfurl');
    if (!url.startsWith('http')) {
        url = 'https://' + url;
    }
    window.open(url,'_self');
})();