// ==UserScript==
// @name         Chzzk_Utils: Chatting Plus Simple Edition
// @name:ko      Chzzk_유틸: 채팅플러스 SE
// @namespace    Chzzk_Live&VOD: Chatting Plus
// @version      4.0
// @description  닉네임 (형광펜 제거, 길이 제한, 투명 제거) / 미션&고정채팅 자동 펼치기 / 드롭스 토글 / 키보드 단축키 추가
// @author       DOGJIP
// @match        https://chzzk.naver.com/*
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chzzk.naver.com
// @downloadURL https://update.greasyfork.org/scripts/532068/Chzzk_Utils%3A%20Chatting%20Plus%20Simple%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/532068/Chzzk_Utils%3A%20Chatting%20Plus%20Simple%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ========================================
    // 1. 닉네임 수정 & 드롭스 토글 등 스타일
    // ========================================
    GM_addStyle(`
        /* 닉네임 길이 제한 */
        .live_chatting_username_nickname__dDbbj {
            max-width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: inline-block;
        }

        /* 형광펜(배경색) 제거 */
        .live_chatting_username_nickname__dDbbj [style*="background-color"] {
            background-color: transparent !important;
        }

        /* 드롭스 토글 관련 스타일 */
        #drops_info.drops-collapsed .live_information_drops_wrapper__gQBUq,
        #drops_info.drops-collapsed .live_information_drops_text__xRtWS,
        #drops_info.drops-collapsed .live_information_drops_default__jwWot,
        #drops_info.drops-collapsed .live_information_drops_area__7VJJr {
            display: none !important;
        }

        .live_information_drops_icon_drops__2YXie {
            transition: transform .2s;
        }

        #drops_info.drops-collapsed .live_information_drops_icon_drops__2YXie {
            transform: rotate(-90deg);
        }

        .live_information_drops_toggle_icon {
            margin-left: 10px;
            font-size: 18px;
            cursor: pointer;
            display: inline-block;
        }
    `);

    // ========================================
    // 2. 투명 닉네임 수정 기능 (채팅플러스와 동일하게 수정)
    // ========================================
// ========================================
// 2. 투명 닉네임 수정 기능 (채팅플러스와 동일하게 수정)
// ========================================
class NicknameColorFixer {
    constructor() {
        this.colorCache = new Map();
        this.observer = null;
        this.pendingElements = new Set(); // 추가
        this.rafId = null; // 추가
    }

    fixUnreadableColor(nicknameElem) {
        if (!nicknameElem) return;

        // inline style 먼저 체크 (getComputedStyle보다 빠름)
        const inlineColor = nicknameElem.style.color;
        if (inlineColor && this.colorCache.has(inlineColor)) {
            if (this.colorCache.get(inlineColor) === false) {
                nicknameElem.style.color = '';
            }
            return;
        }

        const cssColor = window.getComputedStyle(nicknameElem).color;

        if (this.colorCache.has(cssColor)) {
            if (this.colorCache.get(cssColor) === false) {
                nicknameElem.style.color = '';
            }
            return;
        }

        const rgbaMatch = cssColor.match(/rgba?\((\d+), ?(\d+), ?(\d+)(?:, ?([0-9.]+))?\)/);
        if (!rgbaMatch) return;

        const r = parseInt(rgbaMatch[1], 10);
        const g = parseInt(rgbaMatch[2], 10);
        const b = parseInt(rgbaMatch[3], 10);
        const a = rgbaMatch[4] !== undefined ? parseFloat(rgbaMatch[4]) : 1;

        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        const visibility = brightness * a;

        // 가시성이 50 미만이면 색상 제거
        if (visibility < 50) {
            nicknameElem.style.color = '';
        }
        this.colorCache.set(cssColor, visibility >= 50);
    }

    // RAF를 사용한 배치 처리 추가
    scheduleColorFix(nicknameElem) {
        this.pendingElements.add(nicknameElem);

        if (!this.rafId) {
            this.rafId = requestAnimationFrame(() => {
                this.pendingElements.forEach(elem => {
                    if (document.contains(elem)) {
                        this.fixUnreadableColor(elem);
                    }
                });
                this.pendingElements.clear();
                this.rafId = null;
            });
        }
    }

    processMessage(messageElem) {
        if (!messageElem) return;
        if (messageElem.getAttribute('data-color-fixed') === 'true') return;

        const nicknameElem = messageElem.querySelector('.live_chatting_username_nickname__dDbbj');
        if (nicknameElem) {
            this.scheduleColorFix(nicknameElem); // 변경: RAF 사용
        }

        messageElem.setAttribute('data-color-fixed', 'true');
    }

setupObserver(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) {
        setTimeout(() => this.setupObserver(containerSelector), 500);
        return;
    }

    if (this.observer) this.observer.disconnect();

    // 기존 메시지 먼저 처리
    container.querySelectorAll('[class^="live_chatting_message_chatting_message__"]')
        .forEach(msg => this.processMessage(msg));

    // 추가: 디바운스용 타이머와 큐
    let mutationQueue = [];
    let debounceTimer = null;
    const DEBOUNCE_DELAY = 16; // ~60fps (채팅 많을 때)
    const BATCH_SIZE = 10; // 한 번에 처리할 최대 메시지 수

    const processBatch = () => {
        const batch = mutationQueue.splice(0, BATCH_SIZE);

        batch.forEach(node => {
            if (!document.contains(node)) return; // DOM에서 제거된 노드 스킵

            // 직접 메시지 노드인 경우
            if (node.className && typeof node.className === 'string' &&
                node.className.includes('live_chatting_message_chatting_message__')) {
                this.processMessage(node);
            }
            // 컨테이너인 경우 (여러 메시지가 한번에 추가될 때)
            else if (node.querySelectorAll) {
                const messages = node.querySelectorAll('[class^="live_chatting_message_chatting_message__"]');
                messages.forEach(msg => this.processMessage(msg));
            }
        });

        // 남은 작업이 있으면 다음 프레임에 처리
        if (mutationQueue.length > 0) {
            debounceTimer = setTimeout(processBatch, 0);
        } else {
            debounceTimer = null;
        }
    };

    this.observer = new MutationObserver((mutations) => {
        // 추가된 노드만 큐에 추가
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) { // Element 노드만
                    mutationQueue.push(node);
                }
            });
        });

        // 디바운스: 연속된 mutation을 묶어서 처리
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(processBatch, DEBOUNCE_DELAY);
    });

    this.observer.observe(container, {
        childList: true,
        subtree: false
    });

    // destroy 시 타이머 정리를 위해 참조 저장
    this._debounceTimer = debounceTimer;
}

destroy() {
    if (this.observer) this.observer.disconnect();
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this._debounceTimer) clearTimeout(this._debounceTimer);
    this.pendingElements.clear();
    this.colorCache.clear();
}
}

// ========================================
// 3. 미션 + 고정챗 자동 접기/펼치기
// ========================================
function setupMissionAutoCollapse(retry = 0) {
    const fixedWrapper = document.querySelector('.live_chatting_list_fixed__Wy3TT');
    if (!fixedWrapper) {
        if (retry < 10) {
            return setTimeout(() => setupMissionAutoCollapse(retry + 1), 500);
        }
        return;
    }

    let cachedButtons = {
        mission: null,
        chat: null,
        party: null,
        chatContainer: null,
        isValid: true // 추가: 캐시 유효성 플래그
    };

    const updateButtonCache = () => {
        cachedButtons.mission = fixedWrapper.querySelector('.live_chatting_fixed_mission_folded_button__bBWS2');
        cachedButtons.chatContainer = document.querySelector('.live_chatting_fixed_container__2tQz6');
        cachedButtons.chat = cachedButtons.chatContainer?.querySelector('.live_chatting_fixed_control__FCHpN button:not([aria-haspopup])');
        cachedButtons.party = fixedWrapper.querySelector('.live_chatting_fixed_party_header__TMos5');
        cachedButtons.isValid = true; // 캐시 갱신 후 유효 표시
    };

    // 개선: isConnected 사용 (document.contains()보다 훨씬 빠름)
    const getButtons = () => {
        if (!cachedButtons.isValid) {
            updateButtonCache();
        }
        return cachedButtons;
    };

    const toggleButton = (button, shouldOpen) => {
        if (!button || !button.isConnected) return; // isConnected 체크 추가
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        if (shouldOpen && !isExpanded) {
            button.click();
        } else if (!shouldOpen && isExpanded) {
            button.click();
        }
    };

    const openAll = () => {
        const buttons = getButtons();
        toggleButton(buttons.mission, true);
        toggleButton(buttons.chat, true);
        toggleButton(buttons.party, true);
    };

    const closeAll = () => {
        const buttons = getButtons();
        toggleButton(buttons.mission, false);
        toggleButton(buttons.chat, false);
        toggleButton(buttons.party, false);
    };

    updateButtonCache();
    closeAll();

    if (fixedWrapper._missionHoverBound) return;
    fixedWrapper._missionHoverBound = true;

    const clickState = {
        chatWantsOpen: false,
        missionWantsOpen: false,
        partyWantsOpen: false
    };

    fixedWrapper.addEventListener('click', (e) => {
        if (!e.isTrusted) return;
        const buttons = getButtons();

        if (buttons.chatContainer && buttons.chatContainer.contains(e.target)) {
            clickState.chatWantsOpen = !clickState.chatWantsOpen;
        } else if (e.target.closest('.live_chatting_fixed_party_container__KVPg1')) {
            clickState.partyWantsOpen = !clickState.partyWantsOpen;
        } else {
            clickState.missionWantsOpen = !clickState.missionWantsOpen;
        }
    });

    fixedWrapper.addEventListener('pointerenter', () => {
        openAll();
    });

    fixedWrapper.addEventListener('pointerleave', () => {
        const buttons = getButtons();

        if (!clickState.chatWantsOpen && !clickState.missionWantsOpen && !clickState.partyWantsOpen) {
            closeAll();
        } else {
            toggleButton(buttons.chat, clickState.chatWantsOpen);
            toggleButton(buttons.mission, clickState.missionWantsOpen);
            toggleButton(buttons.party, clickState.partyWantsOpen);
        }
    });

    // 개선: MutationObserver로 버튼 제거 감지
    const buttonObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        let hasRemovals = false;

        for (const mutation of mutations) {
            // 추가된 노드 체크 (파티 버튼)
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        if (node.classList?.contains('live_chatting_fixed_party_container__KVPg1') ||
                            node.querySelector?.('.live_chatting_fixed_party_container__KVPg1')) {
                            shouldUpdate = true;
                            break;
                        }
                    }
                }
            }

            // 제거된 노드 체크 (버튼이 사라졌을 때)
            if (mutation.removedNodes.length > 0) {
                for (const node of mutation.removedNodes) {
                    if (node.nodeType === 1) {
                        // 캐시된 버튼이 제거되었는지 확인
                        if (node === cachedButtons.mission ||
                            node === cachedButtons.chat ||
                            node === cachedButtons.party ||
                            node === cachedButtons.chatContainer ||
                            node.contains?.(cachedButtons.mission) ||
                            node.contains?.(cachedButtons.chat) ||
                            node.contains?.(cachedButtons.party)) {
                            hasRemovals = true;
                            cachedButtons.isValid = false; // 캐시 무효화
                            break;
                        }
                    }
                }
            }
        }

        if (shouldUpdate || hasRemovals) {
            if (shouldUpdate) {
                updateButtonCache();
                const buttons = getButtons();
                if (buttons.party) {
                    toggleButton(buttons.party, false);
                }
            }
            // hasRemovals만 있으면 다음 getButtons() 호출 시 자동 갱신
        }
    });

    buttonObserver.observe(fixedWrapper, {
        childList: true,
        subtree: true // subtree로 변경: 내부 버튼 제거도 감지
    });
}
    // ========================================
    // 4. 드롭스 토글 기능
    // ========================================
    function initDropsToggle() {
        const container = document.getElementById('drops_info');
        if (!container || container.classList.contains('drops-init')) return;

        const header = container.querySelector('.live_information_drops_header__920BX');
        if (!header) return;

        const toggleIcon = document.createElement('span');
        toggleIcon.classList.add('live_information_drops_toggle_icon');
        toggleIcon.textContent = '▼';
        header.appendChild(toggleIcon);
        header.style.cursor = 'pointer';
        container.classList.add('drops-collapsed');
        container.classList.add('drops-init');

        header.addEventListener('click', () => {
            const collapsed = container.classList.toggle('drops-collapsed');
            toggleIcon.textContent = collapsed ? '▼' : '▲';
        });
    }

function setupDropsToggleObserver() {
    // 초기 실행
    initDropsToggle();

    const existingDrops = document.getElementById('drops_info');
    if (existingDrops && existingDrops.classList.contains('drops-init')) {
        return;
    }

    let debounceTimer = null;
    const DEBOUNCE_DELAY = 100;

    const handleMutation = () => {
        initDropsToggle();

        const drops = document.getElementById('drops_info');
        if (drops && drops.classList.contains('drops-init')) {
            if (obs) {
                obs.disconnect();
                obs = null;
            }
        }
    };

    const debouncedHandler = () => {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(handleMutation, DEBOUNCE_DELAY);
    };

    let obs = null;
    const targetContainer = document.querySelector('#live_player_layout') ||
                           document.querySelector('[class*="live_information"]') ||
                           document.body;

    obs = new MutationObserver((mutations) => {

        let hasDropsChange = false;

        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {

                        if (node.id === 'drops_info' ||
                            node.querySelector?.('#drops_info')) {
                            hasDropsChange = true;
                            break;
                        }
                    }
                }
            }
            if (hasDropsChange) break;
        }

        if (hasDropsChange) {
            debouncedHandler();
        }
    });

    obs.observe(targetContainer, {
        childList: true,
        subtree: targetContainer === document.body ? true : false
    });

    if (!window._dropsObserverCleanup) {
        window._dropsObserverCleanup = () => {
            if (obs) obs.disconnect();
            if (debounceTimer) clearTimeout(debounceTimer);
        };
    }
}

// ========================================
// 5. 키보드 단축키
// ========================================
const keyboardState = {
    isChatOpen: true,
    isChatHidden: false,
    isInfoHidden: false,
    styleElements: {
        chat: null,
        info: null
    },
    lockedPlayerObserver: null,
    fixedPlayerClass: ""
};

const domCache = {
    chatCloseBtn: null,
    chatOpenBtn: null,
    player: null,
    isValid: true, // 추가: 캐시 유효성 플래그
    observer: null, // 추가: MutationObserver
    needsRefresh: new Set(), // 추가: 무효화된 키 추적

    refresh(specificKey = null) {
        if (specificKey) {
            // 특정 키만 갱신
            switch(specificKey) {
                case 'chatCloseBtn':
                    this.chatCloseBtn = document.querySelector('.live_chatting_header_button__t2pa1');
                    break;
                case 'chatOpenBtn':
                    this.chatOpenBtn = document.querySelector('svg[viewBox="0 0 38 34"]')?.closest('button');
                    break;
                case 'player':
                    this.player = document.querySelector('.pzp-pc');
                    break;
            }
            this.needsRefresh.delete(specificKey);
        } else {
            // 전체 갱신
            this.chatCloseBtn = document.querySelector('.live_chatting_header_button__t2pa1');
            this.chatOpenBtn = document.querySelector('svg[viewBox="0 0 38 34"]')?.closest('button');
            this.player = document.querySelector('.pzp-pc');
            this.needsRefresh.clear();
        }
        this.isValid = true;
    },

    get(key) {
        // 해당 키만 필요시 갱신
        if (this.needsRefresh.has(key) || !this[key]) {
            this.refresh(key);
        }
        return this[key];
    },

    invalidate(key) {
        // 특정 키만 무효화
        this.needsRefresh.add(key);
    },

    setupObserver() {
        if (this.observer) return; // 이미 설정됨

        // 채팅창 영역 감시
        const chatArea = document.querySelector('[class*="live_chatting"]') || document.body;

        this.observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.removedNodes.length > 0) {
                    for (const node of mutation.removedNodes) {
                        if (node.nodeType !== 1) continue;

                        // 캐시된 요소가 제거되었는지 확인
                        if (node === this.chatCloseBtn || node.contains?.(this.chatCloseBtn)) {
                            this.invalidate('chatCloseBtn');
                        }
                        if (node === this.chatOpenBtn || node.contains?.(this.chatOpenBtn)) {
                            this.invalidate('chatOpenBtn');
                        }
                        if (node === this.player || node.contains?.(this.player)) {
                            this.invalidate('player');
                        }
                    }
                }
            }
        });

        this.observer.observe(chatArea, {
            childList: true,
            subtree: true
        });
    },

    destroy() {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }
    }
};

// ] 키: 채팅창 접기/펼치기
function toggleChatWindow() {
    const chatCloseBtn = domCache.get('chatCloseBtn'); // 필요한 것만 가져옴

    if (keyboardState.isChatOpen) {
        if (chatCloseBtn) {
            chatCloseBtn.click();
            keyboardState.isChatOpen = false;
        }
    } else {
        const chatOpenBtn = domCache.get('chatOpenBtn'); // 필요할 때만 가져옴
        if (chatOpenBtn) {
            chatOpenBtn.click();
            keyboardState.isChatOpen = true;
        }
    }
}

// [ 키: 채팅 댓글만 숨기기
function toggleChatMessages() {
    if (keyboardState.isChatHidden) {
        if (keyboardState.styleElements.chat) {
            keyboardState.styleElements.chat.remove();
            keyboardState.styleElements.chat = null;
        }
        keyboardState.isChatHidden = false;
    } else {
        if (!keyboardState.styleElements.chat) {
            keyboardState.styleElements.chat = GM_addStyle(`
                div.live_chatting_list_wrapper__a5XTV {
                    display: none !important;
                }
                button.live_chatting_scroll_button_chatting__kqgzN {
                    display: none !important;
                }
                button.live_chatting_scroll_button_arrow__tUviD {
                    display: none !important;
                }
                p.vod_player_header_title__yPsca {
                    display: none !important;
                }
            `);
        }
        keyboardState.isChatHidden = true;
    }
}

// \ 키: 방송 정보 숨기기
function toggleBroadcastInfo() {
    if (keyboardState.isInfoHidden) {
        if (keyboardState.styleElements.info) {
            keyboardState.styleElements.info.remove();
            keyboardState.styleElements.info = null;
        }

        if (keyboardState.lockedPlayerObserver) {
            keyboardState.lockedPlayerObserver.disconnect();
            keyboardState.lockedPlayerObserver = null;
        }

        keyboardState.isInfoHidden = false;
    } else {
        if (!keyboardState.styleElements.info) {
            keyboardState.styleElements.info = GM_addStyle(`
                div.live_information_player_area__54uqN {
                    display: none !important;
                }
                div.pzp-pc__bottom-buttons {
                    display: none !important;
                }
                div.pzp-ui-progress__wrap.pzp-ui-slider__wrap-first-child.pzp-ui-slider--handler {
                    display: none !important;
                }
                .pzp-pc.pzp-pc--controls {
                    background: transparent !important;
                    backdrop-filter: none !important;
                }
            `);
        }

        const player = domCache.get('player'); // 필요할 때만 가져옴

        if (player) {
            keyboardState.fixedPlayerClass = player.className;

            if (!keyboardState.lockedPlayerObserver) {
                keyboardState.lockedPlayerObserver = new MutationObserver(() => {
                    // 개선: observer 일시 중단 후 변경 (무한 루프 방지)
                    keyboardState.lockedPlayerObserver.disconnect();
                    if (player.className !== keyboardState.fixedPlayerClass) {
                        player.className = keyboardState.fixedPlayerClass;
                    }
                    keyboardState.lockedPlayerObserver.observe(player, {
                        attributes: true,
                        attributeFilter: ['class']
                    });
                });
                keyboardState.lockedPlayerObserver.observe(player, {
                    attributes: true,
                    attributeFilter: ['class']
                });
            }

            player.className = keyboardState.fixedPlayerClass;
        }

        keyboardState.isInfoHidden = true;
    }
}

function handleKeyPress(e) {
    const tag = e.target.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) {
        return;
    }

    switch (e.key) {
        case ']':
            toggleChatWindow();
            break;
        case '[':
            toggleChatMessages();
            break;
        case '\\':
            toggleBroadcastInfo();
            break;
    }
}

function initKeyboardShortcuts() {
    domCache.refresh(); // 초기 캐시
    domCache.setupObserver(); // Observer 시작
    window.addEventListener('keydown', handleKeyPress);
}
    // ========================================
    // 6. SPA 페이지 전환 감지
    // ========================================
    function setupSPADetection() {
        let lastUrl = location.href;

        const onUrlChange = () => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                console.log('[Chzzk Simple] 페이지 전환 감지, 재초기화 중...');

                setTimeout(() => {
                    if (colorFixer) colorFixer.destroy();
                    colorFixer = new NicknameColorFixer();
                    colorFixer.setupObserver('[class*="live_chatting_list_wrapper__"]');
                    setupMissionAutoCollapse();
                    setupDropsToggleObserver();
                }, 500);
            }
        };

        ['pushState', 'replaceState'].forEach(method => {
            const orig = history[method];
            history[method] = function(...args) {
                orig.apply(this, args);
                setTimeout(onUrlChange, 100);
            };
        });

        window.addEventListener('popstate', onUrlChange);
    }

    // ========================================
    // 7. 초기화
    // ========================================
    let colorFixer = null;

    function init() {
        console.log('[Chzzk Simple] 초기화 시작');
        colorFixer = new NicknameColorFixer();
        colorFixer.setupObserver('[class*="live_chatting_list_wrapper__"]');
        setupMissionAutoCollapse();
        setupDropsToggleObserver();
        initKeyboardShortcuts();
        setupSPADetection();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();