// ==UserScript==
// @name	    Ru.Board Messanger
// @namespace	ru-board
// @description	Очистка личных сообщений от конкретного пользователя.
// @author	    ASE DAG
// @license	    BSD License (http://debian.org/misc/bsd.license)
// @version		1.0
// @grant       GM_getValue
// @grant       GM_setValue
// @include	    http://forum.ru-board.com/messanger.cgi*
// @include	    https://forum.ru-board.com/messanger.cgi*
// @downloadURL https://update.greasyfork.org/scripts/27473/RuBoard%20Messanger.user.js
// @updateURL https://update.greasyfork.org/scripts/27473/RuBoard%20Messanger.meta.js
// ==/UserScript==

var a, b;

function markBySender(sender) {
    for (var i=a; i<=messages.length-b; i++) {
	if (messages[i].childNodes[1].firstChild.innerHTML == sender) messages[i].childNodes[0].firstChild.checked = true;
    }
}

function addMarkBySenderButton() {
    messages = document.getElementsByClassName('dats');
    for (var i=a; i<=messages.length-b; i++) {
	var markBySenderButton = document.createElement('a');
	markBySenderButton.innerHTML = ' &#10004;';
	markBySenderButton.href = '#'; 
	markBySenderButton.addEventListener ('click', function() { markBySender(this.parentNode.firstChild.innerHTML); return false; }, false);
	messages[i].childNodes[1].appendChild(markBySenderButton);
    }
}              


function whereWeAre () {
    switch (document.location.search) {
	case '?action=inbox': a=2; b=2; addMarkBySenderButton(); break;
	case '?action=outbox': a=1; b=2; addMarkBySenderButton(); break;
    };
}

window.addEventListener('load', whereWeAre(), false);