// ==UserScript==
// @name         直播世界播放助手
// @name:zh      直播世界播放助手
// @name:zh      直播世界播放助手
// @name:zh-TW   直播世界播放助手
// @namespace    http://tampermonkey.net/
// @version      1.03
// @description  B站直播世界直播间播放助手,交流QQ群:232530228,直播间网址：https://live.bilibili.com/7399897
// @description:zh      B站直播世界直播间播放助手,交流QQ群:232530228,直播间网址：https://live.bilibili.com/7399897
// @description:zh-CN   B站直播世界直播间播放助手,交流QQ群:232530228,直播间网址：https://live.bilibili.com/7399897
// @description:zh-TW   B站直播世界直播間播放助手,交流QQ群:232530228,直播間網址：https://live.bilibili.com/7399897
// @author       星子弈风
// @match        *://live.bilibili.com/7399897*
// @match        *://space.bilibili.com/7619276*
// @match        *://live.bilibili.com/7399898*
// @icon         https://space.bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446002/%E7%9B%B4%E6%92%AD%E4%B8%96%E7%95%8C%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/446002/%E7%9B%B4%E6%92%AD%E4%B8%96%E7%95%8C%E6%92%AD%E6%94%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log(window.location.host);
    if(window.location.host == 'live.bilibili.com'){
        var playerFinished = false; //播放器是否处理
        var liveStatusFinished = false; //直播窗台是否处理
        for (let i = 0; i <= 50; i++) {
            setTimeout(() => {
                //console.log(`#${i}`);
                if(!liveStatusFinished)
                { //没有处理过直播状态
                    var liveStatus = document.querySelector("#head-info-vm > div > div > div.upper-row > div.left-ctnr.left-header-area > div.live-status.live-skin-highlight-text.live-skin-highlight-border");
                    if(liveStatus && liveStatus.innerText.length > 0){
                        if(liveStatus.innerText == "直播"){
                            return; //正在直播直接返回
                        } else{
                            liveStatus.style = "color: var(--brand_blue);";
                            liveStatus.innerText = "直播";
                            var area = document.querySelector("#head-info-vm > div > div > div.upper-row > div.left-ctnr.left-header-area > div.live-area > a");
                            if(area){
                                area.innerText = "户外";
                            }
                        }
                        liveStatusFinished = true;
                        console.log("liveStatusFinished");
                    }
                }
                if(!playerFinished)
                { //直播状态已处理 && 没有处理过播放器
                    var playerPanel = document.querySelector("#live-player > div.web-player-ending-panel");
                    if(playerPanel && playerPanel.innerHTML.length > 0){
                        playerPanel.innerHTML = `<iframe src='https://worldlive.org.cn:8443/live.html' width='${playerPanel.clientWidth}' height='${playerPanel.clientHeight}' scrolling='no' style='border:0;background:none;' allowfullscreen></iframe>`;
                        playerFinished = true;
                        console.log("playerFinished");
                        return;
                    }
                }
            }, 100 * i)
        }
    } else if(window.location.host == 'space.bilibili.com'){
        var finished = false;
        for (let i = 0; i <= 50; i++) {
            setTimeout(() => {
                //console.log(`#${i}`);
                if(!finished)
                {
                    var tip = document.querySelector("#page-index > div.col-2 > div.section.i-live > div > div.i-live-off.i-live-off-guest > div > p");
                    if(tip && tip.innerText.length > 0){
                        tip.innerText = '🔴正在直播中，点击下方链接观看';
                        finished = true;
                        console.log("finished");
                        return;
                    }
                }
            }, 100 * i)
        }
    }
})();