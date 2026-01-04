// ==UserScript==
// @name         修改流文件方式
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  支持手机端去广告
// @author       啦A多梦
// @license      MIT
// @include      /^https:\/\/.*?\.da?sh.*\/static\/player\/dplayer.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dshpbcgsvz.com
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/460486/%E4%BF%AE%E6%94%B9%E6%B5%81%E6%96%87%E4%BB%B6%E6%96%B9%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/460486/%E4%BF%AE%E6%94%B9%E6%B5%81%E6%96%87%E4%BB%B6%E6%96%B9%E5%BC%8F.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    if(document.createElement('video').canPlayType("application/vnd.apple.mpegurl") != ''){
        document.querySelector("body>script").remove();
        document.querySelector("body>div").remove();
        var _div = document.createElement("div");
        _div.id = "NewplayerCnt";
        _div.style = "width: 100%; height: 100%;";
        document.body.appendChild(_div);
        var dp = new DPlayer({
            container: document.getElementById('NewplayerCnt'),
            autoplay: true,
            screenshot: false,
            video: {
                url: parent.MacPlayer.PlayUrl,
                live: false,
                type: 'customHls',
                customType: {
                    customHls: function (video, player) {
                    const hls = new Hls()
                    hls.loadSource(video.src)
                    hls.attachMedia(video)
                    }
                }
            },
            contextmenu: [
 
            ]
        });
 
        dp.on('ended',function(){
            if(parent.MacPlayer.PlayLinkNext!=''){
                top.location.href = parent.MacPlayer.PlayLinkNext;
            }
        });
    }
 
    //手机滑动快进
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
    try{
        //快进音量等提示
        var showtime = document.createElement("span");
        showtime.id = "dplayer-speed";
        showtime.style = "padding: 5px; opacity: 0;position: absolute;background-color: rgba(0, 0, 0, 0.5);font-size: 100%;border-radius: 10px";
        showtime.innerText = "00:00";
        document.querySelector(".dplayer-bezel").insertBefore(showtime, document.querySelector(".dplayer-bezel-icon"));
 
        //左上角显示当前时间
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
 
        var myv = document.querySelector("video");
        // document.querySelector("#dplayer-speed").style.left = (myv.clientWidth / 2 - document.querySelector("#dplayer-speed").clientWidth / 2) + "px";
        // document.querySelector("#dplayer-speed").style.top = (myv.clientHeight / 2 - document.querySelector("#dplayer-speed").clientHeight / 2) + "px";
        var tstart = 0;    //触摸起始X坐标
        var vtime = 0;     //视频总计时长
        var ctime = 0;     //视频当前播放进度
        var tend = 0;      //滑动屏幕最终X坐标
        var beisu = ""     //倍速播放
        var vstart = 0;    //音量
        var vend = 0;      //音量Y坐标偏移
        var tsf = 0;       //当前音量
        var tsfm = 0;      //调整后音量
        var pse = 0;       //画面中间提示渐隐初始值
        var lckx = 1;      //锁定拖动进度条X轴
        var lcky = 1;      //锁定拖动进度条Y轴
        myv.addEventListener("loadedmetadata", function(){
            vtime = myv.duration;
        })
 
        // 监听触屏事件
        myv.addEventListener("touchstart", (event => {
            document.querySelector("#dplayer-speed").style.display = "block";
            if(document.fullscreen == true){
                pse += 1;
                var cpsp = setTimeout(()=>{
                    pse = 0;
                }, 500);
            }
            ctime = myv.currentTime;
            tsf = myv.volume;
            vstart = event.targetTouches[0].pageY;
            tstart = event.targetTouches[0].pageX;
            beisu = setTimeout(() => {
                navigator.vibrate(100);
                myv.playbackRate = 3;
                document.querySelector("#dplayer-speed").innerText = "快进X3>>";
                document.querySelector("#dplayer-speed").style.left = (myv.clientWidth / 2 - document.querySelector("#dplayer-speed").clientWidth / 2) + "px";
                document.querySelector("#dplayer-speed").style.top = (myv.clientHeight / 2 - document.querySelector("#dplayer-speed").clientHeight / 2) + "px";
                document.querySelector("#dplayer-speed").style.opacity = 1;
            }, 800);
        }))
 
        // 监听触屏滑动事件
        myv.addEventListener("touchmove", (event => {
            if (myv.playbackRate == 1) {
                clearTimeout(beisu);
                tend = event.targetTouches[0].pageX - tstart;
                vend = event.targetTouches[0].pageY - vstart;
                if (Math.abs(tend) * lckx > Math.abs(vend) * lcky) {
                    lcky = 0;
                    document.querySelector(".dplayer-played").style.width = (((ctime + Math.floor(tend)/10) / vtime) * 100).toString() + "%";
                    document.querySelector("#dplayer-speed").innerText = (ctime + Math.floor(tend)/10) > vtime ? vdoleng(vtime) : vdoleng((ctime + Math.floor(tend)/10));
                    document.querySelector("#dplayer-speed").style.left = (myv.clientWidth / 2 - document.querySelector("#dplayer-speed").clientWidth / 2) + "px";
                    document.querySelector("#dplayer-speed").style.top = (myv.clientHeight / 2 - document.querySelector("#dplayer-speed").clientHeight / 2) + "px";
                    document.querySelector("#dplayer-speed").style.opacity = 1;
                } else {
                    lckx = 0;
                    tsfm = tsf - vend / 100;
                    if (tsfm >= 1) {
                        tsfm = 1
                    } else if (tsfm <= 0) {
                        tsfm = 0
                    }
                    myv.volume = Math.floor(tsfm * 100) / 100;
                    document.querySelector("#dplayer-speed").innerText = "音量:" + (Math.floor(myv.volume * 100)) + "%";
                    document.querySelector("#dplayer-speed").style.left = (myv.clientWidth / 2 - document.querySelector("#dplayer-speed").clientWidth / 2) + "px";
                    document.querySelector("#dplayer-speed").style.top = (myv.clientHeight / 2 - document.querySelector("#dplayer-speed").clientHeight / 2) + "px";
                    document.querySelector("#dplayer-speed").style.opacity = 1;
                    tend = 0;
                }
            } else {
                tend = 0;
            }
        }))
 
        // 监听手指离开屏幕事件
        myv.addEventListener("touchend", function () {
            if(pse == 2){
                myv.paused == true ? myv.play() : myv.pause();
            }
            clearTimeout(beisu);
            if (Math.abs(tend) > 10) {
                myv.currentTime = (ctime + Math.floor(tend)/10) > vtime ? vtime : ctime + Math.floor(tend)/10;
            }
            if (myv.playbackRate != 1) {
                myv.playbackRate = 1;
            }
            var opcity = setInterval(function(){
                document.querySelector("#dplayer-speed").style.opacity -= 0.1;
                if(document.querySelector("#dplayer-speed").style.opacity <= 0){
                    document.querySelector("#dplayer-speed").style.display = "none";
                    clearInterval(opcity);
                }
            },50);
            document.querySelector(".dplayer-mask").style.display = "none";
            document.querySelector(".dplayer-menu").style.display = "none";
            document.querySelector(".dplayer-controller-mask").style.display = "none";
            lcky = lckx = 1;
            tend = 0;
        })
 
        myv.addEventListener("pause" , function(){
            document.querySelector("div.dplayer-bezel > span.dplayer-bezel-icon > svg > path").attributes.d.value = "M14.080 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048zM2.88 4.8q2.88 0 2.88 2.048v18.24q0 2.112-2.88 2.112t-2.88-2.112v-18.24q0-2.048 2.88-2.048z";
            document.querySelector(".dplayer-bezel-icon").style.opacity = 1;
        })
 
        myv.addEventListener("playing", function(){
            var icon = setInterval(function(){
                document.querySelector("div.dplayer-bezel > span.dplayer-bezel-icon > svg > path").attributes.d.value = "M15.552 15.168q0.448 0.32 0.448 0.832 0 0.448-0.448 0.768l-13.696 8.512q-0.768 0.512-1.312 0.192t-0.544-1.28v-16.448q0-0.96 0.544-1.28t1.312 0.192z";
                document.querySelector(".dplayer-bezel-icon").style.opacity -= 0.1;
                if(document.querySelector(".dplayer-bezel-icon").style.opacity <= 0){
                    document.querySelector(".dplayer-bezel-icon").style.opacity = 0;
                    clearInterval(icon);
                }
            },50);
        })
    } catch(err){}
 
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
    if (window.location.pathname == '/static/player/dplayer.html' && document.querySelector("video") != null) {
        let myv = document.querySelector("video");
        let playtime = cookies("playtime");
        if (playtime != null) {
            if(!!navigator.userAgent.match(/(iPhone|iPad|Android|ios|iOS|WebOS|Windows Phone|Phone)/i)){
                document.querySelector("div.dplayer-menu > div:nth-child(1)").style.display = "none";
                document.querySelector("div.dplayer-menu > div:nth-child(2)").style.display = "none";
                let tips = document.createElement("div");
                let tipselect = document.createElement("div");
                tipselect.style.color = "#eee";
                tips.id = "tips";
                tips.style.height = "30px";
                tips.style.color = "#eee";
                tips.innerText = "上次播放位置为" + vdoleng(playtime);
                tipselect.innerHTML = '<span id="go_on" style="margin-right:10px;color: #00ffdc;">继续播放</span><span id="nplay" style="margin-left:10px">取消</span>';
                document.querySelector(".dplayer-menu").appendChild(tips);
                document.querySelector(".dplayer-menu").appendChild(tipselect);
                document.querySelector(".dplayer-menu").style.display = "block";
                document.querySelector(".dplayer-menu").style.left = (myv.clientWidth / 2 - document.querySelector(".dplayer-menu").clientWidth / 2) + "px";
                document.querySelector(".dplayer-menu").style.top = (myv.clientHeight / 2 - document.querySelector(".dplayer-menu").clientHeight / 2) + "px";
                document.querySelector(".dplayer-menu").style.textAlign = "center";
                document.querySelector("#go_on").ontouchstart = function(){
                    myv.currentTime = playtime;
                    document.querySelector(".dplayer-menu").style.display = "none";
                }
                document.querySelector("#nplay").ontouchstart = function(){
                    document.querySelector(".dplayer-menu").style.display = "none";
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
 
})();