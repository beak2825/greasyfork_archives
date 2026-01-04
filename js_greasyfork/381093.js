// ==UserScript==
// @name         拒絕爛新聞
// @version      1.3
// @description  再見！爛新聞
// @author       威爾斯
// @match        *://tw.news.yahoo.com/*.html
// @match        *://*.setn.com/*
// @match        *://*.udn.com/news/*
// @match        *://*.ettoday.net/*
// @match        *://*.appledaily.com/*
// @match        *://*.ctitv.com.tw/*
// @match        *://*.chinatimes.com/*
// @match        *://news.pchome.com.tw/*
// @match        *://today.line.me/*
// @match        *://*moneynet.com.tw/*
// @match        *://*cna.com.tw/*
// @match        *://*ltn.com.tw/*
// @match        *://*times.hinet.net/news/*
// @match        *://*n.yam.com/Article/*
// @grant        none
// @namespace https://example.com
// @downloadURL https://update.greasyfork.org/scripts/381093/%E6%8B%92%E7%B5%95%E7%88%9B%E6%96%B0%E8%81%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/381093/%E6%8B%92%E7%B5%95%E7%88%9B%E6%96%B0%E8%81%9E.meta.js
// ==/UserScript==

//蕭琪琳：創造許多假新聞，真廣告
//永豐建經：假新聞、真廣告
//唐鳳：IQ180(?), apple consultant(?), Controversial(true)

(function() {
    'use strict';
    var keyWord=['三立','性侵','性騷擾','小模','上床','淫辱','嘿咻','姓男','姓女','性行為','禽獸','人妻','激戰'];
    var killWord=['化名','非當事人','示意圖','蕭琪琳','永豐建經','唐鳳'];
    var count=0;
    var html=document.documentElement.innerText.trim();

    killWord.forEach(function(e) {
        if(html.indexOf(e)!==-1)close();
    });

    keyWord.forEach(function(e) {
        if(html.indexOf(e)!==-1)count++;
        if(count>=3)close();
    });
})();