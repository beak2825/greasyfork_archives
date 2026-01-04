// ==UserScript==
// @name         QQ音乐歌词全屏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  QQ音乐歌词全屏，把介绍类隐藏
// @author       __123__33
// @match        https://y.qq.com/portal/player.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382363/QQ%E9%9F%B3%E4%B9%90%E6%AD%8C%E8%AF%8D%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/382363/QQ%E9%9F%B3%E4%B9%90%E6%AD%8C%E8%AF%8D%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.getElementsByClassName("song_info__info")[0].style.display = "none";
    document.getElementsByClassName("song_info__lyric")[0].style.top = "0px";
})();