// ==UserScript==
// @name         自动填答案脚本（v0.23：导出遺漏.txt）
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  上传 .xlsx 后手动选 Sheet，自动填答并翻页；答题结束后把缺答案的题目导出为「遺漏.txt」。
// @match        https://elearning.pic.net.tw/*
// @require      https://unpkg.com/xlsx@0.18.5/dist/xlsx.full.min.js
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/534476/%E8%87%AA%E5%8A%A8%E5%A1%AB%E7%AD%94%E6%A1%88%E8%84%9A%E6%9C%AC%EF%BC%88v023%EF%BC%9A%E5%AF%BC%E5%87%BA%E9%81%BA%E6%BC%8Ftxt%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534476/%E8%87%AA%E5%8A%A8%E5%A1%AB%E7%AD%94%E6%A1%88%E8%84%9A%E6%9C%AC%EF%BC%88v023%EF%BC%9A%E5%AF%BC%E5%87%BA%E9%81%BA%E6%BC%8Ftxt%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let workbook         = null;
  let sheetNames       = [];
  let sheetKey         = null;
  let qaMap            = {};
  const missingQuestions = new Set();
  let autoTimer        = null;

  // 归一化：替换不间断空格，合并多空白，去首尾
  function normalize(s) {
    return s.replace(/\u00A0/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
  }

  // 递归查找含题目的 document
  function findQuestionDoc(win) {
    try {
      const d = win.document;
      if (d.querySelector('div[id^="question-"]')) return d;
    } catch (_) {}
    if (win.frames) {
      for (let i = 0; i < win.frames.length; i++) {
        const sub = findQuestionDoc(win.frames[i]);
        if (sub) return sub;
      }
    }
    return null;
  }

  // 自动点击“下一頁”按钮
  function clickNextPage(doc) {
    const btn = Array.from(doc.querySelectorAll('button.mat-raised-button'))
      .find(b => b.textContent.trim() === '下一頁');
    if (btn) {
      btn.click();
      console.log('↳ 自动点击 “下一頁”');
    }
  }

  // 核心：填答案并采集缺失题
  function fillAnswers() {
    if (!Object.keys(qaMap).length) return;
    console.log('--- fillAnswers ---');

    const doc = findQuestionDoc(window) || document;

    // 构建页面题目映射 normalize→{rawQ,qdiv}
    const pageMap = {};
    doc.querySelectorAll('div[id^="question-"]').forEach(qdiv => {
      const strongs = Array.from(qdiv.querySelectorAll('strong'))
                            .map(el => el.textContent.trim());
      if (strongs.length < 2) return;
      pageMap[ normalize(strongs[1]) ] = { rawQ: strongs[1], qdiv };
    });

    // 对照并选中或记录缺失
    Object.entries(pageMap).forEach(([nQ, { rawQ, qdiv }]) => {
      const ansRaw = qaMap[nQ];
      if (!ansRaw) {
        console.warn('缺答案：', rawQ);
        missingQuestions.add(rawQ);
        return;
      }
      const nA = normalize(ansRaw);
      qdiv.querySelectorAll('mat-radio-button').forEach(rb => {
        const lbl = rb.querySelector('.mat-radio-label-content');
        if (!lbl || normalize(lbl.textContent) !== nA) return;
        const inp = rb.querySelector('input[type="radio"]');
        if (!inp) return;
        const nm = inp.name;
        // 清空同组
        qdiv.querySelectorAll(`input[name="${nm}"]`).forEach(si => {
          si.checked = false;
          si.dispatchEvent(new Event('change', { bubbles: true }));
          const pr = si.closest('mat-radio-button');
          if (pr) {
            pr.classList.remove('mat-radio-checked');
            pr.setAttribute('aria-checked', 'false');
          }
        });
        // 强制选中
        inp.checked = true;
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        rb.classList.add('mat-radio-checked');
        rb.setAttribute('aria-checked', 'true');
        console.log(`✔ 题 "${rawQ}" 选 "${ansRaw}"`);
      });
    });

    clickNextPage(doc);
  }

  // 启动自动填答+导出流程
  function startLoop() {
    if (autoTimer) clearInterval(autoTimer);
    let elapsed = 0;
    autoTimer = setInterval(() => {
      fillAnswers();
      elapsed += 2000;
      if (elapsed >= 20000) {
        clearInterval(autoTimer);
        console.log('【自动填答案】循环结束');
        exportMissingTxt();
      }
    }, 2000);
  }

  // 把 missingQuestions 导出成遺漏.txt
  function exportMissingTxt() {
    if (!missingQuestions.size) {
      console.log('没有缺失题目，无需导出。');
      return;
    }
    const text = Array.from(missingQuestions).join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = '遺漏.txt';
    document.body.appendChild(a);
    a.click();
    a.remove();
    console.log('已下载：遺漏.txt');
  }

  // 当用户选择好 Sheet 后加载 QA 映射并启动
  function onSheetSelect(e) {
    sheetKey = e.target.value;
    if (!sheetKey) return;
    const sheet = workbook.Sheets[sheetKey];
    const rows  = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    qaMap = {};
    rows.slice(1).forEach(r => {
      const a = String(r[0] || '').trim();
      const q = String(r[2] || '').trim();
      const nq = normalize(q);
      if (nq && a) qaMap[nq] = a;
    });
    console.log(`已加载工作表 "${sheetKey}"，共 ${Object.keys(qaMap).length} 条`);
    document.getElementById('sheetSelectContainer').style.display = 'none';
    fillAnswers();
    startLoop();
  }

  // 上传文件后弹出下拉式 Sheet 选择
  function handleFile(e) {
    const f = e.target.files[0];
    if (!f) return;
    const rdr = new FileReader();
    rdr.onload = ev => {
      workbook   = XLSX.read(new Uint8Array(ev.target.result), { type: 'array' });
      sheetNames = workbook.SheetNames.map(n => n.trim());
      let ctr = document.getElementById('sheetSelectContainer');
      if (!ctr) {
        ctr = document.createElement('div');
        ctr.id = 'sheetSelectContainer';
        Object.assign(ctr.style, {
          position:'fixed', top:'10px', right:'10px',
          background:'#fff', padding:'8px',
          border:'1px solid #666', zIndex:10000
        });
        const sel = document.createElement('select');
        sel.id = 'sheetSelect';
        sel.addEventListener('change', onSheetSelect);
        sel.innerHTML = `<option value="">--请选择工作表--</option>` +
          sheetNames.map(n => `<option value="${n}">${n}</option>`).join('');
        ctr.appendChild(sel);
        document.body.appendChild(ctr);
      }
    };
    rdr.readAsArrayBuffer(f);
  }

  // 插入文件选择按钮
  const fileInput = document.createElement('input');
  fileInput.type   = 'file';
  fileInput.accept = '.xlsx';
  Object.assign(fileInput.style, {
    position:'fixed', top:'10px', left:'10px',
    zIndex:10000, background:'#fff',
    padding:'4px', border:'1px solid #ccc',
    cursor:'pointer'
  });
  fileInput.addEventListener('change', handleFile);
  document.body.appendChild(fileInput);

  // 兼容 Angular 异步渲染
  new MutationObserver(fillAnswers)
    .observe(document.body, { childList: true, subtree: true });

})();
