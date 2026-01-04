// ==UserScript==
// @name        The West Perseus Toolkit
// @author      Mr. Perseus
// @namespace   tw-perseus
// @description Useful tools for The West.
// @include     https://*.the-west.*/game.php*
// @include     http://*.the-west.*/game.php*
// @include     https://*.tw.innogames.*/game.php*
// @include     http://*.tw.innogames.*/game.php*
// @version     1.3.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/370137/The%20West%20Perseus%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/370137/The%20West%20Perseus%20Toolkit.meta.js
// ==/UserScript==

(function(fn) {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = `(${fn})();`;
    document.body.appendChild(script);
    document.body.removeChild(script);
})(() => {
    $(document).ready(() => {
        const TWPT = {
            base64: {
                menuImage:
                    "url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAABmgAwAEAAAAAQAAABkAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIABkAGQMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/3QAEAAL/2gAMAwEAAhEDEQA/APHLTT9Z1bU7101HUApunA2t8qgHp0rqbXwHq0ttuOo6kGI67zXpX7PEA1bw5rGmGCF3S6llRmAGMOSQTjjI5r0iNLRtEvpBEgCNEA2QNoO7+eBXwmPzDFqs4wdld213sfQUIUlH3o3/AOCfJHjfw54i8PKsrajqSLhHG9iMgkeorpvt93/z9Tf9917h+0FdaMPAWvQ3yJNeyWkK2I8v5rVgvLFv4geDtFeBbx6frXuZZiJ1qT53do4qyXNeKsf/0PP/AIdePv8AhHW1TTGvmtop7lvMHK5AbPb612yfEjRfIZBfwFWxkZPOOmRXmV1/rR9Kb2r5fE5LSxE/aOTR7VLHSpR5eVMu/E74gx6zaPZ28jTGQqhbDEkZ6fhUGW/55tUEf+tH1FSV3YXDQwkOSBz1q0q0rs//2Q==')",
            },
            version: '1.3.0',
            settingsKey: 'TWPT_preferences',
            defaultPreferences: {
                CinemaSkipButton: true,
                ZoomMap: true,
                DisablePremiumNotifications: true,
                NineTimesFifteenButton: true,
                HideDrawingMap: true,
                ChatImprovements: true,
                AlwaysShowFortBattleRecruitment: true,
            },
            preferences: {},
            currentZoom: 1,
        };

        TWPT.Updater = {
            init() {
                setTimeout(TWPT.Updater.load, 5000);
            },

            load() {
                $.getScript(
                    'https://rawcdn.githack.com/mr-perseus/tw-js-library/master/script-updater.js',
                    () => {
                        if (scriptUpdater.TWPT > TWPT.version) {
                            const updateMessage = new west.gui.Dialog(
                                'Update: The West Perseus Toolkit',
                                `<span>Update Available<br><br><b>v${scriptUpdater.TWPT}:</b><br>${scriptUpdater.TWPTNew}</span>`,
                                west.gui.Dialog.SYS_WARNING,
                            )
                                .addButton('Update', () => {
                                    updateMessage.hide();
                                    window.location.href =
                                        'https://greasyfork.org/scripts/370137-the-west-perseus-toolkit/code/The%20West%20Perseus%20Toolkit.user.js';
                                })
                                .addButton('cancel')
                                .show();
                        }
                    },
                );
            },
        };

        TWPT.Settings = {
            init() {
                const storage = JSON.parse(
                    localStorage.getItem(TWPT.settingsKey),
                );
                TWPT.preferences = storage || TWPT.defaultPreferences;

                const div = $('<div class="ui_menucontainer" />');
                const link = $(
                    '<div id="TWPT_Menu" class="menulink" title="The West Perseus Toolkit" />',
                )
                    .css('background-image', TWPT.base64.menuImage)
                    .css('background-position', '0px 0px')
                    .mouseenter(function() {
                        $(this).css('background-position', '-2px 0px');
                    })
                    .mouseleave(function() {
                        $(this).css('background-position', '0px 0px');
                    });

                $(link).on('click', () => {
                    TWPT.Settings.refreshMenu();
                });

                $('#ui_menubar').append(
                    div
                        .append(link)
                        .append('<div class="menucontainer_bottom" />'),
                );
            },

            refreshMenu() {
                const win = wman
                    .open('TWPTSettings', 'TWPT Settings', 'noreload')
                    .setMaxSize(1268, 838)
                    .setMiniTitle('TWPT Settings');
                const scrollPane = new west.gui.Scrollpane();

                const setTitle = function(name) {
                    scrollPane.appendContent(
                        `<p><span style="font-size: 130%; font-weight: bold; font-style: italic; display: inline-block; margin-top: 20px;">${name}</span></p>`,
                    );
                };

                const setCheckBox = function(prefName, text) {
                    const checkbox = new west.gui.Checkbox(text);
                    checkbox.setId(`TWPT_${prefName}`);
                    if (TWPT.preferences[prefName]) {
                        checkbox.toggle();
                    }
                    checkbox.setCallback(() => {
                        TWPT.preferences[prefName] = checkbox.isSelected();
                        localStorage.setItem(
                            TWPT.settingsKey,
                            JSON.stringify(TWPT.preferences),
                        );
                        TWPT.Settings.refreshMenu();
                        new UserMessage(
                            'Okay. Please refresh your page.',
                            'success',
                        ).show();
                    });
                    scrollPane.appendContent(checkbox.getMainDiv());
                    scrollPane.appendContent('<br/>');
                };

                setTitle('Enabled Features');
                setCheckBox(
                    'CinemaSkipButton',
                    'Enable the Cinema Skip button (allows to skip cinema videos after 5 seconds).',
                );
                setCheckBox(
                    'ZoomMap',
                    'Enable the Zoom feature (hover the minimap icon on the top right and scroll up / down to zoom out / in).',
                );
                setCheckBox(
                    'DisablePremiumNotifications',
                    'Suppress energy refill and automation premium notifications.',
                );
                setCheckBox(
                    'NineTimesFifteenButton',
                    'Add a button to job windows which allows you to start 9x 15 second jobs at once.',
                );
                setCheckBox(
                    'HideDrawingMap',
                    'Hides "Drawing Map" flag which is buggy sometimes.',
                );
                setCheckBox(
                    'ChatImprovements',
                    'Enable Chat improvements: show online / idle status in Saloon chat.',
                );
                setCheckBox(
                    'AlwaysShowFortBattleRecruitment',
                    'Always show the recruitment button in fort battle windows. (even if you have no permissions)',
                );
                setTitle('Feedback');
                scrollPane.appendContent(
                    '<ul style="margin-left:15px;line-height:18px;">' +
                        '<li>Send a message to <a target="_blank" href="https://www.the-west.de/?ref=west_invite_linkrl&player_id=83071&world_id=1&hash=0dc5">Mr. Perseus on world DE1</a></li>' +
                        '<li>Contact me on <a target="_blank" href="https://greasyfork.org/forum/messages/add/Mr. Perseus">Greasy Fork</a></li>' +
                        '<li>Send me a message on the <a target="_blank" href="https://forum.beta.the-west.net/index.php?conversations/add&to=Mr.%20Perseus">The West Beta Forum</a> or the <a target="_blank" href="https://forum.the-west.de/index.php?conversations/add&to=Mr.%20Perseus">German The West Forum</a></li>' +
                        '</ul><br />Check out other scripts on <a target="_blank" href="https://greasyfork.org/de/users/179973-mr-perseus">Greasyfork</a>.',
                );

                setTitle(
                    'Import / Export settings from various userscripts (to clipboard)',
                );

                const exportButton = new west.gui.Button(
                    'Export settings',
                    () => {
                        const settings = {};

                        const settingsKeysToStore = [
                            'TWDW_preferences',
                            'TWPT_preferences',
                            'TWToolkit_preferences',
                            'TWCalc_Wardrobe',
                            'TWCalc_Settings',
                            'TWDS_h_',
                            'TWDS_settings',
                            'twir_features',
                        ];

                        Object.entries(localStorage).forEach(([key, value]) => {
                            if (
                                settingsKeysToStore.some((settingToStore) =>
                                    key.startsWith(settingToStore),
                                )
                            ) {
                                settings[key] = value;
                            }
                        });

                        console.log('exporting settings', settings);

                        navigator.clipboard
                            .writeText(JSON.stringify(settings))
                            .then(
                                () => {
                                    new UserMessage(
                                        'Successfully copied settings to clipboard. Please save it somewhere.',
                                        'success',
                                    ).show();
                                },
                                (error) => {
                                    console.error('TWPT error', error);
                                    new UserMessage(
                                        'Failed saving to clipboard. (see console for further details)',
                                        'error',
                                    ).show();
                                },
                            );
                    },
                );
                scrollPane.appendContent(exportButton.getMainDiv());

                scrollPane.appendContent(
                    '<div style="margin-left: 20px;display:inline-block">Enter here: <input id="TWPT_import"/></div>',
                );
                const importButton = new west.gui.Button(
                    'Import settings',
                    () => {
                        try {
                            const stringImport = $('#TWPT_import').val();

                            const settings = JSON.parse(stringImport);

                            Object.entries(settings).forEach(([key, value]) => {
                                console.log(`Importing ${key} = ${value}`);
                                localStorage[key] = value;
                            });

                            new UserMessage(
                                'Successfully imported settings.',
                                'success',
                            ).show();
                        } catch (error) {
                            console.error('TWPT error', error);
                            new UserMessage(
                                'Failed saving to clipboard. (see console for further details)',
                                'error',
                            ).show();
                        }
                    },
                );
                scrollPane.appendContent(importButton.getMainDiv());

                win.appendToContentPane(scrollPane.getMainDiv());
            },
        };

        TWPT.CinemaSkipButton = {
            init() {
                const button = new west.gui.Button('Skip ad', () => {
                    CinemaWindow.controller('rewards');
                });

                CinemaWindow.backup_twpt_cotroller = CinemaWindow.controller;
                CinemaWindow.controller = function(key) {
                    button.setVisible(false);
                    button.disable();

                    // Uncomment the following line if you want to access rewards directly.
                    // if (key === "video") return CinemaWindow.backup_twpt_cotroller("rewards");

                    if (key === 'video') {
                        let count = 15;
                        const countDown = () => {
                            if (count > 0) {
                                button.setCaption(`Skip ad (${count})`);
                                setTimeout(countDown, 1000);
                                count -= 1;
                            } else {
                                button.setCaption('Skip ad');
                                button.enable();
                            }
                        };
                        button.setVisible(true);
                        countDown();
                    }

                    // If there is no ad available you should be able to get the rewards.
                    if (key === 'noVideo') {
                        return CinemaWindow.backup_twpt_cotroller('rewards');
                    }

                    return CinemaWindow.backup_twpt_cotroller(key);
                };

                CinemaWindow.backup_twpt_open = CinemaWindow.open;
                CinemaWindow.open = function(townId) {
                    CinemaWindow.backup_twpt_open(townId);
                    const header = $(this.window.divMain).find(
                        '.tw2gui_inner_window_title',
                    );
                    button.divMain.setAttribute(
                        'style',
                        'margin-left: 20px; margin-top: -20px; position: absolute',
                    );
                    button.divMain.lastChild.setAttribute(
                        'style',
                        'line-height: normal; padding-top: 10px;',
                    );
                    button.setVisible(false);
                    header.append(button.getMainDiv());
                };
            },
        };

        TWPT.ZoomMap = {
            init() {
                $(window).bind('mousewheel', (event) => {
                    if ($('#ui_minimap').is(':hover')) {
                        if (event.originalEvent.wheelDelta >= 0) {
                            if (TWPT.currentZoom < 1.95)
                                TWPT.currentZoom += 0.1;
                        } else if (TWPT.currentZoom > 0.75)
                            TWPT.currentZoom -= 0.1;

                        document.getElementById('map').style.zoom =
                            TWPT.currentZoom;
                    }
                });
            },
        };

        TWPT.DisablePremiumNotifications = {
            init() {
                Premium.checkForEnergyPremium = function(
                    callback,
                    failCallback,
                ) {
                    if (typeof failCallback !== 'undefined')
                        return failCallback();

                    return () => {};
                };
                Premium.checkForAutomationPremium = function(
                    callback,
                    failCallback,
                ) {
                    if (typeof failCallback !== 'undefined')
                        return failCallback();

                    return () => {};
                };
            },
        };

        TWPT.NineTimesFifteenButton = {
            init() {
                JobWindow.backup_twpt_initView = JobWindow.initView;
                JobWindow.initView = function() {
                    JobWindow.backup_twpt_initView.apply(this, arguments);
                    const button = new west.gui.Button('9x 15s', () => {
                        button.disable();
                        const jobAmountNum = this.window.divMain.getElementsByClassName(
                            'job-amount-num',
                        )[0];
                        const numberBefore = jobAmountNum.innerHTML;
                        jobAmountNum.innerHTML = '9';
                        $(this.window.divMain)
                            .find('.job_durationbar.job_durationbar_short')
                            .click();
                        setTimeout(() => {
                            button.enable();
                            jobAmountNum.innerHTML = numberBefore;
                        }, 5000);
                    });

                    const buttonDiv = button.getMainDiv();
                    buttonDiv.style['z-index'] = '5';
                    buttonDiv.style.bottom = '25px';
                    buttonDiv.style.left = '300px';
                    this.window.divMain
                        .querySelector('div.tw2gui_window_content_pane')
                        .appendChild(button.getMainDiv());
                };
            },
        };

        TWPT.HideDrawingMap = {
            init() {
                GameLoader.backup_twpt_async = GameLoader.async;
                GameLoader.async = function(message, signal, callback, max) {
                    GameLoader.backup_twpt_async(
                        message,
                        signal,
                        callback,
                        max,
                        true,
                        true,
                    );
                };
            },
        };

        TWPT.ChatImprovements = {
            init() {
                Chat.Resource.Client.prototype.isStranger = function() {
                    return false;
                };
            },
        };

        TWPT.AlwaysShowFortBattleRecruitment = {
            init() {
                FortBattleWindow.backup_twpt_getInfoArea =
                    FortBattleWindow.backup_twpt_getInfoArea ||
                    FortBattleWindow.getInfoArea;
                FortBattleWindow.getInfoArea = function() {
                    this.preBattle.battleData.canSetPrivilege = true;
                    return FortBattleWindow.backup_twpt_getInfoArea.apply(
                        this,
                        arguments,
                    );
                };
            },
        };

        try {
            TWPT.Updater.init();
            TWPT.Settings.init();
            Object.keys(TWPT.preferences).forEach((property) => {
                if (TWPT.preferences[property]) {
                    try {
                        TWPT[property].init();
                    } catch (err) {
                        console.error(
                            `TWPT Error with feature "${property}".`,
                            err,
                        );
                    }
                }
            });
        } catch (err) {
            console.error('TWPT ERROR', err);
        }
    });
});
