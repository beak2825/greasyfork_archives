// ==UserScript==
// @name         大师兄网站去除广告
// @namespace    https://greasyfork.org/zh-CN/users/1028592-tintion
// @version      2.1
// @description  去除垃圾广告
// @author       啦A多梦
// @license      AGPL License
// @match        https://vip.lz-cdn.com/*
// @match        https://yanetflix.tv/*
// @include      /^https:\/\/.*?\.da?sh.*
// @match        https://vip.lz-cdn14.com/*
// @match        https://netflixya.com/*
// @match        https://netflix.mom/*
// @match        https://netflix.wang/*
// @match        https://player.azx.me/*
// @icon         https://ugc.hitv.com/3/22040215100116D5902FA5F85F30A2245E0DAAAAFMjky/uyu3xI0.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460170/%E5%A4%A7%E5%B8%88%E5%85%84%E7%BD%91%E7%AB%99%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/460170/%E5%A4%A7%E5%B8%88%E5%85%84%E7%BD%91%E7%AB%99%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var d = new Date();
    var ecount = 0;

    //删除首页mask点击广告
    var _siv = setInterval(() => {
        try {
            if (document.querySelector('#conch-footer').nextElementSibling != null) {
                document.querySelector('#conch-footer').nextElementSibling.remove();
            }
        } catch (err) {
            ecount++;
            if (ecount > 30) {
                clearInterval(_siv);
            }
        }
    }, 300)
    if (document.getElementsByClassName("hl-pops-bg").length > 0) {
        document.querySelector('.hl-pops-bg').remove();
    }

    //隐藏福利
    try {
        if (d.getHours() > 5 && d.getHours() < 21) {
            document.getElementsByClassName('hl-nav-item')[1].style.display = 'none';
            document.getElementsByClassName("hl-menus-item")[1].style.display = 'none';
        }
    } catch (err) {}

    //删除播放器顶部提示
    if (document.getElementsByClassName("hl-player-notice").length > 0) {
        document.querySelector('.hl-player-notice').remove();
    }

    //删除页面打开提示框
    if (document.getElementsByClassName('hl-poptips-wrap').length > 0) {
        document.querySelector('.hl-poptips-wrap').remove();
    }

    //删除首页广告
    if (document.getElementsByClassName('conch-ads-box').length > 0) {
        for (let i = 0; document.getElementsByClassName('conch-ads-box').length > i; i++){
            document.querySelector('.conch-ads-box').remove();
        }
        try{
            document.querySelector('#ad1003').remove();
            document.querySelector('#ad1004').remove();
        }catch(err){}
    }

    //去除视频中插入的广告（手机端不支持）
    var open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, async) {
        if (url.indexOf(".m3u8") != -1) {
            console.log("捕获m3u8地址->",url);
            this.addEventListener("readystatechange", function () {
                if(this.readyState == 4){
                    var _responsetext = this.responseText;
                    Object.defineProperty(this, "responseText",{
                        writable: true,
                    });
                    this.responseText = _responsetext.replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*)?#EXT-X-DISCONTINUITY/, "\.ts");
                    console.log(this.responseText);
                }
            })
        }

        return open.apply(this, arguments);
    }

    //播放器全屏控制
    var _video = document.querySelector("video");
    try{
        _video.ondblclick = function(e){
            if(document.querySelector("video").webkitDisplayingFullscreen === true){
                document.querySelector("video").webkitExitFullscreen();
            }else{
                document.querySelector("video").webkitRequestFullscreen();
            }
    }
    }catch(err){}
    document.addEventListener("keydown", (e)=>{
        if(e.code === "KeyF" || e.code === "Enter" || e.code === "NumpadEnter"){
            if(document.querySelector("video").webkitDisplayingFullscreen === true){
                document.querySelector("video").webkitExitFullscreen();
            }else{
                document.querySelector("video").webkitRequestFullscreen();
            }
        }
    })

    document.cookie = "showADTime=1";
    var cele = document.body.appendChild;
    document.body.appendChild = function (parm) {
        if (parm.style.zIndex.indexOf("999") != -1) {
            debugger;
        }
        cele.apply(this,arguments);
    }
})();