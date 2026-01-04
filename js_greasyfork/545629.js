// ==UserScript==
// @name         Chrome Translator
// @namespace    https://ndllz.cn/
// @version      1.2.0
// @description  Chrome 浏览器原生翻译功能的沉浸式翻译脚本，支持整页翻译、保留原文对照和自动翻译新增内容
// @author       ndllz
// @match        *://*/*
// @run-at       document-end
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/545629/Chrome%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/545629/Chrome%20Translator.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // --------------------------
    // Config
    // --------------------------
    const LANGUAGES = [
      'zh-Hans','zh-Hant','en','ja','ru','ko','es','fr','de','pt','it','nl','sv',
      'da','fi','no','id','th','pl','tr','vi','ar','hi','bn','kn','mr','hr','cs',
      'hu','uk','he','bg','ro','te','lt','sl','el','ta'
    ];
    const STORAGE_KEYS = {
      source: 'ft_source_lang',
      target: 'ft_target_lang',
      autoObserve: 'ft_auto_observe_',
      position: 'ft_position',
      disabled: 'ft_disabled',
      siteDisabled: 'ft_site_disabled_',
      wordSelection: 'ft_word_selection_global', // 全局划词翻译开关
    };


    // --------------------------
    // Utils: page-context API access
    // --------------------------
    const pageWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    function hasTranslator() { return 'Translator' in pageWindow; }
    function hasLanguageDetector() { return 'LanguageDetector' in pageWindow; }
    const DEFAULTS = inferDefaultPair();

    // DisplayNames for language labels
    const displayNames = (() => {
      try {
        if ('Intl' in window && 'DisplayNames' in Intl) {
          const locales = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en-US'];
          return new Intl.DisplayNames(locales, { type: 'language' });
        }
      } catch {}
      return null;
    })();
    function langLabel(code) {
      if (!displayNames) return code;
      try {
        const l = displayNames.of(code);
        return l ? `${l} <${code}>` : code;
      } catch {
        return code;
      }
    }

    function inferDefaultPair() {
      const nav = navigator.language || 'en-US';
      const isZh = /^zh\b/i.test(nav);
      return {
        source: hasLanguageDetector() ? 'auto' : (isZh ? 'zh-Hans' : 'en'),
        target: 'zh-Hans',
        autoObserve: false,
        position: { top: 50, right: 12 },
      };
    }

    function getStored(key, fallback) {
      try { return GM_getValue ? GM_getValue(key, fallback) : fallback; } catch { return fallback; }
    }
    function setStored(key, val) {
      try { GM_setValue && GM_setValue(key, val); } catch {}
    }

    // --------------------------
    // Register menu commands
    // --------------------------
    if (typeof GM_registerMenuCommand === 'function') {
      GM_registerMenuCommand('重新启用 Chrome Translator', () => {
        setStored(STORAGE_KEYS.disabled, false);
        setStored(STORAGE_KEYS.siteDisabled + location.hostname, false);
        location.reload();
      });

      GM_registerMenuCommand('清除本站禁用状态', () => {
        setStored(STORAGE_KEYS.siteDisabled + location.hostname, false);
        location.reload();
      });
    }

    // --------------------------
    // Check if disabled
    // --------------------------
    if (getStored(STORAGE_KEYS.disabled, false)) {
      console.log('[ChromeTranslator] Permanently disabled');
      return;
    }
    if (getStored(STORAGE_KEYS.siteDisabled + location.hostname, false)) {
      console.log('[ChromeTranslator] Disabled for this site');
      return;
    }

    // --------------------------
    // State variables - 需要在buildUI之前定义
    // --------------------------
  let sourceLang = getStored(STORAGE_KEYS.source, DEFAULTS.source);
  let targetLang = getStored(STORAGE_KEYS.target, DEFAULTS.target);
  let autoObserve = !!getStored(STORAGE_KEYS.autoObserve + location.hostname, DEFAULTS.autoObserve);
  let detectorInstance = null;
  let translatorInstance = null;
  let inProgress = false;
  let observer = null;
  let lastPairKey = '';
  const MAX_CONCURRENCY = Math.min(4, Math.max(1, (navigator.hardwareConcurrency || 4) - 2));
  let keepOriginal = true; // 默认保留原文
  let isPageTranslated = false; // 跟踪页面翻译状态
  let wordSelectionEnabled = !!getStored(STORAGE_KEYS.wordSelection, false); // 全局划词翻译开关
  let selectionBubble = null; // 划词翻译悬浮框
  let translationPopup = null; // 翻译结果弹窗
  let currentAbortController = null; // 用于取消翻译的控制器

    // --------------------------
    // UI
    // --------------------------
    let ui;
    try {
      injectStyles();
      ui = buildUI();
      document.documentElement.appendChild(ui.container);
      console.log('[ChromeTranslator] UI initialized successfully');
    } catch (error) {
      console.error('[ChromeTranslator] UI initialization failed:', error);
      return;
    }

  // 检查页面是否已翻译
  function checkPageTranslationStatus() {
    const pairs = document.querySelectorAll('span.ft-pair');
    const oldTranslated = document.querySelectorAll('[data-ft-original]');
    const newTranslated = document.querySelectorAll('[data-ft-original-html]');
    return pairs.length > 0 || oldTranslated.length > 0 || newTranslated.length > 0;
  }

    // init UI selections
    populateSelect(ui.sourceSelect, buildSourceOptions());
    populateSelect(ui.targetSelect, buildTargetOptions());
    ui.sourceSelect.value = sourceLang;
    ui.targetSelect.value = targetLang;
    ui.observeCheckbox.checked = autoObserve;
    // keepOriginal will be bound after UI is extended below

    // bind events
    ui.translateBtn.addEventListener('click', () => translatePage(false));
    ui.observeCheckbox.addEventListener('change', (e) => {
      autoObserve = e.target.checked;
      setStored(STORAGE_KEYS.autoObserve + location.hostname, autoObserve);
      setupObserver(autoObserve);
    });
    // 保留原文功能已默认启用
    ui.sourceSelect.addEventListener('change', () => {
      sourceLang = ui.sourceSelect.value;
      setStored(STORAGE_KEYS.source, sourceLang);
    });
    ui.targetSelect.addEventListener('change', () => {
      targetLang = ui.targetSelect.value;
      setStored(STORAGE_KEYS.target, targetLang);
      ui.container.updateFabTooltip(); // 更新提示词
    });

      // auto observe initially
  setupObserver(autoObserve);

  // 初始化保留原文功能（默认启用）
  toggleKeepOriginal(keepOriginal);

  // 初始化时检查页面翻译状态
  isPageTranslated = checkPageTranslationStatus();

  // 根据页面状态设置悬浮按钮样式
  if (isPageTranslated) {
    ui.fab.classList.add('ft-translated');
  }

  // 初始化划词翻译
  if (wordSelectionEnabled) {
    setupSelectionListeners();
  }

    // --------------------------
    // Core: Translate workflow
    // --------------------------
    async function translatePage(isFromObserver) {
      if (inProgress) return;
      inProgress = true;
      
      // 创建新的AbortController用于取消翻译
      currentAbortController = new AbortController();
      
      // 添加翻译中状态指示器
      ui.fab.classList.add('ft-translating');
      ui.fab.classList.remove('ft-translated');
      
      setPanelBusy(true);
      setButtonState('loading', '准备翻译...');
      try {
        const availabilityOk = await ensureAvailability();
        if (!availabilityOk) return;

        const realSource = await resolveRealSourceLanguage();
        const pairKey = `${realSource}->${targetLang}`;
        const instanceOk = await ensureTranslator(realSource, targetLang);
        if (!instanceOk) return;

        if (pairKey !== lastPairKey) {
          // pair changed; helpful to re-run from scratch to avoid mixed language
          lastPairKey = pairKey;
        }

                const nodes = collectTextElements(document.body);
        const scanText = `扫描到 ${nodes.length} 个文本元素，开始并行翻译（并发 ${MAX_CONCURRENCY}）`;
        ui.progressText.textContent = scanText + '...';
        setButtonState('loading', scanText);
        setProgress(0, true);

        const useWorker = await canUseWorkerTranslator(realSource, targetLang);
        let done = 0;
        const updateProgress = () => {
          if (done % 20 === 0 || done === nodes.length) {
            const percentage = nodes.length > 0 ? (done / nodes.length) * 100 : 0;
            const progressText = `已翻译 ${done}/${nodes.length}`;
            ui.progressText.textContent = progressText;
            setButtonState('loading', progressText);
            setProgress(percentage, true);
          }
        };

        if (useWorker) {
          const pool = await createWorkerPool(MAX_CONCURRENCY, realSource, targetLang);
          try {
            const tasks = nodes.map(({ element, original }) => async () => {
              if (currentAbortController?.signal.aborted) return;
              if (!original.trim()) { done++; updateProgress(); return; }
              try {
                const translated = await pool.translate(original.replace(/\n/g, '<br>'));
                if (currentAbortController?.signal.aborted) return;
                const pretty = (translated || '').replace(/<br>/g, '\n').trim();
                applyTranslationToElement(element, original, pretty);
              } catch {}
              finally { done++; updateProgress(); }
            });
            await runWithConcurrency(tasks, MAX_CONCURRENCY);
          } finally { pool.terminate(); }
        }
        else {
          // Fallback: main-thread concurrency using a single translator instance
          const limit = createLimiter(Math.max(2, Math.min(3, MAX_CONCURRENCY)));
          await Promise.all(nodes.map(({ element, original }) => limit(async () => {
            if (currentAbortController?.signal.aborted) return;
            if (!original.trim()) { done++; updateProgress(); return; }
            try {
              const translated = await translateStreaming(`${original.replace(/\n/g, '<br>')}`);
              if (currentAbortController?.signal.aborted) return;
              const pretty = (translated || '').replace(/<br>/g, '\n').trim();
              applyTranslationToElement(element, original, pretty);
            } catch {}
            finally { done++; updateProgress(); }
          })));
        }

        // 检查翻译是否被取消
        if (currentAbortController?.signal.aborted) {
          const cancelText = '翻译已取消';
          ui.progressText.textContent = cancelText;
          ui.fab.classList.remove('ft-translating');
          setButtonState('idle', cancelText);
          setProgress(0, false);
          return;
        }

              const completeText = `翻译完成：${done}/${nodes.length}`;
              ui.progressText.textContent = completeText;

      // 更新翻译状态
      isPageTranslated = true;

      // 移除翻译中状态，添加已翻译状态
      ui.fab.classList.remove('ft-translating');
      ui.fab.classList.add('ft-success', 'ft-translated');
      ui.container.updateFabTooltip(); // 更新提示词
      setButtonState('success', `翻译完成 ${done}/${nodes.length}`);
      setProgress(100, false); // 隐藏进度条
      setTimeout(() => {
        ui.fab.classList.remove('ft-success');
        // 保留ft-translated状态指示
      }, 3000); // 3秒后移除成功状态

      } catch (err) {
        showError(err);
        ui.fab.classList.remove('ft-translating');
        setButtonState('error', '翻译失败');
        setProgress(0, false); // 隐藏进度条
      } finally {
        // 确保移除翻译中状态
        ui.fab.classList.remove('ft-translating');
        setPanelBusy(false);
        inProgress = false;
        currentAbortController = null;

        // ensure UI is still present after translation
        setTimeout(() => {
          if (!document.querySelector('.ft-ui')) {
            console.warn('[ChromeTranslator] UI missing after translation, restoring...');
            try {
              document.documentElement.appendChild(ui.container);
            } catch (e) {
              console.error('[ChromeTranslator] Failed to restore UI after translation:', e);
            }
          }
        }, 100);
      }
    }

    function cancelTranslation() {
      if (currentAbortController) {
        currentAbortController.abort();
        console.log('[ChromeTranslator] 翻译已取消');
        const restoreText = '翻译已取消，正在还原...';
        ui.progressText.textContent = restoreText;
        setButtonState('loading', restoreText);
      }
    }

    function restorePage() {
      // 如果正在翻译，先取消翻译
      if (inProgress && currentAbortController) {
        cancelTranslation();
        // 给一点时间让取消操作生效
        setTimeout(() => {
          performRestore();
        }, 100);
        return;
      }
      
      performRestore();
    }

    function performRestore() {
      let restored = 0;
      
      // 首先处理新的元素级翻译还原
      const translatedElements = Array.from(document.querySelectorAll('[data-ft-original-html]'));
      for (const element of translatedElements) {
        const originalHTML = element.getAttribute('data-ft-original-html');
        if (originalHTML) {
          element.innerHTML = originalHTML;
          element.removeAttribute('data-ft-original');
          element.removeAttribute('data-ft-original-html');
          element.removeAttribute('data-ft-original-text');
          restored++;
        }
      }
      
      // unwrap ft-pair wrappers (旧的文本节点级翻译)
      const pairs = Array.from(document.querySelectorAll('span.ft-pair'));
      for (const w of pairs) {
        const original = w.getAttribute('data-ft-original-text') || w.querySelector('.ft-original')?.textContent || '';
        const leading = w.getAttribute('data-ft-leading') || '';
        const trailing = w.getAttribute('data-ft-trailing') || '';
        const textNode = document.createTextNode(leading + original + trailing);
        w.replaceWith(textNode);
        restored++;
      }
      
      // compatibility: old style replacements
      const iter = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      let node;
      while ((node = iter.nextNode())) {
        const parent = node.parentElement;
        if (!parent) continue;
        if (parent.closest('.ft-ui')) continue;
        if (parent.hasAttribute('data-ft-original')) {
          node.textContent = parent.getAttribute('data-ft-original-text') || node.textContent;
          parent.removeAttribute('data-ft-original');
          parent.removeAttribute('data-ft-original-text');
          restored++;
        }
      }
          const restoreCompleteText = `已还原 ${restored} 个元素`;
          ui.progressText.textContent = restoreCompleteText;

    // 更新翻译状态
    isPageTranslated = false;

    // 显示成功状态并移除翻译状态
    ui.fab.classList.add('ft-success');
    ui.fab.classList.remove('ft-translated');
          ui.container.updateFabTooltip(); // 更新提示词
    setButtonState('success', `已还原 ${restored} 个节点`);
    setTimeout(() => {
      ui.fab.classList.remove('ft-success');
    }, 2000); // 2秒后移除成功状态
    }

    function setupObserver(enabled) {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
      if (!enabled) return;
      observer = new MutationObserver((mutations) => {
        // check if UI was accidentally removed and restore it
        if (!document.querySelector('.ft-ui')) {
          console.warn('[ChromeTranslator] UI was removed, restoring...');
          try {
            document.documentElement.appendChild(ui.container);
          } catch (e) {
            console.error('[ChromeTranslator] Failed to restore UI:', e);
          }
        }

        // debounce: translate new nodes only
        const added = [];
        for (const m of mutations) {
          m.addedNodes && added.push(...m.addedNodes);
        }
        const needTranslation = added.some(n => n.nodeType === 1 && !n.closest?.('.ft-ui'));
        if (needTranslation) {
          // schedule lightly
          setTimeout(() => translatePage(true), 600);
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    // --------------------------
    // Translator/Detector helpers
    // --------------------------
    async function ensureAvailability() {
      if (!hasTranslator()) {
        ui.statusText.textContent = '此浏览器不支持原生翻译（需 Chrome 138+）';
        return false;
      }
      return true;
    }

    async function ensureDetector() {
      if (!hasLanguageDetector() || sourceLang !== 'auto') return null;
      if (detectorInstance) return detectorInstance;
      setPanelBusy(true, '下载语言检测模型中...');
      try {
        detectorInstance = await pageWindow.LanguageDetector.create({
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              if (typeof e.loaded === 'number') {
                ui.statusText.textContent = `检测模型下载 ${(e.loaded * 100).toFixed(2)}%`;
              }
            });
          },
        });
        ui.statusText.textContent = '检测模型已就绪';
        return detectorInstance;
      } catch (e) {
        ui.statusText.textContent = '检测模型加载失败';
        return null;
      } finally {
        setPanelBusy(false);
      }
    }

    async function resolveRealSourceLanguage() {
      if (sourceLang !== 'auto') return sourceLang;
      const det = await ensureDetector();
      if (!det) return 'und';
      // sample: title + a bit of body text
      const sample = getSampleText(1500);
      const list = await det.detect(sample).catch(() => []);
      const lang = (list && list[0] && list[0].detectedLanguage) || 'und';
      return lang === 'und' ? 'und' : lang;
    }

    async function ensureTranslator(src, tgt) {
      setPanelBusy(true, '准备翻译模型...');
      try {
        // 检查当前实例是否匹配语言对且仍然有效
        if (translatorInstance &&
            translatorInstance.sourceLanguage === src &&
            translatorInstance.targetLanguage === tgt) {
          try {
            // 验证实例是否仍然可用（通过检查配额）
            await translatorInstance.measureInputUsage('test');
            ui.statusText.textContent = '翻译模型就绪';
            return true;
          } catch (error) {
            console.log('[ChromeTranslator] 现有翻译器实例无效，重新创建:', error.message);
            // 实例无效，销毁并重新创建
            try {
              translatorInstance.destroy();
            } catch (destroyError) {
              console.warn('[ChromeTranslator] 销毁翻译器实例失败:', destroyError);
            }
            translatorInstance = null;
          }
        } else if (translatorInstance) {
          // 语言对不匹配，销毁旧实例
          console.log('[ChromeTranslator] 语言对改变，销毁旧翻译器实例');
          try {
            translatorInstance.destroy();
          } catch (destroyError) {
            console.warn('[ChromeTranslator] 销毁翻译器实例失败:', destroyError);
          }
          translatorInstance = null;
        }

        // 检查翻译器可用性
        const availability = await pageWindow.Translator.availability({
          sourceLanguage: src,
          targetLanguage: tgt,
        });

        if (availability === 'unavailable') {
          ui.statusText.textContent = `不支持 ${src} -> ${tgt} 翻译`;
          return false;
        }

        ui.statusText.textContent = availability === 'available' ? '翻译模型已缓存，正在加载...' : '翻译模型下载中...';

        // 创建新的翻译器实例
        translatorInstance = await pageWindow.Translator.create({
          sourceLanguage: src,
          targetLanguage: tgt,
          monitor(m) {
            m.addEventListener('downloadprogress', (e) => {
              if (typeof e.loaded === 'number') {
                ui.statusText.textContent = `翻译模型 ${(e.loaded * 100).toFixed(2)}%`;
              }
            });
          },
        });

        ui.statusText.textContent = '翻译模型就绪';
        return true;
      } catch (e) {
        console.error('[ChromeTranslator] 翻译器初始化失败:', e);
        showError(e);
        // 确保清理无效实例
        if (translatorInstance) {
          try {
            translatorInstance.destroy();
          } catch (destroyError) {
            console.warn('[ChromeTranslator] 清理失败的翻译器实例时出错:', destroyError);
          }
          translatorInstance = null;
        }
        return false;
      } finally {
        setPanelBusy(false);
      }
    }

    async function translateStreaming(text) {
      const res = translatorInstance.translateStreaming(text);
      const reader = res.getReader();
      let out = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        out += value;
      }
      return out;
    }

    // --------------------------
    // Concurrency helpers and Worker pool
    // --------------------------
    function createLimiter(limit) {
      let active = 0;
      const queue = [];
      const next = () => {
        if (active >= limit || queue.length === 0) return;
        const { fn, resolve, reject } = queue.shift();
        active++;
        Promise.resolve()
          .then(fn)
          .then(resolve, reject)
          .finally(() => { active--; next(); });
      };
      return (fn) => new Promise((resolve, reject) => { queue.push({ fn, resolve, reject }); next(); });
    }

    async function runWithConcurrency(tasks, limit) {
      const limiter = createLimiter(limit);
      await Promise.all(tasks.map(task => limiter(task)));
    }

      async function canUseWorkerTranslator(src, tgt) {
    try {
      // 首先检测CSP是否允许创建Worker
      if (!canCreateWorker()) {
        console.log('[ChromeTranslator] Web Workers blocked by CSP, falling back to main thread');
        return false;
      }

      const url = createWorkerURL();
      const worker = new Worker(url);
      URL.revokeObjectURL(url);
      const ready = new Promise((resolve) => {
        const timer = setTimeout(() => { resolve(false); worker.terminate(); }, 3000);
        worker.onmessage = (e) => {
          if (e.data && e.data.type === 'ready') { clearTimeout(timer); resolve(true); worker.terminate(); }
          else if (e.data && e.data.type === 'error') { clearTimeout(timer); resolve(false); worker.terminate(); }
        };
      });
      worker.postMessage({ type: 'init-check' });
      return await ready;
    } catch (e) {
      console.log('[ChromeTranslator] Worker creation failed:', e.message);
      return false;
    }
  }

  function canCreateWorker() {
    try {
      // 尝试创建一个简单的Worker来检测CSP
      const testWorkerCode = 'self.postMessage("test");';
      const blob = new Blob([testWorkerCode], { type: 'application/javascript' });
      const workerURL = URL.createObjectURL(blob);
      const testWorker = new Worker(workerURL);
      testWorker.terminate();
      URL.revokeObjectURL(workerURL);
      return true;
    } catch (e) {
      // 如果创建Worker失败，说明被CSP阻止
      console.log('[ChromeTranslator] Worker creation blocked by CSP:', e.message);
      return false;
    }
  }

    function createWorkerURL() {
      const code = `self.onmessage = async (e) => {
    const data = e.data || {};
    try {
      if (data.type === 'init-check') {
        if ('Translator' in self) postMessage({ type: 'ready' });
        else postMessage({ type: 'error', message: 'Translator not in worker' });
        return;
      }
    } catch (err) { postMessage({ type: 'error', message: String(err) }); }
  };`;
      const blob = new Blob([code], { type: 'application/javascript' });
      return URL.createObjectURL(blob);
    }

      async function createWorkerPool(size, src, tgt) {
    // 在创建Worker池之前检查CSP
    if (!canCreateWorker()) {
      throw new Error('Web Workers are blocked by Content Security Policy. Falling back to main thread.');
    }

    // Build full worker script with translator support
    const code = `let translator = null;
self.onmessage = async (e) => {
  const msg = e.data || {};
  try {
    if (msg.type === 'init') {
      const availability = await self.Translator.availability({ sourceLanguage: msg.src, targetLanguage: msg.tgt });
      if (availability === 'unavailable') { postMessage({ type: 'init-error', message: 'unavailable' }); return; }
      translator = await self.Translator.create({ sourceLanguage: msg.src, targetLanguage: msg.tgt });
      postMessage({ type: 'inited' });
      return;
    }
    if (msg.type === 'translate') {
      if (!translator) { postMessage({ type: 'translate-error', id: msg.id, message: 'no-translator' }); return; }
      const res = translator.translateStreaming(msg.text);
      const reader = res.getReader();
      let out = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        out += value;
      }
      postMessage({ type: 'translated', id: msg.id, text: out });
      return;
    }
  } catch (err) {
    if (msg.type === 'translate') postMessage({ type: 'translate-error', id: msg.id, message: String(err) });
    else postMessage({ type: 'init-error', message: String(err) });
  }
};`;

    let url, workers;
    try {
      url = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
      workers = Array.from({ length: size }, () => new Worker(url));
      URL.revokeObjectURL(url);
    } catch (e) {
      if (url) URL.revokeObjectURL(url);
      console.log('[ChromeTranslator] Failed to create worker pool:', e.message);
      throw new Error('Failed to create worker pool due to CSP restrictions.');
    }

      await Promise.all(workers.map((w) => new Promise((resolve, reject) => {
        const timer = setTimeout(() => { w.terminate(); reject(new Error('init timeout')); }, 10000);
        w.onmessage = (e) => {
          if (e.data && e.data.type === 'inited') { clearTimeout(timer); resolve(null); }
        };
        w.onerror = (e) => { clearTimeout(timer); reject(new Error('worker error')); };
        w.postMessage({ type: 'init', src, tgt });
      })).catch((e) => {
        workers.forEach(w => w.terminate());
        throw e;
      }));

      let nextId = 1;
      const pending = new Map();
      let idx = 0;
      workers.forEach((w) => {
        w.onmessage = (e) => {
          const data = e.data || {};
          if (data.type === 'translated') {
            const entry = pending.get(data.id);
            if (entry) { pending.delete(data.id); entry.resolve(data.text); }
          } else if (data.type === 'translate-error') {
            const entry = pending.get(data.id);
            if (entry) { pending.delete(data.id); entry.reject(new Error(data.message || 'translate error')); }
          }
        };
      });

      function pick() { const w = workers[idx]; idx = (idx + 1) % workers.length; return w; }

      return {
        translate(text) {
          const id = nextId++;
          const worker = pick();
          const p = new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
          worker.postMessage({ type: 'translate', id, text });
          return p;
        },
        terminate() { workers.forEach(w => w.terminate()); pending.forEach(p => p.reject(new Error('terminated'))); pending.clear(); },
      };
    }

    // --------------------------
    // DOM: text nodes
    // --------------------------
    function collectTextElements(root) {
      const elements = [];
      const processedElements = new Set();
      
      // 获取所有包含文本的元素
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
        acceptNode(element) {
          // skip UI panel - critical to prevent UI removal
          if (element.closest('.ft-ui')) return NodeFilter.FILTER_REJECT;
          // skip hidden
          const style = getComputedStyle(element);
          if (style && (style.display === 'none' || style.visibility === 'hidden')) return NodeFilter.FILTER_REJECT;
          // skip code/script/etc
          const tag = element.tagName.toLowerCase();
          if (['script','style','noscript','textarea','input','code','pre','svg','math','kbd','samp'].includes(tag)) {
            return NodeFilter.FILTER_REJECT;
          }
          // skip marked notranslate
          if (element.closest('.notranslate,[translate="no"]')) return NodeFilter.FILTER_REJECT;
          // already translated using legacy flag or ft-pair wrapper
          if (element.hasAttribute('data-ft-original') || element.closest('.ft-pair')) return NodeFilter.FILTER_REJECT;
          
          return NodeFilter.FILTER_ACCEPT;
        }
      });
      
      let element;
      while ((element = walker.nextNode())) {
        // 检查这个元素是否包含直接的文本内容（非空白）
        const textContent = getElementTextContent(element);
        if (!textContent.trim()) continue;
        
        // 检查是否是文本容器（段落级元素）
        if (isTextContainer(element) && !hasTextContainerAncestor(element, processedElements)) {
          const original = textContent;
          elements.push({ 
            element: element, 
            original: original,
            leading: '',
            trailing: ''
          });
          processedElements.add(element);
        }
      }
      
      return elements;
    }
    
    function getElementTextContent(element) {
      // 获取元素的完整文本内容，保留内联元素的结构
      let text = '';
      for (const node of element.childNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          text += node.textContent;
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          // 对于内联元素，保留其文本内容
          const tag = node.tagName.toLowerCase();
          if (['a', 'span', 'strong', 'em', 'b', 'i', 'code', 'mark', 'small', 'sub', 'sup', 'u'].includes(tag)) {
            text += node.textContent;
          }
        }
      }
      return text;
    }
    
    function isTextContainer(element) {
      const tag = element.tagName.toLowerCase();
      // 段落级元素
      if (['p', 'div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th', 'blockquote', 'article', 'section'].includes(tag)) {
        return true;
      }
      // 检查是否有文本内容且包含内联元素
      const hasText = Array.from(element.childNodes).some(node => 
        node.nodeType === Node.TEXT_NODE && node.textContent.trim()
      );
      const hasInlineElements = Array.from(element.childNodes).some(node =>
        node.nodeType === Node.ELEMENT_NODE && 
        ['a', 'span', 'strong', 'em', 'b', 'i', 'code', 'mark', 'small', 'sub', 'sup', 'u'].includes(node.tagName.toLowerCase())
      );
      return hasText && hasInlineElements;
    }
    
    function hasTextContainerAncestor(element, processedElements) {
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        if (processedElements.has(parent) && isTextContainer(parent)) {
          return true;
        }
        parent = parent.parentElement;
      }
      return false;
    }

    function markTranslated(textNode, original) {
      const el = textNode.parentElement;
      if (!el) return;
      if (!el.hasAttribute('data-ft-original')) {
        el.setAttribute('data-ft-original', '1');
        el.setAttribute('data-ft-original-text', original);
      }
    }

    function getSampleText(limit) {
      const parts = [document.title || ''];
      const nodes = collectTextElements(document.body).slice(0, 200);
      for (const it of nodes) {
        parts.push(it.original);
        if (parts.join('\n').length > limit) break;
      }
      return parts.join('\n').slice(0, limit);
    }

    // --------------------------
    // UI building
    // --------------------------
    function buildSourceOptions() {
      const options = [];
      options.push({ value: 'auto', label: `自动检测` + (hasLanguageDetector() ? '' : '（不支持）'), disabled: !hasLanguageDetector() });
      for (const l of LANGUAGES) options.push({ value: l, label: langLabel(l) });
      return options;
    }
    function buildTargetOptions() {
      return LANGUAGES.map(l => ({ value: l, label: langLabel(l) }));
    }

    function populateSelect(select, options) {
      select.innerHTML = '';
      for (const opt of options) {
        const o = document.createElement('option');
        o.value = opt.value;
        o.textContent = opt.label;
        if (opt.disabled) o.disabled = true;
        select.appendChild(o);
      }
    }

        function setPanelBusy(busy, text) {
      ui.container.classList.toggle('ft-busy', !!busy);
      if (text) ui.statusText.textContent = text;
    }

    function showError(e) {
      console.error('[ChromeTranslator] error:', e);
      ui.statusText.textContent = `错误：${e?.message || e}`;
    }

    // 按钮状态管理
    function setButtonState(state, text) {
      const btn = ui.translateBtn;
      if (!btn) return;

      // 清除所有状态类
      btn.classList.remove('success', 'error');
      btn.disabled = false;

      // 移除加载动画
      const existingSpinner = btn.querySelector('.ft-loading-spinner');
      if (existingSpinner) {
        existingSpinner.remove();
      }

      switch (state) {
        case 'loading':
          btn.disabled = true;
          btn.innerHTML = `<div class="ft-loading-spinner"></div><span>翻译中...</span>`;
          // 进度信息显示在状态文本中，不在按钮上
          if (ui.statusText) {
            ui.statusText.textContent = text || '翻译中...';
          }
          break;
        case 'success':
          btn.classList.add('success');
          btn.textContent = '翻译';
          if (ui.statusText) {
            ui.statusText.textContent = text || '翻译完成';
            setTimeout(() => {
              if (ui.statusText) {
                ui.statusText.textContent = '翻译模型就绪';
              }
            }, 2000);
          }
          break;
        case 'error':
          btn.classList.add('error');
          btn.textContent = '翻译';
          if (ui.statusText) {
            ui.statusText.textContent = text || '翻译失败';
            setTimeout(() => {
              if (ui.statusText) {
                ui.statusText.textContent = '翻译模型就绪';
              }
            }, 3000);
          }
          break;
        case 'idle':
        default:
          btn.textContent = '翻译';
          if (ui.statusText && text) {
            ui.statusText.textContent = text;
          }
      }
    }

    // 进度条管理
    function setProgress(percentage, show = true) {
      if (!ui.progressContainer || !ui.progressBar) return;

      if (show) {
        ui.progressContainer.classList.remove('hidden');
        ui.progressBar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
      } else {
        ui.progressContainer.classList.add('hidden');
        ui.progressBar.style.width = '0%';
      }
    }

    function buildUI() {
      const container = document.createElement('div');
      container.className = 'ft-ui';

      // 恢复位置
      const savedPos = getStored(STORAGE_KEYS.position, DEFAULTS.position);
      container.style.top = savedPos.top + '%';
      container.style.right = savedPos.right + 'px';

      // 主悬浮按钮
      const fab = document.createElement('div');
      fab.className = 'ft-fab';
      fab.title = 'Chrome 翻译';

      // 状态指示器圆圈
      const statusIndicator = document.createElement('div');
      statusIndicator.className = 'ft-status-indicator';
      fab.appendChild(statusIndicator);

      // 移除拖拽手柄，直接使用悬浮按钮拖拽

      // 设置按钮（悬停显示）
      const settingsBtn = document.createElement('div');
      settingsBtn.className = 'ft-settings-btn';
      settingsBtn.innerHTML = '⚙';
      settingsBtn.title = '设置';

          // 移除关闭按钮

      // 设置面板（独立弹窗）
      const settingsPanel = document.createElement('div');
      settingsPanel.className = 'ft-settings-panel';

          // 移除关闭选项面板

      const panel = document.createElement('div');
      panel.className = 'ft-panel';

      const row1 = document.createElement('div');
      row1.className = 'ft-row';
      const sourceSelect = document.createElement('select');
      sourceSelect.className = 'ft-select';
      const arrow = document.createElement('span'); arrow.textContent = '→';
      const targetSelect = document.createElement('select');
      targetSelect.className = 'ft-select';
      row1.append(sourceSelect, arrow, targetSelect);

      const row2 = document.createElement('div');
      row2.className = 'ft-row';
      const translateBtn = document.createElement('button');
      translateBtn.className = 'ft-btn';
      translateBtn.textContent = '翻译整页';
      const restoreBtn = document.createElement('button');
      restoreBtn.className = 'ft-btn ghost';
      restoreBtn.textContent = '还原';
      row2.append(translateBtn, restoreBtn);

      const row3 = document.createElement('label');
      row3.className = 'ft-row ft-check';
      const observeCheckbox = document.createElement('input');
      observeCheckbox.type = 'checkbox';
      const observeText = document.createElement('span');
      observeText.textContent = '自动翻译新增内容';
      row3.append(observeCheckbox, observeText);

      const statusText = document.createElement('div');
      statusText.className = 'ft-status';
      statusText.textContent = hasTranslator() ? '就绪' : '此浏览器不支持原生翻译（需 Chrome 138+）';

      const progressText = document.createElement('div');
      progressText.className = 'ft-status ft-progress';
      progressText.textContent = '';

            // 构建设置面板内容 - 参考沉浸式翻译设计
      settingsPanel.innerHTML = `
        <div class="ft-settings-header">
          <span>翻译设置</span>
          <div class="ft-settings-close">×</div>
        </div>
        <div class="ft-lang-section">
          <div class="ft-lang-row">
            <select class="ft-lang-select ft-source-select">${row1.querySelector('select:first-of-type').innerHTML}</select>
            <div class="ft-lang-arrow">→</div>
            <select class="ft-lang-select ft-target-select">${row1.querySelector('select:last-of-type').innerHTML}</select>
          </div>
        </div>
        <div class="ft-main-action">
          <button class="ft-translate-btn">翻译</button>
        </div>
        <div class="ft-switches">
          <div class="ft-switch-item">
            <span class="ft-switch-label">自动翻译新增内容</span>
            <div class="ft-switch ft-auto-switch" data-checked="false">
              <input type="checkbox" style="display:none;">
            </div>
          </div>
          <div class="ft-switch-item">
            <span class="ft-switch-label">划词翻译（全局）</span>
            <div class="ft-switch ft-word-switch" data-checked="false">
              <input type="checkbox" style="display:none;">
            </div>
          </div>
          <div class="ft-shortcut-tip">
            <span class="ft-shortcut-text">💡 选中文本后按 <kbd>F2</kbd> 快速翻译</span>
          </div>
        </div>
        <div class="ft-status-section">
          <div class="ft-status-text">${statusText.textContent}</div>
          <div class="ft-progress-container hidden">
            <div class="ft-progress-bar" style="width:0%"></div>
          </div>
        </div>
      `;

          // 移除关闭选项面板

          // 组装容器
    container.append(fab, settingsBtn, panel, settingsPanel);

          // 拖拽功能 - 长按拖拽
    let isDragging = false;
    let dragStarted = false;
    let startY = 0;
    let startTop = 0;
    let longPressTimer = null;
    let mouseMoved = false;

    fab.addEventListener('mousedown', (e) => {
      // 只响应左键
      if (e.button !== 0) return;

      startY = e.clientY;
      startTop = parseFloat(container.style.top) || 50;
      dragStarted = false;
      mouseMoved = false;

      // 长按500ms后才能拖拽
      longPressTimer = setTimeout(() => {
        if (!mouseMoved) { // 只有在没有鼠标移动的情况下才进入拖拽模式
          isDragging = true;
          fab.classList.add('ft-dragging'); // 添加拖拽状态类
          document.addEventListener('mousemove', onDrag);
          document.addEventListener('mouseup', onDragEnd);
        }
      }, 500);

      // 监听鼠标移动，如果在长按期间移动则取消拖拽
      const onMouseMove = (e) => {
        const deltaY = Math.abs(e.clientY - startY);
        if (deltaY > 5) { // 移动超过5px就算移动
          mouseMoved = true;
          clearTimeout(longPressTimer);
          document.removeEventListener('mousemove', onMouseMove);
        }
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', () => {
        clearTimeout(longPressTimer);
        document.removeEventListener('mousemove', onMouseMove);
      }, { once: true });

      e.preventDefault();
    });

      function onDrag(e) {
        if (!isDragging) return;
        const deltaY = e.clientY - startY;
        const newTop = Math.max(5, Math.min(95, startTop + (deltaY / window.innerHeight) * 100));
        container.style.top = newTop + '%';
      }

          function onDragEnd() {
      clearTimeout(longPressTimer);

      if (isDragging) {
        isDragging = false;
        dragStarted = true;
        fab.classList.remove('ft-dragging'); // 移除拖拽状态类

        const newPos = {
          top: parseFloat(container.style.top) || 50,
          right: parseFloat(container.style.right) || 12
        };
        setStored(STORAGE_KEYS.position, newPos);
        document.removeEventListener('mousemove', onDrag);
        document.removeEventListener('mouseup', onDragEnd);

        // 延迟重置dragStarted状态，防止立即触发点击
        setTimeout(() => {
          dragStarted = false;
        }, 100);
      }
    }

    // 更新悬浮按钮的提示词
    function updateFabTooltip() {
      if (isPageTranslated) {
        fab.title = '点击切换到原文';
      } else {
        const targetLangName = langLabel(targetLang);
        fab.title = `点击翻译为${targetLangName}`;
      }
    }

    // 将更新函数添加到返回对象中
    container.updateFabTooltip = updateFabTooltip;

    // 处理点击事件（区分拖拽和点击）
    fab.addEventListener('click', (e) => {
      // 如果刚完成拖拽，不触发点击
      if (dragStarted || isDragging) {
        return;
      }

      // 智能切换：翻译和还原
      if (isPageTranslated || inProgress) {
        restorePage();
      } else {
        translatePage(false);
      }
    });

    // 初始化提示词
    updateFabTooltip();

      // 悬停显示控制按钮
      let hoverTimer;
      container.addEventListener('mouseenter', () => {
        clearTimeout(hoverTimer);
        container.classList.add('ft-hover');
      });
      container.addEventListener('mouseleave', () => {
        hoverTimer = setTimeout(() => container.classList.remove('ft-hover'), 300);
      });

          // 设置按钮点击
    settingsBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      settingsPanel.classList.toggle('ft-show');
    });

          // 移除关闭按钮相关事件监听器

      // 设置面板关闭
      settingsPanel.querySelector('.ft-settings-close').addEventListener('click', () => {
        settingsPanel.classList.remove('ft-show');
      });

          // 点击外部关闭面板
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target)) {
        settingsPanel.classList.remove('ft-show');
      }
    });

    // 自定义开关功能
    const autoSwitch = settingsPanel.querySelector('.ft-auto-switch');
    const wordSwitch = settingsPanel.querySelector('.ft-word-switch');

    // 初始化自动翻译开关
    const autoCheckbox = autoSwitch.querySelector('input[type="checkbox"]');
    autoSwitch.setAttribute('data-checked', autoObserve);
    autoCheckbox.checked = autoObserve;
    autoSwitch.classList.toggle('active', autoObserve);

    // 初始化划词翻译开关
    const wordCheckbox = wordSwitch.querySelector('input[type="checkbox"]');
    wordSwitch.setAttribute('data-checked', wordSelectionEnabled);
    wordCheckbox.checked = wordSelectionEnabled;
    wordSwitch.classList.toggle('active', wordSelectionEnabled);

    // 自动翻译开关事件
    autoSwitch.addEventListener('click', () => {
      const isChecked = autoSwitch.getAttribute('data-checked') === 'true';
      const newChecked = !isChecked;
      autoSwitch.setAttribute('data-checked', newChecked);
      autoCheckbox.checked = newChecked;
      autoSwitch.classList.toggle('active', newChecked);
      autoCheckbox.dispatchEvent(new Event('change'));
    });

    // 划词翻译开关事件
    wordSwitch.addEventListener('click', () => {
      const isChecked = wordSwitch.getAttribute('data-checked') === 'true';
      const newChecked = !isChecked;
      wordSwitch.setAttribute('data-checked', newChecked);
      wordCheckbox.checked = newChecked;
      wordSwitch.classList.toggle('active', newChecked);

      // 更新全局状态
      wordSelectionEnabled = newChecked;
      setStored(STORAGE_KEYS.wordSelection, newChecked);

      // 启用或禁用划词翻译监听器
      if (newChecked) {
        setupSelectionListeners();
      } else {
        removeSelectionListeners();
        hideSelectionBubble();
        hideTranslationPopup();
      }
    });

          return {
      container,
      sourceSelect: settingsPanel.querySelector('.ft-source-select'),
      targetSelect: settingsPanel.querySelector('.ft-target-select'),
      translateBtn: settingsPanel.querySelector('.ft-translate-btn'),
      restoreBtn: null, // 移除还原按钮，改为点击悬浮按钮切换
      observeCheckbox: autoCheckbox,
      statusText: settingsPanel.querySelector('.ft-status-text'),
      progressText: progressText,
      progressContainer: settingsPanel.querySelector('.ft-progress-container'),
      progressBar: settingsPanel.querySelector('.ft-progress-bar'),
      fab,
      statusIndicator,
      panel,
      settingsPanel,
    };
    }

    function injectStyles() {
      const css = `
  .ft-ui{ position:fixed !important; right:0 !important; transform:translateY(-50%) !important; z-index:2147483647 !important; font:14px/1.4 system-ui,-apple-system,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell !important; color:#333 !important; pointer-events:auto !important; }
  .ft-ui *{ box-sizing:border-box; }

  /* 主悬浮按钮 - 紧贴侧边，保持黑色 */
  .ft-fab{
    width:36px; height:36px;
    border-radius:18px 0 0 18px;
    background:#333;
    border:1px solid #555;
    box-shadow:0 4px 12px rgba(0,0,0,.2);
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    transition:all .3s ease; position:relative;
    transform:translateX(0); /* 始终紧贴右侧 */
    overflow:visible;
  }
  .ft-ui:hover .ft-fab{
    transform:translateX(-2px); /* 悬停时稍微左移 */
    background:#444;
  }

  /* 主图标 */
  .ft-fab::before{
    content:""; position:absolute; width:20px; height:20px;
    background:#fff;
    mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z' fill='currentColor'/%3E%3C/svg%3E") no-repeat center/contain;
    transition:all .3s ease;
    z-index:1;
  }

  /* 状态指示器 */
  .ft-fab::after{
    content:'';
    position:absolute;
    top:-2px;
    right:-2px;
    width:10px;
    height:10px;
    border-radius:50%;
    border:2px solid #fff;
    opacity:0;
    transform:scale(0.5);
    transition:all 0.3s ease;
    z-index:2;
  }

  /* 翻译进行中状态 - 显示黄色小圆圈 */
  .ft-fab.ft-translating::after{
    background:#f59e0b;
    opacity:1;
    transform:scale(1);
  }

  /* 翻译状态 - 已翻译页面，图标保持黑色，只显示绿色小圆圈 */
  .ft-fab.ft-translated::after{
    background:#10b981;
    opacity:1;
    transform:scale(1);
  }

  /* 成功状态 - 临时动画，图标保持黑色 */
  .ft-fab.ft-success{
    transform:translateX(-2px) scale(1.05) !important;
  }
  .ft-fab.ft-success::after{
    background:#10b981;
    opacity:1;
    transform:scale(1.2);
    box-shadow:0 0 8px rgba(16,185,129,0.5);
  }

  /* 错误状态 - 图标保持黑色，只显示红色小圆圈 */
  .ft-fab.ft-error::after{
    background:#ef4444;
    opacity:1;
    transform:scale(1);
  }

  /* 悬浮按钮拖拽状态 */
.ft-fab:active{ cursor:ns-resize !important; }
.ft-fab.ft-dragging{
  cursor:ns-resize !important;
  transform:translateX(-4px) scale(1.05) !important;
  box-shadow:0 8px 24px rgba(0,0,0,.4) !important;
}

  /* 设置按钮 */
  .ft-settings-btn{
    position:absolute; right:8px; bottom:-30px;
    width:24px; height:24px;
    border-radius:12px;
    background:rgba(255,255,255,.9);
    border:1px solid rgba(0,0,0,.1);
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; font-size:14px;
    opacity:0; transition:all .2s ease;
    box-shadow:0 2px 8px rgba(0,0,0,.1);
  }
  .ft-ui.ft-hover .ft-settings-btn{ opacity:1; }

  /* 设置面板 - 美观重设计 */
  .ft-settings-panel{
    position:absolute;
    top:-40px; right:40px;
    width:280px;
    background:#1e1e1e;
    border:1px solid #333;
    border-radius:16px;
    box-shadow:-12px 0 40px rgba(0,0,0,.5), 0 12px 40px rgba(0,0,0,.3);
    opacity:0; pointer-events:none;
    transform:translateX(24px) scale(0.9);
    transition:all .35s cubic-bezier(0.34,1.56,0.64,1);
    z-index:10;
    color:#fff;
    overflow:hidden;
    backdrop-filter:blur(20px);
  }
  .ft-settings-panel.ft-show{
    opacity:1; pointer-events:auto;
    transform:translateX(0) scale(1);
  }

  /* 标题栏 */
  .ft-settings-header{
    padding:18px 20px;
    background:linear-gradient(135deg, #2d2d2d 0%, #1f1f1f 100%);
    border-bottom:1px solid rgba(255,255,255,0.1);
    display:flex; justify-content:space-between; align-items:center;
    font-weight:600; font-size:15px;
    color:#f5f5f5;
  }
  .ft-settings-close{
    cursor:pointer;
    font-size:20px;
    color:#888;
    width:24px; height:24px;
    display:flex; align-items:center; justify-content:center;
    border-radius:12px;
    transition:all 0.2s ease;
  }
  .ft-settings-close:hover{
    background:rgba(255,255,255,0.1);
    color:#fff;
  }

  /* 语言选择区域 */
  .ft-lang-section{
    padding:16px;
    background:rgba(255,255,255,0.02);
  }
  .ft-lang-row{
    display:flex;
    align-items:center;
    gap:8px;
  }
  .ft-lang-select{
    flex:1;
    padding:8px 12px;
    background:#2a2a2a;
    border:1px solid #444;
    border-radius:8px;
    color:#fff;
    font-size:12px;
    cursor:pointer;
    transition:all 0.2s ease;
    outline:none;
    min-width:0;
    max-width:none;
  }
  .ft-lang-select:hover{
    border-color:#555;
    background:#333;
  }
  .ft-lang-select:focus{
    border-color:#e91e63;
    box-shadow:0 0 0 2px rgba(233,30,99,0.2);
  }
  .ft-lang-arrow{
    color:#888;
    font-size:14px;
    font-weight:bold;
    min-width:14px;
    text-align:center;
    flex-shrink:0;
  }

  /* 主要操作按钮 */
  .ft-main-action{
    padding:16px;
  }
  .ft-translate-btn{
    width:100%;
    padding:14px 24px;
    background:linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
    border:none;
    border-radius:12px;
    color:#fff;
    font-weight:600;
    font-size:15px;
    cursor:pointer;
    transition:all 0.3s ease;
    box-shadow:0 6px 20px rgba(233,30,99,0.25);
    position:relative;
    overflow:hidden;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:8px;
  }
  .ft-translate-btn::before{
    content:'';
    position:absolute;
    top:0; left:-100%;
    width:100%; height:100%;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition:left 0.6s ease;
  }
  .ft-translate-btn:hover{
    background:linear-gradient(135deg, #c2185b 0%, #ad1457 100%);
    transform:translateY(-2px);
    box-shadow:0 8px 25px rgba(233,30,99,0.35);
  }
  .ft-translate-btn:hover::before{
    left:100%;
  }
  .ft-translate-btn:active{
    transform:translateY(0);
  }
  .ft-translate-btn:disabled{
    background:#666 !important;
    cursor:not-allowed !important;
    transform:none !important;
    box-shadow:0 2px 8px rgba(0,0,0,0.2) !important;
  }

  /* 加载动画 */
  .ft-loading-spinner{
    width:16px;
    height:16px;
    border:2px solid rgba(255,255,255,0.3);
    border-top:2px solid #fff;
    border-radius:50%;
    animation:ft-spin 1s linear infinite;
  }
  @keyframes ft-spin{
    0%{ transform:rotate(0deg); }
    100%{ transform:rotate(360deg); }
  }

  /* 成功/错误状态 */
  .ft-translate-btn.success{
    background:linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
  }
  .ft-translate-btn.error{
    background:linear-gradient(135deg, #ef4444 0%, #dc2626 100%) !important;
  }

  /* 功能开关区域 */
  .ft-switches{
    padding:16px;
    border-top:1px solid rgba(255,255,255,0.05);
  }
  .ft-switch-item{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:12px 0;
  }
  .ft-switch-label{
    font-size:14px;
    color:#ddd;
    font-weight:500;
  }
  .ft-switch{
    position:relative;
    width:48px;
    height:24px;
    background:#3a3a3a;
    border-radius:12px;
    cursor:pointer;
    transition:all 0.3s ease;
    border:1px solid #555;
  }
  .ft-switch.active{
    background:linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
    border-color:#e91e63;
    box-shadow:0 0 12px rgba(233,30,99,0.3);
  }
  .ft-switch::after{
    content:'';
    position:absolute;
    top:2px;
    left:2px;
    width:18px;
    height:18px;
    background:#fff;
    border-radius:50%;
    transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    box-shadow:0 2px 6px rgba(0,0,0,0.3);
  }
  .ft-switch.active::after{
    transform:translateX(24px);
    box-shadow:0 2px 8px rgba(0,0,0,0.4);
  }

  /* 快捷键提示 */
  .ft-shortcut-tip{
    padding:8px 0 4px 0;
    margin-top:8px;
    border-top:1px solid rgba(255,255,255,0.05);
  }
  .ft-shortcut-text{
    font-size:11px;
    color:#888;
    display:flex;
    align-items:center;
    gap:4px;
  }
  .ft-shortcut-text kbd{
    background:rgba(255,255,255,0.1);
    border:1px solid rgba(255,255,255,0.2);
    border-radius:4px;
    padding:2px 6px;
    font-size:10px;
    font-family:monospace;
    color:#fff;
    box-shadow:0 1px 2px rgba(0,0,0,0.2);
  }

  /* 状态区域 */
  .ft-status-section{
    padding:12px 16px;
    background:rgba(0,0,0,0.2);
    border-top:1px solid rgba(255,255,255,0.05);
  }
  .ft-status-text{
    font-size:12px;
    color:#999;
    text-align:center;
    margin-bottom:8px;
  }

  /* 进度条 */
  .ft-progress-container{
    width:100%;
    height:4px;
    background:rgba(255,255,255,0.1);
    border-radius:2px;
    overflow:hidden;
    position:relative;
  }
  .ft-progress-bar{
    height:100%;
    background:linear-gradient(90deg, #e91e63 0%, #c2185b 100%);
    border-radius:2px;
    transition:width 0.3s ease;
    position:relative;
    overflow:hidden;
  }
  .ft-progress-bar::after{
    content:'';
    position:absolute;
    top:0;
    left:-100%;
    width:100%;
    height:100%;
    background:linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation:ft-progress-shine 1.5s infinite;
  }
  @keyframes ft-progress-shine{
    0%{ left:-100%; }
    100%{ left:100%; }
  }

  /* 隐藏进度条 */
  .ft-progress-container.hidden{
    opacity:0;
    height:0;
    margin:0;
    transition:all 0.3s ease;
  }

  /* 移除关闭面板样式 */

  /* 旧面板隐藏 */
  .ft-panel{ display:none; }
  .ft-panel{ position:absolute; right:50px; top:0; min-width:320px; max-width:420px; padding:12px; border-radius:14px; background:rgba(255,255,255,.95); border:1px solid rgba(0,0,0,.12); box-shadow:0 12px 32px rgba(0,0,0,.18); backdrop-filter:saturate(1.2) blur(8px); opacity:0; pointer-events:none; transform:translateX(10px); transition:all .15s ease; }
  .ft-ui.open .ft-panel{ opacity:1; pointer-events:auto; transform:translateX(0); }
  .ft-row{ display:flex; align-items:center; gap:6px; margin-bottom:10px; }
  .ft-select{ flex:1; padding:5px 8px; border-radius:6px; border:1px solid #ddd; background:#fff; font-size:13px; }
  .ft-btn{ padding:6px 12px; border-radius:6px; border:1px solid #3b82f6; background:#3b82f6; color:#fff; cursor:pointer; font-size:13px; transition:background .2s ease; }
  .ft-btn:hover{ background:#2563eb; }
  .ft-btn.ghost{ background:#fff; color:#3b82f6; border-color:#3b82f6; }
  .ft-btn.ghost:hover{ background:#f1f5f9; }
  .ft-status{ font-size:11px; color:#666; margin-top:4px; }
  .ft-progress{ color:#444; font-size:11px; }
  .ft-check{ gap:6px; user-select:none; align-items:center; margin-bottom:8px; }
  .ft-check input{ margin:0; }
  .ft-check label{ font-size:13px; }
  .ft-busy .ft-btn{ opacity:.7; pointer-events:none; }
  .ft-pair{ display:inline; }
  .ft-pair .ft-original{ opacity:.6; margin-right:.35em; }
  .ft-pair:not(.show-original) .ft-original{ display:none; }
  @media (prefers-color-scheme: dark){
  .ft-fab{ background:#222; border-color:#444; color:#eee; }
  .ft-ui:hover .ft-fab{ background:#333; }
  .ft-settings-panel{ background:rgba(24,24,24,.95); color:#ddd; }
  .ft-settings-header{ border-color:rgba(255,255,255,.1); }
  .ft-panel{ background:rgba(24,24,24,.95); border-color:rgba(255,255,255,.12); color:#ddd; }
  .ft-select{ background:#1f2937; border-color:#374151; color:#e5e7eb; }
  .ft-btn{ background:#3b82f6; color:#fff; border-color:#3b82f6; }
  .ft-btn:hover{ background:#2563eb; }
  .ft-btn.ghost{ background:#1f2937; color:#3b82f6; border-color:#3b82f6; }
  .ft-btn.ghost:hover{ background:#374151; }
  .ft-status{ color:#aaa; }
  .ft-progress{ color:#ccc; }
}

/* fallback for browsers without mask support */
@supports not (mask: url()) {
  .ft-fab::before{ display:none; }
  .ft-fab::after{
    content:"A文"; position:absolute;
    font:bold 10px/1 sans-serif; color:#fff;
    left:50%; top:50%; transform:translate(-50%,-50%);
    transition:color .3s ease, text-shadow .3s ease;
    z-index:1;
  }

  /* 状态指示器 - fallback模式 */
  .ft-fab.ft-translated::after{
    color:#fff;
    text-shadow:0 0 4px rgba(255,255,255,0.5);
  }
  .ft-fab.ft-success::after{
    color:#fff !important;
    text-shadow:0 0 4px rgba(255,255,255,0.8);
  }
  .ft-fab.ft-error::after{
    color:#fff;
    text-shadow:0 0 4px rgba(255,255,255,0.5);
  }

  /* 为fallback模式添加状态指示点 */
  .ft-fab.ft-translated::before,
  .ft-fab.ft-error::before{
    content:'';
    display:block;
    position:absolute;
    top:-2px;
    right:-2px;
    width:8px;
    height:8px;
    border-radius:50%;
    border:1px solid #fff;
    z-index:2;
  }
  .ft-fab.ft-translated::before{
    background:#10b981;
  }
  .ft-fab.ft-error::before{
    background:#ef4444;
  }
}

/* 划词翻译样式 */
.ft-selection-bubble{
  position:absolute;
  width:26px;
  height:26px;
  background:rgba(156, 163, 175, 0.9);
  border:1px solid rgba(156, 163, 175, 0.3);
  border-radius:50%;
  box-shadow:0 3px 10px rgba(156, 163, 175, 0.3);
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:2147483646;
  transition:all 0.2s ease;
  font-size:12px;
  color:#fff;
  user-select:none;
  opacity:0;
  transform:scale(0.5);
  animation:ft-bubble-appear 0.2s ease forwards;
}
@keyframes ft-bubble-appear{
  to{
    opacity:1;
    transform:scale(1);
  }
}
.ft-selection-bubble:hover{
  transform:scale(1.1);
  box-shadow:0 5px 15px rgba(156, 163, 175, 0.4);
}
.ft-selection-bubble::before{
  content:"A";
  font-weight:bold;
}

.ft-translation-popup{
  position:absolute;
  min-width:200px;
  max-width:300px;
  background:#1e1e1e;
  border:1px solid #333;
  border-radius:12px;
  box-shadow:0 8px 32px rgba(0,0,0,.3);
  color:#fff;
  z-index:2147483646;
  overflow:hidden;
  opacity:0;
  transform:scale(0.9);
  transition:all 0.2s ease;
  font-size:13px;
}
.ft-translation-popup.show{
  opacity:1;
  transform:scale(1);
}
.ft-translation-popup-header{
  padding:8px 12px;
  background:rgba(255,255,255,0.05);
  border-bottom:1px solid rgba(255,255,255,0.1);
  font-size:11px;
  color:#999;
  display:flex;
  justify-content:space-between;
  align-items:center;
}
.ft-translation-popup-actions{
  display:flex;
  gap:4px;
}
.ft-translation-popup-refresh,
.ft-translation-popup-close{
  cursor:pointer;
  width:16px;
  height:16px;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:8px;
  transition:background 0.2s ease;
  font-size:12px;
}
.ft-translation-popup-refresh:hover,
.ft-translation-popup-close:hover{
  background:rgba(255,255,255,0.1);
}
.ft-translation-popup-refresh{
  color:#3b82f6;
}
.ft-translation-popup-refresh:hover{
  background:rgba(59,130,246,0.2);
}
.ft-translation-popup-content{
  padding:12px;
  line-height:1.4;
}
.ft-translation-original{
  color:#999;
  font-size:12px;
  margin-bottom:8px;
  word-break:break-word;
}
.ft-translation-result{
  color:#fff;
  word-break:break-word;
}
.ft-translation-loading{
  display:flex;
  align-items:center;
  gap:8px;
  color:#999;
}
.ft-translation-loading .ft-loading-spinner{
  width:12px;
  height:12px;
  border:1px solid rgba(255,255,255,0.3);
  border-top:1px solid #fff;
}
.ft-translation-error{
  color:#ef4444;
  line-height:1.4;
}
`;
    try {
      if (typeof GM_addStyle === 'function') GM_addStyle(css);
      else {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
      }
    } catch {}
  }

    function toggleKeepOriginal(on) {
      const pairs = document.querySelectorAll('span.ft-pair');
      pairs.forEach((w) => {
        if (on) w.classList.add('show-original');
        else w.classList.remove('show-original');
      });
    }

    function applyTranslationToElement(element, original, translatedText) {
      // 保存原始HTML内容
      const originalHTML = element.innerHTML;
      
      // 标记为已翻译
      element.setAttribute('data-ft-original', '1');
      element.setAttribute('data-ft-original-html', originalHTML);
      element.setAttribute('data-ft-original-text', original);
      
      // 如果保留原文，创建切换结构
      if (keepOriginal) {
        const wrapper = document.createElement('span');
        wrapper.className = 'ft-pair show-original';
        wrapper.setAttribute('data-ft-original-text', original);
        
        const o = document.createElement('span');
        o.className = 'ft-original';
        o.innerHTML = originalHTML;
        
        const t = document.createElement('span');
        t.className = 'ft-translated';
        t.textContent = translatedText;
        
        wrapper.append(o, t);
        element.innerHTML = '';
        element.appendChild(wrapper);
      } else {
        // 直接替换文本内容
        element.textContent = translatedText;
      }
    }
    
    // 向后兼容的文本节点处理函数
    function applyTranslationToNode(node, original, leading, trailing, translatedPretty) {
      // Wrap the original text node with a pair container to support toggling
      const wrapper = document.createElement('span');
      wrapper.className = 'ft-pair';
      if (keepOriginal) wrapper.classList.add('show-original');
      wrapper.setAttribute('data-ft-original-text', original);
      wrapper.setAttribute('data-ft-leading', leading);
      wrapper.setAttribute('data-ft-trailing', trailing);

      const o = document.createElement('span');
      o.className = 'ft-original';
      o.textContent = original.trim();

      const t = document.createElement('span');
      t.className = 'ft-translated';
      t.textContent = leading + translatedPretty + trailing;

      wrapper.append(o, t);
      node.parentNode && node.parentNode.replaceChild(wrapper, node);
    }

    // --------------------------
    // 划词翻译功能
    // --------------------------
    function setupSelectionListeners() {
      document.addEventListener('mouseup', handleTextSelection);
      document.addEventListener('touchend', handleTextSelection);
    }

    function removeSelectionListeners() {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('touchend', handleTextSelection);
    }

    function handleTextSelection(e) {
      // 延迟处理，确保选择已完成
      setTimeout(() => {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText && selectedText.length > 0 && selectedText.length < 500) {
          // 排除在翻译UI内的选择
          if (e.target.closest('.ft-ui, .ft-selection-bubble, .ft-translation-popup')) {
            return;
          }

          // 获取鼠标/触摸位置
          let mouseX, mouseY;
          if (e.type === 'touchend' && e.changedTouches && e.changedTouches.length > 0) {
            // 触摸事件
            mouseX = e.changedTouches[0].clientX;
            mouseY = e.changedTouches[0].clientY;
          } else {
            // 鼠标事件
            mouseX = e.clientX || e.pageX;
            mouseY = e.clientY || e.pageY;
          }

          showSelectionBubble(selectedText, { x: mouseX, y: mouseY });
        } else {
          hideSelectionBubble();
        }
      }, 100);
    }

    function showSelectionBubble(text, mousePos) {
      hideSelectionBubble();
      hideTranslationPopup();

      selectionBubble = document.createElement('div');
      selectionBubble.className = 'ft-selection-bubble';

      // 使用鼠标位置，添加少量偏移避免遮挡光标
      const offsetX = 10;
      const offsetY = 10;

      // 计算最终位置，确保不超出视窗边界
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const bubbleSize = 26; // 悬浮框尺寸（26px）

      let left = mousePos.x + offsetX;
      let top = mousePos.y + offsetY;

      // 边界检查和调整
      if (left + bubbleSize > viewportWidth) {
        left = mousePos.x - bubbleSize - offsetX;
      }
      if (top + bubbleSize > viewportHeight) {
        top = mousePos.y - bubbleSize - offsetY;
      }

      // 确保不小于0
      left = Math.max(0, left);
      top = Math.max(0, top);

      selectionBubble.style.left = (left + window.scrollX) + 'px';
      selectionBubble.style.top = (top + window.scrollY) + 'px';

      selectionBubble.addEventListener('click', (e) => {
        e.stopPropagation();
        showTranslationPopup(text, selectionBubble);
      });

      document.body.appendChild(selectionBubble);

      // 自动隐藏机制
      setTimeout(() => {
        if (selectionBubble && !selectionBubble.matches(':hover')) {
          hideSelectionBubble();
        }
      }, 3000);
    }

    function hideSelectionBubble() {
      if (selectionBubble) {
        selectionBubble.remove();
        selectionBubble = null;
      }
    }

    function showTranslationPopupAtPosition(text, x, y) {
      hideTranslationPopup();

      translationPopup = document.createElement('div');
      translationPopup.className = 'ft-translation-popup';

      // 计算弹窗位置，确保不超出视窗边界
      const popupWidth = 300; // 最大宽度
      const popupHeight = 150; // 估计高度
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let left = x + window.scrollX;
      let top = y + window.scrollY + 10; // 在选中文本下方10px

      // 边界检查
      if (left + popupWidth > viewportWidth + window.scrollX) {
        left = x + window.scrollX - popupWidth;
      }
      if (top + popupHeight > viewportHeight + window.scrollY) {
        top = y + window.scrollY - popupHeight - 10; // 在选中文本上方
      }

      // 确保不超出左边界和上边界
      left = Math.max(window.scrollX + 10, left);
      top = Math.max(window.scrollY + 10, top);

      translationPopup.style.left = left + 'px';
      translationPopup.style.top = top + 'px';

      translationPopup.innerHTML = `
        <div class="ft-translation-popup-header">
          <span>快捷翻译 (F2)</span>
          <div class="ft-translation-popup-actions">
            <div class="ft-translation-popup-refresh" title="重新翻译">↻</div>
            <div class="ft-translation-popup-close" title="关闭">×</div>
          </div>
        </div>
        <div class="ft-translation-popup-content">
          <div class="ft-translation-original">${text}</div>
          <div class="ft-translation-loading">
            <div class="ft-loading-spinner"></div>
            <span>翻译中...</span>
          </div>
        </div>
      `;

      document.body.appendChild(translationPopup);

      // 添加关闭和刷新事件
      translationPopup.querySelector('.ft-translation-popup-close').addEventListener('click', hideTranslationPopup);
      translationPopup.querySelector('.ft-translation-popup-refresh').addEventListener('click', () => {
        manualRefreshTranslation(text);
      });

      // 显示动画
      setTimeout(() => {
        translationPopup.classList.add('show');
      }, 10);

      // 开始翻译
      retryTranslation(text, 0);
    }

    function showTranslationPopup(text, anchorElement) {
      hideTranslationPopup();

      translationPopup = document.createElement('div');
      translationPopup.className = 'ft-translation-popup';

      const rect = anchorElement.getBoundingClientRect();
      translationPopup.style.left = (rect.left + window.scrollX) + 'px';
      translationPopup.style.top = (rect.bottom + window.scrollY + 5) + 'px';

      translationPopup.innerHTML = `
        <div class="ft-translation-popup-header">
          <span>划词翻译</span>
          <div class="ft-translation-popup-actions">
            <div class="ft-translation-popup-refresh" title="重新翻译">↻</div>
            <div class="ft-translation-popup-close" title="关闭">×</div>
          </div>
        </div>
        <div class="ft-translation-popup-content">
          <div class="ft-translation-original">${text}</div>
          <div class="ft-translation-loading">
            <div class="ft-loading-spinner"></div>
            <span>翻译中...</span>
          </div>
        </div>
      `;

      document.body.appendChild(translationPopup);

      // 添加关闭和刷新事件
      translationPopup.querySelector('.ft-translation-popup-close').addEventListener('click', hideTranslationPopup);
      translationPopup.querySelector('.ft-translation-popup-refresh').addEventListener('click', () => {
        manualRefreshTranslation(text); // 手动刷新，只执行一次翻译
      });

      // 显示动画
      setTimeout(() => {
        translationPopup.classList.add('show');
      }, 10);

      // 开始翻译
      retryTranslation(text, 0);
    }

    function hideTranslationPopup() {
      if (translationPopup) {
        translationPopup.remove();
        translationPopup = null;
      }
    }

    async function manualRefreshTranslation(text) {
      if (!translationPopup) return;

      // 显示加载状态
      const content = translationPopup.querySelector('.ft-translation-popup-content');
      content.innerHTML = `
        <div class="ft-translation-original">${text}</div>
        <div class="ft-translation-loading">
          <div class="ft-loading-spinner"></div>
          <span>重新初始化翻译器...</span>
        </div>
      `;

      try {
        // 强制重新初始化翻译器
        console.log('[ChromeTranslator] 手动刷新：强制重新初始化翻译器');

        // 销毁现有翻译器和语言检测器实例
        if (translatorInstance) {
          try {
            translatorInstance.destroy();
            console.log('[ChromeTranslator] 已销毁现有翻译器实例');
          } catch (destroyError) {
            console.warn('[ChromeTranslator] 销毁翻译器实例失败:', destroyError);
          }
          translatorInstance = null;
        }

        if (detectorInstance) {
          try {
            detectorInstance.destroy();
            console.log('[ChromeTranslator] 已销毁现有语言检测器实例');
          } catch (destroyError) {
            console.warn('[ChromeTranslator] 销毁语言检测器实例失败:', destroyError);
          }
          detectorInstance = null;
        }

        // 更新状态显示
        if (translationPopup) {
          const loadingSpan = content.querySelector('.ft-translation-loading span');
          if (loadingSpan) loadingSpan.textContent = '重新翻译中...';
        }

        // 重新初始化并翻译
        const result = await translateSelectedText(text);

        // 翻译成功，更新UI
        if (translationPopup && result) {
          content.innerHTML = `
            <div class="ft-translation-original">${text}</div>
            <div class="ft-translation-result">${result}</div>
          `;
        }
      } catch (error) {
        console.error('[ChromeTranslator] 手动刷新翻译失败:', error);

        // 手动刷新失败，显示错误但不自动重试
        if (translationPopup) {
          content.innerHTML = `
            <div class="ft-translation-original">${text}</div>
            <div class="ft-translation-error">
              <div style="color:#ef4444; margin-bottom:8px;">翻译失败: ${error.message}</div>
              <div style="font-size:11px; color:#999;">请点击刷新按钮重试</div>
            </div>
          `;
        }
      }
    }

    async function retryTranslation(text, retryCount = 0) {
      const maxRetries = 3;

      if (!translationPopup) return;

      // 显示加载状态
      const content = translationPopup.querySelector('.ft-translation-popup-content');
      const isInitError = retryCount > 0; // 重试时检查是否需要重新初始化

      content.innerHTML = `
        <div class="ft-translation-original">${text}</div>
        <div class="ft-translation-loading">
          <div class="ft-loading-spinner"></div>
          <span>${isInitError ? '重新初始化翻译器' : '翻译中'}${retryCount > 0 ? ` (重试 ${retryCount}/${maxRetries})` : ''}...</span>
        </div>
      `;

      try {
        // 如果是重试且上次失败可能是初始化问题，强制重新初始化
        if (retryCount > 0) {
          console.log(`[ChromeTranslator] 自动重试第${retryCount}次：重新初始化翻译器`);

          // 销毁现有实例
          if (translatorInstance) {
            try {
              translatorInstance.destroy();
              console.log('[ChromeTranslator] 已销毁现有翻译器实例');
            } catch (destroyError) {
              console.warn('[ChromeTranslator] 销毁翻译器实例失败:', destroyError);
            }
            translatorInstance = null;
          }

          if (detectorInstance) {
            try {
              detectorInstance.destroy();
              console.log('[ChromeTranslator] 已销毁现有语言检测器实例');
            } catch (destroyError) {
              console.warn('[ChromeTranslator] 销毁语言检测器实例失败:', destroyError);
            }
            detectorInstance = null;
          }

          // 更新状态显示
          if (translationPopup) {
            const loadingSpan = content.querySelector('.ft-translation-loading span');
            if (loadingSpan) {
              loadingSpan.textContent = `翻译中 (重试 ${retryCount}/${maxRetries})...`;
            }
          }
        }

        const result = await translateSelectedText(text);

        // 翻译成功，更新UI
        if (translationPopup && result) {
          content.innerHTML = `
            <div class="ft-translation-original">${text}</div>
            <div class="ft-translation-result">${result}</div>
          `;
        }
      } catch (error) {
        console.error(`[ChromeTranslator] 划词翻译失败 (第${retryCount + 1}次):`, error);

        if (retryCount < maxRetries) {
          // 还有重试次数，1秒后重试
          if (translationPopup) {
            content.innerHTML = `
              <div class="ft-translation-original">${text}</div>
              <div class="ft-translation-loading">
                <div class="ft-loading-spinner"></div>
                <span>翻译失败，${1}秒后重试 (${retryCount + 1}/${maxRetries})...</span>
              </div>
            `;
          }

          setTimeout(() => {
            retryTranslation(text, retryCount + 1);
          }, 1000);
        } else {
          // 重试次数用完，显示最终错误
          if (translationPopup) {
            content.innerHTML = `
              <div class="ft-translation-original">${text}</div>
              <div class="ft-translation-error">
                <div style="color:#ef4444; margin-bottom:8px;">翻译失败: ${error.message}</div>
                <div style="font-size:11px; color:#999;">已重试 ${maxRetries} 次，请检查网络或稍后再试</div>
              </div>
            `;
          }
        }
      }
    }

    async function translateSelectedText(text) {
      if (!hasTranslator()) throw new Error('翻译器不可用');

      // 确保翻译器可用
      const availabilityOk = await ensureAvailability();
      if (!availabilityOk) throw new Error('翻译器不可用');

      const realSource = await resolveRealSourceLanguage();
      const instanceOk = await ensureTranslator(realSource, targetLang);
      if (!instanceOk) throw new Error('翻译器初始化失败');

      // 执行翻译
      const translated = await translateStreaming(text.replace(/\n/g, '<br>'));
      const result = (translated || '').replace(/<br>/g, '\n').trim();

      if (!result) throw new Error('翻译结果为空');

      return result;
    }

    // 点击其他地方关闭划词翻译相关UI
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.ft-selection-bubble, .ft-translation-popup')) {
        hideSelectionBubble();
        hideTranslationPopup();
      }
    });

    // F2快捷键快速翻译选中文本
    document.addEventListener('keydown', (e) => {
      if (e.key === 'F2' && wordSelectionEnabled) {
        e.preventDefault();

        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        if (selectedText && selectedText.length > 0 && selectedText.length < 500) {
          // 排除在翻译UI内的选择
          const range = selection.getRangeAt(0);
          const container = range.commonAncestorContainer;
          const element = container.nodeType === Node.TEXT_NODE ? container.parentElement : container;

          if (element && element.closest('.ft-ui, .ft-selection-bubble, .ft-translation-popup')) {
            return;
          }

          // 获取选中文本的位置，用于显示翻译弹窗
          const rect = range.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;

          // 直接显示翻译弹窗，跳过悬浮按钮
          showTranslationPopupAtPosition(selectedText, centerX, centerY);
        }
      }
    });
  })();


