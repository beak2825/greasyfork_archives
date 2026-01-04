// ==UserScript==
// @name         LNK_checkArts
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  ГВД HWM - проверка изменения кол-ва надетых артов
// @author       LNK
// @include      *heroeswm.ru/war.php*
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/427896/LNK_checkArts.user.js
// @updateURL https://update.greasyfork.org/scripts/427896/LNK_checkArts.meta.js
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

function getPage(aURL) {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', aURL, false);
	xhr.overrideMimeType('text/html; charset=windows-1251');
	xhr.send();
	if (xhr.status != 200) {
		return ( 'Ошибка ' + xhr.status + ': ' + xhr.statusText );
	} else {
		return ( xhr.responseText );
	}
} // getPage


    var resWin, resText;
    var artsNum;
    var s = unsafeWindow.run_all.toString();
    var n = s.indexOf('player');
    s = s.substr(n+7);
    var plId = s.substring(0,s.indexOf('|'))
    
    function getArtsNum() {
        var pText = getPage('pl_info.php?id=' + plId);
        var artsCount = 11;
        var slotN = 1;
        for (var i = 1; i < 12; i++) {
            var index = pText.indexOf('slot' + i + 'f');
            if (index != -1) {
                artsCount--;
            }
        }
        return artsCount;
    } //getArtsNum

	function checkArts() {
		resWin = document.getElementById("finalresult_text");
		resText = resWin.innerHTML;
        if (resText.length > 10) {
            clearInterval(timerId);
            var count = getArtsNum(); //alert(count+' '+artsNum+' '+(artsNum-count));
            if (count < artsNum) {
                //		beep(500);
                // setTimeout(() => notifyMes('Arts Check: арт сломан!'), 700);
                notifyMes('Arts Check: арт сломан!');
                alert('Уменьшилось количество надетых предметов!!!  - '+(artsNum-count));
            }
        }
	} //checkArts

    artsNum = getArtsNum();
	var artsNumMark = document.createElement('div');
	artsNumMark.innerHTML = '<b> &nbsp;'+artsNum+' артов&nbsp; </b>';
	artsNumMark.style = 'background-color: #A6DFF0; box-shadow: 0 0 3px rgba(0,0,0,1);'+
						'position: fixed; top: 2%; left: 7%; z-index: 9555; text-align: center;';
	document.body.appendChild(artsNumMark);

	var timerId = setInterval(checkArts, 2000);
})();