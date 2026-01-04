// ==UserScript==
// @icon         https://cn.eslint.org/img/favicon.512x512.png
// @name         ESLint 自动跳转中文
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  ESLint 规则页面自动跳转到对应的 ESLint 中文页。请卸载此插件（ESLint docs/rules 自动跳转中文)，并安装更名后的插件（ESLint 自动跳转中文）
// @author       liyuhang1997
// @match        http*://eslint.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369812/ESLint%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/369812/ESLint%20%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function bar() {
  const mode1 = 'confirm';
  const mode2 = 'direct';
  const jumpMode = mode1; // 如果需要切换为不经询问直接跳转模式，修改 mode1 为 mode2 即可
  const isEslintdotorg = window.location.hostname === 'eslint.org';
  const isDocsRules = window.location.pathname.indexOf('docs/rules') === 1;
  console.log('window.location.hostname :', window.location.hostname);
  if (isEslintdotorg && isDocsRules) {
    if (jumpMode === mode1) {
      if ((window.confirm('Do you want to jump to the Chinese page, although it may not exist.'))) {
        window.location.replace(`https://cn.eslint.org${window.location.pathname}`);
      }
    } else if (jumpMode === mode2) {
      window.location.replace(`https://cn.eslint.org${window.location.pathname}`);
    } else {
      alert('"ESLint 自动跳转中文" 提示您：错误的跳转模式，请设置为 mode1 或 mode2');
    }
  }
}());