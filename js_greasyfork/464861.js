// ==UserScript==
// @name        ao3 romantic relationship savior
// @description hide works with romantic relationships on AO3
// @namespace   https://greasyfork.org/en/scripts/464861
// @author       MM
// @match        https://archiveofourown.org/tags/*
// @match        https://archiveofourown.org/works?commit=Sort+and+Filter*
// @grant       none
// @version     1.1
// @license     none
// @downloadURL https://update.greasyfork.org/scripts/464861/ao3%20romantic%20relationship%20savior.user.js
// @updateURL https://update.greasyfork.org/scripts/464861/ao3%20romantic%20relationship%20savior.meta.js
// ==/UserScript==



/********************************/

(function($) {

    var works = $('li.blurb');
    if (!works[0]) return;

    var toggleClass = 'ao3-rels-hide-toggle',
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
        
        shouldBlacklist = function(work) {
            var relationships = work.find('.relationships').find('a.tag');
            //console.log(relationships);
            //var relationshiptags = [];
            let checkRomRel;
            let checkRel;
            let returnRomvalue;
            for(var i = 0; i< relationships.length; i++){
                checkRel = relationships[i].href;
                //relationshiptags.push(checkRel);
                if(checkRel !== null && checkRel !== undefined ) {
                    checkRomRel = checkRel.match(/\*s\*/g);
                    if(checkRomRel !== null && checkRomRel !== undefined) {
                        returnRomvalue = checkRomRel;
                    }
                }
            }

            if(returnRomvalue !== null && returnRomvalue !== undefined) {
                return returnRomvalue;
            }

        },
        blacklist = function(work, reason) {
            var cut = $('<div>').addClass('cut').html(work.html()),
                reason = '  (One or more romantic relationships) ',
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