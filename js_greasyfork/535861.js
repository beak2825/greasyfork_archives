// ==UserScript==
// @name         Manga Translator (Gemini) - Contextual Manga Title
// @namespace    http://tampermonkey.net/
// @version      2.03.20250528_STATUS_ICON_FIX
// @description  Translate manga with Gemini, using detailed English prompt, configurable model, target language, manga title context, adjustable text box style (%), per-box font size controls, and configurable default font size. Status icon fix.
// @author       Your Name (Improved by AI)
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      generativelanguage.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/535861/Manga%20Translator%20%28Gemini%29%20-%20Contextual%20Manga%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/535861/Manga%20Translator%20%28Gemini%29%20-%20Contextual%20Manga%20Title.meta.js
// ==/UserScript==

;(function () {
  'use strict'

  const SCRIPT_PREFIX = 'manga_translator_'
  const SCRIPT_VERSION = '2.03.20250528_STATUS_ICON_FIX'

  // --- Configuration Constants ---
  const MIN_IMAGE_DIMENSION = 600
  const GEMINI_API_KEY_STORAGE = SCRIPT_PREFIX + 'gemini_api_key'
  const DEFAULT_GEMINI_MODEL = 'gemini-1.5-flash-latest'
  const GEMINI_MODEL_STORAGE_KEY = SCRIPT_PREFIX + 'gemini_model'
  const DEFAULT_MANGA_TITLE = ''
  const MANGA_TITLE_STORAGE_KEY = SCRIPT_PREFIX + 'manga_title'

  const TARGET_LANGUAGE_STORAGE_KEY = SCRIPT_PREFIX + 'target_language';
  const DEFAULT_TARGET_LANGUAGE_CODE = 'en';
  const AVAILABLE_LANGUAGES = {
      'en': 'English', 'vi': 'Vietnamese', 'ja': '日本語 (Japanese)', 'ko': '한국어 (Korean)',
      'zh-CN': '中文 (简体 - Simplified Chinese)', 'zh-TW': '中文 (繁體 - Traditional Chinese)',
      'fr': 'Français (French)', 'de': 'Deutsch (German)', 'es': 'Español (Spanish)', 'ru': 'Русский (Russian)',
  };
  const DEFAULT_TARGET_LANGUAGE_NAME = AVAILABLE_LANGUAGES[DEFAULT_TARGET_LANGUAGE_CODE];

  const GEMINI_TARGET_PROCESSING_DIMENSION = 768
  const IMAGE_RESIZE_QUALITY = 0.9
  const ABSOLUTE_MIN_RESIZE_DIMENSION = 30

  const BORDER_RADIUS_STORAGE_KEY = SCRIPT_PREFIX + 'bbox_border_radius';
  const DEFAULT_BORDER_RADIUS = '15%';

  const DEFAULT_INITIAL_FONT_SIZE_STORAGE_KEY = SCRIPT_PREFIX + 'default_initial_font_size';
  const DEFAULT_INITIAL_FONT_SIZE_VALUE = '16px';

  const FONT_SIZE_ADJUST_STEP = 1;
  const LOCAL_MIN_FONT_SIZE_PX = 8;
  const LOCAL_MAX_FONT_SIZE_PX = 32;


  // --- Prompt Template (English) ---
  const GEMINI_PROMPT_TEMPLATE = `
You are provided with a manga image of size \${imageProcessedWidth}x\${imageProcessedHeight} pixels.

**Additional Context:**
* Manga Title: \${mangaTitle}
* Target Language for Translation: \${targetLanguageName}

**Task:**

1.  **Identify Speech Bubbles:** Accurately locate all "speech bubbles" (including dialogue, thought bubbles, etc.) in the image.
2.  **Extract Text:** For each identified speech bubble, extract all the original text within it.
3.  **Translate to \${targetLanguageName}:** Translate the extracted text into \${targetLanguageName}. Aim for a natural style appropriate for manga dialogue, considering the manga title and target language.
4.  **Output Data:** Return the result as a JSON array. Each element in the array is an object with the following structure:
    * \`"text"\`: (string) Text translated into \${targetLanguageName}.
    * \`"bbox"\`: (object) Bounding box of the "speech bubble", with values as **floats from 0.0 to 1.0**, representing percentages of the provided image's full dimensions.
        * \`"x_ratio"\`: (float) X-coordinate of the top-left corner, as a ratio of the image width (e.g., 0.05 means 5% from the left edge).
        * \`"y_ratio"\`: (float) Y-coordinate of the top-left corner, as a ratio of the image height (e.g., 0.10 means 10% from the top edge).
        * \`"width_ratio"\`: (float) Width of the bounding box, as a ratio of the image width (e.g., 0.25 means 25% of image width).
        * \`"height_ratio"\`: (float) Height of the bounding box, as a ratio of the image height (e.g., 0.15 means 15% of image height).

**Bounding Box Notes (Important):**

* The values within \`"bbox"\` (\`"x_ratio"\`, \`"y_ratio"\`, \`"width_ratio"\`, \`"height_ratio"\`) **MUST BE FLOATS** between 0.0 and 1.0.
* These ratios must correspond to the dimensions of the provided image (\${imageProcessedWidth}x\${imageProcessedHeight} pixels).

**Case: No Speech Bubbles Found:**

If no speech bubbles are found in the image, return an empty JSON array: \`[]\`.
`

  let activeImageTarget = null
  let translateIconElement = null

  let isDragging = false, activeDraggableBox = null, dragOffsetX = 0, dragOffsetY = 0;
  let isResizing = false, activeResizeBox = null, activeResizeHandle = null;
  let initialResizeMouseX = 0, initialResizeMouseY = 0, initialResizeBoxWidth = 0, initialResizeBoxHeight = 0;
  let minResizeWidth = 0, minResizeHeight = 0, maxResizeWidth = 0, maxResizeHeight = 0;

  let isAdjustingBorderRadius = false, activeBorderRadiusBoxBg = null;
  let initialBorderRadiusMouseX = 0, initialBorderRadiusValue = 0;


  const style = document.createElement('style')
  style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=Patrick+Hand&family=Comic+Neue:wght@400;700&display=swap');
        .${SCRIPT_PREFIX}translate_icon {
            position: absolute; top: 10px; right: 10px; background-color: rgba(0,0,0,0.75); color: white;
            padding: 6px 10px; border-radius: 5px; cursor: pointer; font-family: Arial, sans-serif;
            font-size: 13px; z-index: 100000; border: 1px solid rgba(255,255,255,0.5);
            box-shadow: 0 1px 3px rgba(0,0,0,0.3); transition: background-color 0.2s, border-color 0.2s;
        }
        .${SCRIPT_PREFIX}translate_icon:hover { background-color: rgba(0,0,0,0.9); border-color: white; }
        .${SCRIPT_PREFIX}translate_icon.processing, .${SCRIPT_PREFIX}translate_icon.error { cursor: wait !important; background-color: #d35400; }
        .${SCRIPT_PREFIX}translate_icon.success { background-color: #27ae60; }
        .${SCRIPT_PREFIX}overlay_container { position: absolute; pointer-events: none; overflow: hidden; z-index: 9999; }

        .${SCRIPT_PREFIX}bbox {
            position: absolute; box-sizing: border-box; pointer-events: all !important; cursor: grab;
        }
        .${SCRIPT_PREFIX}text_actual_bg {
            position: absolute; inset: 0; background: white;
            box-shadow: 0 0 2px 1.5px white, 0 0 3px 3px white;
            border-radius: ${DEFAULT_BORDER_RADIUS};
            z-index: 1; pointer-events: none;
        }
        .${SCRIPT_PREFIX}text_display {
            position: relative; z-index: 2; width: 100%; height: 100%;
            display: flex; align-items: center; justify-content: center;
            font-family: "Patrick Hand", "Comic Neue", cursive, sans-serif;
            font-size: var(--current-font-size, ${DEFAULT_INITIAL_FONT_SIZE_VALUE});
            font-weight: 400; text-align: center; color: black;
            overflow: hidden; padding: 2px 4px; box-sizing: border-box;
            line-height: 1.15; letter-spacing: -0.03em; pointer-events: none;
        }
        .${SCRIPT_PREFIX}bbox_dragging { cursor: grabbing !important; opacity: 0.85; z-index: 100001 !important; user-select: none; }

        .${SCRIPT_PREFIX}resize_handle {
            position: absolute; width: 20px; height: 20px; background-color: rgba(0,100,255,0.6);
            border: 1px solid rgba(255,255,255,0.8); border-radius: 3px; z-index: 3;
            pointer-events: all; opacity: 0; visibility: hidden;
            transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
        }
        .${SCRIPT_PREFIX}bbox:hover .${SCRIPT_PREFIX}resize_handle, .${SCRIPT_PREFIX}resize_handle_active {
            opacity: 1; visibility: visible;
        }
        .${SCRIPT_PREFIX}resize_handle_br { bottom: -1px; right: -1px; cursor: nwse-resize; }

        .${SCRIPT_PREFIX}border_radius_handle {
            position: absolute; width: 16px; height: 16px; background-color: rgba(255, 80, 80, 0.7);
            border: 1px solid rgba(255,255,255,0.9); border-radius: 50%;
            cursor: ew-resize; z-index: 3; top: -2px; left: -2px;
            pointer-events: all; opacity: 0; visibility: hidden;
            transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
        }
        .${SCRIPT_PREFIX}bbox:hover .${SCRIPT_PREFIX}border_radius_handle, .${SCRIPT_PREFIX}border_radius_handle_active {
            opacity: 1; visibility: visible;
        }

        .${SCRIPT_PREFIX}font_size_button {
            position: absolute;
            width: 12px; height: 12px;
            background-color: rgba(100, 100, 255, 0.7);
            border: 1px solid rgba(255,255,255,0.8);
            border-radius: 2px;
            color: white; font-size: 10px; font-weight: bold;
            line-height: 10px; text-align: center;
            cursor: pointer; z-index: 3; pointer-events: all;
            opacity: 0; visibility: hidden;
            transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
            user-select: none;
        }
        .${SCRIPT_PREFIX}bbox:hover .${SCRIPT_PREFIX}font_size_button {
            opacity: 1; visibility: visible;
        }
        .${SCRIPT_PREFIX}font_size_minus_button { top: -2px; left: 20px; }
        .${SCRIPT_PREFIX}font_size_plus_button { top: -2px; left: 35px; }
    `
  document.head.appendChild(style)

  function showTemporaryMessageOnIcon(icon, message, isError = false, duration = 3500) {
    if (!icon) return
    const originalText = icon.dataset.originalText || 'Translate'
    icon.textContent = message
    icon.classList.remove('success', 'error', 'processing')
    if (isError) icon.classList.add('error')
    else icon.classList.add('processing') // Keep .processing class if it's a status message
    setTimeout(() => {
      if (icon.textContent === message) { // Only revert if message hasn't changed
        icon.textContent = originalText
        icon.classList.remove('success', 'error', 'processing') // Clear all status if reverting to original
      }
    }, duration)
  }

  // --- Settings Functions ---
  function promptAndSetApiKey() {
    const currentKey = GM_getValue(GEMINI_API_KEY_STORAGE, '')
    const apiKey = prompt('Please enter your Google AI Gemini API Key:', currentKey)
    if (apiKey !== null) {
      GM_setValue(GEMINI_API_KEY_STORAGE, apiKey)
      const effectiveIcon = translateIconElement || document.body.appendChild(document.createElement('div'))
      showTemporaryMessageOnIcon(effectiveIcon, apiKey ? 'API Key saved!' : 'API Key cleared!', false, 2000)
      if (effectiveIcon.parentNode === document.body && !translateIconElement) document.body.removeChild(effectiveIcon)
    }
  }
  GM_registerMenuCommand('Set/Update Gemini API Key', promptAndSetApiKey)

  function getGeminiApiKey(iconForMessages) {
    const apiKey = GM_getValue(GEMINI_API_KEY_STORAGE)
    if (!apiKey) {
      const msgTarget = iconForMessages || document.body.appendChild(document.createElement('div'))
      showTemporaryMessageOnIcon(msgTarget, 'API Key not set! Open script menu to set it.', true, 5000)
      if (msgTarget.parentNode === document.body && !iconForMessages) document.body.removeChild(msgTarget)
    }
    return apiKey
  }

  function promptAndSetGeminiModel() {
    const currentModel = GM_getValue(GEMINI_MODEL_STORAGE_KEY, DEFAULT_GEMINI_MODEL)
    const newModel = prompt(`Enter Gemini Model name (e.g., ${DEFAULT_GEMINI_MODEL}):`, currentModel)
    if (newModel !== null) {
      GM_setValue(GEMINI_MODEL_STORAGE_KEY, newModel.trim())
      const effectiveIcon = translateIconElement || document.body.appendChild(document.createElement('div'))
      showTemporaryMessageOnIcon(effectiveIcon, `Model set to: ${newModel.trim() || DEFAULT_GEMINI_MODEL}`, false, 3000)
      if (effectiveIcon.parentNode === document.body && !translateIconElement) document.body.removeChild(effectiveIcon)
    }
  }
  GM_registerMenuCommand('Set/Update Gemini Model', promptAndSetGeminiModel)

  function getGeminiModelName() {
    return GM_getValue(GEMINI_MODEL_STORAGE_KEY, DEFAULT_GEMINI_MODEL) || DEFAULT_GEMINI_MODEL
  }

  function promptAndSetMangaTitle() {
    const currentTitle = GM_getValue(MANGA_TITLE_STORAGE_KEY, DEFAULT_MANGA_TITLE)
    const newTitle = prompt('Enter manga title (leave blank if none):', currentTitle)
    if (newTitle !== null) {
      GM_setValue(MANGA_TITLE_STORAGE_KEY, newTitle.trim())
      const effectiveIcon = translateIconElement || document.body.appendChild(document.createElement('div'))
      showTemporaryMessageOnIcon(effectiveIcon, `Manga title set to: ${newTitle.trim() || 'None'}`, false, 3000)
      if (effectiveIcon.parentNode === document.body && !translateIconElement) document.body.removeChild(effectiveIcon)
    }
  }
  GM_registerMenuCommand('Set/Update Manga Title', promptAndSetMangaTitle)

  function getMangaTitle() {
    return GM_getValue(MANGA_TITLE_STORAGE_KEY, DEFAULT_MANGA_TITLE) || DEFAULT_MANGA_TITLE
  }

  function getTargetLanguageCode() {
    return GM_getValue(TARGET_LANGUAGE_STORAGE_KEY, DEFAULT_TARGET_LANGUAGE_CODE);
  }

  function getTargetLanguageName() {
      const code = getTargetLanguageCode();
      return AVAILABLE_LANGUAGES[code] || DEFAULT_TARGET_LANGUAGE_NAME;
  }

  function promptAndSetTargetLanguage() {
      const currentLangCode = getTargetLanguageCode();
      const currentLangName = AVAILABLE_LANGUAGES[currentLangCode] || 'Unknown';
      let promptMessage = 'Select target language (Enter code):\n';
      for (const code in AVAILABLE_LANGUAGES) { promptMessage += `\n- ${AVAILABLE_LANGUAGES[code]}: "${code}"`; }
      promptMessage += `\n\nCurrent language: ${currentLangName} (${currentLangCode}).`;
      const newLangCodeInput = prompt(promptMessage, currentLangCode);
      if (newLangCodeInput !== null) {
          const normalizedNewLangCode = newLangCodeInput.trim().toLowerCase();
          const effectiveIcon = translateIconElement || document.body.appendChild(document.createElement('div'));
          if (AVAILABLE_LANGUAGES[normalizedNewLangCode]) {
              GM_setValue(TARGET_LANGUAGE_STORAGE_KEY, normalizedNewLangCode);
              showTemporaryMessageOnIcon(effectiveIcon, `Language changed to: ${AVAILABLE_LANGUAGES[normalizedNewLangCode]}`, false, 3000);
          } else if (newLangCodeInput.trim() === "" && AVAILABLE_LANGUAGES[DEFAULT_TARGET_LANGUAGE_CODE]) {
              GM_setValue(TARGET_LANGUAGE_STORAGE_KEY, DEFAULT_TARGET_LANGUAGE_CODE);
              showTemporaryMessageOnIcon(effectiveIcon, `Language reset to: ${DEFAULT_TARGET_LANGUAGE_NAME}`, false, 3000);
          } else {
              showTemporaryMessageOnIcon(effectiveIcon, `Invalid language code "${newLangCodeInput.trim()}".`, true, 3000);
          }
          if (effectiveIcon.parentNode === document.body && !translateIconElement) document.body.removeChild(effectiveIcon);
      }
  }
  GM_registerMenuCommand('Select Target Language', promptAndSetTargetLanguage);

  function resetBorderRadiusToDefault() {
    GM_setValue(BORDER_RADIUS_STORAGE_KEY, DEFAULT_BORDER_RADIUS);
    const allTextBgs = document.querySelectorAll(`.${SCRIPT_PREFIX}text_actual_bg`);
    allTextBgs.forEach(bg => { bg.style.borderRadius = DEFAULT_BORDER_RADIUS; });
    const effectiveIcon = translateIconElement || document.body.appendChild(document.createElement('div'));
    showTemporaryMessageOnIcon(effectiveIcon, `Border radius reset to ${DEFAULT_BORDER_RADIUS} and applied.`, false, 3000);
    if (effectiveIcon.parentNode === document.body && !translateIconElement) document.body.removeChild(effectiveIcon);
  }
  GM_registerMenuCommand('Reset Border Radius', resetBorderRadiusToDefault);

  function getConfiguredInitialFontSize() {
      return GM_getValue(DEFAULT_INITIAL_FONT_SIZE_STORAGE_KEY, DEFAULT_INITIAL_FONT_SIZE_VALUE);
  }

  function promptAndSetDefaultInitialFontSize() {
      const currentDefault = getConfiguredInitialFontSize();
      const newDefaultInput = prompt(
          `Enter the default font size for new translation boxes (in pixels, e.g., 14, 16, 18).\nMin: ${LOCAL_MIN_FONT_SIZE_PX}px, Max: ${LOCAL_MAX_FONT_SIZE_PX}px.\nCurrent default: ${currentDefault}`,
          parseFloat(currentDefault)
      );

      if (newDefaultInput !== null) {
          let newDefaultPx = parseFloat(newDefaultInput);
          const effectiveIcon = translateIconElement || document.body.appendChild(document.createElement('div'));

          if (isNaN(newDefaultPx)) {
              showTemporaryMessageOnIcon(effectiveIcon, `Invalid input. Please enter a number.`, true, 3000);
          } else {
              newDefaultPx = Math.max(LOCAL_MIN_FONT_SIZE_PX, Math.min(newDefaultPx, LOCAL_MAX_FONT_SIZE_PX));
              const newDefaultString = `${newDefaultPx}px`;
              GM_setValue(DEFAULT_INITIAL_FONT_SIZE_STORAGE_KEY, newDefaultString);
              showTemporaryMessageOnIcon(effectiveIcon, `Default font size set to: ${newDefaultString}. New boxes will use this.`, false, 3500);
          }
          if (effectiveIcon.parentNode === document.body && !translateIconElement) {
              document.body.removeChild(effectiveIcon);
          }
      }
  }
  GM_registerMenuCommand('Set Default Text Font Size', promptAndSetDefaultInitialFontSize);


  function onFontSizeAdjustClick(event) {
      event.stopPropagation();
      const adjustment = parseInt(this.dataset.adjustment, 10);
      const bboxDiv = this.closest(`.${SCRIPT_PREFIX}bbox`);
      if (!bboxDiv) return;

      let currentSizeString = bboxDiv.style.getPropertyValue('--current-font-size');
      if (!currentSizeString) {
          currentSizeString = getConfiguredInitialFontSize();
      }
      let currentSizePx = parseFloat(currentSizeString);

      currentSizePx += adjustment * FONT_SIZE_ADJUST_STEP;
      currentSizePx = Math.max(LOCAL_MIN_FONT_SIZE_PX, Math.min(currentSizePx, LOCAL_MAX_FONT_SIZE_PX));

      bboxDiv.style.setProperty('--current-font-size', `${currentSizePx}px`);
  }

  function resetAllVisibleBboxFontSizes() {
      const newDefaultFontSize = getConfiguredInitialFontSize();
      const allBboxDivs = document.querySelectorAll(`.${SCRIPT_PREFIX}bbox`);
      allBboxDivs.forEach(bbox => {
          bbox.style.setProperty('--current-font-size', newDefaultFontSize);
      });
      const effectiveIcon = translateIconElement || document.body.appendChild(document.createElement('div'));
      showTemporaryMessageOnIcon(
          effectiveIcon,
          `Font size for all current boxes reset to default: ${newDefaultFontSize}.`,
          false,
          3000
      );
      if (effectiveIcon.parentNode === document.body && !translateIconElement) {
          document.body.removeChild(effectiveIcon);
      }
  }
  GM_registerMenuCommand('Reset All Current Font Sizes', resetAllVisibleBboxFontSizes);


  // --- Drag, Resize, Border Radius, Font Size Handlers ---
  function onDragStart(event) {
    if (event.target.classList.contains(`${SCRIPT_PREFIX}resize_handle`) ||
        event.target.classList.contains(`${SCRIPT_PREFIX}border_radius_handle`) ||
        event.target.classList.contains(`${SCRIPT_PREFIX}font_size_button`) ||
        event.button !== 0) return;
    activeDraggableBox = this; isDragging = true;
    const parentRect = activeDraggableBox.parentNode.getBoundingClientRect();
    const boxRect = activeDraggableBox.getBoundingClientRect();
    dragOffsetX = event.clientX - (boxRect.left - parentRect.left);
    dragOffsetY = event.clientY - (boxRect.top - parentRect.top);
    activeDraggableBox.classList.add(`${SCRIPT_PREFIX}bbox_dragging`);
    document.addEventListener('mousemove', onDragMove);
    document.addEventListener('mouseup', onDragEnd);
    document.addEventListener('mouseleave', onDocumentMouseLeave);
    event.preventDefault();
  }
  function onDragMove(event) {
    if (!isDragging || !activeDraggableBox) return; event.preventDefault();
    const parent = activeDraggableBox.parentNode;
    if (!parent || !(parent instanceof HTMLElement)) return;
    let newX_px = event.clientX - dragOffsetX, newY_px = event.clientY - dragOffsetY;
    const maxX_px = parent.offsetWidth - activeDraggableBox.offsetWidth;
    const maxY_px = parent.offsetHeight - activeDraggableBox.offsetHeight;
    newX_px = Math.max(0, Math.min(newX_px, maxX_px)); newY_px = Math.max(0, Math.min(newY_px, maxY_px));
    activeDraggableBox.style.left = (newX_px / parent.offsetWidth) * 100 + '%';
    activeDraggableBox.style.top = (newY_px / parent.offsetHeight) * 100 + '%';
  }
  function onDragEnd() {
    if (!isDragging) return; isDragging = false;
    if (activeDraggableBox) activeDraggableBox.classList.remove(`${SCRIPT_PREFIX}bbox_dragging`);
    activeDraggableBox = null;
    document.removeEventListener('mousemove', onDragMove);
    document.removeEventListener('mouseup', onDragEnd);
    document.removeEventListener('mouseleave', onDocumentMouseLeave);
  }
  function onResizeStart(event) {
    if (event.button !== 0) return; event.stopPropagation(); event.preventDefault();
    activeResizeHandle = this; activeResizeBox = this.parentNode; isResizing = true;
    initialResizeMouseX = event.clientX; initialResizeMouseY = event.clientY;
    initialResizeBoxWidth = activeResizeBox.offsetWidth; initialResizeBoxHeight = activeResizeBox.offsetHeight;
    minResizeWidth = initialResizeBoxWidth * 0.2; minResizeHeight = initialResizeBoxHeight * 0.2;
    maxResizeWidth = initialResizeBoxWidth * 2.5; maxResizeHeight = initialResizeBoxHeight * 2.5;
    activeResizeBox.classList.add(`${SCRIPT_PREFIX}bbox_dragging`);
    activeResizeHandle.classList.add(`${SCRIPT_PREFIX}resize_handle_active`);
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('mouseup', onResizeEnd);
    document.addEventListener('mouseleave', onDocumentMouseLeave);
  }
  function onResizeMove(event) {
    if (!isResizing || !activeResizeBox) return; event.preventDefault();
    const deltaX = event.clientX - initialResizeMouseX, deltaY = event.clientY - initialResizeMouseY;
    let newWidth_px = initialResizeBoxWidth + deltaX, newHeight_px = initialResizeBoxHeight + deltaY;
    newWidth_px = Math.max(minResizeWidth, Math.min(newWidth_px, maxResizeWidth));
    newHeight_px = Math.max(minResizeHeight, Math.min(newHeight_px, maxResizeHeight));
    const parentOverlay = activeResizeBox.parentNode;
    if (parentOverlay && parentOverlay instanceof HTMLElement) {
      const currentLeftPercent = parseFloat(activeResizeBox.style.left || 0);
      const currentTopPercent = parseFloat(activeResizeBox.style.top || 0);
      const currentLeftPx = (currentLeftPercent / 100) * parentOverlay.offsetWidth;
      const currentTopPx = (currentTopPercent / 100) * parentOverlay.offsetHeight;
      newWidth_px = Math.min(newWidth_px, parentOverlay.offsetWidth - currentLeftPx);
      newHeight_px = Math.min(newHeight_px, parentOverlay.offsetHeight - currentTopPx);
    }
    newWidth_px = Math.max(ABSOLUTE_MIN_RESIZE_DIMENSION, newWidth_px);
    newHeight_px = Math.max(ABSOLUTE_MIN_RESIZE_DIMENSION, newHeight_px);
    activeResizeBox.style.width = (newWidth_px / parentOverlay.offsetWidth) * 100 + '%';
    activeResizeBox.style.height = (newHeight_px / parentOverlay.offsetHeight) * 100 + '%';
  }
  function onResizeEnd() {
    if (!isResizing) return; isResizing = false;
    if (activeResizeBox) activeResizeBox.classList.remove(`${SCRIPT_PREFIX}bbox_dragging`);
    if (activeResizeHandle) activeResizeHandle.classList.remove(`${SCRIPT_PREFIX}resize_handle_active`);
    activeResizeBox = null; activeResizeHandle = null;
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
    document.removeEventListener('mouseleave', onDocumentMouseLeave);
  }
  function onBorderRadiusHandleMouseDown(event) {
    if (event.button !== 0) return; event.stopPropagation(); event.preventDefault();
    isAdjustingBorderRadius = true;
    activeBorderRadiusBoxBg = this.parentNode.querySelector(`.${SCRIPT_PREFIX}text_actual_bg`);
    if (!activeBorderRadiusBoxBg) return;
    initialBorderRadiusMouseX = event.clientX;
    const currentRadiusStyle = activeBorderRadiusBoxBg.style.borderRadius || GM_getValue(BORDER_RADIUS_STORAGE_KEY, DEFAULT_BORDER_RADIUS);
    initialBorderRadiusValue = parseFloat(currentRadiusStyle) || parseFloat(DEFAULT_BORDER_RADIUS) || 0;
    this.classList.add(`${SCRIPT_PREFIX}border_radius_handle_active`);
    document.addEventListener('mousemove', onBorderRadiusHandleMouseMove);
    document.addEventListener('mouseup', onBorderRadiusHandleMouseUp);
    document.addEventListener('mouseleave', onDocumentMouseLeave);
  }
  function onBorderRadiusHandleMouseMove(event) {
    if (!isAdjustingBorderRadius || !activeBorderRadiusBoxBg) return; event.preventDefault();
    const deltaX = event.clientX - initialBorderRadiusMouseX;
    let newRadiusPercent = initialBorderRadiusValue + deltaX * 0.1;
    newRadiusPercent = Math.max(0, Math.min(newRadiusPercent, 50));
    activeBorderRadiusBoxBg.style.borderRadius = `${newRadiusPercent.toFixed(1)}%`;
  }
  function onBorderRadiusHandleMouseUp() {
    if (!isAdjustingBorderRadius) return;
    if (activeBorderRadiusBoxBg && activeBorderRadiusBoxBg.parentNode) {
        const handle = activeBorderRadiusBoxBg.parentNode.querySelector(`.${SCRIPT_PREFIX}border_radius_handle_active`);
        if (handle) handle.classList.remove(`${SCRIPT_PREFIX}border_radius_handle_active`);
        GM_setValue(BORDER_RADIUS_STORAGE_KEY, activeBorderRadiusBoxBg.style.borderRadius);
    }
    isAdjustingBorderRadius = false; activeBorderRadiusBoxBg = null;
    document.removeEventListener('mousemove', onBorderRadiusHandleMouseMove);
    document.removeEventListener('mouseup', onBorderRadiusHandleMouseUp);
    document.removeEventListener('mouseleave', onDocumentMouseLeave);
  }
  function onDocumentMouseLeave(event) {
    if (isDragging) onDragEnd();
    if (isResizing) onResizeEnd();
    if (isAdjustingBorderRadius) onBorderRadiusHandleMouseUp();
  }

  // --- Core Logic & Display ---
  function removeAllOverlays(imgElement) {
    const parentNode = imgElement.parentNode;
    if (parentNode) {
      const existingContainers = parentNode.querySelectorAll(`.${SCRIPT_PREFIX}overlay_container[data-target-img-src="${imgElement.src}"]`);
      existingContainers.forEach((container) => container.remove());
    }
  }
  async function getImageData(imageUrl) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({ method: 'GET', url: imageUrl, responseType: 'blob',
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            const blob = response.response; const reader = new FileReader();
            reader.onloadend = () => resolve({ dataUrl: reader.result, base64Content: reader.result.split(',')[1], mimeType: blob.type || 'image/jpeg' });
            reader.onerror = (err) => reject(new Error('FileReader error: ' + err.toString()));
            reader.readAsDataURL(blob);
          } else reject(new Error(`Fetch failed: ${response.status} ${response.statusText}`));
        },
        onerror: (err) => reject(new Error(`GM_xhr error: ${err.statusText || 'Network error'}`)),
        ontimeout: () => reject(new Error('GM_xhr timeout fetching image.')),
      });
    });
  }
  async function preprocessImage(originalDataUrl, originalWidth, originalHeight, targetMaxDimension, targetMimeType) {
    return new Promise((resolve, reject) => {
      if (originalWidth <= targetMaxDimension && originalHeight <= targetMaxDimension) {
        resolve({ base64Data: originalDataUrl.split(',')[1], processedWidth: originalWidth, processedHeight: originalHeight, mimeTypeToUse: targetMimeType }); return;
      }
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(targetMaxDimension / originalWidth, targetMaxDimension / originalHeight);
        const resizedWidth = Math.floor(originalWidth * ratio), resizedHeight = Math.floor(originalHeight * ratio);
        const canvas = document.createElement('canvas'); canvas.width = resizedWidth; canvas.height = resizedHeight;
        const ctx = canvas.getContext('2d'); ctx.drawImage(img, 0, 0, resizedWidth, resizedHeight);
        resolve({ base64Data: canvas.toDataURL(targetMimeType, IMAGE_RESIZE_QUALITY).split(',')[1], processedWidth: resizedWidth, processedHeight: resizedHeight, mimeTypeToUse: targetMimeType });
      };
      img.onerror = (err) => reject(new Error('Image load for resize failed: ' + String(err)));
      img.src = originalDataUrl;
    });
  }
  async function callGeminiApi(base64ImageData, apiKey, imageMimeType, imageProcessedWidth, imageProcessedHeight) {
    const modelName = getGeminiModelName();
    const mangaTitleText = getMangaTitle().trim() || 'Not provided';
    const targetLanguageName = getTargetLanguageName();
    const promptText = GEMINI_PROMPT_TEMPLATE
      .replace(/\$\{imageProcessedWidth\}/g, imageProcessedWidth)
      .replace(/\$\{imageProcessedHeight\}/g, imageProcessedHeight)
      .replace(/\$\{mangaTitle\}/g, mangaTitleText)
      .replace(/\$\{targetLanguageName\}/g, targetLanguageName);
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
    const payload = { contents: [{ parts: [{ text: promptText }, { inline_data: { mime_type: imageMimeType, data: base64ImageData } }] }] };
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({ method: 'POST', url: url, headers: { 'Content-Type': 'application/json' }, data: JSON.stringify(payload), timeout: 90000,
        onload: (response) => {
          if (response.status >= 200 && response.status < 300) {
            try {
              const rd = JSON.parse(response.responseText);
              if (rd.candidates?.[0]?.content?.parts?.[0]?.text) {
                let rt = rd.candidates[0].content.parts[0].text.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
                resolve(JSON.parse(rt));
              } else if (rd.promptFeedback?.blockReason) {
                reject(new Error(`API blocked: ${rd.promptFeedback.blockReason} - ${rd.promptFeedback.blockReasonMessage || 'No message.'}`));
              } else resolve([]);
            } catch (e) { reject(new Error(`Parse Error: ${e.message}. Resp: ${response.responseText.substring(0, 200)}...`)); }
          } else {
            let errorMsg = `API Error ${response.status}: ${response.statusText}`;
            try { const errorJson = JSON.parse(response.responseText); errorMsg = `API Error ${response.status}: ${errorJson.error?.message || response.statusText}`; } catch (e) {}
            reject(new Error(errorMsg)); }
        },
        onerror: (err) => reject(new Error(`Network/CORS Error: ${err.statusText || 'Unknown'}`)),
        ontimeout: () => reject(new Error('Gemini API timed out.')),
      });
    });
  }

  function displayTranslations(imgElement, translations, processedWidth, processedHeight) {
    removeAllOverlays(imgElement);
    if (!translations || translations.length === 0) return;
    const parentNode = imgElement.parentNode;
    if (!parentNode) return;
    if (getComputedStyle(parentNode).position === 'static') parentNode.style.position = 'relative';

    const imgRect = imgElement.getBoundingClientRect();
    const overlayContainer = document.createElement('div');
    overlayContainer.className = `${SCRIPT_PREFIX}overlay_container`;
    overlayContainer.dataset.targetImgSrc = imgElement.src;
    Object.assign(overlayContainer.style, { top: `${imgElement.offsetTop}px`, left: `${imgElement.offsetLeft}px`, width: `${imgRect.width}px`, height: `${imgRect.height}px` });
    parentNode.appendChild(overlayContainer);

    const currentBorderRadius = GM_getValue(BORDER_RADIUS_STORAGE_KEY, DEFAULT_BORDER_RADIUS);
    const initialFontSizeForNewBox = getConfiguredInitialFontSize();

    translations.forEach((item, index) => {
      if (!item.bbox || typeof item.bbox.x_ratio !== 'number' || typeof item.bbox.y_ratio !== 'number' ||
          typeof item.bbox.width_ratio !== 'number' || typeof item.bbox.height_ratio !== 'number') {
        console.warn(`[DEBUG] displayTranslations: Invalid bbox for item ${index}:`, item); return;
      }
      const { x_ratio, y_ratio, width_ratio, height_ratio } = item.bbox;
      const percentX = x_ratio * 100, percentY = y_ratio * 100, percentWidth = width_ratio * 100, percentHeight = height_ratio * 100;

      const bboxDiv = document.createElement('div'); bboxDiv.className = `${SCRIPT_PREFIX}bbox`;
      Object.assign(bboxDiv.style, { left: `${percentX}%`, top: `${percentY}%`, width: `${percentWidth}%`, height: `${percentHeight}%` });
      bboxDiv.style.setProperty('--current-font-size', initialFontSizeForNewBox);

      const textActualBg = document.createElement('div'); textActualBg.className = `${SCRIPT_PREFIX}text_actual_bg`;
      textActualBg.style.borderRadius = currentBorderRadius;

      const textDisplay = document.createElement('div'); textDisplay.className = `${SCRIPT_PREFIX}text_display`;
      textDisplay.textContent = item.text || '';

      bboxDiv.appendChild(textActualBg); bboxDiv.appendChild(textDisplay);
      bboxDiv.addEventListener('mousedown', onDragStart);

      const resizeHandle = document.createElement('div'); resizeHandle.className = `${SCRIPT_PREFIX}resize_handle ${SCRIPT_PREFIX}resize_handle_br`;
      resizeHandle.addEventListener('mousedown', onResizeStart);
      bboxDiv.appendChild(resizeHandle);

      const borderRadiusHandle = document.createElement('div'); borderRadiusHandle.className = `${SCRIPT_PREFIX}border_radius_handle`;
      borderRadiusHandle.addEventListener('mousedown', onBorderRadiusHandleMouseDown);
      bboxDiv.appendChild(borderRadiusHandle);

      const fontSizeMinusButton = document.createElement('div');
      fontSizeMinusButton.className = `${SCRIPT_PREFIX}font_size_button ${SCRIPT_PREFIX}font_size_minus_button`;
      fontSizeMinusButton.textContent = '-';
      fontSizeMinusButton.dataset.adjustment = '-1';
      fontSizeMinusButton.addEventListener('click', onFontSizeAdjustClick);
      bboxDiv.appendChild(fontSizeMinusButton);

      const fontSizePlusButton = document.createElement('div');
      fontSizePlusButton.className = `${SCRIPT_PREFIX}font_size_button ${SCRIPT_PREFIX}font_size_plus_button`;
      fontSizePlusButton.textContent = '+';
      fontSizePlusButton.dataset.adjustment = '1';
      fontSizePlusButton.addEventListener('click', onFontSizeAdjustClick);
      bboxDiv.appendChild(fontSizePlusButton);

      overlayContainer.appendChild(bboxDiv);
    });
  }

  async function handleTranslateClick(event) {
    event.stopPropagation(); const icon = event.target; translateIconElement = icon;

    if (icon.classList.contains('processing')) {
        icon.dataset.isTranslating = 'true'; // Ensure flag is aligned if already processing
        return;
    }
    icon.dataset.isTranslating = 'true'; // Set flag for new translation process

    const currentImgElement = activeImageTarget;
    if (!currentImgElement) { // Safeguard
        icon.dataset.isTranslating = 'false';
        return;
    }

    const apiKey = getGeminiApiKey(icon);
    if (!apiKey) {
        icon.dataset.isTranslating = 'false'; // Clear flag if bailing early
        return;
    }

    const originalIconText = icon.dataset.originalText || 'Translate';
    icon.dataset.originalText = originalIconText;
    showTemporaryMessageOnIcon(icon, 'Processing...', false, 120000);
    icon.classList.remove('success', 'error'); icon.classList.add('processing'); // .processing class is key
    removeAllOverlays(currentImgElement);

    try {
      const naturalWidth = currentImgElement.naturalWidth, naturalHeight = currentImgElement.naturalHeight;
      if (naturalWidth === 0 || naturalHeight === 0) throw new Error('Invalid source image (0x0).');
      const { dataUrl: originalDataUrl, mimeType: originalMimeType } = await getImageData(currentImgElement.src);
      const { base64Data: finalBase64ToSend, processedWidth, processedHeight, mimeTypeToUse } =
        await preprocessImage(originalDataUrl, naturalWidth, naturalHeight, GEMINI_TARGET_PROCESSING_DIMENSION, originalMimeType);
      const translations = await callGeminiApi(finalBase64ToSend, apiKey, mimeTypeToUse, processedWidth, processedHeight);
      displayTranslations(currentImgElement, translations, processedWidth, processedHeight);
      if (translations?.length > 0) {
        showTemporaryMessageOnIcon(icon, 'Translated!', false, 3000);
        icon.classList.remove('processing', 'error'); icon.classList.add('success');
      } else {
        showTemporaryMessageOnIcon(icon, 'No text found!', false, 3000);
        icon.classList.remove('processing', 'success', 'error');
      }
    } catch (error) {
      console.error('Manga Translator: Translation failed:', error);
      showTemporaryMessageOnIcon(icon, `Error: ${error.message.substring(0, 100)}...`, true, 7000);
      icon.classList.remove('processing', 'success'); icon.classList.add('error'); // .error implies not .processing
    } finally {
      icon.dataset.isTranslating = 'false'; // Clear the core translation task flag
      // This check ensures that if the translation ended without explicitly setting success/error (e.g. an early exit in try block not caught, though unlikely now)
      // OR if a message timeout from a previous state is still pending, it gets cleaned up.
      // However, showTemporaryMessageOnIcon handles its own revert.
      // The .processing class is the main indicator used by showTemporaryMessageOnIcon for its message.
      // If it's success or error, processing is already removed.
      // This is mostly a fallback.
      if (icon.classList.contains('processing') && !icon.classList.contains('success') && !icon.classList.contains('error')) {
        icon.textContent = originalIconText;
        icon.classList.remove('processing');
      }
    }
  }

  // --- Icon Management and Image Scanning ---
  function addTranslateIcon(imgElement) {
    const parentNode = imgElement.parentNode; if (!parentNode) return null;
    removeTranslateIcon(imgElement, parentNode);
    if (getComputedStyle(parentNode).position === 'static') parentNode.style.position = 'relative';
    const icon = document.createElement('div');
    icon.textContent = 'Translate';
    icon.className = `${SCRIPT_PREFIX}translate_icon`;
    icon.dataset.targetSrc = imgElement.src;
    icon.dataset.originalText = 'Translate';
    const imgRect = imgElement.getBoundingClientRect(), parentRect = parentNode.getBoundingClientRect();
    icon.style.top = `${imgElement.offsetTop + 5}px`;
    icon.style.right = `${parentNode.offsetWidth - (imgElement.offsetLeft + imgElement.offsetWidth) + 5}px`;
    if (imgElement.offsetTop === 0 && imgElement.offsetLeft === 0 && imgRect.top > parentRect.top) {
        icon.style.top = `${imgRect.top - parentRect.top + 5}px`;
        icon.style.right = `${parentRect.right - imgRect.right + 5}px`;
    }
    icon.addEventListener('click', handleTranslateClick);
    parentNode.appendChild(icon);
    return icon;
  }
  function removeTranslateIcon(imgElement, parentNodeOverride = null) {
    const parentNode = parentNodeOverride || imgElement.parentNode; if (!parentNode) return;
    const iconEl = parentNode.querySelector(`.${SCRIPT_PREFIX}translate_icon[data-target-src="${imgElement.src}"]`);
    if (iconEl) { iconEl.removeEventListener('click', handleTranslateClick); iconEl.remove(); }
    if (translateIconElement === iconEl) translateIconElement = null;
  }

  function scanImages() {
    const images = document.querySelectorAll(`img:not([data-${SCRIPT_PREFIX}processed="true"])`);
    images.forEach((img) => {
      if (!img.src || img.closest(`.${SCRIPT_PREFIX}bbox`)) { img.dataset[`${SCRIPT_PREFIX}processed`] = 'true'; return; }
      const processThisImg = () => {
        img.dataset[`${SCRIPT_PREFIX}processed`] = 'true';
        const styles = getComputedStyle(img);
        if (styles.display === 'none' || styles.visibility === 'hidden' || img.offsetParent === null) return;
        if ((img.offsetWidth >= MIN_IMAGE_DIMENSION || img.offsetHeight >= MIN_IMAGE_DIMENSION) && img.naturalWidth > 0 && img.naturalHeight > 0) {
          const parent = img.parentNode; if (!parent) return;
          img.addEventListener('mouseenter', () => {
            activeImageTarget = img;
            if (!parent.querySelector(`.${SCRIPT_PREFIX}translate_icon[data-target-src="${img.src}"]`)) {
              translateIconElement = addTranslateIcon(img);
            } else {
              const existingIcon = parent.querySelector(`.${SCRIPT_PREFIX}translate_icon[data-target-src="${img.src}"]`);
              if (existingIcon) translateIconElement = existingIcon;
            }
          });
          let leaveTimeout;
          const commonMouseLeaveHandler = (event) => {
            clearTimeout(leaveTimeout);
            leaveTimeout = setTimeout(() => {
                const iconExists = parent.querySelector(`.${SCRIPT_PREFIX}translate_icon[data-target-src="${img.src}"]`);

                if (iconExists) {
                    if (iconExists.dataset.isTranslating === 'true') {
                        return; // Don't remove if core translation task is active
                    }
                    const originalButtonText = iconExists.dataset.originalText || 'Translate';
                    if (iconExists.textContent !== originalButtonText) {
                        return; // Don't remove if a temporary message (like "Translated!") is being shown
                    }

                    // If passed above checks, proceed with hover-based removal logic
                    const isMouseOverImg = img.matches(':hover');
                    const isMouseOverIcon = iconExists.matches(':hover'); // iconExists is confirmed true here

                    if (!isMouseOverImg && !isMouseOverIcon) {
                        let related = event.relatedTarget;
                        let shouldRemove = true;

                        while (related && related !== parent) {
                            if (related === img || related === iconExists) {
                                shouldRemove = false;
                                break;
                            }
                            related = related.parentNode;
                        }

                        if (related === parent && (event.target === img || event.target === iconExists)) {
                            // Mouse moved from img/icon to the parent itself, don't remove.
                        } else if (shouldRemove) {
                            removeTranslateIcon(img, parent);
                            if (activeImageTarget === img) activeImageTarget = null;
                        }
                    }
                }
            }, 150);
          };
          parent.addEventListener('mouseleave', commonMouseLeaveHandler);
          img.addEventListener('mouseleave', (event) => {
            const iconExists = parent.querySelector(`.${SCRIPT_PREFIX}translate_icon[data-target-src="${img.src}"]`);
            if (event.relatedTarget !== iconExists && event.relatedTarget !== parent && (!iconExists || !iconExists.contains(event.relatedTarget))) {
              commonMouseLeaveHandler(event);
            }
          });
        }
      };
      if (img.complete && img.naturalWidth > 0) processThisImg();
      else if (!img.complete) {
        img.addEventListener('load', processThisImg, { once: true });
        img.addEventListener('error', () => { img.dataset[`${SCRIPT_PREFIX}processed`] = 'true'; }, { once: true });
      } else img.dataset[`${SCRIPT_PREFIX}processed`] = 'true';
    });
  }

  // --- Initialization and Observer ---
  if (document.readyState === 'complete' || document.readyState === 'interactive') scanImages();
  else document.addEventListener('DOMContentLoaded', scanImages, { once: true });

  const observer = new MutationObserver((mutationsList) => {
    let needsScan = false;
    for (const m of mutationsList) {
      if (m.type === 'childList' && m.addedNodes.length > 0) {
        m.addedNodes.forEach((n) => {
          if (n.nodeType === Node.ELEMENT_NODE && (n.tagName === 'IMG' || n.querySelector?.(`img:not([data-${SCRIPT_PREFIX}processed="true"])`))) needsScan = true;
        });
      } else if (m.type === 'attributes' && m.target.tagName === 'IMG' && m.attributeName === 'src') {
        m.target.removeAttribute(`data-${SCRIPT_PREFIX}processed`); needsScan = true;
      }
    }
    if (needsScan) scanImages();
  });
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });

  console.log(`Manga Translator (Gemini) - v${SCRIPT_VERSION} loaded. Open console for DEBUG logs.`);
})();