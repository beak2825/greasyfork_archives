// ==UserScript==
// @license      MIT
// @name         wallhavenClick
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Try to copy the real pic url into clipboard when the preview clicked!
// @author       RyanZ
// @match        *://*.wallhaven.cc/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=warriorz.click
// @grant        none
// @require      https://static.hdslb.com/js/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/445786/wallhavenClick.user.js
// @updateURL https://update.greasyfork.org/scripts/445786/wallhavenClick.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    $("a").on('click', function(e) {
        console.log(e);
        var url = this.href;
        url = url.replace("wallhaven.cc", "w.wallhaven.cc");
        url = url.replace("w/", "full/");
        var e6s = this.href.split("/");
        var picid = e6s[e6s.length - 1];
        var picid2 = picid.substr(0, 2);
        var poa = this.closest("figure");
        var fmt = ".jpg";
        if (poa.innerHTML.indexOf("PNG") != -1) fmt = ".png";
        url = url.replace(picid, picid2 + "/wallhaven-" + picid + fmt);
        var iptUrl = document.createElement("input");
        iptUrl.setAttribute("value", "" + url);
        document.body.appendChild(iptUrl);
        iptUrl.select();
        document.execCommand("copy");
        document.body.removeChild(iptUrl);
    });
})();