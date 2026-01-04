// ==UserScript==
// @name         西瓜视频自动高清
// @namespace    https://github.com/hoothin/UserScripts/
// @version      0.2.5
// @description  西瓜视频自动选择高清分辨率
// @author       Hoothin
// @match        https://www.ixigua.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440938/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E9%AB%98%E6%B8%85.user.js
// @updateURL https://update.greasyfork.org/scripts/440938/%E8%A5%BF%E7%93%9C%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E9%AB%98%E6%B8%85.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let index = 0;
    const definition = {
        0: ".xgplayer-definition>ul>li,.xgplayer-control-item__popover>ul>li",
        1: ".xgplayer-definition>ul>li[definition='1080p'],.xgplayer-control-item__popover>ul>li[definition='1080p']",
        2: ".xgplayer-definition>ul>li[definition='720p'],.xgplayer-control-item__popover>ul>li[definition='720p']",
        3: ".xgplayer-definition>ul>li[definition='480p'],.xgplayer-control-item__popover>ul>li[definition='480p']",
        4: ".xgplayer-definition>ul>li[definition='320p'],.xgplayer-control-item__popover>ul>li[definition='320p']"
    };
    let checkInt = setInterval(()=>{
        let playerDefBtn = document.querySelector(definition[index]);
        if (playerDefBtn && /\d+[pk]/i.test(playerDefBtn.innerHTML)) {
            clearInterval(checkInt);
            if(!playerDefBtn.classList.contains("isActive")){
                playerDefBtn.click();
                location.reload();
            }
        }
    },100);
})();