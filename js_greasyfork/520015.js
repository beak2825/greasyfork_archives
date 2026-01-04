// ==UserScript==
// @name         dcinside Recommendation Filter
// @name:ko      디시인사이드 추천수 필터
// @namespace    https://greasyfork.org/ko/scripts/520015-dcinside-recommendation-filter
// @version      1.2.0
// @description  하루종일 갤질만 하는 당신을 위해
// @author       봄처럼
// @match        https://gall.dcinside.com/*board/*
// @icon         https://www.google.com/s2/favicons?domain=gall.dcinside.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/520015/dcinside%20Recommendation%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/520015/dcinside%20Recommendation%20Filter.meta.js
// ==/UserScript==

// 최소 추천수 설정
const MIN_RECOMMEND_COUNT = 3;

// 초기 상태 설정
let isFeatureActive = false;
let observer = null; // MutationObserver 중복 실행 방지용

// 사용자 스크립트 고유 스타일 추가 (없으면 다른 확장 프로그램이랑 충돌남)
function injectCustomStyles() {
    const style = document.createElement('style');
    style.innerHTML = `
        tr.my-filtered {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
}

// 하단부 디시뉴스 차단
function removeSpecificIframe() {
    const iframe = document.querySelector('iframe#frame_u2b04o3eakj0firk');
    if (iframe) {
        iframe.remove();
    }
}

// 필터 적용
function applyFilters() {
    const articles = document.querySelectorAll('tr.ub-content');

    articles.forEach(article => {
        const recommendCell = article.querySelector('td.gall_recommend');
        if (recommendCell) {
            const recommendCount = parseInt(recommendCell.textContent.trim(), 10);

            if (isFeatureActive && recommendCount < MIN_RECOMMEND_COUNT) {
                article.classList.add('my-filtered'); // 필터 적용
            } else {
                article.classList.remove('my-filtered'); // 필터 해제
            }
        }
    });
}

// 텍스트 색상 업데이트 (주간/야간 모드)
function updateTextColor(targetElement) {
    if (isFeatureActive) {
        targetElement.style.color = '#FFFFFF'; // 활성화 중에는 항상 흰색
    } else {
        const isDarkMode = document.getElementById('css-darkmode') !== null; // 다크 모드 여부 확인
        targetElement.style.color = isDarkMode ? '#cccccc' : '#333333'; // 비활성화 상태에서 모드에 따라 변경
    }
}

// 필터 토글 및 UI 업데이트
function toggleFilter(targetElement) {
    isFeatureActive = !isFeatureActive;
    applyFilters(); // 필터 재적용

    targetElement.innerHTML = isFeatureActive ? '추천<br>많은 글' : '추천';
    targetElement.style.backgroundColor = isFeatureActive ? '#34a853' : 'rgba(74, 81, 167, 0)';
    updateTextColor(targetElement); // 활성화 여부에 따른 텍스트 색상 변경

    localStorage.setItem('isFeatureActive', isFeatureActive ? 'true' : 'false');
}

// 타겟 버튼 초기화
function initTargetButton() {
    // 추천수 버튼 위치를 동적으로 판단
    const selectors = [
        "#container > section.left_content.result > article:nth-child(3) > div.gall_listwrap.list > div.wrapGL > table > thead > tr > th:nth-child(7)",
        "#container > section.left_content.result > article:nth-child(3) > div.gall_listwrap.list > table > thead > tr > th:nth-child(7)",
        "#container > section.left_content.result > article:nth-child(3) > div.gall_listwrap.list > div.wrapGL > table > thead > tr > th:nth-child(6)",
        "#container > section.left_content.result > article:nth-child(3) > div.gall_listwrap.list > table > thead > tr > th:nth-child(6)",
        "#container > section.left_content > article:nth-child(3) > div.gall_listwrap.list > div.wrapGL > table > thead > tr > th:nth-child(7)",
        "#container > section.left_content > article:nth-child(3) > div.gall_listwrap.list > table > thead > tr > th:nth-child(7)",
        "#container > section.left_content > article:nth-child(3) > div.gall_listwrap.list > div.wrapGL > table > thead > tr > th:nth-child(6)",
        "#container > section.left_content > article:nth-child(3) > div.gall_listwrap.list > table > thead > tr > th:nth-child(6)"
    ];

    let targetElement = null;
    for (const selector of selectors) {
        targetElement = document.querySelector(selector);
        if (targetElement) break;
    }

    if (!targetElement || targetElement.hasAttribute('data-clicked')) return;

    targetElement.setAttribute('data-clicked', 'true');
    targetElement.style.cssText = `
        cursor: pointer;
        background-color: rgba(74, 81, 167, 0);
        border-radius: 5px;
        padding: 0px 0px;
        text-align: center;
    `;

    const storedState = localStorage.getItem('isFeatureActive');
    isFeatureActive = storedState === 'true'; // 이전 상태 복원
    targetElement.innerHTML = isFeatureActive ? '추천<br>많은 글' : '추천';
    targetElement.style.backgroundColor = isFeatureActive ? '#34a853' : 'rgba(74, 81, 167, 0)';
    updateTextColor(targetElement); // 초기 텍스트 색상 설정

    targetElement.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleFilter(targetElement);
    });

    // DOM 변화 감지로 다크모드 상태 변화 실시간 반영
    const observer = new MutationObserver(() => updateTextColor(targetElement));
    observer.observe(document.body, { childList: true, subtree: true });
}

// DOM 변경 감지 설정 (중복 방지)
function observeDOMChanges() {
    if (observer) return; // 이미 Observer가 설정된 경우 종료

    observer = new MutationObserver(() => {
        initTargetButton(); // 버튼 초기화
        applyFilters(); // 필터 재적용
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// 초기 실행
window.addEventListener('load', () => {
    injectCustomStyles(); // 스타일 추가
    initTargetButton(); // 버튼 초기화
    applyFilters(); // 초기 필터 적용
    observeDOMChanges(); // DOM 변경 감지
    removeSpecificIframe(); // 하단부 디시뉴스 차단
});
