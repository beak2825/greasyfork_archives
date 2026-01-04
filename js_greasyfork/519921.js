// ==UserScript==
// @name         Newtoki
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  Open all URLs within a specific div in a new tab for Newtoki when the backtick (`) key is pressed
// @author       Your Name
// @match        *://*newtoki*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519921/Newtoki.user.js
// @updateURL https://update.greasyfork.org/scripts/519921/Newtoki.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 사이트별 설정
     * - `site`: URL 패턴 (정규표현식 사용 가능)
     * - `targetDivClass`: 링크가 포함된 div의 클래스 이름
     * 
     * [새 사이트 추가 방법]
     * - 아래 siteConfigs 배열에 새로운 객체를 추가합니다.
     * - 예:
     *   {
     *     site: /example/, // URL에 "example"이 포함된 경우
     *     targetDivClass: 'example-class' // 대상 div 클래스 이름
     *   }
     */
    const siteConfigs = [
        {
            site: /newtoki/, // URL에 "newtoki"를 포함하는 경우
            targetDivClass: 'toon_index' // 대상 div 클래스 이름
        },
        // 다른 사이트를 추가하려면 아래에 객체를 추가
        // {
        //     site: /example/, // URL에 "example"이 포함된 경우
        //     targetDivClass: 'example-class' // 대상 div 클래스 이름
        // }
    ];

    // 현재 사이트에 적합한 설정 가져오기
    const currentConfig = siteConfigs.find(config => config.site.test(window.location.href));
    if (!currentConfig) return; // 현재 URL이 siteConfigs와 일치하지 않으면 스크립트 중단

    // 키 입력 이벤트 리스너 추가
    document.addEventListener('keydown', (event) => {
        // ` 키가 눌렸는지 확인 (event.key === '`')
        if (event.key === '`') {
            // 대상 div 검색
            const targetDiv = document.querySelector(`.${currentConfig.targetDivClass}`);
            if (!targetDiv) {
                alert('대상 div를 찾을 수 없습니다.');
                return;
            }

            // div 내의 모든 링크를 가져와 새 창으로 열기
            const links = targetDiv.querySelectorAll('a[href]');
            if (links.length === 0) {
                alert('열 URL이 없습니다.');
                return;
            }

            links.forEach(link => {
                const url = link.href;
                if (url) window.open(url, '_blank'); // 새 창으로 열기
            });

            alert(`${links.length}개의 링크가 새 창에서 열렸습니다.`);
        }
    });
})();

