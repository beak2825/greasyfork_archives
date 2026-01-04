// ==UserScript==
// @name         Wykop - pokaż odpowiedzi wyłącznie autora wpisu
// @namespace    https://github.com/lopezloo
// @version      1.0
// @description  Dodaje przycisk "pokaż tylko komentarze autora" we wpisach na mikroblogu
// @author       lopezloo
// @license      GPL-3.0
// @match        https://www.wykop.pl/wpis/*
// @match        https://www.wykop.pl/mikroblog/*
// @match        https://www.wykop.pl/tag/*
// @match        https://www.wykop.pl/ludzie/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438768/Wykop%20-%20poka%C5%BC%20odpowiedzi%20wy%C5%82%C4%85cznie%20autora%20wpisu.user.js
// @updateURL https://update.greasyfork.org/scripts/438768/Wykop%20-%20poka%C5%BC%20odpowiedzi%20wy%C5%82%C4%85cznie%20autora%20wpisu.meta.js
// ==/UserScript==

$(document).ready(function() {
	let link = '<a href="#" class="affect hide"><i class="fa fa-chain"></i> ';
	$('.entry.iC').each(function(elem) {
		let $commentBlock = $(this);
		let $ul = $commentBlock.find('.wblock.lcontrast.dC[data-type="entry"] .responsive-menu');
		let $actionButton = $('<li>' + link + 'pokaż tylko komentarze autora</a></li>').appendTo($ul);
		let authorOnly = false;

		$actionButton.click(function(e) {
			$commentBlock.find('.wblock.lcontrast.dC:not(.authorComment)[data-type="entrycomment"]').each(function(elem) {
				if(authorOnly) {
					$(this).show();
				}
				else {
					$(this).hide();
				}
			});

			authorOnly = !authorOnly;
			if(authorOnly) {
				$actionButton.html(link + 'pokaż wszystkie komentarze</a>');
			} else {
				$actionButton.html(link + 'pokaż tylko komentarze autora</a>');
			}
			e.preventDefault();
		});
	});
});
