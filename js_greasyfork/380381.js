// ==UserScript==
// @name        anti-плячкосване
// @namespace   https://greasyfork.org/en/users/10060-lisugera
// @version     0.2
// @description try to take over the world!
// @author      lisugera
// @match       https://web.telegram.org/
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/380381/anti-%D0%BF%D0%BB%D1%8F%D1%87%D0%BA%D0%BE%D1%81%D0%B2%D0%B0%D0%BD%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/380381/anti-%D0%BF%D0%BB%D1%8F%D1%87%D0%BA%D0%BE%D1%81%D0%B2%D0%B0%D0%BD%D0%B5.meta.js
// ==/UserScript==

setInterval(function () {
	check(true);
}, 120000);

function check(repeat) {
	var activeChat = document.getElementsByClassName("tg_head_peer_title")[0].textContent;
	if (activeChat == "Chat Wars") {
		fight();
	} else {
		console.log("chat wars не е активен");
		window.location.replace("https://web.telegram.org/#/im?p=@chtwrsbot");
		if (repeat) {
			check(false);
		}
	}
}

function fight() {
	var button;
	var messages = document.getElementsByClassName("im_content_message_wrap im_message_in");
	try {
		button = messages[messages.length - 1].lastElementChild.lastElementChild.lastElementChild.lastElementChild.lastElementChild.lastElementChild.lastElementChild.lastElementChild
	} catch (e) {
		console.log("няма бой");
		return;
	}
	if (button.innerText == "🧹Intervene") {
		console.log("БОЙ!!!!!!!!1111");
		button.click();
	}
}
