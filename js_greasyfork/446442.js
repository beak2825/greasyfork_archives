// ==UserScript==
// @name         Youtube 影音轉換工具 | MP3,MP4
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  跳轉至轉換網站。
// @author       rogerjs
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/446442/Youtube%20%E5%BD%B1%E9%9F%B3%E8%BD%89%E6%8F%9B%E5%B7%A5%E5%85%B7%20%7C%20MP3%2CMP4.user.js
// @updateURL https://update.greasyfork.org/scripts/446442/Youtube%20%E5%BD%B1%E9%9F%B3%E8%BD%89%E6%8F%9B%E5%B7%A5%E5%85%B7%20%7C%20MP3%2CMP4.meta.js
// ==/UserScript==

(function () {
    var isFullscreen = false;
    var fullscreenButton = document.getElementsByClassName("ytp-fullscreen-button ytp-button")[0];
    fullscreenButton.onclick = function () {
        if (isFullscreen == false) {
            document.querySelector("#esmanur").remove();
            isFullscreen = true;
        } else if (isFullscreen == true) {
            createButton();
            isFullscreen = false;
        }
    };

    function urlCut(url) {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
        var match = String(url).match(regExp);
        return match && match[7].length == 11 ? match[7] : false;
    }
    var isCreated;
    setInterval(function () {
        if (document.URL == "https://www.youtube.com/" || document.URL == "http://www.youtube.com/") {
            document.querySelector("#esmanur").remove();
            isCreated = false;
        }
        if (document.URL.indexOf("watch?v=") > 1 && isCreated == false && isFullscreen == false) {
            createButton();
            isCreated = true;
        }
    }, 1);

    function createButton() {
        var convertButton = document.createElement("div");
        var downloadText = document.createElement("p");
        convertButton.id = "esmanur";
        convertButton.classList.add("convertButton");
        downloadText.textContent = "mp3下載";
        downloadText.classList.add("downloadText");

        convertButton.onclick = function () {
            navigator.clipboard.writeText(document.URL);
            window.open("https://y2mate.nu/ysM1/", "_blank");
        };

        document.body.appendChild(convertButton);
        convertButton.appendChild(downloadText);
    }
    createButton();
    let style = document.createElement("style");
    style.textContent = `<style>
#masthead-container.ytd-app {
    position: absolute;
}
.convertButton{
    padding: 5px 10px;
    position: fixed;
    background-color: rgb(255, 255, 255);
    z-index: 10000;
    bottom: 10px;
    right: 10px;
    transition: 0.6s;
    border-radius: 5px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 3px 20px;
    cursor: pointer;
    opacity: 0;
}
.convertButton:hover{
    background-color:#8b0000;
    opacity: 1;
}
.downloadText{
    color:#8b0000;
    font-size:1.1rem;
    padding:0;
    margin:0;
}
.downloadText:hover{
    color:#fff;
}
</style>`;
document.head.appendChild(style);
})();
