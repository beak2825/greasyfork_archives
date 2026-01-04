// ==UserScript==
// @name        自动适应屏幕大小
// @version     0.63
// @description 自动将页面宽度调整为适合屏幕大小的宽度
// @match       *://*/*
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_notification
// @namespace   http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/489706/%E8%87%AA%E5%8A%A8%E9%80%82%E5%BA%94%E5%B1%8F%E5%B9%95%E5%A4%A7%E5%B0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/489706/%E8%87%AA%E5%8A%A8%E9%80%82%E5%BA%94%E5%B1%8F%E5%B9%95%E5%A4%A7%E5%B0%8F.meta.js
// ==/UserScript==

(function () {
  const SCROLLBAR_ADJUST = 16; // 滚动条宽度的调整值
  const MARGIN_ADJUST = 16; // 页面边距调整值

  // 计算宽度调整值
  function getWidthAdjustment() {
    return window.innerWidth - SCROLLBAR_ADJUST - MARGIN_ADJUST * 2;
  }

  // 遍历元素并处理
  function iter(elems, f) {
    for (let i = 0; i < elems.length; i++) {
      const e = elems[i];
      if (f(e)) {
        // 处理 e 元素
      }
    }
  }

  // 自适应宽度
  function fit() {
    addPreWrapCSS();
    const elements = document.querySelectorAll('*');

    iter(elements, function (e) {
      if (e.tagName === 'PRE') {
        e.style.maxWidth = 'none';
      }

      const offsetWidth = e.offsetWidth;
      const widthAdjustment = getWidthAdjustment();
      if (offsetWidth > widthAdjustment) {
        e.style.width = `calc(100% - ${MARGIN_ADJUST * 2}px)`;
        e.style.boxSizing = 'border-box';
        e.style.marginLeft = `${MARGIN_ADJUST}px`;
        e.style.marginRight = `${MARGIN_ADJUST}px`;
      } else {
        e.style.width = 'auto';
        e.style.marginLeft = 'auto';
        e.style.marginRight = 'auto';
      }
    });

    // 修改默认字号
    const defaultFontSize = parseFloat(document.body.style.fontSize);
    document.body.style.fontSize = `${defaultFontSize * 6}px`;
  }

  // 添加 pre 元素的 white-space 属性
  function addPreWrapCSS() {
    const style = document.createElement('style');
    style.innerHTML = 'pre { white-space: pre-wrap; }';
    document.head.appendChild(style);
  }

  // 切换自适应宽度状态
  function applyFit() {
    const isFit = !GM_getValue('isFit', true);
    GM_setValue('isFit', isFit);
    GM_notification('自适应宽度状态已更新：' + (isFit ? '开启' : '关闭'));
    window.postMessage({ cmd: 'toggle', fit: isFit }, '*');
    fit();
  }

  // 处理消息
  function processMessage(event) {
    if (event.data.cmd === 'toggle') {
      applyFit();
    }
  }

  // 监听窗口大小变化
  window.addEventListener('resize', function () {
    if (GM_getValue('isFit', true)) {
      fit();
    }
  });

  // 监听消息事件
  window.addEventListener('message', processMessage, false);

  // 初始化
  fit();

  // 监听查看全部回答按钮的点击事件
  const btn = document.querySelector('.QuestionMainAction');
  if (btn) {
    btn.addEventListener('click', function () {
      // 等待回答内容加载完成后再执行自适应宽度
      setTimeout(fit, 1000);
    });
  }
})();
