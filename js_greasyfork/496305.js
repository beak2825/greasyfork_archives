// ==UserScript==
// @name         2024龙岗教师网络培训
// @namespace    http://tampermonkey.net/*
// @version      202405.28.1
// @description  网络培训 自动跳转播放
// @author       Wenhuy
// @match        https://saas.yunteacher.com/*
// @grant        none
// @license      MPL

// @downloadURL https://update.greasyfork.org/scripts/496305/2024%E9%BE%99%E5%B2%97%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/496305/2024%E9%BE%99%E5%B2%97%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==
window.onload = function(){

    let hre = location.href;
    if(hre.includes("https://saas.yunteacher.com/space/workbench")){
        setTimeout(click3, 800);
}
    else{
        if(hre.includes("https://saas.yunteacher.com/module/zzxx/learningTask")){
setTimeout(choose_item,3000);
        }
    else{
        if(hre.includes("https://saas.yunteacher.com/coursePlay?courseId")){
setTimeout(click2, 1000);
     sleep(1000);
    setTimeout(click1, 4000);
 sleep(1000);
     setTimeout(choose_study, 5500);

    setTimeout(function(){document.getElementById('ccH5jumpInto').click();},9000);

    setInterval(xiayijie,10000);
    setInterval(play1,1000);
}
}
}
}

function play1(){
    console.log('播放中...');
     var video=document.querySelector("video")
    video.play();
}


/*点击章节按钮*/
 var flag1 = false;
function click1(){
    console.log('选择列表');
    let hre = location.href;
    try{
        if(hre.includes("https://saas.yunteacher.com/coursePlay?courseId")){
            if(document.getElementsByClassName('courseCatalogue_item ')[0]){
               document.getElementsByClassName('courseCatalogue_item ')[0].click();
               flag1 = true;
            }
            else{
                setTimeout(click1, 1000);
            }
        }
    }catch(error){
        setTimeout(click1, 1000);
    }
}



/*点击开始按钮*/
var flag2 = false;
function click2(){
    console.log('开始学习');
    let hre = location.href;
    try{
        if(hre.includes("https://saas.yunteacher.com/coursePlay?courseId")){
            if(document.getElementsByClassName('startLearningBtn')[0]){
               document.getElementsByClassName('startLearningBtn')[0].click();
               flag2 = true;
            }
            else{
                setTimeout(click2, 1000);
            }
        }
    }catch(error){
        setTimeout(click2, 1000);
    }
}

var flag3 = false;
function click3(){
    console.log('点击立即前往');
    let hre = location.href;
    try{
        if(hre.includes("https://saas.yunteacher.com/space/workbench")){
            if(document.getElementsByClassName('active_operation')[0]){
               document.getElementsByClassName('active_operation')[0].click();
               flag3 = true;
            }
            else{
                setTimeout(click3, 1000);
            }
        }
    }catch(error){
        setTimeout(click3, 1000);
    }
}

function xiayijie(){
    console.log('执行判断页面是否正常');
   let hre = location.href;
    if(hre.includes("https://saas.yunteacher.com/coursePlay?courseId")){
    if(document.getElementsByClassName('coursePlay_header')[0].children[0].children[1].textContent=='已完成\n                '){
        setTimeout(function(){location.reload();}, 1000);}
        else {if(document.getElementsByClassName('nextSection_btn')[0]){
            document.getElementsByClassName('rewatch_btn')[0].click();
        }

            }
}
}


/*时间延迟*/
function sleep(delay) {
    for(var t = Date.now(); Date.now() - t <= delay;);
}
  function click_study(i){

      sleep(2000)
    if(document.getElementsByClassName('course_box')[i].children[0]){
        document.getElementsByClassName('course_box')[i].children[0].click();
    }
}

var flag_choose = false;
function choose_study(){
    console.log('遍历学习项目');
    var project_main = document.getElementsByClassName('course_box');
            var project_main_len = project_main.length

 for(var i = 0; i < project_main_len; i++){

                    if(document.getElementsByClassName('learningStatus')[i].textContent!='已学完 '){
                        if(!flag_choose){
                            if(document.getElementsByClassName('course_box')[i].children[0]){
        document.getElementsByClassName('course_box')[i].children[0].click();

    }
                            flag_choose = true;
                        }
                        break;
                        }
                             
   if(document.getElementsByClassName('learningStatus')[i].textContent='已学完 ' && i==project_main_len-1){

        window.location.href='https://saas.yunteacher.com/module/zzxx/learningTask?projectId=1005&roleId=26971'
 }

}
}


var kg001 = true;
function choose_item(){
console.log('遍历学习列表');
    var item_main_len = document.getElementsByClassName('learningProcess_box_subLevel_item').length;

 for(var j =0; j< item_main_len; j++){

                    if(document.getElementsByClassName('learningProcess_box_subLevelItem_content_right')[j].textContent!='  已完成   '){
                        if(kg001){
                            if(document.getElementsByClassName('learningProcess_box_subLevel_item')[j]){
        document.getElementsByClassName('learningProcess_box_subLevel_item')[j].click();

    }
                            kg001 = false;
                        }
                        break;
                    }
 }
}

