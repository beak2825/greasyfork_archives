// ==UserScript==
// @name AntiSpoiler Vakarm
// @version      1.1.2
// @description AntiSpoiler pour Vakarm
// @match *://*.vakarm.net/*
// @namespace http://vakarm.net/
// @downloadURL https://update.greasyfork.org/scripts/37647/AntiSpoiler%20Vakarm.user.js
// @updateURL https://update.greasyfork.org/scripts/37647/AntiSpoiler%20Vakarm.meta.js
// ==/UserScript==

    var antiSpoil = JSON.parse(localStorage.getItem("antiSpoil"));
    if (antiSpoil === null) {
        localStorage.setItem("antiSpoil", false);
        antiSpoil = false;
    }

    $('.content_row_left .mainbox').first().find('table .center').append('<span class="antiSpoil" style=" background: '+((antiSpoil) ? '#2ecc71' : '#e74c3c')+'; padding: 1px 5px; border-radius: 3px; float: right; cursor: pointer; font-size: 11px; "><i class="fa fa-eye'+((antiSpoil) ? '-slash' : '')+'" aria-hidden="true"></i> Anti-Spoiler</span>');
    $('.score').each(function() {
        if ($(this).find('span').length) {
            $(this).css({ height: (antiSpoil) ? '1px' : 'auto', overflow: (antiSpoil) ? 'hidden' : 'visible'});
        }
    });
    $('.antiSpoil').click(function() {
        antiSpoil = !antiSpoil;
        localStorage.setItem("antiSpoil", JSON.stringify(antiSpoil));
        $(this).find('i').toggleClass('fa-eye-slash', antiSpoil).toggleClass('fa-eye', !antiSpoil);
        $('.score').each(function() {
			if ($(this).find('span').length) {
				$(this).css({ height: (antiSpoil) ? '1px' : 'auto', overflow: (antiSpoil) ? 'hidden' : 'visible'});
            }
		});
        $(this).css('background-color', antiSpoil ? '#2ecc71' : '#e74c3c');
    });
	$('.scoreboard_matchs').mouseenter(function() { $(this).find('.score').css({ height: 'auto' }); }).mouseleave(function() { if (antiSpoil) { $(this).find('.score').css({ height: '1px' }); } });