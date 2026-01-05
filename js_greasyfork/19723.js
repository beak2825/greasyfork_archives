// ==UserScript==
// @name          Pseudo Restauré
// @description   Affiche les pseudos "supprimés"
// @namespace     Pseudo Restauré
// @include       http://www.jeuxvideo.com/forums/1-*
// @include       http://www.jeuxvideo.com/forums/42-*
// @include       http://www.forumjv.com/forums/1-*
// @include       http://www.forumjv.com/forums/42-*
// @version       1.1.1
// @require       https://code.jquery.com/jquery-2.2.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/19723/Pseudo%20Restaur%C3%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/19723/Pseudo%20Restaur%C3%A9.meta.js
// ==/UserScript==

// Pour chaque message supprimé
$.each($('div.bloc-pseudo-msg'), function(i) {
	var id_message = $('div.bloc-pseudo-msg').eq(i).parents('.bloc-message-forum').data('id');
	// Requête vers le lien permanent
	$.get('http://'+location.hostname+'/pseudo/forums/message/'+id_message)
    .then(function(html) {
        // Récupération du pseudo dans la balise <title>
        var pseudo = $(html).filter('title').html().split(' ')[0];
        // Affichage
        $('div.bloc-pseudo-msg').eq(i).html(pseudo).attr('style', 'color: #FF00FF');
    });
});