// ==UserScript==
// @name         友看课堂小助手
// @namespace    UcansHelper
// @version      1.4.4
// @description  [非官方] 云课堂自动签到等辅助功能及优化。
// @author       MyBlueHorizon
// @homepage     https://github.com/MyBlueHorizon/UcansHelper
// @supportURL   https://github.com/MyBlueHorizon/UcansHelper/issues
// @match        *://www.ucans.net/chatRoom/*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.6.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/toastr@2.1.4/toastr.min.js
// @resource     toastrCSS https://cdn.jsdelivr.net/npm/toastr@2.1.4/build/toastr.min.css
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getResourceText
// @icon         https://www.ucans.net/chatRoom/favicon.ico
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/406126/%E5%8F%8B%E7%9C%8B%E8%AF%BE%E5%A0%82%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/406126/%E5%8F%8B%E7%9C%8B%E8%AF%BE%E5%A0%82%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

// var danmakuInitInterval

(function() {

    'use strict';

    //添加 toastr 通知样式表
    GM_addStyle(GM_getResourceText("toastrCSS"))

    //判断浏览器是否支持通知 API
    if (!("Notification" in window)) {

        toastr.warning("浏览器不支持桌面通知，部分功能无法使用，请更新浏览器")

    }

    //判断当前页面
    var nowUrl = window.location.pathname;

    //直播页面
    if (nowUrl == "/chatRoom/video_live.html"){

        toastr.info("脚本已启用")
        toastr.warning("请合理使用，脚本造成的一切后果概不负责!","免责声明")

        
        //判断是否开启签到
        if(GM_getValue("isAutoCheckRoll", true)==true){
            setInterval(ClickBtn, 3000)
            toastr.info("签到模块已启用")
        }

        /* //判断消息是否弹幕化
        if(GM_getValue("isDanmakuDiscuss", true)==true){
            toastr.info("弹幕模块已启用")
            danmakuInitInterval=setInterval(readyDanmakuInit,1000)
        } */

        //假装可以互动
        var toolbar_elements = document.getElementsByClassName("video-discuss-tool")
        toolbar_elements[0].innerHTML=toolbar_elements[0].innerHTML+'<input type="button" id="caninteractionbut" value="假装自己可以互动" onclick="setStudentClientStatus(1)"/>'

        console.info("UcansHelper 载入成功")
        
    }

    //课程页面
    if (nowUrl == "/chatRoom/Course_page.html"){

        console.info("UcansHelper 载入成功")

        //显示听课时间
        if(GM_getValue("isShowClassTime", true)==true){

            toastr.info(localStorage.getItem("localStudyingTimeLive"),"听课时间")

        }

        //修改课程页面
        changeCoursePage()

        //绑定设置按钮实践
        let settingButton = document.getElementById('settingButton');
        settingButton.onclick = showSettingBox;

        //载入设置状态

        //自动签到
        document.getElementById("autoCheckRoll").checked=GM_getValue("isAutoCheckRoll", true)
        let autoCheckRoll = document.getElementById('autoCheckRoll');
        autoCheckRoll.onclick = setAutoCheckRoll;

        //显示上课时间
        document.getElementById("showClassTime").checked=GM_getValue("isShowClassTime", true)
        let showClassTime = document.getElementById('showClassTime');
        showClassTime.onclick = setShowClassTime;

        //重写课程页面
        let reWriteClassPage = document.getElementById('reWriteClassPage');
        reWriteClassPage.disabled=true
        reWriteClassPage.checked=true

        //弹幕化讨论区
        document.getElementById("danmakuDiscuss").checked=GM_getValue("isDanmakuDiscuss", true)
        let danmakuDiscuss = document.getElementById('danmakuDiscuss');
        danmakuDiscuss.onclick = setDanmakuDiscuss;
        danmakuDiscuss.disabled=true
        danmakuDiscuss.checked=false

        //设定页脚动画
        document.getElementsByClassName("svg-box")[0].style.fontSize="medium"
        document.getElementsByClassName("svg-box")[0].style.marginBottom="0"

        //页脚置底（未完成）
        //document.getElementsByClassName("svg-box")[0].style.marginTop=document.documentElement.clientHeight-document.getElementById("svgbox").offsetTop+"px"
        //document.getElementsByClassName("svg-box")[0].style.marginTop=
        //document.getElementsByClassName("svg-box2")[0].style.fontSize="medium"

    }

})();

//显示设置页面
function showSettingBox(e) {

    if (document.getElementById("setting-box").style.display=="block"){
        document.getElementById("setting-box").style.display="none"
    }
    else {
        document.getElementById("setting-box").style.display="block"
    }

}

//设置更改

//自动签到
function setAutoCheckRoll(e) {

    if (document.getElementById("autoCheckRoll").checked==true){
        GM_setValue("isAutoCheckRoll", true)
        toastr.success("自动签到已启用")
    }
    else {
        GM_setValue("isAutoCheckRoll", false)
        toastr.success("自动签到已禁用")
    }

}

//显示听课时间
function setShowClassTime(e) {

    if (document.getElementById("showClassTime").checked==true){
        GM_setValue("isShowClassTime", true)
        toastr.success("时间显示已启用")
    }
    else {
        GM_setValue("isShowClassTime", false)
        toastr.success("时间显示已禁用")
    }

}

//弹幕化讨论区
//云课堂播放器改版，旧有代码失效，待修复
/* function setDanmakuDiscuss(e) {

    if (document.getElementById("danmakuDiscuss").checked==true){
        GM_setValue("isDanmakuDiscuss", true)
        toastr.success("弹幕讨论已启用")
    }
    else {
        GM_setValue("isDanmakuDiscuss", false)
        toastr.success("弹幕讨论已禁用")
    }

} */



//修改课程页面
function changeCoursePage(){

    //修改元素样式
    document.getElementsByClassName("c-top-con clearfix")[0].style.width ="auto"
    document.getElementsByClassName("c-main")[0].style.width ="auto"
    document.getElementsByClassName("c-top")[0].style.background ="#1677b3"
    document.getElementById("Today_course").style.color ="#1677b3"
    document.getElementById("Today_course").style.borderBottomColor ="#1677b3"
    document.getElementById("course_set").style.color ="#1677b3"
    document.getElementById("course_set").style.borderBottomColor ="#1677b3"
    document.getElementById("old_course").style.color ="#1677b3"
    document.getElementById("old_course").style.borderBottomColor ="#1677b3"
    document.getElementById("demand_list").style.color ="#1677b3"
    document.getElementById("demand_list").style.borderBottomColor ="#1677b3"
    document.getElementById("file_list").style.color ="#1677b3"
    document.getElementById("file_list").style.borderBottomColor ="#1677b3"

    //添加页面样式
    var setstyle = document.createElement("style");
    setstyle.innerHTML=".checke{float:right;position:relative;-webkit-appearance:none;width:40px;height:20px;line-height:20px;background:#eee;border-radius:10px;outline:none;border:2px solid #999}.checke:before{position:absolute;left:0;content:'';width:12px;height:12px;border-radius:50%;background:#eee;box-shadow:0 0 5px #ddd;transition:all .2s linear;border:2px solid #999}.checke:checked{background:#01a1d6}.checke:checked:before{left:20px;transition:all .2s linear };svg:not(:root) {overflow: hidden;}svg {width: 100%}.svg-box{height: 146px;margin-top: 100px;}.editorial {height: 150px;margin-top: -150px;}.editorial {display: block;width: 100%;height: 10em;max-height: 100vh;margin-top: -101px;}.parallax>use {animation: move-forever 12s linear infinite;}.parallax>use:nth-child(1) {animation-delay: -2s;}.parallax>use:nth-child(2) {animation-delay: -2s;animation-duration: 5s;}.parallax>use:nth-child(3) {animation-delay: -4s;animation-duration: 3s;}@keyframes move-forever {0% {transform: translate(-90px,0);}100% {transform: translate(85px,0);}"
    document.getElementsByTagName('head')[0].appendChild(setstyle);

    //添加设置按钮和内容
    var settingButton=document.createElement("li");
    var topBar=document.getElementsByClassName("c-main-btn clearfix")
    settingButton.id="settingButton"
    settingButton.style="color: rgb(22, 97, 171);float: right;margin-right: 47px;"
    settingButton.innerHTML="脚本设置";
    topBar[0].appendChild(settingButton);

    var settingbox=document.createElement("div");
    settingbox.id="setting-box"
    settingbox.style="display: none;margin-left: 47px;margin-right: 47px;font-size: 24px;margin-bottom: 47px;background: #f8f8f8;height: 214px;"
    settingbox.innerHTML='<li style="margin-left: 24px;padding-top: 8px;">友看课堂小助手 设置</li><div style="padding : 8px 48px 0px 48px;clear : both;background: #f8f8f8; height: 24px;"><span style="float : left;display : inline-block;color : rgb(0,0,0);font-size: 18px;">自动签到</span><input type="checkbox" class="checke" id="autoCheckRoll"></div><div style="padding : 8px 48px 0px 48px;clear : both;background: #f8f8f8; height: 24px;"><span style="float : left;display : inline-block;color : rgb(0,0,0);font-size: 18px;">显示上课时间</span><input id="showClassTime" type="checkbox" class="checke"></div><div style="padding : 8px 48px 0px 48px;clear : both;background: #f8f8f8; height: 24px;"><span style="float : left;display : inline-block;color : rgb(0,0,0);font-size: 18px;">优化课程页面 [锁定]</span><input id="reWriteClassPage" type="checkbox" class="checke"></div><div style="padding : 8px 48px 0px 48px;clear : both;background: #f8f8f8; height: 24px;"><span style="float : left;display : inline-block;color : rgb(0,0,0);font-size: 18px;">评论区消息弹幕显示[弃用]</span><input id="danmakuDiscuss" type="checkbox" class="checke"></div>'
    document.getElementsByClassName("c-main")[0].insertBefore(settingbox,document.getElementById("c-main-box1"));

    //添加页脚
    var donghua=document.createElement("footer");
    donghua.className="svg-box"
    donghua.id="svgbox"
    document.getElementsByTagName('body')[0].appendChild(donghua)
    document.getElementsByClassName("svg-box")[0].innerHTML="<svg class='editorial'xmlns='http://www.w3.org/2000/svg'xmlns:xlink='http://www.w3.org/1999/xlink'viewBox='0 24 150 28'preserveAspectRatio='none'><defs><path id='gentle-wave'd='M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z'></path></defs><g class='parallax'><use xlink:href='#gentle-wave'x='50'y='0'fill='rgba(128,215,175,.5)'></use><use xlink:href='#gentle-wave'x='50'y='3'fill='rgba(128,215,175,.5)'></use><use xlink:href='#gentle-wave'x='50'y='6'fill='rgba(128,215,175,.5)'></use></g></svg>"

}

function ClickBtn() {
    var st_elements = document.getElementsByClassName("st_Roll");
    var btn_elements = document.getElementsByClassName("st_Roll").rollDiv.children;
    var myDate = new Date();
    var mytime = myDate.toLocaleTimeString();
    try {
        if (st_elements.rollDiv.style.display == "" || st_elements.rollDiv.style.display =="block") {
            btn_elements[1].click()
            console.info("已执行签到操作，于"+ mytime)
            NotifyMe("操作成功","已执行签到操作，于"+ mytime)
        }
    } catch(err) {
        console.error(`脚本错误:${err}`)
        NotifyMe("操作失败","脚本出错了，于"+ mytime)
    }
}

function NotifyMe(title,massgae) {
    if (Notification.permission === "granted") {
        var notification = new Notification(title, {
            body: massgae,
            icon: "https://www.ucans.net/chatRoom/favicon.ico"
        });
    }
    else if (Notification.permission !== 'denied') {
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                var notification = new Notification(title, {
                    body: massgae,
                    icon: "https://www.ucans.net/chatRoom/favicon.ico"
                });
            }
        });
    }
}
