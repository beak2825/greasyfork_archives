// ==UserScript==
// @name       jawz Hybrid - Verify business categories
// @version    1.0
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/10459/jawz%20Hybrid%20-%20Verify%20business%20categories.user.js
// @updateURL https://update.greasyfork.org/scripts/10459/jawz%20Hybrid%20-%20Verify%20business%20categories.meta.js
// ==/UserScript==

var businessNameE = $('p:contains("Business name: ")');
var ogText = businessNameE.text();
var ogText = ogText.split('Business address:');

var businessSearch = businessNameE.text().trim().replace("Business name: ", "").replace("Business address: ", "").replace(/(\r\n|\n|\r)/gm," ");;
var url = "http://www.google.com/search?q=" + businessSearch;
url = url.replace("Company Name: ","").replace(/[" "]/g, "+").replace("&", "%26").replace('#', '');

businessNameE.html(ogText[0] + '<br>Business address:' + ogText[1] + '<br>Search link: <a href=' + url + ' target=_blank> Name and Address </a>');