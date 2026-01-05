// ==UserScript==
// @name        iShowMikeCRMResult
// @author     xinx1n
// @namespace   xinx1n
// @description 查看 MikeCRM 问卷统计
// @include http://*.mikecrm.com/*
// @include https://*.mikecrm.com/*
// @match http://*.mikecrm.com/*
// @match https://*.mikecrm.com/*
// @exclude http://*.mikecrm.com/r.php*
// @exclude https://*.mikecrm.com/r.php*
// @version     1.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/29281/iShowMikeCRMResult.user.js
// @updateURL https://update.greasyfork.org/scripts/29281/iShowMikeCRMResult.meta.js
// ==/UserScript==
(function () {
    var mcss = 'font-family:Tahoma,sans-serif,monospace; cursor: pointer; position: fixed; top:20px; right: 20px; padding:4px; border: none; background:white; font-size: 14px;letter-spacing:.2em;z-index: 10000;';
    var mbtn = document.createElement("button");
    mbtn.innerText = '查看统计';
    mbtn.style.cssText = mcss;
    document.body.appendChild(mbtn);
    mbtn.onclick = function () {
        var mhref = window.location.href;
        var urls = mhref.split('/');
        var mdo = urls[2];
        var ssid = urls.pop().split('=').pop();
        var murl = `http://${mdo}/r.php?t=${ssid}&s=2`;
        window.open(murl, 'x1nresult'+ ssid);
    }
})()