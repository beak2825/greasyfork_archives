// ==UserScript==
// @name        ao3 crossover savior
// @description hide works with too many fandoms on the AO3
// @namespace   ao3
// @include     http*://archiveofourown.org/*
// @grant       none
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/13274/ao3%20crossover%20savior.user.js
// @updateURL https://update.greasyfork.org/scripts/13274/ao3%20crossover%20savior.meta.js
// ==/UserScript==


/**** CONFIG ********************/
window.ao3XoverConfig = {
    maxFandoms: 2,
    // set to the maximum number of fandoms per work you want to see
};
/********************************/

(function($) {

    var works = $('li.blurb');
    if (!works[0]) return;

    var toggleClass = 'ao3-xover-hide-toggle',
        fold = $('<p>').addClass('fold').append(
            $('<span>').addClass(toggleClass).text('This work is hidden! '),
            $('<span>').addClass(toggleClass).html('This work was hidden. ').hide(),
            $('<span>').addClass('reason'),
            $('<span>').addClass('actions').append(
                $('<a>').addClass('action').css({
                    'position': 'absolute',
                    'right': 8,
                    'top': 10
                }).text('Unhide')
            )
        ),
        bl = window.ao3XoverConfig,
        shouldBlacklist = function(work) {
            var fandoms = work.find('.fandoms').find('a.tag');
            if (fandoms.length > bl.maxFandoms) {
                return fandoms.length;
            }
        },
        blacklist = function(work, reason) {
            var cut = $('<div>').addClass('cut').html(work.html()),
                reason = '(Too many fandoms: ' + reason +')',
                thisFold = fold.clone(),
                reasonContainer = thisFold.find('.reason');

            reasonContainer.html(reason);

            work.empty().append(thisFold, cut.hide());
            work.find('a.action').click(function() {
                var fold = $(this).closest('.fold'),
                    cut = fold.next('.cut');

                cut.add(fold.children('.'+toggleClass)).toggle();
                $(this).text(cut.is(':visible') ? 'Hide' : 'Unhide');
            })
        };

    works.each(function() {
        var reason = shouldBlacklist($(this));
        if (reason) {
            blacklist($(this), reason)
        }
    });

})(window.jQuery);