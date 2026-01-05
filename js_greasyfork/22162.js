// ==UserScript==
// @author Chocomage     
// @name Vidéos illimitées sur OpenClassrooms
// @description Supprime et remet les vidéos sur OpenClassrooms pour ne pas utiliser son quota de 5 vidéos par semaine et affiche un lien pour ouvrir la vidéo dans un nouvel onglet.
// @include http://openclassrooms.com/*
// @include https://openclassrooms.com/*
// @version 0.0.1.20160810135642
// @namespace https://greasyfork.org/users/59385
// @downloadURL https://update.greasyfork.org/scripts/22162/Vid%C3%A9os%20illimit%C3%A9es%20sur%20OpenClassrooms.user.js
// @updateURL https://update.greasyfork.org/scripts/22162/Vid%C3%A9os%20illimit%C3%A9es%20sur%20OpenClassrooms.meta.js
// ==/UserScript==
if($('iframe#video_Player_0')) {
	videoLink = $('iframe#video_Player_0').prop('src');
	$('<div><i class="icon-info videoDownload__icon videoDownload__icon--rounded"></i> <a href=' + videoLink + '" target="_blank">Ouvrir la vidéo dans un nouvel onglet</a></div>')
		.insertAfter($('iframe#video_Player_0'));
	$('<iframe src="' + videoLink + '" frameborder="0" class="video js-claire-video" data-src-origine="https://vimeo.com/159934145" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" style="height: 362.712px;"></iframe>')
		.insertAfter($('iframe#video_Player_0'));
	$('iframe#video_Player_0').remove();
}
