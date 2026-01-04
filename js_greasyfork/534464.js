// ==UserScript==
// @name         强制本页打开链接
// @namespace    https://github.com/lesir831/UserScript
// @version      1.1
// @description  强制指定域名下的链接在当前页打开，支持动态配置生效域名
// @author       lesir
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/534464/%E5%BC%BA%E5%88%B6%E6%9C%AC%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/534464/%E5%BC%BA%E5%88%B6%E6%9C%AC%E9%A1%B5%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
(function () {
  'use strict';
  // 配置存储键名
  const STORAGE_KEY = 'enabledHosts';
  // 初始化存储
  const initStorage = () => !GM_getValue(STORAGE_KEY) && GM_setValue(STORAGE_KEY, []);
  // 获取当前域名
  const getCurrentHost = () => location.hostname.replace(/^www\./, '');
  // 主处理函数
  const processLinks = () => { // 修改现有链接
    const modifyLinks = () => {
      document.querySelectorAll('a[target="_blank"]').forEach(link => {
        link.target = '_self';
      });
    };
    // 动态内容监听
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.addedNodes.length)
          modifyLinks();
      });
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
    // 拦截点击事件
    document.addEventListener('click', e => {
      const link = e.target.closest('a[target="_blank"]');
      if (link) {
        e.preventDefault();
        location.href = link.href;
      }
    }, true);
    modifyLinks();
  };
  // 配置管理界面
  const registerMenu = () => {
    GM_registerMenuCommand('✅ 启用当前域名', () => {
      const hosts = GM_getValue(STORAGE_KEY);
      const currentHost = getCurrentHost();
      if (! hosts.includes(currentHost)) {
        GM_setValue(STORAGE_KEY, [
          ... hosts,
          currentHost
        ]);
        alert(`已添加 ${currentHost}，刷新后生效`);
      }
    });
    GM_registerMenuCommand('❌ 禁用当前域名', () => {
      const hosts = GM_getValue(STORAGE_KEY);
      const currentHost = getCurrentHost();
      if (hosts.includes(currentHost)) {
        GM_setValue(STORAGE_KEY, hosts.filter(h => h !== currentHost));
        alert(`已移除 ${currentHost}，刷新后生效`);
      }
    });
    GM_registerMenuCommand('📜 查看已启用域名', () => {
      alert('当前生效域名：\n' + GM_getValue(STORAGE_KEY).join('\n'));
    });
  };
  // 初始化执行
  initStorage();
  registerMenu();
  // 域名匹配检查
  const enabledHosts = GM_getValue(STORAGE_KEY);
  const currentHost = getCurrentHost();
  if (enabledHosts.some(host => currentHost.includes(host))) {
    processLinks();
  }
  // 实时配置监听
  GM_addValueChangeListener(STORAGE_KEY, (name, oldVal, newVal) => {
    if (!newVal.includes(getCurrentHost()))
      return;
    processLinks();
  });
})();