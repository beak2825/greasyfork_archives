// ==UserScript==
// @name         图片隐藏
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  单张或者全局图片隐藏与显示
// @match        *://*/*
// @author       eternal5130
// @license      MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/519838/%E5%9B%BE%E7%89%87%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/519838/%E5%9B%BE%E7%89%87%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY_SHORTCUT = 'imageHiderShortcut_v2';
    const STORAGE_KEY_GLOBAL_HIDE = 'imageHiderGlobalHideState_v2';
    const CSS_CLASS_HIDDEN = 'image-hider--hidden';
    const CSS_CLASS_OVERLAY = 'image-hider--overlay';
    const CSS_MODAL_ID = 'image-hider-modal-styles';
    const DEFAULT_SHORTCUT = {
        single: { keys: ['MouseMiddle'] },
        global: { keys: ['AltLeft', 'KeyH'] }
    };
    const DEBOUNCE_DELAY = 250;
    const THROTTLE_DELAY = 50;

    const imageStates = new Map();
    const currentPressedKeys = new Set();
    let currentHoverTarget = null;
    let configModal = null;
    let globalImageCounter = 0;
    let mutationObserver = null;

    const KEY_NAME_MAP = {
        'AltLeft': 'Alt (左)', 'AltRight': 'Alt (右)',
        'ControlLeft': 'Ctrl (左)', 'ControlRight': 'Ctrl (右)',
        'ShiftLeft': 'Shift (左)', 'ShiftRight': 'Shift (右)',
        'MetaLeft': 'Meta (左)', 'MetaRight': 'Meta (右)',
        'MouseLeft': '鼠标左键', 'MouseMiddle': '鼠标中键', 'MouseRight': '鼠标右键',
        'KeyA': 'A', 'KeyB': 'B', 'KeyC': 'C', 'KeyD': 'D', 'KeyE': 'E',
        'KeyF': 'F', 'KeyG': 'G', 'KeyH': 'H', 'KeyI': 'I', 'KeyJ': 'J',
        'KeyK': 'K', 'KeyL': 'L', 'KeyM': 'M', 'KeyN': 'N', 'KeyO': 'O',
        'KeyP': 'P', 'KeyQ': 'Q', 'KeyR': 'R', 'KeyS': 'S', 'KeyT': 'T',
        'KeyU': 'U', 'KeyV': 'V', 'KeyW': 'W', 'KeyX': 'X', 'KeyY': 'Y', 'KeyZ': 'Z',
        'Digit0': '0', 'Digit1': '1', 'Digit2': '2', 'Digit3': '3',
        'Digit4': '4', 'Digit5': '5', 'Digit6': '6', 'Digit7': '7',
        'Digit8': '8', 'Digit9': '9'
    };

    function getKeyDisplayName(code) {
        return KEY_NAME_MAP[code] || code;
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    function getShortcutConfig() {
        try {
            const savedConfig = GM_getValue(STORAGE_KEY_SHORTCUT);
            const parsed = savedConfig ? JSON.parse(savedConfig) : {};
            return {
                single: { keys: parsed?.single?.keys || DEFAULT_SHORTCUT.single.keys },
                global: { keys: parsed?.global?.keys || DEFAULT_SHORTCUT.global.keys }
            };
        } catch (error) {
            // console.error('Image Hider: Failed to get shortcut config, using defaults.', error);
            return { ...DEFAULT_SHORTCUT };
        }
    }

    function saveShortcutConfig(config) {
        try {
            GM_setValue(STORAGE_KEY_SHORTCUT, JSON.stringify(config));
        } catch (error) {
            // console.error('Image Hider: Failed to save shortcut config.', error);
            alert('保存配置时出错，请重试');
        }
    }

    function getGlobalHideState() {
        return GM_getValue(STORAGE_KEY_GLOBAL_HIDE, false);
    }

    function setGlobalHideState(state) {
        GM_setValue(STORAGE_KEY_GLOBAL_HIDE, state);
    }

    class ImageState {
        constructor(imgElement) {
            this.element = imgElement;
            this.isHidden = false;
            this.overlay = null;
            this.observers = new Set();
            this.lastToggleTime = 0;
            this.userManuallyShown = false;
            this.isProcessing = false;
        }

        cleanup() {
            this.observers.forEach(observer => observer.disconnect());
            this.observers.clear();
            if (this.overlay) {
                this.overlay.cleanup?.();
                this.overlay.remove();
                this.overlay = null;
            }
        }
    }

    function ensureImageState(imgElement) {
        if (!imgElement || !(imgElement instanceof HTMLImageElement)) return null;
        let imageId = imgElement.dataset.imageId;
        if (!imageId) {
            imageId = `img_hider_${++globalImageCounter}`;
            imgElement.dataset.imageId = imageId;
        }
        if (!imageStates.has(imageId)) {
            imageStates.set(imageId, new ImageState(imgElement));
        }
        return imageStates.get(imageId);
    }

    function createOverlay(imgElement, state) {
        if (!imgElement?.parentNode || !state) return null;

        const overlay = document.createElement('div');
        overlay.className = CSS_CLASS_OVERLAY;
        overlay.dataset.linkedImageId = imgElement.dataset.imageId;

        const updatePosition = throttle(() => {
            if (!imgElement || !imgElement.parentNode || !document.body.contains(imgElement)) {
                state.cleanup();
                imageStates.delete(imgElement.dataset.imageId);
                return;
            }
            const rect = imgElement.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0 && rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth) {
                 Object.assign(overlay.style, {
                    left: `${rect.left + window.scrollX}px`,
                    top: `${rect.top + window.scrollY}px`,
                    width: `${rect.width}px`,
                    height: `${rect.height}px`,
                });
                 if (!document.body.contains(overlay)) {
                    document.body.appendChild(overlay);
                 }
            }
        }, THROTTLE_DELAY);

        requestAnimationFrame(updatePosition);

        const intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updatePosition);
                }
            });
        }, { threshold: 0.1 });
        intersectionObserver.observe(imgElement);
        state.observers.add(intersectionObserver);

        const resizeObserver = new ResizeObserver(() => requestAnimationFrame(updatePosition));
        resizeObserver.observe(imgElement);
        state.observers.add(resizeObserver);

        const scrollHandler = () => requestAnimationFrame(updatePosition);
        window.addEventListener('scroll', scrollHandler, { passive: true, capture: true });

        overlay.addEventListener('mouseover', () => {
            currentHoverTarget = state.element;
        });
        overlay.addEventListener('mouseout', () => {
            currentHoverTarget = null;
        });
        overlay.addEventListener('mousedown', (e) => {
            if (e.button === 1) {
                e.preventDefault();
                 const shortcutConfig = getShortcutConfig();
                 if (shortcutConfig.single.keys.includes('MouseMiddle') && currentHoverTarget === state.element) {
                     currentPressedKeys.add('MouseMiddle');
                     checkShortcut();
                     currentPressedKeys.delete('MouseMiddle');
                 } else {
                    toggleImageVisibility(state.element);
                 }
            }
        });

        overlay.cleanup = () => {
            window.removeEventListener('scroll', scrollHandler, { capture: true });
        };

        document.body.appendChild(overlay);
        return overlay;
    }

    function toggleImageVisibility(imgElement, forceHide = null, isInitialAutoHide = false) {
        const state = ensureImageState(imgElement);
        if (!state || !state.element?.parentNode || !document.body.contains(state.element)) {
             if (state && imgElement?.dataset?.imageId) {
                 state.cleanup();
                 imageStates.delete(imgElement.dataset.imageId);
             }
             return;
        }

        const currentTime = Date.now();
        if (state.isProcessing || (currentTime - state.lastToggleTime < DEBOUNCE_DELAY)) {
            return;
        }

        state.isProcessing = true;
        state.lastToggleTime = currentTime;

        if (isInitialAutoHide && state.userManuallyShown) {
            state.isProcessing = false;
            return;
        }

        const shouldHide = (forceHide !== null) ? forceHide : !state.isHidden;

        if (!isInitialAutoHide && !shouldHide) {
            state.userManuallyShown = true;
        } else if (!isInitialAutoHide && shouldHide) {
             state.userManuallyShown = false;
        }

        try {
            if (shouldHide) {
                state.element.classList.add(CSS_CLASS_HIDDEN);
                if (!state.overlay) {
                    state.overlay = createOverlay(state.element, state);
                }
                 if (state.overlay && !document.body.contains(state.overlay)) {
                    document.body.appendChild(state.overlay);
                 }

            } else {
                state.element.classList.remove(CSS_CLASS_HIDDEN);
                if (state.overlay) {
                   state.cleanup();
                }
            }
            state.isHidden = shouldHide;

        } catch (error) {
            // console.error('Image Hider: Error toggling visibility for', state.element, error);
        } finally {
           setTimeout(() => {
              state.isProcessing = false;
           }, DEBOUNCE_DELAY + 50);
        }
    }

    function toggleAllImages() {
        const images = document.getElementsByTagName('img');
        const shouldHide = !getGlobalHideState();

        setGlobalHideState(shouldHide);

        requestAnimationFrame(() => {
            Array.from(images).forEach(img => {
                ensureImageState(img);
                toggleImageVisibility(img, shouldHide, false);
            });
             if (shouldHide) {
                imageStates.forEach(state => state.userManuallyShown = false);
             }
        });
    }

    function processImages(imageList, applyGlobalState) {
         Array.from(imageList).forEach(img => {
            const state = ensureImageState(img);
            if (state && applyGlobalState) {
                 if (!state.isHidden) {
                    img.classList.add(CSS_CLASS_HIDDEN);
                    toggleImageVisibility(img, true, true);
                 }
            } else if (state && !applyGlobalState && state.isHidden) {
                 toggleImageVisibility(img, false, false);
            }
         });
    }

    function initAutoHideAndObserver() {
        const globalShouldHide = getGlobalHideState();

        processImages(document.getElementsByTagName('img'), globalShouldHide);

        if (mutationObserver) mutationObserver.disconnect();

        mutationObserver = new MutationObserver((mutations) => {
            const currentGlobalHideState = getGlobalHideState();

            mutations.forEach(mutation => {
                if (mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            const newImages = [];
                            if (node.tagName === 'IMG') {
                                newImages.push(node);
                            } else if (node.querySelectorAll) {
                                newImages.push(...node.querySelectorAll('img'));
                            }
                            if (newImages.length > 0) {
                                processImages(newImages, currentGlobalHideState);
                            }
                        }
                    });
                }

                if (mutation.removedNodes.length) {
                    mutation.removedNodes.forEach(node => {
                         if (node.nodeType === Node.ELEMENT_NODE) {
                             const removedImages = [];
                             if (node.tagName === 'IMG' && node.dataset.imageId) {
                                 removedImages.push(node);
                             } else if (node.querySelectorAll) {
                                 removedImages.push(...node.querySelectorAll('img[data-image-id]'));
                             }

                             removedImages.forEach(img => {
                                 const imageId = img.dataset.imageId;
                                 if (imageId && imageStates.has(imageId)) {
                                     const state = imageStates.get(imageId);
                                     state.cleanup();
                                     imageStates.delete(imageId);
                                 }
                             });
                         }
                    });
                }

                 if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                     const imgElement = mutation.target;
                     if (imgElement.tagName === 'IMG' && getGlobalHideState()) {
                         const state = ensureImageState(imgElement);
                         if (state && !state.isHidden) {
                             imgElement.classList.add(CSS_CLASS_HIDDEN);
                             toggleImageVisibility(imgElement, true, true);
                         }
                     }
                 }

            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['src']
        });
    }


    function handleKeyDown(event) {
        const targetTagName = event.target.tagName.toLowerCase();
        if (['input', 'textarea', 'select'].includes(targetTagName) || event.target.isContentEditable) {
            return;
        }
        currentPressedKeys.add(event.code);
        checkShortcut();
    }

    function handleKeyUp(event) {
        currentPressedKeys.delete(event.code);
    }

    function handleMouseDown(event) {
        if (event.button === 1) {
             const shortcutConfig = getShortcutConfig();
             if (shortcutConfig.single.keys.includes('MouseMiddle') && currentHoverTarget) {
                event.preventDefault();
             }
            currentPressedKeys.add('MouseMiddle');
            checkShortcut();
        }
    }

    function handleMouseUp(event) {
        if (event.button === 1) {
            currentPressedKeys.delete('MouseMiddle');
        }
    }

    function handleMouseOver(event) {
        if (event.target.tagName === 'IMG') {
            currentHoverTarget = event.target;
            ensureImageState(currentHoverTarget);
        } else if (event.target.classList?.contains(CSS_CLASS_OVERLAY)) {
             const linkedImageId = event.target.dataset.linkedImageId;
             const state = linkedImageId ? imageStates.get(linkedImageId) : null;
             if (state?.element) {
                 currentHoverTarget = state.element;
             }
        }
    }

    function handleMouseOut(event) {
         if (event.target === currentHoverTarget || event.target.classList?.contains(CSS_CLASS_OVERLAY)) {
             if (!event.relatedTarget || (event.relatedTarget !== currentHoverTarget && !event.relatedTarget.classList?.contains(CSS_CLASS_OVERLAY))) {
                currentHoverTarget = null;
             }
         }
    }

    function resetStateOnUnload() {
        currentPressedKeys.clear();
        currentHoverTarget = null;
        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = null;
        }
    }

    function checkShortcut() {
        const shortcutConfig = getShortcutConfig();

        const isExactMatch = (keys) => {
            return keys.length === currentPressedKeys.size && keys.every(key => currentPressedKeys.has(key));
        }

        if (currentHoverTarget && isExactMatch(shortcutConfig.single.keys)) {
            toggleImageVisibility(currentHoverTarget);
        }

        if (isExactMatch(shortcutConfig.global.keys)) {
            toggleAllImages();
            currentPressedKeys.clear();
        }
    }


    function createConfigModal() {
         if (configModal) return;

         injectGlobalStyles();

         configModal = document.createElement('div');
         configModal.className = 'image-hider-modal';
         configModal.id = 'image-hider-config-modal';

         const currentConfig = getShortcutConfig();
         let tempSingleKeys = new Set(currentConfig.single.keys);
         let tempGlobalKeys = new Set(currentConfig.global.keys);
         let isRecording = false;
         let currentRecordingType = null;
         let recordingCleanup = null;

         function formatKeys(keys) {
             return Array.from(keys).map(getKeyDisplayName).join(' + ') || '无';
         }

         function renderModalContent() {
             const singleShortcutDisplay = formatKeys(tempSingleKeys);
             const globalShortcutDisplay = formatKeys(tempGlobalKeys);

             configModal.innerHTML = `
                <button class="close-btn" id="imageHiderCloseConfigBtn" title="关闭"></button>
                <h2>图片隐藏快捷键配置</h2>
                <div class="shortcut-section">
                    <h3>单个图片快捷键 (悬停触发)</h3>
                    <div class="current-shortcut"><strong>当前:</strong> <span id="singleCurrentDisplay">${singleShortcutDisplay}</span></div>
                    <input type="text" readonly class="shortcut-input" id="singleShortcutInput" placeholder="点击下方按钮开始录制...">
                    <div class="button-wrapper"><button id="setSingleShortcutBtn" data-type="single">设置快捷键</button></div>
                </div>
                <div class="shortcut-section">
                    <h3>全局图片快捷键 (切换所有)</h3>
                    <div class="current-shortcut"><strong>当前:</strong> <span id="globalCurrentDisplay">${globalShortcutDisplay}</span></div>
                    <input type="text" readonly class="shortcut-input" id="globalShortcutInput" placeholder="点击下方按钮开始录制...">
                    <div class="button-wrapper"><button id="setGlobalShortcutBtn" data-type="global">设置快捷键</button></div>
                </div>
                <div class="button-group"><button id="saveConfigBtn">保存设置</button></div>
                <div class="hint">说明: 录制时按下组合键，松开最后一个键完成录制。支持 Alt, Ctrl, Shift, Meta (Win/Cmd), 字母, 数字, 鼠标中键。全局状态会在页面加载时自动应用。</div>
                <div id="imageHiderSuccessMessage" class="success-message"></div>
            `;
             attachModalListeners();
         }

         function updateInputDisplay(inputElement, keysSet) {
             inputElement.value = formatKeys(keysSet);
         }

         function startRecording(type) {
             if (isRecording) return;
             const inputElement = configModal.querySelector(`#${type}ShortcutInput`);
             const buttonElement = configModal.querySelector(`#set${type.charAt(0).toUpperCase() + type.slice(1)}ShortcutBtn`);
             const keysSet = (type === 'single') ? tempSingleKeys : tempGlobalKeys;

             isRecording = true;
             currentRecordingType = type;
             keysSet.clear();

             inputElement.value = '请按下快捷键...';
             inputElement.classList.add('recording');
             buttonElement.textContent = '录制中... (松开完成)';
             buttonElement.disabled = true;

             const pressedWhileRecording = new Set();

             const keydownHandler = (e) => {
                 e.preventDefault(); e.stopPropagation();
                 const code = e.code;
                 if (!pressedWhileRecording.has(code)) {
                     pressedWhileRecording.add(code);
                     keysSet.add(code);
                     updateInputDisplay(inputElement, keysSet);
                 }
             };
             const mousedownHandler = (e) => {
                  if (e.button === 1) {
                     e.preventDefault(); e.stopPropagation();
                     const code = 'MouseMiddle';
                      if (!pressedWhileRecording.has(code)) {
                         pressedWhileRecording.add(code);
                         keysSet.add(code);
                         updateInputDisplay(inputElement, keysSet);
                     }
                  }
             };
             const stopRecordingHandler = (e) => {
                 if (pressedWhileRecording.size > 0) {
                     e.preventDefault(); e.stopPropagation();
                     finishRecording();
                 }
             };

             document.addEventListener('keydown', keydownHandler, { capture: true });
             document.addEventListener('mousedown', mousedownHandler, { capture: true });
             document.addEventListener('keyup', stopRecordingHandler, { capture: true, once: true });
             document.addEventListener('mouseup', stopRecordingHandler, { capture: true, once: true });

             recordingCleanup = () => {
                 document.removeEventListener('keydown', keydownHandler, { capture: true });
                 document.removeEventListener('mousedown', mousedownHandler, { capture: true });
                 document.removeEventListener('keyup', stopRecordingHandler, { capture: true });
                 document.removeEventListener('mouseup', stopRecordingHandler, { capture: true });
                 recordingCleanup = null;
             };
         }

         function finishRecording() {
             if (!isRecording) return;
             const type = currentRecordingType;
             const inputElement = configModal.querySelector(`#${type}ShortcutInput`);
             const buttonElement = configModal.querySelector(`#set${type.charAt(0).toUpperCase() + type.slice(1)}ShortcutBtn`);
             const keysSet = (type === 'single') ? tempSingleKeys : tempGlobalKeys;

             isRecording = false;
             currentRecordingType = null;

             inputElement.classList.remove('recording');
             buttonElement.textContent = '设置快捷键';
             buttonElement.disabled = false;
              updateInputDisplay(inputElement, keysSet);
              if (keysSet.size === 0) {
                 inputElement.value = '';
                 inputElement.placeholder = '未设置 - 点击按钮录制';
              }

             if (recordingCleanup) recordingCleanup();
         }

         function closeModal() {
             if (isRecording) finishRecording();
             if (configModal) {
                configModal.classList.add('closing');
                configModal.addEventListener('transitionend', () => {
                     configModal?.remove();
                     configModal = null;
                 }, { once: true });
             }
              document.removeEventListener('mousedown', backdropClickHandler);
         }

         function showSuccessMessage(message) {
             const msgElement = configModal?.querySelector('#imageHiderSuccessMessage');
             if (msgElement) {
                 msgElement.textContent = message;
                 msgElement.classList.add('show');
                 setTimeout(() => {
                     msgElement.classList.remove('show');
                 }, 1500);
             }
         }

         function backdropClickHandler(event) {
             if (configModal && !configModal.contains(event.target)) {
                 closeModal();
             }
         }

         function attachModalListeners() {
             configModal.querySelector('#imageHiderCloseConfigBtn').addEventListener('click', closeModal);
             configModal.querySelector('#setSingleShortcutBtn').addEventListener('click', () => startRecording('single'));
             configModal.querySelector('#setGlobalShortcutBtn').addEventListener('click', () => startRecording('global'));
             configModal.querySelector('#saveConfigBtn').addEventListener('click', () => {
                 if (isRecording) finishRecording();
                 const newConfig = {
                     single: { keys: Array.from(tempSingleKeys) },
                     global: { keys: Array.from(tempGlobalKeys) }
                 };
                 saveShortcutConfig(newConfig);
                 configModal.querySelector('#singleCurrentDisplay').textContent = formatKeys(tempSingleKeys);
                 configModal.querySelector('#globalCurrentDisplay').textContent = formatKeys(tempGlobalKeys);
                 showSuccessMessage('设置已保存！');
             });
             setTimeout(() => { document.addEventListener('mousedown', backdropClickHandler); }, 0);
         }

         renderModalContent();
         document.body.appendChild(configModal);
         requestAnimationFrame(() => { configModal.style.opacity = '1'; });
     }

    function injectGlobalStyles() {
        if (document.getElementById(CSS_MODAL_ID)) return;
        GM_addStyle(`
            .${CSS_CLASS_HIDDEN} { opacity: 0 !important; pointer-events: none !important; transition: opacity 0.2s ease !important; }
            .${CSS_CLASS_OVERLAY} { position: absolute; background-color: transparent; border: 1px dashed rgba(128, 128, 128, 0.3); cursor: pointer; pointer-events: auto; z-index: 9998; box-sizing: border-box; }
            .image-hider-modal { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: #fff; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.2); padding: 28px; z-index: 10000; width: 90%; max-width: 480px; max-height: 85vh; overflow-y: auto; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; opacity: 0; transition: opacity 0.25s ease-out, transform 0.25s ease-out; box-sizing: border-box; }
            .image-hider-modal.closing { opacity: 0; transform: translate(-50%, -45%); transition: opacity 0.2s ease-in, transform 0.2s ease-in; }
            .image-hider-modal * { box-sizing: border-box; }
            .image-hider-modal h2 { color: #333; margin: 0 0 24px 0; font-size: 1.4em; font-weight: 600; text-align: center; }
            .image-hider-modal .shortcut-section { background: #f7f7f7; border-radius: 8px; padding: 16px; margin-bottom: 20px; border: 1px solid #eee; }
            .image-hider-modal .shortcut-section h3 { color: #444; margin: 0 0 12px 0; font-size: 1.1em; font-weight: 500; }
            .image-hider-modal .current-shortcut { background-color: #fff; padding: 10px 14px; margin-bottom: 12px; border-radius: 6px; border: 1px solid #e0e0e0; color: #555; font-size: 0.95em; min-height: 40px; display: flex; align-items: center; }
            .image-hider-modal .current-shortcut strong { margin-right: 8px; }
            .image-hider-modal .shortcut-input { width: 100%; height: 40px; padding: 8px 12px; margin: 8px 0 12px 0; border: 1px solid #ccc; border-radius: 6px; font-size: 1em; text-align: center; background: #fff; color: #333; transition: border-color 0.2s, box-shadow 0.2s; }
            .image-hider-modal .shortcut-input:focus, .image-hider-modal .shortcut-input.recording { border-color: #4CAF50; outline: none; box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2); }
            .image-hider-modal .shortcut-input.recording { background: #e8f5e9; }
            .image-hider-modal .shortcut-input::placeholder { color: #999; }
            .image-hider-modal .button-wrapper { display: flex; justify-content: center; }
            .image-hider-modal button { padding: 9px 18px; border-radius: 6px; border: 1px solid transparent; cursor: pointer; font-size: 0.95em; font-weight: 500; transition: background-color 0.2s, border-color 0.2s, color 0.2s; min-width: 110px; height: 38px; line-height: 1.5; display: inline-flex; align-items: center; justify-content: center; margin: 0; }
            .image-hider-modal button:disabled { cursor: not-allowed; opacity: 0.7; }
            .image-hider-modal #setSingleShortcutBtn, .image-hider-modal #setGlobalShortcutBtn { background-color: #f0f0f0; color: #333; border-color: #ccc; width: auto; }
            .image-hider-modal #setSingleShortcutBtn:hover:not(:disabled), .image-hider-modal #setGlobalShortcutBtn:hover:not(:disabled) { background-color: #e0e0e0; border-color: #bbb; }
            .image-hider-modal .button-group { display: flex; gap: 12px; margin-top: 24px; justify-content: center; }
            .image-hider-modal #saveConfigBtn { background-color: #4CAF50; color: white; min-width: 140px; font-size: 1em; }
            .image-hider-modal #saveConfigBtn:hover { background-color: #45a049; }
            .image-hider-modal .close-btn { position: absolute; right: 12px; top: 12px; width: 30px; height: 30px; border-radius: 50%; background: #f1f1f1; border: none; cursor: pointer; transition: background-color 0.2s, transform 0.2s; padding: 0; min-width: auto; display: flex; align-items: center; justify-content: center; color: #666; }
            .image-hider-modal .close-btn:hover { background: #e0e0e0; transform: rotate(90deg); }
            .image-hider-modal .close-btn::before, .image-hider-modal .close-btn::after { content: ''; position: absolute; width: 14px; height: 2px; background: currentColor; border-radius: 1px; }
            .image-hider-modal .close-btn::before { transform: rotate(45deg); }
            .image-hider-modal .close-btn::after { transform: rotate(-45deg); }
            .image-hider-modal .hint { color: #666; font-size: 0.85em; margin-top: 20px; line-height: 1.5; padding: 12px; background: #f9f9f9; border-radius: 6px; border: 1px solid #eee; }
            .image-hider-modal .success-message { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(76, 175, 80, 0.9); color: white; padding: 10px 20px; border-radius: 6px; font-weight: 500; opacity: 0; transition: opacity 0.3s ease; pointer-events: none; z-index: 10001; }
            .image-hider-modal .success-message.show { opacity: 1; }
        `);
        const styleElement = document.querySelector(`style[id="${CSS_MODAL_ID}"]`);
        if (styleElement) styleElement.id = CSS_MODAL_ID;
    }

    function initialize() {
        injectGlobalStyles();
        document.addEventListener('keydown', handleKeyDown, { capture: true });
        document.addEventListener('keyup', handleKeyUp, { capture: true });
        document.addEventListener('mousedown', handleMouseDown, { capture: true });
        document.addEventListener('mouseup', handleMouseUp, { capture: true });
        document.addEventListener('mouseover', handleMouseOver, { capture: false });
        document.addEventListener('mouseout', handleMouseOut, { capture: false });
        window.addEventListener('beforeunload', resetStateOnUnload);
        window.addEventListener('blur', () => currentPressedKeys.clear());
        GM_registerMenuCommand('配置快捷键', createConfigModal);
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAutoHideAndObserver);
        } else {
            initAutoHideAndObserver();
        }
    }

    initialize();

})();