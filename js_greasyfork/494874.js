// ==UserScript==
// @name         Grafana-fixed-selection
// @namespace    http://tampermonkey.net/
// @version      2
// @description  固定grafana选择部分
// @author       z
// @include      /https://oagrafana.*.maxjia.com/.*$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grafana.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/494874/Grafana-fixed-selection.user.js
// @updateURL https://update.greasyfork.org/scripts/494874/Grafana-fixed-selection.meta.js
// ==/UserScript==

(function() {
    'use strict';

function GM_addStyle(css) {
  const style = document.getElementById("GM_addStyleBy8626") || (function() {
    const style = document.createElement('style');
    style.type = 'text/css';
    style.id = "GM_addStyleBy8626";
    document.head.appendChild(style);
    return style;
  })();
  const sheet = style.sheet;
  sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}


GM_addStyle(`
  .css-1978mzo-canvas-content {
    padding: 0 16px 16px 16px;
  }
`);


GM_addStyle(`
  section[aria-label="Dashboard submenu"] {
    position: fixed;
    left: 20;
    z-index: 100;
    width: 100%;
    display: flex;
    padding: 16px 8px 8px 16px;
    -webkit-box-align: flex-start;
    align-items: flex-start;
    box-shadow: rgb(0, 0, 0) 0px 0.6px 1.5px, rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.23) 0px 5px 10px;
    background: rgb(24, 27, 31);
  }
`);


GM_addStyle(`
  div.react-grid-layout {
    margin-top: 120px;
  }
`);
})();