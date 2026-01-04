// ==UserScript==
// @name         花瓣网自动向下滚动
// @namespace    https://www.gofortime.com/
// @version      0.1
// @description  自动向下滚动 每次1000像素距离
// @author       寒隙
// @match        https://huaban.com/discovery
// @match        https://huaban.com/follow
// @match        https://huaban.com/search
// @icon         https://huaban.com/img/touch-icon-iphone-retina.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457954/%E8%8A%B1%E7%93%A3%E7%BD%91%E8%87%AA%E5%8A%A8%E5%90%91%E4%B8%8B%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/457954/%E8%8A%B1%E7%93%A3%E7%BD%91%E8%87%AA%E5%8A%A8%E5%90%91%E4%B8%8B%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    var t = setInterval(function(){
        var hei = document.documentElement.scrollTop;
        document.documentElement.scrollTop = hei + 1000;
    },6000)
})();