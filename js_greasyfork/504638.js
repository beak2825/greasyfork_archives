// ==UserScript==
// @name         둘크립트 - 멜크2
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  멜론 티켓 사이트에서 특정 동작을 자동화하는 스크립트 (알람 소리 추가)
// @author       Your Name
// @match        *://ticket.melon.com/reservation/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504638/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EB%A9%9C%ED%81%AC2.user.js
// @updateURL https://update.greasyfork.org/scripts/504638/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EB%A9%9C%ED%81%AC2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let intervalId = null;
    let timerIntervalId = null;
    let startTime = null;
    const alarmSoundUrl = 'https://www.soundjay.com/button/beep-07.wav';

    function updateTimer() {
        if (!startTime) return;
        const elapsedMinutes = Math.floor((Date.now() - startTime) / 60000);
        const timerDiv = document.querySelector('.timer-display');
        if (timerDiv) {
            timerDiv.textContent = `${elapsedMinutes}분째 진행중`;
        }

        // 15분 경과 시 창 닫기
        if (elapsedMinutes >= 15) {
            clearF6Interval();
            window.close();
        }
    }

    function playAlarmSound() {
        new Audio(alarmSoundUrl).play();
    }

    function handleF6() {
        if (intervalId) {
            console.log('F6 실행 중');
            return;
        }

        // 타이머 초기화 및 시작
        startTime = Date.now();
        const boxInfo = document.querySelector('.box_info_bm');
        if (boxInfo) {
            const timerDiv = document.createElement('div');
            timerDiv.className = 'timer-display';
            timerDiv.style.color = 'red';
            timerDiv.style.fontWeight = 'bold';
            boxInfo.appendChild(timerDiv);
        }
        timerIntervalId = setInterval(updateTimer, 1000);

        intervalId = setInterval(() => {
            document.getElementById('btnReloadSchedule')?.click();
            const rectElement = document.querySelector("#wrapper rect[width='11']:not([fill='#DDDDDD'])");

            if (rectElement) {
                handleElementClicks([rectElement]);
                playAlarmSound();
                clearF6Interval();
            }
        }, 1000);
    }

    function handleF7() {
        if (intervalId) {
            clearF6Interval();
            console.log('F6 중지');
        } else {
            console.log('F6 미실행');
        }
    }

    function clearF6Interval() {
        clearInterval(intervalId);
        clearInterval(timerIntervalId);
        intervalId = null;
        timerIntervalId = null;
        startTime = null;
        const timerDiv = document.querySelector('.timer-display');
        if (timerDiv) timerDiv.remove();
    }

    function handleElementClicks(elements) {
        elements.forEach(triggerClick);
        console.log(`${elements.length} 클릭됨`);
        clickNextButton();
    }

    function triggerClick(element) {
        element.dispatchEvent(new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        }));
    }

    function clickNextButton() {
        document.getElementById('nextTicketSelection')?.click();
        console.log('다음 클릭됨');
    }

    function handleF1() {
        const elements = getSortedRectElements();
        if (elements.length > 0) handleElementClicks([elements[0]]);
    }

    function handleF2() {
        const elements = getSortedRectElements();
        if (elements.length > 1) handleElementClicks(elements.slice(0, 2));
    }

    function getSortedRectElements() {
        return Array.from(document.querySelectorAll("#wrapper rect[width='11']:not([fill='#DDDDDD'])"))
                    .sort((a, b) => parseFloat(a.getAttribute('y')) - parseFloat(b.getAttribute('y')));
    }

    document.addEventListener('keydown', function(event) {
        switch (event.key) {
            case 'F1':
                event.preventDefault();
                handleF1();
                break;
            case 'F2':
                event.preventDefault();
                handleF2();
                break;
            case 'F6':
                event.preventDefault();
                handleF6();
                break;
            case 'F7':
                event.preventDefault();
                handleF7();
                break;
        }
    });

})();