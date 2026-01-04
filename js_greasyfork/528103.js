// ==UserScript==
// @name         dcinside shortcut
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  디시인사이드 갤러리 단축키: 글번호(1~100), ` or . + 숫자키 + ` or . 이동, ALT+숫자 즐겨찾기, W(글쓰기), C(댓글), D(새로고침), R(리로드), Q(최상단), E(목록), F(전체글), G(개념글), A/S(페이지), Z/X(글 이동)
// @author       노노하꼬
// @match        *://gall.dcinside.com/*
// @match        *://www.dcinside.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dcinside.com
// @grant        GM_setValue
// @grant        GM_getValue
// @license      CC BY-NC-SA 4.0
// @supportURL   https://gallog.dcinside.com/nonohako/guestbook
// @downloadURL https://update.greasyfork.org/scripts/528103/dcinside%20shortcut.user.js
// @updateURL https://update.greasyfork.org/scripts/528103/dcinside%20shortcut.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // Constants
    const FAVORITE_GALLERIES_KEY = 'dcinside_favorite_galleries';
    const isTampermonkey = typeof GM_setValue !== 'undefined' && typeof GM_getValue !== 'undefined';
    const PAGE_NAVIGATION_MODE_KEY = 'dcinside_page_navigation_mode';
    const MACRO_Z_RUNNING_KEY = 'dcinside_macro_z_running';
    const MACRO_X_RUNNING_KEY = 'dcinside_macro_x_running';
    const MACRO_INTERVAL = 2500; // 2.5 seconds
    // Storage Module
    const Storage = {

        async getPageNavigationMode() {
            const defaultValue = 'ajax'; // 기본값은 AJAX 모드로 설정
            if (isTampermonkey) {
                return GM_getValue(PAGE_NAVIGATION_MODE_KEY, defaultValue);
            } else {
                const data = localStorage.getItem(PAGE_NAVIGATION_MODE_KEY) || this.getCookie(PAGE_NAVIGATION_MODE_KEY);
                return data !== null ? data : defaultValue; // 저장된 값이 없으면 기본값 반환
            }
        },

        savePageNavigationMode(mode) {
            try {
                if (mode !== 'ajax' && mode !== 'full') {
                    console.error('Invalid page navigation mode:', mode);
                    return;
                }
                if (isTampermonkey) {
                    GM_setValue(PAGE_NAVIGATION_MODE_KEY, mode);
                } else {
                    localStorage.setItem(PAGE_NAVIGATION_MODE_KEY, mode);
                    this.setCookie(PAGE_NAVIGATION_MODE_KEY, mode);
                }
            } catch (error) {
                console.error('Failed to save page navigation mode:', error);
            }
        },

        async getFavorites() {
            let favorites = {};
            try {
                if (isTampermonkey) {
                    favorites = GM_getValue(FAVORITE_GALLERIES_KEY, {});
                } else {
                    const data = localStorage.getItem(FAVORITE_GALLERIES_KEY) ||
                          this.getCookie(FAVORITE_GALLERIES_KEY);
                    favorites = data ? JSON.parse(data) : {};
                }
            } catch (error) {
                console.error('Failed to retrieve favorites:', error);
            }
            return favorites;
        },

        saveFavorites(favorites) {
            try {
                const data = JSON.stringify(favorites);
                if (isTampermonkey) {
                    GM_setValue(FAVORITE_GALLERIES_KEY, favorites);
                } else {
                    localStorage.setItem(FAVORITE_GALLERIES_KEY, data);
                    this.setCookie(FAVORITE_GALLERIES_KEY, data);
                }
            } catch (error) {
                console.error('Failed to save favorites:', error);
                alert('즐겨찾기 저장에 실패했습니다. 브라우저의 저장소 설정을 확인해주세요.');
            }
        },

        getCookie(name) {
            const value = document.cookie.match(`(^|;)\\s*${name}=([^;]+)`);
            return value ? decodeURIComponent(value[2]) : null;
        },

        setCookie(name, value) {
            const date = new Date();
            date.setFullYear(date.getFullYear() + 1);
            document.cookie = `${name}=${encodeURIComponent(value)}; expires=${date.toUTCString()}; path=/; domain=.dcinside.com`;
        },

        async getAltNumberEnabled() {
            if (isTampermonkey) {
                return GM_getValue('altNumberEnabled', true); // 기본값: 활성화
            } else {
                const data = localStorage.getItem('altNumberEnabled') || this.getCookie('altNumberEnabled');
                return data !== null ? JSON.parse(data) : true;
            }
        },

        saveAltNumberEnabled(enabled) {
            try {
                const data = JSON.stringify(enabled);
                if (isTampermonkey) {
                    GM_setValue('altNumberEnabled', enabled);
                } else {
                    localStorage.setItem('altNumberEnabled', data);
                    this.setCookie('altNumberEnabled', data);
                }
            } catch (error) {
                console.error('Failed to save altNumberEnabled:', error);
            }
        },

        async getShortcutEnabled(key) {
            if (isTampermonkey) {
                return GM_getValue(key, true);
            } else {
                const data = localStorage.getItem(key) || this.getCookie(key);
                return data !== null ? JSON.parse(data) : true;
            }
        },

        saveShortcutEnabled(key, enabled) {
            try {
                const data = JSON.stringify(enabled);
                if (isTampermonkey) {
                    GM_setValue(key, enabled);
                } else {
                    localStorage.setItem(key, data);
                    this.setCookie(key, data);
                }
            } catch (error) {
                console.error(`Failed to save ${key}:`, error);
            }
        },

        async getShortcutKey(key) {
            if (isTampermonkey) {
                return GM_getValue(key, null);
            } else {
                const data = localStorage.getItem(key) || this.getCookie(key);
                return data !== null ? data : null;
            }
        },

        saveShortcutKey(key, value) {
            try {
                if (isTampermonkey) {
                    GM_setValue(key, value);
                } else {
                    localStorage.setItem(key, value);
                    this.setCookie(key, value);
                }
            } catch (error) {
                console.error(`Failed to save ${key}:`, error);
            }
        }
    };

    // UI Module
    const UI = {
        tooltipCSSInjected: false, // CSS 주입 여부 플래그

        // CSS를 페이지에 주입하는 함수
        injectTooltipCSS() {
            if (this.tooltipCSSInjected) return; // 이미 주입되었으면 실행 안 함

            const css = `
            /* 툴팁을 감싸는 컨테이너 (상대 위치 기준점) */
            .footnote-container {
                position: relative; /* 자식 tooltip의 absolute 위치 기준 */
                display: inline-block; /* span이면서 위치 기준이 되도록 */
                cursor: help;
            }

            /* 실제 툴팁 요소 */
            .footnote-tooltip {
                position: absolute;
                bottom: 115%; /* 트리거 요소 바로 위에 위치 */
                left: 50%;     /* 가로 중앙 정렬 시작점 */
                transform: translateX(-50%); /* 가로 중앙 정렬 완료 */
                background-color: rgba(0, 0, 0, 0.85); /* 반투명 검정 배경 */
                color: white;           /* 흰색 텍스트 */
                padding: 6px 10px;      /* 내부 여백 */
                border-radius: 5px;     /* 둥근 모서리 */
                font-size: 12px;        /* 작은 글씨 크기 */
                white-space: nowrap;    /* 줄바꿈 방지 */
                z-index: 10001;         /* 다른 요소 위에 표시되도록 */
                visibility: hidden;     /* 기본적으로 숨김 (visibility) */
                opacity: 0;             /* 기본적으로 투명 (opacity) */
                transition: opacity 0.1s ease-in-out, visibility 0.1s ease-in-out; /* 부드러운 효과 */
                pointer-events: none;   /* 툴팁 자체가 마우스 이벤트 방해하지 않도록 */
            }

            /* 컨테이너에 마우스 호버 시 툴팁 표시 */
            .footnote-container:hover .footnote-tooltip {
                visibility: visible; /* 보이기 (visibility) */
                opacity: 1;          /* 불투명 (opacity) */
            }
        `;
            // style 태그를 만들어 head에 추가
            const styleElement = this.createElement('style', {}, { textContent: css });
            document.head.appendChild(styleElement);
            this.tooltipCSSInjected = true; // 주입 완료 플래그 설정
        },

        createPageNavigationModeSelector() {
            this.injectTooltipCSS(); // <<< 함수 시작 시 CSS 주입 함수 호출

            const container = this.createElement('div', {
                margin: '15px 0', padding: '10px', backgroundColor: '#f5f5f5',
                borderRadius: '10px', border: '1px solid #e0e0e0'
            });

            const title = this.createElement('div', {
                fontSize: '14px', fontWeight: '500', color: '#424242', marginBottom: '10px'
            }, { textContent: '페이지 이동 방식 (A/S 키)' });
            container.appendChild(title);

            const optionsContainer = this.createElement('div', {
                display: 'flex', justifyContent: 'space-around', alignItems: 'center' // alignItems 추가
            });

            const modes = [
                { value: 'ajax', text: '⚡ 빠른 이동 (AJAX)' },
                { value: 'full', text: '🔄 기본 이동 (새로고침)' }
            ];

            const tooltipText = "Refresher의 새로고침 기능과 충돌합니다. 둘 중에 하나만 사용하세요."; // 툴팁 텍스트

            Storage.getPageNavigationMode().then(currentMode => {
                modes.forEach(modeInfo => {
                    const label = this.createElement('label', {
                        display: 'flex', alignItems: 'center', cursor: 'pointer',
                        fontSize: '13px', color: '#555', gap: '5px' // 라디오 버튼과 텍스트 사이 간격
                    });
                    const radio = this.createElement('input', {
                        // marginRight: '5px' // gap으로 대체
                    }, {
                        type: 'radio', name: 'pageNavMode', value: modeInfo.value
                    });

                    if (modeInfo.value === currentMode) {
                        radio.checked = true;
                    }

                    radio.addEventListener('change', async (e) => {
                        if (e.target.checked) {
                            await Storage.savePageNavigationMode(e.target.value);
                            UI.showAlert(`페이지 이동 방식이 '${modeInfo.text.split(' ')[0]}' 모드로 변경되었습니다.`); // 텍스트 간소화
                        }
                    });

                    label.appendChild(radio);
                    label.appendChild(document.createTextNode(modeInfo.text)); // 라디오 버튼 텍스트 추가

                    // --- AJAX 옵션에만 각주 및 툴팁 추가 ---
                    if (modeInfo.value === 'ajax') {
                        // 1. 컨테이너 span 생성 (상대 위치 기준, 호버 타겟)
                        const footnoteContainer = this.createElement('span', {
                            // 스타일은 CSS 클래스로 이동
                        }, { className: 'footnote-container' });

                        // 2. 트리거 텍스트 '[주의]' span 생성
                        const footnoteTrigger = this.createElement('span', {
                            fontSize: '10px',
                            color: '#d32f2f',
                            fontWeight: 'bold',
                            verticalAlign: 'super',
                            marginLeft: '3px'
                            // title 속성 제거
                        }, { textContent: '[주의]' });

                        // 3. 실제 툴팁 내용 span 생성
                        const tooltipElement = this.createElement('span', {
                            // 스타일은 CSS 클래스로 이동
                        }, {
                            className: 'footnote-tooltip',
                            textContent: tooltipText
                        });

                        // 4. 컨테이너에 트리거와 툴팁 추가
                        footnoteContainer.appendChild(footnoteTrigger);
                        footnoteContainer.appendChild(tooltipElement);

                        // 5. 라벨에 최종 컨테이너 추가
                        label.appendChild(footnoteContainer);
                    }
                    // --- 커스텀 툴팁 적용 끝 ---

                    optionsContainer.appendChild(label);
                });
            });

            container.appendChild(optionsContainer);
            return container;
        },

        createElement(tag, styles, props = {}) {
            const el = document.createElement(tag);
            Object.assign(el.style, styles);
            Object.assign(el, props);
            return el;
        },

        async showFavorites() {
            const container = this.createElement('div', {
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', backgroundColor: '#ffffff',
                padding: '20px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                zIndex: '10000', width: '360px', maxHeight: '80vh', overflowY: 'auto',
                fontFamily: "'Roboto', sans-serif", border: '1px solid #e0e0e0',
                transition: 'opacity 0.2s ease-in-out', opacity: '0'
            });
            setTimeout(() => container.style.opacity = '1', 10);

            this.loadRobotoFont();
            container.appendChild(this.createTitle());
            const list = this.createList();
            container.appendChild(list);
            container.appendChild(this.createAddContainer());
            container.appendChild(this.createToggleAltNumber()); // 새로 추가: 토글 버튼
            container.appendChild(this.createShortcutManagerButton());
            container.appendChild(this.createCloseButton(container));

            document.body.appendChild(container);
            await this.updateFavoritesList(list);
        },

        loadRobotoFont() {
            if (!document.querySelector('link[href*="Roboto"]')) {
                document.head.appendChild(this.createElement('link', {}, {
                    rel: 'stylesheet',
                    href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap'
                }));
            }
        },

        createToggleAltNumber() {
            const container = this.createElement('div', {
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                margin: '15px 0', padding: '10px', backgroundColor: '#f5f5f5',
                borderRadius: '10px'
            });

            const label = this.createElement('span', {
                fontSize: '14px', fontWeight: '500', color: '#424242'
            }, { textContent: 'ALT + 숫자 단축키 사용' });

            const checkbox = this.createElement('input', {
                marginLeft: 'auto'
            }, { type: 'checkbox' });

            Storage.getAltNumberEnabled().then(enabled => {
                checkbox.checked = enabled;
            });

            checkbox.addEventListener('change', async () => {
                await Storage.saveAltNumberEnabled(checkbox.checked);
                UI.showAlert(`ALT + 숫자 단축키가 ${checkbox.checked ? '활성화' : '비활성화'}되었습니다.`);
            });

            container.appendChild(label);
            container.appendChild(checkbox);
            return container;
        },

        createShortcutManagerButton() {
            const button = this.createElement('button', {
                display: 'block', width: '100%', padding: '10px', marginTop: '15px',
                backgroundColor: '#4caf50', color: '#ffffff', border: 'none',
                borderRadius: '10px', fontSize: '15px', fontWeight: '500',
                cursor: 'pointer', transition: 'background-color 0.2s ease'
            }, { textContent: '단축키 관리' });

            button.addEventListener('mouseenter', () => button.style.backgroundColor = '#388e3c');
            button.addEventListener('mouseleave', () => button.style.backgroundColor = '#4caf50');
            button.addEventListener('click', () => this.showShortcutManager());
            return button;
        },

        showShortcutManager() {
            const container = this.createElement('div', {
                position: 'fixed', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)', backgroundColor: '#ffffff',
                padding: '20px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                zIndex: '10000', width: '400px', maxHeight: '80vh', overflowY: 'auto',
                fontFamily: "'Roboto', sans-serif", border: '1px solid #e0e0e0',
                transition: 'opacity 0.2s ease-in-out', opacity: '0'
            });
            setTimeout(() => container.style.opacity = '1', 10);

            this.loadRobotoFont();
            container.appendChild(this.createTitle('단축키 관리'));
            container.appendChild(this.createPageNavigationModeSelector());

            // 단축키 활성화/비활성화 토글 추가
            container.appendChild(this.createShortcutToggle('W - 글쓰기', 'shortcutWEnabled'));
            container.appendChild(this.createShortcutToggle('C - 댓글 입력', 'shortcutCEnabled'));
            container.appendChild(this.createShortcutToggle('D - 댓글 새로고침', 'shortcutDEnabled'));
            container.appendChild(this.createShortcutToggle('R - 페이지 새로고침', 'shortcutREnabled'));
            container.appendChild(this.createShortcutToggle('Q - 최상단 스크롤', 'shortcutQEnabled'));
            container.appendChild(this.createShortcutToggle('E - 글 목록 스크롤', 'shortcutEEnabled'));
            container.appendChild(this.createShortcutToggle('F - 전체글 보기', 'shortcutFEnabled'));
            container.appendChild(this.createShortcutToggle('G - 개념글 보기', 'shortcutGEnabled'));
            container.appendChild(this.createShortcutToggle('A - 이전 페이지', 'shortcutAEnabled'));
            container.appendChild(this.createShortcutToggle('S - 다음 페이지', 'shortcutSEnabled'));
            container.appendChild(this.createShortcutToggle('Z - 이전 글', 'shortcutZEnabled'));
            container.appendChild(this.createShortcutToggle('X - 다음 글', 'shortcutXEnabled'));
            // --- Add Macro Toggles ---
            container.appendChild(this.createElement('div', { // 구분선
                height: '1px', backgroundColor: '#e0e0e0', margin: '15px 0'
            }));
            container.appendChild(this.createElement('div', { // 섹션 제목
                fontSize: '14px', fontWeight: '500', color: '#424242', marginBottom: '5px'
            }, { textContent: '자동 넘김 매크로 (ALT+키로 시작/중지)' }));

            // --- 레이블 수정 ---
            container.appendChild(this.createShortcutToggle('이전 글 자동 넘김', 'shortcutMacroZEnabled')); // "ALT+Z - " 제거
            container.appendChild(this.createShortcutToggle('다음 글 자동 넘김', 'shortcutMacroXEnabled')); // "ALT+X - " 제거
            // --- End Add Macro Toggles ---

            container.appendChild(this.createCloseButton(container));
            document.body.appendChild(container);
        },

        createShortcutToggle(label, enabledStorageKey) {
            const isMacroToggle = enabledStorageKey.startsWith('shortcutMacro');
            let displayLabel = label; // 표시될 최종 레이블

            // 매크로 토글인 경우, 레이블에서 단축키 정보 분리
            let prefix = '';
            if (isMacroToggle) {
                if (enabledStorageKey === 'shortcutMacroZEnabled') {
                    prefix = 'ALT+Z - ';
                    // displayLabel = "이전 글 자동 넘김"; // label 인수에서 분리된 부분
                } else if (enabledStorageKey === 'shortcutMacroXEnabled') {
                    prefix = 'ALT+X - ';
                    // displayLabel = "다음 글 자동 넘김"; // label 인수에서 분리된 부분
                }
                // label 인수 자체에 "ALT+Z - 이전 글..." 이 포함된 경우, prefix 제거
                if (displayLabel.startsWith(prefix)) {
                    displayLabel = displayLabel.substring(prefix.length).trim();
                }
            }


            const container = this.createElement('div', {
                display: 'flex', alignItems: 'center',
                margin: '10px 0', padding: '10px', backgroundColor: '#f5f5f5',
                borderRadius: '10px', gap: '10px' // 요소 간 간격
            });

            // 접두사(ALT+Z/X)를 별도 span으로 처리하여 너비 고정 (선택적)
            if (prefix) {
                const prefixEl = this.createElement('span', {
                    fontSize: '14px', fontWeight: '500', color: '#666', // 약간 연한 색상
                    // fontFamily: 'monospace', // 고정폭 글꼴 사용 가능
                    minWidth: '60px', // 최소 너비 확보
                    textAlign: 'right', // 오른쪽 정렬 (선택적)
                    marginRight: '5px' // 레이블과의 간격
                }, { textContent: prefix });
                container.appendChild(prefixEl);
            }


            const labelEl = this.createElement('span', {
                fontSize: '14px', fontWeight: '500', color: '#424242',
                // width: '150px', // 고정 너비 제거 또는 조정
                flexGrow: '1', // 남은 공간 차지하도록 설정
                textOverflow: 'ellipsis', // 넘칠 때 ... 표시
                whiteSpace: 'nowrap' // 한 줄로 표시 강제
            }, { textContent: displayLabel }); // 수정된 displayLabel 사용

            const checkbox = this.createElement('input', {
                // marginLeft: 'auto' // flexGrow 사용 시 불필요할 수 있음, gap으로 대체됨
                flexShrink: 0 // 체크박스 크기 줄어들지 않도록
            }, { type: 'checkbox' });

            const keyInput = this.createElement('input', {
                width: '60px', padding: '5px',
                border: '1px solid #e0e0e0', borderRadius: '4px',
                fontSize: '12px', outline: 'none', textAlign: 'center',
                fontFamily: 'monospace',
                flexShrink: 0 // 키 입력 필드 크기 줄어들지 않도록
            }, { type: 'text', placeholder: '키 변경', maxLength: '1' });


            if (isMacroToggle) {
                keyInput.style.display = 'none'; // 매크로는 키 변경 불가
            }

            // --- 각주(툴팁) 추가 로직 (ALT+Z 매크로에만) ---
            if (enabledStorageKey === 'shortcutMacroZEnabled') {
                this.injectTooltipCSS(); // 툴팁 CSS 주입 보장

                const tooltipText = "AMD 아드레날린, 지포스 익스피리언스 단축키와 중복시 사용 불가";
                const footnoteContainer = this.createElement('span', {}, { className: 'footnote-container' });
                const footnoteTrigger = this.createElement('span', {
                    fontSize: '10px', color: '#d32f2f', fontWeight: 'bold',
                    verticalAlign: 'super', marginLeft: '3px', cursor: 'help'
                }, { textContent: '[주의]' });
                const tooltipElement = this.createElement('span', {}, {
                    className: 'footnote-tooltip', textContent: tooltipText
                });

                footnoteContainer.appendChild(footnoteTrigger);
                footnoteContainer.appendChild(tooltipElement);
                // labelEl 옆에 각주 컨테이너 추가
                labelEl.appendChild(footnoteContainer);
            }
            // --- 각주(툴팁) 추가 로직 끝 ---


            const keyStorageKey = enabledStorageKey.replace('Enabled', 'Key');
            const allCustomizableShortcutKeyStorageKeys = [ /* ... */ ];
            const defaultKey = isMacroToggle ? null : keyStorageKey.slice(-4, -3);

            if (!isMacroToggle) {
                Storage.getShortcutKey(keyStorageKey).then(savedKey => {
                    keyInput.placeholder = savedKey || defaultKey;
                });
            }

            // Checkbox logic (sessionStorage 클리어 포함)
            Storage.getShortcutEnabled(enabledStorageKey).then(enabled => {
                checkbox.checked = enabled;
                if (isMacroToggle) {
                    const storageKey = enabledStorageKey === 'shortcutMacroZEnabled' ? MACRO_Z_RUNNING_KEY : MACRO_X_RUNNING_KEY;
                    if (!enabled && sessionStorage.getItem(storageKey) === 'true') {
                        sessionStorage.setItem(storageKey, 'false');
                    }
                }
            });
            checkbox.addEventListener('change', async () => {
                await Storage.saveShortcutEnabled(enabledStorageKey, checkbox.checked);
                // 레이블 텍스트 조합하여 알림 메시지 생성
                const fullLabelForAlert = prefix ? `${prefix}${displayLabel}` : displayLabel;
                UI.showAlert(`${fullLabelForAlert} 기능이 ${checkbox.checked ? '활성화' : '비활성화'}되었습니다.`);

                if (!checkbox.checked && isMacroToggle) {
                    const storageKey = enabledStorageKey === 'shortcutMacroZEnabled' ? MACRO_Z_RUNNING_KEY : MACRO_X_RUNNING_KEY;
                    sessionStorage.setItem(storageKey, 'false');
                    console.log(`${prefix}Macro state cleared via UI toggle.`);
                }
            });

            // 키 입력 이벤트 리스너 (수정된 충돌 검사 로직 포함)
            if (!isMacroToggle) {
                keyInput.addEventListener('keydown', async (e) => { // async 추가
                    // 편집/탐색 키 허용
                    if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key)) {
                        return;
                    }
                    // 다른 모든 키 입력 시 기본 동작 방지
                    e.preventDefault();
                    e.stopPropagation();

                    const newKey = e.key.toUpperCase();

                    if (newKey.length === 1 && /^[A-Z]$/.test(newKey)) {
                        let isConflict = false;
                        let conflictingActionLabel = ''; // 충돌 기능 레이블 저장

                        // 충돌 검사 로직
                        for (const otherStorageKey of allCustomizableShortcutKeyStorageKeys) {
                            if (otherStorageKey === keyStorageKey) continue; // 자기 자신 제외

                            const otherDefault = otherStorageKey.slice(-4, -3);
                            const otherSavedKey = await Storage.getShortcutKey(otherStorageKey);
                            const currentlyAssignedKey = otherSavedKey || otherDefault;

                            if (currentlyAssignedKey === newKey) {
                                isConflict = true;
                                // 충돌된 기능의 레이블 찾기 (더 사용자 친화적인 메시지 위해)
                                // 이 부분은 실제 구현 시 단축키 목록과 레이블을 매핑하는 구조가 필요할 수 있음
                                // 여기서는 간단히 기본 키로 표시
                                conflictingActionLabel = `기본키 ${otherDefault}`;
                                break;
                            }
                        }

                        if (isConflict) {
                            UI.showAlert(`'${newKey}' 단축키는 이미 다른 기능(${conflictingActionLabel})에 할당되어 있습니다.`);
                            keyInput.value = '';
                        } else {
                            await Storage.saveShortcutKey(keyStorageKey, newKey);
                            UI.showAlert(`${label} 단축키가 '${newKey}'(으)로 변경되었습니다.`);
                            keyInput.placeholder = newKey;
                            keyInput.value = '';
                        }
                    } else if (newKey.length === 1) {
                        UI.showAlert("단축키는 영문 대문자(A-Z)만 가능합니다.");
                        keyInput.value = '';
                    }
                });

                // 포커스 이벤트 리스너
                keyInput.addEventListener('focus', () => { /* 필요 시 플래그 설정 */ });
                keyInput.addEventListener('blur', () => {
                });
            }

            // 요소들을 컨테이너에 추가
            container.appendChild(labelEl);
            container.appendChild(checkbox);
            if (!isMacroToggle) { // Only append input if not macro
                container.appendChild(keyInput);
            }
            return container;
        },

        createTitle() {
            return this.createElement('h3', {
                fontSize: '18px', fontWeight: '700', color: '#212121',
                margin: '0 0 15px 0', paddingBottom: '10px', borderBottom: '1px solid #e0e0e0'
            }, { textContent: '즐겨찾는 갤러리' });
        },

        createList() {
            return this.createElement('ul', {
                listStyle: 'none', margin: '0', padding: '0',
                maxHeight: '50vh', overflowY: 'auto'
            });
        },

        async updateFavoritesList(list) {
            list.innerHTML = '';
            const favorites = await Storage.getFavorites();
            Object.entries(favorites).forEach(([key, gallery]) => {
                list.appendChild(this.createFavoriteItem(key, gallery));
            });
        },

        createFavoriteItem(key, gallery) {
            const item = this.createElement('li', {
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 15px', margin: '5px 0', backgroundColor: '#fafafa',
                borderRadius: '10px', transition: 'background-color 0.2s ease', cursor: 'pointer'
            });

            item.addEventListener('mouseenter', () => item.style.backgroundColor = '#f0f0f0');
            item.addEventListener('mouseleave', () => item.style.backgroundColor = '#fafafa');
            item.addEventListener('click', () => this.navigateToGallery(gallery));

            // Ensure we display the gallery name properly
            const name = gallery.name || gallery.galleryName || gallery.galleryId || 'Unknown Gallery';
            item.appendChild(this.createElement('span', {
                fontSize: '15px', fontWeight: '400', color: '#424242',
                flexGrow: '1', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
            }, { textContent: `${key}: ${name}` }));

            item.appendChild(this.createRemoveButton(key));
            return item;
        },

        createRemoveButton(key) {
            const button = this.createElement('button', {
                backgroundColor: 'transparent', color: '#757575', border: 'none',
                borderRadius: '50%', width: '24px', height: '24px', fontSize: '16px',
                lineHeight: '1', cursor: 'pointer', transition: 'color 0.2s ease, background-color 0.2s ease'
            }, { textContent: '✕' });

            button.addEventListener('mouseenter', () => {
                button.style.color = '#d32f2f';
                button.style.backgroundColor = '#ffebee';
            });
            button.addEventListener('mouseleave', () => {
                button.style.color = '#757575';
                button.style.backgroundColor = 'transparent';
            });
            button.addEventListener('click', async (e) => {
                e.stopPropagation();
                const favorites = await Storage.getFavorites();
                delete favorites[key];
                Storage.saveFavorites(favorites);
                await this.updateFavoritesList(button.closest('ul'));
            });
            return button;
        },

        createAddContainer() {
            const container = this.createElement('div', {
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '8px', margin: '15px 0', padding: '15px', backgroundColor: '#f5f5f5',
                borderRadius: '10px'
            });

            const input = this.createElement('input', {
                width: '45px', padding: '8px', border: '1px solid #e0e0e0',
                borderRadius: '8px', fontSize: '14px', textAlign: 'center',
                outline: 'none', transition: 'border-color 0.2s ease', backgroundColor: '#ffffff'
            }, { type: 'text', placeholder: '0-9' });

            input.addEventListener('focus', () => input.style.borderColor = '#1976d2');
            input.addEventListener('blur', () => input.style.borderColor = '#e0e0e0');

            const button = this.createElement('button', {
                padding: '8px 16px', backgroundColor: '#1976d2', color: '#ffffff',
                border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '500',
                cursor: 'pointer', transition: 'background-color 0.2s ease', flexGrow: '1'
            }, { textContent: '즐겨찾기 추가' });

            button.addEventListener('mouseenter', () => button.style.backgroundColor = '#1565c0');
            button.addEventListener('mouseleave', () => button.style.backgroundColor = '#1976d2');
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                const digit = input.value.trim();
                if (!/^[0-9]$/.test(digit)) {
                    alert('0부터 9까지의 숫자를 입력해주세요.');
                    return;
                }
                Gallery.handleFavoriteKey(digit);
                input.value = '';
            });

            container.appendChild(input);
            container.appendChild(button);
            return container;
        },

        createCloseButton(container) {
            const button = this.createElement('button', {
                display: 'block', width: '100%', padding: '10px', marginTop: '15px',
                backgroundColor: '#1976d2', color: '#ffffff', border: 'none',
                borderRadius: '10px', fontSize: '15px', fontWeight: '500',
                cursor: 'pointer', transition: 'background-color 0.2s ease'
            }, { textContent: 'Close' });

            button.addEventListener('mouseenter', () => button.style.backgroundColor = '#1565c0');
            button.addEventListener('mouseleave', () => button.style.backgroundColor = '#1976d2');
            button.addEventListener('click', () => {
                container.style.opacity = '0';
                setTimeout(() => document.body.removeChild(container), 200);
            });
            return button;
        },

        navigateToGallery(gallery) {
            const url = gallery.galleryType === 'board'
            ? `https://gall.dcinside.com/board/lists?id=${gallery.galleryId}`
                : `https://gall.dcinside.com/${gallery.galleryType}/board/lists?id=${gallery.galleryId}`;
            window.location.href = url;
        },

        showAlert(message) {
            const alert = this.createElement('div', {
                position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.8)', color: 'white', padding: '15px 20px',
                borderRadius: '8px', fontSize: '14px', zIndex: '10000', transition: 'opacity 0.3s ease'
            }, { textContent: message });

            document.body.appendChild(alert);
            setTimeout(() => {
                alert.style.opacity = '0';
                setTimeout(() => document.body.removeChild(alert), 300);
            }, 2000);
        }
    };

    // Gallery Module
    const Gallery = {
        isMainPage() {
            const { href } = window.location;
            return href.includes('/lists') && href.includes('id=');
        },

        getInfo() {
            if (!this.isMainPage()) return { galleryType: '', galleryId: '', galleryName: '' };

            const { href } = window.location;
            const galleryType = href.includes('/person/') ? 'person' :
            href.includes('mgallery') ? 'mgallery' :
            href.includes('mini') ? 'mini' : 'board';
            const galleryId = href.match(/id=([^&]+)/)?.[1] || '';
            const nameEl = document.querySelector('div.fl.clear h2 a');
            const galleryName = nameEl
            ? Array.from(nameEl.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .join('') || galleryId
            : galleryId;

            return { galleryType, galleryId, galleryName };
        },

        async handleFavoriteKey(key) {
            const favorites = await Storage.getFavorites();
            const info = this.getInfo();

            if (favorites[key]) {
                UI.navigateToGallery(favorites[key]);
            } else if (this.isMainPage()) {
                // Ensure galleryName is saved as 'name' for UI compatibility
                favorites[key] = {
                    galleryType: info.galleryType,
                    galleryId: info.galleryId,
                    name: info.galleryName
                };
                Storage.saveFavorites(favorites);
                UI.showAlert(`${info.galleryName}이(가) ${key}번에 등록되었습니다.`);
                const list = document.querySelector('ul[style*="max-height: 50vh"]');
                if (list) await UI.updateFavoritesList(list);
            } else {
                alert('즐겨찾기 등록은 갤러리 메인 페이지에서만 가능합니다.');
            }
        },

        getPageInfo() {
            const { href } = window.location;
            const galleryType = href.includes('mgallery') ? 'mgallery' :
            href.includes('mini') ? 'mini' :
            href.includes('person') ? 'person' : 'board';
            const galleryId = href.match(/id=([^&]+)/)?.[1] || '';
            const currentPage = parseInt(href.match(/page=(\d+)/)?.[1] || '1', 10);
            const isRecommendMode = href.includes('exception_mode=recommend');

            return { galleryType, galleryId, currentPage, isRecommendMode };
        }
    };

    // Post Navigation Module
    const Posts = {
        isValidPost(numCell, titleCell, subjectCell) {
            if (!numCell || !titleCell) return false;
            const row = numCell.closest('tr');
            if (row?.classList.contains('block-disable') ||
                row?.classList.contains('list_trend') ||
                row?.style.display === 'none') return false;

            const numText = numCell.textContent.trim().replace(/\[\d+\]\s*|\[\+\d+\]\s*|\[\-\d+\]\s*/, '');
            if (['AD', '공지', '설문', 'Notice'].includes(numText) || isNaN(numText)) return false;
            if (titleCell.querySelector('em.icon_notice')) return false;
            if (subjectCell?.textContent.trim().match(/AD|공지|설문|뉴스|고정|이슈/)) return false;
            return true;
        },

        getValidPosts() {
            const rows = document.querySelectorAll('table.gall_list tbody tr');
            const validPosts = [];
            let currentIndex = -1;

            rows.forEach((row, index) => {
                const numCell = row.querySelector('td.gall_num');
                const titleCell = row.querySelector('td.gall_tit');
                const subjectCell = row.querySelector('td.gall_subject');
                if (!this.isValidPost(numCell, titleCell, subjectCell)) return;

                const link = titleCell.querySelector('a:first-child');
                if (link) {
                    validPosts.push({ row, link });
                    if (numCell.querySelector('.sp_img.crt_icon')) currentIndex = validPosts.length - 1;
                }
            });

            return { validPosts, currentIndex };
        },

        addNumberLabels() {
            // 1. 페이지 전체에서 유효한 게시글 목록을 가져옵니다.
            //    getValidPosts는 내부적으로 관련 테이블들을 찾아 처리해야 합니다.
            const { validPosts } = this.getValidPosts();
            // console.log(`addNumberLabels: Found ${validPosts.length} total valid posts.`); // 디버깅

            // 2. 찾은 모든 유효 게시글에 대해 라벨 추가 시도 (최대 100개)
            validPosts.slice(0, 100).forEach((post, i) => {
                const numCell = post.row.querySelector('td.gall_num');
                if (!numCell) return; // 번호 셀 없으면 건너뛰기

                // --- 중요: 중복 라벨 방지 체크 ---
                // 이 번호 셀('numCell') 내부에 이미 '.number-label'이 있는지 확인합니다.
                if (numCell.querySelector('span.number-label')) {
                    // console.log("Skipping already labeled cell:", numCell.textContent); // 디버깅
                    return; // 이미 라벨이 있으면 이 셀에 대한 작업 중단
                }
                // --- 체크 끝 ---

                // 현재 보고 있는 글 아이콘이 있으면 라벨 추가 안 함
                if (numCell.querySelector('.sp_img.crt_icon')) return;

                // 라벨 생성 및 추가
                const label = UI.createElement('span', {
                    color: '#ff6600', fontWeight: 'bold', marginRight: '3px'
                }, { className: 'number-label', textContent: `[${i + 1}]` });
                numCell.prepend(label);
            });
        },

        navigate(number) {
            const { validPosts } = this.getValidPosts();
            const index = parseInt(number, 10) - 1;
            if (index >= 0 && index < validPosts.length) {
                validPosts[index].link.click();
                return true;
            }
            return false;
        },
        formatDates() {
            // 오늘 날짜를 'YYYY-MM-DD' 형식으로 가져옵니다.
            const today = new Date();
            const todayDateString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

            // 아직 포맷되지 않은 '.gall_date' 셀들을 선택합니다.
            const dateCells = document.querySelectorAll('td.gall_date:not(.date-formatted)');

            dateCells.forEach(dateCell => {
                // title 속성에 전체 타임스탬프가 있는지 확인합니다.
                if (dateCell.title) {
                    const fullTimestamp = dateCell.title; // 예: "2025-04-08 17:03:17"

                    // 정규 표현식을 사용하여 년, 월, 일, 시, 분을 추출합니다.
                    const match = fullTimestamp.match(/(\d{4})-(\d{2})-(\d{2})\s(\d{2}):(\d{2}):\d{2}/);
                    // match[1]: YYYY, match[2]: MM, match[3]: DD, match[4]: HH, match[5]: mm

                    if (match) {
                        const postYear = match[1];
                        const postMonth = match[2];
                        const postDay = match[3];
                        const postHour = match[4];
                        const postMinute = match[5];
                        const postDateString = `${postYear}-${postMonth}-${postDay}`; // 게시글 작성일 (YYYY-MM-DD)

                        let formattedDate = ''; // 최종 표시될 문자열 초기화

                        // 게시글 작성일과 오늘 날짜 비교
                        if (postDateString === todayDateString) {
                            // 오늘 작성된 글이면 시간만 표시 (HH:MM)
                            formattedDate = `${postHour}:${postMinute}`;
                        } else {
                            // 오늘 이전에 작성된 글이면 날짜와 시간 표시 (MM.DD HH:MM)
                            formattedDate = `${postMonth}.${postDay} ${postHour}:${postMinute}`;
                        }

                        // 셀의 텍스트 내용을 결정된 형식으로 업데이트합니다.
                        // 단, 이미 원하는 형식과 동일하다면 DOM 조작 최소화를 위해 변경하지 않습니다.
                        if (dateCell.textContent !== formattedDate) {
                            dateCell.textContent = formattedDate;
                        }
                        // 처리 완료 표시 클래스를 추가하여 중복 작업을 방지합니다.
                        dateCell.classList.add('date-formatted');
                    }
                } else {
                    // title 속성이 없는 경우에도 처리된 것으로 표시합니다.
                    dateCell.classList.add('date-formatted');
                }
            });
        },
        // == 레이아웃 조정 함수 ==
        adjustColgroupWidths() {
            const colgroup = document.querySelector('table.gall_list colgroup');
            if (!colgroup) return;

            const cols = colgroup.querySelectorAll('col');
            let targetWidths = null; // 적용할 너비 배열 초기화

            // col 개수에 따라 다른 너비 배열 설정
            if (cols.length === 8) {
                // 8개인 경우 (예: 체크박스, 말머리, 아이콘, 제목, 글쓴이, 작성일, 조회, 추천)
                targetWidths = ['25px', '9%', '51px', null, '15%', '8%', '6%', '6%'];
                // console.log("말머리 + 아이콘 O (8 cols) 레이아웃 적용");
            } else if (cols.length === 7) {
                // 7개인 경우 (예: 번호, 말머리, 제목, 글쓴이, 작성일, 조회, 추천)
                targetWidths = ['9%', '51px', null, '15%', '8%', '6%', '6%'];
                // console.log("말머리 O (7 cols) 레이아웃 적용");
            } else if (cols.length === 6) {
                // 6개인 경우 (예: 번호, 제목, 글쓴이, 작성일, 조회, 추천)
                targetWidths = ['9%', null, '15%', '8%', '6%', '6%'];
                // console.log("말머리 X (6 cols) 레이아웃 적용");
            } else {
                // 예상과 다른 개수일 경우 경고 로그 남기고 종료
                console.warn("Colgroup 내 col 개수가 6, 7 또는 8이 아닙니다:", cols.length);
                return;
            }
            // 선택된 너비 배열(targetWidths)을 사용하여 스타일 적용
            cols.forEach((col, index) => {
                // targetWidths 배열 길이를 초과하는 인덱스는 무시 (안전 장치)
                if (index >= targetWidths.length) return;

                const targetWidth = targetWidths[index];

                if (targetWidth !== null) { // null이 아닌 경우 (너비 지정 필요)
                    // 현재 너비와 목표 너비가 다를 경우에만 변경
                    if (col.style.width !== targetWidth) {
                        col.style.width = targetWidth;
                    }
                } else { // null인 경우 (너비 지정 불필요, 브라우저 자동 계산)
                    // 기존에 width 스타일이 있었다면 제거
                    if (col.style.width) {
                        col.style.width = ''; // 또는 col.style.removeProperty('width');
                    }
                }
            });
        }
    };

    // Event Handlers
    const Events = {
        async triggerMacroNavigation() {
            const shouldRunZ = sessionStorage.getItem(MACRO_Z_RUNNING_KEY) === 'true';
            const shouldRunX = sessionStorage.getItem(MACRO_X_RUNNING_KEY) === 'true';

            if (shouldRunZ) {
                const enabled = await Storage.getShortcutEnabled('shortcutMacroZEnabled');
                if (enabled) {
                    console.log('Z Macro: Triggering previous post navigation after delay.');
                    // Add a small visual indicator that the macro is about to run
                    UI.showAlert('자동 이전 글 (2.5초 후)', 500); // Show brief alert
                    setTimeout(async () => {
                        // Double-check state *before* navigation, in case user cancelled
                        if (sessionStorage.getItem(MACRO_Z_RUNNING_KEY) === 'true') {
                            await this.navigatePrevPost();
                        } else {
                            console.log('Z Macro: Cancelled before navigation.');
                        }
                    }, MACRO_INTERVAL);
                } else {
                    // Feature disabled in UI, stop the macro state
                    console.log('Z Macro: Feature disabled, stopping.');
                    sessionStorage.setItem(MACRO_Z_RUNNING_KEY, 'false');
                }
            } else if (shouldRunX) {
                const enabled = await Storage.getShortcutEnabled('shortcutMacroXEnabled');
                if (enabled) {
                    console.log('X Macro: Triggering next post navigation after delay.');
                    UI.showAlert('자동 다음 글 (2.5초 후)', 500); // Show brief alert
                    setTimeout(async () => {
                        // Double-check state *before* navigation
                        if (sessionStorage.getItem(MACRO_X_RUNNING_KEY) === 'true') {
                            await this.navigateNextPost();
                        } else {
                            console.log('X Macro: Cancelled before navigation.');
                        }
                    }, MACRO_INTERVAL);
                } else {
                    // Feature disabled in UI, stop the macro state
                    console.log('X Macro: Feature disabled, stopping.');
                    sessionStorage.setItem(MACRO_X_RUNNING_KEY, 'false');
                }
            }
        },

        async toggleZMacro() {
            const enabled = await Storage.getShortcutEnabled('shortcutMacroZEnabled');
            if (!enabled) {
                UI.showAlert('이전 글 자동 넘김 기능이 비활성화 상태입니다.');
                sessionStorage.setItem(MACRO_Z_RUNNING_KEY, 'false'); // Ensure state is off
                return;
            }

            const isCurrentlyRunning = sessionStorage.getItem(MACRO_Z_RUNNING_KEY) === 'true';

            if (isCurrentlyRunning) {
                // Stop Z Macro
                sessionStorage.setItem(MACRO_Z_RUNNING_KEY, 'false');
                console.log('Z Macro stopped via toggle.');
                UI.showAlert('이전 글 자동 넘김 중지');
                // Clear any pending navigation timeout if the user stops it quickly
                // (This requires storing the timeout ID, slightly more complex. Let's omit for now)

            } else {
                // Start Z Macro
                sessionStorage.setItem(MACRO_Z_RUNNING_KEY, 'true');
                sessionStorage.setItem(MACRO_X_RUNNING_KEY, 'false'); // Ensure X is off
                console.log('Z Macro started via toggle. Navigating now...');
                UI.showAlert('이전 글 자동 넘김 시작 (ALT+Z로 중지)');
                await this.navigatePrevPost(); // Navigate *immediately* on start
            }
        },

        async toggleXMacro() {
            const enabled = await Storage.getShortcutEnabled('shortcutMacroXEnabled');
            if (!enabled) {
                UI.showAlert('다음 글 자동 넘김 기능이 비활성화 상태입니다.');
                sessionStorage.setItem(MACRO_X_RUNNING_KEY, 'false'); // Ensure state is off
                return;
            }

            const isCurrentlyRunning = sessionStorage.getItem(MACRO_X_RUNNING_KEY) === 'true';

            if (isCurrentlyRunning) {
                // Stop X Macro
                sessionStorage.setItem(MACRO_X_RUNNING_KEY, 'false');
                console.log('X Macro stopped via toggle.');
                UI.showAlert('다음 글 자동 넘김 중지');
                // Clear any pending navigation timeout if the user stops it quickly (optional enhancement)

            } else {
                // Start X Macro
                sessionStorage.setItem(MACRO_X_RUNNING_KEY, 'true');
                sessionStorage.setItem(MACRO_Z_RUNNING_KEY, 'false'); // Ensure Z is off
                console.log('X Macro started via toggle. Navigating now...');
                UI.showAlert('다음 글 자동 넘김 시작 (ALT+X로 중지)');
                await this.navigateNextPost(); // Navigate *immediately* on start
            }
        },
        // --- End NEW Macro Control Functions ---

        getFirstValidPostLink(doc) {
            // 특정 갤러리 목록을 감싸는 컨테이너 찾기
            const galleryListWrap = doc.querySelector('.gall_listwrap'); // <<< 범위 제한 추가
            if (!galleryListWrap) {
                console.error("Could not find gallery list container (.gall_listwrap) in fetched document.");
                return null;
            }

            // 찾은 컨테이너 내부의 tbody 안의 tr 만을 대상으로 함
            const rows = galleryListWrap.querySelectorAll('tbody tr'); // <<< 범위 제한 추가

            for (const row of rows) {
                // isValidPost 검사는 동일
                if (Posts.isValidPost(row.querySelector('td.gall_num'), row.querySelector('td.gall_tit'), row.querySelector('td.gall_subject'))) {
                    const link = row.querySelector('td.gall_tit a:first-child');
                    if (link && link.href) {
                        // 절대 URL 반환 로직은 동일
                        return new URL(link.getAttribute('href'), doc.baseURI).href;
                    }
                }
            }
            return null; // 유효한 링크 못 찾음
        },

        findPaginationLink(direction = 'next') { // 'next' 또는 'prev'
            let targetLinkElement = null;
            let targetPagingBox = null;

            // 페이징 박스 찾기 (기존 A/S 로직과 동일)
            const exceptionPagingWrap = document.querySelector('.bottom_paging_wrapre');
            if (exceptionPagingWrap) {
                targetPagingBox = exceptionPagingWrap.querySelector('.bottom_paging_box');
            } else {
                const normalPagingWraps = document.querySelectorAll('.bottom_paging_wrap');
                if (normalPagingWraps.length > 1) {
                    targetPagingBox = normalPagingWraps[1]?.querySelector('.bottom_paging_box');
                } else if (normalPagingWraps.length === 1) {
                    targetPagingBox = normalPagingWraps[0]?.querySelector('.bottom_paging_box');
                }
            }

            if (targetPagingBox) {
                const currentPageElement = targetPagingBox.querySelector('em');

                if (direction === 'prev') {
                    // 이전 링크 찾기
                    if (currentPageElement) {
                        const prevSibling = currentPageElement.previousElementSibling;
                        if (prevSibling?.tagName === 'A' && prevSibling.hasAttribute('href')) {
                            targetLinkElement = prevSibling;
                        }
                    } else { // em 없는 경우 (검색 등)
                        targetLinkElement = targetPagingBox.querySelector('a.search_prev[href]');
                    }
                } else { // direction === 'next'
                    // 다음 링크 찾기
                    if (currentPageElement) {
                        const nextSibling = currentPageElement.nextElementSibling;
                        if (nextSibling?.tagName === 'A' && nextSibling.hasAttribute('href')) {
                            targetLinkElement = nextSibling;
                        }
                    } else { // em 없는 경우 (검색 등)
                        targetLinkElement = targetPagingBox.querySelector('a.search_next[href]');
                    }
                }
            }
            return targetLinkElement; // 찾은 링크 요소 또는 null 반환
        },

        saveScrollPosition() {
            sessionStorage.setItem('dcinsideShortcut_scrollPos', window.scrollY);
        },

        numberInput: { mode: false, buffer: '', timeout: null, display: null },

        async handleKeydown(event) {
            // --- 디버깅 로그 추가 ---
            // console.log(`Keydown: Key='${event.key}', Code='${event.code}', Alt=${event.altKey}`);

            // Check for Macro Toggles FIRST
            if (event.altKey && !event.ctrlKey && !event.shiftKey && !event.metaKey) {
                // --- 디버깅 로그 추가 ---
                // console.log(`Alt key pressed: Code='${event.code}'`);

                // --- event.code 사용으로 변경 ---
                if (event.code === 'KeyZ') { // 'KeyZ'는 대부분의 표준 키보드에서 Z키의 코드입니다.
                    // console.log("Alt+Z (event.code) condition met!"); // 디버깅 확인용
                    event.preventDefault(); // 기본 동작 및 다른 리스너로의 전파 방지
                    event.stopPropagation(); // 이벤트 버블링 중단 (혹시 모를 상위 요소 리스너 방지)
                    await this.toggleZMacro();
                    return; // 처리 완료
                }
                if (event.code === 'KeyX') { // 'KeyX'는 X키의 코드입니다.
                    // console.log("Alt+X (event.code) condition met!"); // 디버깅 확인용
                    event.preventDefault();
                    event.stopPropagation();
                    await this.toggleXMacro();
                    return; // 처리 완료
                }
                // --- 변경 끝 ---

                // --- Existing Alt key logic ---
                if (event.key === 'w' || event.key === 'W') {
                    event.preventDefault();
                    // Check if macro is running, if so, maybe prevent 글쓰기 등록? Or stop macro?
                    // Decide on desired behavior. For now, it proceeds.
                    const writeButton = document.querySelector('button.btn_lightpurple.btn_svc.write[type="image"]');
                    if (writeButton) writeButton.click();
                } else if (event.key >= '0' && event.key <= '9') {
                    event.preventDefault();
                    const enabled = await Storage.getAltNumberEnabled();
                    if (enabled) {
                        Gallery.handleFavoriteKey(event.key);
                    }
                } else if (event.key === '`') {
                    event.preventDefault();
                    const ui = document.querySelector('div[style*="position: fixed; top: 50%"]');
                    ui ? ui.remove() : UI.showFavorites();
                }
                // --- End Existing Alt key logic ---
            } else if (!event.ctrlKey && !event.altKey && !event.shiftKey && !event.metaKey) {
                // Prevent regular Z/X if the corresponding macro *should* be running (optional but good)
                if ((event.key.toUpperCase() === 'Z' && sessionStorage.getItem(MACRO_Z_RUNNING_KEY) === 'true') ||
                    (event.key.toUpperCase() === 'X' && sessionStorage.getItem(MACRO_X_RUNNING_KEY) === 'true')) {
                    console.log(`Macro state is active, ignoring regular ${event.key.toUpperCase()} press.`);
                    event.preventDefault(); // Prevent default Z/X navigation if macro is on
                    return;
                }

                // Check standard shortcut enabled status (no change here)
                const stdShortcutEnabled = await Storage.getShortcutEnabled(`shortcut${event.key.toUpperCase()}Enabled`);
                if (stdShortcutEnabled) {
                    this.handleNavigationKeys(event);
                }
            }
        },

        async loadPageContentAjax(targetLinkUrl, isViewMode) {
            UI.showAlert('로딩 중...');
            let finalUrlToPush = targetLinkUrl;
            let urlToFetch = targetLinkUrl;

            try {
                // Calculate urlToFetch and finalUrlToPush based on isViewMode
                if (isViewMode) {
                    try {
                        const currentUrl = new URL(window.location.href);
                        const targetUrlObj = new URL(targetLinkUrl, window.location.origin);
                        const targetParams = targetUrlObj.searchParams;
                        const targetPage = targetParams.get('page');
                        if (targetPage) {
                            currentUrl.searchParams.set('page', targetPage);
                            ['search_pos', 's_type', 's_keyword', 'exception_mode'].forEach(param => {
                                if (targetParams.has(param)) {
                                    currentUrl.searchParams.set(param, targetParams.get(param));
                                }
                            });
                            urlToFetch = currentUrl.toString();
                            finalUrlToPush = urlToFetch;
                        } else {
                            throw new Error("Target link missing 'page' parameter");
                        }
                    } catch (e) {
                        console.error("Error constructing URL for AJAX fetch in view mode:", e);
                        window.location.href = targetLinkUrl; // Fallback navigation
                        return;
                    }
                }

                // Fetch content
                const response = await fetch(urlToFetch);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const htmlText = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlText, 'text/html');

                // Find NEW content
                const newTbody = doc.querySelector('table.gall_list tbody');
                let newPagingWrapElement = null;
                const exceptionWrap = doc.querySelector('.bottom_paging_wrapre');
                if (exceptionWrap) {
                    newPagingWrapElement = exceptionWrap;
                } else {
                    const normalWraps = doc.querySelectorAll('.bottom_paging_wrap');
                    if (normalWraps.length > 1) { newPagingWrapElement = normalWraps[1]; }
                    else if (normalWraps.length === 1) { newPagingWrapElement = normalWraps[0]; }
                }

                // Find CURRENT elements
                const currentTbody = document.querySelector('table.gall_list tbody');
                let currentPagingWrapElement = document.querySelector('.bottom_paging_wrapre');
                if (!currentPagingWrapElement) {
                    const currentNormalWraps = document.querySelectorAll('.bottom_paging_wrap');
                    if (currentNormalWraps.length > 1) { currentPagingWrapElement = currentNormalWraps[1]; }
                    else if (currentNormalWraps.length === 1){ currentPagingWrapElement = currentNormalWraps[0]; }
                }

                // Validate and Replace
                if (!newTbody) throw new Error("Could not find 'tbody' in fetched content.");
                if (!currentTbody) throw new Error("Could not find current 'tbody' to replace.");
                currentTbody.innerHTML = newTbody.innerHTML; // Replace tbody

                if (newPagingWrapElement && currentPagingWrapElement) {
                    currentPagingWrapElement.innerHTML = newPagingWrapElement.innerHTML; // Replace pagination
                } else if (!newPagingWrapElement && currentPagingWrapElement) {
                    currentPagingWrapElement.innerHTML = ''; // Clear current pagination
                    console.log("Fetched page has no pagination, clearing current.");
                } else if (newPagingWrapElement && !currentPagingWrapElement) {
                    console.warn("Current page missing pagination wrap, cannot insert new pagination dynamically.");
                }

                // Re-run initializations
                Posts.adjustColgroupWidths(); Posts.addNumberLabels(); Posts.formatDates();

                // Update Browser URL
                history.pushState(null, '', finalUrlToPush);

                // Scroll to top of list
                currentTbody.closest('table.gall_list')?.scrollIntoView({ behavior: 'auto', block: 'start' });

                // Remove loading indicator
                const loadingAlert = Array.from(document.querySelectorAll('div[style*="position: fixed"]')).find(el => el.textContent === '로딩 중...');
                if (loadingAlert) loadingAlert.remove();

                // Update Prefetch Hints After AJAX Load
                addPrefetchHints(); // <<< AJAX 완료 후 프리페칭 힌트 업데이트

            } catch (error) {
                console.error('Failed to load page content via AJAX:', error);
                UI.showAlert('오류 발생: 페이지 로딩 실패');
                // Fallback to full page navigation
                console.log("Falling back to full page navigation.");
                // Fallback should use the original TARGET link URL, not the potentially modified urlToFetch
                window.location.href = targetLinkUrl;
            }
        }, // Add comma if needed

        handleNavigationKeys(event) {
            const active = document.activeElement;
            if (active && ['TEXTAREA', 'INPUT'].includes(active.tagName) || active.isContentEditable) return;

            if (['`', '.'].includes(event.key)) {
                event.preventDefault();
                this.toggleNumberInput(event.key);
                return;
            }

            if (this.numberInput.mode) {
                this.handleNumberInput(event);
                return;
            }

            if (event.key >= '0' && event.key <= '9') {
                const index = event.key === '0' ? 9 : parseInt(event.key, 10) - 1;
                const { validPosts } = Posts.getValidPosts();
                if (index < validPosts.length) validPosts[index].link.click();
                return;
            }

            this.handleShortcuts(event.key.toUpperCase(), event);
        },

        toggleNumberInput(key) {
            if (this.numberInput.mode && this.numberInput.buffer) {
                Posts.navigate(this.numberInput.buffer);
                this.exitNumberInput();
            } else {
                this.numberInput.mode = true;
                this.numberInput.buffer = '';
                this.updateNumberDisplay('Post number: ');
                this.resetNumberTimeout();
            }
        },

        handleNumberInput(event) {
            event.preventDefault();
            if (event.key >= '0' && event.key <= '9') {
                this.numberInput.buffer += event.key;
                this.updateNumberDisplay(`Post number: ${this.numberInput.buffer}`);
                this.resetNumberTimeout();
            } else if (event.key === 'Enter' && this.numberInput.buffer) {
                Posts.navigate(this.numberInput.buffer);
                this.exitNumberInput();
            } else if (event.key === 'Escape') {
                this.exitNumberInput();
            }
        },

        updateNumberDisplay(text) {
            if (!this.numberInput.display) {
                this.numberInput.display = UI.createElement('div', {
                    position: 'fixed', top: '10px', right: '10px', backgroundColor: 'rgba(0,0,0,0.7)',
                    color: 'white', padding: '10px 15px', borderRadius: '5px', fontSize: '16px',
                    fontWeight: 'bold', zIndex: '9999'
                });
                document.body.appendChild(this.numberInput.display);
            }
            this.numberInput.display.textContent = text;
        },

        resetNumberTimeout() {
            clearTimeout(this.numberInput.timeout);
            this.numberInput.timeout = setTimeout(() => this.exitNumberInput(), 3000);
        },

        exitNumberInput() {
            this.numberInput.mode = false;
            this.numberInput.buffer = '';
            clearTimeout(this.numberInput.timeout);
            this.numberInput.timeout = null;
            if (this.numberInput.display) {
                this.numberInput.display.remove();
                this.numberInput.display = null;
            }
        },

        async handleShortcuts(key, event) {
            const { galleryType, galleryId, currentPage, isRecommendMode } = Gallery.getPageInfo(); // isRecommendMode 추가
            const isViewMode = window.location.pathname.includes('/board/view/'); // isViewMode 정의

            // --- Simple navigation function (NO scroll saving) ---
            const navigate = url => {
                if (document.readyState === 'complete') {
                    window.location.href = url;
                } else {
                    window.addEventListener('load', () => window.location.href = url, { once: true });
                }
            };

            // Get saved shortcut keys
            const savedKeys = {
                'W': await Storage.getShortcutKey('shortcutWKey') || 'W',
                'C': await Storage.getShortcutKey('shortcutCKey') || 'C',
                'D': await Storage.getShortcutKey('shortcutDKey') || 'D',
                'R': await Storage.getShortcutKey('shortcutRKey') || 'R',
                'Q': await Storage.getShortcutKey('shortcutQKey') || 'Q',
                'E': await Storage.getShortcutKey('shortcutEKey') || 'E',
                'F': await Storage.getShortcutKey('shortcutFKey') || 'F',
                'G': await Storage.getShortcutKey('shortcutGKey') || 'G',
                'A': await Storage.getShortcutKey('shortcutAKey') || 'A',
                'S': await Storage.getShortcutKey('shortcutSKey') || 'S',
                'Z': await Storage.getShortcutKey('shortcutZKey') || 'Z',
                'X': await Storage.getShortcutKey('shortcutXKey') || 'X'
            };

            // Determine base URLs for F and G keys
            let basePath = '';
            if (galleryType !== 'board') { basePath = `/${galleryType}`; }
            const listPath = `/board/lists/`;
            const baseListUrl = `https://gall.dcinside.com${basePath}${listPath}?id=${galleryId}`;
            const recommendListUrl = `${baseListUrl}&exception_mode=recommend`;

            switch (key) {
                case savedKeys['W']: document.querySelector('button#btn_write')?.click(); break;
                case savedKeys['C']: event.preventDefault(); document.querySelector('textarea[id^="memo_"]')?.focus(); break;
                case savedKeys['D']: document.querySelector('button.btn_cmt_refresh')?.click(); break;
                case savedKeys['R']: location.reload(); break; // Full reload
                case savedKeys['Q']: window.scrollTo(0, 0); break;
                case savedKeys['E']: document.querySelector('table.gall_list')?.scrollIntoView({ block: 'start' }); break;
                    // F and G now use the simple navigate without scroll saving
                case savedKeys['F']: navigate(baseListUrl); break;
                case savedKeys['G']: navigate(recommendListUrl); break;

                    // --- REVISED A and S Logic (Mode Switching + View Mode Handling) ---
                case savedKeys['A']: // 이전 페이지
                case savedKeys['S']: { // 다음 페이지
                    let targetLinkElement = null;
                    let targetPagingBox = null;
                    let emExistsInTarget = false;

                    // 1. Determine the correct paging box (동일 로직)
                    const exceptionPagingWrap = document.querySelector('.bottom_paging_wrapre');
                    if (exceptionPagingWrap) {
                        targetPagingBox = exceptionPagingWrap.querySelector('.bottom_paging_box');
                    } else {
                        const normalPagingWraps = document.querySelectorAll('.bottom_paging_wrap');
                        if (normalPagingWraps.length > 1) {
                            targetPagingBox = normalPagingWraps[1]?.querySelector('.bottom_paging_box');
                        } else if (normalPagingWraps.length === 1) {
                            targetPagingBox = normalPagingWraps[0]?.querySelector('.bottom_paging_box');
                        }
                    }

                    // 2. Find the target link element (동일 로직)
                    if (targetPagingBox) {
                        const currentPageElement = targetPagingBox.querySelector('em');
                        emExistsInTarget = !!currentPageElement; // em 존재 여부 확인

                        if (key === savedKeys['A']) {
                            if (currentPageElement) {
                                const prevSibling = currentPageElement.previousElementSibling;
                                if (prevSibling?.tagName === 'A' && prevSibling.hasAttribute('href')) { targetLinkElement = prevSibling; }
                            } else { // em이 없는 경우 (검색 결과 등) prev 버튼 찾기
                                targetLinkElement = targetPagingBox.querySelector('a.search_prev[href]');
                            }
                        } else { // key === savedKeys['S']
                            if (currentPageElement) {
                                const nextSibling = currentPageElement.nextElementSibling;
                                if (nextSibling?.tagName === 'A' && nextSibling.hasAttribute('href')) { targetLinkElement = nextSibling; }
                            } else { // em이 없는 경우 next 버튼 찾기
                                targetLinkElement = targetPagingBox.querySelector('a.search_next[href]');
                            }
                        }
                    } // end if(targetPagingBox)

                    // 3. Get Navigation Mode and Execute
                    if (targetLinkElement) {
                        const targetUrlFromHref = targetLinkElement.href; // 링크의 href 속성값
                        const navMode = await Storage.getPageNavigationMode(); // 설정값 읽기

                        if (navMode === 'ajax') {
                            // AJAX 모드: 기존 로직 실행 (isViewMode 전달)
                            this.loadPageContentAjax(targetUrlFromHref, isViewMode);
                        } else {
                            // --- Full Load 모드 ---
                            // <<< 스크롤 위치 저장 호출 추가 >>>
                            this.saveScrollPosition();
                            if (isViewMode) {
                                // 현재 페이지가 View 모드일 때: 현재 URL 기반으로 page와 search_pos 변경
                                try {
                                    // 1. 대상 링크(targetLinkElement)의 href에서 목표 page와 search_pos 추출
                                    const linkUrl = new URL(targetUrlFromHref);
                                    const targetPage = linkUrl.searchParams.get('page');
                                    const targetSearchPos = linkUrl.searchParams.get('search_pos'); // 대상 링크의 search_pos 값

                                    if (targetPage) {
                                        // 2. 현재 페이지 URL을 가져와서 필요한 파라미터만 교체
                                        const currentUrl = new URL(window.location.href);
                                        currentUrl.searchParams.set('page', targetPage); // page 파라미터 업데이트

                                        // 3. search_pos 파라미터 처리
                                        if (targetSearchPos) {
                                            // 대상 링크에 search_pos가 있으면 그 값으로 설정
                                            currentUrl.searchParams.set('search_pos', targetSearchPos);
                                        } else {
                                            // 대상 링크에 search_pos가 없으면 현재 URL에서도 제거
                                            currentUrl.searchParams.delete('search_pos');
                                        }

                                        // 4. 변경된 URL로 이동 (페이지 새로고침 발생)
                                        window.location.href = currentUrl.toString();
                                    } else {
                                        // 링크 URL에 page 파라미터가 없는 예외적인 경우 (Fallback)
                                        console.warn("Full Load (View Mode): Target link missing 'page' parameter. Navigating directly.", targetUrlFromHref);
                                        window.location.href = targetUrlFromHref;
                                    }
                                } catch (e) {
                                    console.error("Full Load (View Mode): Error processing URL. Navigating directly.", e, targetUrlFromHref);
                                    // URL 처리 중 오류 발생 시 (Fallback)
                                    window.location.href = targetUrlFromHref;
                                }
                            } else {
                                // 현재 페이지가 View 모드가 아닐 때 (List 모드): 그냥 대상 링크 URL로 이동
                                window.location.href = targetUrlFromHref;
                            }
                            // --- Full Load 모드 끝 ---
                        }

                    } else if (key === savedKeys['A']) {
                        // 첫 페이지 알림 (em이 있을 때만)
                        if (emExistsInTarget) {
                            UI.showAlert('첫 페이지입니다.');
                        }
                    }
                    break; // End of A/S block
                }
                    // --- END REVISED A and S Logic ---

                case savedKeys['Z']: await this.navigatePrevPost(galleryType, galleryId, currentPage); break; // Z/X still use full navigation
                case savedKeys['X']: await this.navigateNextPost(galleryType, galleryId, currentPage); break; // Z/X still use full navigation
            }
        },
        async navigatePrevPost() {
            const crtIcon = document.querySelector('td.gall_num .sp_img.crt_icon');
            if (!crtIcon) return; // Not on a post view or can't find current post icon

            // --- Try finding the previous post on the CURRENT page first ---
            let row = crtIcon.closest('tr')?.previousElementSibling;
            while (row && !Posts.isValidPost(row.querySelector('td.gall_num'), row.querySelector('td.gall_tit'), row.querySelector('td.gall_subject'))) {
                row = row.previousElementSibling;
            }

            if (row) {
                // --- Found previous post on the same page ---
                const prevLinkElement = row.querySelector('td.gall_tit a:first-child');
                if (prevLinkElement) {
                    window.location.href = prevLinkElement.href; // Navigate directly
                }
                return; // Done
            }

            // --- If no previous post on the current page, check for previous PAGE link ---
            const prevPageLinkElement = this.findPaginationLink('prev'); // Find '<' or 'prev search' link

            if (prevPageLinkElement && prevPageLinkElement.href) {
                // --- Previous PAGE link exists ---
                const isPrevSearchLink = prevPageLinkElement.classList.contains('search_prev');

                if (isPrevSearchLink) {
                    // --- Handle "Previous Search" link (special logic) ---
                    console.log("[Z Nav] Detected 'Previous Search' link. Starting special logic...");
                    try {
                        const prevSearchBlockFirstPageUrl = new URL(prevPageLinkElement.href);
                        console.log("[Z Nav] Fetching previous search block page 1:", prevSearchBlockFirstPageUrl.toString());
                        const doc1 = await this.fetchPage(prevSearchBlockFirstPageUrl.toString());

                        const allPagingBoxes = doc1.querySelectorAll('.bottom_paging_box');
                        let pagingBox1 = null;
                        console.log(`[Z Nav] Found ${allPagingBoxes.length} paging boxes in fetched page 1.`);
                        if (allPagingBoxes.length > 1) {
                            pagingBox1 = allPagingBoxes[1]; // Assume second is gallery list
                            console.log("[Z Nav] Using the second paging box.");
                        } else if (allPagingBoxes.length === 1) {
                            pagingBox1 = allPagingBoxes[0]; // Use the only one found
                            console.log("[Z Nav] Only one paging box found, using it.");
                        }

                        if (!pagingBox1) {
                            throw new Error("Could not find the relevant pagination box on the first page of the previous search block.");
                        }
                        console.log("[Z Nav] Relevant paging box content:", pagingBox1.innerHTML);

                        let lastPageNum = 1;
                        const nextSearchLink1 = pagingBox1.querySelector('a.search_next');
                        if (nextSearchLink1) {
                            const lastPageLinkElement = nextSearchLink1.previousElementSibling;
                            if (lastPageLinkElement?.tagName === 'A' && lastPageLinkElement.href) {
                                const pageNumStr = new URL(lastPageLinkElement.href).searchParams.get('page');
                                if (pageNumStr) lastPageNum = parseInt(pageNumStr, 10);
                            }
                        } else {
                            const pageLinks = pagingBox1.querySelectorAll('a:not(.search_prev):not(.search_next)');
                            if (pageLinks.length > 0) {
                                const lastLink = pageLinks[pageLinks.length - 1];
                                if(lastLink?.href){
                                    const pageNumStr = new URL(lastLink.href).searchParams.get('page');
                                    if (pageNumStr) lastPageNum = parseInt(pageNumStr, 10);
                                }
                            }
                        }
                        console.log("[Z Nav] Calculated lastPageNum for previous block:", lastPageNum);

                        const prevSearchBlockLastPageUrl = new URL(prevSearchBlockFirstPageUrl);
                        prevSearchBlockLastPageUrl.searchParams.set('page', lastPageNum.toString());
                        console.log("[Z Nav] Fetching previous search block last page:", prevSearchBlockLastPageUrl.toString());
                        const doc2 = await this.fetchPage(prevSearchBlockLastPageUrl.toString());

                        const finalPostLinkHref = this.getLastValidPostLink(doc2);
                        console.log("[Z Nav] Found finalPostLinkHref on last page:", finalPostLinkHref);

                        if (finalPostLinkHref) {
                            const targetPostUrl = new URL(finalPostLinkHref);
                            const targetNo = targetPostUrl.searchParams.get('no');

                            if (targetNo) {
                                const currentUrl = new URL(window.location.href);
                                currentUrl.searchParams.set('no', targetNo);
                                currentUrl.searchParams.set('page', lastPageNum.toString());
                                const targetSearchPos = prevSearchBlockFirstPageUrl.searchParams.get('search_pos');
                                if (targetSearchPos) currentUrl.searchParams.set('search_pos', targetSearchPos);
                                else currentUrl.searchParams.delete('search_pos');

                                console.log("[Z Nav] Final navigation URL:", currentUrl.toString());
                                window.location.href = currentUrl.toString();
                            } else { throw new Error("Could not extract 'no' from final post link."); }
                        } else { throw new Error("Could not find the last valid post on the last page of the previous search block."); }

                    } catch (error) {
                        console.error("[Z Nav] Error processing 'Previous Search' navigation:", error);
                        UI.showAlert('"이전 검색" 블록 이동 중 오류가 발생했습니다.');
                        window.location.href = prevPageLinkElement.href; // Fallback
                    }
                } else {
                    // --- Handle regular previous page link ---
                    try {
                        const doc = await this.fetchPage(prevPageLinkElement.href);
                        const lastValidLinkHref = this.getLastValidPostLink(doc);

                        if (lastValidLinkHref) {
                            const targetLinkUrl = new URL(lastValidLinkHref);
                            const targetNo = targetLinkUrl.searchParams.get('no');

                            if (targetNo) {
                                const currentUrl = new URL(window.location.href);
                                currentUrl.searchParams.set('no', targetNo);
                                const prevPageListUrl = new URL(prevPageLinkElement.href);
                                const targetPage = prevPageListUrl.searchParams.get('page');
                                if (targetPage) currentUrl.searchParams.set('page', targetPage);
                                const targetSearchPos = prevPageListUrl.searchParams.get('search_pos');
                                if (targetSearchPos) currentUrl.searchParams.set('search_pos', targetSearchPos);
                                else currentUrl.searchParams.delete('search_pos');

                                window.location.href = currentUrl.toString();
                            } else { throw new Error("Could not extract 'no' from last valid post link."); }
                        } else { UI.showAlert('이전 페이지에 표시할 게시글이 없습니다.'); }
                    } catch (error) {
                        console.error("Error fetching/processing previous page for Z nav:", error);
                        UI.showAlert('이전 페이지 로딩 중 오류가 발생했습니다.');
                    }
                }
            } else {
                // --- NO previous post on current page AND NO previous page link ---
                // --- This means we are on the first post of page 1. Check for newer posts. ---
                const currentUrl = new URL(window.location.href);
                const currentPostNoStr = currentUrl.searchParams.get('no');

                if (!currentPostNoStr) {
                    UI.showAlert('현재 글 번호를 찾을 수 없습니다. 페이지를 새로고침 해주세요.');
                    return;
                }
                const currentPostNo = parseInt(currentPostNoStr, 10);
                if (isNaN(currentPostNo)) {
                    UI.showAlert('현재 글 번호가 유효하지 않습니다.');
                    return;
                }

                // Construct the URL for the list view of the current page (page 1)
                const listUrl = new URL(window.location.href);
                // Make sure path points to lists, not view
                listUrl.pathname = listUrl.pathname.replace(/(\/board)\/view\/?/, '$1/lists/');
                listUrl.searchParams.set('page', '1'); // Explicitly page 1
                listUrl.searchParams.delete('no');    // Remove post number

                UI.showAlert('최신 글 확인 중...'); // Feedback

                try {
                    const doc = await this.fetchPage(listUrl.toString());
                    // Get all valid posts from the fetched page 1 list
                    const allPostsOnPage1 = this.getValidPostsFromDoc(doc); // Uses existing helper

                    // Check if any post on the fetched list is newer than the currently viewed post
                    const newerPosts = allPostsOnPage1.filter(p => p.num > currentPostNo);

                    if (newerPosts.length > 0) {
                        // Newer posts exist! Navigate to the newest one found on page 1.
                        const newestPost = allPostsOnPage1.sort((a, b) => b.num - a.num)[0];

                        if (newestPost && newestPost.link) {
                            UI.showAlert('새로운 글을 발견하여 이동합니다.');

                            // Construct the VIEW url for the newest post
                            const targetViewUrl = new URL(newestPost.link); // Base link from list item
                            targetViewUrl.searchParams.set('page', '1'); // Set page=1 for context

                            // Preserve relevant parameters (like exception_mode, search) from the current URL
                            const currentSearchParams = new URLSearchParams(window.location.search);
                            ['exception_mode', 'search_pos', 's_type', 's_keyword'].forEach(param => {
                                if (currentSearchParams.has(param)) {
                                    targetViewUrl.searchParams.set(param, currentSearchParams.get(param));
                                }
                            });

                            window.location.href = targetViewUrl.toString();

                        } else {
                            // Should not happen if newerPosts.length > 0, but as a fallback:
                            UI.showAlert('첫 게시글입니다.');
                        }
                    } else {
                        // No newer posts found after checking.
                        UI.showAlert('첫 게시글입니다.');
                    }
                } catch (error) {
                    console.error("Error checking for newer posts:", error);
                    UI.showAlert('최신 글 확인 중 오류가 발생했습니다.');
                    // Optionally fall back to just showing the original alert
                    // UI.showAlert('첫 게시글입니다.');
                }
            }
            // --- End of Page Boundary / Newer Post Check ---
        }, // End navigatePrevPost

        async navigateNextPost() {
            const crtIcon = document.querySelector('td.gall_num .sp_img.crt_icon');
            let nextValidRowLink = null;

            if (crtIcon) {
                let row = crtIcon.closest('tr')?.nextElementSibling;
                while (row) {
                    if (Posts.isValidPost(row.querySelector('td.gall_num'), row.querySelector('td.gall_tit'), row.querySelector('td.gall_subject'))) {
                        nextValidRowLink = row.querySelector('td.gall_tit a:first-child');
                        break;
                    }
                    row = row.nextElementSibling;
                }
            }

            if (nextValidRowLink) {
                // --- 현재 페이지 내 다음 글 처리 ---

                window.location.href = nextValidRowLink.href; // 스크롤 복원과 함께 직접 이동
            } else {
                // --- 페이지 경계 처리 (Fetch 후 View URL 재구성) ---
                const nextPageLink = this.findPaginationLink('next'); // 다음 페이지 목록 링크 찾기

                if (nextPageLink && nextPageLink.href) {
                    try {
                        // 1. 다음 페이지 목록 HTML 가져오기
                        const doc = await this.fetchPage(nextPageLink.href);
                        // 2. 다음 페이지의 첫 번째 유효 글 링크 찾기 (절대 URL 반환)
                        const firstValidLinkHref = this.getFirstValidPostLink(doc);

                        if (firstValidLinkHref) {
                            // 3. 첫 번째 글 링크에서 'no' 값 추출
                            const targetLinkUrl = new URL(firstValidLinkHref);
                            const targetNo = targetLinkUrl.searchParams.get('no');

                            if (targetNo) {
                                // 4. 현재 URL을 기준으로 최종 이동 URL 생성
                                const currentUrl = new URL(window.location.href);
                                //    - 'no' 업데이트
                                currentUrl.searchParams.set('no', targetNo);
                                //    - 'page' 업데이트 (다음 페이지 목록 링크에서 가져오기)
                                const nextPageListUrl = new URL(nextPageLink.href);
                                const targetPage = nextPageListUrl.searchParams.get('page');
                                if (targetPage) {
                                    currentUrl.searchParams.set('page', targetPage);
                                }
                                //    - 'search_pos' 업데이트 (다음 페이지 목록 링크에서 가져오기)
                                const targetSearchPos = nextPageListUrl.searchParams.get('search_pos');
                                if (targetSearchPos) {
                                    currentUrl.searchParams.set('search_pos', targetSearchPos);
                                } else {
                                    currentUrl.searchParams.delete('search_pos');
                                }
                                //    - s_type, s_keyword 등은 현재 URL의 값 유지됨

                                // 5. 스크롤 위치 저장 및 최종 URL로 이동
                                window.location.href = currentUrl.toString();

                            } else {
                                console.error("Could not extract 'no' from first valid post link:", firstValidLinkHref);
                                UI.showAlert('다음 글 정보 로딩 중 오류가 발생했습니다.');
                            }
                        } else {
                            UI.showAlert('다음 페이지에 표시할 게시글이 없습니다.');
                        }
                    } catch (error) {
                        console.error("Error fetching/processing next page for X nav:", error);
                        UI.showAlert('다음 페이지 로딩 중 오류가 발생했습니다.');
                    }
                } else {
                    UI.showAlert('마지막 게시글입니다.');
                }
                // --- 페이지 경계 처리 끝 ---
            }
        },
        getNextValidLink() {
            const crtIcon = document.querySelector('td.gall_num .sp_img.crt_icon');
            if (!crtIcon) return null;
            let row = crtIcon.closest('tr')?.nextElementSibling;
            while (row && !Posts.isValidPost(row.querySelector('td.gall_num'), row.querySelector('td.gall_tit'), row.querySelector('td.gall_subject'))) {
                row = row.nextElementSibling;
            }
            return row?.querySelector('td.gall_tit a:first-child');
        },

        async fetchPage(url) {
            const response = await fetch(url);
            const text = await response.text();
            return new DOMParser().parseFromString(text, 'text/html');
        },

        getLastValidPostLink(doc) {
            // 특정 갤러리 목록을 감싸는 컨테이너를 먼저 찾음
            // '.gall_listwrap' 클래스를 가진 첫 번째 요소를 대상으로 가정
            // 만약 구조가 다르다면 이 선택자를 조정해야 할 수 있음
            const galleryListWrap = doc.querySelector('.gall_listwrap'); // <<< 범위 제한 추가
            if (!galleryListWrap) {
                console.error("Could not find gallery list container (.gall_listwrap) in fetched document.");
                return null; // 컨테이너 못 찾으면 null 반환
            }

            // 찾은 컨테이너 내부의 tbody 안의 tr 만을 대상으로 함
            const rows = Array.from(galleryListWrap.querySelectorAll('tbody tr')); // <<< 범위 제한 추가

            for (let i = rows.length - 1; i >= 0; i--) {
                const row = rows[i];
                // isValidPost 검사는 동일
                if (Posts.isValidPost(row.querySelector('td.gall_num'), row.querySelector('td.gall_tit'), row.querySelector('td.gall_subject'))) {
                    const link = row.querySelector('td.gall_tit a:first-child');
                    if (link && link.href) {
                        // 절대 URL 반환 로직은 동일
                        return new URL(link.getAttribute('href'), doc.baseURI).href;
                    }
                }
            }
            return null; // 유효한 링크 못 찾음
        },

        getNewerPosts(doc, currentNo) {
            const posts = this.getValidPostsFromDoc(doc);
            return posts.filter(p => p.num > currentNo).sort((a, b) => a.num - b.num);
        },

        getValidPostsFromDoc(doc) {
            return Array.from(doc.querySelectorAll('table.gall_list tbody tr'))
                .filter(row => Posts.isValidPost(row.querySelector('td.gall_num'), row.querySelector('td.gall_tit'), row.querySelector('td.gall_subject')))
                .map(row => {
                const num = parseInt(row.querySelector('td.gall_num').textContent.trim().replace(/\[\d+\]\s*/, ''), 10);
                return { num, link: row.querySelector('td.gall_tit a:first-child')?.href };
            });
        }
    };

    // --- Prefetching Logic ---
    function addPrefetchHints() {
        // Check if prefetch is supported
        const isPrefetchSupported = (() => {
            const link = document.createElement('link');
            return link.relList && link.relList.supports && link.relList.supports('prefetch');
        })();

        if (!isPrefetchSupported) return;

        // --- Remove previously added hints by this script ---
        document.querySelectorAll('link[data-dc-prefetch="true"]').forEach(link => link.remove());

        // --- Function to add prefetch link to head ---
        const addHint = (href) => {
            if (!href) return;
            const fullHref = new URL(href, window.location.origin).toString();
            if (document.querySelector(`link[rel="prefetch"][href="${fullHref}"]`)) return;

            try {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.href = fullHref;
                link.as = 'document';
                link.setAttribute('data-dc-prefetch', 'true');
                document.head.appendChild(link);
                // console.log('Prefetch hint added:', fullHref);
            } catch (e) {
                console.error("Failed to add prefetch hint:", fullHref, e);
            }
        };

        // --- 1. Prefetch Next/Previous PAGE Links ---
        let targetPagingBox = null;
        const exceptionPagingWrap = document.querySelector('.bottom_paging_wrapre');
        if (exceptionPagingWrap) {
            targetPagingBox = exceptionPagingWrap.querySelector('.bottom_paging_box');
        } else {
            const normalPagingWraps = document.querySelectorAll('.bottom_paging_wrap');
            if (normalPagingWraps.length > 1) { targetPagingBox = normalPagingWraps[1]?.querySelector('.bottom_paging_box'); }
            else if (normalPagingWraps.length === 1) { targetPagingBox = normalPagingWraps[0]?.querySelector('.bottom_paging_box'); }
        }

        if (targetPagingBox) {
            const currentPageElement = targetPagingBox.querySelector('em');
            let prevPageLinkHref = null;
            let nextPageLinkHref = null;

            if (currentPageElement) {
                const prevPageSibling = currentPageElement.previousElementSibling;
                if (prevPageSibling?.tagName === 'A' && prevPageSibling.hasAttribute('href')) { prevPageLinkHref = prevPageSibling.href; }
                const nextPageSibling = currentPageElement.nextElementSibling;
                if (nextPageSibling?.tagName === 'A' && nextPageSibling.hasAttribute('href')) { nextPageLinkHref = nextPageSibling.href; }
            } else { // No <em>, check for search prev/next
                prevPageLinkHref = targetPagingBox.querySelector('a.search_prev[href]')?.href;
                nextPageLinkHref = targetPagingBox.querySelector('a.search_next[href]')?.href;
            }
            addHint(prevPageLinkHref);
            addHint(nextPageLinkHref);
        }

        // --- 2. Prefetch Next/Previous POST Links (Z/X keys) ---
        const currentPostIcon = document.querySelector('td.gall_num .sp_img.crt_icon');
        if (currentPostIcon) {
            const currentRow = currentPostIcon.closest('tr');
            let prevPostLinkHref = null;
            let nextPostLinkHref = null;

            // Find Previous Valid Post Link
            let prevRow = currentRow?.previousElementSibling;
            while (prevRow) {
                if (Posts.isValidPost(prevRow.querySelector('td.gall_num'), prevRow.querySelector('td.gall_tit'), prevRow.querySelector('td.gall_subject'))) {
                    prevPostLinkHref = prevRow.querySelector('td.gall_tit a:first-child')?.href;
                    break; // Found the first valid previous post
                }
                prevRow = prevRow.previousElementSibling;
            }

            // Find Next Valid Post Link
            let nextRow = currentRow?.nextElementSibling;
            while (nextRow) {
                if (Posts.isValidPost(nextRow.querySelector('td.gall_num'), nextRow.querySelector('td.gall_tit'), nextRow.querySelector('td.gall_subject'))) {
                    nextPostLinkHref = nextRow.querySelector('td.gall_tit a:first-child')?.href;
                    break; // Found the first valid next post
                }
                nextRow = nextRow.nextElementSibling;
            }

            // Add hints for post links
            addHint(prevPostLinkHref);
            addHint(nextPostLinkHref);
        }
    }
    // --- End Prefetching Logic ---
    function restoreScrollPosition() {
        const savedScrollY = sessionStorage.getItem('dcinsideShortcut_scrollPos');
        if (savedScrollY !== null) {
            // console.log('Found saved scroll position:', savedScrollY); // 디버깅용 로그
            const scrollY = parseInt(savedScrollY, 10);
            if (!isNaN(scrollY)) {
                // 저장된 위치로 스크롤 이동
                // 페이지 렌더링이 완료된 후 스크롤해야 정확하므로 약간의 지연(setTimeout)을 고려할 수 있음
                // 하지만 우선 즉시 실행해보고 문제가 발생하면 setTimeout 추가
                window.scrollTo(0, scrollY);
                // console.log('Scrolled to:', scrollY); // 디버깅용 로그
            }
            // 사용 후에는 세션 스토리지에서 제거하여 일반적인 새로고침/페이지 이동 시 영향 없도록 함
            sessionStorage.removeItem('dcinsideShortcut_scrollPos');
            // console.log('Removed saved scroll position.'); // 디버깅용 로그
        } else {
            // console.log('No saved scroll position found.'); // 디버깅용 로그
        }
    }
    // Initialization
    function init() {
        // --- 글쓰기 페이지 관련 함수 ---
        // 제목 입력란의 플레이스홀더 라벨("제목을 입력해 주세요.")을 제거합니다.
        function removeTitlePlaceholder() {
            const subjectInput = document.getElementById('subject');
            // 제목 입력 필드와 특정 상위 클래스 존재 여부로 글쓰기 페이지 확인
            if (subjectInput && subjectInput.closest('.input_write_tit')) {
                const label = document.querySelector('label.txt_placeholder[for="subject"]');
                if (label) {
                    label.remove(); // 라벨 요소 제거
                }
            }
        }

        // 제목 입력 필드에서 Tab 키를 누르면 본문 편집 영역으로 포커스를 이동시킵니다.
        function setupTabFocus() {
            const subjectInput = document.getElementById('subject'); // 제목 입력 필드
            const contentEditable = document.querySelector('.note-editable'); // 본문 편집 영역

            // 두 요소가 모두 존재하고, 아직 이벤트 리스너가 추가되지 않았을 때만 실행
            if (subjectInput && contentEditable && !subjectInput.hasAttribute('data-tab-listener-added')) {
                subjectInput.addEventListener('keydown', function(event) {
                    // Tab 키가 눌렸고 Shift 키는 눌리지 않았을 때
                    if (event.key === 'Tab' && !event.shiftKey) {
                        event.preventDefault(); // 기본 Tab 동작 방지
                        contentEditable.focus();  // 본문 편집 영역으로 포커스 이동
                    }
                });
                // 리스너가 추가되었음을 표시 (중복 추가 방지)
                subjectInput.setAttribute('data-tab-listener-added', 'true');
            }
        }
        // --- 글쓰기 페이지 관련 함수 끝 ---

        // 키보드 이벤트 리스너 등록
        document.addEventListener('keydown', e => Events.handleKeydown(e));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Alt' && !e.ctrlKey && !e.shiftKey && !e.metaKey) {
                e.preventDefault();
            }
        });
        // --- Function to run after page load ---
        const onPageLoad = () => {
            Posts.adjustColgroupWidths();
            Posts.addNumberLabels();
            Posts.formatDates();
            removeTitlePlaceholder();
            setupTabFocus();
            addPrefetchHints();
            restoreScrollPosition();
            Events.triggerMacroNavigation(); // <<< ADD THIS CALL
        };
        // 페이지 로드 완료 시점
        if (document.readyState === 'complete') {
            onPageLoad(); // Run immediately
        } else {
            window.addEventListener('load', onPageLoad, { once: true }); // Run on load
        }

        // --- MutationObserver 설정 ---
        // 1. 글 목록(tbody) 변경 감지 옵저버
        const listObserver = new MutationObserver(() => {
            setTimeout(() => {
                Posts.adjustColgroupWidths();// 목록 내용 변경 시 너비 재조정은 불필요할 수 있으나, 혹시 모르니 유지
                Posts.addNumberLabels();
                Posts.formatDates();
            }, 100);
        });
        const listTbody = document.querySelector('table.gall_list tbody');
        if (listTbody) {
            listObserver.observe(listTbody, { childList: true, subtree: false });
        }

        // 2. 전체 문서(body) 변경 감지 옵저버
        const bodyObserver = new MutationObserver(() => {
            // 페이지 전환 등으로 colgroup이 새로 생기거나 변경될 수 있으므로 여기서 호출
            Posts.adjustColgroupWidths(); // <<< 너비 조정 함수 호출 추가

            const currentListTbody = document.querySelector('table.gall_list tbody');
            if (currentListTbody) {
                if (!currentListTbody.querySelector('.number-label')) {
                    Posts.addNumberLabels();
                }
                Posts.formatDates();
            }
            removeTitlePlaceholder();
            setupTabFocus();
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    }

    init();
})();

/*
Copyright (c) 2025 nonohako(mqpower@naver.com)
dcinside shortcut © 2025 by nonohako is licensed under Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International.
To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/
*/