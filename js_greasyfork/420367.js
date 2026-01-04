// ==UserScript==
// @name		Ladotogro
// @author		Ladoria
// @version		0.1
// @grant       none
// @description	Dummy doll script
// @match		https://www.dreadcast.net/Main
// @require     http://code.jquery.com/jquery-latest.min.js
// @copyright	2018+, Ladoria
// @namespace InGame
// @downloadURL https://update.greasyfork.org/scripts/420367/Ladotogro.user.js
// @updateURL https://update.greasyfork.org/scripts/420367/Ladotogro.meta.js
// ==/UserScript==

id_meuble = 550054;

jQuery.noConflict();

$(document).ready( function() {
	function makeDollAppearsMap() {
		if (true === $('#meuble_' + id_meuble).hasClass('ladotogros')) return;
		
		$('#meuble_' + id_meuble).css({	'background-position' : '0px',
										'background' : 'url("https://i.ibb.co/WkDP6KD/lado-pouf-map.png")'});
		$('#meuble_' + id_meuble).addClass('ladotogro');
	}
	
	function transformDiggdingToDoll() {
		$infobox = $('#db_fouille_meuble_' + id_meuble);
		$infobox.find('.title').html('Cachette de Ladotogros');
		$infobox.find('.content .informations div:eq(0)').css({'width' : '25px',
																'background' : 'url("https://i.ibb.co/WkDP6KD/lado-pouf-map.png"',
																'background-color' : '#000'});
		$infobox.find('.content .informations div:eq(1) span:eq(0)').html('Ladotogros');
	}
	
	function transformFurnitureToDoll() {
		$('.infoBoxFixed').each( function() {
			if(true === RegExp('N°' + id_meuble, 'g').test($(this).html())) {
				$(this).css({'width' : '258px'});
				$(this).find('.titreinfo').html('Ladotogros');
				$(this).find('.typeinfo').html('Peluche XXL');
				$(this).find('p:eq(0)').html("Mieux qu'un pouf, aussi bien qu'un canapé, la Ladotogros ravira toute Kinchaka digne de ce nom.");
				$(this).find('.conteneur_image_small').css({'float' : 'none',
															'width' : '234px',
															'height' : '309px'});
				$(this).find('.conteneur_image_small div:eq(0)').css({	'width' : '230px',
																		'top' : '0px',
																		'height' : '305px',
																		'left' : '0px',
																		'background' : 'url("https://i.ibb.co/30V7wdY/lado-pouf-3.png"'});
			}
		});
	}
	
	$(document).ajaxComplete( function(a,b,c) {
		if(/(Action\/Move)/.test(c.url)) {
			makeDollAppearsMap();
		}
	});
	
	$(document).ajaxComplete( function(a,b,c) {
		if(new RegExp('DataBox\/default=Digging&id=' + id_meuble).test(c.url)) {
			transformDiggdingToDoll();
		}
	});
	
	$(document).ajaxComplete( function(a,b,c) {
		if(/(Building\/Update\/Information)/.test(c.url)) {
			if (true === new RegExp('id=meuble_' + id_meuble, 'g').test(c.data)) {
				transformFurnitureToDoll();
			}
		}
	});
	
	makeDollAppearsMap();
});
console.log('DC - Ladotogros started');