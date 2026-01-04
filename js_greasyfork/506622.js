// ==UserScript==
// @name Ака+хвост
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Ака+автохвост
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506622/%D0%90%D0%BA%D0%B0%2B%D1%85%D0%B2%D0%BE%D1%81%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/506622/%D0%90%D0%BA%D0%B0%2B%D1%85%D0%B2%D0%BE%D1%81%D1%82.meta.js
// ==/UserScript==
 
 
var szd = ['Ники запильщиков'];
setInterval(function() {
var create = $('#gml_list').find('span');
for (var i = 0; i < create.length; i++) {
if (szd.indexOf($($(create)[i]).text()) != -1) {
_GM_action('gml', 'join', parseInt($($(create)[i]).parent('div').parent('li').attr('id').replace(/\D+/g, "")));
break;
}
}
if (ifc_mode == 'game') {
if (parseInt($('#gxt_159').not('.disabled').find('.count').text())) {
_GM_action('', 'ext_act', 159);
}
}
if ($('#pp_fin').length || pla_data['dead']) {
_DLG('exit', 2);
}
},500);
