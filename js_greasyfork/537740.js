// ==UserScript==
// @name         GreasyFork 脚本过滤器
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  标题模糊过滤 + 作者名称精确屏蔽，支持导入导出
// @match        https://greasyfork.org/zh-CN/scripts*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537740/GreasyFork%20%E8%84%9A%E6%9C%AC%E8%BF%87%E6%BB%A4%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537740/GreasyFork%20%E8%84%9A%E6%9C%AC%E8%BF%87%E6%BB%A4%E5%99%A8.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) return callback(el);
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        callback(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  waitForElement('.script-list', init);

  function init() {
    let rules = JSON.parse(localStorage.getItem('gf_filter_keywords') || '[]');

    rules = rules.map(r => ({
      type: r.type || 'title',
      text: r.text,
      caseSensitive: !!r.caseSensitive
    }));

    /* ========= UI ========= */

    const sidebar = document.createElement('div');
    sidebar.id = 'gf-filter-sidebar';
    sidebar.innerHTML = `
      <h2>脚本过滤器</h2>
      <div id="input-box">
        <select id="rule-type">
          <option value="title">标题（模糊）</option>
          <option value="author">作者（精确）</option>
        </select>
        <input id="rule-text" placeholder="关键字 / 作者全名">
        <label><input type="checkbox" id="case-sensitive"> 区分大小写</label>
        <button id="add-rule">添加</button>
      </div>

      <ul id="rule-list"></ul>

      <div id="actions">
        <button id="select-all">全选</button>
        <button id="delete-selected">删除选中</button>
        <button id="export">导出</button>
        <button id="import">导入</button>
        <input type="file" id="import-file" accept=".txt" style="display:none">
      </div>
    `;
    document.body.appendChild(sidebar);

    const toggle = document.createElement('div');
    toggle.id = 'gf-filter-toggle';
    toggle.textContent = '☰';
    document.body.appendChild(toggle);

    const style = document.createElement('style');
    style.textContent = `
      #gf-filter-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  width: 250px;
  height: 100%;
  background: #fff;
  padding: 12px;
  box-shadow: 2px 0 8px rgba(0,0,0,.2);
  transform: translateX(-100%);
  transition: .3s;
  z-index: 9999;
  font-family: sans-serif;

  display: flex;
  flex-direction: column;
}
      #gf-filter-sidebar.open { transform: translateX(0); }
      #gf-filter-toggle {
        position: fixed;
        left: 0;
        top: 95%;
        width: 36px;
        height: 36px;
        background: #007acc;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        border-radius: 0 6px 6px 0;
        z-index: 10000;
      }
      #input-box {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 10px;
      }
     #rule-list {
  list-style: none;
  padding: 0;
  margin: 0;

  flex: 1;
  overflow-y: auto;
}
      #rule-list li {
        display: flex;
        gap: 6px;
        align-items: center;
        font-size: 13px;
        border-bottom: 1px dashed #ddd;
        padding: 4px 0;
      }
      .remove {
        margin-left: auto;
        cursor: pointer;
        color: #c00;
      }
     #actions {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;

  position: sticky;
  bottom: 0;
  background: #fff;
  padding-top: 8px;
  border-top: 1px solid #ddd;
}
    `;
    document.head.appendChild(style);

    /* ========= 核心逻辑 ========= */

    function getAuthors(li) {
      const raw = li.getAttribute('data-script-authors');
      if (!raw) return [];
      try {
        const obj = JSON.parse(raw.replace(/&quot;/g, '"'));
        return Object.values(obj);
      } catch {
        return [];
      }
    }

    function applyFilter() {
      document.querySelectorAll('.script-list li').forEach(li => {
        const title = li.querySelector('h2 a')?.textContent || '';
        const authors = getAuthors(li);

        const hide = rules.some(r => {
          if (r.type === 'title') {
            return r.caseSensitive
              ? title.includes(r.text)
              : title.toLowerCase().includes(r.text.toLowerCase());
          }
          return authors.some(a =>
            r.caseSensitive
              ? a === r.text
              : a.toLowerCase() === r.text.toLowerCase()
          );
        });

        li.style.display = hide ? 'none' : '';
      });
    }

    function save() {
      localStorage.setItem('gf_filter_keywords', JSON.stringify(rules));
    }

    function render() {
      const ul = sidebar.querySelector('#rule-list');
      ul.innerHTML = '';
      rules.forEach((r, i) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <input type="checkbox" data-i="${i}">
          <span>[${r.type === 'author' ? '作者精确' : '标题'}] ${r.text}</span>
          <span class="remove" data-i="${i}">✕</span>
        `;
        ul.appendChild(li);
      });

      ul.querySelectorAll('.remove').forEach(btn => {
        btn.onclick = () => {
          rules.splice(btn.dataset.i, 1);
          save();
          render();
          applyFilter();
        };
      });
    }

    /* ========= 事件 ========= */

    sidebar.querySelector('#add-rule').onclick = () => {
      const text = sidebar.querySelector('#rule-text').value.trim();
      if (!text) return;

      rules.push({
        type: sidebar.querySelector('#rule-type').value,
        text,
        caseSensitive: sidebar.querySelector('#case-sensitive').checked
      });

      save();
      render();
      applyFilter();
      sidebar.querySelector('#rule-text').value = '';
    };

    sidebar.querySelector('#select-all').onclick = () => {
      sidebar.querySelectorAll('#rule-list input[type="checkbox"]')
        .forEach(cb => cb.checked = true);
    };

    sidebar.querySelector('#delete-selected').onclick = () => {
      const idx = [...sidebar.querySelectorAll('#rule-list input:checked')]
        .map(cb => cb.dataset.i)
        .sort((a, b) => b - a);

      idx.forEach(i => rules.splice(i, 1));
      save();
      render();
      applyFilter();
    };

    sidebar.querySelector('#export').onclick = () => {
      if (!rules.length) return alert('没有可导出的规则');
      const text = rules.map(r => `${r.type}\t${r.text}\t${r.caseSensitive}`).join('\n');
      const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'gf_filter_rules.txt';
      a.click();
    };

    sidebar.querySelector('#import').onclick = () => {
      sidebar.querySelector('#import-file').click();
    };

    sidebar.querySelector('#import-file').onchange = e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = ev => {
        ev.target.result.split(/\r?\n/).forEach(line => {
          const [type, text, cs] = line.split('\t');
          if (!type || !text) return;
          if (!rules.some(r => r.type === type && r.text === text)) {
            rules.push({
              type,
              text,
              caseSensitive: cs === 'true'
            });
          }
        });
        save();
        render();
        applyFilter();
      };
      reader.readAsText(file);
    };

    toggle.onclick = e => {
      e.stopPropagation();
      sidebar.classList.toggle('open');
    };
    document.addEventListener('click', e => {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('open');
      }
    });

    render();
    applyFilter();
  }
})();
