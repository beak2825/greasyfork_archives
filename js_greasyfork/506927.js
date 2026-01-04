// ==UserScript==
// @name Ака без хвоста
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Ака
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506927/%D0%90%D0%BA%D0%B0%20%D0%B1%D0%B5%D0%B7%20%D1%85%D0%B2%D0%BE%D1%81%D1%82%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/506927/%D0%90%D0%BA%D0%B0%20%D0%B1%D0%B5%D0%B7%20%D1%85%D0%B2%D0%BE%D1%81%D1%82%D0%B0.meta.js
// ==/UserScript==
 
setInterval(function() {
var create = $('#gml_list').find('span');
/* Removed the part related to following a specified player */
if (ifc_mode == 'game') {
if (parseInt($('#gxt_159').not('.disabled').find('.count').text())) {
_GM_action('', 'ext_act', 159);
}
}
if ($('#pp_fin').length || pla_data['dead']) {
_DLG('exit', 2);
}
}, 500);