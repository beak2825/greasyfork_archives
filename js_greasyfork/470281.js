// ==UserScript==
// @name         樱花动漫跳过片头，跳过片尾自动下一集
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  樱花动漫跳过片头，跳过片尾自动播放下一集；需要手动到代码里修改片头长度和片尾长度，单位都是秒
// @author       You
// @match        *://www.yhdmz2.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yinghuacd.com
// @require https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470281/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%EF%BC%8C%E8%B7%B3%E8%BF%87%E7%89%87%E5%B0%BE%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/470281/%E6%A8%B1%E8%8A%B1%E5%8A%A8%E6%BC%AB%E8%B7%B3%E8%BF%87%E7%89%87%E5%A4%B4%EF%BC%8C%E8%B7%B3%E8%BF%87%E7%89%87%E5%B0%BE%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==


(function() {
    function skip (player, start_length, end_length) {
    if (!start_length || !end_length) {
        return console.error('请设置片头和片尾时长')
    }
        let totalTime = player.duration;
    let skip_point_start = start_length;
    let skip_point_end = totalTime - end_length;
    const interval = 5000;
    let timer = null;

    function start () {
        console.log('开搞');
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(handler, interval)
    }
    function handler () {
        let current_time = player.currentTime;
        if (current_time < skip_point_start) {
            console.log('跳过片头')
             player.currentTime = start_length;
            player.webkitRequestFullscreen();
            return;
        }
        if (current_time >= skip_point_end) {
            console.log('跳过片尾,下一集')
            clearInterval(timer);
            player.webkitExitFullscreen();
            setTimeout(() => {
            const location = window.parent ? window.parent.location : window.location;
            const regRes = /\d+(?=\.html$)/.exec(location.href);
            if(regRes) {
                location.href = location.href.replace(/\d+(?=\.html$)/, Number(regRes[0]) + 1);
            }else {
               alert('没有下一集了')

            }

            },100)
            return;
        }
    }
    start();
}

    setTimeout(() => {
    const player = $('.dplayer-video')[0];
    console.dir(player)
        if(player){
           skip(player, 100, 165)
        }

    },1000)
})();