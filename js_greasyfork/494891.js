// ==UserScript==
// @name         Torn Pray Time
// @namespace    torn.myth.tornpraytime
// @version      0.04
// @description  Adds a text that shows how much time has elapsed after pressing the pray button.
// @author       M02
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494891/Torn%20Pray%20Time.user.js
// @updateURL https://update.greasyfork.org/scripts/494891/Torn%20Pray%20Time.meta.js
// ==/UserScript==
// https://www.torn.com/forums.php#/p=threads&f=3&t=16396065&b=0&a=0&start=0&to=24691163
(function() {
    'use strict';
    const settings = {
        color: {
            first6hours: 'green',
            before18hours: 'yellow',
            after18hours: 'red'
        },
        language: {
            pray_time_label: 'PRAY',
            overtime: 'Thou Art Sinful Creatures...',
            remove_confirm: "Remove the timer?",
            timer_removed: 'Timer removed',
            remove_canceled: 'Remove canceled',
            timer_not_found: 'You haven\'t prayed yet!'
        },
        go_to_church: true
    };

    const CHURCH_PAGE = 'church.php';
    const PLAYER_STATUS_WRAPPER = '.points___UO9AU';
    const PRAY_BUTTON = 'span[action="pray"]';
    const STORAGE_NAME = 'startTime';

    let startButton;
    let timerDisplay;
    let lblPrayTime;
    let tornPrayTimeInterval;
    let time_removed = true;

    waitForElementToExist(PLAYER_STATUS_WRAPPER).then(() => {
        $(PLAYER_STATUS_WRAPPER).append(`
		<p class="point-block___rQyUK" tabindex="0">
		<span class="name___ChDL3" id="lblPrayTime">${settings.language.pray_time_label}:</span>
		<span id="torn-pray-time">-</span>
		</p>
	`);
        waitForElementToExist('#torn-pray-time').then(() => {
            timerDisplay = document.getElementById('torn-pray-time');
            const startTime = localStorage.getItem(STORAGE_NAME) || null;
            if (startTime !== null) updateTimerDisplay(startTime);
            if (getPageName() === CHURCH_PAGE) {
                waitForElementToExist(PRAY_BUTTON).then(() => {
                    startButton = document.querySelector(PRAY_BUTTON);
                    startButton.addEventListener('click', startTimer);
                });
            }
        });
        waitForElementToExist('#lblPrayTime').then(() => {
            lblPrayTime = document.querySelector('#lblPrayTime');
            lblPrayTime.style.cursor = 'pointer';
            lblPrayTime.addEventListener('click', removeTimerPrompt);
        });
    });

    function startTimer() {
        time_removed = false;
        const startTime = new Date().getTime();
        localStorage.setItem(STORAGE_NAME, startTime);
        updateTimerDisplay(startTime);
    }

    function updateTimerDisplay(startTime) {
        clearInterval(tornPrayTimeInterval);
        tornPrayTimeInterval = setInterval(() => {
            const currentTime = new Date().getTime();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000);
            const hours = Math.floor(elapsedTime / 3600);
            const minutes = Math.floor((elapsedTime % 3600) / 60);
            const seconds = elapsedTime % 60;

            if (hours < 6) {
                timerDisplay.style.color = settings.color.first6hours;
            } else if (hours < 18) {
                timerDisplay.style.color = settings.color.before18hours;
            } else if (hours < 24) {
                timerDisplay.style.color = settings.color.after18hours;
            } else {
                removeTimer();
                alert(settings.language.overtime);
            }
            timerDisplay.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        }, 1000);
    }

    function padZero(num) {
        return (num < 10 ? '0' : '') + num;
    }

    function removeTimerPrompt() {
        if (tornPrayTimeInterval || !time_removed) {
            const userResponse = window.confirm(settings.language.remove_confirm);
            if (userResponse) {
                removeTimer();
                alert(settings.language.timer_removed);
            } else {
                alert(settings.language.remove_canceled);
            }
        } else {
            alert(settings.language.timer_not_found);
            if (settings.go_to_church) {
                window.location.href = `https://www.torn.com/${CHURCH_PAGE}`;
            }
        }
    }

    function removeTimer() {
        time_removed = true;
        clearInterval(tornPrayTimeInterval);
        timerDisplay.textContent = '-';
        timerDisplay.style.color = '';
        localStorage.removeItem(STORAGE_NAME);
    }

    function waitForElementToExist(selector) {
        return new Promise(resolve => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector));
                    observer.disconnect();
                }
            });

            observer.observe(document.body, {
                subtree: true,
                childList: true,
            });
        });
    }

    function getPageName() {
        const path = window.location.pathname;
        return path.split('/').pop();
    }

})();
