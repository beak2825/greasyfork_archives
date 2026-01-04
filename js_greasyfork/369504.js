// ==UserScript==
// @name         xvideos download script
// @namespace    http://nicefix.org/
// @version      1.0
// @description  You can easily download the video.
// @author       tpgus3112@gmail.com
// @match        *://www.xvideos.com/*
// @match        *://www.xvideos.com/*
// @match        *://*.xvideos.com/*
// @grant        GM_download
// @grant        GM_info
// @downloadURL https://update.greasyfork.org/scripts/369504/xvideos%20download%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/369504/xvideos%20download%20script.meta.js
// ==/UserScript==
window.onload = function(){

var htmls = document.getElementById("content");
var conver_txt = htmls.getElementsByTagName("script")[4].text;
var myNode = document.getElementById("video-tabs");

if (conver_txt.indexOf('setVideoUrlHigh') != -1){
    high_video(conver_txt);
 } else {
    low_video(conver_txt);
};

function high_video(text){
    var urlRegex = /(https?:\/\/[^\s]+)'/g;
    var getVideo_link = /(https:\/\/[^\s]+]*-[^\s]+\/mp4\/[^\s]+')/g;
    return text.replace(getVideo_link, function(url) {
        console.log("고화질 : " + url);
        addDownloadBtn(url);
    })
}
function low_video(text){
    var urlRegex = /(https?:\/\/[^\s]+)'/g;
    var getVideo_link = /(https:\/\/[^\s]+]*-[^\s]+\/3gp\/[^\s]+')/g;
     return text.replace(getVideo_link, function(url) {
        console.log("저화질 : " + url);
        addDownloadBtn(url);
    })
}
function addDownloadBtn(urls){
    var myNode = document.getElementById("video-tabs");
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    var downloadBtn = document.createElement('button');
    downloadBtn.setAttribute('id','DownloadVideoBtn');
    downloadBtn.setAttribute('value','영상 다운로드');
    downloadBtn.setAttribute('class','DownloadVideoBtn');
    downloadBtn.setAttribute('data-link',urls);
    downloadBtn.innerText = '영상 다운로드';
    myNode.appendChild(downloadBtn);
    window.onclick = e => {
    if (e.target.className == "DownloadVideoBtn") {
        download(urls);
    }
   };
  }
}

function download(url) {
    url = url.replace("'","");
    var title = document.getElementsByClassName('page-title')[0];
    var re_time = document.getElementsByClassName('duration')[0];
    title.removeChild(re_time);
    var video_title = title.innerText;
    var arg = {
        url: url,
        name: video_title
    };
    alert('영상을 미리로드중입니다. 완료시 다운로드 여부를 물어보겠습니다. 이는 다른 영상을 탐색중에도 백그라운드에서 작동됩니다.');
    console.log('다운로드 시작 : ' + url);
    GM_download(arg)
}


