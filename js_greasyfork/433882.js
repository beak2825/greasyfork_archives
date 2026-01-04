// ==UserScript==
// @name        [WM] User Agent
// @description n/a
// @version     25.2.21.0
// @author      Folky
// @namespace   https://github.com/folktroll/
// @license     MIT
// @include     /^https:\/\/(aslive\.)?admin\.mergermarket\.com\/common\/.*$/// @grant   
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/433882/%5BWM%5D%20User%20Agent.user.js
// @updateURL https://update.greasyfork.org/scripts/433882/%5BWM%5D%20User%20Agent.meta.js
// ==/UserScript==

Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.0; Trident/4.0)'
});

unsafeWindow.isPostBack = 1