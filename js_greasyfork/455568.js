// ==UserScript==
// @name        知乎-关闭右侧栏 - zhihu.com
// @namespace   Violentmonkey Scripts
// @match       https://www.zhihu.com/*
// @grant       none
// @version     1.0.1
// @author      JackyChou
// @license     GPL License
// @supportURL  https://greasyfork.org/zh-CN/users/986002
// @homepageURL https://greasyfork.org/zh-CN/users/986002
// @namespace   https://greasyfork.org/zh-CN/users/986002
// @description 2022/11/28 17:36:07
// @downloadURL https://update.greasyfork.org/scripts/455568/%E7%9F%A5%E4%B9%8E-%E5%85%B3%E9%97%AD%E5%8F%B3%E4%BE%A7%E6%A0%8F%20-%20zhihucom.user.js
// @updateURL https://update.greasyfork.org/scripts/455568/%E7%9F%A5%E4%B9%8E-%E5%85%B3%E9%97%AD%E5%8F%B3%E4%BE%A7%E6%A0%8F%20-%20zhihucom.meta.js
// ==/UserScript==
(function () {
  'use strict';
  const changeNode = () => {
    let contentNode = document.getElementsByClassName('Topstory-container');
    if (!contentNode.length) contentNode = document.getElementsByClassName('Question-main');
    if (contentNode.length) {
      const leftNode = contentNode[0].children[0];
      const righNode = contentNode[0].children[1];
      righNode.style.display = 'none';
      leftNode.style.width = '100%';
      leftNode.style.maxWidth = '100%';
      const mainColumnNode = document.getElementsByClassName('Question-mainColumn')[0];
      if (mainColumnNode) mainColumnNode.style.width = '100%';
    }
  };
  changeNode();
})();