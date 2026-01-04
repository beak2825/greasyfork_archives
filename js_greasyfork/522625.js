// ==UserScript==
// @name         아카라이브 듀얼스크린
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  아카라이브의 게시글을 게시글과 게시글 목록으로 나누어 듀얼스크린으로 변경합니다.
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @author       스토커
// @match        *://*.arca.live/b/*/*
// @exclude      *://*.arca.live/b/*/write*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/522625/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%93%80%EC%96%BC%EC%8A%A4%ED%81%AC%EB%A6%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/522625/%EC%95%84%EC%B9%B4%EB%9D%BC%EC%9D%B4%EB%B8%8C%20%EB%93%80%EC%96%BC%EC%8A%A4%ED%81%AC%EB%A6%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // write 페이지면 아예 실행하지 않음
    if (window.location.href.includes('/write') || window.location.href.includes('/edit')) {
        return;
    }

    const style = document.createElement('style');
    style.textContent = `
        :root {
            color-scheme: light dark;
        }

        body {
            padding: 0;
            overflow: hidden;
            background: var(--color-bg-body) !important;
        }

        html, html.theme-light {
            background: var(--color-bg-root) !important;
        }

        .dual-screen-container {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            width: 100%;
            margin: 0;
            padding: 0;
            background: var(--color-bg-main);
            border: none;
            height: 100vh;
            min-height: 100vh;
            position: fixed;
            overflow: hidden;
        }

        .left-panel, .right-panel {
            height: 100%;
            position: relative;
            background: var(--color-bg-main);
            color: var(--color-text);
        }

        .left-panel {
            min-width: 200px;
            flex: 2;
            padding: 0;
            border-right: 1px solid var(--color-bd-inner);
            overflow-y: auto;
            overscroll-behavior-y: contain !important;
        }

        .left-panel .navbar {
            position: relative !important;
            width: 100%;
            background: var(--color-bg-navbar) !important;
            z-index: 100;
            color: var(--color-text-opposite) !important;
        }

        .left-panel .navbar a .nav-link {
            color: var(--color-text-opposite) !important;
        }

        .left-panel .board-title {
            position: relative !important;
            width: 100%;
            background: var(--color-bg-main) !important;
            margin: 0em 0rem 0rem 0rem !important;
            padding: 10px;
            border-bottom: 1px solid var(--color-bd-inner);
            z-index: 99;
        }

        .resize-handle {
            width: 6px;
            background: var(--color-bd-inner);
            cursor: col-resize;
            transition: background 0.3s;
            position: relative;
            min-height: 100vh;
            height: 100%;
            flex-shrink: 0;
            z-index: 1000;
        }

        .resize-handle:hover {
            background: var(--color-bd-outer);
        }

        .resize-handle.dragging {
            background: var(--color-bd-outer);
        }

        .left-panel .content-container {
            display: flex;
            flex-direction: column;
        }

        .left-panel .navbar {
            position: relative !important; /* 변경: fixed -> relative */
            width: 100%;
            background: #4f5464 !important;
            z-index: 100;
            color: #fff !important;
        }

        .left-panel .navbar a .nav-item dropdown:not {
            color: #fff !important;
        }

        .left-panel .navbar .nav-link {
            color: #fff !important;
        }

        .user-dropdown-menu {
            left: -50% !important;
        }

        .noti-dropdown-menu{
            left: -50% !important;
        }

        .left-panel .board-title {
            position: relative !important; /* 변경: fixed -> relative */
            width: 100%;
            background: #fff;
            margin: 0em 0rem 0rem 0rem !important; /* 변경: margin 값 조정 */
            padding: 10px;
            border-bottom: 1px solid #ddd;
            z-index: 99;
        }

        .left-panel .article-body {
            margin-top: 0 !important;
            padding: 10px;
        }

        .left-panel .navbar .navbar-brand svg {
            width: 21px;
            height: 21px;
        }

        .right-panel {
            min-width: 200px;
            flex: 1;
            display: flex;
            flex-direction: column;
            flex-shrink: 0; // 추가: 패널이 가로로 축소되지 않도록 함
        }

        .right-panel .right-sidebar {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            margin: 0;
        }

        .right-panel .included-article-list-wrapper {
            flex: 1;
            overflow-y: auto;
            padding: 0px;
            overscroll-behavior: contain;
            touch-action: pan-y;
            padding-bottom: 3rem;
        }

        .right-panel .included-article-list {
            marin-top: 0 !important;
    }

        .right-panel .footer {
            padding: 10px;
            border-top: 1px solid #ddd;
        }

        .reply-form__user-info__avatar{
            width: 1.4em !important;
        }

        .board-category-wrapper {
            overflow-x: auto !important;
            white-space: nowrap !important;
            cursor: grab !important;
            user-select: none !important;
        }

        .board-category-wrapper.dragging {
            cursor: grabbing !important;
        }

        .board-category {
            display: flex !important;
            flex-wrap: nowrap !important;
            padding-bottom: 5px !important;
        }

        .board-category a {
            pointer-events: auto !important;
        }

        .board-category.dragging a {
            pointer-events: none !important;
        }

    `;

    // Add dark theme support
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('theme-dark');
    }

    // Watch for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (e.matches) {
            document.documentElement.classList.add('theme-dark');
        } else {
            document.documentElement.classList.remove('theme-dark');
        }
    });

    document.head.appendChild(style);

    // 설정 관리를 위한 객체 추가
    const Settings = {
        storageKey: 'arcalive_dualscreen_settings',
        defaults: {
            isSwapped: false,
            leftPanelWidth: '66.66%',
            rightPanelWidth: '33.33%'
        },

        scrollStorageKey: 'arcalive_dualscreen_scroll',

        // 스크롤 위치 저장
        saveScrollPosition(channelName, articleId, leftScroll, rightScroll) {
            try {
                const scrollData = this.loadScrollPositions();

                // 채널별 스크롤 위치 저장
                if (!scrollData.channels[channelName]) {
                    scrollData.channels[channelName] = {};
                }
                scrollData.channels[channelName].scroll = rightScroll;

                // 게시글별 스크롤 위치 저장
                if (articleId) {
                    if (!scrollData.articles) scrollData.articles = {};
                    scrollData.articles[articleId] = leftScroll;
                }

                localStorage.setItem(this.scrollStorageKey, JSON.stringify(scrollData));
            } catch (e) {
                console.error('스크롤 위치 저장 실패:', e);
            }
        },

        // 스크롤 위치 불러오기
        loadScrollPositions() {
            try {
                const saved = localStorage.getItem(this.scrollStorageKey);
                return saved ? JSON.parse(saved) : { channels: {}, articles: {} };
            } catch (e) {
                console.error('스크롤 위치 로드 실패:', e);
                return { channels: {}, articles: {} };
            }
        },

        // 특정 게시글/채널의 스크롤 위치 가져오기
        getScrollPosition(channelName, articleId) {
            const scrollData = this.loadScrollPositions();
            return {
                leftScroll: articleId ? scrollData.articles[articleId] || 0 : 0,
                rightScroll: scrollData.channels[channelName]?.scroll || 0
            };
        },

        // load() 함수 수정
        load() {
            try {
                const saved = localStorage.getItem(this.storageKey);
                if (!saved) {
                    return this.defaults;
                }
                const parsed = JSON.parse(saved);
                // 저장된 값이 있으면 기본값과 병합
                return {
                    ...this.defaults,
                    ...parsed
                };
            } catch (e) {
                console.error('설정 로드 실패:', e);
                return this.defaults;
            }
        },

        save(settings) {
            try {
                // 숫자를 백분율 문자열로 변환하여 저장
                const saveData = {
                    isSwapped: settings.isSwapped,
                    leftPanelWidth: typeof settings.leftPanelWidth === 'number' ?
                        settings.leftPanelWidth + '%' : settings.leftPanelWidth,
                    rightPanelWidth: typeof settings.rightPanelWidth === 'number' ?
                        settings.rightPanelWidth + '%' : settings.rightPanelWidth
                };
                localStorage.setItem(this.storageKey, JSON.stringify(saveData));
            } catch (e) {
                console.error('설정 저장 실패:', e);
            }
        },

        // 현재 레이아웃 상태 저장
        saveCurrentLayout(isSwapped, leftPanel, rightPanel) {
            const totalWidth = leftPanel.parentElement.offsetWidth - 6; // 핸들바 너비(6px) 제외
            const leftWidth = (leftPanel.offsetWidth / totalWidth) * 100;
            const rightWidth = (rightPanel.offsetWidth / totalWidth) * 100;

            this.save({
                isSwapped: isSwapped,
                leftPanelWidth: leftWidth,
                rightPanelWidth: rightWidth
            });
        }
    };

    function initializeDualScreen() {

        const navbar = document.querySelector('.navbar');
        const boardTitle = document.querySelector('.board-title');
        const articleWrapper = document.querySelector('.article-wrapper');
        const includedArticles = document.querySelector('.included-article-list');
        const rightSidebar = document.querySelector('.right-sidebar');
        const footer = document.querySelector('.footer');

        if (!articleWrapper || !includedArticles) return;

        // 컨테이너 생성
        const container = document.createElement('div');
        container.className = 'dual-screen-container';

        // 좌측 패널
        const leftPanel = document.createElement('div');
        leftPanel.className = 'left-panel';

        // 좌측 패널 내부 컨테이너 생성
        const contentContainer = document.createElement('div');
        contentContainer.className = 'content-container';

        // navbar와 board-title을 content-container에 추가
        if (navbar) {
            const navbarClone = navbar.cloneNode(true);
            contentContainer.appendChild(navbarClone);
        }

        if (boardTitle) {
            const boardTitleClone = boardTitle.cloneNode(true);
            contentContainer.appendChild(boardTitleClone);
        }

        // article-wrapper를 article-body div로 감싸서 추가
        const articleBody = document.createElement('div');
        articleBody.className = 'article-body';

        // DOM 구조와 이벤트를 모두 복제하는 함수
        function cloneWithEvents(originalElement) {
            const clone = originalElement.cloneNode(true);

            // 인라인 이벤트 속성 복사 (onclick 등)
            Array.from(originalElement.attributes).forEach(attr => {
                if (attr.name.startsWith('on')) {
                    clone.setAttribute(attr.name, attr.value);
                }
            });

            // 자식 요소들도 이벤트와 함께 복제
            Array.from(originalElement.getElementsByTagName('*')).forEach((element, index) => {
                const clonedElement = clone.getElementsByTagName('*')[index];
                if (clonedElement) {
                    // 모든 이벤트 리스너 복제
                    const eventTypes = ['click', 'mousedown', 'mouseup', 'mouseover', 'mouseout',
                        'mousemove', 'submit', 'change', 'input'];

                    eventTypes.forEach(type => {
                        element.addEventListener(type, (event) => {
                            // 원본 요소에서 이벤트 발생시키기
                            const newEvent = new Event(type, {
                                bubbles: true,
                                cancelable: true,
                                composed: true
                            });
                            Object.defineProperty(newEvent, 'target', {
                                value: element,
                                enumerable: true
                            });
                            element.dispatchEvent(newEvent);
                        });
                    });

                    // 인라인 이벤트 핸들러 복사
                    Array.from(element.attributes).forEach(attr => {
                        if (attr.name.startsWith('on')) {
                            clonedElement.setAttribute(attr.name, attr.value);
                        }
                    });
                }
            });

            // 1. originalElement에 달린 모든 이벤트 리스너를 복제된 요소로 전달
            clone.addEventListener('click', (e) => {
                // 외부 스크립트 버튼 클릭은 원본에게 위임
                const isExtension = e.target.closest('[class*="MuiButton"], [class*="external-handler"], [id*="download"], [class*="css-"]');
                if (isExtension) {
                    e.preventDefault();
                    e.stopPropagation();

                    const originalTarget = findOriginalElement(e.target, originalElement, clone);
                    if (originalTarget) {
                        originalTarget.click();
                    }
                    return;
                }
            }, true);

            // 2. 모든 자식 요소들의 이벤트도 위임처리
            const processNode = (original, cloned) => {
                // data 속성 복사
                [...original.attributes].forEach(attr => {
                    if (attr.name.startsWith('data-')) {
                        cloned.setAttribute(attr.name, attr.value);
                    }
                });

                // 자식요소들 재귀적으로 처리
                const originalChildren = original.children;
                const clonedChildren = cloned.children;

                for (let i = 0; i < originalChildren.length; i++) {
                    processNode(originalChildren[i], clonedChildren[i]);
                }
            };

            processNode(originalElement, clone);

            return clone;
        }

        // 동적 변경사항을 감시하고 처리하는 MutationObserver 설정
        function setupDynamicContentObserver(originalContainer, clonedContainer) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType === 1) { // Element node
                                // 새로 추가된 요소를 찾아서 복제
                                const clonedNode = cloneWithEvents(node);
                                const similarNodes = clonedContainer.querySelectorAll(`*[class="${node.className}"]`);
                                if (similarNodes.length > 0) {
                                    similarNodes[0].replaceWith(clonedNode);
                                } else {
                                    clonedContainer.appendChild(clonedNode);
                                }
                            }
                        });
                    }
                    else if (mutation.type === 'attributes') {
                        // 속성 변경 동기화
                        const target = mutation.target;
                        const clonedTarget = clonedContainer.querySelector(`*[class="${target.className}"]`);
                        if (clonedTarget) {
                            clonedTarget.setAttribute(mutation.attributeName,
                                target.getAttribute(mutation.attributeName));
                        }
                    }
                });
            });

            observer.observe(originalContainer, {
                childList: true,
                subtree: true,
                attributes: true,
                characterData: true
            });

            return observer;
        }

        // 원본 요소 찾기 함수 추가
        function findOriginalElement(clonedElement, originalRoot, clonedRoot) {
            const path = [];
            let element = clonedElement;

            while (element && element !== clonedRoot) {
                const parent = element.parentElement;
                if (!parent) break;

                const index = Array.from(parent.children).indexOf(element);
                path.unshift({
                    index,
                    className: element.className,
                    id: element.id,
                    tagName: element.tagName
                });
                element = parent;
            }

            return path.reduce((current, pathItem) => {
                if (!current) return null;

                // className, id, tagName으로 매칭
                const children = Array.from(current.children);
                return children.find(child =>
                    child.tagName === pathItem.tagName &&
                    child.className === pathItem.className &&
                    (!pathItem.id || child.id === pathItem.id)
                );
            }, originalRoot);
        }

        // article-wrapper 복제 시 이벤트도 함께 복제
        const clonedArticleWrapper = cloneWithEvents(articleWrapper);
        const articleObserver = setupDynamicContentObserver(articleWrapper, clonedArticleWrapper);

        // included articles 복제 시 이벤트도 함께 복제
        const clonedIncludedArticles = cloneWithEvents(includedArticles);
        const includedArticlesObserver = setupDynamicContentObserver(includedArticles, clonedIncludedArticles);

        // 페이지 언로드 시 옵저버 정리
        window.addEventListener('unload', () => {
            articleObserver.disconnect();
            includedArticlesObserver.disconnect();
        });

        // Deep clone the article wrapper with all event listeners
        // const clonedArticleWrapper = articleWrapper.cloneNode(true); <- 이 부분 제거

        // Re-attach event handlers for rating forms and share button
        const originalRateUpForm = articleWrapper.querySelector('#rateUpForm');
        const originalRateDownForm = articleWrapper.querySelector('#rateDownForm');
        const originalShareBtn = articleWrapper.querySelector('#articleShareBtn');
        const clonedRateUpForm = clonedArticleWrapper.querySelector('#rateUpForm');
        const clonedRateDownForm = clonedArticleWrapper.querySelector('#rateDownForm');
        const clonedShareBtn = clonedArticleWrapper.querySelector('#articleShareBtn');

        // 추천 버튼 이벤트 처리
        if (originalRateUpForm && clonedRateUpForm) {
            clonedRateUpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitEvent = new Event('submit', {
                    bubbles: true,
                    cancelable: true
                });
                originalRateUpForm.dispatchEvent(submitEvent);
                return false;
            });
        }

        // 비추천 버튼 이벤트 처리
        if (originalRateDownForm && clonedRateDownForm) {
            clonedRateDownForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const submitEvent = new Event('submit', {
                    bubbles: true,
                    cancelable: true
                });
                originalRateDownForm.dispatchEvent(submitEvent);
                return false;
            });
        }

        // 공유 버튼 이벤트 처리
        if (originalShareBtn && clonedShareBtn) {
            clonedShareBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                originalShareBtn.dispatchEvent(clickEvent);
                return false;
            });
        }

        // 평가 결과 동기화를 위한 MutationObserver 설정
        const ratingObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const originalCount = mutation.target;
                const targetId = originalCount.id;
                const clonedCount = clonedArticleWrapper.querySelector(`#${targetId}`);
                if (clonedCount) {
                    clonedCount.textContent = originalCount.textContent;
                }
            });
        });

        // 모든 평가 관련 요소 감시
        const ratingElements = articleWrapper.querySelectorAll('#ratingUp, #ratingDown, #ratingUpIp, #ratingDownIp');
        ratingElements.forEach(element => {
            ratingObserver.observe(element, {
                childList: true,
                characterData: true,
                subtree: true
            });
        });

        articleBody.appendChild(clonedArticleWrapper);
        contentContainer.appendChild(articleBody);

        // content-container를 left-panel에 추가
        leftPanel.appendChild(contentContainer);

        // 리사이즈 핸들
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle';

        // 우측 패널
        const rightPanel = document.createElement('div');
        rightPanel.className = 'right-panel';

        // 우측 사이드바 wrapper
        if (rightSidebar) {
            rightPanel.appendChild(rightSidebar);
        }

        // included articles wrapper
        const includedArticlesWrapper = document.createElement('div');
        includedArticlesWrapper.className = 'included-article-list-wrapper';

        // 여기서 중복 선언 제거
        // const clonedIncludedArticles = includedArticles.cloneNode(true); <- 이 줄 삭제

        // 이미 위에서 cloneWithEvents로 복제한 clonedIncludedArticles를 사용
        includedArticlesWrapper.appendChild(clonedIncludedArticles);
        rightPanel.appendChild(includedArticlesWrapper);

        // 카테고리 스크롤 기능을 위한 이벤트 핸들러 추가
        const categoryWrappers = clonedIncludedArticles.querySelectorAll('.board-category');

        // 카테고리 드래그 상태 공유를 위한 전역 변수
        let isDragging = false;

        // 카테고리 드래그 이벤트 핸들러 수정
        if (categoryWrappers?.length) {
            categoryWrappers.forEach(category => {
                let startX;
                let startScrollLeft;
                let startTime;
                let lastMoveTime;

                category.addEventListener('mousedown', (e) => {
                    startX = e.pageX;
                    startScrollLeft = category.scrollLeft;
                    startTime = Date.now();
                    lastMoveTime = startTime;
                    isDragging = false; // 드래그 시작시 초기화
                });

                category.addEventListener('mousemove', (e) => {
                    if (!startX) return;

                    const walk = e.pageX - startX;
                    if (Math.abs(walk) > 5) {
                        isDragging = true;
                        category.scrollLeft = startScrollLeft - walk;
                        lastMoveTime = Date.now();
                    }
                });

                category.addEventListener('mouseup', () => {
                    startX = null;
                    // isDragging은 약간 지연 후 false로 설정
                    setTimeout(() => {
                        isDragging = false;
                    }, 50);
                });

                category.addEventListener('mouseleave', () => {
                    startX = null;
                    isDragging = false;
                });
            });
        }

        includedArticlesWrapper.appendChild(clonedIncludedArticles);
        rightPanel.appendChild(includedArticlesWrapper);

        // footer 이동
        if (footer) {
            rightPanel.appendChild(footer);
        }

        // 조립
        container.appendChild(leftPanel);
        container.appendChild(resizeHandle);
        container.appendChild(rightPanel);

        // 저장된 설정 로드하고 isPanelsSwapped 초기화
        const settings = Settings.load();
        let isPanelsSwapped = settings.isSwapped;

        // 초기 레이아웃 설정
        const applyLayout = () => {
            const settings = Settings.load();

            leftPanel.style.width = settings.leftPanelWidth;
            leftPanel.style.flex = 'none';
            rightPanel.style.width = settings.rightPanelWidth;
            rightPanel.style.flex = 'none';

            // container.innerHTML = ''; 대신 자식 요소들만 제거
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }

            // 스왑 상태에 따라 순서만 변경
            if (isPanelsSwapped) {
                container.appendChild(rightPanel);
                container.appendChild(resizeHandle);
                container.appendChild(leftPanel);
            } else {
                container.appendChild(leftPanel);
                container.appendChild(resizeHandle);
                container.appendChild(rightPanel);
            }
        };

        // 초기 레이아웃 적용
        applyLayout();

        // URL에서 채널명과 게시글 ID 추출
        const urlParts = window.location.pathname.split('/');
        const channelName = urlParts[2];
        const articleId = urlParts[3];

        // 스크롤 이벤트 처리 함수
        const handleScroll = () => {
            const leftScroll = leftPanel.scrollTop;
            const rightScroll = rightPanel.querySelector('.included-article-list-wrapper').scrollTop;
            Settings.saveScrollPosition(channelName, articleId, leftScroll, rightScroll);
        };

        // 스크롤 이벤트 리스너 등록 (디바운스 적용)
        let scrollTimeout;
        leftPanel.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 100);
        });

        const rightScrollElement = rightPanel.querySelector('.included-article-list-wrapper');
        rightScrollElement.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(handleScroll, 100);
        });

        // 초기 스크롤 위치 복원
        const restoreScrollPosition = () => {
            const { leftScroll, rightScroll } = Settings.getScrollPosition(channelName, articleId);
            if (leftScroll) leftPanel.scrollTop = leftScroll;
            if (rightScroll) rightScrollElement.scrollTop = rightScroll;
        };

        // DOM이 완전히 로드된 후 스크롤 위치 복원
        setTimeout(restoreScrollPosition, 100);

        // 패널 스왑 함수 수정
        const swapPanels = () => {
            isPanelsSwapped = !isPanelsSwapped;

            // 현재 패널들의 너비를 백분율로 계산
            const totalWidth = container.offsetWidth - 6;
            const biggerWidth = Math.max(leftPanel.offsetWidth, rightPanel.offsetWidth);
            const smallerWidth = Math.min(leftPanel.offsetWidth, rightPanel.offsetWidth);

            // 더 큰 패널의 비율을 계산
            const biggerRatio = (biggerWidth / totalWidth) * 100;
            const smallerRatio = (smallerWidth / totalWidth) * 100;

            // 현재 왼쪽 패널이 더 큰지 여부 확인
            const isLeftBigger = leftPanel.offsetWidth > rightPanel.offsetWidth;

            // 스왑 후에는 비율을 반대로 적용
            if (isLeftBigger) {
                leftPanel.style.width = `${smallerRatio}%`;
                rightPanel.style.width = `${biggerRatio}%`;
            } else {
                leftPanel.style.width = `${biggerRatio}%`;
                rightPanel.style.width = `${smallerRatio}%`;
            }

            applyLayout();
            Settings.saveCurrentLayout(isPanelsSwapped, leftPanel, rightPanel);
        };

        // 더블클릭 이벤트 추가
        resizeHandle.addEventListener('dblclick', swapPanels);

        // 원래 요소 교체 및 제거
        articleWrapper.parentNode.replaceChild(container, articleWrapper);
        includedArticles.remove();
        if (rightSidebar) rightSidebar.remove();
        if (footer) footer.remove();
        if (navbar) navbar.remove();
        if (boardTitle) boardTitle.remove();

        // 리사이징 이벤트 설정
        let isResizing = false;
        let startX, startWidth;

        const handleResize = (e) => {
            if (!isResizing) return;

            const containerWidth = container.offsetWidth;
            const minWidth = 200;
            const maxWidth = containerWidth - minWidth;

            const currentX = e.pageX;
            const diffX = currentX - startX;
            const targetPanel = isPanelsSwapped ? rightPanel : leftPanel;
            const otherPanel = isPanelsSwapped ? leftPanel : rightPanel;

            let newWidth = startWidth + diffX;
            newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
            const otherWidth = containerWidth - newWidth - 6;

            // 너비 적용
            targetPanel.style.width = `${newWidth}px`;
            targetPanel.style.flex = 'none';
            otherPanel.style.width = `${otherWidth}px`;
            otherPanel.style.flex = 'none';

            // mousemove 이벤트에서 실시간으로 저장하도록 수정
            const totalWidth = container.offsetWidth - 6;
            const leftWidth = parseFloat((leftPanel.offsetWidth / totalWidth) * 100).toFixed(2);
            const rightWidth = parseFloat((rightPanel.offsetWidth / totalWidth) * 100).toFixed(2);

            Settings.save({
                isSwapped: isPanelsSwapped,
                leftPanelWidth: leftWidth + '%',
                rightPanelWidth: rightWidth + '%'
            });
        };

        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            resizeHandle.classList.add('dragging');
            startX = e.pageX;
            startWidth = (isPanelsSwapped ? rightPanel : leftPanel).offsetWidth;  // isSwapped -> isPanelsSwapped
        });

        document.addEventListener('mousemove', handleResize);

        // mouseup 이벤트 리스너에서는 저장 로직 제거
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                resizeHandle.classList.remove('dragging');
            }
        });

        // 윈도우 리사이즈 대응
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(applyLayout, 100);
        });

        // 게시글 목록 비동기 로드 함수 수정
        async function loadArticleList(url, pushState = true) {
            try {
                // URL에 페이지 파라미터가 없으면 p=1 추가
                const targetUrl = new URL(url, window.location.origin);
                if (!targetUrl.searchParams.has('p')) {
                    targetUrl.searchParams.set('p', '1');
                }
                url = targetUrl.toString();

                const response = await fetch(url);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // list-table 구조가 다른 경우를 고려해 선택자 수정
                const newListTable = doc.querySelector('.list-table.table, .list-table.hybrid');
                const currentListTable = rightPanel.querySelector('.list-table.table, .list-table.hybrid');

                if (!newListTable || !currentListTable) return;

                // 카테고리 관련 요소도 업데이트
                const newBoardCategory = doc.querySelector('.board-category-wrapper');
                const currentBoardCategory = rightPanel.querySelector('.board-category-wrapper');

                if (newBoardCategory && currentBoardCategory) {
                    currentBoardCategory.replaceWith(cloneWithEvents(newBoardCategory));
                }

                // URL과 현재 상태 파싱
                const currentUrl = new URL(url, window.location.origin);
                const category = currentUrl.searchParams.get('category');
                const page = currentUrl.searchParams.get('p');
                const mode = currentUrl.searchParams.get('mode');

                // 카테고리 활성화 상태 업데이트와 클릭 이벤트 처리 통합
                const categoryLinks = rightPanel.querySelectorAll('.board-category a');
                categoryLinks.forEach(link => {
                    // 활성화 상태 업데이트
                    const linkUrl = new URL(link.href);
                    const linkCategory = linkUrl.searchParams.get('category');
                    if ((!category && !linkCategory && link.classList.contains('active')) ||
                        (linkCategory === category)) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }

                    // 기존 이벤트 리스너 제거 및 새로운 이벤트 리스너 추가
                    const newLink = link.cloneNode(true);
                    newLink.addEventListener('click', (e) => {
                        if (!isDragging) { // 드래그 중이 아닐 때만 클릭 처리
                            e.preventDefault();
                            loadArticleList(newLink.href);
                        }
                    });
                    link.parentNode.replaceChild(newLink, link);
                });

                // 게시글 링크 처리 - hybrid와 일반 구조 모두 지원
                const handleRowClick = (e) => {
                    const rowLink = e.target.closest('a.vrow.column');
                    if (!rowLink) return;

                    const href = rowLink.getAttribute('href');
                    if (!href) return;

                    window.location.href = href;
                };

                newListTable.addEventListener('click', handleRowClick, true);

                // 모드(전체글/개념글) 활성화 상태 업데이트 - 선택자 수정
                const modeButtons = rightPanel.querySelectorAll('.btns-board a.btn-arca, .btns-board a.btn-danger');
                modeButtons.forEach(btn => {
                    const btnUrl = new URL(btn.href);
                    const btnMode = btnUrl.searchParams.get('mode');
                    if ((!mode && !btnMode) || (mode === btnMode)) {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });

                // 페이지네이션 교체
                const newPagination = doc.querySelector('.pagination-wrapper');
                const currentPagination = rightPanel.querySelector('.pagination-wrapper');
                if (newPagination && currentPagination) {
                    currentPagination.replaceWith(cloneWithEvents(newPagination));
                }

                // 목록 교체
                currentListTable.replaceWith(cloneWithEvents(newListTable));

                // URL 히스토리 업데이트
                if (pushState) {
                    history.pushState({}, '', url);
                }

            } catch (error) {
                console.error('게시글 목록 로드 실패:', error);
            }
        }

        // 게시글의 평가/공유 버튼 이벤트 설정 함수
        function setupArticleEventHandlers(articleWrapper) {
            const rateUpForm = articleWrapper.querySelector('#rateUpForm');
            const rateDownForm = articleWrapper.querySelector('#rateDownForm');
            const shareBtn = articleWrapper.querySelector('#articleShareBtn');

            if (rateUpForm) {
                rateUpForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    // 실제 평가 요청 보내기
                    fetch(rateUpForm.action, {
                        method: 'POST',
                        body: new FormData(rateUpForm)
                    }).then(response => response.json())
                        .then(data => {
                            // 평가 결과 업데이트
                            const ratingUp = articleWrapper.querySelector('#ratingUp');
                            const ratingUpIp = articleWrapper.querySelector('#ratingUpIp');
                            if (ratingUp) ratingUp.textContent = data.rating || '0';
                            if (ratingUpIp) ratingUpIp.textContent = data.ratingIp || '0';
                        });
                });
            }

            // 비추천 버튼도 동일한 방식으로 처리
            if (rateDownForm) {
                // ... 추천 버튼과 유사한 코드
            }

            // 공유 버튼
            if (shareBtn) {
                shareBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    // 원래 공유 기능 호출
                    window.articleShare();
                });
            }
        }

        // 검색 폼 제출 핸들러
        function handleSearchSubmit(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const params = new URLSearchParams(formData);
            const url = `${e.target.action}?${params.toString()}`;
            loadArticleList(url);
        }

        // 정렬/필터 핸들러 설정
        function setupSortHandlers(btnsBoard) {
            // 정렬 선택
            const sortSelect = btnsBoard.querySelector('select[name="sort"]');
            if (sortSelect) {
                sortSelect.addEventListener('change', (e) => {
                    const currentUrl = new URL(window.location.href);
                    if (e.target.value) {
                        currentUrl.searchParams.set('sort', e.target.value);
                    } else {
                        currentUrl.searchParams.delete('sort');
                    }
                    loadArticleList(currentUrl.toString());
                });
            }

            // 추천컷 선택
            const cutSelect = btnsBoard.querySelector('select[name="cut"]');
            if (cutSelect) {
                cutSelect.addEventListener('change', (e) => {
                    const currentUrl = new URL(window.location.href);
                    if (e.target.value && e.target.value !== 'etc') {
                        currentUrl.searchParams.set('cut', e.target.value);
                    } else {
                        currentUrl.searchParams.delete('cut');
                    }
                    loadArticleList(currentUrl.toString());
                });
            }

            // 모드 버튼들 (전체글/개념글)
            btnsBoard.querySelectorAll('a.btn-arca').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadArticleList(btn.href);
                });
            });
        }

        // 링크 클릭 이벤트 처리 수정
        function handleLinkClick(e) {
            const link = e.target.closest('a');
            if (!link) return;

            // 외부 확장프로그램이 추가한 버튼 클릭은 그대로 전달
            if (link.closest('[class*="MuiButton"]') ||
                link.closest('[class*="external-handler"]')) {
                return;
            }

            const channelPath = window.location.pathname.split('/')[2];
            const href = link.getAttribute('href');

            // 채널 내부 링크이거나 정렬/필터 관련 파라미터가 있는 경우
            if (href && (
                href.startsWith('/b/' + channelPath) ||
                href.includes('mode=') ||
                href.includes('sort=') ||
                href.includes('near=') ||
                href.includes('cut=')
            )) {
                e.preventDefault();
                loadArticleList(href);
            }
        }

        // 뒤로가기/앞으로가기 처리
        window.addEventListener('popstate', () => {
            loadArticleList(window.location.href, false);
        });

        // 카테고리, 검색, 정렬 등의 링크에 이벤트 핸들러 추가
        rightPanel.addEventListener('click', handleLinkClick);

        // 검색 폼 제출 이벤트 처리
        const searchForm = rightPanel.querySelector('.search-form');
        if (searchForm) {
            searchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const params = new URLSearchParams(formData);
                const url = `${searchForm.action}?${params.toString()}`;
                loadArticleList(url);
            });
        }

        // 게시글 링크 처리 로직 수정
        const handleArticleClick = (e) => {
            e.preventDefault();
            const link = e.currentTarget.getAttribute('href');
            if (link) {
                window.location.href = link;
            }
        };

        // 게시글 미리보기 항목에 클릭 이벤트 추가
        const articles = document.querySelectorAll('.included-article-list .vrow.column');
        articles.forEach(article => {
            article.addEventListener('click', handleArticleClick);
            // 이미지 클릭 시 이벤트 중복 방지
            const preview = article.querySelector('.vrow-preview');
            if (preview) {
                preview.addEventListener('click', (e) => {
                    e.stopPropagation();
                    handleArticleClick(e);
                });
            }
        });

        // 2. 이벤트 위임을 처리할 핸들러 추가
        function delegateEvents(originalElement, clonedElement) {
            const eventTypes = [
                'click', 'submit', 'change', 'input',
                'mousedown', 'mouseup', 'mouseover', 'mouseout'
            ];

            eventTypes.forEach(type => {
                clonedElement.addEventListener(type, (e) => {
                    const targetElement = e.target;
                    const originalTarget = findMatchingElement(targetElement, originalElement, clonedElement);

                    if (originalTarget) {
                        const newEvent = new Event(type, {
                            bubbles: true,
                            cancelable: true,
                            composed: true
                        });
                        Object.defineProperty(newEvent, 'target', { value: originalTarget });
                        originalTarget.dispatchEvent(newEvent);
                    }
                });
            });
        }

        // 3. 원본-복제본 매칭 함수 수정
        function findMatchingElement(clonedTarget, originalRoot, clonedRoot) {
            const path = [];
            let element = clonedTarget;

            while (element && element !== clonedRoot) {
                const parent = element.parentElement;
                if (!parent) break;
                const siblings = Array.from(parent.children);
                const index = siblings.indexOf(element);
                path.unshift(index);
                element = parent;
            }

            return path.reduce((current, index) => {
                return current?.children?.[index] || null;
            }, originalRoot);
        }

        // 5. 외부 확장 프로그램 이벤트 처리
        const handleExtensionElements = () => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            const extensionButtons = node.querySelectorAll('[class*="MuiButton"], [class*="external-handler"]');
                            extensionButtons.forEach(btn => {
                                btn.addEventListener('click', (e) => {
                                    // 이벤트 버블링 허용
                                    e.stopPropagation();
                                });
                            });
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        };

        // 6. 초기화 시 handleExtensionElements 호출 추가
        handleExtensionElements();

        // 7. 이미지 링크 이벤트 처리 수정
        const setupImageLinks = () => {
            document.querySelectorAll('.vrow-preview img').forEach(img => {
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const link = img.closest('a');
                    if (link) {
                        window.location.href = link.href;
                    }
                });
            });
        };

        // 8. 동적으로 추가되는 이미지에 대한 이벤트 처리
        const imageObserver = new MutationObserver(() => {
            setupImageLinks();
        });

        imageObserver.observe(rightPanel.querySelector('.included-article-list-wrapper'), {
            childList: true,
            subtree: true
        });

        // 9. 초기 이미지 링크 설정
        setupImageLinks();
    }

    // 페이지 로드 완료 후 실행
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeDualScreen);
    } else {
        initializeDualScreen();
    }
})();
