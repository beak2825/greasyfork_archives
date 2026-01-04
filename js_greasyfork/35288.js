// ==UserScript==
// @name         Прогон лошадей (чистка + 3 случки от коней + корм)
// @description  Скрипт записывает коня в КСК, чистит, отправляет 3 общественные случки, кормит и укладывает спать
// @version      0.2
// @author       Cheshire Elk
// @match        *.lowadi.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/144808
// @downloadURL https://update.greasyfork.org/scripts/35288/%D0%9F%D1%80%D0%BE%D0%B3%D0%BE%D0%BD%20%D0%BB%D0%BE%D1%88%D0%B0%D0%B4%D0%B5%D0%B9%20%28%D1%87%D0%B8%D1%81%D1%82%D0%BA%D0%B0%20%2B%203%20%D1%81%D0%BB%D1%83%D1%87%D0%BA%D0%B8%20%D0%BE%D1%82%20%D0%BA%D0%BE%D0%BD%D0%B5%D0%B9%20%2B%20%D0%BA%D0%BE%D1%80%D0%BC%29.user.js
// @updateURL https://update.greasyfork.org/scripts/35288/%D0%9F%D1%80%D0%BE%D0%B3%D0%BE%D0%BD%20%D0%BB%D0%BE%D1%88%D0%B0%D0%B4%D0%B5%D0%B9%20%28%D1%87%D0%B8%D1%81%D1%82%D0%BA%D0%B0%20%2B%203%20%D1%81%D0%BB%D1%83%D1%87%D0%BA%D0%B8%20%D0%BE%D1%82%20%D0%BA%D0%BE%D0%BD%D0%B5%D0%B9%20%2B%20%D0%BA%D0%BE%D1%80%D0%BC%29.meta.js
// ==/UserScript==

/* НАСТРОЙКИ */
const CR_USER_SETTINGS = {
    TARGET_HAY: -1, // сколько нужно давать фуража (если поставить -1, будет выставлять сколько нужно автоматически)
    TARGET_OATS: -1 // сколько нужно давать овса (если поставить -1, будет выставлять сколько нужно автоматически)
};

/**
 * Последовательность действий при прогоне следующая:
 * 1. Записать в КСК
 * 2. Чистить
 * 3. Отправить 3 случки за 500
 * 4. Кормить
 * 5. Уложить спать
 * После этого, скрипт переходит к следующей лошади
 */

(function() {
    'use strict';

    const STATES_LIST = ['NONE', 'INSCRIPT_EC', 'CLEAN', 'OFFER_1', 'OFFER_2', 'OFFER_3', 'FEED', 'PUT_TO_SLEEP', 'NEXT_HORSE'];
    const LOCATIONS = {
        HORSE_PAGE: /chevaux\/cheval.*\?.*id=/.test(window.location.href),
        COMPETITION_PAGE: /competition\/inscription/.test(window.location.href),
        INSCRIPTION_PAGE: /chevaux\/centreInscription\?/.test(window.location.href)
    };
    const STATE_MACHINE = {
        'INSCRIPT_EC': inscriptEC,
        'CLEAN': clean,
        'OFFER_1': makeOffer,
        'OFFER_2': makeOffer,
        'OFFER_3': makeOffer,
        'FEED': feed,
        'PUT_TO_SLEEP': putToSleep,
        'NEXT_HORSE': nextHorse
    };

    if (Object.values(LOCATIONS).indexOf(true) === -1) {
        setState('NONE');
    } else {
        setTimeout(onPageLoad, getRandomInt(2000, 3000));
    }

    function onPageLoad() {
        const state = getCurrentState();
        if (state !== 'NONE') {
            STATE_MACHINE[state]();
        }
    }

    function getCurrentState() {
        const state = GM_getValue('cr_state', 'NONE');
        if (state === 'NONE' && LOCATIONS.HORSE_PAGE) {
            GM_registerMenuCommand('Начать прогон коней', startScript);
        }
        return state;
    }

    function setState(state) {
        GM_setValue('cr_state', state);
    }

    function advanceState() {
        const state = getCurrentState();
        const nextState = STATES_LIST[STATES_LIST.indexOf(state) + 1];
        setState(nextState);
        setTimeout(STATE_MACHINE[getCurrentState()], getRandomInt(2000, 3000));
    }

    function startScript() {
        advanceState();
    }

    function inscriptEC() {
        if (LOCATIONS.INSCRIPTION_PAGE) {
            setTimeout(sortEC, getRandomInt(1000, 2000));
        } else if (LOCATIONS.HORSE_PAGE) {
            // Проверка на 35 процентов. Если меньше, то мы уже наверняка обходили эту лошадь
            const energyValue = +document.querySelector('#energie').innerText;
            if (energyValue < 35) {
                nextHorse();
                return;
            }

            const inscriptButton = document.querySelector('#cheval-inscription a');
            if (inscriptButton) {
                simulateClick(inscriptButton);
            } else {
                advanceState();
            }
        }
    }

    function sortEC() {
        let sort60Button = document.querySelectorAll('#table-0 .caption-module[colspan="5"] .grid-cell.spacer-small-top.spacer-small-bottom')[4];
        if (sort60Button) {
            sort60Button = sort60Button.querySelector('a');
            simulateClick(sort60Button);
            setTimeout(inscriptInFirst, getRandomInt(1000, 2000));
        } else {
            reportErrorAndStop('Progon: не могу отсортировать по цене на 60 дней');
            return;
        }
    }

    function inscriptInFirst() {
        const inscriptButton = document.querySelectorAll('#table-0 tbody tr:first-child button')[4];
        if (inscriptButton) {
            simulateClick(inscriptButton);
        } else {
            reportErrorAndStop('Progon: не могу записать на 60 дней');
            return;
        }
    }

    function putToSleep() {
        const sleepButton = document.querySelector('#boutonCoucher');
        if (sleepButton) {
            simulateClick(sleepButton);
        } else {
            reportErrorAndStop('CompRunner: не могу найти кнопку укладывания спать');
            return;
        }

        advanceState();
    }

    function clean() {
        const cleanButton = document.querySelector('#boutonPanser');
        if (cleanButton) {
            simulateClick(cleanButton);
        } else {
            reportErrorAndStop('CompRunner: не могу найти кнопку чистки');
            return;
        }

        advanceState();
    }

    function makeOffer() {
        if (document.body.innerText.indexOf('Пол: конь') < 0) {
            advanceState();
        } else {
            const offerButton = document.querySelector('.action.saillir');
            if (offerButton) {
                simulateClick(offerButton);
                const publicButton = document.querySelector('#formMalePublicTypePublic');
                if (publicButton) {
                    simulateClick(publicButton);
                    const prizeSelect = document.querySelector('#formMalePublicPrice');
                    if (prizeSelect) {
                        prizeSelect.value = '500';
                        const makeOfferButton = document.querySelector('#boutonMaleReproduction');
                        if (makeOfferButton) {
                            simulateClick(makeOfferButton);
                            advanceState();
                        } else {
                            reportErrorAndStop('Progon: не могу найти кнопку "Подтвердить"');
                            return;
                        }
                    } else {
                        reportErrorAndStop('Progon: не могу найти список выбора цены');
                        return;
                    }
                } else {
                    reportErrorAndStop('Progon: не могу найти кнопку публичного предложения');
                    return;
                }
            } else {
                reportErrorAndStop('Progon: не могу найти кнопку покрытия');
                return;
            }
        }
    }

    function feed() {
        const feedButton = document.querySelector('#boutonNourrir');
        if (feedButton) {
            simulateClick(feedButton);
        } else {
            reportErrorAndStop('CompRunner: не могу найти кнопку кормежки');
            return;
        }
        setTimeout(feedProcess, getRandomInt(500, 1000));
    }

    function feedProcess() {
        setTimeout(function() {
            let hayTarget = parseInt(document.querySelector('.section-fourrage-target').textContent);

            if (CR_USER_SETTINGS.TARGET_HAY !== -1) {
                hayTarget = CR_USER_SETTINGS.TARGET_HAY;
            }
            if (hayTarget > 20) {
                hayTarget = 20;
            }

            const hayButton = document.querySelector('#haySlider li:nth-child(' + (hayTarget + 1) + ')');
            simulateClick(hayButton);
        }, 500);

        setTimeout(function() {
            let oatsTarget = parseInt(document.querySelector('.section-avoine-target').textContent);

            if (CR_USER_SETTINGS.TARGET_OATS !== -1) {
                oatsTarget = CR_USER_SETTINGS.TARGET_OATS;
            }
            if (oatsTarget > 15) {
                oatsTarget = 15;
            }

            const oatsButton = document.querySelector('#oatsSlider li:nth-child(' + (oatsTarget + 1) + ')');
            simulateClick(oatsButton);
        }, 1000);

        setTimeout(confirmFeed, 2000);
    }

    function confirmFeed() {
        const confirmFeedButton = document.querySelector('#feed-button');
        if (confirmFeedButton) {
            simulateClick(confirmFeedButton);
        }

        advanceState();
    }

    function nextHorse() {
        const nextHorseButton = document.querySelector('#nav-next');
        if (nextHorseButton) {
            setState('INSCRIPT_EC');
            simulateClick(nextHorseButton);
        } else {
            reportErrorAndStop('Progon: не могу найти кнопку следующей лошади');
            return;
        }
    }

    function simulateClick(element) {
        let evt = document.createEvent('MouseEvents');
        evt.initEvent('click', true, true);
        element.dispatchEvent(evt);
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function reportErrorAndStop(message) {
        alert(message);
        setState('NONE');
    }
})();