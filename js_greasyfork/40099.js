// ==UserScript==
// @name         Piyango!
// @version      0.1.3
// @description  Ankara Piyangosu için geçerli formatta bildirilmiş biletleri clipboard'a kopyalar.
// @namespace    https://greasyfork.org/users/6949
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @match        https://*.popmundo.com/Forum/Popmundo.aspx/Thread/2317274.*
// @downloadURL https://update.greasyfork.org/scripts/40099/Piyango%21.user.js
// @updateURL https://update.greasyfork.org/scripts/40099/Piyango%21.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$(function() {
    var pattern_global = /\((.*?)\) ([0-9]{2}): (\d{1,2})-(\d{1,2})-(\d{1,2})-(\d{1,2})-(\d{1,2})/g,
        pattern = /(.*?)? \((.*?)\) ([0-9]{2}): (\d{1,2})-(\d{1,2})-(\d{1,2})-(\d{1,2})-(\d{1,2})/,
        posts = $('[id^="ctl00_cphLeftColumn_ctl00_repThread_ct"]'),
        ticketStrings = [];

    $('#ctl00_cphLeftColumn_ctl00_hdrMain').append(
        '<textarea name="ticketData"></textarea>'
    );

    $('textarea[name="ticketData"]').css({
        position: "absolute",
        left: "-1000px",
        top: "-1000px",
    });

    $('#ppm-sidemenu').append(
        '<div class="box">' +
        '<h2>Piyango Verileri</h2>' +
        '<p>Sayfa içerisindeki Ankara Piyangosu için geçerli formatta bildirilmiş biletleri clipboard\'a kopyalayın.</p>' +
        '<p class="actionbuttons">'+
        '<input type="button" name="ticket_stringify" value="Kopyala">' +
        '</p>' +
        '</div>'
    );

    $('#ppm-sidemenu').on('click', 'input[name="ticket_stringify"]', function(e) {
        e.preventDefault();

        var _td = $('textarea[name="ticketData"]'),
            _tx = _td.val(),
            _st = '';

        $.each(ticketStrings, function (index, ticket) {
            var data = [_, character, city, week, n1, n2, n3, n4, n5] = ticket.match(pattern) || ['', 'GEÇERSİZ FORMAT!'];
            data[1] = character.trim().replace(' -', '').replace(':', '');

            if (typeof city !== 'undefined') {
                delete data[3];
            }

            row = data.slice(1).join(';').replace(';;', ';');

            _st += row + (index !== ticketStrings.length - 1 ? '\n' : '');
        });

        _td.val(_st);
        _td.select();
        document.execCommand('copy');

        $(this).prop('disabled', true).val('Kopyalandı!');
    });

    $.each(posts, function (index, object) {
        var post = $(object),
            selector = post.find('.forumText, blockquote.hidden, blockquote.quote'),
            tickets = selector.text().match(pattern_global);

        if (tickets && tickets.length === 1) {
            ticketStrings.push(post.find('.forumMessageHeader a:first-child').text() + ' ' + tickets[0]);
        }

        if (tickets && tickets.length > 1) {
            var t = post.html().split('<br>').filter(function (value) {
                return pattern.test(value);
            }).map(function (value) {
                return value.replace(/^\s+|\s+$/g, '')
                    .replace('Spoiler göster', '')
                    .replace('Piyango Bileti', '')
                    .replace('Lottery Ticket', '')
                    .replace(/(<([^>]+)>)/ig, '')
                    .replace(/<([^ >]+)[^>]*>.*?<\/\1>|<[^\/]+\/>/ig, '').trim();
            }).forEach(function(value) {
                ticketStrings.push(value);
            });
        }
    });
});
