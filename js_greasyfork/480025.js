// ==UserScript==
// @name        去除 gitee 水印
// @namespace   Violentmonkey Scripts
// @match       https://e.gitee.com/*
// @grant       none
// @version     1.2
// @author      bin_tenkuu
// @description 2023/11/16 16:39:37
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/480025/%E5%8E%BB%E9%99%A4%20gitee%20%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/480025/%E5%8E%BB%E9%99%A4%20gitee%20%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==


// 在此处执行需要在页面加载完成后执行的代码
!(function removeIcon(){
  // 目前版本的水印挂在页面中[id='wm']的元素上，但是这个元素无法删除，所以直接采用删除css的办法
  let a = document.getElementById('wm-style');
  if (a != null) {
    a.innerHTML = '';
  }
  // 页面有更新之后水印都会刷新一次，所以只能循环了
  setTimeout(removeIcon, 2000);
})();