// ==UserScript==
// @name        Youtube内容分享到QQ空间
// @namespace   https://www.deginx.com
// @version     1.2
// @description 分享YouTube视频到QQ空间
// @author      Jonyan Dunh
// @qq          1309634881
// @copyright   DEGINX
// @homepage    https://www.deginx.com
// @match          *://*.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/402992/Youtube%E5%86%85%E5%AE%B9%E5%88%86%E4%BA%AB%E5%88%B0QQ%E7%A9%BA%E9%97%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/402992/Youtube%E5%86%85%E5%AE%B9%E5%88%86%E4%BA%AB%E5%88%B0QQ%E7%A9%BA%E9%97%B4.meta.js
// ==/UserScript==

(function() {
    if (document.getElementById("polymer-app") || document.getElementById("masthead") || window.Polymer) {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("count") && document.getElementById("bitdownloader") === null) {
            polymerAdd();
        }
    }, 100);
} else {
    setInterval(function() {
        if (window.location.href.indexOf("watch?v=") < 0) {
            return false;
        }
        if (document.getElementById("watch7-subscription-container") && document.getElementById("bitdownloader") === null) {
            htmlAdd();
        }
    }, 100);
}

function htmlAdd() {
    if (document.getElementById("watch7-subscription-container")) {
        var wrap = document.getElementById('watch7-subscription-container');
        var button = "<div id='bitdownloader' style='display: inline-block; margin-left: 10px; vertical-align: middle;'>";
        button += '<a href="http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(window.location.href)+'&title='+document.title+'&desc=//'+document.title+'&summary='+document.querySelector('yt-formatted-string.ytd-video-secondary-info-renderer').innerText.substring(0,70)+'&site=youtube.com&pics=https://api.deginx.com/youtube-cover.php?video_id='+ytvid(document.URL)+ "\" title=\"Download this video\" target=\"_blank\"" +
            "style=\"display: inline-block; font-size: inherit; height: 22px; border: 1px solid rgb(0, 183, 90); border-radius: 5px; padding-left: 28px; cursor: pointer; vertical-align: middle; position: relative; line-height: 22px; text-decoration: none; z-index: 1; color: rgb(255, 255, 255);\">";
        button += "<i style=\"position: absolute; display: inline-block; left: 6px; top: 3px; background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz48c3ZnIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6Y2M9Imh0dHA6Ly9jcmVhdGl2ZWNvbW1vbnMub3JnL25zIyIgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIiB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjE2IiBoZWlnaHQ9IjE2IiB2aWV3Qm94PSIwIDAgMTYgMTYiIGlkPSJzdmcyIiB4bWw6c3BhY2U9InByZXNlcnZlIj48cGF0aCBkPSJNIDQsMCA0LDggMCw4IDgsMTYgMTYsOCAxMiw4IDEyLDAgNCwwIHoiIGZpbGw9IiNmZmZmZmYiIC8+PC9zdmc+); background-size: 12px; background-repeat: no-repeat; background-position: center center; width: 16px; height: 16px;\"></i>";
        button += "<span style=\"padding-right: 12px;\">Download</span></a></div>";
        var style = "<style>#bitdownloader button::-moz-focus-inner{padding:0;margin:0}#bitdownloader a{background-color:#15388c}#bitdownloader a:hover{background-color:#E91E63}#bitdownloader a:active{background-color:rgb(0, 151, 74)}</style>";
        var tmp = wrap.innerHTML;
        wrap.innerHTML = tmp + button + style;
    }
}

function polymerAdd() {
    var buttonDiv = document.createElement("span");
    buttonDiv.style.width = "100%";
    buttonDiv.id = "bitdownloader";
    var addButton = document.createElement("a");
    addButton.appendChild(document.createTextNode("分享到QQ空间"));
    addButton.style.width = "100%";
    addButton.style.backgroundColor = "#ccc235";
    // #15388c
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
    addButton.href = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?url='+encodeURIComponent(window.location.href)+'&title='+document.title+'&desc=//'+document.title+'&summary='+document.querySelector('yt-formatted-string.ytd-video-secondary-info-renderer').innerText.substring(0,100)+'&site=youtube.com&pics=https://api.deginx.com/youtube-cover.php?video_id='+ytvid(document.URL);
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

})();
