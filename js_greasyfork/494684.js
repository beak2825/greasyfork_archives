// ==UserScript==
// @name        動畫瘋30秒後自動跳廣告
// @namespace   http://tampermonkey.net/
// @version     1.1.0
// @description 自動點擊「點此跳過廣告」按鈕
// @author      DoReMi
// @match       https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant       unsafeWindow
// @require     https://code.jquery.com/jquery-3.4.1.slim.min.js#md5=d9b11ca4d877c327889805b73bb79edd,sha256=a5ab2a00a0439854f8787a0dda775dea5377ef4905886505c938941d6854ee4f
// @require     https://cdn.jsdelivr.net/gh/CoeJoder/waitForKeyElements.js@v1.2/waitForKeyElements.js#md5=3a059ea8e001d1b9d5d04cabe475f9d4,sha=69f27dca35a1863f5ccd91ff8f30bba88a5661df
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/494684/%E5%8B%95%E7%95%AB%E7%98%8B30%E7%A7%92%E5%BE%8C%E8%87%AA%E5%8B%95%E8%B7%B3%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/494684/%E5%8B%95%E7%95%AB%E7%98%8B30%E7%A7%92%E5%BE%8C%E8%87%AA%E5%8B%95%E8%B7%B3%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

/* globals waitForKeyElements */

(function() {
    'use strict';

    // 函數: 點擊事件
    function try_to_click_skip_button_clickHandler() {
        waitForKeyElements("#adSkipButton", btn => {
            try_to_click_skip_button();
            console.log("<info> Skip AD in 30 seconds.");
        }, true);
    }

    function try_to_click_skip_button() {
        //當按鈕文字變成"點此跳過廣告"才會觸發.click()事件
        if (document.querySelector("#adSkipButton")) {
            if (document.querySelector(".vast-skip-button").textContent == "點此跳過廣告") {
                document.querySelector("#adSkipButton").click();
                console.log('<info> Skipped AD');
            } else {
                setTimeout(try_to_click_skip_button, 500);
            }
        }
    }

    // 在網頁載入時執行一次
    try_to_click_skip_button_clickHandler();

    // 監聽滑鼠點擊事件
    document.addEventListener('click', try_to_click_skip_button_clickHandler);

    // 函數: 點擊事件
    function try_to_click_3rd_party_skip_button_clickHandler() {
        waitForKeyElements("#an_skip_button", btn => {
            console.log("<info> Detected 3rd party AD.");
            try_to_click_3rd_party_skip_button(btn);
        }, true, ".VPAID-container iframe");
    }

    function try_to_click_3rd_party_skip_button(btn) {
        if (!btn) return;
        else if (btn.css("display") == "none") {
            console.log("<info> 3rd party skip button is hidden, so no need to click it.");
        } else if (btn.text() == "Skip ad") {
            btn.click();
            console.log("<info> Skipped AD");
        } else {
            //Wait for 0.5 seconds.
            setTimeout(() => {
                try_to_click_3rd_party_skip_button(btn);
            }, 500);
        }
    }

    // 在網頁載入時執行一次
    try_to_click_3rd_party_skip_button_clickHandler();

    // 監聽滑鼠點擊事件
    document.addEventListener('click', try_to_click_3rd_party_skip_button_clickHandler);
})();