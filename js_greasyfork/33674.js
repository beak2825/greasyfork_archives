// ==UserScript==
// @name         去除知乎广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       11
// @match        https://www.zhihu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/33674/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/33674/%E5%8E%BB%E9%99%A4%E7%9F%A5%E4%B9%8E%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
      $('.Popover.TopstoryItem-rightButton').parentNode.remove();
})();