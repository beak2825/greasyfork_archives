// ==UserScript==
// @name         LNK_clanEvent
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  проверка клановых игроков в парном ивенте
// @author       LNK
// @include      *heroeswm.ru/tj_event2.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/417053/LNK_clanEvent.user.js
// @updateURL https://update.greasyfork.org/scripts/417053/LNK_clanEvent.meta.js
// ==/UserScript==

(function() {
    'use strict';

function notifyMes(title,mes) {
	if (!("Notification" in window)) {alert("Ваш браузер не поддерживает сообщения на рабочий стол!"); return false;}
	if (title == undefined) {title = "Some message from HWM!";}
	if (Notification.permission === "granted") {var notification = new Notification(title, {body : mes});}
	else {
		Notification.requestPermission(function (permission) {
			if (permission === "granted") {var notification = new Notification(title, {body : mes});}
		});
	}
} // notifyMes

function beep(duration, frequency, delay, gain) {
	var context = new (window.AudioContext || window.webkitAudioContext)();
	var gainNode = context.createGain();
	if (gain == undefined) {gain = 0.05;}
	gainNode.connect(context.destination);
	gainNode.gain.value = gain;
	var osc = context.createOscillator();
	osc.connect(gainNode);
	osc.type = 'square';
	if (frequency == undefined) {frequency = 350;}
	osc.frequency.value = frequency;
	if (delay == undefined) {delay = 50;}
	if (duration == undefined) {duration = 200;}
	setTimeout(function() {	osc.start(); setTimeout(function () { osc.stop(); }, duration);	}, delay);
	return osc;
} // beep

	var page = document.body.innerHTML;

	function checkMail() {
		page = document.body.innerHTML;
		var n = page.indexOf('Вступить к клану');
		if (n < 0) return false;
		beep(500);
		setTimeout(() => notifyMes('Event clan vacancy'), 1000);
	} //checkMail
//	setInterval(function() { page = document.body.innerHTML; alert(page.indexOf('Входящие'));}, 3000);
	setInterval(checkMail, 30000);
})();