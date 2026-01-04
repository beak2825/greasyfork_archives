// ==UserScript==
// @name         世新選課自動加選腳本 Ver6.9(未完成的半成品)
// @namespace    http://tampermonkey.net/
// @version      2025/06/24
// @description  支援選課流程全自動加選，課程代碼比對正確修正，翻頁續行、頁面跳轉續行、成功提示、自動清除與完整 UI
// @author       Skywalker
// @license      CC-BY-NC
// @match        https://ap7.shu.edu.tw/STU2/*
// @match        https://ap6.shu.edu.tw/STU2/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/540592/%E4%B8%96%E6%96%B0%E9%81%B8%E8%AA%B2%E8%87%AA%E5%8B%95%E5%8A%A0%E9%81%B8%E8%85%B3%E6%9C%AC%20Ver69%28%E6%9C%AA%E5%AE%8C%E6%88%90%E7%9A%84%E5%8D%8A%E6%88%90%E5%93%81%29.user.js
// @updateURL https://update.greasyfork.org/scripts/540592/%E4%B8%96%E6%96%B0%E9%81%B8%E8%AA%B2%E8%87%AA%E5%8B%95%E5%8A%A0%E9%81%B8%E8%85%B3%E6%9C%AC%20Ver69%28%E6%9C%AA%E5%AE%8C%E6%88%90%E7%9A%84%E5%8D%8A%E6%88%90%E5%93%81%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const CATS = ['professional', 'ga00a', 'g9000', 'other'];
  const CAT_URLS = {
    professional: 'SN_Step3.aspx',
    ga00a: 'SN_Step5.aspx?cr_grup=GA00A',
    g9000: 'SN_Step5.aspx?cr_grup=G9000',
    other: 'SN_Step8.aspx'
  };
  const LABELS = {
    professional: '📘 專業課程',
    ga00a: '📗 通識 - GA00A',
    g9000: '📙 通識 - G9000',
    other: '📕 其他選課'
  };
  const PREFIX = 'shu_group_';
  const LOG_KEY = 'shu_log_history';
  const SUCC_KEY = 'shu_success_box';
  const INTERVAL = 5000;
  let isPaused = true;
  let logArray = [];

  function normalize(code) {
    return code.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  }

  function getCurrentCat() {
    const url = location.href;
    if (url.includes('SN_Step3')) return 'professional';
    if (url.includes('cr_grup=GA00A')) return 'ga00a';
    if (url.includes('cr_grup=G9000')) return 'g9000';
    if (url.includes('SN_Step8')) return 'other';
    return null;
  }

  function getNextCategory() {
    for (const cat of CATS) {
      for (let i = 0; i < 10; i++) {
        const val = document.getElementById(`input_${cat}_${i}`)?.value.trim();
        if (val) return cat;
      }
    }
    return null;
  }

  function log(msg) {
    const ts = new Date().toLocaleTimeString();
    const line = `[${ts}] ${msg}`;
    logArray.push(line);
    const box = document.getElementById('log');
    if (box) {
      box.textContent += line + '\n';
      box.scrollTop = box.scrollHeight;
    }
    localStorage.setItem(LOG_KEY, JSON.stringify(logArray));
  }

  function play(success) {
    const url = success
      ? 'https://www.soundjay.com/buttons/sounds/button-3.mp3'
      : 'https://www.soundjay.com/buttons/sounds/beep-07.mp3';
    new Audio(url).play();
  }

  function detectSuccess() {
    const msg = document.getElementById('BAT_ValidationSummary');
    if (msg && msg.textContent.includes('成功加選')) {
      const matched = msg.textContent.match(/課程(.*?)，成功加選/);
      if (matched) {
        const code = matched[1];
        const succ = document.getElementById('succ');
        succ.value += code + '\n';
        localStorage.setItem(SUCC_KEY, succ.value);
        removeCode(code);
        log(`✅ 成功加選：${code}`);
        play(true);
        return true;
      }
    }
    return false;
  }

  function removeCode(code) {
    CATS.forEach(cat => {
      for (let i = 0; i < 10; i++) {
        const input = document.getElementById(`input_${cat}_${i}`);
        if (input && normalize(input.value) === normalize(code)) {
          input.value = '';
        }
      }
    });
  }

  function autoAdvance() {
    const current = getCurrentCat();
    const next = getNextCategory();
    if (current !== next && next && CAT_URLS[next]) {
      const a = [...document.querySelectorAll('a')].find(a => a.href.includes(CAT_URLS[next]));
      if (a) {
        log(`🔀 自動跳轉至 ${LABELS[next]}`);
        a.click();
        return true;
      }
    }
    return false;
  }

  function tryClickReadConfirm() {
    const btn = document.querySelector('input[type=submit][value*="閱讀完畢"]');
    if (btn) btn.click();
  }

  function tryClickSearch() {
    ['SRH_ExConflict', 'SRH_ExMtps', 'SRH_ExMrel'].forEach(id => {
      const el = document.getElementById(id);
      if (el && !el.checked) el.click();
    });
    const btn = document.getElementById('SRH_search_button');
    if (btn) btn.click();
  }

  function handleCourseTable() {
    const current = getCurrentCat();
    const list = [];
    for (let i = 0; i < 10; i++) {
      const val = document.getElementById(`input_${current}_${i}`)?.value.trim();
      if (val) list.push(val);
    }
    if (list.length === 0) return;

    const rows = [...document.querySelectorAll('tr.table-A02')];
    let hit = false;
    rows.forEach(row => {
      const codeSpan = row.querySelector('td:nth-child(3) span');
      const checkbox = row.querySelector('input[type=checkbox]');
      if (codeSpan && checkbox) {
        const code = codeSpan.innerText.trim();
        if (list.some(input => normalize(input) === normalize(code))) {
          checkbox.click();
          log(`📌 命中：${code}`);
          hit = true;
        }
      }
    });

    if (hit) {
      const btn = document.getElementById('Button1');
      if (btn) btn.click();
    } else {
      const next = [...document.querySelectorAll('a')].find(a => a.href.includes('__doPostBack') && a.innerText.includes('2'));
      if (next) next.click();
    }
  }

  function UI() {
    const box = document.createElement('div');
    box.id = 'shu_ui_box';
    box.innerHTML = `
      <div id="drag_handle" style="background:#005bac;color:#fff;padding:6px;cursor:move">📋 選課腳本 Ver6.9</div>
      <div style="padding:6px;font-size:13px;font-family:sans-serif">
        ${CATS.map(cat => `<details><summary>${LABELS[cat]}</summary>
        ${[...Array(10)].map((_, i) => `<div>${i + 1}. <input type="text" id="input_${cat}_${i}" style="width:85%"></div>`).join('')}</details>`).join('')}
        <button id="start">▶️ 啟動</button>
        <button id="pause">⏸️ 暫停</button>
        <button id="clear">🧹 清除紀錄</button>
        <div id="log" style="height:100px;overflow:auto;background:#000;color:#0f0;padding:4px;font-size:12px;white-space:pre-wrap"></div>
        <b>✅ 成功代碼</b>
        <textarea id="succ" style="width:100%;height:60px"></textarea>
      </div>`;
    box.style = 'position:fixed;top:10px;right:10px;width:420px;z-index:9999;background:#fff;border:1px solid #aaa;box-shadow:0 0 8px #888;max-height:95vh;overflow-y:auto;';
    document.body.appendChild(box);

    document.getElementById('start').onclick = () => { isPaused = false; log('🚀 腳本啟動'); };
    document.getElementById('pause').onclick = () => { isPaused = true; log('⛔ 已暫停'); };
    document.getElementById('clear').onclick = () => {
      CATS.forEach(cat => localStorage.removeItem(`${PREFIX}${cat}`));
      localStorage.removeItem(SUCC_KEY);
      localStorage.removeItem(LOG_KEY);
      window.location.reload();
    };

    const succ = document.getElementById('succ');
    succ.value = localStorage.getItem(SUCC_KEY) || '';
    succ.oninput = () => localStorage.setItem(SUCC_KEY, succ.value);
    CATS.forEach(cat => {
      const list = JSON.parse(localStorage.getItem(`${PREFIX}${cat}`) || '[]');
      list.forEach((item, i) => {
        const el = document.getElementById(`input_${cat}_${i}`);
        if (el) el.value = item.code;
      });
    });
    logArray = JSON.parse(localStorage.getItem(LOG_KEY) || '[]');
    document.getElementById('log').textContent = logArray.join('\n');
    makeDraggable(box, document.getElementById('drag_handle'));
  }

  function makeDraggable(el, handle) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = function (e) {
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = () => document.onmousemove = null;
      document.onmousemove = function (e2) {
        e2.preventDefault();
        pos1 = pos3 - e2.clientX;
        pos2 = pos4 - e2.clientY;
        pos3 = e2.clientX;
        pos4 = e2.clientY;
        el.style.top = (el.offsetTop - pos2) + "px";
        el.style.left = (el.offsetLeft - pos1) + "px";
      };
    };
  }

  window.addEventListener('load', () => {
    UI();
    setInterval(() => {
      if (isPaused) return;
      if (detectSuccess()) return;
      if (autoAdvance()) return;
      tryClickReadConfirm();
      tryClickSearch();
      handleCourseTable();
    }, INTERVAL);
    setInterval(() => document.body.click(), 480000); // 防掉線
  });
})();