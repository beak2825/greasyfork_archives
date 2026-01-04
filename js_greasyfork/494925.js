// ==UserScript==
// @name         Torn Pray Time with Torn API
// @namespace    torn.myth.tornpraytimeAPI
// @version      0.01
// @description  Adds a text that shows how much time has elapsed after pressing the pray button with API.
// @author       M02
// @match        https://www.torn.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494925/Torn%20Pray%20Time%20with%20Torn%20API.user.js
// @updateURL https://update.greasyfork.org/scripts/494925/Torn%20Pray%20Time%20with%20Torn%20API.meta.js
// ==/UserScript==
// https://www.torn.com/forums.php#/p=threads&f=3&t=16396065&b=0&a=0&start=0&to=24691163
(function() {
    'use strict';
    const settings = {
        api_key: 'ENTER_YOUR_FULL_API_KEY_HERE',
        color: {
            first6hours: 'green',
            before18hours: 'yellow',
            after18hours: 'red',
            error_color: 'red'
        },
        language: {
            pray_time_label: 'PRAY',
            overtime: 'Thou Art Sinful Creatures...',
            start_fetching: 'Fetching data...'
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
    let timestamp;
    let fetchingFailed = false;

    function fetchDataUserLog() {
        return new Promise((resolve, reject) => {
            let apiUrl = `https://api.torn.com/user/?selections=log&key=${settings.api_key}&comment=TryItPage`;
            fetch(apiUrl)
                .then(response => response.json())
                .then(data => {
                resolve(data);
            })
                .catch(error => {
                console.error('Failed to call Torn API:', error);
                reject(error);
            });
        });
    }

    async function filterChurchLogs() {
        try {
            const userDataLog = await fetchDataUserLog();
            const logs = userDataLog.log;
            const churchLogs = Object.entries(logs)
            .filter(([key, log]) => log.category === "Church")
            .map(([key, log]) => log);
            return churchLogs;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async function startFetching() {
        try {
            timerDisplay.textContent = settings.language.start_fetching;
            const churchLogs = await filterChurchLogs();
            if (churchLogs.length > 0) {
                const firstTimestamp = churchLogs[0].timestamp;
                timestamp = firstTimestamp;
                console.log(`First timestamp set to: ${timestamp}`);
            } else {
                console.log('No church logs found.');
            }
        } catch (error) {
            console.error('Error:', error);
            fetchingFailed = true;
        }
    }

    function removeTimer() {
        timerDisplay.textContent = '-';
        timerDisplay.style.color = '';
        clearInterval(tornPrayTimeInterval);
        localStorage.removeItem(STORAGE_NAME);
    }

    async function startTimer() {
        try {
            if (!localStorage.getItem(STORAGE_NAME)) {
                await startFetching();
                if (!fetchingFailed) {
                    let startTime = timestamp * 1000;
                    localStorage.setItem(STORAGE_NAME, startTime);
                    updateTimerDisplay(startTime);
                }else {
                    timerDisplay.style.color = settings.color.error_color;
                    timerDisplay.textContent = 'Error';
                }
            } else {
                removeTimer();
            }
        } catch (error) {
            console.error('Error starting timer:', error);
        }
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
                if (settings.go_to_church) {
                    window.location.href = `https://www.torn.com/${CHURCH_PAGE}`;
                }
            }
            timerDisplay.textContent = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
        }, 1000);
    }

    function padZero(num) {
        return (num < 10 ? '0' : '') + num;
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
            lblPrayTime.addEventListener('click', startTimer);
        });
    });


})();
