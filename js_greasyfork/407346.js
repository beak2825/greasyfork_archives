// ==UserScript==
// @name         Duolingo - add keyboard support to kana/kanji exercises
// @namespace    https://github.com/ciekawylogin/
// @version      0.3.1
// @description  This script adds keyboard control to kana/kanji exercises, as requested here: https://www.reddit.com/r/duolingo/comments/7v9veq/duolingo_please_do_this_part_keyboard_compatible/
// @author       Michał Artur Krawczak (ciekawylogin@github), good5209@github
// @match        https://www.duolingo.com/*
// @require      https://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/407346/Duolingo%20-%20add%20keyboard%20support%20to%20kanakanji%20exercises.user.js
// @updateURL https://update.greasyfork.org/scripts/407346/Duolingo%20-%20add%20keyboard%20support%20to%20kanakanji%20exercises.meta.js
// ==/UserScript==

var numberStyle = 'position: absolute; top: 1px; right: 1px; font-size: 10pt; color: gray; padding: 1px 3px; border: 1px solid #ccc; ';
var numberStyleBold = numberStyle + 'font-weight: bold; ';
var buttonStyle = 'position:relative; ';
var keys = '1234567890qwertyuiopasdfghjklzxcvbnm[]';

function getButtons() {
	var name = '_1HcF0';
	try {
		var button = $("button[data-test='challenge-tap-token']");
		var classes = button.className.split(' ');
		if (classes.length > 0) {
			name = classes[0];
		}
	} catch (e) {}
	return document.getElementsByClassName(name);
}

function addNumbers() {
	var buttons = Array.from(getButtons());
	for(var i in buttons) {
		var button = buttons[i];
		var key = keys[i];
		
		var para = document.createElement("p");
		var node = document.createTextNode(key);
		para.className = "mk-keycode";
		para.appendChild(node);
		para.style.cssText = (i % 5 === 0) ? numberStyleBold : numberStyle; // mark some hints bold
		button.style.cssText = buttonStyle;
		button.appendChild(para);
	}
}

function addNumbersIfNotPresent() {
	var buttonsWithoutCodes = Array.from(getButtons());
	var buttonsWithCodes = Array.from(document.getElementsByClassName("mk-keycode"));
	if(buttonsWithoutCodes.length > 0 && buttonsWithCodes.length === 0) {
		addNumbers();
	}
}

function addEvent(element, eventName, callback) {
	if (element.addEventListener) {
		element.addEventListener(eventName, callback, false);
	} else if (element.attachEvent) {
		element.attachEvent("on" + eventName, callback);
	} else {
		element["on" + eventName] = callback;
	}
}

addEvent(document, "keydown", function (e) {
	var key = e.key;
	var idx = keys.indexOf(key.toLowerCase());
	if (idx >= 0) { // select word button
		var word_bank = $("div[data-test='word-bank']"); // check kana/kanji exercises
		var buttons = (word_bank.length > 0) ? $("button", word_bank) : Array.from(getButtons());
		if (idx < buttons.length) {
			buttons[idx].click();
		}
	} else { // other key
		if (key === "Backspace") { // delete last word
			var answer_bank = $('._1Cx0i');
			var buttons = $("button", answer_bank);
			if (buttons.length > 0) {
				buttons[buttons.length - 1].click();
			}
		}
	}
});

setInterval(addNumbersIfNotPresent, 250);
console.debug('Load duolingo shortcut script');
