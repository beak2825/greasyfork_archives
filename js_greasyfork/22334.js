// ==UserScript==
// @name        ao3 tags savior
// @description hide works with too many tags on the AO3
// @namespace   ao3
// @include     http*://archiveofourown.org/*
// @grant       none
// @version     1.0
// @downloadURL https://update.greasyfork.org/scripts/22334/ao3%20tags%20savior.user.js
// @updateURL https://update.greasyfork.org/scripts/22334/ao3%20tags%20savior.meta.js
// ==/UserScript==

// based on Tegan's Crossover savior: https://greasyfork.org/en/scripts/13274-ao3-crossover-savior

/**** CONFIG ********************/
window.ao3TagsConfig = {
    maxTags: 15,
    // set to the maximum number of tags per work you want to see
    // keep in mind that this number is count of all tags: fandoms, relationships, characters and freeform
    // so you may want to keep this number relatively high
};
/********************************/

(function($) {

    var works = $('li.blurb');
    if (!works[0]) return;

    var toggleClass = 'ao3-tags-hide-toggle',
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
        bl = window.ao3TagsConfig,
        shouldBlacklist = function(work) {
            var tag = work.find('a.tag');
            if (tag.length > bl.maxTags) {
                return tag.length;
            }
        },
        blacklist = function(work, reason) {
            var cut = $('<div>').addClass('cut').html(work.html()),
                reason = '(Too many tags: ' + reason +')',
                thisFold = fold.clone(),
                reasonContainer = thisFold.find('.reason');

            reasonContainer.html(reason);

            work.empty().append(thisFold, cut.hide());
            work.find('a.action').click(function() {
                var fold = $(this).closest('.fold'),
                    cut = fold.next('.cut');

                cut.add(fold.children('.'+toggleClass)).toggle();
                $(this).text(cut.is(':visible') ? 'Hide' : 'Unhide');
            });
        };

    works.each(function() {
        var reason = shouldBlacklist($(this));
        if (reason) {
            blacklist($(this), reason);
        }
    });

})(window.jQuery);