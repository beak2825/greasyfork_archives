// ==UserScript==
// @name         隐藏大师兄广告（css为主ipad专用）
// @namespace    http://tampermonkey.net/
// @version      1.9.2
// @description  主要用CSS隐藏多余广告
// @author       啦A多梦
// @license      MIT
// @match        https://h5dghr.dshploiuvx.com/*
// @match        https://nhqdf4.dshqieudgz.com/*
// @match        https://g5sgfd.dashvnfhcgae.com/*
// @match        https://fdggvf.dashqatgedrf.com/*
// @match        https://nsaf32.dashqyetfikm.com/*
// @match        https://hah64s.dashqatgedrf.com/*
// @match        https://h613er.dashrytcvzxa.com/*
// @match        https://htsfqr.dshdcjnhxa.com/*
// @match        https://25fgdf.dashqyetfikm.com/*
// @match        https://h62ere.dashrytcvzxa.com/*
// @match        https://www.yanetflix.me/*
// @match        https://player.snapload.one/*
// @match        https://www.yaanetflix.com/*
// @match        https://www.yanetflix.one/*
// @match        https://yanetflix.me/*
// @match        https://palyer.yaplayer.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dshpbcgsvz.com
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460853/%E9%9A%90%E8%97%8F%E5%A4%A7%E5%B8%88%E5%85%84%E5%B9%BF%E5%91%8A%EF%BC%88css%E4%B8%BA%E4%B8%BBipad%E4%B8%93%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/460853/%E9%9A%90%E8%97%8F%E5%A4%A7%E5%B8%88%E5%85%84%E5%B9%BF%E5%91%8A%EF%BC%88css%E4%B8%BA%E4%B8%BBipad%E4%B8%93%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.cookie = "showADTime=1";
    //去除视频中插入的广告（手机端不支持）
    var open = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function (method, url, async) {
        if (url.indexOf(".m3u8") != -1) {
            // console.log("捕获m3u8地址->",url);
            this.addEventListener("readystatechange", function () {
                if(this.readyState == 4){
                    var _responsetext = this.responseText;
                    Object.defineProperty(this, "responseText",{
                        writable: true,
                    });
                    this.responseText = _responsetext.replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*)?#EXT-X-DISCONTINUITY/, "\.ts");
                    // console.log(this.responseText);
                }
            })
        }
        return open.apply(this, arguments);
    }

    //左上角显示当前时间
    try {
        var showtimenow = document.createElement("span");
        showtimenow.id = "dplayer-clock";
        showtimenow.style = "padding: 5px; display: block;position: absolute;background-color: rgba(0, 0, 0, 0.5);font-size: 50%;border-radius: 10px";
        document.querySelector(".dplayer-bezel").insertBefore(showtimenow, document.querySelector("#dplayer-speed"));
        setInterval(function(){
            var timeTips = new Date();
            showtimenow.innerText = timeTips.toLocaleTimeString()
        }, 1000);
        document.querySelector(".dplayer-comment").style.display = "inline-block";
        document.querySelector("div.dplayer-controller > div.dplayer-icons.dplayer-icons-right > div.dplayer-comment > button > span").innerHTML = "T";
        document.querySelector("div.dplayer-controller > div.dplayer-icons.dplayer-icons-right > div.dplayer-comment > button > span").style.cssText = "color: white; font-weight: 800";
        document.querySelector("div.dplayer-controller > div.dplayer-icons.dplayer-icons-right > div.dplayer-comment > button").attributes[1].value = "开/关时间";
        document.querySelector("div.dplayer-controller > div.dplayer-icons.dplayer-icons-right > div.dplayer-comment > button").ontouchstart = function(){
            document.querySelector("#dplayer-clock").style.display == "none" ? document.querySelector("#dplayer-clock").style.display = "" : document.querySelector("#dplayer-clock").style.display = "none";
        }
    }catch(err){}

    //记录播放位置
    // 处理cookie的函数
    function cookies(val1, val2) {
        if (val1 != null && val2 != null) {
            let Day = new Date();
            Day.setTime(Day.getTime() + 3 * 24 * 60 * 60 * 1000);
            window.parent.document.cookie = val1 + "=" + val2 + ";expires=" + Day.toGMTString();
            return val1 + "=" + val2;
        } else {
            let cook = window.parent.document.cookie;
            let str = cook.replaceAll(" ", "").split(";");
            let cookObj = new Object();
            for (let i = 0; i < str.length; i++){
                let t = str[i].split("=");
                cookObj[t[0]] = t[1];
            }
            if (val1 != null) {
                return cookObj[val1];
            } else {
                return cookObj;
            }
        }
    }
    // 播放秒数转换函数
    function vdoleng(val){
        if(val <=0 ){return "00:00"};
        let hour = Math.floor(val / 3600);
        let min = Math.floor(val % 3600 / 60);
        // let sec = Math.round(val % 60); //四舍五入计算秒
        let sec = Math.floor(val % 60); //向下取整数
        let vlength = ""
        if(hour.toString().length < 2){
            hour = '0' + hour.toString();
        }
        if(min.toString().length < 2){
            min = '0' + min.toString();
        }
        if(sec.toString().length < 2){
            sec = '0' + sec.toString();
        }
        if(hour > 0){
            vlength = hour + ":" + min + ":" + sec;
        }else{
            vlength = min + ":" + sec;
        }
        return vlength;
    }
    // 检测是否有播放器窗口,如果有播放记录，则提示！！
    if (window.location.pathname == '/static/player/dplayer.html' && document.querySelector("video") != null) {
        let vplay = document.querySelector("video");
        let playtime = cookies("playtime");
        if (playtime != null) {
            if (confirm("你上次观看到" + vdoleng(playtime) + "是否继续？")) {
                vplay.currentTime = playtime;
            }
        }
        setInterval(function () {
            cookies("playtime", vplay.currentTime);
        }, 10000);
    }

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
//hook掉全屏广告跳转
    var _open = window.open;
    window.open = function(val1, val2){
        if(val2 == "_blank"){
            return false;
        }else{
            return _open.apply(this, arguments);
        }
    }
})();