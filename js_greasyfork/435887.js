// ==UserScript==
// @name         党旗飘飘，祖国伟大
// @namespace    null
// @version      1.0
// @description  刷课用的，可以秒刷（我爱中国，我爱中国共产党！！仅限学习交流技术使用）
// @author       qust
// @match        http://zhdj.cqupt.edu.cn/jjfz/play*
// @match        http://*.*.edu.cn/jjfz/play*
// @icon         http://www.gov.cn/ztzl/17da/183d03632724084a01bb02.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435887/%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%EF%BC%8C%E7%A5%96%E5%9B%BD%E4%BC%9F%E5%A4%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/435887/%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%EF%BC%8C%E7%A5%96%E5%9B%BD%E4%BC%9F%E5%A4%A7.meta.js
// ==/UserScript==
var timem=2000; //进入页面后等待时间，学校网络差的可以调高点，默认2000ms=2秒
var nuber=0 ;
var current=0;
var videoList=[];
//=================================================================
function init(){
 var videoLiList = document.getElementsByClassName("video_lists")[0].getElementsByTagName("ul")[0].getElementsByTagName("li");//获取播放列表
    for (let i = 0; i < videoLiList.length; i++) {
        const li = videoLiList[i];
        var a = li.getElementsByTagName("a")[0];
        var videoInf = {
            url : a.getAttribute("href"),
            name : a.innerText
        }
        videoList.push(videoInf);//把列表url和名字存下来

         if(hasClass(li,"video_red1")){
            current = i;
            nuber=videoLiList.length//视频数量
        }
    }
}
//==============================================================
function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}
//==============================================================
//点击播放
function clickPlayBtn(){
    var e = document.createEvent("MouseEvents");
    e.initEvent("click", true, true);
    var list = document.getElementsByClassName("plyr__controls__item plyr__control");//播放按钮
    for (let i = 0; i < list.length; i++) {
        const btn = list[i];
        if(btn.getAttribute("aria-label") == "Play"){
            btn.dispatchEvent(e)
        }
    }
}

//==================================================================



//看视频
function pldown(){
document.getElementById("video").currentTime = document.getElementById("video").duration-0.1;
clickPlayBtn();
}
//====================================================================
function sleep (time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
//====================================================
init();
async function main(){
    for( let i=current; i<nuber ;i++)
    {
    
    await sleep(timem);
    
    document.getElementById("video").currentTime = document.getElementById("video").duration-0.1;
    clickPlayBtn();
    await sleep(2000);  //默认播放完成后等2秒再跳转到下一个视频，你也可以改
        if (i<nuber-1)
    	{
    	location.href=videoList[i+1].url;
    	}
    else {
        alert("刷完了，臭傻逼（傻宝），退出去切换到下一个");
        break;
    }
    if(i==80){break}
    }
}
main();
////==================================================================================================
//下面这些东西没用，奶奶的，浪费时间了，可惜
//跳转到下一个链接
//function jump(x){
//location.href=videoList[x].url
//frameDom.setAttribute("src",videoList[x].url)
//function jump(x)
//location.href=videoList[x].url
//frameDom.setAttribute("src",videoList[x].url)
