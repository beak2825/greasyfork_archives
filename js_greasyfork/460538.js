// ==UserScript==
// @name         大米星球去除广告
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  去除该电影网站的广告
// @author       啦A多梦
// @license      MIT
// @match        https://dmxq.fun/*
// @match        https://dami2.me/*
// @match        https://www.dmys.tv/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/460538/%E5%A4%A7%E7%B1%B3%E6%98%9F%E7%90%83%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/460538/%E5%A4%A7%E7%B1%B3%E6%98%9F%E7%90%83%E5%8E%BB%E9%99%A4%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var hidead = document.createElement("style");
    hidead.innerHTML = `.is_pc, .is_mb, .is_pc_flex, #popup {display: none !important}`;
    document.body.appendChild(hidead);

    //计算总时长
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

    //记录上次观看进度
    function cookies(val1, val2) {
        if (val1 != null && val2 != null) {
            let Day = new Date();
            Day.setTime(Day.getTime() + 10 * 24 * 60 * 60 * 1000);
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

    setTimeout(() => {
        if (window.location.pathname == "/dmplayer.html") {
            let myv = document.querySelector("video");
            let playtime = cookies("playtime");
            let tipmain = document.createElement("div");
            tipmain.id = "tipman";
            tipmain.style.zIndex = 10;
            tipmain.style.display = "none";
            tipmain.style.position = "fixed";
            tipmain.style.background = "gray";
            tipmain.style.color = "#fff";
            tipmain.style.borderRadius = "5px";
            // document.querySelector("#mplayer-media-wrapper").appendChild(tipmain);
            document.querySelector("#mplayer-media-wrapper").insertBefore(tipmain, document.querySelector("#mplayer-media-wrapper").firstElementChild)
            if (playtime != null) {
                if(!!navigator.userAgent.match(/(iPhone|iPad|Android|ios|iOS|WebOS|Windows Phone|Phone)/i)){
                    let tips = document.createElement("div");
                    let tipselect = document.createElement("div");
                    tipselect.style.color = "#eee";
                    tips.id = "tips";
                    tips.style.height = "30px";
                    tips.style.color = "#eee";
                    tips.innerText = "上次播放位置为" + vdoleng(playtime);
                    tipselect.innerHTML = '<span id="go_on" style="margin-right:10px;color: #00ffdc;">继续播放</span><span id="nplay" style="margin-left:10px">取消</span>';
                    tipmain.appendChild(tips);
                    tipmain.appendChild(tipselect);
                    tipmain.style.display = "block";
                    tipmain.style.left = document.querySelector("video").parentElement.clientWidth / 2 - tipmain.clientWidth / 2 + "px";
                    tipmain.style.top = document.querySelector("video").parentElement.clientHeight / 2 - tipmain.clientHeight / 2 + "px";
                    tipmain.style.textAlign = "center";
                    document.querySelector("#go_on").ontouchstart = function(){
                        myv.currentTime = playtime;
                        tipmain.style.display = "none";
                    }
                    document.querySelector("#nplay").ontouchstart = function(){
                        tipmain.style.display = "none";
                    }
                }else{
                    if(confirm("上次播放到" + vdoleng(playtime) + "是否继续播放？")){
                        myv.currentTime = playtime;
                    }
                }
            }
            setInterval(function () {
                cookies("playtime", myv.currentTime);
            }, 10000);
        }
    }, 5000);

})();