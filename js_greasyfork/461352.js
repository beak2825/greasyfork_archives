// ==UserScript==
// @name         在当前标签页中打开链接
// @version       8
// @author       ChatGPT
// @description  所有链接都会在当前标签页中打开，而不是新的标签页或窗口，脚本菜单可以设置当前网站启用与禁用
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @namespace    https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/461352/%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/461352/%E5%9C%A8%E5%BD%93%E5%89%8D%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前网站URL，并根据其生成一个唯一的存储键
    var storageKey = window.location.hostname;

    // 根据存储键获取已保存的设置（如果存在）
    var isEnabled = GM_getValue(storageKey, true);

    function showAlert() {
  window.open = function(url, name, features) {
  window.location.href = url;
}
  function modifyLinks() {
    let links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
      links[i].setAttribute('target', '_self');
    }
    let base = document.getElementsByTagName('base')[0];
    if (base) {
      base.setAttribute('target', '_self');
    } else {
      let head = document.getElementsByTagName('head')[0];
      let newBase = document.createElement('base');
      newBase.setAttribute('target', '_self');
      head.appendChild(newBase);
    }
  }

  modifyLinks();

(function() {
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(addedNode => {
                    if (addedNode.nodeType === Node.ELEMENT_NODE) {
                        modifyLinks();
                    }
                });
            }
        });
    });

    const config = { childList: true, subtree: true };

    observer.observe(document.body, config);
})();
    }

    // 根据保存的设置来启用或禁用弹出提示框功能
    if (isEnabled) {
        showAlert();
    }

    // 创建油猴菜单项，在菜单中添加“启用”和“禁用”选项
    GM_registerMenuCommand(isEnabled ? '禁用强制当前标签打开' : '启用当前强制标签打开', function() {
        isEnabled = !isEnabled;
        GM_setValue(storageKey, isEnabled);
        if (isEnabled) {
            showAlert();
        }
    });
})();