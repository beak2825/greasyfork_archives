// ==UserScript==
// @name			Video Deterrent
// @namespace		COMDSPDSA
// @version			1.1
// @description		Makes Video sites like Youtube annoying
// @author			Dan Overlander
// @include			*youtube.com*
// @include			*Vimeo.com*
// @include			*DTube.com*
// @include			*Internet Archives Video Section.com*
// @include			*Metacafe.com*
// @include			*9GAG TV.com*
// @include			*Dailymotion.com*
// @include			*Vevo.com*
// @include			*Twitch.com*
// @include			*TED.com*
// @include			*Crackle.com*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=907043
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @resource        https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
// @grant           GM_setValue
// @grant           GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/425635/Video%20Deterrent.user.js
// @updateURL https://update.greasyfork.org/scripts/425635/Video%20Deterrent.meta.js
// ==/UserScript==

// Since v01.0: Rename. Run on more sites. Hide vids as well
// Since v00.0: init, copying from Gitlab Mods script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';

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
        getElementByTextContent: function (str, partial, parentNode, onlyLast) {
            var filter = function(elem) {
                var isLast = onlyLast ? !elem.children.length : true;
                var contains = partial ? elem.textContent.indexOf(str) > -1 :
                elem.textContent === str;
                if (isLast && contains) {
                    return NodeFilter.FILTER_ACCEPT;
                }
            };
            filter.acceptNode = filter; // for IE
            var treeWalker = document.createTreeWalker(
                parentNode || document.documentElement,
                NodeFilter.SHOW_ELEMENT, {
                    acceptNode: filter
                },
                false
            );
            var nodeList = [];
            while (treeWalker.nextNode()) nodeList.push(treeWalker.currentNode);
            return nodeList;
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
        savedMems: function() {
            return JSON.parse(GM_getValue(global.ids.memsName));
        }
    };
    var TIMEOUT = 750,
        global = {
            ids: {
                scriptName: 'Video Deterrent',
                prefsName: 'VDPrefs',
                memsName: 'VDMems', // using this as a system-memory kind of thing.  Like the prefs but the user doesn't see them
                triggerElements: ['body'],
                listeners: []
            },
            states: {
                areClassesAdded: false,
                isMouseMoved: false
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
                    page.addMasking();
                }, TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName),
                    setDefaultPrefs = function() {
                        if (global.prefs.debugMode == null)               global.prefs.debugMode = false;
                        // if (global.prefs.debugMode == null)               global.prefs.debugMode = false;
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
                    // global.mems.someProperty = 'someValue';
                    tm.savePreferences(global.ids.memsName, global.mems);
                } else {
                    global.mems = JSON.parse(currentMems);
                }
                $('.line, .line span').css('font-size', global.mems.currentFontSize);
            },
            addClasses: function () {
                if (!global.states.areClassesAdded) {
                    global.states.areClassesAdded = true;

                    // tm.addGlobalStyle('.userPopMenu { margin:0; padding:1rem; }' +
                    //                   '.userPopMenu li { list-style-type: none; }');
                }
            },
            addMasking: function () {
                // if (!document.getElementById('whitenoise') && global.prefs.video != '') {
                //     $('body').append('<div id="whitenoise"><iframe id="whitenoiseEmbed" src="https://www.youtube.com/embed/' + global.prefs.video + '?rel=0&autoplay=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
                //     function fitvid () {
                //         $('#whitenoise').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });
                //         $('#whitenoiseEmbed').css({ width: $(window).innerWidth() + 'px', height: $(window).innerHeight() + 'px' });
                //     }
                //     $(window).resize(function(){
                //         fitvid();
                //     });
                //     fitvid();
                //     $('#p1').after('<div id="coverVideo"></div>');
                // }
                [...document.querySelectorAll('audio, video')].forEach(el => {
                    el.style.display = 'none';
                    el.muted = true;
                });
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
                if (document.getElementById('GitlabModsOptions') == null) { // don't re-init the script when a popup is open
                    utils.initScript();
                }
            }
        });
    }, TIMEOUT);

})();