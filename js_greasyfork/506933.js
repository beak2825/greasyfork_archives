// ==UserScript==
// @name Ака, затем килы в созда
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Килы с ака
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506933/%D0%90%D0%BA%D0%B0%2C%20%D0%B7%D0%B0%D1%82%D0%B5%D0%BC%20%D0%BA%D0%B8%D0%BB%D1%8B%20%D0%B2%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/506933/%D0%90%D0%BA%D0%B0%2C%20%D0%B7%D0%B0%D1%82%D0%B5%D0%BC%20%D0%BA%D0%B8%D0%BB%D1%8B%20%D0%B2%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0.meta.js
// ==/UserScript==
 
setInterval(() => {
switch (gam_state) {
case '':
var create = $('#gml_list').find('span');
for (var i = 0; i < create.length; i++) {
if (szd.indexOf($($(create)[i]).text()) != -1) {
_GM_action('gml', 'join', parseInt($($(create)[i]).parent('div').parent('li').attr('id').replace(/\D+/g, "")), event);
break;
}
}
break;
case 'play':
if (pla_data['dead']) {
if ((!($("#gxt_115").is(".disabled"))) && $('#gxt_115').find('.count').text()) {
_GM_action('', 'ext_use', [115, gam_data.owner], event);
} else {
_DLG('exit', 2);
}
} else {
if ((!($("#gxt_159").is(".disabled"))) && $('#gxt_159').find('.count').text()) {
_GM_action('', 'ext_act', '159', event);
}
}
break;
 
case 'fin':
_DLG('exit', 2);
break;
 
default:
break;
}
}, 500);