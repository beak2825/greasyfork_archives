// ==UserScript==
// @name            Rai Play Radio - Audio download
// @name:it         Rai Play Radio - Download file audio
// @namespace       https://andrealazzarotto.com/
// @version         1.1.2
// @description     Enable audio downloads on all Rai Play Radio contents
// @description:it  Abilita il download su tutti i contenuti di Rai Play Radio
// @author          Andrea Lazzarotto
// @match           https://www.raiplayradio.it/*
// @match           https://www.rai.it/*
// @match           http://www.rai.it/*
// @require         https://cdnjs.cloudflare.com/ajax/libs/cash/8.1.0/cash.min.js
// @grant           none
// @license         GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @downloadURL https://update.greasyfork.org/scripts/392266/Rai%20Play%20Radio%20-%20Audio%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/392266/Rai%20Play%20Radio%20-%20Audio%20download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('[data-mediapolis]').attr('data-download', true);
    $('.ico.options').attr({
        'aria-label': 'Opzioni',
    }).each(function() {
        var element = $(this);
        var audioUrl = element.parent().data('mediapolis');
        if (!audioUrl) {
            return;
        }
        var link = $(`<li><a href="${audioUrl}" target="_blank" download>Scarica audio</a></li>`).css({
            'clip': 'rect(1px, 1px, 1px, 1px)',
            'clip-path': 'inset(50%)',
            'height': '1px',
            'width': '1px',
            'overflow': 'hidden',
            'position': 'absolute',
            'padding': 0,
        });
        element.parent().after(link);
    });

    if (window['audioUrl']) {
        let audioUrl = window['audioUrl'];
        $('.Player').after(`<p id="audio-url"><a href="${audioUrl}" target="_blank" download>Scarica audio</a></p>`);
        $('#audio-url a').css({
            'display': 'inline-block',
            'margin': '1rem 0',
            'font-size': '1rem',
            'color': 'white',
            'text-decoration': 'underline'
        });
    }
})();