// ==UserScript==
// @name         🚓QQSecurityURLSkipper
// @namespace    http://bi2nb9o3.xyz
// @version      0.2.3
// @description  block the QQ's security URL
// @author       Bi2Nb9O3
// @match        https://c.pc.qq.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @license      GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/475436/%F0%9F%9A%93QQSecurityURLSkipper.user.js
// @updateURL https://update.greasyfork.org/scripts/475436/%F0%9F%9A%93QQSecurityURLSkipper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }
    if(location.href.search(/(http|https):\/\/c\.pc\.qq\.com\/(middlect|middlem)\.html\?.*pfurl=/) != -1){
        console.log("1")
        let jum=decodeURI(getQueryString("pfurl"))
        document.write("<div style='z-index:9999;width:100vw;height:100vh;display:grid;place-items:center;background-color:#0099ff;color:#fff;position: absolute;top: 0;left: 0;font-size:50px'>Jumping to "+jum+"</div>")
        window.location.href=jum
    }
})();