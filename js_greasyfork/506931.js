// ==UserScript==
// @name Таро+испы+таблы с умными испами!
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Таро+испы+таблы с умными испами
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506931/%D0%A2%D0%B0%D1%80%D0%BE%2B%D0%B8%D1%81%D0%BF%D1%8B%2B%D1%82%D0%B0%D0%B1%D0%BB%D1%8B%20%D1%81%20%D1%83%D0%BC%D0%BD%D1%8B%D0%BC%D0%B8%20%D0%B8%D1%81%D0%BF%D0%B0%D0%BC%D0%B8%21.user.js
// @updateURL https://update.greasyfork.org/scripts/506931/%D0%A2%D0%B0%D1%80%D0%BE%2B%D0%B8%D1%81%D0%BF%D1%8B%2B%D1%82%D0%B0%D0%B1%D0%BB%D1%8B%20%D1%81%20%D1%83%D0%BC%D0%BD%D1%8B%D0%BC%D0%B8%20%D0%B8%D1%81%D0%BF%D0%B0%D0%BC%D0%B8%21.meta.js
// ==/UserScript==
 
function __useTaro() {
const { act, el156, kvt, freeze } = pla_data,
isTaroExist = window.gxt_156
if (!gam_id || act || kvt || freeze || el156 >= (my_tals[26] ? 3 : 2) || !isTaroExist) return setTimeout(__useTaro, 1000)
const closestId = __getClosestIdWithoutRole()
if (!closestId) return setTimeout(__useTaro, 1000)
_GM_action('', 'ext_use', [156, closestId], event)
setTimeout(__useTaro, 1000)
}
 
function __getClosestIdWithoutRole() {
const ids = [...upl_list.querySelectorAll('.dead.not-displayed')].map(e =>
(+e.closest('li').id.substring(4) === my_id || !e.parentNode.title)
&& +e.closest('li').id.substring(4)
).filter(e => e),
myIndex = ids.indexOf(my_id)
return (ids[myIndex + 1] || ids[0])
}
 
var mir = ['Гражданин', 'Комиссар', 'Сержант', 'Доктор', 'Медработник', 'Вор', 'Стерва', 'Свидетель', 'Добрый Зайка', 'Нефритовый Зайка', 'Гадалка'];
 
setInterval(function() {
if (gam_state == 'play' && (!($('#pp_fin').length || pla_data['dead']))) {
 
if ((!($("#gxt_155").is(".disabled")))) {
let i = 0;
while (i < 3) { let player = document.querySelector('.playersList').querySelectorAll('li')[0];
let player_id = player.id.split('_')[1];
_GM_action('', 'ext_use', [155, player_id], event);
i++
}
}
if ((!($("#gxt_170").is(".disabled")))) {
let i = 0;
while (i < 3) { _GM_action('', 'ext_act', '170', event);
i++
}
}
if ((!($("#gxt_156").is(".disabled")))) {
let i = 0;
while (i < 3) { __useTaro()
i++
}
}
if (mir.includes(document.getElementsByClassName("ico my")[0].title) && (!($("#gxt_159").is(".disabled")))) {
_GM_action('', 'ext_act', '159', event);
}
} else if (($('#pp_fin').length || pla_data['dead'])) {
_DLG('exit', 2);
}
 
}, 500);