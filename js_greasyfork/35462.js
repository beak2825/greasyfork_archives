// ==UserScript==
// @name           rpgmaker.ru chat addon
// @name:ru        Дополнения для чата rpgmaker.ru
// @description    Extend rpgmaker.ru chat
// @description:ru расширение функционала чата rpgmaker.ru
// @version        0.12
// @namespace      mur.greasy.fork.chat
// @license        BSD
// @include        http://rpgmaker.ru/
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/35462/rpgmakerru%20chat%20addon.user.js
// @updateURL https://update.greasyfork.org/scripts/35462/rpgmakerru%20chat%20addon.meta.js
// ==/UserScript==

document.addEventListener ("readystatechange", FireWhenReady, true);

function FireWhenReady () {
	this.fired  = this.fired || false;

	if (document.readyState != "uninitialized" && document.readyState != "loading" && !this.fired) {
		this.fired = true;

		document.body.onload  = function () {
			fixChat();
		};
	}
}

function fixChat() {
	console.log ("fixer started!");
	var oldMsg = document.getElementById("chatbarText");
	var msg = document.createElement("textarea");
	msg.name="chatbarText"
	msg.addEventListener("keypress", submitForm);
	msg.style.width = "350px";
	msg.style.height = "100px";
	insertAfter(msg, oldMsg);
	oldMsg.parentNode.removeChild(oldMsg);
}

function insertAfter(newNode, referenceNode) {
	referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function submitForm(e) {
	if (e.keyCode === 13 && !e.ctrlKey) {
		document.getElementById("submitchat").click();
		e.preventDefault();
		return false;
	}
}
