// ==UserScript==
// @name         知乎去除内置广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       llr
// @match        https://www.zhihu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/32346/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%86%85%E7%BD%AE%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/32346/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E9%99%A4%E5%86%85%E7%BD%AE%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
      $('.Advert--card').parentNode.parentNode.remove();
})();