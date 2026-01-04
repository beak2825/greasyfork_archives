// ==UserScript==
// @name         bilibili直播默认最高画质
// @namespace    mscststs
// @version      0.5
// @description  强制最高画质
// @author       mscststs
// @include     /^https:\/\/live\.bilibili\.com\/(?:blanc\/)?\d/
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=1026406
// @run-at document-start
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/441090/bilibili%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/441090/bilibili%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(async function() {
    'use strict';




    while( 1 ){
        await mscststs.sleep(300)
        if(window.livePlayer){
            changeQuelity();
            return;
        }
    }



    function changeQuelity(){
        let livePlayer = window.livePlayer;
        if(!livePlayer){
            livePlayer = window.top.livePlayer;
        }
        let info = livePlayer.getPlayerInfo()
        if(info.qualityCandidates.length > 1){
            livePlayer.switchQuality(info.qualityCandidates[0].qn)
        }
    }



})();