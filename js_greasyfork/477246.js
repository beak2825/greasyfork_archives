// ==UserScript==
// @name        The West Definitely Illegal Toolkit
// @author      Mr. Perseus
// @namespace   tw-perseus
// @description Useful, but probably illegal tools for The West. Requires The West Perseus Toolkit.
// @license     MIT
// @include     https://*.the-west.*/game.php*
// @include     http://*.the-west.*/game.php*
// @include     https://*.tw.innogames.*/game.php*
// @include     http://*.tw.innogames.*/game.php*
// @version     0.5.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/477246/The%20West%20Definitely%20Illegal%20Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/477246/The%20West%20Definitely%20Illegal%20Toolkit.meta.js
// ==/UserScript==

(function(fn) {
    const script = document.createElement('script');
    script.setAttribute('type', 'application/javascript');
    script.textContent = `(${fn})();`;
    document.body.appendChild(script);
    document.body.removeChild(script);
})(() => {
    $(document).ready(() => {
        const TWDIT = {
            base64: {
                menuImage:
                    "url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAABmgAwAEAAAAAQAAABkAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIABkAGQMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/3QAEAAL/2gAMAwEAAhEDEQA/APHLTT9Z1bU7101HUApunA2t8qgHp0rqbXwHq0ttuOo6kGI67zXpX7PEA1bw5rGmGCF3S6llRmAGMOSQTjjI5r0iNLRtEvpBEgCNEA2QNoO7+eBXwmPzDFqs4wdld213sfQUIUlH3o3/AOCfJHjfw54i8PKsrajqSLhHG9iMgkeorpvt93/z9Tf9917h+0FdaMPAWvQ3yJNeyWkK2I8v5rVgvLFv4geDtFeBbx6frXuZZiJ1qT53do4qyXNeKsf/0PP/AIdePv8AhHW1TTGvmtop7lvMHK5AbPb612yfEjRfIZBfwFWxkZPOOmRXmV1/rR9Kb2r5fE5LSxE/aOTR7VLHSpR5eVMu/E74gx6zaPZ28jTGQqhbDEkZ6fhUGW/55tUEf+tH1FSV3YXDQwkOSBz1q0q0rs//2Q==')",
            },
            version: '0.5.0',
            settingsKey: 'TWDIT_preferences',
            defaultPreferences: {
                JobHighlighter: true,
                CinemaDisableVideo: true,
                FifteenSecondsUntilEnergyGone: true,
                MultiBuy: true,
            },
            preferences: {},
            infiniteJob: false,
            energyRefillCountdown: 5,
        };

        TWDIT.Updater = {
            init() {
                setTimeout(TWDIT.Updater.load, 5000);
            },

            load() {
                $.getScript(
                    'https://rawcdn.githack.com/mr-perseus/tw-js-library/master/script-updater.js',
                    () => {
                        if (scriptUpdater.TWDIT > TWDIT.version) {
                            const updateMessage = new west.gui.Dialog(
                                'Update: The West Definitely Illegal Toolkit',
                                `<span>Update Available<br><br><b>v${scriptUpdater.TWDIT}:</b><br>${scriptUpdater.TWDITNew}</span>`,
                                west.gui.Dialog.SYS_WARNING,
                            )
                                .addButton('Update', () => {
                                    updateMessage.hide();
                                    window.location.href =
                                        'https://greasyfork.org/scripts/477246-the-west-definitely-illegal-toolkit/code/The%20West%20Definitely%20Illegal%20Toolkit.user.js';
                                })
                                .addButton('cancel')
                                .show();
                        }
                    },
                );
            },
        };

        TWDIT.Settings = {
            init() {
                const storage = JSON.parse(
                    localStorage.getItem(TWDIT.settingsKey),
                );
                TWDIT.preferences = storage || TWDIT.defaultPreferences;

                const div = $('<div class="ui_menucontainer" />');
                const link = $(
                    '<div id="TWDIT_Menu" class="menulink" title="The West Definitely Illegal Toolkit" />',
                )
                    .css('background-image', TWDIT.base64.menuImage)
                    .css('background-position', '0px 0px')
                    .mouseenter(function() {
                        $(this).css('background-position', '-2px 0px');
                    })
                    .mouseleave(function() {
                        $(this).css('background-position', '0px 0px');
                    });

                $(link).on('click', () => {
                    TWDIT.Settings.refreshMenu();
                });

                $('#ui_menubar').append(
                    div
                        .append(link)
                        .append('<div class="menucontainer_bottom" />'),
                );
            },

            refreshMenu() {
                const win = wman
                    .open('TWDITSettings', 'TWDIT Settings', 'noreload')
                    .setMaxSize(1268, 838)
                    .setMiniTitle('TWDIT Settings');
                const scrollPane = new west.gui.Scrollpane();

                const setTitle = function(name) {
                    scrollPane.appendContent(
                        `<p><span style="font-size: 130%; font-weight: bold; font-style: italic; display: inline-block; margin-top: 20px;">${name}</span></p>`,
                    );
                };

                const setCheckBox = function(prefName, text) {
                    const checkbox = new west.gui.Checkbox(text);
                    checkbox.setId(`TWDIT_${prefName}`);
                    if (TWDIT.preferences[prefName]) {
                        checkbox.toggle();
                    }
                    checkbox.setCallback(() => {
                        TWDIT.preferences[prefName] = checkbox.isSelected();
                        localStorage.setItem(
                            TWDIT.settingsKey,
                            JSON.stringify(TWDIT.preferences),
                        );
                        TWDIT.Settings.refreshMenu();
                        new UserMessage(
                            'Okay. Please refresh your page.',
                            'success',
                        ).show();
                    });
                    scrollPane.appendContent(checkbox.getMainDiv());
                };

                setTitle('Enabled Features');
                setCheckBox(
                    'JobHighlighter',
                    "Enable Silver / Gold job highlighter (doesn't search for them on it's own).",
                );
                setCheckBox(
                    'CinemaDisableVideo',
                    'Removes all videos from Cinema (get rewards directly).',
                );
                setCheckBox(
                    'FifteenSecondsUntilEnergyGone',
                    'Adds a checkbox to do the current open job until the energy is gone.',
                );
                setCheckBox(
                    'MultiBuy',
                    'Allow multi buy market. With a delay of 0.5 seconds between each buy.',
                );
                setTitle('Feedback');
                scrollPane.appendContent(
                    '<ul style="margin-left:15px;line-height:18px;">' +
                    '<li>Send a message to <a target="_blank" href="https://www.the-west.de/?ref=west_invite_linkrl&player_id=83071&world_id=1&hash=0dc5">Mr. Perseus on world DE1</a></li>' +
                    '<li>Contact me on <a target="_blank" href="https://greasyfork.org/forum/messages/add/Mr. Perseus">Greasy Fork</a></li>' +
                    '<li>Send me a message on the <a target="_blank" href="https://forum.beta.the-west.net/index.php?conversations/add&to=Mr.%20Perseus">The West Beta Forum</a> or the <a target="_blank" href="https://forum.the-west.de/index.php?conversations/add&to=Mr.%20Perseus">German The West Forum</a></li>' +
                    '</ul><br />Check out other scripts on <a target="_blank" href="https://greasyfork.org/de/users/179973-mr-perseus">Greasyfork</a>.',
                );

                win.appendToContentPane(scrollPane.getMainDiv());
            },
        };

        TWDIT.CinemaDisableVideo = {
            init() {
                // Delay due to TWPT.
                setTimeout(this.initUi, 2000);
            },

            initUi() {
                CinemaWindow.backup_TWDIT_cotroller = CinemaWindow.controller;
                CinemaWindow.controller = function(key) {
                    if (key === 'video')
                        return CinemaWindow.backup_TWDIT_cotroller('rewards');

                    // If there is no ad available you should be able to get the rewards.
                    if (key === 'noVideo') {
                        return CinemaWindow.backup_TWDIT_cotroller('rewards');
                    }

                    return CinemaWindow.backup_TWDIT_cotroller(key);
                };

                CinemaWindow.backup_TWDIT_open = CinemaWindow.open;
                CinemaWindow.open = function(townId) {
                    CinemaWindow.backup_TWDIT_open(townId);
                };
            },
        };

        TWDIT.FifteenSecondsUntilEnergyGone = {
            init() {
                const checkbox = new west.gui.Checkbox('Infinite 9x15s');

                this.initUi(checkbox);
                this.initWorker(checkbox);
            },

            initUi(checkbox) {
                checkbox.setId('infinite_job_checkbox');
                if (TWDIT.infiniteJob) {
                    checkbox.toggle();
                }

                checkbox.setCallback(() => {
                    TWDIT.infiniteJob = checkbox.isSelected();
                });

                const checkboxDiv = checkbox.getMainDiv().get(0);
                checkboxDiv.style['z-index'] = '5';
                checkboxDiv.style.position = 'absolute';
                checkboxDiv.style.top = '-20px';

                document.getElementById('ui_right').prepend(checkboxDiv);
            },

            initWorker(checkbox) {
                setInterval(() => {
                    if (!TWDIT.infiniteJob) {
                        return;
                    }

                    if (TWDIT.energyRefillCountdown > 0) {
                        TWDIT.energyRefillCountdown -= 1;
                    }

                    console.log(
                        'TWDIT',
                        'TWDIT.infiniteJob',
                        TWDIT.infiniteJob,
                        'Character.energy',
                        Character.energy,
                        'TaskQueue.queue.length',
                        TaskQueue.queue.length,
                        'TWDIT.energyRefillCountdown',
                        TWDIT.energyRefillCountdown,
                    );

                    if (Character.energy < 10) {
                        // TODO make item id not hard coded
                        const refillEnergyItem = $('div.item[data-twds_item_id=2129000] > img');
                        if (refillEnergyItem.length === 1) {
                            if (TWDIT.energyRefillCountdown > 0) {
                                console.log('Skipping refill energy item due to countdown.');
                            } else {
                                console.log('Refilling energy.');

                                TWDIT.energyRefillCountdown = 5;

                                refillEnergyItem.click();

                                setTimeout(() => {
                                    $('.tw2gui_dialog .tw2gui_dialog_actions .tw2gui_button .textart_title:contains(\'Ja\')').click();
                                    setTimeout(() => {
                                        $('.tw2gui_dialog .tw2gui_dialog_actions .tw2gui_button .textart_title:contains(\'Ok\')').click();
                                    }, 1000);
                                }, 1000);
                            }
                        } else {
                            console.log('None or multiple refill energy items found. Aborting...', refillEnergyItem.length);

                            TWDIT.infiniteJob = false;
                            const enabled = checkbox.isSelected();
                            if (enabled) {
                                checkbox.toggle();
                            }
                        }
                        return;
                    }

                    if (TaskQueue.queue.length > 0) {
                        return;
                    }

                    const button = $("div.tw2gui_button:contains('9x 15s')");
                    console.log('TWDIT', 'Starting job', button);
                    if (button.length === 1) {
                        button.click();
                    } else {
                        console.warn(
                            'TWDIT',
                            'Not exactly one button found. Please make sure to have exactly ONE task window open!',
                            button,
                        );
                    }
                }, 5555);
            },
        };

        TWDIT.JobHighlighter = {
            init() {
                $('head').append(
                    '<style type="text/css">' +
                    '.jobgroup.silver {background-color: rgba(192, 192, 192, .7); border-radius: 10%; } ' +
                    '.jobgroup.gold {background-color: rgba(255, 215, 0, .7); border-radius: 10%; }' +
                    '</style>',
                );

                GameMap.Component.JobGroup.prototype.backup_twpt_getAdditionalClasses =
                    GameMap.Component.JobGroup.prototype.getAdditionalClasses;
                GameMap.Component.JobGroup.prototype.getAdditionalClasses = function(
                    tileX,
                    tileY,
                ) {
                    let backupClasses = GameMap.Component.JobGroup.prototype.backup_twpt_getAdditionalClasses.apply(
                        this,
                        arguments,
                    );
                    const featuredJobs =
                        GameMap.JobHandler.Featured[
                            `${this.getLeft(tileX)}-${this.getTop(tileY)}`
                            ] || {};

                    Object.keys(featuredJobs).forEach((property) => {
                        if (featuredJobs[property].gold) {
                            backupClasses += ' gold';
                        }
                        if (featuredJobs[property].silver) {
                            backupClasses += ' silver';
                        }
                    });

                    return backupClasses;
                };
            },
        };

        TWDIT.MultiBuy = {
            init() {
                // Copied over from https://github.com/The-West-Scripts/Magic-Bundle
                var loadingScreen = $('<div></div>').attr('id', 'xsht_load_screen').css({
                    'position': 'absolute',
                    'top': '0px',
                    'left': '0px',
                    'height': '100%',
                    'width': '100%',
                    'z-index': '100',
                    'display': 'none'
                });
                $('body').append(loadingScreen);
                var progressBar = new west.gui.Progressbar(0, 100);
                Trader.amountChanged = function() {
                    var totalPrice = $('#xsht_item_buy_amount').val() * $('#xsht_item_price').text();
                    $('#xsht_total_price').text('$ ' + totalPrice);
                    if (totalPrice > Character.deposit + Character.money) {
                        $('#xsht_total_price').css({
                            'color': 'red',
                            'font-weight': 'bold'
                        });
                        $('.tw2gui_dialog_actions .tw2gui_button .textart_title:contains("Yes")').parent().fadeOut();
                    } else {
                        $('#xsht_total_price').css({
                            'color': 'black',
                            'font-weight': 'normal'
                        });
                        $('.tw2gui_dialog_actions .tw2gui_button .textart_title:contains("Yes")').parent().fadeIn();
                    }
                }
                var buyStatusText = "All the products were bought.";
                var buyStatus = UserMessage.TYPE_SUCCESS;
                Trader.initProgress = function(bar) {
                    $('#xsht_load_screen').html('<div id="xsht_load_screen"></div>');
                    var barContainer = $('<div></div>').attr('id', 'xsht_bar_container').append(bar.getMainDiv());
                    $('#xsht_load_screen').append(barContainer);
                    $('#xsht_load_screen').fadeIn();
                    if (bar.maxValue > 1)
                        new UserMessage("Started buying " + bar.maxValue + " products! Please wait until the process is completed.", UserMessage.TYPE_ERROR).show();
                    $('#xsht_load_screen .tw2gui_progressbar_progress').append("<span id='xsht_bar_timer' style=\"z-index: 2; right: 5px; top: 0; bottom: 0; position: absolute; color: white; font-size: 12px;line-height: 19px;text-shadow: black 1px 1px 1px;\">1:00</span>");
                    Trader.startTime = new Date().getTime() / 1000;
                }

                Trader.increaseProgress = function() {
                    progressBar.increase(1);
                    if (progressBar.value == progressBar.maxValue) {
                        $('#xsht_load_screen').fadeOut();
                        if (progressBar.maxValue > 1)
                            new UserMessage(buyStatusText, buyStatus).show();
                    }
                    Trader.updateTimer();
                }

                Trader.buy_popup_xhtml = '<div class="bag_item float_left"><img src="%buy_img%" /></div>' + '<span class="item_popup_sell_value">' + 'Single Purchase price:'.escapeHTML() + '$ <span id="xsht_item_price">%buy_popup_price%</span></span><br />' + '<span style="font-size:12px;">' + 'Are you sure you want to purchase this item?'.escapeHTML() + '<br>Amount: ' + '<span class="tw2gui_textfield"><span><input type="number" id="xsht_item_buy_amount" value="1" min="1" max="2147483647" style="width:75px" onchange="Trader.amountChanged()" onkeyup="Trader.amountChanged()"><span class="search_lable_span" style="display: none;">Amount</span></span></span>' + '<div id="xsht_total_price_desc" style="font-size:12px;">Total price: <span id="xsht_total_price">$ %buy_popup_price%</span></div>' + '</span>';
                Trader.buyDialog = function(item_id) {
                    var buy_popup;
                    if ($('#buy_popup')) {
                        $('#buy_popup').remove();
                    }
                    buy_popup = $('<div id="buy_popup" style="opacity: 0.9;"></div>');
                    var item = Trader.getItemByItemId(item_id);
                    if (item) {
                        var html = Trader.buy_popup_xhtml.fillValues({
                            buy_img: item.getImgEl()[0].src,
                            buy_popup_price: item.getBuyPrice(),
                            buy_popup_item_name: item.getName()
                        });
                        var coords = $(Trader.window.divMain).position();
                        new west.gui.Dialog(item.getName(), html).setX(coords.left).setY(coords.top).addButton('yes', function() {
                            var totalAmount = $('#xsht_item_buy_amount').val();
                            progressBar = new west.gui.Progressbar(0, totalAmount);
                            Trader.initProgress(progressBar);
                            for (var i = 0; i < totalAmount; i++)
                                if ($('#xsht_item_buy_amount').val() > 27)
                                    setTimeout(Trader.buyItem, i * 1000, item);
                                else
                                    Trader.buyItem(item);
                        }).addButton('no', function() {
                            Trader.cancelBuy();
                        }).setModal(true, true).show();
                    }
                };

                Trader.buyItem = function(item) {
                    item.getImgEl().css('opacity', '0.3');
                    Ajax.remoteCall(Trader.types[Trader.type], 'buy', {
                        item_id: item.obj.item_id,
                        town_id: Trader.id,
                        last_inv_id: Bag.getLastInvId()
                    }, function(json) {
                        if (json.error) {
                            buyStatusText = json.error;
                            buyStatus = UserMessage.TYPE_ERROR;
                            Trader.increaseProgress();
                            return new UserMessage(json.error, UserMessage.TYPE_ERROR).show();
                        } else {
                            if (json.expressoffer) {
                                if (progressBar.maxValue == 1)
                                    Premium.confirmUse(json.expressoffer + " " + Bag.getLastInvId(), 'Express delivery', "You aren\'t currently in this town. But this item can be delivered to you immediately for a few nuggets.", json.price);
                                buyStatusText = "You are not in the town!"
                                buyStatus = UserMessage.TYPE_ERROR;
                                Trader.increaseProgress();
                            } else {
                                Trader.handleBuyResponse(json);
                                buyStatusText = "All the products were bought.";
                                buyStatus = UserMessage.TYPE_SUCCESS;
                                if (Trader.type == "item_trader") {
                                    item.divMain.remove();
                                }
                            }
                        }
                        item.getImgEl().css('opacity', '1.0');
                        Trader.increaseProgress();
                    });
                    Trader.cancelBuy();
                };

                Trader.updateTimer = function() {
                    var averageTime = (new Date().getTime() / 1000 - Trader.startTime) / progressBar.value;
                    var remainingTime = averageTime * (progressBar.maxValue - progressBar.value);
                    var minutes = parseInt(remainingTime / 60) % 60;
                    var seconds = Math.round(remainingTime % 60);
                    $("#xsht_load_screen #xsht_bar_timer").html(minutes + ":" + (seconds < 10 ? "0" + seconds : seconds));
                };
            }
        }

        try {
            TWDIT.Updater.init();
            TWDIT.Settings.init();
            Object.keys(TWDIT.preferences).forEach((property) => {
                if (TWDIT.preferences[property]) {
                    try {
                        TWDIT[property].init();
                    } catch (err) {
                        console.error(
                            `TWDIT Error with feature "${property}".`,
                            err,
                        );
                    }
                }
            });
        } catch (err) {
            console.error('TWDIT ERROR', err);
        }
    });
});
