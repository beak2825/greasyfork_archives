// ==UserScript==
// @name          WaniKani Rename SRS Stages – Companion Script
// @namespace     https://www.wanikani.com
// @description   Show custom SRS-stage names in Review popups. This is a companion script to [Wanikani Rename SRS Stages].
// @author        gth99 from an original script by seanblue
// @version       1.0.3
// @include       *://www.wanikani.com/review/session*
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/384587/WaniKani%20Rename%20SRS%20Stages%20%E2%80%93%20Companion%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/384587/WaniKani%20Rename%20SRS%20Stages%20%E2%80%93%20Companion%20Script.meta.js
// ==/UserScript==


const eventPrefix = 'gth99.rename_srs_stages.';

// Catch additional events.
// http://viralpatel.net/blogs/jquery-trigger-custom-event-show-hide-element/
(function($) {$.each(['hide'], function(i, ev) { var el = $.fn[ev]; $.fn[ev] = function() { this.trigger(eventPrefix + ev); return el.apply(this, arguments); }; }); })(jQuery);

(function() {
    'use strict';
    var style;

    if (localStorage.getItem("WKBLRLevelNumbers") == "on")
        style =
            '<style name=\"srsLabels\">' +
            '.srs .srs-up.srs-apprentice1:after,.srs .srs-down.srs-apprentice1:after { content: \'Æ®Apprentice‰© 1\' }' +
            '.srs .srs-up.srs-apprentice2:after,.srs .srs-down.srs-apprentice2:after { content: \'Æ®Apprentice‰© 2\' }' +
            '.srs .srs-up.srs-apprentice3:after,.srs .srs-down.srs-apprentice3:after { content: \'Æ®Apprentice‰© 3\' }' +
            '.srs .srs-up.srs-apprentice4:after,.srs .srs-down.srs-apprentice4:after { content: \'Æ®Apprentice‰© 4\' }' +
            '.srs .srs-up.srs-guru1:after,.srs .srs-down.srs-guru1:after { content: \'Æ®Guru‰© 1\' }' +
            '.srs .srs-up.srs-guru2:after,.srs .srs-down.srs-guru2:after { content: \'Æ®Guru‰© 2\' }' +
            '.srs .srs-up.srs-master1:after,.srs .srs-down.srs-master1:after { content: \'Æ®Master‰©\' }' +
            '.srs .srs-up.srs-enlighten1:after,.srs .srs-down.srs-enlighten1:after { content: \'Æ®Enlighten‰©\' }' +
            '.srs .srs-up.srs-burn1:after,.srs .srs-down.srs-burn1:after { content: \'Æ®Burn‰©\' }' +
            '</style>';
    else
        style =
            '<style name=\"srsLabels\">' +
            '.srs .srs-up.srs-apprentice1:after,.srs .srs-down.srs-apprentice1:after { content: \'Æ®Apprentice‰©\' }' +
            '.srs .srs-up.srs-apprentice2:after,.srs .srs-down.srs-apprentice2:after { content: \'Æ®Apprentice‰©\' }' +
            '.srs .srs-up.srs-apprentice3:after,.srs .srs-down.srs-apprentice3:after { content: \'Æ®Apprentice‰©\' }' +
            '.srs .srs-up.srs-apprentice4:after,.srs .srs-down.srs-apprentice4:after { content: \'Æ®Apprentice‰©\' }' +
            '.srs .srs-up.srs-guru1:after,.srs .srs-down.srs-guru1:after { content: \'Æ®Guru‰©\' }' +
            '.srs .srs-up.srs-guru2:after,.srs .srs-down.srs-guru2:after { content: \'Æ®Guru‰©\' }' +
            '.srs .srs-up.srs-master1:after,.srs .srs-down.srs-master1:after { content: \'Æ®Master‰©\' }' +
            '.srs .srs-up.srs-enlighten1:after,.srs .srs-down.srs-enlighten1:after { content: \'Æ®Enlighten‰©\' }' +
            '.srs .srs-up.srs-burn1:after,.srs .srs-down.srs-burn1:after { content: \'Æ®Burn‰©\' }' +
            '</style>';

    const defaultSRSLevelNames = ["Apprentice", "Guru", "Master", "Enlighten", "Burn"];
    const customSRSLevelNames = [localStorage.getItem("WKBLRApprenticeLevelName") || defaultSRSLevelNames[0],
                                 localStorage.getItem("WKBLRGuruLevelName") || defaultSRSLevelNames[1],
                                 localStorage.getItem("WKBLRMasterLevelName") || defaultSRSLevelNames[2],
                                 localStorage.getItem("WKBLREnlightenedLevelName") || defaultSRSLevelNames[3],
                                 localStorage.getItem("WKBLRBurnLevelName") || defaultSRSLevelNames[4]];
    for (var ix=0; ix<5; ix++) {
        const regex = new RegExp("Æ®"+defaultSRSLevelNames[ix]+"‰©", 'g' );
        style = style.replace(regex, customSRSLevelNames[ix]);
    }

    function addCss() {
        $('head').append(style);
    }

    function updateSrsNames() {
        window.Srs.name = function(e) {
            switch (e) {
                case 1:
                    return "apprentice1";
                case 2:
                    return "apprentice2";
                case 3:
                    return "apprentice3";
                case 4:
                    return "apprentice4";
                case 5:
                    return "guru1";
                case 6:
                    return "guru2";
                case 7:
                    return "master1";
                case 8:
                    return "enlighten1";
                case 9:
                    return "burn1";
            }
        };
    }

    (function() {
        $('#loading:visible').on(eventPrefix + 'hide', function() {
            addCss();
            updateSrsNames();
        });
    })();
})();