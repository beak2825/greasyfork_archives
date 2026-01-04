// ==UserScript==
// @name         Estoque Now Fixed
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Melhora a criação de tags no Estoque Now
// @author       Dounford
// @match        *.estoquenow.com.br/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480420/Estoque%20Now%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/480420/Estoque%20Now%20Fixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

	$(document).ready(function() {
		$('#modal-itemtag .btn-success').on('click', function() {
			document.getElementById('select-tag-selectized').value = document.getElementsByName('name')[3].value;
			console.log(document.getElementsByName('name')[3].value)
			document.getElementById('select-tag-selectized').click()
			setTimeout(function() {$('.selectize-dropdown [data-value]:first').click();}, 500);
		});
	});

    window.alert = function() {
		console.log.apply(console, arguments);
		return true;
	};

	window.cloneItem = function(id) {
		window.location.href = RootApp.url+"/inventory/form/?clonedby="+id;
	}
})();