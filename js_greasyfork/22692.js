// ==UserScript==
// @name        WaniKani random font
// @namespace   https://www.wanikani.com/?hey-koichi-please-implement-random-wanikani-font
// @description Randomize between Japanese fonts on WaniKani.
// @include     https://wanikani.com/*
// @include     https://www.wanikani.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22692/WaniKani%20random%20font.user.js
// @updateURL https://update.greasyfork.org/scripts/22692/WaniKani%20random%20font.meta.js
// ==/UserScript==

$(function() {
	// Modify here --------------------------------------------------------
	var fonts = [
		'A-OTF Shin Maru Go Pro M',
		'EPSON 行書体Ｍ',
		'EPSON 正楷書体Ｍ',
		'EPSON 教科書体Ｍ',
		'EPSON 太明朝体Ｂ',
		'EPSON 太行書体Ｂ',
        'EPSON 太角ゴシック体B Regular',
		'EPSON 太丸ゴシック体B Regular',
        'EPSON 丸ゴシック体Ｍ',
		'KanjiStrokeOrders',
		'Meiryo',
		'nagayama_kai',
        'Kozuka Gothic Pr6N',
        'Kozuka Gothic Pro',
        'Kozuka MIncho Pr6N',
        'Kozuka Mincho Pro',
        'MS Gothic Regular',
        'MS Mincho Regular',
        'MS PGothic Regular',
        'MS PMincho Regular',
        'MS UI Gothic Regular',
        'Yu Gothic',
        'Yu Gothic UI',
        'Yu Mincho',
	];
	var good = 'Meiryo';
	var interval = 60; // Seconds
	// No more touchie past this point ------------------------------------



	var randomFont = function() {
		var chosen = fonts[Math.floor(Math.random() * fonts.length)];
		$('[lang="ja"], #user-response').css('font-family', chosen).hover(function() {
			$(this).css('font-family', good);
		}, function() {
			$(this).css('font-family', chosen);
		});
	};
	randomFont();
	setInterval(randomFont, interval * 1000);
});