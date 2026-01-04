// ==UserScript==
// @name         MDN自动设置中文
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  MDN网站自动设置语言为简体中文
// @author       You
// @match        https://developer.mozilla.org/*
// @icon         https://developer.mozilla.org/favicon-48x48.97046865.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438303/MDN%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E4%B8%AD%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/438303/MDN%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E4%B8%AD%E6%96%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let url = location.href;
    const EN = 'en-US'
    const CN = 'zh-CN';
    if (url.indexOf(EN) !== -1) {
      url = url.replace(EN,CN);
      location.replace(url);
    }
})();