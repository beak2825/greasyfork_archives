// ==UserScript==
// @name         网易云音乐自动锁定播放栏
// @namespace    http://tampermonkey.net/
// @license      MIT
// @version      0.2
// @description  超级简单单有用的自动锁定网易云音乐播放栏插件
// @author       Jay X
// @match        https://music.163.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=163.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453970/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E8%87%AA%E5%8A%A8%E9%94%81%E5%AE%9A%E6%92%AD%E6%94%BE%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/453970/%E7%BD%91%E6%98%93%E4%BA%91%E9%9F%B3%E4%B9%90%E8%87%AA%E5%8A%A8%E9%94%81%E5%AE%9A%E6%92%AD%E6%94%BE%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

window.onload=function(){
   var player=document.getElementsByClassName('m-playbar')[0];
   player.classList.remove('m-playbar-unlock');
   player.classList.add('m-playbar-lock');
}
    // Your code here...
})();