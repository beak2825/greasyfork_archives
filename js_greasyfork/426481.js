// ==UserScript==
// @name            EventListener Experiment
// @locale          English (en)
// @namespace       COMDSPDSA
// @version         1
// @description     Tweaking internal dev site
// @author          Dan Overlander
// @include         *localhost:3000*
// @include         *localhost:10000*
// @include         *uicore-server*
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=836747
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require	        https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://greasyfork.org/scripts/40055-libraryjquerygrowl/code/libraryJQueryGrowl.js
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/426481/EventListener%20Experiment.user.js
// @updateURL https://update.greasyfork.org/scripts/426481/EventListener%20Experiment.meta.js
// ==/UserScript==

// Since v00: initial script following Jeff Basil template
var myEventManager;

(function() {
    'use strict';

    var utils = {
        initScript: function () {
            _.each(global.constants.initalizeOnElements, (trigger) => {
                tm.getContainer({
                    'el': trigger,
                    'max': 100,
                    'spd': 1000
                }).then(function($container){
                    page.initialize();
                });
            });
        },
        getUrl: function() {
            var pathArray = document.URL.split( '/' );
            var protocol = pathArray[0];
            var host = pathArray[2];
            var url = protocol + '//' + host;
            return url;
        },
        addEvent: function(el, ev, func) {
            if (el.addEventListener) {
                el.addEventListener(ev, func, false);
            } else if (el.attachEvent) {
                el.attachEvent("on" + ev, func);
            } else {
                el["on"+ev] = func; // Note that this line does not stack events. You must write you own stacker if you don't want overwrite the last event added of the same type. Btw, if you are going to have only one function for each event this is perfectly fine.
            }
        },
        rnd: () => {
            return Math.floor(Math.random() * 999999999) + 1;
        },
        flickerElement: ($el) => {
            setTimeout(() => {
                if ($el != null) {
                    $el.addClass('iClicked');
                    setTimeout(() => {
                        $el.removeClass('iClicked');
                    }, 150);
                }
            }, 150);
        },
        announce: function (theMessage) {
            if (global.prefs.debugMode) tm.log(theMessage);
            var randomNum = utils.rnd();
            $('body').prepend('<span style="position:absolute; left:-1000px; width:0;" role="alert" id="ariaRemoved' + randomNum + '">' + theMessage + '</span>');
            $.growl.notice({
                message: theMessage,
                size: 'medium'
            });
            window.setTimeout(() => {
                $('#ariaRemoved' + randomNum).remove();
            }, 5000);
        }
    };

    var global =
        {
            constants: {
                TIMEOUT: 750,
                initalizeOnElements: ['#mainContent', '#dds__full-screen-overlay']
            },
            ids: {
                scriptName: 'UIC Mods',
                prefsName: 'UICPrefs',
                memsName: 'UICMems'
            },
            states: { // TODO: Rework into an array that can be expanded as desired
                isMouseMoved: false,
                areButtonsAdded: false,
                areKeysAdded: false,
                areClassesAdded: false,
                areListenersRedefined: false,
                areListenersAppended: false,
                isDashboardInitialized: false,
                listenersCaptured: false
            },
            prefs: {},
            mems: {}
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.setPrefs();
                    page.setMems();
                    tm.setTamperIcon(global);
                    tm.addClasses();
                    page.addClasses();
                    page.addKeys();
                    // above is kinda standard, below more custom
//                     page.redefineListeners();
//                     page.appendListeners();
//                     page.dashboardListeners();
                    page.captureListeners();
                }, global.constants.TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName),
                    setDefaultPrefs = function() {
                        if (global.prefs.debugMode == null) global.prefs.debugMode = false;
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
                    // global.mems.ariaMuteElements = [];
                    tm.savePreferences(global.ids.memsName, global.mems);
                } else {
                    global.mems = JSON.parse(currentMems);
                }
            },
            addClasses: function () {
                if (!global.states.areClassesAdded) {
                    global.states.areClassesAdded = true;
//                     tm.addGlobalStyle('body {color: white; font-family: sans-serif; font-size: 2rem; padding: 15rem; text-shadow: 5px 5px 5px #000;}');
                }
            },
            addKeys: function () {
                if (!global.states.areKeysAdded) {
                    global.states.areKeysAdded = true;

//                     $(document).unbind('keyup');
//                     $(document).keyup(function(e) {
//                         if (e.keyCode == 70 && e.ctrlKey && e.altKey) { utils.keys.muteElement(); } // Ctrl-Alt-F
//                         if (e.keyCode == 71 && e.ctrlKey && e.altKey) { utils.keys.muteElement('parent'); } // Ctrl-Alt-G
//                         if (e.keyCode == 35 && e.ctrlKey && e.altKey) { utils.keys.muteElement('hide'); } // Ctrl-Alt-End
//                         if (e.keyCode == 74 && e.ctrlKey && e.altKey) { utils.keys.manageMutes(); } // Ctrl-Alt-J
//                         if (e.keyCode == 85 && e.ctrlKey && e.altKey) { utils.keys.manageMutes('hide'); } // Ctrl-Alt-U
//                         if (e.keyCode == 38 && e.ctrlKey && e.altKey) { utils.keys.selectParent(); } // Ctrl-Alt-Up
//                         if (e.keyCode == 40 && e.ctrlKey && e.altKey) { utils.keys.selectChild(); } // Ctrl-Alt-Down
//                         if (e.keyCode == 37 && e.ctrlKey && e.altKey) { utils.keys.selectPrevSibling(); } // Ctrl-Alt-Left
//                         if (e.keyCode == 39 && e.ctrlKey && e.altKey) { utils.keys.selectNextSibling(); } // Ctrl-Alt-Right
//                         if (e.keyCode == 36 && e.ctrlKey && e.altKey) {
//                             global.states.selectElementMode = !global.states.selectElementMode;
//                             utils.announce('HIDE mode: ' + global.states.selectElementMode);
//                         } // Ctrl-Alt-Home
//                         if (e.keyCode == 27) { utils.keys.closePopup(); } // Esc
//                     });
                }
            },
            captureListeners: function () {
                if (global.states.listenersCaptured) {
                    return;
                }
                global.states.listenersCaptured = true;
                myEventManager = (function() {
                    var old = EventTarget.prototype.addEventListener,
                        listeners = [],
                        events = [];

                    EventTarget.prototype.addEventListener = function(type, listener) {

                        function new_listener(listener) {
                            return function(e) {
                                events.push(e);                  // remember event
                                return listener.call(this, e);   // call original listener
                            };
                        }

                        listeners.push([type, listener]);        // remember call
                        return old.call(this, type, new_listener(listener));  // call original
                    };

                    return {
                        get_events: function() { return events; },
                        get_listeners: function() {return listeners; }
                    };

                }());
            },
            appendListeners: function () {
                if (global.states.areListenersAppended) {
                    return;
                }
                global.states.areListenersAppended = true;
                document.documentElement.addEventListener('click', function(e){
                    console.log(e);
                }, true);
            },
            dashboardListeners: function () {
                if (global.states.isDashboardInitialized) {
                    return;
                }
                global.states.isDashboardInitialized = true;
                // Event statistics
                var listenerCount = {};
                var eventCount = {};

                $('body').append('<table id="event-stats" border=1 style="position: absolute; top: 0; left: 0; z-index: 999999;"></table>');

                function renderTable() {
                    var $table = $('#event-stats').html('<tr><th>Event Name</th><th># Listeners</th><th># Handlers Called</th></tr>');
                    for (var name in listenerCount) {
                        $table.append('<tr><td>' + name + '</td><td>' + listenerCount[name] + '</td><td data-name="' + name + '">' + (eventCount[name] || 0) + '</td></tr>');
                    }
                }

                function updateTable(eventName) {
                    $('#event-stats').find('td[data-name=' + eventName + ']').html(eventCount[eventName] || 0);
                }

                // Override for adding event listeners
                var oldAddEventListener = EventTarget.prototype.addEventListener;
                EventTarget.prototype.addEventListener = function(eventName, eventHandler)
                {
                    listenerCount[eventName] = (listenerCount[eventName] || 0) + 1;
                    renderTable();

                    oldAddEventListener.call(this, eventName, function(event) {
                        eventCount[eventName] = (eventCount[eventName] || 0) + 1;
                        updateTable(eventName);
                        eventHandler(event);
                    });
                };
            },
            redefineListeners: function () {
                if (global.states.areListenersRedefined) {
                    return;
                }
                global.states.areListenersRedefined = true;
                // Override for adding event listeners
                var oldAddEventListener = EventTarget.prototype.addEventListener;
                EventTarget.prototype.addEventListener = function(eventName, eventHandler)
                {
                    var $elt = $(this),
                        pos = $elt.offset(),
                        $div = $('<div/>'),
                        numHandlers = $elt.data('number-of-handlers') || 0;
                    console.log(numHandlers);

                    if (pos) {
                        $elt.data('number-of-handlers', numHandlers + 1);
                        $div.css({
                            position: 'absolute',
                            left: pos.left + numHandlers * 11,
                            top: pos.top,
                            width: '10px',
                            height: '10px',
                            padding: 0,
                            margin: 0,
                            border: 'none',
                            'border-radius': 0,
                            'background-color': 'hotpink',
                            'z-index': 99999999
                        });
                        $div.attr('title', eventName + '\n' + eventHandler.toString());
                        $('body').append($div);
                    }

                    oldAddEventListener.apply(this, arguments);
                };

            }
        };

    (function() { // Global Functions
        $(document).click(function(event) {
            if (global.states.selectElementMode === false) {
                return;
            }
            global.focusedElement = $(event.target);
            global.focusedElement.focus();
            utils.flickerElement(global.focusedElement);
        });
        document.onmousemove = function(){
            if (!global.states.isMouseMoved) {
                global.states.isMouseMoved = true;
                setTimeout(function() {
                    global.states.isMouseMoved = false;
                }, global.constants.TIMEOUT * 2);
                utils.initScript();
            }
        };
    })(); // Global Functions
})();
