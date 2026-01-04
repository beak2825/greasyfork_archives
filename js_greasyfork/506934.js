// ==UserScript==
// @name Килы в созда с хвостом!
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Килы
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506934/%D0%9A%D0%B8%D0%BB%D1%8B%20%D0%B2%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%20%D1%81%20%D1%85%D0%B2%D0%BE%D1%81%D1%82%D0%BE%D0%BC%21.user.js
// @updateURL https://update.greasyfork.org/scripts/506934/%D0%9A%D0%B8%D0%BB%D1%8B%20%D0%B2%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%20%D1%81%20%D1%85%D0%B2%D0%BE%D1%81%D1%82%D0%BE%D0%BC%21.meta.js
// ==/UserScript==
 
 
setInterval(function() {
if ((gam_state == 'play') && (!($("#gxt_115").is(".disabled"))) && ($('#pp_fin').length || pla_data['dead'])) {
_GM_action('', 'ext_use', [115, document.querySelector("li[id^='upl_']").id.match(/\d+/)[0]], event);
} else if (($('#pp_fin').length || pla_data['dead'])) {
_DLG('exit', 2);
}
}, 1000);
 
var szd =['Роковая страсть'];
setInterval(function() {
var create = $('#gml_list').find('span');
for (var i = 0; i < create.length; i++) {
if (szd.indexOf($($(create)[i]).text()) != -1) {
_GM_action('gml', 'join', parseInt($($(create)[i]).parent('div').parent('li').attr('id').replace(/\D+/g, "")), event);
break;
}
}
}, 1000);
