// ==UserScript==
// @name         둘크립트 - 담캎
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  페이지에서 특정 버튼을 찾아 예약된 시간에 자동으로 클릭하는 스크립트입니다.
// @author       @Pigeon
// @match        *://cafe.daum.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506734/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EB%8B%B4%EC%BA%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/506734/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EB%8B%B4%EC%BA%8E.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let button;

    const clickButton = () => {
        if (button) {
            button.click();
            console.log('버튼을 클릭했습니다.');
        } else {
            console.log('버튼을 찾을 수 없습니다.');
        }
    };

    const displayRemainingTime = (targetDate) => {
        const updateRemainingTime = () => {
            const remainingTime = targetDate - new Date();
            if (remainingTime <= 0) {
                clearInterval(intervalId);
                console.log('목표 시간이 도달했습니다.');
                clickButton();
                return;
            }

            const remainingMinutes = Math.floor((remainingTime / 1000 / 60) % 60);
            const remainingSeconds = ((remainingTime / 1000) % 60).toFixed(3);
            console.log(`버튼 클릭까지 ${remainingMinutes}분 ${remainingSeconds}초 남았습니다.`);
        };

        const intervalId = setInterval(updateRemainingTime, 5000);
        updateRemainingTime();  // 바로 초기 시간 업데이트
    };

    const scheduleButtonClick = (targetTime) => {
        const targetDate = new Date();
        targetDate.setHours(targetTime.hours);
        targetDate.setMinutes(targetTime.minutes);
        targetDate.setSeconds(targetTime.seconds);
        targetDate.setMilliseconds(targetTime.milliseconds);

        const timeDifference = targetDate - new Date();
        if (timeDifference > 0) {
            console.log(`버튼이 ${targetTime.hours}시 ${targetTime.minutes}분 ${targetTime.seconds}초 ${targetTime.milliseconds}밀리초에 클릭됩니다.`);
            displayRemainingTime(targetDate);
            setTimeout(clickButton, timeDifference);
        } else {
            console.log('목표 시간이 이미 지났습니다. 시간을 다시 설정하세요.');
        }
    };

    const findButton = (selector = '#btnSaveView .txt_btn') => {
        button = document.querySelector(selector);
                     // 버튼에 click 이벤트 추가
        button.addEventListener('click', function() {
            console.log('Button clicked!');
        });
        if (button) {
            button.style.outline = '2px solid blue';
            button.style.opacity = '1';
            console.log('버튼을 찾았습니다.');

        } else {
            console.log('버튼을 찾을 수 없습니다.');
        }

        return button;
    };

    const initializeScript = () => {
        window.cbc = (hours, minutes, seconds, milliseconds) => {
            findButton(); // 버튼을 먼저 찾기
            if (hours !== undefined || minutes !== undefined || seconds !== undefined || milliseconds !== undefined) {
                scheduleButtonClick({ hours, minutes, seconds, milliseconds });
            } else {
                console.log('시간이 입력되지 않았습니다. 5초 뒤에 버튼을 클릭합니다.');
                setTimeout(clickButton, 5000); // 5초 후 클릭
            }
        };

        window.findButton = findButton;

        console.log(`
Tampermonkey 스크립트가 로드되었습니다.

사용법:
1. 개발자 도구를 열고 콘솔 탭으로 이동합니다.
2. 'findButton([선택자])'을 호출하여 페이지에서 버튼을 찾고 강조 표시할 수 있습니다. 선택자가 제공되지 않으면 기본적으로 'input[type=submit]' 버튼을 찾습니다.
3. 'cbc(hours, minutes, seconds, milliseconds)'을 호출하여 버튼 클릭을 예약할 수 있습니다.
   시간이 입력되지 않으면 5초 뒤에 버튼이 클릭됩니다.
        `);
    };

    document.addEventListener('DOMContentLoaded', initializeScript);

    window.addEventListener('keydown', function(e) {
        if (e.key === 'F1') {
            e.preventDefault();
            findButton(); // 첫 번째 날짜 클릭
        }
    });

})();
