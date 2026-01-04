// ==UserScript==
// @name                Youtube Video&subtitle Download
// @version             2.0.1
// @description         一键导向油管视频和对应字幕下载网站，跳转y2mate和downsub（上一版中yt5s网站失效了）
// @author              Juliet
// @namespace           https://greasyfork.org/zh-CN/users/911360-juliet821
// @icon                https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/YouTube_full-color_icon_%282017%29.svg/2560px-YouTube_full-color_icon_%282017%29.svg.png
// @match               https://www.youtube.com/*
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/455831/Youtube%20Videosubtitle%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/455831/Youtube%20Videosubtitle%20Download.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function() {
    'use strict';

    const textStyle = `
.download-vid-button {
    background-color: #0040ff;
    color:  #ffffff;
    border-radius: 20px;
    padding: var(--yt-button-padding);
    margin: auto var(--ytd-subscribe-button-margin, 0px);
    white-space: nowrap;
    font-size: 10px;
    font-weight: bold;
    text-transform: var(--ytd-tab-system_-_text-transform);
    display: flex;
    flex-direction: row;
    cursor: pointer;
    border: 1px solid #ffffff;
}
.download-text {
    --yt-formatted-string-deemphasize-color: #990000;
    --yt-formatted-string-deemphasize_-_margin-left: 4px;
    --yt-formatted-string-deemphasize_-_display: initial;
}`;
    let currentUrl = document.location.href;
    let isPlaylist = currentUrl.includes("playlist");

    css();

    init(10);

    locationChange();

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(delButton, 500 * i);
            setTimeout(findPanel, 500 * i);
        }
    }

    function delButton() {
        if (!isPlaylist) return;
        document.querySelectorAll("#top-level-buttons-computed.download-vid-panel").forEach(panel => {
            panel.classList.remove("download-vid-panel");
            panel.querySelector(".download-vid-button").remove();
        });
    }

    function findPanel() {
        if (isPlaylist) return;
        document.querySelectorAll("#top-level-buttons-computed:not(.download-vid-panel)").forEach(panel => {
            panel.classList.add("download-vid-panel");
            addButton(panel);
        });
    }

    function addButton(panel) {
        // button
        const button = document.createElement("div");
        button.classList.add("download-vid-button");
        button.addEventListener("click", onClick);
        // text
        const text = document.createElement("span");
        text.classList.add("download-text");
        text.innerHTML = getLocalization();
        // append
        panel.insertBefore(button, panel.firstElementChild);
        button.appendChild(text);
    }

    function onClick() {
        const url = document.location.href.replace("youtube", "youtubepp");
        window.open(url);
    }

    function getLocalization() {
        switch (document.querySelector("html").lang) {
            case "zh-Hans-CN":
                return "视频";
            default:
                return "VIDEOS";
        }
    }

    function css() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = textStyle;
        document.head.appendChild(style);
    }

    function locationChange() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (currentUrl !== document.location.href) {
                    currentUrl = document.location.href;
                    isPlaylist = currentUrl.includes("playlist");
                    init(10);
                }
            });
        });
        const target = document.body;
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }

})();

/* jshint esversion: 6 */

(function() {
    'use strict';

    const textStyle = `
.download-sub-button {
    background-color: #008000;
    color:  #ffffff;
    border-radius: 20px;
    padding: var(--yt-button-padding);
    margin: auto var(--ytd-subscribe-button-margin, 0px);
    white-space: nowrap;
    font-size: 10px;
    font-weight: bold;
    text-transform: var(--ytd-tab-system_-_text-transform);
    display: flex;
    flex-direction: row;
    cursor: pointer;
    border: 1px solid #ffffff;
}
.download-text {
    --yt-formatted-string-deemphasize-color: #990000;
    --yt-formatted-string-deemphasize_-_margin-left: 4px;
    --yt-formatted-string-deemphasize_-_display: initial;
}`;
    let currentUrl = document.location.href;
    let isPlaylist = currentUrl.includes("playlist");

    css();

    init(10);

    locationChange();

    function init(times) {
        for (let i = 0; i < times; i++) {
            setTimeout(delButton, 500 * i);
            setTimeout(findPanel, 500 * i);
        }
    }

    function delButton() {
        if (!isPlaylist) return;
        document.querySelectorAll("#top-level-buttons-computed.download-sub-panel").forEach(panel => {
            panel.classList.remove("download-sub-panel");
            panel.querySelector(".download-sub-button").remove();
        });
    }

    function findPanel() {
        if (isPlaylist) return;
        document.querySelectorAll("#top-level-buttons-computed:not(.download-sub-panel)").forEach(panel => {
            panel.classList.add("download-sub-panel");
            addButton(panel);
        });
    }

    function addButton(panel) {
        // button
        const button = document.createElement("div");
        button.classList.add("download-sub-button");
        button.addEventListener("click", onClick);
        // text
        const text = document.createElement("span");
        text.classList.add("download-text");
        text.innerHTML = getLocalization();
        // append
        panel.insertBefore(button, panel.firstElementChild);
        button.appendChild(text);
    }

    function onClick() {
        const url = document.location.href.replace("youtube.com/watch?v=", "downsub.com/?url=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D");
        window.open(url);
    }

    function getLocalization() {
        switch (document.querySelector("html").lang) {
            case "zh-Hans-CN":
                return "字幕";
            default:
                return "SUBTITLE";
        }
    }

    function css() {
        const style = document.createElement("style");
        style.type = "text/css";
        style.innerHTML = textStyle;
        document.head.appendChild(style);
    }

    function locationChange() {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(() => {
                if (currentUrl !== document.location.href) {
                    currentUrl = document.location.href;
                    isPlaylist = currentUrl.includes("playlist");
                    init(10);
                }
            });
        });
        const target = document.body;
        const config = { childList: true, subtree: true };
        observer.observe(target, config);
    }

})();
