// ==UserScript==
// @name         BTBTT
// @version      0.5
// @author       ytzong
// @description  Auto download torrent
// @include    http://*btbbt.*/*
// @include    http://*btbtt.*/*
// @copyright    2017+
// @run-at       document-end
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js
// @namespace https://greasyfork.org/users/670
// @downloadURL https://update.greasyfork.org/scripts/32571/BTBTT.user.js
// @updateURL https://update.greasyfork.org/scripts/32571/BTBTT.meta.js
// ==/UserScript==

GM_addStyle('body {background-image:none !important}.width{width:auto !important}hr{display:none!important}.thread{border-top:1px solid #E0E0E0!important}');

if (location.pathname.includes('attach-dialog')) {
    var url = location.protocol + '//' + location.hostname + '/' + $('.icon-download').parent().attr('href');
    location.href = url;
    window.setInterval(window.close, 10000);
}
$('.subject').each(function(){
	var text = $(this).text();
	if (text.includes('[有广告]')) $(this).parents('.thread').hide();
})