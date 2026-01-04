// ==UserScript==
// @name         MG-Linkcollector
// @namespace    http://tampermonkey.net/
// @version      2.1.5
// @description  提取页面中的磁力\Ed2k链接并收集到文本框中，支持跨网页收集，文本框内容实时更新。快捷键：监测当前页面（Alt+Q），删除当前链接（Alt+W），清除全部（Alt+A），一键复制（Alt+S），展开/关闭（无快捷键）。新增功能：自动获取新标签页的链接，聚焦页面超过2秒后再次自动获取。
// @author       黄萌萌可爱多
// @match        *://*/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/526394/MG-Linkcollector.user.js
// @updateURL https://update.greasyfork.org/scripts/526394/MG-Linkcollector.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 提取磁力链接和Ed2k链接
  function extractMagnetLinks() {
    var magnetLinks = [];
    var linkElements = document.getElementsByTagName('a');
    for (var i = 0; i < linkElements.length; i++) {
        var linkElement = linkElements[i];
        var link = linkElement.href;
        if (link.startsWith('magnet:') || link.startsWith('ed2k:')) {
            magnetLinks.push(link);
        }
    }
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    while (walker.nextNode()) {
        var node = walker.currentNode;
        var text = node.textContent.trim();
        if (text.startsWith('magnet:') || text.startsWith('ed2k:')) {
            magnetLinks.push(text);
        }
    }
    return magnetLinks;
  }

  // 从localStorage中获取已保存的磁力链接
  function getSavedMagnetLinks() {
    var savedLinks = localStorage.getItem('magnetLinks');
    return savedLinks ? JSON.parse(savedLinks) : [];
  }

  // 将新的磁力链接保存到localStorage
  function saveMagnetLinks(magnetLinks) {
    var savedLinks = getSavedMagnetLinks();
    var combinedLinks = Array.from(new Set([...savedLinks, ...magnetLinks]));
    try {
      localStorage.setItem('magnetLinks', JSON.stringify(combinedLinks));
    } catch (e) {
      if (e instanceof DOMException && e.code === 22) {
        console.warn('localStorage空间不足，正在清理旧数据...');
        var maxLinks = 100;
        if (combinedLinks.length > maxLinks) {
          combinedLinks = combinedLinks.slice(-maxLinks);
        }
        localStorage.setItem('magnetLinks', JSON.stringify(combinedLinks));
        console.log('清理完成，现在可以继续保存新数据。');
      } else {
        throw e;
      }
    }
  }

  // 删除当前页面的磁力链接
  function deleteCurrentPageLinks(currentLinks) {
    var savedLinks = getSavedMagnetLinks();
    var updatedLinks = savedLinks.filter(link => !currentLinks.includes(link));
    localStorage.setItem('magnetLinks', JSON.stringify(updatedLinks));
  }

  // 清除所有磁力链接
  function clearAllLinks() {
    localStorage.removeItem('magnetLinks');
    alert('已清除全部链接'); // 添加提醒
  }

  // 更新文本框内容
  function updateTextBox() {
    var textBox = document.getElementById('magnetLinksBox');
    var savedLinks = getSavedMagnetLinks();
    textBox.value = savedLinks.map((link, index) => `${index + 1}. ${link}`).join('\n');
  }

  // 创建文本框和悬浮按钮
  function createTextBoxAndButtons() {
    var textBox = document.createElement('textarea');
    textBox.id = 'magnetLinksBox';
    textBox.style.position = 'fixed';
    textBox.style.bottom = '200px';
    textBox.style.right = '10px';
    textBox.style.width = '300px';
    textBox.style.height = '200px';
    textBox.style.zIndex = '9999';
    textBox.placeholder = '提取的磁力链接将显示在这里...';
    textBox.readOnly = true; // 设置为只读
    document.body.appendChild(textBox);

    var deleteCurrentButton = document.createElement('button');
    deleteCurrentButton.id = 'deleteCurrentLinksButton';
    deleteCurrentButton.title = '快捷键: Alt+W';
    deleteCurrentButton.style.position = 'fixed';
    deleteCurrentButton.style.bottom = '60px';
    deleteCurrentButton.style.right = '10px';
    deleteCurrentButton.style.width = '70px'; // 修改: 100px -> 70px
    deleteCurrentButton.style.height = '28px'; // 修改: 40px -> 28px
    deleteCurrentButton.style.zIndex = '9999';
    deleteCurrentButton.style.background = '#FF9800';
    deleteCurrentButton.style.color = 'white';
    deleteCurrentButton.style.border = 'none';
    deleteCurrentButton.style.borderRadius = '5px';
    deleteCurrentButton.style.cursor = 'pointer';
    deleteCurrentButton.style.fontSize = '10px'; // 修改: 14px -> 10px
    deleteCurrentButton.textContent = '删当前链接';
    deleteCurrentButton.addEventListener('click', function() {
      var currentLinks = extractMagnetLinks();
      deleteCurrentPageLinks(currentLinks);
      updateTextBox();
    });
    document.body.appendChild(deleteCurrentButton);

    var clearAllButton = document.createElement('button');
    clearAllButton.id = 'clearAllLinksButton';
    clearAllButton.title = '快捷键: Alt+A';
    clearAllButton.style.position = 'fixed';
    clearAllButton.style.bottom = '160px';
    clearAllButton.style.right = '10px';
    clearAllButton.style.width = '70px'; // 修改: 100px -> 70px
    clearAllButton.style.height = '28px'; // 修改: 40px -> 28px
    clearAllButton.style.zIndex = '9999';
    clearAllButton.style.background = '#F44336';
    clearAllButton.style.color = 'white';
    clearAllButton.style.border = 'none';
    clearAllButton.style.borderRadius = '5px';
    clearAllButton.style.cursor = 'pointer';
    clearAllButton.style.fontSize = '10px'; // 修改: 14px -> 10px
    clearAllButton.textContent = '清除全部';
    clearAllButton.addEventListener('click', function() {
      clearAllLinks();
      updateTextBox();
    });
    document.body.appendChild(clearAllButton);

    var copyButton = document.createElement('button');
    copyButton.id = 'copyLinksButton';
    copyButton.title = '快捷键: Alt+S';
    copyButton.style.position = 'fixed';
    copyButton.style.bottom = '110px';
    copyButton.style.right = '10px';
    copyButton.style.width = '70px'; // 修改: 100px -> 70px
    copyButton.style.height = '28px'; // 修改: 40px -> 28px
    copyButton.style.zIndex = '9999';
    copyButton.style.background = '#2196F3';
    copyButton.style.color = 'white';
    copyButton.style.border = 'none';
    copyButton.style.borderRadius = '5px';
    copyButton.style.cursor = 'pointer';
    copyButton.style.fontSize = '10px'; // 修改: 14px -> 10px
    copyButton.textContent = '一键复制';
    copyButton.addEventListener('click', function() {
      var savedLinks = getSavedMagnetLinks();
      GM_setClipboard(savedLinks.join('\n'), 'text');
      alert('已复制所有链接到剪贴板！');
    });
    document.body.appendChild(copyButton);

    var toggleButton = document.createElement('button');
    toggleButton.id = 'toggleLinksBoxButton';
    toggleButton.title = '展开/关闭';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '10px';
    toggleButton.style.right = '10px';
    toggleButton.style.width = '70px'; // 修改: 100px -> 70px
    toggleButton.style.height = '28px'; // 修改: 40px -> 28px
    toggleButton.style.zIndex = '9999';
    toggleButton.style.background = '#4CAF50';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.style.fontSize = '10px'; // 修改: 14px -> 10px
    toggleButton.textContent = '展开/关闭';
    toggleButton.addEventListener('click', function() {
        var textBox = document.getElementById('magnetLinksBox');
        if (textBox.style.display === 'none') {
            textBox.style.display = 'block';
            GM_setValue('textBoxVisible', true);
        } else {
            textBox.style.display = 'none';
            GM_setValue('textBoxVisible', false);
        }
    });
    document.body.appendChild(toggleButton);
  }

  // 绑定快捷键
  function bindHotkeys() {
    document.addEventListener('keydown', function(event) {
      if (event.altKey) {
        switch (event.key.toLowerCase()) {
          case 'w':
            document.getElementById('deleteCurrentLinksButton').click();
            break;
          case 'a':
            document.getElementById('clearAllLinksButton').click();
            break;
          case 's':
            document.getElementById('copyLinksButton').click();
            break;
        }
      }
    });
  }

  // 监听localStorage变化并更新文本框
  function setupStorageListener() {
    window.addEventListener('storage', function(event) {
      if (event.key === 'magnetLinks') {
        updateTextBox();
      }
    });
  }

  // 自动获取链接的逻辑
  function autoExtractLinks() {
    var newMagnetLinks = extractMagnetLinks();
    saveMagnetLinks(newMagnetLinks);
    updateTextBox();
  }

  // 监听窗口焦点变化
  function listenFocusEvents() {
    let lastFocusTime = Date.now();
    let isFocused = false;

    window.addEventListener('focus', function() {
      isFocused = true;
      let currentTime = Date.now();
      if (currentTime - lastFocusTime > 2000) { // 超过2秒
        autoExtractLinks();
      }
      lastFocusTime = currentTime;
    });

    window.addEventListener('blur', function() {
      isFocused = false;
    });
  }

  // 检查当前页面是否在允许的网站列表中
  function isAllowedSite() {
    var allowAllSites = GM_getValue('allowAllSites', true);
    if (allowAllSites) {
        return true;
    }
    var allowedSites = GM_getValue('allowedSites', '').split('\n').map(site => site.trim()).filter(site => site !== '');
    var currentUrl = window.location.href;
    for (var site of allowedSites) {
        if (currentUrl.startsWith(site)) {
            return true;
        }
    }
    return false;
  }

  // 油猴面板设置
  function setupSettings() {
    GM_registerMenuCommand('设置', function() {
      var hideButtons = GM_getValue('hideButtons', false);
      var version = GM_info.script.version;
      var author = GM_info.script.author;
      var allowedSites = GM_getValue('allowedSites', '');
      var allowAllSites = GM_getValue('allowAllSites', true);

      var html = `
        <div style="padding: 30px; background-color: white; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 2px 30px rgba(0, 0, 0, 0.1); width: 400px; height: 300px; font-size: 18px;">
          <h2>设置</h2>
          <p>作者: ${author}</p>
          <p>版本: ${version}</p>
          <label style="display: flex; align-items: center;">
            <span style="margin-right: 10px;">隐藏悬浮按钮</span>
            <label class="switch">
              <input type="checkbox" id="hideButtonsCheckbox" ${hideButtons ? 'checked' : ''}>
              <span class="slider round"></span>
            </label>
          </label>
          <br>
          <label style="display: flex; align-items: center;">
            <span style="margin-right: 10px;">允许适用脚本于任何网站</span>
            <label class="switch">
              <input type="checkbox" id="allowAllSitesCheckbox" ${allowAllSites ? 'checked' : ''}>
              <span class="slider round"></span>
            </label>
          </label>
          <br>
          <label style="display: flex; align-items: center;">
            <span style="margin-right: 10px;">仅允许用该脚本的网站（每行一个URL）</span>
            <textarea id="allowedSitesTextarea" style="width: 300px; height: 100px;">${allowedSites}</textarea>
          </label>
          <br>
          <button id="saveSettingsButton" style="margin-top: 20px; padding: 10px 20px; background-color: #4CAF50; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">保存</button>
          <button id="closeSettingsButton" style="margin-top: 10px; padding: 10px 20px; background-color: #F44336; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">关闭</button>
        </div>
      `;
      var div = document.createElement('div');
      div.innerHTML = html;
      div.style.position = 'fixed';
      div.style.top = '50%';
      div.style.left = '50%';
      div.style.transform = 'translate(-50%, -50%)';
      div.style.zIndex = '10000';
      document.body.appendChild(div);

      document.getElementById('saveSettingsButton').addEventListener('click', function() {
        var hideButtonsCheckbox = document.getElementById('hideButtonsCheckbox');
        GM_setValue('hideButtons', hideButtonsCheckbox.checked);

        var allowAllSitesCheckbox = document.getElementById('allowAllSitesCheckbox');
        GM_setValue('allowAllSites', allowAllSitesCheckbox.checked);

        var allowedSitesTextarea = document.getElementById('allowedSitesTextarea');
        GM_setValue('allowedSites', allowedSitesTextarea.value);

        document.body.removeChild(div);

        // 根据设置显示或隐藏悬浮按钮和文本框
        if (hideButtonsCheckbox.checked) {
          document.getElementById('magnetLinksBox').style.display = 'none';
          document.getElementById('toggleLinksBoxButton').style.display = 'none';
          document.getElementById('deleteCurrentLinksButton').style.display = 'none';
          document.getElementById('copyLinksButton').style.display = 'none';
          document.getElementById('clearAllLinksButton').style.display = 'none';
          document.getElementById('monitorCurrentLinksButton').style.display = 'none';
        } else {
          document.getElementById('magnetLinksBox').style.display = 'block';
          document.getElementById('toggleLinksBoxButton').style.display = 'block';
          document.getElementById('deleteCurrentLinksButton').style.display = 'block';
          document.getElementById('copyLinksButton').style.display = 'block';
          document.getElementById('clearAllLinksButton').style.display = 'block';
          document.getElementById('monitorCurrentLinksButton').style.display = 'block';
        }
      });

      document.getElementById('closeSettingsButton').addEventListener('click', function() {
        document.body.removeChild(div);
      });
    });
  }

  // 主逻辑
  if (isAllowedSite()) {
    createTextBoxAndButtons();
    bindHotkeys();
    setupStorageListener();
    listenFocusEvents();
    setupSettings(); // 恢复设置菜单
    autoExtractLinks(); // 初始加载时自动获取一次

    // 根据设置显示或隐藏悬浮按钮和文本框
    if (GM_getValue('hideButtons', false)) {
        document.getElementById('magnetLinksBox').style.display = 'none';
        document.getElementById('toggleLinksBoxButton').style.display = 'none';
        document.getElementById('deleteCurrentLinksButton').style.display = 'none';
        document.getElementById('copyLinksButton').style.display = 'none';
        document.getElementById('clearAllLinksButton').style.display = 'none';
        document.getElementById('monitorCurrentLinksButton').style.display = 'none';
    } else {
        // 根据localStorage中的状态设置文本框的显示状态
        var textBox = document.getElementById('magnetLinksBox');
        var textBoxVisible = GM_getValue('textBoxVisible', true); // 默认展开
        textBox.style.display = textBoxVisible ? 'block' : 'none';
    }
  } else {
    console.log('当前网站不在允许的网站列表中，脚本不执行。');
  }
})();
