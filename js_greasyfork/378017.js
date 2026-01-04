// ==UserScript==
// @name         CSDN新建博客自动选择文章类型（原创）和博客分类（编程语言）
// @namespace    https://c332030.github.io
// @version      0.2
// @description  如题
// @author       c332030
// @match        https://mp.csdn.net/postedit*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/378017/CSDN%E6%96%B0%E5%BB%BA%E5%8D%9A%E5%AE%A2%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%96%87%E7%AB%A0%E7%B1%BB%E5%9E%8B%EF%BC%88%E5%8E%9F%E5%88%9B%EF%BC%89%E5%92%8C%E5%8D%9A%E5%AE%A2%E5%88%86%E7%B1%BB%EF%BC%88%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/378017/CSDN%E6%96%B0%E5%BB%BA%E5%8D%9A%E5%AE%A2%E8%87%AA%E5%8A%A8%E9%80%89%E6%8B%A9%E6%96%87%E7%AB%A0%E7%B1%BB%E5%9E%8B%EF%BC%88%E5%8E%9F%E5%88%9B%EF%BC%89%E5%92%8C%E5%8D%9A%E5%AE%A2%E5%88%86%E7%B1%BB%EF%BC%88%E7%BC%96%E7%A8%8B%E8%AF%AD%E8%A8%80%EF%BC%89.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.getElementById("selType").value = '1';
  document.getElementById("radChl").value = '16';

})();