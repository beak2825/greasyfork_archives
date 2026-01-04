// ==UserScript==
// @name         둘크립트 - 예스1
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  이게 뭔지 안알랴준다.
// @author       Your Name
// @match        *://ticket.yes24.com/Special*
// @match        *://ticket.yes24.com/Perf*
// @match        *://ticket.yes24.com/New*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/504258/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%98%88%EC%8A%A41.user.js
// @updateURL https://update.greasyfork.org/scripts/504258/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%98%88%EC%8A%A41.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 개발자도구 새로고침 취소
    //devtoolsDetector.stop();

    // 현재 시간과 목표 시간 사이의 지연 시간을 계산하는 함수
    function calculateDelayUntil(targetHour, targetMinute, targetSecond, targetMillisecond) {
        const now = new Date();
        const targetTime = new Date(now);

        targetTime.setHours(targetHour, targetMinute, targetSecond, targetMillisecond);

        // 목표 시간이 현재 시간보다 과거인 경우, 목표 시간을 다음 날로 설정
        if (now > targetTime) {
            targetTime.setDate(targetTime.getDate() + 1);
        }

        return targetTime - now;
    }

    // 예매를 수행하는 함수
    function runTask() {
        let lastSegment;

        // URL 패턴에 따라 다르게 처리
        if (window.location.search.includes('IdPerf=')) {
            // 패턴 1: https://ticket.yes24.com/New/Perf/Detail/DetailSpecial.aspx?IdPerf=54538
            const urlParams = new URLSearchParams(window.location.search);
            lastSegment = urlParams.get('IdPerf');
        } else {
            lastSegment = window.location.pathname.split('/').pop();
        }


        if (lastSegment) {
            jsf_base_GoPerfSalePerf(lastSegment, "True");
            console.log(`공연 ID ${lastSegment}로 예매를 시도합니다.`);
        } else {
            console.error('공연 ID를 찾을 수 없습니다.');
        }
    };


    // F1 키 이벤트 리스너
    document.addEventListener('keydown', function(event) {
        if (event.key === 'F1') {
            event.preventDefault();  // 기본 동작 방지
            window.runAt();  // 즉시 실행
        }
    });

    // UI 생성 함수
    function createUI() {
        const container = document.createElement('div');
        container.id = 'runAtUI';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 15px;
            z-index: 10000;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            font-family: Arial, sans-serif;
            min-width: 300px;
        `;

        container.innerHTML = `
            <div style="margin-bottom: 10px; font-weight: bold; font-size: 14px;">둘크립트 - 예스1</div>
            <div style="display: flex; gap: 5px; margin-bottom: 10px;">
                <input type="number" id="runAtHour" placeholder="시" min="0" max="23" style="width: 50px; padding: 5px;">
                <input type="number" id="runAtMinute" placeholder="분" min="0" max="59" style="width: 50px; padding: 5px;">
                <input type="number" id="runAtSecond" placeholder="초" min="0" max="59" style="width: 50px; padding: 5px;">
                <input type="number" id="runAtMillisecond" placeholder="ms" min="0" max="999" style="width: 60px; padding: 5px;">
            </div>
            <button id="runAtButton" style="width: 100%; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px;">실행</button>
            <div id="runAtStatus" style="margin-top: 10px; font-size: 12px; color: #666; min-height: 20px;"></div>
        `;

        document.body.appendChild(container);

        // 버튼 클릭 이벤트
        document.getElementById('runAtButton').addEventListener('click', function() {
            const hour = parseInt(document.getElementById('runAtHour').value);
            const minute = parseInt(document.getElementById('runAtMinute').value);
            const second = parseInt(document.getElementById('runAtSecond').value);
            const millisecond = parseInt(document.getElementById('runAtMillisecond').value);

            const statusDiv = document.getElementById('runAtStatus');

            if (isNaN(hour) || isNaN(minute) || isNaN(second) || isNaN(millisecond)) {
                statusDiv.textContent = '모든 시간 값을 입력해주세요.';
                statusDiv.style.color = 'red';
                return;
            }

            // 시간 형식 표시 (hh:mm:ss nnn)
            const formattedTime = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:${String(second).padStart(2, '0')} ${String(millisecond).padStart(3, '0')}`;
            statusDiv.textContent = `${formattedTime}에 실행됩니다`;
            statusDiv.style.color = '#007bff';

            // runAt 함수 실행 (완료 콜백 추가)
            window.runAt(hour, minute, second, millisecond, function() {
                statusDiv.textContent = '실행완료';
                statusDiv.style.color = 'green';
            });
        });
    }

    // 지연된 시간 후에 예매를 실행하는 함수
    window.runAt = function(hour, minute, second, millisecond, callback) {
        if (hour === undefined || minute === undefined || second === undefined || millisecond === undefined) {
            console.log('즉시 runTask를 호출합니다.');
            runTask();  // 즉시 실행
            if (callback) callback();
        } else {
            const delay = calculateDelayUntil(hour, minute, second, millisecond);
            console.log(`지연 시간 ${delay}ms 후에 runTask가 호출됩니다.`);
            setTimeout(function() {
                runTask();  // 지연 후 실행
                if (callback) callback();
            }, delay);
        }
    };

    // DOM이 로드되면 UI 생성
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

    // 사용법을 콘솔에 출력
    console.log('둘크립트 - 예스1 스크립트가 로드되었습니다.');
    console.log('사용 방법:');
    console.log('- 특정 시간에 실행: runAt(hour, minute, second, millisecond)');
    console.log('  예: runAt(20, 0, 0, 0)  // 20:00:00.000에 실행');
    console.log('- 즉시 실행: runAt() 또는 F1 키를 누르세요.');
    console.log('- UI를 통한 실행: 좌측 상단의 UI에서 시간을 입력하고 실행 버튼을 클릭하세요.');
})();
