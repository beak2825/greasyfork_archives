// ==UserScript==
// @name         E-Campus VOD Closer
// @namespace    hjh
// @version      0.1
// @description  온라인 강의 수강완료 후 알림 및 창 닫기
// @author       You
// @match        http*://ecampus.changwon.ac.kr/mod/vod/viewer.php?id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.kr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467694/E-Campus%20VOD%20Closer.user.js
// @updateURL https://update.greasyfork.org/scripts/467694/E-Campus%20VOD%20Closer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function playMelody() {
        // 오디오 컨텍스트 생성
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const audioCtx = new AudioContext();

        // 각 음계의 주파수 정보
        const frequencies = {
            '도': 261.63,
            '레': 293.66,
            '미': 329.63,
            '파': 349.23,
            '솔': 392.00,
            '라': 440.00,
            '시': 493.88,
        };

        // 도미솔 미디 음계 리스트
        const melody = ['도', '미', '솔'];

        // 오디오 컨텍스트 상수 설정
        const duration = 0.3; // 음 길이 (0.5초)
        const volume = 0.5; // 볼륨 (0.5)

        // 음계를 순회하며 주파수 대역과 음 길이, 볼륨 설정 후 재생
        melody.forEach((note, index) => {
            // 오디오 소스 노드 생성
            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            // 주파수 대역 설정
            oscillator.frequency.setValueAtTime(frequencies[note], audioCtx.currentTime);

            // 음 길이 설정
            const startTime = index * duration;
            const endTime = startTime + duration;
            oscillator.start(startTime);
            oscillator.stop(endTime);

            // 볼륨 설정
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);

            // 소스 노드 연결 후 재생
            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);
        });
    }

    setInterval(() => {
        const remainingTime = document.querySelector('.vjs-remaining-time-display').textContent;
        const h1 = document.querySelector('#vod_header > h1');
        var title = h1.textContent;
        document.title = `${remainingTime} ${title}`;
        if (remainingTime === "0:00") {
            playMelody();
            window.close();
        }
    }, 1000);

})();