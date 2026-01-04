// ==UserScript==
// @name         Better Trades
// @namespace    Violentmonkey Scripts
// @version      2.0
// @description  Adds draggable floating helpers for accept & money, with two-step confirm, saved positions, auto-reset after timeout or re-show, and robust paste-button reset logic
// @author       Weav3r
// @match        https://www.torn.com/trade.php*
// @downloadURL https://update.greasyfork.org/scripts/534993/Better%20Trades.user.js
// @updateURL https://update.greasyfork.org/scripts/534993/Better%20Trades.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // Constants
    const CONFIG = {
        MIN_WIDTH: 784,
        DRAG_THRESHOLD: 5,
        CONFIRM_TIMEOUT: 5000,
        SCROLL_DELAY: 400,
        BUTTON_SIZE: 48,
        BUTTON_GAP: 10,
        EDGE_MARGIN: 15
    };

    const SELECTORS = {
        EMPTY_ROW: '#trade-container li.empty',
        ACCEPT_BTN: '#trade-container a.accept',
        CONFIRM_BTN: '#trade-container input[type="submit"][value="Accept"]',
        CHANGE_BTN: '#trade-container input[type="submit"][value="Change"]',
        MONEY_INPUT: '#trade-container form[action*="addmoney2"] input[type="text"].input-money',
        TRADE_CONTAINER: '#trade-container'
    };

    const STORAGE_KEYS = {
        ACCEPT_POS: 'tm-float-accept-pos',
        MONEY_POS: 'tm-float-money-pos'
    };

    const ICONS = {
        check: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M6.173 13.414L.293 7.535l2.121-2.121 3.759 3.758 7.414-7.414 2.121 2.121z"/>
        </svg>`,
        clipboard: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M10 1.5H6a.5.5 0 0 0 0 1H7v1h2V2.5h1a.5.5 0 0 0 0-1z"/>
            <path d="M11.5 3H11v-.5A1.5 1.5 0 0 0 9.5 1h-3A1.5 1.5 0 0 0 5 2.5V3H4.5A1.5 1.5 0 0 0 3 4.5V12a2 2 0 0 0 2 2h6"/>
            <path d="M5 2.5A.5.5 0 0 1 5.5 2h3a.5.5 0 0 1 .5.5V3H5v-.5zM11 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V5h6v7z"/>
        </svg>`,
        plus: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="24" height="24" fill="white" stroke="white" stroke-width="2">
            <path d="M8 2v12M2 8h12"/>
        </svg>`
    };

    const COLORS = {
        primary: '#28a745',
        secondary: '#17a2b8',
        confirm: '#007bff',
        warning: '#ffc107'
    };

    // Utility functions
    const utils = {
        isElementInViewport(element) {
            if (!element) return false;
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        scrollAndClick(element, delay = 0) {
            if (!element) return;

            if (this.isElementInViewport(element)) {
                element.click();
            } else {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (delay) {
                    setTimeout(() => element.click(), delay);
                }
            }
        },

        loadPosition(key) {
            try {
                const saved = localStorage.getItem(key);
                return saved ? JSON.parse(saved) : null;
            } catch {
                return null;
            }
        },

        savePosition(key, x, y) {
            try {
                localStorage.setItem(key, JSON.stringify({ x, y }));
            } catch (e) {
                console.error('Failed to save position:', e);
            }
        },

        getDefaultPosition(type) {
            const offset = type === 'accept' ? 0 : (CONFIG.BUTTON_SIZE + CONFIG.BUTTON_GAP);
            return {
                x: window.innerWidth - CONFIG.BUTTON_SIZE - CONFIG.EDGE_MARGIN - offset,
                y: 160
            };
        }
    };

    // Initialize CSS for better performance
    function initializeStyles() {
        if (document.getElementById('better-trades-styles')) return;

        const style = document.createElement('style');
        style.id = 'better-trades-styles';
        style.textContent = `
            .tm-float-button {
                width: ${CONFIG.BUTTON_SIZE}px;
                height: ${CONFIG.BUTTON_SIZE}px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #fff;
                border: none;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                touch-action: none;
                user-select: none;
                outline: none;
                -webkit-tap-highlight-color: transparent;
                transition: background-color 0.2s ease, transform 0.1s ease;
                will-change: transform;
            }

            .tm-float-button:hover {
                transform: scale(1.05);
            }

            .tm-float-button:active {
                transform: scale(0.95);
            }

            @media (prefers-reduced-motion: reduce) {
                .tm-float-button {
                    transition: none;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Draggable mixin
    class DraggableElement {
        constructor(element, storageKey) {
            this.element = element;
            this.storageKey = storageKey;
            this.isDragging = false;
            this.suppressClick = false;
            this.dragStart = { x: 0, y: 0 };
            this.elementStart = { x: 0, y: 0 };

            this.initDragging();
        }

        initDragging() {
            this.element.addEventListener('mousedown', this.handleMouseDown.bind(this));
        }

        handleMouseDown(e) {
            if (e.button !== 0) return;

            this.isDragging = false;
            this.suppressClick = false;
            this.dragStart = { x: e.clientX, y: e.clientY };
            this.elementStart = {
                x: parseInt(this.element.style.left, 10),
                y: parseInt(this.element.style.top, 10)
            };

            let rafId = null;
            let currentX = e.clientX;
            let currentY = e.clientY;

            const updatePosition = () => {
                const dx = currentX - this.dragStart.x;
                const dy = currentY - this.dragStart.y;

                if (!this.isDragging && (Math.abs(dx) > CONFIG.DRAG_THRESHOLD || Math.abs(dy) > CONFIG.DRAG_THRESHOLD)) {
                    this.isDragging = true;
                    this.element.style.cursor = 'grabbing';
                }

                if (this.isDragging) {
                    this.element.style.left = `${this.elementStart.x + dx}px`;
                    this.element.style.top = `${this.elementStart.y + dy}px`;
                }
            };

            const handleMouseMove = (e) => {
                currentX = e.clientX;
                currentY = e.clientY;

                if (!rafId) {
                    rafId = requestAnimationFrame(() => {
                        updatePosition();
                        rafId = null;
                    });
                }
            };

            const handleMouseUp = () => {
                if (rafId) {
                    cancelAnimationFrame(rafId);
                }

                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);

                this.element.style.cursor = '';

                if (this.isDragging) {
                    this.suppressClick = true;
                    utils.savePosition(
                        this.storageKey,
                        parseInt(this.element.style.left, 10),
                        parseInt(this.element.style.top, 10)
                    );
                }

                this.isDragging = false;
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        shouldSuppressClick() {
            if (this.suppressClick) {
                this.suppressClick = false;
                return true;
            }
            return false;
        }
    }

    // Accept button helper
    class AcceptHelper {
        constructor() {
            this.button = this.createButton();
            this.draggable = new DraggableElement(this.button, STORAGE_KEYS.ACCEPT_POS);
            this.mutationObserver = null;
            this.intersectionObserver = null;
            this.currentAcceptButton = null;

            this.initEventListeners();
            this.startObserving();
        }

        createButton() {
            const button = document.createElement('button');
            button.id = 'tm-float-accept';
            button.className = 'tm-float-button';
            button.innerHTML = ICONS.check;

            Object.assign(button.style, {
                position: 'fixed',
                zIndex: '9999',
                background: COLORS.primary
            });

            const position = utils.loadPosition(STORAGE_KEYS.ACCEPT_POS) || utils.getDefaultPosition('accept');
            button.style.left = `${position.x}px`;
            button.style.top = `${position.y}px`;

            document.body.appendChild(button);
            return button;
        }

        initEventListeners() {
            this.button.addEventListener('click', (e) => {
                if (this.draggable.shouldSuppressClick()) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }

                e.preventDefault();
                utils.scrollAndClick(document.querySelector(SELECTORS.ACCEPT_BTN));
            });
        }

        handleIntersection(entries) {
            entries.forEach(entry => {
                if (entry.target === this.currentAcceptButton) {
                    this.button.style.background = entry.isIntersecting
                        ? COLORS.primary
                        : COLORS.warning;
                }
            });
        }

        updateAcceptButton() {
            const acceptButton = document.querySelector(SELECTORS.ACCEPT_BTN);

            if (!acceptButton) {
                this.button.style.display = 'none';
                if (this.currentAcceptButton) {
                    this.intersectionObserver.unobserve(this.currentAcceptButton);
                    this.currentAcceptButton = null;
                }
                return;
            }

            this.button.style.display = 'flex';

            // If it's a different accept button, update the observer
            if (acceptButton !== this.currentAcceptButton) {
                if (this.currentAcceptButton) {
                    this.intersectionObserver.unobserve(this.currentAcceptButton);
                }

                this.currentAcceptButton = acceptButton;
                this.intersectionObserver.observe(acceptButton);

                // Set initial color based on current visibility
                this.button.style.background = utils.isElementInViewport(acceptButton)
                    ? COLORS.primary
                    : COLORS.warning;
            }
        }

        startObserving() {
            // Create intersection observer for viewport detection
            this.intersectionObserver = new IntersectionObserver(
                entries => this.handleIntersection(entries),
                {
                    root: null, // viewport
                    rootMargin: '0px',
                    threshold: 1.0 // fully visible
                }
            );

            // Create mutation observer with debouncing using requestIdleCallback
            let updateScheduled = false;
            this.mutationObserver = new MutationObserver(() => {
                if (!updateScheduled) {
                    updateScheduled = true;
                    if ('requestIdleCallback' in window) {
                        requestIdleCallback(() => {
                            this.updateAcceptButton();
                            updateScheduled = false;
                        }, { timeout: 100 });
                    } else {
                        setTimeout(() => {
                            this.updateAcceptButton();
                            updateScheduled = false;
                        }, 0);
                    }
                }
            });
            this.mutationObserver.observe(document.body, { childList: true, subtree: true });

            // Initial setup
            this.updateAcceptButton();
        }

        destroy() {
            if (this.mutationObserver) this.mutationObserver.disconnect();
            if (this.intersectionObserver) this.intersectionObserver.disconnect();
            if (this.button) this.button.remove();
        }
    }

    // Money helper buttons
    class MoneyHelper {
        constructor() {
            this.container = this.createContainer();
            this.draggable = new DraggableElement(this.container, STORAGE_KEYS.MONEY_POS);
            this.buttons = new Map();
            this.activeButton = null;
            this.timeout = null;
            this.wasVisible = false;
            this.observer = null;

            this.createButtons();
            this.startObserving();
        }

        createContainer() {
            const container = document.createElement('div');
            container.id = 'tm-float-money-wrap';

            Object.assign(container.style, {
                position: 'fixed',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                gap: `${CONFIG.BUTTON_GAP}px`
            });

            const position = utils.loadPosition(STORAGE_KEYS.MONEY_POS) || utils.getDefaultPosition('money');
            container.style.left = `${position.x}px`;
            container.style.top = `${position.y}px`;

            document.body.appendChild(container);
            return container;
        }

        createButtons() {
            const buttonConfigs = [
                { type: 'paste', icon: ICONS.clipboard, color: COLORS.secondary, action: this.handlePaste },
                { type: 'max', icon: ICONS.plus, color: COLORS.primary, action: this.handleMax }
            ];

            buttonConfigs.forEach(config => {
                const button = this.createButton(config);
                this.buttons.set(config.type, button);
                this.container.appendChild(button);
            });
        }

        createButton({ type, icon, color, action }) {
            const button = document.createElement('button');
            button.dataset.type = type;
            button.id = `tm-money-${type}`;
            button.className = 'tm-float-button';
            button.innerHTML = icon;
            button.style.background = color;

            button.addEventListener('click', (e) => {
                if (this.draggable.shouldSuppressClick()) {
                    e.stopPropagation();
                    e.preventDefault();
                    return;
                }

                e.stopPropagation();
                e.preventDefault();

                if (button.id === 'tm-money-change-temp') {
                    this.handleConfirm();
                } else {
                    action.call(this, button);
                }
            });

            return button;
        }

        async handlePaste(button) {
            const input = document.querySelector(SELECTORS.MONEY_INPUT);
            if (!input) return;

            input.focus();

            // Check for clipboard API support and permissions
            if (!navigator.clipboard || !navigator.clipboard.readText) {
                console.warn('Clipboard API not supported');
                return;
            }

            try {
                // Use the Permissions API to check clipboard-read permission
                if (navigator.permissions && navigator.permissions.query) {
                    const permissionStatus = await navigator.permissions.query({ name: 'clipboard-read' });
                    if (permissionStatus.state === 'denied') {
                        console.warn('Clipboard read permission denied');
                        return;
                    }
                }

                const clipboardText = await navigator.clipboard.readText();
                const numericValue = clipboardText.replace(/[^0-9.\-]/g, '');

                if (numericValue) {
                    // Use the more efficient setRangeText with selection mode
                    input.select(); // Select all text first
                    document.execCommand('insertText', false, numericValue); // This triggers proper input events
                    this.transformToConfirm(button);
                }
            } catch (err) {
                // Fallback to execCommand for older browsers
                try {
                    input.select();
                    document.execCommand('paste');
                    const pastedValue = input.value.replace(/[^0-9.\-]/g, '');
                    if (pastedValue) {
                        input.value = pastedValue;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        this.transformToConfirm(button);
                    }
                } catch (fallbackErr) {
                    console.error('Failed to read clipboard:', err);
                }
            }
        }

        handleMax(button) {
            const input = document.querySelector(SELECTORS.MONEY_INPUT);
            if (!input) return;

            input.focus();
            input.setRangeText('all', 0, input.value.length, 'end');
            input.dispatchEvent(new Event('input', { bubbles: true }));

            this.transformToConfirm(button);
        }

        transformToConfirm(button) {
            this.resetTransform(); // Reset any existing transformation

            button.id = 'tm-money-change-temp';
            button.innerHTML = ICONS.check;
            button.style.background = COLORS.confirm;

            this.activeButton = button;
            this.timeout = setTimeout(() => this.resetTransform(), CONFIG.CONFIRM_TIMEOUT);
        }

        handleConfirm() {
            utils.scrollAndClick(document.querySelector(SELECTORS.CHANGE_BTN), CONFIG.SCROLL_DELAY);
            this.resetTransform();
        }

        resetTransform() {
            clearTimeout(this.timeout);

            const button = this.activeButton || this.container.querySelector('#tm-money-change-temp');
            if (!button) return;

            const type = button.dataset.type;
            button.id = `tm-money-${type}`;
            button.innerHTML = type === 'paste' ? ICONS.clipboard : ICONS.plus;
            button.style.background = type === 'paste' ? COLORS.secondary : COLORS.primary;

            this.activeButton = null;
        }

        updateVisibility() {
            const isVisible = !!document.querySelector(SELECTORS.MONEY_INPUT);

            if (isVisible) {
                if (!this.wasVisible) {
                    this.resetTransform();
                }
                this.container.style.display = 'flex';
            } else {
                this.resetTransform();
                this.container.style.display = 'none';
            }

            this.wasVisible = isVisible;
        }

        startObserving() {
            this.updateVisibility();

            this.observer = new MutationObserver(() => this.updateVisibility());
            this.observer.observe(document.body, { childList: true, subtree: true });
        }

        destroy() {
            if (this.observer) this.observer.disconnect();
            if (this.container) this.container.remove();
            clearTimeout(this.timeout);
        }
    }

    // Empty rows handler
    class EmptyRowsHandler {
        constructor() {
            this.observer = null;
            this.mediaQuery = null;
            this.init();
        }

        handleMediaQueryChange(e) {
            const shouldHide = !e.matches; // matches when width > MIN_WIDTH
            document.querySelectorAll(SELECTORS.EMPTY_ROW).forEach(row => {
                row.style.display = shouldHide ? 'none' : '';
            });
        }

        init() {
            const container = document.querySelector(SELECTORS.TRADE_CONTAINER);
            if (!container) return;

            // Use matchMedia instead of resize events
            this.mediaQuery = window.matchMedia(`(min-width: ${CONFIG.MIN_WIDTH + 1}px)`);

            // Modern browsers support addEventListener on MediaQueryList
            if (this.mediaQuery.addEventListener) {
                this.mediaQuery.addEventListener('change', (e) => this.handleMediaQueryChange(e));
            } else {
                // Fallback for older browsers
                this.mediaQuery.addListener((e) => this.handleMediaQueryChange(e));
            }

            // Initial check
            this.handleMediaQueryChange(this.mediaQuery);

            // Still need mutation observer for DOM changes
            this.observer = new MutationObserver(() => this.handleMediaQueryChange(this.mediaQuery));
            this.observer.observe(container, { childList: true, subtree: true });
        }

        destroy() {
            if (this.observer) this.observer.disconnect();
            if (this.mediaQuery && this.mediaQuery.removeEventListener) {
                this.mediaQuery.removeEventListener('change', this.handleMediaQueryChange);
            }
        }
    }

    // Main app class
    class BetterTrades {
        constructor() {
            this.components = [];
        }

        init() {
            const container = document.querySelector(SELECTORS.TRADE_CONTAINER);
            if (!container) return;

            // Check for existing instance
            if (document.getElementById('tm-float-accept') || document.getElementById('tm-float-money-wrap')) {
                return;
            }

            // Initialize styles first
            initializeStyles();

            this.components = [
                new EmptyRowsHandler(),
                new AcceptHelper(),
                new MoneyHelper()
            ];
        }

        destroy() {
            this.components.forEach(component => {
                if (component.destroy) component.destroy();
            });
            this.components = [];
        }
    }

    // Initialize
    const app = new BetterTrades();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => app.init());
    } else {
        app.init();
    }

    // Export for potential external use
    window.BetterTrades = app;

})();
