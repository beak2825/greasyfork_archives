// ==UserScript==
// @name         Cancer+++ v2
// @version      2.2.2
// @description  OGARio Edited
// @author       Szymy | Zooκ & Theo [Zooκ design]
// @match        http://agar.io/*
// @run-at       document-start
// @grant        GM_xmlhttpRequest
// @connect      agar.io
// @namespace    https://greasyfork.org/users/30360
// @downloadURL https://update.greasyfork.org/scripts/23786/Cancer%2B%2B%2B%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/23786/Cancer%2B%2B%2B%20v2.meta.js
// ==/UserScript==

setTimeout(function () {
    $('title')['text']('Cancerplus.tk');
    $('#overlays')['after']('<div style="z-index:1000!important;background:black!important;width:100%!important;height:100%!important;text-align:center!important;position:absolute!important;"><br><br><br><br><br><br><br><a target="_blank"><img src="http://fontmeme.com/embed.php?text=Cancer%20Plus&name=ethnocentric rg.ttf&size=50&style_color=FFFFFF"/></a><br><br><br><br><a target="_blank" href="http://www.cancerplus.cf/Extension/cancerplus.user.js"><button class="btn btn-primary" style="width:200px!important;">INSTALL CANCERPLUS</button></a><br><br><a target="_blank" href="https://www.youtube.com/channel/UCv52cSO842jBsPFGuy94K_g"><button class="btn btn-danger" style="width:200px!important;">MY CHANNEL</button></a></div>');
	$('head')['append']('<style> .btn-primary {color: #fff;background-color: transparent;border-color: transparent;} .btn-primary:hover {color: #428bca;background-color:transparent;border-color:transparent;} .btn-danger {color: #ffffff; background-color: transparent!important; border-color: transparent!important} .btn-danger:hover {color: #f71919; background-color: transparent!important; border-color: transparent!important}</style>');
}, 1000)