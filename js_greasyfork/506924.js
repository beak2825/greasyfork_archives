// ==UserScript==
// @name Чит на киллы с суиками (НЕ ДЛЯ КЛАНОК)
// @namespace https://www.bestmafia.com/
// @version 1.0
// @description Чит на киллы с суиками
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506924/%D0%A7%D0%B8%D1%82%20%D0%BD%D0%B0%20%D0%BA%D0%B8%D0%BB%D0%BB%D1%8B%20%D1%81%20%D1%81%D1%83%D0%B8%D0%BA%D0%B0%D0%BC%D0%B8%20%28%D0%9D%D0%95%20%D0%94%D0%9B%D0%AF%20%D0%9A%D0%9B%D0%90%D0%9D%D0%9E%D0%9A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/506924/%D0%A7%D0%B8%D1%82%20%D0%BD%D0%B0%20%D0%BA%D0%B8%D0%BB%D0%BB%D1%8B%20%D1%81%20%D1%81%D1%83%D0%B8%D0%BA%D0%B0%D0%BC%D0%B8%20%28%D0%9D%D0%95%20%D0%94%D0%9B%D0%AF%20%D0%9A%D0%9B%D0%90%D0%9D%D0%9E%D0%9A%29.meta.js
// ==/UserScript==
 
 
var player = [8],
bet = 20,
noobsKill = [],
topsKill = [],
kf = 0,
d = 1;
setInterval(function () {
if (!gam_state) {
$.post(window.location.pathname + "DO/", {
method: "uc_lst"
}, function (data) {
try {
data.gml.forEach(function (item, i) {
var z = item[3] - item[9].length;
if ((player.indexOf(parseInt(item[3])) + 1) && item[5] == bet && z && z < 3 && item[4] < 4) {
$.post(window.location.pathname + "DO/", {
method: "gam_join",
id: item[0]
}, function (data) {
if (typeof data.arr != 'undefined') {
_GM_action("", "do", "create", data.arr);
d = $('#gxt_162').length ? 1 : 2;
}
}, 'json');
}
})
} catch (e) {}
}, 'json');
}
$($('.footerButtons').find('button')[0]).click();
}, 500);
$('#popup_container').bind("DOMNodeInserted", function (e) {
(e.target.id == 'auctionPopup') ? _GM_action('', 'sale_bet', d): 1;
});
$('#gameBody').bind("DOMNodeInserted", function (e) {
if ((ifc_mode == 'game') && (!kf)) {
kf = 1;
_DLG('exit', 2);
$('#upl_' + my_id).remove();
$("#upl_list li").each(function (m, item) {
$.post(window.location.pathname + "DO/", {
method: "talents",
id: item.id.replace(/\D+/g, "")
}, function (data) {
(data.ret[2][25] == undefined || data.ret[2][47] == undefined) ? noobsKill.push(item.id.replace(/\D+/g, "")): topsKill.push(item.id.replace(/\D+/g, ""));
}, 'json');
});
} else if (ifc_mode == 'game') {
noobsKill.forEach(function (item, i) {
($('#upl_' + item + ' .dead.not-displayed')) ? 1: noobsKill.splice(i, 1);
!$('#upl_' + item + ' .ico').prop('title') ? 1 : noobsKill.splice(i, 1);
});
topsKill.forEach(function (item, i) {
($('#upl_' + item + ' .dead.not-displayed')) ? 1: topsKill.splice(i, 1);
!$('#upl_' + item + ' .ico').prop('title') ? 1 : topsKill.splice(i, 1);
});
var kid = (noobsKill.length) ? noobsKill[Math.floor(Math.random() * noobsKill.length)] : topsKill[Math.floor(Math.random() * topsKill.length)];
($("#gxt_115").length && !$("#gxt_115").is(".disabled")) ? _GM_action('', 'ext_use', [115, kid]): _DLG('exit', 2);
} else if (ifc_mode != 'game') noobsKill.length = topsKill.length = kf = 0;
});
 
function buyExtra(id) {
if (!$('#gxt_' + id).find('.count').text() || parseInt($('#gxt_' + id).find('.count').text() ) < 3 ) {
_WND_proc('extras', 'buy', {
id: id
});
}
}
setInterval(()=>{
buyExtra(115);
}, 100);