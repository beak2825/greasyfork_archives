// ==UserScript==
// @name         ChatGPT多模型选择
// @namespace    http://tampermonkey.net/
// @author       xiaowu
// @version      1.0.3
// @description  增强 Main 模型选择器（黏性重排、防抖动、自定义项、丝滑切换、隐藏分组与Legacy）；并集成“使用其他模型重试的模型选择器”快捷项与30秒强制模型窗口（自动触发原生项或重试）；可以自定义模型顺序。
// @match        https://chatgpt.com/
// @match        https://chatgpt.com/?model=*
// @match        https://chatgpt.com/?temporary-chat=*
// @match        https://chatgpt.com/c/*
// @match        https://chatgpt.com/g/*
// @match        https://chatgpt.com/share/*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547325/ChatGPT%E5%A4%9A%E6%A8%A1%E5%9E%8B%E9%80%89%E6%8B%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/547325/ChatGPT%E5%A4%9A%E6%A8%A1%E5%9E%8B%E9%80%89%E6%8B%A9.meta.js
// ==/UserScript==

(() => {
  'use strict';
  const W = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;

  



  // ---------------- 配置 ----------------
  const TEST_ID_SWITCHER = 'model-switcher-dropdown-button';

  // 你想要的目标顺序（按 data-testid 后缀）
  const DESIRED_ORDER = [
    'gpt-5-thinking',
    'gpt-5-t-mini',
    'gpt-5-instant',
    'gpt-5',
    'gpt-5-mini',
    'o3',
    'o4-mini-high',
    'o4-mini',
    'gpt-4o',
    'gpt-4-1',
    'o3-pro',
    'gpt-5-pro',
  ];
  const ALT_IDS = { 'gpt-4-1': ['gpt-4.1'] };

  // 点击后不自动收起菜单的模型（硬编码名单）
  const NO_CLOSE_ON_CHOOSE_IDS = new Set([
    'gpt-5',
    'gpt-5-instant',
    'gpt-5-thinking',
    'gpt-5-pro',
    'gpt-5-t-mini',
  ]);

  // 自定义模型项（若该菜单已经有官方同名项则不重复插入）
  const CUSTOM_MODELS = [
    { id: 'o3',           label: 'o3' },
    { id: 'o3-pro',       label: 'o3 pro' },
    { id: 'gpt-4-1',      label: 'GPT 4.1' },
    { id: 'gpt-4o',       label: 'GPT 4o' },
    { id: 'o4-mini',      label: 'o4 mini' },
    { id: 'o4-mini-high', label: 'o4 mini high' },
    { id: 'gpt-5',        label: 'GPT 5 Auto' },
    { id: 'gpt-5-instant',label: 'GPT 5 Instant' },
    { id: 'gpt-5-t-mini', label: 'GPT 5 Thinking Mini' },
    { id: 'gpt-5-mini',   label: 'GPT 5 mini' },
    { id: 'gpt-5-thinking', label: 'GPT 5 Thinking' },
    { id: 'gpt-5-pro',    label: 'GPT 5 Pro' },
  ];

  // ---------------- 工具 ----------------
  const debounce = (fn, wait = 50) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, a), wait); }; };

  // 标准化与美化名称
  const CUSTOM_NAME_MAP = new Map(CUSTOM_MODELS.map(m => [m.id.toLowerCase(), m.label]));
  const EXTRA_NAME_MAP = new Map(Object.entries({
    'gpt-4o': 'GPT 4o',
    'gpt-4-1': 'GPT 4.1',
    'gpt-4.1': 'GPT 4.1',
    'o3': 'o3',
    'o3-pro': 'o3 pro',
    'o4-mini': 'o4 mini',
    'o4-mini-high': 'o4 mini high',
    'gpt-5': 'GPT 5 Auto',
    'gpt-5-instant': 'GPT 5 Instant',
    'gpt-5-t-mini': 'GPT 5 Thinking Mini',
    'gpt-5-thinking': 'GPT 5 Thinking',
    'gpt-5-pro': 'GPT 5 Pro',
    'gpt-5-mini': 'GPT 5 mini',
  }));

  function normalizeModelId(id) {
    if (!id) return '';
    return String(id).trim().toLowerCase().replace(/\s+/g, '-').replace(/\./g, '-');
  }

  function prettyName(id) {
    const norm = normalizeModelId(id);
    return CUSTOM_NAME_MAP.get(norm) || EXTRA_NAME_MAP.get(norm) || id || '';
  }

  function setAllSwitcherButtonsModel(modelId) {
    if (!modelId) return;
    const norm = normalizeModelId(modelId);
    const name = prettyName(norm);
    document.querySelectorAll(`[data-testid="${TEST_ID_SWITCHER}"]`).forEach((btn) => {
      const labelContainer = btn.querySelector('div, span');
      if (labelContainer) {
        labelContainer.textContent = `ChatGPT ${name}`;
        labelContainer.style.color = 'var(--token-text-primary, var(--text-primary, inherit))';
      }
      btn.setAttribute('aria-label', `Model selector, current model is ${norm}`);
      btn.dataset.currentModel = norm;
    });
  }

  function updateAllSwitcherButtonsFromURL() {
    const url = new URL(window.location.href);
    const currentModel = url.searchParams.get('model');
    if (!currentModel) return;
    setAllSwitcherButtonsModel(currentModel);
  }

  function findAssociatedMenu(triggerBtn) {
    const id = triggerBtn.getAttribute('id');
    if (!id) return null;
    return document.querySelector(`[role="menu"][aria-labelledby="${CSS.escape(id)}"]`);
  }

  // 关闭（收起）与某按钮关联的 Main 模型选择器。
  function closeMenu(menuEl) {
    try {
      const menu = menuEl && (menuEl.closest?.('[role="menu"], [role="listbox"], [data-radix-menu-content]') || menuEl);
      if (!menu || !(menu instanceof HTMLElement)) return false;
      const labeledBy = menu.getAttribute('aria-labelledby');
      if (labeledBy) {
        const btn = document.getElementById(labeledBy);
        if (btn) {
          try { btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true })); } catch {}
          try { btn.click(); } catch {}
          return true;
        }
      }
      // 回退：发送 Escape 事件尝试关闭 Radix 下拉
      const target = document.activeElement || menu;
      try { target.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true })); } catch {}
      try { target.dispatchEvent(new KeyboardEvent('keyup', { key: 'Escape', code: 'Escape', keyCode: 27, which: 27, bubbles: true })); } catch {}
      return true;
    } catch {
      return false;
    }
  }

  // 仅识别“Main 模型选择器”（排除包含 Auto/Instant/Thinking/Pro 的“使用其他模型重试的模型选择器”）
  // Main 菜单识别：有 Main 菜单签名 + 不包含重试关键字
  function isOfficialModelMenu(menuEl) {
    if (!menuEl || !(menuEl instanceof HTMLElement)) return false;
    const role = menuEl.getAttribute('role');
    if (role !== 'menu' && role !== 'listbox') return false;
    const items = Array.from(menuEl.querySelectorAll('[role="menuitem"], [data-radix-collection-item]'));
    const labels = items.map((el) => {
      const t = el.querySelector?.('.truncate');
      const raw = (t?.textContent ?? el.textContent ?? '').trim();
      return raw.split('\n')[0].trim();
    });
    const hasVariantMarker = labels.some((l) => /^(Auto|Instant|Thinking(?: mini)?|Pro|Ultra(?:\s*Think(?:ing)?)?)$/i.test(l));
    if (hasVariantMarker) return false;
    const hasOfficialSignature = !!(menuEl.querySelector('[data-testid^="model-switcher-"]') || menuEl.querySelector('[data-cgpt-turn]'));
    if (!hasOfficialSignature) return false;
    return true;
  }

  // ---------------- 黏性重排 ----------------
  // 黏性重排：把“我们关心的项”按照 DESIRED_ORDER 的顺序，
  // 仅在不一致时最小化 DOM 变动地整体移动，避免 hover 抖动/菜单意外关闭。
  const STICKY_REORDER = new WeakMap();

  function findItemNode(menu, id) {
    let node = menu.querySelector(`[data-radix-collection-item][data-testid="model-switcher-${CSS.escape(id)}"]`)
            || menu.querySelector(`[data-testid="model-switcher-${CSS.escape(id)}"]`)
            || menu.querySelector(`[data-custom-model="${CSS.escape(id)}"]`);
    if (!node && ALT_IDS[id]) {
      for (const alt of ALT_IDS[id]) {
        node = menu.querySelector(`[data-testid="model-switcher-${CSS.escape(alt)}"]`)
            || menu.querySelector(`[data-custom-model="${CSS.escape(alt)}"]`);
        if (node) break;
      }
    }
    return node;
  }

  // 对 Main 模型选择器进行“黏性重排”（与 addCustomModels 配合）。
  function applyDesiredOrder(menu) {
    // 1) 收集期望顺序中、当前实际存在于该菜单的“顶层项”节点
    const desiredNodes = [];
    const seen = new Set();
    for (const id of DESIRED_ORDER) {
      let n = findItemNode(menu, id);
      if (!n) continue;
      // 升到以 menu 为直接父级的顶层容器，避免移动子层导致 hover 抖动
      while (n && n.parentElement && n.parentElement !== menu) n = n.parentElement;
      if (!n || seen.has(n)) continue;
      seen.add(n);
      desiredNodes.push(n);
    }
    if (desiredNodes.length === 0) return;

    // 2) 取当前顺序：按 menu.children 顺序过滤出我们关心的节点
    const current = Array.from(menu.children).filter(ch => seen.has(ch));

    // 3) 若顺序已匹配，则不做任何 DOM 变动（避免 pointerleave/blur 导致菜单关闭）
    const sameOrder = current.length === desiredNodes.length && current.every((n, i) => n === desiredNodes[i]);
    if (sameOrder) return;

    // 4) 仅在不一致时才整体移动，以最小化变更次数
    const frag = document.createDocumentFragment();
    desiredNodes.forEach(n => frag.appendChild(n));
    menu.appendChild(frag);
  }

  // UI 微调：压缩 GPT‑5 系列二行描述、统一标题、隐藏“Legacy models”入口和相关分隔线。
  function normalizeMenuUI(menu) {
    try {
      // 压缩 GPT‑5 系列项：去除第二行描述
      const g5 = menu.querySelectorAll('[data-testid^="model-switcher-gpt-5"], [data-radix-collection-item][data-testid^="model-switcher-gpt-5"]');
      g5.forEach((el) => {
        const container = el.querySelector('.min-w-0');
        if (!container) return;
        const children = Array.from(container.children);
        children.forEach((node, idx) => { if (idx >= 1 && node.tagName === 'DIV') node.remove(); });
      });
      // 标题规范化
      const rename = (key, text) => {
        const n = menu.querySelector(`[data-radix-collection-item][data-testid="model-switcher-${key}"] .min-w-0 span`)
              || menu.querySelector(`[data-testid="model-switcher-${key}"] .min-w-0 span`);
        if (n) n.textContent = text;
      };
      rename('gpt-5', 'GPT 5 Auto');
      rename('gpt-5-instant', 'GPT 5 Instant');
      rename('gpt-5-t-mini', 'GPT 5 Thinking Mini');
      rename('gpt-5-mini', 'GPT 5 mini');
      rename('gpt-5-thinking', 'GPT 5 Thinking');
      rename('gpt-5-pro', 'GPT 5 Pro');

      // 隐藏 Legacy models 子菜单入口
      const toHide = new Set();
      const exact = menu.querySelector('[data-testid="Legacy models-submenu"]');
      if (exact) toHide.add(exact);
      menu.querySelectorAll('[role="menuitem"][data-has-submenu]').forEach((el) => {
        const txt = (el.textContent || '').toLowerCase();
        const tid = (el.getAttribute('data-testid') || '').toLowerCase();
        if (txt.includes('legacy models') || tid.includes('legacy models')) toHide.add(el);
      });
      toHide.forEach((el) => { el.style.display = 'none'; el.setAttribute('data-ext-hidden','1'); });

      // 隐藏“GPT-5”分组标题与紧随的分隔线
      menu.querySelectorAll('div.__menu-label.mb-0').forEach((el) => {
        const t = (el.textContent || '').trim();
        if (t === 'GPT-5') {
          el.style.display = 'none';
          el.setAttribute('data-ext-hidden','1');
          const sep = el.nextElementSibling;
          if (sep && sep.getAttribute('role') === 'separator') {
            sep.style.display = 'none';
            sep.setAttribute('data-ext-hidden','1');
          }
        }
      });
      // 保险：具有这些类名的分隔线也隐藏
      menu.querySelectorAll('[role="separator"].bg-token-border-default.h-px.mx-4.my-1').forEach((el) => {
        el.style.display = 'none';
        el.setAttribute('data-ext-hidden','1');
      });
    } catch {}
  }

  function ensureStickyReorder(menu) {
    if (!menu || STICKY_REORDER.has(menu)) return;
    let scheduled = false;
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        try { normalizeMenuUI(menu); } catch {}
        try { applyDesiredOrder(menu); } catch {}
      });
    };
    const mo = new MutationObserver((muts) => {
      for (const m of muts) {
        if (m.type === 'childList') { schedule(); break; }
      }
    });
    mo.observe(menu, { childList: true });
    STICKY_REORDER.set(menu, mo);
    schedule(); // 首次也排一次
  }

  // ---------------- 自定义项：原生风格 + 丝滑选择 ----------------
  // 丝滑选择：
  // 1) 立即更新 URL 中的 ?model= 和顶部按钮文案（无闪烁），
  // 2) requestAnimationFrame 后尝试点击同 id 的官方项，让后端同步切换。
  function selectModelQuick(id) {
    // 1) 立即更新 URL 和按钮文案（丝滑）
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('model', id);
      history.pushState({}, '', url.toString());
      try { window.dispatchEvent(new Event('pushstate')); } catch {}
      try { window.dispatchEvent(new Event('locationchange')); } catch {}
      try { window.dispatchEvent(new PopStateEvent('popstate')); } catch {}
      setAllSwitcherButtonsModel(id);
    } catch {}

    // 2) 联动点官方同 id 项（让后端状态也切换）
    const sel = `[data-radix-collection-item][data-testid="model-switcher-${CSS.escape(id)}"]:not([data-ext-custom])`;
    const tryClick = () => {
      const el = document.querySelector(sel);
      if (!el) return false;
      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      el.click();
      return true;
    };
    requestAnimationFrame(() => { if (!tryClick()) setTimeout(tryClick, 120); });
  }

  function createNativeLikeCustomItem(id, label) {
    const item = document.createElement('div');
    item.setAttribute('role','menuitem');
    item.setAttribute('tabindex','0');
    item.className = 'group __menu-item';
    item.setAttribute('data-radix-collection-item','');
    item.setAttribute('data-orientation','vertical');
    item.dataset.testid = `model-switcher-${id}`; // data-testid（保持一致，以便排序匹配）
    item.setAttribute('data-custom-model', id);
    item.setAttribute('data-ext-custom','1');    // 防止被“点官方项”逻辑误点

    item.innerHTML = `
      <div class="min-w-0">
        <span class="flex items-center gap-1">${label || id}</span>
      </div>
      <div class="trailing"><span class="icon"></span></div>
    `;

    const swallow = (e) => { e.preventDefault(); e.stopPropagation(); };
    item.addEventListener('pointerdown', swallow, { capture: true });
    item.addEventListener('mousedown', swallow, { capture: true });
    item.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      const menuRoot = item.closest('[role="menu"], [role="listbox"], [data-radix-menu-content]');
      selectModelQuick(id);
      // 稍等一拍，确保原生项点击处理完成后再收起菜单
      if (!NO_CLOSE_ON_CHOOSE_IDS.has(normalizeModelId(id))) {
        setTimeout(() => { try { closeMenu(menuRoot); } catch {} }, 30);
      }
    }, { capture: true });
    return item;
  }

  // 在“Main 模型选择器”中插入自定义项（仅在该菜单没有同名原生项时）：
  // - 插在“最后一个 GPT‑5 官方项”之后（找不到则末尾）
  // - 插入后调用 normalizeMenuUI / applyDesiredOrder 统一外观与顺序
  function addCustomModels(menuEl) {
    if (!menuEl || !(menuEl instanceof HTMLElement)) return;
    if (menuEl.dataset.customized === 'true') return;

    // 在最后一个 GPT‑5 原生项后插入（找不到就追加到末尾）
    const anchors = menuEl.querySelectorAll('[data-radix-collection-item][data-testid^="model-switcher-gpt-5"]');
    const lastG5 = anchors[anchors.length - 1];

    for (const { id, label } of CUSTOM_MODELS) {
      // 跳过：若菜单中已有原生同 id 项
      const existsOfficial = menuEl.querySelector(`[data-testid="model-switcher-${CSS.escape(id)}"]:not([data-ext-custom])`);
      if (existsOfficial) continue;
      // 跳过：已插过
      if (menuEl.querySelector(`[data-custom-model="${CSS.escape(id)}"]`)) continue;
      const item = createNativeLikeCustomItem(id, label || id);
      if (lastG5 && lastG5.parentElement === menuEl) lastG5.after(item); else menuEl.appendChild(item);
    }

    menuEl.dataset.customized = 'true';
    try { normalizeMenuUI(menuEl); } catch {}
    try { applyDesiredOrder(menuEl); } catch {}

    // 若用户点选了官方项（或键盘触发 click），则自动收起菜单
    if (!menuEl.dataset.fmCloseOnChoose) {
      menuEl.addEventListener('click', (ev) => {
        const t = ev.target;
        if (!t || !(t instanceof Element)) return;
        const item = t.closest('[data-radix-collection-item][data-testid^="model-switcher-"]:not([data-ext-custom])')
                 || t.closest('[data-testid^="model-switcher-"]:not([data-ext-custom])');
        if (!item) return;
        const testid = item.getAttribute('data-testid') || '';
        const m = /^model-switcher-(.+)$/.exec(testid);
        const chosenId = m ? normalizeModelId(m[1]) : '';
        if (chosenId && NO_CLOSE_ON_CHOOSE_IDS.has(chosenId)) return;
        setTimeout(() => { try { closeMenu(menuEl); } catch {} }, 30);
      }, { capture: true });
      menuEl.dataset.fmCloseOnChoose = '1';
    }
  }

  // ---------------- 使用其他模型重试的模型选择器：快捷项 + 强制窗口 + fetch 改写 ----------------
  let lastVariantMenuRoot = null;
  const isMenuRoot = (n) => n && n.nodeType === 1 && (
    n.matches?.('[data-radix-menu-content]') ||
    n.matches?.('[data-radix-dropdown-menu-content]') ||
    (n.getAttribute?.('role') === 'menu')
  );
  const VARIANT_MARKERS = [/^Auto$/i, /^Instant$/i, /^Thinking(?: mini)?$/i, /^Pro$/i, /^Ultra(?:\s*Think(?:ing)?)?$/i];
  function getItemLabel(el) {
    const t = el.querySelector?.('.truncate');
    const raw = (t?.textContent ?? el.textContent ?? '').trim();
    return raw.split('\n')[0].trim();
  }
  // “重试模型选择器”识别：包含关键字（Auto/Instant/Thinking/Pro/Ultra）+ 不含 Main 菜单签名。
  function isVariantMenu(root) {
    if (!isMenuRoot(root)) return false;
    // 排除 Main 模型选择器特征
    if (root.querySelector('[data-testid^="model-switcher-"]') || root.querySelector('[data-cgpt-turn]')) return false;
    const items = [...root.querySelectorAll('[role="menuitem"]')];
    const hasVariant = items.some(el => VARIANT_MARKERS.some(re => re.test(getItemLabel(el))));
    return hasVariant;
  }
  // 回退“重试/Regenerate”按钮查找：当未能触发原生项时使用。
  function findRetryBtn() {
    let btn = document.querySelector('[data-testid*="regenerate"], [data-testid*="retry"]');
    if (btn) return btn;
    btn = [...document.querySelectorAll('button[aria-label]')].find(b => /regenerate|retry|重试|重新生成/i.test(b.getAttribute('aria-label') || ''));
    if (btn) return btn;
    btn = [...document.querySelectorAll('button')].find(b => /regenerate|retry|重试|重新生成/i.test((b.textContent || '').trim()));
    return btn || null;
  }
  // 在“重试模型选择器”中寻找一个“锚点项”（插入快捷项时作为参照）。
  function findNativeAnchor(root) {
    if (!root) return null;
    const items = [...root.querySelectorAll('[role="menuitem"]')];
    const NATIVE_ANCHOR_TEXTS = [/^o4-mini$/i, /^gpt-4o$/i, /^gpt-4\.?1$/i];
    for (const re of NATIVE_ANCHOR_TEXTS) {
      const hit = items.find(el => re.test(getItemLabel(el)));
      if (hit) return hit;
    }
    return items[0] || null;
  }
  // 优先触发“重试模型选择器”里的原生项；若不存在则触发“重试/Regenerate”按钮。
  function clickNativeOrRetry() {
    const nativeItem = findNativeAnchor(lastVariantMenuRoot);
    if (nativeItem) {
      nativeItem.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      nativeItem.click();
      return true;
    }
    const retry = findRetryBtn();
    if (retry) {
      retry.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      retry.click();
      return true;
    }
    console.warn('[fm] 未找到原生菜单项或“重试”按钮；请手动触发一次重试/选择模型。');
    return false;
  }
  // 窗口期强制模型 + fetch 改写：
  // - setForce(model, 2000)：在 2 秒窗口内将会话请求 body.model 改写为指定模型。
  // - 仅对 /backend-api/(f/)?conversation 的 POST 请求生效。
  let forceModel = null;
  let forceUntil = 0;
  const inWindow = () => forceModel && Date.now() < forceUntil;
  function setForce(model, ms = 2000) {
    forceModel = String(model || '').trim();
    forceUntil = Date.now() + ms;
    try { console.info(`[fm] force ${forceModel} for ${ms}ms`); } catch {}
    setTimeout(() => { if (Date.now() >= forceUntil) { forceModel = null; forceUntil = 0; } }, ms + 100);
  }
  const CONVO_RE = /\/backend-api\/(f\/)?conversation(?:$|\?)/;
  const ANALYTICS_RE = /\/ces\/v1\/t(?:$|[/?#])/;
  const origFetch = W.fetch;
  W.fetch = async function(input, init) {
    try {
      const req = (input instanceof Request) ? input : new Request(input, init);
      const url = req.url || (typeof input === 'string' ? input : '');
      const method = (req.method || (init && init.method) || 'GET').toUpperCase();
      // 监听 Analytics：Model Switcher 事件，提取 target model 更新按钮文案
      if (ANALYTICS_RE.test(url) && method === 'POST') {
        try {
          const txt = await req.clone().text();
          if (txt) {
            try {
              const data = JSON.parse(txt);
              const evt = String(data?.event || '');
              const p = data?.properties || {};
              const to = p.to || p.model || p.value || p.selection || p.target;
              if (/Model\s*Switcher/i.test(evt) && to) {
                setAllSwitcherButtonsModel(to);
              }
            } catch {}
          }
        } catch {}
        // 透传
        return origFetch(input, init);
      }
      if (!CONVO_RE.test(url) || method !== 'POST') { return origFetch(input, init); }
      let bodyTxt = '';
      try { bodyTxt = await req.clone().text(); } catch {}
      if (!bodyTxt) return origFetch(input, init);
      try {
        const body = JSON.parse(bodyTxt);
        if (inWindow() && body && (body.action === 'variant' || body.action === 'next' || body.action === 'continue')) {
          const old = body.model;
          body.model = forceModel;
          const newTxt = JSON.stringify(body);
          const newInit = {
            method: req.method || (init && init.method) || 'POST',
            headers: req.headers,
            body: newTxt,
            credentials: req.credentials,
            cache: req.cache,
            mode: req.mode,
            redirect: req.redirect,
            referrer: req.referrer,
            referrerPolicy: req.referrerPolicy,
            integrity: req.integrity,
            keepalive: req.keepalive,
            signal: req.signal,
          };
          try { console.log(`[fm] rewrite model: ${old} -> ${body.model} | action=${body.action}`); } catch {}
          return origFetch(req.url, newInit);
        }
      } catch (_) {}
      return origFetch(input, init);
    } catch (err) {
      return origFetch(input, init);
    }
  };

  // 在“重试模型选择器”构造一个与原生风格一致的快捷项，
  // 点击后：开启 2 秒强制窗口 -> 更新按钮文案 -> 触发原生项或重试。
  function createVariantMenuItem({label, sub, slug}) {
    const span = document.createElement('span');
    const item = document.createElement('div');
    item.setAttribute('role', 'menuitem');
    item.setAttribute('tabindex', '0');
    item.className = 'group __menu-item';
    item.dataset.orientation = 'vertical';
    item.setAttribute('data-radix-collection-item', '');
    const subLine = sub ? `<div class="not-group-data-disabled:text-token-text-tertiary leading-dense mb-0.5 text-xs group-data-sheet-item:mt-0.5 group-data-sheet-item:mb-0">${sub}</div>` : '';
    item.innerHTML = `
      <div class="min-w-0">
        <div class="flex min-w-0 grow items-center gap-2.5 group-data-no-contents-gap:gap-0">
          <div class="truncate">${label}</div>
        </div>
        ${subLine}
      </div>
    `;
    const onChoose = (ev) => {
      ev.preventDefault(); ev.stopPropagation();
      const targetModel = slug || label;
      setForce(targetModel, 2000);
      try { setAllSwitcherButtonsModel(targetModel); } catch {}
      setTimeout(() => {
        const ok = clickNativeOrRetry();
        if (!ok) console.warn('[fm] 没能自动触发；你可手动点一次重试，窗口仍然生效。');
      }, 10);
    };
    item.addEventListener('click', onChoose);
    span.appendChild(item);
    span.dataset.fmItem = '1';
    return span;
  }
  // 在“重试模型选择器”中找到锚点项，并在其后插入若干快捷项。
  function enhanceVariantMenu(root) {
    if (!root || root.dataset.fmAugmented) return;
    if (!isVariantMenu(root)) return;
    root.dataset.fmAugmented = '1';
    lastVariantMenuRoot = root;
    if (root.querySelector('[data-fmItem="1"]')) return;
    const items = root.querySelectorAll('[role="menuitem"]');
    let anchor = null;
    const NATIVE_ANCHOR_TEXTS = [/^o4-mini$/i, /^gpt-4o$/i, /^gpt-4\.?1$/i];
    for (const re of NATIVE_ANCHOR_TEXTS) {
      anchor = Array.from(items).find(el => re.test(getItemLabel(el)));
      if (anchor) break;
    }
    if (!anchor) return;
    const anchorSpan = anchor.closest('span') || anchor;
    const QUICK_MODELS = [
      { label: 'o3 pro',       slug: 'o3-pro' },
      { label: 'GPT 5 mini',   slug: 'gpt-5-mini' },
      { label: 'o4 mini high', slug: 'o4-mini-high' },
    ];
    QUICK_MODELS.forEach(q => {
      const node = createVariantMenuItem(q);
      anchorSpan.parentNode.insertBefore(node, anchorSpan.nextSibling);
    });
  }

  // ---------------- 观察与启动 ----------------
  // 与“顶部切换按钮”绑定的观察器：
  // - 通过按钮 id → 菜单 aria-labelledby 关联，拿到对应菜单；
  // - 根据菜单类型路由到 addCustomModels（Main）或 enhanceVariantMenu（重试）。
  function installMenuObserverFor(triggerBtn) {
    const debounced = debounce(() => {
      const menu = findAssociatedMenu(triggerBtn);
      if (menu && isOfficialModelMenu(menu)) {
        addCustomModels(menu);
        ensureStickyReorder(menu);
      }
    }, 50);
    const bodyObserver = new MutationObserver(() => { debounced(); });
    bodyObserver.observe(document.body, { childList: true, subtree: true });
    debounced();
    const attrObs = new MutationObserver(() => debounced());
    attrObs.observe(triggerBtn, { attributes: true, attributeFilter: ['aria-expanded', 'id'] });
  }

  // 启动：
  // - 监听并附着顶部切换按钮，首次点击时安装菜单观察器；
  // - 全局 MutationObserver 兜底，发现任意新菜单后按类型处理；
  // - 监听 URL 变化同步按钮文案。
  function bootstrap() {
    const attach = (btn) => {
      if (!(btn instanceof HTMLElement)) return;
      if (btn.dataset.orderMergedEnhanced === 'true') return;
      btn.dataset.orderMergedEnhanced = 'true';
      btn.addEventListener('click', () => { installMenuObserverFor(btn); }, { once: true });
      updateAllSwitcherButtonsFromURL();
    };
    document.querySelectorAll(`[data-testid="${TEST_ID_SWITCHER}"]`).forEach(attach);
    const obsButtons = new MutationObserver(() => { document.querySelectorAll(`[data-testid="${TEST_ID_SWITCHER}"]`).forEach(attach); });
    obsButtons.observe(document.body, { childList: true, subtree: true });

    // 全局兜底：任意新开的菜单，按类型分别处理（Main/重试）
    const menuObserver = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          const candidates = [];
          if (node.matches?.('[role="menu"], [role="listbox"], [data-radix-menu-content]')) candidates.push(node);
          node.querySelectorAll?.('[role="menu"], [role="listbox"], [data-radix-menu-content]').forEach((el) => candidates.push(el));
          for (const el of candidates) {
            const menu = el.getAttribute('role') ? el : el.querySelector?.('[role="menu"], [role="listbox"]');
            if (!menu) continue;
            if (isOfficialModelMenu(menu)) {
              addCustomModels(menu);
              ensureStickyReorder(menu);
            } else if (isVariantMenu(menu)) {
              enhanceVariantMenu(menu);
            }
          }
        }
      }
    });
    menuObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('popstate', updateAllSwitcherButtonsFromURL);
    window.addEventListener('pushstate', updateAllSwitcherButtonsFromURL);
    window.addEventListener('locationchange', updateAllSwitcherButtonsFromURL);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap, { once: true });
  } else {
    bootstrap();
  }

  // 样式：保证自定义项文本色 + 隐藏特定分隔线
  const style = document.createElement('style');
  style.id = 'chatgpt-order-merged-style';
  style.textContent = `
    [data-custom-model] { color: var(--token-text-primary, var(--text-primary, inherit)) !important; }
    [data-custom-model] * { color: inherit !important; }
    [data-testid="Legacy models-submenu"] { display: none !important; }
    [role="separator"].bg-token-border-default.h-px.mx-4.my-1 { display: none !important; }
  `;
  document.documentElement.appendChild(style);
})();
