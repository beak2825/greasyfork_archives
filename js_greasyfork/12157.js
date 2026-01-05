// ==UserScript==
// @name           Fake Spectator
// @version        1.00
// @namespace      localhost
// @author         EnterBrain
// @description    Plugin for best experience Shadow Government.
// @icon           http://firepic.org/images/2015-08/31/ktizhlzyzxz4.png
// @icon64         http://firepic.org/images/2015-08/31/8gwmu0w58oy5.png
// @match          http://*.e-sim.org/battle.html?id=*
// @grant          all
// @require        http://code.jquery.com/jquery.js
// @downloadURL https://update.greasyfork.org/scripts/12157/Fake%20Spectator.user.js
// @updateURL https://update.greasyfork.org/scripts/12157/Fake%20Spectator.meta.js
// ==/UserScript==

var FakeUserIDSpecialStart = 1;			// Айди фейкового пользователя(С какого начинается перебор).
var FakeUserIDSpecialEnd = 20;		// Айди фейкового пользователя(Которым оканчивается перебор).
var FakeCitizenshipIDSpecial = 2;	// Айди гражданства фейкового пользователя.
var timerSpectatorSpecial = 10000;		// Кд отправки запросов данных 1 секунда = 1000 миллисекунд.

function sendUpdateRequestSpectatorFake(UserID,CitizenshipID) {
	if (!hasFocus)
		return;
	var dataString = 'id=' + $("#battleRoundId").val() + "&at="+UserID+"&ci="+CitizenshipID+"&premium=1";
	
	$.ajax({  
		type: "GET",
		url: "battleScore.html",
		data: dataString,
		dataType: "json"
	});
}

function FakeSpectators(){
	for (var i = FakeUserIDSpecialStart; i <= FakeUserIDSpecialEnd; i++) {
	  setTimeout(sendUpdateRequestSpectatorFake, i*(timerSpectatorSpecial/(FakeUserIDSpecialEnd-FakeUserIDSpecialStart+1)), i, FakeCitizenshipIDSpecial);
	}
}

window.setInterval(FakeSpectators, timerSpectatorSpecial);