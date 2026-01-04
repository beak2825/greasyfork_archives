// ==UserScript==
// @name         挂刀行情站增强脚本（适配新版）
// @namespace    logs404
// @version      2.0.0
// @description  适配新版https://www.iflow.work/，支持价格区间，自动计算挂刀比例区间
// @author       Logs404 <logs404@233c.cn>
// @match        *://www.iflow.work/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457240/%E6%8C%82%E5%88%80%E8%A1%8C%E6%83%85%E7%AB%99%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%EF%BC%88%E9%80%82%E9%85%8D%E6%96%B0%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/457240/%E6%8C%82%E5%88%80%E8%A1%8C%E6%83%85%E7%AB%99%E5%A2%9E%E5%BC%BA%E8%84%9A%E6%9C%AC%EF%BC%88%E9%80%82%E9%85%8D%E6%96%B0%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /* --------------  工具：解析价格  -------------- */
const parseRange = txt => {
  // 1. 先截出 “数字 → 数字” 这一段
  const m = txt.match(/(\d+(?:\.\d+)?)\s*¥?\s*→\s*(\d+(?:\.\d+)?)\s*￥?/);
  if (m) {
    const a = parseFloat(m[1]) * 0.85;   // 扣除 15 % 手续费
    const b = parseFloat(m[2]) * 0.85;
    return [Math.min(a, b), Math.max(a, b)].map(v => Number(v.toFixed(2)));
  }
  // 2. 没有箭头就尝试抓单个数字
  const s = txt.match(/(\d+(?:\.\d+)?)/);
  const single = s ? parseFloat(s[1]) * 0.85 : 0;
  return [Number(single.toFixed(2)), Number(single.toFixed(2))];
};

  /* --------------  计算并写入比例区间  -------------- */
  const calcAndWrite = () => {
    document.querySelectorAll('tr.ant-table-expanded-row').forEach(expRow => {
      // 只处理一次
      if (expRow.dataset.ratioDone) return;
      // 找到对应的“主行”，拿买入价
      const mainRow = expRow.previousElementSibling;
      if (!mainRow) return;
      const buyCell = mainRow.querySelector('td.ant-table-cell:nth-child(4)'); // 最低售价
      if (!buyCell) return;
      const buyRange = parseFloat(buyCell.textContent);

      // Steam 三个字段：最低寄售、最高求购、稳定求购、近期成交
      expRow.querySelectorAll('.flex-auto a, .flex-2 a').forEach(link => {
        const txt = link.textContent;
        if (!txt.includes('→')) return;           // 只有“→”才是 Steam 区间
        const steamRange = parseRange(txt);
        // 挂刀比例 = 买入 / 到账
        const ratioMin = (buyRange / steamRange[1] * 100);
        const ratioMax = (buyRange / steamRange[0] * 100);
        const ratioTxt = ratioMin === ratioMax
          ? `${ratioMin.toFixed(2)}%`
          : `${ratioMin.toFixed(2)}% ~ ${ratioMax.toFixed(2)}%`;
        // 追加到 <a> 末尾
        if (!link.querySelector('.ratio-tag')) {
          const tag = document.createElement('span');
          tag.className = 'ratio-tag';
          tag.style.cssText = 'color:#ff4d4f;margin-left:6px;font-weight:bold;';
          tag.textContent = ` 挂刀 ${ratioTxt}`;
          link.appendChild(tag);
        }
      });
      expRow.dataset.ratioDone = '1';
    });
  };

  /* --------------  监听展开动作  -------------- */
  document.addEventListener('click', e => {
    // 点击的是行或行内元素
    const row = e.target.closest('tr.ant-table-row-level-0');
    if (!row) return;
    setTimeout(calcAndWrite, 200);
      console.log('change')
  });

  /* --------------  首次加载也跑一次  -------------- */
  setTimeout(calcAndWrite, 800);
})();