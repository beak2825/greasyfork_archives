// ==UserScript==
// @name         飞书文档自动切换阅读模式
// @namespace    http://tampermonkey.net/
// @version      1.1
// @license      GPL License
// @description  feishu switch to read mode
// @author       buwenyuwu
// @match        *://*.feishu.cn/*
// @grant        GM_log
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/542277/%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/542277/%E9%A3%9E%E4%B9%A6%E6%96%87%E6%A1%A3%E8%87%AA%E5%8A%A8%E5%88%87%E6%8D%A2%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==
(function () {
  'use strict';

  console.log('switch feishu doc to read mode start..');

  // author not switch
  function isCurrentUserAuthor() {
    try {

      const userId = unsafeWindow?.User?.id;

      if (!userId) {
        console.log('failed to get userId.')
        return false;
      }

      const ownerId = unsafeWindow?.teaMap?.ownerId;

      if (!ownerId) {
        console.log('failed to get ownerId.')
        return false;
      }

      const isCreator = userId === ownerId;
      console.log(`👤 current user: ${userId}, doc creator: ${ownerId}, isAuthor: ${isCreator}`);
      return isCreator;

    } catch (e) {
      console.warn('❌ failed to check author:', e);
    }
    return false;
  }

  async function switchToReadMode(retry = 3) {
    console.log('🔁 try switchToReadMode...');

    if (isCurrentUserAuthor()) {
      console.log('⏭️ current user is the doc author, skip switching');
      return;
    }

    try {

      const switchBtn = Array.from(document.querySelectorAll('[data-selector="docs-mode-switch"]'))
      .find(btn => btn.classList.contains('ud__button--filled'));


      if (!switchBtn) {
          console.warn('⚠️ no clickable mode-switch button found');
          console.log(document.querySelectorAll('[data-selector="docs-mode-switch"]'))
          return;
      }

      const text = switchBtn.querySelector('.content_text')?.innerText.trim();
      if (text === '阅读') {
          console.log('✅ already in read mode');
          return;
      }

      switchBtn.click();

      setTimeout(() => {
        const menuItems = [...document.querySelectorAll('li.docs_mode_switch_menu_item')];
        console.log(menuItems)

        for (const item of menuItems) {
          const labelSpan = item.querySelector('.item_text span');
          if (labelSpan && labelSpan.innerText.trim() === '阅读') {
            item.click();
            console.log('✅ switched to read mode');
            return;
          }
        }
        console.warn('⚠️ read mode item not found');
      }, 1000);

    } catch (e) {
      console.warn('❌ switchToReadMode error:', e);
      if (retry > 0) {
        console.log(`🔄 retry left: ${retry}`);
        setTimeout(() => switchToReadMode(retry - 1), 1000);
      }
    }
  }

  /** 监听 URL 变化（pushState / replaceState / popstate） */
  function observePathChange(onChange) {
    let lastPath = location.pathname;

    const handleChange = () => {
      const currentPath = location.pathname;
      if (currentPath !== lastPath) {
        console.log('📌 path changed:', currentPath);
        lastPath = currentPath;
        onChange(currentPath);
      } else {
        console.log('🔁 url changed but path same, skip');
      }
    };

    const wrap = (type) => {
      const orig = history[type];
      return function () {
        const res = orig.apply(this, arguments);
        handleChange();
        return res;
      };
    };

    history.pushState = wrap('pushState');
    history.replaceState = wrap('replaceState');
    window.addEventListener('popstate', handleChange);

  }

  // 首次加载触发
  window.addEventListener('load', (url) => {
    console.log('📌 load:'+ url);
    setTimeout(switchToReadMode, 2000);
  });

  // URL变化触发
  observePathChange((url) => {
      console.log('📌 observe path change:', url);
      setTimeout(switchToReadMode, 1500);
  });
})();
