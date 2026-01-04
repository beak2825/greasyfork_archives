// ==UserScript==
// @name         연구실안전교육 자동 NEXT (iframe 내부 balloon 클릭)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  edu.labs.go.kr 강의에서 console.log 'StudyFinish' 감지 시 iframe 내부 balloon을 클릭합니다.
// @match        https://edu.labs.go.kr/front/cdms/play.do*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535865/%EC%97%B0%EA%B5%AC%EC%8B%A4%EC%95%88%EC%A0%84%EA%B5%90%EC%9C%A1%20%EC%9E%90%EB%8F%99%20NEXT%20%28iframe%20%EB%82%B4%EB%B6%80%20balloon%20%ED%81%B4%EB%A6%AD%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535865/%EC%97%B0%EA%B5%AC%EC%8B%A4%EC%95%88%EC%A0%84%EA%B5%90%EC%9C%A1%20%EC%9E%90%EB%8F%99%20NEXT%20%28iframe%20%EB%82%B4%EB%B6%80%20balloon%20%ED%81%B4%EB%A6%AD%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 상태 표시
    const statusEl = document.createElement('div');
    statusEl.id = 'tmAutoNextStatus';
    statusEl.innerText = '자동 NEXT 준비 중…';
    Object.assign(statusEl.style, {
        position: 'fixed',
        bottom: '10px',
        right: '10px',
        background: 'rgba(0,0,0,0.6)',
        color: '#fff',
        padding: '6px 12px',
        borderRadius: '4px',
        fontSize: '14px',
        zIndex: 9999,
        fontFamily: 'sans-serif'
    });
    document.body.appendChild(statusEl);

    const CLICK_DELAY = 1000;   // 로그 감지 후 클릭 지연(ms)
    const IFRAME_ID   = 'ifr1';
    const BALLOON_ID  = 'balloon';

    // 원래 console.log 보존
    const origLog = console.log.bind(console);
    console.log = function(...args) {
        origLog(...args);

        // StudyFinish 메시지 감지
        if (args.some(a => typeof a === 'string' && a.includes('StudyFinish'))) {
            statusEl.innerText = 'StudyFinish 감지! 다음 페이지 준비…';
            setTimeout(() => {
                const iframe = document.getElementById(IFRAME_ID);
                if (!iframe) {
                    origLog('자동 NEXT 실패: iframe not found');
                    statusEl.innerText = '오류: iframe 미발견';
                    return;
                }
                const doc = iframe.contentDocument || iframe.contentWindow.document;
                const balloon = doc.getElementById(BALLOON_ID);
                if (balloon) {
                    statusEl.innerText = '다음 페이지로 이동 중…';
                    balloon.click();
                    origLog('자동 NEXT 성공: balloon 클릭됨');
                       // 상태 리셋
       setTimeout(() => {
           statusEl.innerText = '자동 NEXT 준비 중…';
       }, 500);
                } else {
                    origLog('자동 NEXT 실패: balloon 요소를 찾을 수 없음');
                    statusEl.innerText = '오류: balloon 미발견';
                }
            }, CLICK_DELAY);
        }
    };
})();
