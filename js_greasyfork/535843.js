// ==UserScript==
// @name         Facebook 自動展開與互動增強
// @name:zh-tw   Facebook 自動展開與互動增強
// @name:en      Facebook Auto-Expand and Interaction Enhancements
// @namespace    http://tampermonkey.net/
// @version      2025.06.05.03
// @description  混合觸發模式：滑鼠游標自動展開查看更多+點讚。影片音量調整、全自動展開留言。
// @description:en  Hybrid Trigger Mode: Automatically expands "See More" on mouse hover + like. Video volume adjustment, fully automatic comment expansion.
// @author       You
// @match        https://www.facebook.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/535843/Facebook%20%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E8%88%87%E4%BA%92%E5%8B%95%E5%A2%9E%E5%BC%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/535843/Facebook%20%E8%87%AA%E5%8B%95%E5%B1%95%E9%96%8B%E8%88%87%E4%BA%92%E5%8B%95%E5%A2%9E%E5%BC%B7.meta.js
// ==/UserScript==

(function() {
    const CLICK_INTERVAL = 500;
    const AUTO_EXPAND_SELECTOR = '.x1qjc9v5.x71s49j.x1a2a7pz .xeuugli.xbelrpt'; //Post zoom:.x1qjc9v5.x71s49j.x1a2a7pz + Replies css top1~2
    const SEE_MORE_SELECTOR = '.x6o7n8i .x1lliihq .x126k92a .xzsf02u.x1i10hfl'; //control post size:.x6o7n8i .x1lliihq + See more css
    const POST_LIKE_SELECTOR = '.x5ve5x3 > .x9f619';
    const COMMENT_LIKE_SELECTOR = '.x1rg5ohu.x1ypdohk.xi81zsa';

    const state = {
        lastClickTime: 0,
        likeCoolingDown: false,
        panelCollapsed: GM_getValue('panelCollapsed', false),
        DEFAULT_VOLUME: GM_getValue('DEFAULT_VOLUME', 0.2),
        COLUMN_COUNT: GM_getValue('COLUMN_COUNT', 4),
        buttons: {
            like: GM_getValue('likeEnabled', false),
            otherExpand: GM_getValue('otherExpandEnabled', false),
            volume: GM_getValue('volumeEnabled', false),
            columns: GM_getValue('columnsEnabled', false)
        }
    };

    let cachedElements = {
        panel: null,
        videoElements: null
    };
    let observer = null;
    let eventListeners = [];
    let videoObserver = null;

    function cleanup() {
        observer?.disconnect();
        videoObserver?.disconnect();
        observer = null;
        videoObserver = null;
        eventListeners.forEach(({element, type, handler}) => {
            if (type === 'interval') clearInterval(handler);
            else element?.removeEventListener?.(type, handler);
        });
        eventListeners = [];
        cachedElements.panel?.remove();
        cachedElements.panel = null;
        cachedElements.videoElements = null;
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        Object.assign(panel.style, {
            position: 'fixed',
            left: '0px',
            bottom: '30px',
            zIndex: '9999',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            backgroundColor: 'transparent',
            padding: '10px',
            borderRadius: '8px'
        });

        const createButton = (text, key, action) => {
            const btn = document.createElement('button');
            Object.assign(btn.style, {
                padding: '8px 12px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: 'bold',
                width: '40px',
                textAlign: 'center'
            });
            btn.innerText = text;
            const handler = () => {
                state.buttons[key] = !state.buttons[key];
                GM_setValue(`${key}Enabled`, state.buttons[key]);
                updateButtonStyle(btn, state.buttons[key]);
                action?.();
            };
            btn.addEventListener('click', handler);
            eventListeners.push({element: btn, type: 'click', handler});
            updateButtonStyle(btn, state.buttons[key]);
            return btn;
        };

        const buttons = [
            createButton('讚', 'like'),
            createButton('回', 'otherExpand'),
            createButton('音', 'volume', () => state.buttons.volume && processAllVideos())
        ];

        const volumeControlGroup = createControlGroup([
            createSmallButton('-', () => adjustVolume(-0.1)),
            createSmallButton('+', () => adjustVolume(0.1))
        ]);

        buttons.push(volumeControlGroup);

        if (hasColumnCountCSS()) {
            buttons.push(
                createButton('欄', 'columns', () => state.buttons.columns && applyColumnCount()),
                createControlGroup([
                    createSmallButton('-', () => adjustColumnCount(-1)),
                    createSmallButton('+', () => adjustColumnCount(1))
                ])
            );
        }

        const collapseBtn = createCollapseButton();
        buttons.push(collapseBtn);

        buttons.forEach(btn => panel.appendChild(btn));
        document.body.appendChild(panel);
        cachedElements.panel = panel;
        state.panelCollapsed && togglePanelCollapse();
    }

    function createCollapseButton() {
        const btn = document.createElement('button');
        Object.assign(btn.style, {
            padding: '8px 12px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            width: '40px',
            textAlign: 'center',
            backgroundColor: '#000000',
            color: '#FFFFFF'
        });
        btn.innerText = state.panelCollapsed ? 'Δ' : '∇';
        const handler = () => {
            state.panelCollapsed = !state.panelCollapsed;
            GM_setValue('panelCollapsed', state.panelCollapsed);
            btn.innerText = state.panelCollapsed ? 'Δ' : '∇';
            togglePanelCollapse();
        };
        btn.addEventListener('click', handler);
        eventListeners.push({element: btn, type: 'click', handler});
        return btn;
    }

    function createControlGroup(buttons) {
        const group = document.createElement('div');
        Object.assign(group.style, {
            display: 'flex',
            justifyContent: 'space-between',
            width: '40px',
            marginTop: '-5px'
        });
        buttons.forEach(btn => group.append(btn));
        return group;
    }

    function createSmallButton(text, action) {
        const btn = document.createElement('button');
        Object.assign(btn.style, {
            padding: '2px 0',
            border: '1px solid #000000',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            width: '20px',
            textAlign: 'center',
            backgroundColor: '#000000',
            color: '#FFFFFF'
        });
        btn.innerText = text;
        const handler = () => action();
        btn.addEventListener('click', handler);
        eventListeners.push({element: btn, type: 'click', handler});
        return btn;
    }

    function updateButtonStyle(btn, isActive) {
        Object.assign(btn.style, {
            backgroundColor: isActive ? '#1877f2' : '#e4e6eb',
            color: isActive ? 'white' : '#65676b'
        });
    }

    function togglePanelCollapse() {
        const buttons = cachedElements.panel?.querySelectorAll('button') || [];
        buttons.forEach(btn => {
            if (!['Δ', '∇', '+', '-'].includes(btn.innerText)) {
                btn.style.display = state.panelCollapsed ? 'none' : 'block';
            }
        });
    }

    function hasColumnCountCSS() {
        return getComputedStyle(document.documentElement).getPropertyValue('--column-count').trim() !== '';
    }

    function applyColumnCount() {
        if (state.buttons.columns) {
            document.documentElement.style.setProperty('--column-count', state.COLUMN_COUNT);
        }
    }

    function adjustColumnCount(change) {
        state.COLUMN_COUNT = Math.max(1, state.COLUMN_COUNT + change);
        GM_setValue('COLUMN_COUNT', state.COLUMN_COUNT);
        state.buttons.columns && applyColumnCount();
    }

    function adjustVolume(change) {
        state.DEFAULT_VOLUME = Math.min(1, Math.max(0, state.DEFAULT_VOLUME + change));
        GM_setValue('DEFAULT_VOLUME', state.DEFAULT_VOLUME);
        state.buttons.volume && processAllVideos();
    }

    function processAllVideos() {
        cachedElements.videoElements?.forEach(video => {
            try {
                if (typeof video.volume === 'number') {
                    video.volume = state.DEFAULT_VOLUME;
                    video.muted = false;
                }
            } catch {}
        });
    }

    const throttledHandleMouseOver = throttle(handleMouseOver, 200);
    const debouncedHandleOtherButtons = debounce(handleOtherButtons, 300);

    function handleMouseOver(event) {
        const target = event.target;
        if (isSeeMoreButton(target) && checkClickInterval()) {
            safeClick(target);
        }
        if (state.buttons.like && !state.likeCoolingDown) {
            const elements = document.elementsFromPoint(event.clientX, event.clientY);
            const likeButton = elements.find(el =>
                el.matches(`${POST_LIKE_SELECTOR}, ${COMMENT_LIKE_SELECTOR}`) &&
                el.getAttribute('aria-pressed') !== 'true' &&
                isButtonVisible(el)
            );
            if (likeButton) {
                state.likeCoolingDown = true;
                setTimeout(() => { state.likeCoolingDown = false; }, 1000);
                safeClick(likeButton);
            }
        }
    }

    function handleOtherButtons() {
        if (!state.buttons.otherExpand) return;
        document.querySelectorAll(AUTO_EXPAND_SELECTOR).forEach(btn => {
            if (checkClickInterval()) safeClick(btn);
        });
    }

    function isSeeMoreButton(element) {
        return element?.closest?.(SEE_MORE_SELECTOR) &&
               element.getAttribute('aria-expanded') !== 'true';
    }

    function checkClickInterval() {
        const now = Date.now();
        if (now - state.lastClickTime > CLICK_INTERVAL) {
            state.lastClickTime = now;
            return true;
        }
        return false;
    }

    function safeClick(element) {
        element?.isConnected && element.click();
    }

    function isButtonVisible(button) {
        if (!button) return false;
        const rect = button.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 &&
               rect.top >= 0 && rect.left >= 0 &&
               rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
               rect.right <= (window.innerWidth || document.documentElement.clientWidth);
    }

    function throttle(func, limit) {
        let lastArgs, lastThis, timeout;
        return function() {
            if (!timeout) {
                func.apply(this, arguments);
                timeout = setTimeout(() => {
                    timeout = null;
                    if (lastArgs) func.apply(lastThis, lastArgs);
                }, limit);
            } else {
                lastArgs = arguments;
                lastThis = this;
            }
        };
    }

    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    function init() {
        createControlPanel();
        if (state.buttons.otherExpand) {
            const intervalId = setInterval(debouncedHandleOtherButtons, 800);
            eventListeners.push({element: window, type: 'interval', handler: intervalId});
        }

        observer = new MutationObserver(() => {
            state.buttons.otherExpand && handleOtherButtons();
            state.buttons.columns && applyColumnCount();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        videoObserver = new MutationObserver(mutations => {
            cachedElements.videoElements = document.querySelectorAll('video');
            state.buttons.volume && processAllVideos();
        });
        videoObserver.observe(document.body, { childList: true, subtree: true });

        const mouseOverHandler = throttledHandleMouseOver;
        document.addEventListener('mouseover', mouseOverHandler);
        eventListeners.push({element: document, type: 'mouseover', handler: mouseOverHandler});

        window.addEventListener('unload', cleanup);
        window.addEventListener('pagehide', cleanup);
    }

    if (document.readyState === 'complete') {
        init();
    } else {
        const loadHandler = () => {
            init();
            window.removeEventListener('load', loadHandler);
        };
        window.addEventListener('load', loadHandler);
    }
})();
