// ==UserScript==
// @name         网易云游戏挂机
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解除网易云游戏挂机10分钟自动关闭
// @author       benz1
// @match        https://cg.163.com/run.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461274/%E7%BD%91%E6%98%93%E4%BA%91%E6%B8%B8%E6%88%8F%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/461274/%E7%BD%91%E6%98%93%E4%BA%91%E6%B8%B8%E6%88%8F%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    let n = setTimeout(()=>{
        var v = document.querySelector('.video');
        var t = setInterval(()=>{v.click()},30000);
    },60000);
})();