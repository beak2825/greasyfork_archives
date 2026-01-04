// ==UserScript==
// @name         Bot | Voxed
// @namespace    voxed.bot
// @version      1.0
// @description  Poné lo que querés comentar y cada cuantos segundos lo querés comentar.
// @author       Hhaz
// @match        http*://www.voxed.net/*
// @downloadURL https://update.greasyfork.org/scripts/36189/Bot%20%7C%20Voxed.user.js
// @updateURL https://update.greasyfork.org/scripts/36189/Bot%20%7C%20Voxed.meta.js
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

		//if (text < 1 && seconds < 1) {  ### TEXTO Y SEGUNDOS ###

		if (text < 1) {
			alert("No ingresaste ningún texto.");
			return false;

		}else{
			var seconds = prompt("Segundos:");
			setInterval(function() {
				var elements = document.getElementsByClassName("show-for-small-only");
				elements = Array.prototype.slice.call(elements);
				if(!elements.length);
				elements.forEach(function(btn) {
					$('#content').val(text); //randomAnswer si quiero con Arrays
					//$('#content').val('Hola, soy hermoso.');
					btn.click();
				});
			}, seconds+'000'); }
	});

});