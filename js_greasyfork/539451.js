// ==UserScript==
// @name         NovelUpdates touchscreen-friendly reading list
// @namespace    alee.touchscreen-reading-list.novelupdates
// @version      0.2
// @description  Make NovelUpdates reading list easier to use with touchscreens
// @author       Aarron Lee
// @license      GNU AGPLv3
// @match        https://www.novelupdates.com/reading-list/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/539451/NovelUpdates%20touchscreen-friendly%20reading%20list.user.js
// @updateURL https://update.greasyfork.org/scripts/539451/NovelUpdates%20touchscreen-friendly%20reading%20list.meta.js
// ==/UserScript==

increaseLinkSize()
increaseRowWidth()
adjustUnreadTooltipContent()

setTimeout(() => {
  adjustUnreadIndicators()
  linksTargetNewTab()
}, 0)

//----------------------------


function addCssStyle(css) {
  let styleElement = GM_addStyle(css);

  document.querySelector('head').appendChild(styleElement)
}

function adjustUnreadTooltipContent() {
  let css = `
    .getchps {
      height: 45px!important;
    }
  `;
  addCssStyle(css)
}

function linksTargetNewTab() {
  document.querySelectorAll('.rl_links * a').forEach(n => {
    n.setAttribute('target', '_blank');
    n.setAttribute('rel', 'noopener noreferrer');
  })
}

function increaseRowWidth () {
  const rowStyle = `
    .rl_links {
      width: 100%
    }
  `
  addCssStyle(rowStyle)
}

function increaseLinkSize() {
  const linkStyle = `
    display: inline-block;
    border: 1px solid green;
    padding: 10px 20px;
    display: inline-block;
    max-width: 200px;
    white-space: normal;
    overflow-wrap: break-word;
  `

  const style = `
    .rl_links * a {
      ${linkStyle}
    }
    .chp-release {
      ${linkStyle};
      font-size: 1.2rem;
    }
  `;

  addCssStyle(style)
}


function adjustUnreadIndicators() {
  const indicatorStyle = `
    width: 45px!important;
    height: 45px!important;
  `

  document.querySelectorAll('.show-pop > img').forEach(n => {
    n.style = indicatorStyle

    n.addEventListener('click', (e) => {
      setTimeout(() => {
        document.querySelectorAll('.webui-popover-content * a').forEach(l => {
          l.setAttribute('target', '_blank');
          l.setAttribute('rel', 'noopener noreferrer');
        })
      }, 400)
    }) // end n.addEventListener

  })
}
