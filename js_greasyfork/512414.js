// ==UserScript==
// @name         eRepublikBattleTimer
// @namespace    http://tampermonkey.net/
// @version      2024-10-13
// @description  Shows a countdown timer on erep Battles with possible notification alert on 5 minutes remaining.
// @license      MIT
// @author       You
// @match        https://www.erepublik.com/en/military/battlefield/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=erepublik.com
// @require      https://update.greasyfork.org/scripts/403344/805187/Momentjs%20v2253.js
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/512414/eRepublikBattleTimer.user.js
// @updateURL https://update.greasyfork.org/scripts/512414/eRepublikBattleTimer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const rafaTimerStyle = `
        width: 90px;
        height: 40px;
        color: white;
        font-weight: bold;
        position: absolute;
        right: 5px; top:
        5px;
        display: none;
        flex-direction: column;
        align-items: center;
    `;

    const timerContainer = `
        <div class="rafa-timer" style="${rafaTimerStyle}">
            <span class="rafa-countdown"></span>
            <div class="rafa-alert">
                <input type="checkbox" id="alert-me" class="alert-me">
                <label style="cursor: pointer;" for="alert-me"> Alerta 5 min</label>
            </div>
        </div>`.trim();

    const pvpContainerId = '#pvp_header';

    // Load template into a temporary wrapper
    const wrapper = document.createElement('div');
    wrapper.innerHTML = timerContainer;

    // Render template in DOM
    const pvpContainer = document.querySelector(pvpContainerId);
    pvpContainer.appendChild(wrapper.firstChild);

    // Main UI elements
    const rafaTimer = document.querySelector('.rafa-timer');
    const alertMe = document.querySelector('.alert-me');
    const countdown = document.querySelector('.rafa-countdown');

    // Data for UI controls
    const MINIMUM_DURATION = '1:30:00';
    const NOTIFICATION_MSG = 'Batalha terminando em menos de 5 minutos!';
    const alertThreshold = 5;
    const startTime = moment(TokenProvider.battleStartAt);
    let alertDismissed = false;
    let intervalId;

    /** Fetch digit corresponding to the side score, since each one renders on a separate element. */
    function getPointDigitStr(isLeft, digit) {
        let id = `${isLeft ? 'left' : 'right'}_num${digit}`;
        const digitEl = document.querySelector(`#${id}`);
        return digitEl ? digitEl.value : '0';
    }

    /** Get side score. */
    function getPoints(isLeft) {
        const pointsStr =
              getPointDigitStr(isLeft, 0) +
              getPointDigitStr(isLeft, 1) +
              getPointDigitStr(isLeft, 2) +
              getPointDigitStr(isLeft, 3);

        return Number(pointsStr);
    }

    function getDomination(isLeft) {
        const id = `${isLeft ? 'blue' : 'red'}_domination`;
        const domEl = document.querySelector(`#${id}`).innerText.replace('%', '');
        const dom = Number(domEl);

        return isNaN(dom) ? 0 : dom;
    }

    /** Get battle duration with overtime addition based on total score. */
    function getUpdatedDuration() {
        const leftPoints = getPoints(true);
        const rightPoints = getPoints(false);

        const leftDom = getDomination(true);
        const rightDom = getDomination(false);
        const losingSide = leftDom > rightDom ? rightPoints : leftPoints;
        const overtime = Math.ceil(losingSide / 60);

        const minimumDuration = moment.duration(MINIMUM_DURATION);
        return minimumDuration.add(overtime, 'm');
    }

    /** Get formatted countdown timer. */
    function getCurrentTimer() {
        const now = moment();
        const duration = moment.duration(now.diff(startTime));

        const battleDuration = getUpdatedDuration();
        let remainingTime = battleDuration.subtract(duration);

        const battleFinished = remainingTime.asMilliseconds() < 0;
        if (battleFinished) {
            remainingTime = moment.duration(0);
            clearTimeout(intervalId);
        }

        if (!battleFinished && remainingTime.asMinutes() < alertThreshold && !alertDismissed && alertMe.checked) {
            alertDismissed = true;
            maybeNotify();
        }

        const formattedDuration = moment.utc(remainingTime.asMilliseconds()).format("HH:mm:ss");
        return formattedDuration;
    }

    /** Update timer UI, forces container style to render on top of mass bomb background. */
    function updateTimer() {
        countdown.textContent = getCurrentTimer();
        rafaTimer.style.display = 'flex';
        rafaTimer.style.zIndex = '120';
        intervalId = setTimeout(() => updateTimer(), 1000);
    }

    /** Send a browser notification. */
    function sendNotification() {
        const notification = new Notification(NOTIFICATION_MSG);
        notification.onclick = handleNotification;
    }

    /** Handle callback when user clicks on the notification. */
    function handleNotification() {
        unsafeWindow.parent.focus();
    }

    /** Send a notification if it's available and user has granted permision. */
    function maybeNotify() {
        if (!('Notification' in window)) {
            alert('This browser does not support desktop notification');
        } else if (Notification.permission === 'granted') {
            sendNotification();
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                    sendNotification();
                }
            });
        }
    }

    setTimeout(() => updateTimer(), 1400); // Wait for score data to load so timer starts with possible overtime.
})();