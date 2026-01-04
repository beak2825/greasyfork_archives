// ==UserScript==
// @name         无图模式
// @icon         https://avatars.githubusercontent.com/u/43409097?v=4
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  无图模式，鼠标悬浮后显示图片
// @author       leekbillow
// @homepage     https://github.com/leekbillow/customTampermonkey
// @match        https://*/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_getValues
// @grant        GM_setValues
// @grant        GM_registerMenuCommand
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/540903/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/540903/%E6%97%A0%E5%9B%BE%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  "use strict";

  let imgStyle = null;
  function apply() {
    const { delay, opacity } = GM_getValues({ delay: 0, opacity: 0 });
    imgStyle?.remove();
    imgStyle = GM_addStyle(`
      img {
        filter: blur(5px) !important;
        opacity: ${opacity / 100} !important;
        transition:
          filter 0.5s 0s ease-in-out,
          opacity 0.5s 0s ease-in-out !important;
      }
      img:hover {
        filter: blur(0) !important;
        transition:
          filter 1s ${delay}ms ease-in-out,
          opacity 1s ${delay}ms ease-in-out !important;
        opacity: 1 !important;
      }
    `);
  }

  function cancel() {
    imgStyle?.remove();
    imgStyle = null;
  }

  function openConfigForm() {
    const { enabled, delay, opacity } = GM_getValues({ enabled: 'false', delay: 1000, opacity: 15 });
    const inputs = [
      { type: 'select', name: 'enabled', label: '默认启用', options: [{ value: 'true', text: '启用' }, { value: 'false', text: '禁用' }], },
      { type: 'range', name: 'delay', label: '显示延迟', value: delay || 0, min: 0, max: 3000, step: 100 },
      { type: 'range', name: 'opacity', label: '可见度', value: opacity || 0, min: 0, max: 100, step: 1 },
    ]

    const form = document.createElement('form');
    form.style = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, 50%);
      z-index:99999;
      background: #888;
      padding: 20px;
      border-radius: 5px;
    `;
    inputs.forEach(input => {
      const div = document.createElement('div');
      div.innerHTML = `
      <label>${input.label}：</label>
      ${input.type === 'select'
          ? `<select name="${input.name}">
            ${input.options.map(opt => `<option value="${opt.value}" ${enabled === opt.value ? 'selected' : ''}>${opt.text}</option>`).join('')}
          </select>`
          : `<input ${Object.entries(input).map(([k, v]) => `${k}="${v}"`).join(' ')}>`
        }
    `;
      form.appendChild(div);
    });

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.textContent = '保存';
    saveBtn.onclick = (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const config = Object.fromEntries(formData.entries());
      GM_setValues(config)
      cancel();
      if (config.enabled === 'true') apply();
    };

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '关闭';
    closeBtn.onclick = (e) => {
      e.preventDefault();
      form.remove();
    };

    form.appendChild(saveBtn);
    form.appendChild(closeBtn);
    document.body.appendChild(form);
  }

  const enabled = GM_getValue('enabled');
  if (enabled === 'true') apply();

  GM_registerMenuCommand("临时启用", apply);
  GM_registerMenuCommand("临时禁用", cancel);
  GM_registerMenuCommand("设置", openConfigForm);
})();
