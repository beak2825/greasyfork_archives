// ==UserScript==
// @name          치지직 커스텀 검색 엔진
// @namespace     치지직 커스텀 검색 엔진
// @match         *://chzzk.naver.com/*
// @version       0.8
// @description   치지직 검색 엔진을 변경합니다
// @icon          https://www.google.com/s2/favicons?sz=256&domain_url=chzzk.naver.com
// @author        mickey90427 <mickey90427@naver.com>
// @grant         GM_addStyle
// @grant         GM_download
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/502800/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%BB%A4%EC%8A%A4%ED%85%80%20%EA%B2%80%EC%83%89%20%EC%97%94%EC%A7%84.user.js
// @updateURL https://update.greasyfork.org/scripts/502800/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%BB%A4%EC%8A%A4%ED%85%80%20%EA%B2%80%EC%83%89%20%EC%97%94%EC%A7%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS 추가
    GM_addStyle(`
        #searchBox {
            position: fixed;
            top: 50px;
            left: 50%;
            transform: translateX(-50%);
            padding: 10px;
            background: rgba(255, 255, 255, 0.9);
            border: 1px solid #ccc;
            color: #333;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
            display: none; /* 초기에는 숨김 */
        }
        #searchBox input, #searchBox button, #searchBox textarea {
            margin: 5px;
            padding: 5px;
            font-size: 14px;
        }
        #searchBox input, #searchBox textarea {
            border: 1px solid #ddd;
            border-radius: 3px;
            background: #fafafa;
            color: #333;
        }
        #searchBox button {
            background: #28a745;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #searchBox button:hover {
            background: #218838;
        }
        #searchBox #searchTerms {
            margin-top: 10px;
            max-height: 200px;
            overflow-y: auto;
        }
        #searchBox #searchTerms div {
            margin: 2px 0;
            display: flex;
            align-items: center;
            cursor: move;
        }
        #searchBox #searchTerms div button {
            margin-left: 10px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #searchBox #searchTerms div button:hover {
            background: #c82333;
        }
        #searchBox #bulkAddForm {
            display: none;
            margin-top: 10px;
            padding: 10px;
            background: #f8f9fa;
            border: 1px solid #ddd;
            border-radius: 5px;
        }
        #searchBox #bulkAddForm label {
            display: block;
            margin-top: 10px;
        }
        #searchBox #bulkAddForm input[type="file"] {
            margin-top: 5px;
        }
        #searchBox #bulkAddForm textarea {
            width: 100%;
            height: 100px;
            margin-top: 5px;
            padding: 10px;
            resize: vertical;
        }
        #searchBox #bulkAddForm button {
            margin-top: 10px;
            display: block;
            width: 100%;
        }
    `);

    // 로컬 저장소에서 데이터 로드 및 저장
    const loadSearchTerms = () => JSON.parse(localStorage.getItem('searchTerms') || '[]');
    const saveSearchTerms = (terms) => localStorage.setItem('searchTerms', JSON.stringify(terms));
    const loadPopupOption = () => JSON.parse(localStorage.getItem('popupOption') || 'false');
    const savePopupOption = (value) => localStorage.setItem('popupOption', JSON.stringify(value));
    const loadAutoSaveOption = () => JSON.parse(localStorage.getItem('autoSaveOption') || 'false');
    const saveAutoSaveOption = (value) => localStorage.setItem('autoSaveOption', JSON.stringify(value));

    // 검색 박스 생성
    const searchBox = document.createElement('div');
    searchBox.id = 'searchBox';
    searchBox.innerHTML = `
        <input type="text" id="searchInput" placeholder="검색어 입력" />
        <button id="searchButton">검색</button>
        <button id="bulkAddToggle">빠른 검색 추가</button>
        <button id="clearAllButton">모든 검색어 삭제</button>
        <div id="bulkAddForm">
            <label for="fileInput">빠른 검색 불러오기 (txt 파일만 가능):</label>
            <input type="file" id="fileInput" accept=".txt" />
            <label for="bulkAddInput">검색 바로가기 추가 (개행으로 구분):</label>
            <textarea id="bulkAddInput" placeholder="검색어를 개행으로 구분하여 입력하세요"></textarea>
            <label>
                <input type="checkbox" id="overwriteOption"> 덮어쓰기(기존 빠른 검색이 사라짐)
            </label>
            <button id="bulkAddButton">빠른 검색 추가</button>
            <button id="exportButton">검색 바로가기 내보내기 (*.txt 파일)</button>
        </div>
        <div id="searchTerms"></div>
        <label>
            <input type="checkbox" id="popupOption"> 새 탭에서 검색
        </label>
        <label>
            <input type="checkbox" id="autoSaveOption"> 검색어 자동 저장(빠른 검색)
        </label>
    `;
    document.body.appendChild(searchBox);

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const bulkAddToggle = document.getElementById('bulkAddToggle');
    const bulkAddForm = document.getElementById('bulkAddForm');
    const fileInput = document.getElementById('fileInput');
    const bulkAddInput = document.getElementById('bulkAddInput');
    const bulkAddButton = document.getElementById('bulkAddButton');
    const exportButton = document.getElementById('exportButton');
    const searchTermsDiv = document.getElementById('searchTerms');
    const popupOption = document.getElementById('popupOption');
    const autoSaveOption = document.getElementById('autoSaveOption');
    const overwriteOption = document.getElementById('overwriteOption');
    const clearAllButton = document.getElementById('clearAllButton');

    // 체크박스 상태 설정
    popupOption.checked = loadPopupOption();
    autoSaveOption.checked = loadAutoSaveOption();
    overwriteOption.checked = false;

    // 검색어 목록 갱신
    const updateSearchTerms = () => {
        const terms = loadSearchTerms();
        searchTermsDiv.innerHTML = '';
        terms.forEach((term, index) => {
            const termDiv = document.createElement('div');
            termDiv.textContent = term;
            termDiv.draggable = true;
            termDiv.dataset.index = index;

            termDiv.ondragstart = (e) => {
                e.dataTransfer.setData('text/plain', index);
            };

            termDiv.ondragover = (e) => {
                e.preventDefault();
            };

            termDiv.ondrop = (e) => {
                e.preventDefault();
                const fromIndex = e.dataTransfer.getData('text/plain');
                const toIndex = e.target.dataset.index;
                if (fromIndex !== toIndex) {
                    const terms = loadSearchTerms();
                    const movedItem = terms.splice(fromIndex, 1)[0];
                    terms.splice(toIndex, 0, movedItem);
                    saveSearchTerms(terms);
                    updateSearchTerms();
                }
            };

            const searchTermButton = document.createElement('button');
            searchTermButton.textContent = '검색';
            searchTermButton.onclick = () => {
                searchInput.value = term;
                search();
            };

            const deleteButton = document.createElement('button');
            deleteButton.textContent = '삭제';
            deleteButton.onclick = (event) => {
                event.stopPropagation(); // 이벤트 전파 중지
                const existingTerms = loadSearchTerms();
                if (existingTerms.includes(term)) {
                    const newTerms = existingTerms.filter(t => t !== term);
                    saveSearchTerms(newTerms);
                    updateSearchTerms();
                }
            };

            termDiv.appendChild(searchTermButton);
            termDiv.appendChild(deleteButton);
            searchTermsDiv.appendChild(termDiv);
        });
    };

    // 새 버튼 추가
    const openAllButton = document.createElement('button');
    openAllButton.textContent = '모든 검색어 새 창에서 열기';
    searchBox.appendChild(openAllButton);

    // 모든 검색어 열기 기능
    openAllButton.onclick = () => {
        const terms = loadSearchTerms();
        terms.forEach(term => {
            const query = encodeURIComponent(term);
            const url = `https://chzzk.naver.com/search?query=${query}`;
            window.open(url, '_blank');
        });
    };

    // 대량 추가 기능
    const bulkAdd = () => {
        const newTerms = bulkAddInput.value
            .split('\n')
            .map(term => term.trim())
            .filter(term => term.length > 0);

        if (overwriteOption.checked) {
            saveSearchTerms(newTerms); // 덮어쓰기 활성화 시 새로 입력한 검색어로 전체 교체
        } else {
            const existingTerms = loadSearchTerms();
            const uniqueTerms = new Set([...existingTerms, ...newTerms]);
            saveSearchTerms([...uniqueTerms]); // 중복 제거 후 저장
        }
        updateSearchTerms();
        bulkAddInput.value = ''; // 입력 필드 초기화
    };

    // 파일 불러오기 기능
    const loadFromFile = (file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);

            if (lines[0] === 'chzzk.naver.com custom search engine') {
                bulkAddInput.value = lines.slice(1).join('\n'); // 검색어 추가 폼에만 입력
            } else {
                alert('유효하지 않은 파일 형식입니다.');
            }
            fileInput.value = ''; // 파일 입력 초기화
        };
        reader.readAsText(file);
    };

    // 검색 수행
    const search = () => {
        const query = searchInput.value;
        if (query) {
            const url = `https://chzzk.naver.com/search?query=${encodeURIComponent(query)}`;
            if (popupOption.checked) {
                window.open(url, '_blank');
            } else {
                window.location.href = url;
            }
            if (autoSaveOption.checked) {
                const terms = loadSearchTerms();
                if (!terms.includes(query)) {
                    terms.push(query);
                    saveSearchTerms(terms);
                    updateSearchTerms();
                }
            }
        }
    };

    // 버튼 이벤트 리스너
    searchButton.onclick = search;
    bulkAddButton.onclick = bulkAdd;

    fileInput.onchange = () => {
        const file = fileInput.files[0];
        if (file) {
            loadFromFile(file);
        }
    };

    exportButton.onclick = () => {
        const terms = loadSearchTerms();
        const blob = new Blob([`chzzk.naver.com custom search engine\n${terms.join('\n')}`], { type: 'text/plain' });
        const filename = `${new Date().toISOString().replace(/[:.-]/g, '_')}.txt`;
        GM_download({
            url: URL.createObjectURL(blob),
            name: filename,
            saveAs: true
        });
    };

    clearAllButton.onclick = () => {
        const terms = loadSearchTerms();
        if (terms.length === 0) {
            alert('삭제할 검색어가 없습니다.');
            return;
        }
        if (confirm('정말로 검색어를 비우시겠습니까?')) {
            const backup = confirm('검색어를 백업하시겠습니까?');
            if (backup) {
                exportButton.click(); // 백업
            }
            saveSearchTerms([]); // 모든 검색어 삭제
            updateSearchTerms();
        }
    };

    popupOption.onchange = () => savePopupOption(popupOption.checked);
    autoSaveOption.onchange = () => saveAutoSaveOption(autoSaveOption.checked);

    // 엔터키로 검색 수행
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // 기본 엔터 동작 방지
            search();
        }
    });

    // DOM 변경 감지 및 사용자 GUI 표시
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length > 0) {
                const searchForm = document.querySelector('form[role="search"]');
                if (searchForm && !searchForm.hasAttribute('data-custom-listener')) {
                    searchForm.setAttribute('data-custom-listener', 'true');
                    searchForm.addEventListener('click', (e) => {
                        e.stopPropagation(); // 이벤트 버블링 방지
                        searchBox.style.display = 'block';
                        searchInput.focus();

                        // 기존 검색창의 자동 완성 요소 제거
                        const existingAutoComplete = document.querySelector('.search_autocomplete__vL4rG');
                        if (existingAutoComplete) {
                            existingAutoComplete.innerHTML = '';
                        }
                    }, { capture: true }); // 캡처링 단계에서 이벤트를 가로챔
                }
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // 사용자 GUI 바깥 클릭 시 GUI 닫기
    document.addEventListener('click', (e) => {
        const searchForm = document.querySelector('form[role="search"]');
        if (!searchBox.contains(e.target) && (!searchForm || !searchForm.contains(e.target))) {
            searchBox.style.display = 'none';
            bulkAddForm.style.display = 'none'; // 대량 추가 폼도 숨기기
        }
    });

    // 대량 추가 폼 초기화
    const initializeBulkAddToggle = () => {
        bulkAddForm.style.display = 'none'; // 초기에는 대량 추가 폼 숨김
        bulkAddToggle.onclick = () => {
            if (bulkAddForm.style.display === 'none') {
                bulkAddForm.style.display = 'block';
            } else {
                bulkAddForm.style.display = 'none';
            }
        };
    };

    // 입력 필드 비활성화 및 비우기
    const toggleInputFields = (disabled) => {
        const searchInputField = document.querySelector('.search_form__Xok\\+J .search_input__vZM2g');
        if (searchInputField) {
            searchInputField.disabled = disabled;
            if (disabled) {
                searchInputField.value = ''; // 입력 필드 비우기
            }
        }
    };

    // 초기화
    initializeBulkAddToggle();
    updateSearchTerms();

    // 사용자 GUI 활성화 및 비활성화 시 입력 필드 제어
    const handleSearchBoxVisibility = () => {
        const isVisible = searchBox.style.display === 'block';
        toggleInputFields(isVisible);
    };

    // 사용자 GUI가 열릴 때마다 입력 필드를 비활성화
    const observerForGUI = new MutationObserver(() => {
        handleSearchBoxVisibility();
    });

    observerForGUI.observe(searchBox, { attributes: true, attributeFilter: ['style'] });
})();