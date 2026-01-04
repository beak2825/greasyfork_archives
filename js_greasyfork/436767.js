// ==UserScript==
// @name			Confluence Mods
// @namespace		COMDSPDSA
// @version			1.1
// @description		Autoselects the current space for searching
// @author			Dan Overlander
// @include			*confluence.dell.com*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=907043
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @require         https://greasyfork.org/scripts/40055-libraryjquerygrowl/code/libraryJQueryGrowl.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/showdown/1.9.1/showdown.min.js
// @require         https://unpkg.com/popper.js@1
// @require         https://unpkg.com/tippy.js@4
// @resource        https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css
// @grant           GM_setValue
// @grant           GM_getValue
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/436767/Confluence%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/436767/Confluence%20Mods.meta.js
// ==/UserScript==

// TODO: selectSpaceByDefault should happen more than once per page load

// Since v01.0: selectSpaceByDefault tweaks.
// Since v00.0: init, copying from Gitlab Mods script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    var utils = {
		debug: function(msg) {
            let userSelectedIgnore = global.prefs.debugIgnores.includes(utils.debug.caller.name);
			if (global.prefs.debugMode && !userSelectedIgnore) {
                if (typeof msg === 'object') {
                    let hasSource = false;
                    if (msg.constructor === Array) {
                        msg.includes("iAm") && (hasSource = true);
                        userSelectedIgnore = global.prefs.debugIgnores.includes(msg.find(id => id === "iAm"));
                    } else {
                        const keys = Object.keys(msg);
                        keys.forEach((key, index) => {
                            !hasSource && (hasSource = key === "iAm");
                        });
                        userSelectedIgnore = global.prefs.debugIgnores.includes(msg.iAm);
                    }
                    if (hasSource) {
                        !userSelectedIgnore && console.log(msg);
                    } else {
                        console.log({'iAm': utils.debug.caller.name, ...msg});
                    }
                } else {
                    console.log({'iAm': utils.debug.caller.name, 're': msg});
                }
			}
		},
        capitalizeFirstLetter: function(string) {
            if (!string) {
                return;
            }
            return string.charAt(0).toUpperCase() + string.slice(1);
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
        savedMems: function() {
            return JSON.parse(GM_getValue(global.ids.memsName));
        },
        properName: function(thisName) {
            if (!thisName) {
                return;
            }
            var firstName = '',
                lastName = '',
                midName = '';

            thisName = thisName
                .replace('https://gitlab.dell.com/', '')
                .replace(' - Dell Team', '')
                .replace('\'s avatar', '')
                .replace('Assigned to ', '')
                .replace('Avatar for ', '')
                .replace(/dell\.com/gi, '')
                .replace(/dellteam\.com/gi, '')
                .replace('@', '')
                .replace(/@/g, '')
                .replace(/\//g, '')
                .replace(/Review requested from /g, '')
                .replace(/_/g, '-');
            firstName = thisName.substring(0, thisName.indexOf('-'));
            lastName = thisName.substring(thisName.indexOf('-')+1, thisName.length);
            if ((firstName.length === 0 && lastName.length === 0)) {
                return;
            }
            if (firstName.length > 0 && lastName.length > 0 && thisName.indexOf(',') < 0) {
                thisName = lastName + ', ' + firstName;
            }
            if (thisName.indexOf('-') > 0) {
                midName = thisName.substring(0, thisName.indexOf('-'));
                thisName = thisName.substring(thisName.indexOf('-')+1, thisName.length);
                thisName = thisName + ' ' + midName;
            }
            while (thisName.indexOf('  ') > 0) {
                thisName = thisName.replace(/\s\s/, ''); // no double spaces
            }
            thisName = thisName
                .replace(/(\r\n\t|\n|\r\t)/gm,'') // no line breaks or tabs
                .replace(/ ,/, ',') // no spaces before commas
                .replace(/\%20/, '') // no %20 characters
                .replace(/Americas/g, '')
                .trim(); // seriously, no extra spaces
            thisName = thisName.replace(',', ', ').replace('  ', ' '); // there's probably a less-stupid way of REALLY making sure it's always "COMMA SPACE"
            return thisName;
        },
    };
    var TIMEOUT = 750,
        activityTimestamp = moment(),
        avatarHost = 'localhost:8675/', // for setPhoto
        pingPhoto = '!none', // pinging for setPhoto
        imageExt = '.png',
        global = {
            ids: {
                scriptName: 'Confluence Mods',
                prefsName: 'confluencePrefs',
                memsName: 'confluenceMems', // using this as a system-memory kind of thing.  Like the prefs but the user doesn't see them
                triggerElements: ['#content'],
                listeners: [],
            },
            states: {
                areClassesAdded: false,
                delays: [],
                isMouseMoved: false,
                avatarPingFailed: null,
                spaceButtonSet: false,
            },
            prefs: {},
            mems: undefined,
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

                    page.selectSpaceByDefault();
                }, TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName),
                    setDefaultPrefs = function() {
                        if (global.prefs.debugMode == null)                global.prefs.debugMode = false;
                        if (global.prefs.debugIgnores == null)             global.prefs.debugIgnores = [];
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
                    // tm.addGlobalStyle('.ignoreTip { color:lightgray; }');
                }
            },
            selectSpaceByDefault: () => {
                if (global.states.spaceButtonSet) {
                    return;
                }
                global.states.spaceButtonSet = true;

                const baseSearchInput = document.getElementById(`quick-search-query`);
                const pollForSearchClosing = () => { // TODO: selectSpaceByDefault should happen more than once per page load
                    const searchIsOpen = document.querySelector(`.search-container-component`);
                    if (searchIsOpen) {
                        setTimeout(pollForSearchClosing, TIMEOUT);
                    } else {
                        baseSearchInput.removeEventListener(`click`, setSpace);
                        baseSearchInput.addEventListener(`click`, setSpace);
                    }
                };
                const setSpace = (e) => {
                    const spaceButtonSelector = `content-space-search-filter-button`;
                    const spaceListSelector = `content-space-filter-checkbox-list`;
                    tm.getContainer({
                        'el': `#${spaceButtonSelector}`,
                        'max': 100,
                        'spd': 1000,
                    }).then(($container)=>{
                        const spaceButton = document.getElementById(spaceButtonSelector);
                        spaceButton.click();
                    });
                    tm.getContainer({
                        'el': `#${spaceListSelector}`,
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        pollForSearchClosing();
                        const spaceList = document.getElementById(spaceListSelector);
                        const searchField = document.getElementById(`search-filter-input`);
                        spaceList.querySelector(`input`).click();
                        searchField.focus();
                    });
                };
                baseSearchInput.addEventListener(`click`, setSpace);
            },
        };

    setTimeout(function() {
        utils.initScript();
        document.addEventListener('mousemove', function handleMouseEvent () {
            if (!global.states.isMouseMoved) {
                global.states.isMouseMoved = true;
                setTimeout(function() {
                    global.states.isMouseMoved = false;
                }, TIMEOUT * 2);
                if (document.getElementById('ConfluenceModsOptions') == null) { // don't re-init the script when a popup is open
                    utils.initScript();
                    if ($('.line_content').length > 0) {
                        global.states.mergeRequestScanned = false;
                    };

                }
            }
        });
    }, TIMEOUT);

})();