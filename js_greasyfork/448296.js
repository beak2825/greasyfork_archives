// ==UserScript==
// @name			Gitlab Settings Mod
// @namespace		COMDSPDSA
// @version			1.0
// @description		Keeps the settings the way we want them
// @author			Dan Overlander
// @include			*/gitlab.dell.com*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=907043
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @grant           GM_setValue
// @grant           GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/448296/Gitlab%20Settings%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/448296/Gitlab%20Settings%20Mod.meta.js
// ==/UserScript==

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
        },

    };
    var TIMEOUT = 750,
        global = {
            ids: {
                scriptName: 'Gitlab Settings Mod',
                prefsName: 'gitlabSettingsPrefs',
                memsName: 'gitlabSettingsMems',
                triggerElements: ['.content', '#root', '.ide-view'],
            },
            states: {
                areClassesAdded: false,
                isMonitoringSettings: false,
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
                    page.monitorSettings();
                }, TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName),
                    setDefaultPrefs = function() {
                        if (global.prefs.debugMode == null)                global.prefs.debugMode = false;
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
                }
            },
            monitorSettings: () => {
                if (global.states.isMonitoringSettings) {
                    return;
                }
                global.states.isMonitoringSettings = true;
                const loopSettingsCheck = () => {
                    const removeApprovalsUponCommitEl = document.querySelector(`[data-testid="remove-approvals-on-push"]`);
                    if (removeApprovalsUponCommitEl) {
                        const raucInput = removeApprovalsUponCommitEl.querySelector(`input`);
                        if (raucInput.checked) {
                            raucInput.click();
                            setTimeout(() => {
                                raucInput.closest(`form`).querySelector(`button[type="submit"]`).click();
                                location.reload();
                            }, 50);
                        }
                    }
                }
                setInterval(loopSettingsCheck, 1000);
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
            }
        });
    }, TIMEOUT);

})();