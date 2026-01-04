// ==UserScript==
// @name         斗鱼画中画弹幕
// @namespace    Rewritten from qwq0
// @version      0.11
// @description  斗鱼画中画支持显示弹幕
// @author       QwQ~
// @match			*://*.douyu.com/0*
// @match			*://*.douyu.com/1*
// @match			*://*.douyu.com/2*
// @match			*://*.douyu.com/3*
// @match			*://*.douyu.com/4*
// @match			*://*.douyu.com/5*
// @match			*://*.douyu.com/6*
// @match			*://*.douyu.com/7*
// @match			*://*.douyu.com/8*
// @match			*://*.douyu.com/9*
// @match			*://*.douyu.com/topic/*
// @match        *://www.douyu.com/member/cp/getFansBadgeList
// @match        *://passport.douyu.com/*
// @match        *://msg.douyu.com/*
// @match        *://yuba.douyu.com/*
// @match        *://v.douyu.com/*
// @match        *://cz.douyu.com/*
// @icon         https://www.douyu.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/482765/%E6%96%97%E9%B1%BC%E7%94%BB%E4%B8%AD%E7%94%BB%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/482765/%E6%96%97%E9%B1%BC%E7%94%BB%E4%B8%AD%E7%94%BB%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

setTimeout(function() {
    'use strict';
    function setValue(name, value)
    {
        if(GM_setValue)
            GM_setValue(name, value);
    }
    function getValue(name, defaultValue)
    {
        return (GM_getValue ? GM_getValue(name, defaultValue) : defaultValue);
    }

    let videoHolder = null;
    let video = null;

    let width = 0;
    let height = 0;

    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    let canvasWidth = canvas.width = 0;
    let canvasHeight = canvas.height = 0;
    let danmuFontsize = 0;
    let textCanvas = document.createElement("canvas");
    let textCanvasContext = textCanvas.getContext("2d");
    let nVideo = document.createElement("video");

    let timeoutId = 0;
    let forceRequestAnimationFrame = false;

    let isFirefox = navigator.userAgent.indexOf("Firefox") > -1;

    if(isFirefox)
    {
        document.body.appendChild(nVideo);
        nVideo.style.position = "fixed";
        nVideo.style.zIndex = 10000;
        nVideo.style.left = "0";
        nVideo.style.top = "85px";
        nVideo.style.width = "30px";
        nVideo.style.height = "30px";
        nVideo.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        timeoutId = setTimeout(draw, Math.floor(1000 / 60));
    }
    let lastPlayOrPauseTime = 0;
    nVideo.addEventListener("play", ()=>{
        if(video && performance.now() - lastPlayOrPauseTime > 15)
        {
            lastPlayOrPauseTime = performance.now();
            video.play();
        }
    });
    nVideo.addEventListener("pause", ()=>{
        if(video && performance.now() - lastPlayOrPauseTime > 15)
        {
            lastPlayOrPauseTime = performance.now();
            video.pause();
        }
    });

    let danmuList = [];
    let danmuLine = [];
    let danmuCount = 0;
    let danmuMaxLine = 12;
    let danmuLogOutput = false;

    let danmuHolder = null;
    async function addDanmu(text, color)
    {
        if(text != "" && timeoutId && (danmuList.length <= 20 || Math.random() < 20 / danmuList.length))
        {
            danmuCount++;
            let lineNum = 0;
            for(let i=0;i < 5 && danmuLine[lineNum] + 6 >= danmuCount;i++)
            {
                lineNum = Math.floor(Math.random() * danmuMaxLine);
            }
            danmuLine[lineNum] = danmuCount;
            if(!color)
                color = "rgb(255, 255, 255)";
            let textWidth = textCanvasContext.measureText(text).width;
            textCanvasContext.clearRect(0, 0, textWidth, danmuFontsize);
            textCanvasContext.fillStyle = color;
            textCanvasContext.fillText(text, 0, 0);
            if(textWidth > 0)
                danmuList.push({text: text, color: color, x: canvasWidth, y: lineNum * danmuFontsize, w: textWidth, i: await createImageBitmap(textCanvas, 0, 0, textWidth, danmuFontsize) });
        }
    }
    function getColorClass(content)
    {
    // 根据内容返回对应的颜色类
    if (content.match(/0/)) {
        return 'rgb(255 0 0)';
    } else if (content.match(/1/)) {
        return 'rgb(30 135 240)';
    } else if (content.match(/2/)) {
        return 'rgb(122 200 75)';
    } else if ( content.match(/3/)) {
        return 'rgb(255 127 0)';
    } else if (content.match(/4/)) {
        return 'rgb(155 57 244)';
    } else if (content.match(/5/)) {
        return 'rgb(255 105 180)';
    }else {
        return 'rgb(255, 255, 255)'; // 默认颜色
    }
    }

    let danmuObserver = new MutationObserver(e => {
        e.forEach(o=>{
            // console.log("danmu(all)", o);
            if(o.type == "childList")
            {
                o.addedNodes.forEach(ele =>{
                    // console.log("danmu(ele)", ele);
                    ele=ele.querySelector('[class^="Barrage-content"]');
                    if(ele.innerText)
                    {
                        let text = String(ele.innerText);
                        let color = getColorClass(ele.className);
                        // if(!color)
                        //     color = ele.style.getPropertyValue("--color");
                        if(ele.style.opacity != "0")
                            addDanmu(text.split("\n")[0], color);
                        if(danmuLogOutput)
                            console.log("danmu(it)", color, text, ele);
                    }
                    else if(ele.textContent)
                    {
                        let text = String(ele.textContent);
                        let color = getColorClass(ele.className);
                        // if(!color)
                        //     color = o.target.style.getPropertyValue("--color");
                        addDanmu(text.split("\n")[0], color);
                        if(danmuLogOutput)
                            console.log("danmu(ct)", color, text, ele);
                    }
                });
            }
        });
    });
    setInterval(()=>{
        let nowVideoHolder = document.getElementsByClassName("layout-Player-video")[0]||
            document.getElementById("room-Player-Box") ||
            document.getElementsByClassName("room-html5-player")[0];

        if(!nowVideoHolder)
            return;
        let nowVideo = nowVideoHolder.getElementsByTagName("video")[0];
        if(nowVideo && video != nowVideo)
        {
            videoHolder = nowVideoHolder;
            video = nowVideo;
            video.addEventListener("play", ()=>{
                console.log("[斗鱼画中画弹幕]", "视频播放");
                nVideo.play();
            });
            video.addEventListener("pause", ()=>{
                console.log("[斗鱼画中画弹幕]", "视频暂停");
                nVideo.pause();
            });
            video.addEventListener("enterpictureinpicture",() => {
                if(!timeoutId)
                {
                    timeoutId = setTimeout(draw, Math.floor(1000 / 60));
                    setTimeout(()=>{
                        nVideo.requestPictureInPicture();
                        nVideo.play();
                    }, 250);
                }
                else
                {
                    nVideo.requestPictureInPicture();
                    nVideo.play();
                }
                video.style.display = "none";
            });

            let style = document.createElement("style");
            style.innerText = `
            .bpx-player-ctrl-btn.bpx-player-ctrl-pip, .bilibili-player-video-btn.bilibili-player-video-btn-pip.closed
            {
                filter: drop-shadow(1px 1px 3px #49e3dc);
            }
            `;
            document.body.appendChild(style);
            if(navigator.mediaSession)
            {
                try
                {
                    navigator.mediaSession.setActionHandler("play", ()=>{
                        video.play();
                        nVideo.play();
                    });
                    navigator.mediaSession.setActionHandler("pause", ()=>{
                        video.pause();
                        nVideo.pause();
                    });
                }
                catch(err)
                {
                    console.warn("[斗鱼画中画弹幕]", "绑定媒体功能键时发生错误");
                }
            }
        }
        let nowDanmuHolder = document.getElementsByClassName(" Barrage")[0];
            // ||document.getElementsByClassName("bpx-player-row-dm-wrap")[0] ||
            // document.getElementsByClassName("web-player-danmaku")[0] ||
            // document.getElementsByClassName("danmaku-screen")[0];
        if(nowDanmuHolder != danmuHolder || width != video.videoWidth || height != video.videoHeight)
        {
            danmuHolder = nowDanmuHolder;
            danmuObserver.disconnect();
            width = video.videoWidth;
            height = video.videoHeight;
            canvasWidth = canvas.width = (Math.min(height, width) < 700 ? width : Math.floor(width / 2));
            canvasHeight = canvas.height = (Math.min(height, width) < 700 ? height : Math.floor(height / 2));
            textCanvas.height = danmuFontsize = Math.floor(Math.min(canvasWidth, canvasHeight) / 14.5);
            textCanvas.width = danmuFontsize * 35;

            textCanvasContext.textBaseline = "top";
            textCanvasContext.shadowBlur = 3;
            textCanvasContext.shadowColor = "rgb(0, 0, 0)";
            textCanvasContext.font = danmuFontsize + 'px SimHei,"Microsoft JhengHei",Arial,Helvetica,sans-serif';

            nVideo.srcObject = canvas.captureStream(60);
            setTimeout(() =>
            {
                if(video && !video.paused)
                    nVideo.play();
            }, 1500);
            danmuObserver.observe(danmuHolder, { childList: true, subtree: true });
            console.log("[斗鱼画中画弹幕]", "视频切换");
            console.log("[斗鱼画中画弹幕]", "视频分辨率", width, height);
            console.log("[斗鱼画中画弹幕]", "渲染分辨率", canvasWidth, canvasHeight);
        }
    }, 900);

    let lastTime = performance.now();
    function draw()
    {
        let nowTime = performance.now();
        let timeInterval = nowTime - lastTime;
        lastTime = nowTime;
        if(video)
        {
            context.globalAlpha = 1;
            context.drawImage(video, 0, 0, width, height, 0, 0, canvasWidth, canvasHeight);
            if(video.readyState >= 1)
            {
                context.globalAlpha = 0.7;
                danmuList.forEach(o => {
                    context.drawImage(o.i, Math.floor(o.x), Math.floor(o.y));
                    if(!video.paused)
                    {
                        o.x -= timeInterval * danmuFontsize * 0.0035;
                    }
                });
                danmuList = danmuList.filter(o => (o.x >= -o.w));
            }
            else
            {
                danmuList = [];
            }
        }
        if(forceRequestAnimationFrame || isFirefox)
            timeoutId = requestAnimationFrame(draw);
        else
            timeoutId = setTimeout(draw, Math.floor(1000 / 60));
    }
    let pipdmCommandObj = {
        help: ()=>{
            console.log("[斗鱼画中画弹幕]", ([
                "斗鱼画中画弹幕插件指令帮助",
                "pipdm.maxLine 修改斗鱼画中画弹幕最大行数",
                "pipdm.danmuLog 开启弹幕日志输出",
                "pipdm.help 显示此帮助文本"
            ]).join("\n"));
        },
        maxLine: ()=>{
            let newValue = 0 | (prompt("设置斗鱼画中画弹幕最大行数", danmuMaxLine));
            if(newValue != undefined && newValue >= 0)
                danmuMaxLine = newValue;
        },
        danmuLog: ()=>{
            console.log("[斗鱼画中画弹幕]", "已开启弹幕日志输出");
            danmuLogOutput = true;
        }
    };
    window.pipdm = new Proxy({
        maxLine: "修改斗鱼画中画弹幕最大行数",
        danmuLog: "开启弹幕日志输出",
        help: "显示指令帮助"
    }, {
        get: (target, key)=>{
            if(pipdmCommandObj[key])
                pipdmCommandObj[key]();
            else
                console.log("[斗鱼画中画弹幕]", "不存在此指令\n输入 pipdm.help 以显示指令帮助");
        }
    });

    console.log("[斗鱼画中画弹幕]", "已加载");
    console.log("[斗鱼画中画弹幕]", "输入 pipdm.help 以显示指令帮助");
}, 500);