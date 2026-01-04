// ==UserScript==
// @name         动漫花园自定义屏蔽字幕组
// @author       ChatGPT
// @version      1.1
// @description  在脚本菜单中添加自定义屏蔽字幕组功能
// @match        https://share.dmhy.org/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at      document-end
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/480177/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B1%8F%E8%94%BD%E5%AD%97%E5%B9%95%E7%BB%84.user.js
// @updateURL https://update.greasyfork.org/scripts/480177/%E5%8A%A8%E6%BC%AB%E8%8A%B1%E5%9B%AD%E8%87%AA%E5%AE%9A%E4%B9%89%E5%B1%8F%E8%94%BD%E5%AD%97%E5%B9%95%E7%BB%84.meta.js
// ==/UserScript==

(function() {
  // 添加菜单函数
  function addMenu() {
    var keyword = prompt("请输入要屏蔽的关键词，多个关键词用英文逗号分隔", GM_getValue('blockedKeywords', ''));
    if (keyword !== null) {
      GM_setValue('blockedKeywords', keyword);
      blockElements(keyword);
    }
  }

  // 屏蔽包含关键词的元素
  function blockElements(keywordString) {
    var keywords = keywordString.split(',');
    var elements = document.querySelectorAll('tr.odd, tr.even');

    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      var shouldHide = false;

      for (var j = 0; j < keywords.length; j++) {
        if (element.textContent.includes(keywords[j].trim())) {
          shouldHide = true;
          break;
        }
      }

      if (shouldHide) {
        element.style.display = 'none';
      } else {
        element.style.display = '';
      }
    }
  }

  // 添加菜单
  GM_registerMenuCommand("自定义屏蔽关键词", addMenu);

  // 页面加载时隐藏包含关键词的元素
  var blockedKeywords = GM_getValue('blockedKeywords', '');
  if (blockedKeywords !== '') {
    blockElements(blockedKeywords);
  }
})();

