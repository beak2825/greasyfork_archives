// ==UserScript==
// @name         全网默哀 - 自动将网页切换至默哀模式
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  每年清明节将网站切换至默哀模式
// @author       You
// @include        *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/399467/%E5%85%A8%E7%BD%91%E9%BB%98%E5%93%80%20-%20%E8%87%AA%E5%8A%A8%E5%B0%86%E7%BD%91%E9%A1%B5%E5%88%87%E6%8D%A2%E8%87%B3%E9%BB%98%E5%93%80%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/399467/%E5%85%A8%E7%BD%91%E9%BB%98%E5%93%80%20-%20%E8%87%AA%E5%8A%A8%E5%B0%86%E7%BD%91%E9%A1%B5%E5%88%87%E6%8D%A2%E8%87%B3%E9%BB%98%E5%93%80%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let now = new Date();
    if(now.getMonth() == 3 && now.getDate() == 4)
        document.querySelector('html').style.filter = 'grayscale(1)';
})();