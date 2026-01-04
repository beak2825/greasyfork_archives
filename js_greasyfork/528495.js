// ==UserScript==
// @name         Video.js 전체화면 버튼만 표시하기
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Video.js 플레이어에서 전체화면 버튼만 남기고 다른 컨트롤들을 숨깁니다
// @author       You
// @match        *://*/*
// @grant        GM_addStyle 
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/528495/Videojs%20%EC%A0%84%EC%B2%B4%ED%99%94%EB%A9%B4%20%EB%B2%84%ED%8A%BC%EB%A7%8C%20%ED%91%9C%EC%8B%9C%ED%95%98%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/528495/Videojs%20%EC%A0%84%EC%B2%B4%ED%99%94%EB%A9%B4%20%EB%B2%84%ED%8A%BC%EB%A7%8C%20%ED%91%9C%EC%8B%9C%ED%95%98%EA%B8%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // video.js가 로드될 때까지 대기
    function waitForVideoJs() {
        if (document.querySelector('.video-js')) {
            applyStyles();
        } else {
            setTimeout(waitForVideoJs, 500);
        }
    }
    
    // 스타일 적용
    function applyStyles() {
        // CSS를 추가하여 전체화면 버튼만 제외하고 모든 컨트롤 숨기기
        GM_addStyle(`
            /* 모든 컨트롤 버튼 숨기기 */
            .video-js .vjs-control {
                display: none !important;
            }
            
            /* 전체화면 버튼만 표시 */
            .video-js .vjs-fullscreen-control {
                display: block !important;
            }
            
            /* 진행 바 숨기기 */
            .video-js .vjs-progress-control {
                display: none !important;
            }
            
            /* 시간 표시 숨기기 */
            .video-js .vjs-time-control {
                display: none !important;
            }
            
            /* 볼륨 컨트롤 숨기기 */
            .video-js .vjs-volume-panel {
                display: none !important;
            }
            
            /* 재생 버튼 숨기기 */
            .video-js .vjs-play-control {
                display: none !important;
            }
            
            /* 메뉴 버튼 숨기기 */
            .video-js .vjs-menu-button {
                display: none !important;
            }
            
            /* 컨트롤 바 축소하기 (전체화면 버튼만 표시하기 위함) */
            .video-js .vjs-control-bar {
                display: flex !important;
                justify-content: flex-end !important;
                height: 30px !important;
            }
        `);
        
        console.log('Video.js 스타일이 적용되었습니다 - 전체화면 버튼만 표시');
    }
    
    // 페이지가 로드된 후 Video.js 확인 시작
    waitForVideoJs();
    
    // 동적으로 추가되는 Video.js 요소 감지
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.classList && node.classList.contains('video-js') || 
                            node.querySelector && node.querySelector('.video-js')) {
                            applyStyles();
                            break;
                        }
                    }
                }
            }
        });
    });
    
    // 문서 전체 변화 감지
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();