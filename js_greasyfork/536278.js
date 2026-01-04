// ==UserScript==
// @name         网页标题与URL复制为Markdown格式
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  捕获网页标题和URL，按自定义快捷键将其以Markdown格式复制到剪贴板
// @author       chesha1
// @license      GPL-3.0-only
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @homepageURL  https://github.com/chesha1/website-markdown-saver
// @downloadURL https://update.greasyfork.org/scripts/536278/%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E4%B8%8EURL%E5%A4%8D%E5%88%B6%E4%B8%BAMarkdown%E6%A0%BC%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/536278/%E7%BD%91%E9%A1%B5%E6%A0%87%E9%A2%98%E4%B8%8EURL%E5%A4%8D%E5%88%B6%E4%B8%BAMarkdown%E6%A0%BC%E5%BC%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 检测当前操作系统
  const isMac = /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  // 根据操作系统设置不同的默认快捷键
  const defaultSettings = {
    ctrlKey: !isMac, // macOS 下为 false，Windows 下为 true
    shiftKey: true,
    altKey: false,
    metaKey: isMac, // macOS 下为 true，Windows 下为 false
    key: 'Z',
  };

  // 从存储中读取设置，如果没有则使用默认设置
  let keySettings = GM_getValue('markdown_shortcut_settings', defaultSettings);

  // 注册菜单命令
  GM_registerMenuCommand('设置快捷键', showSettingsDialog);

  // 显示设置弹窗
  function showSettingsDialog() {
    // 创建设置弹窗
    const dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = 'white';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '8px';
    dialog.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    dialog.style.zIndex = '10000';
    dialog.style.minWidth = '300px';
    dialog.style.maxWidth = '400px';

    // 创建标题
    const title = document.createElement('h2');
    title.textContent = '设置快捷键';
    title.style.marginTop = '0';
    title.style.marginBottom = '15px';
    dialog.appendChild(title);

    // 创建说明
    const description = document.createElement('p');
    description.textContent = '请按下您想要使用的快捷键组合。';
    dialog.appendChild(description);

    // 创建当前设置显示区域
    const currentShortcut = document.createElement('div');
    currentShortcut.style.padding = '10px';
    currentShortcut.style.border = '1px solid #ddd';
    currentShortcut.style.borderRadius = '4px';
    currentShortcut.style.marginBottom = '15px';
    currentShortcut.style.textAlign = 'center';
    currentShortcut.style.fontSize = '16px';
    updateShortcutDisplay();
    dialog.appendChild(currentShortcut);

    function updateShortcutDisplay() {
      let shortcutText = [];

      // 根据操作系统显示不同的修饰键名称
      if (keySettings.metaKey) shortcutText.push(isMac ? '⌘ Command' : 'Win');
      if (keySettings.ctrlKey) shortcutText.push(isMac ? '⌃ Control' : 'Ctrl');
      if (keySettings.altKey) shortcutText.push(isMac ? '⌥ Option' : 'Alt');
      if (keySettings.shiftKey) shortcutText.push(isMac ? '⇧ Shift' : 'Shift');
      shortcutText.push(keySettings.key);

      currentShortcut.textContent = shortcutText.join(' + ');
    }

    // 创建提示
    const hint = document.createElement('p');
    hint.textContent = '请按下新的快捷键组合...';
    hint.style.marginBottom = '15px';
    dialog.appendChild(hint);

    // 创建按钮区域
    const buttonsDiv = document.createElement('div');
    buttonsDiv.style.display = 'flex';
    buttonsDiv.style.justifyContent = 'space-between';
    dialog.appendChild(buttonsDiv);

    // 创建保存按钮
    const saveButton = document.createElement('button');
    saveButton.textContent = '保存';
    saveButton.style.padding = '8px 16px';
    saveButton.style.backgroundColor = '#4CAF50';
    saveButton.style.color = 'white';
    saveButton.style.border = 'none';
    saveButton.style.borderRadius = '4px';
    saveButton.style.cursor = 'pointer';
    saveButton.disabled = true;
    buttonsDiv.appendChild(saveButton);

    // 创建取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = '取消';
    cancelButton.style.padding = '8px 16px';
    cancelButton.style.backgroundColor = '#f44336';
    cancelButton.style.color = 'white';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '4px';
    cancelButton.style.cursor = 'pointer';
    buttonsDiv.appendChild(cancelButton);

    // 创建重置按钮
    const resetButton = document.createElement('button');
    resetButton.textContent = '重置为默认';
    resetButton.style.padding = '8px 16px';
    resetButton.style.backgroundColor = '#2196F3';
    resetButton.style.color = 'white';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '4px';
    resetButton.style.cursor = 'pointer';
    buttonsDiv.appendChild(resetButton);

    // 临时存储新设置
    let newSettings = Object.assign({}, keySettings);
    let hasNewKeyPress = false;

    // 创建遮罩层
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '9999';

    // 添加遮罩和弹窗到页面
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    // 按键事件处理
    function handleKeyDown(e) {
      // 忽略单独的修饰键按下
      if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' || e.key === 'Meta') {
        return;
      }

      e.preventDefault();

      newSettings = {
        ctrlKey: e.ctrlKey,
        shiftKey: e.shiftKey,
        altKey: e.altKey,
        metaKey: e.metaKey,
        key: e.key.toUpperCase(),
      };

      // 更新显示
      let shortcutText = [];

      if (newSettings.metaKey) shortcutText.push(isMac ? '⌘ Command' : 'Win');
      if (newSettings.ctrlKey) shortcutText.push(isMac ? '⌃ Control' : 'Ctrl');
      if (newSettings.altKey) shortcutText.push(isMac ? '⌥ Option' : 'Alt');
      if (newSettings.shiftKey) shortcutText.push(isMac ? '⇧ Shift' : 'Shift');
      shortcutText.push(newSettings.key);

      currentShortcut.textContent = shortcutText.join(' + ');

      hint.textContent = '已记录新快捷键，点击保存应用设置';
      saveButton.disabled = false;
      hasNewKeyPress = true;
    }

    // 绑定事件
    document.addEventListener('keydown', handleKeyDown);

    // 保存按钮事件
    saveButton.addEventListener('click', function () {
      if (hasNewKeyPress) {
        keySettings = newSettings;
        GM_setValue('markdown_shortcut_settings', keySettings);
        closeDialog();
        showNotification('快捷键设置已保存！');
      }
    });

    // 取消按钮事件
    cancelButton.addEventListener('click', closeDialog);

    // 重置按钮事件
    resetButton.addEventListener('click', function () {
      newSettings = Object.assign({}, defaultSettings);
      keySettings = Object.assign({}, defaultSettings);
      GM_setValue('markdown_shortcut_settings', defaultSettings);
      updateShortcutDisplay();
      closeDialog();
      showNotification('快捷键已重置为默认！');
    });

    // 关闭对话框
    function closeDialog() {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.removeChild(dialog);
      document.body.removeChild(overlay);
    }
  }

  // 显示通知
  function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.left = '50%';
    notification.style.transform = 'translateX(-50%)';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.zIndex = '9999';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';

    document.body.appendChild(notification);

    setTimeout(function () {
      document.body.removeChild(notification);
    }, 1000);
  }

  // 监听键盘事件
  document.addEventListener('keydown', function (event) {
    // 检测是否按下设置的快捷键组合
    if (
      event.ctrlKey === keySettings.ctrlKey
      && event.shiftKey === keySettings.shiftKey
      && event.altKey === keySettings.altKey
      && event.metaKey === keySettings.metaKey
      && event.key.toUpperCase() === keySettings.key
    ) {
      // 获取当前页面标题
      const title = document.title;
      // 获取当前页面URL
      const url = window.location.href;

      // 组成Markdown格式的链接
      const markdownLink = `[${title}](${url})`;

      // 复制到剪贴板
      GM_setClipboard(markdownLink, 'text');

      // 显示提示信息
      showNotification('已复制Markdown格式链接到剪贴板！');

      // 阻止浏览器默认行为
      event.preventDefault();
    }
  });
})();
