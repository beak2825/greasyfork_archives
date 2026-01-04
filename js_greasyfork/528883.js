// ==UserScript==
// @name         FFZ Panel Resize Center  ||  Styles ffz-menu-tree_active_color 1.2.35  ||
// @namespace    http://tampermonkey.net/
// @version      1.2.35
// @description  combined into one extension ,emote picker,resize ffz panel.  
// @author       gullampis810
// @match        https://www.twitch.tv/*
// @license      MIT
// @icon         https://greasyfork.s3.us-east-2.amazonaws.com/mpvcskmed1ygsfiram7nlaf9vnew
// @grant        GM_addStyle
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/528883/FFZ%20Panel%20Resize%20Center%20%20%7C%7C%20%20Styles%20ffz-menu-tree_active_color%201235%20%20%7C%7C.user.js
// @updateURL https://update.greasyfork.org/scripts/528883/FFZ%20Panel%20Resize%20Center%20%20%7C%7C%20%20Styles%20ffz-menu-tree_active_color%201235%20%20%7C%7C.meta.js
// ==/UserScript==
 
// FFZ_main_Panel_Resize.js  v1.2.30 //
 
(function() {
    'use strict';
 
    // --- Часть 1: Изменение размеров панели эмодзи FFZ ---
    const observerEmoji = new MutationObserver(() => {
        const buttonContainer = document.querySelector('.tw-absolute.tw-border-radius-medium.tw-bottom-0.tw-c-background-overlay.tw-c-text-overlay.tw-mg-b-1');
        if (buttonContainer) {
            buttonContainer.style.height = '34px';
            buttonContainer.style.minHeight = '34px';
            buttonContainer.style.maxHeight = '34px';
            console.log('[FFZ Enhancements] Высота контейнера кнопки установлена на 34px');
        }
    });
 
    observerEmoji.observe(document.body, { childList: true, subtree: true });
 
    console.log('[FFZ Enhancements] Контейнер .emote-picker изменен: шире, выше, сдвинут влево.');
 
    // --- Часть 2: Перетаскивание и изменение размеров FFZ-диалога ---
    function isInputElement(target) {
        return target.tagName === 'INPUT' ||
               target.tagName === 'TEXTAREA' ||
               target.tagName === 'SELECT' ||
               target.closest('input, textarea, select');
    }
 
    function initDraggingAndResizing(dialog) {
        if (!dialog) {
            console.log('[FFZ Enhancements] Dialog not found');
            return;
        }
 
        const header = dialog.querySelector('header');
        if (!header) {
            console.log('[FFZ Enhancements] Header not found');
            return;
        }
 
        if (dialog.dataset.draggingInitialized) {
            console.log('[FFZ Enhancements] Dragging already initialized, skipping');
            return;
        }
        dialog.dataset.draggingInitialized = 'true';
 
        console.log('[FFZ Enhancements] Initializing for dialog');
 
        dialog.style.position = 'absolute';
        dialog.style.minWidth = '200px';
        dialog.style.minHeight = '200px';
 
        let isDragging = false;
        let startX, startY;
        let isResizing = false;
        let resizeStartX, resizeStartY;
 
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('button') || isInputElement(e.target)) {
                console.log('[FFZ Enhancements] Ignoring button or input click');
                return;
            }
 
            isDragging = true;
            startX = e.clientX - (parseFloat(dialog.style.left) || dialog.offsetLeft);
            startY = e.clientY - (parseFloat(dialog.style.top) || dialog.offsetTop);
 
            dialog.style.zIndex = Math.max(parseInt(dialog.style.zIndex) || 9000, 9000) + 1;
 
            console.log('[FFZ Enhancements] Drag started at', e.clientX, e.clientY);
            e.preventDefault();
            e.stopPropagation();
        }, { capture: true, passive: false });
 
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                requestAnimationFrame(() => {
                    const newLeft = e.clientX - startX;
                    const newTop = e.clientY - startY;
 
                    dialog.style.left = `${newLeft}px`;
                    dialog.style.top = `${newTop}px`;
 
                    console.log('[FFZ Enhancements] Moved to', newLeft, newTop);
                });
            }
        }, { capture: true, passive: true });
 
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                console.log('[FFZ Enhancements] Drag ended');
                isDragging = false;
            }
        }, { capture: true, passive: true });
 
        header.addEventListener('touchstart', (e) => {
            if (e.target.closest('button') || isInputElement(e.target)) {
                console.log('[FFZ Enhancements] Ignoring button or input touch');
                return;
            }
 
            isDragging = true;
            const touch = e.touches[0];
            startX = touch.clientX - (parseFloat(dialog.style.left) || dialog.offsetLeft);
            startY = touch.clientY - (parseFloat(dialog.style.top) || dialog.offsetTop);
 
            dialog.style.zIndex = Math.max(parseInt(dialog.style.zIndex) || 9000, 9000) + 1;
 
            console.log('[FFZ Enhancements] Touch drag started at', touch.clientX, touch.clientY);
            e.preventDefault();
            e.stopPropagation();
        }, { capture: true, passive: false });
 
        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                const touch = e.touches[0];
                requestAnimationFrame(() => {
                    const newLeft = touch.clientX - startX;
                    const newTop = touch.clientY - startY;
 
                    dialog.style.left = `${newLeft}px`;
                    dialog.style.top = `${newTop}px`;
 
                    console.log('[FFZ Enhancements] Touch moved to', newLeft, newTop);
                });
            }
        }, { capture: true, passive: true });
 
        document.addEventListener('touchend', () => {
            if (isDragging) {
                console.log('[FFZ Enhancements] Touch drag ended');
                isDragging = false;
            }
        }, { capture: true, passive: true });
 
        const resizeHandle = document.createElement('div');
        resizeHandle.className = '.ffz-panel-7btvfz-5e8jhe5-resize-handle';
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.bottom = '4px';
        resizeHandle.style.right = '4px';
        resizeHandle.style.width = '15px';
        resizeHandle.style.height = '15px';
        resizeHandle.style.background = '#34767c';
        resizeHandle.style.cursor = 'se-resize';
        resizeHandle.style.zIndex = '10001';
        resizeHandle.style.border = '1px solid #ffffff';
        resizeHandle.style.borderRadius = '8px';
        dialog.appendChild(resizeHandle);
 
        resizeHandle.addEventListener('mousedown', (e) => {
            if (isInputElement(e.target)) {
                console.log('[FFZ Enhancements] Ignoring input click on resize handle');
                return;
            }
 
            isResizing = true;
            resizeStartX = e.clientX;
            resizeStartY = e.clientY;
 
            console.log('[FFZ Enhancements] Resize started at', e.clientX, e.clientY);
            e.preventDefault();
            e.stopPropagation();
        }, { capture: true, passive: false });
 
        document.addEventListener('mousemove', (e) => {
            if (isResizing) {
                requestAnimationFrame(() => {
                    const newWidth = (parseFloat(dialog.style.width) || dialog.offsetWidth) + (e.clientX - resizeStartX);
                    const newHeight = (parseFloat(dialog.style.height) || dialog.offsetHeight) + (e.clientY - resizeStartY);
 
                    if (newWidth >= 200) {
                        dialog.style.width = `${newWidth}px`;
                        resizeStartX = e.clientX;
                    }
                    if (newHeight >= 200) {
                        dialog.style.height = `${newHeight}px`;
                        resizeStartY = e.clientY;
                    }
 
                    console.log('[FFZ Enhancements] Resized to', newWidth, newHeight);
                });
            }
        }, { capture: true, passive: true });
 
        document.addEventListener('mouseup', () => {
            if (isResizing) {
                console.log('[FFZ Enhancements] Resize ended');
                isResizing = false;
            }
        }, { capture: true, passive: true });
 
        resizeHandle.addEventListener('touchstart', (e) => {
            if (isInputElement(e.target)) {
                console.log('[FFZ Enhancements] Ignoring input touch on resize handle');
                return;
            }
 
            isResizing = true;
            const touch = e.touches[0];
            resizeStartX = touch.clientX;
            resizeStartY = touch.clientY;
 
            console.log('[FFZ Enhancements] Touch resize started at', touch.clientX, touch.clientY);
            e.preventDefault();
            e.stopPropagation();
        }, { capture: true, passive: false });
 
        document.addEventListener('touchmove', (e) => {
            if (isResizing) {
                const touch = e.touches[0];
                requestAnimationFrame(() => {
                    const newWidth = (parseFloat(dialog.style.width) || dialog.offsetWidth) + (touch.clientX - resizeStartX);
                    const newHeight = (parseFloat(dialog.style.height) || dialog.offsetHeight) + (touch.clientY - resizeStartY);
 
                    if (newWidth >= 200) {
                        dialog.style.width = `${newWidth}px`;
                        resizeStartX = touch.clientX;
                    }
                    if (newHeight >= 200) {
                        dialog.style.height = `${newHeight}px`;
                        resizeStartY = touch.clientY;
                    }
 
                    console.log('[FFZ Enhancements] Touch resized to', newWidth, newHeight);
                });
            }
        }, { capture: true, passive: true });
 
        document.addEventListener('touchend', () => {
            if (isResizing) {
                console.log('[FFZ Enhancements] Touch resize ended');
                isResizing = false;
            }
        }, { capture: true, passive: true });
 
        const resetButton = document.createElement('button');
        resetButton.textContent = 'Reset Position';
        resetButton.style.position = 'absolute';
        resetButton.style.top = '9px';
        resetButton.style.right = '180px';
        resetButton.style.zIndex = '1';
        resetButton.style.padding = '5px';
        resetButton.style.background = '#34767c';
        resetButton.style.borderRadius = '12px';
        resetButton.style.border = '1px solid #ffffff';
        resetButton.addEventListener('click', () => {
            dialog.style.left = '25%';
            dialog.style.top = '25%';
            dialog.style.width = '';
            dialog.style.height = '';
            console.log('[FFZ Enhancements] Position and size reset to 25%, 25%');
        });
        dialog.appendChild(resetButton);
 
        console.log('[FFZ Enhancements] Dragging and resizing initialized successfully');
    }
 
    const observerDialog = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                const dialog = document.querySelector('.ffz-dialog.ffz-main-menu:not([data-dragging-initialized])');
                if (dialog) {
                    console.log('[FFZ Enhancements] Dialog detected via observer');
                    initDraggingAndResizing(dialog);
                }
            }
        }
    });
 
    observerDialog.observe(document.body, {
        childList: true,
        subtree: true
    });
 
    const initialDialog = document.querySelector('.ffz-dialog.ffz-main-menu:not([data-dragging-initialized])');
    if (initialDialog) {
        console.log('[FFZ Enhancements] Initial dialog found');
        initDraggingAndResizing(initialDialog);
    }
 
    // --- Часть 3: Улучшение ffz-viewer-card ---
    function setupCustomDrag(card) {
        const header = card.querySelector('.ffz-viewer-card__header');
        if (!header) {
            console.log('[FFZ Enhancements] Header not found for dragging');
            return;
        }
 
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
 
        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.viewer-card-drag-cancel')) return;
 
            isDragging = true;
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
            card.style.transition = 'none';
            e.preventDefault();
        });
 
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
 
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            card.style.left = `${currentX}px`;
            card.style.top = `${currentY}px`;
        });
 
        document.addEventListener('mouseup', () => {
            isDragging = false;
            card.style.transition = '';
        });
 
        if (!card.style.left || !card.style.top) {
            const rect = card.getBoundingClientRect();
            currentX = rect.left;
            currentY = rect.top;
            card.style.left = `${currentX}px`;
            card.style.top = `${currentY}px`;
        }
    }
 
    function showEmoteSelectionPopup(emotes, callback) {
        console.log('[FFZ Enhancements] Attempting to show emote selection popup with emotes:', emotes);
 
        const existingPopup = document.getElementById('emote-selection-popup');
        if (existingPopup) {
            console.log('[FFZ Enhancements] Removing existing popup');
            existingPopup.remove();
        }
 
        const popup = document.createElement('div');
        popup.id = 'emote-selection-popup';
        popup.innerHTML = `
            <div class="close-button" style="cursor:pointer;position:absolute;top:6px;right:10px;font-size:20px;">✕</div>
            <div class="emote-options"></div>
        `;
        document.body.appendChild(popup);
        console.log('[FFZ Enhancements] Popup element created and appended to body');
 
        popup.classList.add('ffz-emote-popup');
        const optionsContainer = popup.querySelector('.emote-options');
 
        emotes.forEach((emote, index) => {
            const option = document.createElement('div');
            option.className = 'emote-option';
            option.style.display = 'flex';
            option.style.alignItems = 'center';
            option.style.justifyContent = 'space-between';
            option.style.padding = '8px 0';
            option.style.borderBottom = '1px solid rgba(115, 209, 204, 0.16)';
            option.style.gap = '10px';
 
            const left = document.createElement('div');
            left.style.display = 'flex';
            left.style.alignItems = 'center';
            left.style.minWidth = '0';
 
            const img = document.createElement('img');
            img.src = emote.src || '';
            img.alt = emote.alt || 'Emote';
            img.style.width = '24px';
            img.style.height = '24px';
            img.style.marginRight = '10px';
            img.style.flexShrink = '0';
            img.style.userSelect = 'none';
 
            const info = document.createElement('div');
            info.className = 'emote-info';
            info.style.fontSize = '14px';
            info.style.whiteSpace = 'nowrap';
            info.style.overflow = 'hidden';
            info.style.textOverflow = 'ellipsis';
            info.innerHTML = `<span>${emote.alt || 'Unnamed'} <span style="user-select:none;">(${emote.platform})</span></span>`;
 
            left.appendChild(img);
            left.appendChild(info);
 
            const blockButton = document.createElement('button');
            blockButton.className = 'block-button';
            blockButton.type = 'button';
            blockButton.textContent = 'Block';
            blockButton.classList.add('ffz-block-button');
            blockButton.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('[FFZ Enhancements] Block button clicked for emote:', emote);
                callback(emote);
                if (emote.element) {
                    emote.element.style.display = 'none';
                    console.log('[FFZ Enhancements] Emote element hidden:', emote.alt);
                    const parentContainer = emote.element.closest('.ffz--inline, .chat-line__message, .chat-image');
                    if (parentContainer) {
                        const allEmotes = parentContainer.querySelectorAll(
                            'img.chat-line__message--emote, .ffz-emote, .seventv-emote, .bttv-emote, .twitch-emote, .chat-image'
                        );
                        const allBlocked = Array.from(allEmotes).every(e => e.style.display === 'none');
                        if (allBlocked) {
                            parentContainer.style.display = 'none';
                            console.log('[FFZ Enhancements] Parent container hidden as all emotes are blocked');
                        }
                    }
                }
                popup.remove();
            });
 
            option.appendChild(left);
            option.appendChild(blockButton);
            optionsContainer.appendChild(option);
        });
        console.log('[FFZ Enhancements] Popup populated with', emotes.length, 'emotes');
 
        const closeButton = popup.querySelector('.close-button');
        closeButton.onclick = () => {
            console.log('[FFZ Enhancements] Emote selection popup closed via close button');
            popup.remove();
        };
 
        const computedStyle = window.getComputedStyle(popup);
        if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
            console.warn('[FFZ Enhancements] Popup is not visible, forcing visibility');
            popup.style.display = 'block';
            popup.style.visibility = 'visible';
        }
 
        setTimeout(() => {
            popup.classList.add('visible');
            console.log('[FFZ Enhancements] Popup visibility class applied');
        }, 10);
 
        document.addEventListener('click', function closePopup(e) {
            const viewerCard = document.querySelector('.ffz-viewer-card.tw-border');
            if (!popup.contains(e.target) && e.target !== popup && (!viewerCard || !viewerCard.contains(e.target))) {
                console.log('[FFZ Enhancements] Closing popup due to outside click');
                popup.remove();
                document.removeEventListener('click', closePopup);
            }
        }, { capture: true, once: true });
 
        const viewerCard = document.querySelector('.ffz-viewer-card.tw-border');
        if (viewerCard) {
            const observer = new MutationObserver(() => {
                const rect = viewerCard.getBoundingClientRect();
                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;
                const popupWidth = 320;
                const offset = 20;
                const extraOffset = 30;
 
                let left = rect.right + offset + extraOffset;
                let top = rect.top;
 
                if (left + popupWidth > viewportWidth) {
                    left = rect.left - popupWidth - offset;
                }
 
                if (top + popup.offsetHeight > viewportHeight) {
                    top = viewportHeight - popup.offsetHeight - offset;
                }
 
                if (top < 0) {
                    top = offset;
                }
 
                if (left < 0) {
                    left = offset;
                    if (rect.bottom + popup.offsetHeight + offset <= viewportHeight) {
                        left = rect.left;
                        top = rect.bottom + offset;
                    }
                }
 
                popup.style.left = `${left}px`;
                popup.style.top = `${top}px`;
                console.log('[FFZ Enhancements] Popup repositioned to left:', left, 'top:', top);
            });
 
            observer.observe(viewerCard, {
                attributes: true,
                attributeFilter: ['style', 'class']
            });
 
            popup.addEventListener('remove', () => {
                observer.disconnect();
                console.log('[FFZ Enhancements] MutationObserver disconnected');
            });
 
            const rect = viewerCard.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const popupWidth = 320;
            const offset = 20;
            const extraOffset = 30;
 
            let left = rect.right + offset + extraOffset;
            let top = rect.top;
 
            if (left + popupWidth > viewportWidth) {
                left = rect.left - popupWidth - offset;
            }
 
            if (top + popup.offsetHeight > viewportHeight) {
                top = viewportHeight - popup.offsetHeight - offset;
            }
 
            if (top < 0) {
                top = offset;
            }
 
            if (left < 0) {
                left = offset;
                if (rect.bottom + popup.offsetHeight + offset <= viewportHeight) {
                    left = rect.left;
                    top = rect.bottom + offset;
                }
            }
 
            popup.style.left = `${left}px`;
            popup.style.top = `${top}px`;
            console.log('[FFZ Enhancements] Popup positioned at left:', left, 'top:', top);
        } else {
            popup.style.right = '310px';
            popup.style.top = '385px';
            console.warn('[FFZ Enhancements] ffz-viewer-card not found, using fallback position');
        }
    }
 
    function enableUnconstrainedDragging() {
        const observer = new MutationObserver((mutations, obs) => {
            const viewerCard = document.querySelector('.ffz-viewer-card.tw-border');
            if (viewerCard) {
                setupCustomDrag(viewerCard);
                obs.disconnect();
            }
        });
 
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
 
        const viewerCard = document.querySelector('.ffz-viewer-card.tw-border');
        if (viewerCard) {
            setupCustomDrag(viewerCard);
        }
    }
 
    enableUnconstrainedDragging();
    window.showEmoteSelectionPopup = showEmoteSelectionPopup;
 
    console.log('[FFZ Enhancements] Setup complete');
})();
 
// ffz--menu-tree_active_color.js  v1.2.28 //
 
(function() {
    'use strict';
 
    // Создаём элемент <style> и добавляем CSS
    const style = document.createElement('style');
    style.textContent = `
        /* Элементы верхнего уровня */
        .ffz--menu-tree > li[role="presentation"] > div.tw-flex__item[role="treeitem"] {
            background-color: #346056 !important;
            color: #90e2da !important;
        }
 
        /* Вложенные элементы (не активные) не наследуют фон */
  .ffz--menu-tree ul[role="group"] li[role="presentation"] > div.tw-flex__item[role="treeitem"]:not([aria-selected="true"]) {
            background-color: transparent !important;
        }
 
        /* Стили для активных разделов (верхний уровень и вложенные) */
   .ffz--menu-tree li[role="presentation"].active > div.tw-flex__item[role="treeitem"],
    .ffz--menu-tree li[role="presentation"] > div.tw-flex__item[role="treeitem"][aria-selected="true"] {
            background-color: #321b47 !important;
            color: #68e375 !important;
            opacity: 1 !important;
            z-index: 1 !important;
        }
    .ffz-resizer {
            user-select: none !important;
        }
    .ffz-resizing {
            user-select: all !important;
        }
   header.tw-c-background-base.tw-full-width.tw-align-items-center.tw-flex.tw-flex-nowrap {
    overflow: hidden !important;
    white-space: nowrap !important;
}
.ffz-color-preview.tw-absolute.tw-top-0.tw-bottom-0.tw-right-0.tw-border-l.tw-z-default {
	height: 33px !important;
}
 
 
/*----- user select DATA STORAGE DELETE BACKUP "delete all data FFZ " --------*/
.tw-root--theme-dark .ffz--clear-settings code,
.tw-root--theme-dark .ffz--experiments code {
    background-color: hsla(39, 100%, 61%, 0.459) !important;
    user-select: all !important;
}
/*----- user select DATA STORAGE DELETE BACKUP "delete all data FFZ " --------*/
.ffz-balloon.tw-block.ffz-balloon--lg.ffz-balloon--down.ffz-balloon--left.tw-z-above {
	z-index: 100000 !important;
}
 
    `;
    document.head.appendChild(style);
 
    // Функция для принудительного применения стилей
    function applyActiveStyles() {
        const activeItems = document.querySelectorAll(
            '.ffz--menu-tree li[role="presentation"].active > div.tw-flex__item[role="treeitem"], ' +
            '.ffz--menu-tree li[role="presentation"] > div.tw-flex__item[role="treeitem"][aria-selected="true"]'
        );
        activeItems.forEach(item => {
            item.style.backgroundColor = '#321b47';
            item.style.color = '#68e375';
            item.style.opacity = '1';
            item.style.zIndex = '1';
        });
    }
 
    // Выполняем сразу
    applyActiveStyles();
 
    // Периодическое обновление стилей
    const styleInterval = setInterval(applyActiveStyles, 500);
 
    // Наблюдение за изменениями в DOM
    const observer = new MutationObserver(() => {
        applyActiveStyles();
    });
 
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'aria-selected', 'style']
    });
 
    // Остановка интервала и наблюдателя через 10 секунд
    setTimeout(() => {
        clearInterval(styleInterval);
        observer.disconnect();
    }, 10000);
})();
 
 
 
// resize_navsettings_Menu_ffz.js v1.4.0 //
(function() {
    'use strict';

    // Функция и Флаг для включения/выключения логов
    const debugMode = false; // Флаг для включения/выключения логов
    const log = debugMode ? log.bind(console) : () => {};
    // Функция и Флаг для включения/выключения логов


    // Создаём элемент <style> для стилей
    const style = document.createElement('style');
    style.textContent = `
        .ffz-vertical-nav {
            position: relative;
            transition: width 0.2s ease;
            min-width: 100px !important;
            max-width: 500px !important;
            user-select: none !important;
        }
        .ffz-tree-nav-7btvfz-menu-settings-resize-handle {
            position: absolute;
            top: 0;
            right: -5px;
            width: 5px;
            height: 100%;
            background: #34767c;
            cursor: ew-resize;
            z-index: 10001;
            pointer-events: auto !important;
            user-select: none !important;
            touch-action: none !important;
        }
        .ffz-resizing {
            user-select: none !important;
            pointer-events: auto !important;
        }
        .ffz--menu-tree > li[role="presentation"] > div.tw-flex__item[role="treeitem"] {
            background-color: #346056 !important;
            color: #90e2da !important;
        }
        .ffz--menu-tree ul[role="group"] li[role="presentation"] > div.tw-flex__item[role="treeitem"]:not([aria-selected="true"]) {
            background-color: transparent !important;
            user-select: none !important;
        }
        .ffz--menu-tree li[role="presentation"].active > div.tw-flex__item[role="treeitem"],
        .ffz--menu-tree li[role="presentation"] > div.tw-flex__item[role="treeitem"][aria-selected="true"] {
            background-color: #321b47 !important;
            color: #68e375 !important;
            opacity: 1 !important;
            z-index: 1 !important;
        }
    `;
    document.head.appendChild(style);

    // Функция для сохранения ширины панели
    function savePanelWidth(width) {
        localStorage.setItem('ffz_panel_width', width);
        log('[FFZ Resize] Saved width:', width);
    }

    // Функция для восстановления ширины панели
    function restorePanelWidth(nav) {
        const savedWidth = localStorage.getItem('ffz_panel_width');
        if (savedWidth && nav) {
            nav.style.width = savedWidth;
            log('[FFZ Resize] Restored width:', savedWidth);
        }
    }

    // Функция для проверки, является ли элемент полем ввода
    function isInputElement(target) {
        return target.tagName === 'INPUT' ||
               target.tagName === 'TEXTAREA' ||
               target.tagName === 'SELECT' ||
               target.closest('input, textarea, select');
    }

    // Функция для инициализации ресайзера
    function initResizing(nav) {
        if (!nav) {
            log('[FFZ Resize] Nav not found');
            return;
        }

        if (nav.dataset.resizeInitialized) {
            log('[FFZ Resize] Resizing already initialized, skipping');
            return;
        }
        nav.dataset.resizeInitialized = 'true';

        log('[FFZ Resize] Initializing resizing for nav');

        // Создаём ручку ресайза
        let resizeHandle = nav.querySelector('.ffz-tree-nav-7btvfz-menu-6je5kyfred-settings-resize-handle');
        if (!resizeHandle) {
            resizeHandle = document.createElement('div');
            resizeHandle.className = 'ffz-tree-nav-7btvfz-menu-6je5kyfred-settings-resize-handle';
            nav.appendChild(resizeHandle);
            log('[FFZ Resize] Created new resize handle');
        }

        // Применяем стили к ручке
        resizeHandle.style.position = 'absolute';
        resizeHandle.style.top = '0';
        resizeHandle.style.right = '-5px';
        resizeHandle.style.width = '5px';
        resizeHandle.style.height = '100%';
        resizeHandle.style.background = '#34767c';
        resizeHandle.style.cursor = 'ew-resize';
        resizeHandle.style.zIndex = '10001';
        resizeHandle.style.pointerEvents = 'auto'; 

        let isResizing = false;
        let startX, startWidth;

        // Обработчик для мыши
        resizeHandle.addEventListener('mousedown', (e) => {
            if (isInputElement(e.target)) {
                log('[FFZ Resize] Ignoring input click on resize handle');
                return;
            }

            isResizing = true;
            startX = e.clientX;
            startWidth = parseInt(getComputedStyle(nav).width, 10);
            nav.classList.add('ffz-resizing');
            log('[FFZ Resize] Resize started at', e.clientX, startWidth);
            e.preventDefault();
            e.stopPropagation();
        }, { capture: true, passive: false });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            requestAnimationFrame(() => {
                const newWidth = startWidth + (e.clientX - startX);
                if (newWidth >= 100 && newWidth <= 500) {
                    nav.style.width = `${newWidth}px`;
                    savePanelWidth(`${newWidth}px`);
                    log('[FFZ Resize] Resized to', newWidth);
                }
            });
        }, { capture: true, passive: true });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                log('[FFZ Resize] Resize ended');
                isResizing = false;
                nav.classList.remove('ffz-resizing');
            }
        }, { capture: true, passive: true });

        // Обработчик для сенсорных устройств
        resizeHandle.addEventListener('touchstart', (e) => {
            if (isInputElement(e.target)) {
                log('[FFZ Resize] Ignoring input touch on resize handle');
                return;
            }

            isResizing = true;
            const touch = e.touches[0];
            startX = touch.clientX;
            startWidth = parseInt(getComputedStyle(nav).width, 10);
            nav.classList.add('ffz-resizing');
            log('[FFZ Resize] Touch resize started at', touch.clientX, startWidth);
            e.preventDefault();
            e.stopPropagation();
        }, { capture: true, passive: false });

        document.addEventListener('touchmove', (e) => {
            if (!isResizing) return;
            const touch = e.touches[0];
            requestAnimationFrame(() => {
                const newWidth = startWidth + (touch.clientX - startX);
                if (newWidth >= 100 && newWidth <= 500) {
                    nav.style.width = `${newWidth}px`;
                    savePanelWidth(`${newWidth}px`);
                    log('[FFZ Resize] Touch resized to', newWidth);
                }
            });
        }, { capture: true, passive: true });

        document.addEventListener('touchend', () => {
            if (isResizing) {
                log('[FFZ Resize] Touch resize ended');
                isResizing = false;
                nav.classList.remove('ffz-resizing');
            }
        }, { capture: true, passive: true });

        // Восстанавливаем ширину
        restorePanelWidth(nav);
    }

    // Наблюдение за DOM
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                const nav = document.querySelector('.ffz-vertical-nav:not([data-resize-initialized])');
                if (nav) {
                    log('[FFZ Resize] Nav detected via observer');
                    initResizing(nav);
                }

                // Проверяем Shadow DOM
                const shadowHosts = document.querySelectorAll('div[class*="ffz--settings"]');
                shadowHosts.forEach(host => {
                    if (host.shadowRoot) {
                        const shadowNav = host.shadowRoot.querySelector('.ffz-vertical-nav:not([data-resize-initialized])');
                        if (shadowNav) {
                            log('[FFZ Resize] Nav detected in Shadow DOM');
                            initResizing(shadowNav);
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    // Инициализация при загрузке
    const initialNav = document.querySelector('.ffz-vertical-nav:not([data-resize-initialized])');
    if (initialNav) {
        log('[FFZ Resize] Initial nav found');
        initResizing(initialNav);
    }

    // Периодическая проверка
    setInterval(() => {
        const nav = document.querySelector('.ffz-vertical-nav:not([data-resize-initialized])');
        if (nav) {
            log('[FFZ Resize] Periodic check: nav found, initializing');
            initResizing(nav);
        }
        // Восстанавливаем ширину для всех панелей, даже если они уже инициализированы
        const allNavs = document.querySelectorAll('.ffz-vertical-nav');
        allNavs.forEach(nav => restorePanelWidth(nav));
    }, 500);

    log('[FFZ Resize] Setup complete');
})();
 
 
 
 
 
// emote_picker_combo_resize //
 
 
(function() {
    'use strict';
 
 
 
 
  // Добавляем стили для изменения размеров контейнера эмодзи
    GM_addStyle(`
 
  /*-------------------- FFz modified-emote span  pointer-events: auto !important;  ------------*/
  /*-------------------- FFz modified-emote span  pointer-events: auto !important;  ------------*/
 
  .modified-emote span img {
    pointer-events: auto !important; 
} 
 
  /*-------------------- FFz modified-emote span  pointer-events: auto !important;  ------------*/
  /*-------------------- FFz modified-emote span  pointer-events: auto !important;  ------------*/
 
 
.tw-flex__item.tw-flex.tw-flex-nowrap.tw-align-items-center.tw-pd-y-05.tw-pd-r-05:hover {
    background: #4d3c66 !important;
}
.chat-scrollable-area__message-container {
    position: sticky !important;
    padding-bottom: 1rem !important;
    top: 0px !important;
}
 
/* Убедимся, что контейнер чата не обрезает содержимое */
.chat-scrollable-area__message-container {
    overflow: visible !important;
 
} 
 
.scrollable-area {
    height: 100% !important;
    position: relative !important;
    z-index: 0 !important;
    overflow: auto !important;
}
 
   
// emoji standard color choice mini panel //
 
 /*-------------- emote-picker_FFZ_panel.css -------------*/

* {
     scrollbar-color: auto !important; 
     scrollbar-width: auto !important; 
}

.ffz-viewer-card.tw-border.tw-border-radius-medium.tw-c-background-base.tw-c-text-base.tw-elevation-2.tw-flex.tw-flex-column.viewer-card {
    z-index: 100000 !important;
} 

/* ----------------- emote-picker__controls FFZ --------------------- */
 
.emote-picker__controls-container.tw-relative {
    bottom: 3px !important;
}

.emote-picker {
    width: 1070px !important;
    height: 100px !important;
    left: 24px !important;
    position: relative !important;
}

.ffz--emote-picker {
    position: relative !important;
    height: 785px !important;
    width: 1095px !important;
    max-width: 1500px !important;
    left: -243px !important;
}

.ffz--emote-picker.ffz--emote-picker__tall .emote-picker__nav-content-overflow,
.ffz--emote-picker.ffz--emote-picker__tall .emote-picker__tab-content {
    height: unset !important;
    max-height: 73rem !important;
}

.tw-absolute.ffz-attached.ffz-attached--right.ffz-attached--up {
    width: 857px !important;
    right: 368px !important;
    bottom: 533px !important;
}

.ffz-balloon.ffz-balloon--auto.tw-inline-block.tw-border-radius-large.tw-c-background-base.tw-c-text-inherit.tw-elevation-2.ffz--emote-picker.ffz--emote-picker__tall {
    top: 290px !important;
}

.ffz-attached--up {
    bottom: 510% !important;
}

.tw-border-b.tw-border-l.tw-border-r.tw-border-t.tw-border-radius-medium.tw-c-background-base.tw-elevation-1 {
    width: 60px !important;
    height: 200px !important;
    bottom: 6px !important;
    position: absolute !important;
    right: 5px !important;
}

.tw-absolute {
    position: absolute !important;
    height: 570px !important;
}

 
/*-------------- emote-picker_FFZ_panel.css -------------*/

 
    `);
 
    console.log("[FFZ Emote Panel] Контейнер .emote-picker изменен: шире, выше, сдвинут влево.");
 
})();