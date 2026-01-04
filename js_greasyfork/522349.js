// ==UserScript==
// @name         导出专利信息（XLSX）
// @namespace    https://greasyfork.org/users/13777-hui-zhou
// @version      0.6.3
// @description  将 CNIPA 列表页的专利信息一键导出为 .xlsx；日期保持 yyyy-mm-dd，编号全部文本保真；按钮可拖动并记住位置（拖动释放不再触发导出）
// @author       hdyrhk (原作者), Hui Zhou (修改)
// @license      MIT
// @match        https://cpquery.cponline.cnipa.gov.cn/chinesepatent/index
// @run-at       document-idle
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
//
// === Credits ===
// Original script: "Export Patent Info" by hdyrhk
// Source: https://greasyfork.org/scripts/489322-export-patent-info
// Modified by Hui Zhou in 2025
// =================
// @downloadURL https://update.greasyfork.org/scripts/522349/%E5%AF%BC%E5%87%BA%E4%B8%93%E5%88%A9%E4%BF%A1%E6%81%AF%EF%BC%88XLSX%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/522349/%E5%AF%BC%E5%87%BA%E4%B8%93%E5%88%A9%E4%BF%A1%E6%81%AF%EF%BC%88XLSX%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // —— UI：导出按钮（防重复） ——
  if (document.getElementById('export-patents-xlsx-btn')) return;
  const exportButton = document.createElement('button');
  exportButton.id = 'export-patents-xlsx-btn';
  exportButton.textContent = '导出专利信息（XLSX）';
  Object.assign(exportButton.style, {
    position: 'fixed',
    top: '120px',
    right: '20px',
    zIndex: '9999',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#4c56af',
    color: '#fff',
    border: '1px solid #ddd',
    borderRadius: '5px',
    boxShadow: '2px 2px 5px rgba(0,0,0,0.2)',
    cursor: 'pointer',
    userSelect: 'none'
  });
  document.body.appendChild(exportButton);

  // —— 按钮拖动 + 记住位置 + 抑制拖动后的点击 ——
  (function enableDragWithMemory(el) {
    const LS_KEY = 'exportPatentsBtnPos_v1';
    const MOVE_THRESHOLD = 6; // 像素阈值：超过则视为拖动

    // 加载上次位置
    try {
      const pos = JSON.parse(localStorage.getItem(LS_KEY));
      if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
        el.style.left = pos.x + 'px';
        el.style.top = pos.y + 'px';
        el.style.right = 'auto';
      }
    } catch {}

    let isDragging = false;
    let dragMoved = false;        // 本次是否发生了有效移动
    let suppressNextClick = false; // 抑制紧随其后的 click
    let startX = 0, startY = 0;   // 鼠标按下位置
    let offsetX = 0, offsetY = 0; // 鼠标相对按钮左上角的偏移

    el.addEventListener('mousedown', function (e) {
      if (e.button !== 0) return;
      isDragging = true;
      dragMoved = false;
      startX = e.clientX;
      startY = e.clientY;

      const rect = el.getBoundingClientRect();
      offsetX = e.clientX - rect.left;
      offsetY = e.clientY - rect.top;
      el.style.transition = 'none';

      // 若还在用 right 定位，切换为 left，便于拖动
      if (getComputedStyle(el).right !== 'auto') {
        el.style.left = (rect.left) + 'px';
        el.style.right = 'auto';
      }
      e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;

      // 是否超过阈值
      if (!dragMoved) {
        const dx = Math.abs(e.clientX - startX);
        const dy = Math.abs(e.clientY - startY);
        if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
          dragMoved = true;
        }
      }

      const newLeft = e.clientX - offsetX;
      const newTop = e.clientY - offsetY;
      const maxLeft = window.innerWidth - el.offsetWidth - 5;
      const maxTop = window.innerHeight - el.offsetHeight - 5;
      el.style.left = Math.max(5, Math.min(newLeft, maxLeft)) + 'px';
      el.style.top = Math.max(5, Math.min(newTop, maxTop)) + 'px';
      el.style.right = 'auto';
    });

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      el.style.transition = '';

      // 如果发生了有效移动，则抑制下一次 click
      if (dragMoved) {
        suppressNextClick = true;
      }

      // 保存位置
      const rect = el.getBoundingClientRect();
      try {
        localStorage.setItem(LS_KEY, JSON.stringify({ x: rect.left, y: rect.top }));
      } catch {}
    };

    document.addEventListener('mouseup', endDrag);
    window.addEventListener('blur', endDrag);

    // 捕获阶段优先处理 click，必要时拦截一次
    el.addEventListener('click', function (e) {
      if (suppressNextClick) {
        suppressNextClick = false; // 只拦一次
        e.stopPropagation();
        e.preventDefault();
      }
    }, true); // useCapture = true
  })(exportButton);

  // —— 工具函数 ——
  const normalizeColon = (s) => (s || '').replace('：', ':');
  const splitLabelValue = (text) => {
    const t = normalizeColon(text || '').trim();
    const pos = t.indexOf(':');
    if (pos === -1) return [t, ''];
    return [t.slice(0, pos).trim(), t.slice(pos + 1).trim()];
  };
  const clean = (s) => (s ?? '').toString().trim();

  // 统一把日期保持为 yyyy-mm-dd 的“字符串”（防 Excel 改格式）
  const toYMDText = (s) => {
    const v = clean(s).replace(/\//g, '-');
    const m = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(v);
    if (m) {
      const mm = m[2].padStart(2, '0');
      const dd = m[3].padStart(2, '0');
      return `${m[1]}-${mm}-${dd}`;
    }
    return v;
  };

  // —— 解析单个 .table_info ——
  function parseTableInfo(block) {
    const data = {
      '申请号/专利号': '',
      '发明名称': '',
      '申请人': '',
      '专利类型': '',
      '申请日': '',
      '发明专利申请公布号': '',
      '授权公告号': '',
      '授权公告日': '',
      '主分类号': '',
      '案件状态': ''
    };

    const spans = Array.from(block.querySelectorAll('span'));

    for (let i = 0; i < spans.length; i++) {
      const s = spans[i];
      if (s.classList.contains('line')) continue;

      const text = s.textContent.trim();
      const textNorm = normalizeColon(text);

      if (/^申请号\/专利号:$/i.test(textNorm)) {
        const next = spans[i + 1];
        if (next && next.classList.contains('hover_active')) {
          data['申请号/专利号'] = clean(next.textContent);
          i++;
          continue;
        }
      }

      if (textNorm.startsWith('发明名称:')) {
        const inner = s.querySelector('span');
        data['发明名称'] = clean(inner ? inner.textContent : text.replace(/^发明名称[:：]\s*/, ''));
        continue;
      }

      const [label, value] = splitLabelValue(text);
      switch (label) {
        case '申请人':
          data['申请人'] = clean(value);
          break;
        case '专利类型':
          data['专利类型'] = clean(value);
          break;
        case '申请日':
          data['申请日'] = toYMDText(value);
          break;
        case '发明专利申请公布号':
          data['发明专利申请公布号'] = clean(value);
          break;
        case '授权公告号':
          data['授权公告号'] = clean(value);
          break;
        case '授权公告日':
          data['授权公告日'] = toYMDText(value);
          break;
        case '主分类号':
          data['主分类号'] = clean(value);
          break;
        case '案件状态':
          data['案件状态'] = clean(value);
          break;
        default:
          break;
      }
    }

    if (!data['发明名称']) {
      const title = block.closest('.tabele_list')
        ?.querySelector('.table_top1 .title.hover_active')
        ?.textContent?.trim();
      if (title) data['发明名称'] = title;
    }

    return data;
  }

  // —— XLSX 导出 ——
  function forceColumnsToText(ws, headerOrder, textHeaders) {
    const range = XLSX.utils.decode_range(ws['!ref']);
    const headerIndexMap = new Map(headerOrder.map((h, idx) => [h, idx]));
    const textColIdxSet = new Set(textHeaders.map(h => headerIndexMap.get(h)).filter(i => i !== undefined));
    for (let R = 1; R <= range.e.r; R++) {
      for (const C of textColIdxSet) {
        const addr = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = ws[addr];
        if (cell) cell.t = 's';
      }
    }
  }

  function exportToXLSX(rows, headerOrder) {
    const ordered = rows.map(row => {
      const obj = {};
      headerOrder.forEach(k => { obj[k] = row[k] ?? ''; });
      return obj;
    });

    const ws = XLSX.utils.json_to_sheet(ordered, { header: headerOrder });

    forceColumnsToText(ws, headerOrder, [
      '申请号/专利号',
      '发明专利申请公布号',
      '授权公告号',
      '申请日',
      '授权公告日'
    ]);

    ws['!cols'] = headerOrder.map(h => {
      const widthMap = {
        '申请号/专利号': 20,
        '发明名称': 30,
        '申请人': 24,
        '专利类型': 12,
        '申请日': 12,
        '发明专利申请公布号': 18,
        '授权公告号': 16,
        '授权公告日': 12,
        '主分类号': 12,
        '案件状态': 16
      };
      return { wch: widthMap[h] || 16 };
    });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '申请信息');
    XLSX.writeFile(wb, '申请信息.xlsx');
  }

  // —— 点击导出 ——
  exportButton.addEventListener('click', function () {
    const blocks = document.querySelectorAll('.table_info');
    if (!blocks.length) {
      console.error('没有找到 .table_info 元素，无法导出。');
      return;
    }

    const rows = [];
    blocks.forEach((block, idx) => {
      try {
        rows.push(parseTableInfo(block));
      } catch (e) {
        console.warn(`第 ${idx + 1} 条解析失败：`, e);
      }
    });

    if (!rows.length) {
      console.error('没有可导出的专利信息！');
      return;
    }

    const headerOrder = [
      '申请号/专利号',
      '发明名称',
      '申请人',
      '专利类型',
      '申请日',
      '发明专利申请公布号',
      '授权公告号',
      '授权公告日',
      '主分类号',
      '案件状态'
    ];

    exportToXLSX(rows, headerOrder);
  });
})();
