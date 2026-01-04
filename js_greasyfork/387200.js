// ==UserScript==
// @name        Youtube Downloader , download video up to 8K and Audio in mp3, flac and more in HQ, up to 320 kbps !
// @description The Best Youtube Downloader by Piel Mallet, fast and easy to use. No need to install any annoying softwares. Download video : mp4, m4v, mov, flv, avi, mpg, wmv, HD, 1080P, 2K, 4k & 8K and Audio : mp3, aac, ogg, m4a, wma, flac, wav, HQ, 320 kbps, 256 kbps, 192 kbps, 128 kbps, 96 kbps, 64 kbps !
// @namespace   https://onlinevideoconverter.com/
// @version     6.1
// @date        2020-20-03
// @author      Piel Mallet
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license MIT https://opensource.org/licenses/MIT
// @match          *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/387200/Youtube%20Downloader%20%2C%20download%20video%20up%20to%208K%20and%20Audio%20in%20mp3%2C%20flac%20and%20more%20in%20HQ%2C%20up%20to%20320%20kbps%20%21.user.js
// @updateURL https://update.greasyfork.org/scripts/387200/Youtube%20Downloader%20%2C%20download%20video%20up%20to%208K%20and%20Audio%20in%20mp3%2C%20flac%20and%20more%20in%20HQ%2C%20up%20to%20320%20kbps%20%21.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById("polymer-app") || document.getElementById("masthead") || window.Polymer) {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("count") && document.getElementById("onlinevideoconverter") === null) {
            Addytpolymer();
        }
    }, 100);
} else {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("watch7-subscription-container") && document.getElementById("onlinevideoconverter") === null) {
            AddhtmlDV();
        }
    }, 100);
}

function AddhtmlDV() {
    if (document.getElementById("watch7-subscription-container")) {
        var wrap = document.getElementById('watch7-subscription-container');
        var button = "<div id='onlinevideoconverter' style='display: inline-block; margin-left: 10px; vertical-align: middle;'>";
        button += "<a href=\"https://www.clipconverter.cc/fr/2/?url=" + window.location.href + "\" title=\"Download this video\" target=\"_blank\"" +
            "style=\"display: inline-block; font-size: inherit; height: 22px; border: 1px solid rgb(0, 183, 90); border-radius: 3px; padding-left: 28px; cursor: pointer; vertical-align: middle; position: relative; line-height: 22px; text-decoration: none; z-index: 1; color: rgb(255, 255, 255);\">";
        button += "<i style=\"position: absolute; display: inline-block; left: 6px; top: 3px; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMTYgMTYiIGlkPSJzdmcyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJNIDQsMCA0LDggMCw4IDgsMTYgMTYsOCAxMiw4IDEyLDAgNCwwIHoiIGZpbGw9IiNmZmZmZmYiIC8+PC9zdmc+); background-size: 12px; background-repeat: no-repeat; background-position: center center; width: 16px; height: 16px;\"></i>";
        button += "<span style=\"padding-right: 12px;\">Download</span></a></div>";
        var style = "<style>#onlinevideoconverter button::-moz-focus-inner{padding:0;margin:0}#onlinevideoconverter a{background-color:#15388c}#onlinevideoconverter a:hover{background-color:#E91E63}#onlinevideoconverter a:active{background-color:rgb(0, 151, 74)}</style>";
        var tmp = wrap.innerHTML;
        wrap.innerHTML = tmp + button + style;
    }
}

function Addytpolymer() {
    var buttonDiv = document.createElement("span");
    buttonDiv.style.width = "100%";
    buttonDiv.id = "onlinevideoconverter";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode("Download Video/Audio"));
    addButton.style.width = "100%";
    addButton.style.backgroundColor = "#ff0000";
    addButton.style.color = "white";
    addButton.style.textAlign = "center";
    addButton.style.padding = "5px 10px";
    addButton.style.margin = "0px 10px";
    addButton.style.fontSize = "14px";
    addButton.style.border = "0";
    addButton.style.cursor = "pointer";
    addButton.style.borderRadius = "2px";
    addButton.style.fontFamily = "Roboto, Arial, sans-serif";
    addButton.style.textDecoration = "none";
    addButton.href = "https://www.clipconverter.cc/fr/2/?url=" + window.location.href;
    addButton.target = "_blank";
    buttonDiv.appendChild(addButton);
    var targetElement = document.querySelectorAll("[id='count']");
    for (var i = 0; i < targetElement.length; i++) {
        if (targetElement[i].className.indexOf("ytd-video-primary-info-renderer") > -1) {
            targetElement[i].appendChild(buttonDiv);
        }
    }
}


})();
