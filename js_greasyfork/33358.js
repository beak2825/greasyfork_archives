// ==UserScript==
// @name         Enhance MeWe
// @locale       English (en)
// @namespace    COMDSPDSA
// @version      1
// @description  Customize MeWe for single-column reading
// @author       Dan Overlander
// @include      https://*mewe.com*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require	     https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require      https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=156109
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33358/Enhance%20MeWe.user.js
// @updateURL https://update.greasyfork.org/scripts/33358/Enhance%20MeWe.meta.js
// ==/UserScript==

// Since v01: initial script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';
    var MEWE = 0,
        global = {
            TIMEOUT: 750,
            scriptName: 'MeWe SingleColumn',
        },
        targets = [
            {
                id: MEWE, // id not used; for developer only
                titleElement: '.sidebar-photostream_photos',
                initializeOnElement: '.post_header'
            }
        ],
        toggle = [
            {
                id: MEWE, // id not used; for developer only
                isResetting: undefined,
                areClassesAdded: false
            }
        ],
        pages = [
            {
                id: MEWE, // id not used; for developer only
                initialize: function () {
                    setTimeout(function () {
                        pages[MEWE].addClasses();
                        pages[MEWE].setTamperIcon();
                    }, global.TIMEOUT);
                },
                addClasses: function () {
                    if (!toggle[MEWE].areClassesAdded) {
                        toggle[MEWE].areClassesAdded = true;

                        // tampermonkey script identifier
                        tm.addGlobalStyle('.tamperlabel { float:right; width:25px; height:25px; background-color:cornsilk; cursor:pointer; font-size:0.5em; font-weight:normal; color:goldenrod; line-height:25px }');

                        // fade images / reveal on rollover
                        tm.addGlobalStyle('@media only screen and (max-width: 32em) { img, .post-link_img-wrapper, .c-mw-post-photo-two, .c-mw-post-photo-four, .emoji { opacity: .15 !important; } img:hover, .post-link_img-wrapper:hover, .c-mw-post-photo-two:hover, .c-mw-post-photo-four:hover, .emoji:hover { opacity: 1 !important; }}');

                        // resize center column
                        tm.addGlobalStyle('@media only screen and (max-width: 32em) { .c-feed-simple { width: 360px; } }');

                        // hide side columns
                        tm.addGlobalStyle('@media only screen and (max-width: 32em) { .sidebar-right-dummy, .sidebar-left-dummy { display: none; } }');
                    }
                },
                setTamperIcon: function () {
                    // Add Tampermonkey Icon with label to identify this script
                    if (!toggle[MEWE].isResetting) {
                        $('.tamperlabel').remove();
                        toggle[MEWE].isResetting = setTimeout(function() {
                            if($('.tamperlabel').length > 0) {
                                $('.tamperlabel').prop('title', $('.tamperlabel').prop('title') + ' | ' + global.scriptName);
                            } else {
                                $(targets[MEWE].titleElement).append('<div class="tamperlabel" title="Tampermonkey scripts: ' + global.scriptName + '">&nbsp;tm</div>');
                            }
                            toggle[MEWE].isResetting = undefined;
                        }, global.TIMEOUT);
                    }
                },
            }
        ];
    /*
     * Global functions
     */

    function initScript () {
        tm.getContainer({
            'el': targets[MEWE].initializeOnElement,
            'max': 100,
            'spd': 1000
        }).then(function($container){
            pages[MEWE].initialize();
        });
    }
    initScript();

    $(document).mouseup(function(e) {
        initScript();
    });

})();
$.noConflict();