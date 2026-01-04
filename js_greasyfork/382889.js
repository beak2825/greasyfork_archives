// ==UserScript==
// @name			SwaggerKeys
// @namespace		COMDSPDSA
// @version			1.2
// @description		Auto-applies subscriber ID to Swagger instances.
// @author			Dan Overlander
// @include			*pcf.dell.com*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=698066
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @grant           GM_setValue
// @grant           GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/382889/SwaggerKeys.user.js
// @updateURL https://update.greasyfork.org/scripts/382889/SwaggerKeys.meta.js
// ==/UserScript==

// Since v01.1: moving out setTamperIcon
// Since v01.0: Someone had a typo in Confluence, so one of the prod boxes was missed.  Added.
// Since v00.0: init, copying from GitLab Avatars script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';

    var TIMEOUT = 750,
        global = {
            ids: {
                scriptName: 'SwaggerKeys',
                prefsName: 'SwaggerKeysPrefs',
                triggerElement: '#swagger-ui'
            },
            states: {
                areClassesAdded: false,
                isMouseMoved: false
            },
            prefs: undefined
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    tm.setTamperIcon(global.ids.scriptName, global.ids.prefsName, global.prefs);
                    page.setPrefs();
                    page.addClasses();
                    page.populateKeys();
                }, TIMEOUT);
            },
            setPrefs: function() {
                global.prefs = GM_getValue(global.ids.prefsName) != null ? JSON.parse(GM_getValue(global.ids.prefsName)) : {}
                if (global.prefs.partnerKey == null) global.prefs.partnerKey = 'Click battery icon in lower-right to set';
            },
            addClasses: function () {
                if (!global.states.areClassesAdded) {
                    global.states.areClassesAdded = true;

                    // generic
                    // tm.addGlobalStyle('.fingery { margin:0px 13px; cursor:pointer; }');
                }
            },
            populateKeys: function () {
                var origin = window.location.origin;
                if (origin.indexOf('prod-stage') > -1 || origin.indexOf('ausmpc') > -1 || origin.indexOf('ausmsc') > -1) {
                    var keys = $('input[placeholder="x-dell-dais-sa-subscriber-id"]');
                    _.each(keys, (key) => {
                        $(key).val(global.prefs.partnerKey).css('border-color', 'green');
                    });
                } else {
                    tm.log(origin);
                }
            }
        };

    /*
     * Global functions
     */

    function initScript () {
        tm.getContainer({
            'el': global.ids.triggerElement,
            'max': 100,
            'spd': 1000
        }).then(function($container){
            page.initialize();
        });
    }
    initScript();

    $(document).mousemove(function(e) {
        if (!global.states.isMouseMoved) {
            global.states.isMouseMoved = true;
            setTimeout(function() {
                global.states.isMouseMoved = false;
            }, TIMEOUT * 2);
            initScript();
        }
    });

})();