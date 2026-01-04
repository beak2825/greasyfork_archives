// ==UserScript==
// @name         YouTube Video Time Tracker & Playback Speed Controller
// @namespace    YT Video Timer & Speed Controller
// @version      1.0
// @description  Displays a draggable box with YouTube video current time, total duration, and current playback speed, temporary speed change when holding down a key.
// @author       Hess
// @match        https://www.youtube.com/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/513831/YouTube%20Video%20Time%20Tracker%20%20Playback%20Speed%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/513831/YouTube%20Video%20Time%20Tracker%20%20Playback%20Speed%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 페이지 URL에 holodex.net이 포함된 경우 스크립트 실행 중단
    if (window.location.href.includes("holodex.net")) {
        return; // 스크립트 실행 중단
    }

    /*
    // 페이지 URL에 https://holodex.net/multiview이 포함된 경우 스크립트 실행 중단
    if (window.location.href.includes("https://holodex.net/multiview")) {
        return; // 스크립트 실행 중단
    }
    */

    // UI 요소 변수 선언
    let greyBox, timeDisplay, speedDisplay, volumeDisplay, liveDisplay;
    let updateInterval;

    // 방송 시작 시간 변수
    let totalTime, currentTime, startTime = null;
    let isLive = null;
    let isVideoPage = null;
    let isStarted = false;
    let isEnd = false;

    // 배속 관련 변수
    let isSpeedChanged = false; // z,x 키를 누르고 있는지 확인하는 변수
    let originalSpeed = 1.0; // z,x 키를 누르는 동안 속도를 저장해둘 변수
    let speedChangeAmount = 0.10; // 배속 변경 단위
    let zKeySpeed = 1.25; // z 키 기본 설정
    let xKeySpeed = 1.5; // x 키 기본 설정

    // 폰트, 버튼 사이즈 변수
    const fontSize = 14;
    const fontSizeSmall = 12;
    const fontButtonSize = 8;

    // 시간을 h:mm:ss로 표시하는 함수
    const formatTime = s => `${Math.floor(s / 3600) ? `${String(Math.floor(s / 3600))}:` : ''}${String(Math.floor((s % 3600) / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

    // 시간을 실시간으로 업데이트하는 함수
    const updateTimeDisplay = () => {
        let video = document.querySelector("video");
        isVideoPage = window.location.href.includes("youtube.com/watch") ? true : false;

        timeDisplay.style.whiteSpace = 'pre-line'; // 줄바꿈 인식을 위해 스타일 추가
        speedDisplay.style.whiteSpace = 'pre-line'; // 줄바꿈 인식을 위해 스타일 추가
        volumeDisplay.style.whiteSpace = 'pre-line'; // 줄바꿈 인식을 위해 스타일 추가

        // 재생바 막대의 길이 로딩
        totalTime = parseFloat(document.querySelector('.ytp-progress-bar').getAttribute('aria-valuemax'));
        // 비디오에서 현재 보고있는 시간
        let currentTime = video.currentTime;

        // 이를 바탕으로 시작 시점 계산
        if (totalTime) {
            startTime ??= Math.floor(Date.now() / 1000) - totalTime;
        }

        // 모든 노드를 초기화
        timeDisplay.replaceChildren();
        volumeDisplay.replaceChildren();
        speedDisplay.replaceChildren();

        // 시청자 수 확인
        let viewers = document.querySelector('.view-count')?.innerText || 'Viewers not available'; // 조회수 2,260회 또는 현재 8,710명 시청 중 이런 식으로 텍스트가 나옴, 메인화면에서는 갱신이 안됨
        if ((viewers.includes('시청 중') || viewers.includes('視聴中') || viewers.includes('watching now')) && window.location.href.includes("youtube.com/watch")) {
            isLive = true;
        } else if ((viewers.includes('조회수') || viewers.includes('回視聴') || viewers.includes('views')) && window.location.href.includes("youtube.com/watch")) {
            isLive = false;
        }
        liveDisplay.textContent = `Live: ${isLive}\n`;
        while (liveDisplay.childNodes.length > 0) {
            liveDisplay.removeChild(liveDisplay.lastChild); // 마지막 자식 제거
        }

        //생방송이 진행 중인 경우
        if (video && isVideoPage) {

            // 재생바 막대를 startTime(동영상 로딩할 때 저장된 변수)에서 다시 계산
            let totalTime2 = Math.floor(Date.now() / 1000) - startTime;

            // totalTime(종종 갱신)이 totalTime2보다 더 크게 갱신되는 경우 그걸로 대체, startTime 다시 설정
            if (totalTime2 < totalTime) {
                totalTime2 = totalTime;
                startTime = Math.floor(Date.now() / 1000) - totalTime;
            }

            // totalTime2 값이 currentTime보다 작을 때 startTime를 더 이전으로 조절하고 totalTime2를 다시 계산
            if (totalTime2 < currentTime) {
                startTime = startTime - currentTime + totalTime2;
                totalTime2 = Math.floor(Date.now() / 1000) - startTime;
                video.playbackRate = Math.min(video.playbackRate, 1); // 속도를 1 이하로 제한
                originalSpeed = 1.0;
            }

            const formattedCurrentTime = formatTime(currentTime);
            const formattedTotalTime = formatTime(totalTime);

            //일단 잠시의 예외 처리 포함
            const formattedTotalTime2 = (totalTime2 < 43200) ? formatTime(totalTime2) : formattedTotalTime;

            let playerState = document.getElementById('movie_player').getPlayerState();
            let stateText;
            switch (playerState) {
                case -1:
                    stateText = `${playerState}: Video Not Found   `;
                    break;
                case 0:
                    stateText = `${playerState}: Stopped   `;
                    break;
                case 1:
                    stateText = `${playerState}: Playing   `;
                    break;
                case 2:
                    stateText = `${playerState}: Paused   `;
                    break;
                case 3:
                    stateText = `${playerState}: Buffering   `;
                    break;
                case 5:
                    stateText = `${playerState}: Video Cued   `;
                    break;
                default:
                    console.log("Unknown state:", playerState);
            }

            // isLive가 true / false of null인 경우로 나눔
            if (playerState === 1 || playerState === 2 || playerState === 3) {
                isStarted = true;
            }
            if (isStarted && playerState === 0) {
                isEnd = true;
            }

            // 시간 텍스트를 위한 요소, 방송 종료 여부에 따라 경우 나눠짐
            if (isLive && !isEnd) {
                timeDisplay.textContent =/* stateText + */`Current / Total\n${formattedCurrentTime} / ${formattedTotalTime2}`; // 생방송 길이를 항상 최대로 추정
            } else {
                timeDisplay.textContent =/* stateText + */`Current / End\n${formattedCurrentTime} / ${formattedTotalTime}`; // 영상의 길이를 고정
            }

            // "Speed:" 텍스트를 위한 요소
            const speedLabel = document.createElement("span");
            speedLabel.textContent = "Speed: ";
            speedLabel.style.color = "white"; // 항상 흰색으로 고정
            speedDisplay.appendChild(speedLabel);

            // 배속 값을 위한 요소
            const speedValue = document.createElement("span");
            speedValue.textContent = `${video.playbackRate.toFixed(2)}x`; // Display speed with 0.01 precision
            speedValue.style.color = isSpeedChanged ? 'yellow' : 'white'; // z, x 키에 따라 색상 변경
            speedDisplay.appendChild(speedValue);

            // 볼륨 텍스트를 위한 요소
            volumeDisplay.textContent = `Volume: ${(video.volume * 100).toFixed(0)}%`; // Display volume in percentage

        } else {// 생방송인 경우의 if문의 끝
            // video 페이지가 아니면 노드의 기본 설정
            timeDisplay.textContent = `Current / NaN\n00:00 / 00:00`;
            volumeDisplay.textContent = `Volume: 0%`; // Default volume
            speedDisplay.textContent = `Speed: 1.00x`; // Display speed as 1.00x
        }
    };

    const handleSpeedChange = (event) => {
        const video = document.querySelector("video");
        if (!video) return;

        // z 키를 눌렀을 때 배속 변경
        if (event.key === "z" && !isSpeedChanged) {
            originalSpeed = video.playbackRate;
            video.playbackRate = zKeySpeed;
            isSpeedChanged = true;
        }

        // x 키를 눌렀을 때 배속 변경
        if (event.key === "x" && !isSpeedChanged) {
            originalSpeed = video.playbackRate;
            video.playbackRate = xKeySpeed;
            isSpeedChanged = true;
        }

        // v 키를 눌렀을 때 배속 감소
        if (event.key === 'v') {
            video.playbackRate = Math.max(video.playbackRate - speedChangeAmount, 0.1); // 최소 0.1로 제한
        }

        // n 키를 눌렀을 때 배속 증가
        if (event.key === 'n') {
            video.playbackRate = Math.min(video.playbackRate + speedChangeAmount, 3.0); // 최대 3.0으로 제한
        }

        // b 키를 눌렀을 때 배속을 1.0으로 설정
        if (event.key === 'b') {
            video.playbackRate = 1.0; // 기본 속도로 설정
        }
    };

    const resetSpeed = (event) => {
        const video = document.querySelector("video");
        if (!video) return;

        // z, x 키를 뗐을 때 배속 변경
        if ((event.key === "z" || event.key === "x") && isSpeedChanged) {
            video.playbackRate = originalSpeed;
            isSpeedChanged = false;
        }
    };

    window.addEventListener('keydown', handleSpeedChange); // 키 누름 감지
    window.addEventListener('keyup', resetSpeed); // 키 뗌 감지

    // 배속 설정과 버튼 추가
    const createKeySpeedControl = () => {

        // 첫번째 줄
        const speedControlContainer1 = document.createElement("div");
        speedControlContainer1.style.cssText = "display: flex; align-items: center; justify-content: center;";

        // Z 키 배속 조절 인터페이스
        const zKeySpeedControl = document.createElement("div");
        zKeySpeedControl.style.cssText = "display: flex; align-items: center;";

        // Z 글자
        const zLabel = document.createElement("span");
        zLabel.textContent = "Z:";
        zLabel.style.cssText = `font-size: ${fontSizeSmall}px; color: white; margin-right: 7px;`;
        zKeySpeedControl.appendChild(zLabel);

        // z 키 배속 표시
        const zKeySpeedDisplay = document.createElement("span");
        zKeySpeedDisplay.textContent = `${zKeySpeed.toFixed(2)}x`;
        zKeySpeedDisplay.style.cssText = `font-size: ${fontSizeSmall}px; color: yellow; margin-right: 7px;`;
        zKeySpeedControl.appendChild(zKeySpeedDisplay);

        // 위 버튼
        const zIncreaseButton = document.createElement("button");
        zIncreaseButton.textContent = "▲";
        zIncreaseButton.style.cssText = `font-size: ${fontButtonSize}px; background-color: gray; color: white; border: none; cursor: pointer;`;
        zIncreaseButton.onclick = () => {
            zKeySpeed = Math.min(3.0, zKeySpeed + 0.05); // 최대 3.0으로 제한
            zKeySpeedDisplay.textContent = `${zKeySpeed.toFixed(2)}x`; // 배속 표시 업데이트
        };
        zKeySpeedControl.appendChild(zIncreaseButton);

        // 아래 버튼
        const zDecreaseButton = document.createElement("button");
        zDecreaseButton.textContent = "▼";
        zDecreaseButton.style.cssText = `font-size: ${fontButtonSize}px; background-color: gray; color: white; border: none; cursor: pointer;`;
        zDecreaseButton.onclick = () => {
            zKeySpeed = Math.max(0.1, zKeySpeed - 0.05); // 최소 0.1로 제한
            zKeySpeedDisplay.textContent = `${zKeySpeed.toFixed(2)}x`; // 배속 표시 업데이트
        };
        zKeySpeedControl.appendChild(zDecreaseButton);

        speedControlContainer1.appendChild(zKeySpeedControl);

        // v, b, n 키 배속 설정 텍스트
        const vbnSpeedControl = document.createElement("div");
        vbnSpeedControl.style.cssText = "display: flex; align-items: center; margin-left: 27px; margin-right: 15px; color: white;";

        const vLabel = document.createElement("span");
        vLabel.textContent = `V:▼${speedChangeAmount.toFixed(2)}x`;
        vLabel.style.cssText = `font-size: ${fontSizeSmall}px; margin-right: 7px;`;
        vbnSpeedControl.appendChild(vLabel);

        const bLabel = document.createElement("span");
        bLabel.textContent = "B:1.0x";
        bLabel.style.cssText = `font-size: ${fontSizeSmall}px; margin-right: 7px;`;
        vbnSpeedControl.appendChild(bLabel);

        const nLabel = document.createElement("span");
        nLabel.textContent = `N:▲${speedChangeAmount.toFixed(2)}x`;
        nLabel.style.cssText = `font-size: ${fontSizeSmall}px;`;
        vbnSpeedControl.appendChild(nLabel);

        speedControlContainer1.appendChild(vbnSpeedControl);

        // 첫번째 줄 추가
        greyBox.appendChild(speedControlContainer1);

        //const breakElement = document.createElement("br"); // 줄바꿈 요소 생성
        //greyBox.appendChild(breakElement); // 줄바꿈 추가

        // 두번째 줄
        const speedControlContainer2 = document.createElement("div");
        speedControlContainer2.style.cssText = "display: flex; align-items: center; justify-content: center; margin: 1px;"

        // X 키 배속 조절 인터페이스
        const xKeySpeedControl = document.createElement("div");
        xKeySpeedControl.style.cssText = "display: flex; align-items: center; margin: 1px;";

        // X 글자
        const xLabel = document.createElement("span");
        xLabel.textContent = "X:";
        xLabel.style.cssText = `font-size: ${fontSizeSmall}px; color: white; margin-right: 7px;`;
        xKeySpeedControl.appendChild(xLabel);

        // x 키 배속 표시
        const xKeySpeedDisplay = document.createElement("span");
        xKeySpeedDisplay.textContent = `${xKeySpeed.toFixed(2)}x`;
        xKeySpeedDisplay.style.cssText = `font-size: ${fontSizeSmall}px; color: yellow; margin-right: 7px;`;
        xKeySpeedControl.appendChild(xKeySpeedDisplay);

        // 위 버튼
        const xIncreaseButton = document.createElement("button");
        xIncreaseButton.textContent = "▲";
        xIncreaseButton.style.cssText = `font-size: ${fontButtonSize}px; background-color: gray; color: white; border: none; cursor: pointer;`;
        xIncreaseButton.onclick = () => {
            xKeySpeed = Math.min(3.0, xKeySpeed + 0.05); // 최대 3.0으로 제한
            xKeySpeedDisplay.textContent = `${xKeySpeed.toFixed(2)}x`; // 배속 표시 업데이트
        };
        xKeySpeedControl.appendChild(xIncreaseButton);

        // 아래 버튼
        const xDecreaseButton = document.createElement("button");
        xDecreaseButton.textContent = "▼";
        xDecreaseButton.style.cssText = `font-size: ${fontButtonSize}px; background-color: gray; color: white; border: none; cursor: pointer;`;
        xDecreaseButton.onclick = () => {
            xKeySpeed = Math.max(0.1, xKeySpeed - 0.05); // 최소 0.1로 제한
            xKeySpeedDisplay.textContent = `${xKeySpeed.toFixed(2)}x`; // 배속 표시 업데이트
        };
        xKeySpeedControl.appendChild(xDecreaseButton);

        speedControlContainer2.appendChild(xKeySpeedControl);


        const speedUnitControl = document.createElement("div");
        speedUnitControl.style.cssText = "display: flex; align-items: center; justify-content: center; margin: 1px;";

        // 배속 단위 이름 표시
        const unitLabel = document.createElement("span");
        unitLabel.textContent = `Playback Rate Gap: `;
        unitLabel.style.cssText = `font-size: ${fontSizeSmall}px; color: white; margin-right: 7px; margin-left: 7px`;
        speedUnitControl.appendChild(unitLabel);

        // 배속 단위 값 표시
        const unitValueDisplay = document.createElement("span");
        unitValueDisplay.textContent = `${speedChangeAmount.toFixed(2)}x`;
        unitValueDisplay.style.cssText = `font-size: ${fontSizeSmall}px; color: white; margin-right: 7px;`;
        speedUnitControl.appendChild(unitValueDisplay);

        // 위 버튼 (배속 단위 증가)
        const increaseButton = document.createElement("button");
        increaseButton.textContent = "▲";
        increaseButton.style.cssText = `font-size: ${fontButtonSize}px; background-color: gray; color: white; border: none; cursor: pointer;`;
        increaseButton.onclick = () => {
            speedChangeAmount = Math.min(0.5, speedChangeAmount + 0.05); // 최대 0.5까지 증가
            unitValueDisplay.textContent = `${speedChangeAmount.toFixed(2)}x`; // 배속 단위 값 업데이트
            // V, N 키 텍스트 업데이트
            vLabel.textContent = `V:▼${speedChangeAmount.toFixed(2)}x`;
            nLabel.textContent = `N:▲${speedChangeAmount.toFixed(2)}x`;
        };
        speedUnitControl.appendChild(increaseButton);

        // 아래 버튼 (배속 단위 감소)
        const decreaseButton = document.createElement("button");
        decreaseButton.textContent = "▼";
        decreaseButton.style.cssText = `font-size: ${fontButtonSize}px; background-color: gray; color: white; border: none; cursor: pointer;`;
        decreaseButton.onclick = () => {
            speedChangeAmount = Math.max(0.05, speedChangeAmount - 0.05); // 최소 0.05까지 감소
            unitValueDisplay.textContent = `${speedChangeAmount.toFixed(2)}x`; // 배속 단위 값 업데이트
            // V, N 키 텍스트 업데이트
            vLabel.textContent = `V:▼${speedChangeAmount.toFixed(2)}x`;
            nLabel.textContent = `N:▲${speedChangeAmount.toFixed(2)}x`;

        };
        speedUnitControl.appendChild(decreaseButton);

        speedControlContainer2.appendChild(speedUnitControl);

        // 두번째 줄 추가
        greyBox.appendChild(speedControlContainer2);
    };

    //회색 박스 만들기
    const createGreyBox = () => {
        if (updateInterval) {
            clearInterval(updateInterval); // 이전 updateInterval 중지
        }

        // Grey Box 생성 및 스타일링
        greyBox = document.createElement("div");
        greyBox.style.cssText = "position:fixed;bottom:0%;left:0;width:300px;height:110px;background-color:rgba(0, 0, 0, 0.6);z-index:9999;border:1px solid #ccc;padding:8px;cursor:move;";

        // 시간 표시
        timeDisplay = document.createElement("div");
        timeDisplay.style.cssText = `color:white; text-align:center; margin-bottom:5px;`;
        timeDisplay.style.fontSize = `${fontSize}px`;

        // 배속 표시
        speedDisplay = document.createElement("div");
        speedDisplay.style.cssText = `color:white; text-align:center; margin-top: 4px;`;
        speedDisplay.style.fontSize = `${fontSize}px`;

        // 볼륨 표시
        volumeDisplay = document.createElement("div");
        volumeDisplay.style.cssText = `color:white; text-align:center;`;
        volumeDisplay.style.fontSize = `${fontSize}px`;

        // 실시간 표시 (안쓸 예정)
        liveDisplay = document.createElement("div");
        liveDisplay.style.cssText = `color:white; text-align:center; margin-bottom:5px;`;
        liveDisplay.style.fontSize = `${fontSize}px`;

        // 노드의 기본 설정
        timeDisplay.textContent = `Current / NaN\n00:00 / 00:00`;
        volumeDisplay.textContent = `Volume: 0%`; // Default volume
        speedDisplay.textContent = `Speed: 1.00x`; // Display speed as 1.00x

        greyBox.appendChild(timeDisplay); // 시간 표시
        createKeySpeedControl(); // 커스텀 배속 표시
        greyBox.appendChild(speedDisplay); // 배속 표시
        greyBox.appendChild(volumeDisplay); // 볼륨 표시
        greyBox.appendChild(liveDisplay); // 실시간 표시 (안쓸 예정)

        // 종료 버튼 추가
        const closeButton = document.createElement("button");
        closeButton.textContent = "X";
        closeButton.style.cssText = "position:absolute;top:6px;right:5px;background-color:red;color:white;border:none;font-size:12px;padding:1px 3px;cursor:pointer;";
        closeButton.onclick = () => {
            greyBox.style.display = "none";
            clearInterval(updateInterval);
        };
        greyBox.appendChild(closeButton);

        // 새로고침 버튼 추가
        const refreshButton = document.createElement("button");
        refreshButton.textContent = "↻";
        refreshButton.style.cssText = "position:absolute;top:5px;right:25px;background-color:green;color:white;border:none;font-size:12px;padding:1px 3px;cursor:pointer;";
        refreshButton.onclick = () => {
            clearInterval(updateInterval); // Stop current update interval
            greyBox.remove(); // Remove the current greyBox
            resetBroadcastStartTime();
            createGreyBox();
        };
        greyBox.appendChild(refreshButton);

        document.body.appendChild(greyBox);

        // 드래그 기능 추가
        let isDragging = false, startX, startY, startLeft, startTop;
        greyBox.onmousedown = e => {
            isDragging = true;
            ({ clientX: startX, clientY: startY } = e);
            ({ left: startLeft, top: startTop } = window.getComputedStyle(greyBox));
            document.onmousemove = ({ clientX, clientY }) => isDragging && ((greyBox.style.left = `${parseInt(startLeft) + clientX - startX}px`), (greyBox.style.top = `${parseInt(startTop) + clientY - startY}px`));
            document.onmouseup = () => {
                isDragging = false;
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };

        updateInterval = setInterval(updateTimeDisplay, 50); // 업데이트 간격 설정
    };

    const resetBroadcastStartTime = () => {
        let video = document.querySelector("video");
        const metaTag = document.querySelector('meta[itemprop="startDate"]');

        startTime = null;
        totalTime = null;
        isLive = null;
        isStarted = false;
        isEnd = false;
    };

    // 딱 한 번 작동하는 페이지 로드와 최초 박스 생성
    window.addEventListener('load', () => {
        createGreyBox();
    });

    let lastUrl = location.href;
    const observer = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            resetBroadcastStartTime();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
})();
