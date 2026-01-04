// ==UserScript==
// @name         NovelUpdates Tablet Touchscreen-friendly series page
// @namespace    alee.tablet-touchscreen-novelupdates
// @version      0.1
// @description  Make NovelUpdates series page easier to use with tablet touchscreens
// @author       Aarron Lee
// @license      GNU AGPLv3
// @match        https://www.novelupdates.com/series/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/539453/NovelUpdates%20Tablet%20Touchscreen-friendly%20series%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/539453/NovelUpdates%20Tablet%20Touchscreen-friendly%20series%20page.meta.js
// ==/UserScript==

increaseCheckboxSize()
increaseLinkSize()

setTimeout(() => {
  linksTargetNewTab()
}, 0)

//-------------------------------

function addCssStyle(css) {
  let styleElement = GM_addStyle(css);

  document.querySelector('head').appendChild(styleElement)
}

function increaseCheckboxSize() {
  const css = `
    .enableread::before {
      left: -40px!important;
      width: 25px!important;
      height: 25px!important;
    }
    .enableread::after {
      left: -38px!important;
      width: 25px!important;
      height: 25px!important;
    }
  `

  addCssStyle(css);
}

function increaseLinkSize() {
  const linkStyle = `
    .chp-release {
      height: 80px;
      display: inline-block;
      border: 2px solid green;
      word-wrap: break-word;
      padding: 10px 20px;
      font-size: 1.5rem;
    }
  `
  addCssStyle(linkStyle);
}


function linksTargetNewTab() {
  document.querySelectorAll('.chp-release').forEach(n => n.target = '_blank')
}