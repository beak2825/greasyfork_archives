// ==UserScript==
// @name         KoneGG 확장 검색 시스템 (API 버전, 제목/내용/작성자 검색, 날짜 정렬 지원)
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  kone.gg 사이트에서 API를 사용하여 제목, 내용, 작성자명이 특정 키워드를 포함하는 게시글을 검색하고 날짜별로 정렬합니다. (현재 서브 필터링, 새탭 열기 지원)
// @author       You
// @match        https://kone.gg/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/536840/KoneGG%20%ED%99%95%EC%9E%A5%20%EA%B2%80%EC%83%89%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%28API%20%EB%B2%84%EC%A0%84%2C%20%EC%A0%9C%EB%AA%A9%EB%82%B4%EC%9A%A9%EC%9E%91%EC%84%B1%EC%9E%90%20%EA%B2%80%EC%83%89%2C%20%EB%82%A0%EC%A7%9C%20%EC%A0%95%EB%A0%AC%20%EC%A7%80%EC%9B%90%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536840/KoneGG%20%ED%99%95%EC%9E%A5%20%EA%B2%80%EC%83%89%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%28API%20%EB%B2%84%EC%A0%84%2C%20%EC%A0%9C%EB%AA%A9%EB%82%B4%EC%9A%A9%EC%9E%91%EC%84%B1%EC%9E%90%20%EA%B2%80%EC%83%89%2C%20%EB%82%A0%EC%A7%9C%20%EC%A0%95%EB%A0%AC%20%EC%A7%80%EC%9B%90%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 디버그 로깅
    const DEBUG = true;
    // 검색 중단 플래그
    let searchCancelled = false;
    // 현재 검색 결과 데이터 저장용
    let currentSearchResultsData = [];

    function log(...args) {
        if (DEBUG) {
            console.log('[KoneGG 검색 API]', ...args);
        }
    }

    // 현재 서브 이름 가져오기
    function getCurrentSubName() {
        const path = window.location.pathname;
        const matches = path.match(/\/s\/([^\/]+)/);
        const subName = matches ? matches[1] : null;
        log('현재 서브명:', subName);
        return subName;
    }

    // CSS 스타일 추가
    GM_addStyle(`
        /* 기존 스타일 유지 */
        .kone-search-button {
            position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px;
            border-radius: 50%; background-color: #3b82f6; color: white;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            z-index: 9998; transition: all 0.3s ease;
        }
        .kone-search-button:hover { background-color: #2563eb; transform: scale(1.05); }
        .dark .kone-search-button { background-color: #4b5563; }
        .dark .kone-search-button:hover { background-color: #374151; }

        .kone-search-panel {
            position: fixed; bottom: 80px; right: 20px; width: 350px;
            background-color: white; border-radius: 8px;
            box-shadow: 0 2px 15px rgba(0, 0, 0, 0.1); z-index: 9997;
            font-family: 'Pretendard', sans-serif; display: none;
            overflow: hidden; border: 1px solid #e5e7eb;
        }
        .dark .kone-search-panel { background-color: #27272a; border-color: #3f3f46; color: #e4e4e7; }

        .kone-search-header {
            padding: 15px; border-bottom: 1px solid #e5e7eb;
            display: flex; justify-content: space-between; align-items: center;
        }
        .dark .kone-search-header { border-color: #3f3f46; }
        .kone-search-title { font-weight: 600; font-size: 16px; }
        .kone-search-close { cursor: pointer; opacity: 0.6; }
        .kone-search-close:hover { opacity: 1; }

        .kone-search-content { padding: 15px; }
        .kone-search-form { display: flex; flex-direction: column; gap: 12px; }
        .kone-search-input-container { position: relative; }
        .kone-search-input, .kone-search-sort-select { /* 공통 스타일 적용 */
            width: 100%; padding: 10px 12px;
            border: 1px solid #e5e7eb; border-radius: 6px; font-size: 14px; outline: none;
            box-sizing: border-box; /* 패딩과 테두리가 너비에 포함되도록 */
        }
        .kone-search-input { padding-left: 35px; } /* 아이콘 공간 */

        .dark .kone-search-input, .dark .kone-search-sort-select {
            background-color: #3f3f46; border-color: #52525b; color: #e4e4e7;
        }
        .kone-search-input:focus, .kone-search-sort-select:focus { border-color: #3b82f6; }
        .kone-search-icon {
            position: absolute; left: 10px; top: 50%;
            transform: translateY(-50%); color: #9ca3af;
        }

        .kone-search-options-container { /* 옵션과 정렬을 묶는 컨테이너 */
            display: flex; flex-direction: column; gap: 10px;
        }
        .kone-search-options { display: flex; flex-wrap: wrap; gap: 10px; } /* 기존 옵션 */
        .kone-search-option { display: flex; align-items: center; gap: 5px; }
        .kone-search-option input[type="checkbox"] { margin: 0; }
        .kone-search-option label { font-size: 13px; user-select: none; }

        .kone-search-sort-options { display: flex; align-items: center; gap: 8px; }
        .kone-search-sort-options label { font-size: 13px; white-space: nowrap; }
        .kone-search-sort-select { width: auto; flex-grow: 1; padding: 8px 10px;}


        .kone-search-settings { display: flex; justify-content: space-between; align-items: center; margin-top:10px;}
        .kone-search-checkbox-container { display: flex; align-items: center; gap: 6px; }
        .kone-search-checkbox-label { font-size: 13px; user-select: none; }

        .kone-search-button-submit {
            padding: 8px 16px; background-color: #3b82f6; color: white;
            border: none; border-radius: 6px; font-size: 14px; font-weight: 500;
            cursor: pointer; transition: background-color 0.3s;
        }
        .kone-search-button-submit:hover { background-color: #2563eb; }
        .dark .kone-search-button-submit { background-color: #4b5563; }
        .dark .kone-search-button-submit:hover { background-color: #374151; }

        .kone-search-results { margin-top: 15px; max-height: 350px; overflow-y: auto; display: none; }
        .kone-search-results-header {
            margin-bottom: 10px; font-size: 14px; font-weight: 600;
            display: flex; justify-content: space-between; align-items: center;
        }
        .kone-search-results-count { color: #6b7280; font-size: 13px; font-weight: normal; }
        .dark .kone-search-results-count { color: #a1a1aa; }
        .kone-search-results-list { display: flex; flex-direction: column; gap: 8px; }

        .kone-search-result-item {
            padding: 10px; border: 1px solid #e5e7eb; border-radius: 6px;
            cursor: pointer; transition: background-color 0.3s; position: relative;
        }
        .dark .kone-search-result-item { border-color: #3f3f46; }
        .kone-search-result-item:hover { background-color: #f9fafb; }
        .dark .kone-search-result-item:hover { background-color: #3f3f46; }

        .kone-search-result-item::after {
            content: '🔗 새 탭에서 열기'; position: absolute; top: 50%; right: 10px;
            transform: translateY(-50%); background-color: rgba(59, 130, 246, 0.1);
            color: #3b82f6; padding: 2px 6px; border-radius: 4px;
            font-size: 11px; opacity: 0; transition: opacity 0.3s; pointer-events: none;
        }
        .kone-search-result-item:hover::after { opacity: 1; }
        .dark .kone-search-result-item::after { background-color: rgba(75, 85, 99, 0.3); color: #9ca3af; }

        .kone-search-result-title {
            font-weight: 500; font-size: 14px; margin-bottom: 5px;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 80px;
        }
        .kone-search-result-content {
            font-size: 12px; margin-bottom: 5px; color: #6b7280;
            white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 80px;
        }
        .dark .kone-search-result-content { color: #a1a1aa; }
        .kone-search-result-meta {
            display: flex; justify-content: space-between; font-size: 12px;
            color: #6b7280; padding-right: 80px;
        }
        .dark .kone-search-result-meta { color: #a1a1aa; }

        .kone-search-loading {
            display: none; justify-content: center; align-items: center;
            padding: 15px 0; flex-direction: column; gap: 10px;
        }
        .kone-search-spinner {
            width: 24px; height: 24px; border: 3px solid #f3f3f3;
            border-top: 3px solid #3b82f6; border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        .dark .kone-search-spinner { border-color: #3f3f46; border-top-color: #4b5563; }
        .kone-search-progress { font-size: 13px; color: #6b7280; text-align: center; }
        .dark .kone-search-progress { color: #a1a1aa; }

        .kone-search-debug {
            font-size: 11px; color: #9ca3af; margin-top: 5px; max-height: 60px;
            overflow-y: auto; background-color: rgba(0,0,0,0.05);
            padding: 5px; border-radius: 4px; display: none;
        }
        .dark .kone-search-debug { background-color: rgba(255,255,255,0.05); color: #a1a1aa; }

        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .kone-search-no-results {
            padding: 15px; text-align: center; color: #6b7280;
            font-size: 14px; display: none;
        }
        .dark .kone-search-no-results { color: #a1a1aa; }

        .kone-search-cancel-button {
            background-color: #ef4444; color: white; border: none; border-radius: 6px;
            padding: 8px 16px; font-size: 14px; font-weight: 500; cursor: pointer;
            display: none; margin-top: 10px; width: 100%;
        }
        .kone-search-cancel-button:hover { background-color: #dc2626; }

        .kone-search-new-tab-info {
            padding: 8px 12px; background-color: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.2); border-radius: 6px;
            font-size: 12px; color: #3b82f6; margin-top: 10px; text-align: center;
        }
        .dark .kone-search-new-tab-info {
            background-color: rgba(75, 85, 99, 0.2);
            border-color: rgba(75, 85, 99, 0.3); color: #9ca3af;
        }

        /* Modal Styles */
        .kone-search-modal-overlay {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0,0,0,0.5); z-index: 9999; display: none;
        }
        .kone-search-modal {
            position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
            background-color: white; padding: 25px; border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 10000;
            width: 300px; text-align: center; display: none;
        }
        .dark .kone-search-modal {
            background-color: #2d3748; color: #e2e8f0; border: 1px solid #4a5568;
        }
        .kone-search-modal-message { margin-bottom: 20px; font-size: 15px; line-height: 1.6; }
        .kone-search-modal-button {
            padding: 10px 20px; border: none; border-radius: 6px;
            background-color: #3b82f6; color: white; font-size: 14px;
            font-weight: 500; cursor: pointer; transition: background-color 0.2s;
        }
        .kone-search-modal-button:hover { background-color: #2563eb; }
        .dark .kone-search-modal-button { background-color: #4b5563; }
        .dark .kone-search-modal-button:hover { background-color: #374151; }
    `);

    // DOM 요소 생성
    function createElements() {
        const searchButton = document.createElement('div');
        searchButton.className = 'kone-search-button';
        searchButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>`;
        document.body.appendChild(searchButton);

        const searchPanel = document.createElement('div');
        searchPanel.className = 'kone-search-panel';
        searchPanel.innerHTML = `
            <div class="kone-search-header">
                <div class="kone-search-title">확장 검색 (API)</div>
                <div class="kone-search-close">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </div>
            </div>
            <div class="kone-search-content">
                <div class="kone-search-form">
                    <div class="kone-search-input-container">
                        <div class="kone-search-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                        </div>
                        <input type="text" class="kone-search-input" placeholder="검색어를 입력하세요...">
                    </div>

                    <div class="kone-search-options-container">
                        <div class="kone-search-options">
                            <div class="kone-search-option">
                                <input type="checkbox" id="kone-search-title" class="kone-search-checkbox" checked>
                                <label for="kone-search-title" class="kone-search-option-label">제목</label>
                            </div>
                            <div class="kone-search-option">
                                <input type="checkbox" id="kone-search-content" class="kone-search-checkbox">
                                <label for="kone-search-content" class="kone-search-option-label">내용</label>
                            </div>
                            <div class="kone-search-option">
                                <input type="checkbox" id="kone-search-author" class="kone-search-checkbox">
                                <label for="kone-search-author" class="kone-search-option-label">작성자</label>
                            </div>
                        </div>
                        <div class="kone-search-sort-options">
                            <label for="kone-search-sort-by">정렬:</label>
                            <select id="kone-search-sort-by" class="kone-search-sort-select">
                                <option value="default">기본</option>
                                <option value="date_asc">날짜 오름차순</option>
                                <option value="date_desc">날짜 내림차순</option>
                            </select>
                        </div>
                    </div>

                    <div class="kone-search-settings">
                        <div class="kone-search-checkbox-container">
                            <input type="checkbox" id="kone-search-case-sensitive" class="kone-search-checkbox">
                            <label for="kone-search-case-sensitive" class="kone-search-checkbox-label">대소문자 구분</label>
                        </div>
                        <button class="kone-search-button-submit">검색</button>
                    </div>
                </div>

                <button class="kone-search-cancel-button">검색 중단</button>

                <div class="kone-search-loading">
                    <div class="kone-search-spinner"></div>
                    <div class="kone-search-progress">
                        검색 중...
                        <br>발견된 게시글: <span id="kone-search-found-count">0</span>개
                    </div>
                    <div class="kone-search-debug"></div>
                </div>

                <div class="kone-search-no-results">검색 결과가 없습니다.</div>
                <div class="kone-search-new-tab-info" style="display: none;">
                    💡 검색 결과를 클릭하면 새 탭에서 열립니다
                </div>

                <div class="kone-search-results">
                    <div class="kone-search-results-header">
                        검색 결과 <span class="kone-search-results-count">0개</span>
                    </div>
                    <div class="kone-search-results-list"></div>
                </div>
            </div>`;
        document.body.appendChild(searchPanel);

        return {
            searchButton, searchPanel,
            searchInput: searchPanel.querySelector('.kone-search-input'),
            searchSubmitButton: searchPanel.querySelector('.kone-search-button-submit'),
            searchCaseSensitive: searchPanel.querySelector('#kone-search-case-sensitive'),
            searchResults: searchPanel.querySelector('.kone-search-results'),
            searchResultsList: searchPanel.querySelector('.kone-search-results-list'),
            searchResultsCount: searchPanel.querySelector('.kone-search-results-count'),
            searchLoading: searchPanel.querySelector('.kone-search-loading'),
            searchFoundCount: searchPanel.querySelector('#kone-search-found-count'),
            searchNoResults: searchPanel.querySelector('.kone-search-no-results'),
            searchCloseButton: searchPanel.querySelector('.kone-search-close'),
            searchDebug: searchPanel.querySelector('.kone-search-debug'),
            searchCancelButton: searchPanel.querySelector('.kone-search-cancel-button'),
            searchTitle: searchPanel.querySelector('#kone-search-title'),
            searchContent: searchPanel.querySelector('#kone-search-content'),
            searchAuthor: searchPanel.querySelector('#kone-search-author'),
            searchNewTabInfo: searchPanel.querySelector('.kone-search-new-tab-info'),
            searchSortBy: searchPanel.querySelector('#kone-search-sort-by') // 정렬 드롭다운 추가
        };
    }

    // 디버그 메시지 추가
    function addDebugMessage(message) {
        if (DEBUG) {
            const { searchDebug } = elements;
            searchDebug.style.display = 'block';
            searchDebug.innerHTML += `<div>${message}</div>`;
            searchDebug.scrollTop = searchDebug.scrollHeight;
        }
    }

    // 모달 알림창 표시 함수
    function showModal(message) {
        let overlay = document.getElementById('kone-search-modal-overlay');
        let modalContent = document.getElementById('kone-search-modal-content');

        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = 'kone-search-modal-overlay';
            overlay.className = 'kone-search-modal-overlay';
            document.body.appendChild(overlay);

            modalContent = document.createElement('div');
            modalContent.id = 'kone-search-modal-content';
            modalContent.className = 'kone-search-modal';

            const messageP = document.createElement('p');
            messageP.id = 'kone-search-modal-message';
            messageP.className = 'kone-search-modal-message';

            const closeButton = document.createElement('button');
            closeButton.textContent = '확인';
            closeButton.className = 'kone-search-modal-button';

            closeButton.onclick = () => {
                overlay.style.display = 'none';
                modalContent.style.display = 'none';
            };
            overlay.onclick = () => { // Close on overlay click
                overlay.style.display = 'none';
                modalContent.style.display = 'none';
            };

            modalContent.appendChild(messageP);
            modalContent.appendChild(closeButton);
            document.body.appendChild(modalContent);
        }

        modalContent.querySelector('#kone-search-modal-message').textContent = message;
        overlay.style.display = 'block';
        modalContent.style.display = 'block';

        if (document.body.classList.contains('dark')) {
            modalContent.classList.add('dark');
        } else {
            modalContent.classList.remove('dark');
        }
    }


    async function performSearch(subName, keyword, options) {
        const { isCaseSensitive, searchInTitle, searchInContent, searchInAuthor } = options;

        searchCancelled = false;
        elements.searchSubmitButton.style.display = 'none';
        elements.searchCancelButton.style.display = 'block';
        elements.searchLoading.querySelector('#kone-search-found-count').textContent = '0';

        let allResults = [];
        addDebugMessage(`API 검색 시작: '${keyword}' (${isCaseSensitive ? '대소문자 구분' : '대소문자 무시'}) for sub: ${subName}`);
        addDebugMessage(`검색 대상 필터: 제목(${searchInTitle}), 내용(${searchInContent}), 작성자(${searchInAuthor})`);

        try {
            const apiUrl = "https://api.kone.gg/v0/search/article";
            const requestBody = { query: keyword };

            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "accept": "*/*",
                    "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
                    "cache-control": "no-cache",
                    "content-type": "application/json",
                    "pragma": "no-cache",
                    "priority": "u=1, i",
                    // "sec-ch-ua": "\"Chromium\";v=\"136\", \"Google Chrome\";v=\"136\", \"Not.A/Brand\";v=\"99\"", // 실제 환경에 맞게 조정될 수 있음
                    // "sec-ch-ua-mobile": "?0",
                    // "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "cookie": "__Secure_Neko=ACqkAAIQUAGW9fehdn1DnT-AWxK9o9sRUAGW3pq1znL9i8ELbQgggUMYIPT32cSo4acdUQeJ0me3Jg16wYVmfeAgT_eYiC9s93dYuJLLmK3Nb8CtHxE2KaBxSZl7bMPp1AHPPAmrSo5v_IMH", // User-provided cookie
                    "Referer": "https://kone.gg/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
                body: JSON.stringify(requestBody)
            });

            if (searchCancelled) {
                addDebugMessage('API 요청 후 검색이 중단되었습니다.');
                throw new Error('Search cancelled by user');
            }

            if (!response.ok) {
                const errorText = await response.text();
                addDebugMessage(`API 오류: ${response.status} ${response.statusText}. 응답: ${errorText}`);
                throw new Error(`API 요청 실패: ${response.status}`);
            }

            const apiResults = await response.json();
            addDebugMessage(`API로부터 ${apiResults.length}개의 결과 수신`);

            const filteredBySub = apiResults.filter(article => article.sub_handle === subName);
            addDebugMessage(`${filteredBySub.length}개의 결과가 현재 서브 '${subName}'와 일치합니다.`);

            const keywordForCheck = isCaseSensitive ? keyword : keyword.toLowerCase();

            const finalResults = filteredBySub.filter(article => {
                let titleMatch = false;
                if (searchInTitle && article.title) {
                    const titleText = (isCaseSensitive ? article.title : article.title.toLowerCase());
                    if (titleText.includes(keywordForCheck) || titleText.includes(`<strong>${keywordForCheck}</strong>`)) {
                        titleMatch = true;
                    }
                }

                let contentMatch = false;
                if (searchInContent && article.content) {
                    const contentText = (isCaseSensitive ? article.content : article.content.toLowerCase());
                    if (contentText.includes(keywordForCheck) || contentText.includes(`<strong>${keywordForCheck}</strong>`)) {
                        contentMatch = true;
                    }
                }
                if (searchInTitle && titleMatch) return true;
                if (searchInContent && contentMatch) return true;
                if (searchInAuthor) return true;
                return false;
            });
            addDebugMessage(`최종 필터링 후 ${finalResults.length}개의 결과.`);


            allResults = finalResults.map(apiArticle => {
                return {
                    article_id: apiArticle.article_id,
                    title: apiArticle.title || '제목 없음',
                    content: apiArticle.content || '내용 없음',
                    url: `https://kone.gg/s/${subName}/${apiArticle.article_id}`,
                    author: "정보 없음",
                    date: apiArticle.created_at ? new Date(apiArticle.created_at).toLocaleString('ko-KR') : '날짜 없음',
                    original_created_at: apiArticle.created_at, // 정렬을 위한 원본 날짜 저장
                    matchType: 'API 검색'
                };
            });
            elements.searchFoundCount.textContent = allResults.length;

        } catch (error) {
            if (error.message === 'Search cancelled by user') {
                addDebugMessage('검색이 중단되어 결과를 처리하지 않습니다.');
            } else {
                console.error('API 검색 오류:', error);
                addDebugMessage(`API 검색 중 심각한 오류: ${error.message}`);
                elements.searchNoResults.textContent = 'API 검색 중 오류가 발생했습니다. 콘솔을 확인하세요.';
                elements.searchNoResults.style.display = 'block';
            }
            allResults = [];
        } finally {
            elements.searchSubmitButton.style.display = 'block';
            elements.searchCancelButton.style.display = 'none';
            elements.searchCancelButton.textContent = "검색 중단";
            elements.searchCancelButton.disabled = false;
            elements.searchLoading.style.display = 'none';
        }
        return allResults;
    }

    // 검색 결과 표시 함수
    function displaySearchResults(results, sortOrder = 'default') {
        const { searchResults, searchResultsList, searchResultsCount, searchNoResults, searchNewTabInfo } = elements;

        searchResultsList.innerHTML = ''; // 목록 초기화

        // 정렬 적용
        let sortedResults = [...results]; // 원본 배열 수정을 피하기 위해 복사
        if (sortOrder === 'date_asc') {
            sortedResults.sort((a, b) => {
                const dateA = a.original_created_at ? new Date(a.original_created_at) : 0;
                const dateB = b.original_created_at ? new Date(b.original_created_at) : 0;
                return dateA - dateB;
            });
        } else if (sortOrder === 'date_desc') {
            sortedResults.sort((a, b) => {
                const dateA = a.original_created_at ? new Date(a.original_created_at) : 0;
                const dateB = b.original_created_at ? new Date(b.original_created_at) : 0;
                return dateB - dateA;
            });
        }
        // 'default'는 API 반환 순서 (또는 이전 정렬 상태 유지)

        if (sortedResults.length === 0) {
            searchResults.style.display = 'none';
            searchNoResults.style.display = 'block';
            searchNewTabInfo.style.display = 'none';
            return;
        }

        searchResultsCount.textContent = `${sortedResults.length}개`;
        searchNewTabInfo.style.display = 'block';

        sortedResults.forEach(result => {
            const resultItem = document.createElement('div');
            resultItem.className = 'kone-search-result-item';

            resultItem.innerHTML = `
                <div class="kone-search-result-title">${result.title}</div>
                <div class="kone-search-result-content">${result.content}</div>
                <div class="kone-search-result-meta">
                    <div>${result.author}</div>
                    <div>${result.date}</div>
                </div>`;
            // matchType 제거, API 검색이므로 명확함

            resultItem.addEventListener('click', (e) => {
                e.preventDefault();
                window.open(result.url, '_blank');
                log(`새 탭에서 게시글 열기: ${result.url}`);
            });
            resultItem.style.cursor = 'pointer';
            searchResultsList.appendChild(resultItem);
        });

        searchResults.style.display = 'block';
        searchNoResults.style.display = 'none';
    }

    // 이벤트 핸들러 설정
    function setupEventHandlers() {
        const {
            searchButton, searchPanel, searchInput, searchSubmitButton,
            searchCaseSensitive, searchResults, searchLoading, searchNoResults,
            searchCloseButton, searchDebug, searchCancelButton,
            searchTitle, searchContent, searchAuthor, searchNewTabInfo, searchSortBy
        } = elements;

        let isPanelVisible = false;
        searchButton.addEventListener('click', () => {
            isPanelVisible = !isPanelVisible;
            searchPanel.style.display = isPanelVisible ? 'block' : 'none';
            if (isPanelVisible) searchInput.focus();
        });

        searchCloseButton.addEventListener('click', () => {
            searchPanel.style.display = 'none';
            isPanelVisible = false;
        });

        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') searchSubmitButton.click();
        });

        searchCancelButton.addEventListener('click', () => {
            searchCancelled = true;
            searchCancelButton.textContent = "검색 중단 중...";
            searchCancelButton.disabled = true;
        });

        searchSubmitButton.addEventListener('click', async () => {
            const keyword = searchInput.value.trim();
            const isCaseSensitive = searchCaseSensitive.checked;
            const subName = getCurrentSubName();
            const searchInTitle = searchTitle.checked;
            const searchInContent = searchContent.checked;
            const searchInAuthor = searchAuthor.checked;
            const currentSortOrder = searchSortBy.value;

            if (!keyword) {
                showModal('검색어를 입력해주세요.'); return;
            }
            if (!subName) {
                showModal('서브 페이지에서만 검색이 가능합니다. (예: /s/서브이름/)'); return;
            }
            if (!searchInTitle && !searchInContent && !searchInAuthor) {
                showModal('제목, 내용, 작성자 중 하나 이상 선택해주세요.'); return;
            }

            searchResults.style.display = 'none';
            searchNoResults.style.display = 'none';
            searchNewTabInfo.style.display = 'none';
            searchLoading.style.display = 'flex';
            searchDebug.innerHTML = '';
            if (DEBUG) searchDebug.style.display = 'block';

            try {
                const searchOptions = {
                    isCaseSensitive, searchInTitle, searchInContent, searchInAuthor
                };
                const results = await performSearch(subName, keyword, searchOptions);
                currentSearchResultsData = [...results]; // 새로운 검색 결과로 업데이트
                displaySearchResults(currentSearchResultsData, currentSortOrder);
            } catch (error) {
                console.error('검색 처리 오류:', error);
                addDebugMessage(`심각한 오류: ${error.message}`);
                showModal('검색 중 오류가 발생했습니다.');
            } finally {
                searchLoading.style.display = 'none';
                searchCancelButton.textContent = "검색 중단";
                searchCancelButton.disabled = false;
                searchCancelButton.style.display = 'none';
                searchSubmitButton.style.display = 'block';
            }
        });

        // 정렬 옵션 변경 시 이벤트 리스너
        searchSortBy.addEventListener('change', () => {
            if (currentSearchResultsData.length > 0) {
                const newSortOrder = searchSortBy.value;
                addDebugMessage(`정렬 변경: ${newSortOrder}`);
                displaySearchResults(currentSearchResultsData, newSortOrder); // 이미 저장된 데이터로 재정렬 및 표시
            }
        });


        document.addEventListener('click', (e) => {
            if (isPanelVisible && !searchPanel.contains(e.target) && !searchButton.contains(e.target)) {
                const modalContent = document.getElementById('kone-search-modal-content');
                if (modalContent && modalContent.contains(e.target)) {
                    return;
                }
                searchPanel.style.display = 'none';
                isPanelVisible = false;
            }
        });
    }

    let elements;

    function init() {
        elements = createElements();
        window.elements = elements;
        setupEventHandlers();
        log('KoneGG 확장 검색 시스템 (API + 날짜 정렬)이 초기화되었습니다.');
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        init();
    } else {
        window.addEventListener('load', init);
    }
})();