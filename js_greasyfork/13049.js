// ==UserScript==
// @name        iRacing Auto Join
// @version     2.1.1
// @author      Paul Ilbrink
// @copyright   2012 - 2019, Paul Ilbrink
// @namespace   http://www.paulilbrink.nl/userscripts
// @description This script adds an auto join checkbox after registering for an iRacing session. Once a green join button becomes available it will be automatically clicked if the checkbox is ticked.
// @match       *://members.iracing.com/membersite/member/*
// @exclude     *://members.iracing.com/membersite/member/EventResult*
// @exclude     *://members.iracing.com/membersite/member/JoinedRace.do
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/13049/iRacing%20Auto%20Join.user.js
// @updateURL https://update.greasyfork.org/scripts/13049/iRacing%20Auto%20Join.meta.js
// ==/UserScript==

var script = document.createElement("script");
script.textContent = "(" + PI_iRacingAutoJoin.toString() + ")();";
document.body.appendChild(script);

function PI_iRacingAutoJoin() {

    // add css styles to the page
    PI_addStyle = function (css) {
        var style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    };

    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    PI_getUuid = function () {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    };

    PI_AUTO_JOIN = {
        key: 'PI_AUTO_JOIN',
        settings: {
            autoJoinChecked: false,
            autoJoinPreSessionPractice: false,
            sessionJoined: -1,
            uid: null
        },
        checkbox: null,
        uid: PI_getUuid(),
        // initializes auto join
        INIT: function () {
            var thiz = this;
            thiz.setupListeners();
            thiz.loadSettings();
            thiz.addSettings();
        },
        // addding settings dialog
        addSettings: function () {
            var thiz = this;
            $('<span class="icon icon-gear"></span>').css({
                position: 'absolute',
                top: 40,
                right: 7,
                color: 'gold',
                cursor: 'pointer'
            }).on('click', function () {
                var settingsHtml = '<div id=piAjSettings>';
                settingsHtml += '<h3>iRacing Auto Join settings</h3>';

                if (!thiz.checkbox) {
                    settingsHtml += '<label><input type=checkbox class=piAjCheckbox';
                    settingsHtml += (thiz.settings.autoJoinChecked ? ' checked=checked' : '');
                    settingsHtml += ' /> Auto join enabled?</label>';
                }

                settingsHtml += '<label><input type=checkbox class=piAjPreSessionPractice';
                settingsHtml += (thiz.settings.autoJoinPreSessionPractice ? ' checked=checked' : '');
                settingsHtml += ' /> Join pre-session practice? (if available)</label>';
                settingsHtml += '</div>';

                iRacingAlerts(settingsHtml);
            }).appendTo('#racingpanel_inner');
        },
        // setup various listeners
        setupListeners: function () {
            var thiz = this;

            // local storage listener - stay up to date with changes made in other windows/tabs
            $(window).on('storage', function (e) {
                if (e.originalEvent.key === thiz.key) {
                    lightsOn();
                    // tiny delay, because Edge sucks
                    setTimeout(function () {
                        thiz.loadSettings();
                    }, 50);
                }
            });

            // pre session setting
            $(document).on('change', '.piAjPreSessionPractice', function () {
                thiz.settings.autoJoinPreSessionPractice = this.checked;
                thiz.saveSettings();
            });

            // monitor the auto join checkbox
            $(document).on('change', '.piAjCheckbox', function (e) {
                e.stopPropagation();
                thiz.settings.autoJoinChecked = this.checked;
                if (!thiz.settings.autoJoinChecked) {
                    // manually unchecked the checkbox, so reset hasJoinedBefore?
                    thiz.settings.sessionJoined = -1;
                }
                thiz.saveSettings();
            });
        },
        // add checkbox to the page
        showCheckbox: function (data) {
            var thiz = this;
            if (thiz.checkbox) {
                return;
            }

            thiz.checkbox = $('<input type=checkbox class=piAjCheckbox />').css({
                position: 'absolute',
                top: 37,
                right: 27
            }).attr(
                    'checked', thiz.settings.autoJoinChecked
                    ).appendTo('#racingpanel_inner');

        },
        // remove checkbox
        cleanupCheckbox: function (data, notRegisteredAnymore) {
            var thiz = this;
            if (thiz.checkbox) {
                thiz.checkbox.remove();
                thiz.checkbox = null;
            }
            // no longer registered, so no need to prevent re-joining previous session anymore
            if (notRegisteredAnymore) {
                thiz.settings.sessionJoined = -1;
                thiz.saveSettings();
            }
        },
        // join button becomes available, handle appropriately
        clickJoinButton: function (data) {
            var thiz = this;

            var isActualSession = data.sessionid === data.targetsessionid;
            var canJoin = thiz.settings.autoJoinChecked &&
                    (isActualSession || thiz.settings.autoJoinPreSessionPractice);

            if (canJoin) {
                setTimeout(function () {
                    var hasJoinedBefore = data.sessionid === thiz.settings.sessionJoined;
                    var joinButton = $('#racingpanel_session a.brand-success');

                    if (hasJoinedBefore) {
                        joinButton.text('Click yourself this time…');
                    } else {
                        thiz.settings.sessionJoined = data.sessionid;
                        thiz.settings.uid = thiz.uid;

                        joinButton.text('Auto join in progress...');
                        thiz.saveSettings();
                        joinButton.trigger('click');

                        thiz.cleanupCheckbox();
                    }

                }, 250);
            } else if (!isActualSession && !thiz.settings.autoJoinPreSessionPractice) {
                // there is a pre session practice, so wait for the actual session
            } else {
                // auto join not checked, leave checkbox there for now...
            }
        },
        // load auto join settings from local storage
        loadSettings: function () {
            var thiz = this;

            // keep track of window/tab uuid
            var sessionUid = window.sessionStorage.getItem(thiz.key);
            if (sessionUid) {
                thiz.uid = sessionUid;
            } else {
                sessionStorage.setItem(thiz.key, thiz.uid);
            }

            // load settings from local storage
            var storageSettings = localStorage.getItem(thiz.key);
            if (storageSettings) {
                try {
                    $.extend(thiz.settings, JSON.parse(storageSettings));

                    if (thiz.checkbox && thiz.checkbox.checked !== thiz.settings.autoJoinChecked) {
                        thiz.checkbox.attr('checked', thiz.settings.autoJoinChecked);
                    }
                } catch (err) {
                    console.error('an error occurred while parsing the storageSettings', storageSettings, err);
                    return false;
                }
            }
        },
        // save auto join settings to local storage
        saveSettings: function () {
            var thiz = this;

            thiz.settings.uid = thiz.uid;
            localStorage.setItem(thiz.key, JSON.stringify(thiz.settings));
            sessionStorage.setItem(thiz.key, thiz.uid);
        },
        // monitor changes in registration status on the iracing member site
        monitorRegistrationStatus: function (data) {
            var thiz = this;
            if (data) {
                switch (data.status) {
                    case racingpaneldata.sessionstatus.ok_to_join:  // 3
                        thiz.showCheckbox(data);
                        thiz.clickJoinButton(data);
                        break;
                    case racingpaneldata.sessionstatus.registered:  // 1
                    case racingpaneldata.sessionstatus.assigned:    // 5
                        thiz.showCheckbox(data);
                        break;
                    case racingpaneldata.sessionstatus.do_not_join: // 2 - is this correct, no idea?
                    case racingpaneldata.sessionstatus.joined:      // 4
                        thiz.cleanupCheckbox(data, false);
                        break;
                    case racingpaneldata.sessionstatus.withdrawn:   // 6
                    case racingpaneldata.sessionstatus.rejected:    // 7
                    case - 1: // reg_none | You are not registered for any event.
                        thiz.cleanupCheckbox(data, true);
                        break;
                    default:
                        console.error('[auto join] unknown sessionstatus', data.status, data.regStatus);
                        break;
                }
            } else {
                // not registered at all
                thiz.cleanupCheckbox('empty registration status object');
            }
        }
    };

    // check if there even is a control panel
    if (IRACING.control_panels) {
        // add auto join styling
        PI_addStyle('#piAjSettings label { text-align:left; display:block; }');

        // init auto join
        PI_AUTO_JOIN.INIT();

        // interecepting iracing triggers to detect session registration status
        IRACING.control_panels.OrgShowRegistrationStatus = IRACING.control_panels.showRegistrationStatus;
        IRACING.control_panels.showRegistrationStatus = function (data) {
            try {
                PI_AUTO_JOIN.monitorRegistrationStatus(data);
            } catch (err) {
                console.err('an error occured while processing PI_AUTO_JOIN', err);
            }
            this.OrgShowRegistrationStatus(data);
        };
    }
}