// ==UserScript==
// @name               GithubMonitor ER – 关键词高亮
// @name:zh-CN         GithubMonitor ER – 关键词高亮
// @namespace          https://github.com/your-name/   // ← 换成自己的主页
// @version            0.2.0
// @description        从页面卡片中提取关键词并在所有 <code> 标签里加黄底高亮。
// @description:zh-CN  自动提取监控卡片关键词，在页面代码块中醒目标记（黄底加粗），方便快速定位关键信息。
// @author             You
// @match              http://<Monitor_HOST>/*         // ← 请替换 <Monitor_HOST>
// @icon               https://github.com/favicon.ico
// @grant              unsafeWindow
// @grant              GM_addStyle
// @grant              GM.xmlHttpRequest
// @connect            *
// @run-at             document-end
// @license            MIT
// @homepage           https://github.com/your-name/   // ← 可选：项目主页
// @supportURL         https://github.com/your-name/issues
// @lastmodified       2025-02-11
// @note               2025-02-11  添加 unsafeWindow、@run-at document-end、优化代码结构
// @downloadURL https://update.greasyfork.org/scripts/539275/GithubMonitor%20ER%20%E2%80%93%20%E5%85%B3%E9%94%AE%E8%AF%8D%E9%AB%98%E4%BA%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/539275/GithubMonitor%20ER%20%E2%80%93%20%E5%85%B3%E9%94%AE%E8%AF%8D%E9%AB%98%E4%BA%AE.meta.js
// ==/UserScript==

/* ********************************************************************
 * GithubMonitor ER – 关键词高亮
 * -------------------------------------------------------------------
 * ① 监控页面变动（MutationObserver）。
 * ② 获取中间区域（排除首尾）.ant-card-body 下第三个蓝色标签的文字。
 * ③ 在所有 <code> 标签里把该词用 <strong style="background:yellow"> 包起来。
 * ④ 防抖 500 ms，避免 SPA 连续刷新时重复执行。
 * *******************************************************************/

(function () {
  'use strict';

  /* ============ 工具函数 ============ */

  /**
   * 获取页面中间（去掉首尾）的 .ant-card-body 列表
   * @returns {HTMLElement[]} 目标元素数组
   */
  const getTargetCardBodies = () =>
    Array.from(document.querySelectorAll('.ant-card-body')).slice(1, -1);

  /**
   * 高亮所有 <code> 内出现的关键词
   * @param {string} keyword 关键词
   */
  const highlightInCode = (keyword) => {
    if (!keyword) return;
    // g: 全局  i: 忽略大小写  s: 跨行
    const reg = new RegExp(`(${keyword})`, 'gis');
    document.querySelectorAll('code').forEach((code) => {
      code.innerHTML = code.innerHTML.replace(
        reg,
        '<strong style="background:yellow;">$1</strong>',
      );
    });
  };

  /**
   * 主逻辑：提取第三个蓝色标签内容 → 高亮
   */
  const runHighlight = () => {
    const cards = getTargetCardBodies();
    const blueTags = cards.flatMap((div) =>
      [...div.querySelectorAll('.ant-tag.ant-tag-blue')],
    );
    if (blueTags.length >= 3) {
      const keyword = blueTags[2].textContent.trim();
      console.info('[GithubMonitor ER] 关键词：', keyword);
      highlightInCode(keyword);
    }
  };

  /* ============ DOM 监听 ============ */

  const observer = new MutationObserver((mutations) => {
    let needRun = false;
    for (const m of mutations) {
      if (m.type === 'childList' && m.addedNodes.length) {
        needRun = true;
        break;
      }
    }
    if (needRun) {
      clearTimeout(observer.debounce);
      observer.debounce = setTimeout(runHighlight, 500); // 防抖 500 ms
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 首次进入页面也执行一次
  runHighlight();
})();