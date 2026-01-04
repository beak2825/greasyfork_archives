// ==UserScript==
// @name			DOM Assistant
// @namespace		COMDSPDSA
// @version			2
// @description		Check DOM for duplciate IDs, bad aria settings
// @author			Dan Overlander
// @include         *
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=730858
// @require         https://greasyfork.org/scripts/383641-aria-favlets/code/ARIA%20Favlets.js?version=831683
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/426479/DOM%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/426479/DOM%20Assistant.meta.js
// ==/UserScript==

// Since v01: updated library version
// Since v00: initial script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */
(function() {
    'use strict';

    var TIMEOUT = 250,
        global = {
            scriptName: 'DOM Assistant',
            prefsName: 'domAssistPrefs',
            prefs: {},
            mems: global != null ? global.mems : {}, // memsName: 'uiMems', // currently no need to actually save these ??
            triggerElements: ['.icon-ui-dell', '.dds__container'],
            isMouseMoved: false,
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.setPrefs();
                    //page.setMems(); // currently no need to actually save these ??
                    page.addClasses();
                    tm.addClasses();
                    tm.setTamperIcon(global);
                    tm.checkNotes(global);
                    page.analyzeDOM();
                }, TIMEOUT);
            },
            setPrefs: function () {
                var currentPrefs = GM_getValue(global.prefsName);
                if (currentPrefs == null || _.isEmpty(JSON.parse(currentPrefs))) {
                    global.prefs = {
                        debugMode: 'false'
                    };
                    tm.savePreferences(global.prefsName, global.prefs);
                } else {
                    global.prefs = JSON.parse(currentPrefs);
                }
            },
            //             setMems: function () { // currently no need to actually save these ??
            //                 var currentMems = GM_getValue(global.memsName);
            //                 if (currentMems == null || _.isEmpty(JSON.parse(currentMems))) {
            //                     global.mems = {
            //                         dupedIds: []
            //                     };
            //                     tm.savePreferences(global.memsName, global.mems);
            //                 } else {
            //                     global.prefs = JSON.parse(currentMems);
            //                 }
            //             },
            addClasses: function () {
                if (!global.areClassesAdded) {
                    global.areClassesAdded = true;

                    // ARIA button
                    tm.addGlobalStyle('.ariaButton {position:fixed; z-index:999999999; bottom:0px; right:40px; left:unset; content: url("https://www.dorkforce.com/dsa/preferences-desktop-accessibility-icon.png"); width:16px; height:16px;}');
                }
            },
            analyzeDOM: function() {
                var badElements,
                    publishNote = function(badElements, messageType) {
                    if (badElements.length > 0) {
                        var logIt = ''
                        _.each(badElements, (thisId) => {
                            logIt += thisId + ', ';
                        });
                        logIt = logIt.trim().replace(/(^,)|(,$)/g, '');
                        var logMessage = {
                            'type': messageType,
                            'note': logIt
                        };
                        if (global.prefs.debugMode === 'true') console.dir(logMessage);
                        tm.addNote(global, logMessage);
                    }
                };
                var addToBadList = function(badElements, which) {
                    if (which.id != null && which.id != '') {
                        badElements.push('#' + which.id);
                    } else if (which.className != null && which.className != '') {
                        badElements.push('((' + which.className + '))');
                    } else if (which.innerText != null) {
                        badElements.push('"' + which.innerText + '"');
                    } else {
                        badElements.push('"Unidentified Element"');
                    }
                };
                ////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////
                // 1. Check for DUPLICATE ID VIOLATIONS
                badElements = global.mems.dupedIds || [];
                var initCount = badElements.length;
                $('[id]').each(function(){ // scan for exact duplicates
                    var ids = $('[id="'+this.id+'"]');
                    if(ids.length>1 && ids[0]==this) {
                        if (badElements.indexOf(this.id) < 0) {
                            badElements.push(this.id);
                        }
                    }
                });
                publishNote(badElements, 'Duplicate IDs found');
                global.mems.dupedIds = badElements;
                ////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////
                // 2. Check for Possible Badly-formed ID's
                badElements = [];
                $('[id]').each(function(){
                    if (this.id.match(/[0-9]{3,}/g) != null) {
                        badElements.push(this.id);
                    }
                });
                publishNote(badElements, 'Possibly Bad IDs');
                ////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////
                // 3. Check for missing ARIA properties on BUTTONS
                badElements = [];
                $('button').each(function(){
                    if (this.outerHTML.indexOf('aria-label') < 0 && this.outerHTML.indexOf('aria-hidden') < 0) {
                        addToBadList(badElements, this);
                    }
                });
                publishNote(badElements, 'Buttons lacking aria-label');
                ////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////
                // 4. Check for missing ARIA properties on H- tags
                badElements = [];
                $(':header').each(function(){
                    if (this.outerHTML.indexOf('aria-label') < 0 && this.outerHTML.indexOf('aria-hidden') < 0) {
                        addToBadList(badElements, this);
                    }
                });
                publishNote(badElements, 'Headers lacking aria-label');
                ////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////
                // 5. Check for missing ALT tags on IMAGES
                badElements = [];
                $('img').each(function(){
                    if (this.outerHTML.indexOf('alt') < 0) {
                        addToBadList(badElements, this);
                    }
                });
                publishNote(badElements, 'Buttons lacking ALT');
                ////////////////////////////////////////////////////////////////////////////////////
                ////////////////////////////////////////////////////////////////////////////////////
                // 5. Check for missing labels on inputs
                badElements = [];
                $('input').each(function(){
                    if ($('label[for="' + $(this).prop('id') + '"]').length === 0) {
                        addToBadList(badElements, this);
                    }
                });
                publishNote(badElements, 'Inputs lacking labels');
                ////////////////////////////////////////////////////////////////////////////////////
            },
        };

    /*
     * Global functions
     */

    function initScript () {
        _.each(global.triggerElements, function (trigger) {
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

    $(document).mousemove(function(e) {
        if (!global.isMouseMoved) {
            global.isMouseMoved = true;
            setTimeout(function() {
                global.isMouseMoved = false;
            }, TIMEOUT * 2);
            initScript();
        }
    });

    window.onresize = function(event) {
        initScript();
    };


})();