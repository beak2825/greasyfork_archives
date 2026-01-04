// ==UserScript==
// @name         Bilibili Opensearch
// @namespace    http://tampermonkey.net/
// @version      0.2_fin
// @description  找回被移除的 哔哩哔哩 Opensearch
// @author       Lcandy
// @run-at       document-start
// @match        *://bilibili.com/*
// @match        *://www.bilibili.com/*
// @match        *://search.bilibili.com/*
// @homepageURL  https://github.com/Lcandy2
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419875/Bilibili%20Opensearch.user.js
// @updateURL https://update.greasyfork.org/scripts/419875/Bilibili%20Opensearch.meta.js
// ==/UserScript==

(function() {
    var head=document.getElementsByTagName('head')[0];
    var link=document.createElement('link');
    link.rel="search";
    link.type="application/opensearchdescription+xml";
    if (window.location.hostname.indexOf("bilibili.com") >= 0){
        link.href="//osearch.vercel.app/opensearch/bilibili.com/opensearch.xml";
        link.title="哔哩哔哩";}
    head.appendChild(link)
}())