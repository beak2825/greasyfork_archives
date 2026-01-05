// ==UserScript==
// @name        TextFugu Link Fix
// @namespace   thenn42.eu/userscripts
// @description Gets rid of the #top at the end of links on all the lessons pages
// @author      Inserio
// @include     *www.textfugu.com/*
// @version     1.3
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/10157/TextFugu%20Link%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/10157/TextFugu%20Link%20Fix.meta.js
// ==/UserScript==

$('p').html(function (i, text) {
    return text.replace(
         /(href[-\.="/\w]+?)#top/gi,
        '$1');
});