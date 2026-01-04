// ==UserScript==
// @name         Bangumi 评分隐藏
// @namespace    https://bgm.tv/user/662064
// @version      2.4.0
// @description  在首页、条目页、搜索页、标签页、浏览页和人物作品页隐藏全站评分
// @author       板斧青凤
// @match        https://bgm.tv/subject/*
// @match        https://bangumi.tv/subject/*
// @match        https://chii.in/subject/*
// @match        https://bgm.tv/subject_search/*
// @match        https://bangumi.tv/subject_search/*
// @match        https://chii.in/subject_search/*
// @match        https://bgm.tv/
// @match        https://bangumi.tv/
// @match        https://chii.in/
// @match        https://bgm.tv/*/tag/*
// @match        https://bangumi.tv/*/tag/*
// @match        https://chii.in/*/tag/*
// @match        https://bgm.tv/*/browser*
// @match        https://bangumi.tv/*/browser*
// @match        https://chii.in/*/browser*
// @match        https://bgm.tv/person/*/works*
// @match        https://bangumi.tv/person/*/works*
// @match        https://chii.in/person/*/works*
// @match        https://bgm.tv/user/*/timeline
// @match        https://bangumi.tv/user/*/timeline
// @match        https://chii.in/user/*/timeline
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/484328/Bangumi%20%E8%AF%84%E5%88%86%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/484328/Bangumi%20%E8%AF%84%E5%88%86%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /*** ---------------- 全局状态与工具函数 ---------------- ***/

  // 存放页面中被隐藏或显示的评分相关元素
  let elementsToToggle = [];

  // 存放所有用于切换评分显隐的按钮引用
  const allToggleButtons = new Set();

  // 当前评分是否处于隐藏状态
  let isHidden = true;

  /**
   * 创建一个按钮或链接元素。
   * @param {string} text - 按钮文字。
   * @param {boolean} isInlineAnchor - 是否创建为 a 标签（用于 dock 内的样式）。
   */
  function createButtonElement(text, isInlineAnchor = false) {
    let el;
    if (isInlineAnchor) {
      el = document.createElement('a');
      el.href = 'javascript:void(0);';
      el.textContent = text;
      el.className = 'toggle-rating';
    } else {
      el = document.createElement('button');
      el.textContent = text;
      el.style.cssText = 'display:block;margin:10px auto;text-align:center;';
    }
    return el;
  }

  /**
   * 更新所有按钮的显示文字，与当前显隐状态保持一致。
   */
  function updateButtonsText() {
    const text = isHidden ? '显示评分' : '隐藏评分';
    allToggleButtons.forEach(btn => {
      btn.textContent = text;
    });
  }

  /**
   * 将所有评分元素设置为隐藏。
   */
  function ensureHiddenOnce() {
    if (!elementsToToggle.length) return;
    elementsToToggle.forEach(el => {
      el.style.display = 'none';
    });
    isHidden = true;
    updateButtonsText();
  }

  /**
   * 切换评分元素的显隐状态，并更新所有按钮文字。
   */
  function toggleAll() {
    if (!elementsToToggle.length) return;
    const nextHidden = !isHidden;
    elementsToToggle.forEach(el => {
      el.style.display = nextHidden ? 'none' : '';
    });
    isHidden = nextHidden;
    updateButtonsText();
  }

  /**
   * 注册按钮点击事件，使其能与其他按钮保持状态同步。
   * @param {HTMLElement} btn - 需要注册的按钮。
   */
  function registerButton(btn) {
    btn.addEventListener('click', toggleAll);
    allToggleButtons.add(btn);
    updateButtonsText();
  }

  /**
   * 监听并等待指定选择器元素出现。
   * @param {string} selector - 要等待的选择器。
   * @param {object} [options] - 监听选项。
   * @returns {Promise<Element>} - 返回首次出现的元素。
   */
  function waitFor(selector, { root = document, once = true } = {}) {
    return new Promise(resolve => {
      const found = root.querySelector(selector);
      if (found) {
        resolve(found);
        return;
      }
      const obs = new MutationObserver(() => {
        const el = root.querySelector(selector);
        if (el) {
          if (once) obs.disconnect();
          resolve(el);
        }
      });
      obs.observe(root === document ? document.documentElement : root, {
        childList: true,
        subtree: true
      });
    });
  }

  /**
   * 查找并隐藏指定选择器对应的评分元素。
   * 在评分元素加载完成后会自动调用隐藏逻辑。
   * @param {string} selectors - CSS 选择器。
   */
  function observeTargetsAndHide(selectors) {
    return new Promise(resolve => {
      const tryCollect = () => {
        const nodes = Array.from(document.querySelectorAll(selectors));
        if (nodes.length > 0) {
          elementsToToggle = nodes;
          ensureHiddenOnce();
          resolve(nodes);
          return true;
        }
        return false;
      };

      if (tryCollect()) return;

      const obs = new MutationObserver(() => {
        if (tryCollect()) obs.disconnect();
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    });
  }

  /*** ---------------- 页面类型判断与处理 ---------------- ***/

  const path = window.location.pathname;

  const isSubject = /\/subject\/\d+/.test(path);
  const isTimelineOrHome = /^\/user\/.*\/timeline/.test(path) || path === '/';
  const isSearchOrTagOrBrowserOrWorks =
    /subject_search/.test(path) ||
    /\/tag\//.test(path) ||
    /\/browser/.test(path) ||
    /\/person\/\d+\/works/.test(path);

  // 每种页面类型对应的评分选择器与按钮插入方式
  let selectors = '';
  const originalButtonsInstallers = [];

  // 条目页评分区域处理
  if (isSubject) {
    selectors = 'div[class*="global_rating"], #ChartWarpper';
    originalButtonsInstallers.push(async () => {
      const ratingDiv = await waitFor('div[rel="v:rating"]');
      if (ratingDiv && ratingDiv.parentNode) {
        const btn = createButtonElement('显示评分', false);
        ratingDiv.parentNode.insertBefore(btn, ratingDiv);
        registerButton(btn);
      }
    });
  }

  // 时间线和首页评分区域处理
  else if (isTimelineOrHome) {
    selectors = '.starstop-one, .fade';
    originalButtonsInstallers.push(async () => {
      const tabs = await waitFor('#timelineTabs');
      if (tabs) {
        const li = document.createElement('li');
        const btn = createButtonElement('显示评分', false);
        li.appendChild(btn);
        tabs.appendChild(li);
        registerButton(btn);
      }
    });
  }

  // 搜索页、标签页、浏览页和人物作品页评分区域处理
  else if (isSearchOrTagOrBrowserOrWorks) {
    selectors = '.starstop-s, .fade';
    originalButtonsInstallers.push(async () => {
      const tools = await waitFor('#browserTools');
      if (tools) {
        const btn = createButtonElement('显示评分', false);
        btn.style.margin = '10px';
        btn.style.display = '';
        tools.appendChild(btn);
        registerButton(btn);
      }
    });
  }

  /**
   * 在 dock 中追加“显示评分/隐藏评分”按钮。
   * 按钮位于第一个 li.first 元素的后方，表现为内联链接。
   */
  async function installDockButton() {
    const dock = await waitFor('#dock');
    if (!dock) return;

    const firstLi = dock.querySelector('ul.clearit > li.first');
    if (!firstLi) return;

    const sep = document.createTextNode(' | ');
    const dockBtn = createButtonElement('显示评分', true);

    firstLi.appendChild(sep);
    firstLi.appendChild(dockBtn);
    registerButton(dockBtn);
  }

  /*** ---------------- 启动主逻辑 ---------------- ***/

  (async function init() {
    if (!selectors) return;

    // 监听评分元素并隐藏
    await observeTargetsAndHide(selectors);

    // 在页面原位置插入按钮
    for (const installer of originalButtonsInstallers) {
      try {
        await installer();
      } catch (e) {
        // 忽略个别插入失败
      }
    }

    // 在 dock 中插入按钮
    try {
      await installDockButton();
    } catch (e) {
      // 忽略异常
    }
  })();
})();