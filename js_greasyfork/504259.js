// ==UserScript==
// @name         둘크립트 - 예스2
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  이게 뭔지 안알랴준다.
// @author       Your Name
// @match        http://ticket.yes24.com/Pages/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/504259/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%98%88%EC%8A%A42.user.js
// @updateURL https://update.greasyfork.org/scripts/504259/%EB%91%98%ED%81%AC%EB%A6%BD%ED%8A%B8%20-%20%EC%98%88%EC%8A%A42.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 성능 최적화 스타일 적용 함수
    function applyOptimizedStyles(element) {
        if (!element) return;
        element.style.willChange = 'contents';
        element.style.transform = 'translate3d(0, 0, 0)';
        element.style.backfaceVisibility = 'hidden';

        // 자식 요소에 재귀적으로 스타일 적용
        Array.from(element.children).forEach(applyOptimizedStyles);
    }

    // 렌더링 성능 최적화 함수
    function optimizeRendering() {
        const targets = ['.seatarea', '.ContentsArea'];

        targets.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                applyOptimizedStyles(element);
                console.log(`${selector} 성능 최적화 적용 완료`);
            }
        });
    }

    // id="ulTime"의 첫 번째 li 요소를 클릭하는 비동기 함수
    function waitForUlTimeAndClickLi() {
        return new Promise((resolve) => {
            const ulTime = document.getElementById('ulTime');

            if (!ulTime) {
                resolve(false);
                return;
            }

            const liElements = ulTime.querySelectorAll('li');
            if (liElements.length === 1) {
                // li 요소가 1개인 경우 바로 종료하고 fdc_ChoiceSeat 호출
                resolve(true);
                return;
            }

            if (liElements.length > 1) {
                const firstLi = liElements[0];
                if (firstLi) {
                    firstLi.click();
                    resolve(true); // 클릭 성공
                    return;
                }
            }

            const observer = new MutationObserver(() => {
                const updatedLiElements = ulTime.querySelectorAll('li');
                if (updatedLiElements.length > 1) {
                    const firstLi = updatedLiElements[0];
                    if (firstLi) {
                        firstLi.click();
                        observer.disconnect();
                        resolve(true); // 클릭 성공
                    }
                }
            });

            observer.observe(ulTime, { childList: true, subtree: true });

            // 일정 시간 후에도 li가 나타나지 않으면 중지
            setTimeout(() => {
                observer.disconnect();
                resolve(false); // 클릭 실패
            }, 5000); // 5초 동안 기다림
        });
    }

    // td 요소 내 링크 클릭 함수
    async function clickLinkInNthTd(n) {
        const targetElement = document.querySelectorAll('td.select, td.term')[n - 1]?.querySelector('a');
        if (targetElement) {
            targetElement.click();
            // ulTime의 li가 렌더링되고 첫 번째 li 클릭 시도: 회차가 2개 이상인 경우 사용
           /* const liClickSuccessful = await waitForUlTimeAndClickLi();
            if (liClickSuccessful) {
                setTimeout(() => typeof fdc_ChoiceSeat === 'function' && fdc_ChoiceSeat(), 50);
            } else {
                console.log('첫 번째 li 클릭 실패, fdc_ChoiceSeat 호출 중지');
            } */
            // 회차가 1개인 경우 주석 제거
            setTimeout(() => typeof fdc_ChoiceSeat === 'function' && fdc_ChoiceSeat(), 50);
        }
    }

    // 첫 번째 class="s13"이 아닌 자식 클릭 함수
    function clickFirstNonS13Child() {
        const child = Array.from(document.getElementById('divSeatArray')?.children || []).find(c => !c.classList.contains('s13'));
        if (child) {
            child.click();
            setTimeout(() => typeof ChoiceEnd === 'function' && ChoiceEnd(), 50);
            clearCtgoInterval();
        }
    }

    // 첫 번째와 두 번째 class="s13"이 아닌 자식 클릭 함수
    function clickFirstTwoNonS13Children() {
        const children = Array.from(document.getElementById('divSeatArray')?.children || []).filter(c => !c.classList.contains('s13'));
        if (children.length >= 2) {
            children.slice(0, 2).forEach(child => child.click());
            setTimeout(() => typeof ChoiceEnd === 'function' && ChoiceEnd(), 50);
        }
    }



    let intervalId = null;

    // ctgo 함수 정의
    function ctgo(param) {
        if (intervalId) {
            console.log('ctgo 실행 중');
            return;
        }

        intervalId = setInterval(() => {
            ChangeBlock(param);

            // 일정 시간 후에 좌석 선택
            setTimeout(() => {
                clickFirstNonS13Child();
            }, 300); // 300ms 후에 선택 시도
        }, 1500);
    }

    function clearCtgoInterval() {
        clearInterval(intervalId);
        intervalId = null;
    }

    window.ctgo = ctgo;
    // 키 이벤트 핸들러
    function handleKeyEvent(event) {
        switch (event.key) {
            case 'F1':
                event.preventDefault();
                clickLinkInNthTd(1);  // 첫 번째 회차 선택
                break;
            case 'F2':
                event.preventDefault();
                clickLinkInNthTd(2);  // 두 번째 회차 선택
                break;
            case 'F3':
                event.preventDefault();
                clickLinkInNthTd(3);  // 세 번째 회차 선택
                break;
            case 'F6':
                event.preventDefault();
                clickFirstNonS13Child();  // 첫 번째 좌석 선택
                break;
            case 'F7':
                event.preventDefault();
                clickFirstTwoNonS13Children();  // 두 번째 좌석 선택
                break;
            case 'F8':
                event.preventDefault();
                const inputValue = prompt("ctgo에 전달할 값을 입력하세요:", "101");
                if (inputValue !== null) {
                    ctgo(inputValue);
                }
                break;
            case 'F9':
                event.preventDefault();
                clearCtgoInterval();  // F9로 ctgo 인터벌 종료
                break;
        }
    }

    // 페이지 로드 시 성능 최적화 적용
    window.addEventListener('load', optimizeRendering);

    // 키 이벤트 리스너 등록
    document.addEventListener('keydown', handleKeyEvent);

    // 스크립트 로드 완료 메시지
    console.log('둘크립트 - 예스2 스크립트 로드 완료. F1-F3: 회차 선택, F6-F7: 좌석 선택. F8: ctgo 호출, F9: 인터벌 종료.');

})();