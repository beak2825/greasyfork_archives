// ==UserScript==
// @name        No reShouts
// @namespace   Clasificado
// @description Oculta reshouts automaticamente en el mi! Taringa
// @author	    None
// @include     *://*.taringa.net/mi
// @version     1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11948/No%20reShouts.user.js
// @updateURL https://update.greasyfork.org/scripts/11948/No%20reShouts.meta.js
// ==/UserScript==
$("head").append("<style>.reshout {display:none;}</style>");

if (document.getElementsByClassName('activity-element')[0] && !document.getElementsByClassName('shout-individual')[0]) {
	//Agregar estilo
	var style = document.createElement('style');
	document.head.appendChild(style);

	//Agrega estilo individual
	ids = ['styleReshout'];
	for (var i = 0; i < ids.length; i++) {
		var style = document.createElement('style');
		style.id = ids[i];
		document.head.appendChild(style);
	}
	//variables y elementos
	window.ocPos = 0;
	window.ocPosDif = 0;
	window.timeout = null;
	if (document.getElementById('Feed-list')) { // mi
		window.shoutsParent = document.getElementById('Feed-list');
	}
	
	window.styleReshout = document.getElementById('styleReshout');

	//Reconoce los reshouts
	window.addReshoutClass = function () {
		for (var i = 0; i < shoutsParent.children.length; i++) {
			if (shoutsParent.children[i].querySelector('.alter')) {
				shoutsParent.children[i].classList.add('reshout');
			}
		}
	}
	addReshoutClass();
	var observer = new MutationObserver(function(mutations) { addReshoutClass();});
	observer.observe(shoutsParent, {childList: true});

}