// ==UserScript==
// @name         Восстановление Стима
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  При востановлении стима делает активной ссылку на профиль!
// @author       https://lolz.guru/morty/
// @match        https://help.steampowered.com/*/wizard/HelpWithLoginInfoSelectAccount/*
// @match        https://help.steampowered.com/*/wizard/HelpWithLoginInfoReset/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=steampowered.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445542/%D0%92%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%A1%D1%82%D0%B8%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/445542/%D0%92%D0%BE%D1%81%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%B8%D0%B5%20%D0%A1%D1%82%D0%B8%D0%BC%D0%B0.meta.js
// ==/UserScript==

if(window.location.pathname.includes('HelpWithLoginInfoSelectAccount')){
    $('.account_select_row > .account_reset_column > a').each(function(){
        var id32 = parseInt($(this).attr('onclick').split(',')[1].replace(' ', ''));
        var id64 = '765' + (id32 + 61197960265728)
        $(this).parent('.account_reset_column').siblings('.account_profile_column').find('.player_name').html("<a href='https://steamcommunity.com/profiles/"+id64+"/' target='_blank'> "+$(this).parent('.account_reset_column').siblings('.account_profile_column').find('.player_name').text()+"</a>")
    });
}

if(window.location.pathname.includes('HelpWithLoginInfoReset')){
    var id32 = parseInt($('.wizard_content_wrapper > a').not('.help_header').attr('onclick').split(',')[1].replace(' ', ''));
    var id64 = '765' + (id32 + 61197960265728)
    $('.player_name').html("<a href='https://steamcommunity.com/profiles/"+id64+"/' target='_blank'> "+$('.player_name').text()+"</a>")
}