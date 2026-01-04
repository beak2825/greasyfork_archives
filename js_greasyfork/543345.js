// ==UserScript==
// @name         账号密码自动填充
// @description  账号密码自动填充 支持多账号 两步登录
// @version      1.0
// @author       WJ
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @namespace https://greasyfork.org/users/914996
// @downloadURL https://update.greasyfork.org/scripts/543345/%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/543345/%E8%B4%A6%E5%8F%B7%E5%AF%86%E7%A0%81%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

setTimeout(() => {
  'use strict';

  /* ---------- 数据操作 ---------- */
  const loadAll = () => JSON.parse(GM_getValue('siteCredentials', '[]'));
  const saveAll = arr => GM_setValue('siteCredentials', JSON.stringify(arr));

  /* ---------- Toast ---------- */
  const toast = m => {const e = Object.assign(document.createElement('div'), {
    textContent: m,style: 'position:fixed;left:50%;bottom:80px;transform:translateX(-50%);background:#000c;color:#fff;padding:12px 20px;border-radius:4px;font-size:18px;z-index:99999;border:2px solid #5B6'});
  document.body.append(e);setTimeout(() => e.remove(), 3000)};

  /* ---------- 自动保存 ---------- */
  document.addEventListener('submit', e => {
    const { user, pwd } = chaZ(), u = user?.value, p = pwd?.value, list = loadAll();
    if (u && p && !list.some(it => it.url.startsWith(location.origin) && it.account === u && it.password === p) && confirm(`保存账号/密码？\n账号：${u}\n密码：${p}`)) {
      saveAll((list.push({ title: document.title || '', url: location.origin + location.pathname, account: u, password: p }), list));
      toast('已保存');
    }
  }, true);

  /* ---------- 查找输入框 ---------- */
  const chaZ = () => {
    const inputs = document.body.querySelectorAll('input');
    if (!inputs.length) return { user: null, pwd: null };
    const kw = n => /user|login|mail|phone|手机|邮箱|账号|用户名|账户|id/i.test(`${n.name}|${n.placeholder}|${n.id}`);
    let user = null, pwd = null, userTab = Infinity, pwdTab = Infinity;
    for (const n of inputs) {
      const tab = n.tabIndex || 0;
      if (n.type === 'password' && tab < pwdTab) { pwd = n; pwdTab = tab; }
      if (/^(text|email|tel|number)$/i.test(n.type) && kw(n) && tab < userTab) { user = n; userTab = tab; }
    }
    return { user, pwd };
  };

  /* ---------- 自动填充 ---------- */
  let suo;
  const init = () => {
    if (!loadAll().some(it => it.url && location.href.startsWith(it.url) && (it.account || it.password))) return;
    const tianc = () => suo ??= (async () => {
      const { user, pwd } = chaZ();
      if (!user && !pwd) return;
      const list = loadAll().filter(it => it.url && location.href.startsWith(it.url) && (it.account || it.password));
      const rec = list.length === 1 ? list[0] : list.length ? await pickAccount(list) : null;
      const fill = (el, val, attr) => el && val && !el.value && !el.hasAttribute(attr) && (
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set?.call(el, val),
        el.dispatchEvent(new Event('input', { bubbles: true })),el.setAttribute(attr, ''));
      fill(user, rec?.account, 'filled-u');
      fill(pwd, rec?.password, 'filled-p');
    })().finally(() => suo = 0);
    new MutationObserver(tianc).observe(document.body,{childList: true, subtree: true}),tianc();
  };

  /* ---------- 扫描 ---------- */
  const scanP = () => {
    const list = loadAll();
    const { user, pwd } = chaZ();
    const idx = list.findIndex(it => it.title === document.title);
    const rec = { title:document.title || '', url:location.origin + location.pathname, account:user?.value || '', password:pwd?.value || '' };
    idx >= 0 ? (list[idx] = rec) : list.push(rec);
    saveAll(list);
    openEditor();
  };

  /* ---------- 底部卡片选择 ---------- */
  const pickAccount = list => new Promise(resolve => {
    const key = `picked_${location.origin}${location.pathname}`;
    if (sessionStorage[key]) return resolve(JSON.parse(sessionStorage[key]));
    const wrap = document.createElement('div');
    wrap.style.cssText = 'font-family:system-ui;position:fixed;left:0;right:0;bottom:0;z-index:99999;background:#1e1e1e;color:#eee;padding:16px 0';
    window.visualViewport?.addEventListener('resize', () => wrap.style.bottom = (window.innerHeight - window.visualViewport.height) + 'px');
    wrap.style.bottom = (window.innerHeight - window.visualViewport.height) + 'px';
    wrap.innerHTML = `
      <div style="font-size:30px;text-align:center;margin-bottom:14px;color:#4E6BF5">选择账号登录</div>
      <div style="display:grid;grid-template-columns:1fr 1px 1fr;border-top:1px solid #444">
        ${list.map((rec, i) => {
          const last = i === list.length - 1;
          const oddLast = last && (i + 1) % 2 === 1;
          return `
            <div data-idx="${i}" style="${oddLast ? 'grid-column:1/-1;' : ''}padding:5px 5px;display:flex;flex-direction:column;justify-content:center;align-items:center;min-height:52px">
              <div style="font-size:20px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rec.account || '(空账号)'}</div>
              <div style="font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${rec.password || '(空密码)'}</div>
            </div>
            ${(i + 1) % 2 === 1 && !last ? '<div style="background:#444"></div>' : ''}
            ${(i + 1) % 2 === 0 || last ? '<div style="height:1px;background:#444;grid-column:1/-1"></div>' : ''}`;
        }).join('')}
      </div>
    `.replace(/\s*\n\s*/g, '');
    document.body.appendChild(wrap);
    const t = setTimeout(() => (wrap.remove(), resolve(null)), 5000);
    wrap.addEventListener('click', e => {
      if (!e.target.closest('[data-idx]')) return;
      const selected = list[Number(e.target.closest('[data-idx]').dataset.idx)];
      sessionStorage[key] = JSON.stringify(selected);
      clearTimeout(t);
      wrap.remove();
      resolve(selected);
    });
  });

  /* ---------- 管理面板 ---------- */
  const openEditor = () => {
    document.documentElement.style.overflow = 'hidden';
    const box = document.createElement('div');box.style.cssText = `width:95%; max-width:600px; max-height:90vh; overflow:auto; background:#262626; color:#eee; border-radius:6px; padding:15px;`;
    const wrap = document.createElement('div');wrap.id = 'WJ_tmCredEditor';wrap.style.cssText = `position:fixed; inset:0; background:rgba(0,0,0,.8); z-index:9999; display:flex; align-items:center; justify-content:center; font-family:system-ui`;
    box.innerHTML = `
      <style>
        #WJ_tmCredEditor table{width:100%;border-collapse:collapse;table-layout:fixed;margin:0 -15px;width:calc(100% + 30px)}
        #WJ_tmCredEditor thead th{border:1px solid #555;padding:6px 4px;font-size:18px;text-align:center;color:#0E5484}
        #WJ_tmCredEditor tbody td{border:1px solid #555;height:50px;padding:0;text-align:center;vertical-align:middle;position:relative}
        #WJ_jsonArea{width:100%;height:150px;margin-top:10px;outline:none}#WJ_jsonArea::placeholder{font-size:20px;text-align:center}
        .WJ_scroll-box{height:50px;overflow:auto;background:#333}
        .WJ_center-box{min-height:50px;display:flex;align-items:center;justify-content:center;padding:0 4px;box-sizing:border-box;color:#eee;font-size:13px;line-height:1.2;text-align:center;white-space:pre-wrap;word-break:break-all;outline:none}
        .WJ_delete-btn{position:absolute;inset:0;background:#5D4401;color:#fff;font-size:14px;display:flex;align-items:center;justify-content:center;user-select:none}
        .WJ_bottom-bar{display:flex;margin:15px -15px 0 -15px}
        .WJ_bottom-bar button{flex:1;height:48px;font-size:16px;color:#157530;background:none;border:1px solid #bbb;border-right:none}
        .WJ_bottom-bar button:last-child{border-right:1px solid #bbb}
      </style>
      <h2 style="margin:0 0 12px;text-align:center;font-size:26px;color:#0E5484">账号密码管理</h2>
      <table id="WJ_credTable">
        <thead>
          <tr>
            <th style="width:18%">标题</th>
            <th style="width:37%">网址</th>
            <th style="width:25%">账号</th>
            <th style="width:20%">密码</th>
            <th style="width:10%">删除</th>
          </tr>
        </thead>
        <tbody></tbody>
      </table>
      <div class="WJ_bottom-bar">
        <button id="WJ_addBtn">新增</button>
        <button id="WJ_exportBtn">导出</button>
        <button id="WJ_importBtn">导入</button>
        <button id="WJ_closeBtn">关闭</button>
      </div>
      <textarea id="WJ_jsonArea" style="display:none" placeholder="粘贴格式：标题,网址,账号,密码&#10;百度,https://www.baidu.com,zhanghao,mima"></textarea>`;
    wrap.appendChild(box);
    document.body.appendChild(wrap);
    const render = () => {
      const tbody = wrap.querySelector('#WJ_credTable tbody');
      tbody.innerHTML = '';
      loadAll().forEach((row, idx) => {
        const tr = tbody.insertRow();
        ['title', 'url', 'account', 'password'].forEach(key => {
          const cell = tr.insertCell();
          cell.innerHTML = '<div class="WJ_scroll-box"><div class="WJ_center-box" contenteditable spellcheck="false"></div></div>';
          const inner = cell.querySelector('.WJ_center-box');
          inner.textContent = row[key] || '';
          inner.oninput = () => { const list = loadAll(); list[idx][key] = inner.textContent; saveAll(list); };
        });
        const delCell = tr.insertCell();
        delCell.innerHTML = '<div class="WJ_delete-btn">❌</div>';
        delCell.firstChild.onclick = () => { const list = loadAll(); list.splice(idx, 1); saveAll(list); render(); toast('已删除'); };
      });
    };
    render();
    wrap.querySelector('#WJ_closeBtn').onclick = () => {document.documentElement.style.overflow = '';wrap.remove()};
    wrap.querySelector('#WJ_addBtn').onclick = () => (saveAll(loadAll().concat({ title:'', url:'', account:'', password:'' })), render());
    wrap.querySelector('#WJ_exportBtn').onclick = () => navigator.clipboard.writeText(loadAll().map(r => [r.title, r.url, r.account, r.password].join(',')).join('\n')).then(() => toast('已导出到剪贴板'));
    wrap.querySelector('#WJ_importBtn').onclick = () => {
      const ta = wrap.querySelector('#WJ_jsonArea');
      if (ta.style.display === 'none') return ta.style.display = 'block';
      const val = ta.value.trim();
      if (!val) return ta.style.display = 'none'
      try { const list = loadAll();
        val.split('\n').forEach(line => {
          const cells = line.split(',');
          if (cells.length !== 4) throw new Error('格式错误');
          const [title, url, account, password] = cells;
          const idx = list.findIndex(it => it.title === title);
          idx >= 0 ? (list[idx] = { title, url, account, password }) : list.push({ title, url, account, password });
        });
        saveAll(list); render(); ta.value = ''; ta.style.display = 'none'; toast('导入成功');
      } catch (e) { toast(e.message); }
    };
  };

  /* ---------- 启动 ---------- */
  init();
  GM_registerMenuCommand('扫描页面账号', scanP);
  GM_registerMenuCommand('账号密码管理', openEditor);
}, 500);