// ==UserScript==
// @name         职连盟，刷视频，自动刷，职联盟刷课
// @namespace    https://topaa.top/
// @version      0.3
// @description  搭配虚拟摄像头使用，可以后台，无需点击，懒人必备
// @author       今天是充满希望的一天
// @match        *://www.zkpingtai.com/*
// @downloadURL https://update.greasyfork.org/scripts/474571/%E8%81%8C%E8%BF%9E%E7%9B%9F%EF%BC%8C%E5%88%B7%E8%A7%86%E9%A2%91%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%B7%EF%BC%8C%E8%81%8C%E8%81%94%E7%9B%9F%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/474571/%E8%81%8C%E8%BF%9E%E7%9B%9F%EF%BC%8C%E5%88%B7%E8%A7%86%E9%A2%91%EF%BC%8C%E8%87%AA%E5%8A%A8%E5%88%B7%EF%BC%8C%E8%81%8C%E8%81%94%E7%9B%9F%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log("--------------------------运行成功---------------------------------");
    // 初始化播放，由于Chrome设置不允许默认播放视频，因此，需要用户点击一下任何一处
    setTimeout(function(){
        if (document.getElementsByClassName("fist_face")[0] != undefined){
           document.getElementsByClassName("fist_face")[0].click();
        }
    },3000);
    function init_face() {
         if (document.getElementsByClassName("el-button my-reload-btn el-button--default")[3] != undefined && document.getElementsByClassName("el-button my-reload-btn el-button--default")[3].innerHTML.includes("开始认证")){
            document.getElementsByClassName("el-button my-reload-btn el-button--default")[3].click();
            console.log("--------------------------init_face---------------------------------");
        }
    }
    var c_fc = 1;
    var c_fc_2 = 1;
    function init_close_face() {
        c_fc = 1;
        c_fc_2 = 1;
    }
    function close_face() {
        console.log("--------------------------close_face---------------------------------");
        if (document.getElementsByClassName("el-button my-reload-btn el-button--default")[3] != undefined && document.getElementsByClassName("el-button my-reload-btn el-button--default")[3].innerHTML.includes("开始认证") && document.getElementsByClassName("el-dialog__body")[0].getElementsByTagName("div")[0].style.display == 'none' && c_fc_2 == 1){
            document.getElementsByClassName("el-button my-reload-btn el-button--default")[3].click();
            console.log("--------------------------init_face---------------------------------");
            c_fc_2 = 0;
        // 开始看视频中的人脸突击检测
        }else if ( document.getElementById("videoCamera") !=null && document.getElementById("videoCamera") != undefined && document.getElementById("learnApp").getElementsByClassName("el-dialog__wrapper")[0].style.display != 'none' && c_fc == 1){
            document.getElementById("switchCamera").click();
            c_fc = 0;
            c_fc_2 = 1;
            console.log("-----close_face_switchCamera------");
        }else if (document.getElementsByClassName("fist_face")[0].style.display != 'none'){
            console.log("--------------------------display != 'none'---------------------------------");
            document.getElementsByClassName("fist_face")[0].click();
        // 后台播放
        }else if (document.getElementsByTagName("video")[0].ended == false && document.getElementsByTagName("video")[0].paused){
           document.getElementsByTagName("video")[0].play();
            console.log("-----close_face_后台播放------");
        } else if (document.getElementsByTagName("video")[0].muted != undefined && document.getElementsByTagName("video")[0].muted == false){
            document.getElementsByTagName("video")[0].muted = true;
            console.log("-----close_face_静音------");
        }
    }
    // 10秒执行一次检测
    setInterval(close_face,10000);
    setInterval(init_close_face,200000);
   // setInterval(init_face,19000);
})();