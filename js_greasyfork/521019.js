// ==UserScript==
// @name         카카오 POE2 자동 시작
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Path of Exile 2 자동 시작 (쿠키 로드 대기 및 자동 페이지 종료)
// @author       Your name
// @match        https://pathofexile2.game.daum.net/start/poe2
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/521019/%EC%B9%B4%EC%B9%B4%EC%98%A4%20POE2%20%EC%9E%90%EB%8F%99%20%EC%8B%9C%EC%9E%91.user.js
// @updateURL https://update.greasyfork.org/scripts/521019/%EC%B9%B4%EC%B9%B4%EC%98%A4%20POE2%20%EC%9E%90%EB%8F%99%20%EC%8B%9C%EC%9E%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 쿠키가 모두 로드되었는지 확인하는 함수
    function checkCookiesLoaded() {
        return document.cookie !== "";
    }

    // 게임 시작 버튼 클릭 함수
    function clickGameStartButton() {
        const startButton = document.querySelector('#a_kg_poe_emergency_start');
        if (startButton) {
            console.log('게임 시작 버튼을 클릭합니다.');

            // 링크 클릭 이벤트 추가
            startButton.addEventListener('click', function(e) {
                // 클릭 이벤트가 발생하면 2초 후에 페이지를 닫습니다
                console.log('게임 실행 링크가 클릭되었습니다. 잠시 후 페이지가 종료됩니다.');
                setTimeout(() => window.close(), 2000);
            }, { once: true }); // 이벤트는 한 번만 실행

            startButton.click();
            return true;
        }
        return false;
    }

    // 쿠키 로드를 기다린 후 실행하는 함수
    function waitForCookiesAndStart() {
        if (checkCookiesLoaded()) {
            console.log('쿠키가 로드되었습니다.');
            if (!clickGameStartButton()) {
                // 버튼을 찾지 못한 경우 주기적으로 확인
                const checkInterval = setInterval(function() {
                    if (clickGameStartButton()) {
                        clearInterval(checkInterval);
                    }
                }, 1000);

                // 30초 후에는 무조건 중단
                setTimeout(function() {
                    clearInterval(checkInterval);
                    console.log('시간 초과: 버튼을 찾지 못했습니다.');
                }, 30000);
            }
        } else {
            // 쿠키가 아직 로드되지 않았다면 100ms 후에 다시 확인
            setTimeout(waitForCookiesAndStart, 100);
        }
    }

    // 페이지 로드 시 실행
    window.addEventListener('load', function() {
        console.log('페이지 로드됨, 쿠키 로드 대기 중...');
        waitForCookiesAndStart();
    });
})();