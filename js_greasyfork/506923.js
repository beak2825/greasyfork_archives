// ==UserScript==
// @name Таро+испы+таблы
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Таро + испы + таблы
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506923/%D0%A2%D0%B0%D1%80%D0%BE%2B%D0%B8%D1%81%D0%BF%D1%8B%2B%D1%82%D0%B0%D0%B1%D0%BB%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/506923/%D0%A2%D0%B0%D1%80%D0%BE%2B%D0%B8%D1%81%D0%BF%D1%8B%2B%D1%82%D0%B0%D0%B1%D0%BB%D1%8B.meta.js
// ==/UserScript==
 
 
const extras = [156, 155, 170];
 
function rndm(max_random) {
return Math.floor(Math.random() * max_random);
}
 
setInterval(() => {
if(gam_state !== 'play'){
return;
}
let bad_count = 0;
for (let extra of extras) {
if (!useExtraOn(extra)) {
bad_count++;
}
}
if (bad_count == extras.length) {
console.debug('заюзал все экстры, ливаю');
}
}, 100);
 
function checkExtra(extra) {
return !$('#gxt_' + extra).length || $('#gxt_' + extra).text() === '' || $('#gxt_' + extra).prop('class') == 'extra disabled';
}
 
try {
if (window.location.href.includes('odnoklassniki')) {
ajax_url = '/odnoklassniki/' + PAGE_goto.toString().match(/[abcdef0-9]{32}/g)[0] + '/DO/';
} else if (window.location.href.includes('moymir')) {
ajax_url = '/moymir/' + PAGE_goto.toString().match(/[abcdef0-9]{32}/g)[0] + '/DO/';
} else {
ajax_url = window.location.pathname + 'DO/';
}
} catch (e) {
ajax_url = window.location.pathname + 'DO/';
}
 
function useExtraOn(extra, id, need_talent, need_close_title) {
if (gam_state !== 'play') {
return;
}
if(checkExtra(extra)){
return false;
}
if (extra != '208' && id && $('#upl_' + id).find('.dead').attr('label') != 0) {
console.debug('Игрок мертв');
return false;
}
let mas = [];
let _id = parseInt(extra);
if (gam_state == 'play' && ((!pla_data['dead'] && __store[_id].action != 'dead') || (pla_data['dead'] && (__store[_id].action == 'dead' || __store[_id].action == 'reanim'))) && (!pla_data['kvt'] || __store[_id].action == 'reanim') && pla_data['freeze'] != 1 && pla_data['freeze'] != 4 && pla_data['freeze'] != 6 && pla_data['freeze'] != 9 && !pla_data['e' + _id] && (!pla_data['shackles'] || _id == 206) &&
__store[_id].action &&
(
__store[_id].action == 'dead' ||
__store[_id].action == 'all' ||
__store[_id].action == 'reanim' ||
__store[_id].action == 'spk' ||
__store[_id].action == 'rnd' ||
__store[_id].action == 'dice' ||
__store[_id].action == 'near' ||
(__store[_id].action == 'day_all' && gam_data['v_mode']) ||
(__store[_id].action == 'vtb' && gam_data['v_mode']) ||
(__store[_id].action == 'night' && !gam_data['v_mode']) ||
(__store[_id].action == 'night_all' && !gam_data['v_mode']) ||
(__store[_id].action == 'day' && gam_data['v_mode']) ||
(__store[_id].action == 'vte' && gam_data['v_mode'] && pla_data['act'] > 0)
) &&
(!__store[_id].limit || !pla_data['el' + _id] || pla_data['el' + _id] < (__store[_id].limit + (typeof my_tals[26] != 'undefined' && parseInt(my_tals[26]) && (_id < 301 || _id > 308) ? 1 : 0) + (typeof my_tals[51] != 'undefined' && parseInt(my_tals[51]) && __rank84_xlimit(_id) ? 1 : 0)))
) {
_WARN('extras');
if (__store[_id].action == 'dice') {
_GM_action('', 'dice');
} else if (__store[_id].action == 'vte') {
_GM_action('', 'ext_use', [_id, pla_data['act']]);
return true;
} else if (__store[_id].action == 'rnd' || __store[_id].action == 'day_all' || __store[_id].action == 'night_all') {
_GM_action('', 'ext_use', [_id, 0]);
return true;
} else {
if (__store[_id].action == 'near') {
var _cpl = getClosestPlayers();
}
$('#upl_list > li').each(function () {
let _ii = $(this).attr('id').substr(4);
let _de = parseInt($(this).find('.dead').attr('label'));
if ((_ii != my_id || _id == 223 || __store[_id].action == 'spk' || __store[_id].action == 'reanim') && ((!_de && __store[_id].action != 'reanim') || (_de > 1 && __store[_id].action == 'reanim'))) {
if (__store[_id].action == 'spk' && $(this).find('.noSpeak').hasClass('not-displayed')) {
return true;
} else if (__store[_id].action == 'vtb' && $(this).find('.hint').html() != '') {
return true;
} else if (__store[_id].action == 'reanim' && $(this).find('.actionButton').attr('label') != 'reanim') {
return true;
} else if (__store[_id].action == 'near' && _ii != _cpl[0] && _ii != _cpl[1]) {
return true;
}
let _oo =
$(this).find('.nick');
if ($(_oo).length) {
mas.push(_ii);
}
}
});
}
} else if (!$('#myExtras').hasClass('disabled') || __store[_id].action == 'dead' || __store[_id].action == 'reanim') {
var _err = 0;
if (gam_state != 'play') {
_err = 1;
} else if
(pla_data['dead'] && __store[_id].action != 'dead') {
_err = 2;
} else if (pla_data['freeze'] == 1 ||
pla_data['freeze']
== 4 || pla_data['freeze'] == 6 || pla_data['freeze'] == 9) {
_err = 9;
} else if (__store[_id].limit && pla_data['el' + _id] >= (__store[_id].limit + (typeof my_tals[26] != 'undefined' && parseInt(my_tals[26]) && (_id < 301 || _id > 308) ? 1 : 0) + (typeof my_tals[51] != 'undefined' && parseInt(my_tals[51]) && __rank84_xlimit(_id) ? 1 : 0))) {
_err = 4;
} else if (pla_data['e' + _id]) {
_err = 3;
} else if (!__store[_id].action) {
_err = 5;
} else if (__store[_id].action == 'night' && gam_data['v_mode']) {
_err = 6;
} else if (__store[_id].action == 'night_all' && gam_data['v_mode']) {
_err = 6;
} else if (__store[_id].action == 'day' && !gam_data['v_mode']) {
_err = 7;
} else if (__store[_id].action == 'day_all' && !gam_data['v_mode']) {
_err = 7;
} else if (__store[_id].action == 'vte' && (!gam_data['v_mode'] || pla_data['act'] <= 0)) {
_err = 8;
} else if (__store[_id].action == 'vtb' && !gam_data['v_mode']) {
_err = 10;
} else if (__store[_id].action == 'dead' && !pla_data['dead']) {
_err = 11;
} else if (pla_data['shackles']) {
_err = 12;
}
}
if (id) {
mas = [id];
}
if (!_err && mas.length) {
if (extra == 156 && need_close_title) {
mas = mas.filter(id => {
return !$(`#upl_${id}`).find('.ico').attr('title');
});
 
}
if (!mas.length) {
return false;
}
console.debug('use', extra);
$.ajax({
async: false,
cache: false,
type: 'POST',
url: ajax_url + Math.random(),
data: {
method: 'ext_use',
id: extra,
se: 1,
uid: mas[rndm(mas.length)]
},
dataType: 'json',
success: function (data) {
console.debug(data);
if (typeof data.rpx != 'undefined') {
RPX_data_arr.push(data.rpx);
if (!RPX_event_done) {
RPX_event_done = true;
RPX_event();
}
}
if (typeof data.ret == 'undefined') {
//console.debug('return data.ret undefined', data.ret);
return false;
}
if (__store[_id] && __store[_id].type == 'extra' && typeof __store[_id]['let'] != 'undefined' && parseInt(data.ret)) {
pla_data['e' + _id] = data.ret;
}
if (__store[_id] && __store[_id].type == 'extra' && __store[_id].limit) {
if (!pla_data['el' + _id]) {
pla_data['el' + _id] = 1;
} else {
pla_data['el' + _id]++;
}
}
 
}
});
return true;
}
return false;
}
