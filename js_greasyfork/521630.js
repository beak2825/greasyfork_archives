// ==UserScript==
// @name         네이버페이 브랜드 추첨 통합 스크립트
// @namespace    meda.tistory.com
// @version      0.3
// @description  브랜드 자동 클릭 및 자동 이동 통합 스크립트
// @match        https://campaign2.naver.com/npay/branddraw*
// @match        https://campaign2.naver.com/npay/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521630/%EB%84%A4%EC%9D%B4%EB%B2%84%ED%8E%98%EC%9D%B4%20%EB%B8%8C%EB%9E%9C%EB%93%9C%20%EC%B6%94%EC%B2%A8%20%ED%86%B5%ED%95%A9%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/521630/%EB%84%A4%EC%9D%B4%EB%B2%84%ED%8E%98%EC%9D%B4%20%EB%B8%8C%EB%9E%9C%EB%93%9C%20%EC%B6%94%EC%B2%A8%20%ED%86%B5%ED%95%A9%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 현재 URL 확인
    const currentUrl = window.location.href;

    // 브랜드 추첨 페이지일 경우 실행되는 코드
    if (currentUrl.includes('/branddraw')) {
        const targetBrand = "배달의민족";
        const checkInterval = 10;
        let attempts = 0;

        function clickConfirmButton() {
            const buttons = document.querySelectorAll('.popup_btn');
            for (const button of buttons) {
                if (button.textContent === "받을게요") {
                    button.click();
                    console.log('팝업 확인 버튼 클릭 완료');
                    return true;
                }
            }
            return false;
        }

        function findAndClickBrand() {
            const brandTitles = document.querySelectorAll('.brand_title');

            for (const title of brandTitles) {
                if (title.textContent === targetBrand) {
                    const itemElement = title.closest('.item');
                    if (itemElement) {
                        if (itemElement.classList.contains('end')) {
                            itemElement.classList.remove('end');
                        }
                        itemElement.querySelector('.item_link').click();
                        console.log(`${targetBrand} 브랜드를 찾아 클릭했습니다.`);

                        const popupCheckInterval = setInterval(() => {
                            if (clickConfirmButton()) {
                                clearInterval(popupCheckInterval);
                            }
                        }, checkInterval);

                        return true;
                    }
                }
            }
            return false;
        }

        function startWatching() {
            const intervalId = setInterval(() => {
                if (findAndClickBrand()) {
                    clearInterval(intervalId);
                }
            }, checkInterval);
        }

        window.addEventListener('load', startWatching);
    }
    // 메인 페이지일 경우 실행되는 코드
    else if (currentUrl === 'https://campaign2.naver.com/npay/') {
        function checkTimeAndRedirect() {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            const milliseconds = now.getMilliseconds();

            console.log(`현재 시간: ${hours}:${minutes}:${seconds}.${milliseconds}`);

            if (hours === 13 && minutes === 59 && seconds === 59 && milliseconds >= 800) {
                console.log('목표 시간 도달! 페이지 이동을 시작합니다.');
                window.location.href = 'https://campaign2.naver.com/npay/branddraw/';
            }
        }

        console.log('네이버페이 브랜드 추첨 자동 이동 스크립트가 시작되었습니다.');
        setInterval(checkTimeAndRedirect, 100);
    }
})();
