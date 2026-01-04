// ==UserScript==
// @name         Bypass Google Search Region
// @namespace    http://tampermonkey.net/
// @version      2.9
// @description  Add button to bypass Google Search region
// @license      MIT
// @match        *://*.google.com/search*
// @match        *://*.google.co.kr/search*
// @match        *://*.google.*/search*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534937/Bypass%20Google%20Search%20Region.user.js
// @updateURL https://update.greasyfork.org/scripts/534937/Bypass%20Google%20Search%20Region.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const DESKTOP_ID = 'bypass-desktop-button';
    const MOBILE_ID = 'bypass-mobile-button';
    const ACTIVE_SAFE = 'off';
    const DEFAULT_GL = 'GH';  // 기본값: Ghana

    // 지역 코드와 이름을 매핑한 객체 (알파벳 순으로 정렬)
    const REGION_OPTIONS = {
        'CN': 'China',
        'GH': 'Ghana',
        'JP': 'Japan',
        'KR': 'Korea',
        'US': 'USA'
    };

    // 페이지 언어를 확인 (ko, en만 체크)
    function getPageLanguage() {
        const lang = navigator.language || navigator.userLanguage;
        if (lang.startsWith('ko')) return 'ko';
        if (lang.startsWith('en')) return 'en';
        return null;
    }

    // 쿠키 설정을 안정적으로 수행
    function ensureBypassCookie(gl) {
        const expectedValue = `gl=${gl}:safe=${ACTIVE_SAFE}`;
        const maxAge = 60 * 60 * 24 * 365 * 5; // 5년

        const hasPrefCookie = document.cookie.includes(`PREF=${expectedValue}`);
        if (!hasPrefCookie) {
            const cookieValue = `PREF=${expectedValue}; max-age=${maxAge}; path=/`;
            document.cookie = `${cookieValue}; domain=.google.com`;
            document.cookie = `${cookieValue}; domain=${window.location.hostname}`;
        }
    }

    // 우회 검색을 적용하는 함수
    function applyBypass(gl) {
        if (!gl) return;

        const url = new URL(window.location.href);
        url.searchParams.set('gl', gl);  // 선택한 국가 코드로 gl 파라미터 설정
        url.searchParams.set('safe', ACTIVE_SAFE);
        url.searchParams.set('pws', '0'); // 개인화된 검색 결과 비활성화

        ensureBypassCookie(gl);

        try {
            sessionStorage.setItem('selected_gl', gl); // 현재 선택한 국가
            sessionStorage.setItem('last_used_gl', gl); // 마지막 우회에 사용한 국가
            sessionStorage.setItem('google_settings_safe', ACTIVE_SAFE);
        } catch (e) {}

        // 페이지 리디렉션
        window.location.href = url.toString();
    }

    // 우회 검색을 해제하는 함수
    function clearBypass() {
        const url = new URL(window.location.href);
        url.searchParams.delete('gl');
        url.searchParams.delete('safe');
        url.searchParams.delete('pws');

        // 쿠키와 로컬 스토리지에서 설정 삭제
        document.cookie = `PREF=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.google.com`;
        document.cookie = `PREF=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;

        try {
            sessionStorage.removeItem('selected_gl'); // 선택한 국가 초기화
            sessionStorage.removeItem('google_settings_safe');
            // last_used_gl은 유지 (sessionStorage)
        } catch (e) {}

        // 페이지 리디렉션
        window.location.href = url.toString();
    }

    // 현재 우회 상태를 확인하는 함수
    function isBypassActive() {
        const url = new URL(window.location.href);
        return url.searchParams.has('gl') && url.searchParams.get('safe') === ACTIVE_SAFE;
    }

    // 우회 상태를 토글하는 함수
    function toggleBypass() {
        if (isBypassActive()) {
            clearBypass();
        } else {
            // 마지막 사용 gl을 가져오되, 없으면 기본값(GH) 사용
            let gl = sessionStorage.getItem('last_used_gl');
            if (!gl) {
                gl = DEFAULT_GL;
            }
            applyBypass(gl);
        }
    }

    // 버튼 텍스트를 현재 언어 및 상태에 따라 업데이트
    function updateText(btn) {
        if (btn) {
            const lang = getPageLanguage();
            const bypassText = lang === 'ko' ? '우회 검색' : 'Bypass Search';
            const clearText = lang === 'ko' ? '우회 해제' : 'Remove Bypass';
            btn.textContent = isBypassActive() ? clearText : bypassText;
        }
    }

    // 팝업 닫기 핸들러 (중복 등록 방지용으로 외부에 정의)
    function onClickOutside(e) {
        const popup = document.getElementById('gl-popup');
        if (popup && !popup.contains(e.target)) {
            popup.remove();
            document.removeEventListener('click', onClickOutside);
        }
    }

    // 지역 선택 팝업 생성
    function createRegionPopup(triggerEl) {
        const existing = document.getElementById('gl-popup');
        if (existing) existing.remove();

        const popup = document.createElement('div');
        popup.id = 'gl-popup';
        popup.style.position = 'absolute';
        popup.style.background = '#fff';
        popup.style.border = '1px solid #ccc';
        popup.style.zIndex = '9999';
        popup.style.fontSize = '14px';
        popup.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        popup.style.boxSizing = 'border-box';

        const currentGl = sessionStorage.getItem('selected_gl');

        Object.entries(REGION_OPTIONS).forEach(([code, name]) => {
            const item = document.createElement('div');
            item.textContent = name;
            item.style.padding = '6px 12px';
            item.style.cursor = 'pointer';
            item.style.fontWeight = (code === currentGl) ? 'bold' : 'normal'; // 현재 선택 강조
            item.onclick = () => {
                sessionStorage.setItem('selected_gl', code); // 선택된 지역 기억
                applyBypass(code); // 선택된 지역으로 우회 적용
            };
            popup.appendChild(item);
        });

        document.body.appendChild(popup);

        const popupRect = popup.getBoundingClientRect();
        const popupWidth = popupRect.width;
        const popupHeight = popupRect.height;
        const triggerRect = triggerEl.getBoundingClientRect();

        let popupTop = triggerRect.bottom + window.scrollY;
        const popupLeftInit = triggerRect.left + window.scrollX;
        const windowHeight = window.innerHeight;

        // 화면 아래로 넘는 경우, 팝업을 위쪽에 띄움
        if (popupTop + popupHeight > window.scrollY + windowHeight) {
            popupTop = triggerRect.top + window.scrollY - popupHeight;
        }

        // 좌우 위치 조정 (스크롤 생기지 않도록)
        const maxLeft = window.innerWidth - popupWidth - 10;
        let popupLeft = popupLeftInit;
        if (popupLeft > maxLeft) {
            popupLeft = Math.max(maxLeft, 0);
        }

        popup.style.top = `${popupTop}px`;
        popup.style.left = `${popupLeft}px`;

        // 클릭 외부시 팝업 닫기 이벤트 등록 (중복 등록 방지)
        document.removeEventListener('click', onClickOutside);
        document.addEventListener('click', onClickOutside);
    }

    // 데스크톱 버튼 추가
    function addDesktopButton() {
        const interval = setInterval(() => {
            const tool = document.querySelector('#hdtb-tls');
            if (tool && tool.parentElement && !document.getElementById(DESKTOP_ID)) {
                clearInterval(interval);
                const btn = document.createElement('div');
                btn.id = DESKTOP_ID;
                btn.className = 'hdtb-mitem';
                btn.style.cursor = 'pointer';
                btn.style.userSelect = 'none';
                updateText(btn);  // 버튼 텍스트를 현재 언어에 맞게 업데이트
                btn.onclick = toggleBypass;

                const arrow = document.createElement('div');
                arrow.className = 'hdtb-mitem';
                arrow.style.cursor = 'pointer';
                arrow.style.marginLeft = '6px';
                arrow.style.marginRight = '12px';  // 화살표와 버튼 사이에 여유 공간 추가
                arrow.textContent = '▼';
                arrow.onclick = (e) => {
                    e.stopPropagation();
                    createRegionPopup(arrow);
                };

                tool.parentElement.insertBefore(arrow, tool.nextSibling);
                tool.parentElement.insertBefore(btn, arrow);
            }
        }, 500);
    }

    // 모바일 버튼 추가 (개선, 캡처 단계 + stopPropagation)
    function addMobileButton() {
        if (document.getElementById(MOBILE_ID)) return;

        const lang = getPageLanguage();
        const label = lang === 'ko' ? '고급검색' : (lang === 'en' ? 'Advanced Search' : null);
        if (!label) return;

        const advancedSearch = Array.from(document.querySelectorAll('a')).find(a => a.textContent.trim() === label);
        if (!advancedSearch || !advancedSearch.parentElement) return;

        const clone = advancedSearch.parentElement.cloneNode(true);
        const link = clone.querySelector('a');
        if (!link) return;

        clone.id = MOBILE_ID;
        updateText(link);  // 버튼 텍스트를 현재 언어에 맞게 업데이트
        link.style.cursor = 'pointer';
        link.removeAttribute('href');

        // 캡처단계에서 클릭 차단
        link.addEventListener(
          'click',
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (typeof e.stopImmediatePropagation === 'function') e.stopImmediatePropagation();
            toggleBypass();
          },
          true
        );

        const arrow = document.createElement('a');
        arrow.textContent = '▼';
        arrow.style.marginLeft = '6px';
        arrow.style.marginRight = '12px';  // 화살표와 버튼 사이에 여유 공간 추가
        arrow.style.cursor = 'pointer';
        arrow.onclick = (e) => {
            e.stopPropagation();
            createRegionPopup(arrow);
        };
        advancedSearch.parentElement.insertAdjacentElement('afterend', clone);
        clone.insertAdjacentElement('afterend', arrow);
    }

    // 쿠키 주기적 유지
    function keepBypassCookieAlive() {
        const gl = sessionStorage.getItem('last_used_gl');
        if (gl) ensureBypassCookie(gl);
    }

    window.addEventListener('load', keepBypassCookieAlive);
    setInterval(keepBypassCookieAlive, 60 * 60 * 1000); // 1시간마다

    // DOM 변화 감지하여 모바일 버튼 계속 감시
    const observer = new MutationObserver(() => {
        addMobileButton();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 초기 실행
    addDesktopButton();
    addMobileButton();
})();