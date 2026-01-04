// ==UserScript==
// @name         動畫瘋30秒後自動跳廣告
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  自動點擊"點此跳過廣告"
// @author       axzxc1236
// @match        https://ani.gamer.com.tw/animeVideo.php?sn=*
// @grant        unsafeWindow
// @require https://code.jquery.com/jquery-3.4.1.slim.min.js#md5=d9b11ca4d877c327889805b73bb79edd,sha256=a5ab2a00a0439854f8787a0dda775dea5377ef4905886505c938941d6854ee4f
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012#md5=fd6775a03daee426e576e1394ab2a3b4,sha256=e582c20607e3e723a2e2437ca0546570b1531bf302d4a89cbd99964ccd73e995
// @downloadURL https://update.greasyfork.org/scripts/390796/%E5%8B%95%E7%95%AB%E7%98%8B30%E7%A7%92%E5%BE%8C%E8%87%AA%E5%8B%95%E8%B7%B3%E5%BB%A3%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/390796/%E5%8B%95%E7%95%AB%E7%98%8B30%E7%A7%92%E5%BE%8C%E8%87%AA%E5%8B%95%E8%B7%B3%E5%BB%A3%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    waitForKeyElements("#adSkipButton", btn => {
        try_to_click_skip_button();
        console.log("<info> Skip AD in 30 seconds.");
    }, true);

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

    waitForKeyElements("#an_skip_button", btn => {
        console.log("<info> Detected 3rd party AD.");
        try_to_click_3rd_party_skip_button(btn);
    }, true, ".VPAID-container iframe");

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
})();