/**INSTRUCTIONS: Please make sure you have Chrome/Firefox with tampermonkey/greasemonkey installed, and this added to the list of scripts.
 * Press ~ to add spam. separate each spam with a new line **/

// ==UserScript==
// @name       Cards Against Humanity Chat Spam
// @namespace  http://legitspam.edu/
// @version    0.5
// @description  Spamming your dongers
// @match      https://pyx-2.pretendyoure.xyz/zy/game.jsp
// @require http://code.jquery.com/jquery-latest.js
// @author Streak324
// @grant GM_getValue
// @grant GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/22733/Cards%20Against%20Humanity%20Chat%20Spam.user.js
// @updateURL https://update.greasyfork.org/scripts/22733/Cards%20Against%20Humanity%20Chat%20Spam.meta.js
// ==/UserScript==

var spamIndex = GM_getValue('spamIndex', 0);
var lobbyChatBox = "input.chat";
var lobbyChatButton = "input.chat_submit";
var logoutButton = "logout";
var logTimer;
var logDelay = 90000;//in milliseconds
var spamTimer;
var spamDelay = 6000;//6000 ms is the advised minimum. You will get errors from the server if you go below that.
var loggedIn = false;
var optionsWindow;

//ADD YOUR SPAM HERE.
var spam = JSON.parse(GM_getValue('spam', JSON.stringify([
		"WANT TO BE COOL LIKE ME? DOWNLOAD CARD AGAINST HUMANITY SPAMBOT https://greasyfork.org/en/scripts/22733-cards-against-humanity-chat-spam",
		" ENJOY ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°) ( ͡° ͜ʖ ͡°)"
	])));

$(document).ready(function() {
	$(document).keypress(function(e) {
		if(e.keyCode == 96) {
			loadOptionWindow();
		}
	});
	logTimer = Date.now() + logDelay;
	spamTimer = Date.now() + spamDelay;
	window.setInterval(runRoutine, 1000);
});

function runRoutine() {
	if(!loggedIn) {
		$("#nickname").val(genString());
		$("#nicknameconfirm").trigger('click');
		loggedIn = true;
	} else {
		if(Date.now() > spamTimer ) {
			$(lobbyChatBox).val(spam[spamIndex]);
			$(lobbyChatButton).trigger('click');
			spamIndex = (spamIndex + 1) % spam.length;
			spamTimer = Date.now() + spamDelay;
		}
		if(Date.now() > logTimer) {
			$(logoutButton).trigger('click');
			loggedIn = false;
			GM_setValue('spam', JSON.stringify(spam));
			GM_setValue('spamIndex', spamIndex);
			logTimer = Date.now() + logDelay;
			location.reload();
		}
	}
}

function genString() {
	var size = getRandInt(12, 24);
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var string = "";
	for(i=0; i < size; i++) {
		var c = getRandInt(0, possible.length);
		string += possible.charAt(c);
	}
	return string;
}

function getRandInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max-min)) + min;
}

function loadOptionWindow() {
	optionsWindow = window.open('', 'options');

	optionsWindow.document.write("<textarea id='input-spam' rows='12' cols='200'></textarea>");
	for(i=0; i < spam.length; i++) {
		optionsWindow.document.getElementById('input-spam').value += spam[i]+'\n';
	}

	$(optionsWindow.document).ready(function() {
		$(optionsWindow).unload(saveOptions);
	});
}

function saveOptions() {
	var lines = optionsWindow.document.getElementById('input-spam').value.split('\n');
	spam = [];
	for(var i = 0;i < lines.length;i++){
		if(lines[i] != '')
			spam.push(lines[i]);
	}
	GM_setValue('spam', JSON.stringify(spam));
}
