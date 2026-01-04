// ==UserScript==
// @name         井冈山大学心理测试自动答题
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于井冈山大学心理测试自动答题，需自行修改账号密码
// @author       You
// @match        https://xlcp.jgsu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jgsu.edu.cn
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476554/%E4%BA%95%E5%86%88%E5%B1%B1%E5%A4%A7%E5%AD%A6%E5%BF%83%E7%90%86%E6%B5%8B%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/476554/%E4%BA%95%E5%86%88%E5%B1%B1%E5%A4%A7%E5%AD%A6%E5%BF%83%E7%90%86%E6%B5%8B%E8%AF%95%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==
// 账号密码为学号和身份证后六位，记得修改！！！
// 账号密码为学号和身份证后六位，记得修改！！！
// 账号密码为学号和身份证后六位，记得修改！！！
var user_account='1234567890';
var user_password='******';

// 网页地址
var url='https://xlcp.jgsu.edu.cn';
var urlOfLogin='/ZhgProgram/frmLogin.aspx';
var urlOfMain='/Main/MainFrame.htm';
var urlOfTest='/Examination/ExamTable.aspx';
var urlOfExample='/Examination/ExamTable.aspx';
var urlOfAgreement='/Examination/ExamAgreeMent.aspx';
var urlOfNormal='/Examination/ExamNormal.aspx';
var urlOfGuide='/Examination/ExamGuide.aspx';
var urlOfMessage='/Other/Message.aspx';
var urlOfReport='/Report/ReportSingle.aspx';

// 获取当前时间，并截取周的单位和小时的单位
var curr_time=new Date();
var curr_Day=curr_time.getDay();
var curr_Hours=curr_time.getHours();
console.log('当前时间为 '+curr_time);
console.log('当前为第 '+curr_Day+' 周');
console.log('当前时间为 '+curr_time+' 时');

// 各个控件的 selector
var inputOfAccount='#txtUserNumber';
var inputOfPassword='#txtPSW';
var buttonOfLogin='#ibnOK';
var buttonOfExit='#lbExit';
var buttonOfTest='#tbTable > tbody > tr > td > input';
var buttonOfStart='#btnStart';
var buttonOfFinish='#btnNext';

// 部分控件的 xpath
var pathOfAnswer='//*[@id="1"]';
var pathOfInfo='//*[@id="lblNum"]';
var pathOfProcess='//*[@id="lblProcess"]';

// 登录函数
function login()
{
    console.log("正在进行登录操作");
    // 自动填写账号密码到输入框
    document.querySelector(inputOfAccount).value=user_account;
    document.querySelector(inputOfPassword).value=user_password;
    // 自动点击登录按钮
    window.setTimeout(function(){document.querySelector(buttonOfLogin).click()},200);
}

// 返回 xpath 定位元素
function getElementByXpath(xpath){
	var element = document.evaluate(xpath,document).iterateNext();
	return element;
}

(function()
{
    'use strict';
    // Your code here..
    var ret=window.setTimeout(function()
    {
        var pathname=window.parent.location.pathname;
        console.log(pathname);
        if(pathname==urlOfMain)
        {
            console.log("已登录");
            window.location.href =url+urlOfTest;
            console.log('跳转至量表测试');
        }
        else if(pathname==urlOfExample)
        {
            console.log("进入量表测试,并点击按钮");
            if(document.querySelector(buttonOfTest)==undefined)
            {
                console.log("无量表测试，跳转至查看页面");
                window.setTimeout(function(){ window.location.href =url+urlOfReport; },200);
            }
            else
                window.setTimeout(function(){ document.querySelector(buttonOfTest).click() },200);
        }
        else if(pathname==urlOfAgreement)
        {
            console.log("点击同意测试按钮");
            window.setTimeout(function(){ document.querySelector(buttonOfStart).click() },200);
        }
        else if(pathname==urlOfGuide)
        {
            console.log("点击开始测试按钮");
            window.setTimeout(function(){ document.querySelector(buttonOfStart).click() },200);
        }
        else if(pathname==urlOfNormal)
        {
            console.log("正在心理测试答题");
            var btn=getElementByXpath(pathOfAnswer);
            btn.checked=true;
            setTimeout('__doPostBack(\'1\',\'\')', 0);
            console.log(getElementByXpath(pathOfInfo).innerText);
            if(getElementByXpath(pathOfProcess).innerText=='100%')
            {
                console.log("答题进度已达 100%，点击完成按钮");
                document.querySelector(buttonOfFinish).click();
            }

        }
        else if(pathname==urlOfMessage)
        {
            console.log("已完成量表测试，返回主页");
            window.location.href =url+urlOfMain;
        }
        else if(pathname==urlOfReport)
        {
            console.log("恭喜你完成心理测试，请截图保存");
        }
        else if(pathname==urlOfLogin)
        {
            login();
            console.log("登录成功");
        }
    },300)
})();