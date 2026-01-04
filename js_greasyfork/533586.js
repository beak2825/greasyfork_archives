// ==UserScript==
// @name         SearXNG検索オプション強化UI 🔍️
// @name:ja      SearXNG検索オプション強化UI 🔍️
// @name:en      Enhanced Search Options UI for SearXNG 🔍️
// @name:zh-CN   SearXNG搜索选项增强界面 🔍️
// @name:zh-TW   SearXNG搜尋選項增強介面 🔍️
// @name:ko      SearXNG 검색 옵션 강화 UI 🔍️
// @name:fr      Interface améliorée pour les options de recherche SearXNG 🔍️
// @name:es      Interfaz mejorada de opciones de búsqueda para SearXNG 🔍️
// @name:de      Verbesserte Suchoptionen-Oberfläche für SearXNG 🔍️
// @name:pt-BR   Interface aprimorada de opções de pesquisa para SearXNG 🔍️
// @name:ru      Улучшенный интерфейс опций поиска SearXNG 🔍️
// @version      3.9.1
// @description         SearXNG検索エンジンに詳細検索オプションサイドバーを追加（言語選択も自動検出と英語と日本語のみにしてすっきり）。サイドバーはドラッグで移動でき、位置も保存されます。
// @description:en      Adds a detailed search options sidebar to SearXNG. Simplifies language selection to English and Japanese with auto-detection. The sidebar is draggable and its position is persisted.
// @description:zh-CN   为SearXNG添加详细搜索选项侧边栏，仅保留英文与日文并启用自动检测。侧边栏支持拖拽移动并可保存位置。
// @description:zh-TW   為 SearXNG 新增詳細搜尋選項側邊欄，僅保留英文與日文並啟用自動偵測。側邊欄可拖曳移動並保存位置。
// @description:ko      SearXNG에 상세 검색 옵션 사이드바를 추가합니다. 언어 선택은 영어/일본어와 자동 감지로 간소화됩니다. 사이드바는 드래그 이동 및 위치 저장을 지원합니다.
// @description:fr      Ajoute une barre latérale d’options de recherche à SearXNG. Langues réduites à anglais/japonais avec détection automatique. La barre est déplaçable et sa position est conservée.
// @description:es      Añade una barra lateral con opciones avanzadas a SearXNG. Selección de idioma simplificada a inglés y japonés con autodetección. La barra se puede arrastrar y guarda su posición.
// @description:de      Fügt SearXNG eine Seitenleiste mit erweiterten Suchoptionen hinzu. Sprachwahl auf Englisch/Japanisch mit Auto-Erkennung. Die Leiste ist verschiebbar und speichert ihre Position.
// @description:pt-BR   Adiciona uma barra lateral com opções detalhadas ao SearXNG, com idioma reduzido a inglês/japonês e detecção automática. A barra é arrastável e tem posição persistente.
// @description:ru      Добавляет в SearXNG боковую панель расширенных параметров поиска. Языки: английский/японский с автоопределением. Панель можно перетаскивать; позиция сохраняется.
// @namespace    https://github.com/koyasi777/searxng-search-options-enhancer
// @author       koyasi777
// @match        *://*/searx/search*
// @match        *://*/searxng/search*
// @match        *://searx.*/*
// @match        *://*.searx.*/*
// @match        https://search.localhost/*
// @grant        GM_addStyle
// @license      MIT
// @icon         https://docs.searxng.org/_static/searxng-wordmark.svg
// @downloadURL https://update.greasyfork.org/scripts/533586/SearXNG%E6%A4%9C%E7%B4%A2%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3%E5%BC%B7%E5%8C%96UI%20%F0%9F%94%8D%EF%B8%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/533586/SearXNG%E6%A4%9C%E7%B4%A2%E3%82%AA%E3%83%97%E3%82%B7%E3%83%A7%E3%83%B3%E5%BC%B7%E5%8C%96UI%20%F0%9F%94%8D%EF%B8%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** 🌐 言語フィルタ処理を先に定義しておく ***/
  function filterLanguageDropdown() {
    const allowedLanguages = [
      "all", "auto",          // デフォルト・自動検出
      "ja", "ja-JP",          // 日本語
      "en"
    ];

    const select = document.getElementById("language");
    if (!select) return;

    for (let i = select.options.length - 1; i >= 0; i--) {
      const opt = select.options[i];
      if (!allowedLanguages.includes(opt.value)) {
        select.remove(i);
      }
    }
  }

  /*** 🧩 以下、検索オプションサイドバー ***/
  const SIDEBAR_ID = 'gso-advanced-sidebar';
  const COLLAPSE_KEY = 'gso_sidebar_collapsed';
  const POS_KEY = 'gso_sidebar_pos'; // ⬅ 追加: 位置保存用

  const STYLE = `
    #${SIDEBAR_ID} {
      position: fixed;
      top: 100px;
      right: 20px;
      width: 260px;
      max-height: 90vh;
      overflow-y: auto;
      background: #ffffff;
      border: 1px solid #dadce0;
      border-radius: 12px;
      padding: 16px;
      font-family: Roboto, Arial, sans-serif;
      font-size: 13px;
      z-index: 99999;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
      color: #202124;
    }
    /* ⬇ 右寄せデフォルトをユーザ移動後は無効化 */
    #${SIDEBAR_ID}[data-user-pos="1"] { right: auto !important; }

    #${SIDEBAR_ID}.collapsed {
      width: 180px;
      max-height: 21px;
      overflow: hidden;
      padding: 6px 12px;
      padding-top:10px;
    }
    #${SIDEBAR_ID}.collapsed label,
    #${SIDEBAR_ID}.collapsed input,
    #${SIDEBAR_ID}.collapsed select,
    #${SIDEBAR_ID}.collapsed .gso-body {
      display: none;
    }
    #${SIDEBAR_ID} .gso-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      cursor: grab;            /* ⬅ ドラッグハンドル */
      user-select: none;
      touch-action: none;      /* ⬅ モバイルでのスクロール抑止（ヘッダ上） */
    }
    #${SIDEBAR_ID}.dragging {
      cursor: grabbing;
      box-shadow: 0 6px 18px rgba(0,0,0,0.30);
    }
    #${SIDEBAR_ID} .gso-header h3 {
      font-size: 14px;
      font-weight: bold;
      margin: 0;
      padding: 0;
    }
    #${SIDEBAR_ID} .gso-toggle {
      font-size: 12px;
      cursor: pointer;
      color: #3367d6;
      margin: 0;
      user-select: none;
      background: none;
      border: none;
      padding: 0;
    }
    #${SIDEBAR_ID} label {
      display: block;
      margin-top: 10px;
      font-weight: 500;
    }
    #${SIDEBAR_ID} input,
    #${SIDEBAR_ID} select {
      width: 100%;
      margin-top: 4px;
      padding: 6px;
      border: 1px solid #ccc;
      border-radius: 6px;
      background-color: #fff;
      color: #202124;
      box-sizing: border-box;
    }
    @media (prefers-color-scheme: dark) {
      #${SIDEBAR_ID} {
        background: #202124;
        color: #e8eaed;
        border: 1px solid #5f6368;
      }
      #${SIDEBAR_ID} input,
      #${SIDEBAR_ID} select {
        background-color: #303134;
        color: #e8eaed;
        border: 1px solid #5f6368;
      }
    }


    #${SIDEBAR_ID} .gso-buttons {
      display: flex;
      gap: 10px;
      margin-top: 16px;
    }

    #${SIDEBAR_ID} .gso-buttons button {
      flex: 1;
      padding: 8px 12px;
      border: none;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s ease, box-shadow 0.2s ease;
    }

    #${SIDEBAR_ID} .gso-buttons button:focus {
      outline: 2px solid #4285f4;
      outline-offset: 2px;
    }

    #${SIDEBAR_ID} .gso-buttons button:hover {
      filter: brightness(1.03);
    }

    #${SIDEBAR_ID} .gso-buttons button:active {
      transform: scale(0.97);
    }

    #${SIDEBAR_ID} .gso-clear {
      background: #f1f3f4;
      color: #202124;
    }

    #${SIDEBAR_ID} .gso-search {
      background: #1a73e8;
      color: white;
    }

    @media (prefers-color-scheme: dark) {
      #${SIDEBAR_ID} .gso-clear {
        background: #3c4043;
        color: #e8eaed;
      }
      #${SIDEBAR_ID} .gso-search {
        background: #8ab4f8;
        color: #202124;
      }
    }
  `;
  GM_addStyle(STYLE);

  const selects = {
    filetype: [['', 'すべて'], ['filetype:pdf', 'PDF'], ['filetype:doc', 'DOC'], ['filetype:xls', 'XLS'], ['filetype:ppt', 'PPT'], ['filetype:txt', 'TXT']],
    region: [['', 'すべて'], ['region:jp', '日本'], ['region:us', 'アメリカ'], ['region:cn', '中国']],
    occt: [['', '全体'], ['intitle:', 'タイトル'], ['inurl:', 'URL'], ['inanchor:', 'リンク先']],
    rights: [['', '制限なし'], ['cc_publicdomain', 'パブリックドメイン'], ['cc_attribute', '帰属'], ['cc_sharealike', '継承'], ['cc_noncommercial', '非営利']],
    date: [['', '指定なし'], ['date:h', '1時間以内'], ['date:d', '1日以内'], ['date:w', '1週間以内'], ['date:m', '1か月以内'], ['date:y', '1年以内']]
  };

  const timeRangeMap = {
    'hour': 'date:h',
    'day': 'date:d',
    'week': 'date:w',
    'month': 'date:m',
    'year': 'date:y'
  };
  const reverseTimeMap = Object.fromEntries(Object.entries(timeRangeMap).map(([k, v]) => [v, k]));

  // ==== 双方向同期（Sidebar <-> #q）====
  let syncingFromSidebar = false;
  let syncingFromQ = false;
  let syncTimer = 0;
  function debounce(fn, wait = 120) {
    return (...args) => {
      clearTimeout(syncTimer);
      syncTimer = setTimeout(() => fn(...args), wait);
    };
  }
  function syncQFromSidebarImmediate() {
    const qInput = document.querySelector('#q');
    if (!qInput) return;
    if (syncingFromQ) return;
    syncingFromSidebar = true;
    qInput.value = buildQueryFromUI();
    // 時間範囲のリアルタイム同期
    const dateValue = document.getElementById('gso-date')?.value || '';
    const timeRange = reverseTimeMap[dateValue] || '';
    const timeRangeSelect = document.getElementById('time_range');
    if (timeRangeSelect) timeRangeSelect.value = timeRange;
    syncingFromSidebar = false;
  }
  const syncQFromSidebar = debounce(syncQFromSidebarImmediate, 120);

  const fields = [
    ['all', 'すべてのキーワード'],
    ['exact', '完全一致キーワード'],
    ['any', 'いずれかのキーワード'],
    ['none', '含めないキーワード'],
    ['site', 'サイト・ドメイン'],
    ['filetype', 'ファイル形式'],
    ['region', '地域'],
    ['occt', '検索対象の範囲'],
    ['rights', 'ライセンス'],
    ['date', '最終更新']
  ];

  function parseQuery(query) {
    const result = Object.fromEntries(fields.map(([id]) => [id, '']));
    const tokens = query.match(/"[^"]+"|\S+/g) || [];
    const skipIndexes = new Set();
    const orWords = [];

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i + 1] === 'OR') {
        orWords.push(tokens[i]);
        skipIndexes.add(i);
        skipIndexes.add(i + 1);
        i += 1;
      } else if (tokens[i - 1] === 'OR') {
        orWords.push(tokens[i]);
        skipIndexes.add(i);
      }
    }
    result.any = [...new Set(orWords)].join(' ');

    for (let i = 0; i < tokens.length; i++) {
      if (skipIndexes.has(i)) continue;
      const token = tokens[i];

      if (token.startsWith('site:')) result.site = token.slice(5);
      else if (token.startsWith('filetype:')) result.filetype = token;
      else if (token.startsWith('region:')) result.region = token;
      else if (token.startsWith('date:')) result.date = token;
      else if (token.startsWith('cc_')) result.rights = token;
      else if (/^(intitle|inurl|inanchor):/.test(token)) result.occt = token.split(':')[0] + ':';
      else if (token.startsWith('"') && token.endsWith('"')) result.exact += token.slice(1, -1) + ' ';
      else if (token.startsWith('-')) result.none += token.slice(1) + ' ';
      else result.all += token + ' ';
    }

    return Object.fromEntries(Object.entries(result).map(([k, v]) => [k, v.trim()]));
  }

  function buildQueryFromUI(base = '') {
    const get = id => document.getElementById(`gso-${id}`)?.value.trim() || '';
    const parts = [];

    const exact = get('exact');
    const any = get('any');
    const none = get('none');
    const site = get('site');
    const filetype = get('filetype');
    const region = get('region');
    const rights = get('rights');
    const occt = get('occt');
    const all = get('all');

    const allWords = all.split(/\s+/).filter(Boolean);
    const anyWords = any.split(/\s+/).filter(Boolean);
    const noneWords = none.split(/\s+/).filter(Boolean);
    const exclusionWords = new Set([...anyWords, ...noneWords]);

    const filteredAll = allWords.filter(w => !exclusionWords.has(w));
    if (filteredAll.length > 0) {
      parts.push(occt ? `${occt}${filteredAll.join(' ')}` : filteredAll.join(' '));
    } else if (occt && allWords.length > 0) {
      parts.push(`${occt}${allWords.join(' ')}`);
    }

    if (exact) parts.push(`"${exact}"`);
    if (anyWords.length > 1) parts.push(anyWords.join(' OR '));
    else if (anyWords.length === 1) parts.push(anyWords[0]);
    noneWords.forEach(w => parts.push(`-${w}`));
    if (site) parts.push(`site:${site}`);
    if (filetype) parts.push(filetype);
    if (region) parts.push(region);
    if (rights) parts.push(rights);

    return parts.join(' ').trim();
  }

  function stripOrClauses(query) {
    const tokens = query.match(/"[^"]+"|\S+/g) || [];
    const result = [];
    let i = 0;

    while (i < tokens.length) {
      if (tokens[i + 1] === 'OR') {
        while (tokens[i + 1] === 'OR') {
          i += 2;
        }
        i += 1;
      } else {
        result.push(tokens[i]);
        i += 1;
      }
    }

    return result.join(' ');
  }

  function submitQuery() {
    const form = document.querySelector('form[action="/search"]');
    const input = form?.querySelector('input[name="q"]');
    if (!input) return;

    input.value = buildQueryFromUI();

    const dateValue = document.getElementById('gso-date')?.value || '';
    const timeRange = reverseTimeMap[dateValue] || '';
    const timeRangeSelect = document.getElementById('time_range');
    if (timeRangeSelect) {
        const trVal = timeRangeSelect.value;
        if (trVal && timeRangeMap[trVal]) {
          const dateSel = document.getElementById('gso-date');
          if (dateSel) dateSel.value = timeRangeMap[trVal];
        }
        // ネイティブ time_range 変更→サイドバー＆#q を即時同期
        timeRangeSelect.addEventListener('change', () => {
          const dateSel = document.getElementById('gso-date');
          if (dateSel && timeRangeMap[timeRangeSelect.value]) {
            dateSel.value = timeRangeMap[timeRangeSelect.value];
          }
          syncQFromSidebarImmediate();
        });
      }

    form.submit();
  }

  // ===== 🧲 ここからドラッグ＆位置保存ロジック =====
  function clampToViewport(left, top, el) {
    const pad = 8; // 画面端の余白
    const w = el.offsetWidth || 260; // 未描画時の保険
    const h = el.offsetHeight || 200;
    const maxLeft = Math.max(0, window.innerWidth - w - pad);
    const maxTop  = Math.max(0, window.innerHeight - h - pad);
    return {
      left: Math.min(Math.max(left, pad), maxLeft),
      top:  Math.min(Math.max(top,  pad), maxTop)
    };
  }

  function applyPos(sidebar, left, top) {
    const L = Math.round(left);
    const T = Math.round(top);
    sidebar.style.left = `${L}px`;
    sidebar.style.top  = `${T}px`;
    sidebar.style.right = 'auto';
    sidebar.dataset.userPos = '1';
  }

  function savePos(sidebar) {
    const r = sidebar.getBoundingClientRect();
    localStorage.setItem(POS_KEY, JSON.stringify({ left: r.left, top: r.top }));
  }

  function loadPos(sidebar) {
    const raw = localStorage.getItem(POS_KEY);
    if (!raw) return;
    try {
      const { left, top } = JSON.parse(raw);
      const { left: L, top: T } = clampToViewport(left, top, sidebar);
      applyPos(sidebar, L, T);
    } catch { /* noop */ }
  }

  function addDragBehavior(sidebar, handle) {
    let pointerId = null;
    let start = null;

    handle.addEventListener('pointerdown', (e) => {
      pointerId = e.pointerId;
      handle.setPointerCapture(pointerId);
      const r = sidebar.getBoundingClientRect();
      start = { x: e.clientX, y: e.clientY, left: r.left, top: r.top };
      sidebar.classList.add('dragging');
      document.body.style.userSelect = 'none';
    });

    handle.addEventListener('pointermove', (e) => {
      if (pointerId == null || !handle.hasPointerCapture(pointerId)) return;
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      const { left, top } = clampToViewport(start.left + dx, start.top + dy, sidebar);
      applyPos(sidebar, left, top);
    });

    const endDrag = () => {
      if (pointerId == null) return;
      handle.releasePointerCapture(pointerId);
      pointerId = null;
      sidebar.classList.remove('dragging');
      document.body.style.userSelect = '';
      savePos(sidebar);
    };

    handle.addEventListener('pointerup', endDrag);
    handle.addEventListener('pointercancel', endDrag);

    // ウィンドウリサイズで画面外に行かないように補正
    window.addEventListener('resize', () => {
      const raw = localStorage.getItem(POS_KEY);
      if (!raw) return;
      try {
        const { left, top } = JSON.parse(raw);
        const { left: L, top: T } = clampToViewport(left, top, sidebar);
        applyPos(sidebar, L, T);
        savePos(sidebar);
      } catch { /* noop */ }
    });

    // ダブルクリックで位置リセット（デフォルト: 右 20px / 上 100px）
    handle.addEventListener('dblclick', () => {
      localStorage.removeItem(POS_KEY);
      sidebar.dataset.userPos = '';
      sidebar.style.left = '';
      sidebar.style.top = '';
      sidebar.style.right = '';
    });
  }
  // ===== ここまでドラッグ＆位置保存ロジック =====

  // createInput に autoSubmit フラグ追加（Enterのみ有効）
  function createInput(labelText, id) {
    const label = document.createElement('label');
    label.textContent = labelText;
    const input = document.createElement('input');
    input.id = `gso-${id}`;
    input.name = id;
    label.appendChild(input);

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitQuery();
      }
    });
    // 入力のたびに #q をリアルタイム更新（デバウンス）
    input.addEventListener('input', () => {
      syncQFromSidebar();
    });

    return label;
  }

  // 修正: createSelect も同様に、Enterキー以外でsubmitしない
  function createSelect(labelText, id, options) {
    const label = document.createElement('label');
    label.textContent = labelText;
    const select = document.createElement('select');
    select.id = `gso-${id}`;
    select.name = id;
    options.forEach(([val, text]) => {
      const opt = document.createElement('option');
      opt.value = val;
      opt.textContent = text;
      select.appendChild(opt);
    });
    label.appendChild(select);
    // セレクト変更時は即時反映（待ち無し）
    select.addEventListener('change', () => {
      syncQFromSidebarImmediate();
    });
    return label;
  }

  // 🆕 ✅ Clearボタン用
  function clearSidebarInputs() {
    fields.forEach(([id]) => {
      const el = document.getElementById(`gso-${id}`);
      if (!el) return;
      if (el.tagName === 'INPUT') {
        el.value = '';
      } else if (el.tagName === 'SELECT') {
        el.selectedIndex = 0;
      }
    });

    ['uilang', 'safesearch'].forEach(id => {
      const el = document.getElementById(`gso-${id}`);
      if (el && el.tagName === 'SELECT') {
        el.selectedIndex = 0;
      }
    });
  }

  function createSelectFromNative(labelText, id, nativeSelector) {
    const native = document.querySelector(nativeSelector);
    if (!native) return null;

    const label = document.createElement('label');
    label.textContent = labelText;
    const select = document.createElement('select');
    select.id = `gso-${id}`;
    select.name = id;

    Array.from(native.options).forEach(opt => {
      const clone = opt.cloneNode(true);
      select.appendChild(clone);
    });

    select.value = native.value;
    select.addEventListener('change', () => {
      native.value = select.value;
      native.dispatchEvent(new Event('change'));
    });

    label.appendChild(select);
    return label;
  }

  // Sidebar生成関数（ドラッグ＆位置保存に対応）
  function insertSidebar() {
    if (document.getElementById(SIDEBAR_ID)) return;

    filterLanguageDropdown();

    const sidebar = document.createElement('div');
    sidebar.id = SIDEBAR_ID;

    const header = document.createElement('div');
    header.className = 'gso-header';
    const title = document.createElement('h3');
    title.textContent = '詳細検索オプション';
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'gso-toggle';
    toggle.textContent = '▲ 閉じる';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.addEventListener('pointerdown', (e) => { e.stopPropagation(); });
    toggle.addEventListener('mousedown', (e) => { e.stopPropagation(); });
    const onToggle = () => {
      // 折りたたみ時も「右上起点」に見えるよう、トグル前の右端を保持
      const pre = sidebar.getBoundingClientRect();
      const preLeft = pre.left;
      const preTop = pre.top;
      const preWidth = pre.width;

      const collapsed = sidebar.classList.toggle('collapsed');
      toggle.textContent = collapsed ? '▼ 開く' : '▲ 閉じる';
      toggle.setAttribute('aria-expanded', String(!collapsed));
      localStorage.setItem(COLLAPSE_KEY, collapsed ? '1' : '0');

      if (sidebar.dataset.userPos === '1') {
        requestAnimationFrame(() => {
          const post = sidebar.getBoundingClientRect();
          // 右端（preLeft + preWidth）を不変にして、新しい幅に合わせて left を再計算
          const desiredLeft = preLeft + preWidth - post.width;
          const { left, top } = clampToViewport(desiredLeft, preTop, sidebar);
          applyPos(sidebar, left, top);
          savePos(sidebar);
        });
      }
    };
    toggle.addEventListener('click', (e) => { e.stopPropagation(); onToggle(); });
    toggle.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onToggle(); } });
    header.appendChild(title);
    header.appendChild(toggle);
    sidebar.appendChild(header);

    const body = document.createElement('div');
    body.className = 'gso-body';
    body.id = 'gso-body';
    fields.forEach(([id, label]) => {
      body.appendChild(selects[id] ? createSelect(label, id, selects[id]) : createInput(label, id));
    });

    const languageSyncUI = createSelectFromNative('言語設定', 'uilang', '#language');
    if (languageSyncUI) body.appendChild(languageSyncUI);

    const safeSearchUI = createSelectFromNative('セーフサーチ', 'safesearch', '#safesearch');
    if (safeSearchUI) body.appendChild(safeSearchUI);

    // 🆕 ✅ Clear/Searchボタン
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'gso-buttons';

    const clearButton = document.createElement('button');
    clearButton.textContent = '🧹 Clear';
    clearButton.className = 'gso-clear';
    clearButton.onclick = () => clearSidebarInputs();

    const searchButton = document.createElement('button');
    searchButton.textContent = '🔍 Search';
    searchButton.className = 'gso-search';
    searchButton.onclick = () => { setTimeout(() => submitQuery(), 0); };

    buttonContainer.appendChild(clearButton);
    buttonContainer.appendChild(searchButton);
    body.appendChild(buttonContainer);

    sidebar.appendChild(body);
    document.body.appendChild(sidebar);

    // ⬇ ここでドラッグ＆位置保存ハンドラを有効化
    addDragBehavior(sidebar, header);

    const qInput = document.querySelector('#q');
    if (qInput) {
      const parsed = parseQuery(qInput.value);
      fields.forEach(([id]) => {
        const el = document.getElementById(`gso-${id}`);
        if (el && parsed[id]) el.value = parsed[id];
      });

      const syncSidebarFromQ = () => {
        if (syncingFromSidebar) return; // 片方向同期の循環防止
        syncingFromQ = true;
        const updated = parseQuery(qInput.value);
        fields.forEach(([id]) => {
          const el = document.getElementById(`gso-${id}`);
          if (el) el.value = updated[id] || '';
        });
        // time_range -> gso-date は SearXNG 側が変わる場合もあるため再同期
        const timeRangeSelect = document.getElementById('time_range');
        const dateSel = document.getElementById('gso-date');
        if (timeRangeSelect && dateSel && timeRangeMap[timeRangeSelect.value]) {
          dateSel.value = timeRangeMap[timeRangeSelect.value];
        }
        syncingFromQ = false;
      };
      qInput.addEventListener('input', syncSidebarFromQ);
      qInput.addEventListener('change', syncSidebarFromQ);

      const timeRangeSelect = document.getElementById('time_range');
      if (timeRangeSelect) {
        const trVal = timeRangeSelect.value;
        if (trVal && timeRangeMap[trVal]) {
          const dateSel = document.getElementById('gso-date');
          if (dateSel) dateSel.value = timeRangeMap[trVal];
        }
      }

      const form = document.querySelector('form[action="/search"]');
      if (form) {
        qInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            submitQuery();
          }
        });
      }
    }

    const saved = localStorage.getItem(COLLAPSE_KEY);
    if (saved === '1') {
      sidebar.classList.add('collapsed');
      // toggle.textContent は上の onclick ロジックに合わせる
      const toggleEl = sidebar.querySelector('.gso-toggle');
      if (toggleEl) toggleEl.textContent = '▼ 開く';
    }

    // ⬇ 最後に保存済み位置を反映（collapsed 状態も考慮して補正）
    loadPos(sidebar);
  }

  window.addEventListener('load', insertSidebar);
})();
