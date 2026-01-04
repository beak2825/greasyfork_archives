// ==UserScript==
// @name         Youtube Video Converter | MP3
// @name Youtube Video Converter | MP3
// @name:zh-CN Youtube Video Converter | MP3
// @name:zh-TW Youtube Video Converter | MP3
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  a basic youtube video converter, fastest, one click!
// @description:zh-CN 您可以轻松下载具有此扩展程序的youtube视频，这是使用速度最快的转换器。
// @description:zh-TW 您可以轻松下载具有此扩展程序的youtube视频，这是使用速度最快的转换器。
// @author       Mz.RachiD
// @match        *://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?domain=youtube.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/440050/Youtube%20Video%20Converter%20%7C%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/440050/Youtube%20Video%20Converter%20%7C%20MP3.meta.js
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
        convertButton.style.padding = "16px";
        convertButton.style.position = "fixed";
        convertButton.style.backgroundColor = "red";
        convertButton.style.zIndex = "10000";
        convertButton.style.top = "91vh";
        convertButton.style.right = "2vw";
        convertButton.style.transition = "all 0.6s";
        convertButton.style.borderRadius = "16px";
        convertButton.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
        convertButton.style.cursor = "pointer";
        downloadText.textContent = "DOWNLOAD";
        downloadText.style.color = "white";
        downloadText.style.fontSize = "25px";

        convertButton.onmouseover = function () {
            convertButton.style.backgroundColor = "darkRed";
        };
        convertButton.onmouseleave = function () {
            convertButton.style.backgroundColor = "red";
        };

        convertButton.onclick = function () {
            window.open("https://ytmp3x.com/" + urlCut(document.URL), "_blank");
        };

        document.body.appendChild(convertButton);
        convertButton.appendChild(downloadText);
    }
    createButton();
})();
