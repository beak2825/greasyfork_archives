// ==UserScript==
// @name         Optimized Text Finder and Copy Tool with Lowercase Display
// @namespace    Violentmonkey Scripts
// @version      1.5.2
// @description  显示小写文本，点击文本复制原内容，图标按钮复制扩展内容，添加消息提示，解决事件冲突问题。
// @author       15d23
// @match        http://xiaofang.zmvision.cn:8082/*
// @grant        GM_setClipboard
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/543600/Optimized%20Text%20Finder%20and%20Copy%20Tool%20with%20Lowercase%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/543600/Optimized%20Text%20Finder%20and%20Copy%20Tool%20with%20Lowercase%20Display.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 配置项
  let config = {
    rule: /[A-F0-9]{16}/, // 匹配规则：16位大写字母和数字组合
    extendedCopy: true, // 是否启用扩展复制功能
  };

  /**
   * 显示消息提示
   * @param {string} message 消息内容
   */
  function showMessage(message) {
    const msgDiv = document.createElement('div');
    msgDiv.textContent = message;
    msgDiv.style.position = 'fixed';
    msgDiv.style.top = '10px';
    msgDiv.style.left = '50%';
    msgDiv.style.transform = 'translateX(-50%)';
    msgDiv.style.padding = '10px 20px';
    msgDiv.style.backgroundColor = '#007bff';
    msgDiv.style.color = '#fff';
    msgDiv.style.borderRadius = '5px';
    msgDiv.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    msgDiv.style.zIndex = '9999';
    msgDiv.style.fontSize = '14px';
    msgDiv.style.fontWeight = 'bold';
    document.body.appendChild(msgDiv);

    // 自动消失
    setTimeout(() => {
      msgDiv.remove();
    }, 2000);
  }

  /**
   * 查找并处理 span 中符合规则的文本
   */
  function findAndProcessTextInSpans() {
    const spans = document.querySelectorAll('span'); // 查找所有 span 元素
    spans.forEach((span) => {
      // 跳过已处理的元素
      if (span.dataset.processed === 'true') return;

      const text = span.textContent.trim();
      if (config.rule.test(text)) {
        // 标记为已处理
        span.dataset.processed = 'true';

        // 转为小写
        const lowerText = text.toLowerCase();

        // 替换文本为小写
        span.textContent = lowerText;

        // 单击文本复制原内容
        span.style.cursor = 'pointer';
        span.addEventListener('click', (e) => {
          e.stopPropagation(); // 阻止事件冒泡，防止冲突
          GM_setClipboard(lowerText); // 复制原内容（小写形式）
          showMessage(`已复制内容: ${lowerText}`);
        });

        // 创建图标按钮
        const icon = document.createElement('span');
        icon.textContent = '📋'; // 图标，可以替换为其他字符或图标库
        icon.style.marginLeft = '5px';
        icon.style.cursor = 'pointer';
        icon.style.color = '#007bff';
        icon.style.fontSize = '16px';

        // 单击图标复制扩展内容
        if (config.extendedCopy) {
          icon.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止事件冒泡，防止触发文本的点击事件
            const extendedText = `/uplink/event/${lowerText}/points`;
            GM_setClipboard(extendedText); // 复制扩展内容
            showMessage(`已复制路径: ${extendedText}`);
          });
        }

        // 添加图标到 span 后
        span.style.display = 'inline-flex';
        span.style.alignItems = 'center';
        span.style.gap = '5px';
        span.appendChild(icon);
      }
    });
  }

  /**
   * 防抖函数：限制高频触发
   */
  function debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }

  /**
   * 初始化
   */
  function init() {
    // 初次加载文本处理
    findAndProcessTextInSpans();

    // 使用 IntersectionObserver 监听滚动加载的内容
    const observer = new IntersectionObserver(
      debounce(() => {
        findAndProcessTextInSpans();
      }, 200),
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    // 监听页面中所有 span 的可见性变化
    document.querySelectorAll('span').forEach((span) => {
      observer.observe(span);
    });

    // 监听新增节点（滚动加载）
    const mutationObserver = new MutationObserver(() => {
      findAndProcessTextInSpans();
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // 执行初始化
  init();
})();