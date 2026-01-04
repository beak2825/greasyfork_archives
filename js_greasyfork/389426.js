// ==UserScript==
// @name         Google tab paths
// @version      0.8.0
// @description  Use tabs to choose the Google search results
// @author       CennoxX
// @namespace    https://greasyfork.org/users/21515
// @homepage     https://github.com/CennoxX/userscripts
// @supportURL   https://github.com/CennoxX/userscripts/issues/new?title=[Google%20tab%20paths]%20
// @match        https://www.google.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/389426/Google%20tab%20paths.user.js
// @updateURL https://update.greasyfork.org/scripts/389426/Google%20tab%20paths.meta.js
// ==/UserScript==
/* jshint esversion: 11 */
var results = document.querySelectorAll("a:has(h3:not(.bCOlv h3))");
results.forEach((el, i) => el.tabIndex = i + 1);
(document.querySelector("#pnnext") ?? {}).tabIndex = results.length + 1;
