// ==UserScript==
// @name        Video.js Controller Customizer
// @namespace   MyCustomScripts
// @description video.js 컨트롤러에서 전체화면 버튼만 남기고 다른 버튼들을 제거합니다
// @match       *://*/*
// @version     1.2
// @author      YourName
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/528496/Videojs%20Controller%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/528496/Videojs%20Controller%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 스타일 추가 함수
    function addStyle() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            /* video.js 컨트롤러 커스터마이징 */
            
            /* 재생/일시정지 버튼 숨기기 */
            .video-js .vjs-play-control {
                display: none !important;
            }
            
            /* 볼륨 컨트롤 숨기기 */
            .video-js .vjs-volume-panel,
            .video-js .vjs-mute-control,
            .video-js .vjs-volume-control {
                display: none !important;
            }
            
            /* 시간 표시 숨기기 */
            .video-js .vjs-time-control,
            .video-js .vjs-time-divider,
            .video-js .vjs-duration,
            .video-js .vjs-current-time {
                display: none !important;
            }
            
            /* 프로그레스 바 숨기기 */
            .video-js .vjs-progress-control {
                display: none !important;
            }
            
            /* 속도 조절 버튼 숨기기 */
            .video-js .vjs-playback-rate {
                display: none !important;
            }
            
            /* 캡션 버튼 숨기기 */
            .video-js .vjs-subs-caps-button {
                display: none !important;
            }
            
            /* 챕터 버튼 숨기기 */
            .video-js .vjs-chapters-button {
                display: none !important;
            }
            
            /* 설정 버튼 숨기기 */
            .video-js .vjs-settings,
            .video-js .vjs-cog-menu-button {
                display: none !important;
            }
            
            /* 화질 선택 버튼 숨기기 */
            .video-js .vjs-quality-selector {
                display: none !important;
            }
            
            /* 메뉴 아이템 숨기기 */
            .video-js .vjs-menu-button {
                display: none !important;
            }
            
            /* 전체화면 버튼만 예외 처리하여 표시 */
            .video-js .vjs-fullscreen-control {
                display: block !important;
                /* 위치 조정 (필요한 경우) */
                position: absolute;
                right: 0;
                width: 40px;
                height: 40px;
            }
            
            /* 컨트롤 바 높이 및 배경 설정 */
            .video-js .vjs-control-bar {
                height: 40px !important;
                background-color: rgba(0, 0, 0, 0.5) !important;
                /* 필요한 경우 컨트롤바 숨김 지연시간 조정 */
                transition: opacity 0.3s ease !important;
            }
        `;
        
        document.head.appendChild(styleElement);
        console.log('Video.js 컨트롤러 스타일이 적용되었습니다.');
    }
    addStyle();
})();