// ==UserScript==
// @name              修复ACI论坛404错误链接
// @namespace     http://tampermonkey.net/
// @version           1.1
// @description   自动将超链接中的错误链接转换位正确的格式
// @author           Jay
// @homepage          https://greasyfork.org/zh-CN/scripts/457690
// @supportURL        https://greasyfork.org/zh-CN/scripts/457690
// @match            https://forum.chineseaci.com/*
// @icon               https://forum.chineseaci.com/favicon.ico
// @grant             none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/457690/%E4%BF%AE%E5%A4%8DACI%E8%AE%BA%E5%9D%9B404%E9%94%99%E8%AF%AF%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/457690/%E4%BF%AE%E5%A4%8DACI%E8%AE%BA%E5%9D%9B404%E9%94%99%E8%AF%AF%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //修复404链接
    let list = $('.linkk');
    for(let i=0;i<list.length;i++){
        let reg = /t-\d+/g;
        if(reg.test($('.linkk')[i].href)){
            $('.linkk')[i].href = "https://forum.chineseaci.com/topics/" + $('.linkk')[i].href.split('-')[1];
            let count = i + 1;
            console.log("已经修复第" + count +"个错误链接");
        }
    }
    //修复字幕组twitter图片
    let imgs = $('img');
    for(let i=0;i<imgs.length;i++){
        let twtUrl = imgs[i].getAttribute('data-original');
        if(twtUrl == 'https://forum.chineseaci.com/twt.jpg'){
            $('img')[i].src = 'https://s2.loli.net/2023/01/09/mS16EnIGek8uNdF.jpg';
            $('img')[i].setAttribute('data-original','https://s2.loli.net/2023/01/09/mS16EnIGek8uNdF.jpg');
        }
    }
})();