// ==UserScript==
// @name         ZEROFOX embed
// @namespace https://greasyfork.org/users/710
// @version      0.1
// @description  enter something useful
// @author       Tjololo
// @match        https://www.mturkcontent.com/dynamic/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/12943/ZEROFOX%20embed.user.js
// @updateURL https://update.greasyfork.org/scripts/12943/ZEROFOX%20embed.meta.js
// ==/UserScript==

var a = $('a:first').attr("href");
var iframeString ='<iframe width="700" height="600" frameborder="1" scrolling="yes" marginheight="0" marginwidth="0" src="'+ a +'"></iframe>';
$('a:first').parent().append($('<div></div>').html(iframeString));