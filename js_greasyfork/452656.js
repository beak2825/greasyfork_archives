// ==UserScript==
// @name         知乎直接看
// @description  移动端浏览器请先开启“桌面版”模式！【功能】① 弹登录框自动关；② 移动端响应式 CSS 样式（简单粗暴改的电脑版）
// @version      1.0.0001
// @match        *://*.zhihu.com/*
// @license      The Unlicense
// @require      https://greasyfork.org/scripts/439632-cssat/code/CSSAT.js
// @namespace https://greasyfork.org/users/871942
// @downloadURL https://update.greasyfork.org/scripts/452656/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E6%8E%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/452656/%E7%9F%A5%E4%B9%8E%E7%9B%B4%E6%8E%A5%E7%9C%8B.meta.js
// ==/UserScript==

const [$, $$] = 'querySelector querySelectorAll'.split(' ').map(q => document[q].bind(document));

(async () => {
  await CSSA.wait('.signFlowModal');

  [
    CSSA.selectFarthest($('.signFlowModal'))
  ].forEach(el => el.remove());

  [
    [document.documentElement, 'overflow margin'],
    [document.body, 'overflow position']
  ].forEach(([el, st]) => CSSA.mod.unsetStyles(el, st));

  ['width'].forEach(_ => CSSA.inspect.overflowed.forEach(CSSA.mod.unsetStyles.for[_]))

  const 相关问题 = await CSSA.wait('[aria-label=相关问题]', { timeout: Infinity })
  $('.Question-main').insertAdjacentElement('beforebegin', 相关问题)
  $('.Question-sideColumn').remove()
})()
