// ==UserScript==
// @name         TCBG test
// @namespace    namespace
// @version      0.1
// @description  description
// @author       tos
// @match       *.torn.com/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/375063/TCBG%20test.user.js
// @updateURL https://update.greasyfork.org/scripts/375063/TCBG%20test.meta.js
// ==/UserScript==


GM_addStyle(`
body {
  background: rgba(31, 12, 45, 1) !important;
}
.d .custom-bg-desktop:before, .d .custom-bg-mobile:before {
  background-color: rgba(31, 12, 45, 1) !important;
}
`)