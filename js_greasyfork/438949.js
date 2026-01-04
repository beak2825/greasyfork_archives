// ==UserScript==
// @name         B站防下播后被轮播gank
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  某些要拉满音量才听的舒服且开了轮播的直播间，直播结束进入轮播的话自动静音。顺便关注一下小东人鱼和noworld吧~
// @author       You
// @include      /https?:\/\/live.bilibili.com\/(blanc\/)?21448649(\?.*|$)/
// @include      /https?:\/\/live.bilibili.com\/(blanc\/)?21547904(\?.*|$)/
// @icon         https://www.google.com/s2/favicons?domain=bilibili.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438949/B%E7%AB%99%E9%98%B2%E4%B8%8B%E6%92%AD%E5%90%8E%E8%A2%AB%E8%BD%AE%E6%92%ADgank.user.js
// @updateURL https://update.greasyfork.org/scripts/438949/B%E7%AB%99%E9%98%B2%E4%B8%8B%E6%92%AD%E5%90%8E%E8%A2%AB%E8%BD%AE%E6%92%ADgank.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //每隔10分钟检测是否在直播
    const isLiveCheckInterval = 10;
    //每隔三分钟检测是否进入轮播
    const isRoundCheckInterval = 3;

    //当前直播间房号
    const roomid = /(?<=https?:\/\/live\.bilibili\.com\/(blanc\/)?)\d+/.exec(window.location.href)[0];
    //自己的uid
    const uid = document.cookie.replace(/(?:(?:^|.*;\s*)DedeUserID\s*=\s*([^;]*).*$)|^.*$/, '$1');

    let isLiveCheck = setInterval(()=>{
        fetch(`https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomid}`).then(response=> response.json()).then(res =>{
            if(res.code != 0) return;
            if(res.data?.live_status != 1) return;
            clearInterval(isLiveCheck);
            let isRoundCheck = setInterval(()=>{
                fetch(`https://api.live.bilibili.com/xlive/web-room/v2/index/getRoomPlayInfo?room_id=${roomid}`).then(response=> response.json()).then(res =>{
                    if(res.data?.live_status == 0){
                        clearInterval(isRoundCheck);
                        return;
                    }
                    if(res.data?.live_status != 2) return;
                    const name = uid ? `web-player-ui-config:${uid}`:'"web-player-ui-config:0';
                    const config = JSON.parse(localStorage.getItem(name));
                    const volume = config.volume;
                    volume.disabled = true;
                    volume.value = 0;
                    localStorage.setItem(name,JSON.stringify(config));
                    const v = document.getElementsByTagName('video')[0]
                    if(v){
                        v.muted = true;
                        v.volume = 0;
                    }
                    clearInterval(isRoundCheck);
                })
            },isRoundCheckInterval*60*1000)
            })

    },isLiveCheckInterval*60*1000)

})();