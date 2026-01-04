// ==UserScript==
// @name         Hunter 批量打开前10个链接
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  复制 API 按钮为“打开”按钮，点击后自动打开前10个可访问链接，增强兼容性和稳定性
// @author       ChatGPT
// @match        https://hunter.qianxin.com/list?search=*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543269/Hunter%20%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E5%89%8D10%E4%B8%AA%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/543269/Hunter%20%E6%89%B9%E9%87%8F%E6%89%93%E5%BC%80%E5%89%8D10%E4%B8%AA%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 模拟真实点击事件
  function triggerMouseClick(element) {
    ['mousedown', 'mouseup', 'click'].forEach(type => {
      const evt = new MouseEvent(type, { bubbles: true, cancelable: true });
      element.dispatchEvent(evt);
    });
  }

  // 等待元素出现
  function waitForElement(selector, callback) {
    const el = document.querySelector(selector);
    if (el) return callback(el);
    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        callback(el);
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  // 插入按钮逻辑
  waitForElement('.main-title-api', (apiBtnEl) => {
    const clone = apiBtnEl.cloneNode(true);
    const btn = clone.querySelector('button');
    const spanEl = btn.querySelector('span');

    if (spanEl) spanEl.innerText = '打开';
    btn.disabled = false;
    btn.classList.remove('is-disabled');

    // 点击行为逻辑
    btn.addEventListener('click', () => {
      console.log('✅ 打开按钮被点击');

      // Step 1：尝试使用原选择器
      let openIcons = document.querySelectorAll('i.icon-fangwen.can-click');

      // Step 2：如果没有找到，则使用更模糊的容错选择器
      if (openIcons.length === 0) {
        console.warn('⚠️ 未找到 .icon-fangwen.can-click，使用 fallback 选择器');
        openIcons = Array.from(document.querySelectorAll('i[class*="icon"]')).filter(el => {
          const cls = el.className;
          return cls.includes('click') || cls.includes('open') || cls.includes('fangwen');
        });
      }

      // Step 3：判断是否找到目标元素
      if (openIcons.length === 0) {
        alert('❗未能找到任何可点击“打开”图标，页面结构可能已更新。');
        return;
      }

      console.log(`🎯 最终匹配到 ${openIcons.length} 个打开图标`);

      // Step 4：点击前10个图标
      for (let i = 0; i < Math.min(10, openIcons.length); i++) {
        console.log(`👉 正在点击第 ${i + 1} 个`);
        triggerMouseClick(openIcons[i]);
      }

      // Step 5：等待弹窗中链接加载并打开新标签页
      setTimeout(() => {
        const links = document.querySelectorAll('.q-popover__content .qax-link');
        console.log(`🔗 检测到 ${links.length} 个链接`);

        for (let i = 0; i < Math.min(10, links.length); i++) {
          const url = links[i]?.innerText?.trim();
          if (url && url.startsWith('http')) {
            console.log(`🌐 打开：${url}`);
            window.open(url, '_blank');
          } else {
            console.warn(`❌ 无效链接：第 ${i + 1} 个`, links[i]);
          }
        }
      }, 1200);
    });

    // 插入新按钮
    clone.style.marginRight = '10px';
    apiBtnEl.parentNode.insertBefore(clone, apiBtnEl);
    console.log('✅ 打开按钮已插入（增强版）');
  });
})();
