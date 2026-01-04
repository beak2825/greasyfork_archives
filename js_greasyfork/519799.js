// ==UserScript==
// @name         Zod.kr 편의성 스크립트
// @namespace    http://tampermonkey.net/
// @version      1.61
// @description  서명 확장, 단축키 이동, 이미지 작게 보기(돋보기 포함), Shift + 마우스휠로 Swiper 이동, 즐겨찾기 단축키 등 편의 기능 제공
// @match        https://zod.kr/*
// @match        https://*.zod.kr/*
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/519799/Zodkr%20%ED%8E%B8%EC%9D%98%EC%84%B1%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/519799/Zodkr%20%ED%8E%B8%EC%9D%98%EC%84%B1%20%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // jQuery 로드 대기
    function waitForjQuery(callback) {
        if (typeof unsafeWindow.jQuery === 'undefined') {
            setTimeout(function() { waitForjQuery(callback); }, 100);
        } else {
            callback(unsafeWindow.jQuery);
        }
    }

    function main($) {
        $(document).ready(function() {
            // ---------------------------------
            // 0. 서명 확장/축소
            // ---------------------------------
            let signaturesExpanded = false;
            let expandButtons = [];

            function initSignatureExpand() {
                expandButtons = [];
                $('.app-article-signature__profile-body').each(function() {
                    var signature = $(this);
                    var contentDiv = signature.find('div[style*="max-height:100px"]');

                    if (contentDiv.length) {
                        const expandButton = $('<button>서명 확장</button>');
                        expandButton.css({
                            position: 'relative',
                            backgroundColor: '#3F9DFF',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            padding: '5px 10px',
                            marginTop: '10px',
                            display: 'block'
                        });

                        expandButton.on('click', function() {
                            signaturesExpanded = !signaturesExpanded;
                            expandButtons.forEach(function(item) {
                                if (signaturesExpanded) {
                                    item.contentDiv.css({ 'max-height': '100%', 'height': 'auto', 'overflow': 'visible' });
                                    item.button.text('서명 축소');
                                } else {
                                    item.contentDiv.css({ 'max-height': '100px', 'height': '', 'overflow': 'hidden' });
                                    item.button.text('서명 확장');
                                }
                            });
                        });

                        signature.append(expandButton);
                        expandButtons.push({ button: expandButton, contentDiv: contentDiv });
                    }
                });
            }

            initSignatureExpand();

            // 해시 변경 시 서명 확장 기능 재초기화
            window.addEventListener('hashchange', function() {
                initSignatureExpand();
            });

            // ---------------------------------
            // 1. 여러 단축키(이동) 및 토글 기능
            // ---------------------------------
            let isNavigationEnabled = localStorage.getItem('isNavigationEnabled') !== 'false'; // 기본값 true
            let isFavNavigationEnabled = localStorage.getItem('isFavNavigationEnabled') !== 'false'; // 기본값 true
            let keyDownTimes = {};
            const navigationKeys = {
                'z': 'https://zod.kr/', // ZOD 메인화면
                'a': 'https://zod.kr/all', // 전체글보기
                'n': 'https://zod.kr/news_all', // 뉴스 모아보기 게시판
                'r': 'https://zod.kr/review', // 리뷰 모아보기 게시판
                'b': 'https://zod.kr/benchmark', // 리뷰 > 벤치마크 게시판
                'c': 'https://zod.kr/community', // 커뮤니티 모아보기 게시판
                'f': 'https://zod.kr/free', // 커뮤니티 > 자유게시판
                'g': 'https://zod.kr/game', // 커뮤니티 > 게임게시판
                'h': 'https://zod.kr/hardware', // PC하드웨어 모아보기 게시판
                '1': 'https://zod.kr/cpu', // PC하드웨어 > CPU / 메인보드 / 램
                '2': 'https://zod.kr/gpu', // PC하드웨어 > 그래픽카드
                '3': 'https://zod.kr/case', // PC하드웨어 > 케이스 / 쿨링
                '4': 'https://zod.kr/ssd', // PC하드웨어 > 저장장치
                '5': 'https://zod.kr/psu', // PC하드웨어 > 파워서플라이
                '6': 'https://zod.kr/display', // PC하드웨어 > 디스플레이
                '7': 'https://zod.kr/keyma', // PC하드웨어 > 키보드 / 마우스
                '8': 'https://zod.kr/audio', // PC하드웨어 > 오디오
                '9': 'https://zod.kr/general', // PC하드웨어 > PC 일반
                '0': 'https://zod.kr/pcbuild', // PC하드웨어 > 조립 / 견적
                'm': 'https://zod.kr/device', // 모바일 모아보기 게시판
                't': 'https://zod.kr/all_tips', // 정보 모아보기 게시판
                'u': 'https://zod.kr/user_review', // 정보 > 유저리뷰 게시판
                'd': 'https://zod.kr/deal', // 특가 모아보기 게시판
                'q': 'https://zod.kr/qna', // 문의/버그신고 게시판
                '`': 'https://zod.kr/member/notifications', // 내 알림 목록 보기
                'x': 'https://zod.kr/notice' // 공지사항 게시판
            };

            // 즐겨찾기 항목 가져오기
            function getFavoriteLinks() {
                const favItems = document.querySelectorAll('#zod-user-fav ul.app-custom-scroll-horizon li[data-mid] a');
                return Array.from(favItems).map(item => item.href);
            }

            // 단축키 토글 버튼 추가
            const dropdownMenu = document.querySelector('.app-dropdown-menu.app-right');
            if (dropdownMenu) {
                const ul = dropdownMenu.querySelector('ul.app-dropdown-menu-list');
                if (ul) {
                    // 이미지 작게 보기 토글
                    const imageLi = document.createElement('li');
                    imageLi.className = 'tw-flex tw-p-4 tw-items-center';
                    imageLi.innerHTML = `
                        <p class="tw-text-sm">이미지 작게 보기</p>
                        <div class="tw-flex-1"></div>
                        <button class="app-button app-button-xs tw-p-3" id="toggle-image-size">${localStorage.getItem('isImageSmall') === 'true' ? 'ON' : 'OFF'}</button>
                    `;
                    ul.appendChild(imageLi);

                    const imageToggleButton = document.getElementById('toggle-image-size');
                    if (imageToggleButton) {
                        if (localStorage.getItem('isImageSmall') === 'true') imageToggleButton.style.backgroundColor = '#3f9dff';
                        imageToggleButton.addEventListener('click', toggleImageSize);
                    }

                    // 사이트 이동 단축키 토글
                    const navLi = document.createElement('li');
                    navLi.className = 'tw-flex tw-p-4 tw-items-center';
                    navLi.innerHTML = `
                        <p class="tw-text-sm">사이트 이동 단축키</p>
                        <div class="tw-flex-1"></div>
                        <button class="app-button app-button-xs tw-p-3" id="toggle-navigation">${isNavigationEnabled ? 'ON' : 'OFF'}</button>
                    `;
                    ul.appendChild(navLi);

                    const navToggleButton = document.getElementById('toggle-navigation');
                    if (navToggleButton) {
                        if (isNavigationEnabled) navToggleButton.style.backgroundColor = '#3f9dff';
                        navToggleButton.addEventListener('click', function() {
                            isNavigationEnabled = !isNavigationEnabled;
                            localStorage.setItem('isNavigationEnabled', isNavigationEnabled);
                            navToggleButton.textContent = isNavigationEnabled ? 'ON' : 'OFF';
                            navToggleButton.style.backgroundColor = isNavigationEnabled ? '#3f9dff' : '';
                        });
                    }

                    // 즐겨찾기 단축키 사용 토글
                    const favLi = document.createElement('li');
                    favLi.className = 'tw-flex tw-p-4 tw-items-center';
                    favLi.innerHTML = `
                        <p class="tw-text-sm">즐겨찾기 단축키</p>
                        <div class="tw-flex-1"></div>
                        <button class="app-button app-button-xs tw-p-3" id="toggle-fav-navigation">${isFavNavigationEnabled ? 'ON' : 'OFF'}</button>
                    `;
                    ul.appendChild(favLi);

                    const favToggleButton = document.getElementById('toggle-fav-navigation');
                    if (favToggleButton) {
                        if (isFavNavigationEnabled) favToggleButton.style.backgroundColor = '#3f9dff';
                        favToggleButton.addEventListener('click', function() {
                            isFavNavigationEnabled = !isFavNavigationEnabled;
                            localStorage.setItem('isFavNavigationEnabled', isFavNavigationEnabled);
                            favToggleButton.textContent = isFavNavigationEnabled ? 'ON' : 'OFF';
                            favToggleButton.style.backgroundColor = isFavNavigationEnabled ? '#3f9dff' : '';
                        });
                    }

                    // 즐겨찾기 단축키 설명
                    const favDescLi = document.createElement('li');
                    favDescLi.className = 'tw-p-4';
                    favDescLi.innerHTML = `<p style="font-size: 9px; color: #666;">즐겨찾기 단축키 적용 시, 1 ~ 0 단축키는 즐겨찾기로 대체됩니다.</p>`;
                    ul.appendChild(favDescLi);
                }
            }

            // ---------------------------------
            // 2. 검색창 관련
            // ---------------------------------
            const mobileSearchBtn = document.querySelector('.app-board-container--only-mobile .app-icon-button');
            const MOBILE_SEARCH_INPUT_SELECTOR = 'input[name="search_keyword"].app-input.app-input-expand';
            const overlaySearchToggleBtn = document.querySelector('a.app-header-item.app-icon-button.app-icon-button-gray.app-search-toggle');
            const OVERLAY_SEARCH_INPUT_SELECTOR = 'input.app-search-form__input[name="search_keyword"]';

            // 검색창이 열릴 때 ESC로 닫히도록 설정
            function setupSearchCloseOnEsc() {
                const appSearch = document.querySelector('#app-search');
                if (appSearch && appSearch.classList.contains('app-search--active')) {
                    $(document).on('keydown.searchClose', function(e) {
                        if (e.key === 'Escape') {
                            const closeButton = appSearch.querySelector('.app-search__close');
                            if (closeButton) closeButton.click();
                        }
                    });
                } else {
                    $(document).off('keydown.searchClose');
                }
            }

            // 검색창 토글 시 ESC 이벤트 설정
            if (overlaySearchToggleBtn) {
                overlaySearchToggleBtn.addEventListener('click', function() {
                    setTimeout(setupSearchCloseOnEsc, 100);
                });
            }

            // 페이지 로드 시 검색창이 열려 있으면 ESC 설정
            setupSearchCloseOnEsc();

// ---------------------------------
            // 3. keydown 핸들러
            // ---------------------------------
            $(document).on('keydown', function(e) {
                const key = e.key.toLowerCase();
              const isInputFocused = $(':focus').is('input, textarea, [contenteditable="true"]'); // 포커스 상태 미리 확인

              // --- Alt+S 처리 (이 단축키는 입력 중에도 필요할 수 있으므로 먼저 처리) ---
                if (key === 's' && e.altKey) {
                    e.preventDefault();
                    if (overlaySearchToggleBtn) {
                        overlaySearchToggleBtn.click();
                        setTimeout(() => {
                            const overlaySearchInput = document.querySelector(OVERLAY_SEARCH_INPUT_SELECTOR);
                            if (overlaySearchInput) {
                                overlaySearchInput.value = '';
                                overlaySearchInput.focus();
                            }
                        }, 100);
                    }
                    return; // Alt+S 처리 후 종료
                }

              // --- ✨ 핵심 수정: 입력 필드에 포커스가 있다면 Escape키만 처리하고 즉시 종료 ---
              if (isInputFocused) {
                  if (e.key === 'Escape') {
                      const appSearch = document.querySelector('#app-search');
                      const closeButton = appSearch?.querySelector('.app-search__close');
                      const closeButtonSmall = document.querySelector('.app-dialog-close');

                      if (appSearch && appSearch.classList.contains('app-search--active') && closeButton) {
                          closeButton.click();
                      }
                      if (closeButtonSmall && closeButtonSmall.offsetHeight > 0) {
                          closeButtonSmall.click();
                      }
                  }
                  return; // 입력 중이면 다른 단축키 실행 방지
              }

              // --- 입력 상태가 아닐 때만 실행될 단축키들 ---
                if (!e.altKey && !e.ctrlKey) { // Alt, Ctrl 조합이 아닌 경우
                  if (key === 'e') { // 'e' 키 처리 (서명 확장/축소)
                      signaturesExpanded = !signaturesExpanded;
                      expandButtons.forEach(function(item) {
                          if (signaturesExpanded) {
                              item.contentDiv.css({ 'max-height': '100%', 'height': 'auto', 'overflow': 'visible' });
                              item.button.text('서명 축소');
                          } else {
                              item.contentDiv.css({ 'max-height': '100px', 'height': '', 'overflow': 'hidden' });
                              item.button.text('서명 확장');
                          }
                      });
                  } else if (key === 's') { // 's' 키 처리 (모바일 검색)
                      if (mobileSearchBtn) {
                          mobileSearchBtn.click();
                          setTimeout(() => {
                              const mobileSearchInput = document.querySelector(MOBILE_SEARCH_INPUT_SELECTOR);
                              if (mobileSearchInput) {
                                  mobileSearchInput.value = '';
                                  mobileSearchInput.focus();
                              }
                          }, 100);
                      }
                  } else if (key === '\\') { // '\' 키 처리 (설정 메뉴 토글)
                      e.preventDefault();
                      const configToggle = document.querySelector('.app-dropdown.zod-app--header-config .app-dropdown-toggle');
                      if (configToggle) {
                          configToggle.click();
                      }
                  } else { // 네비게이션 단축키 처리 (a, b, c, ..., 1, 2, 3, ...)
                      const favLinks = getFavoriteLinks();
                      const isNumberKey = /^[0-9]$/.test(key); // 숫자 0-9 확인

                      if (isNumberKey && isFavNavigationEnabled && favLinks.length > 0) {
                          const index = key === '0' ? 9 : parseInt(key) - 1;
                          if (index < favLinks.length) {
                              window.location.href = favLinks[index];
                          }
                      } else if (isNavigationEnabled && navigationKeys.hasOwnProperty(key)) {
                          keyDownTimes[key] = Date.now();
                      }
                  }
              }
            });

            // ---------------------------------
            // 4. keyup 핸들러
            // ---------------------------------
            $(document).on('keyup', function(e) {
                if ($(':focus').is('input, textarea, [contenteditable="true"]') || e.altKey || e.ctrlKey) return;

                const key = e.key.toLowerCase();
                if (isNavigationEnabled && navigationKeys.hasOwnProperty(key) && keyDownTimes[key]) {
                    let duration = Date.now() - keyDownTimes[key];
                    if (duration >= 80) window.location.href = navigationKeys[key];
                    delete keyDownTimes[key];
                }
            });

            // ---------------------------------
            // 5. Alt+Enter, Ctrl+Enter, Alt+Ctrl+Enter => 등록 / 추천+등록
            // ---------------------------------
            function addAltEnterFeature() {
                function addAltEnterListener(textarea) {
                    if (textarea.dataset.altEnterListenerAdded === 'true') return;
                    textarea.dataset.altEnterListenerAdded = 'true';

                    textarea.addEventListener('keydown', function(event) {
                        if ((event.key === 'Enter' || event.keyCode === 13) && (event.altKey || event.ctrlKey)) {
                            event.preventDefault();
                            var form = textarea.closest('form');
                            if (form) {
                                var submitButtons = form.querySelectorAll('button[type="submit"]');
                                var targetButton = null;

                                if (event.altKey && event.ctrlKey) {
                                    submitButtons.forEach(function(button) {
                                        if (button.textContent.trim() === '추천+등록') targetButton = button;
                                    });
                                } else {
                                    submitButtons.forEach(function(button) {
                                        if (button.textContent.trim() === '등록') targetButton = button;
                                    });
                                }

                                if (targetButton) {
                                    targetButton.click();
                                    setTimeout(() => {
                                        textarea.blur();
                                        document.activeElement.blur();
                                    }, 100);
                                }
                            }
                        }
                    });
                }

                var textareas = document.querySelectorAll('textarea.app-textarea');
                textareas.forEach(addAltEnterListener);

                var altEnterObserver = new MutationObserver(function(mutations) {
                    mutations.forEach(function(mutation) {
                        mutation.addedNodes.forEach(function(node) {
                            if (node.nodeType === 1) {
                                if (node.matches('textarea.app-textarea')) {
                                    addAltEnterListener(node);
                                } else {
                                    node.querySelectorAll('textarea.app-textarea').forEach(addAltEnterListener);
                                }
                            }
                        });
                    });
                });

                altEnterObserver.observe(document.body, { childList: true, subtree: true });
            }

            addAltEnterFeature();

            // ---------------------------------
            // 6. 이미지 작게 보기 기능 추가 (돋보기 버튼 포함)
            // ---------------------------------
            const styleTag = document.createElement('style');
            styleTag.textContent = `
                .small-images .rhymix_content img:not(.original-size):not(.zod-link-preview img):not(.zod-sticker--item img) { max-width: 50%; }
                .original-size { max-width: 100% !important; }
                .magnifier-button {
                    position: absolute;
                    z-index: 10;
                    background: rgba(0, 0, 0, 0.7);
                    color: white;
                    border: none;
                    borderRadius: 3px;
                    padding: 2px 6px;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(styleTag);

            let isImageSmall = localStorage.getItem('isImageSmall') === 'true';
            if (isImageSmall) document.body.classList.add('small-images');

            function createMagnifierButton(image) {
                const button = document.createElement('button');
                button.type = 'button';
                button.className = 'magnifier-button';
                button.innerHTML = '🔍';
                button.setAttribute('aria-label', 'View actual size');
                button.addEventListener('click', () => {
                    image.classList.toggle('original-size');
                    updateButtonPosition(image, button);
                });
                return button;
            }

            function updateButtonPosition(image, button) {
                const imageRect = image.getBoundingClientRect();
                const parentRect = image.parentElement.getBoundingClientRect();
                const isOriginalSize = image.classList.contains('original-size');

                button.style.top = `${imageRect.bottom - parentRect.top - button.offsetHeight}px`;
                button.style.left = `${imageRect.right - parentRect.left - (isOriginalSize ? button.offsetWidth : 0)}px`;
            }

            function addMagnifierButtonToImage(image) {
                if (image.naturalWidth <= 360 || image.parentElement.querySelector('.magnifier-button')) return;

                const button = createMagnifierButton(image);
                image.parentElement.style.position = 'relative';
                image.parentElement.appendChild(button);
                updateButtonPosition(image, button);

                new ResizeObserver(() => updateButtonPosition(image, button)).observe(image);
            }

            function addMagnifierButtons() {
                const images = document.querySelectorAll('.rhymix_content img:not(.zod-link-preview img):not(.zod-sticker--item img)');
                images.forEach(image => {
                    if (image.complete) {
                        addMagnifierButtonToImage(image);
                    } else {
                        image.addEventListener('load', () => addMagnifierButtonToImage(image), { once: true });
                    }
                });
            }

            function removeMagnifierButtons() {
                document.querySelectorAll('.magnifier-button').forEach(button => button.remove());
            }

            function toggleImageSize() {
                isImageSmall = !isImageSmall;
                localStorage.setItem('isImageSmall', isImageSmall);
                const button = document.getElementById('toggle-image-size');
                if (isImageSmall) {
                    document.body.classList.add('small-images');
                    addMagnifierButtons();
                    if (button) {
                        button.textContent = 'ON';
                        button.style.backgroundColor = '#3f9dff';
                    }
                } else {
                    document.body.classList.remove('small-images');
                    removeMagnifierButtons();
                    if (button) {
                        button.textContent = 'OFF';
                        button.style.backgroundColor = '';
                    }
                }
            }

            if (isImageSmall) {
                document.addEventListener('DOMContentLoaded', addMagnifierButtons);
                window.addEventListener('load', addMagnifierButtons);
                addMagnifierButtons();
            }

            const imageObserver = new MutationObserver(() => {
                if (isImageSmall) addMagnifierButtons();
            });
            imageObserver.observe(document.body, { childList: true, subtree: true });

            // ---------------------------------
            // 7. Shift + 마우스휠로 Swiper 페이지 이동
            // ---------------------------------
            function initSwiperShiftScroll() {
                // 대상 Swiper 컨테이너들을 모두 선택
                const swiperContainers = document.querySelectorAll('.zod-widgets--review, #zod-recent-popular-main.swiper');

                swiperContainers.forEach((swiperContainer) => {
                    // 각 컨테이너 내부의 페이지네이션 요소를 찾음
                    // '.zod-widgets--review' 안에는 '.swiper-pagination'
                    // '#zod-recent-popular-main' 안에는 '.pagination.zod-swiper-pagination'
                    const paginationEl = swiperContainer.matches('.zod-widgets--review')
                        ? swiperContainer.querySelector('.swiper-pagination')
                        : swiperContainer.querySelector('.pagination.zod-swiper-pagination');

                    // 페이지네이션 요소가 없거나 이미 초기화된 경우 건너뜀
                    if (!paginationEl || paginationEl.getAttribute('data-shift-scroll-initialized') === 'true') return;

                    // Swiper 컨테이너에 'wheel' 이벤트 리스너 추가
                    swiperContainer.addEventListener('wheel', function(event) {
                        if (event.shiftKey) {
                            event.preventDefault();
                            const bullets = paginationEl.querySelectorAll('.swiper-pagination-bullet');
                            if (!bullets || bullets.length === 0) return;

                            let activeIndex = -1;
                            for (let i = 0; i < bullets.length; i++) {
                                if (bullets[i].classList.contains('swiper-pagination-bullet-active') || bullets[i].getAttribute('aria-current') === 'true') {
                                    activeIndex = i;
                                    break;
                                }
                            }

                             if (activeIndex === -1) return;

                            if (event.deltaY > 0) { // 아래로 스크롤 (다음)
                                if (activeIndex < bullets.length - 1) bullets[activeIndex + 1].click();
                            } else { // 위로 스크롤 (이전)
                                if (activeIndex > 0) bullets[activeIndex - 1].click();
                            }
                        }
                    }, { passive: false });

                    paginationEl.setAttribute('data-shift-scroll-initialized', 'true');
                    //console.log('Shift+Scroll initialized for swiper:', swiperContainer.className || swiperContainer.id);
                });
            }

            initSwiperShiftScroll();

            const swiperObserver = new MutationObserver(() => initSwiperShiftScroll());
            swiperObserver.observe(document.body, { childList: true, subtree: true });

            // 즐겨찾기 앞쪽 별표 제거
            const favLabel = document.querySelector('#zod-user-fav li.fav-label');
            if (favLabel) {
                favLabel.remove();
            }
        });
    }

    waitForjQuery(function($) { main($); });
})();