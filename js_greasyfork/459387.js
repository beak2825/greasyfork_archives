// ==UserScript==
// @name         噜噜噜
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @license      MIT
// @description  破解网站时长限制,需要自己注册登录
// @author       总是怕来不及
// @match        https://theav101.com/*
// @match        https://theav108.com/*
// @match        https://theav109.com/*
// @icon         https://theav109.com/static/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459387/%E5%99%9C%E5%99%9C%E5%99%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/459387/%E5%99%9C%E5%99%9C%E5%99%9C.meta.js
// ==/UserScript==

async function find(){
    document.querySelector('.table').remove()
    Playerjs({ id: "newplayer", file: player.api("hls").url.split('?')[0], autoplay: 1 });
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