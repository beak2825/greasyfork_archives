// ==UserScript==
// @name         룰렛 결과 + 닉네임 실시간 로그 저장 (수동 다운로드)
// @namespace    https://weflab.com/
// @version      1.6
// @description  룰렛이 멈출 때마다 결과와 닉네임을 확인하여 로그 파일에 저장하고, 원할 때 다운로드
// @author       You
// @match        https://weflab.com/page/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526900/%EB%A3%B0%EB%A0%9B%20%EA%B2%B0%EA%B3%BC%20%2B%20%EB%8B%89%EB%84%A4%EC%9E%84%20%EC%8B%A4%EC%8B%9C%EA%B0%84%20%EB%A1%9C%EA%B7%B8%20%EC%A0%80%EC%9E%A5%20%28%EC%88%98%EB%8F%99%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526900/%EB%A3%B0%EB%A0%9B%20%EA%B2%B0%EA%B3%BC%20%2B%20%EB%8B%89%EB%84%A4%EC%9E%84%20%EC%8B%A4%EC%8B%9C%EA%B0%84%20%EB%A1%9C%EA%B7%B8%20%EC%A0%80%EC%9E%A5%20%28%EC%88%98%EB%8F%99%20%EB%8B%A4%EC%9A%B4%EB%A1%9C%EB%93%9C%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let lastState = "";  // 이전 룰렛 상태 저장
    let logData = ["날짜\t시간\t닉네임\t룰렛 결과"];  // 헤더 추가 (TSV 형식)

    // 다운로드 버튼을 페이지에 추가 (수동 다운로드용)
    let downloadButton = document.createElement('button');
    downloadButton.innerText = "로그 다운로드";
    downloadButton.style.position = "fixed";
    downloadButton.style.bottom = "10px";
    downloadButton.style.right = "10px";
    downloadButton.style.padding = "10px";
    downloadButton.style.fontSize = "16px";
    downloadButton.style.backgroundColor = "#4CAF50";
    downloadButton.style.color = "white";
    downloadButton.style.border = "none";
    downloadButton.style.borderRadius = "5px";
    document.body.appendChild(downloadButton);

    // 다운로드 버튼 클릭 시 로그 파일 저장
    downloadButton.addEventListener("click", () => {
        saveLogToFile();
    });

    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'attributes') {
                let rouletteDiv = document.querySelector('div.roulette_area');

                if (rouletteDiv) {
                    let currentState = rouletteDiv.className.trim(); // 현재 클래스 상태

                    // 룰렛이 새로 시작했을 때 (on 상태)
                    if (currentState === 'roulette_area on' && lastState !== 'roulette_area on') {
                        console.log("🎰 룰렛 시작!");
                    }

                    // 룰렛이 멈췄을 때 (on stop 상태)
                    if (currentState === 'roulette_area on stop' && lastState !== 'roulette_area on stop') {
                        console.log("🎯 룰렛 멈춤! 결과 확인 중...");
                        checkRouletteResult();
                    }

                    lastState = currentState; // 상태 업데이트
                }
            }
        }
    });

    function checkRouletteResult() {
        let rouletteResult = document.querySelector('p.text.roulette.result');
        let nicknameElement = document.querySelector('span.word_box'); // 닉네임 가져오기

        let resultText = rouletteResult ? rouletteResult.innerText.trim() : "결과 없음";
        let nickname = nicknameElement ? nicknameElement.innerText.trim() : "알 수 없음";

        let now = new Date();
        let dateStr = now.toLocaleDateString();  // YYYY-MM-DD 형식
        let timeStr = now.toLocaleTimeString();  // HH:MM:SS 형식

        let logEntry = `${dateStr}\t${timeStr}\t${nickname}\t${resultText}`;
        console.log(logEntry);  // 콘솔에 로그 출력

        // 로그 데이터를 배열에 추가 (TSV 형식)
        logData.push(logEntry);
    }

    function saveLogToFile() {
        if (logData.length === 1) {  // 헤더만 있을 경우 다운로드하지 않음
            alert("로그가 없습니다!");
            return;
        }

        // 로그 데이터를 텍스트 파일로 변환 (TSV 형식)
        const blob = new Blob([logData.join('\n')], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'roulette_log.txt';  // 파일 이름 설정
        link.click();  // 파일 다운로드
    }

    // 감시할 대상 설정 (룰렛 div의 클래스 변화 감지)
    let target = document.querySelector('div.roulette_area');
    if (target) {
        observer.observe(target, { attributes: true, attributeFilter: ['class'] });
    }

})();