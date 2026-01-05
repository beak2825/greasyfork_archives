// ==UserScript==
// @name        CDT
// @namespace   CDT
// @include     https://instant-hack.io/threads/*
// @include     https://instant-hack.io/conversations/*
// @version     1.0
// @description Script CDT pour Instant-Hack.io
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21009/CDT.user.js
// @updateURL https://update.greasyfork.org/scripts/21009/CDT.meta.js
// ==/UserScript==
// Kiru

$(document).ready(function(){
    var d = new Date();
    var heure = d.getHours();

    $('#QuickReply').find('.submitUnit').children('input').eq(1).after('<input class="button primary" id="cdtjs" value="Cordialement" accesskey="c" type="button">');
    var rl = '<br/>\n';

    var signature = "";
    if (heure >= 0 && heure < 5) {
        signature = 'Bonne fin de nuit,' + rl + '<i>{username}</i>';
    }
    else if (heure >= 5 && heure < 12) {
        signature = 'Bonne journée,' + rl + '<i>{username}</i>';
    }
    else if (heure >= 12 && heure < 15) {
        signature = 'Bonne après-midi,' + rl + '<i>{username}</i>';
    }
    else if (heure >= 15 && heure < 18) {
        signature = 'Bonne fin d\'après-midi,' + rl + '<i>{username}</i>';
    }
    else if (heure >= 18 && heure < 21) {
        signature = 'Bonne soirée,' + rl + '<i>{username}</i>';
    }
    else if (heure >= 21 && heure < 24) {
        signature = 'Bonne fin de soirée,' + rl + '<i>{username}</i>';
    }
    else {
        signature = 'A bientôt !' + rl + '<i>{username}</i>';
    }

    $('#cdtjs').on('click', function(){
        var actual_txt = $('iframe.redactor_textCtrl').contents().find('body').html();
        var username = $('.accountUsername').text();
        $('iframe.redactor_textCtrl').contents().find('body').html(actual_txt + rl + signature.replace('{username}', username));
        $('iframe.redactor_textCtrl').contents().find('body').select();
        $('iframe.redactor_textCtrl').contents().find('body').focus();
    });
});
