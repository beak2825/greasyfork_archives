// ==UserScript==
// @name         哔哩哔哩画中画弹幕
// @namespace    qwq0
// @version      0.28
// @description  哔哩哔哩画中画支持显示弹幕
// @author       QwQ~
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/medialist/play/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://live.bilibili.com/*
// @match        https://www.acfun.cn/v/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/447652/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%94%BB%E4%B8%AD%E7%94%BB%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/447652/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E7%94%BB%E4%B8%AD%E7%94%BB%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

setTimeout(function ()
{
    "use strict";
    function setValue(name, value)
    {
        if (window["GM_setValue"])
            GM_setValue(name, value);
    }
    function getValue(name, defaultValue)
    {
        return (window["GM_getValue"] ? GM_getValue(name, defaultValue) : defaultValue);
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
    let textCanvasArray = Array(3).fill(0).map(() => document.createElement("canvas"));
    let textCanvasContextArray = textCanvasArray.map(o => o.getContext("2d"));
    let nVideo = document.createElement("video");

    let timeoutId = 0;
    let forceRequestAnimationFrame = true;

    let isFirefox = navigator.userAgent.indexOf("Firefox") > -1;

    if (isFirefox)
    {
        document.body.appendChild(nVideo);
        nVideo.style.position = "fixed";
        nVideo.style.zIndex = 10000;
        nVideo.style.left = "0";
        nVideo.style.top = "85px";
        nVideo.style.width = "30px";
        nVideo.style.height = "30px";
        nVideo.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
        init();
    }

    function init()
    {
        timeoutId = setTimeout(draw, Math.floor(1000 / 60));
        Object.defineProperty(document, "hidden", { value: false });
        Object.defineProperty(document, "visibilityState", { value: "visible" })
    }

    let lastPlayOrPauseTime = 0;
    nVideo.addEventListener("play", () =>
    {
        if (video && performance.now() - lastPlayOrPauseTime > 15)
        {
            lastPlayOrPauseTime = performance.now();
            video.play();
        }
    });
    nVideo.addEventListener("pause", () =>
    {
        if (video && performance.now() - lastPlayOrPauseTime > 15)
        {
            lastPlayOrPauseTime = performance.now();
            video.pause();
        }
    });

    let customDanmuMaxLine = getValue("danmuMaxLine", 12);

    let danmuList = [];
    let danmuLineMaxX = [];
    let danmuLineLock = [];
    let danmuMaxLine = Number(customDanmuMaxLine ? customDanmuMaxLine : 12);
    let danmuMaxCount = 50;
    let danmuLogOutput = false;
    let danmuRendering = false;

    if (!Number.isInteger(danmuMaxLine))
        danmuMaxLine = 12;

    async function addDanmu(text, color)
    {
        if (
            text != "" &&
            timeoutId &&
            !danmuRendering &&
            textCanvasContextArray.length > 0 &&
            danmuList.length <= danmuMaxCount &&
            (danmuList.length <= 20 || Math.random() < 20 / danmuList.length)
        )
        {
            let lineNum = 0;
            for (let i = 0; i < danmuMaxLine; i++)
            {
                lineNum = i;
                if (!(danmuLineMaxX[lineNum] > canvasWidth || danmuLineLock[lineNum]))
                    break;
                else if (i + 1 == danmuMaxLine)
                    return;
            }
            if (!color)
                color = "rgb(255, 255, 255)";

            let textCanvasContext = textCanvasContextArray.pop();
            let textCanvas = textCanvasContext.canvas;

            let textWidth = textCanvasContext.measureText(text).width;
            textCanvasContext.clearRect(0, 0, textWidth, danmuFontsize);
            textCanvasContext.fillStyle = color;
            textCanvasContext.fillText(text, 0, 0);
            if (textWidth > 0)
            {
                danmuLineLock[lineNum] = true;
                danmuList.push({ text: text, color: color, x: canvasWidth, y: lineNum * danmuFontsize, l: lineNum, w: textWidth, i: await createImageBitmap(textCanvas, 0, 0, textWidth, danmuFontsize) });
                danmuLineLock[lineNum] = false;
                danmuLineMaxX[lineNum] = canvasWidth + textWidth;
            }
            textCanvasContextArray.push(textCanvasContext);
        }
    }
    let danmuObserver = new MutationObserver(e =>
    {
        e.forEach(o =>
        {
            // console.log("danmu(all)", o);
            if (o.type == "childList")
            {
                o.addedNodes.forEach(ele =>
                {
                    // console.log("danmu(ele)", ele);
                    if (ele.innerText)
                    {
                        let text = String(ele.innerText);
                        let color = ele.style.color;
                        if (!color)
                            color = ele.style.getPropertyValue("--color");
                        if (ele.style.opacity != "0")
                            addDanmu(text.split("\n")[0], color);
                        if (danmuLogOutput)
                            console.log("danmu(it)", color, text, ele);
                    }
                    else if (ele.textContent)
                    {
                        let text = String(ele.textContent);
                        let color = o.target.style.color;
                        if (!color)
                            color = o.target.style.getPropertyValue("--color");
                        addDanmu(text.split("\n")[0], color);
                        if (danmuLogOutput)
                            console.log("danmu(ct)", color, text, ele);
                    }
                });
            }
        });
    });

    let danmuHolder = null;
    let subtitlePanel = null;
    setInterval(() =>
    {
        let nowVideoHolder = document.getElementsByClassName("bilibili-player-video")[0] ||
            document.getElementsByClassName("bpx-player-video-wrap")[0] ||
            document.getElementById("live-player") ||
            document.getElementsByClassName("container-video")[0];

        if (!nowVideoHolder)
            return;

        let nowVideo = nowVideoHolder.getElementsByTagName("video")[0];
        if (nowVideo && video != nowVideo)
        {
            videoHolder = nowVideoHolder;
            video = nowVideo;
            video.addEventListener("play", () =>
            {
                console.log("[哔哩哔哩画中画弹幕]", "视频播放");
                nVideo.play();
            });
            video.addEventListener("pause", () =>
            {
                console.log("[哔哩哔哩画中画弹幕]", "视频暂停");
                nVideo.pause();
            });
            video.addEventListener("enterpictureinpicture", () =>
            {
                if (!timeoutId)
                {
                    init();
                    setTimeout(() =>
                    {
                        nVideo.requestPictureInPicture();
                        nVideo.play();
                    }, 250);
                }
                else
                {
                    nVideo.requestPictureInPicture();
                    nVideo.play();
                }
            });
            let style = document.createElement("style");
            style.innerText = `
            .bpx-player-ctrl-btn.bpx-player-ctrl-pip, .bilibili-player-video-btn.bilibili-player-video-btn-pip.closed
            {
                filter: drop-shadow(1px 1px 3px #49e3dc);
            }
            `;
            document.body.appendChild(style);
            if (navigator.mediaSession)
            {
                try
                {
                    navigator.mediaSession.setActionHandler("play", () =>
                    {
                        video.play();
                        nVideo.play();
                    });
                    navigator.mediaSession.setActionHandler("pause", () =>
                    {
                        video.pause();
                        nVideo.pause();
                    });
                }
                catch (err)
                {
                    console.warn("[哔哩哔哩画中画弹幕]", "绑定媒体功能键时发生错误");
                }
            }
        }

        let nowDanmuHolder = document.getElementsByClassName("bilibili-player-video-danmaku")[0] ||
            document.getElementsByClassName("bpx-player-row-dm-wrap")[0] ||
            document.getElementsByClassName("web-player-danmaku")[0] ||
            document.getElementsByClassName("danmaku-screen")[0];

        if (nowDanmuHolder != danmuHolder || width != video.videoWidth || height != video.videoHeight)
        {
            danmuHolder = nowDanmuHolder;
            danmuObserver.disconnect();
            width = video.videoWidth;
            height = video.videoHeight;
            canvasWidth = canvas.width = (Math.min(height, width) < 700 ? width : Math.floor(width / 2));
            canvasHeight = canvas.height = (Math.min(height, width) < 700 ? height : Math.floor(height / 2));
            danmuFontsize = Math.floor(Math.min(canvasWidth, canvasHeight) / 14.5);
            textCanvasArray.forEach(o =>
            {
                o.height = danmuFontsize;
                o.width = danmuFontsize * 35;
            });
            textCanvasContextArray.forEach(o =>
            {
                o.textBaseline = "top";
                o.shadowBlur = 3;
                o.shadowColor = "rgb(0, 0, 0)";
                o.font = `${danmuFontsize}px SimHei,"Microsoft JhengHei",Arial,Helvetica,sans-serif`;
            });


            nVideo.srcObject = canvas.captureStream(60);
            setTimeout(() =>
            {
                if (video && !video.paused)
                    nVideo.play();
            }, 1500);
            danmuObserver.observe(danmuHolder, { childList: true, subtree: true });
            console.log("[哔哩哔哩画中画弹幕]", "视频切换");
            console.log("[哔哩哔哩画中画弹幕]", "视频分辨率", width, height);
            console.log("[哔哩哔哩画中画弹幕]", "渲染分辨率", canvasWidth, canvasHeight);
        }


        let nowSubtitlePanel = document.getElementsByClassName("bili-subtitle-x-subtitle-panel-major-group")[0];
        subtitlePanel = nowSubtitlePanel;
    }, 900);

    let lastTime = performance.now();
    function draw()
    {
        let nowTime = performance.now();
        let timeInterval = nowTime - lastTime;
        lastTime = nowTime;
        if (video)
        {
            context.globalAlpha = 1;
            context.drawImage(video, 0, 0, width, height, 0, 0, canvasWidth, canvasHeight);
            if (video.readyState >= 1)
            {
                context.globalAlpha = 0.7;
                danmuLineMaxX.length = 0;
                danmuList = danmuList.filter(o =>
                {
                    if (!video.paused)
                        o.x -= timeInterval * danmuFontsize * 0.0035;
                    let rightX = o.x + o.w;
                    if (rightX <= 0)
                        return false;
                    context.drawImage(o.i, Math.round(o.x), Math.round(o.y));
                    if (!(rightX <= danmuLineMaxX[o.l]))
                        danmuLineMaxX[o.l] = rightX;
                    return true;
                });

                let subtitleText = (subtitlePanel ? subtitlePanel.innerText : "");
                if (subtitleText)
                {
                    context.globalAlpha = 0.5;
                    context.fillStyle = "rgb(0, 0, 0)";
                    let subtitleWidth = context.measureText(subtitleText).width;
                    context.fillRect((canvasWidth - subtitleWidth) / 2, canvasHeight - danmuFontsize * 1.5, subtitleWidth, danmuFontsize);

                    context.globalAlpha = 1;
                    context.textBaseline = "bottom";
                    context.textAlign = "center";
                    context.font = `${danmuFontsize}px SimHei,"Microsoft JhengHei",Arial,Helvetica,sans-serif`;
                    context.fillStyle = "rgb(255, 255, 255)";
                    context.fillText(subtitleText, canvasWidth / 2, canvasHeight - danmuFontsize * 0.5);
                }
            }
            else
            {
                danmuList.length = 0;
            }
        }
        if (forceRequestAnimationFrame || isFirefox)
            timeoutId = requestAnimationFrame(draw);
        else
            timeoutId = setTimeout(draw, Math.floor(1000 / 60));
    }
    let pipdmCommandObj = {
        help: () =>
        {
            console.log("[哔哩哔哩画中画弹幕]", ([
                "画中画弹幕插件指令帮助",
                "pipdm.maxLine 修改画中画弹幕最大行数",
                "pipdm.danmuLog 开启弹幕日志输出",
                "pipdm.help 显示此帮助文本"
            ]).join("\n"));
        },
        maxLine: () =>
        {
            let newValue = 0 | (prompt("设置画中画弹幕最大行数", danmuMaxLine));
            if (newValue != undefined && newValue > 0 && Number.isInteger(newValue))
            {
                if (newValue > 16)
                    danmuMaxLine = 16;
                else
                    danmuMaxLine = newValue;
                console.log("[哔哩哔哩画中画弹幕]", `已将画中画弹幕最大行数设置为 ${danmuMaxLine} 行`);
                setValue("danmuMaxLine", danmuMaxLine);
            }
            else
            {
                console.log("[哔哩哔哩画中画弹幕]", `设置的数值无效`);
            }
        },
        danmuLog: () =>
        {
            danmuLogOutput = !danmuLogOutput;
            console.log("[哔哩哔哩画中画弹幕]", `已${danmuLogOutput ? "开启" : "关闭"}弹幕日志输出`);
        }
    };
    (window["unsafeWindow"] ? unsafeWindow : window).pipdm = new Proxy({
        maxLine: "修改画中画弹幕最大行数",
        danmuLog: "开启弹幕日志输出",
        help: "显示指令帮助"
    }, {
        get: (target, key) =>
        {
            if (pipdmCommandObj[key])
                pipdmCommandObj[key]();
            else
                console.log("[哔哩哔哩画中画弹幕]", "不存在此指令\n输入 pipdm.help 以显示指令帮助");
            return () => { };
        }
    });

    console.log("[哔哩哔哩画中画弹幕]", "已加载");
    console.log("[哔哩哔哩画中画弹幕]", "输入 pipdm.help 以显示指令帮助");
}, 500);