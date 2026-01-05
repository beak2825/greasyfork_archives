// ==UserScript==
// @name         Cytatonaprawiacz
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Chciałbym być marynarzem, chciałbym pamiętać komentarze
// @author       DziadekAlzheimer
// @match        *://www.wykop.pl/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27051/Cytatonaprawiacz.user.js
// @updateURL https://update.greasyfork.org/scripts/27051/Cytatonaprawiacz.meta.js
// ==/UserScript==
(function() {

	function cytatonaprawiacz(parent) {
	    parent.find('.sub .text .showProfileSummary').each(function() {
	    	if ($(this).next().hasClass('cytatonaprawiacz')) {
	    		return true;
	    	}

	        var lastCommentButton = $('<i style="margin: 0 4px 0 4px;" class="cytatonaprawiacz fa fa-quote-right" />');
	        lastCommentButton.on('mouseover', function() {
	            var thread = $(this).closest('.sub');

	            var thisCommentIndex = thread.children().index($(this).closest('li'));

	            var userName = $(this).prev().text().trim();

	            var quotedCommentIndex = -1;
	            thread.find('.author a.showProfileSummary').each(function() {
	                if ($(this).text().trim() == userName) {
	                    if (quotedCommentIndex > thisCommentIndex) {
	                        return false;
	                    }

	                    var liIndex = thread.children().index(this.closest('li'));

	                    if (liIndex < thisCommentIndex) {
	                        quotedCommentIndex = liIndex;
	                    }
	                }
	            });

	            var quotedMessage;
	            if (quotedCommentIndex >= 0) {
	                quotedMessage = thread.children().eq(quotedCommentIndex).find('.text');
	            } else { // OP
	                quotedMessage = thread.siblings('.wblock').find('.text');
	            }

	            var message = quotedMessage.clone();
	            message.find('.votersContainer, .cytatonaprawiacz, .showSpoiler .show-more').remove();

	            $(this).qtip({
	                show: {
	                    ready: true,
	                    when: false
	                },
	                content: {
	                    text: $('<div class="summary" style="min-height: 50px; width: 100%" />').append(message.html())
	                },
	                style: {
	                    background: "#0000",
	                    border: 0,
	                    padding: 0
	                },
	                hide: {
	                    when: 'mouseout',
	                    fixed: 'true'
	                },
	                position: {
	                    my: 'bottom left',
	                    at: 'top left'
	                }
	            });

	        });
	        lastCommentButton.insertAfter(this);
	    });
	}


	cytatonaprawiacz($(".grid-main"));

	$("a.affect.ajax").on('click', function() {
		var entry = $(this).closest('.entry');
		setTimeout(function() {
			cytatonaprawiacz(entry);
		}, 1000);
		setTimeout(function() {
			cytatonaprawiacz(entry);
		}, 3000);
	});

})();