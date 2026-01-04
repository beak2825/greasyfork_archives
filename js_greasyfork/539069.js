// ==UserScript==
// @name         文本选中计算浮窗（支持公式）
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  选中网页上的数字文字后，根据设置的公式实时计算并显示浮窗结果
// @author       v:cara0672
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @require      https://cdn.jsdelivr.net/npm/expr-eval@2.0.2/dist/bundle.min.js
// @downloadURL https://update.greasyfork.org/scripts/539069/%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E8%AE%A1%E7%AE%97%E6%B5%AE%E7%AA%97%EF%BC%88%E6%94%AF%E6%8C%81%E5%85%AC%E5%BC%8F%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/539069/%E6%96%87%E6%9C%AC%E9%80%89%E4%B8%AD%E8%AE%A1%E7%AE%97%E6%B5%AE%E7%AA%97%EF%BC%88%E6%94%AF%E6%8C%81%E5%85%AC%E5%BC%8F%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 创建浮窗
  const tooltip = document.createElement('div');
  tooltip.style.position = 'absolute';
  tooltip.style.background = 'rgba(0, 0, 0, 0.85)';
  tooltip.style.color = '#fff';
  tooltip.style.padding = '6px 10px';
  tooltip.style.borderRadius = '6px';
  tooltip.style.fontSize = '14px';
  tooltip.style.zIndex = '999999';
  tooltip.style.display = 'none';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.whiteSpace = 'pre-line';
  document.body.appendChild(tooltip);

  // 设置菜单
  GM_registerMenuCommand('设置计算公式', async () => {
    const current = await GM_getValue('calcFormula', 'x * 2');
    const input = prompt('请输入计算公式（使用 x 表示选中的数字）', current);
    if (input !== null) {
      await GM_setValue('calcFormula', input);
      alert('公式已保存为：' + input);
    }
  });

  // 鼠标按下时：隐藏浮窗并清空选区
  document.addEventListener('mousedown', () => {
    tooltip.style.display = 'none';
    const sel = window.getSelection();
    if (sel && sel.removeAllRanges) sel.removeAllRanges();
  });

  // 鼠标抬起后：延迟处理选中内容
  document.addEventListener('mouseup', async (e) => {
    setTimeout(async () => {
      const selected = window.getSelection().toString().trim();
      if (!selected) return;

      const x = parseFloat(selected);
      if (isNaN(x)) return;

      const formula = await GM_getValue('calcFormula', 'x * 2');

      try {
        const expr = window.exprEval.Parser.parse(formula);
        const result = expr.evaluate({ x });
        const formatted = Number(result).toFixed(6).replace(/\.?0+$/, '');

        tooltip.innerText = `公式: ${formula}\n结果: ${formatted}`;
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.style.display = 'block';
      } catch (err) {
        tooltip.innerText = '❌ 公式错误，请检查表达式';
        tooltip.style.left = `${e.pageX + 10}px`;
        tooltip.style.top = `${e.pageY + 10}px`;
        tooltip.style.display = 'block';
      }
    }, 10); // 微小延迟，确保 mousedown 已处理
  });
})();
