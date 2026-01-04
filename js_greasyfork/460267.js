// ==UserScript==
// @name         +时长
// @namespace    http://tampermonkey.net/
// @version      0.1.9
// @description  add time to chosen one.
// @author       zhaiwei
// @match        http://ah.chinavolunteer.mca.gov.cn/volunteer/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mca.gov.cn
// @require      https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @grant        none
// @license      GPL license
// @downloadURL https://update.greasyfork.org/scripts/460267/%2B%E6%97%B6%E9%95%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/460267/%2B%E6%97%B6%E9%95%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 生成“+时长”按钮
    var btn = document.createElement('button');
    // 按钮文字
    btn.innerText = '+时长';
    // 添加按钮的样式类名class值为addBtn
    btn.setAttribute('class', 'addBtn');
    // 生成style标签
    var style = document.createElement('style');
    // 把样式写进去
    style.innerText = `.addBtn{position:fixed;top:80%;right:10%;width:75px;height:55px;padding:3px 5px;border:3px solid #0d6efd;cursor:pointer;color:#0d6efd;font-size:20px;background-color:transparent;border-radius:5px;transition:color .15s ease-in-out,background-color .15s ease-in-out;z-index:9999999999999;}.addBtn:hover{background-color:#0d6efd;color:#fff;}`;
    // 在head中添加style标签
    document.head.appendChild(style);
    // 在body中添加button按钮
    document.body.appendChild(btn);
    // 点击按钮去执行函数addTime()
    document.querySelector('.addBtn').addEventListener('click', function () {
        addTime();
    });
    
    let monthV = '三月';
    let dayV = "1";
    let timeH0 = 14;
    let timeH1 = 17;
    let timeM0 = Math.floor(Math.random() * 60) + 24;
    let timeM1 = Math.floor(Math.random() * 60) + 24;
    let timeS0 = Math.floor(Math.random() * 60) + 84;
    let timeS1 = Math.floor(Math.random() * 60) + 84;
  
    function addTime(){
//全选
        setTimeout('document.getElementsByClassName("ant-checkbox-input")[0].click();',10);
//"批量选择"按钮
        
        setTimeout(function() {$('button[class="ant-btn ant-btn-primary"]')[2].click();},210);
//开始时间输入框
        setTimeout('document.getElementsByClassName("anticon anticon-calendar ant-calendar-picker-icon")[0].click();',410);
//开始日期， 
        //setTimeout('document.getElementsByClassName("ant-calendar-cell")[1].click();',650);
//选择月份
        setTimeout(function() {$('.ant-calendar-header .ant-calendar-ym-select .ant-calendar-month-select')[0].click();},650);
//月
        setTimeout(function() {
            //$('.ant-calendar-month-panel-body td[title="三月"]').click();
            $('.ant-calendar-month-panel-cell').filter(function() {
                // 使用:contains选择器找到文本中包含“三月”的元素
                return $(this).text().trim() === monthV;
            })[0].click();
        },950);
//日
        setTimeout(function() {
            //$('.ant-calendar-tbody td[title="2024年3月1日"]')[0].click();
            $('.ant-calendar-date').filter(function() {
                // 使用:contains选择器找到文本中包含“三月”的元素
                return $(this).text().trim() === dayV;
            })[0].click();
        },1250);
//"选择时间"
        setTimeout(function() {$('.ant-calendar-time-picker-btn')[0].click();},1500);
//“8点” [0-23]
        setTimeout(function() {$('.ant-calendar-time-picker-combobox .ant-calendar-time-picker-select li')[timeH0].click();},1800);
        //setTimeout('document.querySelector("div > div > div > div > div.ant-calendar-date-panel > div.ant-calendar-footer.ant-calendar-footer-show-ok > span > a.ant-calendar-ok-btn").click()

        
//30分 [24-83]//
        setTimeout(function() {$('.ant-calendar-time-picker-combobox .ant-calendar-time-picker-select li')[timeM0].click();},2000);
//13秒 [84-143]//
        setTimeout(function() {$('.ant-calendar-time-picker-combobox .ant-calendar-time-picker-select li')[timeS0].click();},2200);
//确定////setTimeout('document.getElementsByClassName("ant-calendar-ok-btn")[0].click();',2100);
        setTimeout(function() {$('.ant-calendar-ok-btn')[0].click();},2500);

        setTimeout('document.getElementsByClassName("anticon anticon-calendar ant-calendar-picker-icon")[1].click();',2750);
//结束日期，
        //setTimeout('document.getElementsByClassName("ant-calendar-cell")[1].click();',1600);
//选择月份
        setTimeout(function() {$('.ant-calendar-header .ant-calendar-ym-select .ant-calendar-month-select')[0].click();},2950);
//月
        setTimeout(function() {
            //$('.ant-calendar-month-panel-body td[title="三月"]').click();
            $('.ant-calendar-month-panel-cell').filter(function() {
                // 使用:contains选择器找到文本中包含“三月”的元素
                return $(this).text().trim() === monthV;
            })[0].click();
        },3150);
//日
        setTimeout(function() {
            //$('.ant-calendar-tbody td[title="2024年3月1日"]')[0].click();
            $('.ant-calendar-date').filter(function() {
                // 使用:contains选择器找到文本中包含“三月”的元素
                return $(this).text().trim() === dayV;
            })[0].click();
        },3450);

//点击“选择时间”//setTimeout(function() {$('.ant-calendar-time-picker-btn')[0].click();
        setTimeout('document.getElementsByClassName("ant-calendar-time-picker-btn")[0].click();',3650);
//10点 [0-23]
        setTimeout(function() {$('.ant-calendar-time-picker-combobox .ant-calendar-time-picker-select li')[timeH1].click();},3950);
//30分 [24-83]//
        setTimeout(function() {$('.ant-calendar-time-picker-combobox .ant-calendar-time-picker-select li')[timeM1].click();},4250);
//01秒 [84-143]//
        setTimeout(function() {$('.ant-calendar-time-picker-combobox .ant-calendar-time-picker-select li')[timeS1].click();},4550);
//确定//setTimeout(function() {$('.ant-calendar-ok-btn')[0].click();},4850);
        //"确定"按钮
        setTimeout('document.getElementsByClassName("ant-calendar-ok-btn")[0].click();',4850);
//点击“添加时长”
        setTimeout('$("span:contains(添加时长)")[0].click();',5000);
        setTimeout('document.getElementsByClassName("anticon anticon-right")[4].click();',5300);
    };

    //--- When ready to stop the timer, run this code:

    clearInterval (timerVar);
    timerVar = "";
    // Your code here...
})();