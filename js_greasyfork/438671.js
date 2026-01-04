// ==UserScript==
// @name          MediathekViewWeb - Single Click Download
// @description   Direct download of shows via single click
// @author        TheRealHawk
// @license       MIT
// @namespace     https://greasyfork.org/en/users/18936-therealhawk
// @match         https://mediathekviewweb.de/*
// @version       1.3
// @require       https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require       https://ajax.googleapis.com/ajax/libs/jqueryui/1.12.1/jquery-ui.min.js
// @require       https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js
// @grant         GM_download
// @downloadURL https://update.greasyfork.org/scripts/438671/MediathekViewWeb%20-%20Single%20Click%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/438671/MediathekViewWeb%20-%20Single%20Click%20Download.meta.js
// ==/UserScript==

// Workaround to get rid of "is not defined" warnings
/* globals $, jQuery, moment */

function modTitleCol() {
    $('#mediathek > tbody > tr > td:nth-child(2),' +
      '#mediathek > tbody > tr > td:nth-child(3),' +
      '#mediathek > tbody > tr > td:nth-child(5)').hover(
        // Mouseover
        function() {
            $(this).css(
                {color:'#0ce3ac'}
            );
        },
        // Mouseout
        function() {
            $(this).css(
                {color:'#ffffff'}
            );
        }
    );

    $('#mediathek > tbody > tr').each( function() {
        const url = $('td', this).last().find('a').attr('href');
        const topic = $('td', this).eq(1).text();
        const title = $('td', this).eq(2).text();
        const orgTime = $('td', this).eq(4).text();
        const modTime = moment(orgTime, 'DD.MM.YYYY').format('YYYY-MM-DD');

        $('td', this).eq(1).bind('click', function() {
            $(this).effect('pulsate');

            const details = { url: url,
                              name: modTime + ' - ' + topic + ' - ' + title.replace(/[\\\?\.\*<>]/g, '').replace(/[\|:/]/g, ' - ').replace(/"/g, '\'').replace(/[\s]{2,}/g, ' ') + '.mp4',
                              saveAs: true
                            };
            GM_download(details);
        } );

        $('td', this).eq(2).bind('click', function() {
            $(this).effect('pulsate');

            const details = { url: url,
                              name: modTime + ' - ' + title.replace(/[\\\?\.\*<>]/g, '').replace(/[\|:/]/g, ' - ').replace(/"/g, '\'').replace(/[\s]{2,}/g, ' ') + '.mp4',
                              saveAs: true
                            };
            GM_download(details);
        } );

        $('td', this).eq(4).bind('click', function() {
            $(this).effect('pulsate');

            const details = { url: url,
                              name: modTime + '.mp4',
                              saveAs: true
                            };
            GM_download(details);
        } );
    } );
}

const observer = new MutationObserver( function() {
    modTitleCol();
} );

observer.observe($('#mediathek')[0], {childList: true});
