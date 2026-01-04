// ==UserScript==
// @name        【生财有术】支持通过中键打开后台标签页
// @namespace   scys-open-background-tab
// @description 让生财有术官网支持通过中键打开后台标签页，而不用频繁切换标签，影响当前页面的浏览
// @match       https://scys.com/*
// @grant       none
// @version     1.0
// @author      linying
// @license     MIT
// @icon        https://cdn01.scys.com/test/favicon.ico
// @description 2024/11/15
// @downloadURL https://update.greasyfork.org/scripts/518021/%E3%80%90%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E3%80%91%E6%94%AF%E6%8C%81%E9%80%9A%E8%BF%87%E4%B8%AD%E9%94%AE%E6%89%93%E5%BC%80%E5%90%8E%E5%8F%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/518021/%E3%80%90%E7%94%9F%E8%B4%A2%E6%9C%89%E6%9C%AF%E3%80%91%E6%94%AF%E6%8C%81%E9%80%9A%E8%BF%87%E4%B8%AD%E9%94%AE%E6%89%93%E5%BC%80%E5%90%8E%E5%8F%B0%E6%A0%87%E7%AD%BE%E9%A1%B5.meta.js
// ==/UserScript==

function isItCanClick(el) {
  return getComputedStyle(el).cursor === 'pointer';
}

window.addEventListener('mousedown', ev => {
  if (ev.button !== 1) { return }

  const el = ev.target;
  if (el && isItCanClick(el)) { ev.preventDefault(); }
});
window.addEventListener('mouseup', ev => {
  if (ev.button !== 1) { return }

  const el = ev.target;
  if (el && isItCanClick(el)) { el.click(); }
});
