// ==UserScript==
// @name         SimpleMMO Travel
// @namespace    simple-mmo.com
// @version      1.005
// @description  SimpleMMO Clicker
// @author       Anton
// @match        https://web.simple-mmo.com/travel
// @match        https://web.simple-mmo.com/npcs/attack/*
// @match        https://web.simple-mmo.com/crafting/material/gather/*
// @match        https://web.simple-mmo.com/battlearena
// @match        https://web.simple-mmo.com/jobs/view/*
// @match        https://web.simple-mmo.com/jobs/viewall
// @match        https://web.simple-mmo.com/quests/viewall
// @match        https://web.simple-mmo.com/bank/withdraw
// @match        https://web.simple-mmo.com/inventory*
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/412523/SimpleMMO%20Travel.user.js
// @updateURL https://update.greasyfork.org/scripts/412523/SimpleMMO%20Travel.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements, SimpleMmoHelper, perform_action */

(function() {
    'use strict';

    const buttonId = 'remote-control-42', gatherId = 'gather-button-42';
    const startMessage = 'Press to run', stopMessage = 'Click to stop';
    let isWorking = undefined;

    const isAttack = window.location.pathname.indexOf('/attack/') > -1;
    const isTravel = window.location.pathname.indexOf('/travel') > -1;
    const isGather = window.location.pathname.indexOf('/gather/') > -1;
    const isArena = window.location.pathname.indexOf('/battlearena') > -1;
    const isJobOverview = window.location.pathname.indexOf('/jobs/viewall') > -1;
    const isJob = window.location.pathname.indexOf('/jobs/view') > -1;
    const isQuests = window.location.pathname.indexOf('/quests/') > -1;
    const isWithdraw = window.location.pathname.indexOf('/withdraw') > -1;

    function num(n) { return parseInt(n.replaceAll(',', '')); }

    const helper = {
        isRedirecting: false,
        set(name, value) {
            localStorage.setItem(name, value);
        },
        get(name, defaultValue) {
            const val = localStorage.getItem(name);
            if (val === null) return defaultValue;
            if (typeof defaultValue === 'boolean') {
                if (typeof val === 'string') {
                    return val == 'true';
                }
            }
            return val;
        },
        hasMaterials() {
            const imageSrc = $('.div-travel-text img').attr('src');
            const linkHref = $('.div-travel-text a').attr('href');
            return (imageSrc && imageSrc.indexOf('materials/') > -1) || (linkHref && linkHref.indexOf('material/') > -1);
        },
        hasEnemy() {
            const imageSrc = $('.div-travel-text img').attr('src');
            const attackButtonText = $('.div-travel-text a.btn-primary:eq(0)').text().toLowerCase().trim();
            return (imageSrc && imageSrc.indexOf('enemies/') > -1) || (attackButtonText === 'attack');
        },
        goto(location) {
            if (helper.isRedirecting) return;
            helper.isRedirecting = true;
            window.location.href = window.location.origin + location;
        },
        hasSkillToGather() {
            const travelButtons = $('.div-travel-text small');
            for (let i = 0; i < travelButtons.length; i++) {
                const btn = $(travelButtons[i]);
                const txt = btn.text();
                if (txt && txt.trim().toLowerCase().indexOf("skill level isn't") > -1) {
                    return false;
                }
            }
            return true;
        },
        getCurrentEnergy() {
            return parseInt($('#current_energy').text());
        },
        getCurrentQuests() {
            return parseInt($('#current_quest_points').text());
        },
        getCurrentSteps() {
            return parseInt($('#current_steps').text());
        },
        getCurrentGold() {
            return num($('#current_gold').text().trim());
        },
        getMaxEnergy() {
            return 5;
        },
        getMaxQuests() {
            return 6;
        },
        getMessagesCount() {
            const messagesBadge = $('a.nav-link[href="/messages/inbox"] .badge');
            return parseInt(messagesBadge.text());
        },
        getEventsCount() {
            const messagesBadge = $('a.nav-link[href="/events"] .badge');
            return parseInt(messagesBadge.text());
        },
        hasTravelEvent() {
            const travelNote = $('.notice.notice-success.reward-notice').text().toLowerCase().trim();
            return travelNote != '' && travelNote != 'reward' && travelNote.indexOf('you gained') == -1;
        },
        iAmDead() {
            return $('.notice.notice-success.div-travel-text strong').text().toLowerCase().indexOf(' dead') > -1;
        },
        isWorkingNow() {
            if (isWorking !== undefined) return isWorking;
            if (SimpleMmoHelper.isWorking) {
                isWorking = true;
                return true;
            }
            const txt = $('.kt-portlet__body strong').text().toLowerCase();
            const result = txt.indexOf('you are currently working') > -1;
            isWorking = result;
            return result;
        }
    };

    const init = {
        fixTravelHeight() {
            const travelDiv = $('.stepbuttonnew').parent();
            if (travelDiv && travelDiv.css('height') != 'auto') {
                travelDiv.css('height', 'auto');
            }
        },
        addStyles() {
            if (isTravel) {
                const travel = $('#travel');
                const travelBackground = travel.css('background-image');
                const body = $('body');
                body.css('background-image', travelBackground);
                body.css('background-size', 'cover');
                travel.css('background', 'transparent');
                $('.kt-portlet.kt-portlet--height-fluid').css('background', 'transparent');
                const guildBlock = $('#guildBlock');
                guildBlock.css('display', 'block');
                guildBlock.parent().css('background', 'rgba(255,255,255,0.3)');
                console.log('[STYLES] travel');
            }

            if (isQuests) {
                $('.kt-widget5 .kt-widget5__desc').hide();
                const completed = $('.kt-widget5__item .label-success');
                for (let i = 0; i < completed.length; i++) {
                    const line = $(completed[i]).closest('.kt-widget5__item');
                    line.css('background-color', 'palegreen');
                }
                console.log('[STYLES] quests');
            }
        },
        addButton() {
            const message = isAuto ? stopMessage : startMessage;
            SimpleMmoHelper.addToolButton(0, "SimpleMmoTools.startStop();", message, buttonId);

            if (isGather) {
                const container = $('#action_button').parent();
                const gatherCode = `<button style="position:relative;" class="btn btn-xl btn-success" id="${gatherId}" onclick="SimpleMmoTools.gather()" disabled="disabled"><img src="/img/icons/one/icon941.png" style="height:20px"> Press me <div class="loading-bar"></div></button>`;
                container.append($(gatherCode));
                setTimeout(() => {
                    $('#' + gatherId).removeAttr('disabled');
                }, 2000);
            }
        },
        updateTravelTitle() {
            const addNum = (name, num) => !isNaN(num) ? name + num : '';
            if (isTravel) {
                const messagesCount = helper.getMessagesCount();
                const energy = helper.getCurrentEnergy();
                const quests = helper.getCurrentQuests();
                const steps = helper.getCurrentSteps();
                const events = helper.getEventsCount();
                if (steps > 0) {
                    SimpleMmoHelper.setTitle(addNum('T ', steps) + addNum(' Q ', quests) + addNum(' M ', messagesCount) + addNum(' N ', events));
                } else {
                    SimpleMmoHelper.setTitle('[WAITING]');
                }
            }
        },
        setJobTitle() {
            let reloadTimer = undefined;
            const prepareForReload = () => {
                if (!isAuto) {
                    localStorage.setItem('smmoAuto', 'stopped');
                    return;
                }
                localStorage.setItem('smmoAuto', 'started');
                const canReload = $('.kt-portlet__body a.btn-elevate').text().trim().toLowerCase() == 'you are currently working';
                if (!reloadTimer && canReload) {
                    const timeToReload = SimpleMmoHelper.randomTimeout(30000);
                    console.log('Preparing for reload in', timeToReload, 'seconds');
                    reloadTimer = setTimeout(() => {
                        location.reload();
                    }, timeToReload);
                } else {
                    if (helper.getCurrentSteps() > 0) {
                        const timeToReload = 10000;
                        console.log('Leaving page in', timeToReload, 'seconds');
                        setTimeout(() => {
                            helper.goto('/travel');
                        }, timeToReload);
                    }
                }
            };
            const minutes = parseInt($('.kt-portlet__foot strong').text());
            if (!isNaN(minutes)) {
                SimpleMmoHelper.setTitle('JOB ' + minutes + ' min');
                localStorage.setItem('smmoAuto', 'working');
                let minutesLeft = minutes;
                const jobTimer = setInterval(() => {
                    minutesLeft--;
                    if (minutesLeft > 0) {
                        SimpleMmoHelper.setTitle('JOB ' + minutesLeft + ' min');
                    } else {
                        clearInterval(jobTimer);
                        SimpleMmoHelper.setTitle('[FINISH JOB]');
                        prepareForReload();
                    }
                }, 60000);
            } else {
                SimpleMmoHelper.setTitle('[FINISH JOB]');
                prepareForReload();
            }
        },
        setTitles() {
            if (isTravel) this.updateTravelTitle();
            else if (isAttack) SimpleMmoHelper.setTitle('ATTACK');
            else if (isGather) SimpleMmoHelper.setTitle('GATHER');
            else if (isJob) this.setJobTitle();
        },
        run() {
            if (!$) {console.log('jQuery not found');return;}
            this.addStyles();
            this.fixTravelHeight();
            this.addButton();
            this.setTitles();
        }
    };

    const stepbuttonnew = $('.stepbuttonnew');

    const timer = {
        isTimeToGather: () => SimpleMmoHelper.timer.time('gather'),
        updateGather: () => SimpleMmoHelper.timer.update('gather', 2000),
        isTimeToAttack: () => SimpleMmoHelper.timer.time('attack'),
        updateAttack: () => SimpleMmoHelper.timer.update('attack', 1900),
        isTimeToTravel: () => SimpleMmoHelper.timer.time('travel'),
        updateTravel: () => SimpleMmoHelper.timer.update('travel', 1000),
        isTimeToArena: () => SimpleMmoHelper.timer.time('arena'),
        updateArena: () => SimpleMmoHelper.timer.update('arena', 1900),
        isTimeToQuest: () => SimpleMmoHelper.timer.time('quest'),
        updateQuest: () => SimpleMmoHelper.timer.update('quest', 1000),
        isTimeToJob: () => SimpleMmoHelper.timer.time('job'),
        updateJob: () => SimpleMmoHelper.timer.update('job', 1000),
        init() {
            this.updateGather();
            this.updateAttack();
            this.updateTravel();
            this.updateArena();
            this.updateQuest();
            this.updateJob();
        }
    }

    let isAuto = helper.get('isAuto', false);
    const auto = {
        tAuto: undefined,
        gather() {
            const materialName = $('.kt-portlet__body.text-center strong').text().trim();
            SimpleMmoHelper.setTitle('GATHER ' + materialName);
            if (timer.isTimeToGather()) {
                const locationIsEmpty = $('.result .row').text().indexOf('+0 EXP') > -1;
                if (!locationIsEmpty) {
                    if (typeof perform_action === 'function') {
                        perform_action();
                        timer.updateGather();
                        const btn = $('#' + gatherId);
                        btn.attr('disabled', 'disabled');
                        setTimeout(() => {
                            btn.removeAttr('disabled');
                        }, 1900);
                    } else {
                        console.log('[perform_action] function not found');
                        SimpleMmoTools.stop();
                    }
                } else {
                    SimpleMmoHelper.setTitle('GOTO TRAVEL');
                    helper.goto('/travel');
                }
            }
        },
        clickAttack() {
            const attackButton = $('#attackButton');
            if (attackButton && !attackButton.attr('disabled')) {
                const npcHp = $('#npc-hp-percent').text().replace('%', '');
                const hp = parseInt(npcHp);
                const opacity = $('#enemyBox').css('opacity');
                const isAlive = hp > 0 && (opacity === undefined || opacity > 0.5);
                if (isAlive) SimpleMmoHelper.setTitle('ATT ' + hp);
                if (isAlive && timer.isTimeToAttack()) {
                    timer.updateAttack();
                    attackButton.trigger('click');
                } else if(!isAlive) {
                    SimpleMmoHelper.setTitle('ATT OK');
                    if (timer.isTimeToAttack()) {
                        SimpleMmoHelper.setTitle('ATT REDIR OUT');
                        const exitButton = $('.btn.btn-danger');
                        if (exitButton.text().toLowerCase().indexOf('exit') > -1) {
                            helper.goto(exitButton.attr('href'));
                        } else {
                            helper.goto('/travel');
                        }
                    }
                }
            }
        },
        clickTravel() {
            if (helper.getCurrentEnergy() == helper.getMaxEnergy()) {
                helper.goto('/battlearena');
                return;
            }

            if (helper.getCurrentQuests() == helper.getMaxQuests()) {
                helper.goto('/quests/viewall');
                return;
            }

            if (helper.isWorkingNow()) {
                console.log('[Working]');
                return;
            }

            let actionTaken = false;
            const hasTravelEvent = helper.hasTravelEvent();
            const hasEnemy = helper.hasEnemy();
            const hasMaterials = helper.hasMaterials();
            const buttonEnabled = !stepbuttonnew.attr('disabled');
            const canContinue = !hasMaterials && !hasEnemy;

            const makeAStep = () => {
                if (helper.getCurrentSteps() > 0) {
                    if (!buttonEnabled) timer.updateTravel();
                    if (timer.isTimeToTravel()) {
                        actionTaken = true;
                        stepbuttonnew.trigger('click');
                    }
                }
            }

            if (canContinue && helper.getCurrentSteps() > 0) {
                makeAStep();
            } else if (hasEnemy) {
                const travelButtons = $('.div-travel-text a');
                for (let i = 0; i < travelButtons.length; i++) {
                    const btn = $(travelButtons[i]);
                    const txt = btn.text();
                    if (txt && txt.trim().toLowerCase() == 'attack') {
                        actionTaken = true;
                        helper.goto(btn.attr('href'));
                        break; return;
                    }
                }
            } else if (hasMaterials) {
                if (!buttonEnabled) timer.updateTravel();
                if (helper.hasSkillToGather()) {
                    const travelButtons = $('.div-travel-text a');
                    for (let i = 0; i < travelButtons.length; i++) {
                        const btn = $(travelButtons[i]);
                        const txt = btn.attr('href');
                        if (txt && txt.trim().indexOf('/material/gather/') > -1) {
                            actionTaken = true;
                            helper.goto(btn.attr('href'));
                            break; return;
                        }
                    }
                } else {
                    actionTaken = true;
                    console.log('No skill to gather');
                    if (timer.isTimeToTravel()) {
                        stepbuttonnew.trigger('click');
                    }
                }
            } else {
                console.log("Can't travel");
                const energy = helper.getCurrentEnergy();
                if (energy > 0) {
                    actionTaken = true;
                    helper.goto('/battlearena');
                    return;
                } else if (helper.getCurrentQuests() > 0) {
                    actionTaken = true;
                    helper.goto('/quests/viewall');
                    return;
                } else {
                    helper.goto('/jobs/viewall');
                }
            }

            if (!actionTaken && hasTravelEvent) {
                const eventText = $('.notice.notice-success').text().toLowerCase().trim();
                const isFoundItem = eventText.indexOf('you have found the item') > -1;
                const isTooFast = eventText.indexOf('trying it too fast') > -1;
                if (isFoundItem || isTooFast) {
                    makeAStep();
                } else {
                    if (helper.iAmDead()) {
                        console.log('[EVENT] You were killed');
                        SimpleMmoHelper.setTitle('-DEAD-');
                    } else {
                        console.log('[Has event]', eventText);
                    }
                    SimpleMmoTools.stop();
                }
            }

            init.updateTravelTitle();
        },
        clickArena() {
            const energy = helper.getCurrentEnergy();
            if (energy > 0) {
                const generateEnemyButton = $('.kt-callout__action').text().trim().toLowerCase();
                if (generateEnemyButton == 'generate enemy') {
                    if (timer.isTimeToArena()) {
                        SimpleMmoHelper.setTitle('ARENA GENERATE');
                        const isPopupOn = $('.swal2-container.swal2-center.swal2-shown').length > 0;
                        if (!isPopupOn) {
                            timer.updateArena();
                            // click on "Generate enemy"
                            $('.kt-callout__action button:eq(0)').trigger('click');
                        } else {
                            // inside dialog
                            const goldForArena = num($('#ba_gold_amount').text().trim());
                            const currentGold = helper.getCurrentGold();
                            if (goldForArena > currentGold) {
                                console.log('[WARN] No gold for arena');
                                SimpleMmoHelper.setTitle('GOTO BANK');
                                helper.goto('/bank/withdraw');
                            } else {
                                SimpleMmoHelper.setTitle('ARENA GO INTO');
                                const okButton = $('.swal2-confirm');
                                if (timer.isTimeToArena()) {
                                    timer.updateArena();
                                    okButton.trigger('click');
                                }
                            }
                        }
                    }
                }
            } else {
                helper.goto('/travel');
            }
        },
        withdrawMoneyForArena() {
            if (!helper.isWorkingNow()) {
                const smallMoney = helper.getCurrentGold() < 50000;
                if (smallMoney && helper.getCurrentEnergy() > 0) {
                    const goldInput = $('input[name=GoldAmount]');
                    if (goldInput.val() == '') {
                        goldInput.val(50000);
                        setTimeout(() => {
                            goldInput.closest('form').find('button[type=submit]').trigger('click');
                        }, 800);
                    }
                } else {
                    /*if (!smallMoney && helper.getCurrentEnergy() > 0) {
                        helper.goto('/battlearena');
                    } else if (helper.getCurrentSteps() > 0) {
                        helper.goto('/travel');
                    }*/
                }
            }
        },
        clickQuests() {
            if (helper.isWorkingNow()) return;

            if (timer.isTimeToQuest()) {
                if (helper.getCurrentQuests() <= 0) {
                    helper.goto('/travel');
                    return;
                }

                let lastUncompleteQuest = undefined;
                const questItems = $('.kt-widget5__item');

                // search for a task quest
                const tasks = SimpleMmoHelper.storage.getTasks();
                const currentTaskIndex = tasks.findIndex(t => t.finished == false && t.type == 'quest');
                const currentTask = currentTaskIndex != -1 ? tasks[currentTaskIndex] : undefined;
                if (currentTask) {
                    for (let i = 0; i < questItems.length; i++) {
                        const line = $(questItems[i]);
                        const title = line.find('.kt-widget5__title');
                        const titleText = title.text().trim().toLowerCase().replace('completed', '').trim();
                        const button = line.find('button.btn-info');
                        if (titleText == currentTask.name) {
                            lastUncompleteQuest = {
                                i,
                                title: titleText,
                                line,
                                button
                            };
                        }
                    }
                }

                if (lastUncompleteQuest === undefined) {
                    for (let i = 0; i < questItems.length; i++) {
                        const line = $(questItems[i]);
                        const title = line.find('.kt-widget5__title');
                        const titleText = title.text().trim();
                        console.log(titleText.toLowerCase());
                        const completedCaption = title.find('span').text().trim().toLowerCase();
                        const button = line.find('button.btn-info');
                        if (completedCaption != 'completed' || i == 0) {
                            lastUncompleteQuest = {
                                i,
                                title: titleText,
                                line,
                                button
                            };
                        }
                    }
                }

                const isPopupOn = $('.swal2-container.swal2-center.swal2-shown').length > 0;
                if (!isPopupOn) {
                    if (helper.getCurrentQuests() > 0) {
                        lastUncompleteQuest.button.trigger('click');
                        timer.updateQuest();
                    } else {
                        helper.goto('/travel');
                    }
                } else {
                    if (timer.isTimeToQuest()) {
                        const confirmButton = $('.swal2-confirm');
                        const txt = confirmButton.text().trim().toLowerCase();
                        if (helper.getCurrentQuests() > 0) {
                            if (txt == 'perform quest') {
                                confirmButton.trigger('click');
                                timer.updateQuest();
                                if (currentTask && currentTaskIndex) {
                                     SimpleMmoHelper.storage.incTask(currentTaskIndex);
                                }
                            } else {
                                if (txt == 'repeat quest') {
                                    confirmButton.trigger('click');
                                    timer.updateQuest();
                                } else {
                                    console.log('wrong button', txt);
                                }
                            }
                        } else {
                            $('.swal2-cancel').trigger('click');
                        }
                    }
                }
            }
        },
        do() {
            if (isTravel) {
                auto.clickTravel();
            } else if (isAttack) {
                auto.clickAttack();
            } else if (isArena) {
                auto.clickArena();
            } else if (isGather) {
                auto.gather();
            } else if (isWithdraw) {
                auto.withdrawMoneyForArena();
            } else if (isQuests) {
                auto.clickQuests();
            } else if (isJobOverview) {
                if (helper.getCurrentSteps() == 0 && helper.getCurrentQuests() == 0 && helper.getCurrentEnergy() == 0) {
                    helper.goto('/jobs/view/6');
                } else {
                    if (helper.getCurrentSteps() > 0) {
                        helper.goto('/travel');
                    } else if (helper.getCurrentQuests() > 0) {
                        helper.goto('/quests/viewall');
                    } else if (helper.getCurrentEnergy() > 0) {
                        helper.goto('/battlearena');
                    } else {
                        console.log('[Where am I?]');
                    }
                }
            } else if (isJob) {
                if (timer.isTimeToJob()) {
                    if (helper.getCurrentSteps() == 0 && helper.getCurrentQuests() == 0 && helper.getCurrentEnergy() == 0) {
                        // need to go to the job
                        const dialog = $('.swal2-container.swal2-shown');
                        if (dialog.length > 0) {
                            const slider = $('.swal2-container.swal2-shown input[type=range]');
                            if (slider.val() < 2) {
                                timer.updateJob();
                                slider.val((Math.random() * 3 + 2) | 0);
                            } else {
                                const confirmButton = $('.swal2-confirm');
                                if (confirmButton.text().toLowerCase().trim() == 'start the job') {
                                    timer.updateJob();
                                    confirmButton.trigger('click');
                                }
                            }
                        } else {
                            const buttons = $('.btn.btn-success');
                            for (let i = 0; i < buttons.length; i++) {
                                const button = $(buttons[i]);
                                if (button.text().toLowerCase().trim() == 'start working') {
                                    timer.updateJob();
                                    button.trigger('click')
                                }
                            }
                        }
                    }
                }
            }
        },
        stop() {
            if (this.tAuto) clearInterval(this.tAuto);
            isAuto = false;
            console.log('[Stopped]');
            localStorage.setItem('smmoAuto', 'stopped');
        },
        run() {
            if (isAuto) {
                this.tAuto = setInterval(auto.do, 400);
                console.log('[Started]');
                if (localStorage.getItem('smmoAuto') != 'working') {
                    localStorage.setItem('smmoAuto', 'started');
                }
            }
        }
    };

    const SimpleMmoTools = {
        gather() {
            auto.gather();
        },
        start() {
            isAuto = true;
            helper.set('isAuto', true);
            auto.run();
            const buttonSpan = $('#' + buttonId + ' span');
            buttonSpan.text(stopMessage);
            init.setTitles();
        },
        stop() {
            auto.stop();
            helper.set('isAuto', false);
            const buttonSpan = $('#' + buttonId + ' span');
            buttonSpan.text(startMessage);
            SimpleMmoHelper.setTitle('[STOPPED]');
        },
        startStop() {
            if (isAuto) this.stop(); else this.start();
        }
    };

    const localInit = () => {
        isAuto = helper.get('isAuto', false);
        timer.init();
        init.run();
        auto.run();
    };

    const starter = () => {
        if (typeof unsafeWindow !== 'undefined') {
            if (typeof unsafeWindow.SimpleMmoHelper === 'object') {
                localInit();

                if (unsafeWindow.SimpleMmoTools === undefined) {
                    unsafeWindow.SimpleMmoTools = SimpleMmoTools;
                } else {
                    unsafeWindow.SimpleMmoTools = { ...unsafeWindow.SimpleMmoTools, ...SimpleMmoTools };
                }
            } else {
                setTimeout(starter, 100);
            }
        } else {
            console.log('[ERROR] unsafewindow not found');
        }
    };
    starter();
})();;