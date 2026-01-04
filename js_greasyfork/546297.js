// ==UserScript==
// @name         豆瓣电影UI优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  优化豆瓣电影网站的用户界面，提供更舒适的浏览体验
// @author       psdoc烛光
// @match        https://movie.douban.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546297/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1UI%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/546297/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1UI%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

// 优化字体和排版
function improveTypography() {
  const elements = document.querySelectorAll('.item-content, .title, .abstract');
  elements.forEach(el => {
    el.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    el.style.lineHeight = '1.6';
    el.style.letterSpacing = '0.3px';
  });
}

// 添加平滑动画
function addSmoothTransitions() {
  const style = document.createElement('style');
  style.textContent = `
    .item {
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .item:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
  `;
  document.head.appendChild(style);
}

// 优化页面布局
function optimizeLayout() {
  // 默认放大 drc-cover drc-subject-card-cover 及其内部图片
  const drcCovers = document.querySelectorAll('.drc-cover.drc-subject-card-cover');
  drcCovers.forEach(cover => {
    cover.style.width = '160px';
    cover.style.height = '240px';
    cover.style.maxWidth = 'none';
    cover.style.maxHeight = 'none';
    cover.style.objectFit = 'cover';
    cover.style.borderRadius = '6px';
    cover.style.transition = 'box-shadow 0.25s';
    cover.style.overflow = 'visible';
    cover.style.flex = '0 0 auto';
    cover.style.display = 'block';
    // 同时放大内部图片
    const img = cover.querySelector('img');
    if (img) {
      img.style.width = '160px';
      img.style.height = '240px';
      img.style.maxWidth = 'none';
      img.style.maxHeight = 'none';
      img.style.objectFit = 'cover';
      img.style.borderRadius = '6px';
      img.style.display = 'block';
    }
  });

  // 优化网格布局（首页/列表页）
  const gridContainer =
    document.querySelector('.grid-view') ||
    document.querySelector('.list-view') ||
    document.querySelector('#content .grid-16-8 .article');
  if (gridContainer) {
    gridContainer.style.display = 'grid';
    gridContainer.style.gridTemplateColumns = 'repeat(auto-fill, minmax(400px, 1fr))';
    gridContainer.style.gap = '28px';
    gridContainer.style.alignItems = 'start';
    gridContainer.style.padding = '24px 0';
  }


  // 去除 grid-16-8 clearfix 的宽度限制
  const grid168 = document.querySelector('.grid-16-8.clearfix');
  if (grid168) {
    grid168.style.width = '100%';
    grid168.style.maxWidth = 'none';
    grid168.style.boxSizing = 'border-box';
  }

  // 去除 main 的宽度限制
  const main = document.querySelector('.main');
  if (main) {
    main.style.width = '100%';
    main.style.maxWidth = 'none';
    main.style.boxSizing = 'border-box';
  }

  // 去除 recent-hot 的宽度限制
  const recentHot = document.querySelector('.recent-hot');
  if (recentHot) {
    recentHot.style.width = '100%';
    recentHot.style.maxWidth = 'none';
    recentHot.style.boxSizing = 'border-box';
  }

  // 去除 subject-list-main 的宽度限制
  const subjectListMain = document.querySelector('.subject-list-main');
  if (subjectListMain) {
    subjectListMain.style.width = '100%';
    subjectListMain.style.maxWidth = 'none';
    subjectListMain.style.boxSizing = 'border-box';
  }

  // 限制 drc-subject-card-main 的宽度为 120px
  const drcSubjectCardMain = document.querySelectorAll('.drc-subject-card-main');
  drcSubjectCardMain.forEach(el => {
    el.style.width = '100%';
    el.style.maxWidth = '100%';
    el.style.minWidth = '100%';
    el.style.boxSizing = 'border-box';
  });

  // 限制 drc-subject-card movie 的宽度为 360px
  const drcSubjectCardMovie = document.querySelectorAll('.drc-subject-card.movie');
  drcSubjectCardMovie.forEach(el => {
    el.style.width = '360px';
    el.style.maxWidth = '360px';
    el.style.minWidth = '360px';
    el.style.boxSizing = 'border-box';
  });

  // 去除常见限制宽度的容器样式
  const selectors = [
    '.main',
    '.grid-16-8.clearfix',
    '.recent-hot',
    '.subject-list-main',
    '.subject-list-list',
    '.content',
    '#content',
    '.article',
    '.wrapper',
    '.container',
    '.side',
    '.aside',
    '.mod',
    '.block5',
    '.block',
    '.drc-main',
    '.drc-content',
    '.drc-subject-card',
    '.drc-subject-list',
    '.drc-subject-list-main',
    '.drc-subject-list-list'
  ];
  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach(el => {
      el.style.width = '100%';
      el.style.maxWidth = 'none';
      el.style.minWidth = '0';
      el.style.boxSizing = 'border-box';
      el.style.marginLeft = '0';
      el.style.marginRight = '0';
      el.style.paddingLeft = '0';
      el.style.paddingRight = '0';
      el.style.float = 'none';
      el.style.display = el.style.display === 'block' ? 'block' : '';
    });
  });

  // 去除body和html的限制
  document.body.style.width = '100%';
  document.body.style.maxWidth = 'none';
  document.body.style.minWidth = '0';
  document.body.style.boxSizing = 'border-box';
  document.documentElement.style.width = '100%';
  document.documentElement.style.maxWidth = 'none';
  document.documentElement.style.minWidth = '0';
  document.documentElement.style.boxSizing = 'border-box';

  // 优化卡片样式
  const items = document.querySelectorAll('.item');
  items.forEach(item => {
    item.style.background = '#fff';
    item.style.borderRadius = '14px';
    item.style.boxShadow = '0 2px 8px rgba(0,0,0,0.07)';
    item.style.padding = '18px';
    item.style.marginBottom = '0';
    item.style.transition = 'box-shadow 0.2s';
  });

  // 优化 drc-rating drc-subject-info-rating m 的评分数字显示
  const ratings = document.querySelectorAll('.drc-rating.drc-subject-info-rating.m');
  ratings.forEach(rating => {
    if (!rating.dataset.copilotStyled) {
      let text = rating.textContent.trim();
      const match = text.match(/^(\d+)(\.\d+)?/);
      if (match) {
        const intPart = match[1];
        const decimalPart = match[2] ? match[2] : '';
        rating.innerHTML =
          `<span style="font-size:2em;font-weight:bold;vertical-align:bottom;line-height:1;">${intPart}</span>` +
          (decimalPart
            ? `<span style="font-size:1em;font-weight:bold;vertical-align:bottom;line-height:1;">${decimalPart}</span>`
            : '') +
          `<span style="font-size:1em;vertical-align:bottom;line-height:1;">${text.replace(match[0], '')}</span>`;
        rating.dataset.copilotStyled = '1';
      }
    }
  });

  // 去除 explore-all-sticky 的背景色
  const exploreSticky = document.querySelectorAll('.explore-all-sticky');
  exploreSticky.forEach(el => {
    el.style.background = 'none';
    el.style.backgroundColor = 'transparent';
  });

  // 放大 drc-subject-info-title-text 字体
  const titleTexts = document.querySelectorAll('.drc-subject-info-title-text');
  titleTexts.forEach(el => {
    el.style.fontSize = '1.5em';
    el.style.fontWeight = 'bold';
    el.style.lineHeight = '1.2';
  });

  // 优化 subject-list-list 为自适应3列
  const subjectList = document.querySelector('.subject-list-list');
  if (subjectList) {
    subjectList.style.display = 'grid';
    subjectList.style.gridTemplateColumns = 'repeat(3, 1fr)';
    subjectList.style.gap = '28px';
    subjectList.style.alignItems = 'start';
    subjectList.style.padding = '24px 0';
  }
}

// 添加无限滚动功能
function addInfiniteScroll() {
  let isLoading = false;
  window.addEventListener('scroll', () => {
    if (isLoading) return;

    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
      isLoading = true;
      // 这里可以添加加载更多内容的逻辑
      setTimeout(() => {
        isLoading = false;
      }, 1000);
    }
  });
}

function shouldEnhance() {
  const url = window.location.href;
  return (
    url.startsWith('https://movie.douban.com/tv/') ||
    url.startsWith('https://movie.douban.com/explore')
  );
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
  if (shouldEnhance()) {
    optimizeLayout();
    addInfiniteScroll();
    improveTypography();
    addSmoothTransitions();
  }
});

// 修正只注册一次 MutationObserver
if (!window.__doubanModernObserver) {
  window.__doubanModernObserver = true;
  const observer = new MutationObserver(() => {
    if (shouldEnhance()) {
      optimizeLayout();
    }
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}
