// ==UserScript==
// @name         Bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Comentarios
// @author       Hhaz
// @match        http*://www.voxed.net/*
// @downloadURL https://update.greasyfork.org/scripts/36176/Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/36176/Bot.meta.js
// ==/UserScript==

$('html').prepend('<style>#bot {cursor: pointer;font-size: 0.85em;}</style>');

$('.comments-box .anon').prepend('<button id="bot" class="button">Bot</button>');

$(document).ready(function(){
	$("#bot").click(function(){
		/*var answers = [
			"Hey",
			"Howdy",
			"Hello There",
			"Wotcha",
			"Alright gov'nor"
		];

		var randomAnswer = answers[Math.floor(Math.random() * answers.length)];*/


		var text = prompt("El texto que querés comentar:");
		var time = prompt("Segundos:");
		setInterval(function() {
			var elements = document.getElementsByClassName("show-for-small-only");
			elements = Array.prototype.slice.call(elements);
			if(!elements.length);
			elements.forEach(function(btn) {
				$('#content').val(text); //randomAnswer si quiero con Arrays
				//$('#content').val('Hola, soy hermoso.');
				btn.click();
			});
		}, time+'000');
	});
});