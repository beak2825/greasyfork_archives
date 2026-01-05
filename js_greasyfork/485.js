// ==UserScript==
// @id             pikabuWatchLater
// @name           pikabu: Watch Later
// @version        1.1
// @namespace      https://greasyfork.org/users/23
// @author         jitb@pikabu
// @description    Позволяет складывать загружающиеся гифки в сторону, чтобы потом не возвращаться к ним
// @include        http://pikabu.ru/*
// @run-at         document-end
// @downloadURL https://update.greasyfork.org/scripts/485/pikabu%3A%20Watch%20Later.user.js
// @updateURL https://update.greasyfork.org/scripts/485/pikabu%3A%20Watch%20Later.meta.js
// ==/UserScript==

$ = unsafeWindow.$;

queue = $('<div style="position: fixed; right:0; bottom:0; max-height: 100%; overflow: auto; z-index:101;"></div>');
$('body').append(queue);

function createLinks() {
	$('.main .watchlater').remove();
	$('.main .gifPrev, .main .gifPrev img[src$="gif"]').after("<a class='watchlater' href='javascript:void(0)'>>><br/></a>");
	$('.main .watchlater').click(function(){
		queue.append($(this).parent());
		queue.animate({"scrollTop":999999},1000);
		$(this).text('X').css({'color': 'red',
								'font-weight': 'bold',
								'position': 'absolute',
								'right': 0,
								'z-index': 102
		}).click(function(){
			$(this).parent().remove();
		});
	});
}

$(document).ajaxComplete(createLinks);

$('.sv_img.showpic').click(function() {
	setTimeout(createLinks,1000);
});
createLinks();