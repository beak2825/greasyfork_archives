// ==UserScript==
// @name         아카라이브 만화 뷰어 모드
// @namespace    https://arca.live/
// @version      1.0
// @description  아카라이브의 이미지를 만화처럼 볼 수 있는 뷰어 모드를 추가합니다
// @author       ㅇㅇ
// @match        https://arca.live/b/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/539196/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%A7%8C%ED%99%94%20%EB%B7%B0%EC%96%B4%20%EB%AA%A8%EB%93%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/539196/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%A7%8C%ED%99%94%20%EB%B7%B0%EC%96%B4%20%EB%AA%A8%EB%93%9C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 중복 실행 방지 변수
    let isInitialized = false;    // 스타일 추가 - 아카라이브 디자인에 맞춘 개선된 GUI
    const style = document.createElement('style');
    style.textContent = `        #manga-viewer-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #1a1a1a;
            z-index: 10000;
            display: none;
            flex-direction: column;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard Variable", Pretendard, Roboto, "Noto Sans", "Segoe UI", "Malgun Gothic", "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
        }
        
        #manga-viewer-header {
            height: 60px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 20px;
            background: rgba(26, 26, 26, 0.95);
            backdrop-filter: blur(15px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            box-shadow: 0 1px 8px rgba(0, 0, 0, 0.2);
            z-index: 10001;
            position: relative;
        }
          #manga-viewer-title {
            font-size: 14px;
            font-weight: 500;
            max-width: 40%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            cursor: default;
            transition: color 0.2s;
            display: flex;
            align-items: center;
            color: #f8f9fa;
        }
        
        #manga-viewer-title.has-series {
            cursor: pointer;
        }
        
        #manga-viewer-title.has-series:hover {
            color: #4facfe;
        }
        
        #manga-viewer-title.has-series:after {
            content: "";
            display: inline-block;
            margin-left: 8px;
            border: solid #f8f9fa;
            border-width: 0 2px 2px 0;
            padding: 2px;
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
            transition: transform 0.2s, border-color 0.2s;
        }
        
        #manga-viewer-title.has-series:hover:after {
            border-color: #4facfe;
        }
        
        #manga-viewer-title.has-series.open:after {
            transform: rotate(-135deg);
            -webkit-transform: rotate(-135deg);
            margin-top: 2px;
        }
        
        #manga-viewer-counter {
            font-size: 14px;
            font-weight: 500;
            position: absolute;
            left: 50%;
            transform: translateX(-50%);
            color: #f8f9fa;
            background: rgba(0, 0, 0, 0.4);
            padding: 4px 12px;
            border-radius: 12px;
            backdrop-filter: blur(8px);
        }
        
        #manga-viewer-close {
            cursor: pointer;
            padding: 8px 16px;
            background: rgba(248, 249, 250, 0.1);
            border: 1px solid rgba(248, 249, 250, 0.2);
            border-radius: 8px;
            font-size: 12px;
            font-weight: 500;
            color: #f8f9fa;
            transition: all 0.2s ease;
            backdrop-filter: blur(8px);
        }
        
        #manga-viewer-close:hover {
            background: rgba(248, 249, 250, 0.15);
            border-color: rgba(248, 249, 250, 0.3);
            transform: translateY(-1px);
        }
          #manga-viewer-content {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            position: relative;
        }
        
        #manga-viewer-image {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            transition: transform 0.2s ease-out;
        }
          .manga-viewer-nav {
            position: absolute;
            top: 0;
            height: 100%;
            width: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s, background 0.3s;
            color: rgba(255, 255, 255, 0.8);
            font-size: 2rem;
            font-weight: bold;
        }
        
        .manga-viewer-nav:hover {
            opacity: 0.15;
            background: radial-gradient(circle at center, rgba(79, 172, 254, 0.1) 0%, transparent 70%);
        }
        
        #manga-viewer-prev {
            left: 0;
            background: linear-gradient(to right, rgba(79, 172, 254, 0.05), transparent);
        }
        
        #manga-viewer-next {
            right: 0;
            background: linear-gradient(to left, rgba(79, 172, 254, 0.05), transparent);
        }
        
        .manga-nav-hint {
            opacity: 0;
            transition: opacity 0.5s;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
        }        #manga-drawer-toggle {
            position: absolute;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, rgba(79, 172, 254, 0.9) 0%, rgba(0, 242, 254, 0.9) 100%);
            border-radius: 50%;
            cursor: pointer;
            z-index: 10002;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 20px;
            color: white;
            box-shadow: 0 4px 20px rgba(79, 172, 254, 0.4);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 2px solid rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
        }
        
        #manga-drawer-toggle:hover {
            background: linear-gradient(135deg, rgba(67, 163, 245, 0.95) 0%, rgba(0, 212, 230, 0.95) 100%);
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(79, 172, 254, 0.6);
            border-color: rgba(255, 255, 255, 0.2);
        }
        
        #manga-drawer-toggle.active {
            transform: rotate(180deg) scale(1.05);
            background: linear-gradient(135deg, rgba(255, 100, 100, 0.9) 0%, rgba(255, 50, 150, 0.9) 100%);
            box-shadow: 0 4px 20px rgba(255, 100, 100, 0.4);
        }
          #manga-drawer {
            position: fixed;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0;
            background: linear-gradient(135deg, rgba(30, 30, 50, 0.95) 0%, rgba(40, 40, 60, 0.95) 100%);
            backdrop-filter: blur(15px);
            border-top: 2px solid rgba(79, 172, 254, 0.3);
            z-index: 10001;
            overflow-y: hidden;
            transition: height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            padding: 0;
            overflow-x: auto;
            scrollbar-width: thin;
            scrollbar-color: rgba(79, 172, 254, 0.5) rgba(30, 30, 50, 0.3);
            justify-content: flex-start;
            align-items: center;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
        }
            scrollbar-width: thin;
            scrollbar-color: rgba(79, 172, 254, 0.5) rgba(30, 30, 50, 0.3);
            justify-content: flex-start;
            align-items: center;
            box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
        }
        
        #manga-drawer.active {
            height: 120px;
            padding: 10px;
        }
        
        .manga-drawer-item {
            height: calc(100% - 20px);
            min-width: auto;
            max-height: 100px;
            margin-right: 10px;
            cursor: pointer;
            border: 2px solid transparent;
            transition: border-color 0.3s;
            position: relative;
            display: flex;
            align-items: center;
        }
        
        .manga-drawer-item.active {
            border-color: #f5f5f5;
        }
        
        .manga-drawer-item:hover {
            border-color: #666;
        }
        
        .manga-drawer-img {
            height: 100%;
            width: auto;
            object-fit: contain;
            max-height: 100%;
        }
        
        .manga-drawer-number {
            position: absolute;
            bottom: 0;
            left: 0;
            background-color: rgba(0, 0, 0, 0.7);
            padding: 2px 5px;
            font-size: 10px;
        }
        
        /* 스크롤바 스타일 */
        #manga-drawer::-webkit-scrollbar {
            height: 6px;
        }
        
        #manga-drawer::-webkit-scrollbar-thumb {
            background-color: #666;
            border-radius: 3px;
        }
        
        #manga-drawer::-webkit-scrollbar-track {
            background-color: #333;
        }
        
        /* 뷰어 모드에서 불필요한 텍스트 제거 */
        body.manga-viewer-active .notification-text,
        body.manga-viewer-active #removeAllBtn,
        body.manga-viewer-active .noti-text,
        body.manga-viewer-active .article-info,
        body.manga-viewer-active .btn-text {
            display: none !important;
            visibility: hidden !important;
        }
        
        /* 뷰어 모드 안에서 보여줄 요소만 남기기 */
        body.manga-viewer-active * {
            visibility: hidden;
        }
        
        body.manga-viewer-active #manga-viewer-container,
        body.manga-viewer-active #manga-viewer-container * {
            visibility: visible;
        }
        
        /* 모바일 대응 */
        @media (max-width: 768px) {
            #manga-drawer.active {
                height: 90px;
                padding-top: 18px;
            }
            
            .manga-drawer-item {
                height: calc(100% - 20px);
                max-height: 70px;
                min-width: auto;
            }
            
            #manga-viewer-counter {
                font-size: 12px;
            }
            
            #manga-drawer-toggle {
                width: 36px;
                height: 36px;
                font-size: 16px;
                bottom: 15px;
                right: 15px;
            }
        }
          /* 시리즈 목록 스타일 */
        #manga-series-popup {
            position: absolute;
            top: 45px;
            left: 20px;
            background-color: rgba(30, 30, 30, 0.95);
            border-radius: 6px;
            padding: 15px;
            z-index: 10004;
            max-width: 85%;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
            display: none;
            min-width: 300px;
        }
        
        #manga-series-popup.active {
            display: block;
        }
        
        #manga-series-title {
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            padding-bottom: 5px;
            border-bottom: 1px solid #555;
            color: #fff;
        }
        
        .manga-series-item {
            padding: 10px;
            margin-bottom: 8px;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
            color: #ddd;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: 14px;
        }
        
        .manga-series-item:hover {
            background-color: rgba(80, 80, 80, 0.6);
        }
        
        .manga-series-item.current {
            background-color: rgba(90, 90, 150, 0.4);
            color: #fff;
            font-weight: bold;
        }
        
        #manga-viewer-title {
            cursor: default;
            transition: color 0.2s;
            display: flex;
            align-items: center;
        }
        
        #manga-viewer-title.has-series {
            cursor: pointer;
        }
        
        #manga-viewer-title.has-series:hover {
            color: #a9d7ff;
        }
        
        #manga-viewer-title.has-series:after {
            content: "";
            display: inline-block;
            margin-left: 5px;
            border: solid #fff;
            border-width: 0 2px 2px 0;
            padding: 3px;
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
            transition: transform 0.2s, border-color 0.2s;
        }
        
        #manga-viewer-title.has-series:hover:after {
            border-color: #a9d7ff;
        }
        
        #manga-viewer-title.has-series.open:after {
            transform: rotate(-135deg);
            -webkit-transform: rotate(-135deg);
            margin-top: 5px;
        }
        }
        
        #manga-viewer-title.has-series:after {
            content: "";
            display: inline-block;
            margin-left: 5px;
            border: solid #fff;
            border-width: 0 2px 2px 0;
            padding: 3px;
            transform: rotate(45deg);
            -webkit-transform: rotate(45deg);
            transition: transform 0.2s, border-color 0.2s;
        }
        
        #manga-viewer-title.has-series:hover:after {
            border-color: #a9d7ff;
        }
        
        #manga-viewer-title.has-series.open:after {
            transform: rotate(-135deg);
            -webkit-transform: rotate(-135deg);
            margin-top: 5px;
        }
        
        /* 모바일 대응 추가 */
        @media (max-width: 768px) {
            #manga-series-popup {
                max-width: 90%;
                max-height: 70vh;
            }
            
            .manga-series-item {
                padding: 10px 8px;
                font-size: 13px;
            }
            
            #manga-series-title {
                font-size: 14px;
            }
        }

        /* 키보드 이벤트 감지용 투명 입력 요소 */
        #manga-keyboard-catcher {
            position: fixed;
            top: -1000px;
            left: -1000px;
            width: 0;
            height: 0;
            opacity: 0;
            pointer-events: none;
        }

        /* 네비게이션 피드백 스타일 */
        #manga-nav-feedback {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: rgba(255, 255, 255, 0.8);
            z-index: 10005;
            pointer-events: none;
            animation: navFeedbackAnim 0.3s ease-out;
        }

        @keyframes navFeedbackAnim {
            0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
        }

        /* 키보드 단축키 도움말 스타일 */
        #manga-help-popup {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(26, 26, 26, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 12px;
            padding: 20px 30px;
            z-index: 10006;
            max-width: 400px;
            backdrop-filter: blur(15px);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
            display: none;
            color: #f8f9fa;
        }
        
        #manga-help-popup.active {
            display: block;
            animation: helpFadeIn 0.3s ease-out;
        }
        
        @keyframes helpFadeIn {
            from { opacity: 0; transform: translate(-50%, -50%) scale(0.9); }
            to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        
        #manga-help-title {
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 15px;
            text-align: center;
            color: #4facfe;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding-bottom: 10px;
        }
        
        .manga-help-section {
            margin-bottom: 15px;
        }
        
        .manga-help-section h4 {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #a9d7ff;
        }
          .manga-help-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 5px;
            font-size: 13px;
            gap: 10px;
        }
        
        .manga-help-keys {
            display: flex;
            gap: 5px;
            flex-shrink: 0;
        }
        
        .manga-help-key {
            background: rgba(79, 172, 254, 0.2);
            border: 1px solid rgba(79, 172, 254, 0.3);
            border-radius: 4px;
            padding: 2px 8px;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            color: #4facfe;
            min-width: 24px;
            text-align: center;
            flex-shrink: 0;
        }
        
        .manga-help-desc {
            color: #d0d0d0;
            margin-left: 15px;
            flex: 1;
        }
        
        #manga-help-close {
            position: absolute;
            top: 10px;
            right: 15px;
            background: none;
            border: none;
            color: #999;
            font-size: 20px;
            cursor: pointer;
            padding: 5px;
            transition: color 0.2s;
        }
        
        #manga-help-close:hover {
            color: #f8f9fa;
        }

        // ...existing code...
    `;
    document.head.appendChild(style);

    // 현재 보고 있는 이미지 인덱스와 이미지 배열
    let currentImageIndex = 0;
    let images = [];
    let viewerActive = false;
    let drawerActive = false;
    let drawerHeight = 120; // 기본 서랍 높이
    let articleTitle = ''; // 글 제목 저장용 변수
    let seriesItems = []; // 시리즈 아이템 저장용
    let seriesPopupOpen = false; // 시리즈 팝업 상태
    let hasSeries = false; // 시리즈 존재 여부 확인 변수
    let autoOpenFromSeries = false; // 시리즈 링크를 통해 진입했는지 확인하는 플래그
    let isDrawerLoading = false; // 서랍 로딩 상태
    let drawerImagesLoaded = {}; // 이미지 로딩 상태 추적

    // 마지막으로 본 페이지 정보 저장용 키 생성
    function getStorageKey() {
        const path = window.location.pathname;
        return `arcalive_manga_viewer_${path}`;
    }

    // 뷰어 상태 저장
    function saveViewerState() {
        // 유효성 검사 추가
        const validIndex = typeof currentImageIndex === 'number' && !isNaN(currentImageIndex) &&
            currentImageIndex >= 0 && currentImageIndex < images.length ?
            currentImageIndex : 0;

        GM_setValue(getStorageKey(), {
            index: validIndex,
            drawerHeight: drawerHeight,
            title: articleTitle
        });
    }

    // 뷰어 상태 로드 - 안정성 추가
    function loadViewerState() {
        try {
            const savedState = GM_getValue(getStorageKey());
            return savedState && typeof savedState === 'object' ?
                savedState : { index: 0, drawerHeight: 120, title: '' };
        } catch (e) {
            console.log("상태 로드 오류:", e);
            return { index: 0, drawerHeight: 120, title: '' };
        }
    }

    // 아카라이브 게시물인지 확인
    function isArticlePage() {
        return location.pathname.includes('/b/') && location.pathname.split('/').length >= 4;
    }

    // 뷰어 요소 생성
    function createViewerElements() {
        // 이미 존재하는 뷰어 컨테이너 확인
        if (document.getElementById('manga-viewer-container')) {
            return;
        }

        const container = document.createElement('div');
        container.id = 'manga-viewer-container';

        container.innerHTML = `
            <div id="manga-viewer-header">
                <div id="manga-viewer-title"></div>
                <div id="manga-viewer-counter"></div>
                <div id="manga-viewer-close">닫기 (ESC)</div>
                <div id="manga-series-popup">
                    <div id="manga-series-title">시리즈</div>
                    <div id="manga-series-list"></div>
                </div>
            </div>
            <div id="manga-viewer-content">
                <img id="manga-viewer-image" src="" alt="만화 이미지">
                <div id="manga-viewer-prev" class="manga-viewer-nav">
                    <div id="manga-nav-prev-hint" class="manga-nav-hint">&lt;</div>
                </div>
                <div id="manga-viewer-next" class="manga-viewer-nav">
                    <div id="manga-nav-next-hint" class="manga-nav-hint">&gt;</div>
                </div>
                <div id="manga-drawer-toggle">≡</div>
                <div id="manga-drawer"></div>
                <input type="text" id="manga-keyboard-catcher" autocomplete="off">
            </div>
        `;

        document.body.appendChild(container);

        // 이벤트 리스너 추가
        document.getElementById('manga-viewer-close').addEventListener('click', closeViewer);
        document.getElementById('manga-viewer-prev').addEventListener('click', prevImage);
        document.getElementById('manga-viewer-next').addEventListener('click', nextImage);
        document.getElementById('manga-viewer-image').addEventListener('wheel', handleZoom);
        document.getElementById('manga-drawer-toggle').addEventListener('click', toggleDrawer);

        // 시리즈 팝업 기능 이벤트 추가 - 시리즈가 있을 때만 활성화됨
        document.getElementById('manga-viewer-title').addEventListener('click', toggleSeriesPopup);        // 키보드 이벤트용 숨겨진 입력 요소 설정
        const keyboardCatcher = document.getElementById('manga-keyboard-catcher');
        keyboardCatcher.addEventListener('keydown', handleKeyDown);

        // 전역 키보드 이벤트 캡처 (뷰어 활성화 시 모든 키보드 입력을 우선 처리)
        document.addEventListener('keydown', handleGlobalKeyDown, true); // capture phase
        document.addEventListener('keyup', handleGlobalKeyUp, true); // capture phase

        // 시리즈 팝업 외부 클릭시 닫기
        document.addEventListener('click', function (event) {
            const seriesPopup = document.getElementById('manga-series-popup');
            const viewerTitle = document.getElementById('manga-viewer-title');

            if (seriesPopupOpen &&
                !seriesPopup.contains(event.target) &&
                event.target !== viewerTitle) {
                closeSeriesPopup();
            }
        });
    }

    // 키보드 포커스 강제 적용 함수
    function focusKeyboardCatcher() {
        const keyboardCatcher = document.getElementById('manga-keyboard-catcher');
        if (keyboardCatcher) {
            keyboardCatcher.focus();

            // 포커스가 제대로 적용되도록 쓰레드 분리
            setTimeout(() => {
                keyboardCatcher.focus();
            }, 100);
        }
    }

    // 시리즈 목록 토글
    function toggleSeriesPopup(event) {
        // 시리즈가 없으면 동작하지 않음
        if (!hasSeries) return;

        event.stopPropagation();

        const seriesPopup = document.getElementById('manga-series-popup');
        const viewerTitle = document.getElementById('manga-viewer-title');

        if (seriesPopupOpen) {
            closeSeriesPopup();
        } else {
            // 시리즈 목록이 없으면 가져오기 시도
            if (seriesItems.length === 0) {
                fetchSeriesItems();
            }

            seriesPopupOpen = true;
            seriesPopup.classList.add('active');
            viewerTitle.classList.add('open');
        }
    }

    // 시리즈 팝업 닫기
    function closeSeriesPopup() {
        const seriesPopup = document.getElementById('manga-series-popup');
        const viewerTitle = document.getElementById('manga-viewer-title');

        seriesPopupOpen = false;
        seriesPopup.classList.remove('active');
        viewerTitle.classList.remove('open');

        // 팝업 닫을 때 키보드 캐처에 포커스
        focusKeyboardCatcher();
    }

    // 시리즈 목록 가져오기 - HTML 구조에 맞게 완전히 개선된 버전
    function fetchSeriesItems() {
        // 현재 페이지에서 시리즈 정보 추출 - 두 가지 구조 모두 확인
        const seriesElement = document.querySelector('.article-series') || document.querySelector('.article-series.extend');
        if (!seriesElement) {
            hasSeries = false;
            document.getElementById('manga-viewer-title').classList.remove('has-series');
            return;
        }

        hasSeries = true;
        document.getElementById('manga-viewer-title').classList.add('has-series');

        // 시리즈 제목 설정
        const seriesNameElement = seriesElement.querySelector('.series-name');
        let seriesTitle = '시리즈';

        if (seriesNameElement) {
            seriesTitle = seriesNameElement.textContent.trim();
        } else {
            // 시리즈 이름 요소가 없는 경우, 첫 번째 항목의 공통 부분을 추출
            const firstSeriesItem = seriesElement.querySelector('.series-link a');
            if (firstSeriesItem) {
                const text = firstSeriesItem.textContent.trim();
                const match = text.match(/^(\d+)\.\s+(.+?)\s+Chapter/i);
                if (match && match[2]) {
                    seriesTitle = match[2].trim();
                }
            }
        }

        document.getElementById('manga-series-title').textContent = seriesTitle;

        // 시리즈 항목들 가져오기 - 두 가지 가능한 선택자를 모두 검사
        let seriesLinks = Array.from(seriesElement.querySelectorAll('.series-link a'));

        if (!seriesLinks || seriesLinks.length === 0) {
            seriesLinks = Array.from(seriesElement.querySelectorAll('.vrow'));
        }

        if (!seriesLinks || seriesLinks.length === 0) return;

        // 현재 경로를 가져와서 현재 페이지를 찾기 위해 사용
        const currentPath = window.location.pathname;

        // 시리즈 정보 정리
        seriesItems = seriesLinks.map(item => {
            let link, title, isCurrent;

            if (item.tagName.toLowerCase() === 'a') {
                // series-link > a 타입인 경우
                link = item.getAttribute('href');
                title = item.textContent.trim().replace(/^\s*\d+\.\s*/, ''); // 앞의 번호와 점 제거
                isCurrent = link === currentPath || link === window.location.href;
            } else {
                // vrow 타입인 경우
                link = item.getAttribute('href');
                title = item.textContent.trim().replace(/^\s*\d+\s*/, ''); // 앞의 번호 제거
                isCurrent = item.classList.contains('active');
            }

            // 현재 URL과 비교해서 현재 페이지 여부 추가 확인
            if (!isCurrent && link) {
                isCurrent = currentPath === link || currentPath.endsWith(link);
            }

            return { link, title, isCurrent };
        });

        // 시리즈 목록 UI 생성
        createSeriesList();

        // 로그로 확인
        console.log("시리즈 항목 추출 완료:", seriesItems);
    }

    // 시리즈 목록 UI 생성
    function createSeriesList() {
        const seriesList = document.getElementById('manga-series-list');
        seriesList.innerHTML = '';

        seriesItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'manga-series-item';
            if (item.isCurrent) {
                itemElement.classList.add('current');
            }

            itemElement.textContent = item.title;

            // 클릭 이벤트 - 새로운 시리즈 아이템으로 이동 시 자동 열기 파라미터 추가
            // 단, 첫 페이지부터 보기 위한 파라미터로 수정
            itemElement.addEventListener('click', function () {
                // 첫 페이지부터 보기 위한 파라미터로 수정 (이어서보기가 아닌 첫페이지부터)
                const url = new URL(item.link, window.location.origin);
                url.searchParams.set('manga_viewer_open', '1');
                window.location.href = url.toString();
            });

            seriesList.appendChild(itemElement);
        });
    }    // 이미지 서랍 토글 - 지연 로딩 최적화 버전
    function toggleDrawer() {
        const drawer = document.getElementById('manga-drawer');
        const drawerToggle = document.getElementById('manga-drawer-toggle');

        // 로딩 중이면 중복 실행 방지
        if (isDrawerLoading) return;

        drawerActive = !drawerActive;

        // 성능 통계 업데이트
        updatePerformanceStats('drawer');

        if (drawerActive) {
            // 로딩 상태로 설정
            isDrawerLoading = true;

            drawer.classList.add('active');
            drawerToggle.classList.add('active');
            drawer.style.height = `${drawerHeight}px`;

            // 서랍이 활성화될 때만 이미지 미리보기 로드 (최적화)
            loadDrawerPreviews();

            // 로딩 완료 후 액션
            setTimeout(() => {
                // 현재 이미지가 서랍의 중앙에 오도록 스크롤
                scrollToCurrentPage(true);
                isDrawerLoading = false; // 로딩 상태 해제
            }, 100);
        } else {
            drawer.classList.remove('active');
            drawerToggle.classList.remove('active');
            drawer.style.height = '0';

            // 로딩 상태 해제
            isDrawerLoading = false;
        }

        // 서랍이 활성화되면 토글 버튼 위치 조정
        updateDrawerTogglePosition();

        // 서랍 토글 시 키보드 포커스 복원
        focusKeyboardCatcher();
    }// 서랍 미리보기 이미지 로드 최적화 함수
    function loadDrawerPreviews() {
        const drawer = document.getElementById('manga-drawer');
        const drawerItems = drawer.querySelectorAll('.manga-drawer-item');

        // 현재 표시되는 아이템만 이미지 로드
        drawerItems.forEach((item, index) => {
            const img = item.querySelector('img');
            if (img && !drawerImagesLoaded[index]) {
                // 현재 이미지 주변의 이미지만 로드 (±10)
                if (Math.abs(index - currentImageIndex) < 10) {
                    img.src = images[index];
                    drawerImagesLoaded[index] = true;
                }
            }
        });

        // 현재 스크롤 위치 주변 이미지 지연 로드
        setTimeout(() => {
            const visibleStart = Math.max(0, currentImageIndex - 20);
            const visibleEnd = Math.min(images.length - 1, currentImageIndex + 20);

            for (let i = visibleStart; i <= visibleEnd; i++) {
                if (!drawerImagesLoaded[i]) {
                    const img = drawerItems[i]?.querySelector('img');
                    if (img) {
                        img.src = images[i];
                        drawerImagesLoaded[i] = true;
                    }
                }
            }
        }, 500);
    }    // 서랍 토글 버튼 위치 업데이트
    function updateDrawerTogglePosition() {
        const drawerToggle = document.getElementById('manga-drawer-toggle');
        const drawer = document.getElementById('manga-drawer');

        if (drawerActive) {
            // 서랍이 열렸을 때는 서랍 위에 위치 (간격 유지)
            const drawerHeight = parseInt(drawer.style.height) || 120;
            drawerToggle.style.bottom = `${drawerHeight + 20}px`;
        } else {
            // 서랍이 닫혔을 때는 기본 위치
            drawerToggle.style.bottom = '20px';
        }
    }// 서랍 아이템 높이 업데이트
    function updateDrawerItemsHeight() {
        const items = document.querySelectorAll('.manga-drawer-item');
        const drawer = document.getElementById('manga-drawer');
        const drawerHeight = drawer.clientHeight;

        // 패딩 고려
        const itemHeight = Math.min(100, drawerHeight - 30);

        items.forEach(item => {
            item.style.height = `${itemHeight}px`;
        });
    }// 현재 페이지가 가운데 오도록 스크롤 - 개선된 버전
    function scrollToCurrentPage(smooth = false) {
        const activeItem = document.querySelector('.manga-drawer-item.active');
        const drawer = document.getElementById('manga-drawer');

        if (!activeItem || !drawer || !drawer.classList.contains('active')) return;

        // requestAnimationFrame을 이용한 더 부드러운 스크롤
        requestAnimationFrame(() => {
            // 서랍의 너비와 스크롤 위치 계산
            const drawerWidth = drawer.clientWidth;
            const itemRect = activeItem.getBoundingClientRect();

            // 아이템 위치 계산 (중앙에 오도록) - 성능 최적화
            const itemLeft = activeItem.offsetLeft;
            const scrollLeft = itemLeft - (drawerWidth / 2) + (itemRect.width / 2);

            // 스크롤 적용
            drawer.scrollTo({
                left: scrollLeft,
                behavior: smooth ? 'smooth' : 'auto'
            });
        });
    }

    // 뷰어 버튼 추가
    function addViewerButton() {
        // article-link 요소 내부에 버튼 추가
        const articleLinkContainer = document.querySelector('.article-link');
        if (!articleLinkContainer) return;

        // 이미 버튼이 추가되었는지 확인
        if (document.getElementById('manga-viewer-button') || document.getElementById('manga-viewer-continue')) {
            return;
        }

        // 만화모드 버튼 생성
        const viewerButton = document.createElement('button');
        viewerButton.id = 'manga-viewer-button';
        viewerButton.className = 'btn btn-arca btn-sm';
        viewerButton.textContent = '만화모드';
        viewerButton.addEventListener('click', openViewer);

        // 이어서보기 버튼 생성
        const continueButton = document.createElement('button');
        continueButton.id = 'manga-viewer-continue';
        continueButton.className = 'btn btn-arca btn-sm';
        continueButton.textContent = '이어서보기';
        continueButton.addEventListener('click', continueViewing);

        // 마지막으로 본 페이지가 없으면 이어서보기 버튼 비활성화
        const savedState = loadViewerState();
        if (!savedState || savedState.index === undefined) {
            continueButton.disabled = true;
            continueButton.style.opacity = '0.5';
            continueButton.title = '이전에 본 기록이 없습니다';
        } else {
            continueButton.title = `마지막으로 본 페이지: ${savedState.index + 1}`;
        }

        // 버튼들을 article-link 요소 내부의 첫 번째 위치에 삽입
        articleLinkContainer.insertBefore(continueButton, articleLinkContainer.firstChild);
        articleLinkContainer.insertBefore(viewerButton, articleLinkContainer.firstChild);        // 기존 아카라이브 스타일로 버튼 스타일 조정
        const additionalStyle = document.createElement('style');
        additionalStyle.textContent = `
            #manga-viewer-button, #manga-viewer-continue {
                margin-right: 8px;
                margin-left: 0;
            }
            
            #manga-viewer-continue:disabled {
                opacity: 0.5;
                cursor: not-allowed;
            }
            
            .article-link {
                display: flex;
                align-items: center;
            }
            .article-link a {
                margin-left: auto;
            }
        `;
        document.head.appendChild(additionalStyle);
    }

    // 이미지 수집
    function collectImages() {
        const articleContent = document.querySelector('.article-content');
        if (!articleContent) return [];

        // 본문의 모든 이미지 수집
        return Array.from(articleContent.querySelectorAll('img:not(.emoticon)'))
            .filter(img => {
                // 이모티콘 등의 작은 이미지 제외
                const rect = img.getBoundingClientRect();
                return rect.width > 100 || rect.height > 100;
            })
            .map(img => img.src);
    }

    // 게시물 제목 가져오기
    function getArticleTitle() {
        // 게시물 제목 요소 선택
        const titleElement = document.querySelector('.article-head .title');

        // 제목 요소가 있으면 내용을 반환, 없으면 기본값 반환
        return titleElement ? titleElement.textContent.trim() : '만화 뷰어';
    }    // 이미지 서랍 생성 (성능 최적화 버전)
    function createImageDrawer() {
        const startTime = performance.now();
        const drawer = document.getElementById('manga-drawer');

        // 기존 항목 모두 제거
        while (drawer.firstChild) {
            drawer.removeChild(drawer.firstChild);
        }

        // IntersectionObserver 초기화
        initLazyLoading();

        // 각 이미지에 대한 미리보기 추가 (지연 로딩 적용)
        images.forEach((src, index) => {
            const item = document.createElement('div');
            item.className = 'manga-drawer-item';
            if (index === currentImageIndex) {
                item.classList.add('active');
            }

            const img = document.createElement('img');
            img.className = 'manga-drawer-img';
            img.alt = `Image ${index + 1}`;

            // 현재 이미지와 주변 5개 이미지만 즉시 로드, 나머지는 지연 로딩
            if (Math.abs(index - currentImageIndex) <= 5) {
                img.src = src;
                loadedImages.add(src);
            } else {
                img.dataset.src = src;
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB2aWV3Qm94PSIwIDAgMSAxIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMzMzMiLz48L3N2Zz4=';
                if (drawerObserver) {
                    drawerObserver.observe(img);
                }
            }

            const number = document.createElement('div');
            number.className = 'manga-drawer-number';
            number.textContent = index + 1;

            item.appendChild(img);
            item.appendChild(number);

            // 클릭 시 해당 이미지로 이동
            item.addEventListener('click', () => {
                currentImageIndex = index;
                updateViewer();
            });

            drawer.appendChild(item);
        });

        // 열린 상태에서는 아이템 높이 조정
        if (drawerActive) {
            updateDrawerItemsHeight();
        }

        // 성능 로그
        performanceLog('서랍 생성', startTime);

        // 메모리 정리
        cleanupImageCache();
    }

    // 이어서보기 기능
    function continueViewing() {
        const savedState = loadViewerState();
        if (!savedState || savedState.index === undefined) {
            alert('이전에 본 기록이 없습니다.');
            return;
        }

        images = collectImages();
        if (images.length === 0) {
            alert('표시할 이미지가 없습니다.');
            return;
        }

        // 저장된 인덱스 또는 첫 페이지로 설정
        currentImageIndex = (savedState.index >= 0 && savedState.index < images.length) ?
            savedState.index : 0;

        // 저장된 서랍 높이 복원
        if (savedState.drawerHeight) {
            drawerHeight = savedState.drawerHeight;
        }

        // 저장된 제목 복원 또는 현재 제목 가져오기
        articleTitle = savedState.title || getArticleTitle();

        const container = document.getElementById('manga-viewer-container');
        container.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 스크롤 방지

        // 제목 설정
        document.getElementById('manga-viewer-title').textContent = articleTitle;

        // 이미지 서랍 생성
        createImageDrawer();

        // 네비게이션 힌트 표시
        showNavigationHints();

        updateViewer();

        viewerActive = true;

        // 전역 키보드 이벤트를 추가하는 방식을 변경
        window.addEventListener('keydown', handleKeyDown);

        // 뷰어 활성화 시 body에 클래스 추가
        document.body.classList.add('manga-viewer-active');

        // 서랍 핸들 위치 업데이트
        const drawerHandle = document.getElementById('manga-drawer-handle');
        if (drawerHandle) {
            if (drawerActive) {
                drawerHandle.style.bottom = `${drawerHeight}px`;
            } else {
                drawerHandle.style.bottom = "0px";
            }
        }

        // 제목 요소 초기 상태 설정
        const viewerTitle = document.getElementById('manga-viewer-title');
        if (viewerTitle) {
            viewerTitle.classList.remove('has-series');
            viewerTitle.classList.remove('open');
        }

        // 시리즈 정보 확인 - DOM에서 직접 검색
        setTimeout(() => {
            fetchSeriesItems();
        }, 200); // DOM이 완전히 준비된 후 실행하기 위해 약간의 지연 추가
    }

    // 뷰어 열기
    function openViewer() {
        images = collectImages();
        if (images.length === 0) {
            alert('표시할 이미지가 없습니다.');
            return;
        }

        // 시리즈 정보 초기화
        seriesItems = [];
        seriesPopupOpen = false;
        hasSeries = false;

        // 제목 요소 초기 상태 설정
        const viewerTitle = document.getElementById('manga-viewer-title');
        if (viewerTitle) {
            viewerTitle.classList.remove('has-series');
            viewerTitle.classList.remove('open');
        }

        // 저장된 상태 불러오기
        const savedState = loadViewerState();

        // 이전에 저장된 서랍 높이 복원
        if (savedState && savedState.drawerHeight) {
            drawerHeight = savedState.drawerHeight;
        }

        currentImageIndex = 0;

        // 현재 게시물 제목 가져오기
        articleTitle = getArticleTitle();

        const container = document.getElementById('manga-viewer-container');
        container.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // 스크롤 방지

        // 제목 설정
        document.getElementById('manga-viewer-title').textContent = articleTitle;

        // 이미지 서랍 생성
        createImageDrawer();

        // 네비게이션 힌트 요소 보였다가 숨기기
        showNavigationHints();

        updateViewer();

        viewerActive = true;

        // 전역 키보드 이벤트를 추가하는 방식을 변경
        window.addEventListener('keydown', handleKeyDown);

        // 뷰어 활성화 시 body에 클래스 추가
        document.body.classList.add('manga-viewer-active');

        // 서랍 핸들 위치 업데이트
        const drawerHandle = document.getElementById('manga-drawer-handle');
        if (drawerHandle) {
            if (drawerActive) {
                drawerHandle.style.bottom = `${drawerHeight}px`;
            } else {
                drawerHandle.style.bottom = "0px";
            }
        }

        // 시리즈 정보 확인 - DOM에서 직접 검색
        setTimeout(() => {
            fetchSeriesItems();
        }, 200); // DOM이 완전히 준비된 후 실행하기 위해 약간의 지연 추가
    }

    // 네비게이션 힌트 표시 후 숨기기
    function showNavigationHints() {
        const prevHint = document.getElementById('manga-nav-prev-hint');
        const nextHint = document.getElementById('manga-nav-next-hint');

        prevHint.style.opacity = '1';
        nextHint.style.opacity = '1';

        setTimeout(() => {
            prevHint.style.opacity = '0';
            nextHint.style.opacity = '0';

            // 트랜지션 추가
            prevHint.style.transition = 'opacity 0.5s';
            nextHint.style.transition = 'opacity 0.5s';
        }, 1500);
    }

    // 네비게이션 피드백 표시
    function showNavigationFeedback(direction) {
        const existingFeedback = document.getElementById('manga-nav-feedback');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        const feedback = document.createElement('div');
        feedback.id = 'manga-nav-feedback';
        feedback.textContent = direction === 'prev' ? '◀' : '▶';
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: ${direction === 'prev' ? '20%' : '80%'};
            transform: translate(-50%, -50%);
            font-size: 3rem;
            color: rgba(255, 255, 255, 0.8);
            z-index: 10005;
            pointer-events: none;
            animation: navFeedbackAnim 0.3s ease-out;
        `;

        // 애니메이션 CSS 추가 (한 번만)
        if (!document.getElementById('nav-feedback-style')) {
            const style = document.createElement('style');
            style.id = 'nav-feedback-style';
            style.textContent = `
                @keyframes navFeedbackAnim {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
                    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(feedback);

        // 300ms 후 제거
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.remove();
            }
        }, 300);
    }    // 뷰어 닫기
    function closeViewer() {
        // 현재 상태 저장
        saveViewerState();

        // 이어서보기 버튼 업데이트
        const continueButton = document.getElementById('manga-viewer-continue');
        if (continueButton) {
            continueButton.disabled = false;
            continueButton.style.opacity = '1';
            continueButton.title = `마지막으로 본 페이지: ${currentImageIndex + 1}`;
        }

        const container = document.getElementById('manga-viewer-container');
        container.style.display = 'none';
        document.body.style.overflow = ''; // 스크롤 복원
        viewerActive = false;
        drawerActive = false;

        // 서랍 토글 버튼 위치 초기화
        const drawerToggle = document.getElementById('manga-drawer-toggle');
        if (drawerToggle) {
            drawerToggle.style.bottom = '20px';
        }

        // 전역 키보드 이벤트 제거
        document.removeEventListener('keydown', handleGlobalKeyDown, true);
        document.removeEventListener('keyup', handleGlobalKeyUp, true);
        window.removeEventListener('keydown', handleKeyDown);

        // 도움말 팝업이 열려있으면 닫기
        hideHelpPopup();

        // body에서 뷰어 활성화 클래스 제거
        document.body.classList.remove('manga-viewer-active');

        // 서랍 핸들 위치 초기화
        const drawerHandle = document.getElementById('manga-drawer-handle');
        if (drawerHandle) {
            drawerHandle.style.bottom = "0px";
        }
    }

    // 이전 이미지로 이동
    function prevImage() {
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateViewer();
        }
    }

    // 다음 이미지로 이동
    function nextImage() {
        if (currentImageIndex < images.length - 1) {
            currentImageIndex++;
            updateViewer();
        }
    }    // 이미지 프리로딩 및 캐싱 시스템
    let imageCache = new Map();
    let preloadQueue = [];
    let isPreloading = false;

    // 이미지 프리로드 함수
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            if (imageCache.has(src)) {
                resolve(imageCache.get(src));
                return;
            }

            const img = new Image();
            img.onload = () => {
                imageCache.set(src, img);
                resolve(img);
            };
            img.onerror = reject;
            img.src = src;
        });
    }

    // 주변 이미지들을 백그라운드에서 프리로드
    function preloadAdjacentImages(centerIndex, radius = 3) {
        if (isPreloading) return;
        isPreloading = true;

        const startIndex = Math.max(0, centerIndex - radius);
        const endIndex = Math.min(images.length - 1, centerIndex + radius);

        // 프리로드 큐 생성 (현재 이미지 제외)
        preloadQueue = [];
        for (let i = startIndex; i <= endIndex; i++) {
            if (i !== centerIndex && !imageCache.has(images[i])) {
                preloadQueue.push(images[i]);
            }
        }

        // 순차적으로 프리로드 (브라우저 부담 최소화)
        processPreloadQueue();
    }

    function processPreloadQueue() {
        if (preloadQueue.length === 0) {
            isPreloading = false;
            return;
        }

        const imageSrc = preloadQueue.shift();
        preloadImage(imageSrc)
            .then(() => {
                // 100ms 간격으로 다음 이미지 프리로드
                setTimeout(() => processPreloadQueue(), 100);
            })
            .catch(() => {
                // 에러 시 다음 이미지로 진행
                setTimeout(() => processPreloadQueue(), 100);
            });
    }

    // 뷰어 업데이트 (성능 최적화 버전)
    function updateViewer() {
        const img = document.getElementById('manga-viewer-image');
        const currentImageSrc = images[currentImageIndex];

        // 캐시된 이미지가 있으면 즉시 표시, 없으면 로드
        if (imageCache.has(currentImageSrc)) {
            img.src = currentImageSrc;
        } else {
            // 로딩 인디케이터 표시
            showLoadingIndicator();

            preloadImage(currentImageSrc)
                .then(() => {
                    img.src = currentImageSrc;
                    hideLoadingIndicator();
                })
                .catch(() => {
                    hideLoadingIndicator();
                    console.error('이미지 로드 실패:', currentImageSrc);
                });
        }

        img.style.transform = 'scale(1)'; // 이미지 변경 시 줌 리셋
        currentScale = 1;

        // 카운터 업데이트
        document.getElementById('manga-viewer-counter').textContent =
            `${currentImageIndex + 1} / ${images.length}`;

        // 주변 이미지 프리로드 시작
        preloadAdjacentImages(currentImageIndex);

        // 이미지 서랍 활성 항목 업데이트
        updateDrawerActiveItem();

        // 상태 저장 (디바운싱)
        clearTimeout(saveStateTimeout);
        saveStateTimeout = setTimeout(saveViewerState, 1000);
    }

    let saveStateTimeout = null;

    // 로딩 인디케이터 관련 함수들
    function showLoadingIndicator() {
        let indicator = document.getElementById('manga-loading-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'manga-loading-indicator';
            indicator.innerHTML = '로딩 중...';
            indicator.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 5px;
                z-index: 10003;
                font-size: 14px;
            `;
            document.getElementById('manga-viewer-content').appendChild(indicator);
        }
        indicator.style.display = 'block';
    }

    function hideLoadingIndicator() {
        const indicator = document.getElementById('manga-loading-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    // 서랍 활성 항목 업데이트 (별도 함수로 분리하여 성능 최적화)
    function updateDrawerActiveItem() {
        const drawerItems = document.querySelectorAll('.manga-drawer-item');

        // 서랍에 아이템이 없으면 작업 건너뛰기
        if (drawerItems.length === 0) return;

        drawerItems.forEach((item, index) => {
            if (index === currentImageIndex) {
                item.classList.add('active');

                // 서랍이 활성화된 경우에만 스크롤
                if (drawerActive) {
                    // 페이지 변경 시 현재 이미지가 중앙에 오도록 스크롤
                    scrollToCurrentPage(true);
                }
            } else {
                item.classList.remove('active');
            }
        });
    }    // 전역 키보드 이벤트 핸들러 - 뷰어 활성화 시 사이트 기본 키보드 동작 차단
    function handleGlobalKeyDown(e) {
        // 뷰어가 비활성화되어 있으면 기본 동작 허용
        if (!viewerActive) return;

        // 입력 필드나 편집 가능한 요소에서는 뷰어 키보드 처리 건너뛰기
        const activeElement = document.activeElement;
        const isEditableElement = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true' ||
            activeElement.isContentEditable
        );

        if (isEditableElement) return;

        // 뷰어에서 처리하는 키들 정의
        const viewerKeys = [
            'arrowleft', 'arrowright', 'arrowup', 'arrowdown',
            'a', 'd', 'w', 's', 'q', 'f', 'r', 'h',
            'home', 'end', 'pageup', 'pagedown',
            'escape', 'tab', ' '
        ];

        const keyLower = e.key.toLowerCase();

        // 뷰어가 처리하는 키인 경우 기본 동작과 전파를 차단
        if (viewerKeys.includes(keyLower)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // 뷰어 키보드 핸들러로 이벤트 전달
            handleKeyDown(e);
            return false;
        }

        // Ctrl 조합키 차단 (F11 제외)
        if (e.ctrlKey && e.key !== 'F11') {
            const ctrlKeys = ['a', 'c', 'v', 'x', 'z', 'y', 'f', 's'];
            if (ctrlKeys.includes(keyLower)) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                return false;
            }
        }
    }

    // 전역 키업 이벤트 핸들러
    function handleGlobalKeyUp(e) {
        if (!viewerActive) return;

        const activeElement = document.activeElement;
        const isEditableElement = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true' ||
            activeElement.isContentEditable
        );

        if (isEditableElement) return;

        // 뷰어 키들에 대해서는 keyup도 차단
        const viewerKeys = [
            'arrowleft', 'arrowright', 'arrowup', 'arrowdown',
            'a', 'd', 'w', 's', 'q', 'f', 'r', 'h',
            'home', 'end', 'pageup', 'pagedown',
            'escape', 'tab', ' '
        ];

        const keyLower = e.key.toLowerCase();

        if (viewerKeys.includes(keyLower)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            return false;
        }
    }

    // 키보드 이벤트 처리 최적화
    let keyPressTimeout = null;
    let lastKeyPressTime = 0;
    const KEY_DEBOUNCE_DELAY = 30; // 30ms 디바운싱으로 더 반응성 개선
    let keyRepeatInterval = null; function handleKeyDown(e) {
        // 뷰어가 활성화되어 있을 때만 처리
        if (!viewerActive) return;

        const currentTime = Date.now();

        // 키 입력이 너무 빠르게 연속으로 들어오는 것을 방지 (단, 화살표 키는 예외)
        const isNavigationKey = ['arrowleft', 'arrowright', 'a', 'd'].includes(e.key.toLowerCase());
        if (!isNavigationKey && currentTime - lastKeyPressTime < KEY_DEBOUNCE_DELAY) {
            return;
        }

        lastKeyPressTime = currentTime;

        // 입력 필드에서 키를 누른 경우 무시 (보안 강화)
        const activeElement = document.activeElement;
        const isEditableElement = activeElement && (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA' ||
            activeElement.contentEditable === 'true' ||
            activeElement.isContentEditable
        );

        if (isEditableElement) return;

        // 모든 뷰어 키에 대해 기본 동작 차단
        const viewerKeys = [
            'arrowleft', 'arrowright', 'arrowup', 'arrowdown',
            'a', 'd', 'w', 's', 'q', 'f', 'r', 'h',
            'home', 'end', 'pageup', 'pagedown',
            'escape', 'tab', ' '
        ];

        const keyLower = e.key.toLowerCase();

        if (viewerKeys.includes(keyLower)) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
        }

        // 시리즈 팝업이 열려있으면 특정 키만 처리
        if (seriesPopupOpen) {
            if (e.key === 'Escape') {
                closeSeriesPopup();
                e.preventDefault();
            }
            return;
        }

        switch (keyLower) {
            case 'arrowleft':
            case 'a':
                // 이전 페이지로 이동 (향상된 반응성)
                if (currentImageIndex > 0) {
                    prevImage();
                    showNavigationFeedback('prev');
                }
                break;
            case 'arrowright':
            case 'd':
                // 다음 페이지로 이동 (향상된 반응성)
                if (currentImageIndex < images.length - 1) {
                    nextImage();
                    showNavigationFeedback('next');
                }
                break;
            case 'w':
            case 'pageup':
                prevImage();
                break;
            case 's':
            case 'pagedown':
            case ' ': // 스페이스바로도 다음 이미지
                nextImage();
                break;
            case 'arrowup':
                // 위쪽 화살표로 첫 번째 이미지로 이동
                if (currentImageIndex > 0) {
                    currentImageIndex = 0;
                    updateViewer();
                }
                break;
            case 'arrowdown':
                // 아래쪽 화살표로 마지막 이미지로 이동
                if (currentImageIndex < images.length - 1) {
                    currentImageIndex = images.length - 1;
                    updateViewer();
                }
                break;
            case 'home':
                // Home 키로 첫 번째 이미지
                if (currentImageIndex > 0) {
                    currentImageIndex = 0;
                    updateViewer();
                }
                break;
            case 'end':
                // End 키로 마지막 이미지
                if (currentImageIndex < images.length - 1) {
                    currentImageIndex = images.length - 1;
                    updateViewer();
                }
                break;
            case 'escape':
                // 시리즈 팝업이 열려있으면 팝업만 닫기
                if (seriesPopupOpen) {
                    closeSeriesPopup();
                } else {
                    closeViewer();
                }
                break;
            case 'q':
            case 'tab':
                toggleDrawer();
                break;
            case 'f':
                // F키로 전체화면 토글
                toggleFullscreen();
                break;
            case 'r':
                // R키로 이미지 새로고침
                refreshCurrentImage();
                break;
            case 'h':
                // H키로 도움말 표시
                showHelpPopup();
                break;
        }

        // 성능 통계 업데이트
        updatePerformanceStats('keypress');
    }

    // 전체화면 토글 기능
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`전체화면 전환 실패: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }    // 현재 이미지 새로고침
    function refreshCurrentImage() {
        if (images.length > 0 && currentImageIndex >= 0 && currentImageIndex < images.length) {
            const img = document.getElementById('manga-viewer-image');
            const currentSrc = img.src;
            img.src = '';
            setTimeout(() => {
                img.src = currentSrc + '?refresh=' + Date.now();
            }, 100);
        }
    }

    // 도움말 팝업 표시/숨기기
    function showHelpPopup() {
        // 기존 도움말 팝업이 있으면 제거
        const existingPopup = document.getElementById('manga-help-popup');
        if (existingPopup) {
            hideHelpPopup();
            return;
        }

        // 도움말 팝업 HTML 생성
        const helpPopup = document.createElement('div');
        helpPopup.id = 'manga-help-popup';
        helpPopup.className = 'active';
        helpPopup.innerHTML = `
            <button id="manga-help-close">×</button>
            <div id="manga-help-title">⌨️ 키보드 단축키 도움말</div>
            
            <div class="manga-help-section">
                <h4>📖 페이지 네비게이션</h4>
                <div class="manga-help-item">
                    <span class="manga-help-desc">이전 페이지</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">A</span>
                        <span class="manga-help-key">←</span>
                    </div>
                </div>
                <div class="manga-help-item">
                    <span class="manga-help-desc">다음 페이지</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">D</span>
                        <span class="manga-help-key">→</span>
                    </div>
                </div>
                <div class="manga-help-item">
                    <span class="manga-help-desc">이전 페이지 (대안)</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">W</span>
                        <span class="manga-help-key">PgUp</span>
                    </div>
                </div>
                <div class="manga-help-item">
                    <span class="manga-help-desc">다음 페이지 (대안)</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">S</span>
                        <span class="manga-help-key">PgDn</span>
                        <span class="manga-help-key">Space</span>
                    </div>
                </div>
            </div>

            <div class="manga-help-section">
                <h4>🎯 빠른 이동</h4>
                <div class="manga-help-item">
                    <span class="manga-help-desc">첫 번째 페이지</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">↑</span>
                        <span class="manga-help-key">Home</span>
                    </div>
                </div>
                <div class="manga-help-item">
                    <span class="manga-help-desc">마지막 페이지</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">↓</span>
                        <span class="manga-help-key">End</span>
                    </div>
                </div>
            </div>

            <div class="manga-help-section">
                <h4>🔧 뷰어 기능</h4>
                <div class="manga-help-item">
                    <span class="manga-help-desc">서랍 토글</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">Q</span>
                        <span class="manga-help-key">Tab</span>
                    </div>
                </div>
                <div class="manga-help-item">
                    <span class="manga-help-desc">전체화면</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">F</span>
                    </div>
                </div>
                <div class="manga-help-item">
                    <span class="manga-help-desc">이미지 새로고침</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">R</span>
                    </div>
                </div>
                <div class="manga-help-item">
                    <span class="manga-help-desc">뷰어 닫기</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">ESC</span>
                    </div>
                </div>
                <div class="manga-help-item">
                    <span class="manga-help-desc">도움말 토글</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">H</span>
                    </div>
                </div>
            </div>

            <div class="manga-help-section">
                <h4>🖱️ 마우스 기능</h4>
                <div class="manga-help-item">
                    <span class="manga-help-desc">페이지 네비게이션</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">휠 스크롤</span>
                    </div>
                </div>
                <div class="manga-help-item">
                    <span class="manga-help-desc">확대/축소</span>
                    <div class="manga-help-keys">
                        <span class="manga-help-key">Ctrl + 휠</span>
                    </div>
                </div>
            </div>
        `;

        // 뷰어 컨테이너에 추가
        document.getElementById('manga-viewer-container').appendChild(helpPopup);

        // 닫기 버튼 이벤트
        document.getElementById('manga-help-close').addEventListener('click', hideHelpPopup);

        // 전역 키보드 이벤트 - ESC나 H로 도움말 닫기
        document.addEventListener('keydown', handleHelpKeyDown);
    }

    // 도움말 팝업 숨기기
    function hideHelpPopup() {
        const helpPopup = document.getElementById('manga-help-popup');
        if (helpPopup) {
            helpPopup.remove();
            document.removeEventListener('keydown', handleHelpKeyDown);
            // 키보드 캐처에 포커스 복원
            focusKeyboardCatcher();
        }
    }

    // 도움말 팝업이 열려있을 때의 키보드 이벤트 처리
    function handleHelpKeyDown(e) {
        if (e.key === 'Escape' || e.key.toLowerCase() === 'h') {
            hideHelpPopup();
            e.preventDefault();
            e.stopPropagation();
        }
    }

    // 확대/축소 기능
    let currentScale = 1;
    const scaleStep = 0.1;
    const minScale = 0.5;
    const maxScale = 3;    // 마우스 휠 이벤트 처리 (페이지 네비게이션 + 줌) - 개선된 버전
    let wheelTimeouts = new Map();
    let wheelSensitivity = 100; // 휠 감도 임계값

    function handleZoom(e) {
        e.preventDefault();

        // Ctrl 키를 누른 상태에서는 줌 기능
        if (e.ctrlKey) {
            const zoomIn = e.deltaY < 0;

            if (zoomIn && currentScale < maxScale) {
                currentScale = Math.min(currentScale + scaleStep, maxScale);
            } else if (!zoomIn && currentScale > minScale) {
                currentScale = Math.max(currentScale - scaleStep, minScale);
            }

            document.getElementById('manga-viewer-image').style.transform = `scale(${currentScale})`;
        } else {
            // 일반 휠 스크롤은 페이지 네비게이션 (디바운싱 적용)
            const direction = e.deltaY < 0 ? 'up' : 'down';

            // 이전 타임아웃 제거
            if (wheelTimeouts.has(direction)) {
                clearTimeout(wheelTimeouts.get(direction));
            }

            // 짧은 지연 후 네비게이션 실행 (빠른 연속 스크롤 방지)
            const timeout = setTimeout(() => {
                if (Math.abs(e.deltaY) > wheelSensitivity) {
                    if (direction === 'up') {
                        // 위로 스크롤 -> 이전 페이지
                        if (currentImageIndex > 0) {
                            prevImage();
                            showNavigationFeedback('prev');
                        }
                    } else {
                        // 아래로 스크롤 -> 다음 페이지
                        if (currentImageIndex < images.length - 1) {
                            nextImage();
                            showNavigationFeedback('next');
                        }
                    }
                }
                wheelTimeouts.delete(direction);
            }, 50);

            wheelTimeouts.set(direction, timeout);
        }
    }

    // 로컬 스토리지에서 시리즈 자동 전환 상태 관리
    function getSeriesAutoOpenKey() {
        return 'arcalive_manga_viewer_series_auto_open';
    }

    function checkAndAutoOpenFromSeries() {
        // URL 파라미터에서 시리즈 이동 여부 확인
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.has('manga_from_series')) {
            autoOpenFromSeries = true;

            // 페이지 로드 후 약간 지연시켜서 만화 뷰어 모드를 실행
            setTimeout(() => {
                // 페이지가 완전히 로드된 후 이어서보기 실행
                continueViewing();
            }, 500);

            // URL에서 파라미터 제거 (히스토리는 유지)
            window.history.replaceState({}, document.title,
                window.location.pathname + window.location.hash);
        }
    }    // 스크립트 초기화
    function init() {
        // 이미 초기화되었으면 중복 실행 방지
        if (isInitialized) return;

        if (!isArticlePage()) return;

        isInitialized = true;
        console.log('아카라이브 만화 뷰어 초기화');

        // 시리즈 링크를 통한 자동 열기 기능 확인
        checkAndAutoOpenFromSeries();

        // DOM이 완전히 로드된 후에 실행
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                createViewerElements();
                addViewerButton();
            });
        } else {
            createViewerElements();
            addViewerButton();
        }

        // 모바일 환경 감지 및 터치 이벤트 추가
        if ('ontouchstart' in window) {
            console.log('모바일 환경 감지: 터치 이벤트 추가');
            // 뷰어가 생성된 후에 터치 이벤트 추가
            setTimeout(() => {
                const viewerContent = document.getElementById('manga-viewer-content');
                if (viewerContent) {
                    viewerContent.addEventListener('touchstart', handleTouchStart, { passive: false });
                    viewerContent.addEventListener('touchmove', handleTouchMove, { passive: false });
                    viewerContent.addEventListener('touchend', handleTouchEnd, { passive: false });
                }
            }, 100);
        }
    }// 터치 이벤트 처리 (모바일용) - 개선된 버전
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let touchMoved = false;
    let isDoubleTap = false;
    let lastTouchTime = 0;

    function handleTouchStart(e) {
        const touch = e.changedTouches[0];
        touchStartX = touch.screenX;
        touchStartY = touch.screenY;
        touchStartTime = Date.now();
        touchMoved = false;

        // 더블탭 감지
        const currentTime = Date.now();
        if (currentTime - lastTouchTime < 300) {
            isDoubleTap = true;
            e.preventDefault(); // 더블탭 시 줌 방지
        } else {
            isDoubleTap = false;
        }
        lastTouchTime = currentTime;
    }

    function handleTouchMove(e) {
        const touch = e.changedTouches[0];
        const moveX = Math.abs(touch.screenX - touchStartX);
        const moveY = Math.abs(touch.screenY - touchStartY);

        // 5px 이상 움직였다면 스와이프로 간주
        if (moveX > 5 || moveY > 5) {
            touchMoved = true;
        }
    }

    function handleTouchEnd(e) {
        if (!touchMoved && isDoubleTap) {
            // 더블탭으로 서랍 토글
            toggleDrawer();
            return;
        }

        if (!touchMoved || Date.now() - touchStartTime > 800) {
            // 탭이나 너무 긴 터치는 무시
            return;
        }

        const touch = e.changedTouches[0];
        const touchEndX = touch.screenX;
        const touchEndY = touch.screenY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // 세로 스와이프가 더 크면 무시 (세로 스크롤)
        if (Math.abs(diffY) > Math.abs(diffX)) {
            return;
        }

        const minSwipeDistance = 80;
        const fastSwipeTime = 300;
        const isFastSwipe = Date.now() - touchStartTime < fastSwipeTime;

        // 빠른 스와이프는 더 짧은 거리로도 인정
        const effectiveMinDistance = isFastSwipe ? minSwipeDistance * 0.6 : minSwipeDistance;

        if (Math.abs(diffX) > effectiveMinDistance) {
            if (diffX > 0) {
                prevImage(); // 오른쪽으로 스와이프 -> 이전 이미지
            } else {
                nextImage(); // 왼쪽으로 스와이프 -> 다음 이미지
            }
        }
    }

    // 페이지 변경을 감지하여 스크립트 재초기화 (SPA 대응)
    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            isInitialized = false;
            setTimeout(init, 1000); // 페이지 전환 후 1초 뒤에 다시 초기화
        }
    }).observe(document, { subtree: true, childList: true });

    init();

    // IntersectionObserver를 이용한 지연 로딩 최적화
    let drawerObserver = null;
    let loadedImages = new Set();

    // 이미지 지연 로딩 초기화
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            drawerObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const realSrc = img.dataset.src;
                        if (realSrc && !loadedImages.has(realSrc)) {
                            img.src = realSrc;
                            loadedImages.add(realSrc);
                            drawerObserver.unobserve(img);
                        }
                    }
                });
            }, {
                rootMargin: '100px' // 100px 전에 미리 로드
            });
        }
    }

    // 메모리 관리 - 사용하지 않는 이미지 캐시 정리
    function cleanupImageCache() {
        if (imageCache.size > 50) { // 50개 이상 캐시되면 정리
            const entries = Array.from(imageCache.entries());
            // 오래된 순서로 절반 정리 (LRU 방식)
            const toDelete = entries.slice(0, entries.length / 2);
            toDelete.forEach(([key]) => {
                imageCache.delete(key);
            });
        }
    }

    // 성능 모니터링
    function performanceLog(action, startTime) {
        if (console.time && performance.now) {
            const duration = performance.now() - startTime;
            console.log(`[만화뷰어] ${action}: ${duration.toFixed(2)}ms`);
        }
    }

    // 성능 모니터링 시스템 추가
    let performanceStats = {
        keyPressCount: 0,
        imageLoadCount: 0,
        drawerToggleCount: 0,
        startTime: Date.now()
    };

    // 성능 통계 업데이트
    function updatePerformanceStats(action) {
        switch (action) {
            case 'keypress':
                performanceStats.keyPressCount++;
                break;
            case 'imageload':
                performanceStats.imageLoadCount++;
                break;
            case 'drawer':
                performanceStats.drawerToggleCount++;
                break;
        }
    }

    // 성능 통계 출력 (디버그용)
    function logPerformanceStats() {
        const runTime = Date.now() - performanceStats.startTime;
        console.log(`[만화뷰어 성능 통계] 실행시간: ${Math.floor(runTime / 1000)}초`);
        console.log(`키 입력: ${performanceStats.keyPressCount}회`);
        console.log(`이미지 로드: ${performanceStats.imageLoadCount}회`);
        console.log(`서랍 토글: ${performanceStats.drawerToggleCount}회`);
    }
})();
