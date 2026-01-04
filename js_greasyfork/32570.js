// ==UserScript==
// @name         iTunes
// @namespace    https://twitter.com/ytzong
// @version      0.5
// @author       ytzong
// @include      https://itunes.apple.com/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @description Show large icon
// @downloadURL https://update.greasyfork.org/scripts/32570/iTunes.user.js
// @updateURL https://update.greasyfork.org/scripts/32570/iTunes.meta.js
// ==/UserScript==

GM_addStyle('.truncate{height:auto !important}.price, .release-date, .in-app-purchases {background-color:yellow !important}');

var coverURL = $('.product img').attr('src');
console.log(coverURL);
coverURL = coverURL.replace(/175x175/, "1024x1024");
coverURL = coverURL.replace(/.jpg/, ".png");
$('.product img').closest('a').attr('href', coverURL).attr('target', '_blank');

var titleEle = $('#title h1');
titleEle.wrap('<a href="https://www.appannie.com/search/?q=' + encodeURIComponent(titleEle.text()) + '" target="_blank"/>');