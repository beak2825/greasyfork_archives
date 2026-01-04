// ==UserScript==
// @name         bypass.vip
// @version      1.0
// @description  Bypasses links from bypass.vip.
// @namespace LethalAspect
// @author       LethalAspect
// @license GNU GPLv3
// @match        *://*.linkvertise.com/*
// @match        *://*.linkvertise.net/*
// @match        *://*.linkvertise.download/*
// @match        *://*.link-to.net/*
// @match        *://*.mboost.me/*
// @match        *://*.adf.ly/*
// @match        *://*.letsboost.net/*
// @match        *://*.sub4unlock.com/*
// @match        *://*.exe.io/*
// @match        *://*.exey.io/*
// @match        *://*.sub2unlock.net/*
// @match        *://*.sub2unlock.com/*
// @match        *://*.rekonise.com/*
// @match        *://*.ph.apps2app.com/*
// @match        *://*.shortconnect.com/*
// @match        *://*.ytsubme.com/*
// @match        *://*.bit.ly/*
// @match        *://*.social-unlock.com/*
// @match        *://*.boost.ink/*
// @match        *://*.goo.gl/*
// @match        *://*.shrto.ml/*
// @match        *://*.t.co/*
// @match        *://*.tinyurl.com/*
// @exclude      *://publisher.linkvertise.com/*
// @exclude      *://cdn.linkvertise.com/*
// @exclude      *://link-mutation.linkvertise.com/*
// @exclude      *://linkvertise.com
// @exclude      *://linkvertise.com/search*
// @exclude      *://linkvertise.com/assets*
// @exclude      *://linkvertise.com/profile*
// @exclude      *://blog.linkvertise.com
// @exclude      *://blog.linkvertise.com/*
// @exclude      https://linkvertise.com/
// @run-at       document-end
// @icon         https://bypass.vip/assets/favicon.ico
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @downloadURL https://update.greasyfork.org/scripts/448473/bypassvip.user.js
// @updateURL https://update.greasyfork.org/scripts/448473/bypassvip.meta.js
// ==/UserScript==

function reqListener () {
    console.log(this.responseText);
    var obj = JSON.parse(this.responseText);
    console.log(obj.destination);
    location.href = obj.destination;
}

setTimeout(function(){
    var oReq = new XMLHttpRequest();
    oReq.addEventListener("load", reqListener);
    oReq.open("POST", "https://api.bypass.vip/");
    oReq.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    oReq.send("url=" + location.href);
},50);
