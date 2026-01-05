// ==UserScript==
// @name        Rapi para Ika
// @description Script que cliquea automáticamente el primer botón de abordar de la Fortaleza Pirata de Ika.
// @namespace   jam
// @include     *-*ikariam.gameforge.com*
// @version     1.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/24661/Rapi%20para%20Ika.user.js
// @updateURL https://update.greasyfork.org/scripts/24661/Rapi%20para%20Ika.meta.js
// ==/UserScript==
var brio = function() {
	var button = $('#pirateFortress_c .table01').find('.action .button.capture').eq(0);
	if (button.length) {
		button.trigger('click');
	} else if ($('.captchaImage').length > 0) {
        var audio = new Audio('https://drive.google.com/uc?id=0BzQ4KX6fuv2MRnllRU5kdUFwYzA&authuser=0&export=download');
        audio.play();
    }
};
var interval = setInterval(brio, 5000);