// ==UserScript==
// @name			DuckDuckGo Mods
// @namespace		COMDSPDSA
// @version			1.0
// @description		Adjusts DDG site to my preferences
// @author			Dan Overlander
// @include			*duckduckgo.com*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=846669
// @grant           GM_setValue
// @grant           GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/426480/DuckDuckGo%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/426480/DuckDuckGo%20Mods.meta.js
// ==/UserScript==

// Since v00.0: init, copying from GIT Gitlab script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';

    var scriptName = 'DuckDuckGo';
    var utils = {
		debug: function(msg) {
			if (global.prefs.debugMode) {
                if (typeof msg === 'object') {
                    console.log(msg);
                } else {
                    tm.log(msg);
                }
			}
		},
        capitalizeFirstLetter: function(string) {
            if (!string) {
                return;
            }
            return string.charAt(0).toUpperCase() + string.slice(1);
        },
        delayUntil: function (id, condition, callback) {
            var repeat = function(id, co, ca) {
                setTimeout(() => {
                    utils.delayUntil(id, co, ca);
                }, TIMEOUT*2);
            }
            if (!global.states.delays.find((x) => x.delayId === id)) {
                global.states.delays.push({
                    delayId: id,
                    delayCount: 0
                });
            }
            global.states.delays.find((x) => x.delayId === id).delayCount++;
            if (global.states.delays.find((x) => x.delayId === id).delayCount > 20) {
                global.states.delays.find((x) => x.delayId === id).delayCount === 0;
                return;
            }
            try {
                if (!condition()) {
                    utils.debug('delay WAIT called by ' + id);
                    repeat(id, condition, callback);
                } else {
                    utils.debug('delay PASS for ' + id);
                    callback();
                }
            } catch (e) {
                utils.debug('delay WAIT called by ' + id + ' TRIED\n   ' + e);
                repeat(id, condition, callback);
            }
        },
        isNumeric: function(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        },
        initScript: function () {
            _.each(global.ids.triggerElements, (trigger) => {
                tm.getContainer({
                    'el': trigger,
                    'max': 100,
                    'spd': 1000
                }).then(function($container){
                    page.initialize();
                });
            });
        },
        listenOnce: function(element, event, handler) {
            element.addEventListener(
                event,
                function tempHandler(e) {
                    handler(e);
                    element.removeEventListener(event, tempHandler, false);
                },
                false
            );
        },
        showGrowls: function(growlLow, growlMed, growlHigh) {
            if (growlLow && growlLow.length > 0) {
                $.growl.notice({
                    message: '<div class="growlMessage">' + growlLow + '</div>',
                    size: 'large',
                    delayOnHover: true,
                    duration: 3200 // 3200 is default
                });
            }
            if (growlMed && growlMed.length > 0) {
                $.growl.warning({
                    message: '<div class="growlMessage">' + growlMed + '</div>',
                    size: 'large',
                    delayOnHover: true,
                    duration: 6400 // 3200 is default
                });
            }
            if (growlHigh && growlHigh.length > 0) {
                $.growl.error({
                    message: '<div class="growlMessage">' + growlHigh + '</div>',
                    size: 'large',
                    delayOnHover: true,
                    duration: 9600 // 3200 is default
                });
            }
        }
    };
    var TIMEOUT = 750,
        global = {
            ids: {
                scriptName: scriptName + ' Mods',
                prefsName: scriptName + 'Prefs',
                memsName: scriptName + 'Mems',
                triggerElements: ['#search_form_input']
            },
            states: {
                delays: [],
                areElsModded: false
            },
            prefs: {},
            mems: undefined
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.setPrefs();
                    page.setMems();
                    tm.setTamperIcon(global);
                    tm.initNotes(global);
                    tm.addClasses();
                    page.addClasses();
                    page.modElements();
                }, TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName),
                    setDefaultPrefs = function() {
                        if (global.prefs.debugMode == null)               global.prefs.debugMode = false;
                    };

                if (currentPrefs == null || _.isEmpty(JSON.parse(currentPrefs))) {
                    global.prefs = {};
                    setDefaultPrefs();
                    tm.savePreferences(global.ids.prefsName, global.prefs);
                } else {
                    global.prefs = JSON.parse(currentPrefs);
                    setDefaultPrefs();
                    for (var key in global.prefs) {
                        try {
                            if (global.prefs[key] === 'true' || global.prefs[key] === 'false') {
                                global.prefs[key] = (global.prefs[key] == 'true')
                            } else {
                                global.prefs[key] = JSON.parse(global.prefs[key]);
                            }
                        } catch (e) {
                            global.prefs[key] = global.prefs[key];
                        }
                    }
                }
            },
            setMems: function() {
                var currentMems = GM_getValue(global.ids.memsName);
                if (currentMems == null || _.isEmpty(JSON.parse(currentMems))) {
                    global.mems = {};
                    tm.savePreferences(global.ids.memsName, global.mems);
                } else {
                    global.mems = JSON.parse(currentMems);
                }
            },
            addClasses: function () {
                if (!global.states.areClassesAdded) {
                    global.states.areClassesAdded = true;
                    tm.addGlobalStyle('.tamperlabel { cursor: pointer; }');
                }
            },
            modElements: function () {
                if (global.states.areElsModded) {
                    return;
                }
                global.states.areElsModded = true;
                $('#search_form_input').focus();
            }
        };

    setTimeout(function() {
        utils.initScript();
        document.addEventListener('mousemove', function handleMouseEvent () {
            if (!global.states.isMouseMoved) {
                global.states.isMouseMoved = true;
                setTimeout(function() {
                    global.states.isMouseMoved = false;
                }, TIMEOUT * 2);
                if (document.getElementById(global.ids.scriptName + 'Options') == null) { // don't re-init the script when a popup is open
                    utils.initScript();
                }
            }
        });
    }, TIMEOUT);

})();