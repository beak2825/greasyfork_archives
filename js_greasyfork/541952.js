// ==UserScript==
// @name       剪贴板权限控制
// @description   控制网站的写入剪贴板操作，提供允许/拒绝选项
// @version      1.0
// @author       WJ
// @match        *://*/*
// @license       MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @namespace https://greasyfork.org/users/914996
// @downloadURL https://update.greasyfork.org/scripts/541952/%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/541952/%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6.meta.js
// ==/UserScript==
// 脚本默认不拦截主动复制！

(() => {
  'use strict';

  /* ---------- 数据 ---------- */
  let whitelist = GM_getValue('whitelist', []);
  let blacklist = GM_getValue('blacklist', []);
  const domain = location.hostname;
  const save = () => {
    GM_setValue('whitelist', whitelist);
    GM_setValue('blacklist', blacklist);
  };

  /* ---------- 工具 ---------- */
  const toast = (msg) => {
    const t = document.createElement('div');
    t.className = 'WJ_toast';
    t.textContent = msg;
    document.body.append(t);
    setTimeout(() => t.remove(), 3000);
  };

  /* 1. Clipboard API writeText */
  navigator.clipboard.writeText = (text) =>
    new Promise((res) => { decide(text, 
    () => { GM_setClipboard(text); res(); }, res, '[writeText]');
  });

  /* 2. copy 事件 */
  const rawAdd = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function(t, l, o) {
    if (t === 'copy' && this === document) return;
    if (!o && ['touchstart','touchmove','wheel'].includes(t)) o = { passive: true };
    rawAdd.call(this, t, l, o);
  };
  document.oncopy = (e) => {
    e?.preventDefault?.();
    e?.stopImmediatePropagation?.();
    const text = getSelection().toString();
    decide(text, () => GM_setClipboard(text), null, '[copy]');
    return true;
  };

  /* 3. execCommand('copy cut') */
  const originalExecCommand = Document.prototype.execCommand;
  Document.prototype.execCommand = function (command, showUI, value) {
    if (command.toLowerCase() === 'copy' || command.toLowerCase() === 'cut') {
      const text = getSelection().toString();
      decide(text, () => GM_setClipboard(text), null, '[exec]');
      return true;
    }
    return originalExecCommand.call(this, command, showUI, value);
  };

  /* 4. Clipboard API write (富文本) */
  const nativeWrite = navigator.clipboard.write;
  navigator.clipboard.write = d => new Promise((r, j) => {
    (d[0]?.types?.includes('text/plain')
      ? d[0].getType('text/plain').then(b => new Response(b).text())
      : Promise.reject('No text/plain type')).then(t => decide(t,
        () => { GM_setClipboard(t); r(); },
        () => j(new Error('User denied clipboard write')),
        '[write富文本]'
      )).catch(() => decide('富文本内容？图片/表格 无法显示',
        () => nativeWrite(d).then(r).catch(j),
        () => j(new Error('User denied clipboard write')),
        '[write富文本]'
      ));
  });
  
  /* ---------- 弹窗 ---------- */
  let isModalOpen = false;
  const decide = (text, onAllow, onDeny, via = '未知') => {
    if (isModalOpen) {
      if (!document.querySelector('.WJ_warning')) {
        const header = document.querySelector('.WJ_modal .WJ_header');
        const warning = document.createElement('div');
        warning.className = 'WJ_warning';
        warning.textContent = '⚠️ 此网站授权期多次尝试写入剪贴板 已拒绝后续写入 ⚠️';
        Object.assign(warning.style, { color: '#FFD700', fontSize: '16px', marginTop: '8px' });
        header.appendChild(warning);
      }
      return onDeny?.();
    }
    if (whitelist.includes(domain)) return onAllow?.();
    if (blacklist.includes(domain)) return (toast('已拦截复制'), onDeny?.());
    const selection = getSelection();
    const hasText   = !!selection?.toString().trim();
    const visible   = !!(selection?.rangeCount &&
    selection.getRangeAt(0).getClientRects().length);
    console.log('选区是否有文本:', hasText);
    console.log('选区是否可见:', visible);
    if (visible && hasText) return onAllow?.();
    isModalOpen = true;
    const overlay = Object.assign(document.createElement('div'), { className: 'WJ_overlay' });
    const modal = Object.assign(document.createElement('div'), { className: 'WJ_modal' });
    modal.innerHTML = `
      <div class="WJ_header">${domain} 请求写入剪贴板 ${via}</div>
      <div class="WJ_text">${text}</div>
      <div class="WJ_footer">
        <button class="WJ_btn WJ_allow" data-action="allow">允许一次</button>
        <button class="WJ_btn WJ_deny" data-action="deny">拒绝一次</button>
        <button class="WJ_btn WJ_always-allow" data-action="always-allow">始终允许</button>
        <button class="WJ_btn WJ_always-deny" data-action="always-deny">始终拒绝</button>
      </div>`;
    document.body.append(overlay, modal);
    const close = () => (overlay.remove(), modal.remove(), isModalOpen = false);
    const actions = {
      allow: () => (toast('允许本次复制'), onAllow?.(), close()),
      deny: () => (toast('拒绝本次复制'), onDeny?.(), close()),
      'always-allow': () => (whitelist.push(domain), save(), toast(`添加白名单 ${domain}`), onAllow?.(), close()),
      'always-deny': () => (blacklist.push(domain), save(), toast(`添加黑名单 ${domain}`), onDeny?.(), close())
    };
    modal.onclick = e => {
      const action = e.target.dataset.action;
      if (actions[action]) actions[action]();
    };
    overlay.onclick = () => actions.deny();
  };

  /* ---------- 管理面板 ---------- */
  const showPanel = () => {
    const overlay = Object.assign(document.createElement('div'), { className: 'WJ_overlay' });
    const panel = Object.assign(document.createElement('div'), { className: 'WJ_modal' });
    panel.innerHTML = `
      <div class="WJ_header">黑白名单-管理面板</div>
      <div class="WJ_panel-content">
        <div class="WJ_list">
          <div class="WJ_list-title">白名单</div>
          ${whitelist.map(d => `
            <div class="WJ_list-item">
              <span>${d}</span>
              <button class="WJ_delete" data-list="whitelist" data-domain="${d}">删除</button>
            </div>`).join('') || '<div class="WJ_empty">白名单为空</div>'}
        </div>
        <div class="WJ_list">
          <div class="WJ_list-title">黑名单</div>
          ${blacklist.map(d => `
            <div class="WJ_list-item">
              <span>${d}</span>
              <button class="WJ_delete" data-list="blacklist" data-domain="${d}">删除</button>
            </div>`).join('') || '<div class="WJ_empty">黑名单为空</div>'}
        </div>
      </div>
      <div class="WJ_close-box">
        <button class="WJ_btn WJ_close" id="WJ_close">关闭面板</button>
      </div>`;
    document.body.append(overlay, panel);
    panel.addEventListener('click', e => {
      if (e.target.id === 'WJ_close') return overlay.remove(), panel.remove();
      if (e.target.classList.contains('WJ_delete')) {
        const { list, domain } = e.target.dataset;
        list === 'whitelist'
          ? whitelist = whitelist.filter(d => d !== domain)
          : blacklist = blacklist.filter(d => d !== domain);
        save(); overlay.remove(); panel.remove(); showPanel();
      }
    });
  };

  /* ---------- 样式 ---------- */
  GM_addStyle(`
    .WJ_modal,.WJ_overlay+div{position:fixed;top:65%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:560px;background:#121212;z-index:99999;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.3);font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;overflow:hidden;}
    .WJ_header{background:linear-gradient(135deg,#4a6fa5,#3a5a8a);color:#fff;padding:20px;font-size:20px;font-weight:600;text-align:center;letter-spacing:.5px;}
    .WJ_text{white-space:pre-wrap;word-break:break-word;background:#1F2021;padding:5px;border-radius:8px;height:220px;overflow-y:auto;font-family:Consolas,monospace;font-size:15px;line-height:1.5;color:#ccc;margin:15px;border:1px solid #333;}
    .WJ_footer{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:15px;background:#1F1F1F;}
    .WJ_btn{padding:12px 5px;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:14px;color:#fff;text-align:center;transition:transform .1s,filter .1s;}
    .WJ_btn:active{transform:scale(0.98);}
    .WJ_allow{background:linear-gradient(135deg,#4CAF50,#2E7D32);}
    .WJ_deny{background:linear-gradient(135deg,#FF9800,#EF6C00);}
    .WJ_always-allow{background:linear-gradient(135deg,#2196F3,#1565C0);}
    .WJ_always-deny{background:linear-gradient(135deg,#F44336,#C62828);}
    .WJ_close{background:#3D5E90;padding:14px 40px;margin:0 auto;}
    .WJ_toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,.9);color:#fff;padding:16px 32px;border-radius:8px;border:2px solid #CCC;z-index:99999;font-size:16px;font-weight:500;}
    .WJ_overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);z-index:99998;backdrop-filter:blur(8px);}
    .WJ_panel-content{display:flex;padding:0;max-height:60vh;}
    .WJ_list{flex:1;padding:20px;overflow-y:auto;border-right:1px solid #333;background:#121212;}
    .WJ_list:last-child{border-right:none;}
    .WJ_list-title{font-weight:600;margin:0 0 15px;padding-bottom:10px;border-bottom:2px solid #4a6fa5;color:#AAA;text-align:center;font-size:18px;}
    .WJ_list-item{display:flex;justify-content:space-between;align-items:center;padding:12px 18px;background:#1F2021;margin-bottom:10px;border-radius:8px;border:1px solid #333;}
    .WJ_list-item span{overflow:hidden;text-overflow:ellipsis;color:#ddd;}
    .WJ_delete{background:linear-gradient(135deg,#dc3545,#c82333);color:#fff;border:none;border-radius:6px;padding:6px 14px;cursor:pointer;font-size:14px;font-weight:500;margin-left:10px;}
    .WJ_close-box{padding:20px;text-align:center;border-top:1px solid #333;background:#1F2021;}
    .WJ_empty{text-align:center;padding:20px;color:#6c757d;font-style:italic;}`);
  GM_registerMenuCommand('黑白名单管理', showPanel);
})();
