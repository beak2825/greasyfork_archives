// ==UserScript==
// @name         亚洲审美车（极品比较多）
// @namespace    http://tampermonkey.net/
// @version      2.2.2
// @license      MIT
// @description  破解网站时长限制,需要自己注册登录
// @author       总是怕来不及
// @match        https://theav101.com/*
// @match        https://theav108.com/*
// @match        https://theav109.com/*
// @icon         https://theav109.com/static/logo.png
// @grant        none
// @refer        https://sleazyfork.org/zh-CN/scripts/455251-%E4%BA%9A%E6%B4%B2%E5%AE%A1%E7%BE%8E%E8%BD%A6-%E6%9E%81%E5%93%81%E6%AF%94%E8%BE%83%E5%A4%9A
// @downloadURL https://update.greasyfork.org/scripts/457816/%E4%BA%9A%E6%B4%B2%E5%AE%A1%E7%BE%8E%E8%BD%A6%EF%BC%88%E6%9E%81%E5%93%81%E6%AF%94%E8%BE%83%E5%A4%9A%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/457816/%E4%BA%9A%E6%B4%B2%E5%AE%A1%E7%BE%8E%E8%BD%A6%EF%BC%88%E6%9E%81%E5%93%81%E6%AF%94%E8%BE%83%E5%A4%9A%EF%BC%89.meta.js
// ==/UserScript==

async function find(){
    document.querySelector('.table').remove();
    document.querySelector('.green').remove();
    document.querySelector('.message').remove();
    /*
    let locurl = document.location.href
    let res = await fetch(locurl, {
        method:'get',
        headers:{
            'Content-Type': 'application/text',
        }
    })
    // console.log(await res.text())
    let url = ''
    let body = await res.text()
    let end = body.search('m3u8')
    let start = body.search('v4.cvhlscdn.com')
    url = body.slice(start-8, end+4)
    console.log(url)
    Playerjs({id:"newplayer", file:player.api("hls").url.split('?')[0], autoplay:1});
    */
    let url = player.api("hls").url.split('?')[0];
    console.log(url);
    Playerjs({id:"newplayer", file:url, autoplay:1});
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
    let count = 1
    let login = document.getElementById('login')
    if (login){
        alert('使用脚本前,请手动注册登录')
    }
    else{
        let p = isVideo()
        if (p){
            setTimeout(async () =>{
                let url = await find()
                }, 3000)
        }
    }

})();