// ==UserScript==
// @name         Kone 사이트 콘 시스템 (이미지 삽입 + 콘 목록)
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  ~콘 이미지 삽입 및 댓글창 옆 콘 목록 표시
// @author       You
// @match        https://kone.gg/*
// @match        https://*.kone.gg/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/536839/Kone%20%EC%82%AC%EC%9D%B4%ED%8A%B8%20%EC%BD%98%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%28%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%82%BD%EC%9E%85%20%2B%20%EC%BD%98%20%EB%AA%A9%EB%A1%9D%29.user.js
// @updateURL https://update.greasyfork.org/scripts/536839/Kone%20%EC%82%AC%EC%9D%B4%ED%8A%B8%20%EC%BD%98%20%EC%8B%9C%EC%8A%A4%ED%85%9C%20%28%EC%9D%B4%EB%AF%B8%EC%A7%80%20%EC%82%BD%EC%9E%85%20%2B%20%EC%BD%98%20%EB%AA%A9%EB%A1%9D%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // API 설정
    const API_BASE_URL = 'https://kon-image-api.pages.dev/api';
    const KON_API_URL = `${API_BASE_URL}/kon`;
    const KON_LIST_API_URL = `${API_BASE_URL}/kon/list`;

    // 기본 이미지 URL (API 실패시 사용)
    const FALLBACK_IMAGE_URL = 'https://static.wtable.co.kr/image/production/service/recipe/1500/adf710c9-e45c-4782-a07a-4fec0ed86e5b.jpg?size=800x800';

    // ~콘으로 끝나는 텍스트를 찾는 정규식
    const KON_REGEX = /(?:\()?(.+?)\s*콘(?:\))?$/;

    // 이미 처리된 요소들을 추적하기 위한 Set
    const processedElements = new WeakSet();

    // API 응답 캐시
    const apiCache = new Map();
    const konListCache = new Map();

    // 댓글창 셀렉터
    const COMMENT_TEXTAREA_SELECTOR = 'body > div.flex-1 > div > main > div > div > div > div.flex.flex-col.border-zinc-300.md\\:rounded-lg.md\\:border.lg\\:w-3\\/4.dark\\:border-zinc-700 > div.overflow-hidden.border-t.border-zinc-300.bg-white.pb-2.dark\\:border-zinc-700.dark\\:bg-zinc-800 > div.p-4.py-2 > div > div > textarea';

    // 콘 목록 UI 상태
    let konListPanel = null;
    let isKonListVisible = false;
    let currentKonList = [];

    // === 기존 콘 이미지 삽입 기능 ===

    // API 호출 함수
    async function fetchKonData(konName) {
        if (apiCache.has(konName)) {
            return apiCache.get(konName);
        }

        try {
            const response = await fetch(`${KON_API_URL}/${encodeURIComponent(konName)}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit',
                referrerPolicy: 'no-referrer',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('API 응답:', data);

            apiCache.set(konName, data);
            setTimeout(() => apiCache.delete(konName), 5 * 60 * 1000);

            return data;
        } catch (error) {
            console.error('API 호출 실패:', error);
            const fallbackData = {
                success: false,
                exists: false,
                message: 'API 호출 실패: ' + error.message
            };

            apiCache.set(konName, fallbackData);
            setTimeout(() => apiCache.delete(konName), 30 * 1000);

            return fallbackData;
        }
    }

    async function insertImageForKonElements() {
        const pElements = document.querySelectorAll('p');

        for (const pElement of pElements) {
            if (processedElements.has(pElement)) {
                continue;
            }

            const textContent = pElement.textContent.trim();
            const match = textContent.match(KON_REGEX);

            if (match) {
                const fullText = match[0];
                const konName = match[1] + '콘';

                console.log('~콘으로 끝나는 p 태그 발견:', konName);
                processedElements.add(pElement);

                try {
                    const apiResponse = await fetchKonData(konName);
                    const newDiv = document.createElement('div');

                    Array.from(pElement.attributes).forEach(attr => {
                        newDiv.setAttribute(attr.name, attr.value);
                    });

                    newDiv.innerHTML = pElement.innerHTML;

                    if (apiResponse.success && apiResponse.exists && apiResponse.data) {
                        const img = document.createElement('img');
                        img.src = apiResponse.data.imageUrl;
                        img.alt = `${konName} 이미지`;
                        img.title = apiResponse.data.description || konName;
                        img.style.cssText = `
                            width: 100px;
                            height: 100px;
                            object-fit: contain;
                            display: block;
                            margin: 10px 0;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        `;

                        img.onerror = function() {
                            console.warn(`이미지 로드 실패: ${apiResponse.data.imageUrl}`);
                            this.src = FALLBACK_IMAGE_URL;
                        };

                        newDiv.appendChild(img);
                        console.log(`${konName} 이미지 추가 완료 (서버에서 가져옴)`);
                    } else {
                        const img = document.createElement('img');
                        img.src = FALLBACK_IMAGE_URL;
                        img.alt = `${konName} 이미지 (기본)`;
                        img.title = `${konName} (기본 이미지)`;
                        img.style.cssText = `
                            width: 100px;
                            height: 100px;
                            object-fit: contain;
                            display: block;
                            margin: 10px 0;
                            border-radius: 8px;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                            opacity: 0.7;
                        `;

                        newDiv.appendChild(img);
                        console.log(`${konName} 기본 이미지 추가 완료 (서버에 없음)`);
                    }

                    pElement.parentNode.replaceChild(newDiv, pElement);

                } catch (error) {
                    console.error('이미지 처리 중 오류:', error);
                    processedElements.delete(pElement);
                }
            }
        }
    }

    // === 콘 목록 UI 기능 ===

    // 콘 목록 조회
    async function fetchKonList(search = '', limit = 20, offset = 0) {
        const cacheKey = `${search}_${limit}_${offset}`;

        if (konListCache.has(cacheKey)) {
            return konListCache.get(cacheKey);
        }

        try {
            const params = new URLSearchParams({
                limit: limit.toString(),
                offset: offset.toString()
            });

            if (search.trim()) {
                params.append('search', search.trim());
            }

            const response = await fetch(`${KON_LIST_API_URL}?${params}`, {
                method: 'GET',
                mode: 'cors',
                credentials: 'omit',
                referrerPolicy: 'no-referrer',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('콘 목록 API 응답:', data);

            konListCache.set(cacheKey, data);
            setTimeout(() => konListCache.delete(cacheKey), 2 * 60 * 1000); // 2분 캐시

            return data;
        } catch (error) {
            console.error('콘 목록 API 호출 실패:', error);
            return {
                success: false,
                message: '콘 목록을 불러오는 중 오류가 발생했습니다: ' + error.message
            };
        }
    }

    // 콘 목록 UI 생성
    function createKonListUI() {
        // 콘 목록 패널 생성
        konListPanel = document.createElement('div');
        konListPanel.id = 'kon-list-panel';
        konListPanel.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            width: 350px;
            max-height: 500px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            display: none;
            font-family: 'Pretendard', sans-serif;
            overflow: hidden;
        `;

        // 다크 모드 스타일 추가
        if (document.documentElement.classList.contains('dark')) {
            konListPanel.style.background = '#27272a';
            konListPanel.style.borderColor = '#3f3f46';
            konListPanel.style.color = '#e4e4e7';
        }

        konListPanel.innerHTML = `
            <div style="padding: 16px; border-bottom: 1px solid #e5e7eb; ${document.documentElement.classList.contains('dark') ? 'border-color: #3f3f46;' : ''}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                    <h3 style="margin: 0; font-size: 16px; font-weight: 600;">콘 목록</h3>
                    <button id="kon-list-close" style="
                        background: none;
                        border: none;
                        cursor: pointer;
                        padding: 4px;
                        border-radius: 4px;
                        color: #6b7280;
                        hover: #374151;
                    ">✕</button>
                </div>
                <input type="text" id="kon-search-input" placeholder="콘 검색..." style="
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 14px;
                    outline: none;
                    ${document.documentElement.classList.contains('dark') ? 'background-color: #3f3f46; border-color: #52525b; color: #e4e4e7;' : ''}
                ">
            </div>
            <div id="kon-list-content" style="
                max-height: 400px;
                overflow-y: auto;
                padding: 8px;
            ">
                <div id="kon-list-loading" style="
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 40px;
                    color: #6b7280;
                ">
                    로딩 중...
                </div>
                <div id="kon-list-items" style="display: none;">
                </div>
                <div id="kon-list-error" style="
                    display: none;
                    padding: 20px;
                    text-align: center;
                    color: #ef4444;
                    font-size: 14px;
                ">
                    콘 목록을 불러올 수 없습니다.
                </div>
            </div>
        `;

        document.body.appendChild(konListPanel);

        // 이벤트 리스너 추가
        setupKonListEvents();
    }

    // 콘 목록 이벤트 설정
    function setupKonListEvents() {
        const closeBtn = document.getElementById('kon-list-close');
        const searchInput = document.getElementById('kon-search-input');

        // 닫기 버튼
        closeBtn.addEventListener('click', hideKonList);

        // 검색 입력
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                loadKonList(e.target.value);
            }, 300);
        });

        // 패널 외부 클릭시 닫기
        document.addEventListener('click', (e) => {
            if (konListPanel && isKonListVisible && !konListPanel.contains(e.target) && !e.target.closest('#kon-list-toggle')) {
                hideKonList();
            }
        });
    }

    // 콘 목록 로드
    async function loadKonList(search = '') {
        const loadingEl = document.getElementById('kon-list-loading');
        const itemsEl = document.getElementById('kon-list-items');
        const errorEl = document.getElementById('kon-list-error');

        // 로딩 상태 표시
        loadingEl.style.display = 'flex';
        itemsEl.style.display = 'none';
        errorEl.style.display = 'none';

        try {
            const response = await fetchKonList(search, 50, 0); // 최대 50개

            if (response.success) {
                currentKonList = response.data.kons;
                renderKonList(currentKonList);
            } else {
                throw new Error(response.message || '콘 목록을 불러올 수 없습니다.');
            }
        } catch (error) {
            console.error('콘 목록 로드 오류:', error);
            loadingEl.style.display = 'none';
            errorEl.style.display = 'block';
            errorEl.textContent = error.message;
        }
    }

    // 콘 목록 렌더링
    function renderKonList(kons) {
        const loadingEl = document.getElementById('kon-list-loading');
        const itemsEl = document.getElementById('kon-list-items');
        const errorEl = document.getElementById('kon-list-error');

        loadingEl.style.display = 'none';
        errorEl.style.display = 'none';

        if (kons.length === 0) {
            itemsEl.innerHTML = '<div style="padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">콘이 없습니다.</div>';
        } else {
            itemsEl.innerHTML = kons.map(kon => `
                <div class="kon-item" data-kon-name="${kon.name}" style="
                    display: flex;
                    align-items: center;
                    padding: 12px;
                    margin-bottom: 4px;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                " onmouseover="this.style.backgroundColor='${document.documentElement.classList.contains('dark') ? '#3f3f46' : '#f9fafb'}'"
                   onmouseout="this.style.backgroundColor='transparent'">
                    <img src="${kon.imageUrl}" alt="${kon.name}" style="
                        width: 40px;
                        height: 40px;
                        object-fit: cover;
                        border-radius: 6px;
                        margin-right: 12px;
                        border: 1px solid #e5e7eb;
                    " onerror="this.src='${FALLBACK_IMAGE_URL}'">
                    <div style="flex: 1; min-width: 0;">
                        <div style="font-weight: 500; font-size: 14px; margin-bottom: 2px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                            ${kon.name}
                        </div>
                        ${kon.description ? `<div style="font-size: 12px; color: #6b7280; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${kon.description}</div>` : ''}
                    </div>
                </div>
            `).join('');
        }

        itemsEl.style.display = 'block';

        // 콘 클릭 이벤트 추가
        itemsEl.querySelectorAll('.kon-item').forEach(item => {
            item.addEventListener('click', () => {
                const konName = item.dataset.konName;
                insertKonToComment(konName);
                hideKonList();
            });
        });
    }

    // 댓글창에 콘 텍스트 삽입
    function insertKonToComment(konName) {
        const textarea = document.querySelector(COMMENT_TEXTAREA_SELECTOR);

        if (textarea) {
            const currentValue = textarea.value;
            const newValue = currentValue + (currentValue ? ' ' : '') + konName;

            textarea.value = newValue;
            textarea.focus();

            // 커서를 끝으로 이동
            textarea.setSelectionRange(newValue.length, newValue.length);

            // 이벤트 발생 (React 등에서 감지할 수 있도록)
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));

            console.log(`댓글창에 "${konName}" 삽입 완료`);
        } else {
            console.warn('댓글창을 찾을 수 없습니다.');
        }
    }

    // 버튼 상태 추적
    let konButtonCreated = false;

    // 콘 목록 토글 버튼 생성
    function createKonToggleButton() {
        // 이미 버튼이 있고 DOM에 존재하면 재생성하지 않음
        const existingBtn = document.getElementById('kon-list-toggle');
        if (existingBtn && document.body.contains(existingBtn)) {
            return;
        }

        // 기존 버튼 제거
        if (existingBtn) {
            existingBtn.remove();
        }

        konButtonCreated = true;

        // 우측 하단 버튼 영역 찾기 (여러 셀렉터로 시도)
        let buttonContainer = null;

        // 첫 번째 시도: 고정된 우측 하단 버튼 영역
        const floatingButtons = document.querySelector('.fixed.inset-x-0.bottom-0 .flex.gap-2, .fixed .flex.gap-2');
        if (floatingButtons) {
            buttonContainer = floatingButtons;
        }

        // 두 번째 시도: opacity가 있는 우측 하단 버튼들
        if (!buttonContainer) {
            const opacityContainer = document.querySelector('.opacity-80.hover\\:opacity-100');
            if (opacityContainer) {
                buttonContainer = opacityContainer;
            }
        }

        // 세 번째 시도: XPath 기반으로 찾기
        if (!buttonContainer) {
            const xpath = '/html/body/div[1]/div/main/div/div/div/div[1]/div[6]/div/div/div';
            const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
            if (result.singleNodeValue) {
                buttonContainer = result.singleNodeValue;
            }
        }

        // 네 번째 시도: 일반적인 우측 하단 고정 버튼 영역 찾기
        if (!buttonContainer) {
            const fixedBottomElements = document.querySelectorAll('[style*="position: fixed"], .fixed');
            for (const element of fixedBottomElements) {
                const style = window.getComputedStyle(element);
                const rect = element.getBoundingClientRect();

                // 우측 하단에 있는 요소 찾기
                if ((style.position === 'fixed' || element.classList.contains('fixed')) &&
                    rect.right > window.innerWidth * 0.7 &&
                    rect.bottom > window.innerHeight * 0.7) {

                    // flex gap이 있는 컨테이너 찾기
                    const flexContainer = element.querySelector('.flex.gap-2, [style*="gap"]');
                    if (flexContainer) {
                        buttonContainer = flexContainer;
                        break;
                    }
                }
            }
        }

        if (!buttonContainer) {
            console.warn('우측 하단 버튼 영역을 찾을 수 없습니다. 기본 위치에 버튼을 생성합니다.');
            // 기본 위치에 버튼 생성
            createFloatingKonButton();
            return;
        }

        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'kon-list-toggle';
        toggleBtn.innerHTML = `
            <div class="kon-button-inner" style="
                display: flex;
                align-items: center;
                justify-content: center;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: #10b981;
                color: white;
                cursor: pointer;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                font-size: 20px;
                user-select: none;
                pointer-events: auto;
            ">🥤</div>
        `;
        toggleBtn.title = '콘 목록 보기';
        toggleBtn.style.cssText = `
            pointer-events: auto;
            z-index: 10000;
            position: relative;
        `;

        // 기존 버튼들과 동일한 스타일 적용
        const existingButton = buttonContainer.querySelector('div');
        if (existingButton) {
            const buttonStyle = window.getComputedStyle(existingButton);
            const innerDiv = toggleBtn.querySelector('.kon-button-inner');

            // 기존 버튼과 비슷한 스타일 적용
            innerDiv.style.width = buttonStyle.width || '40px';
            innerDiv.style.height = buttonStyle.height || '40px';
            innerDiv.style.backgroundColor = '#10b981'; // 콘 색상 (녹색)
            innerDiv.style.border = buttonStyle.border || '1px solid #e5e7eb';

            // 다크 모드 확인
            if (document.documentElement.classList.contains('dark')) {
                innerDiv.style.backgroundColor = '#059669';
                innerDiv.style.borderColor = '#3f3f46';
            }
        }

        // 이벤트 리스너 추가 (한 번만)
        toggleBtn.addEventListener('click', handleKonButtonClick, { once: false });
        toggleBtn.addEventListener('mouseenter', handleKonButtonHover, { passive: true });
        toggleBtn.addEventListener('mouseleave', handleKonButtonLeave, { passive: true });

        // 기존 버튼들과 함께 배치
        buttonContainer.appendChild(toggleBtn);
        console.log('콘 목록 버튼이 우측 하단 버튼 영역에 추가되었습니다.');
    }

    // 이벤트 핸들러들을 별도 함수로 분리
    function handleKonButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        console.log('콘 버튼 클릭됨');
        toggleKonList();
    }

    function handleKonButtonHover(e) {
        const innerDiv = e.currentTarget.querySelector('.kon-button-inner');
        if (innerDiv) {
            innerDiv.style.transform = 'scale(1.05)';
            innerDiv.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#047857' : '#059669';
        }
    }

    function handleKonButtonLeave(e) {
        const innerDiv = e.currentTarget.querySelector('.kon-button-inner');
        if (innerDiv) {
            innerDiv.style.transform = 'scale(1)';
            innerDiv.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#059669' : '#10b981';
        }
    }

    // 기본 위치에 떠있는 버튼 생성 (백업 방법)
    function createFloatingKonButton() {
        const toggleBtn = document.createElement('div');
        toggleBtn.id = 'kon-list-toggle';
        toggleBtn.style.cssText = `
            position: fixed;
            bottom: 80px;
            right: 80px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background-color: #10b981;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 10000;
            transition: all 0.3s ease;
            font-size: 24px;
            user-select: none;
            pointer-events: auto;
            ${document.documentElement.classList.contains('dark') ? 'background-color: #059669;' : ''}
        `;
        toggleBtn.innerHTML = '🥤';
        toggleBtn.title = '콘 목록 보기';

        toggleBtn.addEventListener('click', handleKonButtonClick, { once: false });
        toggleBtn.addEventListener('mouseenter', (e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#047857' : '#059669';
        }, { passive: true });

        toggleBtn.addEventListener('mouseleave', (e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.backgroundColor = document.documentElement.classList.contains('dark') ? '#059669' : '#10b981';
        }, { passive: true });

        document.body.appendChild(toggleBtn);
        console.log('콘 목록 버튼이 기본 위치에 생성되었습니다.');
    }

    // 콘 목록 표시/숨김 토글
    function toggleKonList() {
        if (isKonListVisible) {
            hideKonList();
        } else {
            showKonList();
        }
    }

    // 콘 목록 표시
    function showKonList() {
        if (!konListPanel) {
            createKonListUI();
        }

        konListPanel.style.display = 'block';
        isKonListVisible = true;

        // 처음 열 때만 콘 목록 로드
        if (currentKonList.length === 0) {
            loadKonList();
        }
    }

    // 콘 목록 숨김
    function hideKonList() {
        if (konListPanel) {
            konListPanel.style.display = 'none';
        }
        isKonListVisible = false;
    }

    // === 초기화 및 DOM 감지 ===

    function initializeKonSystem() {
        // 콘 이미지 삽입 실행
        insertImageForKonElements();

        // 콘 목록 버튼 생성 (중복 체크 포함)
        if (!document.getElementById('kon-list-toggle')) {
            createKonToggleButton();
        }
    }

    // DOM 변화 감지 (디바운싱 적용)
    let observerTimeout;
    function observeChanges() {
        const observer = new MutationObserver(function(mutations) {
            let shouldCheckImages = false;
            let shouldCheckButton = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            shouldCheckImages = true;

                            // 버튼이 없어진 경우에만 재생성 체크
                            if (!document.getElementById('kon-list-toggle')) {
                                shouldCheckButton = true;
                            }
                        }
                    });
                }
            });

            if (shouldCheckImages || shouldCheckButton) {
                // 디바운싱: 100ms 내에 여러 변화가 있으면 마지막 것만 실행
                clearTimeout(observerTimeout);
                observerTimeout = setTimeout(() => {
                    if (shouldCheckImages) {
                        insertImageForKonElements();
                    }
                    if (shouldCheckButton) {
                        createKonToggleButton();
                    }
                }, 100);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 페이지 로드 완료 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                initializeKonSystem();
                observeChanges();
            }, 500);
        });
    } else {
        setTimeout(() => {
            initializeKonSystem();
            observeChanges();
        }, 500);
    }

    // 페이지 로드 이벤트
    window.addEventListener('load', function() {
        setTimeout(initializeKonSystem, 1000);
    });

    // URL 변경 감지 (SPA 대응)
    let currentUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== currentUrl) {
            currentUrl = location.href;

            // 캐시 클리어
            apiCache.clear();
            konListCache.clear();
            currentKonList = [];

            // 버튼 상태 초기화
            konButtonCreated = false;

            // UI 정리
            if (konListPanel) {
                konListPanel.remove();
                konListPanel = null;
                isKonListVisible = false;
            }

            // 기존 버튼 제거
            const existingBtn = document.getElementById('kon-list-toggle');
            if (existingBtn) {
                existingBtn.remove();
            }

            setTimeout(initializeKonSystem, 1000);
        }
    }).observe(document, { subtree: true, childList: true });

})();