// ==UserScript==
// @name         地级电视台视频播放替换老掉牙的Flash为洋气的HTML5
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  地级电视台视频播放替换Flash为HTML5
// @author       别问我是谁请叫我雷锋
// @match        http://lanmu.qtv.com.cn/system/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422849/%E5%9C%B0%E7%BA%A7%E7%94%B5%E8%A7%86%E5%8F%B0%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%9B%BF%E6%8D%A2%E8%80%81%E6%8E%89%E7%89%99%E7%9A%84Flash%E4%B8%BA%E6%B4%8B%E6%B0%94%E7%9A%84HTML5.user.js
// @updateURL https://update.greasyfork.org/scripts/422849/%E5%9C%B0%E7%BA%A7%E7%94%B5%E8%A7%86%E5%8F%B0%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E6%9B%BF%E6%8D%A2%E8%80%81%E6%8E%89%E7%89%99%E7%9A%84Flash%E4%B8%BA%E6%B4%8B%E6%B0%94%E7%9A%84HTML5.meta.js
// ==/UserScript==

function getQueryVariable(url, variable)
{
       var query = url;
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

(function() {
    'use strict';
    if (location.hostname == "lanmu.qtv.com.cn") {
        window.onload = () => {
            var videoURL = getQueryVariable(document.querySelector("*[name=flashvars]").value, "mp4");
            document.querySelector(".video-box").innerHTML = "<video src=\"" + videoURL + "\" controls></video>";
        }
    }

    // Your code here...
})();