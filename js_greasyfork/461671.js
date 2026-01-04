// ==UserScript==
// @name         全都不许动
// @namespace    https://viayoo.com/
// @version      0.1
// @description  使用js暂停页面播放的视频/音频
// @author       呆毛飘啊飘
// @run-at       document-end
// @match        https://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/461671/%E5%85%A8%E9%83%BD%E4%B8%8D%E8%AE%B8%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/461671/%E5%85%A8%E9%83%BD%E4%B8%8D%E8%AE%B8%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    document.querySelectorAll('audio,video').forEach(el => el.pause());
})();