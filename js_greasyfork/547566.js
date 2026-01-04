// ==UserScript==
// @name         贴吧屏蔽主题帖
// @namespace    https://example.com/tieba-thread-blacklist
// @version      1.7.3
// @description  在贴吧吧页隐藏黑名单用户发布的主题帖。
// @author       you
// @match        https://tieba.baidu.com/f?kw=*
// @match        https://tieba.baidu.com/f/*?kw=*
// @run-at       document-idle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/547566/%E8%B4%B4%E5%90%A7%E5%B1%8F%E8%94%BD%E4%B8%BB%E9%A2%98%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/547566/%E8%B4%B4%E5%90%A7%E5%B1%8F%E8%94%BD%E4%B8%BB%E9%A2%98%E5%B8%96.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const STORAGE_KEY = 'tieba_thread_blacklist_users';
  const PANEL_ID = 'tb-blk-panel';

  const normalize = (name) =>
    (name || '').replace(/\u200B/g, '').replace(/\s+/g, '').trim().toLowerCase();

  function getList() {
    const raw = GM_getValue(STORAGE_KEY, []);
    return Array.from(new Set(raw.map(normalize).filter(Boolean)));
  }
  function setList(arr) {
    GM_setValue(STORAGE_KEY, Array.from(new Set(arr.map(normalize).filter(Boolean))));
    refreshPanel();
    scheduleScan();
  }
  function addUsers(users) {
    const cur = new Set(getList());
    users.map(normalize).filter(Boolean).forEach((u) => cur.add(u));
    setList(Array.from(cur));
  }
  function removeUsers(users) {
    const cur = new Set(getList());
    users.map(normalize).filter(Boolean).forEach((u) => cur.delete(u));
    setList(Array.from(cur));
  }

  function ensurePanel() {
    if (document.getElementById(PANEL_ID)) return;
    GM_addStyle(`
      #${PANEL_ID}{
        position: fixed; z-index: 99999; right: 16px; bottom: 24px;
        background: rgba(0,0,0,.75); color: #fff;
        border-radius: 12px; padding: 8px 10px;
        font: 12px/1.4 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue","PingFang SC","Noto Sans CJK SC","Microsoft YaHei",sans-serif;
        max-height: 240px; width: 220px;
        overflow-y: auto; overflow-x: hidden;
        box-shadow: 0 4px 12px rgba(0,0,0,.3);
      }
      #${PANEL_ID}::-webkit-scrollbar { width: 6px; }
      #${PANEL_ID}::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.4); border-radius: 3px; }
      #${PANEL_ID}::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.7); }
      #${PANEL_ID}::-webkit-scrollbar-track { background: transparent; }

      #${PANEL_ID}.minimized {padding:6px 10px; cursor:pointer; height:auto; max-height:none; overflow:visible;}
      #${PANEL_ID}.minimized .content {display:none;}
      #${PANEL_ID} button{
        cursor:pointer; border:none; border-radius: 6px; padding: 3px 6px;
        background:#fff; color:#111; font-weight:600; font-size:12px;
      }
      #${PANEL_ID} button.ghost{ background:transparent; color:#fff; border:1px solid rgba(255,255,255,.4); }
      #${PANEL_ID} .topbar{display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;}
      #${PANEL_ID} .min-btn{ background:transparent; color:#fff; border:none; font-size:14px; cursor:pointer; }
      #${PANEL_ID} .list{ margin-top:6px; display:flex; flex-direction:column; gap:4px; }
      #${PANEL_ID} .row-item{
        display:flex; justify-content:flex-start; align-items:center;
        background:rgba(255,255,255,.1); padding:2px 6px; border-radius:6px;
      }
      #${PANEL_ID} .row-item span.username{
        display:inline-block; max-width:80%; white-space:nowrap;
        overflow:hidden; text-overflow:ellipsis;
      }
      #${PANEL_ID} .row-item .del{ cursor:pointer; color:#ff6666; font-weight:bold; margin-right:6px; flex-shrink:0; }
      .tb-blk-laji{ display:inline-block; margin-left:4px; cursor:pointer; color:#999; font-size:12px; }
      .tb-blk-laji:hover{ color:#f55; text-decoration:underline; }
    `);
    const div = document.createElement('div');
    div.id = PANEL_ID;
    div.classList.add("minimized"); // 默认最小化
    div.innerHTML = `
      <div class="topbar">
        <div><strong>黑名单</strong> <span class="muted">(${getList().length})</span></div>
        <button class="min-btn" title="最小化/展开">－</button>
      </div>
      <div class="content">
        <div class="row">
          <button id="tb-blk-add">添加</button>
          <button id="tb-blk-remove" class="ghost">删除</button>
          <button id="tb-blk-export" class="ghost">导出</button>
          <button id="tb-blk-import" class="ghost">导入</button>
        </div>
        <div class="list" id="tb-blk-list"></div>
      </div>
    `;
    document.body.appendChild(div);

    div.querySelector('.min-btn').addEventListener('click', () => {
      div.classList.toggle('minimized');
    });
    div.querySelector('#tb-blk-add').onclick = () => {
      const v = prompt('添加用户，多个用空格或逗号：', '');
      if (v) addUsers(v.split(/[,\s]+/));
    };
    div.querySelector('#tb-blk-remove').onclick = () => {
      const v = prompt('移除用户，多个用空格或逗号：', '');
      if (v) removeUsers(v.split(/[,\s]+/));
    };
    div.querySelector('#tb-blk-export').onclick = () => {
      alert(JSON.stringify(getList(), null, 2));
    };
    div.querySelector('#tb-blk-import').onclick = () => {
      const v = prompt('粘贴导入 JSON：', '');
      if (v) {
        try { addUsers(JSON.parse(v)); } catch { alert('JSON 格式错误'); }
      }
    };

    refreshPanel();
  }

  function refreshPanel() {
    const list = getList();
    const el = document.querySelector(`#${PANEL_ID} .muted`);
    if (el) el.textContent = `(${list.length})`;

    const listEl = document.getElementById('tb-blk-list');
    if (!listEl) return;
    listEl.innerHTML = '';
    list.forEach((u) => {
      const row = document.createElement('div');
      row.className = 'row-item';
      row.innerHTML = `<span class="del">✕</span><span class="username" title="${u}">${u}</span>`;
      row.querySelector('.del').onclick = () => removeUsers([u]);
      listEl.appendChild(row);
    });
  }

  function getAuthorFromCard(card) {
    try {
      const df = card.getAttribute('data-field');
      if (df) {
        const obj = JSON.parse(df);
        if (obj?.author_name) return obj.author_name;
      }
      const a = card.querySelector('.tb_icon_author');
      if (a) return a.title || a.textContent;
      const b = card.querySelector('.threadlist_author, .frs-author-name');
      if (b) return b.title || b.textContent;
    } catch {}
    return '';
  }

  function hideIfBlacklisted(card, bl) {
    if (card.dataset._tbblk_done) return;
    const author = normalize(getAuthorFromCard(card));
    if (!author) return;
    injectBlockButton(card, author);
    if (bl.has(author)) {
      card.style.display = 'none';
    }
    card.dataset._tbblk_done = '1';
  }

  function injectBlockButton(card, author) {
    if (card.querySelector('.tb-blk-laji')) return;
    const target = card.querySelector('.frs-author-name, .tb_icon_author, .threadlist_author_name');
    if (!target) return;
    const btn = document.createElement('span');
    btn.textContent = '[拉黑]';
    btn.className = 'tb-blk-laji';
    btn.onclick = (e) => {
      e.stopPropagation();
      addUsers([author]);
      card.style.display = 'none';
      alert(`已拉黑用户：${author}`);
    };
    target.insertAdjacentElement('afterend', btn);
  }

  function scanOnce() {
    const bl = new Set(getList());
    document.querySelectorAll('.j_thread_list, [data-field]').forEach((card) => {
      hideIfBlacklisted(card, bl);
    });
  }

  let timer;
  function scheduleScan() {
    clearTimeout(timer);
    timer = setTimeout(scanOnce, 200);
  }
  const mo = new MutationObserver(scheduleScan);
  function startObserver() {
    mo.observe(document.body, { childList: true, subtree: true });
  }

  function init() {
    if (!/\/f\?kw=/i.test(location.href)) return;
    ensurePanel();
    startObserver();
    scheduleScan();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
