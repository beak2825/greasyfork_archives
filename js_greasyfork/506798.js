// ==UserScript==
// @name Сбить босса
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Боссы
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506798/%D0%A1%D0%B1%D0%B8%D1%82%D1%8C%20%D0%B1%D0%BE%D1%81%D1%81%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/506798/%D0%A1%D0%B1%D0%B8%D1%82%D1%8C%20%D0%B1%D0%BE%D1%81%D1%81%D0%B0.meta.js
// ==/UserScript==
 
 
var stavka = 99999; //
 
setInterval(function(){
 
var boss = parseInt($('.bossBet > span').text());
 
$('.main').click();
 
if(stavka > boss){
 
if($('.bossButton').text()=='Убить босса'){
 
_DLG('boss', 0, event);
 
$('#pp_dlg_boss').find ('button').click();
 
}
 
}
 
},500)