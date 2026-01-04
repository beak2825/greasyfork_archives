// ==UserScript==
// @name            Google Classroom Helper
// @locale          English (en)
// @namespace       COMDSPDSA
// @version         9
// @description     Adds Review Fast option
// @author          Dan Overlander
// @include         *classroom.google.com*
// @require         https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @require	        https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.10.2/underscore-min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=840325
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/427800/Google%20Classroom%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/427800/Google%20Classroom%20Helper.meta.js
// ==/UserScript==

// Since v08: Works for more students. Still hardcoded.
// Since v07: Bug fixes ?
// Since v06: Compressed height of left-menu links. in-progress fixes for assign-100 button, review page automation.
// Since v05: Removes Tamper Global script dependency
// Since v04: Tweaked colors of backgrounds
// Since v03: Applying classes instead of styles, for proper class spillover
// Since v02: Added another student. Fixed set-to-100 button.
// Since v01: More colors added to the TODO list
// Since v00: initial script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';

    var scriptName = 'Google Classroom Assistant';
    var global =
        {
            ids: {
                scriptName: scriptName,
                prefsName: scriptName.replace(/\s/g, '') + 'Prefs'
            },
            states: {
                isMouseMoved: false,
                areAssignmentsRemoved: false,
                waitForMarkedAsReview: false
            },
            prefs: {},
            handlePrefsLocally: false,
            TIMEOUT: 750,
            targets:[
                {
                    titleElement: '.DPvwYc'
                }
            ],
        },
        toggle = {
            areClassesAdded: false
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    tm.setTamperIcon(global);
                    page.setPrefs();
                    page.addClasses();
                    tm.addClasses();
                    page.applyStyles();
//                     page.removeOffpage();
                    page.scanForTurnedIn();
                    page.scanForDueToday();
                    page.scanForGraded();
                    page.addButtonGrade100();
                    page.addButtonDueDate();
                    // page.reviewAll(); // SEE THE AUTOHOTKEY FUNCTION INSTEAD! Key is Win-N
                }, global.TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName);
                if (currentPrefs == null || _.isEmpty(JSON.parse(currentPrefs))) {
                    // * * * * * DEFINE DEFAULT PREFERENCES HERE * * * * * //  WTF why is it not working - it always does elsewhere
                    if (global.prefs.debugMode == null) global.prefs.debugMode = false;
                    if (global.prefs.studentArray == null) global.prefs.studentArray = [];
                    tm.savePreferences(global.ids.prefsName, global.prefs);
                } else {
                    global.prefs = JSON.parse(currentPrefs);
                }
            },
            addClasses: function () {
                if (!toggle.areClassesAdded) {
                    toggle.areClassesAdded = true;
                    tm.addGlobalStyle('.dueToday { background: darksalmon; }');
                    tm.addGlobalStyle('.turnedIn { background: lightgoldenrodyellow; }');
                    tm.addGlobalStyle('.graded { background: aquamarine; }');
                    tm.addGlobalStyle('.MHxtic { padding:0; }');
                }
            },
            applyStyles: () => {
                _.each($('[aria-label="Teaching"] a'), (aref) => {
                    $(aref).css('height', '2.5rem');
                });
//                 _.each($('[aria-label^="Topic"] li'), (el) => {
//                     $(el).css('height', '2.5rem');
//                 });
            },
            addButtonDueDate: () => {
                if ($('.dueLinked').length > 0) {
                    return;
                }
                var $due = $('p:contains("Due")');
                $due.addClass('dueLinked');
                $due.html('<a href="#" id="dueLink">Due</a>');
                $('#dueLink').on('click', (e) => {
                    console.log('continue this later');
                });
            },
            addButtonGrade100: () => {
                if ($('.grade100').length > 0) {
                    return;
                }
                tm.log('addButtonGrade100');
                var gradeBtn = document.createElement('button');
                gradeBtn.innerText = 'Return 100';
                gradeBtn.classList = 'grade100 btn tBtn';

//                 var targetXpath = document.evaluate("//span[contains(., 'Sort by status')]", document, null, XPathResult.ANY_TYPE, null );
//                 var insertTarget = targetXpath.iterateNext().parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
                var insertTarget = $('td[role="gridcell"]').closest('div');
                if (insertTarget) {
                    insertTarget.append(gradeBtn);
                }

                $('.grade100').on('click', () => {
                    $('span:contains("No grade")').click();
                    setTimeout(() => {
                        // ugh must fix. still hardcoding because setPrefs didn't seem to be working right.
                        let $student;
                        ["Overlander"].forEach((stdnt) => {
                            tm.log('student: ' + stdnt);
                            $student = $(`input[aria-label*="${stdnt}"]`);
                            $student.eq(0).val('100');
                            $student.eq(0).blur();
                            if($student.eq(0).val() == 100 && $('span:contains("No grade")').length === 0) {
                                $('div[role="checkbox"]').eq(0).click();
                                $('span:contains("Return")').closest('div[role="button"]').eq(0).click();
                                tm.getContainer({
                                    'el': 'div[role="alertdialog"]',
                                    'max': 100,
                                    'spd': 1000
                                }).then(function($container){
                                    $('div[role="alertdialog"]').find('span:contains("Return")').click();
                                });
                            } else {
                                tm.log(`Failure trying to set value for ${stdnt} to 100.`);
                            }
                        });
                    }, 250);

                });
            },
            removeOffpage: () => {
                if (!global.states.areAssignmentsRemoved) {
                    var count = 0;
                    var arr = $('div[data-stream-item-type="assignment"]');
                    var assignmentsLoaded =
                        $('div:contains("Graded")').length > 0 ||
                        $('div:contains("Due Today")').length > 0 ||
                        $('div:contains("Turned in")').length > 0
                    if (arr.length > 0 && assignmentsLoaded) {
                        setTimeout(function() {
                            global.states.areAssignmentsRemoved = true;
                            _.each(arr, function(el) {
                                if (count === 0) {
                                    count++;
                                    console.log(el);
                                    console.log($(el));
                                }
//                                 if ($(el).offset().top > window.innerHeight) {
//                                     $(el).remove();
//                                 }
                            });
                        }, global.TIMEOUT);
                    }
            }
            },
            scanForGraded: () => {
                if ($('div:contains("Graded")').length === 0) {
                    setTimeout(page.scanForGraded, global.TIMEOUT);
                } else {
                    $('div').filter(function (){
                        return $(this).text() == 'Graded';
                    }).parent().parent().parent().parent().parent().parent().addClass('graded');
                }
            },
            scanForDueToday: () => {
                if ($('div:contains("Due Today")').length === 0) {
                    setTimeout(page.scanForDueToday, global.TIMEOUT);
                } else {
                    $('.UZ2pse:contains("Due Today")').parent().parent().parent().parent().addClass('dueToday');
                }
            },
            scanForTurnedIn: () => {
                if ($('div:contains("Turned in")').length === 0) {
                    tm.log('Seeking turned in lessons');
                    setTimeout(page.scanForGraded, global.TIMEOUT);
                } else {
                    tm.log('Found lessons that were turned in.');
                    $('div').filter(function (){
                        return $(this).text().indexOf('Turned') > -1 && $(this).prev().text() == '1';
                    }).parent().parent().parent().parent().parent().parent().addClass('turnedIn');
                }
            },
            reviewAll: function() {
                if (global.states.waitForMarkedAsReview || document.URL.indexOf('not-reviewed/all') < 0) {
                    return;
                }
                var clickAction = () => {
                        tm.log('clickAction');
                        var elId = 'span:contains("Mark as reviewed"):visible';
                        if ($(elId).length === 0) {
                            reviewButton.click();
                            global.states.waitForMarkedAsReview = true;
                            tm.getContainer({
                                'el': 'span:contains("Mark as reviewed"):visible',
                                'max': 100,
                                'spd': 1000
                            }).then(function($container){
                                tm.log('found target');
                                global.states.waitForMarkedAsReview = false;
                                var simulateClick = function(element) {
                                    // Simulate mouse down
                                    element.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, view: window }));
                                    // Simulate mouse release
                                    element.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true, view: window }))
                                }
                                //$('span:contains("Mark as reviewed"):visible').trigger(jQuery.Event( "keydown", { keyCode: 13 } ));
//                                 var targetXpath = document.evaluate("//span[contains(., 'Mark as reviewed')]", document, null, XPathResult.ANY_TYPE, null );
//                                 var searchTarget = targetXpath.iterateNext();

//                                 document.querySelector('span:contains("Mark as reviewed"):visible').dispatchEvent(new KeyboardEvent('keydown', { keyCode: 13, ctrlKey: false }));
                                // .dispatchEvent(new MouseEvent("mouseup"));
                                // $('span:contains("Mark as reviewed"):visible').click();
                                simulateClick($container);
                            });
                        }
                    },
                    reviewButton = $('.graded').find('[role="button"]').eq(2);
                if (reviewButton.length < 1) {
                    return;
                }
                clickAction();
            }
        },
        utils = {
            getByClass: function(classname) {
                return document.getElementsByClassName(classname)[0];
            },
            closest: function (el, selector) {
                var matchesFn;

                // find vendor prefix
                ['matches','webkitMatchesSelector','mozMatchesSelector','msMatchesSelector','oMatchesSelector'].some(function(fn) {
                    if (typeof document.body[fn] == 'function') {
                        matchesFn = fn;
                        return true;
                    }
                    return false;
                });

                var parent;

                // traverse parents
                while (el) {
                    parent = el.parentElement;
                    if (parent && parent[matchesFn](selector)) {
                        return parent;
                    }
                    el = parent;
                }

                return null;
            },
            /**
 * Fire an event handler to the specified node. Event handlers can detect that the event was fired programatically
 * by testing for a 'synthetic=true' property on the event object
 * @param {HTMLNode} node The node to fire the event handler on.
 * @param {String} eventName The name of the event without the "on" (e.g., "focus")
 */
            fireEvent: function(node, eventName) {
                // Make sure we use the ownerDocument from the provided node to avoid cross-window problems
                var doc;
                if (node.ownerDocument) {
                    doc = node.ownerDocument;
                } else if (node.nodeType == 9){
                    // the node may be the document itself, nodeType 9 = DOCUMENT_NODE
                    doc = node;
                } else {
                    throw new Error("Invalid node passed to fireEvent: " + node.id);
                }

                var event;
                if (node.dispatchEvent) {
                    // Gecko-style approach (now the standard) takes more work
                    var eventClass = "";

                    // Different events have different event classes.
                    // If this switch statement can't map an eventName to an eventClass,
                    // the event firing is going to fail.
                    switch (eventName) {
                        case "click": // Dispatching of 'click' appears to not work correctly in Safari. Use 'mousedown' or 'mouseup' instead.
                        case "mousedown":
                        case "mouseup":
                            eventClass = "MouseEvents";
                            break;

                        case "focus":
                        case "change":
                        case "blur":
                        case "select":
                            eventClass = "HTMLEvents";
                            break;

                        default:
                            throw "fireEvent: Couldn't find an event class for event '" + eventName + "'.";
                            break;
                    }
                    event = doc.createEvent(eventClass);
                    event.initEvent(eventName, true, true); // All events created as bubbling and cancelable.

                    event.synthetic = true; // allow detection of synthetic events
                    // The second parameter says go ahead with the default action
                    node.dispatchEvent(event, true);
                } else  if (node.fireEvent) {
                    // IE-old school style, you can drop this if you don't need to support IE8 and lower
                    event = doc.createEventObject();
                    event.synthetic = true; // allow detection of synthetic events
                    node.fireEvent("on" + eventName, event);
                }
            }
        };

    /*
     * Global functions
     */

    setTimeout(loopMain, global.TIMEOUT);

    function loopMain () {
        if (document.getElementById(global.targets[0].initializeOnElement) === undefined) {
            setTimeout(loopMain, global.TIMEOUT);
        } else {
            page.initialize();
        }
    }

    $(document).mousemove(function(e) {
        if (!global.states.isMouseMoved) {
            global.states.isMouseMoved = true;
            setTimeout(function() {
                global.states.isMouseMoved = false;
            }, global.TIMEOUT * 2);
            page.initialize();
        }
    });

})();