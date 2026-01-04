// ==UserScript==
// @name         茶杯狐(手机版)
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  茶杯狐去除广告
// @author       啦A多梦
// @license      MIT
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @run-at       document-body
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462819/%E8%8C%B6%E6%9D%AF%E7%8B%90%28%E6%89%8B%E6%9C%BA%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/462819/%E8%8C%B6%E6%9D%AF%E7%8B%90%28%E6%89%8B%E6%9C%BA%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    if(!/ipad|iphone|android|mobile/gi.test(navigator.userAgent)){return};
    console.log(navigator.userAgent);
    if(window.location.href.indexOf("cupfox") != -1 || parent != window && window.location.ancestorOrigins[window.location.ancestorOrigins.length-1].indexOf("cupfox") != -1){
        var style = document.createElement("style");
        style.innerHTML = "#popup, .ec-ad, .player-news, #player_pic, .ads, .ad, .stui-pannel, #HMcoupletDivleft, #HMcoupletDivright, .cupfox-img, #index_banner, .dplayer-menu, #note, #mhbottom_ad_box, #adv, #bfad1, #bfad2, #bfad3, #bfad4, #bfad5, #bfad6, #xqad1, #xqad2, #xqad3, #xqad4, #xqad5, #xqad6, #fix_bottom_dom, #ad, .ads_w, .tips, #HMRichBox, #buffer, #adv_wrap_hh, .tips-box, .head-guide>.banner, .main > .cupfox-box, .border-shadow > div > .cupfox-box {display: none !important}";
        document.head.appendChild(style);
        // 去除人人影视右下角广告
        if(window.location.href.indexOf("rrets") != -1){
            try{
                document.querySelector("#close1").parentElement.style.display = 'none';
            } catch(err){}
        }

        //获取m3u8地址去广告
        var open = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function (method, url, async) {
            if (url.indexOf(".m3u8") != -1) {
                console.log("捕获m3u8地址->",url);
                // console.log(this.readyState);
                this.addEventListener("readystatechange", function () {
                    if(this.readyState == 4){
                        var _responsetext = this.responseText;
                        // console.log(_responsetext);
                        Object.defineProperty(this, "responseText",{
                            writable: true,
                        });
                        this.responseText = _responsetext.replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts").replace(/\.ts\n#EXT-X-DISCONTINUITY([\s\S]*?)#EXT-X-DISCONTINUITY/, "\.ts");
                        console.log(this.responseText);
                    }
                })
            }

            return open.apply(this, arguments);
        }
    // 修改HDmoli播放器
        var fpathname = window.location.pathname;
        var fsearc = window.location.search;
        if (fpathname == '/js/player/videojs/videojs.html') {
            window.location = '/js/player/dplayer/dplayer.html' + fsearc;
        }

        function changeplayer() {
            if (fpathname == '/js/player/dplayer/dplayer.html') {
                // 秒数转时间格式
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

                var myv = document.querySelector("video");
                var timetip = document.createElement("div");
                var jindu = document.createElement("div");
                jindu.innerText = vdoleng(myv.duration);
                jindu.style.position = "absolute";
                jindu.style.display = "none";
                jindu.style.top = myv.clientHeight / 2 - jindu.clientHeight / 2 + "px";
                jindu.style.left = myv.clientWidth / 2 - jindu.clientWidth / 2 + "px";
                jindu.style.padding = "5px";
                jindu.style.borderRadius = "5px";
                jindu.style.background = "rgb(48 48 48 / 50%)";
                jindu.style.textAlign = "center";
                jindu.style.color = "white";

                timetip.style.position = "absolute";
                timetip.style.display = "none";
                timetip.style.top = 0;
                timetip.style.left = 0;
                timetip.innerText = "00:00:00";
                timetip.style.padding = "5px";
                timetip.style.borderRadius = "5px";
                timetip.style.background = "rgb(48 48 48 / 50%)";
                timetip.style.textAlign = "center";
                timetip.style.color = "white";
                myv.parentElement.parentElement.appendChild(timetip);
                myv.parentElement.parentElement.appendChild(jindu);
                document.querySelector(".dplayer-comment").style.display = "inline-block";
                document.querySelector(".dplayer-comment").children[0].children[0].innerText = "T";
                document.querySelector(".dplayer-comment").children[0].children[0].style.color = "#fff";
                document.querySelector(".dplayer-comment").ontouchend = function () {
                    timetip.style.display == "none" ? timetip.style.display = "block" : timetip.style.display = "none";
                }
                setInterval(function(){
                    var nowtime = new Date();
                    timetip.innerText = nowtime.toLocaleTimeString()
                }, 1000);

                var dbtouch = 0;//双击计数
                var currplaytime = 0;
                var playtime = 0;
                var startX = 0;
                var tmv = 0, beisu;
                myv.addEventListener("touchstart", function (event) {
                    startX = event.targetTouches[0].pageX;
                    playtime = myv.currentTime;
                    dbtouch++;
                    setTimeout(function () {
                        dbtouch = 0;
                    }, 800);
                    beisu = setTimeout(function(){
                        if(!myv.paused){
                            navigator.vibrate(100);
                            myv.playbackRate = 3;
                            jindu.style.display = "block";
                            jindu.innerText = '快进X3';
                            jindu.style.top = myv.clientHeight / 2 - jindu.clientHeight / 2 + "px";
                            jindu.style.left = myv.clientWidth / 2 - jindu.clientWidth / 2 + "px";
                        }
                    }, 800);
                })
                myv.addEventListener("touchmove", function (e) {
                    currplaytime = playtime + ((e.targetTouches[0].pageX - startX) / 2);
                    tmv++;
                    jindu.style.display = "block";
                    jindu.innerText = vdoleng(currplaytime);
                    jindu.style.top = myv.clientHeight / 2 - jindu.clientHeight / 2 + "px";
                    jindu.style.left = myv.clientWidth / 2 - jindu.clientWidth / 2 + "px";
                })
                myv.addEventListener("touchend", function () {
                    if (dbtouch >= 2) {
                        myv.paused ? myv.play() : myv.pause();
                        dbtouch = 0;
                    }
                    if (tmv >= 1 && Math.abs(currplaytime - myv.currentTime) > 10) {
                        myv.currentTime = currplaytime;
                    }
                    tmv = 0;
                    currplaytime = 0;
                    playtime = 0;
                    startX = 0;
                    jindu.style.display = "none";
                    clearTimeout(beisu);
                    myv.playbackRate = 1;
                })
            }
        }

        setTimeout(changeplayer, 5000);
    }
})();