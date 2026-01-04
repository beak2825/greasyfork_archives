// ==UserScript==
// @name         shipxy
// @namespace    http://www.shipxy.com/
// @version      0.1
// @description  船讯网 通过url 获取参数 自动补入!
// @author       You
// @match        *://www.shipxy.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428301/shipxy.user.js
// @updateURL https://update.greasyfork.org/scripts/428301/shipxy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    document.getElementById("txtKey").value = getQueryString("key");

    //获取url参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

   
})();