// ==UserScript==
// @name         マンガ見開きビューア
// @namespace    http://2chan.net/
// @version      3.3
// @description  画像が縦一列表示となっているサイト上で起動後、右上アイコンクリックで見開き表示
// @description  When launched on a website where images are displayed in a single vertical column, click the icon in the upper right corner to switch to a double-page display with enhanced resource detection and LazyLoad support.
// @author       futaba
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=2chan.net
// @license      MIT
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/546352/%E3%83%9E%E3%83%B3%E3%82%AC%E8%A6%8B%E9%96%8B%E3%81%8D%E3%83%93%E3%83%A5%E3%83%BC%E3%82%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/546352/%E3%83%9E%E3%83%B3%E3%82%AC%E8%A6%8B%E9%96%8B%E3%81%8D%E3%83%93%E3%83%A5%E3%83%BC%E3%82%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========== 設定 ==========
  const CONFIG = {
    minImageHeight: 400,
    minImageWidth: 200,
    enableKeyControls: true,
    enableMouseWheel: true,
    minMangaImageCount: 2,
    defaultBg: '#333333',
    refreshDebounceMs: 250,
    autoDetectionInterval: 3000,
    scrollDetectionThrottle: 500,
    niconico: {
      defaultThreshold: 0.65, // 反転させた値（元の0.35の逆）
      minPixelCount: 200000,
      transparentAlpha: 10,
    }
  };

  // 検出モード設定
  const DETECTION_MODES = {
    'auto': {
      name: '🤖 自動検出',
      description: '全ての方法を試して最適なものを選択'
    },
    'smart': {
      name: '🧠 スマート検出',
      description: 'リソース情報から画像を検出'
    },
    'deep-scan': {
      name: '🔍 ディープスキャン',
      description: 'HTMLコードから画像URLを解析'
    },
    'basic': {
      name: '📄 基本型',
      description: 'ページ上の<img>タグを直接検索'
    },
    'frame-reader': {
      name: '🖼️ フレーム型',
      description: 'iframe内の画像を検索'
    },
    'niconico-seiga': {
      name: '📺 Canvasモード（ニコニコ静画等）',
      description: 'Canvasから画像を抽出',
      niconico: true
    },
    'reading-content': {
      name: '📱 エリア型',
      description: '.reading-content内を検索',
      selector: '.reading-content img',
      dataSrcSupport: true
    },
    'chapter-content': {
      name: '📄 チャプター型',
      description: '.chapter-content内を検索',
      selector: '.chapter-content img',
      dataSrcSupport: true
    },
    'manga-reader': {
      name: '📚 リーダー型',
      description: '.manga-reader内を検索',
      selector: '.manga-reader img',
      dataSrcSupport: false
    },
    'entry-content': {
      name: '📋 エントリー型',
      description: '.entry-content内を検索',
      selector: '.entry-content img',
      dataSrcSupport: true
    }
  };

  // ========== グローバル変数 ==========
  const state = {
    currentPage: 0,
    images: [],
    isFullscreen: false,
    lastImageCount: 0,
    detectedMode: null,
    niconico: {
      threshold: CONFIG.niconico.defaultThreshold
    }
  };

  const elements = {
    container: null,
    imageArea: null,
    bgToggleBtn: null,
    fullscreenBtn: null,
    toggleButton: null,
    niconicoThresholdUI: null,
    singlePageBtn: null,
    navigationElement: null  // 修正: ナビゲーション要素の参照を追加
  };

  const observers = {
    intersection: null,
    mutation: null
  };

  const timers = {
    refresh: null,
    navigation: null,
    scroll: null,
    polling: null
  };

  const watched = new WeakSet();

  // ========== ユーティリティ関数 ==========
  const Utils = {
    debounce(func, delay) {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
      };
    },

    throttle(func, delay) {
      let lastCall = 0;
      return (...args) => {
        const now = Date.now();
        if (now - lastCall >= delay) {
          lastCall = now;
          return func.apply(this, args);
        }
      };
    },

    createButton(text, styles = {}, clickHandler = null) {
      const button = document.createElement('button');
      button.textContent = text;
      button.type = 'button';
      
      const defaultStyles = {
        background: 'rgba(255,255,255,0.2)',
        color: 'white',
        border: 'none',
        padding: '6px 10px',
        borderRadius: '4px',
        cursor: 'pointer'
      };

      Object.assign(button.style, defaultStyles, styles);
      
      if (clickHandler) {
        button.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          clickHandler();
        });
      }

      return button;
    },

    showMessage(text, color = 'rgba(0,150,0,0.8)', duration = 2500) {
      const msg = document.createElement('div');
      msg.textContent = text;
      msg.style.cssText = `
        position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
        z-index: 10001; background: ${color}; color: white;
        padding: 8px 12px; border-radius: 4px; font-size: 12px; pointer-events: none;
      `;
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), duration);
    },

    isNiconicoSeiga() {
      return window.location.hostname === 'manga.nicovideo.jp';
    }
  };

  // ========== 設定管理 ==========
  const Settings = {
    getSiteSettings() {
      try {
        return JSON.parse(localStorage.getItem('mangaViewerDomains') || '{}');
      } catch {
        return {};
      }
    },

    setSiteSettings(settings) {
      localStorage.setItem('mangaViewerDomains', JSON.stringify(settings));
    },

    getCurrentSiteStatus() {
      const settings = this.getSiteSettings();
      const hostname = window.location.hostname;
      return settings[hostname] || 'hide';
    },

    shouldShowButton() {
      return this.getCurrentSiteStatus() === 'show';
    },

    setSiteMode(hostname, mode) {
      const settings = this.getSiteSettings();
      settings[hostname] = mode;
      this.setSiteSettings(settings);
      
      const statusText = mode === 'show' ? '起動ボタン表示' : '起動ボタン非表示';
      Utils.showMessage(`${hostname}: ${statusText} に設定しました`, 'rgba(0,100,200,0.8)');
      
      this.updateUI(mode);
    },

    updateUI(mode) {
      if (mode === 'hide' && elements.toggleButton) {
        elements.toggleButton.remove();
        elements.toggleButton = null;
      } else if (mode === 'show' && !elements.toggleButton) {
        setTimeout(() => UI.addToggleButton(), 100);
      }
    },

    getDetectionMode() {
      const hostname = window.location.hostname;
      const key = `mangaDetectionMode_${hostname}`;
      return localStorage.getItem(key) || 'auto';
    },

    setDetectionMode(hostname, mode) {
      const key = `mangaDetectionMode_${hostname}`;
      localStorage.setItem(key, mode);
      
      const modeInfo = DETECTION_MODES[mode] || { name: mode };
      Utils.showMessage(`${hostname}: ${modeInfo.name} に設定しました`, 'rgba(0,150,0,0.8)');
    },

    getCurrentDetectionModeDisplay() {
      const mode = this.getDetectionMode();
      
      if (mode === 'auto') {
        if (state.detectedMode && DETECTION_MODES[state.detectedMode]) {
          return `${DETECTION_MODES[state.detectedMode].name} (自動判別)`;
        } else {
          return '🔄 検出試行中...';
        }
      } else {
        const modeInfo = DETECTION_MODES[mode];
        return modeInfo ? `${modeInfo.name} (手動設定)` : `❓ 未知(${mode})`;
      }
    },

    getBgColor() {
      return localStorage.getItem('mangaViewerBg') || CONFIG.defaultBg;
    },

    toggleBgColor() {
      const newColor = this.getBgColor() === '#333333' ? '#F5F5F5' : '#333333';
      localStorage.setItem('mangaViewerBg', newColor);
      if (elements.container) elements.container.style.background = newColor;
      if (elements.bgToggleBtn) {
        elements.bgToggleBtn.textContent = (newColor === '#F5F5F5') ? '背景：白' : '背景：黒';
      }
    },

    // ニコニコ静画用の設定
    getNiconicoThreshold() {
      return parseFloat(localStorage.getItem('mangaViewerNiconicoThreshold') || CONFIG.niconico.defaultThreshold);
    },

    setNiconicoThreshold(threshold) {
      localStorage.setItem('mangaViewerNiconicoThreshold', threshold.toString());
      state.niconico.threshold = threshold;
    },

    // 単ページモード設定
    getSinglePageMode() {
      const hostname = window.location.hostname;
      const key = `mangaViewerSinglePage_${hostname}`;
      return localStorage.getItem(key) === 'true';
    },

    setSinglePageMode(hostname, isSingle) {
      const key = `mangaViewerSinglePage_${hostname}`;
      localStorage.setItem(key, isSingle.toString());
    }
  };

  // ========== ニコニコ静画Canvas抽出システム ==========
  const NiconicoExtractor = {
    extractFromCanvas() {
      console.log('📺 ニコニコ静画Canvas抽出開始');
      
      const canvases = document.querySelectorAll('canvas');
      if (!canvases.length) {
        console.log('❌ Canvas が見つかりませんでした');
        return [];
      }

      const images = [];
      const threshold = 1 - state.niconico.threshold; // 反転させる（スライダが高い=厳しい判定）
      
      canvases.forEach((canvas, i) => {
        try {
          const ctx = canvas.getContext('2d');
          const { width, height } = canvas;
          
          if (width * height < CONFIG.niconico.minPixelCount) {
            console.log(`Canvas ${i}: サイズが小さすぎます (${width}x${height})`);
            return;
          }

          const imgData = ctx.getImageData(0, 0, width, height).data;

          let transparentPixels = 0;
          for (let j = 3; j < imgData.length; j += 4) {
            if (imgData[j] < CONFIG.niconico.transparentAlpha) {
              transparentPixels++;
            }
          }
          
          const transparencyRatio = transparentPixels / (width * height);
          console.log(`Canvas ${i}: 透明度比率 ${transparencyRatio.toFixed(3)}, 閾値 ${threshold.toFixed(3)}`);

          if (transparencyRatio < threshold) {
            try {
              const url = canvas.toDataURL('image/png');
              const img = new Image();
              img.src = url;
              img.dataset.canvasIndex = String(i);
              img.dataset.isNiconicoCanvas = 'true';
              img.dataset.transparencyRatio = String(transparencyRatio);
              
              console.log(`Canvas ${i}: 抽出成功 (${width}x${height})`);
              images.push(img);
            } catch (e) {
              console.error(`Canvas ${i}: toDataURL エラー:`, e);
            }
          } else {
            console.log(`Canvas ${i}: 閾値により除外`);
          }
        } catch (e) {
          console.error(`Canvas ${i}: 処理エラー:`, e);
        }
      });

      console.log(`📺 ニコニコ静画: ${images.length}枚の画像を抽出`);
      return images;
    },

    loadAllPages(callback) {
      console.log('📺 ニコニコ静画: 全ページ読み込み開始');
      
      let lastHeight = 0;
      let attempts = 0;
      const maxAttempts = 50; // 最大試行回数
      
      const scrollInterval = setInterval(() => {
        window.scrollTo(0, document.body.scrollHeight);
        attempts++;
        
        if (document.body.scrollHeight === lastHeight || attempts >= maxAttempts) {
          clearInterval(scrollInterval);
          console.log('📺 ニコニコ静画: スクロール完了');
          setTimeout(() => {
            callback();
          }, 1000);
        }
        
        lastHeight = document.body.scrollHeight;
      }, 800);
    }
  };

  // ========== ニコニコ静画UI ==========
  const NiconicoUI = {
    createThresholdControl() {
      if (elements.niconicoThresholdUI) return;

      const panel = document.createElement('div');
      panel.style.cssText = `
        position: absolute;
        top: 120px;
        right: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 12px;
        border-radius: 8px;
        z-index: 1;
        font-size: 13px;
        font-family: sans-serif;
        min-width: 200px;
      `;
      panel.setAttribute('data-mv-ui', '1');

      const title = document.createElement('div');
      title.textContent = '**ニコニコ静画設定**';
      title.style.cssText = `
        font-weight: bold;
        margin-bottom: 8px;
        color: #ff6b35;
      `;

      const label = document.createElement('div');
      label.textContent = `OCR判定閾値: ${(state.niconico.threshold * 100).toFixed(0)}%`;
      label.style.marginBottom = '6px';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = '0.1';
      slider.max = '0.9';
      slider.step = '0.05';
      slider.value = state.niconico.threshold;
      slider.style.cssText = `
        width: 100%;
        margin: 4px 0;
      `;

      const description = document.createElement('div');
      description.style.cssText = `
        font-size: 11px;
        color: #ccc;
        margin-top: 4px;
        line-height: 1.3;
      `;
      description.textContent = '高い値=厳選抽出';

      slider.oninput = () => {
        const value = parseFloat(slider.value);
        state.niconico.threshold = value;
        Settings.setNiconicoThreshold(value);
        label.textContent = `OCR判定閾値: ${(value * 100).toFixed(0)}%`;
      };

      panel.appendChild(title);
      panel.appendChild(label);
      panel.appendChild(slider);
      panel.appendChild(description);

      elements.niconicoThresholdUI = panel;
      return panel;
    },

    removeThresholdControl() {
      if (elements.niconicoThresholdUI) {
        elements.niconicoThresholdUI.remove();
        elements.niconicoThresholdUI = null;
      }
    },

    updateVisibility() {
      const currentMode = Settings.getDetectionMode();
      // ビューア起動時は表示しない
      if (currentMode === 'niconico-seiga' && elements.container && elements.container.style.display === 'flex') {
        if (!elements.niconicoThresholdUI) {
          const panel = this.createThresholdControl();
          elements.container.appendChild(panel);
        }
      } else {
        this.removeThresholdControl();
      }
    }
  };

  // ========== 画像検出システム ==========
  const ImageDetector = {
    detect(forceRefresh = false) {
      const detectionMode = Settings.getDetectionMode();
      console.log('Detection mode:', detectionMode);
      
      if (detectionMode !== 'auto') {
        return this.detectByMode(detectionMode);
      }
      
      return this.detectWithAutoFallback();
    },

    detectByMode(mode) {
      console.log(`Detecting by mode: ${mode}`);
      
      const detectors = {
        'auto': () => this.detectWithAutoFallback(),
        'basic': () => this.detectFromDocument(),
        'smart': () => this.detectFromResources(),
        'deep-scan': () => this.detectFromTextScan(),
        'frame-reader': () => this.detectFromIframe(),
        'niconico-seiga': () => NiconicoExtractor.extractFromCanvas(),
        'reading-content': () => this.detectBySelector(mode),
        'chapter-content': () => this.detectBySelector(mode),
        'manga-reader': () => this.detectBySelector(mode),
        'entry-content': () => this.detectBySelector(mode)
      };

      const detector = detectors[mode];
      if (detector) {
        return detector();
      } else {
        console.warn(`Unknown detection mode: ${mode}, falling back to basic`);
        return this.detectFromDocument();
      }
    },

    detectWithAutoFallback() {
      console.log('Starting auto-detection...');
      
      const strategies = [
        { name: 'basic', method: () => this.detectFromDocument() },
        { name: 'reading-content', method: () => this.detectBySelector('reading-content') },
        { name: 'chapter-content', method: () => this.detectBySelector('chapter-content') },
        { name: 'manga-reader', method: () => this.detectBySelector('manga-reader') },
        { name: 'entry-content', method: () => this.detectBySelector('entry-content') },
        { name: 'smart', method: () => this.detectFromResources() },
        { name: 'deep-scan', method: () => this.detectFromTextScan() },
        { 
          name: 'frame-reader', 
          method: () => this.detectFromIframe(), 
          condition: () => document.querySelector('iframe') 
        },
        { 
          name: 'niconico-seiga', 
          method: () => NiconicoExtractor.extractFromCanvas()
        }
      ];

      for (const strategy of strategies) {
        if (strategy.condition && !strategy.condition()) continue;
        
        const images = strategy.method();
        if (images.length >= CONFIG.minMangaImageCount) {
          console.log(`Auto-detected: ${strategy.name}`);
          state.detectedMode = strategy.name;
          return images;
        }
      }
      
      console.log('Auto-detection failed');
      state.detectedMode = null;
      return [];
    },

    detectFromDocument() {
      const allImages = document.querySelectorAll('img');
      const excludePatterns = ['icon', 'logo', 'avatar', 'banner', 'header', 'footer', 'thumb', 'thumbnail', 'profile', 'menu', 'button', 'bg', 'background', 'nav', 'sidebar', 'ad', 'advertisement', 'favicon', 'sprite'];

      const potential = Array.from(allImages).filter(img => {
        this.normalizeImageSrc(img);
        
        if (img.dataset.isResourceDetected || img.dataset.isTextScanned || img.dataset.isNiconicoCanvas) {
          return true;
        }
        
        if (img.dataset.preload === "yes") {
          console.log('Found preload image:', img.src);
          return true;
        }
        
        if (!img.src) return false;
        
        if (!this.isImageLoaded(img)) {
          return this.isImageUrl(img.src);
        }
        
        if (!this.isValidImageSize(img)) return false;
        
        return !this.matchesExcludePatterns(img.src, excludePatterns);
      });

      return this.filterAndSortImages(potential);
    },

    detectFromResources() {
      console.log('detectFromResources called');
      
      const resources = performance.getEntriesByType("resource");
      const imageUrls = resources
        .map(r => r.name)
        .filter(url => this.isImageUrl(url))
        .filter(url => !this.matchesExcludePatterns(url.toLowerCase(), 
          ['summary', 'icon', 'logo', 'avatar', 'banner', 'header', 'footer', 'thumb', 'thumbnail', 'profile', 'menu', 'button', 'bg', 'background', 'nav', 'sidebar', 'ad', 'advertisement', 'favicon', 'sprite']));
      
      console.log('Filtered image URLs:', imageUrls.length);
      
      return imageUrls.map((url, index) => {
        const img = new Image();
        img.src = url;
        img.dataset.resourceIndex = String(index);
        img.dataset.isResourceDetected = 'true';
        return img;
      });
    },

    detectFromTextScan() {
      console.log('detectFromTextScan called');
      
      const htmlText = document.documentElement.outerHTML;
      const imageUrlPatterns = [
        /https?:\/\/[^\s"'<>]+\.(?:jpe?g|png|webp|gif)(?:\?[^\s"'<>]*)?/gi,
        /"(https?:\/\/[^"]+\.(?:jpe?g|png|webp|gif)(?:\?[^"]*)?)"/gi,
        /'(https?:\/\/[^']+\.(?:jpe?g|png|webp|gif)(?:\?[^']*)?)'/gi
      ];
      
      const foundUrls = new Set();
      
      imageUrlPatterns.forEach(pattern => {
        let match;
        while ((match = pattern.exec(htmlText)) !== null) {
          const url = match[1] || match[0];
          if (url && !foundUrls.has(url)) {
            foundUrls.add(url);
          }
        }
      });
      
      const filteredUrls = Array.from(foundUrls).filter(url => 
        !this.matchesExcludePatterns(url.toLowerCase(), 
          ['summary', 'icon', 'logo', 'avatar', 'banner', 'header', 'footer', 'thumb', 'thumbnail', 'profile', 'menu', 'button', 'bg', 'background', 'nav', 'sidebar', 'ad', 'advertisement', 'favicon', 'sprite'])
      );
      
      return filteredUrls.map((url, index) => {
        const img = new Image();
        img.src = url;
        img.dataset.textScanIndex = String(index);
        img.dataset.isTextScanned = 'true';
        return img;
      });
    },

    detectBySelector(configName) {
      const config = DETECTION_MODES[configName];
      if (!config || !config.selector) {
        console.warn(`Unknown selector config: ${configName}`);
        return [];
      }
      
      const images = Array.from(document.querySelectorAll(config.selector));
      console.log(`Selector ${config.selector} found ${images.length} images`);
      
      if (config.dataSrcSupport) {
        images.forEach(img => {
          if (!img.src && img.dataset.src) {
            console.log('Converting data-src to src:', img.dataset.src);
            img.src = img.dataset.src;
          }
        });
      }
      
      return images.filter(img => {
        if (img.dataset.isResourceDetected || img.dataset.isTextScanned || img.dataset.isNiconicoCanvas) {
          return true;
        }
        
        if (!img.src) return false;
        
        if (!this.isImageLoaded(img)) {
          return this.isImageUrl(img.src);
        }
        
        return this.isValidImageSize(img);
      });
    },

    detectFromIframe() {
      console.log('detectFromIframe called');
      const iframe = document.querySelector("iframe");
      if (!iframe) return [];
      
      try {
        const doc = iframe.contentDocument || iframe.contentWindow.document;
        if (!doc) return [];

        const allImages = doc.querySelectorAll('img');
        const potential = Array.from(allImages).filter(img => 
          img.complete && img.naturalHeight > 0 && img.naturalWidth > 0 && img.naturalWidth >= 500
        );

        potential.forEach(img => {
          if (!img.src.startsWith('http')) {
            try {
              const iframeUrl = new URL(iframe.src);
              const fullSrc = new URL(img.src, iframeUrl.origin).href;
              Object.defineProperty(img, 'src', { value: fullSrc, writable: false });
            } catch (e) {
              console.log("URL conversion failed:", e);
            }
          }
        });

        return this.sortImagesByPosition(potential);
      } catch (e) {
        console.log("iframe access denied:", e);
        return [];
      }
    },

    // ヘルパーメソッド
    normalizeImageSrc(img) {
      const candidates = [img.dataset.src, img.dataset.original, img.dataset.lazySrc];
      const candidate = candidates.find(c => c);
      
      if ((!img.src || img.src === '') && candidate) {
        console.log('Converting data-* to src:', candidate);
        img.src = candidate;
      }

      if ((!img.src || img.src === '') && img.srcset) {
        const src = img.currentSrc || img.srcset.split(',').pop().trim().split(' ')[0];
        if (src) {
          console.log('Converting srcset to src:', src);
          img.src = src;
        }
      }
    },

    isImageLoaded(img) {
      return img.complete && img.naturalHeight > 0 && img.naturalWidth > 0;
    },

    isValidImageSize(img) {
      // ニコニコ静画のCanvasから抽出された画像は常に有効とみなす
      if (img.dataset.isNiconicoCanvas) {
        return true;
      }
      return img.naturalHeight >= CONFIG.minImageHeight && img.naturalWidth >= CONFIG.minImageWidth;
    },

    isImageUrl(url) {
      return /\.(jpe?g|png|webp|gif)(\?.*)?$/i.test(url);
    },

    matchesExcludePatterns(src, patterns) {
      const lowerSrc = src.toLowerCase();
      return patterns.some(pattern => lowerSrc.includes(pattern));
    },

    filterAndSortImages(images) {
      if (images.length < CONFIG.minMangaImageCount) return [];

      const seenSrcs = new Set();
      const filtered = images.filter(img => {
        if (seenSrcs.has(img.src)) return false;
        seenSrcs.add(img.src);
        return true;
      });

      return this.sortImagesByPosition(filtered);
    },

    sortImagesByPosition(images) {
      return images.sort((a, b) => {
        // ニコニコ静画のCanvas画像は順序を保つ
        if (a.dataset.canvasIndex && b.dataset.canvasIndex) {
          return parseInt(a.dataset.canvasIndex) - parseInt(b.dataset.canvasIndex);
        }
        if (a.dataset.resourceIndex && b.dataset.resourceIndex) {
          return parseInt(a.dataset.resourceIndex) - parseInt(b.dataset.resourceIndex);
        }
        if (a.dataset.textScanIndex && b.dataset.textScanIndex) {
          return parseInt(a.dataset.textScanIndex) - parseInt(b.dataset.textScanIndex);
        }
        
        const rectA = a.getBoundingClientRect();
        const rectB = b.getBoundingClientRect();
        return rectA.top - rectB.top;
      });
    }
  };

  // ========== 自動検出システム ==========
  const AutoDetection = {
    setup() {
      console.log('Setting up auto detection system...');
      
      this.setupMutationObserver();
      this.setupScrollListener();
      this.setupPolling();
      
      console.log('Auto detection system initialized');
    },

    setupMutationObserver() {
      observers.mutation = new MutationObserver((mutations) => {
        let shouldRefresh = false;
        
        mutations.forEach(mutation => {
          mutation.addedNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.tagName === 'IMG' || node.tagName === 'CANVAS' || 
                  node.querySelectorAll('img, canvas').length > 0) {
                console.log('New image(s) or canvas detected via MutationObserver');
                shouldRefresh = true;
              }
            }
          });
        });
        
        if (shouldRefresh) {
          ImageManager.scheduleRefresh();
        }
      });
      
      observers.mutation.observe(document.body, {
        childList: true,
        subtree: true
      });
    },

    setupScrollListener() {
      const handleScroll = Utils.throttle(() => {
        console.log('Scroll detected, refreshing images...');
        ImageManager.scheduleRefresh();
      }, CONFIG.scrollDetectionThrottle);
      
      window.addEventListener('scroll', handleScroll, { passive: true });
    },

    setupPolling() {
      timers.polling = setInterval(() => {
        const currentImageCount = document.querySelectorAll('img, canvas').length;
        if (currentImageCount !== state.lastImageCount) {
          console.log(`Image/Canvas count changed: ${state.lastImageCount} -> ${currentImageCount}`);
          state.lastImageCount = currentImageCount;
          ImageManager.scheduleRefresh();
        }
      }, CONFIG.autoDetectionInterval);
    },

    stop() {
      if (observers.mutation) {
        observers.mutation.disconnect();
        observers.mutation = null;
      }
      
      Object.values(timers).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
      
      console.log('Auto detection system stopped');
    }
  };

  // ========== 画像管理 ==========
  const ImageManager = {
    scheduleRefresh: Utils.debounce(function() {
      this.refresh();
    }, CONFIG.refreshDebounceMs),

    refresh() {
      const newImages = ImageDetector.detect();
      if (newImages.length !== state.images.length || 
          newImages.some((img, i) => state.images[i] !== img)) {
        console.log(`Images updated: ${state.images.length} -> ${newImages.length}`);
        state.images = newImages;
        if (elements.container && elements.container.style.display === 'flex') {
          Viewer.updatePageInfo();
        }
      }
      
      const currentMode = Settings.getDetectionMode();
      if (currentMode === 'auto' || currentMode === 'basic') {
        newImages.forEach(img => this.attachWatchers(img));
      }
    },

    attachWatchers(img) {
      if (watched.has(img)) return;
      watched.add(img);
      img.addEventListener('load', () => this.scheduleRefresh(), { once: true });
      if (observers.intersection && !img.complete) {
        observers.intersection.observe(img);
      }
    },

    loadAll(buttonElement) {
      if (buttonElement?.dataset.loading === '1') return;
      
      if (buttonElement) {
        buttonElement.dataset.loading = '1';
        buttonElement.textContent = '🔥読込中...';
        buttonElement.style.opacity = '0.5';
      }
      
      const currentMode = Settings.getDetectionMode();
      
      if (currentMode === 'niconico-seiga') {
        this.loadAllFromNiconico(buttonElement);
      } else if (currentMode === 'frame-reader') {
        this.loadAllFromIframe(buttonElement);
      } else {
        this.loadAllFromDocument(buttonElement);
      }
    },

    loadAllFromNiconico(buttonElement) {
      NiconicoExtractor.loadAllPages(() => {
        this.refresh();
        this.finishLoadAll(buttonElement);
      });
    },

    loadAllFromDocument(buttonElement) {
      const originalScrollTop = window.pageYOffset;
      this.performScrollLoad(window, document.documentElement, originalScrollTop, buttonElement);
    },

    loadAllFromIframe(buttonElement) {
      const iframe = document.querySelector("iframe");
      if (!iframe) return;
      
      try {
        const iframeWindow = iframe.contentWindow;
        const iframeDoc = iframe.contentDocument || iframeWindow.document;
        const originalScrollTop = iframeWindow.pageYOffset || iframeDoc.documentElement.scrollTop;
        
        this.performScrollLoad(iframeWindow, iframeDoc.documentElement, originalScrollTop, buttonElement);
      } catch (e) {
        console.log("iframe scroll failed:", e);
        this.finishLoadAll(buttonElement);
      }
    },

    performScrollLoad(windowObj, documentElement, originalScrollTop, buttonElement) {
      let currentScroll = 0;
      const documentHeight = Math.max(
        documentElement.scrollHeight,
        documentElement.offsetHeight,
        documentElement.clientHeight
      );
      const viewportHeight = windowObj.innerHeight;
      const scrollStep = Math.max(500, viewportHeight);

      const scrollAndLoad = () => {
        currentScroll += scrollStep;
        windowObj.scrollTo(0, currentScroll);
        this.scheduleRefresh();
        
        if (currentScroll < documentHeight - viewportHeight) {
          setTimeout(scrollAndLoad, 10);
        } else {
          setTimeout(() => {
            windowObj.scrollTo(0, originalScrollTop);
            this.refresh();
            this.finishLoadAll(buttonElement);
          }, 100);
        }
      };
      
      scrollAndLoad();
    },

    finishLoadAll(buttonElement) {
      if (buttonElement) {
        buttonElement.textContent = '🔥全読込';
        buttonElement.style.opacity = '0.8';
        buttonElement.dataset.loading = '0';
      }
      Utils.showMessage(`${state.images.length}枚の画像を検出しました`);
    }
  };

  // ========== ビューア ==========
  const Viewer = {
    create() {
      if (elements.container) return;
      
      elements.container = this.createContainer();
      elements.imageArea = this.createImageArea();
      
      this.setupControls();
      this.setupEventListeners();
      
      elements.container.appendChild(elements.imageArea);
      document.body.appendChild(elements.container);
      
      // ナビゲーションを初期化（修正: 初期化を独立させる）
      this.initializeNavigation();
      
      // ニコニコ静画UIを更新
      NiconicoUI.updateVisibility();
    },

    createContainer() {
      const container = document.createElement('div');
      container.style.cssText = `
        position: fixed; top:0; left:0; width:100vw; height:100vh;
        background:${Settings.getBgColor()}; z-index:10000; display:none;
        justify-content:center; align-items:center; flex-direction:column;
      `;
      return container;
    },

    createImageArea() {
      const imageArea = document.createElement('div');
      const isSinglePage = Settings.getSinglePageMode();
      
      imageArea.style.cssText = `
        display:flex; ${isSinglePage ? 'flex-direction:column' : 'flex-direction:row-reverse'};
        justify-content:center; align-items:center;
        max-width:calc(100vw - 10px); max-height:calc(100vh - 10px);
        gap:2px; padding:5px; box-sizing:border-box;
      `;
      return imageArea;
    },

    // 修正: ナビゲーション初期化メソッドを独立
    initializeNavigation() {
      if (!elements.navigationElement) {
        this.setupNavigation();
      }
    },

    setupNavigation() {
      const nav = document.createElement('div');
      nav.setAttribute('data-mv-ui', '1');
      nav.setAttribute('data-mv-navigation', '1');  // 修正: ナビゲーション専用の識別子を追加
      nav.style.cssText = `
        position:absolute; bottom:20px; left: 50%; transform: translateX(-50%);
        color:white; font-size:16px; background:rgba(0,0,0,0.7);
        padding:10px 20px; border-radius:20px;
        display:flex; align-items:center; gap:12px;
        opacity:1; transition:opacity 0.5s;
        pointer-events:auto;
      `;
      
      const isSinglePage = Settings.getSinglePageMode();
      const step = isSinglePage ? 1 : 2;
      
      const btnNextSpread = Utils.createButton(isSinglePage ? '←次' : '←次', {}, () => this.nextPage(step));
      const btnNextSingle = Utils.createButton('←単', {}, () => this.nextPage(1));
      const btnPrevSingle = Utils.createButton('単→', {}, () => this.prevPage(1));
      const btnPrevSpread = Utils.createButton(isSinglePage ? '戻→' : '戻→', {}, () => this.prevPage(step));

      const progress = document.createElement('progress');
      progress.setAttribute('data-mv-ui', '1');
      progress.max = 100;
      progress.value = 0;
      progress.style.cssText = `
        width:160px; height:8px;
        appearance:none; -webkit-appearance:none;
        direction: rtl;
      `;

      nav.append(btnNextSpread, btnNextSingle, progress, btnPrevSingle, btnPrevSpread);
      elements.container.appendChild(nav);
      elements.navigationElement = nav;  // 修正: ナビゲーション要素の参照を保存

      // ナビフェードアウト
      const scheduleNavFade = () => {
        clearTimeout(timers.navigation);
        timers.navigation = setTimeout(() => nav.style.opacity = '0', 3000);
      };
      
      nav.addEventListener('mouseenter', () => { 
        nav.style.opacity = '1'; 
        clearTimeout(timers.navigation); 
      });
      nav.addEventListener('mouseleave', scheduleNavFade);
      scheduleNavFade();
    },

    // 修正: ナビゲーション更新メソッド（UIを壊さないように）
    updateNavigation() {
      if (elements.navigationElement) {
        elements.navigationElement.remove();
        elements.navigationElement = null;
      }
      this.setupNavigation();
    },

    setupControls() {
      // 閉じるボタン
      const closeBtn = Utils.createButton('×', {
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.5)',
        fontSize: '24px',
        width: '40px',
        height: '40px',
        borderRadius: '50%'
      }, () => {
        elements.container.style.display = 'none';
        NiconicoUI.removeThresholdControl(); // ビューアを閉じる時にニコニコUIも閉じる
      });
      closeBtn.setAttribute('data-mv-ui', '1');
      closeBtn.setAttribute('data-mv-control', '1');  // 修正: コントロール専用の識別子を追加
      elements.container.appendChild(closeBtn);

      // 全読込ボタン
      const loadAllBtn = Utils.createButton('🔥全読込', {
        position: 'absolute',
        top: '70px',
        right: '20px',
        background: 'rgba(0,0,0,0.5)',
        fontSize: '12px',
        padding: '6px 8px',
        borderRadius: '4px',
        opacity: '0.8'
      }, () => ImageManager.loadAll(loadAllBtn));
      loadAllBtn.setAttribute('data-mv-ui', '1');
      loadAllBtn.setAttribute('data-mv-control', '1');
      elements.container.appendChild(loadAllBtn);

      // 全画面ボタン
      elements.fullscreenBtn = Utils.createButton('⛶', {
        position: 'absolute',
        bottom: '80px',
        right: '20px',
        background: 'rgba(0,0,0,0.5)',
        fontSize: '14px',
        padding: '4px 8px',
        borderRadius: '6px',
        fontFamily: 'monospace'
      }, () => this.toggleFullscreen());
      elements.fullscreenBtn.setAttribute('data-mv-ui', '1');
      elements.fullscreenBtn.setAttribute('data-mv-control', '1');
      elements.container.appendChild(elements.fullscreenBtn);

      // ページカウンター
      const pageCounter = document.createElement('div');
      pageCounter.id = 'mv-page-counter';
      pageCounter.setAttribute('data-mv-ui', '1');
      pageCounter.setAttribute('data-mv-control', '1');
      pageCounter.style.cssText = `
        position:absolute; bottom:40px; right:20px;
        background:rgba(0,0,0,0.5); color:white;
        font-size:14px; padding:4px 8px;
        border-radius:6px; font-family:monospace;
        pointer-events:none;
      `;
      elements.container.appendChild(pageCounter);

      // 単ページ表示切り替えボタン
      elements.singlePageBtn = Utils.createButton(
        Settings.getSinglePageMode() ? '📄単' : '📖見開き',
        {
          position: 'absolute',
          bottom: '80px',
          left: '20px',
          background: 'rgba(0,0,0,0.5)',
          fontSize: '14px',
          padding: '4px 8px',
          borderRadius: '6px',
          fontFamily: 'monospace'
        },
        () => this.toggleSinglePageMode(elements.singlePageBtn)
      );
      elements.singlePageBtn.setAttribute('data-mv-ui', '1');
      elements.singlePageBtn.setAttribute('data-mv-control', '1');
      elements.container.appendChild(elements.singlePageBtn);

      // 背景切替
      elements.bgToggleBtn = Utils.createButton(
        Settings.getBgColor() === '#F5F5F5' ? '背景：白' : '背景：黒',
        {
          position: 'absolute',
          bottom: '40px',
          left: '20px',
          background: 'rgba(0,0,0,0.5)',
          fontSize: '14px',
          padding: '4px 8px',
          borderRadius: '6px',
          fontFamily: 'monospace'
        },
        () => Settings.toggleBgColor()
      );
      elements.bgToggleBtn.setAttribute('data-mv-ui', '1');
      elements.bgToggleBtn.setAttribute('data-mv-control', '1');
      elements.container.appendChild(elements.bgToggleBtn);
    },

    setupEventListeners() {
      elements.container.addEventListener('click', e => {
        if (e.target.closest('[data-mv-ui="1"]')) return;
        const rect = elements.container.getBoundingClientRect();
        const isSinglePage = Settings.getSinglePageMode();
        const step = isSinglePage ? 1 : 2;
        
        if ((e.clientX - rect.left) > rect.width / 2) {
          this.prevPage(step);
        } else {
          this.nextPage(step);
        }
      });

      if (CONFIG.enableMouseWheel) {
        elements.container.addEventListener('wheel', e => {
          e.preventDefault();
          const isSinglePage = Settings.getSinglePageMode();
          const step = isSinglePage ? 1 : 2;
          
          if (e.deltaY > 0) this.nextPage(step);
          else this.prevPage(step);
        }, { passive: false });
      }
    },

    showPage(pageNum) {
      if (!state.images.length) return;
      this.create();
      
      pageNum = Math.max(0, Math.min(pageNum, state.images.length - 1));
      elements.imageArea.innerHTML = '';

      const isSinglePage = Settings.getSinglePageMode();
      const pagesToShow = isSinglePage ? 1 : 2;
      const maxWidth = isSinglePage ? 'calc(100vw - 10px)' : 'calc(50vw - 10px)';

      for (let i = 0; i < pagesToShow; i++) {
        const idx = pageNum + i;
        if (idx < state.images.length) {
          const wrapper = document.createElement('div');
          wrapper.className = 'image-wrapper';
          wrapper.style.cssText = 'pointer-events:none;';
          
          const img = document.createElement('img');
          img.src = state.images[idx].src;
          img.style.cssText = `
            max-height:calc(100vh - 10px);
            max-width:${maxWidth};
            object-fit:contain;
            display:block;
          `;
          
          wrapper.appendChild(img);
          elements.imageArea.appendChild(wrapper);
        }
      }
      
      state.currentPage = pageNum;
      this.updatePageInfo();
      elements.container.style.display = 'flex';
      
      // ビューア表示時にニコニコ静画UIを更新
      NiconicoUI.updateVisibility();
    },

    updatePageInfo() {
      const pageCounter = document.getElementById('mv-page-counter');
      const progress = elements.container?.querySelector('progress[data-mv-ui]');
      if (!pageCounter || !progress) return;

      const current = state.currentPage + 1;
      const total = state.images.length;
      pageCounter.textContent = `${String(current).padStart(3, '0')}/${String(total).padStart(3, '0')}`;
      progress.value = Math.floor((current / total) * 100);
    },

    nextPage(step = null) {
      if (step === null) {
        step = Settings.getSinglePageMode() ? 1 : 2;
      }
      const target = state.currentPage + step;
      if (target < state.images.length) this.showPage(target);
    },

    prevPage(step = null) {
      if (step === null) {
        step = Settings.getSinglePageMode() ? 1 : 2;
      }
      const target = state.currentPage - step;
      if (target >= 0) this.showPage(target);
    },

    toggleSinglePageMode(button) {
      const newMode = !Settings.getSinglePageMode();
      Settings.setSinglePageMode(window.location.hostname, newMode);
      
      // ボタンテキスト更新
      if (button) {
        button.textContent = newMode ? '📄単' : '📖見開き';
      }
      
      // 画像エリアのレイアウト更新
      if (elements.imageArea) {
        elements.imageArea.style.flexDirection = newMode ? 'column' : 'row-reverse';
      }
      
      // 修正: ナビゲーション更新メソッドを使用
      this.updateNavigation();
      
      // 現在のページを再表示
      this.showPage(state.currentPage);
      
      Utils.showMessage(newMode ? '単ページ表示に切り替えました' : '見開き表示に切り替えました', 'rgba(0,150,0,0.8)');
    },

    toggleFullscreen() {
      if (!elements.container) return;
      
      if (!state.isFullscreen) {
        const requestFullscreen = elements.container.requestFullscreen ||
          elements.container.webkitRequestFullscreen ||
          elements.container.mozRequestFullScreen ||
          elements.container.msRequestFullscreen;
        
        if (requestFullscreen) {
          requestFullscreen.call(elements.container);
        }
      } else {
        const exitFullscreen = document.exitFullscreen ||
          document.webkitExitFullscreen ||
          document.mozCancelFullScreen ||
          document.msExitFullscreen;
        
        if (exitFullscreen) {
          exitFullscreen.call(document);
        }
      }
    }
  };

  // ========== UI管理 ==========
  const UI = {
    addToggleButton() {
      if (!Settings.shouldShowButton() || elements.toggleButton) return;
      
      elements.toggleButton = document.createElement('button');
      elements.toggleButton.textContent = '📖';
      elements.toggleButton.title = '見開き表示';
      
      this.setupToggleButtonStyles();
      this.setupToggleButtonEvents();
      
      document.body.appendChild(elements.toggleButton);
      this.preventExternalModifications();
    },

    setupToggleButtonStyles() {
      // PageExpand拡張機能対策の属性設定
      const preventAttributes = [
        'data-pageexpand-ignore',
        'data-no-zoom',
        'data-skip-pageexpand',
        'data-manga-viewer-button'
      ];
      
      preventAttributes.forEach(attr => {
        elements.toggleButton.setAttribute(attr, 'true');
      });
      
      elements.toggleButton.className = 'pageexpand-ignore no-zoom manga-viewer-btn';
      
      elements.toggleButton.style.cssText = `
        position:fixed; top:50px; right:40px; z-index:9999;
        background:rgba(0,0,0,0.6); color:white; border:none;
        width:32px; height:32px; border-radius:6px; cursor:pointer;
        font-size:16px; opacity:0.7; transition:opacity 0.2s;
        text-align: center; line-height: 32px; vertical-align: middle;
        pointer-events: auto;
        transform: none !important;
        zoom: 1 !important;
        scale: 1 !important;
      `;
    },

    setupToggleButtonEvents() {
      elements.toggleButton.onmouseenter = () => elements.toggleButton.style.opacity = '1';
      elements.toggleButton.onmouseleave = () => elements.toggleButton.style.opacity = '0.7';
      
      elements.toggleButton.addEventListener('click', () => {
        ImageManager.refresh();
        if (state.images.length >= CONFIG.minMangaImageCount) {
          if (state.detectedMode && Settings.getDetectionMode() === 'auto') {
            Settings.setDetectionMode(window.location.hostname, state.detectedMode);
          }
          Viewer.showPage(0);
        } else {
          this.showDetectionDialog();
        }
      });

      // PageExpand対策のイベント
      ['mouseenter', 'mouseleave'].forEach(eventType => {
        elements.toggleButton.addEventListener(eventType, (e) => {
          e.stopImmediatePropagation();
          this.resetToggleButtonStyle();
        });
      });
    },

    resetToggleButtonStyle() {
      if (!elements.toggleButton) return;
      Object.assign(elements.toggleButton.style, {
        transform: 'none',
        zoom: '1',
        scale: '1'
      });
    },

    preventExternalModifications() {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.target === elements.toggleButton && mutation.type === 'attributes') {
            if (mutation.attributeName === 'style') {
              this.resetToggleButtonStyle();
            }
          }
        });
      });
      
      observer.observe(elements.toggleButton, { 
        attributes: true, 
        attributeFilter: ['style', 'class'] 
      });
    },

    showDetectionDialog() {
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; padding: 20px; border-radius: 8px; z-index: 10002;
        box-shadow: 0 4px 20px rgba(0,0,0,0.5); max-width: 500px;
        color: black; font-family: sans-serif;
      `;
      
      // 検出モードの順番を修正
      const orderedModes = ['auto', 'smart', 'deep-scan', 'basic', 'frame-reader', 'reading-content', 'chapter-content', 'manga-reader', 'entry-content', 'niconico-seiga'];
      
      dialog.innerHTML = `
        <h3 style="margin-top:0;">画像検出設定</h3>
        <p>検出方法を選択してください：</p>
        <div style="display:flex; flex-direction:column; gap:8px;">
          ${orderedModes.map(key => {
            const mode = DETECTION_MODES[key];
            return `<button data-mode="${key}" style="padding:8px; cursor:pointer;">${mode.name}</button>`;
          }).join('')}
          <button data-close="true" style="padding:8px; cursor:pointer; background:#ddd;">✖ キャンセル</button>
        </div>
      `;
      
      dialog.addEventListener('click', (e) => {
        const mode = e.target.dataset.mode;
        const close = e.target.dataset.close;
        
        if (mode) {
          Settings.setDetectionMode(window.location.hostname, mode);
          dialog.remove();
          
          // ニコニコ静画の閾値設定を更新
          if (mode === 'niconico-seiga') {
            state.niconico.threshold = Settings.getNiconicoThreshold();
          }
          
          setTimeout(() => {
            ImageManager.refresh();
            if (state.images.length >= CONFIG.minMangaImageCount) {
              Viewer.showPage(0);
            } else {
              Utils.showMessage('この方法でも画像が見つかりませんでした', 'rgba(200,0,0,0.8)');
            }
          }, 100);
        } else if (close) {
          dialog.remove();
        }
      });
      
      document.body.appendChild(dialog);
    }
  };

  // ========== キーボード操作 ==========
  const KeyboardControls = {
    setup() {
      if (!CONFIG.enableKeyControls) return;
      
      document.addEventListener('keydown', (e) => {
        if (!elements.container || elements.container.style.display !== 'flex') return;
        
        const isSinglePage = Settings.getSinglePageMode();
        const step = isSinglePage ? 1 : 2;
        
        const keyActions = {
          'ArrowLeft': () => Viewer.nextPage(step),
          ' ': () => Viewer.nextPage(step),
          'ArrowRight': () => Viewer.prevPage(step),
          'ArrowDown': () => Viewer.nextPage(1),
          'ArrowUp': () => Viewer.prevPage(1),
          'Escape': () => {
            elements.container.style.display = 'none';
            NiconicoUI.removeThresholdControl();
          }
        };

        const action = keyActions[e.key];
        if (action) {
          e.preventDefault();
          action();
        }
      });
    }
  };

  // ========== 全画面管理 ==========
  const FullscreenManager = {
    setup() {
      const fullscreenEvents = [
        'fullscreenchange',
        'webkitfullscreenchange', 
        'mozfullscreenchange',
        'MSFullscreenChange'
      ];
      
      fullscreenEvents.forEach(event => {
        document.addEventListener(event, () => {
          state.isFullscreen = !!(
            document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement
          );
        });
      });
    }
  };

  // ========== メニューコマンド ==========
  const MenuCommands = {
    register() {
      if (typeof GM_registerMenuCommand === 'undefined') return;

      // メイン機能
      GM_registerMenuCommand("📖 見開きビューアを起動", () => {
        setTimeout(() => {
          ImageManager.refresh();
          if (state.images.length >= CONFIG.minMangaImageCount) {
            if (state.detectedMode && Settings.getDetectionMode() === 'auto') {
              Settings.setDetectionMode(window.location.hostname, state.detectedMode);
            }
            Viewer.showPage(0);
          } else {
            UI.showDetectionDialog();
          }
        }, 300);
      });

      // 設定メニュー
      GM_registerMenuCommand("──────── 検出モード設定 ────────", () => {});
      
      // 現在の検出モード表示
      GM_registerMenuCommand(`🔍選択: ${Settings.getCurrentDetectionModeDisplay()}`, () => {
        const mode = Settings.getDetectionMode();
        if (mode === 'auto') {
          if (state.detectedMode) {
            const modeInfo = DETECTION_MODES[state.detectedMode];
            const description = modeInfo ? modeInfo.description : state.detectedMode;
            Utils.showMessage(`検出結果: ${description}`, 'rgba(100,100,100,0.8)');
          } else {
            Utils.showMessage('検出結果: 未検出（画像が見つかりませんでした）', 'rgba(200,100,0,0.8)');
          }
        } else {
          const modeInfo = DETECTION_MODES[mode];
          const description = modeInfo ? modeInfo.description : mode;
          Utils.showMessage(`設定済み: ${description}`, 'rgba(100,100,100,0.8)');
        }
      });

      // デバッグ機能
      GM_registerMenuCommand("🔬 検出テスト実行", () => {
        console.log('=== 検出テスト開始 ===');
        
        const results = {
          smart: ImageDetector.detectFromResources(),
          deepScan: ImageDetector.detectFromTextScan(),
          basic: ImageDetector.detectFromDocument()
        };
        
        if (Utils.isNiconicoSeiga()) {
          results.niconico = NiconicoExtractor.extractFromCanvas();
        }
        
        Object.entries(results).forEach(([key, images]) => {
          console.log(`${key} detection:`, images.length, 'images found');
          images.forEach((img, i) => console.log(`  ${i}: ${img.src}`));
        });
        
        const resultText = Object.entries(results)
          .map(([key, images]) => `${key}${images.length}枚`)
          .join(', ');
        
        Utils.showMessage(`検出結果: ${resultText}`, 'rgba(0,100,200,0.8)');
        
        console.log('=== 検出テスト終了 ===');
      });

      GM_registerMenuCommand("⚙️ 画像検出設定...", () => {
        UI.showDetectionDialog();
      });

      // サイト設定
      GM_registerMenuCommand("──────── サイト設定 ────────", () => {});
      
      GM_registerMenuCommand("👁️ このサイトで起動ボタンを表示", () => {
        Settings.setSiteMode(window.location.hostname, 'show');
      });

      GM_registerMenuCommand("🚫 このサイトで起動ボタンを非表示", () => {
        Settings.setSiteMode(window.location.hostname, 'hide');
      });

      // 表示モード設定
      GM_registerMenuCommand("──────── 表示モード設定 ────────", () => {});
      
      const currentMode = Settings.getSinglePageMode() ? '単ページ' : '見開き';
      GM_registerMenuCommand(`📄 表示モード: ${currentMode}`, () => {
        const newMode = !Settings.getSinglePageMode();
        Settings.setSinglePageMode(window.location.hostname, newMode);
        Utils.showMessage(newMode ? '単ページ表示に設定しました' : '見開き表示に設定しました', 'rgba(0,150,0,0.8)');
      });

      GM_registerMenuCommand("⚠️ このサイトの設定をリセット ⚠️", () => {
        if (confirm('このサイトの設定をリセットしますか？\n（現在のページもリロードされます）')) {
          const hostname = window.location.hostname;
          const keysToRemove = [
            `mangaDetectionMode_${hostname}`,
            `mangaViewerSinglePage_${hostname}`
          ];
          
          // サイト設定からも削除
          const siteSettings = Settings.getSiteSettings();
          delete siteSettings[hostname];
          Settings.setSiteSettings(siteSettings);
          
          // 検出モード設定も削除
          keysToRemove.forEach(key => localStorage.removeItem(key));
          
          Utils.showMessage(`${hostname} の設定をリセットしました`, 'rgba(255,0,0,0.8)', 1000);
          setTimeout(() => location.reload(), 1000);
        }
      });
    }
  };

  // ========== 初期化 ==========
  function initialize() {
    console.log('Manga Viewer initializing...');
    
    // ニコニコ静画の閾値を初期化
    state.niconico.threshold = Settings.getNiconicoThreshold();
    
    const initializeComponents = () => {
      UI.addToggleButton();
      AutoDetection.setup();
      FullscreenManager.setup();
      KeyboardControls.setup();
      
      // IntersectionObserver設定（基本モードのみ）
      const detectionMode = Settings.getDetectionMode();
      if ((detectionMode === 'auto' || detectionMode === 'basic') && 'IntersectionObserver' in window) {
        observers.intersection = new IntersectionObserver(entries => {
          if (entries.some(e => e.isIntersecting)) {
            ImageManager.scheduleRefresh();
          }
        }, { root: null, rootMargin: '200px 0px', threshold: 0.01 });
      }
      
      ImageManager.refresh();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initializeComponents);
    } else {
      initializeComponents();
    }

    // クリーンアップ
    window.addEventListener('beforeunload', () => {
      AutoDetection.stop();
      NiconicoUI.removeThresholdControl();
    });

    // メニューコマンド登録
    MenuCommands.register();
    
    console.log('Manga Viewer initialized');
  }

  // 起動
  initialize();
})();