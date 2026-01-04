// ==UserScript==
// @name        湖南大学继续教育
// @namespace   Violentmonkey Scripts
// @match       *://jxjyjd.hnu.edu.cn/*
// @grant       none
// @version     2.3
// @author      -
// @description 湖南大学自动切课，24年公共科目自动考试代刷+V{lly6655}
// @license     咀嚼 代刷+V[lly6655]
// @downloadURL https://update.greasyfork.org/scripts/498628/%E6%B9%96%E5%8D%97%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/498628/%E6%B9%96%E5%8D%97%E5%A4%A7%E5%AD%A6%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
let hre = location.href
var kc = 'https://jxjyjd.hnu.edu.cn/my/courses/learning'
//查找课程
var czkc = document.querySelectorAll("a.btn.cd-btn.cd-btn-primary.cd-btn-sm")
//学习进度
var xxjd = document.querySelectorAll("div.progress-text")
//教学计划查找未学课程
var jxjh = 'https://jxjyjd.hnu.edu.cn/my/course/1'
var jxjhcz = document.querySelectorAll("a.title")
var jd= document.getElementsByClassName('num')[2]
//调转未学课程
function dzwxkc() { if(hre.includes(kc)){if(czkc[0]){czkc[0].click()}else{console.log('已学完所有课程');}}}
function dzwxkc2() { if(hre.includes(jxjh)){if(jd.innerText != '100%'){jxjhcz[jxjhcz.length-1].click()}else{window.location.replace(kc)}}}
setInterval(dzwxkc,2000)
setInterval(dzwxkc2,2000)
///////课程学习页面
//点击目录
var ml = document.getElementsByClassName('mbs es-icon es-icon-menu')
function djml() { try { ml[0].click()} catch(err) {}}
setTimeout(djml, 2000)
//跳转未学的小节课程
function xyg() {
var aa = document.querySelectorAll("i.es-icon.es-icon-iccheckcircleblack24px.color-primary.left-menu")
//var anchor = document.getElementsByClassName("title");
var anchor = document.getElementsByClassName("task-item task-content  mouse-control infinite-item")
var URL1 = window.location.pathname;
var URL11 = String(URL1);
 try {
//var URL2 = anchor[aa.length].getAttribute('href');
var URL2 = anchor[aa.length].getElementsByClassName('title')[0].getAttribute('href');
var URL22 = String(URL2);
//if(URL11  != URL22){anchor[aa.length].click()}  } catch(err) {}
if(URL11  != URL22){anchor[aa.length].getElementsByClassName('title')[0].click()}  } catch(err) {}
if(aa[anchor.length-1]){if(!hre.includes(kc)){window.location.replace(kc)}}
}
setInterval(xyg,5000)
//播放视频
//function bf() { var v = document.querySelector("#example_video_1_html5_api");if(v.pause){v.play()}}
//setInterval(bf,4000)
////////
//出现重复学提示、多页面学习
var cfxts = document.querySelector("div.modal-content")
var cfxdj = document.querySelector("button.cd-btn.cd-btn-link-primary.cd-btn-lg")
var dymxx = 'https://jxjyjd.hnu.edu.cn/task/learn/repeat/error'
var dymxxdj = document.querySelector("a.btn.btn-info.btn-repeat-error-continue")
function cfx() { if(cfxts){cfxdj.click()};if(hre.includes(dymxx)){dymxxdj.click()}}
setInterval(cfx,4000)


/////2024公需课考试
//考试页面
var ks = 'https://jxjyjd.hnu.edu.cn/testpaper/'
//交卷
var ks1=  document.querySelector("#finishPaper")
//确定交卷
var ks2=  document.querySelector("#testpaper-finish-btn")
//查找哪场考试
var ks3=  document.getElementsByClassName("testpaper-question-body-item testpaper-question-choice-item")[0]
//选择答案
var ks4=  document.querySelectorAll("label.radio-inline")
//点击开始考试
var ks5=  document.querySelector("a.btn.btn-primary")
//创新驱动发展考试
var ks6 = 'https://jxjyjd.hnu.edu.cn/course/1758/task/49957/activity_show'
var ks66 = 'https://jxjyjd.hnu.edu.cn/course/1758/task/49957/show'
//《安全生产（一）》 考试
var ks7 = 'https://jxjyjd.hnu.edu.cn/course/1756/task/49937/activity_show'
var ks77 = 'https://jxjyjd.hnu.edu.cn/course/1756/task/49937/show'
//进入《安全生产（二）》 考试
var ks8 = 'https://jxjyjd.hnu.edu.cn/course/1757/task/49949/activity_show'
var ks88 = 'https://jxjyjd.hnu.edu.cn/course/1757/task/49949/show'
function ks0(){
 try {if(ks1.innerText == '再考一次'){window.location.replace(kc)}} catch(err) {}
if(hre.includes(ks66)){window.location.replace(ks6)};if(hre.includes(ks77)){window.location.replace(ks7)};if(hre.includes(ks88)){window.location.replace(ks8)}
if(hre.includes(ks6)){ks5.click();};if(hre.includes(ks7)){ks5.click();};if(hre.includes(ks8)){ks5.click();};
if (hre.includes(ks)){
    if(ks3.innerText== 'A.\n\n工艺创新'){ks4[3].click();ks4[5].click();ks4[8].click();ks4[12].click();ks4[17].click();ks4[20].click();ks4[22].click();
                                        ks4[24].click();ks4[26].click();ks4[28].click();ks1.click();ks2.click();window.location.replace(kc)}
    if(ks3.innerText == 'A.\n\n15'){ks4[1].click();ks4[7].click();ks4[11].click();ks4[12].click();ks4[19].click();ks4[21].click();ks4[22].click();
                                    ks4[24].click();ks4[26].click();ks4[28].click();ks1.click();ks2.click();window.location.replace(kc)}
    if(ks3.innerText == 'A.\n\n50%'){ks4[2].click();ks4[6].click();ks4[11].click();ks4[13].click();ks4[17].click();ks4[20].click();ks4[23].click();
                                      ks4[25].click();ks4[26].click();ks4[28].click();ks1.click();ks2.click();window.location.replace(kc)}
}
}
setInterval(ks0,4000)




})();