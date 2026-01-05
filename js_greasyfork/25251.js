// ==UserScript==
// @name			Dell Acronyms
// @namespace		COMDSPDSA
// @icon            https://www.localhost:8675/dictionary.png
// @version			11.7
// @description		Enhances acronyms used by Dell with highlighted explanation text
// @author			Dan Overlander
// @locale          English (en)
// @include			*/localhost*
// @include         *preol.dell.com*
// @include         *tfs2.dell.com*
// @include         *sales*dell.com*
// @include         *dcsoctopus.dell.com*
// @include         *gitlab.dell.com*
// @exclude         */swagger/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=907043
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/25251/Dell%20Acronyms.user.js
// @updateURL https://update.greasyfork.org/scripts/25251/Dell%20Acronyms.meta.js
// ==/UserScript==

// Since v11.6: Runs on Gitlab. Removing dorkforce references. Updating Tampermonkey Support library.
// Since v11.5: Removes Tamper Global script dependency
// Since v11.4: Changed icon to "dictionary", not "translate"
// Since v11.3: Colorized icon
// Since v11.2: Minor mistake, keying off of wrong element for Partner UX. Changing to one that is on all pages.
// Since v11.1: Optimization
// Since v11.0: moving out setTamperIcon
// Since v10.5: Fixed the popup dictionary so that it doesn't highlight the popup.
// Since v10.4: Alphabetized JSON output. cache-related issues.
// Since v10.3: Revert host to localhost; this thing isn't getting used by anyone else at the moment, anyway, I think.
// Since v10.2: Putting on-click method back as activation method; mouse movement causes intermittent lag. swapping localStorage with GM_ *, removing TFS as a target as it seems to take too long
// Since v10.1: Forgotten TIMEOUT definition
// Since v09: Changed globals to global. Upgraded tampericon method.  Upgraded to mouseMovement trigger
// Since v08: Added localStorage copy of acronyms.  working on user-customizable JSON
// Since v07: Rolled Back v06
// Since v05: Added Octopus to domain range
// Since v04: Changed json host from local 127.0.0.1 to 10.210.54.243
// Since v03: Tweaked layout of rows in tm popup
// Since v02: Cleans up the @includes.
//            Reduces the number of Dell sites that the script runs on.
// Since v01: increments tm support library
//          : popup styles moved to TFS2016 global script
//          : tweaks hilitor to allow spaces in tags
// Since v00: Initial Script

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';

    var global = {
        TIMEOUT: 750,
        ids: {
            scriptName: 'Dell Acronyms',
            prefsName: 'acronymPrefs',
            popupId: 'glossaryWindow',
            triggerElements: ['body']
        },
        prefs: {},
        handlePrefsLocally: true,
        states: {
            debugMode: false,
            areClassesAdded: false
        },
        data: {
            extHost: 'http://localhost:8675/',
            extFile: 'acronyms.json',
            acronyms: [],
            refreshTimer: undefined,
            refreshTimedOut: true,
            refreshDelayDefault: 20,
            refreshDelay: 20
        }
    },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.addClasses();
                    tm.addClasses();
                    tm.setTamperIcon(global);
                    page.appendTamperIcon();
                    page.loadAcronyms();
                    page.addTamperHelp();
                }, global.TIMEOUT);
            },
            addClasses: function () {
                if (!global.states.areClassesAdded) {
                    global.states.areClassesAdded = true;

                    // styles for ID-linked quickview/popup are defined in TFS2016 Global script
                    // adding to that:
                    tm.addGlobalStyle('.popupDetailContent textarea { width: 90%; }');
                    tm.addGlobalStyle('.acronymButton {position:fixed; z-index:999999999; bottom:20px; right:20px; left:unset; content: url(' + global.data.extHost + 'dictionary.png); width:16px; height:16px;}');

                }
            },
            appendTamperIcon: function () {
                // Add Tampermonkey Icon with label to identify this script
                if($('.acronymButton').length === 0) {
                    $('.tamperlabel').before('<span class="acronymButton"></span>');
                }
            },
            loadAcronyms: function () {
                if ($('#' + global.ids.popupId).length > 0) {
                    if (global.states.debugMode) tm.log('popup is open; not loading');
                    return;
                }
                if (global.data.acronyms.length === 0) {
                    if (global.states.debugMode) tm.log('loading acronyms');
                    var jqxhr = $.getJSON( global.data.extHost + global.data.extFile, function(data) {
                        if (global.states.debugMode) tm.log( "jqxhr success" );
                        //GM_setValue('localAcronyms', JSON.stringify(data));
                        page.parseAcroJson(data);
                    }).done(function() {
                        if (global.states.debugMode) tm.log( "jqxhr second success" );
                        page.findAcronyms();
                    }).fail(function() {
                        if (global.states.debugMode) tm.log( "jqxhr error" );
                    }).always(function() {
                        if (global.states.debugMode) tm.log( "jqxhr complete" );
                    });
                } else {
                    page.findAcronyms();
                }
            },
            parseAcroJson(data) {
                $.each( data.glossary.acronyms, function( key, val ) {
                    global.data.acronyms.push({'tag': val.tag, 'hint': val.hint});
                });
                global.data.acronyms.sort(function(el1,el2){
                    return utils.compare(el1, el2, 'tag')
                });
            },
            findAcronyms: function () {
                return; // do not do this, as it can replace values within input fields... :S
                // calculate timed delay
                var now = moment(),
                    delay = Number(global.data.refreshDelay);
                if (!global.data.refreshTimer) global.data.refreshTimer = now;
                if (now.diff(global.data.refreshTimer, 'seconds') >= delay) {
                    global.data.refreshTimer = null;
                    global.data.refreshTimedOut = true;
                }

                if (global.data.refreshTimedOut) {
                    if (global.states.debugMode) tm.log('finding acronyms');
                    global.data.refreshTimedOut = false;
                    global.data.refreshDelay += global.data.refreshDelayDefault; // slow down each further search until mouse click reset

                    // highlight acronyms
                    var hiliteDiscussion = new Hilitor();
                    _.each(global.data.acronyms, function (nym) {
                        hiliteDiscussion.apply(nym);
                    });

                    /*
                $('iframe').each(function() {
                    var myFrame = $(this);
                    try {

                        //_.each(sourceNyms, function (nym) {
                            //console.log(myFrame.contentDocument.documentElement.innerText);
                        //    myFrame.contentDocument.documentElement.innerText = myFrame.contentDocument.documentElement.innerText.replace('/' + nym[0].acronym + '/g', nym[0].definition);
                        //});
                    }
                    catch (e) {
                        console.log(e);
                    }
                });
                */
                }
            },
            showGlossaryPopup: function() {
                var modalId = global.ids.popupId,
                    modalBody = '',
                    addCloseButton = function() {
                        return '<div class="popupDetailTitle">&nbsp;</div><div class="popupDetailContent" style="text-align:right;"><button class="closeAcros">Close</button></div>';
                    };

                modalBody += addCloseButton();
                _.each(global.data.acronyms, function (nym) {
                    modalBody += '<div class="popupDetailTitle fingery">' + nym.tag + ':</div><div class="popupDetailContent">' + nym.hint + '</div>';
                });
                modalBody += addCloseButton();

                tm.showModal(modalId, modalBody);

                // hide the default popup Close because for some weird reason it's not working
                $('.popupDetailContent.fingery').hide();

                $('.closeAcros').on('click', function() {
                    $('#' + modalId).remove();
                });

                return false;
            },
            addTamperHelp: function () {
                tm.getContainer({
                    'el': '.acronymButton'
                }).then(function($container){
                    $('.acronymButton').css('cursor', 'pointer').unbind('click').on('click', function () {
                        if (global.states.debugMode) tm.log('.acronymButton clicked');
                        page.showGlossaryPopup();
                    });
                });
            }
        },
        utils = {
            compare: function(el1, el2, index) {
                return el1[index] == el2[index] ? 0 : (el1[index] < el2[index] ? -1 : 1);
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
            }

        };

    /*
     * Global functions
     */

    // Original Hilitor JavaScript code by Chirp Internet: www.chirp.com.au
    // Please acknowledge use of this code by including this header.
    function Hilitor(id, tag) {
        var targetNode = document.getElementById(id) || document.body;
        var hiliteTag = tag || "EM";
        var skipTags = new RegExp("^(?:" + hiliteTag + "|SCRIPT|FORM|SPAN)$");
        var colors = ["#87CEEB", "#96D5ED", "#A8DCF0", "#B9E3F3", "#CBEAF6"];
        var wordColor = [];
        var colorIdx = 0;
        var matchRegex = "";
        var openLeft = false;
        var openRight = false;

        this.setMatchType = function(type) {
            switch(type) {
                case "left":
                    this.openLeft = false;
                    this.openRight = true;
                    break;
                case "right":
                    this.openLeft = true;
                    this.openRight = false;
                    break;
                case "open":
                    this.openLeft = this.openRight = true;
                    break;
                default:
                    this.openLeft = this.openRight = false;
            }
        };

        this.setRegex = function(input) {
            //input = input.replace(/^[^\w]+|[^\w]+$/g, "").replace(/[^\w'-]+/g, "|");
            input = input.replace(/^\||\|$/g, "");
            if(input) {
                var re = "(" + input + ")";
                if(!this.openLeft) re = "\\b" + re;
                if(!this.openRight) re = re + "\\b";
                matchRegex = new RegExp(re, "i");
                return true;
            }
            return false;
        };

        this.getRegex = function() {
            var retval = matchRegex.toString();
            retval = retval.replace(/(^\/(\\b)?|\(|\)|(\\b)?\/i$)/g, "");
            retval = retval.replace(/\|/g, " ");
            return retval;
        };

        // recursively apply word highlighting
        this.hiliteWords = function(node, tag, hint) {
            if(node === undefined || !node) return;
            if(!matchRegex) return;
            if(skipTags.test(node.nodeName)) return;

            if(node.hasChildNodes()) {
                for(var i=0; i < node.childNodes.length; i++)
                    this.hiliteWords(node.childNodes[i], tag, hint);
            }
            if(node.nodeType == 3) { // NODE_TEXT
                var nv, regs;
                if((nv = node.nodeValue) && (regs = matchRegex.exec(nv))) {
                    if(!wordColor[regs[0].toLowerCase()]) {
                        wordColor[regs[0].toLowerCase()] = colors[colorIdx++ % colors.length];
                    }

                    var match = document.createElement(hiliteTag);
                    match.appendChild(document.createTextNode(regs[0]));
                    match.style.backgroundColor = wordColor[regs[0].toLowerCase()];
                    match.style.fontStyle = "inherit";
                    match.style.color = "#000";
                    match.className += " " + tag.replace(/([+-.,!@#$%^&*();\/|<>"'])| /g, '_');

                    var after = node.splitText(regs.index);
                    after.nodeValue = after.nodeValue.substring(regs[0].length);
                    node.parentNode.insertBefore(match, after);
                    $('.'+tag.replace(/([+-.,!@#$%^&*();\/|<>"'])| /g, '_')).prop('title', hint);
                }
            }
        };

        // remove highlighting
        this.remove = function() {
            var el,
                arr = document.getElementsByTagName(hiliteTag);
            while(arr.length && (el = arr[0])) {
                var parent = el.parentNode;
                parent.replaceChild(el.firstChild, el);
                parent.normalize();
            }
        };

        // start highlighting at target node
        this.apply = function(input) {
            //this.remove();
            if(input === undefined || !input) return;
            var tag = input.tag,
                hint = input.hint;
            if(this.setRegex(tag)) {
                this.hiliteWords(targetNode, tag, hint);
            }
        };

    }

    (function() { // Startup Functions
        if (global.states.debugMode) tm.log('Global initialization of ' + global.ids.scriptName);
        setTimeout(utils.initScript, global.TIMEOUT * 2);
        $(document).on('click', function(e) {
            global.data.refreshDelay = global.data.refreshDelayDefault;
        });
        $(document).mousemove(function(e) {
            if (!global.states.isMouseMoved) {
                global.states.isMouseMoved = true;
                setTimeout(function() {
                    global.states.isMouseMoved = false;
                }, global.TIMEOUT * 2);
                utils.initScript();
            }
        });
    })(); // Global Functions



})();