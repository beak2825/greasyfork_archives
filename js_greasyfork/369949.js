// ==UserScript==
// @name        Best Youtube MP3 Converter, convert any online video into MP3
// @namespace   https://distillvideo.com/
// @version     1.2
// @date        2018-07-01
// @description Add a button to convert youtube to MP3 directly. Convert the video into mp3 with the best quality. The bitrate will be calculated precisely, which ranges from 128kbps to 320kbps depending on original file. Allows you to convert any online video into MP3 audio file. Support most oneline video sites like YouTube, Vemo, Viki, Dramafever, TED and 5000 more.
// @author      DistillVideo.com
// @copyright   2018, DistillVideo.com
// @homepage    https://distillvideo.com/page/extensions
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license GNU GPL v3.0 or later. http://www.gnu.org/copyleft/gpl.html
// @match          *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/369949/Best%20Youtube%20MP3%20Converter%2C%20convert%20any%20online%20video%20into%20MP3.user.js
// @updateURL https://update.greasyfork.org/scripts/369949/Best%20Youtube%20MP3%20Converter%2C%20convert%20any%20online%20video%20into%20MP3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById("polymer-app") || document.getElementById("masthead") || window.Polymer) {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("meta-contents") && document.getElementById("distillvideomp3") === null) {
            Addytpolymer();
        }
    }, 100);
} else {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("watch8-sentiment-actions") && document.getElementById("distillvideomp3") === null) {
            AddhtmlDV();
        }
    }, 100);
}

function AddhtmlDV() {
    if (document.getElementById("watch8-sentiment-actions")) {
        var wrap = document.getElementById('watch8-sentiment-actions');
        var button = "<div id='distillvideomp3' style='display: inline-block; margin-left: 10px; vertical-align: middle;'>";
        button += "<a href=\"https://distillvideo.com/mp3?url=" + window.location.href + "\" title=\"Download this video\" target=\"_blank\"" +
            "style=\"display: inline-block; font-size: inherit; height: inherit; border: 1px solid rgb(0, 183, 90); border-radius: 3px; padding-left: 28px;background-color: #9542cd;cursor: pointer; vertical-align: middle; position: relative; line-height: 22px; text-decoration: none; z-index: 1; color: rgb(255, 255, 255);\">";
        button += "<i style=\"position: absolute; display: inline-block; left: 6px; top: 3px; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMTYgMTYiIGlkPSJzdmcyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJNIDQsMCA0LDggMCw4IDgsMTYgMTYsOCAxMiw4IDEyLDAgNCwwIHoiIGZpbGw9IiNmZmZmZmYiIC8+PC9zdmc+); background-size: 12px; background-repeat: no-repeat; background-position: center center; width: 16px; height: 16px;\"></i>";
        button += "<span style=\"padding-right: 12px;\">Convert To MP3</span></a></div>";
        var style = "<style>#distillvideomp3 button::-moz-focus-inner{padding:0;margin:0}#distillvideomp3 a{background-color:#15388c}#distillvideomp3 a:hover{background-color:#E91E63}#distillvideomp3 a:active{background-color:rgb(0, 151, 74)}</style>";
        var tmp = wrap.innerHTML;
        wrap.innerHTML = tmp + button + style;
    }
}

function Addytpolymer() {
    var buttonDiv = document.createElement("span");
    buttonDiv.style.width = "100%";
    buttonDiv.style.padding = "10px 0";
    buttonDiv.style.marginTop = "5px";
    buttonDiv.id = "distillvideomp3";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode("Convert To MP3"));
    addButton.style.width = "100%";
    addButton.style.height = "inherit";
    addButton.style.backgroundColor = "#9542cd";
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
    addButton.href = "https://distillvideo.com/mp3?url=" + window.location.href;
    addButton.target = "_blank";
    buttonDiv.appendChild(addButton);
    var targetElement = document.querySelectorAll("[id='subscribe-button']");
    if(targetElement){
      for(var i = 0; i < targetElement.length; i++){
        if(targetElement[i].className.indexOf("ytd-video-secondary-info-renderer") > -1){
            targetElement[i].appendChild(buttonDiv);
        }
      }
    }
   var descriptionBox = document.querySelectorAll("ytd-video-secondary-info-renderer");
   if(descriptionBox[0].className.indexOf("loading") > -1){
        descriptionBox[0].classList.remove("loading");
    }
}
})();