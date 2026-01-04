// ==UserScript==
// @name        Joyreactor Delmor_S' Script
// @grant       none
// @include     *reactor.cc*
// @include     *joyreactor.cc*
// @include     *reactor.com*
// @include     *jr-proxy.com*
// @run-at      document-idle
// @description Script automatically replaces all the Joyreactor posts' .jpeg images with their .jpg versions.
// @version     1.1.1
// @require	http://cdnjs.cloudflare.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @namespace https://greasyfork.org/users/4638
// @downloadURL https://update.greasyfork.org/scripts/390790/Joyreactor%20Delmor_S%27%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/390790/Joyreactor%20Delmor_S%27%20Script.meta.js
// ==/UserScript==

setTimeout(function() {
    var tempHTML = $('body').html();

    if (tempHTML.includes('Лучше выключите этот глючный userscript.') || tempHTML.includes('Если у вас установлен блокировщик рекламы')) {
        //alert('Пробую перезагрузить страницу...');
        location.reload();
    }

    $('div[class*="image"] img').each(function() {
        var tempSrc = $(this).attr('src');
        tempSrc = tempSrc.replace(/\.jpeg/g, '.jpg?' + new Date().getTime());
        tempSrc = tempSrc.replace(/\.png/g, '.png?' + new Date().getTime()); 
        $(this).attr('src', tempSrc);
    });

    $('div[class*="image"] img').on({
        'error': function() {
            var tempSrc = $(this).attr('src');
            tempSrc = tempSrc.replace(/\.jpeg/g, '.jpg?' + new Date().getTime());
            tempSrc = tempSrc.replace(/\.png/g, '.png?' + new Date().getTime()); 
            $(this).attr('src', tempSrc);
         }
    });

    $('div[class*="uhead_nick"] img').on({
        'error': function() {
            var tempSrc = $(this).attr('src');
            $(this).attr('src', "");
            $(this).attr('src', tempSrc);
         }
    });

}, 1000);