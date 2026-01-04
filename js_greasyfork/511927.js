// ==UserScript==
// @name          알람 타이머(Ctrl + Alt + A)
// @namespace     알람 타이머(Ctrl + Alt + A)
// @match         *://*/*
// @version       0.4
// @description   Ctrl + Alt + A를 누르면 알람 창을 띄웁니다.
// @icon          https://cdn-icons-png.flaticon.com/512/7348/7348045.png
// @author        mickey90427 <mickey90427@naver.com>
// @grant         GM_setValue
// @grant         GM_getValue
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/511927/%EC%95%8C%EB%9E%8C%20%ED%83%80%EC%9D%B4%EB%A8%B8%28Ctrl%20%2B%20Alt%20%2B%20A%29.user.js
// @updateURL https://update.greasyfork.org/scripts/511927/%EC%95%8C%EB%9E%8C%20%ED%83%80%EC%9D%B4%EB%A8%B8%28Ctrl%20%2B%20Alt%20%2B%20A%29.meta.js
// ==/UserScript==
// image : https://www.flaticon.com/kr/free-icon/alarm_7348045

(function() {
    'use strict';

    const defaultMusicUrl = 'https://mabinoger.com/web/jukebox/mp3/Sliab_Cuiliin.mp3';
    let alarmTime = null;
    let countdownInterval = null;
    let timePickerOpen = false;
    let alarmAudio = new Audio(GM_getValue('alarmMusic', defaultMusicUrl));
    alarmAudio.loop = true; // 음악 반복 재생 설정

    // CSS styles for countdown box and time picker
    const styles = `
        #timePicker {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 20px;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            z-index: 9999;
            border-radius: 10px;
        }
        #countdownBox {
            position: fixed;
            top: 30%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            font-size: 24px;
            z-index: 9999;
            cursor: pointer;
        }
        #alarmButton {
            position: fixed;
            top: 60%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 5px 15px;
            background: red;
            color: white;
            font-size: 16px;
            cursor: pointer;
            z-index: 9999;
            border-radius: 5px;
        }
        #setAlarmButton, #setMusicButton {
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
            width: 100%; /* 너비 고정 */
            height: 40px; /* 높이 고정 */
        }
        #setAlarmButton {
            background: #4CAF50; /* Set Alarm 버튼 색상 */
        }
        #setMusicButton {
            background: #2196F3; /* Set Music 버튼 색상 */
        }
        input[type="number"] {
            width: 60px; /* 입력창 너비 고정 */
            height: 40px; /* 입력창 높이 고정 */
            margin-right: 5px;
            font-size: 16px; /* 폰트 크기 조정 */
            text-align: center; /* 가운데 정렬 */
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // 기본 음악 주소가 Tampermonkey의 저장소에 없는 경우 초기화
    if (!GM_getValue('alarmMusic')) {
        GM_setValue('alarmMusic', defaultMusicUrl);
    }

    function toggleTimeDialog() {
        if (timePickerOpen) {
            document.getElementById('timePicker')?.remove();
            timePickerOpen = false;
        } else {
            const picker = createTimePicker();
            document.body.appendChild(picker);
            timePickerOpen = true;
        }
    }

    function createTimePicker() {
        const timePicker = document.createElement('div');
        timePicker.id = 'timePicker';

        const hoursInput = createInputElement('hour', 12);
        const minutesInput = createInputElement('minute', 59);
        const secondsInput = createInputElement('second', 59);
        
        const amPmSelect = document.createElement('select');
        const amOption = document.createElement('option');
        amOption.value = 'AM';
        amOption.text = 'AM';
        const pmOption = document.createElement('option');
        pmOption.value = 'PM';
        pmOption.text = 'PM';
        amPmSelect.appendChild(amOption);
        amPmSelect.appendChild(pmOption);

        // 현재 시간 가져오기 및 30초 더하기
        const now = new Date();
        now.setSeconds(now.getSeconds() + 30); // 현재 시간에 30초 추가
        const currentHour = now.getHours();
        hoursInput.value = (currentHour % 12) || 12; // 12시간 형식
        minutesInput.value = now.getMinutes();
        secondsInput.value = now.getSeconds();

        const setButton = document.createElement('button');
        setButton.id = 'setAlarmButton';
        setButton.innerText = 'Set Alarm';
        setButton.onclick = () => {
            // 기존 알람 중지
            stopAlarm();

            const hour = parseInt(hoursInput.value);
            const minute = parseInt(minutesInput.value);
            const second = parseInt(secondsInput.value);
            const amPm = amPmSelect.value;

            // 24시간 형식으로 변환
            const adjustedHour = amPm === 'PM' && hour < 12 ? hour + 12 : (amPm === 'AM' && hour === 12 ? 0 : hour);
            
            // 알람 시간 생성
            const alarmDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), adjustedHour, minute, second);
            alarmTime = Math.floor(alarmDate.getTime() / 1000); // Unix 타임스탬프 저장
            timePicker.remove(); // 시간 선택창 닫기
            timePickerOpen = false; // 플래그 업데이트
            startCountdown(); // 카운트다운 시작
        };

        const setMusicButton = document.createElement('button');
        setMusicButton.id = 'setMusicButton';
        setMusicButton.innerText = 'Set Music';
        setMusicButton.onclick = () => {
            const musicUrl = prompt('Enter music URL:', GM_getValue('alarmMusic'));
            if (musicUrl) {
                GM_setValue('alarmMusic', musicUrl);
                alarmAudio.src = musicUrl; // 새로운 음악 주소로 업데이트
            }
        };

        timePicker.appendChild(hoursInput);
        timePicker.appendChild(document.createTextNode(':'));
        timePicker.appendChild(minutesInput);
        timePicker.appendChild(document.createTextNode(':'));
        timePicker.appendChild(secondsInput);
        timePicker.appendChild(amPmSelect);
        timePicker.appendChild(setButton);
        timePicker.appendChild(setMusicButton); // Set Music 버튼 추가
        
        return timePicker;
    }

    function createInputElement(label, max) {
        const input = document.createElement('input');
        input.type = 'number';
        input.min = '0';
        input.max = max.toString();
        input.placeholder = label.charAt(0).toUpperCase() + label.slice(1);
        return input;
    }

    function startCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }

        countdownInterval = setInterval(() => {
            const now = Math.floor(Date.now() / 1000);
            const remaining = alarmTime - now;

            if (remaining <= 0) {
                clearInterval(countdownInterval);
                playAlarm();
            } else {
                updateCountdown(remaining);
            }
        }, 1000);
    }

    function updateCountdown(remaining) {
        const countdownBox = document.getElementById('countdownBox') || createCountdownBox();
        countdownBox.innerText = `Remaining time: ${remaining} seconds`;
    }

    function createCountdownBox() {
        const box = document.createElement('div');
        box.id = 'countdownBox';
        box.onclick = stopAlarm; // 클릭 시 알람 종료
        document.body.appendChild(box);
        return box;
    }

    function playAlarm() {
        // 최신 음악 URL을 가져옵니다
        alarmAudio.src = GM_getValue('alarmMusic', defaultMusicUrl); // 음악 URL 업데이트
        alarmAudio.play(); // 음악 재생
        alarmAudio.currentTime = 0; // 음악 시작 위치를 처음으로 설정

        const alarmButton = document.createElement('div');
        alarmButton.id = 'alarmButton';
        alarmButton.innerText = 'Stop Alarm';
        alarmButton.onclick = stopAlarm; // 클릭 시 알람 종료
        document.body.appendChild(alarmButton);

        const countdownBox = document.getElementById('countdownBox');
        if (countdownBox) {
            countdownBox.remove(); // 카운트다운 박스 제거
        }
    }

    function stopAlarm() {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
        const alarmButton = document.getElementById('alarmButton');
        if (alarmButton) {
            alarmButton.remove(); // 알람 버튼 제거
        }
        if (countdownInterval) {
            clearInterval(countdownInterval);
        }
        const countdownBox = document.getElementById('countdownBox');
        if (countdownBox) {
            countdownBox.remove(); // 카운트다운 박스 제거
        }
    }

    // Ctrl + Alt + A 키 조합으로 알람 설정 열기
    document.addEventListener('keydown', (event) => {
        if (event.ctrlKey && event.altKey && event.key === 'a') {
            toggleTimeDialog();
        }
    });
})();
