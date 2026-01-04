// ==UserScript==
// @name            WaniKani SRS Ranks
// @namespace   wk-srs-ranks
// @description     Adds 5 new ranks to WaniKani's SRS. Additionally, allows you to rename the SRS labels of the default system.
// @version         1.2.1

// @author          Saxon Cameron, @saxoncameron
// @website         http://www.saxoncameron.com/
// @source          https://github.com/saxoncameron/WaniKani-SRS-Ranks

// @match           https://www.wanikani.com/review/session
// @grant           unsafeWindow
// @run-at          document-end
// @require         https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @license         MIT; http://opensource.org/licenses/MIT
// @downloadURL https://update.greasyfork.org/scripts/39258/WaniKani%20SRS%20Ranks.user.js
// @updateURL https://update.greasyfork.org/scripts/39258/WaniKani%20SRS%20Ranks.meta.js
// ==/UserScript==

'use strict';

(function($) {

    $.jStorage = unsafeWindow.$.jStorage;

    var CONST = {
        SRS_RANKS: [
            'Layman',
            'Initiate',
            'Novice',
            'Apprentice',
            'Journeyman',
            'Adept', // Used to be guru
            'Guru',
            'Master',
            'Enlightened',
            'Burned'
        ]
    };

    function formatRankClass(rank) {
        return rank.toLowerCase().replace(/\s/g, '-');
    }

    function populateAndAppendCSS() {

        // =====================================================
        // NOTE: CSS is populated via build task
        // =====================================================

        var CSS = [
            '.srs .srs-up::before,',
            '.srs .srs-down::before {',
            '  font-family: inherit;',
            '  font-size: 15px;',
            '  border-radius: 50%;',
            '  border: 3px solid;',
            '  width: 19px;',
            '  height: 18px;',
            '  display: inline-flex;',
            '  align-items: center;',
            '  justify-content: center;',
            '  position: relative;',
            '  top: -2px;',
            '  line-height: 0;',
            '}',
        ].join('\n');

        // =====================================================
        // =====================================================

        CONST.SRS_RANKS.forEach(function(rank, idx) {
            var rankClass = formatRankClass(rank);
            CSS += ['.srs .wk-srs-rank-' +
                rankClass + '::before {', '\tcontent: \'' + (
                    idx + 1) + '\';',
                '}', '.srs .wk-srs-rank-' +
                rankClass + '::after {', '\tcontent: \'' +
                rank + '\';',
                '}'
            ].
            join('');
        });

        // Append CSS to the document
        $('head').append([
            '<!-- START - WaniKani SRS Ranks CSS -->', '<style type="text/css">' +
            CSS + '</style>',
            '<!-- END - WaniKani SRS Ranks CSS -->'
        ].join(''));
    }

    function init() {
        $('#question-type').bind('DOMNodeInserted', function() {
            var _$srsTile = $('.srs > div');
            var levelUpOrDown = _$srsTile.hasClass('srs-up'); // True = Level up, False = Level down
            var currentItem = $.jStorage.get('currentItem');
            var nextSrs = currentItem.srs + (levelUpOrDown ? 1 : -1);

            _$srsTile
                // Remove legacy SRS rank
                .removeClassPrefix('srs-')
                // Re-add class to trigger up/down animation
                .addClass('srs-' + (levelUpOrDown ? 'up' : 'down'))
                // Add our new SRS rank
                .addClass('wk-srs-rank-' + formatRankClass(CONST.SRS_RANKS[nextSrs]));
        });

        populateAndAppendCSS();
    }

    console.log('WaniKani SRS Ranks - by @saxoncameron');
    init();

})(jQuery);

// Util functions

$.fn.removeClassPrefix = function(prefix) {
    this.each(function(i, el) {
        var classes = el.className.split(' ').filter(function(c) {
            return c.lastIndexOf(prefix, 0) !== 0;
        });
        el.className = $.trim(classes.join(' '));
    });
    return this;
};
