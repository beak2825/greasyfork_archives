// ==UserScript==
// @name         哔哩哔哩预览列表视频
// @namespace    qwq0
// @version      0.3
// @description  哔哩哔哩推荐列表视频就地预览
// @author       QwQ~
// @match        https://www.bilibili.com/
// @match        https://www.bilibili.com/?*
// @match        https://t.bilibili.com/
// @match        https://www.bilibili.com/v/*
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/read/*
// @match        https://search.bilibili.com/*
// @match        https://www.bilibili.com/medialist/play/*
// @match        https://www.bilibili.com/list/*
// @match        https://www.bilibili.com/bangumi/play/*
// @match        https://space.bilibili.com/*
// @match        https://live.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492597/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%A2%84%E8%A7%88%E5%88%97%E8%A1%A8%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/492597/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E9%A2%84%E8%A7%88%E5%88%97%E8%A1%A8%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(async () =>
{
    "use strict";

    /**
     * @param {string} bvid
     * @returns {Promise<string>}
     */
    async function getVideoSrc(bvid)
    {
        try
        {
            let videoInfo = await (await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`)).json();
            let playurlInfo = await (await fetch(`https://api.bilibili.com/x/player/wbi/playurl?bvid=${bvid}&cid=${videoInfo.data.cid}&platform=html5`)).json();
            return playurlInfo.data.durl[0].url;
        }
        catch (err)
        {
            console.error("get video src error:", err);
            return "";
        }
    }

    window.addEventListener("contextmenu", e =>
    {
        if (e.ctrlKey)
            return;

        let path = e.composedPath();

        let hit = false;
        let bvid = "";

        for (let i = 0; i < path.length && i < 5; i++)
        {
            if (
                path[i]?.tagName == "A" &&
                path[i]?.href?.startsWith("https://www.bilibili.com/video/")
            )
            {
                let url = path[i]?.href;
                if (typeof (url) == "string")
                {
                    let tmp = new URL(url).pathname;
                    if (tmp.startsWith("/video/"))
                        tmp = tmp.slice(7);
                    if (tmp.endsWith("/"))
                        tmp = tmp.slice(0, -1);
                    if (tmp.startsWith("BV"))
                    {
                        hit = true;
                        bvid = tmp;
                        break;
                    }
                }
            }
        }

        if (hit)
        {
            e.stopImmediatePropagation();
            e.preventDefault();

            (async () =>
            {
                let videoHolderElement = document.createElement("div");
                videoHolderElement.style.position = "fixed";
                videoHolderElement.style.display = "flex";
                let width = 360;
                let height = 203 + 22;
                videoHolderElement.style.width = `${width}px`;
                videoHolderElement.style.maxHeight = `${height}px`;
                videoHolderElement.style.left = `${e.clientX - width / 2}px`;
                videoHolderElement.style.top = `${e.clientY - height / 2}px`;
                videoHolderElement.style.border = `2px solid rgb(195, 195, 195)`;
                videoHolderElement.style.borderRadius = "5px";
                videoHolderElement.style.boxShadow = "2px 2px 4.5px rgba(0, 0, 0, 0.6)";
                videoHolderElement.style.zIndex = "100000";
                videoHolderElement.style.backgroundColor = "rgb(0, 0, 0)";

                let videoElement = document.createElement("video");
                videoElement.autoplay = true;
                videoElement.controls = true;
                videoElement.style.width = "100%";
                videoElement.style.maxHeight = "100%";
                videoHolderElement.appendChild(videoElement);

                let buttonBarElement = document.createElement("div");
                buttonBarElement.style.position = "absolute";
                buttonBarElement.style.display = "flex";
                buttonBarElement.style.alignItems = "center";
                buttonBarElement.style.justifyContent = "space-around";
                buttonBarElement.style.top = "0";
                buttonBarElement.style.width = "100%";
                buttonBarElement.style.height = "22px";
                buttonBarElement.style.color = "rgba(255, 255, 255, 0.8)";
                buttonBarElement.style.cursor = "default";
                videoHolderElement.appendChild(buttonBarElement);

                let gotoButton = document.createElement("div");
                gotoButton.innerText = "转到";
                gotoButton.addEventListener("click", e =>
                {
                    let videoTime = videoElement.currentTime;
                    removeVideoElement();
                    location.assign(`https://www.bilibili.com/video/${bvid}?t=${(Math.max(0, videoTime - 0.5)).toFixed(1)}`);
                });
                buttonBarElement.appendChild(gotoButton);

                let newTabOpenButton = document.createElement("div");
                newTabOpenButton.innerText = "新标签页";
                newTabOpenButton.addEventListener("click", e =>
                {
                    let videoTime = videoElement.currentTime;
                    removeVideoElement();
                    window.open(`https://www.bilibili.com/video/${bvid}?t=${(Math.max(0, videoTime - 0.5)).toFixed(1)}`);
                });
                buttonBarElement.appendChild(newTabOpenButton);

                videoHolderElement.animate([
                    {
                        transform: "scale(60%)",
                        opacity: "0.6"
                    },
                    {
                        transform: "",
                        opacity: "1"
                    }
                ], {
                    duration: 70,
                    easing: "cubic-bezier(0.5, 1, 0.89, 1)"
                });
                document.body.appendChild(videoHolderElement);

                let removed = false;

                function removeVideoElement()
                {
                    removed = true;
                    videoElement.pause();
                    videoHolderElement.animate([
                        {
                            transform: "",
                            opacity: "1"
                        },
                        {
                            transform: "scale(60%)",
                            opacity: "0.6"
                        }
                    ], {
                        duration: 70,
                        easing: "cubic-bezier(0.5, 1, 0.89, 1)",
                        fill: "forwards"
                    });
                    setTimeout(() =>
                    {
                        videoHolderElement.style.display = "none";
                        videoHolderElement.remove();
                    }, 70);
                }

                videoHolderElement.addEventListener("contextmenu", e =>
                {
                    e.stopImmediatePropagation();
                    e.preventDefault();
                    let videoTime = videoElement.currentTime;
                    removeVideoElement();
                    if (e.ctrlKey)
                        window.open(`https://www.bilibili.com/video/${bvid}?t=${(Math.max(0, videoTime - 0.5)).toFixed(1)}`);
                });

                let videoSrc = await getVideoSrc(bvid);
                if (!removed)
                    videoElement.src = videoSrc;
            })();
        }
    }, true);
})();