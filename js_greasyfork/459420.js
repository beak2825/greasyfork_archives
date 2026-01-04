// ==UserScript==
// @name         里番看看【已失效】
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  里番看看，站内任意里番免费看，站点：https://www.lf1080.com/
// @author       Ths
// @license      MIT License
// @match        https://www.lf1080.com/index.php?s=/vod-play-id-*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lf1080.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459420/%E9%87%8C%E7%95%AA%E7%9C%8B%E7%9C%8B%E3%80%90%E5%B7%B2%E5%A4%B1%E6%95%88%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/459420/%E9%87%8C%E7%95%AA%E7%9C%8B%E7%9C%8B%E3%80%90%E5%B7%B2%E5%A4%B1%E6%95%88%E3%80%91.meta.js
// ==/UserScript==

class NetworkError extends Error {
    constructor(message) {
        super(message);
        this.name = "NetworkError";
    }
}
 
async function getMediaInfo(){
    var mediaId, pId;
    try{
        mediaId=window.location.search.match(/-id-(\d+)/)[1];
        pId=window.location.search.match(/-pid-(\d+)/)[1];
    } catch(e){
        alert("未找到对应mediaId，当前location："+window.location);
        throw e;
    }
    var data=await fetch("/?s=Plus-Api-json&vodids="+mediaId).then(function(response) {
            if (!response.ok) {
                throw new NetworkError(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            if (error instanceof NetworkError) {
                console.error("Network error: ", error.message);
                alert("网络不通，无法完成搜索！");
            } else if (error instanceof TypeError) {
                console.error("Type error: ", error.message);
                alert("类型错误！");
            } else {
                console.error("Other error: ", error);
                alert("获取视频api数据失败，请检查服务器是否正常");
            }
            throw error;
        });
    try{
        var vod_play=data.data[0].vod_play;
        var all_url=data.data[0].vod_url;
        console.log("all_url: \n"+all_url);
        var vod_url=all_url.split("\r\n")[parseInt(pId)-1].slice(3);
    } catch(e){
        alert("获取json信息失败，请检查服务器是否正常");
        throw e;
    }
    return [vod_url, vod_play];
}
 
function insertScript(mediaName, vod_play) {
    var iframe=document.querySelector("iframe");
    iframe.style='';
    document.querySelector("div.cms-player-box").remove();
    var con=iframe.contentDocument.documentElement.querySelector('#cms_player');
    document.querySelector("#cms_player").setAttribute('class','embed-responsive embed-responsive-16by9');
    con.setAttribute('class','embed-responsive embed-responsive-16by9');
    var script1=document.createElement('script');
    script1.innerText=`var cms_player = {"yun":true,"url":"${mediaName}","copyright":0,"name":"${vod_play}","jiexi":"","time":0,"buffer":"https:\/\/www.hhhh1080.com\/buffer.html","pause":"https:\/\/www.hhhh1080.com\/pause.html","next_path":"","next_url":""};`;
    con.appendChild(script1);
    var script2=document.createElement('script');
    script2.src=`/Public/player/${vod_play}.js`;
    con.appendChild(script2);
    var script3=document.createElement('script');
    script3.src="/Tpl/dc01/js/hls.min.js";
    con.appendChild(script3);
    var div=document.createElement('div');
    div.id="dplayer";
    div.setAttribute("class", "embed-responsive-item");
    con.appendChild(div);
}
 
function isVideo(){
    let isvideo = 0;
    let info = window.location.search;
    if(-1!==info.search("/vod-play-id-")){
        isvideo=1;
        console.log('isvideo=true');
    }
    //return 1;
    return isvideo;
}
 
/*window.addEventListener('load', () => {
    'use strict';
*/
if(isVideo()){
    setTimeout(async () => {
        var mediaUnit=await getMediaInfo();
        console.log(mediaUnit);
        insertScript(mediaUnit[0], mediaUnit[1]);
    }, 800);
}
//});