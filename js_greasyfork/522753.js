// ==UserScript==
// @name         GreasyFork Script Diff Tool
// @name:zh-CN   GreasyFork 脚本更新对比工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description        A tool to compare script versions on GreasyFork's update page
// @description:zh-CN  在 GreasyFork 脚本更新页面显示新旧版本差异
// @author       ommo
// @match        https://greasyfork.org/*/scripts/*/versions/new
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsdiff/5.2.0/diff.min.js
// @require      https://unpkg.com/diff2html/bundles/js/diff2html-ui.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522753/GreasyFork%20Script%20Diff%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/522753/GreasyFork%20Script%20Diff%20Tool.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 添加全局样式
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdn.jsdelivr.net/npm/diff2html/bundles/css/diff2html.min.css';
  document.head.appendChild(link);
  GM_addStyle(`
    .diff-container {
      margin-top: 20px;
      max-height: 500px;
      overflow-y: auto;
      position: relative;
    }
  `);

  const storage = {};

  // 获取当前最新版代码
  function fetchLatestCode(scriptId, callback) {
    if (storage[scriptId]) callback(storage[scriptId]);
    const url = `https://greasyfork.org/scripts/${scriptId}/code`;
    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function (response) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.responseText, 'text/html');
        const codeContainer = doc.querySelector('.code-container');
        if (!codeContainer) {
          console.error('Code container not found');
          alert('Failed to fetch latest code. Page structure may have changed.');
          return;
        }
        const code = codeContainer.textContent.trim();
        storage[scriptId] = code;
        callback(code);
      },
      onerror: function (error) {
        console.error('Failed to fetch latest code:', error);
        alert('Failed to fetch latest code. Check script ID or network connection.');
      }
    });
  }

  // 添加对比按钮
  function addCompareButton(scriptId) {
    const textarea = document.querySelector('textarea');
    const button = document.createElement('button');
    button.textContent = 'Diff';
    button.className = 'diff-button';
    button.style.marginTop = '10px';
    const diffContainer = document.createElement('div');
    diffContainer.className = 'diff-container';

    button.addEventListener('click', function (event) {
      event.preventDefault();

      button.disabled = true;
      button.textContent = 'Loading...';

      const newCode = textarea.value.trim();
      if (!newCode) {
        alert('Please enter new code.');
        button.disabled = false;
        button.textContent = 'Diff';
        return;
      }

      fetchLatestCode(scriptId, function (latestCode) {
        const fileName = `${document.querySelector('header > h2').textContent}.js`;
        const diffString = Diff.createPatch(fileName, latestCode, newCode);
        const targetElement = diffContainer;
        const configuration = { drawFileList: false, fileListToggle: false };
        const diff2htmlUi = new Diff2HtmlUI(targetElement, diffString, configuration);
        diff2htmlUi.draw();

        button.disabled = false;
        button.textContent = 'Diff';
      });
    });

    textarea.parentNode.append(button, diffContainer);
  }

  // 主逻辑
  function main() {
    const scriptId = window.location.pathname.match(/\/scripts\/(\d+)\/versions\/new/)[1];
    if (!scriptId) {
      console.error('Script ID not found');
      return;
    }
    addCompareButton(scriptId);
  }

  // 启动
  main();
})();