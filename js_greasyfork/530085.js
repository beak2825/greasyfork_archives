// ==UserScript==
// @name         bilibili 收藏展开
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  bilibili collection expand
// @author       onionycs
// @match        https://space.bilibili.com/*/favlist*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @license      mit 
// @downloadURL https://update.greasyfork.org/scripts/530085/bilibili%20%E6%94%B6%E8%97%8F%E5%B1%95%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/530085/bilibili%20%E6%94%B6%E8%97%8F%E5%B1%95%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(function() {
        document.getElementsByClassName('fav-collapse-wrap')[0].style.maxHeight = '1500px';
    }, 2000);
})();