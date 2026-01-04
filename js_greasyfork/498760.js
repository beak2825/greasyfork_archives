// ==UserScript==
// @name         Azora Fixer
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @license MIT
// @description  Make this thing somewhat usable
// @author       myklosbotond
// @match        https://azora.codespring.ro/*
// @grant        GM_addStyle
// @grant        GM.addStyle
// @downloadURL https://update.greasyfork.org/scripts/498760/Azora%20Fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/498760/Azora%20Fixer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const addStyleFn = "GM_addStyle" in window ? GM_addStyle : GM.addStyle;

    addStyleFn(`
#root header {
  height: 40px;
}

#root header:nth-of-type(2) {
  display: none !important;
}

#root main {
  padding-top: 0 !important;
}

#root .site-layout {
  gap: 0 !important;
}

#root .ant-layout-content > section {
  margin: 0 !important;
}

#root .ant-layout-content > section .ant-row .ant-col {
  margin: 0;
}

#root .ant-layout-content > section .ant-row .ant-card-body {
  padding: 0;
}

#root .ant-layout-content > section .ant-row [class^="iconContainer"] {
  display: none;
}

#root .ant-layout-content > section .ant-row [class^="content"] {
  position: absolute;
  top: 8px;
  right: 8px;
}

.ant-table-row .ant-select-selector {
  padding: 0 2px !important;
}

.ant-table-row .ant-badge-status-text, .ant-select-item .ant-badge-status-text {
  margin-left: 2px !important;
}

.ant-table-row .ant-select {
  width: 33px !important;
}

.ant-table-row[data-row-key^="Work"] .ant-select-arrow {
  display: none;
}

.ant-select-item {
  min-height: 30px;
  padding: 5px 2px;
}
    `);
})();