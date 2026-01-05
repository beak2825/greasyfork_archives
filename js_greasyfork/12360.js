// ==UserScript==
// @name       jawz Hybrid - Quick Fix
// @version    1.1
// @author	   jawz
// @description  Eric Chizzle
// @match      http://www.gethybrid.io/workers/tasks/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @namespace https://greasyfork.org/users/1997
// @downloadURL https://update.greasyfork.org/scripts/12360/jawz%20Hybrid%20-%20Quick%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/12360/jawz%20Hybrid%20-%20Quick%20Fix.meta.js
// ==/UserScript==

var addy = $('div[class="item-response order-2"]').find('a').eq(1).text();
var place = $('div[class="item-response order-10"]').find('p').eq(1);
var place2 = $('div[class="item-response order-4"]').find('p').eq(4);
place.append('<br><br><b>' + addy + '</b>');
place2.append('<br><br><b>' + addy + '</b>');