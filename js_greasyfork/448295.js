// ==UserScript==
// @name			DDS Debug Tool
// @namespace		COMDSPDSA
// @version			1.0
// @description		Tools for debugging DDS components
// @author			Dan Overlander
// @include			*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=1061286
// @require         https://greasyfork.org/scripts/40055-libraryjquerygrowl/code/libraryJQueryGrowl.js
// @grant           GM_setValue
// @grant           GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/448295/DDS%20Debug%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/448295/DDS%20Debug%20Tool.meta.js
// ==/UserScript==

// Since v00.0: init, copying from AriaAssistant script

// tm is an object included via @require from DorkForce's Tampermonkey Assist script
const monkey = tm;
let debugPassFail = [];

(function () {
//    const foundEls = []; // keeps a log of elements that are found and initialized, so as not to try reinitializing them
// export interface ObserverDef {
//   single: boolean;
//   selector: String;
//   callback: (elem: any) => void;
// }
const observers = {
    /**
     * handler to process user-defined callback when element is located in DOM
     * @param {NodeList} elements - All elements found matching the user-defined selector in "observerDefs"
     * @return {void}
     */
    handleFound: (elements, observerDef) => {
        elements.forEach((element) => {
            observerDef.callback(element, observerDef);
            // if (!foundEls.includes(element.id)) {
            //     foundEls.push(element.id);
            // }
        });
    },
    /**
     * Creates a single-use observer to await the existance of a DOM element
     * @param {Array<ObserverDef>} observerDefs - an array of elements to await
     * @return {Array<observer} observers - an array of all MutationObservers created
     */
    create: (observerDefs) => {
        // As assistance for delayed initialization, define an observer to watch for changes
        var observerList = [];
        observerDefs.forEach(function (obd) {
            if (obd.single == null) {
                obd.single = true;
            }
            observerList.push(
                new MutationObserver(function (mutations, me) {
                    var targetElems = document.querySelectorAll(obd.selector);
                    if (targetElems.length > 0) {
                        observers.handleFound(targetElems, obd);
                        if (obd.single) {
                            me.disconnect(); // stop observing
                        }
                        return;
                    }
                })
            );
        });
        // start observing
        observerList.forEach(function (observer) {
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        });
        return observerList;
    }
}
const report = {
    start: (id) => {
        if (debugPassFail.length > 0) {
            utils.debug([`Reporting Error!`, debugPassFail, id]);
        }
        debugPassFail = [];
        debugPassFail.push({
            id: id,
            step: `start`,
            pass: true,
        });
    },
    abort: () => {
        report.step(`not needed`);
        report.finish();
    },
    step: (step, pass = true) => {
        let thisId = debugPassFail[0] ? debugPassFail[0].id : `???`;
        debugPassFail.push({
            id: thisId,
            step: step,
            pass: pass,
        });
    },
    finish: () => {
        const pass = [];
        const fail = [];
        if (debugPassFail.length === 0) {
            return;
        }
        if (debugPassFail.length === 1) {
            report.step(`did nothing`, false);
        }
        debugPassFail.forEach(pf => {
            if (pf.pass) { pass.push(pf); };
            if (!pf.pass) { fail.push(pf); };
        });
        if (fail.length > 0) {
            utils.debug({
                iAm: fail[0].id,
                ...fail
            });
        } else if (pass.length > 0 && !global.prefs.debugIgnores.includes(`pass`)) {
            utils.debug({
                iAm: pass[0].id,
                ...pass
            });
        }
        debugPassFail = [];
    },
};
const utils = {
    addEventListenerAll: (target, listener, ...otherArguments) => {

        // install listeners for all natively triggered events
        for (const key in target) {
            if (/^on/.test(key)) {
                const eventType = key.substr(2);
                target.addEventListener(eventType, listener, ...otherArguments);
            }
        }

        // dynamically install listeners for all manually triggered events, just-in-time before they're dispatched ;D
        const dispatchEvent_original = EventTarget.prototype.dispatchEvent;
        function dispatchEvent(event) {
            target.addEventListener(event.type, listener, ...otherArguments);  // multiple identical listeners are automatically discarded
            dispatchEvent_original.apply(this, arguments);
        }
        EventTarget.prototype.dispatchEvent = dispatchEvent;
        if (EventTarget.prototype.dispatchEvent !== dispatchEvent) throw new Error(`Browser is smarter than you think!`);

    },
    capitalize: (cap) => {
        if (!cap) {
            return;
        }
        return cap.charAt(0).toUpperCase() + cap.slice(1);
    },
    createElement: (a, b) => {
        var d = document.createElement(a);
        if (b && "object" == typeof b) {
            var e;
            for (e in b) {
                if ("html" === e) {
                    d.innerHTML = b[e];
                } else {
                    if (e.slice(0, 5) === "aria_" || e.slice(0, 5) === "data_") {
                        var attr = e.slice(0, 4) + "-" + e.slice(5);
                        d.setAttribute(attr, b[e]);
                    } else {
                        d.setAttribute(e, b[e]);
                    }
                }
            }
        }
        return d;
    },
    dashCamel: function (key) {
        return key.replace(/-[a-z]/g, (m) => m.toUpperCase().replace(/-/gi, ""));
    },
    debug: (msg) => {
        const iAm = msg.iAm ? msg.iAm : debugPassFail[0] ? debugPassFail[0].id : `undefined`;
        let shouldIgnore = false;
        let userSelectedIgnore = [iAm].filter(function (iAmCheck) {
            return global.prefs.debugIgnores.some(function (match) {
                return iAmCheck.toLowerCase().indexOf(match.toLowerCase()) !== -1;
            });
        });
        shouldIgnore = userSelectedIgnore.length > 0;
        if (utils.stringToBoolean(global.prefs.debugMode) && !shouldIgnore) {
            if (typeof msg === 'object') {
                let hasSource = false;
                if (msg.constructor === Array) {
                    msg.includes("iAm") && (hasSource = true);
                    shouldIgnore = global.prefs.debugIgnores.includes(msg.find(id => id === "iAm"));
                } else {
                    const keys = Object.keys(msg);
                    keys.forEach((key) => {
                        !hasSource && (hasSource = key === "iAm");
                    });
                    shouldIgnore = global.prefs.debugIgnores.includes(msg.iAm);
                }
                if (hasSource) {
                    !shouldIgnore && console.log(msg);
                } else {
                    console.log({ 'iAm': iAm, ...msg });
                }
            } else {
                console.log({ 'iAm': iAm, 're': msg });
            }
        }
    },
    delayUntil: function (id, condition, callback) {
        const repeat = (id, co, ca) => {
            setTimeout(() => {
                utils.delayUntil(id, co, ca);
            }, global.constants.TIMEOUT * 2);
        };
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
    getElementByTextContent: (text, tagName = `span`) => {
        var spanList = document.getElementsByTagName(tagName);
        for (var i = 0, len = spanList.length; i < len; i++) {
            if (spanList[i].textContent === text) {
                return spanList[i];
            }
        }
    },
    getElementsByTextContent: (text, tagName = `span`) => {
        const spanList = document.getElementsByTagName(tagName);
        const returnList = [];
        for (var i = 0, len = spanList.length; i < len; i++) {
            if (spanList[i].textContent === text) {
                returnList.push(spanList[i]);
            }
        }
        return returnList;
    },
    highlight: (element) => {
        let defaultBG = element.style.backgroundColor;
        let defaultTransition = element.style.transition;
        let defaultOutline = element.style.outline;

        element.style.transition = "background 1s";
        element.style.backgroundColor = "#FDFF47";
        element.style.outline = '#f00 solid 4px';

        setTimeout(function()
        {
            element.style.backgroundColor = defaultBG;
            element.style.outline = defaultOutline;
            setTimeout(function() {
                element.style.transition = defaultTransition;
            }, 1000);
        }, 1000);
    },
    initScript: () => {
        Object.keys(global.constants.initalizeOnElements).forEach((key) => {
            const trigger = global.constants.initalizeOnElements[key];
            monkey.getContainer({
                'el': trigger,
                'max': 100,
                'spd': 1000
            }).then(function () {
                page.initialize();
            });
        });
    },
    isEmpty: (obj) => {
        return Object.keys(obj).every(key => obj[key] === undefined);
    },
    isNumeric: (n) => {
        return !isNaN(parseFloat(n)) && isFinite(n);
    },
    listenOnce: (element, event, handler) => {
        element.addEventListener(
            event,
            function tempHandler(e) {
                handler(e);
                element.removeEventListener(event, tempHandler, false);
            },
            false
        );
    },
    savedMems: () => {
        return JSON.parse(GM_getValue(global.ids.memsName));
    },
    stringToBoolean: (thisState) => {
        if (typeof thisState === `boolean`) {
            return thisState;
        }
        if (thisState === `1` || thisState === `true`) {
            return true;
        }
        return false;
    },
    xhrAction: (iAm, token, xhrType, urlPath, params, callback, alwaysCallback) => {
        if (!iAm || !token || !xhrType || !urlPath || !callback) {
            utils.debug('improper xhr setup');
            return;
        }
        utils.debug({ 'id': iAm, 'xhrType': xhrType, 'urlPath': urlPath, 'params': params, 'callback': callback, 'alwaysCallback': alwaysCallback });

        // Set up our HTTP request
        const xhr = new XMLHttpRequest();

        // Setup our listener to process completed requests
        xhr.onload = function () {
            global.states.xhrBusy = false;

            // Process our return data
            if (xhr.status >= 200 && xhr.status < 300) {
                // What do when the request is successful
                console.log("SUCCESS");
                const resp = xhr.response;
                if (resp) {
                    // resp = JSON.parse(resp).slice().reverse();
                    utils.debug({ 'id': 'xhrAction', 're': { 'urlPath': urlPath, ...JSON.parse(resp) } });
                    callback(resp);
                }
            } else {
                // What do when the request fails
                utils.debug('XHR Call for ' + iAm + ' failed!');
            }
            if (alwaysCallback) {
                alwaysCallback();
            }
        };
        xhr.open(xhrType, urlPath);
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        if (params != null) {
            xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            xhr.send(JSON.stringify(params));
        } else {
            xhr.send();
        }
    },
};
const global = {
    constants: {
        TIMEOUT: 750,
        initalizeOnElements: ['body'], // .content
    },
    ids: {
        scriptName: 'DdsDebug',
        prefsName: 'DdsDebugPrefs',
        memsName: 'DdsDebugMems',
    },
    states: {
        areClassesAdded: false,
        isMouseMoved: false,
        areStepsAnnounced: false,
        listenersAdded: false,
    },
    prefs: {},
    mems: {},};
const page = {
    initialize: function () {
        page.setPrefs();
        page.setMems();
        monkey.setTamperIcon(global);
        monkey.addClasses();
        const stepsRun = [];
        const steps = [
            page.addClasses,
            mods.interface.addKeys,
            mods.append.addListeners,
        ];
        steps.forEach((step, index) => {
            if (!global.states.areStepsAnnounced) {
                stepsRun.push(step.name);
            }
            setTimeout(() => {
                step();
            }, index * 10);
        });
        if (!global.states.areStepsAnnounced) {
            utils.debug([`INIT`, stepsRun]);
            global.states.areStepsAnnounced = true;
        }
    },
    setPrefs: function () {
        var currentPrefs = GM_getValue(global.ids.prefsName),
            setDefaultPrefs = function () {
                if (!global.prefs.debugIgnores) global.prefs.debugIgnores = [];
                if (!global.prefs.debugMode) global.prefs.debugMode = false;
                if (!global.prefs.addListeners) global.prefs.addListeners = true;
            };

        if (!currentPrefs || utils.isEmpty(JSON.parse(currentPrefs))) {
            global.prefs = {};
            setDefaultPrefs();
            monkey.savePreferences(global.ids.prefsName, global.prefs);
        } else {
            global.prefs = JSON.parse(currentPrefs);
            setDefaultPrefs();
            for (var key in global.prefs) {
                try {
                    if (global.prefs[key] === 'true' || global.prefs[key] === 'false') {
                        global.prefs[key] = (global.prefs[key] == 'true');
                    } else {
                        global.prefs[key] = JSON.parse(global.prefs[key]);
                    }
                } catch (e) {
                    // swallow error. console.error(e);
                }
            }
        }
    },
    setMems: function () {
        var currentMems = GM_getValue(global.ids.memsName);
        if (currentMems == null || utils.isEmpty(JSON.parse(currentMems))) {
            global.mems = {};
            // global.mems.ariaMuteElements = [];
            // global.mems.domHideElements = [];
            monkey.savePreferences(global.ids.memsName, global.mems);
        } else {
            global.mems = JSON.parse(currentMems);
        }
    },
    addClasses: function () {
    report.start(`page.addClasses`);
        if (!global.states.areClassesAdded) {
            global.states.areClassesAdded = true;
            report.step(`classes added`);
        } else {
            report.step(`already added`);
        }
        report.finish();
    },
};
const mods = {
    interface: {
        addKeys: function () {
            if (!global.states.areKeysAdded) {
                global.states.areKeysAdded = true;

                $(document).unbind('keyup');
                $(document).keyup(function(e) {
                    function capital_letter(str)
                    {
                        str = str.split(" ");

                        for (var i = 0, x = str.length; i < x; i++) {
                            str[i] = str[i][0].toUpperCase() + str[i].substr(1);
                        }

                        return str.join(" ");
                    };
                    var keyCodes = [
                        {
                            value: 191,
                            ctrl: true,
                            alt: true,
                            method: () => {
                                document.querySelectorAll(`[data-dds]`).forEach(nodeEl => {
                                    utils.highlight(nodeEl);
                                });
                            },
                            hint: 'Show DDS Elements'
                        }
                    ];

                    keyCodes.forEach(code => {
                        if (e.keyCode === code.value && e.ctrlKey === code.ctrl && e.altKey === code.alt) {
                            code.method.call();
                        };
                    });
                });
            }
        },
    },
    append: {
        addListeners: () => {
            report.start(`append.addListeners`);
            if (!global.prefs.addListeners) {
                report.step(`declined via prefs`);
                report.abort();
                return;
            }
            if (global.states.listenersAdded) {
                report.step(`already added`);
                report.abort();
                return;
            }
            global.states.listenersAdded = true;
            utils.addEventListenerAll(window, (evt) => {
                if (evt.type.match(/dds/)) {
                    // console.log(evt.type, evt.detail);
                    $.growl.notice({
                        message: `${evt.type}<br /><br />${JSON.stringify(evt.detail).replace(/,/g, ', ')}`,
                        size: 'large',
                        delayOnHover: true,
                        duration: 3200 // 3200 is default
                    });
                }
            });
            document.addEventListener(`click`, (e) => {
                if (!e.altKey) {
                    return;
                }
                let ddsEl = e.target;
                while (ddsEl.parentElement && !ddsEl.getAttribute(`data-dds`)) {
                    ddsEl = ddsEl.parentElement;
                }
                const dataDds = ddsEl.getAttribute(`data-dds`);
                if (!dataDds) {
                    $.growl.error({
                        message: `DDS Element not found`,
                        size: 'large',
                        delayOnHover: true,
                        duration: 1600 // 3200 is default
                    });
                    return;
                }
                const ddsObj = utils.capitalize(utils.dashCamel(dataDds));
                let output = Object.keys(ddsEl[ddsObj]).sort().join(`, `);
                $.growl.notice({
                    message: `${ddsObj}: ${output}`,
                    size: 'large',
                    delayOnHover: true,
                    duration: 3200 // 3200 is default
                });
        });
            report.step(`global listeners added`);
            report.finish();
        },
    }
};

(function () { // Global Functions
    document.onmousemove = function () {
        if (!global.states.isMouseMoved) {
            global.states.isMouseMoved = true;
            setTimeout(function () {
                global.states.isMouseMoved = false;
            }, global.constants.TIMEOUT * 2);
            utils.initScript();
        }
    };
})(); // Global Functions
})();
