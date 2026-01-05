// ==UserScript==
// @name        No reShouts 2
// @description elimina reshout´s (perfil y mi) para usarlo con el de likes
// @include     *://*.taringa.net*
// @version     2.2
// @namespace   none
// @downloadURL https://update.greasyfork.org/scripts/18200/No%20reShouts%202.user.js
// @updateURL https://update.greasyfork.org/scripts/18200/No%20reShouts%202.meta.js
// ==/UserScript==

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
	}else if(document.getElementById('shouts')){ // perfil - mi
		window.shoutsParent = document.getElementById('shouts');
	}else{ // perfil - actividad
		window.shoutsParent = document.getElementById('last-activity-container');
	}
	window.styleReshout = document.getElementById('styleReshout');

	//Reconoce los reshouts
	window.addReshoutClass = function () {
		for (var i = 0; i < shoutsParent.children.length; i++) {
			if (shoutsParent.children[i].querySelector('.alter')) {
				shoutsParent.children[i].classList.add('reshout');
                $("div").remove(".reshout");
			}
		}
	};
	addReshoutClass();
	var observer = new MutationObserver(function(mutations) { addReshoutClass();});
	observer.observe(shoutsParent, {childList: true});
    $("div").remove(".reshout");
}
