// ==UserScript==
// @name          YouTube 댓글 날짜 변환기(컴퓨터 로컬 타임 기반)
// @namespace     YouTube 댓글 날짜 변환기(컴퓨터 로컬 타임 기반)
// @version       0.1
// @description   유튜브 댓글의 다양한 날짜 형식을 "YYYY년 MM월 DD일 오전/오후 HH:MM"으로 변환됩니다. 오래된 댓글의 경우, 변환되는 날짜와 시간은 유튜브 정보의 한계로 인해 실제와 다를 수 있습니다.
// @match         *://*.youtube.com/*
// @icon          https://www.google.com/s2/favicons?sz=64&domain=YouTube.com
// @author        mickey90427 <mickey90427@naver.com>
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/539966/YouTube%20%EB%8C%93%EA%B8%80%20%EB%82%A0%EC%A7%9C%20%EB%B3%80%ED%99%98%EA%B8%B0%28%EC%BB%B4%ED%93%A8%ED%84%B0%20%EB%A1%9C%EC%BB%AC%20%ED%83%80%EC%9E%84%20%EA%B8%B0%EB%B0%98%29.user.js
// @updateURL https://update.greasyfork.org/scripts/539966/YouTube%20%EB%8C%93%EA%B8%80%20%EB%82%A0%EC%A7%9C%20%EB%B3%80%ED%99%98%EA%B8%B0%28%EC%BB%B4%ED%93%A8%ED%84%B0%20%EB%A1%9C%EC%BB%AC%20%ED%83%80%EC%9E%84%20%EA%B8%B0%EB%B0%98%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // #region 보조 함수 (날짜 변환)

    /**
     *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * 주의: 이 스크립트에서 변환되는 모든 날짜는 당신의 로컬 시간(컴퓨터/브라우저에 설정된 시간)을 기준으로 합니다. *
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     *
     * 주어진 날짜 문자열 (상대적 또는 절대적)을 목표하는 절대 날짜 형식으로 변환합니다.
     * @param {string} dateString 유튜브에서 가져온 날짜 문자열 (예: "1개월 전", "어제", "2024년 5월 19일").
     * @returns {string|null} 형식화된 절대 날짜 문자열 (예: "2025년 06월 19일 오후 04:52") 또는 변환 실패 시 null.
     *
     * 중요: 유튜브의 "X개월 전", "Y년 전"과 같은 상대적 날짜는 정확한 시작 시점을 알 수 없습니다.
     * 따라서 이 함수는 스크립트가 실행되는 '현재 시점'을 기준으로 역산하여 날짜를 '추정'합니다.
     * 특히 1일 이상의 상대적 날짜(예: 1주 전, 1개월 전, 1년 전)는 실제 댓글 작성 날짜와 반드시 다를 수밖에 없습니다.
     * 이는 유튜브가 제공하는 정보 자체가 정밀하지 않기 때문이며, 스크립트의 한계가 아닙니다.
     */
    function convertToTargetDateFormat(dateString) {
        const now = new Date(); // 스크립트 실행 시점의 현재 날짜와 시간
        let targetDate = new Date(now.getTime()); // 상대적 날짜 변환의 기준이 될 날짜 (기본값: 현재 시간)

        const trimmedText = dateString.trim(); // 앞뒤 공백 제거

        // 1. 상대적 날짜 처리 (예: "방금 전", "오늘", "어제", "1개월 전")
        if (trimmedText === '방금 전') {
            // '방금 전'은 현재 시점이므로 targetDate를 조정할 필요 없음
        } else if (trimmedText === '오늘') {
            // '오늘'도 현재 시점이므로 targetDate를 조정할 필요 없음 (시간 정보는 현재 시간 유지)
        } else if (trimmedText === '어제') {
            targetDate.setDate(targetDate.getDate() - 1); // 현재 날짜에서 하루 전으로 설정
        } else {
            // '숫자 단위 전' 형식 (예: "1개월 전", "2일 전")
            const relativeMatch = trimmedText.match(/^(\d+)\s*(년|개월|주|일|시간|분|초)\s*전$/);
            if (relativeMatch) {
                const value = parseInt(relativeMatch[1]); // 숫자 값 (예: 1, 2)
                const unit = relativeMatch[2]; // 단위 (예: '년', '개월')

                switch (unit) {
                    case '년':
                        targetDate.setFullYear(targetDate.getFullYear() - value);
                        break;
                    case '개월':
                        targetDate.setMonth(targetDate.getMonth() - value);
                        break;
                    case '주':
                        targetDate.setDate(targetDate.getDate() - (value * 7)); // 1주는 7일
                        break;
                    case '일':
                        targetDate.setDate(targetDate.getDate() - value);
                        break;
                    case '시간':
                        targetDate.setHours(targetDate.getHours() - value);
                        break;
                    case '분':
                        targetDate.setMinutes(targetDate.getMinutes() - value);
                        break;
                    case '초':
                        targetDate.setSeconds(targetDate.getSeconds() - value);
                        break;
                    default:
                        // 알 수 없는 상대적 시간 단위인 경우 변환하지 않고 null 반환
                        return null;
                }
            } else {
                // 2. 이미 존재하는 절대 날짜 처리 (예: "2024년 5월 19일", "2023. 12. 31.")
                let parsedDate = null;

                // 다양한 절대 날짜 형식 파싱 시도
                let absMatch = trimmedText.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/); // "YYYY년 MM월 DD일"
                if (!absMatch) {
                    absMatch = trimmedText.match(/(\d{4})\.\s*(\d{1,2})\.\s*(\d{1,2})\./); // "YYYY. MM. DD."
                }
                if (!absMatch) { // YYYY-MM-DD
                    absMatch = trimmedText.match(/(\d{4})-(\d{1,2})-(\d{1,2})/); // "YYYY-MM-DD"
                }

                if (absMatch) {
                    const year = parseInt(absMatch[1]);
                    const month = parseInt(absMatch[2]) - 1; // JavaScript의 월은 0부터 시작 (0:1월 ~ 11:12월)
                    const day = parseInt(absMatch[3]);
                    // 절대 날짜에 시간 정보가 없는 경우, 현재 시간으로 기본 설정
                    parsedDate = new Date(year, month, day, now.getHours(), now.getMinutes(), now.getSeconds());
                } else {
                    // 위의 정규식에 일치하지 않으면 표준 JavaScript Date 파서로 시도 (예: "May 19, 2024" 같은 영어 형식)
                    try {
                        const tempDate = new Date(trimmedText);
                        if (!isNaN(tempDate.getTime())) { // 유효한 날짜인지 확인
                            parsedDate = tempDate;
                        }
                    } catch (e) {
                        // 파싱 오류는 무시
                    }
                }

                if (parsedDate) {
                    targetDate = parsedDate;
                } else {
                    // 상대적 날짜도 아니고 인식할 수 있는 절대 날짜 형식도 아닌 경우, null 반환
                    return null;
                }
            }
        }

        // 최종 목표 형식: "YYYY년 MM월 DD일 오전/오후 HH:MM"으로 포맷
        const year = targetDate.getFullYear();
        const month = String(targetDate.getMonth() + 1).padStart(2, '0'); // 1월부터 시작하도록 +1, 두 자리로 채움
        const day = String(targetDate.getDate()).padStart(2, '0'); // 두 자리로 채움
        let hours = targetDate.getHours();
        const minutes = String(targetDate.getMinutes()).padStart(2, '0'); // 두 자리로 채움

        const ampm = hours >= 12 ? '오후' : '오전'; // 오전/오후 결정
        hours = hours % 12; // 24시간제를 12시간제로 변환
        hours = hours ? hours : 12; // 0시는 12시로 표시
        const finalHours = String(hours); // 한 자리 숫자에는 앞에 0을 붙이지 않음 (예: 오전 9시)

        return `${year}년 ${month}월 ${day}일 ${ampm} ${finalHours}:${minutes}`;
    }

    // #endregion 보조 함수

    // #region 핵심 처리 로직

    // 목표하는 날짜 형식 (예: "2025년 06월 19일 오후 4:52")을 판별하는 정규식
    // 이 정규식에 맞는 형식은 변환을 건너뛰도록 합니다.
    const TARGET_FORMAT_REGEX = /^\d{4}년\s*\d{2}월\s*\d{2}일\s*(오전|오후)\s*\d{1,2}:\d{2}$/;

    /**
     * 하나의 댓글 날짜 요소를 처리합니다.
     * @param {HTMLElement} element 날짜 텍스트를 포함하는 <a> 요소.
     */
    function processSingleDateElement(element) {
        const originalText = element.textContent.trim(); // 요소의 원본 텍스트 가져오기

        // 1. 이 스크립트에 의해 이미 변환된 요소인지 확인합니다.
        //    MutationObserver의 무한 루프를 방지합니다.
        if (element.dataset.convertedDate === originalText) {
            return; // 이미 변환된 것이면 처리 건너뛰기
        }

        // 2. 현재 텍스트가 이미 우리가 원하는 "YYYY년 MM월 DD일 오전/오후 HH:MM" 형식인지 확인합니다.
        if (TARGET_FORMAT_REGEX.test(originalText)) {
            // 이미 목표 형식이라면, 변환된 것으로 표시하고 건너뜁니다.
            element.dataset.convertedDate = originalText;
            return;
        }

        // 3. 아직 변환되지 않았고, 목표 형식도 아니라면 변환을 시도합니다.
        const newDateText = convertToTargetDateFormat(originalText);
        // 새로운 날짜 텍스트가 유효하고, 원본 텍스트와 다를 경우에만 업데이트합니다.
        if (newDateText && element.textContent !== newDateText) {
            element.textContent = newDateText; // 요소의 텍스트를 새 날짜로 변경
            element.dataset.convertedDate = newDateText; // 변환되었음을 표시
            // console.log(`[YouTube 날짜 변환기] 변환 완료: "${originalText}" -> "${newDateText}"`); // 디버깅용 로그
        }
    }

    /**
     * 주어진 컨테이너 내의 모든 날짜 요소를 찾아 처리합니다.
     * @param {HTMLElement} container 검색할 DOM 요소 (예: document.body 또는 새로 추가된 댓글 스레드).
     */
    function processAllDateElementsInContainer(container) {
        // 댓글 날짜 텍스트를 포함하는 <a> 태그를 모두 선택합니다.
        // span#published-time-text 아래의 yt-simple-endpoint 클래스를 가진 <a> 태그를 찾습니다.
        const dateElements = container.querySelectorAll('span#published-time-text > a.yt-simple-endpoint');
        // console.log(`[YouTube 날짜 변환기] 컨테이너에서 ${dateElements.length}개의 날짜 요소 발견.`); // 디버깅용 로그
        dateElements.forEach(processSingleDateElement); // 각 날짜 요소를 개별적으로 처리
    }

    // #endregion 핵심 처리 로직

    // #region 실시간 관찰 (옵저버)

    // DOM 변화를 감지하여 동적으로 로드되는 콘텐츠를 처리하기 위한 메인 옵저버
    const commentObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            // 자식 노드 목록에 변화가 있고, 추가된 노드가 있는 경우
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // 추가된 노드가 HTML 요소인 경우에만 처리
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // 추가된 노드 자체가 댓글 스레드이거나 댓글 뷰 모델이거나 댓글 섹션이거나,
                        // 또는 그 안에 댓글 스레드나 댓글 뷰 모델이 포함되어 있는 경우
                        if (node.matches('ytd-comment-thread-renderer, ytd-comment-view-model, ytd-comments#comments') || node.querySelector('ytd-comment-thread-renderer, ytd-comment-view-model')) {
                            // 해당 컨테이너 내의 모든 날짜 요소를 처리
                            processAllDateElementsInContainer(node);
                        }
                    }
                });
            }
        });
    });

    // body 요소의 변화를 관찰하기 시작합니다.
    // childList: 자식 노드의 추가/제거 감지
    // subtree: 자식 노드뿐만 아니라 모든 하위 트리의 변화 감지 (매우 중요)
    commentObserver.observe(document.body, { childList: true, subtree: true });
    console.log('[YouTube 날짜 변환기] 실시간 옵저버 시작.');

    // 페이지 로드 시 이미 존재하는 댓글을 초기 변환하기 위한 설정
    // 'load' 이벤트: 페이지의 모든 리소스(이미지 등)가 로드된 후
    window.addEventListener('load', () => {
        console.log('[YouTube 날짜 변환기] window.load 시점 초기 스캔.');
        processAllDateElementsInContainer(document.body);
    });
    // 'DOMContentLoaded' 이벤트: HTML 문서가 완전히 로드되고 파싱된 후 (리소스 로드 전)
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[YouTube 날짜 변환기] DOMContentLoaded 시점 초기 스캔.');
        processAllDateElementsInContainer(document.body);
    });

    // #endregion 실시간 관찰

})();