// ==UserScript==
// @name         Pinterest Full
// @namespace    https://github.com/ShrekBytes
// @description  View & download original full size images (no login required) and a pleasing UI
// @version      3.0.0
// @author       ShrekBytes
// @match        https://*.pinterest.com/*
// @match        https://*.pinterest.at/*
// @match        https://*.pinterest.ca/*
// @match        https://*.pinterest.ch/*
// @match        https://*.pinterest.cl/*
// @match        https://*.pinterest.co.kr/*
// @match        https://*.pinterest.co.uk/*
// @match        https://*.pinterest.com.au/*
// @match        https://*.pinterest.com.mx/*
// @match        https://*.pinterest.de/*
// @match        https://*.pinterest.dk/*
// @match        https://*.pinterest.es/*
// @match        https://*.pinterest.fr/*
// @match        https://*.pinterest.ie/*
// @match        https://*.pinterest.info/*
// @match        https://*.pinterest.it/*
// @match        https://*.pinterest.jp/*
// @match        https://*.pinterest.nz/*
// @match        https://*.pinterest.ph/*
// @match        https://*.pinterest.pt/*
// @match        https://*.pinterest.se/*
// @icon         https://raw.githubusercontent.com/ShrekBytes/pinterest-full/refs/heads/main/pinterest.png
// @grant        GM_openInTab
// @grant        GM_download
// @run-at       document-start
// @license      GPL-3.0
// @noframes
// @homepageURL  https://github.com/ShrekBytes/pinterest-full
// @supportURL   https://github.com/ShrekBytes/pinterest-full/issues
// @downloadURL https://update.greasyfork.org/scripts/546432/Pinterest%20Full.user.js
// @updateURL https://update.greasyfork.org/scripts/546432/Pinterest%20Full.meta.js
// ==/UserScript==

(() => {
  'use strict';

  // ===== CONFIGURATION =====
  const CONFIG = {
    ROUTE_DEBOUNCE_MS: 150,
    DOWNLOAD_FEEDBACK_MS: 500,
    API_TIMEOUT_MS: 10000,
    SWIPE_THRESHOLD_PX: 50,
    FILENAME_MAX_LENGTH: 80,
    BATCH_DOWNLOAD_DELAY_MS: 600,
    TOAST_DURATION_MS: 3000,
    MUTATION_DEBOUNCE_MS: 200,
  };

  // ===== UTILITIES =====
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const qs = (sel, root = document) => root.querySelector(sel);

  /**
   * Debounce function to limit how often a function is called
   * @param {Function} fn - Function to debounce
   * @param {number} delay - Delay in milliseconds
   * @returns {Function} Debounced function
   */
  function debounce(fn, delay) {
    let timer;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /**
   * Extract file extension from URL
   * @param {string} url - Image URL
   * @returns {string} File extension with dot (e.g., '.jpg')
   */
  function getFileExtension(url) {
    if (!url) return '.jpg';
    const cleanUrl = url.split('?')[0];
    const match = cleanUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    return match ? match[0] : '.jpg';
  }

  /**
   * Get file extension type for display (without dot, uppercase)
   * @param {string} url - Image URL
   * @returns {string} Extension type (e.g., 'JPEG')
   */
  function getExtensionType(url) {
    const ext = getFileExtension(url).substring(1).toUpperCase();
    return ext === 'JPG' ? 'JPEG' : ext;
  }

  /**
   * Format file size in human-readable format
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size string
   */
  function formatFileSize(bytes) {
    if (!bytes || bytes === 0) return '';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  /**
   * Sanitize filename to remove invalid characters
   * @param {string} filename - Original filename
   * @returns {string} Sanitized filename
   */
  function sanitizeFilename(filename) {
    if (!filename) return 'pinterest';
    return filename.replace(/[\/\\?%*:|"<>]/g, '-').slice(0, CONFIG.FILENAME_MAX_LENGTH) || 'pinterest';
  }

  /**
   * Download a file using GM_download or fallback to anchor element
   * @param {string} url - File URL
   * @param {string} filename - Desired filename
   * @returns {Promise<boolean>} Success status
   */
  async function downloadFile(url, filename) {
    if (!url) return false;
    
    try {
      const sanitized = sanitizeFilename(filename);
      const fullName = sanitized + getFileExtension(url);
      
      if (typeof GM_download === 'function') {
        GM_download({ url, name: fullName });
      } else {
        const a = document.createElement('a');
        a.href = url;
        a.download = fullName;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      return true;
    } catch (e) {
      console.error('Download failed:', e);
      return false;
    }
  }

  /**
   * Open URL in new tab using GM_openInTab or fallback
   * @param {string} url - URL to open
   */
  function openInNewTab(url) {
    if (!url) return;
    
    if (typeof GM_openInTab === 'function') {
      GM_openInTab(url, { active: true, insert: true });
    } else if (typeof GM?.openInTab === 'function') {
      GM.openInTab(url, { active: true, insert: true });
    } else {
      window.open(url, '_blank');
    }
  }

  /**
   * Fetch file size from URL using HEAD request
   * @param {string} url - File URL
   * @returns {Promise<number|null>} File size in bytes or null
   */
  async function getFileSize(url) {
    if (!url) return null;
    
    try {
      const response = await fetch(url, { method: 'HEAD' });
      if (!response.ok) return null;
      const size = response.headers.get('content-length');
      return size ? parseInt(size, 10) : null;
    } catch {
      return null;
    }
  }

  /**
   * Manage button loading state
   * @param {HTMLElement} btn - Button element
   * @param {boolean} isLoading - Whether button is in loading state
   * @param {string} loadingText - Text to display during loading
   */
  function setButtonState(btn, isLoading, loadingText = 'Loading...') {
    if (!btn) return;
    
    if (isLoading) {
      btn.dataset.originalText = btn.textContent;
      btn.textContent = loadingText;
      btn.disabled = true;
    } else {
      btn.textContent = btn.dataset.originalText || btn.textContent;
      btn.disabled = false;
      delete btn.dataset.originalText;
    }
  }

  /**
   * Create a button element with common attributes
   * @param {Object} config - Button configuration
   * @returns {HTMLElement} Button element
   */
  function createButton({ id, text, ariaLabel, className = 'pp-btn' }) {
    const btn = document.createElement('button');
    if (id) btn.id = id;
    btn.className = className;
    btn.textContent = text;
    btn.setAttribute('aria-label', ariaLabel || text);
    btn.setAttribute('role', 'button');
    return btn;
  }

  // ===== TOAST NOTIFICATION SYSTEM =====
  const Toast = (() => {
    let container;

    /**
     * Initialize toast container
     */
    function init() {
      if (container) return;
      container = document.createElement('div');
      container.className = 'pp-toast-container';
      document.body.appendChild(container);
    }

    /**
     * Show a toast notification
     * @param {string} message - Message to display
     * @param {string} type - Toast type: 'success', 'error', 'warning', 'info'
     * @param {number} duration - Display duration in milliseconds
     */
    function show(message, type = 'info', duration = CONFIG.TOAST_DURATION_MS) {
      if (!message) return;
      
      init();
      
      const toast = document.createElement('div');
      toast.className = `pp-toast pp-toast-${type}`;
      toast.textContent = message;
      
      container.appendChild(toast);
      
      // Trigger animation
      setTimeout(() => toast.classList.add('pp-toast-show'), 10);
      
      // Auto dismiss
      setTimeout(() => {
        toast.classList.remove('pp-toast-show');
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return { show };
  })();

  // ===== CSS =====
  const CSS = `
  /* ===== Pinterest Full Modern CSS ===== */
  .pp-btn {
    all: unset;
    display: inline-flex; align-items: center; gap: .5rem;
    font-weight: 700; cursor: pointer; user-select: none;
    border-radius: 9999px; padding: .5rem .9rem; line-height: 1;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
    transition: transform .12s ease, background .2s ease, opacity .2s ease;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    background: #e60023; color: #fff;
  }
  .pp-btn:hover { background: #ad081b; }
  .pp-btn:disabled { 
    opacity: 0.6; 
    cursor: not-allowed; 
    background: #666; 
  }
  .pp-btn:disabled:hover { background: #666; }
  
  .pp-btn-sm {
    padding: .4rem .7rem;
    font-size: 13px;
  }
  
  #pp-main-btn { margin-right: 8px; }

  .pp-overlay {
    position: fixed; 
    top: 0; right: 0; bottom: 0; left: 0;
    background: rgba(0,0,0,.85); 
    z-index: 2147483647;
    display: grid; 
    grid-template-rows: auto 1fr auto;
    opacity: 0; 
    pointer-events: none; 
    transition: opacity .2s ease;
  }
  .pp-overlay.open { opacity: 1; pointer-events: auto; }

  .pp-head {
    display:flex; align-items:center; justify-content: space-between; padding: 10px 14px;
    background: rgba(20,20,20,.6); backdrop-filter: blur(4px);
    flex-wrap: wrap; gap: 8px;
  }
  .pp-head .pp-actions { display:flex; gap:8px; align-items:center; flex-wrap: wrap; }
  .pp-head .pp-info { display:flex; gap:8px; align-items:center; flex-wrap: wrap; }
  .pp-chip { 
    font-size:12px; 
    background:#222; 
    color:#fff; 
    padding:.3rem .6rem; 
    border-radius:999px;
    white-space: nowrap;
  }

  .pp-stage {
    display:grid; place-items:center; overflow:auto; padding: 16px;
  }
  .pp-img { 
    max-width: 95vw; 
    max-height: 82vh; 
    border-radius: 12px; 
    box-shadow: 0 12px 48px rgba(0,0,0,.4);
  }

  .pp-footer {
    display:flex; align-items:center; justify-content:center; gap:8px; padding:10px; 
    background: rgba(20,20,20,.6);
    flex-wrap: wrap;
  }
  .pp-thumb {
    width: 72px; height: 72px; object-fit: cover; border-radius: 8px; 
    opacity:.7; cursor:pointer; border:2px solid transparent;
    transition: opacity .2s ease, border-color .2s ease;
  }
  .pp-thumb.active { opacity:1; border-color:#fff; }
  .pp-thumb:hover { opacity: 0.9; }

  .pp-toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 2147483648;
    display: flex;
    flex-direction: column;
    gap: 10px;
    pointer-events: none;
  }

  .pp-toast {
    padding: 12px 20px;
    border-radius: 8px;
    font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    font-size: 14px;
    font-weight: 500;
    color: #fff;
    box-shadow: 0 4px 12px rgba(0,0,0,.15);
    opacity: 0;
    transform: translateX(100px);
    transition: opacity .3s ease, transform .3s ease;
    pointer-events: auto;
    max-width: 300px;
  }

  .pp-toast-show {
    opacity: 1;
    transform: translateX(0);
  }

  .pp-toast-success { background: #059669; }
  .pp-toast-error { background: #dc2626; }
  .pp-toast-warning { background: #f59e0b; }
  .pp-toast-info { background: #3b82f6; }

  @media (max-width: 640px) {
    .pp-head {
      flex-direction: column;
      align-items: stretch;
    }
    
    .pp-head .pp-actions,
    .pp-head .pp-info {
      justify-content: center;
    }
    
    .pp-toast-container {
      left: 20px;
      right: 20px;
    }
    
    .pp-toast {
      max-width: none;
    }
  }
  `;

  /**
   * Inject CSS into the page once
   */
  function ensureCSS() {
    if (qs('#pp-css')) return;
    const style = document.createElement('style');
    style.id = 'pp-css';
    style.textContent = CSS;
    (document.head || document.documentElement).appendChild(style);
  }

  // ===== PINTEREST API & DATA EXTRACTION =====

  /**
   * Derive original URL from image element (fallback method)
   * @param {HTMLImageElement} img - Image element
   * @returns {string|null} Original image URL
   */
  function fromSrcOrSrcset(img) {
    if (!img) return null;
    
    // Prefer largest from srcset
    if (img.srcset) {
      const parts = img.srcset.split(',').map(p => p.trim());
      let best = null, bestW = 0;
      for (const p of parts) {
        const [url, size] = p.split(' ');
        const w = parseInt(size || '0', 10) || 0;
        if (w >= bestW) { best = url; bestW = w; }
      }
      if (best) return best.replace(/\/\d+x\//, '/originals/');
    }
    
    if (img.src) return img.src.replace(/\/\d+x\//, '/originals/');
    return null;
  }

  /**
   * Extract pin ID from URL
   * @param {string} url - URL to parse
   * @returns {string|null} Pin ID
   */
  function getPinIdFromUrl(url = location.href) {
    const m = url?.match(/\/pin\/([^\/?#]+)/i);
    return m ? m[1] : null;
  }

  /**
   * Fetch pin data from Pinterest's internal API
   * @param {string} pinId - Pinterest pin ID
   * @returns {Promise<Object|null>} Pin data or null on failure
   */
  async function fetchPinData(pinId) {
    if (!pinId) return null;
    
    try {
      const t = Date.now();
      const u = `https://${location.host}/resource/PinResource/get/?source_url=%2Fpin%2F${encodeURIComponent(pinId)}%2F&data=%7B%22options%22%3A%7B%22id%22%3A%22${encodeURIComponent(pinId)}%22%2C%22field_set_key%22%3A%22detailed%22%2C%22noCache%22%3Atrue%7D%2C%22context%22%3A%7B%7D%7D&_=${t}`;
      
      // Create AbortController for timeout (browser compatibility)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.API_TIMEOUT_MS);
      
      const res = await fetch(u, {
        headers: { 'X-Pinterest-PWS-Handler': 'www/pin/[id].js' },
        credentials: 'include',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!res.ok) throw new Error(`API returned ${res.status}`);
      const json = await res.json();
      if (json?.resource_response?.status !== 'success') throw new Error('Invalid API response');
      return json.resource_response.data;
    } catch (e) {
      console.warn('Failed to fetch pin data:', e.message);
      if (e.name !== 'AbortError') {
        Toast.show('Failed to load pin data from API', 'warning');
      }
      return null;
    }
  }

  /**
   * Extract best quality images from pin data
   * @param {Object} pin - Pin data from API
   * @returns {Object} Pack with items array and title
   */
  function getBestFromPinData(pin) {
    const pack = { items: [], title: (pin?.grid_title || pin?.title || '').trim() };
    if (!pin) return pack;

    // Story pins (multi-page content)
    if (pin.story_pin_data?.pages?.length) {
      for (const page of pin.story_pin_data.pages) {
        const url = page?.image?.images?.originals?.url
                 || page?.blocks?.[0]?.image?.images?.originals?.url
                 || page?.blocks?.[0]?.image?.images?.orig?.url;
        if (url) pack.items.push({ url, width: 0, height: 0, thumb: url });
      }
    }

    // Regular pin original image
    const orig = pin.images?.orig;
    if (orig?.url) {
      if (!pack.items.length) {
        pack.items.push({ url: orig.url, width: orig.width || 0, height: orig.height || 0, thumb: orig.url });
      } else if (!pack.items.some(i => i.url === orig.url)) {
        // Ensure main original is present (dedupe)
        pack.items.unshift({ url: orig.url, width: orig.width || 0, height: orig.height || 0, thumb: orig.url });
      }
    }

    // Deduplicate
    const seen = new Set();
    pack.items = pack.items.filter(i => i.url && !seen.has(i.url) && (seen.add(i.url) || true));
    return pack;
  }

  /**
   * Derive image from DOM as fallback
   * @returns {Array} Array of image items
   */
  function deriveFromDomAsFallback() {
    const closeup = qs("div[data-test-id='CloseupMainPin'], div.reactCloseupScrollContainer") || document;
    const img = qs('img[srcset], img[src]', closeup);
    const url = fromSrcOrSrcset(img);
    return url ? [{ url, width: 0, height: 0, thumb: url }] : [];
  }

  // ===== OVERLAY GALLERY =====
  const Overlay = (() => {
    let root, stage, footer, titleEl, resEl, counterEl, metaEl;
    let currentIndex = 0;
    let items = [];

    /**
     * Build overlay DOM structure
     */
    function build() {
      if (root) return;
      
      root = document.createElement('div');
      root.className = 'pp-overlay';
      root.innerHTML = `
        <div class="pp-head">
          <div class="pp-actions">
            <button class="pp-btn pp-btn-sm" id="pp-download">Download</button>
            <button class="pp-btn pp-btn-sm" id="pp-download-all" style="display:none;">Download All</button>
            <button class="pp-btn pp-btn-sm" id="pp-open">Open</button>
          </div>
          <div class="pp-info">
            <span id="pp-counter" class="pp-chip" style="display:none;"></span>
            <span id="pp-title" class="pp-chip"></span>
            <span id="pp-meta" class="pp-chip"></span>
            <span id="pp-res" class="pp-chip"></span>
            <button class="pp-btn pp-btn-sm" id="pp-close">Close</button>
          </div>
        </div>
        <div class="pp-stage"></div>
        <div class="pp-footer"></div>
      `;
      document.body.appendChild(root);
      
      stage = qs('.pp-stage', root);
      footer = qs('.pp-footer', root);
      titleEl = qs('#pp-title', root);
      resEl = qs('#pp-res', root);
      counterEl = qs('#pp-counter', root);
      metaEl = qs('#pp-meta', root);

      setupEventListeners();
    }

    /**
     * Setup all event listeners for overlay
     */
    function setupEventListeners() {
      // Close button
      qs('#pp-close', root).addEventListener('click', close);
      
      // Download current
      qs('#pp-download', root).addEventListener('click', async () => {
        const btn = qs('#pp-download', root);
        if (btn.disabled) return;
        
        setButtonState(btn, true, 'Downloading...');
        
        try {
          await downloadCurrent();
          await sleep(CONFIG.DOWNLOAD_FEEDBACK_MS);
          Toast.show('Download started!', 'success');
        } catch (error) {
          Toast.show('Download failed', 'error');
        } finally {
          setButtonState(btn, false);
        }
      });

      // Download all
      qs('#pp-download-all', root).addEventListener('click', async () => {
        const btn = qs('#pp-download-all', root);
        if (btn.disabled) return;
        
        setButtonState(btn, true, 'Preparing...');
        
        try {
          await downloadAll(btn);
          Toast.show('All downloads completed!', 'success');
        } catch (error) {
          Toast.show('Some downloads failed', 'error');
        } finally {
          setButtonState(btn, false);
        }
      });

      // Open in new tab
      qs('#pp-open', root).addEventListener('click', openCurrent);

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
        if (!isOpen()) return;
        
        switch(e.key) {
          case 'Escape':
            close();
            break;
          case 'ArrowRight':
            next();
            break;
          case 'ArrowLeft':
            prev();
            break;
        }
        
        if (e.key.toLowerCase() === 'd') {
          e.preventDefault();
          downloadCurrent();
        }
      }, { capture: true });

      // Swipe gestures (mobile)
      let touchX = 0;
      stage.addEventListener('touchstart', (e) => {
        touchX = e.touches[0].clientX;
      }, { passive: true });
      
      stage.addEventListener('touchend', (e) => {
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > CONFIG.SWIPE_THRESHOLD_PX) {
          dx < 0 ? next() : prev();
        }
      });
    }

    /**
     * Open overlay with image pack
     * @param {Object} pack - Pack containing items and title
     */
    function open(pack) {
      build();
      items = pack?.items || [];
      
      if (items.length === 0) {
        Toast.show('No images found', 'warning');
        return;
      }
      
      titleEl.textContent = pack.title || '';
      currentIndex = 0;
      
      // Show/hide download all button
      const downloadAllBtn = qs('#pp-download-all', root);
      downloadAllBtn.style.display = items.length > 1 ? '' : 'none';
      
      render();
      root.classList.add('open');
    }

    /**
     * Close overlay
     */
    function close() {
      root?.classList.remove('open');
    }

    /**
     * Check if overlay is open
     * @returns {boolean}
     */
    function isOpen() {
      return root?.classList.contains('open') || false;
    }

    /**
     * Render current image and UI
     */
    async function render() {
      stage.innerHTML = '';
      const cur = items[currentIndex];
      if (!cur) return;

      // Update counter
      counterEl.style.display = items.length > 1 ? '' : 'none';
      if (items.length > 1) {
        counterEl.textContent = `${currentIndex + 1} / ${items.length}`;
      }

      // Create and load image
      const el = document.createElement('img');
      el.className = 'pp-img';
      el.alt = titleEl.textContent || 'Image';
      el.src = cur.url;
      
      el.addEventListener('load', async () => {
        const w = el.naturalWidth || cur.width || 0;
        const h = el.naturalHeight || cur.height || 0;
        resEl.textContent = w && h ? `${w}×${h}` : '';
        
        // Display file format
        const ext = getExtensionType(cur.url);
        metaEl.textContent = ext;
        
        // Fetch file size asynchronously
        const size = await getFileSize(cur.url);
        if (size) {
          metaEl.textContent = `${ext} • ${formatFileSize(size)}`;
        }
      }, { once: true });

      stage.appendChild(el);

      // Render thumbnails
      renderThumbnails();
    }

    /**
     * Render thumbnail navigation
     */
    function renderThumbnails() {
      footer.innerHTML = '';
      
      if (items.length <= 1) return;
      
      items.forEach((it, i) => {
        const t = document.createElement('img');
        t.className = 'pp-thumb' + (i === currentIndex ? ' active' : '');
        t.src = it.thumb || it.url;
        t.alt = `Image ${i + 1}`;
        t.loading = 'lazy';
        t.addEventListener('click', () => {
          currentIndex = i;
          render();
        });
        footer.appendChild(t);
      });
    }

    /**
     * Navigate to next image
     */
    function next() {
      if (currentIndex < items.length - 1) {
        currentIndex++;
        render();
      }
    }

    /**
     * Navigate to previous image
     */
    function prev() {
      if (currentIndex > 0) {
        currentIndex--;
        render();
      }
    }

    /**
     * Get current image item
     * @returns {Object|null}
     */
    function current() {
      return items[currentIndex] || null;
    }

    /**
     * Download current image
     */
    async function downloadCurrent() {
      const c = current();
      if (!c) throw new Error('No image to download');
      
      const filename = titleEl.textContent || 'pinterest';
      const success = await downloadFile(c.url, filename);
      
      if (!success) {
        throw new Error('Download failed');
      }
    }

    /**
     * Download all images sequentially
     * @param {HTMLElement} btn - Button element to update
     */
    async function downloadAll(btn) {
      const total = items.length;
      const baseTitle = titleEl.textContent || 'pinterest';
      
      for (let i = 0; i < total; i++) {
        if (btn) {
          btn.textContent = `Downloading ${i + 1}/${total}...`;
        }
        
        const filename = total > 1 ? `${baseTitle}_page_${i + 1}` : baseTitle;
        const success = await downloadFile(items[i].url, filename);
        
        if (!success) {
          Toast.show(`Failed to download image ${i + 1}`, 'error');
        }
        
        // Delay between downloads to avoid browser blocking
        if (i < total - 1) {
          await sleep(CONFIG.BATCH_DOWNLOAD_DELAY_MS);
        }
      }
    }

    /**
     * Open current image in new tab
     */
    function openCurrent() {
      const c = current();
      if (c) openInNewTab(c.url);
    }

    return { open, close, isOpen };
  })();

  // ===== MAIN APP LOGIC =====
  const App = (() => {
    let routeObserverSetup = false;
    let domObserver;
    const injectedButtons = new WeakSet();

    /**
     * Initialize the application
     */
    async function init() {
      ensureCSS();
      setupRouteObserver();
      setupDomObserver();
      onRoute();
    }

    /**
     * Setup SPA route detection
     */
    function setupRouteObserver() {
      if (routeObserverSetup) return;
      
      routeObserverSetup = true;
      const push = history.pushState;
      const replace = history.replaceState;
      
      history.pushState = function(...args) {
        const r = push.apply(this, args);
        onRoute();
        return r;
      };
      
      history.replaceState = function(...args) {
        const r = replace.apply(this, args);
        onRoute();
        return r;
      };
      
      window.addEventListener('popstate', onRoute, { passive: true });
    }

    /**
     * Setup DOM mutation observer with debouncing
     */
    function setupDomObserver() {
      if (domObserver) return;
      
      const debouncedInject = debounce(() => {
        if (getPinIdFromUrl()) {
          injectCloseupButton();
        }
      }, CONFIG.MUTATION_DEBOUNCE_MS);

      domObserver = new MutationObserver((mutations) => {
        if (!getPinIdFromUrl()) return;
        
        const hasRelevantChanges = mutations.some(m =>
          m.type === 'childList' &&
          (m.target.matches?.('[data-test-id*="Closeup"]') ||
           m.target.matches?.('[data-test-id*="share"]') ||
           m.target.closest?.('[data-test-id*="Closeup"]'))
        );
        
        if (hasRelevantChanges) {
          debouncedInject();
        }
      });
      
      domObserver.observe(document.documentElement, { childList: true, subtree: true });
    }

    /**
     * Handle route changes
     */
    async function onRoute() {
      await sleep(CONFIG.ROUTE_DEBOUNCE_MS);
      injectCloseupButton();
    }

    /**
     * Inject View and Download buttons into Pinterest UI
     */
    function injectCloseupButton() {
      if (!getPinIdFromUrl()) return;

      const bar = findActionBar();
      if (!bar || injectedButtons.has(bar) || qs('#pp-main-btn', bar)) return;

      injectedButtons.add(bar);
      
      injectViewButton(bar);
      injectDownloadButton(bar);
    }

    /**
     * Find Pinterest action bar
     * @returns {HTMLElement|null}
     */
    function findActionBar() {
      return qs("div[data-test-id='share-button']")?.parentElement ||
             qs("div[data-test-id='closeupActionBar']>div>div") ||
             qs("div[data-test-id='CloseupDetails']") ||
             qs("div[data-test-id='CloseupMainPin'] div:has(button)") ||
             null;
    }

    /**
     * Handle pack resolution with loading state
     * @param {HTMLElement} btn - Button element
     * @param {Function} callback - Callback to execute with resolved pack
     */
    async function handlePackAction(btn, callback) {
      if (btn.disabled) return;
      
      setButtonState(btn, true);
      
      try {
        const pack = await resolveCurrentPinPack();
        if (pack?.items?.length) {
          await callback(pack);
        } else {
          Toast.show('No images found', 'warning');
        }
      } catch (error) {
        console.error('Pack action failed:', error);
        Toast.show('Failed to load images', 'error');
      } finally {
        setButtonState(btn, false);
      }
    }

    /**
     * Inject View button
     * @param {HTMLElement} bar - Action bar element
     */
    function injectViewButton(bar) {
      const btn = createButton({
        id: 'pp-main-btn',
        text: 'View',
        ariaLabel: 'View full size image'
      });

      // Left click = open overlay
      btn.addEventListener('mousedown', (e) => {
        e.preventDefault();
        if (e.button === 0) {
          handlePackAction(btn, pack => Overlay.open(pack));
        } else if (e.button === 1) {
          // Middle click = open in tab
          resolveCurrentPinPack().then(pack => {
            if (pack?.items?.[0]) openInNewTab(pack.items[0].url);
          });
        }
      }, { passive: false });

      // Mobile support
      btn.addEventListener('touchend', () => {
        handlePackAction(btn, pack => Overlay.open(pack));
      }, { passive: true });

      bar.appendChild(btn);
    }

    /**
     * Inject Download button
     * @param {HTMLElement} bar - Action bar element
     */
    function injectDownloadButton(bar) {
      if (qs('#pp-mini-download', bar)) return;
      
      const btn = createButton({
        id: 'pp-mini-download',
        text: 'Download',
        ariaLabel: 'Download current image'
      });
      
      btn.addEventListener('click', async () => {
        if (btn.disabled) return;
        
        setButtonState(btn, true, 'Downloading...');
        
        try {
          const pack = await resolveCurrentPinPack();
          if (!pack?.items?.length) {
            Toast.show('No images found', 'warning');
            return;
          }
          
          const success = await downloadFile(pack.items[0].url, pack.title || 'pinterest');
          if (success) {
            Toast.show('Download started!', 'success');
          } else {
            throw new Error('Download failed');
          }
        } catch (error) {
          console.error('Download failed:', error);
          Toast.show('Download failed', 'error');
        } finally {
          setButtonState(btn, false);
        }
      });
      
      bar.appendChild(btn);
    }

    /**
     * Resolve current pin pack with images
     * @returns {Promise<Object>} Pack with items and title
     */
    async function resolveCurrentPinPack() {
      const pinId = getPinIdFromUrl();
      
      if (!pinId) {
        const items = deriveFromDomAsFallback();
        return { title: '', items };
      }
      
      const data = await fetchPinData(pinId);
      const pack = getBestFromPinData(data);
      
      if (!pack.items.length) {
        pack.items = deriveFromDomAsFallback();
      }
      
      if (!pack.title) {
        const img = qs('img[alt]');
        if (img?.alt) pack.title = img.alt;
      }
      
      pack.title = sanitizeFilename(pack.title);
      return pack;
    }

    return { init };
  })();

  // ===== INITIALIZE =====
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }
})();