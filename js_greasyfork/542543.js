// ==UserScript==
// @name          Puzzle Auto Solver
// @namespace    https://your-namespace.example
// @version      0.1
// @description  自动完成 https://bat-one.com/puzzle 上的拼图
// @author       your-name
// @match        https://bat-one.com/puzzle*
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542543/Puzzle%20Auto%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/542543/Puzzle%20Auto%20Solver.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // 简单延迟加载
  await new Promise(resolve => setTimeout(resolve, 1500));

  const tiles = document.querySelectorAll('.tile, .puzzle-tile');
  if (!tiles.length) {
    console.warn('❌ 未找到拼图块元素，请检查类名');
    return;
  }

  for (let i = 0; i < tiles.length; i++) {
    tiles[i].click();
    await new Promise(r => setTimeout(r, 100));
  }

  console.log("✅ 拼图完成");

})();