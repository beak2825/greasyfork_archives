// ==UserScript==
// @name         bilibili直播默认原画画质
// @namespace    mscststs
// @version      0.4
// @description  由于主流Chromium内核浏览器不支持硬解hevc,哔哩哔哩播放hevc时可能使用cpu软件导致卡顿,特修改为原画画质,此脚本原版为bilibili直播默认最高画质,感谢原作者:https://greasyfork.org/zh-CN/scripts/441090-bilibili%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E6%9C%80%E9%AB%98%E7%94%BB%E8%B4%A8
// @author       mscststs
// @include     /^https:\/\/live\.bilibili\.com\/(?:blanc\/)?\d/
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @require https://greasyfork.org/scripts/38220-mscststs-tools/code/MSCSTSTS-TOOLS.js?version=1026406
// @run-at document-start
// @license      GNU GPLv3
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/451099/bilibili%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E5%8E%9F%E7%94%BB%E7%94%BB%E8%B4%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/451099/bilibili%E7%9B%B4%E6%92%AD%E9%BB%98%E8%AE%A4%E5%8E%9F%E7%94%BB%E7%94%BB%E8%B4%A8.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    let video = await mscststs.wait("#live-player > video");
    if(video.paused){
        video.addEventListener("playing",changeQuelity);
    }else{
        changeQuelity();
    }


    function changeQuelity(){
        let livePlayer = window.livePlayer;
        if(!livePlayer){
            livePlayer = window.top.livePlayer;
        }
        let info = livePlayer.getPlayerInfo()
        if(info.qualityCandidates.length > 1){
            console.log(info.qualityCandidates);
            for (let index = 0; index < info.qualityCandidates.length; index++) {
                // 想要默认其他画质,请修改"原画"为"原画PRO"诸如此类
                if (info.qualityCandidates[index].desc=="原画") {
                    livePlayer.switchQuality(info.qualityCandidates[index].qn)
                }
                //else{
                  //  livePlayer.switchQuality(info.qualityCandidates[0].qn)
                //}
            }
        }
    }



})();