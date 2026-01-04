// ==UserScript==
// @name         무비싸다구
// @version      2024-12-19
// @description  try to take over the world!
// @author       You
// @match        https://www.lottecinema.co.kr/NLCMS/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lottecinema.co.kr
// @grant        none
// @namespace none
// @downloadURL https://update.greasyfork.org/scripts/520558/%EB%AC%B4%EB%B9%84%EC%8B%B8%EB%8B%A4%EA%B5%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/520558/%EB%AC%B4%EB%B9%84%EC%8B%B8%EB%8B%A4%EA%B5%AC.meta.js
// ==/UserScript==

(function() {
    // 페이지 로드 완료 시 실행
    window.addEventListener('load', function() {
        // .timeinfo 클래스를 가진 모든 요소 선택
        const timeInfoElements = document.querySelectorAll('.timeinfo');

        // 선택된 모든 요소 삭제
        timeInfoElements.forEach(function(element) {
            element.remove();
        });
    });

    // DOM 변경 감지를 위한 MutationObserver 설정
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 새로 추가된 .timeinfo 요소 검색 및 삭제
            const newTimeInfoElements = document.querySelectorAll('.timeinfo');
            newTimeInfoElements.forEach(function(element) {
                element.remove();
            });
        });
    });

    // 옵저버 설정
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();

setTimeout(function(){

    // 모든 btn_wrap 요소를 찾아서 각각에 자동클릭 버튼 추가
    document.querySelectorAll('.btn_wrap.type1').forEach(wrapper => {
        // 자동클릭 버튼 생성
        const autoButton = document.createElement('button');
        autoButton.textContent = '자동클릭';
        autoButton.style.cssText = `
        margin-left: 10px;
        padding: 5px 10px;
        background-color: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
    `;

        // 클릭 상태를 저장할 변수
        let intervalId = null;
        let isClicking = false;

        // 자동클릭 버튼 클릭 이벤트
        autoButton.addEventListener('click', function() {
            const linkElement = wrapper.querySelector('a');

            if (!isClicking) {
                // 자동 클릭 시작
                isClicking = true;
                autoButton.textContent = '중지';
                autoButton.style.backgroundColor = '#ff9999';
                intervalId = setInterval(() => {
                    linkElement.click();
                }, 10);
            } else {
                // 자동 클릭 중지
                isClicking = false;
                autoButton.textContent = '자동클릭';
                autoButton.style.backgroundColor = '#f0f0f0';
                clearInterval(intervalId);
            }
        });

        // btn_wrap에 버튼 추가
        wrapper.appendChild(autoButton);
    });

}, 1000);
