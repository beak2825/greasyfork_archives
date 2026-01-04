// ==UserScript==
// @name       剪贴板权限控制add
// @description   控制网站的写入剪贴板操作，提供允许/拒绝选项
// @version      1.1
// @author       WJ
// @match        https://*/*
// @license       MIT
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @namespace https://greasyfork.org/users/914996
// @downloadURL https://update.greasyfork.org/scripts/544781/%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6add.user.js
// @updateURL https://update.greasyfork.org/scripts/544781/%E5%89%AA%E8%B4%B4%E6%9D%BF%E6%9D%83%E9%99%90%E6%8E%A7%E5%88%B6add.meta.js
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
  const toast = msg => {
    const el = Object.assign(document.createElement('div'),
      { className: 'WJ_toast', textContent: msg });
    document.body.append(el);
    setTimeout(() => el.remove(), 3000);
  };

  /* 1. Clipboard API writeText */
  navigator.clipboard.writeText = (text) =>
    new Promise((res) => {decide(text,
    (t) => { GM_setClipboard(t); res(); }, res, '[write]');
  });

  /* 2. copy 事件 */
  document.addEventListener('copy', e => {
    if (e.isTrusted && (s => s?.toString().trim() && s.rangeCount)(getSelection())) return;
    e.preventDefault();
    e.stopImmediatePropagation?.();
    const text = getSelection().toString();
    decide(text, (t) => GM_setClipboard(t), null, '[copy]');
  }, true);

  /* 3. execCommand('copy cut') */
  const originalExecCommand = Document.prototype.execCommand;
  Document.prototype.execCommand = function (command, showUI, value) {
    if (command.toLowerCase() === 'copy' || command.toLowerCase() === 'cut') {
      const text = getSelection().toString();
      decide(text, (t) => GM_setClipboard(t), null, '[exec]');
      return true;
    }
    return originalExecCommand.call(this, command, showUI, value);
  };

  /* 4. Clipboard API write (富文本) */
  const nativeWrite = navigator.clipboard.write;
  navigator.clipboard.write = async ([it = {}] = []) => {
    if (it.types?.includes?.('text/plain') || it.types?.includes?.('text/html')) {
      const text = it.types.includes('text/plain')
      ? await (await it.getType('text/plain')).text() : new DOMParser()
        .parseFromString(await (await it.getType('text/html')).text(), 'text/html')
        .documentElement.textContent;
      return new Promise((r, j) => decide(text, t => (GM_setClipboard(t), r()), j, '[富文本]'));
    }
    return nativeWrite.call(navigator.clipboard, [it]);
  };

  /* ---------- 弹窗 ---------- */
  const decide = (text, onAllow, onDeny, via = '未知') => {
    if ((s => s?.toString().trim() && s.rangeCount && s.getRangeAt(0).getClientRects().length)(getSelection())) return onAllow?.(text);
    if (document.querySelector('.WJ_modal')) {
      if (!document.querySelector('.WJ_warning')) {
        document.querySelector('.WJ_modal .WJ_header').insertAdjacentHTML('beforeend',
        '<div class="WJ_warning" style="color:#FFD700;font-size:16px;margin-top:8px">⚠️ 此网站授权期多次尝试写入剪贴板 已拒绝后续写入 ⚠️</div>');
      }
      return onDeny?.();
    }
    if (whitelist.includes(domain)) return onAllow?.(text);
    if (blacklist.includes(domain)) return (toast('已拦截复制'), onDeny?.());
    const overlay = Object.assign(document.createElement('div'), { className: 'WJ_overlay' });
    const modal = Object.assign(document.createElement('div'), { className: 'WJ_modal' });
    document.documentElement.style.overflow = 'hidden';
    modal.innerHTML = `
      <div class="WJ_header">${domain} 请求写入剪贴板 ${via}</div>
      <textarea class="WJ_text"></textarea>
      <div class="WJ_footer" style="display:grid;grid-template-columns:repeat(5,1fr);gap:8px;padding:15px;background:#1F1F1F;">
        <button class="WJ_btn" data-action="allow"   style="background:#135200;">允许一次</button>
        <button class="WJ_btn" data-action="deny"    style="background:#876800;">拒绝一次</button>
        <button class="WJ_btn" data-action="togg"    style="background:#606060;">✔文字换行</button>
        <button class="WJ_btn" data-action="always-allow" style="background:#003A8C;">始终允许</button>
        <button class="WJ_btn" data-action="always-deny"  style="background:#800D00;">始终拒绝</button>
      </div>`;
    document.documentElement.append(overlay, modal);
    modal.querySelector('.WJ_text').value = text;
    const close = () => (document.documentElement.style.overflow = '', overlay.remove(), modal.remove());
    const actions = {
      allow: () => { const BJtext = modal.querySelector('.WJ_text').value; toast('允许本次复制'); onAllow?.(BJtext); close(); },
      deny: () => (toast('拒绝本次复制'), onDeny?.(), close()),
      togg: () => { const ta = modal.querySelector('.WJ_text'); ta.style.whiteSpace = ta.style.whiteSpace ? '' : 'pre'; event.target.textContent = ta.style.whiteSpace ? '✘文字换行' : '✔文字换行'; },
      'always-allow': () => { const BJtext = modal.querySelector('.WJ_text').value; whitelist.push(domain); save(); toast(`添加白名单 ${domain}`); onAllow?.(BJtext); close(); },
      'always-deny': () => (blacklist.push(domain), save(), toast(`添加黑名单 ${domain}`), onDeny?.(), close())
    };
    modal.onclick = e => actions[e.target.dataset.action]?.();
    overlay.onclick = () => actions.deny();
  };

  /* ---------- 管理面板 ---------- */
  const showPanel = () => {
    const overlay = Object.assign(document.createElement('div'), { className: 'WJ_overlay' });
    const panel = Object.assign(document.createElement('div'), { className: 'WJ_modal' });
    document.documentElement.style.overflow = 'hidden';
    panel.innerHTML = `
      <div class="WJ_header">管理面板</div>
      <div class="WJ_panel-content" style="display:flex;padding:0;max-height:60vh;">
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
      <div class="WJ_close-box" style="padding:15px;text-align:center;border-top:1px solid #333;background:#1F2021;display:flex;align-items:center;justify-content:center">
        <button class="WJ_btn" id="WJ_close" style="background:#3D5E90;padding:14px 40px;margin:0 auto;">关闭面板</button>
      </div>`;
    document.documentElement.append(overlay, panel);
    overlay.onclick = () => panel.onclick({target:{id:'WJ_close'}});
    panel.onclick = ({target}) => {
      if (target.id === 'WJ_close') return document.documentElement.style.overflow = '',overlay.remove(),panel.remove();
      if (target.classList.contains('WJ_delete')) {
        const {list, domain} = target.dataset;
        list === 'whitelist' ? whitelist.splice(whitelist.indexOf(domain), 1)
                         : blacklist.splice(blacklist.indexOf(domain), 1);
        save(); overlay.remove(); panel.remove(); showPanel();
    }};
  };

  /* ---------- 样式 ---------- */
  GM_addStyle(`
    .WJ_modal{position:fixed;top:65%;left:50%;transform:translate(-50%,-50%);width:90%;max-width:560px;background:#121212;z-index:99999;border-radius:12px;font-family:system-ui;overflow:hidden;}
    .WJ_header{background:linear-gradient(135deg,#4a6fa5,#3a5a8a);color:#fff;padding:20px;font-size:20px;font-weight:600;text-align:center;letter-spacing:.5px;}
    .WJ_text{background:#1F2021;padding:5px;border-radius:8px;height:300px;font-size:15px;line-height:1.2;color:#ccc;margin:15px;outline:1px solid #4a6fa5;box-sizing:border-box;width:calc(100% - 30px);overflow-x:auto;resize:none;display:block;}
    .WJ_btn{padding:12px 5px;border:none;border-radius:8px;font-size:14px;color:#fff;text-align:center}
    .WJ_toast{position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:#000c;color:#fff;padding:16px 32px;border-radius:8px;border:2px solid #CCC;z-index:99999;font-size:16px;}
    .WJ_overlay{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);z-index:99998}
    .WJ_list{flex:1;padding:15px 5px 5px;overflow-y:auto;border-right:1px solid #333;background:#121212;}
    .WJ_list:last-child{border-right:none;}
    .WJ_list-title{margin:0 0 15px;padding-bottom:10px;border-bottom:2px solid #4a6fa5;color:#AAA;text-align:center;font-size:18px;}
    .WJ_list-item{display:flex;justify-content:space-between;align-items:center;padding:3px 3px;background:#1F2021;margin-bottom:10px;border-radius:8px;border:1px solid #333;}
    .WJ_list-item span{overflow:hidden;text-overflow:ellipsis;color:#ddd;font-size:14px}
    .WJ_delete{background:#876800;color:#fff;border:none;border-radius:6px;padding:6px 14px;font-size:14px;margin-left:10px;}
    .WJ_empty{display:flex;align-items:center;justify-content:center;color:#6c757d;margin:25px 0 20px;}`);
  GM_registerMenuCommand('黑白名单管理', showPanel);
})();