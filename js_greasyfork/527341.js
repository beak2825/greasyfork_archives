// ==UserScript==
// @name         Google Site Filter with Customizable Multi-select (OR Version)
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  在 Google 搜索工具栏右侧添加多选下拉菜单，并允许用户通过油猴菜单自定义需要筛选的站点，查询条件中多个 site: 之间用 OR 连接。支持深色模式。
// @match        https://www.google.com/search*
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527341/Google%20Site%20Filter%20with%20Customizable%20Multi-select%20%28OR%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/527341/Google%20Site%20Filter%20with%20Customizable%20Multi-select%20%28OR%20Version%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 默认的站点列表（如果用户没有自定义，则使用此列表）
  const defaultSites = ["site1.com", "site2.com", "site3.com"];
  // 读取用户存储的站点列表，未存储时使用默认值
  let sites = GM_getValue("sites", defaultSites);

  // 注册油猴菜单命令，允许用户自定义站点列表
  GM_registerMenuCommand('设置站点筛选', function () {
    const currentSites = Array.isArray(sites) ? sites.join(', ') : sites;
    const input = prompt('请输入需要筛选的站点列表（以逗号分隔）：', currentSites);
    if (input !== null) {
      sites = input.split(',').map(s => s.trim()).filter(Boolean);
      GM_setValue("sites", sites);
      alert("站点筛选设置已更新，请刷新页面以应用新设置！");
    }
  });

  // 元素引用
  let customBtn, dropdown, applyBtn;

  // 检测深色模式
  function isDarkMode() {
    // 使用 prefers-color-scheme 检测深色模式
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  // 更新样式以适应深色模式
  function updateStyles() {
    const darkMode = isDarkMode();
    if (customBtn) {
      customBtn.style.background = darkMode ? '#303134' : '#fff';
      customBtn.style.color = darkMode ? '#e8eaed' : 'inherit';
      customBtn.style.borderColor = darkMode ? '#5f6368' : '#ccc';
    }
    if (dropdown) {
      dropdown.style.background = darkMode ? '#303134' : '#fff';
      dropdown.style.color = darkMode ? '#e8eaed' : 'inherit';
      dropdown.style.borderColor = darkMode ? '#5f6368' : '#ccc';
    }
    if (applyBtn) {
      applyBtn.style.background = darkMode ? '#8ab4f8' : '#4285f4';
      applyBtn.style.color = darkMode ? '#202124' : '#fff';
    }
    if (dropdown) {
      dropdown.querySelectorAll('label').forEach(label => {
        label.style.color = darkMode ? '#e8eaed' : 'inherit';
      });
    }
  }

  // 监听深色模式变化
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    updateStyles();
  });

  // 添加下拉菜单
  function addSiteFilterDropdown() {
    const toolbar = document.getElementById("hdtb");
    if (!toolbar) {
      setTimeout(addSiteFilterDropdown, 500);
      return;
    }

    // 创建过滤按钮
    customBtn = document.createElement("div");
    customBtn.innerHTML = '站点筛选 ▼';
    Object.assign(customBtn.style, {
      position: 'absolute',
      right: '10px',
      top: '50%',
      transform: 'translateY(-50%)',
      padding: '4px 8px',
      borderRadius: '4px',
      cursor: 'pointer',
      userSelect: 'none',
      fontSize: '13px',
      zIndex: '1000'
    });

    // 创建下拉容器
    dropdown = document.createElement("div");
    Object.assign(dropdown.style, {
      position: 'absolute',
      top: '110%',
      right: '0',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      padding: '10px',
      zIndex: '1001',
      display: 'none',
      minWidth: '150px',
      borderRadius: '4px'
    });

    // 动态添加站点选项
    sites.forEach(site => {
      const label = document.createElement("label");
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.marginBottom = '8px';
      const checkbox = document.createElement("input");
      checkbox.type = 'checkbox';
      checkbox.value = `site:${site}`;
      checkbox.style.marginRight = '8px';
      label.append(checkbox, document.createTextNode(site));
      dropdown.appendChild(label);
    });

    // 创建应用按钮
    applyBtn = document.createElement("button");
    applyBtn.innerHTML = '应用筛选';
    Object.assign(applyBtn.style, {
      width: '100%',
      padding: '8px',
      marginTop: '8px',
      borderRadius: '4px',
      border: 'none',
      cursor: 'pointer',
      fontSize: '13px'
    });

    // 应用筛选逻辑
    applyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const queryInput = document.querySelector('input[name="q"]');
      if (!queryInput) return;
      const selected = Array.from(dropdown.querySelectorAll('input:checked'))
        .map(c => c.value).join(' OR ');
      if (selected) {
        const newQuery = `${queryInput.value} (${selected})`;
        window.location.href = `https://www.google.com/search?q=${encodeURIComponent(newQuery)}`;
      }
    });

    dropdown.appendChild(applyBtn);
    // 阻止下拉菜单的点击事件冒泡
    dropdown.addEventListener("click", (e) => e.stopPropagation());
    customBtn.appendChild(dropdown);
    toolbar.appendChild(customBtn);

    // 初始样式设置
    updateStyles();

    // 交互逻辑
    customBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    });
    document.addEventListener('click', () => (dropdown.style.display = 'none'));
  }

  // 页面加载完成后初始化
  window.addEventListener('load', addSiteFilterDropdown);
})();