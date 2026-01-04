// ==UserScript==
// @name         亚洲审美车（极品比较多）
// @namespace    http://tampermonkey.net/
// @version      3.0.3
// @license      MIT
// @description  破解网站时长限制,需要自己注册登录
// @author       总是怕来不及
// @match        https://theav101.com/*
// @match        https://theav.fun/*
// @match        https://theav09.fun/*
// @match        https://theav121.com/*
// @match        https://theav120.com/*
// @match        https://theav108.com/*
// @match        https://theav109.com/*
// @icon         https://theav109.com/static/logo.png
// @require      https://cdn.bootcdn.net/ajax/libs/hls.js/8.0.0-beta.3/hls.js
// @require      https://cdn.bootcdn.net/ajax/libs/dplayer/1.25.1/DPlayer.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/455251/%E4%BA%9A%E6%B4%B2%E5%AE%A1%E7%BE%8E%E8%BD%A6%EF%BC%88%E6%9E%81%E5%93%81%E6%AF%94%E8%BE%83%E5%A4%9A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/455251/%E4%BA%9A%E6%B4%B2%E5%AE%A1%E7%BE%8E%E8%BD%A6%EF%BC%88%E6%9E%81%E5%93%81%E6%AF%94%E8%BE%83%E5%A4%9A%EF%BC%89.meta.js
// ==/UserScript==

async function find(){
    document.querySelector('.table').remove()
    let url = player.api("hls").url.split('?')[0]
    window.dp = new DPlayer({
        element: document.querySelector("body > div.wrapper > div.main > div.video_player > div > div > div > div.player"),
        autoplay: false,
        theme: '#FADFA3',
        loop: true,
        lang: 'zh',
        screenshot: true,
        hotkey: true,
        preload: 'auto',
        video: {
            url: url,
            type: 'hls'
        }
    })
}

function isVideo(){
    let isvideo = 0
    let info = document.location
    let path = info.pathname
    let list = path.split('/')
    let i = null
    for (let i in list){
         if (list[i]==='videos'){
            isvideo = 1
         }
    }
    return isvideo
}

(function() {
    'use strict';
    let login = document.getElementById('login')
    if (login){
        alert('使用脚本前,请手动注册登录')
    }
    else{
        let p = isVideo()
        if (p){
            setTimeout(async () =>{
                let url = await find()
                }, 1000)
        }
    }

})();