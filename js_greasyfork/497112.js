// ==UserScript==
// @name         b站副屏助手
// @namespace    qwq0
// @version      0.2
// @description  标签页隐藏时在副屏中播放视频
// @author       qwq0
// @match        https://www.bilibili.com/video/*
// @run-at       document-start
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/497112/b%E7%AB%99%E5%89%AF%E5%B1%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/497112/b%E7%AB%99%E5%89%AF%E5%B1%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(async function ()
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

    setValue("init", true);


    /** @type {HTMLDivElement} */
    let videoHolder = null;
    let video = null;
    let playing = false;

    let unloading = false;

    /**
     * @type {WindowProxy}
     */
    let popupWindow = null;

    let fillElement = document.createElement("div");


    window.addEventListener("beforeunload", function ()
    {
        unloading = true;
        if (popupWindow)
        {
            popupWindow.close();
            popupWindow = null;
        }
    });

    document.addEventListener("visibilitychange", e =>
    {
        if (document.visibilityState === "hidden" && !unloading)
        {
            if (videoHolder && playing)
            {
                if (popupWindow)
                {
                    popupWindow.close();
                    popupWindow = null;
                }
                popupWindow = window.open("", "popupVideoWindow", `popup=true,screenX=${getValue("x", 0)},screenY=${getValue("y", -1080)},width=${getValue("w", 1920)},height=${getValue("h", 1080)}`);
                videoHolder.replaceWith(fillElement);
                let style = document.createElement("style");
                style.innerText = `
                body
                {
                    margin: 0;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: rgb(0, 0, 0);
                    width: 100%;
                    height: 100%;
                }
                video
                {
                    max-width: 100vw;
                    max-height: 100vh;
                }
                `;
                popupWindow.document.body.appendChild(style);
                popupWindow.document.body.appendChild(videoHolder);
            }
        }
        else
        {
            if (popupWindow)
            {
                if (videoHolder)
                {
                    fillElement.replaceWith(videoHolder);
                }
                popupWindow.close();
                popupWindow = null;
            }
        }
    });

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
            playing = !video.paused;
            video.addEventListener("play", () =>
            {
                playing = true;
            });
            video.addEventListener("pause", () =>
            {
                playing = false;
            });
        }
    }, 900);

})();