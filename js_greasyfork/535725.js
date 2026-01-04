// ==UserScript==
// @name         主题切换
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  支持每个网站独立记忆主题状态的暗黑模式切换脚本，含管理面板。
// @author       石小石Orz
// @match        *://*/*
// @license MIT
// @run-at       document-body
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_deleteValues
// @grant        GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/535725/%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/535725/%E4%B8%BB%E9%A2%98%E5%88%87%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 当前网站的主机名，例如 www.example.com
  const hostname = location.hostname;

  // 当前网站的主题存储键名
  const STORAGE_KEY = `theme-${hostname}`;

  // 全局前缀，用于匹配所有网站主题设置
  const GLOBAL_KEY_PREFIX = 'theme-';

  // 获取当前网站的暗黑主题状态，默认为 false（亮色）
  let isDark = GM_getValue(STORAGE_KEY, false);

  // 注入 CSS 样式，实现暗黑模式效果和管理面板样式
  GM_addStyle(`
    html.dark-mode {
      filter: invert(0.92) hue-rotate(180deg);
      background: #111 !important;
    }
    html.dark-mode img,
    html.dark-mode video {
      filter: invert(1) hue-rotate(180deg);
    }
    #theme-manager {
      position: fixed;
      top: 10%;
      left: 50%;
      transform: translateX(-50%);
      background: #fff;
      color: #000;
      padding: 10px;
      border: 2px solid #666;
      z-index: 999999;
      width: 90%;
      max-width: 500px;
      font-size: 14px;
      border-radius: 10px;
      box-shadow: 0 0 10px #00000080;
    }
    #theme-manager table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    #theme-manager th, #theme-manager td {
      border: 1px solid #ccc;
      padding: 5px;
    }
    #theme-manager button {
      padding: 2px 5px;
      border-radius: 3px;
    }
  `);

  // 初始化页面主题（根据是否为暗黑模式）
  updateTheme();

  function updateTheme() {
    // 切换或应用 dark-mode 类
    document.documentElement.classList.toggle('dark-mode', isDark);
  }

  // 注册菜单项：切换当前网站主题
  GM_registerMenuCommand("主题切换", () => {
    isDark = !isDark; // 状态取反
    updateTheme(); // 应用新的主题状态
    GM_setValue(STORAGE_KEY, isDark); // 保存设置
    alert(`已切换为 ${isDark ? '暗黑' : '亮色'} `);
  });

  // 注册菜单项：网站主题管理
  GM_registerMenuCommand('📋 网站主题管理', async () => {
    const allKeys = await GM_listValues(); // 获取所有 GM 存储的键
    const siteThemes = [];

    // 过滤出以 theme- 开头的键，即主题设置
    for (const key of allKeys) {
      if (key.startsWith(GLOBAL_KEY_PREFIX)) {
        const host = key.slice(GLOBAL_KEY_PREFIX.length); // 提取主机名
        const val = await GM_getValue(key); // 获取主题状态
        siteThemes.push({ host, val });
      }
    }

    // 显示管理面板
    showThemeManager(siteThemes);
  });

  // 显示主题管理弹窗
  function showThemeManager(data) {
    const existing = document.getElementById('theme-manager');
    if (existing) existing.remove(); // 若已有面板先移除

    const div = document.createElement('div');
    div.id = 'theme-manager';

    // 构造弹窗 HTML 结构
    div.innerHTML = `
      <div style="display:flex;align-items:center;justify-content:space-between;">
        <span style="font-size:17px">🌐 网站主题管理</span>
        <span style="cursor:pointer;" onclick="closeThemeManager()">❌</span>
      </div>
      <table>
        <thead>
          <tr><th>网站</th><th>当前主题</th><th>操作</th></tr>
        </thead>
        <tbody>
          ${data.map(item => `
            <tr data-host="${item.host}">
              <td>${item.host}</td>
              <td style="display:flex;align-items:center;justify-content:center">
                <button onclick="toggleThemeForHost('${item.host}', this)" style="background:#409eff">
                  ${item.val ? '🌙 暗黑' : '🌞 亮色'}
                </button>
              </td>
              <td style="width:60px">
                <button onclick="deleteThemeForHost('${item.host}', this)" style="background:#f56c6c;margin-left:15px">删除</button>
              </td>
            </tr>`).join('')}
        </tbody>
      </table>
      <div style="margin-top:10px;display:flex;justify-content:flex-end;">
        <button onclick="resetAllThemes()">重置所有</button>
      </div>
    `;

    document.body.appendChild(div); // 添加到页面中
  }

  // 以下函数挂载到 unsafeWindow，以便 HTML 中能调用

  // 关闭管理弹窗
  unsafeWindow.closeThemeManager = function () {
    document.getElementById('theme-manager')?.remove();
  };

  // 切换指定网站的主题状态
  unsafeWindow.toggleThemeForHost = function (host, btn) {
    const key = `${GLOBAL_KEY_PREFIX}${host}`;
    const current = GM_getValue(key, false); // 当前状态
    const next = !current;
    GM_setValue(key, next); // 更新为新状态
    btn.textContent = next ? '🌙 暗黑' : '🌞 亮色';

    // 如果是当前站点，立即更新主题状态
    if (location.hostname === host) {
      isDark = next;
      updateTheme();
    }
  };

  // 删除指定网站的主题记录
  unsafeWindow.deleteThemeForHost = function (host, btn) {
    const key = `${GLOBAL_KEY_PREFIX}${host}`;
    GM_deleteValue(key); // 删除存储项
    btn.closest('tr')?.remove(); // 从表格中移除行

    // 若为当前站点，则还原为亮色模式
    if (location.hostname === host) {
      isDark = false;
      updateTheme();
    }
  };

  // 重置所有网站的主题设置
  unsafeWindow.resetAllThemes = function () {
    if (confirm('确认删除所有网站的主题记录吗？')) {
      const keys = GM_listValues(); // 获取所有键
      GM_deleteValues(keys); // 批量删除
      isDark = false;
      updateTheme();
      closeThemeManager();
    }
  };
})();
