// ==UserScript==
// @name         网页自动登录助手
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动填充并可配置登录信息，页面路径为login时展示配置按钮
// @author       You
// @match        *://*/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/533687/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/533687/%E7%BD%91%E9%A1%B5%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function getDomainKey() {
    return location.host; // 支持 IP + 端口 的绑定
  }

  function createSettingsButton() {
    if (document.getElementById('al_settings_btn')) return;
    const btn = document.createElement('button');
    btn.id = 'al_settings_btn';
    btn.innerText = '⚙️';
    btn.title = '自动登录配置（Alt+L）';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = 99999;
    btn.style.width = '36px';
    btn.style.height = '36px';
    btn.style.fontSize = '18px';
    btn.style.padding = '0';
    btn.style.background = '#4CAF50';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '50%';
    btn.style.cursor = 'pointer';
    btn.onclick = showSettingsUI;
    document.body.appendChild(btn);
  }

  function showSettingsUI() {
    if (document.getElementById('al_ui_wrap')) return;
    const wrap = document.createElement('div');
    wrap.id = 'al_ui_wrap';
    wrap.style.position = 'fixed';
    wrap.style.bottom = '80px';
    wrap.style.right = '20px';
    wrap.style.background = 'white';
    wrap.style.border = '1px solid #ccc';
    wrap.style.padding = '20px';
    wrap.style.zIndex = 99998;
    wrap.style.borderRadius = '8px';
    wrap.style.boxShadow = '0 0 8px rgba(0,0,0,0.2)';
    wrap.innerHTML = `
      <h4 style="margin: 0 0 10px;">自动登录设置</h4>
      <label>网站域名/地址:<br><input id="al_domain" style="width: 100%; margin-bottom: 8px;" /></label>
      <label>用户名字段 ID:<br><input id="al_userid" style="width: 100%; margin-bottom: 8px;" /></label>
      <label>密码字段 ID:<br><input id="al_passid" style="width: 100%; margin-bottom: 8px;" /></label>
      <label>用户名:<br><input id="al_user" style="width: 100%; margin-bottom: 8px;" /></label>
      <label>密码:<br><input type="password" id="al_pass" style="width: 100%; margin-bottom: 12px;" /></label>
      <label><input type="checkbox" id="al_autoSubmit" /> 自动提交表单</label><br>
      <button id="al_save" style="margin-right: 8px;">💾 保存配置</button>
      <button id="al_close">❌ 关闭</button>
    `;
    document.body.appendChild(wrap);

    const domain = getDomainKey();
    document.getElementById('al_domain').value = domain;
    const saved = JSON.parse(localStorage.getItem('autologin_config') || '{}')[domain];
    if (saved) {
      document.getElementById('al_userid').value = saved.userId || '';
      document.getElementById('al_passid').value = saved.passId || '';
      document.getElementById('al_user').value = saved.user || '';
      document.getElementById('al_pass').value = saved.pass || '';
      document.getElementById('al_autoSubmit').checked = saved.autoSubmit || false;
    }

    document.getElementById('al_save').onclick = () => {
      const domain = document.getElementById('al_domain').value;
      const conf = {
        userId: document.getElementById('al_userid').value,
        passId: document.getElementById('al_passid').value,
        user: document.getElementById('al_user').value,
        pass: document.getElementById('al_pass').value,
        autoSubmit: document.getElementById('al_autoSubmit').checked,
      };
      const allConfig = JSON.parse(localStorage.getItem('autologin_config') || '{}');
      allConfig[domain] = conf;
      localStorage.setItem('autologin_config', JSON.stringify(allConfig));
      alert('配置已保存');
    };

    document.getElementById('al_close').onclick = () => wrap.remove();
  }

  function autoFill() {
    const allConfig = JSON.parse(localStorage.getItem('autologin_config') || '{}');
    const current = allConfig[getDomainKey()];
    if (current) {
      const userInput = document.getElementById(current.userId);
      const passInput = document.getElementById(current.passId);
      if (userInput && passInput) {
        userInput.focus();
        userInput.value = current.user;
        passInput.focus();
        passInput.value = current.pass;

        userInput.dispatchEvent(new Event('input', { bubbles: true }));
        passInput.dispatchEvent(new Event('input', { bubbles: true }));

        console.log('自动填充完成 ✅');

        if (current.autoSubmit) {
          const form = userInput.form || passInput.form;
          if (form) {
            // 手动触发 submit 事件
            setTimeout(() => {
              const submitBtn = form.querySelector('[type=submit]');
              if (submitBtn) {
                submitBtn.click();
              } else {
                form.dispatchEvent(new Event('submit', { bubbles: true }));
              }
              console.log('表单已尝试提交 ✅');
            }, 500);
          }
        }
      } else {
        console.warn('未找到输入框元素 ❗');
      }
    }
  }

  window.addEventListener('load', () => {
    if (location.pathname.includes('/login')) {
      createSettingsButton();
    }

    window.addEventListener('keydown', (e) => {
      if (e.altKey && e.key.toLowerCase() === 'l') {
        showSettingsUI();
      }
    });

    setTimeout(autoFill, 800);
  });
})();
