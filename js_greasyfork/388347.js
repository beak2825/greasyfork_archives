// ==UserScript==
// @name            Aria Assistant
// @locale          English (en)
// @namespace       COMDSPDSA
// @version         13
// @description     Performs useful tasks for accessibility
// @author          Dan Overlander
// @include         *
// @require         https://greasyfork.org/scripts/23115-tampermonkey-support-library/code/Tampermonkey%20Support%20Library.js?version=907043
// @require         https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require	        https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.5.2/underscore-min.js
// @require         https://greasyfork.org/scripts/40055-libraryjquerygrowl/code/libraryJQueryGrowl.js
// @grant           GM_setValue
// @grant           GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/388347/Aria%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/388347/Aria%20Assistant.meta.js
// ==/UserScript==

// Since v12: Updating Tampermonkey Support library
// Since v11: updated library version.  Added Ctrl+F1 for keyboard shortcut help
// Since v10: Announces when HIDE mode is turned on/off
// Since v09: "muted" the preferences control panel; will do a proper fix later, sometime. Updated the Tamperlibrary. When using hotkeys to navigate hide elements, it now announces the identifier of the focused element.
// Since v08: Calculates url base rather than uses entire url for hide mode
// Since v07: Added mute-group shortcut key
// Since v06: Bug fixes.
// Since v05: Changing aria-disabled to aria-hidden. Removes dependency on Tamper Global script
// Since v04: polishing; hiding now allows traversing DOM via shortcut keys, with inidication
// Since v03: logs/dirs go out only on debugMode == true
// Since v02: Added hiding of elements and navigating to parent keys
// Since v00: initial script

(function() {
    'use strict';

    var global =
        {
            constants: {
                TIMEOUT: 750,
                initalizeOnElements: ['body']
            },
            ids: {
                scriptName: 'AriaAssistant',
                prefsName: 'AriaAssistPrefs',
                memsName: 'AriaAssistMems'
            },
            states: {
                isMouseMoved: false,
                areKeysAdded: false,
                areClassesAdded: false,
                areHiddenElementsHidden: false,
                areMutedElementsMuted: false,
                selectElementMode: false
            },
            prefs: {},
            mems: {},
            focusedElement: null,
            handlePrefsLocally: true // not implemented, but setting to TRUE so as to ignore; there's only the debugMode, anyway.
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
                    page.muteMuted();
                    page.muteMuted('hide');
                }, global.constants.TIMEOUT);
            },
            setPrefs: function() {
                var currentPrefs = GM_getValue(global.ids.prefsName);
                if (currentPrefs == null || _.isEmpty(JSON.parse(currentPrefs))) {
                    global.prefs = {
                        debugMode: 'false',
                    };
                    tm.savePreferences(global.ids.prefsName, global.prefs);
                } else {
                    global.prefs = JSON.parse(currentPrefs);
                }
            },
            setMems: function() {
                var currentMems = GM_getValue(global.ids.memsName);
                if (currentMems == null || _.isEmpty(JSON.parse(currentMems))) {
                    global.mems = {};
                    global.mems.ariaMuteElements = [];
                    global.mems.domHideElements = [];
                    tm.savePreferences(global.ids.memsName, global.mems);
                } else {
                    global.mems = JSON.parse(currentMems);
                }
            },
            addClasses: function () {
                if (!global.states.areClassesAdded) {
                    global.states.areClassesAdded = true;

                    tm.addGlobalStyle('#ariaFocusHandle:focus, #ariaFocusHandle:active { border: .2rem solid firebrick}');

                    tm.addGlobalStyle('.iClicked { background-color: firebrick !important; }');

                    // keyboard shortcut class
                    tm.addGlobalStyle('kbd { background-color:#fcfcfc; border:solid 1px #ccc; border-bottom-color:#bbb; border-radius:3px; box-shadow:inset 0 -1px 0 #bbb; color:#555; display:inline-block; font-family:"Pragmata Pro","Liberation Mono","Source Code Pro","Droid Sans","Envy Code R",Consolas,Menlo,monospace!important; font-size:1.025rem; line-height:1em; padding:3px 5px; vertical-align:middle }'); /* credit: https://damieng.com/ */

                }
            },
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
                                value: 70,
                                ctrl: true,
                                alt: true,
                                method: utils.keys.muteElement,
                                hint: 'mute element'
                            },{
                                value: 71,
                                ctrl: true,
                                alt: true,
                                method: () => {utils.keys.muteElement('parent')},
                                hint: 'mute parent element'
                            },{
                                value: 35,
                                ctrl: true,
                                alt: true,
                                method: () => {utils.keys.muteElement('hide')},
                                hint: 'hide element'
                            },{
                                value: 74,
                                ctrl: true,
                                alt: true,
                                method: utils.keys.manageMutes,
                                hint: 'manage muted elements'
                            },{
                                value: 85,
                                ctrl: true,
                                alt: true,
                                method: () => {utils.keys.manageMutes('hide')},
                                hint: 'manage hidden elements'
                            },{
                                value: 38,
                                ctrl: true,
                                alt: true,
                                method: utils.keys.selectParent,
                                hint: 'select parent'
                            },{
                                value: 40,
                                ctrl: true,
                                alt: true,
                                method: utils.keys.selectChild,
                                hint: 'select child'
                            },{
                                value: 37,
                                ctrl: true,
                                alt: true,
                                method: utils.keys.selectPrevSibling,
                                hint: 'select previous sibling'
                            },{
                                value: 39,
                                ctrl: true,
                                alt: true,
                                method: utils.keys.selectNextSibling,
                                hint: 'select next sibling'
                            },{
                                value: 36,
                                ctrl: true,
                                alt: true,
                                method: () => {
                                    global.states.selectElementMode = !global.states.selectElementMode;
                                    utils.announce('HIDE mode: ' + global.states.selectElementMode);
                                },
                                hint: 'toggle hide mode'
                            },{
                                value: 27,
                                ctrl: false,
                                alt: false,
                                method: utils.keys.closePopup,
                                hint: 'close popup'
                            },{
                                value: 112,
                                ctrl: true,
                                alt: false,
                                method: () => {
                                    var scrName = global.ids.scriptName.replace(/\s/g, '');
                                    var modalId = scrName + 'Options',
                                        modalBody = '';
                                    keyCodes.forEach(code => {
                                        modalBody += '<div class="popupDetailTitle shortCut">';
                                        modalBody += code.ctrl ? '<kbd>CTRL</kbd>' : '';
                                        modalBody += code.alt ? '<kbd>ALT</kbd>' : '';
                                        modalBody += '<kbd>' + utils.keycodes.filter(kc => {return kc.id === code.value})[0].name + '</kbd>'
                                        modalBody += '</div>';
                                        modalBody += '<div class="popupDetailContent">' + capital_letter(code.hint) + '</div>';
                                    });
                                    modalBody += '<div>&nbsp;</div>' +
                                        '<div style="text-align:right;">' +
                                        '<button aria-label="Close Aria Assistant modal" id="closeAriaAssist" class="tBtn tBtnMain">Close</button>' +
                                        '<div style="padding:20px;">' + utils.getUrl() + '</div>' +
                                        '</div';
                                    tm.showModal(modalId, modalBody);
                                    // hide the default popup Close because for some weird reason it's not working
                                    $('.popupDetailContent.fingery').hide();
                                    $('#closeAriaAssist').on('click', function() {
                                        utils.keys.closePopup();
                                    });
                                },
                                hint: 'show shortcut keys'
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
            muteMuted: function (mode) {
                if (!global.states.areHiddenElementsHidden || !global.states.areMutedElementsMuted) {
                    if (mode === 'hide') {
                        global.states.areHiddenElementsHidden = true;
                    } else {
                        global.states.areMutedElementsMuted = true;
                    }
                    var arr = global.mems.ariaMuteElements;
                    if (mode === 'hide') {
                        arr = global.mems.domHideElements;
                    }
                    _.each(arr, function(leId) {
                        var leEl;
                        switch (leId.type) {
                            case ('id'):
                                leEl = '#' + leId.value;
                                break;
                            case ('class'):
                                leEl = '.' + leId.value;
                                break;
                            case ('name'):
                                leEl = '[name="' + leId.value + '"]';
                                break;
                            case ('title'):
                                leEl = '[title="' + leId.value + '"]';
                                break;
                            case('aria-label'):
                                leEl = '[aria-label="' + leId.value + '"]';
                                break;
                        }
                        if (leEl != null) {
                            if (leId.url === utils.getUrl()) {
                                tm.getContainer({
                                    'el': leEl,
                                    'max': 100,
                                    'spd': 1000
                                }).then(function($container){
                                    if (mode === 'hide') {
                                        $(leEl).hide();
                                    } else {
                                        $(leEl).attr('aria-hidden', true).attr('tabindex', '-1');
                                    }
                                });
                            }
                        } else {
                            if (global.prefs.debugMode === 'true') tm.log('Unable to wait for element.');
                        }
                    });
                }
            }
        },
        utils = {
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
                if (global.prefs.debugMode === 'true') tm.log(theMessage);
                var randomNum = utils.rnd();
                $('body').prepend('<span style="position:absolute; left:-1000px; width:0;" role="alert" id="ariaRemoved' + randomNum + '">' + theMessage + '</span>');
                $.growl.notice({
                    message: theMessage,
                    size: 'medium'
                });
                window.setTimeout(() => {
                    $('#ariaRemoved' + randomNum).remove();
                }, 5000);
            },
            getModalId: function () {
                var scrName = global.ids.scriptName.replace(/\s/g, '');
                var modalId = scrName + 'Options';
                return {
                    scrName: scrName,
                    modalId: modalId
                };
            },
            getPropToSave: function (focusedElement) {
                var propToSave = focusedElement.attr('id') ? 'id' :
                focusedElement.attr('aria-label') ? 'aria-label' :
                focusedElement.attr('name') ? 'name' :
                focusedElement.attr('title') ? 'title' :
                focusedElement.attr('class') ? 'class' : undefined;
                return propToSave;
            },
            keys: {
                closePopup: function () {
                    var modalId = utils.getModalId().modalId;
                    if ($('#' + modalId).length > 0) {
                        utils.announce('Options popup closed.');
                        $('#' + modalId).remove();
                    }
                },
                manageMutes(hide) {
                    var arr = global.mems.ariaMuteElements,
                        label = 'mute';
                    if (hide === 'hide') {
                        label = 'hide';
                        arr = global.mems.domHideElements;
                    }
                    var scrName = utils.getModalId().scrName;
                    var modalId = utils.getModalId().modalId,
                        addBody = function(label, content) {
                            if (content == null) {
                                content = label;
                                label = '&nbsp;';
                            }
                            modalBody += '    <div class="popupDetailTitle">' + label + '</div><div class="popupDetailContent">' + content + '</div>';
                        };

                    if ($('#' + modalId).length === 0) {
                        var modalBody = '',
                            elButton;
                        addBody('<h3 id="ariaFocusHandle" aria-label="Options panel for ' + scrName + '" role="alert">' + modalId + ' ' + (hide === 'hide' ? 'hide' : 'mute') + ' Menu</h3>', '&nbsp;');

                        _.each(arr, (leEl) => {
                            if (leEl.url === utils.getUrl()) {
                                elButton = '<button class="removeMute tBtn" aria-label="Unmute element with ' + leEl.type + ' ' + leEl.value +'" value="' + leEl.value + '">' +
                                    'Un' + label + ' [' + leEl.type + '] ' + leEl.value +
                                    '</button>';
                                addBody(elButton);
                            }
                        });

                        addBody('<div style="text-align:right;">' +
                                '<button aria-label="Close Aria Assistant modal" id="closeAriaAssist" class="tBtn tBtnMain">Close</button>' +
                                '<button aria-label="Reset all ' + label + 'd elements on this page." id="resetAriaAssist" class="tBtn">Reset All</button>' +
                                '<div style="padding:20px;">' + utils.getUrl() + '</div>' +
                                '</div');
                        tm.showModal(modalId, modalBody);
                        var div = document.getElementById(modalId);
                        div.tabIndex = -1;
                        div.focus();

                        // hide the default popup Close because for some weird reason it's not working
                        $('.popupDetailContent.fingery').hide();

                        $('#closeAriaAssist').on('click', function() {
                            utils.keys.closePopup();
                        });

                        if (hide === 'hide') {
                            $('#resetAriaAssist').on('click', function() {
                                global.mems.domHideElements = global.mems.domHideElements.filter(function(o) { return o.url !== utils.getUrl(); });
                                tm.savePreferences(global.ids.memsName,global.mems);
                                $('.removeMute').remove();
                                utils.announce('All hiding reset. Please refresh this window.');
                            });

                            $('.removeMute').on('click', function() {
                                var btnVal = this.value;
                                var indexOfSta = this.innerText.indexOf('[') + 1;
                                var indexOfEnd = this.innerText.indexOf(']');
                                var elType = this.innerText.substr(indexOfSta, indexOfEnd - indexOfSta);
                                switch (elType) {
                                    case ('id'):
                                        elType = '#' + btnVal;
                                        break;
                                    case ('class'):
                                        elType = '.' + btnVal;
                                        break;
                                    case ('name'):
                                        elType = '[name="' + btnVal + '"]';
                                        break;
                                    case ('title'):
                                        elType = '[title="' + btnVal + '"]';
                                        break;
                                    case('aria-label'):
                                        elType = '[aria-label="' + btnVal + '"]';
                                        break;
                                }
                                $(elType).show();
                                global.mems.domHideElements = global.mems.domHideElements.filter(function(o) { return o.value !== btnVal; });
                                tm.savePreferences(global.ids.memsName,global.mems);
                                utils.announce('I have unhidden this element. ' + btnVal + '. You might need to refresh this window.');
                                this.remove();
                            });
                        } else {
                            $('#resetAriaAssist').on('click', function() {
                                global.mems.ariaMuteElements = global.mems.ariaMuteElements.filter(function(o) { return o.url !== utils.getUrl(); });
                                tm.savePreferences(global.ids.memsName,global.mems);
                                $('.removeMute').remove();
                                utils.announce('All muting reset. Please refresh this window.');
                            });

                            $('.removeMute').on('click', function() {
                                var btnVal = this.value;
                                global.mems.ariaMuteElements = global.mems.ariaMuteElements.filter(function(o) { return o.value !== btnVal; });
                                tm.savePreferences(global.ids.memsName,global.mems);
                                utils.announce('I have unmuted this element. ' + btnVal + '. Please refresh this window.');
                                this.remove();
                            });
                        }
                    }
                },
                muteElement(mode) {
                    var childPropToSave,
                        arr = global.mems.ariaMuteElements,
                        saveElement = function (focusedElement, propToSave, mode) {
                            var url = utils.getUrl();
                            objToSave = {
                                url: url,
                                type: propToSave,
                                value: focusedElement.attr(propToSave)
                            };
                            var alreadyStored = arr.find(function(element) {
                                return element.url === objToSave.url && element.value === objToSave.value && element.type === objToSave.type;
                            });
                            if (alreadyStored == null){
                                arr.push(objToSave);
                                tm.savePreferences(global.ids.memsName,global.mems);
                                utils.announce('I have ' + (mode === 'hide' ? 'hidden' : 'muted') + ' this element by ' + objToSave.type + '. ' + objToSave.value);
                            } else {
                                utils.announce('This element is already ' + (mode === 'hide' ? 'hidden' : 'muted') + '.');
                            }
                        },
                        hideChildren = function(focusedElement) {
                            var $child;
                            _.each(focusedElement.children(), (child) => {
                                $child = $(child);
                                if ($child.children().length > 0) {
                                    return hideChildren($child);
                                }
                                if ($child.attr != null) {
                                    childPropToSave = utils.getPropToSave($child);
                                    if (childPropToSave != null) {
                                        $child.attr('aria-hidden', true).attr('tabindex', '-1');
                                        saveElement($child, childPropToSave, mode);
                                    }
                                }
                            });
                        };
                    if (mode === 'hide') {
                        if (!global.states.selectElementMode) {
                            return;
                        }
                        arr = global.mems.domHideElements;
                    } else {
                        if (mode !== 'parent') {
                            global.focusedElement = $(document.activeElement);
                        } else {
                            global.focusedElement = $(document.activeElement).parent();
                        }
                    }

                    var objToSave,
                        propToSave;

                    utils.flickerElement(global.focusedElement);

                    if (global.focusedElement == null || global.focusedElement.is("body")) {
                        utils.announce('Cannot modify body element.');
                        return;
                    }
                    propToSave = utils.getPropToSave(global.focusedElement);

                    if (propToSave != null) {
                        if (mode === 'hide') {
                            var temp = global.focusedElement;
                            global.focusedElement.hide();
                            setTimeout(() => {
                                global.focusedElement = temp.parent();
                                $('html,body').animate({scrollTop: global.focusedElement.offset().top}, 200, function() {
                                    utils.flickerElement(global.focusedElement);
                                });
                            }, 500);
                        } else {
                            if (mode === 'parent') {
                                hideChildren(global.focusedElement.parent());
                            } else {
                                global.focusedElement.attr('aria-hidden', true).attr('tabindex', '-1');
                            }
                        }
                        saveElement(global.focusedElement, propToSave, mode);
                    } else {
                        utils.announce('I couldn\'t ' + (mode === 'hide' ? 'hide' : 'mute') + ' this element!');
                    }

                },
                keyNavAnnounce: () => {
                    var prop = utils.getPropToSave(global.focusedElement);
                    utils.announce('FOUND: ' + global.focusedElement.attr(prop));
                },
                selectParent: () => {
                    if (global.states.selectElementMode === false) {
                        return;
                    }
                    if (global.focusedElement != null) {
                        if (global.focusedElement.parent().length > 0) {
                            global.focusedElement = global.focusedElement.parent();
                        }
                        utils.flickerElement(global.focusedElement);
                    }
                    utils.keys.keyNavAnnounce();
                },
                selectChild: () => {
                    if (global.states.selectElementMode === false) {
                        return;
                    }
                    if (global.focusedElement != null) {
                        if (global.focusedElement.children().eq(0).length > 0) {
                            global.focusedElement = global.focusedElement.children().eq(0);
                        }
                        utils.flickerElement(global.focusedElement);
                    }
                    utils.keys.keyNavAnnounce();
                },
                selectNextSibling: () => {
                    if (global.states.selectElementMode === false) {
                        return;
                    }
                    if (global.focusedElement != null) {
                        if (global.focusedElement.next().length > 0) {
                            global.focusedElement = global.focusedElement.next();
                        }
                        utils.flickerElement(global.focusedElement);
                    }
                    utils.keys.keyNavAnnounce();
                },
                selectPrevSibling: () => {
                    if (global.states.selectElementMode === false) {
                        return;
                    }
                    if (global.focusedElement != null) {
                        if (global.focusedElement.prev().length > 0) {
                            global.focusedElement = global.focusedElement.prev();
                        }
                        utils.flickerElement(global.focusedElement);
                    }
                    utils.keys.keyNavAnnounce();
                }
            },
            keycodes: [{"id":8,"name":"Backspace"},{"id":9,"name":"Tab"},{"id":13,"name":"Enter"},{"id":16,"name":"Shift"},{"id":17,"name":"Ctrl"},{"id":18,"name":"Alt"},{"id":19,"name":"Pause/Break"},{"id":20,"name":"Caps Lock"},{"id":27,"name":"Esc"},{"id":33,"name":"Page Up"},{"id":34,"name":"Page Down"},{"id":35,"name":"End"},{"id":36,"name":"Home"},{"id":37,"name":"←"},{"id":38,"name":"↑"},{"id":39,"name":"→"},{"id":40,"name":"↓"},{"id":45,"name":"Insert"},{"id":46,"name":"Delete"},{"id":48,"name":"0"},{"id":49,"name":"1"},{"id":50,"name":"2"},{"id":51,"name":"3"},{"id":52,"name":"4"},{"id":53,"name":"5"},{"id":54,"name":"6"},{"id":55,"name":"7"},{"id":56,"name":"8"},{"id":57,"name":"9"},{"id":65,"name":"A"},{"id":66,"name":"B"},{"id":67,"name":"C"},{"id":68,"name":"D"},{"id":69,"name":"E"},{"id":70,"name":"F"},{"id":71,"name":"G"},{"id":72,"name":"H"},{"id":73,"name":"I"},{"id":74,"name":"J"},{"id":75,"name":"K"},{"id":76,"name":"L"},{"id":77,"name":"M"},{"id":78,"name":"N"},{"id":79,"name":"O"},{"id":80,"name":"P"},{"id":81,"name":"Q"},{"id":82,"name":"R"},{"id":83,"name":"S"},{"id":84,"name":"T"},{"id":85,"name":"U"},{"id":86,"name":"V"},{"id":87,"name":"W"},{"id":88,"name":"X"},{"id":89,"name":"Y"},{"id":90,"name":"Z"},{"id":91,"name":"Left WinKey"},{"id":92,"name":"Right WinKey"},{"id":93,"name":"Select"},{"id":96,"name":"NumPad 0"},{"id":97,"name":"NumPad 1"},{"id":98,"name":"NumPad 2"},{"id":99,"name":"NumPad 3"},{"id":100,"name":"NumPad 4"},{"id":101,"name":"NumPad 5"},{"id":102,"name":"NumPad 6"},{"id":103,"name":"NumPad 7"},{"id":104,"name":"NumPad 8"},{"id":105,"name":"NumPad 9"},{"id":106,"name":"NumPad *"},{"id":107,"name":"NumPad +"},{"id":109,"name":"NumPad -"},{"id":110,"name":"NumPad ."},{"id":111,"name":"NumPad /"},{"id":112,"name":"F1"},{"id":113,"name":"F2"},{"id":114,"name":"F3"},{"id":115,"name":"F4"},{"id":116,"name":"F5"},{"id":117,"name":"F6"},{"id":118,"name":"F7"},{"id":119,"name":"F8"},{"id":120,"name":"F9"},{"id":121,"name":"F10"},{"id":122,"name":"F11"},{"id":123,"name":"F12"},{"id":144,"name":"Num Lock"},{"id":145,"name":"Scroll Lock"},{"id":186,"name":";"},{"id":187,"name":"="},{"id":188,"name":","},{"id":189,"name":"-"},{"id":190,"name":"."},{"id":191,"name":"/"},{"id":192,"name":"`"},{"id":219,"name":"["},{"id":220,"name":"\\"},{"id":221,"name":"]"},{"id":222,"name":"'"}]
            /* Key Code list by http://www.javascriptkeycode.com */
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
