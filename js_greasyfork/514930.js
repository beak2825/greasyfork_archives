// ==UserScript==
// @name Ака за МАФОВ
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Ака за МАФОВ 1.0
// @author JIanceLoT
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT


// @downloadURL https://update.greasyfork.org/scripts/514930/%D0%90%D0%BA%D0%B0%20%D0%B7%D0%B0%20%D0%9C%D0%90%D0%A4%D0%9E%D0%92.user.js
// @updateURL https://update.greasyfork.org/scripts/514930/%D0%90%D0%BA%D0%B0%20%D0%B7%D0%B0%20%D0%9C%D0%90%D0%A4%D0%9E%D0%92.meta.js
// ==/UserScript==


var citizens = ['Босс мафии', 'Двуликий', 'Мафиози'];

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
_DLG('exit', 2);
} else {

var my_role = document.getElementsByClassName("ico my")[0].title;
if (citizens.includes(my_role) && (!($("#gxt_159").is(".disabled"))) && $('#gxt_159').find('.count').text()) {
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