// ==UserScript==
// @name           Id3nt1-byp@55
// @author         o0xXx0o
// @version        0.12
// @description    Identi Automatic Show Links ByPass!
// @homepageURL    http://www.identi.li/
// @include        http://*.identi.li/topic/*
// @include        http://*.identi.li/index.php?topic=*
// @include        http://*webcache.googleusercontent.com/search?q=cache:*:www.identi.li/index.php%3Ftopic%3D*
// @include        http://*webcache.googleusercontent.com/search?q=cache:*:www.identi.li/topic/*
// @icon           http://i.imgbox.com/R0R84xlm.png
// @grant          none
// @namespace      https://greasyfork.org/users/24448
// @downloadURL https://update.greasyfork.org/scripts/15956/Id3nt1-byp%4055.user.js
// @updateURL https://update.greasyfork.org/scripts/15956/Id3nt1-byp%4055.meta.js
// ==/UserScript==

window.pconfig.time=0;window.t_spoiler=0;window.cdown.time=0;window.impresiones=function(){};window._decrypt.loading=0;window._decrypt.links=function(){$("div #decrypt").click(function(){_decrypt.fnID=$(this).attr("src");_decrypt.fnURL=$(this).attr("href");$(this).hasClass("block")||(_decrypt.objeto=$(this),1!=global.pauth=="0"?ventanaSecundaria():_decrypt.open())})};
window.ventanaSecundaria=function(){$("div #decrypt").addClass("block");t_spoiler=pconfig.time;publi_open=publi_closed=0;timer=window.setInterval("contador()",0)};
window.contador=function(){var a=_decrypt.objeto;t_spoiler<=pconfig.time&&0<t_spoiler&&--t_spoiler;t_spoiler==pconfig.time?txt="Ya puedes descargar!":0==t_spoiler?txt="jdownloader"==_decrypt.fnID?"Los enlaces se agregaran automaticamente!":"Ya puedes descargar!":t_spoiler<pconfig.time&&(txt="No cerrar la ventanita, abriendo links en "+t_spoiler+" seg. ");a.val(txt);0>=t_spoiler&&(t_spoiler=pconfig.time,publi_open=1,_decrypt.open(),clearInterval(timer),$("div #decrypt").removeClass("block"),a.removeClass("ui-button-negative"))};
setInterval(e,300);function e(){$("[value = 'Ver Links de Descarga']").click()};
