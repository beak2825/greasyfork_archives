// ==UserScript==
// @name         华为固件下载直链
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  恢复华为软件下载直链
// @author       Indust
// @match        *://support.huawei.com/enterprise/*/software/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/501631/%E5%8D%8E%E4%B8%BA%E5%9B%BA%E4%BB%B6%E4%B8%8B%E8%BD%BD%E7%9B%B4%E9%93%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/501631/%E5%8D%8E%E4%B8%BA%E5%9B%BA%E4%BB%B6%E4%B8%8B%E8%BD%BD%E7%9B%B4%E9%93%BE.meta.js
// ==/UserScript==

setTimeout(function() {
    unsafeWindow.downloadSoft = function(h, e, g) {
        h = decodeContent(h);
        e = decodeContent(e);
        g = decodeContent(g);
        var d = $("a").hasClass(h + "_isCaSoftware");
        h = h.replace(/ESW/g, "SW");
        var b = $("#v_idPath").val() + "|" + $("#vrc").val();
        var a = $("#downloadPrefix").val() + "mid=SUPE_SW&nid=E" + h + "&partNo=" + e + "&path=" + b;
        toLogin();
        window.open(a);
    };
}, 1000);
