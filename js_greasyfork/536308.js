// ==UserScript==
// @name        Gamma自动选中文
// @namespace   Violentmonkey Scripts
// @match       https://gamma.app/docs/*
// @grant       none
// @version     2.0
// @license     MIT
// @author      PairZhu
// @description 2025/5/17 21:38:52
// @downloadURL https://update.greasyfork.org/scripts/536308/Gamma%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/536308/Gamma%E8%87%AA%E5%8A%A8%E9%80%89%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function () {
  const autoChooseZhCN = langBtn => {
    // 点击选择器
    langBtn.click();
    const cardId = langBtn.id.split('-')[2];
    const menuList = document.getElementById(`menu-list-${cardId}`);
    if (!menuList) {
      console.log('没有找到菜单列表');
      return;
    }
    // 查找value为"zh-cn"的button
    const buttonZh = menuList.querySelector('button[value="zh-cn"]');
    if (!buttonZh) {
      console.log('没有找到中文按钮');
      return;
    }
    console.log('找到中文按钮', buttonZh);
    // 点击中文按钮
    buttonZh.click();
  }

  const langBtnSelector = 'div.card-body > div > div.chakra-stack > div.chakra-stack > button';

  document.querySelectorAll(langBtnSelector).forEach(autoChooseZhCN);

  // 监听新增的节点
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type !== 'childList') return;
      mutation.addedNodes.forEach(node => {
        if (node.nodeType !== Node.ELEMENT_NODE) return; // 确保是元素节点
        const langBtn = node.querySelector(langBtnSelector);
        if (langBtn) {
          autoChooseZhCN(langBtn);
        }
      });
    });
  });

  // 开始观察
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
})()