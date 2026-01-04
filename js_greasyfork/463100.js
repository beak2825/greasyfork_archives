// ==UserScript==
// @name         融优学堂
// @namespace    https://www.livedu.com.cn/
// @version      0.5
// @description  融优学堂自动刷课（Latest）
// @author       yuri_vivy
// @match        *://*.livedu.com.cn/*/queryAllZjByKcdm.do
// @match        *://livedu.com.cn/*/queryAllZjByKcdm.do
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livedu.com.cn
// @grant        none
// @license      AGPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/463100/%E8%9E%8D%E4%BC%98%E5%AD%A6%E5%A0%82.user.js
// @updateURL https://update.greasyfork.org/scripts/463100/%E8%9E%8D%E4%BC%98%E5%AD%A6%E5%A0%82.meta.js
// ==/UserScript==

function judgePlay(){
    //判断视频是否播放
    if((window.frames["zwshow"].document.getElementById("myVideo_1") != null)&&(window.frames["zwshow"].document.getElementById("sp_index_1").innerHTML != '已完成')){
        if(window.frames["zwshow"].document.getElementById("myVideo_1").currentTime == 0){
        console.log("当前视屏未播放");
        window.frames["zwshow"].document.querySelectorAll("#video-img > a")[0].click()
        window.frames["zwshow"].document.getElementById("myVideo_1").play();}
        else {console.log("2.当前正在播放视频一");}}

    else if((window.frames["zwshow"].document.getElementById("myVideo_2") != null)&&(window.frames["zwshow"].document.getElementById("sp_index_2").innerHTML != '已完成')){
        if(window.frames["zwshow"].document.getElementById("myVideo_2").currentTime == 0){
            console.log("当前视屏未播放");
            window.frames["zwshow"].document.querySelectorAll("#video-img > a")[1].click()
            window.frames["zwshow"].document.getElementById("myVideo_2").play();}
        else{console.log("2.当前正在播放视频二");}}

    else if((window.frames["zwshow"].document.getElementById("myVideo_3") != null)&&(window.frames["zwshow"].document.getElementById("sp_index_3").innerHTML != '已完成')){
        if(window.frames["zwshow"].document.getElementById("myVideo_3").currentTime == 0){
            console.log("当前视屏未播放");
            window.frames["zwshow"].document.querySelectorAll("#video-img > a")[2].click()
            window.frames["zwshow"].document.getElementById("myVideo_3").play();}
        else{console.log("2.当前正在播放视频三");}}

    else if((window.frames["zwshow"].document.getElementById("myVideo_4") != null)&&(window.frames["zwshow"].document.getElementById("sp_index_4").innerHTML != '已完成')){
        if(window.frames["zwshow"].document.getElementById("myVideo_4").currentTime == 0){
            console.log("当前视屏未播放");
            window.frames["zwshow"].document.querySelectorAll("#video-img > a")[3].click()
            window.frames["zwshow"].document.getElementById("myVideo_4").play();}
        else{console.log("2.当前正在播放视频四");}}

    else if((window.frames["zwshow"].document.getElementById("myVideo_5") != null)&&(window.frames["zwshow"].document.getElementById("sp_index_5").innerHTML != '已完成')){
        if(window.frames["zwshow"].document.getElementById("myVideo_5").currentTime == 0){
            console.log("当前视屏未播放");
            window.frames["zwshow"].document.querySelectorAll("#video-img > a")[4].click()
            window.frames["zwshow"].document.getElementById("myVideo_5").play();}
        else{console.log("2.当前正在播放视频五");}}

    else if((window.frames["zwshow"].document.getElementById("myVideo_6") != null)&&(window.frames["zwshow"].document.getElementById("sp_index_6").innerHTML != '已完成')){
        if(window.frames["zwshow"].document.getElementById("myVideo_6").currentTime == 0){
            console.log("当前视屏未播放");
            window.frames["zwshow"].document.querySelectorAll("#video-img > a")[5].click()
            window.frames["zwshow"].document.getElementById("myVideo_6").play();}
        else{console.log("2.当前正在播放视频六");}}

    else {console.log("出现未知错误，若能正常运行请忽视（第一次出现请忽视");}
}

function judgeTest(){
    //判断是否有测验
    if(window.frames["zwshow"].document.querySelector("body > div.xx-main-box > div > div.tiele-h5") == null){;}
    else{return 1;}
}

function judgeJump(){
//判断本节课程全部视频是否已经看完，看完则跳转到一个视频
    if(window.frames["zwshow"].document.getElementById("sp_index_1") != null){
        if(window.frames["zwshow"].document.getElementById("sp_index_1").innerHTML == '已完成'){
            console.log("视频一已经观看完成");
            if(window.frames["zwshow"].document.getElementById("sp_index_2") != null){
                if(window.frames["zwshow"].document.getElementById("sp_index_2").innerHTML == '已完成'){
                    console.log("视频二已经观看完成");
                    if(window.frames["zwshow"].document.getElementById("sp_index_3") != null){
                        if(window.frames["zwshow"].document.getElementById("sp_index_3").innerHTML == '已完成'){
                            console.log("视频三已经观看完成");
                            if(window.frames["zwshow"].document.getElementById("sp_index_4") != null){
                                if(window.frames["zwshow"].document.getElementById("sp_index_4").innerHTML == '已完成'){
                                    console.log("视频四已经观看完成");
                                    if(window.frames["zwshow"].document.getElementById("sp_index_5") != null){
                                        if(window.frames["zwshow"].document.getElementById("sp_index_5").innerHTML == '已完成'){
                                            console.log("视频五已经观看完成");
                                            if(window.frames["zwshow"].document.getElementById("sp_index_6") != null){
                                                if(window.frames["zwshow"].document.getElementById("sp_index_6").innerHTML == '已完成'){
                                                    console.log("视频六已经观看完成");
                                                    document.getElementById("downz").click();}
                                                else{console.log("1.正在持续观看视频六");}}
                                            else{document.getElementById("downz").click();}}
                                         else{console.log("1.正在持续观看视频五");}}
                                    else{document.getElementById("downz").click();}}
                                else{console.log("1.正在持续观看视频四");}}
                            else{document.getElementById("downz").click();}}
                        else{console.log("1.正在持续观看视频三");}}
                    else{document.getElementById("downz").click();}}
                else{console.log("1.正在持续观看视频二");}}
            else{document.getElementById("downz").click();}}
        else{console.log("1.正在持续观看视频一");}}
    else{console.log("1.程序出现错误，请于作者联系反馈或自行查错修正代码");}
}


(function() {
    'use strict';
    window.frames;
    window.onload;
    console.log("脚本开始运行,请手动播放第一个视频");
    var time_1 = 0;

    //每隔一分钟执行一次判断程序
    var inter = setInterval(function(){
        judgeJump();
        judgePlay();
        judgeTest();
        time_1++;
        //为避免出现未知错误，脚本单次最大运行时间为200分钟
        if(time_1 >= 200){
            clearInterval(inter);
            console.log("，超出最大时间限制，已退出脚本");}
        //有测验则退出脚本
        else if(judgeTest()==1){
            clearInterval(inter);
            console.log("检测到有测验，已退出脚本。请完成测验后，手动进入下一节课程刷并新页面继续执行脚本");}

        else {console.log ("3.当前脚本已运行" + time_1 + "分钟");}
}, 60000);
})();