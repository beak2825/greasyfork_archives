// ==UserScript==
// @name        YouTube Converter and Downloader
// @version     2.0
// @date        2019-07-18
// @description Adds MP3, MP4 and 'Other' (multiple format options) download buttons to YouTube videos
// @author      SirLoinOfBeef
// @copyright   2019, SirLoinOfBeef
// @compatible chrome
// @compatible firefox
// @compatible opera
// @compatible safari
// @license MIT https://opensource.org/licenses/MIT
// @match          *://*.youtube.com/*
 // @match         *://*.notube.net/*
// @namespace https://greasyfork.org/users/216347
// @downloadURL https://update.greasyfork.org/scripts/376004/YouTube%20Converter%20and%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/376004/YouTube%20Converter%20and%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.location.href.indexOf("notube.net") > 0) {

        //if downlaod page then download
        if (window.location.href.indexOf("download?token") > 0) {
            var FileURL = "https://s5.notube.net/download.php?token=" + window.location.href.substring(window.location.href.lastIndexOf("=") + 1);
            window.location.href = FileURL;
            setTimeout(function(){
                window.close();
            }, 2000);
        }

        //set youtube video url
        var VidURL = window.location.href.substring(window.location.href.lastIndexOf("=") + 1,window.location.href.lastIndexOf("&"));
        document.getElementById("keyword").value = decodeURIComponent(VidURL);

       //remove popup ad
        var curSubmit = document.getElementById("form1").querySelector('input[value="OK"]');
        setTimeout(function(){
            curSubmit.setAttribute( "onClick", "" );
        }, 2000);

        //if starting page then set download type
        if (window.location.href.indexOf("DLOADMP4") > 0){document.getElementById("myDropdown").value = "mp4"}
        if (window.location.href.indexOf("DLOADMP3") > 0){document.getElementById("myDropdown").value = "mp3"}
        if (window.location.href.indexOf("DLOAD?") > 0){return}

        //submit form for processing (delay required)
        setTimeout(function(){
            curSubmit.click();
        }, 2000);




    }

    if (document.getElementById("polymer-app") || document.getElementById("masthead") || window.Polymer) {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("count") && document.getElementById("distillvideo") === null) {
            Addytpolymer('MP3');
            Addytpolymer('MP4');
            Addytpolymer('?');
        }
    }, 100);
} else {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("watch7-subscription-container") && document.getElementById("distillvideo") === null) {
            AddhtmlDV();
        }
    }, 100);
}

function AddhtmlDV() {
    if (document.getElementById("watch7-subscription-container")) {
        var wrap = document.getElementById('watch7-subscription-container');
        var button = "<div id='distillvideo' style='display: inline-block; margin-left: 10px; vertical-align: middle;'>";
        button += "<a href=\"https://notube.net/en?VIDURL=" + encodeURIComponent(document.URL) + "\" title=\"Download\" target=\"_blank\"" +
            "style=\"display: inline-block; font-size: inherit; height: 22px; border: 1px solid rgb(0, 183, 90); border-radius: 3px; padding-left: 28px; cursor: pointer; vertical-align: middle; position: relative; line-height: 22px; text-decoration: none; z-index: 1; color: rgb(255, 255, 255);\">";
        button += "<i style=\"position: absolute; display: inline-block; left: 6px; top: 3px; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMTYgMTYiIGlkPSJzdmcyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJNIDQsMCA0LDggMCw4IDgsMTYgMTYsOCAxMiw4IDEyLDAgNCwwIHoiIGZpbGw9IiNmZmZmZmYiIC8+PC9zdmc+); background-size: 12px; background-repeat: no-repeat; background-position: center center; width: 16px; height: 16px;\"></i>";
        button += "<span style=\"padding-right: 12px;\">Download</span></a></div>";
        var style = "<style>#distillvideo button::-moz-focus-inner{padding:0;margin:0}#distillvideo a{background-color:#15388c}#distillvideo a:hover{background-color:#E91E63}#distillvideo a:active{background-color:rgb(0, 151, 74)}</style>";
        var tmp = wrap.innerHTML;
        wrap.innerHTML = tmp + button + style;
    }
}

function Addytpolymer(ButtLabel) {
    var buttonDiv = document.createElement("span");
    buttonDiv.style.width = "100%";
    buttonDiv.style.color = "#15388c";
    buttonDiv.id = "distillvideo";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode(ButtLabel));
    addButton.style.width = "100%";
    addButton.style.backgroundColor = "#15388c";
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
    addButton.href = "https://notube.net/en?VIDURL=" + encodeURIComponent(document.URL) + '&DLOAD' + ButtLabel;
    addButton.target = "_YTD";
    if (ButtLabel == 'MP3'){
        buttonDiv.style.padding = "0px 0px 0px 20px";
        //buttonDiv.appendChild(document.createTextNode('   Download:' ))
    }
    buttonDiv.appendChild(addButton);
    var targetElement = document.querySelectorAll("[id='count']");
    for (var i = 0; i < targetElement.length; i++) {
        if (targetElement[i].className.indexOf("ytd-video-primary-info-renderer") > -1) {
            targetElement[i].appendChild(buttonDiv);
        }
    }
}


})();
