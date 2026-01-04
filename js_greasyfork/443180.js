// ==UserScript==
// @name         【蛮吉】DY-营销-达人专属营销
// @namespace    manji
// @license      manji
// @match        https://fxg.jinritemai.com/ffa/marketing/tools/daren/operate?action=new
// @version      0.1.1
// @description  抖音辅助工具
// @author       You
// @grant        GM_xmlhttpRequest
// @run-at       document-end  // 当网页加载完成后执行
// @downloadURL https://update.greasyfork.org/scripts/443180/%E3%80%90%E8%9B%AE%E5%90%89%E3%80%91DY-%E8%90%A5%E9%94%80-%E8%BE%BE%E4%BA%BA%E4%B8%93%E5%B1%9E%E8%90%A5%E9%94%80.user.js
// @updateURL https://update.greasyfork.org/scripts/443180/%E3%80%90%E8%9B%AE%E5%90%89%E3%80%91DY-%E8%90%A5%E9%94%80-%E8%BE%BE%E4%BA%BA%E4%B8%93%E5%B1%9E%E8%90%A5%E9%94%80.meta.js
// ==/UserScript==

(function() {

    var startFullTime = '2022-04-11 09:01:02';
    var endFullTime   = '2022-05-02 23:59:59';

    function theFullTimeIput(startFullTime,endFullTime){

        // ------------------填写开始时间---------------------------------------------
        // 将时间按空格切片 例如  '2021-12-14    01:39:59'， 切片成2021-12-14  和 01:39:59
        var sectionDateTime = startFullTime.split(/[\s\n]/);

        //   取出日期 2021-12-14
        var theDate = sectionDateTime[0];

        // 取出时间 01:39:59
        var sectionTime = sectionDateTime.pop();

        //  按照 中文或者英文逗号切片时间
        sectionTime = sectionTime.split(/[:：]/);
        var timeHour = Number(sectionTime[0]);
        var timeMinute = Number(sectionTime[1]);
        var timeSecond = Number(sectionTime[2]);
        console.log(startFullTime,'当前时间切片为','转换时间为timeHour',timeHour,'timeMinute',timeMinute,'timeSecond',timeSecond);     

        // 点击时间选框
        document.querySelector('span.auxo-picker-suffix').click();   

        // 点击选择日期 theDateElement
        var theDateElement = document.querySelector('[title="' + theDate +'"]');
        if (theDateElement){
            theDateElement.click();
        }else{
            document.querySelector('[class="auxo-picker-next-icon"]').click();
            document.querySelector('[title="' + theDate +'"]').click();
        };

        // 点击选择小时
        var hourStr = 'ul.auxo-picker-time-panel-column:nth-child(1) [class="auxo-picker-time-panel-cell-inner"]'
        var timeHourElement = document.querySelectorAll(hourStr);
        console.log(timeHourElement[timeHour]);
        timeHourElement[timeHour].click();

        //  点击选择分钟
        var timeMinuteStr = 'ul.auxo-picker-time-panel-column:nth-child(2) [class="auxo-picker-time-panel-cell-inner"]'
        var timetimeMinuteElement = document.querySelectorAll(timeMinuteStr);
        timetimeMinuteElement[timeMinute].click();

        // 点击选择秒
        var timetimeSecondElement = document.querySelectorAll('ul.auxo-picker-time-panel-column:nth-child(3) [class="auxo-picker-time-panel-cell-inner"]');
        timetimeSecondElement[timeSecond].click();       
        // 点击确定时间按钮
        document.querySelector('[class="auxo-btn auxo-btn-primary auxo-btn-sm"]').click();


        // ------------------填写结束时间---------------------------------------------
        // 将时间按空格切片 例如  '2021-12-14    01:39:59'， 切片成2021-12-14  和 01:39:59
        var sectionDateTime_end = endFullTime.split(/[\s\n]/);

        //   取出日期 2021-12-14
        var theDate_end = sectionDateTime_end[0];

        // 取出时间 01:39:59
        var sectionTime_end = sectionDateTime_end.pop();

        //  按照 中文或者英文逗号切片时间
        sectionTime_end = sectionTime_end.split(/[:：]/);
        var timeHour_end = Number(sectionTime_end[0]);
        var timeMinute_end = Number(sectionTime_end[1]);
        var timeSecond_end = Number(sectionTime_end[2]);
        console.log(endFullTime,'当前时间切片为','转换时间为timeHour',timeHour_end,'timeMinute',timeMinute_end,'timeSecond',timeSecond_end);     

        // 点击选择日期 theDateElement
        var theDateElement_end = document.querySelector('[title="' + theDate_end +'"]');
        if (theDateElement_end){
            theDateElement_end.click();
        }else{
            document.querySelector('[class="auxo-picker-next-icon"]').click();
            document.querySelector('[title="' + theDate_end +'"]').click();
        };
        // 点击选择小时
        var hourStr = 'ul.auxo-picker-time-panel-column:nth-child(1) [class="auxo-picker-time-panel-cell-inner"]'
        var timeHourElement = document.querySelectorAll(hourStr);
        console.log(timeHourElement[timeHour_end]);
        timeHourElement[timeHour_end].click();

        //  点击选择分钟
        var timeMinuteStr = 'ul.auxo-picker-time-panel-column:nth-child(2) [class="auxo-picker-time-panel-cell-inner"]'
        var timetimeMinuteElement = document.querySelectorAll(timeMinuteStr);
        timetimeMinuteElement[timeMinute_end].click();

        // 点击选择秒
        var timetimeSecondElement = document.querySelectorAll('ul.auxo-picker-time-panel-column:nth-child(3) [class="auxo-picker-time-panel-cell-inner"]');
        timetimeSecondElement[timeSecond_end].click();       

        // 点击确定时间按钮
        document.querySelector('[class="auxo-btn auxo-btn-primary auxo-btn-sm"]').click();

        // ---------------------活动限购(限购)---------------------------------------------------------------
        document.querySelector("#limit > label:nth-child(2) > span.auxo-radio > input").click();

        // ---------------------达人专属标签(开启)---------------------------------------------------------------
        document.querySelector("#exclusiveTitleStatus > label:nth-child(2) > span.auxo-radio > input").click();

        // ---------------------标签名称---------------------------------------------------------------
        //document.querySelector("#kol_exclusive_label").value = '直播'

    };




    // 创建页面悬浮元素
    let div=document.createElement("div");
    div.innerHTML=(" <div style='left: 1px;bottom: 10px;background: #1a59b7;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 50px;height: 40px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'><button id = 'time1'>开始</button></div>");
    document.body.append(div);

    // 绑定元素点击事件
    div.onclick=function(event){
        if(event.target.id=="time1"){
            //alert("修改时间被点击了");
            // 修改开始时间
            setTimeout(theFullTimeIput(startFullTime,endFullTime),3000);
            console.log('开始时间运行完成');
            //修改结束时间
            //setTimeout(theFullTimeIput('end',endFullTime),3000);

        }else if(event.target.className=="sp"){
            alert("sp这一类被点了");
        }else if(event.target.id=="time2"){
            //
            //修改结束时间
            console.log('结束时间运行完成');
        };
    };
    // Your code here...
})();