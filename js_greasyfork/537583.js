// ==UserScript==
// @name         更方便地看Livebench
// @author       schweigen
// @namespace    https://www.tampermonkey.net/
// @version      1.1
// @description  在 page 世界劫持 fetch/XHR，监听资源加载，捕获 table_*.csv → 生成可排序/搜索的完整排行榜 HTML，并提供可选下载
// @license      MIT
// @match        https://livebench.ai/*
// @run-at       document-start
// @inject-into  page
// @noframes     false
// @grant        unsafeWindow
// @grant        GM_openInTab
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_registerMenuCommand
// @connect      livebench.ai
// @connect      cdn.livebench.ai
// @downloadURL https://update.greasyfork.org/scripts/537583/%E6%9B%B4%E6%96%B9%E4%BE%BF%E5%9C%B0%E7%9C%8BLivebench.user.js
// @updateURL https://update.greasyfork.org/scripts/537583/%E6%9B%B4%E6%96%B9%E4%BE%BF%E5%9C%B0%E7%9C%8BLivebench.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ——配置：是否自动打开预览 & 自动下载——
  const AUTO_OPEN_TAB = true;
  const AUTO_DOWNLOAD_HTML = false;
  const AUTO_DOWNLOAD_CSV  = false;

  // 匹配任何主机上包含 table_*.csv 的 URL（以防走 CDN）
  const CSV_RX = /(^|\/)table_[^/?#]+\.csv(\?|$)/i;
  // 匹配分类映射 categories_*.json
  const CATEGORY_RX = /(^|\/)categories_[^/?#]+\.json(\?|$)/i;
  const seen = new Set();
  const categoriesSeen = new Set();
  const pendingCsv = [];
  let categoryGroups = null;
  let categoryFallbackTimer = null;
  const CATEGORY_WAIT_MS = 3000;
  // 防止 PerformanceObserver 反复二次拉取造成请求风暴
  const refetching = new Set();
  const categoriesRefetching = new Set();

  // ——大类映射（默认兜底）；如果能从站点拉到最新 JSON，会以站点为准——
  const CATEGORY_GROUPS_DEFAULT = {
    'Agentic Coding': ['javascript','typescript','python'],
    'Coding': ['code_generation','code_completion'],
    'Data Analysis': ['tablejoin','tablereformat'],
    'IF': ['paraphrase','simplify','story_generation','summarize'],
    'Language': ['connections','plot_unscrambling','typos'],
    'Mathematics': ['AMPS_Hard','math_comp','olympiad'],
    'Reasoning': ['theory_of_mind','zebra_puzzle','spatial']
  };

  function flushPendingCsv() {
    if (!categoryGroups || !pendingCsv.length) return;
    const list = pendingCsv.splice(0);
    list.forEach(({ url, text }) => { processCsv(url, text, categoryGroups); });
  }

  function setCategoryGroups(groups, source) {
    if (!groups || typeof groups !== 'object') return;
    categoryGroups = groups;
    tip('捕获到 categories_*.json：' + (source || ''));
    flushPendingCsv();
  }

  function scheduleCategoryFallback() {
    if (categoryFallbackTimer) return;
    categoryFallbackTimer = setTimeout(() => {
      if (!categoryGroups) {
        categoryGroups = CATEGORY_GROUPS_DEFAULT;
        tip('未捕获 categories_*.json，使用兜底默认映射');
        flushPendingCsv();
      }
    }, CATEGORY_WAIT_MS);
  }

  const HEADER_INFO = {
    AMPS_Hard: {
      label: 'AMPS 困难',
      tip: 'AMPS_Hard：LiveBench 的合成高难数学题子任务，聚焦复杂计算并支持自动判分',
    },
    code_completion: {
      label: '代码补全',
      tip: 'code_completion：根据已有上下文补全缺失的代码片段',
    },
    code_generation: {
      label: '代码生成',
      tip: 'code_generation：依据自然语言需求从零生成可执行代码',
    },
    connections: {
      label: 'Connections 谜题',
      tip: 'connections：类似纽约时报 Connections 的分类推理题',
    },
    javascript: {
      label: 'JavaScript',
    },
    math_comp: {
      label: '数学计算',
      tip: 'math_comp：中等篇幅的数学运算题，侧重计算准确性',
    },
    olympiad: {
      label: '奥赛题',
      tip: 'olympiad：来源于数学/科学奥林匹克竞赛的高难度题目',
    },
    paraphrase: {
      label: '语句改写',
      tip: 'paraphrase：在保持语义的前提下改写句子或段落',
    },
    plot_unscrambling: {
      label: '剧情重排',
      tip: 'plot_unscrambling：将打乱的剧情片段恢复到正确顺序',
    },
    python: {
      label: 'Python',
    },
    simplify: {
      label: '表达式化简',
      tip: 'simplify：对代数或逻辑表达式进行化简处理',
    },
    spatial: {
      label: '空间推理',
      tip: 'spatial：考察空间关系与图形推理能力的题目',
    },
    story_generation: {
      label: '故事生成',
      tip: 'story_generation：根据提示生成连贯的短篇故事',
    },
    summarize: {
      label: '摘要生成',
      tip: 'summarize：从文章中提炼关键信息并生成摘要',
    },
    tablejoin: {
      label: '表格关联',
      tip: 'tablejoin：跨多张表查找并关联信息得出答案',
    },
    tablereformat: {
      label: '表格重排',
      tip: 'tablereformat：将表格内容整理成指定的格式',
    },
    typescript: {
      label: 'TypeScript',
    },
    typos: {
      label: '错别字纠正',
      tip: 'typos：识别并修正输入中的拼写或错别字',
    },
    web_of_lies_v3: {
      label: '谎言之网 v3',
      tip: 'web_of_lies_v3：在多轮陈述中辨别真假信息的推理题',
    },
    zebra_puzzle: {
      label: '斑马谜题',
      tip: 'zebra_puzzle：经典的逻辑约束推理谜题，也称爱因斯坦谜题',
    },
    'Livebench综合分': {
      tip: '按各大类的均值再取平均（忽略空/NA），保留 3 位小数'
    },
    // ——大类平均列（显示为中文 + 说明）——
    'Agentic Coding 平均': {
      tip: 'Agentic Coding 大类的子任务均值（忽略空/NA），保留 3 位小数'
    },
    'Coding 平均': {
      tip: 'Coding 大类的子任务均值（忽略空/NA），保留 3 位小数'
    },
    'Data Analysis 平均': {
      tip: 'Data Analysis 大类的子任务均值（忽略空/NA），保留 3 位小数'
    },
    'IF 平均': {
      tip: 'IF 大类（改写/化简/故事/摘要）的子任务均值（忽略空/NA），保留 3 位小数'
    },
    'Language 平均': {
      tip: 'Language 大类（文字类推理）的子任务均值（忽略空/NA），保留 3 位小数'
    },
    'Mathematics 平均': {
      tip: 'Mathematics 大类（AMPS_Hard / math_comp / olympiad）的均值（忽略空/NA），保留 3 位小数'
    },
    'Reasoning 平均': {
      tip: 'Reasoning 大类（web_of_lies_v3 / zebra_puzzle / spatial）的均值（忽略空/NA），保留 3 位小数'
    },
  };

  // ——小提示条，方便你确认脚本是否在 page 世界运行——
  const tip = (msg) => {
    try {
      let div = document.getElementById('__lb_sniffer_tip__');
      if (!div) {
        div = document.createElement('div');
        div.id = '__lb_sniffer_tip__';
        div.style.cssText =
          'position:fixed;right:10px;bottom:10px;background:#111a;color:#d7e1ee;' +
          'border:1px solid #22303d;padding:6px 10px;border-radius:8px;font:12px/1.4 ui-sans-serif;z-index:2147483647';
        document.documentElement.appendChild(div);
      }
      div.textContent = '[LiveBench拦截器] ' + msg;
      setTimeout(() => { if (div && div.parentNode) div.parentNode.removeChild(div); }, 5000);
    } catch(_) {}
  };
  tip('已加载（page 世界）');

  // ——CSV 解析（稳健）——
  function parseCSV(text) {
    const rows = [];
    let i = 0, cur = '', row = [], inQ = false;
    if (text.charCodeAt(0) === 0xFEFF) text = text.slice(1);
    while (i < text.length) {
      const ch = text[i];
      if (inQ) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cur += '"'; i += 2; }
          else { inQ = false; i++; }
        } else { cur += ch; i++; }
      } else {
        if (ch === '"') { inQ = true; i++; }
        else if (ch === ',') { row.push(cur); cur = ''; i++; }
        else if (ch === '\r') { i++; }
        else if (ch === '\n') { row.push(cur); cur = ''; rows.push(row); row = []; i++; }
        else { cur += ch; i++; }
      }
    }
    if (cur.length > 0 || row.length > 0) { row.push(cur); rows.push(row); }
    const maxLen = rows.reduce((m, r) => Math.max(m, r.length), 0);
    for (const r of rows) while (r.length < maxLen) r.push('');
    return rows;
  }

  // ——生成单文件预览 HTML（可排序/过滤/下载）——
  function buildHTML({ csvText, url, parsed, groups }) {
    let [header, ...data] = parsed;

    // 基于提供/兜底的大类映射，拼接大类平均列
    try {
      const headerIndex = new Map(header.map((h,i)=>[h,i]));
      const useGroups = groups && typeof groups === 'object' ? groups : CATEGORY_GROUPS_DEFAULT;
      const groupDefs = [];
      const appendedHeaders = [];
      for (const [gName, keys] of Object.entries(useGroups)) {
        const presentIdx = keys
          .map(k => headerIndex.has(k) ? headerIndex.get(k) : null)
          .filter(i => i !== null && i !== undefined);
        if (presentIdx.length) {
          const colName = gName + ' 平均';
          groupDefs.push({ gName, colName, idx: presentIdx });
          appendedHeaders.push(colName);
        }
      }
      if (groupDefs.length) {
        const modelIdx = header.findIndex(h=>/model/i.test(h));
        const insertPos = (modelIdx>=0?modelIdx+1:0);
        data = data.map(row => {
          const groupAverages = [];
          const added = groupDefs.map(g => {
            if (!g.idx.length) { groupAverages.push(NaN); return 'N/A'; }
            let sum = 0, cnt = 0;
            let missing = false;
            for (const i of g.idx) {
              const cell = (row[i] ?? '').trim();
              if (!cell) { missing = true; continue; }
              const lv = cell.toLowerCase();
              if (lv === 'na' || lv === 'n/a') { missing = true; continue; }
              const num = Number(cell);
              if (Number.isNaN(num)) { missing = true; continue; }
              sum += num;
              cnt++;
            }
            if (missing || cnt !== g.idx.length) {
              groupAverages.push(NaN);
              return 'N/A';
            }
            const avg = sum / cnt;
            groupAverages.push(avg);
            return avg.toFixed(3);
          });
          // 计算“Livebench综合分”列：仅在无缺失时取各大类均值平均
          const hasMissingGroups = groupAverages.some(v => Number.isNaN(v));
          let overallCell = 'N/A';
          if (!hasMissingGroups && groupAverages.length) {
            const overall = groupAverages.reduce((a,b)=>a+b,0) / groupAverages.length;
            if (Number.isFinite(overall)) overallCell = overall.toFixed(3);
          }
          const left = row.slice(0, insertPos);
          const right = row.slice(insertPos);
          return left.concat([overallCell]).concat(right).concat(added);
        });
        header = header.slice(0, insertPos).concat(['Livebench综合分']).concat(header.slice(insertPos)).concat(appendedHeaders);
      }
    } catch(_) {}

    const isNum = header.map((_, i) => {
      let n = 0, s = 0;
      for (const r of data) {
        const v = (r[i] ?? '').trim();
        if (!v || v.toLowerCase() === 'na' || v.toLowerCase() === 'n/a') continue;
        s++; if (!Number.isNaN(Number(v))) n++;
      }
      return s > 0 && n / Math.max(1, s) > 0.7;
    });
    const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');

    const thead = `<tr>${
      header.map((h, i) => {
        const info = HEADER_INFO[h] || {};
        const label = info.label || h;
        const tipAttr = info.tip ? ` data-tip="${esc(info.tip)}"` : '';
        return `<th data-col="${i}" data-type="${isNum[i]?'num':'str'}"${tipAttr}>${esc(label)}</th>`;
      }).join('')
    }</tr>`;
    const tbody = data.map(r => `<tr>${
      r.map((v, i) => {
        const raw = (v ?? '').toString().trim();
        if (isNum[i] && raw !== '' && !Number.isNaN(Number(raw))) {
          const num = Number(raw);
          return `<td data-num="1" data-sort="${num}">${esc(raw)}</td>`;
        }
        return `<td data-num="${isNum[i] ? '1' : '0'}">${esc(raw)}</td>`;
      }).join('')
    }</tr>`).join('');
    const csvEsc = csvText.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    const meta = `来源：${esc(url)} ｜ 捕获时间：${new Date().toLocaleString()}`;
    const headerJson = JSON.stringify(header).replace(/</g, '\\u003C');
    const groupsJson = JSON.stringify(groups||CATEGORY_GROUPS_DEFAULT).replace(/</g, '\\u003C');

    return `<!doctype html><html><head><meta charset="utf-8"/>
<title>LiveBench 完整排行榜</title>
    <style>
body{margin:0;font:14px/1.5 ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,Inter,Arial}
body[data-theme="dark"]{--bg:#0b0d10;--card:#12161c;--surface:#0f141b;--surface-strong:#0f141b;--surface-hover:#182230;--muted:#a7b3c5;--text:#e6edf3;--accent:#5da0ff;--line:#1e2630;--tooltip-bg:rgba(17,26,36,.95);--shadow:0 12px 28px rgba(0,0,0,.45);--header-bg-from:rgba(11,13,16,.95);--header-bg-to:rgba(11,13,16,.8);--color-scheme:dark;--cell-a:rgba(255,255,255,.02);--cell-b:rgba(255,255,255,.035);--cell-c:rgba(255,255,255,.05);--cell-d:rgba(255,255,255,.07)}
body[data-theme="light"]{--bg:#f6f8fc;--card:#ffffff;--surface:#f1f5fb;--surface-strong:#eef3ff;--surface-hover:#e2e8ff;--muted:#4a5568;--text:#1f2933;--accent:#2563eb;--line:rgba(99,115,129,.25);--tooltip-bg:rgba(255,255,255,.96);--shadow:0 14px 32px rgba(15,23,42,.12);--header-bg-from:rgba(246,248,252,.95);--header-bg-to:rgba(246,248,252,.85);--color-scheme:light;--cell-a:rgba(15,23,42,.02);--cell-b:rgba(15,23,42,.045);--cell-c:rgba(15,23,42,.06);--cell-d:rgba(15,23,42,.08)}
body{background:var(--bg);color:var(--text);color-scheme:var(--color-scheme);transition:background .2s ease,color .2s ease}
header{position:sticky;top:0;background:linear-gradient(180deg,var(--header-bg-from),var(--header-bg-to));backdrop-filter:blur(6px);z-index:5;border-bottom:1px solid var(--line)}
.wrap{max-width:1200px;margin:0 auto;padding:14px}
.meta{color:var(--muted);font-size:12px;margin-top:4px}
.toolbar{display:flex;gap:10px;align-items:center;margin-top:10px;flex-wrap:wrap}
.toolbar input{background:var(--surface);border:1px solid var(--line);color:var(--text);padding:8px 10px;border-radius:8px;flex:1 1 240px;min-width:200px}
.toolbar button{background:var(--card);border:1px solid var(--line);color:var(--text);padding:8px 12px;border-radius:8px;cursor:pointer;transition:border-color .15s ease,background .15s ease}
.toolbar button:hover{border-color:var(--accent)}
.card{background:var(--card);border:1px solid var(--line);border-radius:14px;overflow:auto;margin:16px auto;max-width:1200px}
table{border-collapse:separate;border-spacing:0;min-width:100%}
thead th{position:sticky;top:0;background:var(--surface-strong);border-bottom:1px solid var(--line);padding:10px 12px;text-align:left;cursor:pointer;white-space:nowrap;transition:color .15s ease}
thead th:hover{color:var(--accent)}
tbody td{border-bottom:1px solid var(--line);padding:8px 12px;vertical-align:top;white-space:nowrap;transition:background .12s ease}
tbody tr:nth-child(odd) td:nth-child(odd){background:var(--cell-a)}
tbody tr:nth-child(odd) td:nth-child(even){background:var(--cell-b)}
tbody tr:nth-child(even) td:nth-child(odd){background:var(--cell-c)}
tbody tr:nth-child(even) td:nth-child(even){background:var(--cell-d)}
tbody tr:hover td{background:var(--surface-hover)}
.count{color:var(--muted);font-size:12px;margin:8px 0}
.hint{color:var(--muted);font-size:12px;margin-left:6px}
#lbThTooltip{position:fixed;max-width:260px;background:var(--tooltip-bg);color:var(--text);padding:8px 10px;border-radius:8px;border:1px solid var(--line);box-shadow:var(--shadow);font-size:12px;line-height:1.45;pointer-events:none;opacity:0;visibility:hidden;transform:translateY(-4px);transition:opacity .12s ease,transform .12s ease;z-index:2147483646}
#lbThTooltip.show{opacity:1;visibility:visible;transform:translateY(0)}
.compare-panel{display:none;flex-direction:column;gap:10px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:14px;margin-top:12px}
.compare-panel.active{display:flex}
.compare-header{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px;align-items:center}
.compare-header strong{font-size:14px}
.compare-controls{display:flex;gap:8px;align-items:center;flex-wrap:wrap;min-width:240px}
.compare-controls input{flex:1 1 220px;min-width:180px;background:var(--surface);border:1px solid var(--line);color:var(--text);padding:6px 10px;border-radius:8px}
.compare-panel button{background:var(--card);border:1px solid var(--line);color:var(--text);padding:6px 10px;border-radius:8px;cursor:pointer;transition:border-color .15s ease,background .15s ease}
    .compare-panel button:hover{border-color:var(--accent)}
    .compare-actions{display:flex;gap:6px}
    .compare-list{max-height:240px;overflow:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:6px}
    .compare-item{display:flex;align-items:center;gap:6px;background:var(--surface);border:1px solid transparent;border-radius:8px;padding:6px 8px;transition:border-color .15s ease,background .15s ease}
    .compare-item input{margin:0}
    .compare-item.highlight{border-color:var(--accent);background:var(--surface-hover)}
    .compare-hint{color:var(--muted);font-size:12px}
    /* 模型名专属颜色（按主题区分） */
    body[data-theme="dark"] td.model-col{color:#4EACF9 !important}
    body[data-theme="light"] td.model-col{color:#8819CB !important}
    </style>
</head>
<body data-theme="dark">
<header>
  <div class="wrap">
    <h2 style="margin:0 0 4px">LiveBench 完整排行榜</h2>
    <div class="meta">${meta}</div>
    <div class="toolbar">
      <input id="filterBox" placeholder="输入模型关键词（空格分隔，忽略大小写和连字符）"/>
      <button id="downloadCsvBtn">下载 CSV</button>
      <button id="downloadHtmlBtn">下载此页面 HTML</button>
      <button id="toggleThemeBtn">切换亮色</button>
      <button id="toggleCompareBtn">选择模型对比</button>
      <button id="toggleViewBtn">显示小类</button>
      <span class="hint">提示：点击表头排序；关键词模糊匹配模型名；勾选模型可只看对比</span>
    </div>
  </div>
</header>
<div class="card"><table id="lbTable"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>
<div class="wrap"><div class="count" id="rowCount"></div></div>
<div class="wrap">
  <div id="comparePanel" class="compare-panel" aria-hidden="true">
    <div class="compare-header">
      <strong>模型对比（勾选后仅显示所选模型）</strong>
      <div class="compare-controls">
        <input id="compareSearch" placeholder="筛选模型关键词"/>
        <div class="compare-actions">
          <button id="compareSelectAll" type="button">全选</button>
          <button id="compareClear" type="button">清空</button>
        </div>
      </div>
    </div>
    <div id="compareList" class="compare-list"></div>
    <div class="compare-hint" id="compareHint">未选择模型时显示全部排行</div>
  </div>
</div>
<script id="__csv" type="text/plain">${csvEsc}</script>
<script>
(function(){
  const headerNames=${headerJson};
  const groupsMap=${groupsJson};
  const table=document.getElementById('lbTable'),tbody=table.tBodies[0],ths=[...table.tHead.rows[0].cells];
  const themeToggleBtn=document.getElementById('toggleThemeBtn');
  const viewToggleBtn=document.getElementById('toggleViewBtn');
  const prefersLight=window.matchMedia ? window.matchMedia('(prefers-color-scheme: light)') : null;
  let manualTheme=null;
  const applyTheme=theme=>{
    const next=theme==='light'?'light':'dark';
    document.body.setAttribute('data-theme',next);
    document.body.style.colorScheme=next;
    if(themeToggleBtn) themeToggleBtn.textContent=next==='light'?'切换暗色':'切换亮色';
  };
  const initTheme=()=>{
    const theme=manualTheme || (prefersLight && prefersLight.matches ? 'light' : 'dark');
    applyTheme(theme);
  };
  initTheme();
  if(prefersLight){
    const handler=e=>{ if(manualTheme) return; applyTheme(e.matches?'light':'dark'); };
    if(typeof prefersLight.addEventListener==='function') prefersLight.addEventListener('change',handler);
    else if(typeof prefersLight.addListener==='function') prefersLight.addListener(handler);
  }
  if(themeToggleBtn){
    themeToggleBtn.addEventListener('click',()=>{
      const current=document.body.getAttribute('data-theme')==='light'?'light':'dark';
      const next=current==='light'?'dark':'light';
      manualTheme=next;
      applyTheme(next);
    });
  }
  let sortCol=-1,sortDir=1;
  const isNumCell=td=>td.getAttribute('data-num')==='1';
  const getVal=td=>{
    if(!isNumCell(td)) return td.textContent.trim().toLowerCase();
    if(td.dataset && td.dataset.sort!==undefined){
      const v=Number(td.dataset.sort); return Number.isNaN(v)?-Infinity:v;
    }
    const t=td.textContent.trim();
    if(t==='') return -Infinity;
    const n=Number(t);
    return Number.isNaN(n)?-Infinity:n;
  };
  function sortBy(c,forceDir){
    if(typeof forceDir==='number') { sortCol=c; sortDir=forceDir; }
    else if(sortCol===c) sortDir*=-1; else { sortCol=c; sortDir=-1 }
    const rows=[...tbody.rows];
    rows.sort((a,b)=>{const va=getVal(a.cells[c]),vb=getVal(b.cells[c]); return va<vb?-1*sortDir:va>vb?1*sortDir:0});
    const f=document.createDocumentFragment(); rows.forEach(r=>f.appendChild(r)); tbody.appendChild(f);
  }
  ths.forEach((th,i)=>th.addEventListener('click',()=>sortBy(i)));
  const overallIdx = headerNames.findIndex(h=>h==='Livebench综合分');
  // ——列可见性：默认显示大类列（平均），提供一键切换小类视图——
  const groupColIdx=new Set();
  const leafNameSet=(()=>{ const s=new Set(); try{ for(const k in groupsMap){ (groupsMap[k]||[]).forEach(x=>s.add(String(x))); } }catch(_){} return s; })();
  const leafColIdx=new Set();
  headerNames.forEach((h,i)=>{
    if(/ 平均$/.test(h)) groupColIdx.add(i);
    if(leafNameSet.has(h)) leafColIdx.add(i);
  });
  const metaColIdx=new Set(headerNames.map((_,i)=>i).filter(i=>!groupColIdx.has(i)&&!leafColIdx.has(i)));
  let viewMode='group';
  function applyView(){
    const showGroup=viewMode==='group';
    const shouldShow=(i)=> metaColIdx.has(i) || (showGroup?groupColIdx.has(i):leafColIdx.has(i));
    // 表头
    ths.forEach((th,i)=>{ th.style.display=shouldShow(i)?'':'none'; });
    // 每行
    [...tbody.rows].forEach(tr=>{
      [...tr.cells].forEach((td,i)=>{ td.style.display=shouldShow(i)?'':'none'; });
    });
    if(viewToggleBtn) viewToggleBtn.textContent = showGroup ? '显示小类' : '显示大类';
    if(overallIdx!==-1) sortBy(overallIdx,-1);
  }
  applyView();
  if(viewToggleBtn){ viewToggleBtn.addEventListener('click',()=>{ viewMode = (viewMode==='group'?'leaf':'group'); applyView(); }); }
  const filterBox=document.getElementById('filterBox'),rowCount=document.getElementById('rowCount');
  const allRows=[...tbody.rows];
  if(overallIdx!==-1){
    // 让“Livebench综合分”列用与模型名相同的高亮颜色
    allRows.forEach(row=>{
      const cell=row.cells[overallIdx];
      if(cell) cell.classList.add('model-col');
    });
  }
  const normalize=str=>str.toLowerCase().replace(/[-_/]/g,' ').replace(/\s+/g,' ').trim();
  const keywordsMatch=(text,keywords)=>{
    if(!keywords.length) return true;
    if(!text) return false;
    return keywords.every(kw=>text.includes(kw));
  };
  allRows.forEach(row=>{
    const rowText=[...row.cells].map(td=>td.textContent).join(' ');
    row.dataset.rowNorm=normalize(rowText);
  });
  let filterKeywords=[];
  const clearFilter=()=>{
    if(!filterKeywords.length && !filterBox.value) return;
    filterKeywords=[];
    filterBox.value='';
  };
  const selectedModels=new Set();
  const modelCol=headerNames.findIndex(h=>/model/i.test(h));
  if(modelCol!==-1){
    allRows.forEach(row=>{
      const cell=row.cells[modelCol];
      const name=cell?cell.textContent.trim():'';
      if(cell) cell.classList.add('model-col');
      row.dataset.modelKey=name;
      row.dataset.modelNorm=normalize(name);
    });
  }
  const comparePanel=document.getElementById('comparePanel');
  const toggleCompareBtn=document.getElementById('toggleCompareBtn');
  const compareList=document.getElementById('compareList');
  const compareSearch=document.getElementById('compareSearch');
  const compareSelectAll=document.getElementById('compareSelectAll');
  const compareClear=document.getElementById('compareClear');
  const compareHint=document.getElementById('compareHint');
  const hasModelColumn=modelCol!==-1 && comparePanel && compareList;
  let compareItems=[];
  const updateCompareHint=()=>{
    if(compareHint){
      const count=selectedModels.size;
      compareHint.textContent = count ? '已选 ' + count + ' 个模型，仅显示对应行' : '未选择模型时显示全部排行';
    }
  };
  const updateHighlight=()=>{
    compareItems.forEach(item=>{
      const checked=selectedModels.has(item.name);
      item.input.checked=checked;
      item.label.classList.toggle('highlight',checked);
    });
    updateCompareHint();
  };
  if(hasModelColumn){
    const modelMap=new Map();
    allRows.forEach(row=>{
      const key=row.dataset.modelKey||'';
      if(!key) return;
      if(!modelMap.has(key)) modelMap.set(key,{norm:normalize(key)});
    });
    const sortedModels=[...modelMap.entries()].sort((a,b)=>a[0].localeCompare(b[0],undefined,{sensitivity:'base'}));
    const frag=document.createDocumentFragment();
    compareItems=sortedModels.map(([name,info])=>{
      const label=document.createElement('label');
      label.className='compare-item';
      label.dataset.norm=info.norm;
      const input=document.createElement('input');
      input.type='checkbox';
      input.value=name;
      const span=document.createElement('span');
      span.textContent=name;
      input.addEventListener('change',()=>{
        if(input.checked){ selectedModels.add(name); } else { selectedModels.delete(name); }
        label.classList.toggle('highlight',input.checked);
        if(selectedModels.size>0) clearFilter();
        updateCompareHint();
        applyFilters();
      });
      label.appendChild(input);
      label.appendChild(span);
      frag.appendChild(label);
      return {name,norm:info.norm,input,label};
    });
    compareList.appendChild(frag);
    if(toggleCompareBtn){
      toggleCompareBtn.addEventListener('click',()=>{
        const active=!comparePanel.classList.contains('active');
        comparePanel.classList.toggle('active',active);
        comparePanel.setAttribute('aria-hidden',active?'false':'true');
        toggleCompareBtn.textContent=active?'隐藏对比':'选择模型对比';
      });
    }
    if(compareSearch){
      compareSearch.addEventListener('input',()=>{
        const kw=normalize(compareSearch.value).split(' ').filter(Boolean);
        compareItems.forEach(item=>{
          const match=!kw.length||kw.every(k=>item.norm.includes(k));
          item.label.style.display=match?'':'none';
        });
      });
    }
    if(compareSelectAll){
      compareSelectAll.addEventListener('click',()=>{
        selectedModels.clear();
        compareItems.forEach(item=>selectedModels.add(item.name));
        clearFilter();
        updateHighlight();
        applyFilters();
      });
    }
    if(compareClear){
      compareClear.addEventListener('click',()=>{
        selectedModels.clear();
        updateHighlight();
        applyFilters();
      });
    }
    updateHighlight();
  }else{
    if(toggleCompareBtn) toggleCompareBtn.style.display='none';
    if(comparePanel) comparePanel.remove();
  }
  function applyFilters(){
    const useSelection=hasModelColumn && selectedModels.size>0;
    let visible=0;
    allRows.forEach(row=>{
      const source=hasModelColumn ? (row.dataset.modelNorm||'') : row.dataset.rowNorm;
      const matchText=keywordsMatch(source,filterKeywords);
      const matchModel=!useSelection || selectedModels.has(row.dataset.modelKey);
      const show=matchText && matchModel;
      row.style.display=show?'':'none';
      if(show) visible++;
    });
    rowCount.textContent='当前显示 '+visible+' / '+allRows.length+' 行';
    if(overallIdx!==-1) sortBy(overallIdx,-1);
  }
  filterBox.addEventListener('input',()=>{
    filterKeywords=normalize(filterBox.value).split(' ').filter(Boolean);
    applyFilters();
  });
  applyFilters();
  if(overallIdx!==-1) sortBy(overallIdx,-1);
  const csvText=document.getElementById('__csv').textContent;
  document.getElementById('downloadCsvBtn').addEventListener('click',()=>{
    const a=document.createElement('a'); a.href='data:text/csv;charset=utf-8,'+encodeURIComponent(csvText); a.download='livebench_table.csv'; a.click();
  });
  document.getElementById('downloadHtmlBtn').addEventListener('click',()=>{
    const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([document.documentElement.outerHTML],{type:'text/html;charset=utf-8'})); a.download='livebench_leaderboard.html'; a.click();
  });
  const tooltip=document.createElement('div');
  tooltip.id='lbThTooltip';
  document.body.appendChild(tooltip);
  let tooltipTimer=null;
  const hideTip=()=>{ tooltip.classList.remove('show'); };
  const cancelTip=()=>{ if(tooltipTimer){ clearTimeout(tooltipTimer); tooltipTimer=null; } };
  const showTip=th=>{
    tooltip.textContent=th.dataset.tip;
    const rect=th.getBoundingClientRect();
    tooltip.style.left='0px';
    tooltip.style.top='0px';
    tooltip.classList.add('show');
    const width=tooltip.offsetWidth;
    const height=tooltip.offsetHeight;
    tooltip.classList.remove('show');
    let left=rect.left+rect.width/2-width/2;
    const maxLeft=window.innerWidth-width-8;
    if(left<8) left=8;
    if(left>maxLeft) left=maxLeft;
    let top=rect.bottom+12;
    if(top+height>window.innerHeight-8) top=rect.top-height-12;
    if(top<8) top=8;
    tooltip.style.left=left+'px';
    tooltip.style.top=top+'px';
    requestAnimationFrame(()=>tooltip.classList.add('show'));
  };
  ths.forEach(th=>{
    if(!th.dataset.tip) return;
    th.addEventListener('mouseenter',()=>{
      cancelTip();
      tooltipTimer=setTimeout(()=>{ tooltipTimer=null; showTip(th); },1000);
    });
    th.addEventListener('mouseleave',()=>{ cancelTip(); hideTip(); });
    th.addEventListener('mousedown',()=>{ cancelTip(); hideTip(); });
  });
  window.addEventListener('scroll',()=>{ cancelTip(); hideTip(); },true);
})();
</script>
</body></html>`;
  }

  function autoDownload(name, mime, content) {
    const url = `data:${mime};charset=utf-8,` + encodeURIComponent(content);
    if (typeof GM_download === 'function') {
      try { GM_download({ url, name, saveAs:false }); return; } catch (e) {}
    }
    try { const a=document.createElement('a'); a.href=url; a.download=name; document.documentElement.appendChild(a); a.click(); a.remove(); } catch(e){}
  }

  function onCategory(url, text) {
    if (categoriesSeen.has(url)) return;
    categoriesSeen.add(url);
    try {
      const obj = JSON.parse(text);
      setCategoryGroups(obj, url);
    } catch (e) {
      console.error('[LB] 解析分类 JSON 失败：', e);
    }
  }

  async function processCsv(url, text, groups) {
    try {
      const parsed = parseCSV(text);
      if (!parsed.length) return;
      const useGroups = groups && typeof groups === 'object' ? groups : CATEGORY_GROUPS_DEFAULT;
      const html = buildHTML({ csvText: text, url, parsed, groups: useGroups });
      const base = (url.match(/table_[^/?#]+/i)||['table'])[0].replace(/\.csv.*/i,'');
      if (AUTO_OPEN_TAB) {
        const href = URL.createObjectURL(new Blob([html], {type:'text/html'}));
        if (typeof GM_openInTab === 'function') GM_openInTab(href, {active:true, insert:true});
        else window.open(href, '_blank');
      }
      if (AUTO_DOWNLOAD_HTML) autoDownload(`${base}_leaderboard.html`, 'text/html', html);
      if (AUTO_DOWNLOAD_CSV)  autoDownload(`${base}.csv`,              'text/csv',  text);
    } catch(e){ console.error('[LB] 处理 CSV 失败：', e); }
  }

  async function onCSV(url, text) {
    if (seen.has(url)) return;
    seen.add(url);
    tip('捕获到 CSV：' + url.split('/').pop());
    if (!categoryGroups) {
      pendingCsv.push({ url, text });
      tip('等待 categories_*.json 后再生成排行榜');
      scheduleCategoryFallback();
      return;
    }
    await processCsv(url, text, categoryGroups);
  }

  // ——劫持 fetch（page 世界）——
  (function hijackFetch(){
    const raw = window.fetch;
    if (!raw) return;
    window.fetch = async function(...args){
      const req = args[0];
      const url = typeof req === 'string' ? req : (req && req.url) ? req.url : '';
      const resp = await raw.apply(this, args);
      try {
        if (CSV_RX.test(url)) {
          const clone = resp.clone();
          clone.text().then(t => onCSV(url, t)).catch(()=>{});
        }
        if (CATEGORY_RX.test(url)) {
          const clone = resp.clone();
          clone.text().then(t => onCategory(url, t)).catch(()=>{});
        }
      } catch(e){}
      return resp;
    };
  })();

  // ——劫持 XHR（page 世界）——
  (function hijackXHR(){
    const open = XMLHttpRequest.prototype.open;
    const send = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url){
      this.__lb_url = url;
      return open.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function(){
      const url = String(this.__lb_url||'');
      if (CSV_RX.test(url)) {
        this.addEventListener('load', () => {
          try { if (this.status>=200 && this.status<300) onCSV(url, this.responseText); } catch(e){}
        });
      }
      if (CATEGORY_RX.test(url)) {
        this.addEventListener('load', () => {
          try { if (this.status>=200 && this.status<300) onCategory(url, this.responseText); } catch(e){}
        });
      }
      return send.apply(this, arguments);
    };
  })();

  // ——兜底1：PerformanceObserver 监听网络资源；发现后二次拉取（解决 SW/预加载/早期请求）——
  function refetch(url){
    if (!url) return;
    const isCsv = CSV_RX.test(url);
    const isCat = CATEGORY_RX.test(url);
    if (!isCsv && !isCat) return;
    const seenSet = isCat ? categoriesSeen : seen;
    const inflight = isCat ? categoriesRefetching : refetching;
    if (seenSet.has(url) || inflight.has(url)) return; // 若已处理或正在拉取，则不重复
    inflight.add(url);
    // 优先同源 fetch；若跨域或受 CORS 限制，再用 GM_xmlhttpRequest
    fetch(url)
      .then(r=>r.text())
      .then(t=>{
        if (isCat) onCategory(url,t);
        else onCSV(url,t);
      })
      .catch(()=>{
        if (typeof GM_xmlhttpRequest === 'function') {
          GM_xmlhttpRequest({
            method:'GET',
            url,
            onload: r => { if (isCat) onCategory(url, r.responseText); else onCSV(url, r.responseText); },
            onerror: ()=>{}
          });
        }
      })
      .finally(()=>{ inflight.delete(url); });
  }
  try {
    if ('PerformanceObserver' in window) {
      const po = new PerformanceObserver(list => {
        for (const e of list.getEntries()) {
          const name=e && e.name;
          if (name && (CSV_RX.test(name) || CATEGORY_RX.test(name))) refetch(name);
        }
      });
      po.observe({ entryTypes: ['resource'] });
      // 再扫一遍已加载资源，防止我们注入稍晚一步
      (performance.getEntriesByType('resource')||[]).forEach(e => {
        const name=e && e.name;
        if (name && (CSV_RX.test(name) || CATEGORY_RX.test(name))) refetch(name);
      });
    }
  } catch(e){}

  // ——菜单：手动提示/自检——
  if (typeof GM_registerMenuCommand === 'function') {
    GM_registerMenuCommand('显示状态', () => {
      const world = Function.prototype.toString.call(window.fetch).includes('[native code]') ? '可能已被替换' : '已替换';
      alert('LiveBench 拦截器运行中：\n- 注入世界：page\n- fetch 状态：' + world + '\n- 已捕获条目：' + seen.size);
    });
  }

})();
