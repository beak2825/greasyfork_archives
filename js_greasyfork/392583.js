// ==UserScript==
// @name         51脚本网站去广告
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  去掉51脚本网站的一些广告
// @author       You
// @match        *://www.jb51.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/392583/51%E8%84%9A%E6%9C%AC%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/392583/51%E8%84%9A%E6%9C%AC%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
var host = window.location.host;
//var host2=document.domain;
    console.log(host);
    //console.log(host2);
$('.pt10.clearfix').remove();
$('.lbd').remove();
$('div#pic_container').remove();
$('.r300').remove();
$('.lbd_bot.clearfix').remove();
$('.logor').remove();
$('.logom').remove();
$('.jb51ewm').remove();
$('.sidebox-recomm').remove();
})();