// ==UserScript==
// @name         B站收藏删除拦截
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      1.0
// @description  拦截B站收藏夹的删除操作，弹窗确认后才执行
// @author       WorldlineChanger
// @match        https://*.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535593/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%88%A0%E9%99%A4%E6%8B%A6%E6%88%AA.user.js
// @updateURL https://update.greasyfork.org/scripts/535593/B%E7%AB%99%E6%94%B6%E8%97%8F%E5%88%A0%E9%99%A4%E6%8B%A6%E6%88%AA.meta.js
// ==/UserScript==


(function() {
  'use strict';

  // —— 通用确认函数 ——
  function confirmDelete() {
    return confirm('检测到“取消收藏”操作，确定要移除此视频吗？此操作不可恢复！');
  }

  // —— 1. 网络层拦截 Fetch/XHR ——

  // 保存原生方法
  const _fetch = window.fetch;
  const _open  = XMLHttpRequest.prototype.open;
  const _send  = XMLHttpRequest.prototype.send;

  // 重写 fetch
  window.fetch = function(input, init = {}) {
    const url  = typeof input === 'string' ? input : input.url;
    const body = init.body;

    // 如果是取消收藏的接口
    if (url.includes('/x/v3/fav/resource/batch-del') ||
        url.includes('/x/v3/fav/folder/del')      ||
        (url.includes('/x/v3/fav/resource/deal') && isDelIds(body, init.headers)))
    {
      if (!confirmDelete()) {
        return Promise.reject(new Error('用户取消删除'));
      }
    }

    return _fetch.apply(this, arguments);
  };

  // 重写 XHR.open/send
  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    return _open.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function(body) {
    const url = this._url || '';

    // 如果是取消收藏的接口
    if (url.includes('/x/v3/fav/resource/batch-del') ||
        url.includes('/x/v3/fav/folder/del')      ||
        (url.includes('/x/v3/fav/resource/deal') && isDelIds(body)))
    {
      if (!confirmDelete()) {
        console.log('[拦截] 取消收藏已阻止:', url);
        return;
      }
    }

    return _send.apply(this, arguments);
  };

  // 辅助：判断 body 中的 del_media_ids 是否非空（适配 FormData / urlencoded / JSON）
  function isDelIds(body, headers) {
    // FormData
    if (body instanceof FormData) {
      return !!body.get('del_media_ids');
    }
    // x-www-form-urlencoded
    if (typeof body === 'string' &&
        headers && /application\/x-www-form-urlencoded/.test(headers['Content-Type']||''))
    {
      return !!new URLSearchParams(body).get('del_media_ids');
    }
    // JSON
    if (typeof body === 'string' && body.includes('"del_media_ids"')) {
      try {
        return !!JSON.parse(body).del_media_ids;
      } catch (_) {}
    }
    return false;
  }

  // —— 2. 视频页复选框拦截 ——

  // 监测收藏弹窗出现
  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;
        // 匹配弹窗顶层容器（role="dialog"）或其子孙
        const dialogs = node.matches('div[role="dialog"]')
                      ? [node]
                      : node.querySelectorAll('div[role="dialog"]');
        dialogs.forEach(dialog => {
          if (!/收藏夹/.test(dialog.innerText)) return;
          dialog.querySelectorAll('input[type="checkbox"]').forEach(chk => {
            if (chk._tamperbound) return;
            chk._tamperbound = true;
            chk.addEventListener('click', e => {
              // 如果当前已勾选，点击将变为取消
              if (chk.checked && !confirmDelete()) {
                e.preventDefault();
                e.stopImmediatePropagation();
              }
            }, true);
          });
        });
      }
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

})();
