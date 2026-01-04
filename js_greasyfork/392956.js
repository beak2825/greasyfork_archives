// ==UserScript==
// @name Redmine helper buttons: List page
// @namespace Redmine
// @icon https://dev.sun-asterisk.com/favicon.ico?1528612569
// @description Copy multiple Redmine URL links
// @run-at document-start
// @match *://dev.sun-asterisk.com/projects/*
// @match *://pherusa-redmine.sun-asterisk.vn/projects/*
// @grant GM_setClipboard
// @grant GM_notification
// @version 1.1.2
// @downloadURL https://update.greasyfork.org/scripts/392956/Redmine%20helper%20buttons%3A%20List%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/392956/Redmine%20helper%20buttons%3A%20List%20page.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function (event) {
    var host = location.protocol + '//' + location.host;

    $('#query_form_with_buttons p.buttons')
        .append('<a class="icon icon-copy ticket-urls" href="javascript:void(0)">Copy URLs</a>')
        .append('<a class="icon icon-copy copy-titles" href="javascript:void(0)">Copy Titles</a>')
        .append('<a class="icon icon-copy hide-sidebar" href="javascript:void(0)">Hide sidebar</a>');

    // Copy selected URLs
    $('.ticket-urls').on('click', function () {
        var ticketUrls = [];
        $('input:checkbox[name="ids[]"]:checked').each(function () {
            ticketUrls.push(host + $(this).closest('tr').find('td.id a').attr('href'));
        });
        var joinedUrls = ticketUrls.join("\n");
        if (joinedUrls) {
            GM_setClipboard(joinedUrls);
            GM_notification({
                title: 'Redmine URL copied',
                text: joinedUrls,
                image: 'https://dev.sun-asterisk.com/favicon.ico?1528612569'
            });
        }
    });

    // Copy selected Titles
    $('.copy-titles').on('click', function () {
        var titles = [];
        $('input:checkbox[name="ids[]"]:checked').each(function () {
            var title = $(this).closest('tr').find('td.subject a').text().trim();
            titles.push(title);
        });

        var joinedTitles = titles.join("\n");
        if (joinedTitles) {
            GM_setClipboard(joinedTitles);
            GM_notification({
                title: 'Redmine Titles copied',
                text: joinedTitles,
                image: 'https://dev.sun-asterisk.com/favicon.ico?1528612569'
            });
        }
    });

    $('.hide-sidebar').on('click', function () {
        var sidebar = $('#sidebar'),
            content = $('#content');
        if (sidebar.is(':visible')) {
            sidebar.hide();
            $('#content').css('width', '100%');
        } else {
            sidebar.show();
            $('#content').css('width', '');
        }
    });

    $('table.list td.parent a').each(function () {
        $(this).text($(this).prop('title'));
        $(this).parent('td').css('text-align', 'left');
    });
});
