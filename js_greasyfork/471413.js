// ==UserScript==
// @name         Fxxk reset password
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Fxxk reset password !
// @author       zeping Tu
// @match        *://dsplat.wx.gcihotel.net/*
// @match        *://i.ihotel.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/471413/Fxxk%20reset%20password.user.js
// @updateURL https://update.greasyfork.org/scripts/471413/Fxxk%20reset%20password.meta.js
// ==/UserScript==
(function () {
  'use strict';
  function removeResetPwdModal() {
    let pwd_change = document.getElementsByClassName("pwd_change");
    if (pwd_change.length == 1 && pwd_change[0].innerText.indexOf("请修改密码") > -1){
      const modal = pwd_change[0].parentNode.parentNode.parentNode.parentNode.parentNode;
      modal.remove();
    }
  }
  setTimeout(() => {
    removeResetPwdModal()
  }, 1000);
  const targetNode = document.body;

  // 创建一个 MutationObserver 实例
  const observer = new MutationObserver(function (mutationsList, observer) {
    // 遍历所有触发的变动
    for (let mutation of mutationsList) {
      // 检查是否有新增的子节点
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // 遍历新增的子节点
        mutation.addedNodes.forEach(function (addedNode) {
          // 在这里执行你想要的操作
          removeResetPwdModal();
        });
      }
    }
  });

  // 配置需要观察的类型和选项
  const config = { childList: true, subtree: true };

  // 开始观察目标元素
  observer.observe(targetNode, config);
})();