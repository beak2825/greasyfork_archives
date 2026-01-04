// ==UserScript==
// @name         湖南科技大学校园网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  可用于湖南科技大学校园网快速登录
// @author       You
// @match        http://login.hnust.cn/a79.htm
// @match        http://login.hnust.cn/
// @match        http://login.hnust.edu.cn/a79.htm
// @match        http://login.hnust.edu.cn/

// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/522776/%E6%B9%96%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/522776/%E6%B9%96%E5%8D%97%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
//感谢@井冈山大学【校园网登录---适用于网页认证(含油猴脚本修改教程)-哔哩哔哩】 https://b23.tv/gBOKvPo
//有问题联系qq184546253
//更新后记得把学号和密码改成你们自己的！！！

//用户修改区，改3个值即可
// user_account、user_password 分别是账号和密码，修改下面俩个引号内的数据即可，账号是你的学号，记得根据自己的运营商修改yys的值，默认0为'校园网'
var user_account='1111111111';
var user_password='********';
// 运营商，0->校园网、1->中国电信、2->中国联通、3->中国移动
var yys=0;


// 获取当前时间，并截取周的单位和小时的单位
var curr_time=new Date();
var curr_Day=curr_time.getDay();
var curr_Hours=curr_time.getHours();
console.log('当前时间为 '+curr_time);
console.log('当前为第 '+curr_Day+' 周');
console.log('当前时间为 '+curr_time+' 时');

// 各个控件的 selector
//登录框
var boxOfLogin='#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form';
//账号框
var inputOfAccount='#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(3)';
//密码框
var inputOfPassword='#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(4)';
//运营商按钮
var buttonOfLSP='#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > div.edit_lobo_cell.edit_radio > span:nth-child(运营商) > input'.replace('运营商',yys+2);
//登录按钮
var buttonOfLogin='#edit_body > div.edit_row.ui-resizable-autohide > div.edit_loginBox.normal_box.random.loginuse.loginuse_pc.ui-resizable-autohide > form > input:nth-child(1)';
//返回按钮
var buttonOfBack='#edit_body > div > div.edit_loginBox.ui-resizable-autohide > form > input';
// 注销按钮
var buttonOfLogout='#edit_body > div > div.edit_loginBox.ui-resizable-autohide > form > input';

// 登录函数
function login()
{
    console.log("正在进行登录操作");
    // 自动填写账号密码到输入框
    document.querySelector(inputOfAccount).value=user_account;
    document.querySelector(inputOfPassword).value=user_password;
    // 自动选择运营商
    document.querySelector(buttonOfLSP).checked=true;
    // 自动点击登录按钮
    window.setTimeout(function(){document.querySelector(buttonOfLogin).click()},200);
}

//输出完整时间
(function()
{
    'use strict';
    // Your code here..
    window.setTimeout(function()
    {
        //判断输入框是否存在
        if( document.querySelectorAll(boxOfLogin).length == 1 )
        {
            /* 注释掉时间判定，调休无法应用
            //判断是否在登录的时间段，周一至周五早上0-6点不能登录
            if(!(curr_Day>0&&curr_Day<6&&curr_Hours>5||curr_Day==6||curr_Day==0))
            {
                //不在登录时间范围
                console.log("不在登录时间内");alert("不在登录时间内！")
                return;
            }
            */
                console.log("登录框存在");
                login();
                window.setTimeout(function()
                {
                    //有返回按钮存在
                    if(document.querySelector(buttonOfBack).value=="返  回")
                    {
                        document.querySelector(buttonOfBack).click()
                        console.log("存在返回按钮，立即返回，并执行登录操作")
                        login();
                    };
                    console.log("登录成功")
                    let res=confirm("登录成功")
                    console.log(res)
                    //AC认证失败（之后再加上）
                }, 1000);
        }
        else
        {
            //输入框不存在
            window.setTimeout(function()
            {
                console.log("登录框不存在");
                //判断注销按钮是否存在
                if(document.querySelector(buttonOfLogout).value=="注  销")
                {
                    console.log("注销按钮存在")
                    window.setTimeout(function(){alert("似乎已经登录过了，不需要再进行登录哦")})
                }else
                {
                    var choose=confirm("登录框似乎不存在，是否刷新页面重试？");
                    window.setTimeout(function()
                    {
                        if (choose)
                        {
                            console.log("刷新页面")
                            window.setTimeout(function()
                            {
                                location.reload();
                            },1000)
                        }
                        else
                        {
                            console.log("用户取消了刷新")
                        };
                    },3000);
                    console.log(choose);
                };
            },1000)
        };
    },300)
})();