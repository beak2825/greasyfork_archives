// ==UserScript==
// @name         OTT URL 필터 버튼
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  OTT 페이지 상단 가운데에 현재의 URL을 깔끔하게 정리하여 클립보드에 복사하는 버튼 표시
// @author       DongHaerang
// @match        *://*.coupangplay.com/titles*
// @match        *://*.tving.com/contents*
// @match        *://*.wavve.com/player/movie*
// @match        *://*.wavve.com/player/vod*
// @match        *://*.watcha.com/contents*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543323/OTT%20URL%20%ED%95%84%ED%84%B0%20%EB%B2%84%ED%8A%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/543323/OTT%20URL%20%ED%95%84%ED%84%B0%20%EB%B2%84%ED%8A%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 스타일 정의 (한 번만 실행) ---
    const styles = `
        #filter-button-container {
            position: fixed;
            top: 0px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            display: flex;
            gap: 10px;
        }
        .filter-btn {
            background-color: #0073e6;
            color: white;
            border: none;
            padding: 0px 5px;
            border-radius: 5px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.2s;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }
        .filter-btn:hover {
            background-color: #005bb5;
        }
        #copy-notification {
            position: fixed;
            /* ✨ 변경된 부분: 버튼 아래에 위치하도록 top 값을 조정 */
            top: 60px;
            left: 50%;
            /* ✨ 변경된 부분: 수평 중앙 정렬만 유지 */
            transform: translateX(-50%);
            background-color: rgba(0, 0, 0, 0.75);
            color: white;
            padding: 15px 30px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 16px;
            opacity: 0;
            transition: opacity 0.3s ease-in-out;
            pointer-events: none;
            max-width: 90%;
            word-break: break-all;
            text-align: center;
        }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // --- 버튼 클릭 및 알림 기능 ---
    function showNotification(message) {
        const existingNotification = document.getElementById('copy-notification');
        if (existingNotification) return;

        const notification = document.createElement('div');
        notification.id = 'copy-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => { notification.style.opacity = '1'; }, 10);
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => { notification.remove(); }, 300);
        }, 2500);
    }

    function handleButtonClick(type) {
        const baseUrl = window.location.href.split('?')[0];
        const newUrl = `${baseUrl}?type=${type}`;

        navigator.clipboard.writeText(newUrl).then(() => {
            showNotification(`'${newUrl}'이(가) 저장되었습니다.`);
        }).catch(err => {
            console.error('클립보드 복사 실패:', err);
            showNotification('복사에 실패했습니다.');
        });
    }

    function handleWavveButtonClick() {
            try {
                const currentUrl = new URL(window.location.href);
                let newUrl = '';
    
                // 요청사항: 현재 URL에 "/player/movie"가 포함되어 있는지 확인
                if (currentUrl.pathname.includes('/player/movie')) {
                    const movieId = currentUrl.searchParams.get('movieid');
                    if (movieId) {
                        newUrl = `https://www.wavve.com/player/movie?movieid=${movieId}`;
                    }
                } 
                // 기존 VOD 페이지 로직
                else if (currentUrl.pathname.includes('/player/vod')) {
                    const programId = currentUrl.searchParams.get('programid');
                    const contentId = currentUrl.searchParams.get('contentid');
    
                    if (programId) {
                        newUrl = `https://www.wavve.com/player/vod?programid=${programId}`;
                    } else if (contentId) {
                        newUrl = `https://www.wavve.com/player/vod?contentid=${contentId}`;
                    }
                }
        
                if (newUrl) {
                    navigator.clipboard.writeText(newUrl).then(() => {
                        showNotification(`'${newUrl}'이(가) 저장되었습니다.`);
                    });
                } else {
                    showNotification('필요한 ID(movieid, programid 등)를 찾을 수 없습니다.');
                }
            } catch (err) {
                console.error('Wavve URL 처리 실패:', err);
                showNotification('URL 처리 중 오류가 발생했습니다.');
            }
        }

    // --- 버튼을 생성하는 함수 ---
    function createButtons() {
        if (document.getElementById('filter-button-container')) return;

        const container = document.createElement('div');
        container.id = 'filter-button-container';

        const movieButton = document.createElement('button');
        movieButton.textContent = 'MOVIE';
        movieButton.className = 'filter-btn';
        movieButton.addEventListener('click', () => handleButtonClick('MOVIE'));

        const tvshowButton = document.createElement('button');
        tvshowButton.textContent = 'TVSHOW';
        tvshowButton.className = 'filter-btn';
        tvshowButton.addEventListener('click', () => handleButtonClick('TVSHOW'));

        container.appendChild(movieButton);
        container.appendChild(tvshowButton);
        document.body.appendChild(container);
    }

function createWavveButton() {
    if (document.getElementById('filter-button-container')) return;

    const container = document.createElement('div');
    container.id = 'filter-button-container';
    // 이 컨테이너가 어떤 종류의 버튼을 담고 있는지 식별하기 위한 데이터 속성 추가
    container.dataset.type = 'wavve';

    const wavveButton = document.createElement('button');
    wavveButton.textContent = 'WAVVE';
    wavveButton.className = 'filter-btn';
    wavveButton.addEventListener('click', handleWavveButtonClick);

    container.appendChild(wavveButton);
    document.body.appendChild(container);
}

function handleTvingButtonClick() {
    const baseUrl = window.location.href.split('?')[0];

    navigator.clipboard.writeText(baseUrl).then(() => {
        showNotification(`'${baseUrl}'이(가) 저장되었습니다.`);
    }).catch(err => {
        console.error('TVING URL 복사 실패:', err);
        showNotification('복사에 실패했습니다.');
    });
}

function createTvingButton() {
    if (document.getElementById('filter-button-container')) return;

    const container = document.createElement('div');
    container.id = 'filter-button-container';
    container.dataset.type = 'tving'; // 이 컨테이너가 'tving' 타입임을 명시

    const tvingButton = document.createElement('button');
    tvingButton.textContent = 'TVING';
    tvingButton.className = 'filter-btn';
    tvingButton.addEventListener('click', handleTvingButtonClick);

container.appendChild(tvingButton);
    document.body.appendChild(container);
}

// [WATCHA] 버튼 클릭 시 실행될 함수
function handleWatchaButtonClick() {
    const baseUrl = window.location.href.split('?')[0];

    navigator.clipboard.writeText(baseUrl).then(() => {
        showNotification(`'${baseUrl}'이(가) 저장되었습니다.`);
    }).catch(err => {
        console.error('WATCHA URL 복사 실패:', err);
        showNotification('복사에 실패했습니다.');
    });
}

// [WATCHA] 버튼을 만드는 함수
function createWatchaButton() {
    if (document.getElementById('filter-button-container')) return;

    const container = document.createElement('div');
    container.id = 'filter-button-container';
    container.dataset.type = 'watcha'; // 이 컨테이너가 'watcha' 타입임을 명시

    const watchaButton = document.createElement('button');
    watchaButton.textContent = 'WATCHA';
    watchaButton.className = 'filter-btn';
    watchaButton.addEventListener('click', handleWatchaButtonClick);

    container.appendChild(watchaButton);
    document.body.appendChild(container);
}

    // --- 주기적으로 URL을 확인하여 버튼을 표시/숨김 ---
    function checkUrlAndToggleButtons() {
        const url = window.location.href;
        const container = document.getElementById('filter-button-container');
    
        const isCoupang = url.includes('coupangplay.com/titles');
        const isWavve = url.includes('wavve.com/player/vod') || url.includes('wavve.com/player/movie');
        const isTving = url.includes('tving.com/contents');
        const isWatcha = url.includes('watcha.com/contents');
    
        const requiredType = isWatcha ? 'watcha' : (isTving ? 'tving' : (isWavve ? 'wavve' : (isCoupang ? 'coupang' : 'none')));
        const currentType = container ? container.dataset.type : 'none';
    
        // 1. 필요한 버튼이 없어야 하는 경우 (어느 URL과도 일치하지 않음)
        if (requiredType === 'none') {
            if (container) {
                container.remove();
            }
            return;
        }
    
        // 2. 필요한 버튼 종류와 현재 버튼 종류가 다른 경우 (페이지 이동 포함)
        if (requiredType !== currentType) {
            if (container) {
                container.remove(); // 기존 버튼 컨테이너 삭제
            }
    
            // 필요한 종류의 새 버튼 생성
            if (requiredType === 'coupang') {
                createButtons();
            } else if (requiredType === 'wavve') {
                createWavveButton();
            } else if (requiredType === 'tving') {
                createTvingButton();
            } else if (requiredType === 'watcha') {
                createWatchaButton();
            }
        }
    }

    // 0.5초마다 URL 검사 함수를 실행
    setInterval(checkUrlAndToggleButtons, 500);

})();