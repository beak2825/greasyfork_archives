// ==UserScript==
// @name        Suppression des messages JVC
// @namespace   RandomAcc
// @description Supprime vos messages JVC
// @include     *jeuxvideo.com/sso/settings.php
// @version     0.1
// @grant       none
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/434419/Suppression%20des%20messages%20JVC.user.js
// @updateURL https://update.greasyfork.org/scripts/434419/Suppression%20des%20messages%20JVC.meta.js
// ==/UserScript==

(function() {
'use strict';

addGlobalStyle(".hide {display: none!important}")
const $ = window.jQuery;
const username = document.getElementsByClassName("account-pseudo")[0].textContent.toLowerCase(),
      item = $('<li><a href="#">Supprimer mes messages</a> <img id="spinner" class="hide" src="https://i.imgur.com/gmhK0rl.gif" alt="Suppression en cours"><span class="hide" id="suppress">Suppression en cours. Messages à supprimer(ils seront supprimés à la fin) : <span class="removecount">0</span> - Messsage parcourus : <span class="totalcount">0</span></span></li>');

item.find('a').click(function(e) {
	e.preventDefault();

	window.modal('afficher', {
		titre: 'Filtres de suppression',
		contenu: `<form>
		            <div class="form-group">
		              Supprimer les messages <strong>contenant</strong> au moins un des mots : <input type="text" id="contains"> (séparés par des virgules)
		            </div>
		            <div class="form-group">
		              Supprimer les messages <strong>ne contenant aucun</strong> des mots : <input type="text" id="not-contains"> (séparés par des virgules)
		            </div>
		            <hr>
		            <div class="pull-right">
		              <button type="button" class="btn btn-default" data-modal="fermer">Annuler</button>
		              <button id="filter-validate" type="button" class="btn btn-danger" data-modal="fermer">Confirmer la suppression de mes messages</button>
		            </div>
		          </form>`
	});


	$('#filter-validate').click(function(e) {
		$('#spinner').removeClass('hide');
        $(".totalcount").text('0')
        $('#suppress').removeClass('hide');
        $(".removecount").text('0')
		const toDelete = [];
		const ares = function(nextPage) {
			$.get(nextPage, function(data) {
				const page = $(data),
				      messages = page.find('.bloc-message-forum').not('.msg-supprime').not('.msg-supprime-gta').get(),
				      toDeleteTmp = messages.filter(filterContains)
				                            .filter(filterNotContains)
				                            .map(elt => parseInt(elt.getAttribute('data-id')));
                $(".totalcount").text(parseInt(window.jQuery(".totalcount").text()) + messages.length)
				Array.prototype.push.apply(toDelete, toDeleteTmp);
                $(".removecount").text(toDelete.length)
				// niké vo mer lé relecteur jss 1 fou
				nextPage = (function() {
					const nextPageButtons = page.find('.pagi-suivant-actif');
					return nextPageButtons.length > 0 && jvCake(nextPageButtons.get(0).className);
				})();

				if (nextPage !== false) {
					ares(nextPage);
				}
				else {
					if (toDelete.length > 0) {
						$.ajax({
							type: 'POST',
							url: '/forums/modal_del_message.php',
							data: {
								type: 'delete',
								tab_message: toDelete,
								ajax_timestamp: page.find('#ajax_timestamp_moderation_forum').val(),
								ajax_hash: page.find('#ajax_hash_moderation_forum').val()
							},
							dataType: 'json',
							success: function() {
								$('#spinner').addClass('hide');
                                $('#suppress').addClass('hide');
							}
						});
					}
					else {
						$('#spinner').addClass('hide');
                        $('#suppress').addClass('hide');
					}
				}
			});
		};

		ares(`//www.jeuxvideo.com/profil/${username}?mode=historique_forum`);
	});
});

$('.liste-profil-general').append(item);


// Fonctions utilitaires

// Merci à l'auteur de TopicLive
// http://www.jeuxvideo.com/forums/42-1000021-37766371-1-0-1-0-script-topiclive-compatible-respawn.htm
function jvCake(className) {
	const base16 = '0A12B34C56D78E9F',
	      s = className.split(' ')[1];

	let lien = '';
	for (let i = 0; i < s.length; i += 2) {
		lien += String.fromCharCode(base16.indexOf(s.charAt(i)) * 16 + base16.indexOf(s.charAt(i + 1)));
	}

	return lien;
}

// Filtres de suppression
function filterContains(elt) {
	const text = "",
	contains = $('#contains').val().trim();
    let g = elt.getElementsByClassName("txt-msg  text-enrichi-forum ")[0].getElementsByTagName("p")[elt.getElementsByClassName("txt-msg  text-enrichi-forum ")[0].getElementsByTagName("p").length - 1].textContent
    return filterContainsAux(g, contains);
}

function filterNotContains(elt) {
	const text = "",
	      notContains = $('#not-contains').val().trim();
    let g = elt.getElementsByClassName("txt-msg  text-enrichi-forum ")[0].getElementsByTagName("p")[elt.getElementsByClassName("txt-msg  text-enrichi-forum ")[0].getElementsByTagName("p").length - 1].textContent
	return filterContainsAux(g, notContains, true);
}

function filterContainsAux(haystack, needles, reverse=false) {
	needles = needles.split(',').filter(needle => needle.trim());
	if (!needles.length) {
		return true;
	}

	for (let needle of needles) {
		if (haystack.indexOf(needle) !== -1) {
			return !reverse;
		}
	}

	return reverse;
}

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

})();
