// ==UserScript==
// @name         Steamgifts One-Click Entry v2
// @namespace    http://www.telaweb.net/
// @version      2.0.1
// @description  Steamgifts one-click entry
// @author       Cas van Noort
// @match        https://www.steamgifts.com///
// @include      https://www.steamgifts.com/
// @include      https://www.steamgifts.com/giveaways*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24865/Steamgifts%20One-Click%20Entry%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/24865/Steamgifts%20One-Click%20Entry%20v2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var link_string = '<a href="#" onclick="return false;" class="short-enter-leave-link"><i class="fa"></i> <span></span></a>';

    var giveaways = $('.giveaway__row-inner-wrap');

    giveaways.each(function (idx, elem) {
        var j = $(elem);
        var href = $(j.find('.giveaway__heading__name')).attr('href');

        var l = $(link_string);
        l.attr('data-link', href);
        var faded = j.hasClass('is-faded');
        l.find('span').text(faded ? 'Leave' : 'Enter');

        l.addClass(faded ? 'leave' : '');
        l.find('.fa').addClass(faded ? 'fa-minus' : 'fa-plus');

        j.find('.giveaway__links').append(l);
    });

    var links = $('.short-enter-leave-link');

    links.click(function (e) {
        var elem = $(this);

        var url = elem.attr('data-link');
        console.log(url);

        $.ajax(url, {
            complete: function (data, code) {
                var f = $(data.responseText).find('.sidebar form').first().serializeArray();
                var wasLeave = elem.hasClass('leave');
                f[1].value = wasLeave ? "entry_delete" : "entry_insert";
                $.ajax('/ajax.php', {
                    data: f,
                    method: 'POST',
                    complete: function (data1, code1) {
                        var d = JSON.parse(data1.responseText);
                        if(d.type === "success")
                        {
                            elem.toggleClass('leave');
                            elem.closest('.giveaway__row-inner-wrap').toggleClass("is-faded");
                            elem.find('span').text(elem.hasClass('leave') ? 'Leave' : 'Enter');
                            elem.find('.fa').removeClass('fa-plus fa-minus').addClass(elem.hasClass('leave') ? 'fa-minus' : 'fa-plus');
                            $('.nav__points').text(d.points);
                        }
                    }
                });
            }
        });
    });
})();