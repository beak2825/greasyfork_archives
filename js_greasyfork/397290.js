// ==UserScript==
// @name         EOL.YZU.EDU Tools
// @namespace    http://thereisnowebsite.com/
// @version      0.3.2
// @description  让大家更方便的使用YZU的在线网课系统:)
// @author       Cairo
// @create       2020.02.27
// @match        http://eol.yzu.edu.cn/meol/microlessonunit/viewMicroLessnMulti.do*
// @match        http://eol.yzu.edu.cn/meol/common/script/preview/download_preview.jsp*
// @note         2020.03.04-V0.3 优化界面,并在教学资源里添加了无权限限制的下载按钮。
// @note         2020.03.03-V0.2 给EOL里的观看教学视频页面进行了极端简化，并添加了下载按钮，不方便上网的同学可以离线下载看。
// @note         2020.02.27-V0.1 给EOL里的观看教学视频添加了倍速。
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/397290/EOLYZUEDU%20Tools.user.js
// @updateURL https://update.greasyfork.org/scripts/397290/EOLYZUEDU%20Tools.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    if(location.pathname == "/meol/microlessonunit/viewMicroLessnMulti.do"){

        var columnName = document.getElementById("columnName").innerText;
        document.title=columnName;

        var video = document.getElementById("video");
        var videoUrl = document.getElementById("ckplayer_video").src;

        document.getElementsByClassName("wrap")[0].remove();

        var videoWindow = document.createElement("video");
        videoWindow.id = "video";
        videoWindow.src = videoUrl;
        videoWindow.controls = "true";
        videoWindow.setAttribute("style","height:80%; width:100%; display:block;")
        document.body.appendChild(videoWindow);

        var playBackRateSelect = document.createElement("select");

        playBackRateSelect.options[0] =new Option("0.50x",0.50);
        playBackRateSelect.options[1] =new Option("0.75x",0.75);
        playBackRateSelect.options[2] =new Option("1.00x",1.00);
        playBackRateSelect.options[3] =new Option("1.25x",1.25);
        playBackRateSelect.options[4] =new Option("1.50x",1.50);
        playBackRateSelect.options[5] =new Option("1.75x",1.75);
        playBackRateSelect.options[6] =new Option("2.00x",2.00);
        playBackRateSelect.style.fontSize = "14px";

        document.body.appendChild(playBackRateSelect);
        playBackRateSelect.options[2].selected = true;
        playBackRateSelect.addEventListener('change',function(){
            videoWindow.playbackRate = this.value;
        });

        var downloadAnchor = document.createElement("a");
        downloadAnchor.id = "download"
        downloadAnchor.href = videoUrl;
        downloadAnchor.innerHTML = "下载";
        downloadAnchor.setAttribute("style","color:#0a4b83; font-size:14px")
        document.body.appendChild(downloadAnchor);
    }

    else if(location.pathname == "/meol/common/script/preview/download_preview.jsp"){
        if(document.getElementsByClassName("lv-download").length == 0){

            var downloadUrl = "http://eol.yzu.edu.cn/meol/common/script/download.jsp" + location.search;

            var downloadAnchor = document.createElement("a");
            downloadAnchor.id = "download"
            downloadAnchor.href = downloadUrl;
            downloadAnchor.innerHTML = "下载";
            downloadAnchor.setAttribute("style","color:#0a4b83; font-size:14px")
            document.getElementsByClassName("right")[0].appendChild(downloadAnchor);
        }

    }

})();