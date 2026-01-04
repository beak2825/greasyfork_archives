// ==UserScript==
// @name            Pivotal Tracker Mods
// @locale          English (en)
// @namespace       COMDSPDSA
// @version         3.2
// @description     Tweaks for Pivotal Tracker
// @author          Dan Overlander
// @include         *pivotaltracker.com/n/projects*
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=846669
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require	        https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://greasyfork.org/scripts/40055-libraryjquerygrowl/code/libraryJQueryGrowl.js
// @require         https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment-with-locales.min.js
// @require         https://unpkg.com/popper.js@1
// @require         https://unpkg.com/tippy.js@4
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/407849/Pivotal%20Tracker%20Mods.user.js
// @updateURL https://update.greasyfork.org/scripts/407849/Pivotal%20Tracker%20Mods.meta.js
// ==/UserScript==

// TODO: make avatars work.  Use something like: $('a[title="Dan Overlander"]') ... but user names could also be like danoverlander

// Since v03.1: converted onmousemove to interval, since it wasn't working. added option to hide cards' status section on top-level view. Renamed some preferences variables; you must reset Preferences with this version!
// Since v03:   Fixed bugs, hid non-working routines behind options. Moved Pivotal-Gitlab relationship to preferences.
// Since v02:   Copying friendlyDescription from Gitlab script. Prefs window now easier to use (proper JSON display. boolean-toggle buttons.)
// Since v01:   Updated library URL
// Since v00:   initial script following aria assistant template

(function() {
    'use strict';

    var global =
        {
            avatarHost: 'http://localhost:8675/', // for setPhoto
            pingPhoto: '!none', // pinging for setPhoto
            imageExt: '.png',
            constants: {
                TIMEOUT: 100,
                initalizeOnElements: ['.items_container', '.edit']
            },
            ids: {
                scriptName: 'PivotlTrackerMods',
                prefsName: 'PivotlTrackerPrefs',
                memsName: 'PivotlTrackerMems'
            },
            states: {
                isMouseMoved: false,
                areClassesAdded: false,
                msDelayBeforeResumingScan: 0,
                avatarPingFailed: false,
                elScans: 0 // every time we find something to prettify, increment this
            },
            prefs: {},
            mems: {}
        },
        page = {
            initialize: function () {
                page.setPrefs();
                page.setMems();
                tm.setTamperIcon(global);
                tm.addClasses();
                page.addClasses();
                page.addButtons();
                page.friendlyDescription();
                page.tweakStateButtons();
                page.tweakExistingButtons();
                page.tweakLayout();
                page.addAvatars();
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName),
                    setDefaultPrefs = function() {
                        if (global.prefs.debugMode == null)                   global.prefs.debugMode = false;
                        if (global.prefs.hideLabels == null)                  global.prefs.hideLabels = true;
                        if (global.prefs.hideReviewLists == null)             global.prefs.hideReviewLists = true;
                        if (global.prefs.iconizeButtons == null)              global.prefs.iconizeButtons = true;
                        if (global.prefs.useLocalAvatars == null)             global.prefs.useLocalAvatars = false;
                        if (global.prefs.useFilterList == null)               global.prefs.useFilterList = false;
                        if (global.prefs.filterDeep == null)                  global.prefs.filterDeep = false;
                        if (global.prefs.pivotalDescFilters == null)          global.prefs.pivotalDescFilters = [];
                        if (global.prefs.columnAdjust == null)                global.prefs.columnAdjust = -1;
                        if (global.prefs.pivotalMaps == null)                 global.prefs.pivotalMaps = [ // this is duplicated from Gitlab Mods... hm...
                            {"project_id":"2203130","reference":"koa/ui-core/Themes/Documentation"},
                            {"project_id":"2203130","reference":"dao/dell-digital-design/design-language-system/systems/dls-1.0"},
                            {"project_id":"2448496","reference":"dao/dell-digital-design/design-language-system/systems/dls-2.0"},
                            {"project_id":"2451317","reference":"dao/dell-digital-design/design-language-system/experiment/dls-2.0-alpha"}
                        ];
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
                    global.mems.avatarPingTimer = global.mems.avatarPingTimer || undefined;
                    tm.savePreferences(global.ids.memsName, global.mems);
                } else {
                    global.mems = JSON.parse(currentMems);
                }
            },
            addClasses: function () {
                if (global.states.areClassesAdded) {
                    return;
                }
                global.states.areClassesAdded = true;
                tm.addGlobalStyle('.model_details .close {max-width: 80px;}');
                tm.addGlobalStyle('.ignoreTip { color:blue; font-style:normal; opacity:0.3; }' +
                                  '.ignoreTip:hover { opacity:1.0; }');
                tm.addGlobalStyle('.tmIconBtn { width:24px !important; }');
                tm.addGlobalStyle(".fingery {margin:0;}");
                tm.addGlobalStyle('.modAvatar {width:1rem; height:1rem; }');

            },
            addButtons: function () {
                // always scan for newly-needed Gitlab links
                _.forEach($('.button_with_field'), (sect) => {
                    if ($(sect).find('.gllink').length === 0) {
                        var thisId = $(sect).find(".id").eq(0).attr("data-clipboard-text").replace('#', '');
                        var thisUrl = document.URL;
                        let gitlabUrl = null;
                        // global.prefs.pivotalMaps.find((x) => x.reference === cite)
                        global.prefs.pivotalMaps.forEach((pMap) => {
                            if (thisUrl.indexOf(pMap.project_id) > 0) {
                                gitlabUrl = pMap.reference;
                            };
                        });
                        if (gitlabUrl != null) {
                            $(sect).prepend('<button type="button" title="Search Gitlab for this MR" onclick="window.open(\'https://gitlab.dell.com/' + gitlabUrl + '-/merge_requests?scope=all&utf8=%E2%9C%93&state=all&search=' + thisId + '\')" class="gllink hoverable" tabindex="-1">&gt;&gt;</button>');
                        }
                    }
                });

                //                 if (global.states.areButtonsAdded) {
                //                     return;
                //                 }
                //                 global.states.areButtonsAdded = true;

            },
            addAvatars: function () {
                if (!global.prefs.useLocalAvatars) {
                    return;
                }
                if (!global.states.avatarPingFailed && global.pingPhoto != null) {
                    tm.ping(global.avatarHost + global.pingPhoto + global.imageExt, function callback (response) {
                        if (response === 'responded') {
                            global.states.avatarPingFailed = false;
                        } else {
                            global.states.avatarPingFailed = true;
                        }
                        global.mems.avatarPingTimer = moment();
                        tm.savePreferences(global.ids.memsName, global.mems);
                    });
                }

                document.querySelectorAll('.parens').forEach((paren) => {
                    paren.querySelectorAll('a').forEach((anch) => {
                        if (!anch.querySelector('img')) {
                            let avatr = document.createElement('img');
                            avatr.classList.add('modAvatar');
                            avatr.setAttribute('src', global.avatarHost + utils.properName(anch.title) + global.imageExt);
                            anch.innerText = '';
                            anch.appendChild(avatr);
                        }
                    })
                })
            },
            friendlyDescription: function () {
                if (!global.prefs.useFilterList) {
                     return;
                }
                if ($('.tc_modal').length > 0 || $('textarea:focus').length > 0) { // do no replacing while editing
                    if (global.states.msDelayBeforeResumingScan === 0) {
                        utils.debug('MakeFriendly --> I am editing');
                    }
                    global.states.msDelayBeforeResumingScan = 1000;
                    return;
                }
                if (global.states.msDelayBeforeResumingScan > 0) {
                    setTimeout(() => {
                        global.states.msDelayBeforeResumingScan = 0;
                    }, global.states.msDelayBeforeResumingScan);
                    utils.debug('MakeFriendly --> waitaminute');
                    return;
                }
                utils.debug('MakeFriendly --> proceed');
                var targEls = [
                    '.tracker_markup'
                ];
                if (global.prefs.filterDeep) {
                    targEls.push('[data-aid="renderedDescription"]');
                }
                var noElsToModify = true;
                _.each(targEls, (thisTel) => {
                    if ($(thisTel + ':not(".ptmodsChecked")').length > 0) {
                        noElsToModify = false;
                    }
                });
                if (noElsToModify) {
                    return;
                }
                utils.debug('MakeFriendly --> found something new');
                global.states.elScans++;
                var noSpecialChr = function(inpuu) {
                    return inpuu != null ? inpuu.replace(/[^\w\s]| /gi, '') : null;
                }
                var noMarkdownInIgnore = function(myIgnore) {
                    return myIgnore.replace(/\*/g, '').replace(/ - /g, '').replace(/- /g, '');
                }
                var tippyFriendly = function(whatText) {
                    var returnText = '';
                    var lenny = 30;
                    if (whatText.length < lenny) {
                        returnText = whatText;
                    } else {
                        for (var intI = 0; intI < whatText.length; intI += lenny) {
                            var howMuch = lenny > whatText.length ? whatText.length - lenny : lenny;
                            var cutChunk = whatText.substr(0, howMuch);
                            returnText += cutChunk + '<br>';
                            whatText = whatText.replace(cutChunk, '');
                        }
                        returnText += whatText;
                    }
                    // replace some characters with html characters so as not to double replace later
                    returnText = returnText
                        .replace(/ /g, '&nbsp;')
                        .replace(/e/g, '&#101;')
                        .replace(/a/g, '&#97;')
                        .replace(/"/g, '\'');
                    return returnText;
                }
                var friendlyDesc = function(fdesc, targetSelector, selectorIndex) {
                    fdesc = fdesc.replace(/\*/g, '');
                    _.each(global.prefs.pivotalDescFilters, (ignoreMe, ignoreIndex) => {
                        var idNum = '_' + selectorIndex + '-' + ignoreIndex;
                        ignoreMe = noMarkdownInIgnore(ignoreMe);
                        // TODO: FIND OUT WHY THIS BREAKS PIVOTAL TRACKER!
                        fdesc = fdesc.replace(ignoreMe, '<i id="ignoreTip' + noSpecialChr(targetSelector) + idNum + '" class="fingery ignoreTip" data-tippy="' + tippyFriendly(ignoreMe) + '">&#127849;</i>') // donut
                    });
                    //                     fdesc = fdesc.replace(/<\/span>\n/g, '</span>').replace(/ - /g, '').replace(/- /g, ''); // trying to remove line-breaks after <i> elements... not doing anything ATM
                    return fdesc;
                }
                var applyDesc = function(targetSelector) {
                    _.each($(targetSelector), (desc, selectorIndex) => {
                        $(desc).addClass('ptmodsChecked');
                        var uiLevel = ($(desc).closest('header').attr("data-aid") === 'StoryPreviewItem__preview') ? '_nameLevel_' : '_detailLevel_';
                        uiLevel += global.states.elScans.toString() + '_';
                        $(desc).html(friendlyDesc($(desc).html(), uiLevel + targetSelector, selectorIndex));
                        setTimeout(() => {
                            _.each(global.prefs.pivotalDescFilters, (ignore, ignoreIndex) => {
                                var idNmb = '_' + selectorIndex + '-' + ignoreIndex;
                                if(document.getElementById('ignoreTip' + noSpecialChr(uiLevel + targetSelector) + idNmb)) {
                                    tippy(document.getElementById('ignoreTip' + noSpecialChr(uiLevel + targetSelector) + idNmb), {
                                        content: document.getElementById('ignoreTip' + noSpecialChr(uiLevel + targetSelector) + idNmb).dataset.tippy
                                    });
                                }
                            });
                        }, 50);
                    });
                }
                _.each(targEls, (thisTel) => {
                    applyDesc(thisTel + ':not(".ptmodsChecked")');
                });

            },
            tweakStateButtons: function() {
                if (global.prefs.hideLabels) {
                    $('.labels.pre').hide();
                    $('.labels.post').hide();
                }
                if (global.prefs.hideReviewLists) {
                    $('.StoryPreviewItemReviewList___2PqmkeBu').hide();
                }
            },
            tweakExistingButtons: function () {
                if (!$('[data-aid="StateButton"]:not(".tmIconBtn")') || !global.prefs.iconizeButtons) {
                    return;
                }
                _.each($('label:contains("Accept"):not(".tmIconBtn")'), (btn) => {
                    $(btn).html('&#128077;').addClass('tmIconBtn').attr('title', 'Accept');
                });
                _.each($('label:contains("Reject"):not(".tmIconBtn")'), (btn) => {
                    $(btn).html('&#128078;').addClass('tmIconBtn').attr('title', 'Reject');
                });
                _.each($('label:contains("Finish"):not(".tmIconBtn")'), (btn) => {
                    $(btn).html('&#127937;').addClass('tmIconBtn').attr('title', 'Finish');
                });
                _.each($('label:contains("Deliver"):not(".tmIconBtn")'), (btn) => {
                    $(btn).html('&#127873;').addClass('tmIconBtn').attr('title', 'Deliver');
                });
                _.each($('label:contains("Start"):not(".tmIconBtn")'), (btn) => {
                    $(btn).html('&#127916;').addClass('tmIconBtn').attr('title', 'Start');
                });
            },
            tweakLayout: function () {
                if (global.prefs.columnAdjust === -1) {
                    return;
                }
                var lenny = $('.main .panels .table .panel').length;
                $('.main .panels .table').css('width', $('.main .expanded').width() + 'px');
                $('.main .panels .table .panel').css('width', ((100 / (lenny-global.prefs.columnAdjust)) -1) + '%');
            }
        },
        utils = {
            debug: function(msg) {
                if (global.prefs.debugMode) {
                    if (typeof msg === 'object') {
                        console.log(msg);
                    } else {
                        tm.log(msg);
                    }
                }
            },
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
            properName: function(thisName) {
                if (!thisName) {
                    return;
                }
                var firstName = '',
                    lastName = '',
                    midName = '';

                thisName = thisName.replace(/(_| )/g, '-');
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
            }
        };

    // WHYYyyyy does this no longer fire ?!?!
    // (function() { // Global Functions
    //     console.log('global');
    //     document.onmousemove = function(){
    //         console.log('mouse');
    //         if (!global.states.isMouseMoved) {
    //             global.states.isMouseMoved = true;
    //             setTimeout(function() {
    //                 global.states.isMouseMoved = false;
    //             }, global.constants.TIMEOUT * 2);
    //             utils.initScript();
    //         }
    //     };
    // })(); // Global Functions
    setInterval(() => {
        utils.initScript();
    }, 1000);
})();
