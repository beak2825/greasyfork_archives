// ==UserScript==
// @name         ✨ Simple Pull to Refresh
// @namespace    r1kov
// @version      0.3-fix
// @description  🌟 Minimal Premium: Простое и стабильное обновление страницы потягиванием для браузера Via
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522376/%E2%9C%A8%20Simple%20Pull%20to%20Refresh.user.js
// @updateURL https://update.greasyfork.org/scripts/522376/%E2%9C%A8%20Simple%20Pull%20to%20Refresh.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const config = {
        threshold: 100, // Минимальное расстояние для срабатывания обновления
        elementId: 'simple-refresh',
        overlayId: 'simple-overlay',
        colors: {
            pull: '#333',
            release: '#ffcc00',
            loading: '#007aff'
        },
        messages: {
            pull: 'потяните вниз',
            release: 'отпустите',
            loading: 'обновление'
        }
    };

    let state = {
        startY: 0,
        currentY: 0,
        isActive: false
    };

    function injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            #${config.elementId} {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 64px;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 999999;
                transform: translateY(-100%);
                transition: transform 0.3s ease-out;
                pointer-events: none;
                font-family: -apple-system, system-ui, sans-serif;
            }
            #${config.elementId} .pill {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 20px;
                background: ${config.colors.pull};
                color: white;
                border-radius: 26px;
                font-size: 14px;
                font-weight: 500;
                transition: background 0.3s ease-out;
            }
            #${config.elementId} .icon {
                font-size: 18px;
            }
            #${config.overlayId} {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0);
                backdrop-filter: blur(0px);
                -webkit-backdrop-filter: blur(0px);
                z-index: 999998;
                pointer-events: none;
                transition: all 0.3s ease-out;
            }
            @keyframes rotate {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    function createElements() {
        if (document.getElementById(config.elementId) || document.getElementById(config.overlayId)) {
            return {
                overlay: document.getElementById(config.overlayId),
                refreshEl: document.getElementById(config.elementId)
            };
        }

        const overlay = document.createElement('div');
        overlay.id = config.overlayId;
        document.body.appendChild(overlay);

        const refreshEl = document.createElement('div');
        refreshEl.id = config.elementId;
        refreshEl.innerHTML = `
            <div class="pill">
                <span class="icon">↓</span>
                <span class="text">${config.messages.pull}</span>
            </div>
        `;
        document.body.appendChild(refreshEl);

        return { overlay, refreshEl };
    }

    function updateUI(distance) {
        const { overlay, refreshEl } = createElements();
        const translateY = Math.min(distance * 0.5, 64);
        refreshEl.style.transform = `translateY(${translateY - 64}px)`;
        overlay.style.background = `rgba(255, 255, 255, ${distance / config.threshold * 0.1})`;
        overlay.style.backdropFilter = `blur(${distance / config.threshold * 8}px)`;
        overlay.style.webkitBackdropFilter = `blur(${distance / config.threshold * 8}px)`;

        if (distance > config.threshold) {
            refreshEl.querySelector('.pill').style.background = config.colors.release;
            refreshEl.querySelector('.text').textContent = config.messages.release;
        } else {
            refreshEl.querySelector('.pill').style.background = config.colors.pull;
            refreshEl.querySelector('.text').textContent = config.messages.pull;
        }
    }

    function reset() {
        const { overlay, refreshEl } = createElements();
        refreshEl.style.transform = 'translateY(-100%)';
        overlay.style.background = 'rgba(255, 255, 255, 0)';
        overlay.style.backdropFilter = 'blur(0px)';
        overlay.style.webkitBackdropFilter = 'blur(0px)';

        setTimeout(() => {
            if (refreshEl && refreshEl.parentNode) refreshEl.remove();
            if (overlay && overlay.parentNode) overlay.remove();
        }, 300);
    }

    function refresh() {
        const { refreshEl } = createElements();
        refreshEl.querySelector('.pill').style.background = config.colors.loading;
        refreshEl.querySelector('.icon').textContent = '↻';
        refreshEl.querySelector('.text').textContent = config.messages.loading;

        setTimeout(() => {
            window.location.reload();
        }, 300);
    }

    function handleTouchStart(e) {
        if (window.scrollY === 0 && !e.target.matches('input, textarea, select')) {
            state.startY = e.touches[0].pageY;
            state.currentY = state.startY;
            state.isActive = true;
        }
    }

    function handleTouchMove(e) {
        if (!state.isActive) return;
        state.currentY = e.touches[0].pageY;
        const distance = state.currentY - state.startY;

        if (distance > 0 && window.scrollY === 0) {
            e.preventDefault();
            requestAnimationFrame(() => updateUI(distance));
        }
    }

    function handleTouchEnd() {
        if (!state.isActive) return;
        const distance = state.currentY - state.startY;

        if (distance > config.threshold) {
            refresh();
        } else {
            reset();
        }

        state.isActive = false;
    }

    injectStyles();

    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Очистка элементов при переходе на другую страницу
    window.addEventListener('beforeunload', () => {
        const refreshEl = document.getElementById(config.elementId);
        const overlay = document.getElementById(config.overlayId);

        if (refreshEl && refreshEl.parentNode) refreshEl.remove();
        if (overlay && overlay.parentNode) overlay.remove();
    });
})();