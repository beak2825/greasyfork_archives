// ==UserScript==
// @name:zh-tw      Yout.com 高畫質影片下載解鎖器
// @name            Yout.com High-Quality Video Downloader Unlocker
// @namespace       com.sherryyue.youcomunlock
// @version         0.6
// @description:zh-tw     此腳本解鎖 Yout.com 上的 720p 和 1080p 等下載選項按鈕，讓所有用戶無需付費會員即可下載高畫質的 YouTube 影片和音檔。
// @description     This script unlocks the download buttons for 720p and 1080p videos on Yout.com, allowing all users to download high-quality YouTube videos and audio files without a paid membership.
// @author          SherryYue
// @copyright       SherryYue
// @license         MIT
// @match           *://yout.com/video/*
// @contributionURL https://sherryyuechiu.github.io/card
// @supportURL      sherryyue.c@protonmail.com
// @icon            https://sherryyuechiu.github.io/card/images/logo/maskable_icon_x96.png
// @supportURL      "https://github.com/sherryyuechiu/GreasyMonkeyScripts/issues"
// @homepage        "https://github.com/sherryyuechiu/GreasyMonkeyScripts"
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/447505/Youtcom%20High-Quality%20Video%20Downloader%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/447505/Youtcom%20High-Quality%20Video%20Downloader%20Unlocker.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let selectedQuality = '1080';

    $("#quality").on("change",function(){
        selectedQuality = $(this).val();
    });
        
    var breakRestriction = () => {
        $("#upgradeModal").modal("hide")
        $("#quality").val(selectedQuality);
    }

    let observer = new MutationObserver(() => {
        const upgradeModal = $("#upgradeModal");
        if (upgradeModal && upgradeModal.has(".show")) breakRestriction();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();
