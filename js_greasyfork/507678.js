// ==UserScript==
// @name         HIT 校园网站自动登录2.0
// @namespace    https://github.com/TerrorAWM
// @version      1.3.2
// @description  在 HIT 站点自动填充/登录；在所有页面都显示可折叠悬浮入口，便于随时跳转HIT内/外网与HIT-WLAN；支持WebVPN重定向与校外授权自动同意
// @author       Ricardo Zheng
// @match        http://*/*
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/507678/HIT%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%9520.user.js
// @updateURL https://update.greasyfork.org/scripts/507678/HIT%20%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%9520.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ========== 跳过自动登录的站点 ==========
  // 这些站点会导致自动登录兼容性问题，只显示FAB但不执行自动登录
  const SKIP_AUTOLOGIN_HOSTNAMES = [
    'mail.hit.edu.cn'  // Issue #4: HIT MAIL 登录页面兼容性问题
  ];

  const skipAutoLogin = SKIP_AUTOLOGIN_HOSTNAMES.includes(location.hostname);

  // ---- 目标链接 ----
  const URL_INTRANET = 'http://i.hit.edu.cn/';
  const URL_EXTRANET = 'http://ivpn.hit.edu.cn/';
  const URL_WLAN = 'https://webportal.hit.edu.cn/';

  // ---- HIT 站点判定（含 *.hit.edu.cn 与 *.ivpn.hit.edu.cn）----
  const isHitSite =
    /\.hit\.edu\.cn$/i.test(location.hostname) ||
    /(^|\.)ivpn\.hit\.edu\.cn$/i.test(location.hostname);

  // —— 悬浮入口开关（默认开启）——
  const FAB_KEY = 'fabEnabled';

  // ====== 可配置 ID 列表（兼容历史）======
  let username_ids = ["username", "user", "loginUser", "IDToken1"];
  let password_ids = ["password", "passwd", "loginPwd", "IDToken2"];
  let rememberMe_ids = ["rememberMe", "remember", "stayLogged"];
  let login_submit_ids = ["login_submit", "login", "submitButton", "btn-login", "submit"];
  let errorTip_ids = ["showErrorTip"];
  let captcha_ids = ["captcha-id", "layui-layer1", "captcha-box"];

  // 外部自定义接口
  function setCustomIds(options) {
    if (options.username_ids) username_ids = options.username_ids;
    if (options.password_ids) password_ids = options.password_ids;
    if (options.rememberMe_ids) rememberMe_ids = options.rememberMe_ids;
    if (options.login_submit_ids) login_submit_ids = options.login_submit_ids;
    if (options.errorTip_ids) errorTip_ids = options.errorTip_ids;
    if (options.captcha_ids) captcha_ids = options.captcha_ids;
  }

  // ====== 工具函数 ======
  function byIds(ids) {
    for (let i = 0; i < ids.length; i++) {
      const el = document.getElementById(ids[i]);
      if (el) return el;
    }
    return null;
  }
  function q(sel) { return document.querySelector(sel); }

  // 更鲁棒的查找：支持 id/name/autocomplete/placeholder/类型
  function findUsernameInput() {
    return byIds(username_ids)
      || q('input[autocomplete="username"]')
      || q('input[name="username"],input[name="user"],input[name="j_username"]')
      || q('input[type="text"][placeholder*="用户名"],input[type="text"][placeholder*="学号"]')
      || q('input[type="text"],input[type="email"]');
  }
  function findPasswordInput() {
    return byIds(password_ids)
      || q('input[autocomplete="current-password"],input[autocomplete="password"]')
      || q('input[name="password"],input[name="j_password"]')
      || q('input[type="password"]');
  }
  function findRememberMe() {
    return byIds(rememberMe_ids)
      || q('input[type="checkbox"][name*="remember"],input[type="checkbox"][id*="remember"]');
  }
  function findLoginButton() {
    return byIds(login_submit_ids)
      || q('button[type="submit"],input[type="submit"],button[id*="login"],button[name*="login"]');
  }

  function setInputValue(el, value) {
    if (!el) return;
    try {
      const setter =
        Object.getOwnPropertyDescriptor(el.__proto__, 'value')?.set ||
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setter?.call(el, value);
    } catch (_) { el.value = value; }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function pageLooksLoggedIn() {
    // 简单：当用户名/密码框均不存在时认为已登录或非登录页
    return !(findUsernameInput() || findPasswordInput());
  }

  // ====== “接管中”浮层 ======
  let interrupted = false;
  let pollTimer = null;

  function getOverlayCss() {
    return `
      #hit-overlay { position: fixed; inset:0; z-index:2147483647;
        background: rgba(0,0,0,.35); display:flex; align-items:center; justify-content:center; backdrop-filter: blur(2px);}
      #hit-overlay-box{ position: relative; min-width:300px; max-width:90vw; background:#fff; color:#111; border-radius:16px;
        padding:20px 24px; text-align:center; box-shadow: 0 10px 30px rgba(0,0,0,.25);
        font-family: system-ui, -apple-system, Segoe UI, Roboto, "PingFang SC","Microsoft YaHei",sans-serif;}
      #hit-overlay-close { position:absolute; top:8px; right:10px; width:28px; height:28px; line-height:28px; border:none;
        border-radius:50%; background:#f1f3f5; color:#444; cursor:pointer; font-size:18px; font-weight:700;}
      #hit-overlay-close:hover { background:#e9ecef; }
      #hit-overlay-title{ font-size:18px; font-weight:700; }
      #hit-overlay-spinner{ margin:12px auto 8px; width:22px; height:22px; border-radius:50%;
        border:3px solid #e5e7eb; border-top-color:#6366f1; animation: hitspin 1s linear infinite;}
      #hit-overlay-actions{ margin-top:12px; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;}
      .hit-btn{ border:none; padding:8px 14px; border-radius:999px; cursor:pointer; font-size:14px; box-shadow: 0 2px 6px rgba(0,0,0,.08);}
      .hit-btn-primary{ background:#eef2ff; }
      .hit-btn-primary:hover{ background:#e0e7ff; }
      @keyframes hitspin { to { transform: rotate(360deg); } }
    `;
  }

  function showOverlay(msg = '接管中…正在自动填写/登录') {
    if (document.getElementById('hit-overlay-host')) return;
    interrupted = false;

    const host = document.createElement('div');
    host.id = 'hit-overlay-host';
    const shadow = host.attachShadow({ mode: 'open' });

    const style = document.createElement('style');
    style.textContent = getOverlayCss();
    shadow.appendChild(style);

    const wrap = document.createElement('div');
    wrap.id = 'hit-overlay';
    wrap.innerHTML = `
      <div id="hit-overlay-box" role="dialog" aria-modal="true">
        <button id="hit-overlay-close" aria-label="中断并关闭">×</button>
        <div id="hit-overlay-title">接管中</div>
        <div id="hit-overlay-spinner"></div>
        <div id="hit-overlay-msg">${msg}</div>
        <div id="hit-overlay-actions">
          <button class="hit-btn hit-btn-primary" id="hit-go-portal">登录校园网</button>
        </div>
      </div>`;
    shadow.appendChild(wrap);
    document.body.appendChild(host);

    // 点击“×”关闭
    shadow.getElementById('hit-overlay-close')?.addEventListener('click', () => {
      interrupted = true; hideOverlay();
    });
    // 点击半透明背景关闭（等效中断）
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) { interrupted = true; hideOverlay(); }
    });
    // 直接跳转 WLAN
    shadow.getElementById('hit-go-portal')?.addEventListener('click', () => { location.href = URL_WLAN; });
  }

  function hideOverlay() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    document.getElementById('hit-overlay-host')?.remove();
  }

  // ====== 悬浮入口（全站显示）======
  let fabDocHandler = null;
  let fabShadowRoot = null;

  function getFabCss() {
    return `
      :host { position: fixed; right:14px; bottom:16px; z-index:2147483646;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, "PingFang SC","Microsoft YaHei",sans-serif; }
      #hit-fab-toggle{ width:48px; height:48px; border-radius:50%; border:none; cursor:pointer; background:#005375; color:#fff;
        font-weight:700; font-size:14px; box-shadow:0 8px 20px rgba(0,0,0,.25); transition: transform 0.2s; }
      #hit-fab-toggle:hover { transform: scale(1.05); }
      #hit-fab-panel{ position:absolute; right:0; bottom:60px; min-width:260px; max-width:86vw; background:#fff; color:#111;
        border-radius:14px; padding:12px; box-shadow:0 16px 40px rgba(0,0,0,.25); display:none;
        transform-origin: bottom right; animation: hit-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      #hit-fab-panel.open{ display:block; }
      @keyframes hit-pop-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      .hit-fab-title{ font-size:14px; font-weight:700; margin:2px 0 8px; }
      .hit-fab-row{ display:flex; gap:8px; flex-wrap:wrap; }
      .hit-fab-btn{ border:none; border-radius:999px; padding:8px 12px; background:#eef2ff; cursor:pointer; font-size:13px; color: #111; transition: background 0.2s; }
      .hit-fab-btn:hover{ background:#e0e7ff; }
      .hit-fab-sec{ margin-top:10px; padding-top:8px; border-top:1px dashed #e5e7eb; }
      .hit-fab-meta{ font-size:12px; color:#6b7280; }
      .hit-fab-kv{ display:flex; justify-content:space-between; gap:8px; font-size:12px; padding:4px 0; }

      @media (prefers-color-scheme: dark) {
        #hit-fab-panel { background: #1f2937; color: #f3f4f6; box-shadow: 0 16px 40px rgba(0,0,0,.5); }
        .hit-fab-btn { background: #374151; color: #e5e7eb; }
        .hit-fab-btn:hover { background: #4b5563; }
        .hit-fab-sec { border-top-color: #4b5563; }
        .hit-fab-meta { color: #9ca3af; }
      }
    `;
  }

  function mask(str) {
    if (!str) return '未设置';
    return '•'.repeat(Math.min(8, Math.max(6, Math.floor(str.length * 0.8))));
  }

  function createFab() {
    if (document.getElementById('hit-fab-host')) return;

    const host = document.createElement('div');
    host.id = 'hit-fab-host';
    const shadow = host.attachShadow({ mode: 'open' });
    fabShadowRoot = shadow;

    const style = document.createElement('style');
    style.textContent = getFabCss();
    shadow.appendChild(style);

    const container = document.createElement('div');
    container.innerHTML = `
      <button id="hit-fab-toggle" title="HIT 快捷入口">HIT</button>
      <div id="hit-fab-panel" role="dialog" aria-label="HIT 快捷入口">
        <div class="hit-fab-title">常用入口</div>
        <div class="hit-fab-row">
          <button class="hit-fab-btn" data-goto="intranet">访问HIT内网</button>
          <button class="hit-fab-btn" data-goto="extranet">访问HIT外网</button>
          <button class="hit-fab-btn" data-goto="wlan">访问HIT-WLAN</button>
        </div>
        <div class="hit-fab-sec">
          <div class="hit-fab-title">常用工具</div>
          <div class="hit-fab-row">
            <button class="hit-fab-btn" id="hit-fab-tool-webvpn">通过 WebVPN 访问</button>
          </div>
        </div>
        ${isHitSite ? `
          <div class="hit-fab-sec">
            <div class="hit-fab-title">登录助手</div>
            <div id="hit-fab-kv-box" class="hit-fab-meta"></div>
            <div class="hit-fab-row" style="margin-top:6px;">
              <button class="hit-fab-btn" id="hit-fab-set-username">设置用户名</button>
              <button class="hit-fab-btn" id="hit-fab-set-password">设置密码</button>
              <button class="hit-fab-btn" id="hit-fab-toggle-autologin">切换自动登录</button>
              <button class="hit-fab-btn" id="hit-fab-toggle-idp">切换校外授权</button>
              <button class="hit-fab-btn" id="hit-fab-trigger-login" style="display:none;">手动接管登录</button>
            </div>
          </div>
        ` : ``}
        <div class="hit-fab-sec">
          <div class="hit-fab-kv"><span class="hit-fab-meta">${isHitSite ? '当前站点：HIT' : '当前站点：非HIT'}</span><span></span></div>
        </div>
      </div>
    `;
    while (container.firstChild) shadow.appendChild(container.firstChild);
    document.body.appendChild(host);

    const panel = shadow.getElementById('hit-fab-panel');
    const toggle = shadow.getElementById('hit-fab-toggle');

    // 展开/收起
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });

    // 点击面板外任意位置收起
    fabDocHandler = (e) => {
      // If click target is not the host, it means it's outside the shadow DOM (or at least outside our component)
      if (e.target !== host) {
        panel.classList.remove('open');
      }
    };
    document.addEventListener('click', fabDocHandler, true);

    // 跳转
    panel.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => {
        const t = btn.getAttribute('data-goto');
        if (t === 'intranet') window.open(URL_INTRANET, '_self');
        else if (t === 'extranet') window.open(URL_EXTRANET, '_self');
        else if (t === 'wlan') window.open(URL_WLAN, '_self');
      });
    });

    // WebVPN 工具按钮
    shadow.getElementById('hit-fab-tool-webvpn')?.addEventListener('click', () => {
      const url = location.href;
      try {
        const urlObj = new URL(url);
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') return;

        const host = urlObj.hostname;
        if (host.endsWith('.ivpn.hit.edu.cn')) {
          alert('当前已在 WebVPN 访问模式');
          return;
        }
        const modifiedHost = host.replace(/\./g, '-');
        const finalHost = `${modifiedHost}-s.ivpn.hit.edu.cn:1080`;

        const newUrl = url.replace(host, finalHost).replace('https://', 'http://');
        window.open(newUrl, '_self');
      } catch (e) {
        console.error(e);
      }
    });

    // 登录助手（仅 HIT 域）
    if (isHitSite) {
      const kvBox = shadow.getElementById('hit-fab-kv-box');
      function renderKV() {
        const savedUsername = GM_getValue("username", "未设置");
        const savedPassword = GM_getValue("password", "");
        const autoLogin = GM_getValue("autoLogin", false);
        const idpAuth = GM_getValue("idpAutoAuth", true);
        kvBox.innerHTML = `
          <div class="hit-fab-kv"><span>用户名</span><span>${savedUsername || '未设置'}</span></div>
          <div class="hit-fab-kv"><span>密码</span><span>${savedPassword ? mask(savedPassword) : '未设置'}</span></div>
          <div class="hit-fab-kv"><span>自动登录</span><span>${autoLogin ? '已开启' : '未开启'}</span></div>
          <div class="hit-fab-kv"><span>校外授权</span><span>${idpAuth ? '已开启' : '未开启'}</span></div>
        `;
      }
      renderKV();

      shadow.getElementById('hit-fab-set-username').addEventListener('click', () => {
        const v = prompt("请输入用户名:", GM_getValue("username", ""));
        if (v !== null) { GM_setValue("username", v); renderKV(); alert("用户名已保存"); }
      });
      shadow.getElementById('hit-fab-set-password').addEventListener('click', () => {
        const v = prompt("请输入密码:", GM_getValue("password", ""));
        if (v !== null) { GM_setValue("password", v); renderKV(); alert("密码已保存"); }
      });
      shadow.getElementById('hit-fab-toggle-autologin').addEventListener('click', () => {
        const cur = !!GM_getValue("autoLogin", false);
        GM_setValue("autoLogin", !cur);
        renderKV();
        alert(!cur ? "自动登录已开启" : "自动登录已关闭");
      });
      shadow.getElementById('hit-fab-toggle-idp')?.addEventListener('click', () => {
        const cur = !!GM_getValue("idpAutoAuth", true);
        GM_setValue("idpAutoAuth", !cur);
        renderKV();
        alert(!cur ? "校外授权自动同意已开启" : "校外授权自动同意已关闭");
      });
      shadow.getElementById('hit-fab-trigger-login').addEventListener('click', () => {
        triggerAutoLoginOnce(); // 立即强制尝试一次
      });
    }

    // FAB 创建完成后，主动抬高页面上的 Float Button 组
    adjustPageFloatBtns(true);

    // 启动持续监控，检测动态加载的 Float Button
    observeNewFloatBtns();
  }

  function destroyFab() {
    if (fabDocHandler) {
      document.removeEventListener('click', fabDocHandler, true);
      fabDocHandler = null;
    }
    // 恢复页面上的 Ant Design Float Button 组
    adjustPageFloatBtns(false);
    document.getElementById('hit-fab-host')?.remove();
    fabShadowRoot = null;
  }

  // ====== 调整页面上的 Ant Design Float Button 组位置 ======
  const FLOAT_BTN_OFFSET = 60; // 抬高的像素值

  function adjustPageFloatBtns(fabVisible) {
    const selectors = [
      '.ant-float-btn-group',
      '.ant-float-btn:not(.ant-float-btn-group .ant-float-btn)'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    elements.forEach((el) => {
      const style = getComputedStyle(el);
      if (style.position !== 'fixed') return;

      const currentBottom = parseInt(style.bottom) || 0;
      const currentRight = parseInt(style.right) || 0;

      if (currentRight > 100 || (currentBottom > 200 && !el.dataset.hitOriginalBottom)) return;

      if (fabVisible) {
        if (!el.dataset.hitOriginalBottom) {
          el.dataset.hitOriginalBottom = currentBottom;
        }
        const newBottom = parseInt(el.dataset.hitOriginalBottom) + FLOAT_BTN_OFFSET;
        el.style.bottom = newBottom + 'px';
        el.style.transition = 'bottom 0.2s ease';
      } else {
        if (el.dataset.hitOriginalBottom) {
          el.style.bottom = el.dataset.hitOriginalBottom + 'px';
          delete el.dataset.hitOriginalBottom;
        }
      }
    });
  }

  // 持续监控页面上新添加的 float button，确保它们也被抬高
  let floatBtnObserver = null;
  function observeNewFloatBtns() {
    if (floatBtnObserver) return;

    floatBtnObserver = new MutationObserver((mutations) => {
      let hasNewFloatBtn = false;
      for (const mutation of mutations) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.matches?.('.ant-float-btn, .ant-float-btn-group') ||
                node.querySelector?.('.ant-float-btn, .ant-float-btn-group')) {
                hasNewFloatBtn = true;
                break;
              }
            }
          }
        }
        if (hasNewFloatBtn) break;
      }

      if (hasNewFloatBtn) {
        const fabHost = document.getElementById('hit-fab-host');
        if (fabHost) {
          adjustPageFloatBtns(true);
        }
      }
    });

    floatBtnObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ====== 系统更新弹窗自动点击 ======
  function handleSystemUpdateModal() {
    const modals = document.querySelectorAll('.ant-modal-confirm');

    for (const modal of modals) {
      const content = modal.querySelector('.ant-modal-confirm-content');
      if (content && content.textContent.includes('系统已更新，为保证使用体验，请刷新页面')) {
        const refreshBtn = modal.querySelector('.ant-modal-confirm-btns .ant-btn-primary');
        if (refreshBtn) {
          console.log('[HIT Auto Login] 检测到系统更新弹窗，自动点击刷新按钮');
          refreshBtn.click();
          return true;
        }
      }
    }
    return false;
  }

  function observeSystemUpdateModal() {
    handleSystemUpdateModal();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.addedNodes.length > 0) {
          setTimeout(() => {
            handleSystemUpdateModal();
          }, 100);
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // ====== Tampermonkey 菜单 ======
  GM_registerMenuCommand("查看当前设置", function () {
    const savedUsername = GM_getValue("username", "未设置");
    const savedPassword = GM_getValue("password", "未设置");
    const autoLogin = GM_getValue("autoLogin", false);
    const passwordDisplay = (savedPassword && savedPassword !== "未设置") ? "********" : "未设置";
    alert(
      "当前设置:\n" +
      "用户名: " + savedUsername + "\n" +
      "密码: " + passwordDisplay + "\n" +
      "自动登录: " + (autoLogin ? "已开启" : "未开启")
    );
  });
  GM_registerMenuCommand("设置用户名", function () {
    const v = prompt("请输入用户名:", GM_getValue("username", ""));
    if (v !== null) { GM_setValue("username", v); alert("用户名保存成功!"); }
  });
  GM_registerMenuCommand("设置密码", function () {
    const v = prompt("请输入密码:", GM_getValue("password", ""));
    if (v !== null) { GM_setValue("password", v); alert("密码保存成功!"); }
  });
  GM_registerMenuCommand("设置自动登录", function () {
    const on = confirm("是否开启自动登录?");
    GM_setValue("autoLogin", on);
    alert(on ? "自动登录已开启!" : "自动登录已关闭!");
  });
  GM_registerMenuCommand("登录HIT—WLAN", function () { location.href = URL_WLAN; });

  // —— 新增：开启/关闭悬浮按钮 ——
  GM_registerMenuCommand("开启悬浮按钮", function () {
    GM_setValue(FAB_KEY, true);
    createFab();
    alert("已开启悬浮按钮");
  });
  GM_registerMenuCommand("关闭悬浮按钮", function () {
    GM_setValue(FAB_KEY, false);
    destroyFab();
    alert("已关闭悬浮按钮");
  });
  GM_registerMenuCommand("开启校外授权自动同意", function () {
    GM_setValue("idpAutoAuth", true);
    alert("已开启校外授权自动同意!");
  });
  GM_registerMenuCommand("关闭校外授权自动同意", function () {
    GM_setValue("idpAutoAuth", false);
    alert("已关闭校外授权自动同意!");
  });

  // ====== 自动登录核心 ======
  function doHitAutoLogin({ force = false } = {}) {
    if (!isHitSite && !force) return false; // 非 HIT 域默认不执行

    const savedUsername = GM_getValue("username", "");
    const savedPassword = GM_getValue("password", "");
    const autoLogin = GM_getValue("autoLogin", false);

    const usernameInput = findUsernameInput();
    const passwordInput = findPasswordInput();
    const rememberMe = findRememberMe();
    const loginButton = findLoginButton();

    const errorTip = byIds(errorTip_ids);
    const captchaDlg = byIds(captcha_ids);

    if (errorTip && (errorTip.title?.includes("该账号非常用账号或用户名密码有误") ||
      errorTip.title?.includes("图形动态码错误"))) {
      GM_setValue("autoLogin", false);
      hideOverlay();
      alert("登录失败: " + errorTip.title + "。自动登录已关闭。");
      return true;
    }
    if (captchaDlg) {
      GM_setValue("autoLogin", false);
      hideOverlay();
      alert("检测到验证码弹窗，自动登录已关闭。");
      return true;
    }

    // 没检测到表单 —— 返回 false 让外层继续重试
    if (!usernameInput || !passwordInput) return false;

    showOverlay();

    if (savedUsername) setInputValue(usernameInput, savedUsername);
    if (savedPassword) setInputValue(passwordInput, savedPassword);
    if (rememberMe) rememberMe.checked = true;

    if (!autoLogin && !force) {
      // 只填不点
      setTimeout(() => { if (!interrupted) hideOverlay(); }, 150);
      return true;
    }

    if (loginButton) {
      setTimeout(() => {
        if (!interrupted) { try { loginButton.click(); } catch (_) { } }
      }, 150);
    }

    // 轮询直到表单消失（认为登录完成）
    pollTimer = setInterval(() => {
      if (interrupted) { hideOverlay(); return; }
      if (pageLooksLoggedIn()) { hideOverlay(); }
    }, 500);

    return true;
  }

  // 在 HIT 域：最多 10s，每 300ms 重试一次，适配 ids.hit.edu.cn 的异步渲染
  function autoLoginWithRetry() {
    if (!isHitSite || skipAutoLogin) return;
    const deadline = Date.now() + 10000;
    const tid = setInterval(() => {
      const done = doHitAutoLogin(); // 成功执行（找到表单）或命中错误/验证码会返回 true
      if (done || Date.now() > deadline) clearInterval(tid);
    }, 300);
  }

  function triggerAutoLoginOnce() {
    // 手动接管：强制尝试一次（即使非 HIT 域也尝试）
    doHitAutoLogin({ force: true });
  }

  // ====== IDP 自动授权功能 ======
  function handleIdpAuth() {
    if (location.hostname !== 'idp.hit.edu.cn') return;

    // 检查开关
    const enabled = !!GM_getValue("idpAutoAuth", true);
    if (!enabled) return;

    // 1. 身份认证与隐私声明页
    // 页面特征：checkbox#accept, button[name="_eventId_proceed"]
    const acceptBox = document.getElementById('accept');
    const proceedBtn = document.querySelector('button[name="_eventId_proceed"]');

    if (acceptBox && proceedBtn) {
      // 自动勾选
      if (!acceptBox.checked) {
        acceptBox.checked = true;
        acceptBox.dispatchEvent(new Event('change', { bubbles: true }));
      }
      // 提交
      setTimeout(() => {
        proceedBtn.click();
      }, 200);

      showOverlay();
      const host = document.getElementById('hit-overlay-host');
      const msg = host?.shadowRoot?.getElementById('hit-overlay-msg');
      if (msg) msg.textContent = "正在自动同意校外访问授权...";
      return;
    }

    // 2. 信息发布页 (Information Release)
    // 页面特征：input[value="_shib_idp_globalConsent"], button[name="_eventId_proceed"]
    const globalConsentRadio = document.querySelector('input[type="radio"][value="_shib_idp_globalConsent"]');

    if (globalConsentRadio && proceedBtn) {
      // 选中"不要再次提示我"
      if (!globalConsentRadio.checked) {
        globalConsentRadio.checked = true;
        globalConsentRadio.dispatchEvent(new Event('change', { bubbles: true }));
      }
      // 提交
      setTimeout(() => {
        proceedBtn.click();
      }, 200);

      showOverlay();
      const host = document.getElementById('hit-overlay-host');
      const msg = host?.shadowRoot?.getElementById('hit-overlay-msg');
      if (msg) msg.textContent = "正在自动同意信息发布...";
    }
  }

  // 启动
  function boot() {
    if (GM_getValue(FAB_KEY, true)) createFab(); // 尊重开关

    // 启动系统更新弹窗监听
    observeSystemUpdateModal();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        autoLoginWithRetry();
        handleIdpAuth();
      });
      window.addEventListener('load', () => {
        autoLoginWithRetry();
        handleIdpAuth();
      });
    } else {
      autoLoginWithRetry();
      handleIdpAuth();
      window.addEventListener('load', () => {
        autoLoginWithRetry();
        handleIdpAuth();
      });
    }
  }
  boot();

  // 暴露 API
  window.HITLoginAuto2 = { setCustomIds, triggerLogin: triggerAutoLoginOnce, showOverlay, hideOverlay, adjustFloatBtns: adjustPageFloatBtns };
})();
