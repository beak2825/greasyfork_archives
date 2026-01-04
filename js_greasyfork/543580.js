// ==UserScript==
// @name         github-deepread
// @namespace
// @version      0.1.1
// @description  GitHub仓库阅读分析
// @source       https://github.com/wuding129/github-deepread
// @author       wuding129
// @match        https://github.com/*
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/1498109
// @downloadURL https://update.greasyfork.org/scripts/543580/github-deepread.user.js
// @updateURL https://update.greasyfork.org/scripts/543580/github-deepread.meta.js
// ==/UserScript==

(function() {
  'use strict';

  // 添加动画效果
  GM_addStyle(`
    /* 下拉容器 */
    .go-deepwiki-dropdown {
      position: relative;
      display: inline-block;
      margin-right: 10px;
    }

    /* 下拉按钮 */
    .go-deepwiki-dropbtn {
      background-color: #2da44e;
      color: white;
      padding: 6px 12px 6px 10px;
      font-size: 12px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: background-color 0.2s;
    }

    .go-deepwiki-dropbtn:hover {
      background-color: #2c974b;
    }

    /* 箭头图标动画 */
    .go-deepwiki-dropbtn.active svg {
      transform: rotate(180deg);
      transition: transform 0.3s ease;
    }

    /* 下拉菜单动画 */
    .go-deepwiki-dropdown-content {
      position: absolute;
      background-color: #f6f8fa;
      min-width: 120px;
      box-shadow: 0 3px 12px rgba(0,0,0,0.15);
      border: 1px solid #d0d7de;
      border-radius: 6px;
      z-index: 1000;
      top: calc(100% + 5px);
      left: 0;
      opacity: 0;
      transform: scaleY(0.8) translateY(-10px);
      transform-origin: top center;
      transition:
        opacity 0.3s ease,
        transform 0.3s ease,
        visibility 0.3s;
      visibility: hidden;
    }

    .go-deepwiki-dropdown-content.show {
      opacity: 1;
      transform: scaleY(1) translateY(0);
      visibility: visible;
    }

    /* 菜单项动画 */
    .go-deepwiki-dropdown-content a {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      text-decoration: none;
      color: #24292f;
      font-size: 12px;
      border-bottom: 1px solid #eaecef;
      transition: all 0.2s;
    }

    .go-deepwiki-dropdown-content a:hover {
      background: #818b9826;
    }
  `);

  const bodyEl = document.querySelector('body');
  if (bodyEl) {
    watchDom(bodyEl, main);
    main();
  }

  // 全局监听点击事件
  document.addEventListener('click', function(e) {
    const dropdowns = document.querySelectorAll('.go-deepwiki-dropdown');
    dropdowns.forEach(dropdown => {
      const btn = dropdown.querySelector('.go-deepwiki-dropbtn');
      const content = dropdown.querySelector('.go-deepwiki-dropdown-content');

      if (!dropdown.contains(e.target)) {
        content.classList.remove('show');
        btn.classList.remove('active');
      }
    });
  });
})();

function watchDom(dom, callback) {
  const observer = new MutationObserver(callback);
  observer.observe(dom, { childList: true, subtree: true });
}

function main() {
  if (document.getElementById('go-deepwiki')) return;
  const repoBtnContainer = document.getElementById('repository-details-container');
  if (!repoBtnContainer) return;
  const btnList = repoBtnContainer.querySelector('ul');
  if (!btnList) return;
  btnList.appendChild(createDropDownDOM());
}

function createDropDownDOM() {
  const li = document.createElement('li');
  li.id = "go-deepwiki";

  const repName = location.pathname.split('/').filter(Boolean).slice(0,2).join('/');
  const deepWikiUrl = `https://deepwiki.com/${repName}`;
  const codeWikiXUrl = `https://codewiki.google/github.com/${repName}`;
  const zreadUrl = `https://zread.ai/${repName}`;
  const readmeXUrl = `https://readmex.com/${repName}`;

  // 箭头SVG
  const arrowSVG = `<svg class="go-deepwiki-arrow" aria-hidden="true" focusable="false" viewBox="0 0 16 16" width="12" height="12" fill="currentColor" style="vertical-align: text-bottom; transition: transform 0.3s;">
    <path d="m4.427 7.427 3.396 3.396a.25.25 0 0 0 .354 0l3.396-3.396A.25.25 0 0 0 11.396 7H4.604a.25.25 0 0 0-.177.427Z"></path>
  </svg>`;

  li.innerHTML = `
<div class="go-deepwiki-dropdown">
  <button class="go-deepwiki-dropbtn" aria-haspopup="true">
    DeepRead
    ${arrowSVG}
  </button>
  <div class="go-deepwiki-dropdown-content" role="menu">
    <a href="${deepWikiUrl}" target="_blank" rel="nofollow" role="menuitem">DeepWiki</a>
    <a href="${codeWikiXUrl}" target="_blank" rel="nofollow" role="menuitem">CodeWiki</a>
    <a href="${zreadUrl}" target="_blank" rel="nofollow" role="menuitem">Zread</a>
    <a href="${readmeXUrl}" target="_blank" rel="nofollow" role="menuitem">ReadmeX</a>
  </div>
</div>
`;

  // 绑定点击事件
  const dropBtn = li.querySelector('.go-deepwiki-dropbtn');
  const dropContent = li.querySelector('.go-deepwiki-dropdown-content');

  dropBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isShowing = dropContent.classList.contains('show');

    if (isShowing) {
      dropContent.classList.remove('show');
      dropBtn.classList.remove('active');
    } else {
      dropContent.classList.add('show');
      dropBtn.classList.add('active');
    }
  });

  return li;
}