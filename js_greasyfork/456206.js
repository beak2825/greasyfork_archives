// ==UserScript==
// @name        chat-gpt-voice-recognition-userscript
// @match       https://chat.openai.com/chat
// @version     2022.12.7
// @author      Jared Jacobsen (https://github.com/JaredJacobsen)
// @license     MIT
// @description A userscript to add voice recognition to Chat GPT
// @namespace https://greasyfork.org/users/994126
// @downloadURL https://update.greasyfork.org/scripts/456206/chat-gpt-voice-recognition-userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/456206/chat-gpt-voice-recognition-userscript.meta.js
// ==/UserScript==

let textArea;
let transcript = '';
var recognition = new webkitSpeechRecognition();
recognition.continuous = false;
recognition.interimResults = true;

let recognizing = false;
recognition.onstart = function () {
	textArea.parentElement.style.borderColor = 'red';
	textArea.value = '';
	recognizing = true;
	transcript = '';
};
recognition.onresult = function (event) {
	transcript = '';
	for (var i = event.resultIndex; i < event.results.length; ++i) {
		transcript += event.results[i][0].transcript;
	}
	textArea.focus();
	textArea.value = transcript;
	let ev = new Event('input', { bubbles: true });
	textArea.dispatchEvent(ev);
};
recognition.onend = function () {
	textArea.parentElement.style.borderColor = 'lightgray';
	recognizing = false;
	transcript = '';
	textArea.parentElement.querySelector('button').click();
};
recognition.onerror = function (event) {
	console.log('error', event);
	textArea.parentElement.style.borderColor = 'lightgray';
};

document.addEventListener(
	'keydown',
	(e) => {
		if (e.code === 'Tab') {
			e.preventDefault();
			e.stopImmediatePropagation();
			textArea = document.querySelector('textarea');
			if (recognizing) {
				recognizing = false;
				recognition.stop();
			} else recognition.start();
		}
	},
	true
);
