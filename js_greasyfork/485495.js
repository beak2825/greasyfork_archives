// ==UserScript==
// @name         Eventernote 参加率表示
// @namespace    https://www.eventernote.com/
// @version      0.0.2
// @description  Eventernote のユーザーランキングにイベント参加率を表示させる
// @author       4y4m3
// @match        https://www.eventernote.com/actors/*
// @exclude      https://www.eventernote.com/actors/*/events
// @exclude      https://www.eventernote.com/actors/*/users
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485495/Eventernote%20%E5%8F%82%E5%8A%A0%E7%8E%87%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/485495/Eventernote%20%E5%8F%82%E5%8A%A0%E7%8E%87%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
	var e = document.querySelector("p.t2.right > a").text.match(/\((\d+)件\)/)[1];
	var v = document.querySelectorAll('.gb_users_list')[0].getElementsByTagName('li');
	for (var i = 0; i < v.length; i++) {
		var n = ((v[i].innerText.match(/(\d+)回/)[1]) / e * 100).toFixed(1)
		v[i].innerHTML = '(' + n + '%) ' + v[i].innerHTML
	}
})();