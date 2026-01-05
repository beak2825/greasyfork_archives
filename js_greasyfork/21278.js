// ==UserScript==
// @name        Poczytaj mi, mamo
// @namespace   www.wykop.pl
// @description Ułatwia czytanie odpowiedzi na mirko i wypoku
// @author      h__s
// @include     http://www.wykop.pl/link/*
// @include     http://www.wykop.pl/wpis/*
// @include     https://www.wykop.pl/link/*
// @include     https://www.wykop.pl/wpis/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @version     1.1.3
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/21278/Poczytaj%20mi%2C%20mamo.user.js
// @updateURL https://update.greasyfork.org/scripts/21278/Poczytaj%20mi%2C%20mamo.meta.js
// ==/UserScript==

(function () {
    var infoHover = false;
    var infoText  = '<ul>';
    var showHover = null;

    var info = $('<div></div>').css({
        position: 'fixed',
        display: 'block',
        left: 0,
        top: 0,
        'z-index': 9999,
        'background-color': 'inherit',
        border: '1px dotted grey',
        'overflow-y': 'auto'
    }).appendTo('body').hover(function (event) {
        infoHover = true;
    }, function (event) {
        infoHover = false;
        infoHide();
    });

    function infoShow(event) {
        // wypieprz psujące się tuby
        // a może wszystkie ajfrejmy?
        var noVideoText = $('.videoWrapper', infoText)
            .replaceWith('[wideo wycięte, by nie robić bajzlu]')
            .end();

        info
            .html(noVideoText)
            .css({
                top:  event.pageY - $(document).scrollTop(),
                left: event.pageX - $(document).scrollLeft() + 10,
           	'max-height': window.innerHeight - (event.pageY - $(document).scrollTop())
             })
            .show();
    }

    function infoHide() {
        info.hide();
        infoText = '<ul>';
    }
    
    function mouseOver(event) {
        var hoverElement = $(event.target);
        var hoverAuthor  = hoverElement.text();

        // troszku lamersko, ale działa
        var hoverEntryId =
            hoverElement.parent().parent().parent().parent().data('id');

        // bierz wpisy danego typa
        $('.sub li').each(function (i, element) {
            var subElement = $(element);

            var subEntryId = subElement.find('div:first').data('id');
            if (subEntryId > hoverEntryId)
                return false;

            var subAuthor =
                subElement.find('.showProfileSummary:first').text();
            if (subAuthor != hoverAuthor)
                return;

            infoText += subElement.html();
        });

        infoText += '</ul>';
        infoShow(event);
    }
    
    function mouseOut(event) {
        if (!infoHover)
            infoHide();
    }
    
    // obczaj wpisy
    // olej jeśli nick jest taki jak w nadrzędnym lub jeśli komentarze są
    // niżej niż wpis zaznaczonego autora
    function handleHover(elements) {
        elements.hover(function (event) {
            // nie pokazuj od razu tylko czekaj, bo ktoś z parkinsonem
            // może miotać tym kursorem jak szatan hehe
            clearTimeout(showHover);
            showHover = setTimeout(mouseOver, 500, event);
        }, function (event) {
            // jeśli się pokazało info i kursor na nim jest, to ukryj dopiero
            // po zjechaniu kursora z info
            // w przeciwnym wypadku chowaj od razu
            clearTimeout(showHover);
            setTimeout(mouseOut, 100, event); // mam nadzieję, że tyle starczy,
            // by ogarnął że kursor może być nad info
        });
    }

    // aktualne wpisy
    handleHover($('.sub .showProfileSummary'));
    
    // nowe wpisy
    new MutationObserver(function(mutations) {
        $(mutations).each(function (i, mutation) {
            handleHover($(mutation.addedNodes).find('.showProfileSummary'));
        });
    }).observe($('.sub')[0], {childList: true});
} ());