// ==UserScript==
// @name Copy Redmine task title
// @namespace Redmine
// @icon https://dev.sun-asterisk.com/favicon.ico?1528612569
// @description Copy Redmine task title to clipboard
// @run-at document-start
// @match *://dev.sun-asterisk.com/issues/*
// @match *://*redmine.sun-asterisk.vn/issues/*
// @grant GM_setClipboard
// @grant GM_notification
// @version 1.1.2
// @downloadURL https://update.greasyfork.org/scripts/377032/Copy%20Redmine%20task%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/377032/Copy%20Redmine%20task%20title.meta.js
// ==/UserScript==

document.addEventListener("DOMContentLoaded", function(event) {
    var contentEl = $('#content'),
        ticketNumber = contentEl.children('.contextual').siblings('h2').text(),
        ticketTitle = contentEl.find('.subject h3').text(),
        ticketURL = location.protocol + '//' + location.host + location.pathname,
        progress = contentEl.find('.attributes .percent')[0]?.outerText || contentEl.find('.us-progr-text')[0]?.outerText;
    contentEl.find('.icon-copy').closest('.contextual').append('<a class="icon icon-copy update-resolve-auto" href="#">Resolved to me</a>');
    contentEl.find('.icon-copy').closest('.contextual').append('<a class="icon icon-copy ticket-url" href="#">Ticket URL</a>');
    contentEl.find('.icon-copy').closest('.contextual').append('<a class="icon icon-copy icon-copy-to-clipboard" href="#">Report</a>');
    $('.icon-copy-to-clipboard').on('click', function () {
        var textToCopy = '- ' + ticketNumber + ' - ' + ticketTitle + ' ' + '(' + ticketURL + ')';
        if (progress.split('%')[0] > 0) { textToCopy += ' => (' + progress  + ')'; }
        GM_setClipboard(textToCopy);
        GM_notification ( {title: 'Redmine report copied', text: textToCopy, image: 'https://dev.sun-asterisk.com/favicon.ico?1528612569'} );
        textToCopy = '';
    });
    $('.ticket-url').on('click', function () {
        GM_setClipboard(ticketURL);
        GM_notification ( {title: 'Redmine URL copied', text: ticketURL, image: 'https://dev.sun-asterisk.com/favicon.ico?1528612569'} );
    });
    $('.update-resolve-auto').on('click', function () {
        $('#issue_done_ratio').val(80);
        $('#issue_status_id').val(3);
        $('#issue_assigned_to_id').val(1579);
        $('#issue-form').submit();
    });
});
