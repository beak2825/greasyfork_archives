// ==UserScript==
// @name         WendaPlus: Advanced Search
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  增强搜索
// @author       xgugugu
// @match        https://wenda.codingtang.com/search/*
// @grant        none
// @license      MIT
// @require      https://cdn.staticfile.org/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/483438/WendaPlus%3A%20Advanced%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/483438/WendaPlus%3A%20Advanced%20Search.meta.js
// ==/UserScript==

if (location.href.search('wenda.codingtang.com/search') != -1)
{
    let params = new URL(document.location).searchParams;
    let text = params.get('q');
    location.replace('https://cn.bing.com/search?q=' + encodeURIComponent(text) + '+site%3Awenda.codingtang.com');
}