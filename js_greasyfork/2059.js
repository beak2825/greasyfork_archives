// ==UserScript==
// @name        Wykopowy AdBlock
// @description Skrypt blokujący reklamy na Wykopie
// @author      Przemok
// @include     http://www.wykop.pl*
// @match       http://www.wykop.pl/*
// @namespace   https://greasyfork.org/users/2269
// @version     1.7
// @icon        https://i.imgur.com/H8Paerh.png
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2059/Wykopowy%20AdBlock.user.js
// @updateURL https://update.greasyfork.org/scripts/2059/Wykopowy%20AdBlock.meta.js
// ==/UserScript==
$(function () { // Jeśli DOM się załadował
    $('body.screening').removeClass('screening'); // Poszerzenie strony zwężonej przez reklamę
    $('#site > a.screening').remove(); // Reklama w tle
    $('.wrapper > .grid-full .rbl-block > div[id^="adoceangg"]').parent().remove(); // Reklama pod paskiem nawigacyjnym
    var market = $('#dyingLinksBox .diggbox > a[href^="http://www.wykop.pl/paylink/"]').closest('li.dying-links'); // Wykop market
    market.next().css('display', 'list-item'); // Przejście do pierwszego elementu z wykopowego urwiska
    market.remove(); // Usunięcie wykop marketu
    $('#autopromotion').remove(); // Autopromocja
    $('.close[href*="close/cookies"]').closest('.annotation.type-alert.type-permanent').remove(); // Komunikat o ciasteczkach
    $('#itemsStream > .link img[src^="http://www.wykop.pl/paylink"]').closest('#itemsStream > .link').remove(); // Wykop sponsorowany
    $('a[href$="wykop.pl/reklama/"]').closest('#itemsStream .link.iC').remove(); // Wykop poleca
    $('#itemsStream > .payentry').remove(); // Wpis sponsorowany
    $('#itemsStream.touch-content > .iC > .paylink').parent().remove(); // Miejsce po wykopie sponsorowanym w widoku kafelkowym
    $('ul.related .logoallegro').closest('li.lcontrast').remove(); // Reklamy Allegro z powiązanych
    if ($('ul.related').children().length === 0) { // Brak powiązanych
        $('#relatedList').remove(); // Usunięcie pustego miejsca po powiązancyh
    }
    $('.grid-right > .rbl-block').has('[id^="adocean"]').remove(); // Reklama z prawej
    $('#fixedBox').has('[id^="adocean"]').remove(); // Reklama z prawej u dołu
    $('.baner-mobile').closest('.closelinkcontainer').remove(); // Reklama aplikacji mobilnej
    $('.grid-main .rbl-block').has('[id^="adocean"]').remove(); // Banner na dole
    $('.grid-full #itemsStream.touch-content + .rbl-block').has('[id^="adocean"]').remove(); // Banner na dole w wersji kafelkowej
    $('.article .socialbar').remove(); // Przyciski Facebooka i Twittera
    if (document.cookie.indexOf('close_cookies') < 0) { // Brak ciasteczka o zamykaniu komunikatu o ciasteczkach
        document.cookie = 'close_cookies=1'; // Ciasteczko zamykające komunikat o ciasteczkach
    }
    $('a[href*="/?utm_source="]').each(function () { // Linki ze śledzącymi parametrami w adresie
        var href = $(this).attr('href'); // Adres analizowanego linka
        $(this).attr('href', href.substring(0, href.indexOf('?utm_source='))); // Usunięcie śledzących parametrów
    });
    $('a[href*="/?fEr[0]="], form[action*="/?fEr[0]="]').each(function () { // Linki ze śledzącymi parametrami w adresie
        var attribute = ($(this).attr('href') === 'undefined' ? 'action' : 'href'); // Określenie parametru będącego przedmiotem działań
        var attributeValue = $(this).attr(attribute); // Wartość parametru będącego przedmiotem działań
        $(this).attr(attribute, attributeValue.substring(0, attributeValue.indexOf('?fEr[0]='))); // Usunięcie śledzących parametrów
    });
});