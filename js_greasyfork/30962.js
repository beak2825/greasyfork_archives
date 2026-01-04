// ==UserScript==
// @name         inmac thumbs fixer
// @version      0.6
// @description  Fix broken thumbnails
// @author       Nightforge & DevMan
// @include      https://inmac.org/*
// @grant        none
// @require      https://code.jquery.com/jquery-2.1.1.min.js
// @namespace    https://greasyfork.org/users/7303
// @downloadURL https://update.greasyfork.org/scripts/30962/inmac%20thumbs%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/30962/inmac%20thumbs%20fixer.meta.js
// ==/UserScript==

(function() {
	var $ = jQuery.noConflict();

	$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '//cdn.rawgit.com/gilbitron/Nivo-Lightbox/master/nivo-lightbox.css') );
	$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href', '//cdn.rawgit.com/gilbitron/Nivo-Lightbox/master/themes/default/default.css') );

	$.getScript("//cdn.rawgit.com/gilbitron/Nivo-Lightbox/master/nivo-lightbox.js").done(function() {
        $.each($('tbody[id^="post_"]'), function(i, el) {
            var thumbs = $('a.nivoLightbox', el);
            if(thumbs.length === 0) {
                return;
            }
            else if(thumbs.length > 1) {
                thumbs.attr('data-lightbox-gallery', 'g' + i);
            }
            else {
                thumbs.removeAttr('data-lightbox-gallery');
            }
        });

        $('a[class="nivoLightbox"]').nivoLightbox({
            effect: 'fadeScale',
            theme: 'default',
            keyboardNav: true,
            clickOverlayToClose: true
        });
	}).fail(function() {
		console.error("nivo-lightbox downloading fail");
	});
})();