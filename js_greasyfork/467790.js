// ==UserScript==
// @name         KeepChatGPT Disable Banner
// @namespace    cvladan.com
// @version      1.2
// @description  The KeepChatGPT script, while useful, is intrusive due to its exaggerated design and placement on the ChatGPT page. To alleviate this, only one CSS style is applied, reducing the interface to a tiny hoverable area.
// @author       Vladan Colovic
// @match        *://chat.openai.com/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @created      2023-06-01
// @updated      2023-06-01
// @downloadURL https://update.greasyfork.org/scripts/467790/KeepChatGPT%20Disable%20Banner.user.js
// @updateURL https://update.greasyfork.org/scripts/467790/KeepChatGPT%20Disable%20Banner.meta.js
// ==/UserScript==

const selector = "nav #kcg, .sticky #kcg";

/* Inject CSS in document head */

(function(css) {
  (s = (d = document).createElement('style')).textContent = css;
  (d.getElementsByTagName ('head')[0] || d.body || d.documentElement).appendChild(s);
})(`

  ${selector} * {
    display: none !important;
  }

  ${selector} {
    color: transparent !important;
    min-height: 0px important!;
    height: 5px !important;
    background: none !important;
    padding: 0 !important;
    margin: 0 !important;
    border: 0 !important;
  }

`);
