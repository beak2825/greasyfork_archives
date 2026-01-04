// ==UserScript==
// @name         티켓링크 새로고침
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  티켓링크 취소표 자동 새로고침
// @author       Your name
// @match        https://www.ticketlink.co.kr/reserve/*
// @grant        none
// @license      pangddong
// @icon         https://search.pstatic.net/sunny/?src=https%3A%2F%2Fplay-lh.googleusercontent.com%2FNb-IAuWBqFzNxwkosKpyQSyF1MrrNga9sm9_Xqz6mV5wiRMmtFzAS9ZIPXxw0UKWKhPO&type=sc960_832
// @downloadURL https://update.greasyfork.org/scripts/532604/%ED%8B%B0%EC%BC%93%EB%A7%81%ED%81%AC%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/532604/%ED%8B%B0%EC%BC%93%EB%A7%81%ED%81%AC%20%EC%83%88%EB%A1%9C%EA%B3%A0%EC%B9%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 전역 설정
    const config = {
        refreshInterval: 0.15 * 1000, // 앞 숫자를 변경해 새로고침 간격 변경(초단위)
        isRunning: false,
        refreshTimer: null
    };

function createControls() {
    const controlPanel = document.createElement('div');
    controlPanel.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        padding: 10px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 5px;
        z-index: 9999;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        color: white;
        width: 140px;
        text-align: center;
    `;

    controlPanel.innerHTML = `
        <div style="margin-bottom: 10px;">
            <strong style="color: white;">매크로 상태:</strong>
            <span id="macroStatus" style="color: red;">정지됨</span>
        </div>
        <button id="toggleMacro" style="
            padding: 8px 0;
            width: 100%;
            background: rgba(76, 175, 80, 0.9);
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
            transition: background 0.3s;
            font-size: 14px;
            margin-bottom: 8px;
        ">시작</button>
        <div style="
            font-size: 11px;
            color: rgba(255, 255, 255, 0.7);
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 8px;
        ">
            단축키: [Space]
        </div>
    `;

        document.body.appendChild(controlPanel);

        const toggleButton = document.getElementById('toggleMacro');
        toggleButton.addEventListener('click', toggleMacro);

        document.addEventListener('keydown', function(e) {
            if (e.code === 'Space') {
                e.preventDefault();
                toggleMacro();
            }
        });
    }

    function toggleMacro() {
        config.isRunning = !config.isRunning;
        updateStatus();

        if (config.isRunning) {
            startRefresh();
        } else {
            stopRefresh();
        }
    }

    function updateStatus() {
        const statusElement = document.getElementById('macroStatus');
        const toggleButton = document.getElementById('toggleMacro');

        if (config.isRunning) {
            statusElement.style.color = '#4CAF50';
            statusElement.textContent = '실행 중';
            toggleButton.textContent = '정지';
            toggleButton.style.background = '#f44336';
        } else {
            statusElement.style.color = 'red';
            statusElement.textContent = '정지됨';
            toggleButton.textContent = '시작';
            toggleButton.style.background = '#4CAF50';
        }
    }

    function startRefresh() {
        if (!config.refreshTimer) {
            refresh();
        }
    }

    function stopRefresh() {
        if (config.refreshTimer) {
            clearTimeout(config.refreshTimer);
            config.refreshTimer = null;
        }
    }

    function refresh() {
        if (!config.isRunning) {
            stopRefresh();
            return;
        }

        try {
            // 새로고침 버튼 클릭
            const refreshButtons = document.querySelectorAll('button');
            for (let button of refreshButtons) {
                if (button.textContent.includes('새로고침') ||
                    button.classList.contains('refresh') ||
                    button.title?.includes('새로고침')) {
                    button.click();
                    break;
                }
            }
        } catch (error) {
            console.error('새로고침 중 오류:', error);
        }

        if (config.isRunning) {
            config.refreshTimer = setTimeout(refresh, config.refreshInterval);
        }
    }

    // 초기화
    function initialize() {
        console.log('티켓링크 자동 새로고침 스크립트가 로드되었습니다.');
        createControls();
    }

    // 스크립트 시작
    initialize();
})();