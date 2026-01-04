// ==UserScript==
// @name Оковы
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Оковы авто
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506928/%D0%9E%D0%BA%D0%BE%D0%B2%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/506928/%D0%9E%D0%BA%D0%BE%D0%B2%D1%8B.meta.js
// ==/UserScript==
 
setInterval(function() {
if ((gam_state == 'play') && (!($("#gxt_323").is(".disabled"))) && (!($('#pp_fin').length || pla_data['dead']))) {
_GM_action('', 'ext_act', '323', event);
} else if (($('#pp_fin').length || pla_data['dead'])) {
_DLG('exit', 2);
}
}, 500);
