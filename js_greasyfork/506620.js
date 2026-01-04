// ==UserScript==
// @name Автовход 
// @namespace https://www.bestmafia.com/
// @version 3.0
// @description Чит на автовход
// @author bog
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506620/%D0%90%D0%B2%D1%82%D0%BE%D0%B2%D1%85%D0%BE%D0%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/506620/%D0%90%D0%B2%D1%82%D0%BE%D0%B2%D1%85%D0%BE%D0%B4.meta.js
// ==/UserScript==
 
 
var szd =['Шавухa'];
setInterval(function() {
var create = $('#gml_list').find('span');
for (var i = 0; i < create.length; i++) {
if (szd.indexOf($($(create)[i]).text()) != -1) {
_GM_action('gml', 'join', parseInt($($(create)[i]).parent('div').parent('li').attr('id').replace(/\D+/g, "")), event);
break;
}
}
if ($('#pp_fin').length || pla_data['dead']) { _DLG('exit', 2); }
}, 1000);
