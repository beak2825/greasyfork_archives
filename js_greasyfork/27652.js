// ==UserScript==
// @name        zhihu-elder-river
// @namespace   https://github.com/OpenGG/zhihu-elder-river
// @description Make zhihu more elder-friendly.
// @icon        ./icon.png
// @version     1.0.0
// @noframes
// @grant       none
// @run-at      document-start
// @match       *://zhihu.com/*
// @match       *://*.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/27652/zhihu-elder-river.user.js
// @updateURL https://update.greasyfork.org/scripts/27652/zhihu-elder-river.meta.js
// ==/UserScript==

/* jshint esversion: 6, strict: true */
(() => {
  'use strict';

  const key = 'nweb_qa';

  // set the domain
  const domain = '.zhihu.com';

  // path
  const path = '/';

  // get a date in the past
  const expireDate = new Date(-1).toUTCString();

  // clear the size-related cookie and force it to expire
  document.cookie = `${key}=; domain=${domain}; path=${path}; expires=${expireDate}`;
})();
