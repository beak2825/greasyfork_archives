// ==UserScript==
// @name         YouTube Video Age and Category Filter
// @namespace    PoKeRGT
// @version      1.27
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @description  Filters old YouTube videos and hides videos in certain categories with a modern blur overlay.
// @author       PoKeRGT
// @match        https://www.youtube.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @connect      www.youtube.com
// @run-at       document-start
// @homepageURL  https://github.com/PoKeRGT/userscripts
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493043/YouTube%20Video%20Age%20and%20Category%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/493043/YouTube%20Video%20Age%20and%20Category%20Filter.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // --- Objeto de configuración por defecto ---
  const defaultConfig = {
    'maxVideoAge': 15,
    'categoriesToHide': ['Music', 'Sports'],
    'notSeenBorderColor': '#00FF00',
    'seenBorderColor': '#FF0000',
    'debug': false,
    'partiallySeenBorderColor': '#8A2BE2',
    'iconUrlByAge': 'https://upload.wikimedia.org/wikipedia/commons/e/e1/Calendar_%2889059%29_-_The_Noun_Project.svg',
    'iconUrlByCategory': 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Discrete_category.svg',
    'overlayBlurAmount': 8
  };

  // --- Bloque de inicialización granular ---
  for (const [key, defaultValue] of Object.entries(defaultConfig)) {
    if (typeof GM_getValue(key) === 'undefined') {
      GM_setValue(key, defaultValue);
    }
  }

  // --- Carga de la configuración ---
  const MAX_VIDEO_AGE = GM_getValue('maxVideoAge');
  const CATEGORIES_TO_HIDE = GM_getValue('categoriesToHide');
  const NOT_SEEN_BORDER_COLOR = GM_getValue('notSeenBorderColor');
  const SEEN_BORDER_COLOR = GM_getValue('seenBorderColor');
  const DEBUG = GM_getValue('debug');
  const PARTIALLY_SEEN_BORDER_COLOR = GM_getValue('partiallySeenBorderColor');
  const ICON_URL_BY_AGE = GM_getValue('iconUrlByAge');
  const ICON_URL_BY_CATEGORY = GM_getValue('iconUrlByCategory');
  const OVERLAY_BLUR_AMOUNT = GM_getValue('overlayBlurAmount');

  function logDebug(...args) { if (DEBUG) console.log('[YT Filter DEBUG]', ...args); }

  logDebug('Script loaded. Initializing...');

  const processedVideos = new WeakSet();

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType === 1) {
          const item = node.matches('ytd-rich-item-renderer') ? node : node.querySelector('ytd-rich-item-renderer');
          if (item) handleVideoItem(item);
        }
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  logDebug('MutationObserver is now watching for new video items.');

  function handleVideoItem(videoItem) {
    if (processedVideos.has(videoItem)) { return; }
    processedVideos.add(videoItem);

    const thumbnailElement = videoItem.querySelector('yt-thumbnail-view-model');
    if (!thumbnailElement) { return; }

    const progressBarContainer = videoItem.querySelector('yt-thumbnail-overlay-progress-bar-view-model');
    if (progressBarContainer) {
      const progressBar = progressBarContainer.querySelector('.ytThumbnailOverlayProgressBarHostWatchedProgressBarSegment');
      const progressWidth = progressBar ? parseFloat(progressBar.style.width) : 0;
      if (progressWidth >= 95) changeElementStyle(thumbnailElement, 'seen');
      else if (progressWidth > 0) changeElementStyle(thumbnailElement, 'partially_seen');
      return;
    }

    const videoLinkElement = videoItem.querySelector('a.yt-lockup-metadata-view-model__title');
    if (videoLinkElement && videoLinkElement.href) {
      const videoUrl = new URL(videoLinkElement.href, document.baseURI).href;
      const videoTitle = videoLinkElement.textContent.trim() || videoLinkElement.getAttribute('aria-label') || 'Untitled Video';
      fetchVideoDetails(videoUrl, videoTitle, thumbnailElement);
    }
  }

  /**
   * Crea un overlay con efecto blur y una etiqueta informativa.
   * @param {HTMLElement} thumbnailEl El elemento de la miniatura.
   * @param {object} reason Objeto con los detalles del ocultamiento.
   */
  function createBlurOverlay(thumbnailEl, reason) {
    if (thumbnailEl.querySelector('.filter-blur-overlay')) return;

    const overlayContainer = document.createElement('div');
    overlayContainer.className = 'filter-blur-overlay';
    Object.assign(overlayContainer.style, {
      position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
      zIndex: '10', borderRadius: '12px', overflow: 'hidden', cursor: 'pointer'
    });

    const blurEffect = document.createElement('div');
    Object.assign(blurEffect.style, {
      width: '100%', height: '100%',
      backdropFilter: `blur(${OVERLAY_BLUR_AMOUNT}px) grayscale(0.3)`,
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    });

    const badge = document.createElement('div');
    Object.assign(badge.style, {
      position: 'absolute', top: '8px', left: '8px',
      display: 'flex', alignItems: 'center',
      padding: '4px 8px', backgroundColor: 'rgba(20, 20, 20, 0.8)',
      borderRadius: '8px', color: 'white', fontFamily: 'Roboto, Arial, sans-serif',
      fontSize: '12px', fontWeight: '500'
    });

    const icon = document.createElement('img');
    icon.src = reason.type === 'age' ? ICON_URL_BY_AGE : ICON_URL_BY_CATEGORY;
    Object.assign(icon.style, {
      width: '16px', height: '16px', marginRight: '6px',
      filter: 'invert(1)'
    });

    const text = document.createElement('span');
    let labelText = reason.value.toUpperCase();
    // --- MODIFICADO: Añade 'days' al texto si el detalle es por antigüedad ---
    if (reason.details) {
      labelText += ` (${reason.details} days)`;
    }
    text.textContent = labelText;

    badge.appendChild(icon);
    badge.appendChild(text);
    overlayContainer.appendChild(blurEffect);
    overlayContainer.appendChild(badge);

    overlayContainer.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const videoItem = thumbnailEl.closest('ytd-rich-item-renderer');
      const videoLink = videoItem.querySelector('a.yt-lockup-metadata-view-model__title');
      if (videoLink) window.location.href = videoLink.href;
    };

    thumbnailEl.style.position = 'relative';
    thumbnailEl.appendChild(overlayContainer);
  }

  function changeElementStyle(element, prop, details = '') {
    if (!element) return;
    logDebug(`Applying style "${prop}" to element:`, element);
    element.style.overflow = 'hidden';
    element.style.borderRadius = '12px';

    switch (prop) {
      case 'hidden_by_age':
        createBlurOverlay(element, { type: 'age', value: 'OLD', details: details });
        break;
      case 'hidden_by_category':
        createBlurOverlay(element, { type: 'category', value: details });
        break;
      case 'not_seen':
        element.style.border = `4px solid ${NOT_SEEN_BORDER_COLOR}`;
        element.style.boxSizing = 'border-box';
        break;
      case 'seen':
        element.style.border = `4px solid ${SEEN_BORDER_COLOR}`;
        element.style.boxSizing = 'border-box';
        break;
      case 'partially_seen':
        element.style.border = `4px solid ${PARTIALLY_SEEN_BORDER_COLOR}`;
        element.style.boxSizing = 'border-box';
        break;
      default:
        logDebug(`Unknown style property: "${prop}"`);
        break;
    }
  }

  function fetchVideoDetails(videoUrl, videoTitle, elementToChange) {
    GM_xmlhttpRequest({
      method: 'GET', url: videoUrl,
      onload: (response) => {
        if (response.status >= 400) return;

        const metaTags = response.responseText.match(/<meta [^>]*>/g) || [];
        let isHidden = false;

        const category = findMetaTagContent(metaTags, 'itemprop="genre"');
        if (category && CATEGORIES_TO_HIDE.includes(category)) {
          isHidden = true;
          logDebug(`Hiding "${videoTitle}" (Category: ${category})`);
          changeElementStyle(elementToChange, 'hidden_by_category', category);
        }

        if (!isHidden) {
          const uploadDateStr = findMetaTagContent(metaTags, 'itemprop="uploadDate"');
          if (uploadDateStr) {
            const uploadDate = new Date(uploadDateStr);
            const today = new Date();
            const diffInDays = Math.ceil((today - uploadDate) / (1000 * 60 * 60 * 24));
            if (diffInDays > MAX_VIDEO_AGE) {
              logDebug(`Hiding "${videoTitle}" (Age: ${diffInDays} days)`);
              // --- MODIFICADO: Se pasa diffInDays en lugar de la fecha completa ---
              changeElementStyle(elementToChange, 'hidden_by_age', diffInDays);
            } else {
              changeElementStyle(elementToChange, 'not_seen');
            }
          } else {
            changeElementStyle(elementToChange, 'not_seen');
          }
        }
      },
      onerror: (error) => console.error(`Network error on "${videoTitle}":`, error)
    });
  }

  function findMetaTagContent(metaTags, property) {
    const tag = metaTags.find(t => t.includes(property));
    if (tag) {
      const contentMatch = tag.match(/content="([^"]+)"/);
      return contentMatch ? contentMatch[1] : null;
    }
    return null;
  }
})();