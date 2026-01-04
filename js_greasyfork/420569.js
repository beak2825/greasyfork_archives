// ==UserScript==
// @name         IdleScape - Lootify
// @namespace    D4IS
// @version      1.4.9
// @description  IdleScape Statistics Tracker
// @author       D4M4G3X
// @match        *://*.idlescape.com/*
// @grant        none
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/420569/IdleScape%20-%20Lootify.user.js
// @updateURL https://update.greasyfork.org/scripts/420569/IdleScape%20-%20Lootify.meta.js
// ==/UserScript==
if( typeof WebSocket.prototype._send == "undefined" ){
    WebSocket.prototype._send = WebSocket.prototype.send;
}
WebSocket.prototype.send = function(data){
    this._send(data);
    if( typeof window.IdlescapeSocket == "undefined" ){
        window.IdlescapeSocket = this;
        this.send = this._send;
    }
}
let setupSocket = setInterval(()=> {
    if( typeof window.IdlescapeSocket !== "undefined" ){
        clearInterval(setupSocket);
        window.IdlescapeSocket.addEventListener('message', (e) => socketMessageHandler(e));
        console.log('Lootify: Attached to socket!');
    }
}, 250);

function socketMessageHandler(e) {
    let lib = window.D4IS;
    let getHandler = setInterval(()=> {
        if (lib) {
            clearInterval(getHandler);
            lib.app.messageHandler(e);
        }
    }, 250);
}

(function() {

    /* INITIATE APPLICATION */
    let lib = {};
    let app = {};

    let initInterval = setInterval(()=> {
        if (window.D4IS && window.D4IS.init) {
            clearInterval(initInterval);
            lib = window.D4IS.init('lootify', '1.4.9');
            app = lib['lootify'];
            lib.app.setUpdateLocation(lib.game.getMenuItem('Lootify Settings'));
            main();
        }
    }, 250);

    function main() {
        /* SET DEFAULT VALUES */
        let runs = [{}];
        let total = {};
        let totalLoot = {};
        let headers = {};

        /* ############## INTERVALS ############## */
        let mainInterval = setInterval(()=> {
            if (app.ready && $('.status-action').length) {
                if(is()) {
                    if(!app.setup) {
                        app.setup = true;
                        setupSettings();
                        lib.app.updateUser(app.name);
                        app.getKills();
                        setupLogs();
                    }
                    renderErrors();
                    renderStatus();
                    saveLogs();
                    mergeLogs();
                    renderLogs();
                    renderTimer();
                    renderKPH();
                    renderGPH();
                    renderXPH();
                }
            }
        }, 1000);

        let pasteInterval = setInterval(()=> {
            if (app.ready && $('.status-action').length) {
                if(lib.general.getStorage('AutoPaster') == 'true') {
                    reset('single');
                }
            }
        }, getPasteInterval() * 60 * 1000);

        let adInterval = setInterval(()=> {
            if (app.ready && $('.status-action').length) {
                lib.game.chat({
                    'msg': 'Lootify - Please report bugs to D4M4G3X#6263 on Discord!',
                    'color': '#00a0fd',
                });
            }
        }, 20 * 60 * 1000);

        let updateInterval = setInterval(()=> {
            if (app.ready && $('.status-action').length) {
                lib.app.getData();
                lib.app.updateUser(app.name);
                app.getKills();
            }
        }, 15 * 60 * 1000);

        let quickInterval = setInterval(()=> {
            if (app.ready && $('.status-action').length) {
                addConfirmations();
                checkRemovals();
                checkDisabled();
                checkChests();
            }
        }, 250);

        function addConfirmations() {

            // #### GATHERING CONFIRMATIONS #### //
            $('.resource-container-button').each(function() {
                if(lib.app.data) {
                    if (!lib.app.data.active.skills.includes($(this).parents('.play-area').attr('class').split('theme-')[1])) {
                        return false;
                    }

                    let $parent = $(this).parents('.resource-container');
                    if( !$(this).next('.resource-button-overlay').length && !~$(this).text().indexOf('Stop')) {
                        let $btn = $(this).find('.resource-button').hide();

                        let $btnClone = $('<div>', {
                            'class': 'resource-button-overlay resource-button'
                        }).text($btn.text()).insertAfter($(this));

                        $btnClone.click(function() {
                            let includes = false;
                            // Switch Warnings Disabled
                            if (lib.general.getStorage('SwitchReset') === 'false') {
                                $parent.find('.resource-button:not(.resource-button-overlay)').click();
                                return false;
                            }

                            // Game Start
                            if ((lib.user.isStatus('idling') && !app.prevStatus) || isLogEmpty()) {
                                $parent.find('.resource-button:not(.resource-button-overlay)').click();
                                return false;
                            }

                            // Is Logged
                            if (isLogged('skill', $parent.find('.resource-container-title').text())) {
                                $parent.find('.resource-button:not(.resource-button-overlay)').click();
                                return false;
                            }

                            lib.game.dialog({
                                'title': 'Lootify warning!',
                                'text': 'Going to a different location will paste and reset your Lootify statistics, are you sure you want to do this?',
                                'img': true,
                                'cbyes': function() {
                                    reset();
                                    $parent.find('.resource-button:not(.resource-button-overlay)').click();
                                }
                            });
                        });
                    }
                    if (~$(this).text().indexOf('Stop')) {
                        $(this).next('.resource-button-overlay').remove();
                        $(this).find('.resource-button').show();
                    }
                }
            });

            // #### COOKING CONFIRMATIONS #### //

            if ($('.cooking-item').find('img').length) {
                if(!$('.cooking-start-clone').length && !lib.user.isStatus('cooking')) {
                    let $cookBtn = $('.cooking-start-button').css('visibility', 'hidden');
                    let $cloneBtn = $('<div>', {
                        'class': 'cooking-start-button cooking-start-clone'
                    }).text('Start Cooking').insertAfter($cookBtn);
                    $(window).resize(function() {
                        let pos = $cookBtn.position();
                        $cloneBtn.width($cookBtn.width());
                        $cloneBtn.css({
                            'position': 'absolute',
                            'z-index': '1000',
                            'top': pos.top,
                            'left': pos.left,
                        });
                    }).resize();
                    $cloneBtn.click(function() {
                        // Switch Warnings Disabled
                        if (lib.general.getStorage('SwitchReset') === 'false') {
                            $cookBtn.click();
                            $cookBtn.css('visibility', 'visible');
                            $cloneBtn.hide();
                            return false;
                        }

                        // Game Start
                        if ((lib.user.isStatus('idling') && !app.prevStatus) || isLogEmpty()) {
                            $cookBtn.click();
                            $cookBtn.css('visibility', 'visible');
                            $cloneBtn.hide();
                            return false;
                        }

                        // Is Previous Status
                        if (lib.user.isPrevStatus('cooking')) {
                            $cookBtn.click();
                            $cookBtn.css('visibility', 'visible');
                            $cloneBtn.hide();
                            return false;
                        }

                        lib.game.dialog({
                            'title': 'Lootify warning!',
                            'text': 'Cooking now will paste and reset your current Lootify statistics, are you sure you want to do this?',
                            'img': true,
                            'cbyes': function() {
                                reset();
                                $cloneBtn.hide();
                                $cookBtn.css('visibility', 'visible');
                                $cookBtn.click();
                            }
                        });
                    });
                }
            } else {
                $('.cooking-start-button').css('visibility', 'visible');
                $('.cooking-start-clone').remove();
            }

            // #### COMBAT CONFIRMATIONS #### //

            if ($('.combat-zones').length && !$('.zone-button-overlay').length) {
                let $overlay = $('<div>', {
                    'class': 'zone-button-overlay'
                }).appendTo($('.combat-zones'));

                $('.combat-zone').each(function() {
                    let $zoneBtn = $('<div>', {
                        'class':'combat-zone-clone'
                    }).text($(this).text()).appendTo($overlay);

                    $zoneBtn.click(function(e) {
                        let $parent = $(this).parents('.combat-zones');
                        let $that = $(this);
                        let includes = false;
                        // Switch Warnings Disabled
                        if (lib.general.getStorage('SwitchReset') === 'false') {
                            $parent.find('.combat-zone').each(function() {
                                if($(this).text() === $that.text()) {
                                    $(this).click();
                                }
                            });
                            return false;
                        }

                        // Game Start
                        if ((lib.user.isStatus('idling') && !lib.user.prevStatus) || isLogEmpty()) {
                            $parent.find('.combat-zone').each(function() {
                                if($(this).text() === $that.text()) {
                                    $(this).click();
                                }
                            });
                            return false;
                        }

                        // Is Logged
                        if (isLogged('combat', $(this).text())) {
                            $parent.find('.combat-zone').each(function() {
                                if($(this).text() === $that.text()) {
                                    $(this).click();
                                }
                            });
                            return false;
                        }

                        // Is an event mob
                        if (lib.game.isEventMob(lib.user.currentMob)) {
                            $parent.find('.combat-zone').each(function() {
                                if($(this).text() === $that.text()) {
                                    $(this).click();
                                }
                            });
                            return false;
                        }

                        lib.game.dialog({
                            'title': 'Lootify warning!',
                            'text': 'Going to a different zone will paste and reset your Lootify statistics, are you sure you want to do this?',
                            'img': true,
                            'cbyes': function() {
                                $parent.find('.combat-zone').each(function() {
                                    if($(this).text() === $that.text()) {
                                        reset();
                                        $(this).click();
                                    }
                                });
                            },
                        });
                    });
                });

                $(window).resize(function() {
                    $overlay.width($('.combat-zones').width());
                }).resize();
            }
        }
        function checkRemovals() {
            if(!lib.user.isStatus('foraging')) { return; }
            if ($('.recipe-item').length) {
                $('.recipe-item').each(function() {
                    if($(this).find('img').attr('src') === '/images/foraging/log.png') {
                        $(this).remove();
                    }
                });
            }
        }
        function checkDisabled() {
            if(lib.user.getEnchantment('35') > 0 && lib.user.isStatus('foraging')) {
                app.isNature = true;
            }
            if(lib.user.getEnchantment('7') > 0 && lib.user.isActiveSkill()) {
                app.isWealth = true;
            }
        }
        function checkChests() {
            if ($('.chat-message .activity-log:not(.ltf-done)').length) {
                $('.chat-message .activity-log:not(.ltf-done)').each(function(k, v) {
                    $(this).addClass('ltf-done');
                    let data = {};
                    data.chest = {};
                    data.loot = {};
                    if(~$(this).text().indexOf('geode')) {
                        data.chest.base = 'geode';
                        data.chest.name = 'Geode';
                    } else if(~$(this).text().indexOf('bird nest')) {
                        data.chest.base = 'bird nest';
                        data.chest.name = "Bird's Nest";
                    } else if(~$(this).text().indexOf('sunken treasure')) {
                        data.chest.base = 'sunken treasure';
                        data.chest.name = 'Sunken Treasure';
                    } else if(~$(this).text().indexOf('satchel')) {
                        data.chest.base = 'satchel';
                        data.chest.name = 'Satchel';
                    } else {
                        return false;
                    }
                    let count = $(this).text().split(data.chest.base)[0].match(/\d+/g);
                    data.chest.count = (count) ? parseInt(count) : 1;
                    let loot = $(this).text().split('found ')[1];
                    if(~loot.indexOf(',')) {
                        loot = loot.split(', ');
                    } else {
                        let item = loot.split(' as')[0];
                        loot = [];
                        loot.push(item);
                    }
                    $.each(loot, function(k, loot) {
                        if(~loot.indexOf(' as') && !~loot.indexOf(',')) {
                            loot = loot.split(' as')[0];
                        }
                        data.loot[loot.split(' x ')[0]] = parseInt(loot.split(' x ')[1]);
                    });
                    app.addLogChest(data);
                });
            }
        }

        // #### SETUP SETTINGS ####
        function setupSettings() {
            if(!lib.game.getMenuItem('Lootify', 'category')) {
                lib.game.setMenuItem({
                    'text': 'Lootify',
                    'clone': 'Gathering',
                    'class': 'hdr-lootify',
                    'before': lib.game.getMenuItem('Gathering', 'category'),
                }, 'category');
                $('<i/>').text(' (v'+app.ver+')').appendTo(lib.game.getMenuItem('Lootify', 'category'));
            }
            // ### PRIVACY SETTINGS ###
            lib.game.addSetting({
                'app': 'lootify',
                'text': 'Allow Lootify to publicly use your username for personal highscores and kill statistics',
                'name': 'UserPublic',
                'type': 'checkbox',
                'default': 'false',
                'change': function() {
                    setUserPublic($(this).prop('checked'));
                    lib.general.setStorage('UserPublic', $(this).prop('checked'));
                }
            });
            // ### SETTING AUTO PASTER ###
            lib.game.addSetting({
                'app': 'lootify',
                'text': 'Enable Auto Paster',
                'name': 'AutoPaster',
                'type': 'checkbox',
                'default': 'false',
                'change': function() {
                    lib.general.setStorage('AutoPaster', $(this).prop('checked'));
                }
            });
            // ### SETTING PASTE INTERVAL ###
            lib.game.addSetting({
                'app': 'lootify',
                'text': 'Paste Interval (minutes)',
                'name': 'AutoPasterInterval',
                'type': 'number',
                'min': 15,
                'max': 60,
                'default': 30,
                'change': function() {
                    if($(this).val() >= $(this).attr('min') && $(this).val() <= $(this).attr('max')) {
                        lib.general.setStorage('AutoPasterInterval', $(this).val());
                    }
                }
            });
            // ### SETTING CHAT MESSAGES ###
            lib.game.addSetting({
                'app': 'lootify',
                'text': 'Enable Chat Messages',
                'name': 'ChatMessage',
                'type': 'checkbox',
                'default': 'true',
                'change': function() {
                    lib.general.setStorage('ChatMessage', $(this).prop('checked'));
                }
            });
            // ### RESET ON SWITCH ###
            lib.game.addSetting({
                'app': 'lootify',
                'text': 'Reset on Switch',
                'name': 'SwitchReset',
                'type': 'checkbox',
                'default': 'true',
                'change': function() {
                    lib.general.setStorage('SwitchReset', $(this).prop('checked'));
                }
            });
        }
        function renderErrors() {
            if (!app.disabled || !app.enabled) {
                $('.lootify-error').remove();
            }
            if (!$('.lootify-error.error-paster').length && app.disabled) { // TODO: Create Error Message Function
                let $error = $('<div/>', {
                    'class': 'lootify-error error-paster'
                }).css({
                    'color': 'red',
                    'width': '80%',
                    'margin': '0 auto',
                }).html('Paster is disabled!<br>Reset log to Enable again.').insertAfter(lib.game.getMenuItem('Lootify', 'category'));
                lib.game.tooltip($error, 'Pasting is disabled on market usage, you can still use the counters.<br> This is done to prevent skewing the statistics.');
            }
            if (!$('.lootify-error.error-nature').length && app.isNature) { // TODO: Create Error Message Function
                let $error = $('<div/>', {
                    'class': 'lootify-error error-nature'
                }).css({
                    'color': 'red',
                    'width': '80%',
                    'margin': '0 auto',
                }).html('Paster is disabled!<br>Unequip scroll of nature item and reset to Enable again.').insertAfter(lib.game.getMenuItem('Lootify', 'category'));
                lib.game.tooltip($error, 'Pasting is disabled when scroll of nature is active, you can still use the counters.<br> This is done to prevent skewing the statistics.');
            }
            if (!$('.lootify-error.error-wealth').length && app.isWealth) { // TODO: Create Error Message Function
                let $error = $('<div/>', {
                    'class': 'lootify-error error-wealth'
                }).css({
                    'color': 'red',
                    'width': '80%',
                    'margin': '0 auto',
                }).html('Paster is disabled!<br>Unequip scroll of wealth item and reset to Enable again.').insertAfter(lib.game.getMenuItem('Lootify', 'category'));
                lib.game.tooltip($error, 'Pasting is disabled when scroll of wealth is active, you can still use the counters.<br> This is done to prevent skewing the statistics.');
            }
            if (!$('.lootify-error.error-disabled').length && (app.enabled && app.enabled === 'false')) {  // TODO: Create Error Message Function
                $('<div/>', {
                    'class': 'lootify-error error-disabled'
                }).css({
                    'color': 'red',
                    'width': '80%',
                    'margin': '0 auto',
                }).html('Paster is globally disabled!').insertAfter(lib.game.getMenuItem('Lootify', 'category'));
            }
        }
        function renderStatus() {
            if (!lib.user.isFighting() && !lib.user.isActiveSkill() && !lib.user.isStatus('idling')) {
                $('.ltf-status').remove();
                return false;
            }
            if (!lib.game.getMenuItem('Status:')) {
                lib.game.setMenuItem({
                    'class': 'ltf-status',
                    'text': 'Status:',
                    'clone': 'General Shop',
                    'icon': '/images/combat/combat_level.png',
                    'after': lib.game.getMenuItem('Lootify', 'category'),
                    'click': function() {
                        $('[data-for="'+lib.user.getStatus()+'Header"]').click();
                    }
                });
            }
            let status = lib.user.getStatus();
            status += lib.user.isFighting() ? ' '+lib.user.currentMob : '';
            $('.ltf-status').find('span').text('Status: ' + lib.general.ucfirst(status));
        }
        function setupLogs() {
            if ($('.btn-loot-log').length) {
                $('.btn-loot-log').remove();
            }
            let $logBtn = lib.game.getMenuItem('Loot Log');
            if (($logBtn && $logBtn.text() === 'Loot Log') && !$logBtn.hasClass('btn-loot-log')) {
                lib.game.editMenuItem('Loot Log');
            }
            if(!lib.game.getMenuItem('Lootify Log')) {
                lib.game.setMenuItem({
                    'icon': '/images/ui/inventory_icon.png',
                    'text': 'Lootify Log',
                    'clone': 'General Shop',
                    'class': 'btn-loot-log',
                    'before': lib.game.getMenuItem('Gathering', 'category'),
                    'click': function() {
                        $('.item-log-clone').toggle();
                    },
                });
            }
            let $logwrap = $('.item-log-window');
            $logwrap.hide();
            let $clone = $logwrap.clone();
            $clone.addClass('item-log-clone').removeClass('hidden');
            $clone.find('.item-log-timer').remove();
            $clone.find('.item-log-info').remove();
            $clone.find('.drawer-setting-large').addClass('clone').unbind().click(function() {
                reset();
            }).text('Paste and Reset');
            if (app.disabled || lib.user.isStatus('fishing') || lib.user.isStatus('smithing') || lib.user.isStatus('cooking')) {
                $clone.find('.drawer-setting-large').text('Reset');
            }
            lib.game.getMenuItem('Lootify Log').after($clone);
        }
        function renderTimer() {
            if (!lib.user.isFighting() && !lib.user.isActiveSkill() && !lib.user.isStatus('idling')) {
                $('.time-stats').remove();
                return false;
            }
            if (!lib.game.getMenuItem('Elapsed:')) {
                let $timeStats = lib.game.setMenuItem({
                    'class': 'time-stats',
                    'text': 'Elapsed: 0S',
                    'clone': 'General Shop',
                    'icon': '/images/clock.png',
                    'after': $('.ltf-status')
                });
            }
            setTimeout(()=> {
                !lib['lootify'].timers ? lib['lootify'].timers = {} : 1;
                if(!lib['lootify'].timers[lib.user.getStatus()]) {
                    new lib.general.Timer(app.name, lib.user.getStatus());
                }
            }, 100);
        }
        function renderKPH() {
            if (!lib.user.isFighting()) {
                $('.kph-stats').remove();
                $('.kph-wrap').remove();
                return false;
            }
            if (!lib.game.getMenuItem('Kills:')) {
                let $kphStats = lib.game.setMenuItem({
                    'class': 'kph-stats',
                    'text': 'Kills: 0 p/h',
                    'clone': 'General Shop',
                    'icon': '/images/combat/combat_level.png',
                    'after': $('.time-stats'),
                    'click': function() {
                        $('.kph-wrap').toggle();
                    }
                });
                $kphStats.after($('<div/>', {
                    'class': 'kph-wrap ltf-submenu'
                }).hide());
            }
            let mobkills = {};
            $.each(total, function(mob, mobinfo) {
                if(!lib.game.isUniversalItem(mob)) {
                    mobkills[mob] = mobinfo.count;
                }
            });
            let totalkills = function() {
                let c = 0;
                $.each(mobkills, function(mob, kills) {
                    c += kills;
                });
                return c;
            };
            let kph = 0;
            let time = lib.general.getTimerTime('lootify', lib.user.getStatus());
            kph = lib.general.addCommas(Math.floor((totalkills()/time)*3600));
            $('.kph-stats').find('span').text('Kills: ' + kph + ' p/h');
            $.each(lib.general.sortObject(mobkills), function(mob, count) {
                let mobinfoclass = 'mob-info-'+sanitizeEntry(mob);
                kph = lib.general.addCommas(Math.floor((count/time)*3600));
                if(!$('.'+mobinfoclass).length) {
                    let $mobwrap = $('<div/>', {
                        'class': 'ltf-header mob-header '+mobinfoclass
                    });
                    $mobwrap.prepend($('<span>').css('display','block').text(mob + ': ' + kph + ' p/h'));
                    $mobwrap.prepend($('<img>').attr('src', lib.game.getMobIcon(mob)));
                    $('.kph-wrap').append($mobwrap);
                } else {
                    $('.'+mobinfoclass).find('span').text(mob + ': ' + kph + ' p/h');
                }
            });
        }
        function renderGPH() {
            if((!lib.user.isActiveSkill() && !lib.user.isFighting()) || lib.user.isIron() || lib.user.isStatus('cooking')) {
                $('.gph-stats').remove();
                $('.gph-wrap').remove();
                return false;
            }
            if (!lib.game.getMenuItem('Gold:')) {
                let $gphStats = lib.game.setMenuItem({
                    'class': 'gph-stats',
                    'text': 'Gold: 0 p/h',
                    'icon': '/images/ui/shop_icon.png',
                    'clone': 'General Shop',
                    'after': $('.time-stats'),
                    'click': function() {
                        $('.gph-wrap').toggle();
                    }
                });
                $gphStats.after($('<div/>', {
                    'class': 'gph-wrap ltf-submenu'
                }).hide());
            }

            let totalGold = 0;
            if (lib.game.marketPrices) {
                $.each(totalLoot, function(item, count) {
                    if (item === 'Gold') {
                        totalGold += count;
                    } else {
                        if (lib.user.isStatus('smithing')) {
                            let ore = item.split(' ')[0] + ' Ore';
                            totalGold += (lib.game.marketPrices[item] - lib.game.marketPrices[ore])* count;
                        } else {
                            totalGold += lib.game.marketPrices[item] * count;
                        }
                    }
                });
            } else {
                totalGold = 'n/a';
            }

            let time = lib.general.getTimerTime('lootify', lib.user.getStatus());
            if (time) {
                let gph = lib.general.addCommas(Math.floor((totalGold/time)*3600));
                $('.gph-stats').find('span').text('Gold: ' + gph + ' p/h');
            }
            $('.gph-wrap').empty();
            let $lootwrap = $('<div/>', {
                'class': 'ltf-header mob-header'
            }).appendTo($('.gph-wrap'));

            let lootval = lib.general.addCommas(Math.floor(totalGold));
            let $lootInfo = $('<span/>').css('display','block').text('Loot value: ' + lootval);
            $lootInfo.prepend($('<img>').attr('src', '/images/money_icon.png'));
            $lootwrap.append($lootInfo);
        }
        function renderXPH() {
            if(!lib.user.isActiveSkill() && !lib.user.isFighting()) {
                $('.mxph-stats').remove();
                $('.mxph-wrap').remove();
                $('.xph-stats').remove();
                $('.xph-wrap').remove();
                return false;
            }
            let currentLevel = {};
            let approxTime = {};
            let totalExp = {};
            let skillExp = {};
            let combatSkills = ['attack', 'defense', 'strength', 'constitution'];
            let expTypes = ['exp', 'mexp'];
            let time = lib.general.getTimerTime('lootify', lib.user.getStatus());
            !lib.user.levelGoal ? lib.user.levelGoal = {} : 1;
            $.each(expTypes, function(k, type) {
                if (lib.user[type]) {
                    !lib.user.levelGoal[type] ? lib.user.levelGoal[type] = {} : 1;
                    // CALCULATE EXP FOR COMBAT SKILLS
                    if (lib.user.isFighting()) {
                        $.each(combatSkills, function(k, skill) {
                            !skillExp[type] ? skillExp[type] = [] : 1;
                            !totalExp[type] ? totalExp[type] = 0 : 1;
                            !currentLevel[type] ? currentLevel[type] = [] : 1;
                            // GET THE CURRENT SKILL EXP GAINED
                            skillExp[type][skill] = lib.user[type][skill].current - lib.user[type][skill].init;
                            // GET TOTAL EXP GAINED OF ALL COMBAT SKILLS
                            totalExp[type] += (lib.user[type][skill].current - lib.user[type][skill].init);
                            currentLevel[type][skill] = lib.game.getLevel(lib.user[type][skill].current);
                            !lib.user.levelGoal[type][skill] ? lib.user.levelGoal[type][skill] = currentLevel[type][skill] + 1 : 1;
                            if(type === 'exp' && currentLevel[type] < 99) {
                                lib.user.levelGoal[type][skill] = (lib.user.levelGoal[type][skill] <= currentLevel[type]) ? lib.user.levelGoal[type][skill] = currentLevel[type] + 1 : lib.user.levelGoal[type][skill];
                            } else if (type ==='mexp' && currentLevel[type] >= 99) {
                                lib.user.levelGoal[type][skill] = (lib.user.levelGoal[type][skill] <= currentLevel[type]) ? lib.user.levelGoal[type][skill] = currentLevel[type] + 1 : lib.user.levelGoal[type][skill];
                            }
                        });
                    }
                    // CALCULATE EXP FOR GATHERING SKILLS
                    $.each(lib.app.data.active.skills, function(k, skill) {
                        if(lib.user.isStatus(skill)) {
                            totalExp[type] = lib.user[type][skill].current - lib.user[type][skill].init;
                            currentLevel[type] = lib.game.getLevel(lib.user[type][skill].current);
                            !lib.user.levelGoal[type][skill] ? lib.user.levelGoal[type][skill] = currentLevel[type] + 1 : 1;
                            if(type === 'exp' && currentLevel[type] < 99) {
                                lib.user.levelGoal[type][skill] = (lib.user.levelGoal[type][skill] <= currentLevel[type]) ? lib.user.levelGoal[type][skill] = currentLevel[type] + 1 : lib.user.levelGoal[type][skill];
                            } else if (type ==='mexp' && currentLevel[type] >= 99) {
                                lib.user.levelGoal[type][skill] = (lib.user.levelGoal[type][skill] <= currentLevel[type]) ? lib.user.levelGoal[type][skill] = currentLevel[type] + 1 : lib.user.levelGoal[type][skill];
                            }
                        }
                    });
                }
            });
            // EXP COUNTERS
            $.each(expTypes, function(k, type) {
                let menuItem = (type === 'exp') ? 'Experience:' : 'Mastery:';
                let menuClass = (type === 'exp') ? 'xph' : 'mxph';
                let menuIcon = (type === 'exp') ? '/images/total_level.png' : '/images/total_level_mastery_icon.png';

                if (!lib.game.getMenuItem(menuItem) && totalExp[type] > 1) {
                    let $xphStats = lib.game.setMenuItem({
                        'class': menuClass+'-stats',
                        'text': menuItem+' 0 p/h',
                        'icon': menuIcon,
                        'after': $('.time-stats'),
                        'clone': 'General Shop',
                        'click': function() {
                            $('.'+menuClass+'-wrap').toggle();
                        }
                    });
                    $xphStats.after($('<div/>', {
                        'class': menuClass+'-wrap ltf-submenu'
                    }).hide());
                }

                let xph = lib.general.addCommas(Math.floor((totalExp[type]/time)*3600));
                $('.'+menuClass+'-stats').find('span').text(menuItem + ' ' + xph + ' p/h');

                // XP Earned since activity start
                let xpearned = lib.general.addCommas(Math.floor(totalExp[type]));
                let $expwrap;
                if(!$('.'+menuClass+'-header').length) {
                    $expwrap = $('<div/>', {
                        'class': 'ltf-header mob-header ' + menuClass + '-header'
                    })
                    $expwrap.prepend($('<span>').css('display','block').text('Exp earned: ' + xpearned));
                    $expwrap.prepend($('<img>').attr('src', 'https://digimol.net/idlescape/assets/img/plus_sign.png'));
                    $expwrap.appendTo($('.'+menuClass+'-wrap'));
                } else {
                    $expwrap = $('.'+menuClass+'-wrap');
                    $('.'+menuClass+'-header > span').css('display','block').text('Exp earned: ' + xpearned);
                }

                // Time Left For Next Level
                let $expTimeWrap, $expTimeInfo;
                if (lib.user[type]) {
                    if(!lib.user.isFighting()) {
                        let skill = lib.user.getStatus();
                        let exptimeclass = 'exptime-'+type+'-'+skill;
                        approxTime = lib.user.getTimeToLevel(lib.user.levelGoal[type][skill], lib.user[type][skill].current, totalExp[type], time);
                        if(!$('.'+exptimeclass).length) {
                            $expTimeWrap = $('<div/>', {
                                'class': 'ltf-header mob-header'
                            })
                            $expTimeInfo = $('<div>', {
                                'class': exptimeclass
                            }).css('display','flex')
                            $expTimeInfo.append($('<img>').attr('src', lib.game.getSkillIcon(skill)));
                            $expTimeInfo.append($('<span>', {
                                'class': exptimeclass+'-level'
                            }).text('to '+lib.user.levelGoal[type][skill]));
                            let $arrows = $('<div>', {
                                'class': 'd4is-control-arrows'
                            }).appendTo($expTimeInfo);
                            $('<span>').text('▲').click(function() {
                                if(lib.user.levelGoal[type][skill] < 200) {
                                    lib.user.levelGoal[type][skill]++;
                                    $('.'+exptimeclass+'-level').text('to '+lib.user.levelGoal[type][skill]);
                                }
                            }).appendTo($arrows);
                            $('<span>').text('▼').click(function() {
                                if(lib.user.levelGoal[type][skill] > currentLevel[type]+1) {
                                    lib.user.levelGoal[type][skill]--;
                                    $('.'+exptimeclass+'-level').text('to '+lib.user.levelGoal[type][skill]);
                                }
                            }).appendTo($arrows);
                            $expTimeInfo.append($('<span>', {
                                'class': exptimeclass+'-text'
                            }).text(approxTime));
                            $expTimeWrap.append($expTimeInfo);
                            $expTimeWrap.appendTo($('.'+menuClass+'-wrap'));
                        } else {
                            $('.'+exptimeclass+'-text').text(approxTime);
                        }
                    } else {
                        $.each(combatSkills, function(k, skill) {
                            if(skillExp[type][skill] > 0) {
                                let exptimeclass = 'exptime-'+type+'-'+skill;
                                approxTime = lib.user.getTimeToLevel(lib.user.levelGoal[type][skill], lib.user[type][skill].current, skillExp[type][skill], time);
                                if(!$('.'+exptimeclass).length) {
                                    $expTimeWrap = $('<div/>', {
                                        'class': 'ltf-header mob-header'
                                    })
                                    $expTimeInfo = $('<div>', {
                                        'class': exptimeclass
                                    }).css('display','flex')
                                    $expTimeInfo.append($('<img>').attr('src', lib.game.getSkillIcon(skill)));
                                    $expTimeInfo.append($('<span>', {
                                        'class': exptimeclass+'-level'
                                    }).text('to '+lib.user.levelGoal[type][skill]));
                                    let $arrows = $('<div>', {
                                        'class': 'd4is-control-arrows'
                                    }).appendTo($expTimeInfo);
                                    $('<span>').text('▲').click(function() {
                                        if(lib.user.levelGoal[type][skill] < 200) {
                                            lib.user.levelGoal[type][skill]++;
                                            $('.'+exptimeclass+'-level').text('to '+lib.user.levelGoal[type][skill]);
                                        }
                                    }).appendTo($arrows);
                                    $('<span>').text('▼').click(function() {
                                        if(lib.user.levelGoal[type][skill] > currentLevel[type][skill]+1) {
                                            lib.user.levelGoal[type][skill]--;
                                            $('.'+exptimeclass+'-level').text('to '+lib.user.levelGoal[type][skill]);
                                        }
                                    }).appendTo($arrows);
                                    $expTimeInfo.append($('<span>', {
                                        'class': exptimeclass+'-text'
                                    }).text(approxTime));
                                    $expTimeWrap.append($expTimeInfo);
                                    $expTimeWrap.appendTo($('.'+menuClass+'-wrap'));
                                } else {
                                    $('.'+exptimeclass+'-text').text(approxTime);
                                }
                            }

                        });
                    }
                }
            });
        }
        function saveLogs() {
            if (!lib.user.isFighting()) { return false; }
            let $logcats = $('.item-log-window:not(.item-log-clone)').find('.item-log-cateogry');
            if ($logcats.length) {
                $logcats.each(function() {
                    if( $(this).find('.item-log-category-closed').length ) {
                        $(this).find('.item-log-category-closed').click();
                    }
                    let mobs = $(this).find('.item-log-category-open').text().split(" x ");
                    !runs[0][mobs[0]] ? runs[0][mobs[0]] = {} : 1;
                    runs[0][mobs[0]].count = parseInt(mobs[1]);
                    $(this).find('.item-log-item').each(function() {
                        if ($(this).text() !== "None") {
                            let loot = $(this).text().split(" x ");
                            !runs[0][mobs[0]].loot ? runs[0][mobs[0]].loot = {} : 1;
                            !runs[0][mobs[0]].loot[loot[0]] ? runs[0][mobs[0]].loot[loot[0]] = {} : 1;
                            runs[0][mobs[0]].loot[loot[0]].count = parseInt(loot[1]);
                        }
                    });
                });
            }
        }
        function mergeLogs() {
            if(runs) {
                total = {};
                totalLoot = {};
                $.each(runs, function(num, run) {
                    $.each(run, function(mobname, mobinfo) {
                        !total[mobname] ? total[mobname] = {} : 1;
                        !total[mobname].count ? total[mobname].count = 0 : 1;
                        total[mobname].count += mobinfo.count;
                        $.each(mobinfo.loot, function(lootname, lootinfo) {
                            /* SET TOTAL LOOT PER MOB */
                            !total[mobname].loot ? total[mobname].loot = {} : 1;
                            !total[mobname].loot[lootname] ? total[mobname].loot[lootname] = {} : 1;
                            !total[mobname].loot[lootname].count ? total[mobname].loot[lootname].count = 0 : 1;
                            !total[mobname].loot[lootname].procs ? total[mobname].loot[lootname].procs = 0 : 1;
                            total[mobname].loot[lootname].count += lootinfo.count;
                            total[mobname].loot[lootname].procs += lootinfo.procs;
                            /* SET TOTAL LOOT OVERALL */
                            if (!lib.game.isUniversalItem(mobname)) {
                                let procs = lootinfo.procs ? lootinfo.procs : 0;
                                !totalLoot[lootname] ? totalLoot[lootname] = 0 : 1;
                                totalLoot[lootname] += lootinfo.count + procs;
                            }
                        });
                    });
                });
                delete total[''];
            }
        }
        function renderLogs() {
            if(!runs) { return false; }
            let $logEntry, $logHeader, $lootWrap, $lootEntry;
            $('.item-log-clone').find('.item-log-cateogry').remove();
            $.each(lib.general.sortObject(total), function(mob, mobinfo) {
                let icon = !lib.user.isFighting() ? lib.game.getLocationIcon(lib.game.getLocationID(mob)) : lib.game.getMobIcon(mob);
                icon = lib.game.isUniversalItem(mob) ? getChestIcon(mob) : icon;
                if (lib.user.isStatus('smithing')) {
                    $.each(mobinfo.loot, function(loot, info) {
                        if(~loot.indexOf('Bar')) {
                            mob = loot;
                            icon = '/images/smithing/'+ sanitizeEntry(mob) +'.png';
                        }
                    });
                    if (lib.user.getEnchantment('7') > 0) {
                        mob = 'Wealthing';
                        icon = '/images/money_icon.png';
                    }
                }
                if (!$('.log-entry-' + sanitizeEntry(mob)).length) {
                    // Log Wrapper
                    $logEntry = $('<div/>', {
                        'class':'ltf-log-entry log-entry-' + sanitizeEntry(mob)
                    });
                    $logHeader = $('<div/>', {
                        'class':'ltf-log-header noselect'
                    }).appendTo($logEntry);

                    $lootWrap = $('<div/>', {
                        'class': 'ltf-loot-wrap'
                    }).appendTo($logEntry);

                    $logHeader.click(function() {
                        headers[mob] = headers[mob] == false ? true : false;
                        $lootWrap.toggle();
                    });
                    // HEADER
                    $logHeader.append($('<div/>').text(mob + ' x ' + mobinfo.count));
                    $logHeader.append($('<img/>').addClass('drawer-item-icon').attr('src', icon));
                    addLogEntry($logEntry, mob, mobinfo.loot);
                    $logEntry.sort(function (a, b) {
                        return $(a).find('.ltf-log-header').text() - $(b).find('.ltf-log-header').text();
                    }).each(function (_, container) {
                        $(container).parent().find('.drawer-setting-large.clone').before(container);
                    });
                    $('.drawer-setting-large.clone').before($logEntry);
                } else {
                    $logEntry = $('.log-entry-' + sanitizeEntry(mob));
                    $logHeader = $logEntry.find('.ltf-log-header');
                    $logHeader.find('div').text(mob + ' x ' + mobinfo.count);
                    addLogEntry($logEntry, mob, mobinfo.loot);
                }
            });
        }
        function sanitizeEntry(text) {
            text = text.toLowerCase();
            text = text.split("'").join("");
            text = text.split(" ").join("_");
            return text;
        }
        function getChestIcon(chest) {
            let icon = '';
            switch(chest) {
                case 'Geode':
                    icon = '/images/misc/geode.png';
                    break;
                case 'Sunken Treasure':
                    icon = '/images/misc/sunken_treasure.png';
                    break;
                case "Bird's Nest":
                    icon = '/images/misc/bird_nest.png';
                    break;
                case 'Satchel':
                    icon = '/images/misc/satchel.png';
                    break;
            }
            return icon;
        }
        function addLogEntry($log, entry, info) {
            if (!entry) { return false; }
            $.each(lib.general.sortObject(info), function(loot, lootinfo) {
                if (loot == '') { return false; }
                let lootEntryClass = 'loot-entry-'+sanitizeEntry(entry)+'-'+sanitizeEntry(loot);
                let $lootEntry = $('.'+lootEntryClass);
                let lootText = loot + ' x ' + lootinfo.count;
                lootText += (lootinfo.procs >= 1) ? ' (+'+lootinfo.procs+')' : '';
                if(!$lootEntry.length) {
                    $lootEntry = $('<div/>', {
                        'class': 'ltf-loot-entry '+lootEntryClass
                    }).text(lootText).appendTo($log.find('.ltf-loot-wrap'));
                    if(lib.game.isRareItem(loot)) {
                        $lootEntry.addClass('loot-rare');
                    } else if(lib.game.isEventItem(loot)) {
                        $lootEntry.addClass('loot-event');
                    } else if(lib.game.isUniversalItem(loot)) {
                        $lootEntry.addClass('loot-universal');
                    }
                } else {
                    $lootEntry.text(lootText);
                }
            });
        }

        /* ############## ACTIONS ############## */
        function getLogs() {
            let logs = [];
            let $logcats = $('.item-log-window:not(.item-log-clone)').find('.item-log-cateogry');
            if ($logcats.length) {
                $logcats.each(function(k,v) {
                    if( $(this).find('.item-log-category-closed').length ) {
                        $(this).find('.item-log-category-closed').click();
                    }
                    if( $(this).find('.item-log-category-open').length ) {
                        logs.push($(this).find('.item-log-category-open').text());
                        $(this).find('.item-log-item').each(function() {
                            if( $(this).text() !== "None" ) {
                                logs.push($(this).text());
                            }
                        });
                    }
                });
            }
            return logs;
        }
        function clearLogs(m = 'all') {
            if (m == 'single') {
                runs.unshift({});
            } else if (m == 'all') {
                if (lib.user.exp && lib.user.mexp) {
                    $.each(lib.app.data.active.skills, function(k, skill) {
                        lib.user.exp[skill].init = lib.user.exp[skill].current;
                        lib.user.mexp[skill].init = lib.user.mexp[skill].current;
                    });
                }
                if (Object.keys(lib['lootify'].timers).length !== 0) {
                    $.each(lib['lootify'].timers, function(k, t) {
                        t.reset();
                    });
                }
                runs = [{}];
                total = {};
                app.disabled = false;
                app.isNature = false;
                app.setup = false;
                $('.item-log-clone').remove();
            }
            $('.item-log-window').find('.drawer-setting-large.active:not(.clone)').click();
        }
        function reset(m = 'all') {
            submitStats(getLogs(), lib.user.getEnchantment('32'));
            clearLogs(m);
        }
        /* ############## GAME LIBRARY ############## */
        function is() {
            return lib.general.getStorage('Terms') === 'true';
        }
        function isLogged(type, txt) {
            let includes = false;
            if(getLogMobs()) {
                $.each(getLogMobs(), function(key, mob) {
                    if (type === 'combat') {
                        if (lib.game.getZoneMobs(txt).includes(mob)) {
                            includes = true;
                        }
                    } else if (type === 'skill') {
                        if (txt == mob) {
                            includes = true;
                        }
                    }
                });
            }
            return includes;
        }
        function isLogEmpty() {
            return Object.keys(runs[0]).length === 0;
        }
        function getLogMobs() {
            let mobs = [];
            $.each(total, function(mob, info) {
                mobs.push(mob);
            });
            return mobs;
        }
        function getPasteInterval() {
            let interval = parseInt($('.AutoPasterInterval').val());
            interval = interval ? interval : 30;
            interval = interval < 15 ? 15 : interval;
            interval = interval > 60 ? 60 : interval;
            return interval;
        }
        /* ############## API INTERACTION ############## */
        function setUserPublic(s) {
            lib.app.getRequest(app.name, 'https://digimol.net/idlescape/assets/api.php?a=userpublic&id='+lib.user.id+'&state='+s);
        }
        function canSubmit(logs) {
            let can = true;

            if (lib.user.getEnchantment('7') > 0) {
                can = false;
            }
            if (lib.user.getEnchantment('35') > 0 && lib.user.isStatus('foraging')) {
                can = false;
            }
            if ((lib.user.isFighting() && logs.length < 1) || Object.keys(runs[0]).length === 0 || app.disabled) {
                can =  false;
            }

            return can;
        }
        function submitStats(logs, th) {
            if (!canSubmit(logs)) {
                return false;
            }
            lib.user.updateStatus();
            let targetUrl = 'https://docs.google.com/forms/u/0/d/e/1FAIpQLSch3eG9Tqts0tIvnkk-C5JZeTwfbkWXhxkIpFnxyyaNO26h4Q/formResponse';
            let logEntryId = 'entry.558332813';
            let thEntryId = 'entry.22586929';
            let noteEntryId = 'entry.1726819066';
            let finalTH = (parseInt(th) > 0) ? 'TH '+th : 'None';
            let fullUrl = targetUrl + '?'+ noteEntryId + '=Lootify-' + app.ver + '&' + thEntryId + '=' + encodeURIComponent(finalTH) + '&' + logEntryId + '=' + encodeURIComponent(logs.join('\n'));
            if (!lib.user.isFighting()) {
                th = 0;
            } else {
                $.get(fullUrl);
            }
            lib.app.getRequest(app.name, 'https://digimol.net/idlescape/assets/api.php?a=paste&th='+th+'&user='+lib.user.id+'&log='+encodeURIComponent(JSON.stringify(runs[0])));
            lib.game.chat({
                'msg': 'Lootify - Loot log pasted!',
                'color': '#00a0fd',
            });
        }
        app.getRuns = function(n = 0) {
            return runs[n];
        }

        app.getKills = function() {
            if (!lib.user.id || lib.user.id == 0) { return false; }
            lib.app.getRequest(app.name, 'https://digimol.net/idlescape/assets/api.php?a=getkills&id='+lib.user.id, function(d) {
                lib.user.kills = d;
            });
        }

        /* ############## SOCKET RESPONSES ############## */
        app.initExp = function(d) {
            let e = setInterval(()=> {
                if (app.ready) {
                    clearInterval(e);
                    $.each(lib.app.data.active.skills, function(k, skill) {
                        !lib.user.exp ? lib.user.exp = {} : 1;
                        !lib.user.mexp ? lib.user.mexp = {} : 1;
                        !lib.user.exp[skill] ? lib.user.exp[skill] = {} : 1;
                        lib.user.exp[skill].init = parseInt(d.value.skills[skill].experience);
                        lib.user.exp[skill].current = parseInt(d.value.skills[skill].experience);
                        !lib.user.mexp[skill] ? lib.user.mexp[skill] = {} : 1;
                        lib.user.mexp[skill].init = parseInt(d.value.skills[skill].masteryExperience);
                        lib.user.mexp[skill].current = parseInt(d.value.skills[skill].masteryExperience);
                    });
                }
            }, 250);
        }

        app.updateExp = function(msg) {
            let d = JSON.parse(msg)[1];
            if (app.ready) {
                $.each(lib.app.data.active.skills, function(k, skill) {
                    !lib.user.exp ? lib.user.exp = {} : 1;
                    !lib.user.exp[skill] ? lib.user.exp[skill] = {} : 1;
                    !lib.user.mexp ? lib.user.mexp = {} : 1;
                    !lib.user.mexp[skill] ? lib.user.mexp[skill] = {} : 1;
                    if (~msg.indexOf('"'+skill+'"')) {
                        lib.user.exp[skill].current = parseInt(d.value.experience);
                        lib.user.mexp[skill].current = parseInt(d.value.masteryExperience);
                    }
                });
            }
        }

        /* USES
        * d.item.name
        * d.item.stackSize
        */
        app.addLogMob = function(d) {
            if (lib.user.lastAction === 'craft') {
                lib.user.lastAction = '';
                return false;
            }
            if (lib.game.isAllowedItem(lib.user.getStatus(), d.item.name)) {
                let loc = lib.game.getLocationName(lib.user.location);
                let item = lib.user.getStockpile(d.item.name);
                let diff = item ? d.item.stackSize - item.stackSize : d.item.stackSize;
                if (diff >= 3 && d.item.name !== 'Gold') { return false; }
                !runs[0] ? runs[0] = {} : 1;
                !runs[0][loc] ? runs[0][loc] = {} : 1;
                !runs[0][loc].count ? runs[0][loc].count = 0 : 1;
                runs[0][loc].count++;
                if(lib.user.isStatus('mining') && ~d.item.name.indexOf('Bar')) {
                    runs[0][loc].count--;
                }
                !runs[0][loc].loot ? runs[0][loc].loot = {} : 1;
                !runs[0][loc].loot[d.item.name] ? runs[0][loc].loot[d.item.name] = {} : 1;
                !runs[0][loc].loot[d.item.name].count ? runs[0][loc].loot[d.item.name].count = 0 : 1;
                !runs[0][loc].loot[d.item.name].procs ? runs[0][loc].loot[d.item.name].procs = 0 : 1;
                if(d.item.name == 'Gold' && lib.user.getEnchantment('7') > 0) {
                    runs[0][loc].loot[d.item.name].count += diff;
                } else {
                    runs[0][loc].loot[d.item.name].count++;
                    diff >= 2 ? runs[0][loc].loot[d.item.name].procs++ : 1;
                }
            }
        }

        app.addLogChest = function(d) {
            !runs[0] ? runs[0] = {} : 1;
            !runs[0][d.chest.name] ? runs[0][d.chest.name] = {} : 1;
            !runs[0][d.chest.name].count ? runs[0][d.chest.name].count = 0 : 1;
            runs[0][d.chest.name].count += d.chest.count;
            $.each(d.loot, function(loot, count) {
                !runs[0][d.chest.name].loot ? runs[0][d.chest.name].loot = {} : 1;
                !runs[0][d.chest.name].loot[loot] ? runs[0][d.chest.name].loot[loot] = {} : 1;
                !runs[0][d.chest.name].loot[loot].count ? runs[0][d.chest.name].loot[loot].count = 0 : 1;
                runs[0][d.chest.name].loot[loot].count += count;
            });
        }

        app.disablePaster = function() {
            if (!app.disabled) {
                app.disabled = true;
                $('.drawer-setting-large.clone').text('Reset Log');
                lib.game.chat({
                    'msg': "Lootify - Paster has been disabled to prevent skewed statistics. You can still use Lootify, but won't be able to paste your data to our server. Please reset your log to enable the paster again!",
                    'color': 'red',
                    'date': false
                });
            }
        }

        lib.app.setCommand('killcount', function() {
            let e = setInterval(()=> {
                if(lib.user.kills) {
                    clearInterval(e);
                    let msg = '';
                    let $html = $('<div>');
                    let $wrap = $('<div>',{
                        'class': 'ltf-killcount-wrap'
                    }).appendTo($html);
                    $.each(lib.user.kills, function(mob, count) {
                        let $killcount = $('<div>', {
                            'class': 'ltf-killcount'
                        }).appendTo($wrap);
                        let $icon = $('<img>', {
                            'class': 'dialog-icon ltf-killcount-icon'
                        }).attr({
                            'src': lib.game.getMobIcon(mob)
                        }).appendTo($killcount);
                        let $text = $('<span>', {
                            'class': 'dialog-text-medium lft-killcount-text'
                        }).html(mob+': '+count).appendTo($killcount);
                    });
                    $('<div>', {
                        'class': 'dialog-disclaimer'
                    }).text('These are statistics submitted to Lootify only (updates every 15 minutes)').appendTo($html);
                    msg += $html.html();

                    lib.game.dialog({
                        'title': lib.user.name+' Kill Count',
                        'text': msg,
                        'class': 'ltf-killcount',
                        'type': 'close',
                    });
                }
                setTimeout(()=> {
                    clearInterval(e);
                }, 3000);
            }, 250);
        });
    }
})();

function includeJS(file) {
    var script  = document.createElement('script');
    script.src  = file;
    script.type = 'text/javascript';
    script.defer = false;

    document.getElementsByTagName('head').item(0).appendChild(script);
}

function includeCSS(file) {
    var style  = document.createElement('link');
    style.rel  = 'stylesheet';
    style.href  = file;
    style.type = 'text/css';

    document.getElementsByTagName('head').item(0).appendChild(style);
}

if (typeof window.D4IS_JS == 'undefined') {
    window.D4IS_JS = true;
    includeJS('https://digimol.net/idlescape/assets/js/lib.js');
}

if (typeof window.D4IS_CSS == 'undefined') {
    window.D4IS_CSS = true;
    includeCSS('https://digimol.net/idlescape/assets/css/game.css');
}