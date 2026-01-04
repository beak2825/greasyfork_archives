// ==UserScript==
// @name         V2Block
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  在 V 站屏蔽某个帖子
// @author       hudidit
// @match        https://v2ex.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/403054/V2Block.user.js
// @updateURL https://update.greasyfork.org/scripts/403054/V2Block.meta.js
// ==/UserScript==

(function() {
  'use strict';

  console.log('[v2block]');

  // ********** 初始化逻辑 **********

  const STORAGE_LINKS = 'v2_menu_block_links';
  let blockedLinks = getLink().links;
  hideListItem();

  // 菜单
  const menu = document.createElement('div');
  menu.id = 'v2-menu-container';
  document.body.appendChild(menu);
  menu.innerHTML = `
    <a class="v2-menu-item" id="v2-menu-block">不看这个页面</a>
    <a class="v2-menu-item" id="v2-menu-unblock">恢复全部页面</a>
    <a class="v2-menu-item" id="v2-menu-new-tab" target="_blank">在新标签页打开</a>
  `;
  const menuState = {
    href: '',
    left: -999,
    top: -999,
    linkPath: '',
    linkText: '',
    visible: false,
  };

  // 蒙层
  const overlay = document.createElement('div');
  overlay.id = 'v2-menu-overlay';
  document.body.appendChild(overlay);

  appendStyle();
  resetState();
  console.log('[v2block] blocked links:', blockedLinks);

  // ********** 监听事件 **********

  document.addEventListener('contextmenu', function(e) {
    const el = e.target;
    if (el.tagName.toUpperCase() === 'A' && el.className === 'topic-link') {
      e.preventDefault();
      const href = el.getAttribute('href');
      const linkPath = getPathFormHref(href);
      updateState({
        visible: true,
        href,
        left: e.clientX,
        top: e.clientY,
        linkPath,
        linkText: el.textContent,
      });
    }
  });

  overlay.addEventListener('click', function() {
    resetState();
  });

  document.querySelector('#v2-menu-block').addEventListener('click', function() {
    const {
      linkPath,
      linkText,
    } = menuState;
    saveLink({
      path: linkPath,
      text: linkText,
    });
    hideListItem();
    resetState();
  });

  document.querySelector('#v2-menu-unblock').addEventListener('click', function() {
    clearLink();
    // TODO: 刷新页面，比较粗暴，需要优化
    location.reload();
  });

  // ********** 定义函数 **********

  function resetState() {
    updateState({
      visible: false,
      href: '',
      linkText: '',
    });
  }

  function appendStyle() {
    const styleEl = document.createElement('style');
    styleEl.innerText = `
      #v2-menu-overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        z-index: 1;
        display: none;
      }
      #v2-menu-container {
        position: fixed;
        z-index: 2;
        min-width: 200px;
        background: #fff;
        border: 1px solid #c0c0c0;
        box-shadow: 0 0 5px rgba(136, 136, 136, 0.3);
      }
      #v2-menu-container .v2-menu-item {
        display: block;
        font-size: 14px;
        line-height: 30px;
        padding: 0 10px;
        border-bottom: 1px solid #e0e0e0;
        color: #333;
        text-decoration: none;
        cursor: pointer;
      }
      #v2-menu-container .v2-menu-item:hover {
        background: #e0e0e0;
      }
      #v2-menu-container .v2-menu-item:last-of-type {
        border-bottom: none;
      }
    `;
    document.querySelector('head').appendChild(styleEl);
  }

  /**
   * 更新状态
   * @param {object} state 需要更新的状态字段
   */
  function updateState(state = {}) {
    Object.assign(menuState, state);

    const {
      visible,
      href = '',
      left,
      top,
    } = menuState;

    if (!visible) {
      hideMenu();
      return;
    }

    showMenu();

    document.querySelector('#v2-menu-new-tab').href = href;
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function showMenu(state = {}) {
    overlay.style.display = 'block';
    menu.style.display = 'block';
  }

  function hideMenu() {
    overlay.style.display = 'none';
    menu.style.display = 'none';
  }

  function hideListItem() {
    const items = document.querySelectorAll('#Main .cell.item');
    for (let item of items) {
      const topic = item.querySelector('.topic-link');
      if (blockedLinks.find(link => link.path === getPathFormHref(topic.getAttribute('href')))) {
        item.remove();
      }
    }
  }

  function saveLink(link = { path: '', text: '' }) {
    const data = JSON.parse(GM_getValue(STORAGE_LINKS, '{}'));
    data.links = data.links || [];
    const links = data.links;
    const isAlreadyIn = links.findIndex(item => item.path === link.path) > -1;
    if (isAlreadyIn) return;
    links.push(link);
    blockedLinks = data.links;
    GM_setValue(STORAGE_LINKS, JSON.stringify(data));
  }

  function getLink() {
    const data = JSON.parse(GM_getValue(STORAGE_LINKS, '{}'));
    data.links = data.links || [];
    return data;
  }

  function clearLink() {
    const data = {};
    data.links = [];
    blockedLinks = data.links;
    GM_setValue(STORAGE_LINKS, JSON.stringify(data));
  }

  function getPathFormHref(href = '') {
    return href.split('#')[0];
  }

})();