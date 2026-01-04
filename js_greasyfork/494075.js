// ==UserScript==
// @name Автовход кланки
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Автоматически заходит на клановые игры.
// @author overdose
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494075/%D0%90%D0%B2%D1%82%D0%BE%D0%B2%D1%85%D0%BE%D0%B4%20%D0%BA%D0%BB%D0%B0%D0%BD%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/494075/%D0%90%D0%B2%D1%82%D0%BE%D0%B2%D1%85%D0%BE%D0%B4%20%D0%BA%D0%BB%D0%B0%D0%BD%D0%BA%D0%B8.meta.js
// ==/UserScript==

(function() {
'use strict';

var szd =['Ксюшечкa','Марсианка', 'Лёшенька','Мгла со Мной','Катара','ЛеДянOй KрИсТаЛл', 'юлия с', 'Чyмa', 'yungtimmi', 'Ņēw Mēxičo', 'aбрикос', 'RēĻiķT', 'dоnk'];
setInterval(function() {
var create = $('#gml_list').find('span');
for (var i = 0; i < create.length; i++) {
if (szd.indexOf($($(create)[i]).text()) != -1) {
_GM_action('gml', 'join', parseInt($($(create)[i]).parent('div').parent('li').attr('id').replace(/\D+/g, "")), event);
break;
}
}
if ($('#pp_fin').length) { _DLG('exit', 2); }
}, 1000);

})();