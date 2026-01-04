// ==UserScript==
// @name         EduZhiXin Controller
// @name:zh-cn   质心教育视频播放控制器
// @namespace    eduzhixincontroller
// @version      0.3
// @description  Use arrow keys to control the video of EduZhixin.
// @author       _Kerman
// @match        https://www.eduzhixin.com/page/live/**
// @icon         https://www.eduzhixin.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/449535/EduZhiXin%20Controller.user.js
// @updateURL https://update.greasyfork.org/scripts/449535/EduZhiXin%20Controller.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let msg = "";
    let tmpMsg = null;
    let tmpMsgStartTime = null;
    let tmpMsgTimeout = null;

    let neverPlayed=true;

    const fontSize = "25px"

    let retryCnt = 0;

    function fmtSec(value) {
        let result = value;
        let h = Math.floor(result / 3600)
        < 10
        ? "0" + Math.floor(result / 3600)
        : Math.floor(result / 3600);
        let m = Math.floor((result / 60) % 60)
        < 10
        ? "0" + Math.floor((result / 60) % 60)
        : Math.floor((result / 60) % 60);
        let s = Math.floor(result % 60)
        < 10
        ? "0" + Math.floor(result % 60)
        : Math.floor(result % 60);

        let res = "";
        if (h !== "00") res += `${h}时`;
        if (h!=="00" || m !== "00") res += `${m}分`;
        res += `${s}秒`;

        return res;
    }

    function main(){
        let v = document.getElementsByTagName("video")[0];
        let loadedTag = document.getElementsByClassName("prism-progress-loaded")[0];

        if(!v){
            retryCnt++;
            if(retryCnt>100)throw new Error();
            setTimeout(main,1000);
            return;
        }

        const deltaPBR = 0.2
        const sDeltaPBR = 0.1
        const deltaT = 10
        const sDeltaT = 5

        document.onkeydown=function(e){
            let c = e.keyCode;
            let s = e.shiftKey;
            let p = true;
            if(c===38){
                v.playbackRate+=s?sDeltaPBR:deltaPBR;
            }else if(c=== 40){
                v.playbackRate-=s?sDeltaPBR:deltaPBR;
            }else if(c===37){
                v.currentTime-=s?sDeltaT:deltaT;
            }else if(c===39){
                v.currentTime+=s?sDeltaT:deltaT;
            }else if(c===13){
                if(!window.player.fullscreenService.isFullScreen){
                    let btn = document.getElementsByClassName("prism-fullscreen-btn")[0];
                    btn.click();
                    setTmpMsg("Fullscreen.");
                }
            }else{
                p=false;
                if(c===32){
                    if(neverPlayed){
                        let btn = document.getElementsByClassName("prism-big-play-btn loading-center")[0];
                        if(btn.style.display!=="none"){
                            btn.click();
                        }
                        let btn2 = document.getElementsByClassName("prism-fullscreen-btn")[0];
                        if(!window.player.fullscreenService.isFullScreen){
                            btn2.click();
                        }
                    }
                }else{
                    return;
                }
            }
            update();
            if(p){
                e.preventDefault();
            }
        }

        let bkgr = document.createElement("div")
        bkgr.style.position = "fixed"
        bkgr.style.background="black"
        bkgr.style.zIndex=100000
        bkgr.style.width="100%"
        bkgr.style.left="0"
        bkgr.style.fontSize=fontSize;
        bkgr.style.height="1.2em"
        bkgr.style.bottom="0px"


        let progLoaded = document.createElement("div")
        progLoaded.style.position = "fixed"
        progLoaded.style.background="#555555"
        progLoaded.style.zIndex=100001
        progLoaded.style.width="0%"
        progLoaded.style.left="0"
        progLoaded.style.fontSize=fontSize;
        progLoaded.style.height="1.2em"
        progLoaded.style.bottom="0px"

        let prog = document.createElement("div")
        prog.style.position = "fixed"
        prog.style.background="grey"
        prog.style.zIndex=100002
        prog.style.width="0%"
        prog.style.left="0"
        prog.style.fontSize=fontSize;
        prog.style.height="1.2em"
        prog.style.bottom="0px"

        let tip = document.createElement("div")
        tip.innerHTML="Initializing"
        tip.style.position = "fixed"
        tip.style.background="transparent"
        tip.style.color="white"
        tip.style.zIndex=100003
        tip.style.width="100%"
        tip.style.left="0"
        tip.style.fontSize=fontSize;
        tip.style.height="1.2em"
        tip.style.bottom="0px"
        tip.style.textAlign="left"
        tip.style.fontFamily="Cascadian,Consolas"

        v.parentElement.parentElement.appendChild(bkgr)
        v.parentElement.parentElement.appendChild(progLoaded)
        v.parentElement.parentElement.appendChild(prog)
        v.parentElement.parentElement.appendChild(tip)

        v.addEventListener('playing', function () {
            neverPlayed=false;
            msg="Playing.";
            update();
        });
        v.addEventListener('waiting', function () {
            msg="Loading."
            update();
        });
        v.addEventListener('pause', function () {
            msg="Paused."
            update();
        });
        v.addEventListener('ended', function () {
            msg="Ended."
            update();
        });

        setTimeout(()=>{
            window.player._switchLevel(window.player._hls.levels[2].url)
        },1000)

        function setTmpMsg(m,out = 3000){
            tmpMsg=m;
            tmpMsgTimeout = out;
            tmpMsgStartTime = Date.now();
            update();
        }

        function update(){
            let date = new Date();
            let hour = ("0"+date.getHours()).slice(-2);
            let minute = ("0"+date.getMinutes()).slice(-2);

            if(tmpMsg){
                if(Date.now()-tmpMsgStartTime>tmpMsgTimeout){
                    tmpMsg=null;
                    tmpMsgStartTime=null;
                    tmpMsgTimeout=null
                }
            }

            let m = tmpMsg??msg;

            //let loadedPercent = parseInt(loadedTag.style.width.slice(0,-1));

            tip.innerHTML=
                `<div style="position:absolute;left:5%">${fmtSec(v.currentTime)} / ${fmtSec(v.duration)} (${(100*v.currentTime/v.duration).toFixed()}%)</div>
            <div style="position:absolute;left:40%">x${v.playbackRate.toFixed(1)}</div>
            <div style="position:absolute;left:70%">${m}</div>
            <div style="float:right;font-size:smaller">${hour}:${minute}</div>`
            prog.style.width=(100*v.currentTime/v.duration)+"%"
            progLoaded.style.width=loadedTag.style.width

            document.querySelector(".proton-award-box .confirm-button")?.click()
        }

        setInterval(update,1000);

        msg="Ready."

    }

    setTimeout(main,3000);

})();
