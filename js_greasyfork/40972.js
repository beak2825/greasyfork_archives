// ==UserScript==
// @name			Tamper Global
// @description		Adds global classes and Tampermonkey icon for COMDSPDSA scripts
// @namespace		COMDSPDSA
// @author			Dan Overlander
// @locale          English (EN)
// @license			none
// @version			8.5
// @include			*/tfs*
// @include			*/localhost*
// @include			*/gitlab*
// @include			*online-sales-ux-*
// @include         *preol*
// @include			*pcf.dell.com*
// @include			*dell.com/salesapp*
// @include         *pivotaltracker.com*
// @include         *dell.com/Identity/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=719998
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @downloadURL https://update.greasyfork.org/scripts/40972/Tamper%20Global.user.js
// @updateURL https://update.greasyfork.org/scripts/40972/Tamper%20Global.meta.js
// ==/UserScript==

// Since v08.4: Included on DAIS login page
// Since v08.3: Adding classes for tamperButtons. Tamperlibrary link updated.
// Since v08.2: Colorized tampericon
// Since v08.1: Added pivotalTracker. set modal window from absolute to fixed.
// Since v08.0: Added trigger for Partner-UX activation
// Since v07: Adjusting z-index of tamperlabel and modal. moving out setTamperIcon. Removing too-inclusive swagger include command
// Since v06: Including a PCF swagger. TamperLabel Tweaks.
// Since v05: Including Partner
// Since v04: Added Gitlab to inclusions. Added support for fontawesome.
// Since v03: Expanding to include Swagger pages; renamed to DSA2018 Global
// Since v02: Changed CSS on TamperIcon positioning
// Since v01: rename, to semantically include DSA
// Since v00: Initial

(function() {
    'use strict';

    const TIMEOUT = 500;
    var toggle = {
            areClassesAdded: false
        },
        global = {
            triggerElements: ['#swagger-ui', '.navbar', '.container', '.icon-ui-dell', '.dds__container', '.menu-icon', '#root'],
            scriptName: 'Tamper Global',
            prefsName: 'tamperGlobalPrefs',
            prefs: {},
            handlePrefsLocally: true,
            animationSpeed: (TIMEOUT/2)
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.addClasses();
                    tm.setTamperIcon(global);
                }, TIMEOUT);
            },
            addClasses: function () {
                if (!toggle.areClassesAdded) {
                    toggle.areClassesAdded = true;

                    // generic
                    tm.addGlobalStyle('.fingery { margin:0px 13px; cursor:pointer; }');

					// styles for modal popup
                    tm.addGlobalStyle('.fingery { cursor: pointer; }');
					tm.addGlobalStyle('.popupDetailWindow	{ position:fixed; z-index: 999999999; top:50px; left:50px; width:75%; height:75%; background:white; border:1px solid black; border-radius: 10px; box-shadow: 10px 10px 5px 0px rgba(0,0,0,0.75); padding:10px; font-size:1.2em; overflow-y:scroll; }');
					tm.addGlobalStyle('.popupDetailTitle	{ float:left; margin-right:10px; width:15%; margin-bottom:5px; font-weight:bold; clear:both; margin-top:2px; }'); // width:6%; min-width:100px;
					tm.addGlobalStyle('.popupDetailContent	{ float:left; width:80%; line-height:0.9em; font-size:0.9em; margin-top:5px; }');
					tm.addGlobalStyle('.popupDetailContent .work-item-color	{ display:none; }');

                    // tamperlabel
                    tm.addGlobalStyle('.tamperlabel { position:fixed; z-index:999999999; bottom:0px; right:20px; left:unset; cursor: pointer; content: url("https://www.dorkforce.com/dsa/battery-3-icon.png"); width:16px; height:16px;}');

                    // tamperButtons
                    tm.addGlobalStyle('.tBtn { background-color:#6c757d !important; height:30px; font-weight:400; color:white; vertical-align:middle; height:40px; border:0; cursor:pointer; }');
                    tm.addGlobalStyle('.tBtnMain { background-color:#007bff !important; }');

                }
            }
        };

    /*
     * Global functions
     */


    function initScript () {
        _.each(global.triggerElements, (trigger) => {
            tm.getContainer({
                'el': trigger,
                'max': 100,
                'spd': 1000
            }).then(function($container){
                page.initialize();
            });
        });
    }
    initScript();

    $(document).mouseup(function(e) {
        initScript();
    });

})();