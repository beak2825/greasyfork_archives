// ==UserScript==
// @name        网易云自动刷歌
// @namespace    https://acwars.me/
// @version      0.0.1
// @description 网易云刷听歌量
// @author       acwars
// @match        https://music.163.com/
// @downloadURL https://update.greasyfork.org/scripts/403893/%E7%BD%91%E6%98%93%E4%BA%91%E8%87%AA%E5%8A%A8%E5%88%B7%E6%AD%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/403893/%E7%BD%91%E6%98%93%E4%BA%91%E8%87%AA%E5%8A%A8%E5%88%B7%E6%AD%8C.meta.js
// ==/UserScript==

;(function () {
    var count = 1;
    setInterval(function() {
        var btn = document.querySelector('.nxt');
        btn.click();
        console.log('已播放:', count++);
    }, 70000);
})();