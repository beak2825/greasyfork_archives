// ==UserScript==
// @name         cnBeta视频地址
// @namespace    undefined
// @version      0.1
// @description  显示cnBeta中的视频源地址，特别适合未安装Flash的Safari用户。配合html5视频播放插件，在视频的源地址观看cnBeta上的视频。
// @author       You
// @include      *cnbeta.com/*
// @grant        none
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/32593/cnBeta%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/32593/cnBeta%E8%A7%86%E9%A2%91%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

var video_link;
var video_id;

var content=document.getElementById('artibody');
var video = content.getElementsByTagName('iframe')[0];
if (video){
    //alert(typeof(video.parentNode.nextSibling.innerHTML));
    video_link = video.src;
    video_id = video_link.split('/')[4];
    //alert(source_link(video_id));
    var link = document.createElement('a');
    link.innerText = '视频链接';
    link.href = source_link(video_id);
    link.target="_blank";
    content.insertBefore(link, video.parentNode.nextSibling);

}
else{
    video = content.getElementsByTagName('embed')[0];
    if(video){
        //alert(typeof(video.parentNode));
        video_link = video.src;
        video_id = video_link.split('/')[5];
        //alert(source_link(video_id));
        var link = document.createElement('a');
        link.innerText = '视频链接';
        link.href = source_link(video_id);
        link.target="_blank";
        content.insertBefore(link, video.parentNode.nextSibling);
    }
}
function source_link(video_id){
    var source_video = "http://v.youku.com/v_show/id_";
    var source_video_link = source_video+video_id;
    return source_video_link;
}