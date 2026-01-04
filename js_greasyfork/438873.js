// ==UserScript==
// @name         TestRailFixEditorResize
// @description  Fix editor's vertical resize bug in testrail.io
// @version      1.0
// @grant        GM_addStyle
// @include      https://*.testrail.io/*
// @namespace    https://greasyfork.org/users/674500
// @downloadURL https://update.greasyfork.org/scripts/438873/TestRailFixEditorResize.user.js
// @updateURL https://update.greasyfork.org/scripts/438873/TestRailFixEditorResize.meta.js
// ==/UserScript==

GM_addStyle(".field-editor { max-height:none; }");