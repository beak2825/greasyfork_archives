// ==UserScript==
// @name            Hybrid YouTube Download Extension
// @description     Creates links to both youtube320 and BitDownloader.
// @icon            https://www.youtube.com/s/desktop/4aac258c/img/favicon_96.png
// @author          BitDownloader, TylerWDoesStuff
// @copyright       2018, BitDownloader; 2020, TylerWDoesStuff
// @namespace       null
// @license         GPL-3.0-or-later
// @include         http://www.youtube.com/*
// @include         https://www.youtube.com/*
// @version         0.1.7
// @downloadURL https://update.greasyfork.org/scripts/411777/Hybrid%20YouTube%20Download%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/411777/Hybrid%20YouTube%20Download%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.getElementById("polymer-app") || document.getElementById("masthead") || window.Polymer) {
        setInterval(function() {
            if (window.location.href.indexOf("watch?v=") < 0) {
                return false;
            }
            if (document.getElementById("count") && document.getElementById("bitdownloader_mp4") === null) {
                polymerAdd();
                if (document.getElementById("count") && document.getElementById("bitdownloader_mp3") === null) {
                    PolymerAdd();
                }}
        }, 100);
    } else {
        setInterval(function() {
            if (window.location.href.indexOf("watch?v=") < 0) {
                return false;
            }
            if (document.getElementById("watch7-subscription-container") && document.getElementById("bitdownloader_mp4") === null) {
                htmlAdd();
                if (document.getElementById("watch7-subscription-container") && document.getElementById("bitdownloader_mp3") === null) {
                    HtmlAdd();
                }
            }
        }, 100);
    }

    function htmlAdd() {
        if (document.getElementById("watch7-subscription-container")) {
            var wrap = document.getElementById('watch7-subscription-container');
            var button = "<div id='bitdownloader_mp4' style='display: inline-block; margin-left: 10px; vertical-align: middle;'>";
            button += "<a href=\"https://www.y2mate.com/youtube/" + ytvid(document.URL) + "/?utm_source=BitDownloader_Extension\" title=\"Download this video\" target=\"_blank\"" +
                "style=\"display: inline-block; font-size: inherit; height: 22px; border: 0px solid rgb(0, 183, 90); border-radius: 5px; padding-left: 14px; cursor: pointer; vertical-align: middle; position: relative; line-height: 22px; text-decoration: none; z-index: 1; color: rgb(255, 255, 255);\">";
            button += "<i style=\"position: absolute; display: inline-block; left: 6px; top: 3px; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMTYgMTYiIGlkPSJzdmcyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJNIDQsMCA0LDggMCw4IDgsMTYgMTYsOCAxMiw4IDEyLDAgNCwwIHoiIGZpbGw9IiNmZmZmZmYiIC8+PC9zdmc+); background-size: 12px; background-repeat: no-repeat; background-position: center center; width: 16px; height: 16px;\"></i>";
            button += "<span style=\"padding-right: 12px;\">• ↓ MP4</span></a></div>";
            var style = "<style>#bitdownloader button::-moz-focus-inner{padding:0;margin:0}#bitdownloader a{background-color:#15388c}#bitdownloader a:hover{background-color:#E91E63}#bitdownloader a:active{background-color:rgb(0, 151, 74)}</style>";
            var tmp = wrap.innerHTML;
            wrap.innerHTML = tmp + button + style;
        }
    }

    function polymerAdd() {
        var buttonDiv = document.createElement("span");
        buttonDiv.style.width = "100%";
        buttonDiv.id = "bitdownloader_mp4";
        var addButton = document.createElement("a");
        addButton.appendChild(document.createTextNode(" • ↓ MP4"));
        addButton.style.width = "100%";
        addButton.style.backgroundColor = "#181818";
        // #15388c
        addButton.style.color = "#aaaaaa";
        addButton.style.textAlign = "center";
        addButton.style.padding = "0px 0px";
        addButton.style.margin = "0px 0px";
        addButton.style.fontSize = "14px";
        addButton.style.border = "0";
        addButton.style.cursor = "pointer";
        addButton.style.borderRadius = "0px";
        addButton.style.fontFamily = "Roboto, Arial, sans-serif";
        addButton.style.textDecoration = "none";
        addButton.href = "https://www.y2mate.com/youtube/" + ytvid(window.location.href) + "/?utm_source=BitDownloader_Extension";
        addButton.target = "_blank";
        buttonDiv.appendChild(addButton);
        var targetElement = document.querySelectorAll("[id='count']");
        for (var i = 0; i < targetElement.length; i++) {
            if (targetElement[i].className.indexOf("ytd-video-primary-info-renderer") > -1) {
                targetElement[i].appendChild(buttonDiv);
            }
        }
    }

    function ytvid(url) {
        var p = /((http|https)\:\/\/)?(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
        return (url.match(p)) ? RegExp.$3 : false;
    }

    function HtmlAdd() {
        if (document.getElementById("watch7-subscription-container")) {
            var wrap = document.getElementById('watch7-subscription-container');
            var button = "<div id='bitdownloader_mp3' style='display: inline-block; margin-left: 10px; vertical-align: middle;'>";
            button += "<a href=\"https://www.320youtube.com/v7/watch?v=" + ytvid(document.URL);
            "style=\"display: inline-block; font-size: inherit; height: 22px; border: 0px solid rgb(0, 183, 90); border-radius: 5px; padding-left: 14px; cursor: pointer; vertical-align: middle; position: relative; line-height: 22px; text-decoration: none; z-index: 1; color: rgb(255, 255, 255);\">";
            button += "<i style=\"position: absolute; display: inline-block; left: 6px; top: 3px; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMTYgMTYiIGlkPSJzdmcyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJNIDQsMCA0LDggMCw4IDgsMTYgMTYsOCAxMiw4IDEyLDAgNCwwIHoiIGZpbGw9IiNmZmZmZmYiIC8+PC9zdmc+); background-size: 12px; background-repeat: no-repeat; background-position: center center; width: 16px; height: 16px;\"></i>";
            button += "<span style=\"padding-right: 12px;\">• ↓ MP3</span></a></div>";
            var style = "<style>#bitdownloader button::-moz-focus-inner{padding:0;margin:0}#bitdownloader a{background-color:#15388c}#bitdownloader a:hover{background-color:#E91E63}#bitdownloader a:active{background-color:rgb(0, 151, 74)}</style>";
            var tmp = wrap.innerHTML;
            wrap.innerHTML = tmp + button + style;
        }
    }

    function PolymerAdd() {
        var buttonDiv = document.createElement("span");
        buttonDiv.style.width = "100%";
        buttonDiv.id = "bitdownloader_mp3";
        var addButton = document.createElement("a");
        addButton.appendChild(document.createTextNode(" • ↓ MP3"));
        addButton.style.width = "100%";
        addButton.style.backgroundColor = "#181818";
        // #15388c
        addButton.style.color = "#aaaaaa";
        addButton.style.textAlign = "center";
        addButton.style.padding = "0px 0px";
        addButton.style.margin = "0px 0px";
        addButton.style.fontSize = "14px";
        addButton.style.border = "0";
        addButton.style.cursor = "pointer";
        addButton.style.borderRadius = "0px";
        addButton.style.fontFamily = "Roboto, Arial, sans-serif";
        addButton.style.textDecoration = "none";
        addButton.href = "https://www.320youtube.com/v7/watch?v=" + ytvid(window.location.href);
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