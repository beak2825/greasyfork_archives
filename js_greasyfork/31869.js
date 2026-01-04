// ==UserScript==
// @name         Прогон соревнований (Dance Macabre)
// @description  Скрипт прогоняет лошадь по соревнованиям, включая уход за лошадью.
// @version      0.3
// @author       Cheshire Elk
// @match        *.lowadi.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://greasyfork.org/users/144808
// @downloadURL https://update.greasyfork.org/scripts/31869/%D0%9F%D1%80%D0%BE%D0%B3%D0%BE%D0%BD%20%D1%81%D0%BE%D1%80%D0%B5%D0%B2%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B9%20%28Dance%20Macabre%29.user.js
// @updateURL https://update.greasyfork.org/scripts/31869/%D0%9F%D1%80%D0%BE%D0%B3%D0%BE%D0%BD%20%D1%81%D0%BE%D1%80%D0%B5%D0%B2%D0%BD%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D0%B9%20%28Dance%20Macabre%29.meta.js
// ==/UserScript==

/* НАСТРОЙКИ */
const CR_USER_SETTINGS = {
    MIN_COMP_COMPLEXITY: 1600, // Минимальная сложность соревнования (по умолчанию 1600)
    TARGET_HAY: 14, // сколько нужно давать фуража (если поставить -1, будет выставлять сколько нужно автоматически)
    TARGET_OATS: 9 // сколько нужно давать овса (если поставить -1, будет выставлять сколько нужно автоматически)
};

/**
 * Последовательность действий при прогоне следующая:
 * 1. Отправить спать
 * 2. Чистить
 * 3. Прогон соревнований (породный галоп) пока хватает энергии
 * 4. Ласкать
 * 5. Если есть Ласка Филотес, ласкать еще раз. Если нет, комбикорм
 * 7. Кормить
 * 7. Соревнование (породный галоп)
 * 8. Вырастить
 * После этого, все начинается заново
 */

(function() {
    'use strict';

    const STATES_LIST = ['NONE', 'PUT_TO_SLEEP', 'CLEAN', 'COMP_1', 'PET', 'PET_COMBI', 'FEED', 'COMP_2', 'GROW', 'PUT_TO_SLEEP'];
    const LOCATIONS = {
        HORSE_PAGE: /chevaux\/cheval.*\?.*id=/.test(window.location.href),
        COMPETITION_PAGE: /competition\/inscription/.test(window.location.href)
    };
    const STATE_MACHINE = {
        'PUT_TO_SLEEP': putToSleep,
        'CLEAN': clean,
        'COMP_1': runCompetitions,
        'PET': pet,
        'PET_COMBI': petCombi,
        'FEED': feed,
        'COMP_2': runCompetitions,
        'GROW': grow
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
            GM_registerMenuCommand('Начать прогон соревнований', startScript);
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

    function runCompetitions() {
        if (LOCATIONS.HORSE_PAGE) {
            let galopButton = document.querySelector('.competition-galop');
            if (galopButton) {
                simulateClick(galopButton);
            } else {
                reportErrorAndStop('CompRunner: не могу найти кнопку галопа');
                return;
            }
        } else if (LOCATIONS.COMPETITION_PAGE) {
            loadRaces();
            setTimeout(considerCompetitions, getRandomInt(1000, 2000));
        }
    }

    function loadRaces() {
        const loadRacesButton = document.querySelector('#lien-race');
        if (loadRacesButton) {
            simulateClick(loadRacesButton);
        }
    }

    function considerCompetitions() {
        const raceRows = Array.prototype.slice.call(document.querySelectorAll('#race .inner-table tr'));
        if (raceRows.length === 0) {
            advanceState();
            return;
        }

        const acceptableRace = raceRows.find(function(row) {
            let complexity = parseInt(row.querySelector('td.width-10 > strong').textContent);
            return complexity >= CR_USER_SETTINGS.MIN_COMP_COMPLEXITY;
        });

        if (!acceptableRace) {
            reportErrorAndStop('CompRunner: больше подходящих соревнований нет');
            return;
        } else {
            const raceButton = acceptableRace.querySelector('button');
            if (raceButton) {
                simulateClick(raceButton);
                setTimeout(checkRaceErrors, getRandomInt(2000, 3000));
            }
        }
    }

    function checkRaceErrors() {
        if (document.querySelectorAll('.fieldErrorText').length > 0) {
            advanceState();
        }
    }

    function pet() {
        if (LOCATIONS.COMPETITION_PAGE) {
            const returnToHorseButton = document.querySelector('#cols-middle-path a[href*="cheval?id"]');
            if (returnToHorseButton) {
                simulateClick(returnToHorseButton);
            } else {
                reportErrorAndStop('CompRunner: не могу найти ссылку, чтобы вернуться на страницу лошади');
                return;
            }
        } else if (LOCATIONS.HORSE_PAGE) {
            const petButton = document.querySelector('#boutonCaresser');
            if (petButton) {
                simulateClick(petButton);
            } else {
                reportErrorAndStop('CompRunner: не могу найти кнопку погладить');
                return;
            }

            advanceState();
        }
    }

    function petCombi() {
        const petButton = document.querySelector('#boutonCaresser');
        if (petButton && !petButton.classList.contains('action-disabled')) {
            simulateClick(petButton);
        } else {
            const combiButton = document.querySelector('#boutonMash');
            if (combiButton) {
                simulateClick(combiButton);
            }
        }
        advanceState();
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

    function grow() {
        if (LOCATIONS.COMPETITION_PAGE) {
            const returnToHorseButton = document.querySelector('#cols-middle-path a[href*="cheval?id"]');
            if (returnToHorseButton) {
                simulateClick(returnToHorseButton);
            } else {
                reportErrorAndStop('CompRunner: не могу найти ссылку, чтобы вернуться на страницу лошади');
                return;
            }
        } else if (LOCATIONS.HORSE_PAGE) {
            setTimeout(function() {
                const growButton = document.querySelector('#boutonVieillir');
                if (growButton) {
                    simulateClick(growButton);
                } else {
                    reportErrorAndStop('CompRunner: не могу найти кнопку роста');
                    return;
                }

                setTimeout(function() {
                    const confirmGrowButton = document.querySelector('#age button[type=submit]');
                    if (confirmGrowButton) {
                        simulateClick(confirmGrowButton);
                    } else {
                        reportErrorAndStop('CompRunner: не могу найти кнопку роста');
                        return;
                    }
                    advanceState();
                }, 500);
            }, 3000);
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