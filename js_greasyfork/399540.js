// ==UserScript==
// @name			MusicNotes vertical orientation v?
// @namespace		COMDSPDSA
// @version			1.00
// @description		Tweaks UI to allow for vertical orientation of sheet music
// @author			Dan Overlander
// @include			*musicnotes.com*
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js
// @require		    https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @grant           GM_setValue
// @grant           GM_getValue

// @downloadURL https://update.greasyfork.org/scripts/399540/MusicNotes%20vertical%20orientation%20v.user.js
// @updateURL https://update.greasyfork.org/scripts/399540/MusicNotes%20vertical%20orientation%20v.meta.js
// ==/UserScript==

// Since v00.0: init

/*
 * tm is an object included via @require from DorkForce's Tampermonkey Assist script
 */

(function() {
    'use strict';

    var TIMEOUT = 750,
        global = {
            scriptName: 'MusicNotesMod',
            areClassesAdded: false,
            areKeysAdded: false,
            areInterfaceButtonsAdded: false,
            isMouseMoved: false,
            isPlaying: false,
            prefs: GM_getValue('musicnotesPrefs') != null ? JSON.parse(GM_getValue('musicnotesPrefs')) : {}
        },
        page = {
            initialize: function () {
                setTimeout(function () {
                    page.setPrefs();
                    page.addClasses();
                    page.setTamperIcon();
                    page.addButtons();
                    page.setControls();
                    GM_setValue('musicnotesPrefs', JSON.stringify({})); // HACKY HACK HACK
                }, TIMEOUT);
            },
            setPrefs: function() {
                if (global.prefs.closeLibrary == null) global.prefs.closeLibrary = false;
            },
            addClasses: function () {
                if (!global.areClassesAdded) {
                    global.areClassesAdded = true;

                    tm.addGlobalStyle('.tmButton { background:red; margin:13px; cursor:pointer; }');
                    tm.addGlobalStyle('.footer { bottom:20px; })');
                    tm.addGlobalStyle('#helicon-playback {text-align:center !important;');
                    tm.addGlobalStyle('#productSvg {width:1120px;');
                    tm.addGlobalStyle('.fa-play, .fa-pause {display:block !important;}');
                }
            },
            setTamperIcon: function () {
                // Add Tampermonkey Icon with label to identify this script
                if($('.tamperlabel').length > 0) {
                    if ($('.tamperlabel').prop('title').indexOf(global.scriptName) === -1) {
                        $('.tamperlabel').prop('title', $('.tamperlabel').prop('title') + ' | ' + global.scriptName);
                    }
                } else {
                    $('body').append('<span class="tamperlabel" title="Tampermonkey scripts: ' + global.scriptName + '"><i class="fa fa-battery-three-quarters tamperNewIcon"></i></span>');
                }
                var tamperAction = function () {
                    page.erasePreferences();
                    alert('All memory has been reset for script:' + global.scriptName);
                    return false;
                };
                $('.tamperlabel').unbind( "click" ).click(tamperAction);
            },
            addButtons: function() {
                var buttons = {
                    library: {
                        id: 'toggleLibrary',
                        anchor: '.playback-container',
                        create: function (bId, bAnchor) {
                            var buttonAnchor = $(bAnchor),
                                buttonAction = function () {
                                    $('.full-screen-icon').click();
                                    $('.fa-arrows-alt-h').click();
                                    return false;
                                };
                            buttonAnchor.before('<i id="' + bId + '" class="tmButton" style="position:relative; left:30px;">X</i>');
                            $('#' + bId).click(buttonAction);
                        }
                    }
                };

                if (!global.areInterfaceButtonsAdded) {
                    global.areInterfaceButtonsAdded = true;

                    tm.getContainer({
                        'el': buttons.library.anchor,
                        'max': 100,
                        'spd': 1000
                    }).then(function($container){
                        buttons.library.create(buttons.library.id, buttons.library.anchor);
                    });

                }

            },
            savePreferences: function () {
                GM_setValue('musicnotesPrefs', JSON.stringify(global.prefs));
            },
            erasePreferences: function() {
                GM_setValue('musicnotesPrefs', JSON.stringify({}));
            },
            setControls: function () {
                if (!global.areKeysAdded) {
                    global.areKeysAdded = true;

                    $(document).unbind('keyup');

                    $(document).keyup(function(e) {
                        if (e.keyCode == 49) { // 1
                            $('#pageButtons button').eq(0).click()
                        }
                        if (e.keyCode == 32) { // space
                            $('.fa-play').parent().attr('disabled', 'false');
                            $('.fa-pause').parent().attr('disabled', 'false');
                            if (!global.isPlaying) {
                                $('.fa-play').click()
                            } else {
                                $('.fa-pause').click()
                            }
                            global.isPlaying = !global.isPlaying;
                        }
                        if (e.keyCode == 50) { // 2
                            $('#pageButtons button').eq(1).click()
                        }
                        if (e.keyCode == 51) { // 3
                            $('#pageButtons button').eq(2).click()
                        }
                        if (e.keyCode == 52) { // 4
                            $('#pageButtons button').eq(3).click()
                        }
                        if (e.keyCode == 53) { // 5
                            $('#pageButtons button').eq(4).click()
                        }
                        if (e.keyCode == 54) { // 6
                            $('#pageButtons button').eq(5).click()
                        }
                        if (e.keyCode == 55) { // 7
                            $('#pageButtons button').eq(6).click()
                        }
                        if (e.keyCode == 56) { // 8
                            $('#pageButtons button').eq(7).click()
                        }
                        if (e.keyCode == 57) { // 9
                            $('#pageButtons button').eq(8).click()
                        }
                        if (e.keyCode == 48) { // 0
                            $('#pageButtons button').eq(9).click()
                        }
                    });
                }
            }
        };

    /*
     * Global functions
     */

    function initScript () {
        tm.getContainer({
            'el': '#productSvg',
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

})();