// ==UserScript==
// @name         隐藏大师兄广告（css为主）
// @namespace    http://tampermonkey.net/
// @version      1.4.4
// @description  主要用CSS隐藏多余广告
// @author       啦A多梦
// @license      MIT
// @match        https://www.yanetflix.me/*
// @match        https://player.snapload.one/*
// @match        https://www.yaanetflix.com/*
// @match        https://www.yanetflix.one/*
// @match        https://yanetflix.me/*
// @match        https://palyer.yaplayer.one/*
// @include      /^https:\/\/.*?\.da?sh.*
// @include      /^https:\/\/.*?\.91.*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dshpbcgsvz.com
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460460/%E9%9A%90%E8%97%8F%E5%A4%A7%E5%B8%88%E5%85%84%E5%B9%BF%E5%91%8A%EF%BC%88css%E4%B8%BA%E4%B8%BB%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/460460/%E9%9A%90%E8%97%8F%E5%A4%A7%E5%B8%88%E5%85%84%E5%B9%BF%E5%91%8A%EF%BC%88css%E4%B8%BA%E4%B8%BB%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.cookie = "showADTime=1";
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
                    this.responseText = _responsetext.replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts");
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

    //清理广告窗口
    var styl = document.createElement("style");
    var d = new Date();
    
    //隐藏福利
    try {
        if (d.getHours() < 21) {
            document.getElementsByClassName('hl-nav-item')[1].style.display = 'none';
            document.getElementsByClassName("hl-menus-item")[1].style.display = 'none';
        }
    } catch (err) {}

    styl.innerText = '.tips-box, ads, ads-double, #buffer {display: none !important;}.hl-player-setups {display: none !important;} #1006{display: none !important;} .conch-ads-box {display: none !important;}.hl-poptips-wrap{display: none !important;}.hl-pops-bg{display: none !important;}#ad1001{display: none !important;}#ad1002 {display: none !important;}#ad1003 {display: none !important;}#ad1004 {display: none !important;}#ad1005{display: none !important;}#ad1006{display: none !important;}#ad1007 {display: none !important;}.hl-player-notice {display: none !important;}';

    document.head.appendChild(styl);

    var _open = window.open;
    window.open = function(val1, val2){
        if(val2 == "_blank" || val2 == "_self"){
            return false;
        }else{
            return _open.apply(this, arguments);
        }
    }

})();