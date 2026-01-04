// ==UserScript==
// @name        fix eight04 style
// @namespace   https://github.com/eight04/linkify-plus-plus/issues/15
// @version     2025.3.13
// @author      eight04
// @license     BSD-3-Clause
// @description fix eight04's scripts style
// @match       *://www.chinatimes.com/*
// @match       *://www.ptt.cc/*.html*
// @match       *://travis-ci.com/*
// @match       *://travis-ci.org/*
// @grant       GM.addStyle
// @inject-into auto
// @downloadURL https://update.greasyfork.org/scripts/424764/fix%20eight04%20style.user.js
// @updateURL https://update.greasyfork.org/scripts/424764/fix%20eight04%20style.meta.js
// ==/UserScript==

// https://github.com/eight04/No-Embed-YouTube/issues/2#issuecomment-489115887
if (location.host === 'www.chinatimes.com') {
  GM.addStyle(`
  /* 移除額外的佔位元素 */
  .video-container::before {
    content: none !important;
  }
  /* 移除額外的背景色 */
  .video-container {
    background: none !important;
  }
  `);
}

// https://www.ptt.cc/bbs/HatePolitics/M.1613051722.A.98F.html
if (location.host === 'www.ptt.cc') {
  GM.addStyle(`
  /* 移除額外的佔位元素，因必然已有链接，故可进一步移除而不限于 ::before */
  .resize-container {
    display: none !important;
  }
  `);
}

// https://github.com/eight04/linkify-plus-plus/issues/15#issuecomment-407658659
if (location.host === 'travis-ci.org' || location.host === 'travis-ci.com') {
  GM.addStyle(`
  .log-body,
  .log-line,
  .linkifyplus {
    margin: 0 !important;
    position: static !important;
    color: inherit !important;
    text-decoration: underline !important;
  }
  
  .log-body,
  .log-line,
  .linkifyplus::before {
    content: none !important;
    counter-increment: none !important;
  }
  `);
}
