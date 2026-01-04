// ==UserScript==
// @name         google-search-helper
// @namespace    github.com/leychan
// @version      0.7
// @description  在新标签页打开google搜索结果
// @author       leychan
// @match        https://www.google.com.hk/search*
// @match        https://www.google.com/search*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @run-at document-end
// @grant        none
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/460157/google-search-helper.user.js
// @updateURL https://update.greasyfork.org/scripts/460157/google-search-helper.meta.js
// ==/UserScript==

(function() {
  'use strict';

  let searchResult = document.getElementById('search')

  let allSearchResultATag = searchResult.getElementsByTagName('a')
  for (let i = 0 ;i < allSearchResultATag.length; i++) {
      allSearchResultATag[i].setAttribute('target', '_blank')
  }

  // 创建一个新的MutationObserver对象，用来监听DOM的变化, 适配另一部分的搜索结果项
  const observer = new MutationObserver((mutations, obs) => {
      for (let mutation of mutations) {
          // 遍历所有被添加的节点
          for (let node of mutation.addedNodes) {
              if (node.nodeType === 1 && node.tagName.toLowerCase() === 'div') {
                  let aTagList = node.getElementsByTagName('a')
                  if (aTagList != null) {
                      for (let i = 0 ;i < aTagList.length; i++) {
                          aTagList[i].setAttribute('target', '_blank')
                      }
                  }
              }
          }
      }
  });

  // 配置observer的观察选项
  const config = {
      childList: true, // 监控目标节点的子节点的变化，如被添加或者删除
      subtree: true // 监控目标节点及其所有后代节点, 必须打开
  };

  // 选择要监控的目标节点
  const targetNode = document.getElementById('center_col'); //监控搜索结果内容

  // 对目标节点执行监控
  observer.observe(targetNode, config);


})();