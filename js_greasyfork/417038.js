// ==UserScript==
// @name         Git Markdown Content Navigation
// @name:zh-CN   Git Markdown 文件内容导航
// @namespace    https://github.com/wang1212/user-script/blob/main/git-markdown-content-navigation
// @version      0.3.1
// @description  Provide directory navigation of the markdown file content of the github/gitee website.
// @description:zh-cn 提供 github/gitee 网站 markdown 文件内容的目录导航。
// @author       wang1212
// @match        http*://github.com/*
// @match        http*://gitee.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @supportURL   https://github.com/wang1212/user-script/blob/main/git-markdown-content-navigation
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/421316/Git%20Markdown%20Content%20Navigation.user.js
// @updateURL https://update.greasyfork.org/scripts/421316/Git%20Markdown%20Content%20Navigation.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const log = console.log;

  /* ------------------------------- Register menu configuration item ----------------------------- */

  let menu_item_value_switch;
  let menu_item_id_switch;
  let menu_item_id_feedback;
  let menu_item_id_source;

  function registerMenuCommand() {
    //
    if (menu_item_id_switch) GM_unregisterMenuCommand(menu_item_id_switch);

    menu_item_value_switch = GM_getValue('menu_item_value_switch');
    menu_item_id_switch = GM_registerMenuCommand(
      !menu_item_value_switch ? '默认显示 [点击切换]' : '默认隐藏 [点击切换]',
      function () {
        GM_setValue('menu_item_value_switch', !menu_item_value_switch);
        location.reload();
      }
    );

    //
    if (menu_item_id_source) GM_unregisterMenuCommand(menu_item_id_source);

    menu_item_id_source = GM_registerMenuCommand('源码 [GitHub]', function () {
      GM_openInTab(
        'https://github.com/wang1212/user-script/tree/main/git-markdown-content-navigation',
        { active: true, insert: true, setParent: true }
      );
    });

    //
    if (menu_item_id_feedback) GM_unregisterMenuCommand(menu_item_id_feedback);

    menu_item_id_feedback = GM_registerMenuCommand('反馈 & 更新', function () {
      GM_openInTab(
        'https://greasyfork.org/scripts/421316-git-markdown-content-navigation',
        { active: true, insert: true, setParent: true }
      );
    });
  }

  registerMenuCommand();

  /* ------------------------------- Init ----------------------------- */

  const href = location.href;

  const matchGithub = /github/;
  const matchGithubRepository = /https?:\/\/github.com\/.+\/.+/;
  const matchGitee = /gitee/;
  const matchGiteeRepository = /https?:\/\/gitee.com\/.+\/.+/;

  const isGithub = !!href.match(matchGithub);
  const isGitee = !!href.match(matchGitee);
  const isRepositoryPage = !!(
    href.match(matchGithubRepository) || href.match(matchGiteeRepository)
  );

  /* ------------------------------- Parse MarkDown file content navigation ----------------------------- */

  function updateMarkdownFileContentNavigation() {
    let navBarElem = document.querySelector('.wang1212_md-content-nav');

    // Remove existing
    navBarElem && navBarElem.remove();

    if (!isRepositoryPage) return;

    // titles
    const titles = getMarkDownContentTitles();
    if (!titles.length) return;

    // navBar button
    navBarElem = document.createElement('div');
    navBarElem.classList.add('wang1212_md-content-nav');
    navBarElem.title = 'Markdown 文件内容导航';

    navBarElem.innerText = 'N';

    // Panel
    const navBarPanelElem = document.createElement('div');
    navBarPanelElem.classList.add('wang1212_md-content-nav_panel');

    navBarPanelElem.innerHTML = '';

    // draw titles
    titles.forEach((title) => {
      const level = +title.tagName.substr(-1);
      navBarPanelElem.innerHTML += `
<p class="wang1212_md-content-nav_to-anchor" style="font-size: ${
        1 - ((level - 1) * 0).toFixed(2)
      }rem; margin: 0; padding-left: ${((level - 1) * 0.5).toFixed(
        2
      )}rem" data-anchor="${title.anchorId}">
${title.text}
</p>
`;
    });

    // --- CSS Style ---
    const styleElem = document.createElement('style');
    styleElem.type = 'text/css';
    styleElem.innerHTML = `
.wang1212_md-content-nav {
position: fixed;
right: 1rem;
bottom: 3.5rem;
z-index: 1999;
width: 2rem;
height: 2rem;
color: white;
font-size: 1.5rem;
line-height: 2rem;
text-align: center;
background-color: rgb(36, 41, 46);
cursor: pointer;
}
.wang1212_md-content-nav_panel {
position: absolute;
right: 0;
bottom: 2rem;
display: block;
width: 20rem;
height: 75vh;
padding: 0.5rem;
overflow: auto;
color: #999;
text-align: left;
background: white;
box-shadow: rgba(0, 0, 0, 0.25) 0 0 0.5rem 0;
}
.wang1212_md-content-nav_to-anchor {
line-height: 1.6 !important;
transition: all 0.4s linear;
}
.wang1212_md-content-nav_to-anchor:hover {
	color: rgb(0, 0, 0);
    transform: translateX(4px);
}
`;

    navBarElem.appendChild(navBarPanelElem);
    document.body.appendChild(navBarElem);
    document.head.appendChild(styleElem);

    // --- Event ---
    // Show/Hide
    navBarElem.addEventListener(
      'click',
      (e) => {
        if (e.target !== navBarElem) return;

        if (navBarPanelElem.style.display === 'none') {
          navBarPanelElem.style.display = 'block';
        } else {
          navBarPanelElem.style.display = 'none';
        }
      },
      false
    );
    if (menu_item_value_switch) {
      navBarPanelElem.style.display = 'none';
    }

    // fly to view
    navBarPanelElem.addEventListener(
      'click',
      (e) => {
        if (!e.target.classList.contains('wang1212_md-content-nav_to-anchor'))
          return;

        const anchorElem = document.getElementById(e.target.dataset.anchor);
        if (!anchorElem) return;

        anchorElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
      },
      false
    );
  }

  /* ------------------------------- To Top ----------------------------- */

  // to top button
  function updateGoToTopButton() {
    let toTopElem = document.querySelector('.wang1212_to-top');

    // Remove existing
    toTopElem && toTopElem.remove();

    // toTop button
    toTopElem = document.createElement('div');
    toTopElem.classList.add('wang1212_to-top');
    toTopElem.title = '回到顶部';

    toTopElem.innerText = '↑';

    // --- CSS Style ---
    const styleElem = document.createElement('style');
    styleElem.type = 'text/css';
    styleElem.innerHTML = `
.wang1212_to-top {
position: fixed;
right: 1rem;
bottom: 1rem;
z-index: 1999;
width: 2rem;
height: 2rem;
color: white;
font-size: 1.5rem;
line-height: 2rem;
text-align: center;
background-color: rgb(36, 41, 46);
cursor: pointer;
}
`;

    document.body.appendChild(toTopElem);
    document.head.appendChild(styleElem);

    // --- Event ---
    // fly to view
    toTopElem.addEventListener(
      'click',
      () => {
        document.body.scrollIntoView({ behavior: 'smooth' });
      },
      false
    );
  }

  /* ------------------------------- Utils ----------------------------- */

  // parse titles
  function getMarkDownContentTitles() {
    let rootElem = document.querySelector('.markdown-body');

    if (!rootElem) return [];

    const anchors = rootElem.querySelectorAll('a.anchor');

    if (!anchors.length) return [];

    const titles = [];

    anchors.forEach((elem) => {
      const parentElem = elem.parentElement;

      titles.push({
        tagName: parentElem.tagName,
        text: parentElem.textContent,
        anchorId: elem.id,
      });
    });

    return titles;
  }

  /* ------------------------------- Load ----------------------------- */

  function load() {
    updateMarkdownFileContentNavigation();
    updateGoToTopButton();
  }

  // Monitor page reload
  document.addEventListener('pjax:end', load, false);
  // see docs: https://turbo.hotwired.dev/reference/events
  // see https://github.com/refined-github/refined-github/issues/5719
  //document.addEventListener('turbo:render', load, false)
  document.documentElement.addEventListener('turbo:render', load, false);

  if (isGitee) {
    // Monitor page modify
    const observer = new MutationObserver(load);

    observer.observe(document.querySelector('.tree-holder'), {
      childList: true,
      subtree: false,
    });
  }

  //
  load();
})();
