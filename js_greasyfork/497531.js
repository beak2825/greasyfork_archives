// ==UserScript==
// @name          按下alt时屏蔽点击
// @description   firefox用
// @version       1.2
// @match         *://*/*
// @namespace https://greasyfork.org/users/12375
// @downloadURL https://update.greasyfork.org/scripts/497531/%E6%8C%89%E4%B8%8Balt%E6%97%B6%E5%B1%8F%E8%94%BD%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/497531/%E6%8C%89%E4%B8%8Balt%E6%97%B6%E5%B1%8F%E8%94%BD%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

let alt = false;

document.addEventListener('keydown', e => alt = e.key === 'Alt');
document.addEventListener('keyup', () => alt = false);

// 新增窗口失焦监听
window.addEventListener('blur', () => alt = false);

document.addEventListener('click', e => alt && (e.preventDefault(), e.stopPropagation()), true);
