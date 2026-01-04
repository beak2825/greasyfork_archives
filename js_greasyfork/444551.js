// ==UserScript==
// @name         重庆大学党旗飘飘刷课
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  try to take over the world!用法：只要打开个人中心-我的课程，脚本将自动化运行，直到刷完所有课程为止。若刷到已经看过的有进度条的课，最好点下手动播放，为节省时间，应拖拽至进度条终点或者直接点击到未完成的课。作者保留脚本相关所有权利，代码供广大用户研究使用
// @author       Charlie Zhao 重庆大学
// @match        http://cqu.dangqipiaopiao.com/user/lesson
// @match        http://cqu.dangqipiaopiao.com/zsdy/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dangqipiaopiao.com
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/2.0.0/jquery.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/444551/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/444551/%E9%87%8D%E5%BA%86%E5%A4%A7%E5%AD%A6%E5%85%9A%E6%97%97%E9%A3%98%E9%A3%98%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
let _self = unsafeWindow;
let classlist=[]
let x=0
let url=window.location.href
if(url=="http://cqu.dangqipiaopiao.com/user/lesson"){

    console.log("测试页面"+url)
    getClassList()

    let classL=document.querySelectorAll(".study_plan2")
    console.log(classL[0].querySelector(".fleft").querySelectorAll("div")[2].innerHTML)
    for(let i=0;i<classL.length;i++){

        if(classL[i].querySelector(".fleft").querySelectorAll("div")[2].innerHTML=="未完成"){
           console.log("yes")
           classlist[i].click()
           break
        }
    }

}
if(url.indexOf("http://cqu.dangqipiaopiao.com/zsdy/")!=-1){


    console.log("测试页面二")

    let ci = setInterval(()=>{
        if(document.querySelector(".public_cancel")){
        document.querySelector(".public_cancel").click()}
        if(document.querySelector(".public_submit")){
        document.querySelector(".public_submit").click()}
        if(document.querySelector(".plyr plyr--full-ui plyr--video plyr--html5 plyr--fullscreen-enabled plyr--paused")){
        document.querySelector(".plyr__control plyr__control--overlaid").click()}
    },1000);
    setTimeout(()=>{
        clearInterval(ci);

    },3000);
    setInterval(()=>{
        if(document.querySelector(".public_cancel")){
        document.querySelector(".public_cancel").click()}
        if(document.querySelector(".public_submit")){
        if(document.querySelector(".public_submit").innerHTML!="我知道了"&&document.querySelector(".public_submit")){
        document.querySelector(".public_submit").click()}}
        if(document.querySelector(".plyr plyr--full-ui plyr--video plyr--html5 plyr--fullscreen-enabled plyr--paused")){
            if(document.querySelector(".plyr__control plyr__control--overlaid")){
        document.querySelector(".plyr__control plyr__control--overlaid").click()}}
        getvideolist()
    },5000);


}

function getClassList() {
    let classList = []
    classList=document.getElementsByClassName("study_a")

    classlist = classList;
}
function getvideolist() {
    if(document.querySelector(".public_submit").innerHTML=="我知道了"&&document.querySelector(".public_submit")){
        let videoList=document.getElementsByClassName("video_lists")[0].querySelectorAll("li")
        console.log(videoList)
        let l=videoList.length
        for(let i=0;i<videoList.length;i++){
        console.log(videoList[i])
        if(videoList[i].className=="video_red1"){
            console.log(videoList[i]+"yes")
            x=i
            break
        }
    }
        if(x+1<l){videoList[x+1].querySelector("a").click()}
        else if(x+1==l){
        window.location.href ="http://cqu.dangqipiaopiao.com/user/lesson"
        }

}
}