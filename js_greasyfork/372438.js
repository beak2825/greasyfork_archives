// ==UserScript==
// @name         10FastFingers - Typing Bot
// @namespace    https://goldie.site
// @version      1.0
// @description  Best 10FastFingers bot
// @author       @Golie#1337
// @match        https://10fastfingers.com/typing-test/*
// @match        https://10fastfingers.com/advanced-typing-test/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372438/10FastFingers%20-%20Typing%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/372438/10FastFingers%20-%20Typing%20Bot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var WORD_LENGTH = 5;

	var speedContainer = document.querySelector('#speedtest-main > div:nth-child(7) > div.col-md-6.col-sm-4.hidden-xs');

	var speedElem = document.createElement('span');
	speedElem.style = "font-size: 26px; font-weight: bold;";

	speedContainer.insertAdjacentElement('beforeEnd',speedElem);

	var correctChars = 0;

	document.addEventListener('keyup',function(e) {
		if (e.keyCode === 32) {
			var lastWord, stream = user_input_stream;
			lastWord = stream.slice(stream.lastIndexOf(' ',stream.length-2)+1,-1);
			if (words[word_pointer-1] === lastWord) {
				correctChars += words[word_pointer-1].length + 1;
			}
		}
	});

	setInterval(function() {
		if (countdown === 60) correctChars = 0;
		var avgSpeed = countdown !== 60 ? correctChars*60/(60-countdown)/WORD_LENGTH : 0;
		if (avgSpeed < 0) avgSpeed = 0;
		speedElem.innerHTML = avgSpeed.toFixed(1)+" WPM ";
	},1000);

    $( "#inputfield" ).keyup(function() { $("#inputfield").val( $(".highlight").text() )});
})();