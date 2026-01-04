// ==UserScript==
// @name автовход обычный
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description 32232
// @author bog
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/529915/%D0%B0%D0%B2%D1%82%D0%BE%D0%B2%D1%85%D0%BE%D0%B4%20%D0%BE%D0%B1%D1%8B%D1%87%D0%BD%D1%8B%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/529915/%D0%B0%D0%B2%D1%82%D0%BE%D0%B2%D1%85%D0%BE%D0%B4%20%D0%BE%D0%B1%D1%8B%D1%87%D0%BD%D1%8B%D0%B9.meta.js
// ==/UserScript==

var szd =['Аnnett','Ķoтиķ','UNDRGRND','Shpilly_Willy','Harvester of Souls','ОпASнЫй Во3рАSт','Eсенина','Tоm'];
setInterval(function() {
var create = $('#gml_list').find('span');
for (var i = 0; i < create.length; i++) {
if (szd.indexOf($($(create)[i]).text()) != -1) {
_GM_action('gml', 'join', parseInt($($(create)[i]).parent('div').parent('li').attr('id').replace(/\D+/g, "")), event);
break;
}
}
if ($('#pp_fin').length || pla_data['dead']) { _DLG('exit', 2); }
}, 500);