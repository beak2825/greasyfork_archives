// ==UserScript==
// @name         南信大金牛湖校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  可用于牛牛湖校园网快速登录
// @author       ywm
// @match        http://192.168.77.18/a79.htm?wlanuserip=10.*.*.*&wlanacname=
// @match        http://10.32.2.6/srun_portal_pc?ac_id=1&theme=pro
// @match        http://10.32.2.6/srun_portal_success?ac_id=1&theme=pro
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477506/%E5%8D%97%E4%BF%A1%E5%A4%A7%E9%87%91%E7%89%9B%E6%B9%96%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/477506/%E5%8D%97%E4%BF%A1%E5%A4%A7%E9%87%91%E7%89%9B%E6%B9%96%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
//更新后记得把学号和密码改成你们自己的！！！
// 如果有bug请及时反馈

// user_account、user_password 分别是账号和密码，账号是你的学号
var user_account='***********';
var user_password='******';
// 运营商，0 校园网、1 中国电信、2 中国移动、3 中国联通
var lsp=2;

// 获取当前时间，并截取周的单位和小时的单位
var curr_time=new Date();
var curr_Day=curr_time.getDay();
var curr_Hours=curr_time.getHours();
console.log('当前时间为 '+curr_time);
console.log('当前为第 '+curr_Day+' 周');
console.log('当前时间为 '+curr_time+' 时');

// 各个控件的 selector
// var inputOfAccount='#username';
// var inputOfPassword='#password';

//自定义
//账号密码输入框selector
var inputOfAccount='#username';
var inputOfPassword='#password';

//找到选择下拉选项框  选择校园网类型
var select = document.getElementById("domain");
//var index = select.selectedIndex;
//0移动，1联通，2电信，3校园网
var yys=0
//定义登录按钮控件变量
var button0login='#login-account'

// 登录函数
function login()
{
    console.log("正在进行登录操作");
    // 自动填写账号密码到输入框
    document.querySelector(inputOfAccount).value=user_account;
    document.querySelector(inputOfPassword).value=user_password;
    //选择运营商
    select.selectedIndex = yys;
    // 自动点击登录按钮
    window.setTimeout(function(){document.querySelector(button0login).click()},200);
}

//输出完整时间
(function()
{
    'use strict';
    // Your code here..
    window.setTimeout(function()
    {
        login();
        //判断输入框是否存在
    },300)
})();