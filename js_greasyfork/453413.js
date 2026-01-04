// ==UserScript==
// @name         【蛮吉】店铺宝_辅助创建工具
// @namespace    http://tampermonkey.net/
// @license      manji
// @version      0.1.1
// @description  店铺宝辅助脚本
// @author       You
// @match        https://shell.mkt.taobao.com/shopAct/*
// @run-at       document-end  // 当网页加载完成后执行
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/453413/%E3%80%90%E8%9B%AE%E5%90%89%E3%80%91%E5%BA%97%E9%93%BA%E5%AE%9D_%E8%BE%85%E5%8A%A9%E5%88%9B%E5%BB%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/453413/%E3%80%90%E8%9B%AE%E5%90%89%E3%80%91%E5%BA%97%E9%93%BA%E5%AE%9D_%E8%BE%85%E5%8A%A9%E5%88%9B%E5%BB%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert('准备开始插入代码')
    // 定义时间参数 2022-01-09 20:00:00   确认时间是否大于当前时间
    var timeType = 'start'; // 这个参数可以不要，点击的时候会自动识别
    // var startFullTime = '2022-07-08 00:00:00';
    // var endFullTime   = '2022-07-10 23:59:59';
    // var startFullTime = '2022-07-04 00:00：00';
    // var endFullTime   = '2022-07-07 23:59:59';
    var startFullTime = '2022-11-28 00:00:00';
    var endFullTime   = '2022-12-10 19:59:59';

    // 时间输入函数
    function theFullTimeIput(timeType,fullTime){

        var fullTimeInputElement ='';
        if (timeType == 'start'){
            fullTimeInputElement = "#startTime > div > span > input";
            console.log('当前识别 开始时间输入框');
        } else if (timeType == 'end'){
            fullTimeInputElement = "#endTime > div > span > input";
            console.log('当前识别 结束时间输入框');
        }else{
            alert("未识别到时间输入参数，请检查");
        };

        // 将时间按空格切片 例如  '2021-12-14    01:39:59'， 切片成2021-12-14  和 01:39:59
        var sectionDateTime =fullTime.split(/[\s\n]/);
        //   取出日期 2021-12-14
        var theDate = sectionDateTime[0];
        // 取出时间 01:39:59
        var sectionTime = sectionDateTime.pop();
        //  按照 中文或者英文逗号切片时间
        sectionTime = sectionTime.split(/[:：]/);
        var timeHour = Number(sectionTime[0]);
        var timeMinute = Number(sectionTime[1]);
        var timeSecond = Number(sectionTime[2]);
        console.log(fullTime,'当前时间切片为','转换时间为timeHour',timeHour,'timeMinute',timeMinute,'timeSecond',timeSecond);

        // 点击日期输入框，弹出日期选择
        var fullTimeInputText=document.querySelector(fullTimeInputElement);
        setTimeout(fullTimeInputText.click(),1000);

        // 点击选择日期 theDateElement
        var theDateElement = document.querySelector("table > tbody [title='" + theDate + "']");
        if (theDateElement){
            theDateElement.click();
        }else{
            document.querySelector("button.next-calendar-btn.next-calendar-btn-next-month > i").click()
            document.querySelector("table > tbody [title='" + theDate + "']").click();
        };
        

        // 点击获取时间选框
        var theTimeInput = document.querySelector("div.next-date-picker-panel-footer > button.next-btn.next-small.next-btn-primary.next-btn-text")
        theTimeInput.click();

        // 点击选择小时
        var timeHourElement = document.querySelector("div.next-time-picker-panel > div:nth-child(1) > ul>[title='" + timeHour + "']");
        console.log(timeHourElement);
        timeHourElement.click();

        //  点击选择分钟
        var timetimeMinuteElement = document.querySelector("div.next-time-picker-panel > div:nth-child(2) > ul>[title='" + timeMinute + "']");
        timetimeMinuteElement.click();

        // 点击选择秒
        var timetimeSecondElement = document.querySelector("div.next-time-picker-panel > div:nth-child(3) > ul>[title='" + timeSecond + "']");
        timetimeSecondElement.click();

        //  点击确定按钮 生效时间
        document.querySelector("div.next-date-picker-panel-footer > button:nth-child(2)").click();

    };



    // 创建页面悬浮元素
    let div=document.createElement("div");
    div.innerHTML=(" <div style='left: 1px;bottom: 10px;background: #1a59b7;color:#ffffff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 40px;height: 50px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'><button id = 'time1'>开始</button><button id = 'time2'>结束</button></div>");
    document.body.append(div);

    // 绑定元素点击事件
    div.onclick=function(event){
        if(event.target.id=="time1"){
            //alert("修改时间被点击了");
            // 修改开始时间
            setTimeout(theFullTimeIput('start',startFullTime),3000);
            console.log('开始时间运行完成');
            //修改结束时间
            //setTimeout(theFullTimeIput('end',endFullTime),3000);



        }else if(event.target.className=="sp"){
            alert("sp这一类被点了");
        }else if(event.target.id=="time2"){
            //
            //修改结束时间
            setTimeout(theFullTimeIput('end',endFullTime),3000);
            console.log('结束时间运行完成');
        };
    };


// =======================================================================================

    // 插入元素脚本
    function writeEle(){
        var hrefItemElements = document.querySelectorAll("td.next-table-cell.last > div");
        for (var hrefItemN =0;hrefItemN < hrefItemElements.length;hrefItemN++)
        { 
            var hrefItemss = hrefItemElements[hrefItemN];
            var hrefItems = hrefItemss.querySelectorAll("a");
            for (var i=0;i<hrefItems.length;i++)
            {
                hrefItems[i].setAttribute("target","_blank"); 
                hrefItems[i].setAttribute("onclick","this.style.color='red'"); 
                console.log(hrefItems[i].href);
            };
        };       
    };


// 将超链接修改为在新窗口打开
    if(window.location.href.indexOf("shopAct")!=-1){
        console.log('准备开始插入元素......');
        var num = 0;
        function loopIput(){

            num++;
            console.log(num);
            try{
                //  这里是插入代码
                writeEle()
                //  这里是插入代码完成。         
                console.log('插入元素完成');
                clearInterval(t);
            }catch(err){
                console.log(err.message);
            };
            console.log('这是第：',num,'次运行函数插入');
            if(num>30){
                clearInterval(t);
            };
        };
        var t = setInterval(loopIput,1000); // 每隔1秒检查一次 运行一次函数，直到运行成功,若果运行30次还没成功，则终止
    };


    //  页面改变就运行插入-----------------------------------------------------
    // js监听页面元素是否变化
    // 选择需要观察变动的节点
    const targetNode = document.querySelector("div.next-tabs-content");
    // 观察器的配置（需要观察什么变动）
    const config = { attributes: true, childList: true, subtree: true };
    // 当观察到变动时执行的回调函数
    const callback = function(mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                console.log('元素变化了');
                writeEle();
            }
            // else if (mutation.type === 'attributes') {
            //     console.log('The ' + mutation.attributeName + ' 属性变化了attribute was modified.');
            // }
        }
    };
    // 创建一个观察器实例并传入回调函数
    const observer = new MutationObserver(callback);
    // 以上述配置开始观察目标节点
    observer.observe(targetNode, config);
    // 之后，可停止观察
    // observer.disconnect();
    //  页面改变就运行插入-----------------------------------------------------


    // Your code here...
})();
/*
// @grant        none
// @grant        unsafeWindow
// @grant        window.onurlchange
document.querySelectorAll
*/