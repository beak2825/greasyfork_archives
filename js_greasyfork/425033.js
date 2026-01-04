// ==UserScript==
// @name               Change tab size on GitHub
// @name:zh-CN         修改 GitHub tab 宽度
// @namespace          https://github.com/zkqiang
// @version            1.4
// @description        Change tab width from 8 to 4 on GitHub
// @description:zh-CN  将 GitHub 代码区域的 tab 宽度从 8 修改为 4
// @author             zkqiang
// @match              *://github.com/*
// @grant              none
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/425033/Change%20tab%20size%20on%20GitHub.user.js
// @updateURL https://update.greasyfork.org/scripts/425033/Change%20tab%20size%20on%20GitHub.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function change() {
    document.querySelectorAll('table[data-tab-size]').forEach(function (node) {
      node.setAttribute('data-tab-size', '4');
    });
    document.querySelectorAll('.highlight').forEach(function (node) {
      node.style['tab-size'] = '4';
    });
  }

  change();
  document.addEventListener('pjax:end', change);
})();
