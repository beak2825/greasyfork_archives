// ==UserScript==
// @name         SID自动下载器
// @namespace    http://namespace.example.com
// @version      2025/03/20
// @description  自动提取 SID 并执行下载操作
// @author       gzh
// @match        *://webofscience.clarivate.cn/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530320/SID%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530320/SID%E8%87%AA%E5%8A%A8%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log('Tampermonkey 脚本已注入');
  console.log('当前页面 URL:', window.location.href);

  // 1. 定义全局变量
  let SID = null;

  // 2. 拦截 XHR 请求
  const originalXHR = window.XMLHttpRequest;
  window.XMLHttpRequest = class extends originalXHR {
    open(method, url) {
      console.log(`拦截到 XHR 请求: ${method} ${url}`);
      this._url = url;
      return super.open(method, url);
    }
    setRequestHeader(name, value) {
      console.log(`请求头: ${name} = ${value}`);
      if (name.toLowerCase().includes('sid')) {
        console.log('✅ 提取到 SID:', value);
        SID = value;
        performDownload();
      }
      return super.setRequestHeader(name, value);
    }
  };

  // 3. 安全点击函数
  const safeClick = async (selector, retries = 3) => {
    for (let i = 0; i < retries; i++) {
      const element = document.querySelector(selector);
      if (element) {
        element.click();
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    return false;
  };

  // 4. 下载逻辑
  const performDownload = async () => {
    if (!SID) {
      console.error('❌ 未找到 SID');
      return;
    }

    console.log(`[${new Date().toLocaleTimeString()}] 启动下载`);
    try {
      if (!await safeClick(".fullRecord-export-option .mat-button-wrapper")) return;
      await new Promise(resolve => setTimeout(resolve, 500));

      if (!await safeClick("#exportToEnwDesktopButton")) return;
      await new Promise(resolve => setTimeout(resolve, 500));

      if (await safeClick("#FullRecordExportToEnwBtnover")) {
        console.log('✅ 下载完成');
      }
    } catch (error) {
      console.error('下载失败:', error);
    }
  };

  window.performDownload = performDownload;
  // 5. 添加手动触发按钮
  function addControlButton() {
    const btn = document.createElement('button');
    btn.textContent = '手动下载';
    btn.style.position = 'fixed';
    btn.style.bottom = '20px';
    btn.style.right = '20px';
    btn.style.zIndex = 9999;
    btn.style.backgroundColor = '#007bff';
    btn.style.color = '#fff';
    btn.style.border = 'none';
    btn.style.padding = '10px 20px';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';
    btn.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    btn.style.fontSize = '14px';
    btn.style.fontWeight = 'bold';
    btn.onclick = () => window.performDownload();

    // 确保 body 存在后再添加按钮
    const observer = new MutationObserver((mutations, obs) => {
      const body = document.body;
      if (body) {
        body.appendChild(btn);
        obs.disconnect(); // 停止观察
      }
    });

    // 监听 DOM 变化
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });
  }

  // 立即尝试添加按钮
  addControlButton();
})();