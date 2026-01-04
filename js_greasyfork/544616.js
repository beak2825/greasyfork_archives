// ==UserScript==
// @name         小猪看看：线路筛选排序
// @version      1.01
// @description  6秒后延迟测试完毕排序，画质排序+状态排序+延迟排序，可手动重新排序。屏蔽低画质（可能误伤）如240p、360p。
// @namespace    https://greasyfork.org/users/1171320
// @author       yzcjd
// @author1      ChatGPT4辅助
// @match        https://xiaozhukankan.com/v/*
// @match        https://cn.xiaozhukankan.com/v/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544616/%E5%B0%8F%E7%8C%AA%E7%9C%8B%E7%9C%8B%EF%BC%9A%E7%BA%BF%E8%B7%AF%E7%AD%9B%E9%80%89%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/544616/%E5%B0%8F%E7%8C%AA%E7%9C%8B%E7%9C%8B%EF%BC%9A%E7%BA%BF%E8%B7%AF%E7%AD%9B%E9%80%89%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const LOW_QUALITIES = ['240p', '320p', '480p'];
  const QUALITY_PRIORITY = ['1440p', '1080p', '720p'];
  const FIXED_WAIT_MS = 6000;

  function log(...args) {
    console.log('[小猪看看排序]', ...args);
  }

  function getContainer() {
    const card = document.querySelector('.line-item');
    if (!card) {
      log('未找到任何 .line-item 卡片');
      return null;
    }
    return card.parentElement;
  }

  function removeLowQualityCards() {
    const cards = document.querySelectorAll('.line-item');
    log(`检测到卡片总数：${cards.length}`);
    let removedCount = 0;
    cards.forEach(card => {
      const qualityText = card.querySelector('.r .i')?.textContent.toLowerCase() || '';
      if (
        LOW_QUALITIES.some(q => qualityText.includes(q)) &&
        !QUALITY_PRIORITY.some(q => qualityText.includes(q))
      ) {
        card.remove();
        removedCount++;
      }
    });
    log(`已移除低清晰度卡片数量：${removedCount}`);
  }

  function getQualityRank(card) {
    const text = card.querySelector('.r .i')?.textContent.toLowerCase() || '';
    for (let i = 0; i < QUALITY_PRIORITY.length; i++) {
      if (text.includes(QUALITY_PRIORITY[i])) return i;
    }
    return QUALITY_PRIORITY.length;
  }

  function getStatusRank(card) {
    const statusText = card.querySelector('.line-info .s')?.textContent || '';
    if (statusText.includes('差')) return 1;
    if (statusText.includes('...')) return 2;
    if (statusText.includes('超时')) return 3;
    return 0;
  }

  function getDelay(card) {
    const span = card.querySelector('.line-info .s span');
    if (!span) return 999999;
    const text = span.textContent.trim();
    if (text === '...' || !/^\d+/.test(text)) return 999999;
    const m = text.match(/(\d+)/);
    if (!m) return 999999;
    return parseInt(m[1], 10);
  }

  function sortCards() {
    const container = getContainer();
    if (!container) {
      log('未找到卡片容器，取消排序');
      return;
    }

    const cards = Array.from(container.querySelectorAll('.line-item'));
    if (cards.length === 0) {
      log('无卡片，取消排序');
      return;
    }

    log('开始排序，卡片数量：', cards.length);

    cards.sort((a, b) => {
      const qa = getQualityRank(a);
      const qb = getQualityRank(b);
      if (qa !== qb) return qa - qb;

      const sa = getStatusRank(a);
      const sb = getStatusRank(b);
      if (sa !== sb) return sa - sb;

      const da = getDelay(a);
      const db = getDelay(b);
      return da - db;
    });

    cards.forEach(card => card.remove());
    cards.forEach(card => container.appendChild(card));

    log('排序完成');
  }

  function addResortButton() {
    if (document.getElementById('resort-btn')) {
      log('重新排序按钮已存在');
      return;
    }

    const headerSpan = document.querySelector('h2.meta2 > span');
    if (!headerSpan) {
      log('未找到 h2.meta2 > span，无法插入按钮');
      return;
    }

    const btn = document.createElement('button');
    btn.id = 'resort-btn';
    btn.textContent = '重新排序';
    Object.assign(btn.style, {
      marginLeft: '12px',
      padding: '4px 10px',
      fontSize: '14px',
      background: '#fefff9',
      color: '#69af55',
      border: '1px solid black',
      borderRadius: '4px',
      cursor: 'pointer',
      verticalAlign: 'middle',
      userSelect: 'none'
    });

    btn.onclick = () => {
      log('手动点击重新排序按钮');
      sortCards();
    };

    // 插入到 <span> 后面
    headerSpan.insertAdjacentElement('afterend', btn);
    log('重新排序按钮已插入 h2.meta2 内');
  }

  function init() {
    removeLowQualityCards();
    log(`等待${FIXED_WAIT_MS}毫秒后执行排序...`);
    setTimeout(() => {
      sortCards();
      addResortButton();
    }, FIXED_WAIT_MS);
  }

  const waitReadyId = setInterval(() => {
    if (document.querySelector('.line-item')) {
      clearInterval(waitReadyId);
      log('检测到卡片，开始初始化');
      init();
    }
  }, 500);

})();
