// ==UserScript==
// @name         删除b站关注弹窗
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  删掉一切会干扰我看视频的弹窗!
// @author       ray19951026
// @match         *www.bilibili.com/video*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423468/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%85%B3%E6%B3%A8%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/423468/%E5%88%A0%E9%99%A4b%E7%AB%99%E5%85%B3%E6%B3%A8%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    function removeClassName(){
        //var x = document.getElementsByClassName("bilibili-player-popup-area");//仅删除一次弹窗
        var x = document.getElementsByClassName("bilibili-player-popup-padding");//关注弹窗
        var c = document.getElementsByClassName("bilibili-player-link-wrap");//快速跳转链接弹窗
        x[0].innerHTML = "<div 关注弹窗被我删了哈哈哈哈哈!>	</div>";
        c[0].innerHTML = "<div 快速链接弹窗被我删了哈哈哈哈哈!>	</div>";
        // x[0].remove();
    }
    addEventListener('click', function() {
        removeClassName()
    }, false);
    // Your code here...
})();