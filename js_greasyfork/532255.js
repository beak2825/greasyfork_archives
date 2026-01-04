// ==UserScript==
// @name         JanitorAI Enhanced UI with CSS Toggle and Auto Pagination
// @namespace    http://tampermonkey.net/
// @version      3.7
// @description  Adds UI controls, hides buttons, toggles custom CSS, and auto-paginates on JanitorAI
// @author       Fefnik
// @match        https://janitorai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532255/JanitorAI%20Enhanced%20UI%20with%20CSS%20Toggle%20and%20Auto%20Pagination.user.js
// @updateURL https://update.greasyfork.org/scripts/532255/JanitorAI%20Enhanced%20UI%20with%20CSS%20Toggle%20and%20Auto%20Pagination.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let MIN_TOKENS = parseInt(localStorage.getItem('janitorAITokenFilter')) || 500;
    let isSidebarHidden = localStorage.getItem('janitorAISidebarHidden') === 'true';
    let isAutoScrollEnabled = localStorage.getItem('janitorAIAutoScroll') !== 'false';
    let isMenuVisible = false;
    let isCustomCssDisabled = localStorage.getItem('janitorAICustomCssDisabled') === 'true';
    let isAutoPaginationEnabled = localStorage.getItem('janitorAIAutoPagination') !== 'false'; // Новая настройка

    let sliderElement = null;
    let sliderContainer = null;
    let controlPanel = null;
    let controlsContainer = null;
    let emblaSlide = null;

    const isAllowedPage = () => {
        const path = window.location.pathname;
        return path === '/' || path.startsWith('/search') || path === '/my_characters' || path.startsWith('/profiles/');
    };

    const isChatsPage = () => window.location.pathname.startsWith('/chats');

    const parseTokens = (text) => {
        try {
            text = text.replace(/<!--[\s\S]*?-->/g, '').replace('tokens', '').trim();
            return text.includes('k') ? parseFloat(text.replace('k', '')) * 1000 : parseInt(text, 10) || 0;
        } catch {
            return 0;
        }
    };

    const filterCards = () => {
        document.querySelectorAll('.chakra-stack.css-1s5evre, .css-1s5evre').forEach(card => {
            const tokenElement = card.querySelector('.chakra-text.css-jccmq6, .css-jccmq6');
            if (!tokenElement) return;

            const tokenCount = parseTokens(tokenElement.textContent);
            const parent = card.closest('.css-1sxhvxh, .css-1dbw1r8');
            if (parent) parent.style.display = tokenCount < MIN_TOKENS ? 'none' : '';
        });
    };

    const setupPaginationScroll = () => {
        document.querySelectorAll('.css-kzd6o0').forEach(button => {
            button.removeEventListener('click', handlePaginationClick);
            button.addEventListener('click', handlePaginationClick);
        });
    };

    const handlePaginationClick = () => {
        if (isAutoScrollEnabled) {
            setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 300);
        }
    };

    // Функция для поиска следующей страницы
    const getNextPageElement = () => {
        const currentPage = document.querySelector('.css-1xdrgup');
        if (!currentPage) return null;

        let nextElement = currentPage.nextElementSibling;
        while (nextElement) {
            if (nextElement.classList.contains('css-kzd6o0') || nextElement.classList.contains('css-15aspjy')) {
                return nextElement;
            }
            nextElement = nextElement.nextElementSibling;
        }
        return null;
    };

    // Проверка полного достижения конца страницы
    const isAtVeryBottom = () => {
        const scrollPosition = window.scrollY + window.innerHeight;
        const pageHeight = document.documentElement.scrollHeight;
        return pageHeight - scrollPosition <= 1;
    };

    // Логика автоперехода
    const setupAutoPagination = () => {
        let isNavigating = false;
        let scrollCount = 0;
        const requiredScrolls = 3;

        window.addEventListener('wheel', function(event) {
            if (isAutoPaginationEnabled && event.deltaY > 0 && isAtVeryBottom() && !isNavigating) {
                scrollCount++;
                if (scrollCount >= requiredScrolls) {
                    const nextPage = getNextPageElement();
                    if (nextPage) {
                        isNavigating = true;
                        nextPage.click();
                        setTimeout(() => {
                            isNavigating = false;
                            scrollCount = 0;
                        }, 2000);
                    }
                }
            } else if (!isAtVeryBottom()) {
                scrollCount = 0;
            }
        }, { passive: true });
    };

    const toggleSidebar = () => {
        const sidebar = document.querySelector('.css-h988mi');
        const css70qvj9 = document.querySelector('.css-70qvj9');

        if (sidebar) {
            isSidebarHidden = !isSidebarHidden;
            sidebar.style.display = isSidebarHidden ? 'none' : '';

            if (!emblaSlide) {
                emblaSlide = document.querySelector('.is-in-view.is-snapped.embla__slide');
            }
            if (emblaSlide) {
                emblaSlide.style.display = isSidebarHidden ? 'none' : '';
            }

            if (css70qvj9) {
                css70qvj9.style.display = isSidebarHidden ? 'none' : '';
            }

            localStorage.setItem('janitorAISidebarHidden', isSidebarHidden);
            updateControlText();
        }
    };

    const toggleAutoScroll = () => {
        isAutoScrollEnabled = !isAutoScrollEnabled;
        localStorage.setItem('janitorAIAutoScroll', isAutoScrollEnabled);
        updateControlText();
    };

    const toggleAutoPagination = () => {
        isAutoPaginationEnabled = !isAutoPaginationEnabled;
        localStorage.setItem('janitorAIAutoPagination', isAutoPaginationEnabled);
        updateControlText();
    };

    const toggleMenu = () => {
        isMenuVisible = !isMenuVisible;
        updateElementsVisibility();
        updateControlText();
    };

    const toggleCustomCss = () => {
        isCustomCssDisabled = !isCustomCssDisabled;
        localStorage.setItem('janitorAICustomCssDisabled', isCustomCssDisabled);
        applyCustomCssToggle();
        updateControlText();
    };

    const applyCustomCssToggle = () => {
        if (isCustomCssDisabled) {
            removeCustomStyles();
            blockCustomElements();
        }
    };

    const removeCustomStyles = () => {
        const styles = document.querySelectorAll('body style');
        styles.forEach(style => style.remove());
    };

    const blockCustomElements = () => {
        document.querySelectorAll('.css-1bn1yyx').forEach(element => {
            element.style.display = 'none';
        });

        document.querySelectorAll('*').forEach(element => {
            const style = window.getComputedStyle(element);
            const bgImage = style.backgroundImage;
            if (bgImage && bgImage.includes('ella.janitorai.com/background-image/')) {
                element.style.backgroundImage = 'none';
            }
        });
    };

    const updateControlText = () => {
        const sidebarText = document.getElementById('sidebar-toggle-text');
        const scrollText = document.getElementById('auto-scroll-text');
        const paginationText = document.getElementById('auto-pagination-text');
        const cssToggleText = document.getElementById('css-toggle-text');
        if (sidebarText) {
            sidebarText.textContent = isSidebarHidden ? 'Topbar: OFF' : 'Topbar: ON';
            sidebarText.style.color = isSidebarHidden ? '#fff' : '#ccc';
        }
        if (scrollText) {
            scrollText.textContent = `Auto-Scroll: ${isAutoScrollEnabled ? 'ON' : 'OFF'}`;
            scrollText.style.color = isAutoScrollEnabled ? '#fff' : '#ccc';
        }
        if (paginationText) {
            paginationText.textContent = `Auto-Page: ${isAutoPaginationEnabled ? 'ON' : 'OFF'}`;
            paginationText.style.color = isAutoPaginationEnabled ? '#fff' : '#ccc';
        }
        if (cssToggleText) {
            cssToggleText.textContent = `Custom CSS: ${isCustomCssDisabled ? 'OFF' : 'ON'}`;
            cssToggleText.style.color = isCustomCssDisabled ? '#fff' : '#ccc';
        }
    };

    const createControlPanel = () => {
        if (controlPanel) return;

        controlPanel = document.createElement('div');
        controlPanel.id = 'janitor-control-panel';
        Object.assign(controlPanel.style, {
            position: 'fixed',
            top: '75px',
            left: '10px',
            zIndex: '100000',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            alignItems: 'flex-start'
        });

        const settingsButton = document.createElement('button');
        settingsButton.id = 'token-filter-toggle';
        settingsButton.textContent = '⚙️';
        Object.assign(settingsButton.style, {
            width: '30px',
            height: '30px',
            padding: '0',
            backgroundColor: 'rgba(74, 74, 74, 0.7)',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            transition: 'background-color 0.2s'
        });
        settingsButton.addEventListener('click', toggleMenu);

        controlsContainer = document.createElement('div');
        controlsContainer.id = 'controls-container';
        Object.assign(controlsContainer.style, {
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            backgroundColor: 'rgba(74, 74, 74, 0.7)',
            padding: '5px',
            borderRadius: '5px',
            zIndex: '100001'
        });

        const sidebarText = document.createElement('span');
        sidebarText.id = 'sidebar-toggle-text';
        sidebarText.style.cursor = 'pointer';
        sidebarText.style.fontSize = '12px';
        sidebarText.addEventListener('click', toggleSidebar);

        const scrollText = document.createElement('span');
        scrollText.id = 'auto-scroll-text';
        scrollText.style.cursor = 'pointer';
        scrollText.style.fontSize = '12px';
        scrollText.addEventListener('click', toggleAutoScroll);

        const paginationText = document.createElement('span');
        paginationText.id = 'auto-pagination-text';
        paginationText.style.cursor = 'pointer';
        paginationText.style.fontSize = '12px';
        paginationText.addEventListener('click', toggleAutoPagination);

        const cssToggleText = document.createElement('span');
        cssToggleText.id = 'css-toggle-text';
        cssToggleText.style.cursor = 'pointer';
        cssToggleText.style.fontSize = '12px';
        cssToggleText.addEventListener('click', toggleCustomCss);

        controlsContainer.appendChild(sidebarText);
        controlsContainer.appendChild(scrollText);
        controlsContainer.appendChild(paginationText);
        controlsContainer.appendChild(cssToggleText);
        controlPanel.appendChild(settingsButton);
        controlPanel.appendChild(controlsContainer);
        document.body.appendChild(controlPanel);
        updateControlText();
    };

    const createOrUpdateSlider = () => {
        if (sliderElement) return;

        sliderContainer = document.createElement('div');
        sliderContainer.id = 'token-filter-container';
        Object.assign(sliderContainer.style, {
            position: 'fixed',
            top: '75px',
            left: '50px',
            zIndex: '100002',
            display: 'none',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '10px',
            padding: '5px',
            backgroundColor: 'rgba(74, 74, 74, 0.7)',
            borderRadius: '5px'
        });

        sliderElement = document.createElement('input');
        sliderElement.type = 'range';
        sliderElement.id = 'token-filter-slider';
        Object.assign(sliderElement, {
            min: '0',
            max: '6000',
            step: '100',
            value: MIN_TOKENS
        });
        Object.assign(sliderElement.style, {
            width: '150px',
            height: '20px',
            backgroundColor: '#4a4a4a',
            cursor: 'pointer',
            appearance: 'none',
            outline: 'none',
            borderRadius: '5px',
            padding: '0',
            zIndex: '100003'
        });

        const style = document.createElement('style');
        style.textContent = `
            #token-filter-slider {
                -webkit-appearance: none;
                appearance: none;
                background: #4a4a4a;
                border-radius: 5px;
                z-index: 100003;
            }
            #token-filter-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 10px;
                height: 20px;
                background: #ffffff;
                cursor: pointer;
                border-radius: 50%;
                border: 2px solid #000;
                box-shadow: 0 0 2px rgba(0,0,0,0.5);
                transform: translateY(0px);
                z-index: 100004;
            }
            #token-filter-slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                background: #ffffff;
                cursor: pointer;
                border-radius: 50%;
                border: 2px solid #000;
                box-shadow: 0 0 2px rgba(0,0,0,0.5);
                transform: translateY(-10px);
                z-index: 100004;
            }
            #token-filter-slider::-webkit-slider-runnable-track {
                height: '10px',
                background: #4a4a4a;
                border-radius: 5px;
            }
            #token-filter-slider::-moz-range-track {
                height: '10px',
                background: #4a4a4a;
                border-radius: 5px;
            }
        `;
        document.head.appendChild(style);

        const label = document.createElement('span');
        label.id = 'token-filter-label';
        label.style.color = '#fff';
        label.style.fontSize = '12px';
        label.style.minWidth = '60px';
        label.textContent = `${MIN_TOKENS} tokens`;

        sliderElement.addEventListener('input', (e) => {
            MIN_TOKENS = parseInt(e.target.value);
            label.textContent = `${MIN_TOKENS} tokens`;
            localStorage.setItem('janitorAITokenFilter', MIN_TOKENS);
            filterCards();
        });

        sliderContainer.appendChild(sliderElement);
        sliderContainer.appendChild(label);
        document.body.appendChild(sliderContainer);
    };

    const applySidebarState = () => {
        const sidebar = document.querySelector('.css-h988mi');
        const css70qvj9 = document.querySelector('.css-70qvj9');
        emblaSlide = document.querySelector('.is-in-view.is-snapped.embla__slide');

        if (sidebar && isSidebarHidden) {
            sidebar.style.display = 'none';
            if (emblaSlide) emblaSlide.style.display = 'none';
            if (css70qvj9) css70qvj9.style.display = 'none';
        }
    };

    const updateElementsVisibility = () => {
        const shouldShow = isAllowedPage() && !isChatsPage();
        if (controlPanel) controlPanel.style.display = shouldShow ? 'flex' : 'none';
        if (sliderContainer) sliderContainer.style.display = shouldShow && isMenuVisible ? 'flex' : 'none';
        if (controlsContainer) controlsContainer.style.display = shouldShow && isMenuVisible ? 'flex' : 'none';
    };

    const initialize = () => {
        createControlPanel();
        createOrUpdateSlider();
        applySidebarState();
        updateElementsVisibility();
        setupAutoPagination(); // Инициализация автоперехода

        if (isAllowedPage() && !isChatsPage()) {
            filterCards();
            setupPaginationScroll();
            applyCustomCssToggle();

            new MutationObserver(() => {
                filterCards();
                setupPaginationScroll();
                applyCustomCssToggle();
                applySidebarState();
            }).observe(document.body, { childList: true, subtree: true });

            const originalAppendChild = Element.prototype.appendChild;
            Element.prototype.appendChild = function(node) {
                if (isCustomCssDisabled && node.tagName === 'STYLE' && this.tagName === 'HEAD') {
                    return node;
                }
                return originalAppendChild.call(this, node);
            };
        }
    };

    const tryInitialize = () => {
        if (document.body) {
            initialize();
            let lastPath = window.location.pathname;
            setInterval(() => {
                if (lastPath !== window.location.pathname) {
                    lastPath = window.location.pathname;
                    updateElementsVisibility();
                    if (isAllowedPage() && !isChatsPage()) {
                        filterCards();
                        setupPaginationScroll();
                        applyCustomCssToggle();
                        applySidebarState();
                    }
                }
            }, 500);
        } else {
            setTimeout(tryInitialize, 1000);
        }
    };

    tryInitialize();
})();