// ==UserScript==
// @name       glenowe menu
// @namespace  https://www.wykop.pl/*
// @version    1.2
// @description  Dodaje ikony w górnej części strony, aby ułatwić nawigację po Wykopie
// @match      https://www.wykop.pl/*
// @copyright  krejd
// @downloadURL https://update.greasyfork.org/scripts/27504/glenowe%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/27504/glenowe%20menu.meta.js
// ==/UserScript==

// KREJDOWE MENU 1.1 Z MOIM DODATKIEM - @GLENPL

// Goes to next unread tag
$('body').on('click', '#nextTag', function(event) {
    event.preventDefault();

    // Dblclick button to get ajax working as
    // it needs to scrape unread notification urls
    $('body').append('<style id="niewidacheheszki">.menu-list { display:none !important; }</style>');
    $('.notification.m-tag > a.ajax').trigger('click');

    // Checks if ajax complete
    checkIfShownNote = setInterval(function() {
        if(jQuery.active == 0) {
            clearInterval(checkIfShownNote);
            $('body').trigger('click');

            $('.notification.m-tag .menu-list li:first a').each(function(index,value) {
                if($(this).attr('href').match(/wpis/i)) {
                    hashHref = $(this).attr('href');
                    window.location.href = hashHref;
                }
            });

            $('#niewidacheheszki').remove();
        }
    }, 50);
});

// Goes to next unread notification
$('body').on('click', '#nextNote', function(event) {
    event.preventDefault();

    // Dblclick button to get ajax working as
    // it needs to scrape unread notification urls
    $('body').append('<style id="niewidacheheszki">.menu-list { display:none !important; }</style>');
    $('.notification.m-user > a.ajax').trigger('click');

    // Checks if ajax complete
    checkIfShownNote = setInterval(function() {
        if(jQuery.active === 0) {
            clearInterval(checkIfShownNote);
            $('body').trigger('click');

            $('.notification.m-user .menu-list li:first a').each(function(index,value) {
                if($(this).attr('href').match(/wpis/i) || $(this).attr('href').match(/konwersacja/i) || $(this).attr('href').match(/comment/i)) {
                    hashHref = $(this).attr('href');
                    window.location.href = hashHref;
                }
            });

            $('#niewidacheheszki').remove();
        }
    }, 50);
});

// Append new buttons to Wykop interface
// Append new buttons to Wykop interface
// Append new buttons to Wykop interface

$('div#nav ul.clearfix:last > li.notification.m-user').before($('<li/>', {
    id: 'nextNote',
    html: '<a class="dropdown-show" href="http://www.wykop.pl/powiadomienia/do-mnie/"><i class="fa fa-envelope"></i><b class="" id="hashtagsNotificationsCount" style="background:#FF5917; font-size:0; display:block; padding:1px; top:22px; right:20px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b></a><div class="notificationsContainer"></div>',
    class: "notification m-user krejd-nextnotification",
    title: "Czytaj następne powiadomienie",
    alt: "Czytaj następne powiadomienie"
}));

$('div#nav ul.clearfix:last > li.notification.m-tag').before($('<li/>', {
    id: 'allTags',
    html: '<a class="dropdown-show hashtag" href="http://www.wykop.pl/powiadomienia/unreadtags/"><b class="" id="hashtagsNotificationsCount" style="background:#924396; font-size:0; display:block; padding:1px; top:22px; right:16px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b>#</a><div class="notificationsContainer"></div>',
    class: "notification m-tag krejd-alltags",
    title: "Pokaż nieprzeczytane wpisy z tagów",
    alt: "Pokaż nieprzeczytane wpisy z tagów"
}));

$('div#nav ul.clearfix:last > li.notification.m-tag:not(.krejd-alltags)').before($('<li/>', {
    id: 'nextTag',
    html: '<a class="dropdown-show hashtag" href="http://www.wykop.pl/powiadomienia/tagi/"><b class="" id="hashtagsNotificationsCount" style="background:#FF5917; font-size:0; display:block; padding:1px; top:22px; right:16px; min-width:10px; width:10px; min-height:10px; height:10px; border-radius:5px; overflow:hidden;">&nbsp;</b>#</a><div class="notificationsContainer"></div>',
    class: "notification m-tag krejd-nexttag",
    title: "Czytaj następny tag",
    alt: "Czytaj następny tag"
}));


// MOJ DODATKOWY KOD - @GLENPL

document.onkeydown = function(e) {
    switch (e.keyCode) {
        case 39:
            if(window.location.href.match(/http:\/\/www.wykop.pl\/wiadomosc-prywatna\/.*/)) { 
                // do nothing
            }
            else {
                document.getElementById('nextTag').click();
            }
            break;
    }
};