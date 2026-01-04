// ==UserScript==
// @name        動畫瘋自動點擊同意
// @namespace   http://tampermonkey.net/
// @version     1.1.0
// @description 每次開啟動畫時自動點擊分級畫面的「同意」按鈕
// @author      DoReMi
// @match       https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant       unsafeWindow
// @require     https://code.jquery.com/jquery-3.4.1.slim.min.js#md5=d9b11ca4d877c327889805b73bb79edd,sha256=a5ab2a00a0439854f8787a0dda775dea5377ef4905886505c938941d6854ee4f
// @require     https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.2/waitForKeyElements.js#md5=3a059ea8e001d1b9d5d04cabe475f9d4,sha=69f27dca35a1863f5ccd91ff8f30bba88a5661df
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/494682/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%90%8C%E6%84%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/494682/%E5%8B%95%E7%95%AB%E7%98%8B%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%90%8C%E6%84%8F.meta.js
// ==/UserScript==

/* globals waitForKeyElements */

(function() {
    'use strict';

    // 函數: 點擊事件
    function clickHandler() {
        waitForKeyElements(".choose-btn-agree", btn => {
            btn.click();
            console.log("<info> clicked agree button.");
        }, true);
    }

    // 在網頁載入時執行一次
    clickHandler();

    // 監聽滑鼠點擊事件
    document.addEventListener('click', clickHandler);
})();
