// ==UserScript==
// @name         YouTube bilingual subtitles
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  YouTube双语字幕
// @author       hex0x13h
// @match        https://www.youtube.com/watch*
// @match        https://youtube.com/watch*
// @match        https://m.youtube.com/watch*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @connect      translate.googleapis.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544650/YouTube%20bilingual%20subtitles.user.js
// @updateURL https://update.greasyfork.org/scripts/544650/YouTube%20bilingual%20subtitles.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ---------------- 配置 ----------------
  const config = {
    targetLang: GM_getValue('targetLang', 'zh-cn'),
    originalLang: 'auto',
    showOriginal: GM_getValue('showOriginal', true),
    fontSize: GM_getValue('fontSize', 16),
    position: GM_getValue('subtitlePosition', 'bottom'),
    hideNativeCC: GM_getValue('hideNativeCC', false), // 仅视觉隐藏原生字幕
  };

  const languages = {
    'zh-cn': '中文（简体）',
    'zh-tw': '中文（繁体）',
    en: 'English',
    ja: '日本語',
    ko: '한국어',
    fr: 'Français',
    de: 'Deutsch',
    es: 'Español',
    ru: 'Русский',
    pt: 'Português',
    it: 'Italiano',
    ar: 'العربية',
    hi: 'हिन्दी',
    th: 'ไทย',
    vi: 'Tiếng Việt',
  };

  // ---------------- 状态 ----------------
  let subtitleContainer = null;
  let controlPanel = null;
  let statusElement = null;

  let playerObserver = null;
  let captionObserver = null;
  let pollIntervalId = null;
  let resizeObs = null;

  let currentSubtitle = '';
  let isInitialized = false;
  let currentUrl = location.href;
  let playerRoot = null;

  // ---------------- 时间工具 ----------------
  const now = () => (performance && performance.now ? performance.now() : Date.now());
  function debounce(fn, delay) {
    let t;
    return function (...args) {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), delay);
    };
  }
  function throttle(fn, minInterval) {
    let last = 0;
    let pending = null;
    return function (...args) {
      const ts = now();
      if (ts - last >= minInterval) {
        last = ts;
        fn.apply(this, args);
      } else {
        pending && clearTimeout(pending);
        pending = setTimeout(() => {
          last = now();
          fn.apply(this, args);
        }, minInterval - (ts - last));
      }
    };
  }

  // ==================== 高效翻译子系统（核心升级） ====================

  // 句子切分（尽量以标点断开，保留顺序）
  const SENTENCE_SPLIT_RE = /([。．｡\.!?！？；;]+)/g;
  function splitSentences(text) {
    if (!text) return [];
    const parts = [];
    let buf = '';
    text.split(SENTENCE_SPLIT_RE).forEach((chunk, i, arr) => {
      buf += chunk;
      if (SENTENCE_SPLIT_RE.test(chunk) || i === arr.length - 1) {
        const s = buf.trim();
        if (s) parts.push(s);
        buf = '';
      }
    });
    return parts.length ? parts : [text.trim()];
  }

  // 文本清洗与归一化
  function clean(s) {
    return (s || '')
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.;:!?，。；：！？])/g, '$1')
      .replace(/([\u4e00-\u9fa5])\s+([\u4e00-\u9fa5])/g, '$1$2')
      .trim();
  }
  function normalize(s) {
    return (s || '')
      .replace(/\s+/g, ' ')
      .replace(/[。．｡]/g, '.')
      .replace(/\s+([,.;:!?])/g, '$1')
      .trim()
      .toLowerCase();
  }

  // 句子级 LRU 缓存
  class LRU {
    constructor(limit = 500) { this.limit = limit; this.map = new Map(); }
    get(k) {
      if (!this.map.has(k)) return undefined;
      const v = this.map.get(k);
      this.map.delete(k); this.map.set(k, v);
      return v;
    }
    set(k, v) {
      if (this.map.has(k)) this.map.delete(k);
      this.map.set(k, v);
      if (this.map.size > this.limit) {
        const first = this.map.keys().next().value;
        this.map.delete(first);
      }
    }
    clear(){ this.map.clear(); }
  }
  const sentenceCache = new LRU(500);

  // 并发队列（外发请求限流）
  const MAX_CONCURRENCY = 2; // 可按网络稳定度调成 1~3
  let active = 0;
  const queue = [];
  function enqueue(task) {
    return new Promise((resolve, reject) => {
      queue.push({ task, resolve, reject });
      pump();
    });
  }
  function pump() {
    while (active < MAX_CONCURRENCY && queue.length) {
      const { task, resolve, reject } = queue.shift();
      active++;
      task().then(resolve, reject).finally(() => { active--; pump(); });
    }
  }

  // 单次请求：多行文本合并为一条，返回按行切分
  function requestTranslate(lines, targetLang) {
    const text = lines.join('\n');
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    return enqueue(() => new Promise((resolve) => {
      GM_xmlhttpRequest({
        method: 'GET',
        url,
        timeout: 6000,
        onload: (resp) => {
          try {
            const data = JSON.parse(resp.responseText);
            const full = (data && data[0]) ? data[0].map(v => v[0]).join('') : text;
            resolve(full.split('\n').map(clean));
          } catch (e) {
            console.error('翻译解析失败:', e);
            resolve(lines);
          }
        },
        onerror: () => resolve(lines),
        ontimeout: () => resolve(lines),
      });
    }));
  }

  // 主翻译：句子缓存 + 批量请求
  async function translateText(text, targetLang = config.targetLang) {
    if (!text || !text.trim()) return '';
    const sentences = splitSentences(text);

    const need = [];
    const indexOfNeed = [];
    const result = new Array(sentences.length);

    sentences.forEach((s, i) => {
      const key = `${s}__${targetLang}`;
      const hit = sentenceCache.get(key);
      if (hit !== undefined) {
        result[i] = hit;
      } else {
        need.push(s);
        indexOfNeed.push(i);
      }
    });

    // 分批：控制每批长度，减少 414/限流
    const batches = [];
    if (need.length) {
      const MAX_BATCH_CHARS = 1500;
      let batch = [];
      let len = 0;
      for (const s of need) {
        if (len + s.length + 1 > MAX_BATCH_CHARS && batch.length) {
          batches.push(batch);
          batch = [s]; len = s.length + 1;
        } else { batch.push(s); len += s.length + 1; }
      }
      if (batch.length) batches.push(batch);
    }

    const translatedBatches = await Promise.all(batches.map(b => requestTranslate(b, targetLang)));

    // 写回
    let cursor = 0;
    translatedBatches.forEach(arr => {
      arr.forEach(t => {
        const idx = indexOfNeed[cursor++];
        const origin = sentences[idx];
        const key = `${origin}__${targetLang}`;
        sentenceCache.set(key, t);
        result[idx] = t;
      });
    });

    const merged = clean(result.join(' '));
    return merged || text;
  }

  // ==================== 0 延迟显示（先原文，后替换） ====================
  const LOW_LATENCY_MODE = true;  // 需要关闭可改为 false
  let lastInstantText = '';

  function showOriginalInstant(text) {
    if (!LOW_LATENCY_MODE) return;
    if (!subtitleContainer) return;
    const t = (text || '').trim();
    if (!t || t === lastInstantText) return;
    // 若已显示双语字幕，且内容不变，则跳过
    if (currentSubtitle && t === currentSubtitle) return;

    subtitleContainer.textContent = '';
    const originalDiv = document.createElement('div');
    originalDiv.style.color = '#e0e0e0';
    originalDiv.style.fontSize = '0.9em';
    originalDiv.style.opacity = '0.85';
    originalDiv.textContent = t;
    subtitleContainer.appendChild(originalDiv);

    subtitleContainer.style.display = 'block';
    lastInstantText = t;
  }

  // ---------------- DOM 创建（保持不变） ----------------
  function createElement(tag, styles = {}, textContent = '') {
    const el = document.createElement(tag);
    Object.assign(el.style, styles);
    if (textContent) el.textContent = textContent;
    return el;
  }

  // 播放器根节点
  function getPlayerRoot() {
    return document.querySelector('#movie_player') ||
           document.querySelector('.html5-video-player') ||
           document.body; // 兜底
  }

  // 控制面板（样式/结构不变）
  function createControlPanel() {
    const old = document.getElementById('bilingual-subtitle-panel');
    if (old) old.remove();
    const oldTab = document.getElementById('bilingual-reopen-tab');
    if (oldTab) oldTab.remove();

    controlPanel = createElement('div', {
      position: 'fixed',
      top: '70px',
      right: '20px',
      background: 'rgba(0,0,0,0.95)',
      color: '#fff',
      padding: '20px',
      borderRadius: '12px',
      zIndex: '2147483647',
      minWidth: '300px',
      maxWidth: '350px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      border: '2px solid #ff0000',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      fontSize: '14px',
      transform: GM_getValue('panelHidden', false) ? 'translateX(280px)' : 'translateX(0px)',
      transition: 'transform .25s ease',
    });
    controlPanel.id = 'bilingual-subtitle-panel';

    const header = createElement('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' });
    const title = createElement('h3', { margin: '0', fontSize: '16px', fontWeight: 'bold' }, '🎬 双语字幕');
    const toggleBtn = createElement('button', {
      background: '#ff4757', border: 'none', color: '#fff', fontSize: '16px',
      cursor: 'pointer', padding: '5px 10px', borderRadius: '4px', fontWeight: 'bold'
    }, GM_getValue('panelHidden', false) ? '+' : '−');
    toggleBtn.id = 'toggle-panel';
    header.appendChild(title);
    header.appendChild(toggleBtn);

    const content = createElement('div', { display: GM_getValue('panelHidden', false) ? 'none' : 'block' });
    content.id = 'panel-content';

    // 语言
    const langGroup = createElement('div', { marginBottom: '15px' });
    langGroup.appendChild(createElement('label', { display: 'block', marginBottom: '5px', fontSize: '12px', color: '#ccc' }, '翻译语言:'));
    const langSelect = createElement('select', {
      width: '100%',
      padding: '8px',
      border: '1px solid #444',
      borderRadius: '6px',
      background: '#222',
      color: 'white',
      fontSize: '12px',
    });
    langSelect.id = 'target-lang';
    Object.entries(languages).forEach(([code, name]) => {
      const opt = createElement('option', {}, name);
      opt.value = code;
      if (code === config.targetLang) opt.selected = true;
      langSelect.appendChild(opt);
    });
    langGroup.appendChild(langSelect);

    // 显示原文
    const originalGroup = createElement('div', { marginBottom: '15px' });
    const originalLabel = createElement('label', { display: 'flex', alignItems: 'center', fontSize: '12px', color: '#ccc', cursor: 'pointer' });
    const originalCheckbox = createElement('input');
    originalCheckbox.type = 'checkbox';
    originalCheckbox.id = 'show-original';
    originalCheckbox.checked = config.showOriginal;
    originalCheckbox.style.marginRight = '8px';
    originalLabel.appendChild(originalCheckbox);
    originalLabel.appendChild(createElement('span', {}, '显示原始字幕'));
    originalGroup.appendChild(originalLabel);

    // 隐藏原生字幕（仅视觉）
    const hideNativeGroup = createElement('div', { marginBottom: '15px' });
    const hideNativeLabel = createElement('label', { display: 'flex', alignItems: 'center', fontSize: '12px', color: '#ccc', cursor: 'pointer' });
    const hideNativeCb = createElement('input');
    hideNativeCb.type = 'checkbox';
    hideNativeCb.id = 'hide-native-cc';
    hideNativeCb.checked = config.hideNativeCC;
    hideNativeCb.style.marginRight = '8px';
    hideNativeLabel.appendChild(hideNativeCb);
    hideNativeLabel.appendChild(createElement('span', {}, '隐藏原生字幕（仅视觉隐藏）'));
    hideNativeGroup.appendChild(hideNativeLabel);

    // 字体
    const fontGroup = createElement('div', { marginBottom: '15px' });
    fontGroup.appendChild(createElement('label', { display: 'block', marginBottom: '5px', fontSize: '12px', color: '#ccc' }, '字体大小:'));
    const fontSlider = createElement('input');
    fontSlider.type = 'range';
    fontSlider.id = 'font-size';
    fontSlider.min = '12';
    fontSlider.max = '24';
    fontSlider.value = config.fontSize;
    fontSlider.style.width = '100%';
    const fontValue = createElement('span', { fontSize: '11px', color: '#999' }, config.fontSize + 'px');
    fontValue.id = 'font-size-value';
    fontGroup.appendChild(fontSlider);
    fontGroup.appendChild(fontValue);

    // 位置
    const posGroup = createElement('div', { marginBottom: '15px' });
    posGroup.appendChild(createElement('label', { display: 'block', marginBottom: '5px', fontSize: '12px', color: '#ccc' }, '字幕位置:'));
    const posSelect = createElement('select', {
      width: '100%',
      padding: '8px',
      border: '1px solid #444',
      borderRadius: '6px',
      background: '#222',
      color: 'white',
      fontSize: '12px',
    });
    posSelect.id = 'subtitle-position';
    [
      { value: 'bottom', text: '底部' },
      { value: 'top', text: '顶部' },
    ].forEach((p) => {
      const o = createElement('option', {}, p.text);
      o.value = p.value;
      if (p.value === config.position) o.selected = true;
      posSelect.appendChild(o);
    });

    // 状态
    const statusGroup = createElement('div', { marginBottom: '15px' });
    const statusText = createElement('div', { fontSize: '11px', color: '#999', textAlign: 'center' }, '状态: ');
    statusElement = createElement('span', { color: '#4fc3f7' }, '等待字幕...');
    statusElement.id = 'status-text';
    statusText.appendChild(statusElement);
    statusGroup.appendChild(statusText);

    // 按钮
    const clearBtn = createElement(
      'button',
      { width: '100%', padding: '8px', background: '#ff4757', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', marginBottom: '10px' },
      '清除翻译缓存'
    );
    clearBtn.id = 'clear-cache';
    const testBtn = createElement(
      'button',
      { width: '100%', padding: '8px', background: '#2ed573', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' },
      '测试翻译'
    );
    testBtn.id = 'test-translation';

    // 组装
    content.appendChild(langGroup);
    content.appendChild(originalGroup);
    content.appendChild(hideNativeGroup);
    content.appendChild(fontGroup);
    content.appendChild(posGroup);
    content.appendChild(statusGroup);
    content.appendChild(clearBtn);
    content.appendChild(testBtn);

    controlPanel.appendChild(header);
    controlPanel.appendChild(content);
    document.body.appendChild(controlPanel);

    // 抽拉手（保持）
    const reopenTab = createElement('div', {
      position: 'fixed',
      top: '120px',
      right: '0px',
      width: '28px',
      height: '96px',
      background: '#ff4757',
      color: '#fff',
      borderTopLeftRadius: '8px',
      borderBottomLeftRadius: '8px',
      display: GM_getValue('panelHidden', false) ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      zIndex: '2147483647',
      boxShadow: '0 4px 12px rgba(0,0,0,.4)',
      userSelect: 'none',
      fontWeight: 'bold'
    }, '≡');
    reopenTab.title = '点击展开双语字幕面板（Alt+Shift+B 也可切换）';
    reopenTab.id = 'bilingual-reopen-tab';
    document.body.appendChild(reopenTab);

    const showPanel = () => {
      const c = document.getElementById('panel-content');
      if (!c) return;
      c.style.display = 'block';
      controlPanel.style.transform = 'translateX(0px)';
      toggleBtn.textContent = '−';
      GM_setValue('panelHidden', false);
      const tab = document.getElementById('bilingual-reopen-tab');
      if (tab) tab.style.display = 'none';
    };

    const hidePanel = () => {
      const c = document.getElementById('panel-content');
      if (!c) return;
      c.style.display = 'none';
      controlPanel.style.transform = 'translateX(280px)';
      toggleBtn.textContent = '+';
      GM_setValue('panelHidden', true);
      const tab = document.getElementById('bilingual-reopen-tab');
      if (tab) tab.style.display = 'flex';
    };

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const isHidden = content.style.display === 'none';
      isHidden ? showPanel() : hidePanel();
    });
    reopenTab.addEventListener('click', (e) => {
      e.preventDefault();
      showPanel();
    });

    function ensurePanelOnScreen() {
      const rect = controlPanel.getBoundingClientRect();
      const vw = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
      const vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
      if (rect.left >= vw || rect.right <= 0 || rect.top >= vh || rect.bottom <= 0) {
        showPanel();
        controlPanel.style.right = '20px';
        controlPanel.style.top = '70px';
      }
    }
    ensurePanelOnScreen();
    window.addEventListener('resize', ensurePanelOnScreen);

    // 其它控件事件（保持）
    langSelect.addEventListener('change', (e) => {
      config.targetLang = e.target.value;
      GM_setValue('targetLang', config.targetLang);
      sentenceCache.clear();
      updateStatus('语言已更改');
    });

    originalCheckbox.addEventListener('change', (e) => {
      config.showOriginal = e.target.checked;
      GM_setValue('showOriginal', config.showOriginal);
      updateSubtitleDisplay();
    });

    hideNativeCb.addEventListener('change', (e) => {
      config.hideNativeCC = e.target.checked;
      GM_setValue('hideNativeCC', config.hideNativeCC);
      applyHideNativeCC(config.hideNativeCC);
    });

    fontSlider.addEventListener('input', (e) => {
      config.fontSize = parseInt(e.target.value, 10);
      fontValue.textContent = config.fontSize + 'px';
      GM_setValue('fontSize', config.fontSize);
      updateSubtitleDisplay();
    });

    posSelect.addEventListener('change', (e) => {
      config.position = e.target.value;
      GM_setValue('subtitlePosition', config.position);
      updateSubtitleDisplay();
    });

    clearBtn.addEventListener('click', (e) => {
      e.preventDefault();
      sentenceCache.clear();
      updateStatus('缓存已清除');
    });

    testBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      updateStatus('测试中...');
      const result = await translateText('Hello World', config.targetLang);
      updateStatus(`测试成功: ${result}`);
      showBilingualSubtitle('This is a test subtitle for the bilingual subtitle tool.');
      setTimeout(hideSubtitle, 2500);
    });
  }

  function updateStatus(message) {
    if (statusElement) {
      statusElement.textContent = message;
      statusElement.style.color = '#4fc3f7';
    }
  }

  // 字幕容器（样式保持）
  function createSubtitleContainer() {
    const old = document.getElementById('bilingual-subtitles');
    if (old) old.remove();

    playerRoot = getPlayerRoot();

    subtitleContainer = createElement('div', {
      position: 'absolute',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'rgba(0, 0, 0, 0.9)',
      color: 'white',
      padding: '10px 16px',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      textAlign: 'center',
      zIndex: '2147483646',
      maxWidth: '86%',
      lineHeight: '1.35',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      display: 'none',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    });
    subtitleContainer.id = 'bilingual-subtitles';

    (playerRoot || document.body).appendChild(subtitleContainer);

    if (resizeObs) resizeObs.disconnect();
    resizeObs = new ResizeObserver(() => updateSubtitleDisplay());
    resizeObs.observe(playerRoot || document.body);

    updateSubtitleDisplay();
  }

  function updateSubtitleDisplay() {
    if (!subtitleContainer) return;

    subtitleContainer.style.fontSize = config.fontSize + 'px';

    const SAFE_OFFSET = 14; // 与原生字幕的安全间距
    if (config.position === 'top') {
      subtitleContainer.style.top = '8%';
      subtitleContainer.style.bottom = 'auto';
    } else {
      subtitleContainer.style.bottom = `calc(12% + ${SAFE_OFFSET}px)`;
      subtitleContainer.style.top = 'auto';
    }
  }

  // 视觉隐藏/恢复原生字幕（不影响抓取）
  function applyHideNativeCC(hide) {
    const cc = document.querySelector('.ytp-caption-window-container');
    if (!cc) return;
    cc.style.opacity = hide ? '0' : '';
    cc.style.pointerEvents = hide ? 'none' : '';
  }

  // 从原生字幕容器抓取文本（不依赖 opacity，隐藏时也能抓到）
  function getSubtitleText() {
    const container = document.querySelector('.ytp-caption-window-container');
    if (!container || container.offsetParent === null) return null;

    const segments = container.querySelectorAll('.ytp-caption-segment');
    let text = '';
    segments.forEach((seg) => {
      const style = window.getComputedStyle(seg);
      if (style && style.display !== 'none' && style.visibility !== 'hidden') {
        const t = seg.textContent || '';
        if (t.trim()) text += (text ? ' ' : '') + t.trim();
      }
    });

    return text || null;
  }

  // 显示双语字幕：整体替换字幕容器内容，保持同步出现
  async function showBilingualSubtitle(originalText) {
    if (!subtitleContainer || !originalText) return;
    originalText = originalText.trim();
    if (originalText === currentSubtitle) return;

    currentSubtitle = originalText;
    updateStatus('翻译中...');

    try {
      const translatedTextRaw = await translateText(currentSubtitle, config.targetLang);
      const translatedText = (translatedTextRaw || '').trim();

      const same = normalize(translatedText) === normalize(currentSubtitle);

      subtitleContainer.textContent = '';

      if (!same) {
        const translatedDiv = createElement('div', { color: '#4fc3f7', marginBottom: config.showOriginal ? '5px' : '0', fontWeight: 'bold' }, translatedText);
        subtitleContainer.appendChild(translatedDiv);
        if (config.showOriginal) {
          const originalDiv = createElement('div', { color: '#e0e0e0', fontSize: '0.9em', opacity: '0.85' }, currentSubtitle);
          subtitleContainer.appendChild(originalDiv);
        }
        updateStatus('字幕已显示');
      } else {
        const onlyDiv = createElement('div', { color: '#e0e0e0', fontWeight: 'bold' }, currentSubtitle);
        subtitleContainer.appendChild(onlyDiv);
        updateStatus('同文无需翻译');
      }

      subtitleContainer.style.display = 'block';
      lastInstantText = same ? currentSubtitle : translatedText;
    } catch (e) {
      console.error('显示字幕失败:', e);
      updateStatus('翻译失败（已保留原文）');
      // 保留即时原文，不清空容器避免闪烁
    }
  }

  // 隐藏字幕，整体隐藏并清空
  function hideSubtitle() {
    if (subtitleContainer) {
      subtitleContainer.style.display = 'none';
      subtitleContainer.textContent = '';
      currentSubtitle = '';
      lastInstantText = '';
      updateStatus('等待字幕...');
    }
  }

  // =============== 监听逻辑（修复同步问题） ===============
  const debouncedCheck = debounce(() => {
    const t = getSubtitleText();
    if (t && t !== currentSubtitle) {
      throttledApply(t);
    } else if (!t && currentSubtitle) {
      hideSubtitle();
    }
  }, 220);

  const throttledApply = throttle((t) => showBilingualSubtitle(t), 200);

  function observeCaptions() {
    disconnectCaptionObserver();

    const container = document.querySelector('.ytp-caption-window-container');
    if (!container) return;

    captionObserver = new MutationObserver(() => {
      const raw = getSubtitleText();
      if (raw) showOriginalInstant(raw);
      debouncedCheck();
    });
    captionObserver.observe(container, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    if (pollIntervalId) clearInterval(pollIntervalId);
    pollIntervalId = setInterval(() => {
      const raw = getSubtitleText();
      if (raw) showOriginalInstant(raw);
      debouncedCheck();
    }, 800);
  }

  function observePlayer() {
    disconnectPlayerObserver();

    const player = getPlayerRoot();
    playerObserver = new MutationObserver(() => {
      if (document.querySelector('.ytp-caption-window-container')) {
        observeCaptions();
      }
    });
    playerObserver.observe(player || document.body, { childList: true, subtree: true });
  }

  function disconnectCaptionObserver() {
    if (captionObserver) {
      captionObserver.disconnect();
      captionObserver = null;
    }
    if (pollIntervalId) {
      clearInterval(pollIntervalId);
      pollIntervalId = null;
    }
  }

  function disconnectPlayerObserver() {
    if (playerObserver) {
      playerObserver.disconnect();
      playerObserver = null;
    }
  }

  // ---------------- 初始化 & 清理 ----------------
  function cleanup() {
    disconnectCaptionObserver();
    disconnectPlayerObserver();
    if (resizeObs) { resizeObs.disconnect(); resizeObs = null; }
    const oldPanel = document.getElementById('bilingual-subtitle-panel'); if (oldPanel) oldPanel.remove();
    const oldTab = document.getElementById('bilingual-reopen-tab'); if (oldTab) oldTab.remove();
    const oldSubs = document.getElementById('bilingual-subtitles'); if (oldSubs) oldSubs.remove();
    currentSubtitle = '';
    lastInstantText = '';
  }

  function forceInit() {
    if (isInitialized) return;
    try {
      cleanup();
      createControlPanel();
      createSubtitleContainer();
      observePlayer();
      observeCaptions();
      applyHideNativeCC(config.hideNativeCC);

      isInitialized = true;
      updateStatus('工具已就绪');
      console.log('双语字幕工具初始化完成！');
    } catch (e) {
      console.error('初始化失败:', e);
      setTimeout(() => { isInitialized = false; forceInit(); }, 2000);
    }
  }

  // 页面加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceInit);
  } else {
    forceInit();
  }

  // URL 变化（单页应用）
  setInterval(() => {
    if (location.href !== currentUrl) {
      currentUrl = location.href;
      console.log('页面URL变化，重新初始化...');
      isInitialized = false;
      forceInit();
    }
  }, 800);

  // 全局快捷键：Alt + Shift + B 切换显示/隐藏面板
  window.addEventListener('keydown', (e) => {
    if (e.altKey && e.shiftKey && (e.key.toLowerCase && e.key.toLowerCase() === 'b')) {
      const panel = document.getElementById('bilingual-subtitle-panel');
      const content = document.getElementById('panel-content');
      const tab = document.getElementById('bilingual-reopen-tab');
      if (!panel || !content) return;
      const hidden = content.style.display === 'none';
      if (hidden) {
        content.style.display = 'block';
        panel.style.transform = 'translateX(0px)';
        GM_setValue('panelHidden', false);
        if (tab) tab.style.display = 'none';
      } else {
        content.style.display = 'none';
        panel.style.transform = 'translateX(280px)';
        GM_setValue('panelHidden', true);
        if (tab) tab.style.display = 'flex';
      }
    }
  });
})();