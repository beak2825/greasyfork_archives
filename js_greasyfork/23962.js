// ==UserScript==
// @name         Speach Recognition for lingvist.io
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  add Speach Recognition to lingvist.io!
// @author       alexchetv (alexchetv@gmail.com)
// @match        https://learn.lingvist.io/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/23962/Speach%20Recognition%20for%20lingvistio.user.js
// @updateURL https://update.greasyfork.org/scripts/23962/Speach%20Recognition%20for%20lingvistio.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var target = document;
	var head  = document.getElementsByTagName('head')[0];
	var link  = document.createElement('link');
	var answerInput;
	var evt;
	link.rel  = 'stylesheet';
	link.type = 'text/css';
	link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.6.3/css/font-awesome.min.css';
	head.appendChild(link);
	var micActive = false;
	var micButton = document.createElement("Button");
	micButton.style.background = 'transparent';
	micButton.title = 'Turn on microphone (Ctrl + M)';
	micButton.innerHTML = '<i style="font-size:24px" class="fa">&#xf130;</i>';
	micButton.addEventListener("click", function(){
		toggleMic();
	});
	// create an cardObserver instance
	var cardObserver = new MutationObserver(function(mutations) {
		mutations.forEach(function(mutation) {
			if (mutation.target.className =='app-content'){
				mutation.addedNodes.forEach(function(node) {
					if (node.className == 'cards') {
						speech.abort();
						speech.lang = 'en-US';
						if (app.model.GuessModel.question.language == 'fr') {
							speech.lang = 'fr-FR';
						}
						var cardHeader = document.getElementsByClassName('main-card')[0].getElementsByClassName('header')[0];
						answerInput = document.getElementsByClassName('main-card')[0].getElementsByClassName('answer-input')[0];
						if (!answerInput.disabled) {
							cardHeader.style.cssText  = 'justify-content: space-between;flex-direction: row-reverse;';
							cardHeader.insertBefore(micButton, cardHeader.firstChild);
							answerInput.addEventListener("keydown", function(e){
								if (e.ctrlKey && e.keyCode == 'M'.charCodeAt(0)) {
									toggleMic();
									return false;
								}
							});
						}
						console.log (window.app);

					}
				});
			}
		});
	});

	// pass in the target node, as well as the observer options
	cardObserver.observe(target, {childList: true, subtree: true});

	var SpeechRecognition = window.mozSpeechRecognition ||
		window.msSpeechRecognition ||
		window.oSpeechRecognition ||
		window.webkitSpeechRecognition ||
		window.SpeechRecognition;
	var speech = new SpeechRecognition();
	speech.continuous = false;
	speech.interimResults = false;

	speech.maxAlternatives = 5;
	speech.onresult = function(event) {
		var variants = Array.from(event.results[0]).map(function(result) {
			return result.transcript.toLowerCase();
		});
		var word = variants[0];
		var answer = app.model.GuessModel.question.word;
		for (var i = 1; i < variants.length; i++) {
			if (answer == variants[i]) {
				word = answer;
			}
		}
		answerInput.value = word;
		if (word == answer) {
			evt = new KeyboardEvent("keypress", {"bubbles":true, "cancelable" : true, "key": "Enter", "code":"Enter", "keyIdentifier":"Enter"});
			Object.defineProperty(evt, 'keyCode', {
				value: 13
			});
			Object.defineProperty(evt, 'which', {
				value: 13
			});
			setTimeout(function(){
				answerInput.dispatchEvent(evt);
			},200);
		} else {
			answerInput.style.color = 'red';
			setTimeout(function(){
				answerInput.value = '';
				answerInput.style.color = '';
			},1000);
		}

	};
	speech.onend = function(event) {
		micActive = false;
		micButton.style.color = '#1a3754';
		micButton.title = 'Turn on microphone (Ctrl + M)';
	};

	function startSpeechRecognition() {
		beep();
		answerInput.value = '';
		speech.start();
		micButton.style.color = 'red';
		micButton.title = 'Turn off microphone (Ctrl + M)';
	}

	function abortSpeechRecognition() {
		speech.abort();
		answerInput.value = '';
	}

	function toggleMic() {
		micActive = !micActive;
		answerInput.focus();
		if (micActive) {
			startSpeechRecognition();
		} else {
			abortSpeechRecognition();
		}
	}

	function beep() {
		var snd = new  Audio("data:audio/mpeg;base64,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mZqWimpBEyLhQWky1LR+xEdCzm7OLA4aIJoOtSRgZJW7JkuU0S+bqqLpuU0XSRdJnJRv+dm+yZTZM3ZM3ZN1IHq1KWqmpS761K1f9Mr///+yKRo7f33/aRW//MVLiOAwn6yybcLHIQl+naPjpVaxx5rW5VCcefj+//N0ZBwL7gVIH+w0ABOqVpWf0mgAHSaQF+jMQmBSddL25u1dVFNa9VL/V/b+ZDnRu500TRK16K2V6nVq////RHcuat//+3tX//a/9Rt//qR//////1G5qjgQAbUUBgFTqIsYEFGAOWD8IM60dSxrEix6d6g4TVHrUwTApJGxts6C2pENFqlVq3+3///mQ+mrdS2Xf//////WicPnS9///9aJ79H//+mA//OEZAELugNMzwcKBRMbXo4+oA/ghpk2chFCQrqsqjqN7zNLMcbVk5nogTxNQtF16gpQ7osAOPKsybeS+blkS12+v//54ivEdyEqgtmliAuekfE5CQkxnb///9Wk////r/+3b/Nz//6i9v////1/wZE2ABAoEAcBgU1qWKyR42RRRnQAq47mSW9SibGypnLh82SGsQFL1URH5a/q0pOv0dH////+5W9aka3b9T/9Hh3//53//X/+ub//lP//9KqA//OEZAELygNQ3z4nLRMjZn1Uy8p00xJOU5yyZ3XoYxjf2hgEctkZ/ULtaqiugkkpvWtaxUDrP+/G3ksnS8rp566af+ox5EbqeKnUsioly7zjNW///+wQiwTgp87Kt/t///X1bQ7LftX1CEm//////+KTUCAnA/D/ybRgbNFaS+h5aQLTRb69oAIdGwr4XWvZdEXv/5l03gZWmn6PwG82P/0///9QT/T//////8zDAD////////0F/9fho5P//6aI//OURAEKYbVGf2WnOxiTYnmc01SuIgWsUIO83URCkKPa/F7m5TLNqXrYQUb1PO8zD19VQN5CnyhflfbM//pf9fvUoIvjgvKlwjKjzGtoo2U9SOv///6FWHyn////////M/f84RSRFkCiCRiqE1LGdRCckYYknDC+iMS9uNm3J8sKcRyW45C2bFQnP1MYg3yiouc+pVnIUDB+uX+r2d0rRkub/fFwgfQbkQ6WQnYqcp1Djn9X//+v+gXrf///////0J//6BkNv//66oD2ycq9goqG2sG0hL9qLghKUisz0p0xWRRJ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");  
		snd.play();
	}
})();