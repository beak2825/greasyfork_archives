// ==UserScript==
// @name         Jellyfin 日志美化（统一深色背景 + 引号高亮）
// @namespace    https://github.com/banned2054/jellyfin-log-beautifier
// @version      1.1.0
// @description  表格视图 + 粘性表头 + 模块/等级筛选；固定深色背景 #101010；对 message 中 "被双引号包裹的内容" 高亮显示
// @match        http://127.0.0.1:8096/System/Logs/Log?name=log_*
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzrq2XhIw7in73q4tTa6PTaQRO6KxAJ_XLZwgrZ7i8pkYdoJBk2NMUMBuqal72A0YyAbo&usqp=CAU
// @author       banned
// @homepageURL  https://github.com/banned2054/jellyfin-log-beautifier
// @supportURL   https://github.com/banned2054/jellyfin-log-beautifier/issues
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543008/Jellyfin%20%E6%97%A5%E5%BF%97%E7%BE%8E%E5%8C%96%EF%BC%88%E7%BB%9F%E4%B8%80%E6%B7%B1%E8%89%B2%E8%83%8C%E6%99%AF%20%2B%20%E5%BC%95%E5%8F%B7%E9%AB%98%E4%BA%AE%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/543008/Jellyfin%20%E6%97%A5%E5%BF%97%E7%BE%8E%E5%8C%96%EF%BC%88%E7%BB%9F%E4%B8%80%E6%B7%B1%E8%89%B2%E8%83%8C%E6%99%AF%20%2B%20%E5%BC%95%E5%8F%B7%E9%AB%98%E4%BA%AE%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 防重复执行 ---
    if (document.body.dataset.jlbApplied === '1') return;
    document.body.dataset.jlbApplied = '1';

    // ---------- 样式：变量/滚动条/焦点/表格 ----------
    const style = document.createElement('style');
    style.textContent = `
  :root {
    --bg: #101010;
    --bg-elev: #1a1a1a;
    --bg-elev-2: #171717;
    --border: #333;
    --text: #D4D4D4;
    --text-weak: #ccc;
    --text-mute: #aaa;
    --accent: #D69D85; /* 用于交互焦点与引号高亮 */
    --radius: 6px;
  }

  html, body {
    background: var(--bg) !important;
    color: var(--text);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
  }

  /* 统一滚动条（Firefox + WebKit） */
  * { scrollbar-width: thin; scrollbar-color: #888 #3b3b3b; }
  ::-webkit-scrollbar { width: .6em; height: .6em; }
  ::-webkit-scrollbar-track { background: #3b3b3b; }
  ::-webkit-scrollbar-thumb { background: #888; border-radius: 4px; }

  /* 焦点可见（仅键盘） */
  :where(button, [role="button"], a, input, select, textarea, .jlb-card):focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
    border-radius: 4px;
  }

  /* 控制区 */
  .jlb-controls {
    display: flex;
    gap: 16px;
    margin: 12px 0;
    flex-wrap: wrap;
  }
  .jlb-dropdown { position: relative; display: inline-block; }
  .jlb-btn {
    padding: 6px 12px;
    cursor: pointer;
    background: #2b2b2b;
    color: var(--text-weak);
    border: 1px solid var(--border);
    border-radius: var(--radius);
  }
  .jlb-btn:hover { background: #333; color: var(--text); }
  .jlb-menu {
    display: none;
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    min-width: 220px;
    max-height: 260px;
    overflow: auto;
    background: var(--bg-elev);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    box-shadow: 0 6px 18px rgba(0,0,0,.4);
    padding: 8px;
    z-index: 9999;
  }
  .jlb-menu.open { display: block; }
  .jlb-menu label {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 6px;
    border-radius: 4px;
    cursor: pointer;
    color: var(--text-weak);
  }
  .jlb-menu label:hover { background: #232323; color: var(--text); }

  /* 表格 */
  .jlb-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
    background: var(--bg);
    font-size: 14px;
    border: 1px solid var(--border);
    border-radius: 8px;
    overflow: hidden;
  }
  .jlb-table thead th {
    position: sticky;
    top: 0;
    background: var(--bg-elev);
    color: #fff;
    z-index: 5;
    padding: 8px 6px;
    border-bottom: 1px solid var(--border);
  }
  .jlb-table th, .jlb-table td { border-right: 1px solid var(--border); }
  .jlb-table th:last-child, .jlb-table td:last-child { border-right: none; }
  .jlb-tr { background: var(--bg); border-bottom: 1px solid #222; }
  .jlb-tr:nth-child(even) { background: var(--bg-elev-2); } /* 轻微斑马纹 */
  .jlb-tr:hover { background: #1e1e1e; }

  .jlb-td-time { text-align: center; padding: 6px 4px; }
  .jlb-td-level { text-align: center; padding: 6px 4px; font-weight: 700; color: var(--text-weak); }
  .jlb-td-module { padding: 6px; word-break: break-word; color: var(--text); }
  .jlb-td-msg { padding: 6px; white-space: pre-wrap; color: #ccc; overflow-wrap: anywhere; }

  /* 列宽（可按需调整） */
  .jlb-col-time { width: 140px; }
  .jlb-col-level { width: 90px; }
  .jlb-col-module { width: 26%; }

  /* 容器卡片（可选） */
  .jlb-card {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 10px;
  }

  /* message 内对 "被双引号包裹的内容" 高亮 */
  .jlb-td-msg .quoted {
    color: var(--accent);
    font-weight: 500;
  }  
  
  /* message 内数字/IP 高亮 */
  .jlb-td-msg .num {
    color: #B5CEA8;
    font-weight: 500;
  }  
  
  .jlb-td-msg .hash {
    color: #4EC9B0;
    font-weight: 500;
  }

  `;
    document.head.appendChild(style);

    // ---------- 全局背景 ----------
    document.documentElement.style.background = '#101010';
    document.body.style.background = '#101010';
    document.body.style.color = 'var(--text)';

    // ---------- 取日志容器 ----------
    const logSelector = 'pre, code, .log, .terminal, body';
    const container = document.querySelector(logSelector);
    if (!container) return;

    const logText = container.innerText || '';
    const lines = logText.trim().split('\n');

    // ---------- 结构：controls + table ----------
    const controls = document.createElement('div');   // ← 只声明一次
    controls.className = 'jlb-controls';

    const table = document.createElement('table');
    table.className = 'jlb-table';

    const thead = document.createElement('thead');
    thead.innerHTML = `
    <tr>
      <th class="jlb-col-time">时间</th>
      <th class="jlb-col-level">等级</th>
      <th class="jlb-col-module">模块</th>
      <th>讯息</th>
    </tr>`;
    const tbody = document.createElement('tbody');

    table.appendChild(thead);
    table.appendChild(tbody);

    // ---------- 等级映射 ----------
    const levelMap = {
        '[INF]': {text: '信息', color: '#569CD6'},
        '[WRN]': {text: '警告', color: '#DCDCAA'},
        '[ERR]': {text: '错误', color: '#F44747'},
        '[DBG]': {text: '调试', color: '#B5CEA8'},
        '[TRC]': {text: '追踪', color: '#9CDCFE'},
        '[FTL]': {text: '严重', color: '#F44747'},
        'UNKNOWN': {text: '无', color: '#808080'}
    };

    const rows = [];
    const levelSet = new Set();
    const moduleMap = new Map();

    // ---------- 安全转义 ----------
    const escapeHTML = (s) => s.replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // ---------- 解析日志 ----------
    // 形如: [YYYY-mm-dd HH:MM:SS.xxx] [LVL] [pid] Module: message
    const dfAll = document.createDocumentFragment();
    for (const line of lines) {
        const match = line.match(/^\[(.*?)] \[(\w+)] \[\d+] (.*)$/);
        if (!match) continue;

        const [_, datetime, levelTag, fullMsg] = match;
        const dateStr = datetime.slice(0, 10);
        const timeStr = datetime.slice(11, 19);

        const levelKey = `[${levelTag}]`;
        const {text: levelText, color: levelColor} = levelMap[levelKey] || levelMap['UNKNOWN'];
        levelSet.add(levelText);

        let module = fullMsg;
        let message = '';
        const colonIndex = fullMsg.indexOf(':');
        if (colonIndex !== -1) {
            module = fullMsg.slice(0, colonIndex).trim();
            message = fullMsg.slice(colonIndex + 1).trim();
        }
        moduleMap.set(module, (moduleMap.get(module) || 0) + 1);

        // 构造表格行
        const tr = document.createElement('tr');
        tr.className = 'jlb-tr';
        tr.dataset.level = levelText;
        tr.dataset.module = module;

        const tdTime = document.createElement('td');
        tdTime.className = 'jlb-td-time';
        tdTime.innerHTML = `<div>${escapeHTML(dateStr)}</div><div>${escapeHTML(timeStr)}</div>`;

        const tdLevel = document.createElement('td');
        tdLevel.className = 'jlb-td-level';
        tdLevel.style.color = levelColor;
        tdLevel.textContent = levelText;

        const tdModule = document.createElement('td');
        tdModule.className = 'jlb-td-module';
        tdModule.textContent = module;

        // message：先转义，再把 "xxx" 包裹的内容变色（仅英文双引号）
        const tdMsg = document.createElement('td');
        tdMsg.className = 'jlb-td-msg';
        const escaped = escapeHTML(message);
        tdMsg.innerHTML = escaped.replace(
            /(?<!#)"([^"\n]+)"|(^|\s)(\d+(?:\.\d+)*)(?=\s|$)|(?<=\s)(#\S+)(?=\s)|(?<=\()(#[^)]*)(?=\))|(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}:\d{2}\s*[AP]M)|((\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:\s*(?:Z|[+-]\d{2}:\d{2}))?)|(\b(\d{1,2}):(\d{2}):(\d{2})\.\d+\b)/gi,
            (m, quoted, prefix, number, hashSpace, hashParen, usdt, isoFull, Y, M, D, h, m2, s2, timeFull, th, tm, ts) => {
                const to2 = (n) => n.toString().padStart(2, "0");
                const wrap = (v) => `<span class="num">${v}</span>`;

                if (quoted) {
                    return `<span class="quoted">"${quoted}"</span>`;
                }
                if (number) {
                    return `${prefix}<span class="num">${number}</span>`;
                }
                if (hashSpace || hashParen) {
                    const t = hashSpace || hashParen;
                    return `<span class="hash">${t}</span>`;
                }
                if (usdt) {
                    const [, MM, DD, YYYY, hh, mm, ss, ampm] =
                        usdt.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2}):(\d{2})\s*([AP]M)/i);
                    let H = parseInt(hh, 10);
                    const A = ampm.toUpperCase();
                    if (A === "PM" && H !== 12) H += 12;
                    if (A === "AM" && H === 12) H = 0;
                    const formatted = `${wrap(YYYY)}-${wrap(to2(MM))}-${wrap(to2(DD))} ${wrap(to2(H))}:${wrap(mm)}:${wrap(ss)}`;
                    return `<span class="datetime">${formatted}</span>`;
                }
                if (isoFull) {
                    // YYYY-MM-DD HH:mm:ss(.ffff…)? [Z|±HH:MM] -> 忽略时区/小数，只保留到秒
                    const formatted = `${wrap(Y)}-${wrap(M)}-${wrap(D)} ${wrap(h)}:${wrap(m2)}:${wrap(s2)}`;
                    return `<span class="datetime">${formatted}</span>`;
                }
                if (timeFull) {
                    // HH:mm:ss.fffffff -> HH:mm:ss
                    const formatted = `${wrap(to2(th))}:${wrap(tm)}:${wrap(ts)}`;
                    return `<span class="datetime">${formatted}</span>`;
                }
                return m;
            }
        );


        tr.appendChild(tdTime);
        tr.appendChild(tdLevel);
        tr.appendChild(tdModule);
        tr.appendChild(tdMsg);

        rows.push(tr);
        dfAll.appendChild(tr);
    }

    // ---------- 筛选面板 ----------
    function createFilterPanel(title, values, dataKey) {
        const box = document.createElement('div');
        box.className = 'jlb-dropdown';

        const btn = document.createElement('button');
        btn.className = 'jlb-btn';
        btn.type = 'button';
        btn.textContent = `筛选 ${title}`;

        const menu = document.createElement('div');
        menu.className = 'jlb-menu';

        const checkboxes = [];
        let sortedList;

        if (dataKey === 'module') {
            sortedList = [...values.entries()]
                .sort((a, b) => a[0].localeCompare(b[0], 'en'))
                .map(([label, count]) => ({label, count}));
        } else {
            sortedList = [...values].sort().map(label => ({label}));
        }

        for (const {label, count} of sortedList) {
            const lab = document.createElement('label');
            const cb = document.createElement('input');
            cb.type = 'checkbox';
            cb.checked = true;
            cb.value = label;
            checkboxes.push(cb);

            lab.appendChild(cb);
            lab.append(' ', document.createTextNode(count ? `${label} (${count})` : label));
            menu.appendChild(lab);
        }

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('open');
        });

        document.addEventListener('click', (e) => {
            if (!box.contains(e.target)) menu.classList.remove('open');
        });

        box.appendChild(btn);
        box.appendChild(menu);
        return {wrapper: box, checkboxes, dataKey};
    }

    const levelPanel = createFilterPanel('等级', levelSet, 'level');
    const modulePanel = createFilterPanel('模块', moduleMap, 'module');

    function filterRows() {
        const selectedLevels = new Set(levelPanel.checkboxes.filter(c => c.checked).map(c => c.value));
        const selectedModules = new Set(modulePanel.checkboxes.filter(c => c.checked).map(c => c.value));

        tbody.innerHTML = '';
        const df = document.createDocumentFragment();
        for (const row of rows) {
            if (selectedLevels.has(row.dataset.level) && selectedModules.has(row.dataset.module)) {
                df.appendChild(row);
            }
        }
        tbody.appendChild(df);
    }

    levelPanel.checkboxes.forEach(cb => cb.addEventListener('change', filterRows));
    modulePanel.checkboxes.forEach(cb => cb.addEventListener('change', filterRows));

    // ---------- 挂载 ----------
    tbody.appendChild(dfAll);

    const host = document.createElement('div');
    host.className = 'jlb-card';

    // 这里不再重复声明 controls，直接复用上面那一个
    controls.appendChild(levelPanel.wrapper);
    controls.appendChild(modulePanel.wrapper);

    host.appendChild(controls);
    host.appendChild(table);

    container.innerHTML = '';
    container.appendChild(host);

    filterRows();
})();
