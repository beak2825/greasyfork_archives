// ==UserScript==
// @name			TFS WorkItem
// @description		Enhances WorkItem pages for TFS
// @namespace		COMDSPDSA
// @author			Dan Overlander
// @license			none
// @version			11.1
// @include			*/tfs/*
// @include			*/tfs2/*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=730858
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/40974/TFS%20WorkItem.user.js
// @updateURL https://update.greasyfork.org/scripts/40974/TFS%20WorkItem.meta.js
// ==/UserScript==

// Since v11.0: removing the buggy togglePinProps method from properties pinning checkbox. Adjusting main content box height for Stories (as well as just Defects). Tweaked logic for calculating Details/Repro Steps resize
// Since v10.9: Removes Tamper Global script dependency.
// Since v10.8: Added user option for changing discussion font size
// Since v10.7: Added pinning of properties panel
// Since v10.6: Bot messages in the history TAB are now hidden (minimization attempt failed, but also that's a duplication of data between history and discussion tabs). Options icon moved/changed.  Changed text area modification shortcut keys. Tamperlibrary link updated.
// Since v10.5: Recreates the way automatic messages are dealt with. nudged the help icon over.
// Since v10.4: moving out setTamperIcon
// Since v10.3: Adjusted bot comment compression to match new name.
// Since v10.2: Compressed bot messages in the discussion history
// Since v10.1: Fixed the intermittent discussion alignment issue.  Added collapsing of empty, less-important iframes
// Since v10.0: Fixed the history-gathering click action, properly this time.
// Since v09.9: Added context info to Stories as well as Defects
// Since v09.8: Added Found-in environment to top of page reporting
// Since v09.7: Adjusts min-height for repro steps, not height.  Fixes bug where the size would adjust when you focused that field.
// Since v09.6: ensures repro-steps do not shrink in height
// Since v09.5: maximizes repro-steps area to fill available whitespace.
// Since v09.0: Color Tweaks. Renamed helpery class to script-specific name, to differentiate from other scripts
// Since v08.5: Preferences Menu added. Page Colors added.
// Since v08.1: Bug fixes: Keeps "!" warning for incomplete fields on screen while scrolling. No longer clicks details tab when changing Root Cause field.
// Sinve v08.0: adjusted popupDetailTitle to popupDetailTitleTiny so as not to collide with other scripts
// Since v07: ATTEMPT to re-enable the favorites picker for Assigned to field.  Commented out.  Changed Search Text box font color to black.
// Since v06: brings release information to the top for defects. Moving showModal to TM Support Library
// Since v05: Properties word autoscrolls. Broadening @include pages. Fixed/Upgraded method for getting "created by" information
// Since v04: allowing on taskboard.  Added error notification to user
// Since v03: misc layout tweaks. Added "created by" line
// Since v02: ACTUALLY fixed the Properties panel animation
// Since v01: Properties Panel Tweaks
// Since v00: Initial

(function() {
    'use strict';

    const TIMEOUT = 500;
    var global =
        {
            isInfoGathered: false,
            isMouseMoved: false,
            areClassesAdded: false,
            discussionBotsHidden: false,
            areIframesAdjusted: false,
            areKeysAddded: false,
            isEnhanceHappening: false,
            triggerElement: '.menu-icon',
            scriptName: 'TFS WorkItem',
            prefsName: 'workitemPrefs',
            selectedPerson: undefined,
            animationSpeed: (TIMEOUT/2),
            faves: GM_getValue('faves') != null ? JSON.parse(GM_getValue('faves')).sort( function ( a, b ) { return b.count - a.count; } ) : [],
            prefs: {},
            handlePrefsLocally: true
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.setPrefs();
                    page.addClasses();
                    tm.addClasses();
                    tm.setTamperIcon(global);
                    page.addLabels();
//                     page.adjustIframes();
                    page.enhanceInteraction();
                    //page.maximizeDetailsArea();
                    page.rearrangeLayout();
                    page.setControls();
                    page.getInfo();
                    page.addMenuLinks();
                    page.hideBotMessages();
                }, TIMEOUT);
            },
            setPrefs: function() {
                global.prefs = GM_getValue(global.prefsName) != null ? JSON.parse(GM_getValue(global.prefsName)) : {};
                if (global.prefs.pageColor == null) global.prefs.pageColor = '#DAEFFF';
                if (global.prefs.inputColor == null) global.prefs.inputColor = 'rgb(250, 255, 254)';
                if (global.prefs.rearrangeLayout == null) global.prefs.rearrangeLayout = 'true';
                if (global.prefs.hideBotMessages == null) global.prefs.hideBotMessages = 'true';
                if (global.prefs.discussionFontSize == null) global.prefs.discussionFontSize = '14px';
            },
            addClasses: function () {
                $('.discussion-messages-messagecontent span').css('font-size', 'inherit');

                if (!global.areClassesAdded) {
                    global.areClassesAdded = true;

                    // title for sliding elements
                    tm.addGlobalStyle('.vertical-text {transform: rotate(90deg); transform-origin:left top 0; position:relative; top:5px; left:10px; font-size:20px; font-weight:bold; height:0px; }');

                    // All Inputs
                    tm.addGlobalStyle('input { background: ' + global.prefs.inputColor + ' !important; border-left:1px solid lightgrey; border-right:1px solid lightgrey; }');

                    // Background
                    tm.addGlobalStyle('.hub-content { background: ' + global.prefs.pageColor + '; }');
                    tm.addGlobalStyle('.work-item-form-main-core { background-color: rgb(0,0,0,0.1); border-width: 0px; }');

                    //tm.addGlobalStyle('.popupDetailWindow   { top:150px; left:525px; width:300px !important; height:200px !important; overflow-y:auto !important; }');
                    //tm.addGlobalStyle('.popupDetailContent  { width:50%; }');

                    tm.addGlobalStyle('.discussionCentering { position:absolute; width:50%; top:0px; }');

                    // tfs icons
                    tm.addGlobalStyle('.tfs-icon-bang { background-position:-2738px -16px !important; position:fixed; margin-top:3px; }');

                    // maximize workitem in modal view
                    tm.addGlobalStyle('.workitem-dialog { height:95%; width:100%; top:50px; left:50px; }');

                    // favorite user picker modal popup
                    tm.addGlobalStyle('.popupDetailTitleTiny { width:5%; }');
                    tm.addGlobalStyle('#faves { width:250px; height:175px; top:0; left:0; }');

                    // Search Text
                    tm.addGlobalStyle('.search-text { color: #000 !important; }');

                    // set border-ish background color around pickers to transparent
                    tm.addGlobalStyle('.combo { background-color: rgb(255, 255, 255, 0) !important; }');

                    // for hiding automatic messages in discussion- and history- sections
                    tm.addGlobalStyle('#autobot, .historyBotEl { max-height:30px; overflow-y:hidden; margin-bottom:10px; }');
                    tm.addGlobalStyle('#autobotTitle, #userChatTitle, .historyBotTitleEl { font-weight:bolder; font-size:larger; } ');
                    tm.addGlobalStyle('.historyBot { display: none; }');

                    // Discussion
                    tm.addGlobalStyle('.discussion-messages-messagecontent { font-size: ' + global.prefs.discussionFontSize + ' }');

                }
            },
            addLabels: function(elToLabel) {
                //if ($('.grid-canvas').length > 0) {
                //    return;
                //}
                var varPhrase, varOrig, varButton, labelTimeout = TIMEOUT * 3;

                setTimeout(function() {
                    var varPhrase = 'ALT-1', varOrig = 'Maximize Repro Steps:', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Maximize', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-1', varOrig = 'Restore Repro Steps:', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Restore', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-1', varOrig = 'Maximize Description', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Maximize', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-1', varOrig = 'Restore Description', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Restore', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-3', varOrig = 'Maximize Discussion', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Maximize', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-3', varOrig = 'Restore Discussion', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Restore', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-4', varOrig = 'Maximize Proposed Fix:', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Maximize', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-4', varOrig = 'Restore Proposed Fix:', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Restore', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-2', varOrig = 'Maximize System Information:', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Maximize', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-2', varOrig = 'Restore System Information:', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Restore', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-4', varOrig = 'Maximize Acceptance Criteria', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Maximize', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-4', varOrig = 'Restore Acceptance Criteria', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Restore', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-2', varOrig = 'Maximize Tech Analysis;', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Maximize', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);

                setTimeout(function() {
                    var varPhrase = 'ALT-2', varOrig = 'Restore Tech Analysis;', varButton = $('.popup-content-container:contains("' + varOrig + '")');
                    varButton.text(varOrig.replace('Restore', 'Toggle') + ' ' + varPhrase);
                }, labelTimeout);
            },
            adjustIframes: function() {
                for (var intI = 0; intI < $('iframe').length; intI++) {
                    try {
                        var $head = $("iframe").eq(intI).contents().find("head");
                        $head.append('<style>body {background: ' + global.prefs.inputColor + ';}</style>');
                    }
                    catch (e){}
                }
                if (!global.areIframesAdjusted && $("iframe").length > 0) {
                    global.areIframesAdjusted = true;
                    for (var intJ = 0; intJ < $('iframe').length-1; intJ++) { // -1 because we can skip the Root Cause Details, which is last in the array
                        try {
                            var $iframe = $("iframe").eq(intJ);
                            var $contents = $iframe.contents()[0].activeElement.innerText;
                            if($contents.length == 0) { // closing
                                $($iframe).closest('.tfs-collapsible-content').prev().find('.bowtie-chevron-up').click();
                            } else { // opening
                                $($iframe).closest('.tfs-collapsible-content').prev().find('.bowtie-chevron-down').click();
                            }
                        }
                        catch (e){}
                    }
                }
            },
            enhanceInteraction: function () {
                $('.identity-picker-container').on('click', function () { utils.enhance('showFavorites'); });
                $('.identity-picker-input').on('blur', function() { utils.enhance('blurIdentity'); });

                $('.workitem-group-maximize').on('click', function () {utils.enhance('togglePropertiesVisibility');});
                $('.toggle-button').on('click', function () { page.rearrangeLayout(); });
            },
            maximizeDetailsArea: function () {
                if ($('.richeditor-editarea').eq(0)) {
                    $('.richeditor-editarea').each(function( index ) {
                        if ($(this).closest('div[rawtitle="Root Cause Details"]').length > 0) { // change the root-cause box only a little
                            var minHeight = Math.max($(this).height(), ($(window).height() - $(this).offset().top) / 2);
                            $(this).parent().css('height', minHeight + 'px');
                        } else if($(this).closest('div[rawtitle="History/Comments"]').length === 0 && // do NOT do the history-comments box found on DEFECTS but not Tasks
                                  $(this).closest('div[rawtitle="History"]').length === 0 &&
                                  $('.caption').text().toLowerCase().indexOf("code review response") === -1 && // do not process on Code Review Response pages
                                  $(this).closest('div[rawtitle="Details"]').length === 0) { // do NOT process the history-comments found on Task- or Code Review Request- pages
                            $(this).parent().css('height', $(window).height() - $(this).offset().top + 'px');
                        }
                    });
                }

                // slight exception: this is only slightly contextually accurate:
                $('div[rawtitle="Root Cause Details"]').attr('class', 'tmLeftCol').closest('.column').css('background', 'white');
            },
            hideBotMessages: function() {
                if (global.prefs.hideBotMessages !== 'true') {
                    return
                }
                if (!global.discussionBotsHidden) {
                    global.discussionBotsHidden = true;
                    tm.getContainer({
                        'el': '.discussion-messages-container',
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        $('.discussion-messages-container').prepend('<div id="autobot" class="fingery"><div id="autobotTitle"></div></div>');
                        $('#autobotTitle').on('click', function() {
                            if ($('#autobot').css('overflow-y') === 'hidden') {
                                $('#autobot').css({'overflow-y': 'inherit', 'max-height': 'inherit'});
                                $('#autobotTitle').css({'background': 'grey'});
                            } else {
                                $('#autobot').css({'overflow-y': 'hidden', 'max-height': '30px'});
                                $('#autobotTitle').css({'background': 'aliceblue'});
                            }
                        });
                    });
                }
                // minimize bot comments in the discussion panel
                $('.discussion-messages-user:contains("ServiceCOMTeamCity")').closest('.discussion-messages-item').addClass('botty');
                $('.discussion-messages-user:contains("ServiceDevExpNonProd")').closest('.discussion-messages-item').addClass('botty');

                // move bot comments to a sub-panel
                if ($('.discussion-messages .botty').length > 0) {
                    $('#autobotTitle').text('Automatic Messages').css({'background': 'aliceblue', 'padding': '5px', 'margin-bottom': '10px'});
                    $('.discussion-messages .botty').appendTo('#autobot');
                }
                // add title to user message area
                tm.getContainer({
                    'el': '.discussion-messages',
                    'max': 100,
                    'spd': 1000
                }).then(function($container){
                    if ($('#userChatTitle').length === 0) {
                        $('.discussion-messages').prepend('<div id="userChatTitle" style="margin-bottom:10px;">User Messages</div>');
                    }
                });
                // (HIDE, for now. Commenting out error-filled minimization attempt) bot comments in the history.  see also addClasses.
                $('.history-item-summary-text:contains("ServiceCOMTeamCity")').closest('.ms-List-cell').addClass('historyBot');
                $('.history-item-summary-text:contains("ProcessTFSSetup")').closest('.ms-List-cell').addClass('historyBot');
                $('.historyBot').closest('.ms-List-page').addClass('historyPage');

//                 var bots;
//                 if ($('.historyPage>.historyBot').length > 0) {
//                     _.each($('.historyPage'), function(hPage) {
//                         if ($(hPage).find('.historyBotEl').length === 0) {
//                             $(hPage).prepend('<div class="historyBotEl fingery"><div class="historyBotTitleEl"></div></div>');
//                             $(hPage).find('.historyBotTitleEl').on('click', function() {
//                                 if ($(hPage).find('.historyBotTitleEl').css('overflow-y') !== 'hidden') {
//                                     $(hPage).find('.historyBotTitleEl').css({'overflow-y': 'hidden', 'max-height': '30px'});
//                                     $(hPage).find('.historyBotTitleEl').css({'background': 'aliceblue'});
//                                 } else {
//                                     $(hPage).find('.historyBotTitleEl').css({'overflow-y': 'inherit', 'max-height': 'inherit'});
//                                     $(hPage).find('.historyBotTitleEl').css({'background': 'grey'});
//                                 }
//                             });
//                         }
//                         // move bot comments to a sub-panel
//                         $('.historyBotTitleEl').text('Automatic Messages').css({'background': 'aliceblue', 'padding': '5px', 'margin-bottom': '10px'});
//                         $('.historyPage>.historyBot').appendTo($(hPage).find('.historyBotTitleEl'));
//                     });
//                 }
            },
            rearrangeLayout: function() {
                if (global.prefs.rearrangeLayout !== 'true') {
                    return;
                }
                var elDescription = $('.tfs-collapsible-text:contains("Description")').closest('.grid-group'),
                    elReproSteps = $('.tfs-collapsible-text:contains("Repro Steps")').closest('.grid-group'),
                    elDiscussion = $('.tfs-collapsible-text:contains("Discussion")').closest('.tfs-collapsible-content'),
                    elProperties = $('.tfs-collapsible-text:contains("Planning")').closest('.wrapping-container'),
                    propertiesBkg = 'palegreen',
                    propertiesWidth = 800,
                    propertiesStart = 775,
                    propertiesOpen = 0,
                    animatingTimeout;

                elDiscussion = elDiscussion.length > 0 ? elDiscussion : elDiscussion = $('.tfs-collapsible-text:contains("Discussion")').closest('.grid-group'); // sometimes that tfs-collapsible-content disappears.

                //elDiscussion = elDiscussion.length > 1 ? elDiscussion[0] : elDiscussion; // for some reason, there are sometimes more than one discussion elements.

                if ($('.elProperties').is(':visible')) {
                    elDiscussion.addClass('discussionCentering');
                    elDiscussion.css({
                        'left': $(elDescription).length > 0 ? Math.floor($(elDescription).width() + 10) + 'px' : Math.floor($(elReproSteps).width() + 10) + 'px'
                    });
                } else {
                    elDiscussion.css({
                        'left': '10px'
                    });
                    elDiscussion.removeClass('discussionCentering');
                }

                if ($('.wrapping-container .invalid').length > 0) { // if there are any required fields to be filled out, show an icon to the user
                    propertiesBkg = 'pink';
                    if ($('.tfs-icon-bang').length === 0) {
                        $(elProperties).prepend('<span class="icon icon-tfs-build-status-header tfs-icon-bang fingery" title="REQUIRED FIELD FOUND"></span>');
                        utils.movePropertiesTitle(elProperties);
                    }
                } else {
                    if ($('.tfs-icon-bang').length > 0) {
                        $('.tfs-icon-bang').remove();
                    }
                }

                elProperties.css({
                    'width':propertiesStart+'px',
                    'max-width':propertiesWidth+'px',
                    'overflow-y':'auto',
                    'overflow-x':'hidden',
                    'background':propertiesBkg,
                    'position':'fixed',
                    'z-index':'1',
                    'padding-left':'10px',
                    'height':'100%'
                });
                $(elProperties).find('.grid-group-container').css({'width':propertiesWidth+'px'});
                $(elProperties).find('.form-section').css({'float':'left', 'clear':'both'});
                $(elProperties).find('.workitemlabel').css({'float':'left', 'width':'25%'});
                $(elProperties).find('.workitemcontrol').css({'width': '72%', 'padding-right':'20px'});
                if ($('.vertical-text').length === 0) {
                    $(elProperties).prepend("<div class='vertical-text fingery elProperties'>Properties<input type='checkbox' id='pinProps'></div>");
                    elProperties.stop().animate({opacity: 0.5, right:-propertiesStart+30}, global.animationSpeed);
                    window.onscroll = function(){ // probably overkill using 'window' ...
                        utils.movePropertiesTitle(elProperties);
                    };
                }
                if ($('.elPropertiesHeightHack').length === 0) {
                    $(elProperties).append('<div class="elPropertiesHeightHack" style="height:750px; clear:both;"></div>');
                }

                elProperties.mouseenter(function () {
                    elProperties.stop().animate({opacity: 1}, global.animationSpeed);
                    animatingTimeout = setTimeout(function () {
                        elProperties.stop().animate({right:propertiesOpen}, global.animationSpeed);
                    }, (global.animationSpeed*1.5));
                }).mouseleave(function () {
                    if (!$('#pinProps').is(':checked')) {
                        clearTimeout(animatingTimeout);
                        elProperties.stop().animate({opacity: 0.5, right:-propertiesStart+30}, global.animationSpeed);
                    }
                });

                // adjust content areas
                if ($('.elProperties').is(':visible')) {
                    var whichFormBody,
                        whichSection1,
                        heightAdjustment,
                        $thisEl;
                    $('.form-body').each(function( index ) {
                        if ($('.form-body').eq(index).height() > 0 && whichFormBody == null) {
                            whichFormBody = $('.form-body').eq(index);
                        }
                    });
                    $('.section1').each(function( index ) {
                        if ($('.section1').eq(index).height() > 0 && whichSection1 == null) {
                            whichSection1 = $('.section1').eq(index);
                        }
                    });
                    heightAdjustment = (whichFormBody.height()-whichSection1.height());
                    if (heightAdjustment < 0) heightAdjustment = 0;

                    // maximize repro steps to fill space
                    $thisEl = $('div [aria-label="Repro Steps:"]');
                    $thisEl.css('min-height', $thisEl.height() + heightAdjustment);

                    // adjust main content area for stories
                    $thisEl = $($($('.section1')[0]).find('div')[0])
                    $thisEl.css('min-height', $thisEl.height() + heightAdjustment);
                    $thisEl = $thisEl.find('.richeditor-editarea');
                    $thisEl.css('min-height', $thisEl.height() + heightAdjustment);
                }
            },
            setControls: function () {
                if (!global.areKeysAdded) {
                    global.areKeysAdded = true;

                    $(document).unbind('keyup');

                    $(document).keyup(function(e) {
                        /*
                        // if (e.keyCode == 27) { }   // esc
                        if (e.keyCode == 37 && e.ctrlKey) { goGroup('prev'); } // Ctrl-Left
                        if (e.keyCode == 39 && e.ctrlKey) { goGroup('next'); } // Ctrl-Right
                        if (e.keyCode == 38 && e.ctrlKey) { cycleRow('prev'); } // Ctrl-Up
                        if (e.keyCode == 40 && e.ctrlKey) { cycleRow('next'); } // Ctrl-Down
                        if (e.keyCode == 32 && e.ctrlKey) { cycleRow($('.user-menu .text').text()); } // Ctrl-Space
                        */
                        if (e.keyCode == 49 && e.altKey) { // Alt-1
                            if ($('.elProperties').is(':visible')) {
                                $("body").find("[aria-label='Maximize Repro Steps:']").click();
                                $("body").find("[aria-label='Maximize Description']").click();
                            } else {
                                $("body").find("[aria-label='Restore Repro Steps:']").click();
                                $("body").find("[aria-label='Restore Description']").click();
                            }
                            initScript();
                        }
                        if (e.keyCode == 52 && e.altKey) { // Alt-4
                            if ($('.elProperties').is(':visible')) {
                                $("body").find("[aria-label='Maximize Proposed Fix:']").click();
                                $("body").find("[aria-label='Maximize Acceptance Criteria']").click();
                            } else {
                                $("body").find("[aria-label='Restore Proposed Fix:']").click();
                                $("body").find("[aria-label='Restore Acceptance Criteria']").click();
                            }
                            initScript();
                        }
                        if (e.keyCode == 51 && e.altKey) { // Alt-3
                            if ($('.elProperties').is(':visible')) {
                                $("body").find("[aria-label='Maximize Discussion']").click();
                            } else {
                                $("body").find("[aria-label='Restore Discussion']").click();
                            }
                            initScript();
                        }
                        if (e.keyCode == 50 && e.altKey) { // Alt-2
                            if ($('.elProperties').is(':visible')) {
                                $("body").find("[aria-label='Maximize System Information:']").click();
                                $("body").find("[aria-label='Maximize Tech Analysis;']").click();
                            } else {
                                $("body").find("[aria-label='Restore System Information:']").click();
                                $("body").find("[aria-label='Restore Tech Analysis;']").click();
                            }
                            initScript();
                        }
                    });
                }
            },
            getInfo: function() {
                if (!global.isInfoGathered && ($('.caption').text().toLowerCase().indexOf('defect') > -1 || $('.caption').text().toLowerCase().indexOf('story') > -1)) {
                    if (!$('.bowtie-navigate-history').parent().hasClass('selected-tab')) {
                        $('.bowtie-navigate-history').click();
                        setTimeout(function() {
                            global.isInfoGathered = true;
                            if ($('.page-button:contains("Details")').length > 0) {
                                $('.page-button:contains("Details")').eq(0).click();
                            } else {
                                $('.page-button:contains("Classification")').eq(0).click();
                            }
                        }, TIMEOUT*2);
                    } else {
                        setTimeout(utils.setCreator(), TIMEOUT*2);
                        setTimeout(utils.setRelease(), TIMEOUT*2);
                        setTimeout(utils.setEnvironment(), TIMEOUT*2);
                        setTimeout(page.adjustIframes(), TIMEOUT*2);
                    }
                } else {
                    utils.setCreator();
                    utils.setRelease();
                    utils.setEnvironment();
                    page.adjustIframes();
                }
            },
            addMenuLinks: function() {
                var scrName = global.scriptName.replace(/\s/g, '');
                if ($('.acronymButton').length > 0 && $('.helpForWorkItem').css('bottom') === '18px') {
                    $('.helpForWorkItem').css('bottom', '41px');
                }
                if ($('.helpForWorkItem').length === 0) {
                    tm.addGlobalStyle('.helpForWorkItem { position:fixed; z-index:999999999; content: url("https://www.dorkforce.com/dsa/62971-gear-icon.png"); right:7px; bottom:18px; width:16px; height:16px;}');
                    $('body').append('<span class="fingery helpForWorkItem" title="' + scrName + ' Preferences"></span>');
                    $('.helpForWorkItem').mouseup(function clickIdLink (e) {
                        var modalId = 'workitemOptions',
                            modalBody = '';
                        modalBody += '<div class="popupDetailTitle">' + modalId + '</div><div class="popupDetailContent">&nbsp;</div>';
                        _.each(global.prefs, function (value, key) {
                            if (Array.isArray(value) || typeof value === 'string') {
                                modalBody += '    <div class="popupDetailTitle">' + key + '</div><div class="popupDetailContent"><input style="width:100%" id="' + key + '" type="text" value="' + value + '"></input></div>';
                            } else {
                                _.each(value, function (value2, key2) {
                                    modalBody += '    <div class="popupDetailTitle">' + key2 + '</div><div class="popupDetailContent"><input style="width:100%" id="' + key2 + '" type="text" value="' + value2 + '"></input></div>';
                                });
                            }
                        });
                        modalBody += '<div class="popupDetailTitle">&nbsp;</div><div class="popupDetailContent" style="text-align:right;">' +
                            '    <button class="savery">Save</button>' +
                            '</div>';
                        modalBody += '<div class="popupDetailTitle">&nbsp;</div><div class="popupDetailContent" style="text-align:right;">' +
                            '    <button class="resetery">Reset</button>' +
                            '</div>';
                        tm.showModal(modalId, modalBody);

                        $('.savery').on('click', function() {
                            _.each(global.prefs, function(value, key) {
                                global.prefs[key] = $('#' + key).val();
                            });
                            GM_setValue('workitemPrefs', JSON.stringify(global.prefs));
                            alert('Refresh to see new values.');
                        });
                        $('.resetery').on('click', function() {
                            GM_setValue('workitemPrefs', null);
                            alert('Refresh to see default values.');
                        });
                    });
                }
            }
        },
        utils = {
            analyzeUser: function(selectedUser, signin) {
                var newUser,
                    existingUser = _.find(global.faves, function(thisUser) {
                        return thisUser.name == selectedUser;
                    });
                if (existingUser != null) {
                    existingUser.count ++;
                    return existingUser;
                } else {
                    if (selectedUser != '') {
                        newUser = {
                            'name': selectedUser,
                            'count': 1,
                            'signin': signin
                        };
                        global.faves.push(newUser);
                        return newUser;
                    }
                }
                return null;
            },
            localizeInput: function(theArray, selectedUser, signin) {
                var newUser,
                    existingItem = _.find(theArray, function(thisUser) {
                        return thisUser.name == selectedUser;
                    });
                if (existingItem != null) {
                    existingItem.count ++;
                    return existingItem;
                } else {
                    if (selectedUser != '') {
                        newUser = {
                            'name': selectedUser,
                            'count': 1,
                            'signin': signin
                        };
                        theArray.push(newUser);
                        return newUser;
                    }
                }
                return null;
            },
            enhance: function(clickType) {
                var leRows = '';
                if (!global.isEnhanceHappening) {
                    global.isEnhanceHappening = true;
                    setTimeout(function() { global.isEnhanceHappening = false; }, TIMEOUT);

                    switch(clickType){
                        case 'showFavorites':
                            // next leading thought: Perhaps the way to get this to work is to inject a button into the ul (<ul class="items" role="listbox" id="297" style="max-height: 240px;">) whose ID matches the OWNS value in the text field, and then force click that.
//                             _.each(global.faves, function (nym) {
//                                 if (nym.name != null && nym.name != '') {
//                                     leRows += '<div class="popupDetailTitle popupDetailTitleTiny">@:</div><div class="popupDetailContent fingery" onclick="' +
//                                         //'setTimeout(function(){$(\'.identity-picker-resolved \').click();},98);' +
//                                         'setTimeout(function(){$(\'.identity-picker-resolved-name\').text(\'' + nym.name + '\');},99);' +
//                                         'setTimeout(function(){$(\'.identity-picker-resolved\').attr(\'data-signin\', \'' + nym.signin + '\');},100);' +
//                                         'setTimeout(function(){$(\'.identity-picker-resolved\').attr(\'aria-label\', \'Selected identity ' + nym.name + '\');},101);' +
//                                         'setTimeout(function(){$(\'.user-picture-resolved\').attr(\'src\', \'\');},102);' +
//                                         'setTimeout(function(){$(\'.identity-picker-dropdown li\').find(\'span:contains(' + nym.name + ')\').closest(\'li\').click();},1000);' +
//                                         '$(this).parent().remove();">' +
//                                         nym.name + '</div>';
//                                 }
//                             });
//                             leRows += '<div class="popupDetailTitle popupDetailTitleTiny">&nbsp;</div><div class="popupDetailContent fingery resetAll" style="text-align:right;">[RESET ALL]</div>';

//                             tm.showModal('faves', leRows);

//                             $('.resetAll').mouseup(function clickIdLink (e) {
//                                 global.faves = [];
//                                 GM_setValue('faves', null);
//                                 $('#faves').remove();
//                             });

                            break;
                        case 'togglePropertiesVisibility':
                            if ($('.elProperties').is(':visible')) {
                                $('.elProperties').parent().hide();
                            } else {
                                $('.elProperties').parent().show();
                            }
                            break;
                        case 'blurIdentity':
                            utils.analyzeUser($('.identity-picker-resolved-name').eq(0).text(), $('.identity-picker-resolved').attr('data-signin'));
                            global.faves.sort( function ( a, b ) { return b.count - a.count; } );
                            GM_setValue('faves', JSON.stringify(global.faves));
                            $('.identity-picker-input').focus();
                            break;
                        default:
                            break;
                    }
                }
            },
            movePropertiesTitle: function(elProperties) {
                $('.vertical-text').css('top', ($(elProperties).scrollTop() + 5 + $('.tfs-icon-bang').height() ) + 'px');
            },
            setCreator: function() {
                if ($('.transition-and-state-container .identity-picker-resolved-name').length > 0) {
                    var creatorName = $('.transition-and-state-container .identity-picker-resolved-name').eq(0).text();
                    if (global.isInfoGathered && $('.caption').parent().text().indexOf(' by ') === -1 && creatorName != null && creatorName !== '') {
                        $('.caption').parent().append(' by ' + creatorName);
                    }
                }
            },
            setRelease: function() {
                if ($('input[aria-label="Release Target"]').length > 0) {
                    var releaseTarget = $('input[aria-label="Release Target"]')[0].value;
                    if (global.isInfoGathered && $('.caption').parent().text().indexOf(' for ') === -1 && releaseTarget != null && releaseTarget !== '') {
                        $('.caption').parent().append(' for ' + releaseTarget);
                    }
                }
            },
            setEnvironment: function() {
                if ($('input[aria-label="Sub-Environment"]').length > 0 && $('input[aria-label="Sub-Environment"]').length > 0) {
                    var releaseFoundEnv = $('input[aria-label="Found In Environment"]')[0].value;
                    var releaseSubEnv = $('input[aria-label="Sub-Environment"]')[0].value;
                    if (global.isInfoGathered && $('.caption').parent().text().indexOf(' in ') === -1 && ((releaseFoundEnv != null && releaseFoundEnv !== '') || (releaseSubEnv != null && releaseSubEnv !== '')) ) {
                        $('.caption').parent().append(' in ' + releaseFoundEnv + ':' + releaseSubEnv);
                    }
                }
            }
        };


    /*
     * Global functions
     */


    function initScript () {
        tm.getContainer({
            'el': global.triggerElement,
            'max': 100,
            'spd': 1000
        }).then(function($container){
            page.initialize();
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
        $('.vertical-text').remove();
        initScript();
    };


})();