// ==UserScript==
// @name         Steamgifts One-Click Entry
// @namespace    com.Sergeeeek.Usability.Scripts
// @version      0.10
// @description  This script adds "Enter" button on every giveaway, so you don't have to open a new page to enter it. I also adds vote all button, which votes for giveaways with more copies first.
// @author       Sergeeeek
// @include      https://www.steamgifts.com/
// @include      https://www.steamgifts.com/giveaways*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20801/Steamgifts%20One-Click%20Entry.user.js
// @updateURL https://update.greasyfork.org/scripts/20801/Steamgifts%20One-Click%20Entry.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var link_string = '<a href="#" onclick="return false;" class="short-enter-leave-link"><i class="fa"></i> <span></span></a>';
	var vote_all_string = '<a id="vote_all" href="#" onclick="return false;"><i class="fa fa-plus"></i> Vote all</a>';

    var giveaways = $('.giveaway__row-inner-wrap');
	var vote_all_button = $(vote_all_string);
	$('.page__heading div').after(vote_all_button);

    giveaways.each(function (idx, elem) {
        var j = $(elem);
        
        if(j.find('.giveaway__column--contributor-level').hasClass('giveaway__column--contributor-level--negative')) {
            return;
        }
        
        var href = $(j.find('.giveaway__heading__name')).attr('href');
        var details = j.find('.giveaway__heading__thin').text();

        var detailsMatch = details.match(/(\(([0-9]*)\sCopies\))?\s?\(([0-9]*)P\)/);
        
        var copies = detailsMatch[2] === undefined ? 1 : detailsMatch[2];
        var cost = detailsMatch[3];

        var l = $(link_string);
        l.attr('data-link', href);
        l.attr('data-cost', cost);
        l.attr('data-copies', copies);
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

        $.ajax(url, {
            complete: function (data, code) {
                var f = $(data.responseText).find('div[data-do="entry_insert"], div[data-do="entry_delete"]').closest('form').serializeArray();

                var wasLeave = elem.hasClass('leave');
                f[1].value = wasLeave ? "entry_delete" : "entry_insert";

                $.ajax('/ajax.php', {
                    data: f,
                    method: 'POST',
                    complete: function (data1, code1) {
                        if(data1.responseText === "") return;
                        
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
    
    $('#vote_all').click(function () {
        links.not('.leave')
            .toArray()
            .sort(function(a, b) {
                var ac = parseInt($(a).attr('data-copies'));
                var bc = parseInt($(b).attr('data-copies'));


                if(ac > bc) {
                    return -1;
                }
                else if(ac === bc) {
                    return 0;
                }
                else {
                    return 1;
                }
            })
            .forEach(function(elem) {
                $(elem).click();
            });
	});
})();