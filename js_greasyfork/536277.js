// ==UserScript==
// @name         Chzzk_L&V: Dal.wiki & WWME Viewer
// @namespace    Chzzk_L&V: Third Party Iframe Viewer
// @version      1.1.2
// @description  치지직에서 Dal.wiki 일정 확인 및 추가기능 + WWME 뷰어 기능 추가 (다크모드 지원)
// @author       DOGJIP
// @match        *://chzzk.naver.com/*
// @match        https://dal.wiki/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @downloadURL https://update.greasyfork.org/scripts/536277/Chzzk_LV%3A%20Dalwiki%20%20WWME%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/536277/Chzzk_LV%3A%20Dalwiki%20%20WWME%20Viewer.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const isChzzk = location.hostname.includes('chzzk.naver.com');
  const isDalWiki = location.hostname.includes('dal.wiki');

  // ========================= CHZZK: 일정 뷰어 =========================
  if (isChzzk && window.top === window.self && !location.pathname.includes('/chat')) {
    let buttonContainer, MainBtn, streamerBtn, dayBtn, wwmeBtn, darkModeBtn;  // darkModeBtn 추가
    let iframe, closeBtn, opacitySlider, rememberOpacityCheckbox, checkbox;
    let viewMode = 'daily'; // 'streamer' | 'daily' | 'wwme'
    let currentOpacity = 1.0;
    let isDarkMode = false;  // 다크모드 상태 변수 추가

    const STORAGE_KEY = 'dalwiki_opacity';
    const DARKMODE_KEY = 'dalwiki_darkmode';  // 다크모드 저장 키 추가
    const fixedPosition = { top: 16, left: 150 };
    const iframeDefaultWidth = 1000;
    const iframeDefaultHeight = 800;

    function applyButtonPosition() {
      Object.assign(buttonContainer.style, {
        position: 'fixed',
        top: `${fixedPosition.top}px`,
        left: `${fixedPosition.left}px`,
        zIndex: 2147483647,
        display: 'flex',
        gap: '4px'
      });
    }

    function centerIframe() {
      const maxW = window.innerWidth * 0.9;
      const maxH = window.innerHeight * 0.9;
      const w = Math.min(iframeDefaultWidth, maxW);
      const h = Math.min(iframeDefaultHeight, maxH);
      const top = (window.innerHeight - h) / 2;
      const left = (window.innerWidth - w) / 2;

      Object.assign(iframe.style, {
        width: `${w}px`,
        height: `${h}px`,
        top: `${top}px`,
        left: `${left}px`,
        display: 'block',
        position: 'fixed',
        border: '2px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 0 12px rgba(0,0,0,0.4)',
        background: 'white',
        zIndex: 2147483646
      });

      Object.assign(closeBtn.style, {
        position: 'fixed',
        top: `${top - 30}px`,
        left: `${left + w - 30}px`,
        display: 'block',
        background: 'crimson',
        color: 'white',
        border: 'none',
        padding: '4px 8px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '12px',
        zIndex: 2147483647
      });

      // 다크모드 버튼 위치 추가
      const darkModeLeft = parseFloat(closeBtn.style.left) - 40;
      darkModeBtn.style.top = closeBtn.style.top;
      darkModeBtn.style.left = `${darkModeLeft}px`;
      darkModeBtn.style.display = 'block';

      const sliderRight = darkModeLeft - 110;  // closeBtn.style.left 대신 darkModeLeft 사용
      opacitySlider.style.top = closeBtn.style.top;
      opacitySlider.style.left = `${sliderRight}px`;

      const checkboxLeft = sliderRight - 100 - 8;
      rememberOpacityCheckbox.style.top = closeBtn.style.top;
      rememberOpacityCheckbox.style.left = `${checkboxLeft}px`;

      streamerBtn.style.top = closeBtn.style.top;
      streamerBtn.style.left = iframe.style.left;
      streamerBtn.style.display = 'block';

      dayBtn.style.top = closeBtn.style.top;
      const streamerWidth = streamerBtn.offsetWidth;
      dayBtn.style.left = `${parseFloat(iframe.style.left) + streamerWidth + 8}px`;
      dayBtn.style.display = 'block';

      wwmeBtn.style.top = closeBtn.style.top;
      wwmeBtn.style.left = `${parseFloat(dayBtn.style.left) + dayBtn.offsetWidth + 4}px`;
      wwmeBtn.style.display = 'block';
    }

    // 다크모드 토글 함수 추가
    function toggleDarkMode() {
      isDarkMode = !isDarkMode;
      localStorage.setItem(DARKMODE_KEY, isDarkMode ? '1' : '0');
      applyDarkMode();
      darkModeBtn.textContent = isDarkMode ? '☀️' : '🌙';
    }

    // 다크모드 적용 함수 추가
    function applyDarkMode() {
      if (isDarkMode) {
        iframe.style.filter = 'invert(0.9) hue-rotate(180deg)';
      } else {
        iframe.style.filter = 'none';
      }
    }

    function updateMainBtnText(mode) {
      switch (mode) {
        case 'streamer':
          MainBtn.textContent = '🎥 스트리머 일정';
          break;
        case 'daily':
          MainBtn.textContent = '📅 치지직 일간 일정';
          break;
        case 'wwme':
          MainBtn.textContent = '🌐 WWME';
          break;
      }
    }

    function createUI() {
      buttonContainer = document.createElement('div');
      document.body.appendChild(buttonContainer);

      MainBtn = document.createElement('button');
      Object.assign(MainBtn.style, {
        padding: '6px 8px',
        zIndex: 2147483647,
        background: '#333',
        color: 'white',
        borderRadius: '6px',
        border: 'none',
        fontSize: '12px'
      });
      buttonContainer.appendChild(MainBtn);

      streamerBtn = document.createElement('button');
      streamerBtn.textContent = '🎥 스트리머 일정';
      dayBtn = document.createElement('button');
      [streamerBtn, dayBtn].forEach(btn => {
        btn.style.display = 'none';
        btn.style.position = 'fixed';
        btn.style.zIndex = '2147483647';
        btn.style.padding = '4px 8px';
        btn.style.background = '#555';
        btn.style.color = 'white';
        btn.style.borderRadius = '4px';
        btn.style.border = 'none';
        btn.style.cursor = 'pointer';
        btn.style.fontSize = '12px';
        document.body.appendChild(btn);
      });
      dayBtn.textContent = '📅 치지직 일간 일정';

      iframe = document.createElement('iframe');
      Object.assign(iframe.style, { display: 'none' });
      document.body.appendChild(iframe);

      closeBtn = document.createElement('button');
      closeBtn.textContent = '✖';
      Object.assign(closeBtn.style, { display: 'none' });
      document.body.appendChild(closeBtn);

      // 다크모드 버튼 생성 추가
      darkModeBtn = document.createElement('button');
      darkModeBtn.textContent = isDarkMode ? '☀️' : '🌙';
      darkModeBtn.title = '다크모드 토글';
      Object.assign(darkModeBtn.style, {
        display: 'none',
        position: 'fixed',
        zIndex: '2147483647',
        background: '#555',
        color: 'white',
        border: 'none',
        padding: '4px 8px',
        borderRadius: '50%',
        cursor: 'pointer',
        fontSize: '14px'
      });
      document.body.appendChild(darkModeBtn);

      opacitySlider = document.createElement('input');
      opacitySlider.type = 'range';
      opacitySlider.min = '0.3';
      opacitySlider.max = '1';
      opacitySlider.step = '0.01';
      opacitySlider.value = '1';
      Object.assign(opacitySlider.style, {
        display: 'none',
        position: 'fixed',
        zIndex: 2147483647,
        width: '100px'
      });
      document.body.appendChild(opacitySlider);

      rememberOpacityCheckbox = document.createElement('label');
      checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.style.marginRight = '4px';
      rememberOpacityCheckbox.appendChild(checkbox);
      // WWME 버튼 생성
      wwmeBtn = document.createElement('button');
      wwmeBtn.textContent = '🌐 WWME';
      Object.assign(wwmeBtn.style, {
        display: 'none',
        position: 'fixed',
        zIndex: '2147483647',
        padding: '4px 8px',
        background: '#555',
        color: 'white',
        borderRadius: '4px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '12px'
      });
      document.body.appendChild(wwmeBtn);

      applyButtonPosition();
    }

    function openIframe(mode = viewMode) {
      if (mode === 'wwme') {
        // WWME 모드: 사전 로딩된 iframe이 아니더라도 URL 설정
        iframe.src = 'https://wwme.kr/';
        centerIframe();
        // 투명도 기억 적용
        iframe.style.opacity = currentOpacity;
        opacitySlider.value = currentOpacity.toString();
        checkbox.checked = !!localStorage.getItem(STORAGE_KEY);

        // 표시
        iframe.style.display = 'block';
        closeBtn.style.display = 'block';
        opacitySlider.style.display = 'block';
        rememberOpacityCheckbox.style.display = 'block';

        // 버튼 위치
        streamerBtn.style.top = closeBtn.style.top;
        streamerBtn.style.left = iframe.style.left;
        dayBtn.style.top = closeBtn.style.top;
        dayBtn.style.left = `${parseFloat(streamerBtn.style.left) + streamerBtn.offsetWidth + 8}px`;
        wwmeBtn.style.top = closeBtn.style.top;
        wwmeBtn.style.left = `${parseFloat(dayBtn.style.left) + dayBtn.offsetWidth + 4}px`;

        applyDarkMode();  // 다크모드 적용 추가
        return;
      }

      const dt = new Date();
      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');

      let topicPath = '';
      let page = '';
      switch (mode) {
        case 'daily':
          topicPath = '/topic/%EC%B9%98%EC%A7%80%EC%A7%81%20%ED%95%A9%EB%B0%A9%2F%EB%8C%80%ED%9A%8C%2F%EC%BD%98%ED%85%90%EC%B8%A0%20%EC%9D%BC%EC%A0%95';
          page = 'agenda';
          break;
        case 'streamer':
          topicPath = '/topic/%EC%B9%98%EC%A7%80%EC%A7%81%20%EC%8A%A4%ED%8A%B8%EB%A6%AC%EB%A8%B8%20%EC%9D%BC%EC%A0%95';
          page = 'agenda';
          break;
        default:
          return;
      }

      iframe.src = `https://dal.wiki${topicPath}/${page}?date=${yyyy}-${mm}-${dd}`;
      centerIframe();
      // 투명도 기억 적용
      iframe.style.opacity = currentOpacity;
      opacitySlider.value = currentOpacity.toString();
      checkbox.checked = !!localStorage.getItem(STORAGE_KEY);

      // 표시
      iframe.style.display = 'block';
      closeBtn.style.display = 'block';
      opacitySlider.style.display = 'block';
      rememberOpacityCheckbox.style.display = 'block';

      applyDarkMode();  // 다크모드 적용 추가
    }

    function bindEvents() {
      MainBtn.onclick = () => {
        if (iframe.style.display === 'block') {
          iframe.style.display = closeBtn.style.display = darkModeBtn.style.display = opacitySlider.style.display = rememberOpacityCheckbox.style.display = 'none';  // darkModeBtn 추가
          streamerBtn.style.display = dayBtn.style.display = wwmeBtn.style.display = 'none';
        } else {
          openIframe();
        }
      };
      closeBtn.onclick = () => {
        iframe.style.display = closeBtn.style.display = darkModeBtn.style.display = opacitySlider.style.display = rememberOpacityCheckbox.style.display = 'none';  // darkModeBtn 추가
        streamerBtn.style.display = dayBtn.style.display = wwmeBtn.style.display = 'none';
      };
      darkModeBtn.onclick = toggleDarkMode;  // 다크모드 버튼 이벤트 추가
      window.addEventListener('resize', () => iframe.style.display === 'block' && centerIframe());
      opacitySlider.oninput = () => {
        currentOpacity = parseFloat(opacitySlider.value);
        iframe.style.opacity = currentOpacity;
        if (checkbox.checked) localStorage.setItem(STORAGE_KEY, currentOpacity.toString());
      };
      checkbox.onchange = () => {
        if (checkbox.checked) localStorage.setItem(STORAGE_KEY, currentOpacity.toString());
        else localStorage.removeItem(STORAGE_KEY);
      };
      streamerBtn.onclick = () => {
        viewMode = 'streamer';
        openIframe(viewMode);
      };
      dayBtn.onclick = () => {
        viewMode = 'daily';
        openIframe(viewMode);
      };
      wwmeBtn.onclick = () => {
        viewMode = 'wwme';
        openIframe(viewMode);
      };
    }

    function observeBodyStyle() {
      const checkBodyStyle = () => {
        const bodyStyle = document.body.getAttribute('style') || '';
        const computedStyle = window.getComputedStyle(document.body);

        // body에 overflow: hidden과 position: fixed가 동시에 있는지 확인
        const isTheaterMode = (
          (bodyStyle.includes('overflow: hidden') || computedStyle.overflow === 'hidden') &&
          (bodyStyle.includes('position: fixed') || computedStyle.position === 'fixed')
        );

        buttonContainer.style.display = isTheaterMode ? 'none' : 'flex';
      };

      // MutationObserver로 body의 style 속성 변화 감지
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
            checkBodyStyle();
          }
        });
      });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['style'],
        attributeOldValue: true
      });

      // 초기 체크
      checkBodyStyle();

      // 추가 안전장치: 특정 이벤트 발생 시 체크
      // 넓은 화면 모드 관련 단축키 및 상호작용
      const eventsToCheck = ['keydown', 'click'];

      eventsToCheck.forEach(eventType => {
        document.addEventListener(eventType, (e) => {
          // 키보드 이벤트인 경우
          if (e.type === 'keydown') {
            const key = e.key.toLowerCase();
            // t(넓은화면), f(전체화면), F12(개발자도구) 키만 체크
            if (key === 't' || key === 'f' || e.keyCode === 123) {
              setTimeout(checkBodyStyle, 100); // 약간의 지연 후 체크
            }
          }
          // 클릭 이벤트인 경우 (넓은화면/전체화면 버튼 클릭)
          else if (e.type === 'click') {
            // 버튼 클릭으로 인한 변화를 감지하기 위해 짧은 지연
            setTimeout(checkBodyStyle, 100);
          }
        }, { passive: true });
      });
    }

    function init() {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) currentOpacity = parseFloat(saved);

      // 다크모드 설정 불러오기 추가
      const savedDarkMode = localStorage.getItem(DARKMODE_KEY);
      isDarkMode = savedDarkMode === '1';

      createUI();
      updateMainBtnText(viewMode);
      bindEvents();
      observeBodyStyle();
    }

    if (document.body) init();
    else new MutationObserver((obs) => document.body && (obs.disconnect(), init())).observe(document.documentElement, { childList: true });
  }

  // ========================= DAL.WIKI 내 고정 레이아웃 =========================
  if (isDalWiki) {
    const observer = new MutationObserver(() => {
      const aside = document.querySelector('aside.md\\:w-\\[176px\\]');
      if (!aside || aside.dataset.stickyApplied === 'true') return;

      const addButtonAnchor = aside.querySelector('a[href*=\"/editor\"]');
      const scrollWrapper = aside.querySelector('[style*=\"--radix-scroll-area-corner-width\"]');
      const viewport = scrollWrapper?.querySelector('[data-radix-scroll-area-viewport]');
      if (!addButtonAnchor || !scrollWrapper || !viewport) return;

      aside.dataset.stickyApplied = 'true';
      viewport.style.minHeight = viewport.offsetHeight + 'px';
      scrollWrapper.style.maxHeight = '50vh';
      scrollWrapper.style.overflowY = 'auto';

      const stickyContainer = document.createElement('div');
      stickyContainer.style.position = 'sticky';
      stickyContainer.style.top = '0';
      stickyContainer.style.background = 'white';
      stickyContainer.style.zIndex = '50';
      stickyContainer.style.paddingBottom = '12px';

      const config = { attributes: true, childList: false, subtree: false };
      observer.disconnect();

      stickyContainer.appendChild(addButtonAnchor);
      stickyContainer.appendChild(scrollWrapper);
      aside.insertBefore(stickyContainer, aside.firstChild);

      observer.observe(document.body, config);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();