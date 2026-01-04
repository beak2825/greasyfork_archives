// ==UserScript==
// @name Таро под себя new
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Таро
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/506937/%D0%A2%D0%B0%D1%80%D0%BE%20%D0%BF%D0%BE%D0%B4%20%D1%81%D0%B5%D0%B1%D1%8F%20new.user.js
// @updateURL https://update.greasyfork.org/scripts/506937/%D0%A2%D0%B0%D1%80%D0%BE%20%D0%BF%D0%BE%D0%B4%20%D1%81%D0%B5%D0%B1%D1%8F%20new.meta.js
// ==/UserScript==

function isPlay() {

return gam_state == "fin" || gam_state == "play";

}

var already_use;

var extra = '156';

setInterval(() => {

if(!isPlay()){

return;

}

if ($('#gxt_' + extra) && ($('#gxt_' + extra).prop('class') == 'extra disabled' || $('#gxt_' + extra).find('.count').text() == '')) {

return;

}

$('#upl_list').children().each((index, elem) => {

let player_type = $(elem).find('.hint').text();

if (player_type == 'покойник' || player_type == 'за решеткой') {

return;

}

const id = $(elem).attr('id').substr(4);

if (id == my_id) {

console.debug('моё место', index);

let target_i = index + 1;

let failed = 0;

while (true) {

if (target_i > $('#upl_list').children().length - 1) {

target_i = 0;

if (failed++ > 1) {

break;

}

}

target_elem = $('#upl_list').children().eq(target_i);

let isOpen = $(target_elem).find('.ico').attr('title');

const target_id = $(target_elem).attr('id').substr(4);

console.debug('подо мной', target_id);

if (!isOpen) {

console.debug('Юзаю таро на', target_id);

useExtra(target_id, '156');

break;

} else {

console.debug('роль уже открыта');

}

target_i++;

}

}

});

}, 250);

function useExtra(uid, extra) {

_GM_action('', 'ext_use', [+extra, uid]);

}