// ==UserScript==
// @name         智能目录
// @namespace    https://greasyfork.org/users/1171320
// @version      1.2
// @description  智能提取网页标题生成目录，支持记忆拖拽位置、记录开关状态、双击收起、重置位置。
// @match        *://*/*
// @grant        none
// @author       yzcjd
// @author2     ChatGPT4 辅助
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536095/%E6%99%BA%E8%83%BD%E7%9B%AE%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/536095/%E6%99%BA%E8%83%BD%E7%9B%AE%E5%BD%95.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 平滑滚动函数，easeInOutCubic缓动
  function easeInOutCubic(t) {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetY, duration = 600) {
    const startY = window.scrollY || window.pageYOffset;
    const distance = targetY - startY;
    let startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeInOutCubic(progress);
      window.scrollTo(0, startY + distance * easedProgress);
      if (elapsed < duration) {
        requestAnimationFrame(step);
      }
    }

    requestAnimationFrame(step);
  }

  const hostname = location.hostname;
  const storageKey = 'SmartTOC:v3.8:' + hostname;
  const state = JSON.parse(localStorage.getItem(storageKey) || '{}');

  const excludeKeywords = ['cloudflare','captcha','challenge','login','auth','verify'];
  if (excludeKeywords.some(k => hostname.includes(k) || location.pathname.includes(k))) return;

  const toc = document.createElement('div');
  toc.id = 'smart-toc';
  toc.style.cssText = `
    position:fixed; top:50px; right:50px; width:250px; max-height:80vh;
    background:#fff; border:1px solid #ccc; border-radius:8px;
    box-shadow:0 2px 8px rgba(0,0,0,0.15); overflow:hidden;
    z-index:99999; font-family:sans-serif;
  `;

  toc.innerHTML = `
    <div id="toc-header" style="background:#ccc; padding:5px; cursor:move;">
      📑 目录 <label id="toc-toggle" style="float:right; font-size:12px; cursor:pointer;">排除</label>
    </div>
    <div id="toc-list" style="
      margin:0; padding:0; overflow:auto;
      max-height: calc(80vh - 30px);
      opacity:1;
      transition: max-height 0.6s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
    "></div>
  `;
  document.body.appendChild(toc);

  const tocList = toc.querySelector('#toc-list');
  const toggleLabel = toc.querySelector('#toc-toggle');

  if (state.exclude) {
    toggleLabel.textContent = '启用';
    toc.style.width = '120px';
    tocList.style.display = 'none';
  }

  toggleLabel.addEventListener('click', () => {
    state.exclude = !state.exclude;
    localStorage.setItem(storageKey, JSON.stringify(state));
    toggleLabel.textContent = state.exclude ? '启用' : '排除';
    toc.style.width = state.exclude ? '120px' : '250px';
    tocList.style.display = state.exclude ? 'none' : '';
  });

  const ignoreSelectors = ['header','footer','nav','aside','.navbar','.sidebar','.avatar','.logo','.banner','.desc','.tabs','.player','.playlist','.switch','.user','.meta','.repository-content','.file-navigation','.breadcrumb','.table-list-header','.file-header','.BtnGroup','.Box-header'];
  const isVisible = el => !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  const isValidHeading = el => {
    const text = el.textContent.trim();
    const size = parseFloat(getComputedStyle(el).fontSize);
    const nearLogo = el.closest('.logo,.site-branding');
    if (!isVisible(el)) return false;
    if (ignoreSelectors.some(sel => el.closest(sel))) return false;
    if (text.length < 3 || text.length > 100) return false;
    if (size > 32 || size < 10) return false;
    if (/^(用户|作者|id|导航|选项卡|登录|注册|文件|文件夹|提交|历史|上传|添加|修改|移除|repository|files|commit|history|breadcrumb|upload|drop)/i.test(text)) return false;
    if (nearLogo) return false;
    return true;
  };

  let headings = [...document.querySelectorAll('main h1,h2,h3,h4,h5,h6, article h1,h2,h3,h4,h5,h6, .content h1,h2,h3,h4,h5,h6, #content h1,h2,h3,h4,h5,h6')].filter(isValidHeading);
  if (headings.length < 3) headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(isValidHeading);
  if (!headings.length) { toc.remove(); return; }

  const longest = Math.max(...headings.map(el => el.textContent.trim().length));
  if (longest >= 20) toc.style.width = '375px';

  headings.forEach((el, idx) => { if (!el.id) el.id = 'smart-toc-' + idx; });

  const getLevel = tag => parseInt(tag.replace('H',''));
  headings.forEach(el => {
    const level = Math.min(getLevel(el.tagName), 3);
    const a = document.createElement('a');
    a.href = `#${el.id}`;
    a.textContent = el.textContent.trim();
    const indent = level === 1 ? 0 : (level - 1) * 1.5;
    a.style.cssText = `display:block;padding:3px 10px;padding-left:${indent}em;color:inherit;text-decoration:none;user-select:none;`;
    tocList.appendChild(a);
  });

  toc.querySelector('#toc-header').addEventListener('mousedown', e => {
    let offsetX = e.clientX - toc.offsetLeft, offsetY = e.clientY - toc.offsetTop;
    const move = e => { toc.style.left = `${e.clientX - offsetX}px`; toc.style.top = `${e.clientY - offsetY}px`; };
    const up = () => {
      state.position = { x: toc.offsetLeft, y: toc.offsetTop };
      localStorage.setItem(storageKey, JSON.stringify(state));
      document.removeEventListener('mousemove', move);
      document.removeEventListener('mouseup', up);
    };
    document.addEventListener('mousemove', move);
    document.addEventListener('mouseup', up);
  });
  if (state.position) {
    toc.style.left = state.position.x + 'px';
    toc.style.top = state.position.y + 'px';
  }

  let isCollapsed = false;

  // 双击目录折叠/展开动画
  toc.addEventListener('dblclick', e => {
    e.stopPropagation();
    e.preventDefault();
    if (isCollapsed) {
      // 展开
      tocList.style.display = '';
      requestAnimationFrame(() => {
        tocList.style.maxHeight = 'calc(80vh - 30px)';
        tocList.style.opacity = '1';
      });
    } else {
      // 收起
      tocList.style.maxHeight = '0';
      tocList.style.opacity = '0';
      setTimeout(() => {
        tocList.style.display = 'none';
      }, 600);
    }
    isCollapsed = !isCollapsed;
  }, true);

  // 点击目录标题时，使用自定义平滑滚动动画
  tocList.addEventListener('click', e => {
    if (isCollapsed) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    if (e.target.tagName.toLowerCase() === 'a') {
      const href = e.target.getAttribute('href');
      if (!href.startsWith('#')) return;
      const id = href.slice(1);
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        setTimeout(() => {
          const rect = target.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          const distance = rect.top - document.documentElement.getBoundingClientRect().top + 10;
          const offsetY = scrollTop + rect.top - Math.min(distance, 150);
          smoothScrollTo(offsetY, 600);
        }, 10);
      }
    }
  });

  console.log('智能目录 v3.8 已启用（带平滑跳转动画）');
})();
