// ==UserScript==
// @name         下载PornHub字幕
// @namespace    http://gist.github.com/lossj
// @version      0.1.2
// @description  点击下载PornHub视频的字幕
// @author       LossJ
// @match        https://*.pornhub.com/view_video.php?viewkey=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416612/%E4%B8%8B%E8%BD%BDPornHub%E5%AD%97%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/416612/%E4%B8%8B%E8%BD%BDPornHub%E5%AD%97%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function parseContext(){
        var codeUrl = document.querySelector('meta[property="og:image"]').getAttribute("content");
        var code = codeUrl.split("/")[6];
        var ccURL = "https://cn.pornhub.com/video/caption?id=" + code;
        var title = document.querySelector(".title-container");
        var titleContent = title.querySelector("span").textContent;
        return [code, ccURL, title, titleContent];
    }
    function createBtn(){
        var [code, ccURL, title, titleContent] = parseContext();
        console.log(code, ccURL, title, titleContent);
        var parent = title.parentNode;
        var downloadCcBtn = document.createElement("a");
        var textNode=document.createTextNode("点击下载字幕");
        downloadCcBtn.appendChild(textNode);
        downloadCcBtn.href = ccURL;
        downloadCcBtn.download = titleContent + ".vtt";
        parent.insertBefore(downloadCcBtn, title);
    }
    function ifCc(){
        var ccBtn = document.querySelector(".mhp1138_front > .mhp1138_cc");
        if(ccBtn){
            console.log("has cc");
            return true;
        }else{
            console.log("has not cc");
            return false;
        }
    }
    function main(){
        if (ifCc()){
            createBtn();
        }
    }
    setTimeout(main, 2000);
})();