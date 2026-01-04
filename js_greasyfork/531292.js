// ==UserScript==
// @name         BiliMedalNoWait
// @name:zh-CN   B站删除粉丝勋章无需等待
// @namespace    https://space.bilibili.com/35192025
// @version      0.2.1
// @description  Remove waiting time restriction when deleting Bilibili fan medals
// @description:zh-CN  移除B站删除粉丝勋章时的10秒等待限制
// @author       boxie123
// @match        https://link.bilibili.com/p/center/index
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531292/BiliMedalNoWait.user.js
// @updateURL https://update.greasyfork.org/scripts/531292/BiliMedalNoWait.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 等待.link-popup-ctnr元素加载完成
  const waitForPopupContainers = () => {
    const containers = document.querySelectorAll('.link-popup-ctnr');
    if (containers && containers.length > 0) {
      // console.log(`找到${containers.length}个.link-popup-ctnr元素`);
      // 为每个容器初始化观察器
      containers.forEach((container, index) => {
        // console.log(`正在初始化第${index + 1}个容器的监听`);
        console.log(container);
        initObserver(container);
      });
    } else {
      // 如果元素还没加载，等待100ms后重试
      setTimeout(waitForPopupContainers, 100);
    }
  };

  // 初始化MutationObserver
  const initObserver = (container) => {
    // console.log("初始化监听");
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        // console.log("检测到DOM变化");
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // console.log("新增DOM元素：", node);
            const confirmButton = node.querySelector('.bl-button--shallow[disabled]');
            if (confirmButton) {
              console.log("找到禁用的确认按钮，正在启用...");
              confirmButton.removeAttribute('disabled');
              confirmButton.classList.remove('bl-button--shallow');
              confirmButton.classList.add('bl-button--ghost');
            }
          }
        });
      });
    });

    // 监听配置
    observer.observe(container, {
      childList: true,
      subtree: true
    });
  };

  // 监听DOM变化，处理动态加载的容器
  const observeDocument = () => {
    const documentObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const newContainers = node.querySelectorAll('.link-popup-ctnr');
            if (newContainers.length > 0) {
              // console.log(`检测到${newContainers.length}个新的.link-popup-ctnr元素`);
              newContainers.forEach((container) => initObserver(container));
            }
          }
        });
      });
    });

    // 确保body已经存在后再开始观察
    if (document.body) {
      documentObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    } else {
      // 如果body还不存在，等待DOM加载完成
      document.addEventListener('DOMContentLoaded', () => {
        documentObserver.observe(document.body, {
          childList: true,
          subtree: true
        });
      });
    }
  };

  // 确保DOM加载完成后再启动脚本
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      waitForPopupContainers();
      observeDocument();
    });
  } else {
    // 如果DOM已经加载完成，直接执行
    waitForPopupContainers();
    observeDocument();
  }
})();