// ==UserScript==
// @name       Maxim Theme Userscript
// @author Maxim
// @namespace  https://github.com/thatguymaxim/Hack-Forums-Theme-Minimalism-Flat
// @version    1.0.6
// @description  Description
// @require https://code.jquery.com/jquery-3.1.1.js
// @match      *://hackforums.net*
// @match      *://hackforums.net/*
// @copyright  2017+
// @updateURL
// @downloadURL
// ------------------------------ Change Log ----------------------------
// version 1.0.0: Beta Release
// @downloadURL https://update.greasyfork.org/scripts/28772/Maxim%20Theme%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/28772/Maxim%20Theme%20Userscript.meta.js
// ==/UserScript==
// ------------------------------ Dev Notes -----------------------------
// Use this to get a cdn hosted css file:
//      https://rawgit.com/
// Use this to make an href string for the two lines below:
//      http://www.freeformatter.com/javascript-escape.html
$("head").append('<link '+ "href='https:\/\/cdn.rawgit.com\/thatguymaxim\/6d35bc1e38475320ab2ab28d971b4cc7\/raw\/52be442cda822d4b1ec41834237d69c2412e3a45\/global.css'" + 'rel="stylesheet" type="text/css">');
$("head").append('<link '+ "href='https:\/\/cdn.rawgit.com\/thatguymaxim\/6d35bc1e38475320ab2ab28d971b4cc7\/raw\/52be442cda822d4b1ec41834237d69c2412e3a45\/tabbed.css'" + 'rel="stylesheet" type="text/css">');