// ==UserScript==
// @name         EHentai外观改良-mobile
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  一些外观改良，不痛不痒
// @author       TsXor
// @license      MIT
// @match        https://e-hentai.org/
// @match        https://e-hentai.org/?page=*
// @match        https://e-hentai.org/?f_search=*
// @match        https://e-hentai.org/tag/*
// @match        https://e-hentai.org/uploader*
// @match        https://e-hentai.org/watched
// @match        https://e-hentai.org/popular
// @match        https://exhentai.org/
// @match        https://exhentai.org/?page=*
// @match        https://exhentai.org/?f_search=*
// @match        https://exhentai.org/tag/*
// @match        https://exhentai.org/uploader*
// @match        https://exhentai.org/watched
// @match        https://exhentai.org/popular
// @icon         https://www.google.com/s2/favicons?domain=exhentai.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444279/EHentai%E5%A4%96%E8%A7%82%E6%94%B9%E8%89%AF-mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/444279/EHentai%E5%A4%96%E8%A7%82%E6%94%B9%E8%89%AF-mobile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    mainfunc();
})();
function mainfunc() {
    //定位页内元素
    var inpage_body = document.body;
    var inpage_nb = document.getElementById("nb");
    var inpage_toppane = document.getElementById("toppane");
    var inpage_searchbox = document.getElementById("searchbox");
    var inpage_ido = document.getElementsByClassName("ido")[0];
    var inpage_itc = document.getElementsByClassName("itc")[0];
    var inpage_ptt = document.getElementsByClassName("ptt")[0];
    var inpage_ptb = document.getElementsByClassName("ptb")[0];
    var inpage_dp = document.getElementsByClassName("dp")[0];
    //通用改良
    var cust_header = document.createElement("div");
    cust_header.setAttribute("id", "header");
    inpage_body.insertBefore(cust_header, inpage_nb);
    cust_header.appendChild(inpage_nb);
    cust_header.appendChild(inpage_toppane);
    cust_header.setAttribute("style","z-index:256;position: sticky;top: 0px;width:100%;border:1px solid #000");
    cust_header.style.backgroundColor = getComputedStyle(inpage_body).backgroundColor;
    inpage_searchbox.style.backgroundColor = getComputedStyle(inpage_ido).backgroundColor;
    inpage_ptt.remove();
    inpage_dp.firstElementChild.remove();
    inpage_dp.appendChild(inpage_ptb);
    inpage_dp.setAttribute("style","z-index:256;position: sticky;bottom: 0px;width:100%;border:1px solid #000");
    inpage_dp.style.backgroundColor = getComputedStyle(inpage_body).backgroundColor;
    //适应手机
    inpage_searchbox.style.width = 'auto';
    document.body.style.fontSize = '28pt';
    var MOBILEcss = document.createElement("style");
    //可惜Tampermonkey不支持反斜杠连行
    MOBILEcss.innerHTML = ''+
        '.itc{width:100%;table-layout:fixed;}'+
        '.cs{width:100%;height:80px;line-height:80px;font-size:32pt;}'+
        '#nb>div{font-size:32pt;line-height:76px;}'+
        '#nb{min-height:78px;max-height:78px;min-width:100%;max-width:100%;}'+
        'input[type="checkbox"]{top:-8px;transform:scale(2);}'+
        'input[type="button"], input[type="submit"]{font-size: 28pt;line-height: 80px;transform:translateY(10px);}'+
        'input[type="text"], input[type="password"], select{line-height: 80px;}'+
        'div.idi{width:100%}'+
        'td.gl1e{width:50%}'+
        'td.gl1e>div{width:auto!important;height:auto!important;}'+
        'td.gl1e>div>a>img{width:100%!important;height:auto!important;}'+
        'td.gl2e{width:50%}'+
        '.gl2e>div{flex-direction:column}'+
        '.gl3e>div:nth-child(1){top:50%;transform:translateY(-50%);height:70px;line-height:70px;font-size:28pt;width:150px;}'+
        '.gl3e{width:100%;max-width:100%;min-height:160px;}'+
        '.gl3e>div:nth-child(2){top:17.5%;transform:translateY(-50%);left:145px;font-size:18pt;line-height:100%;width:250px;}'+
        '.gl3e>div:nth-child(3){top:25%;transform:translateY(-50%);right:25px;left:auto;font-size:28pt;line-height:100%;}'+
        '.gl3e>div:nth-child(4){top:75%;transform:translateY(-50%);left:145px;font-size:28pt;line-height:100%;width:300px;}'+
        '.gl3e>div:nth-child(5){top:37.5%;transform:translateY(-50%);left:145px;font-size:18pt;line-height:100%;width:250px;}'+
        '.gl3e>div:nth-child(6){top:25%;right:25px;left:auto;transform: scale(4);}'+
        'table.ptb td{font-size:28pt;height:60px;width:120px;}'+
        'td.ptds a{font-size:28pt;}'+
        'body div.gt,body div.gtl,body div.gtw{height:48px;line-height:48px;}'+
        'table.itg{font-size:28pt;}'+
        '.gl4e>div:nth-child(1){line-height:42px;font-size:28pt;max-height:200px;}';
    document.body.append(MOBILEcss);
}