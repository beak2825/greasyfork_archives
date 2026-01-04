// ==UserScript==
// @name         U校园刷时长
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  支持自动跳过非必修章节
// @author       DaXue
// @
// @match        https://ucontent.unipus.cn/_pc_default/pc.html?cid=*
// @grant        none
// @license      GPL-3.0
// @compatible   chrome
// @downloadURL https://update.greasyfork.org/scripts/443975/U%E6%A0%A1%E5%9B%AD%E5%88%B7%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/443975/U%E6%A0%A1%E5%9B%AD%E5%88%B7%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

var minTime=[3,30];//最短停留时间，默认是3分30秒
var maxTime=[5,30];//最大停留时间，默认为5分30秒
var maxTestTime=[8,30];//单元测试最短停留时间，默认是8分30秒
var minTestTime=[10,30];//单元测试最大停留时间，默认为10分30秒
var autojump=1;//是否开启自动跳过非必修章节功能，0为关闭，1为开启
var jumpTimeOut=1//是否开启自动跳过已过截止时间的必修章节
var unitTestStay=1;//是否单独设置单元测试的时间

var feibixiu = document.getElementsByClassName("taskTipStyle--disrequired-1ZUIG");
var bixiu = document.getElementsByClassName("taskTipStyle--required-23n0J");
function switch_next(selector, classFlag) {
    let flag = false;
    for (let [index, unit] of document.querySelectorAll(selector).entries()) {
        if (flag) {
            unit.click();
            //防止必修弹窗失效，跳转便刷新页面，1000表示跳转1秒后刷新页面
            setTimeout(() => {
                location.reload();
            }, 1000);
            flag = false;
            break;
        }
        if (unit.classList.contains(classFlag)) {
            flag = true;
        }
    }
}
function jumpToNextSection(){
    switch_next('.layoutHeaderStyle--circleTabsBox-jQdMo a', 'selected');
    switch_next('#header .TabsBox li', 'active');
    switch_next('#sidemenu li.group', 'active');
}
if(autojump==1){
    setTimeout(() => {
        if(feibixiu[0].innerText == "非必修"){
            debugger;
            jumpToNextSection();

        } else if(bixiu[0].innerText == "必修"){
            return 0;
        }
    },3000);
}
 setTimeout(() => {
  try{
    var isTestTimeOut=document.getElementsByClassName("taskTipStyle--warningheadertext-1ch9A");
    if(isTestTimeOut[0].innerText=="学习截止时间已过，你可以继续学习，但本次提交得分不计入学习成绩"&&jumpTimeOut==1){
        jumpToNextSection();
    }
} catch(a){
return 0;
}
    },3000);

//计算实际停留时间，防止每个页面停留时间相同
function realTime(minMinutes,minSeconds,maxMinutes,maxSeconds) {
    let rate = Math.random();
    return (minMinutes * 60 +minSeconds+((maxMinutes-minMinutes)*60+maxSeconds-minSeconds)* rate) * 1000;
}
//自动点击必修弹窗和麦克风弹窗 3000表示延迟3秒，因为弹窗有延迟，主要看反应速度。
setTimeout(() => {
    var x = document.getElementsByClassName("dialog-header-pc--close-yD7oN"); x[0].click();
    document.querySelector("div.dialog-header-pc--dialog-header-2qsXD").parentElement.querySelector('button').click();
},3000);
setTimeout(() => {
    try{
        var unitTest = document.getElementsByClassName("utButtonStyle--toDoButton-1S89L");
           if(unitTestStay==1&&unitTest[0].innerText=='开始做题'){
        setTimeout(() => {
            jumpToNextSection();
        }, realTime(minTestTime[0],minTestTime[1],maxTestTime[0],maxTestTime[1]));
    }
    }catch(e){
             setTimeout(() => {
            jumpToNextSection();
        }, realTime(minTime[0],minTime[1],maxTime[0],maxTime[1]));
    }
    setTimeout(() => {
            jumpToNextSection();
        }, realTime(minTime[0],minTime[1],maxTime[0],maxTime[1]));
    }
,4000);
