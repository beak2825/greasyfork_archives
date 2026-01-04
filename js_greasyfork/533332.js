// ==UserScript==
// @name         苏州科技大学校园宽带网自动登录
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可用于苏州科技大学校园宽带网快速登录，非特殊区域的无线网，而是宿舍的有线宽带，该脚本启用后且网线正常的情况下会在登录弹窗出现时自动登录，但是弹出框需要手动关闭。
// @icon         http://10.160.63.9:801/eportal/extern/123/ip/1/8bf05145a5be5aff993538a202421b07.jpg
// @author       You
// @match        http://10.160.63.9/*
// @grant        none
// @license MIT --
// @downloadURL https://update.greasyfork.org/scripts/533332/%E8%8B%8F%E5%B7%9E%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E5%AE%BD%E5%B8%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/533332/%E8%8B%8F%E5%B7%9E%E7%A7%91%E6%8A%80%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E5%AE%BD%E5%B8%A6%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
//特别感谢，B站（Bilibili）的up主@沙小鹅（id:500305629）的视频https://b23.tv/gBOKvPo提供的技术支持 ，本脚本基于视频及其脚本的基础上改写建立，特别感谢！
//本脚本仅用于交流学习使用，无商业用途，如有任何版权问题，请反馈及时下架。


//把运营，学号和密码改成你们自己的！
// user_account、user_password 分别是账号和密码
var user_account='你的账号';
var user_password='你的密码';
// 运营商，1 校园网、2 中国移动、3 中国联通、4 中国电信
var lsp=4;//你的运营商对应的数字



// 各个控件的 selector
var boxOfLogin = '#edit_body > div:nth-child(2) > div.edit_loginBox.ui-resizable-autohide > form > input:nth-child(1)';
var inputOfAccount = '#edit_body > div:nth-child(2) > div.edit_loginBox.ui-resizable-autohide > form > input:nth-child(2)';//账号
var inputOfPassword = '#edit_body > div:nth-child(2) > div.edit_loginBox.ui-resizable-autohide > form > input:nth-child(3)';//密码
var buttonOfLSP = "#edit_body > div:nth-child(2) > div.edit_loginBox.ui-resizable-autohide > select";//运营商的选择
var buttonOfLogin = '#edit_body > div:nth-child(2) > div.edit_loginBox.ui-resizable-autohide > form > input:nth-child(1)';//登录按钮
var buttonOfBack = 'body > div.c-pop.c-confirm.boxy-wrapper.fixed > div > div.bd.boxy-content > form > input';//出错确认（返回）按钮
var buttonOfLogout = '#edit_body > div:nth-child(1) > div.edit_loginBox.ui-resizable-autohide > form > input';//注销按钮

// 登录函数
function login() {
    console.log("正在进行登录操作");
    // 自动填写账号密码到输入框
    document.querySelector(inputOfAccount).value = user_account;
    document.querySelector(inputOfPassword).value = user_password;
    // 自动选择运营商
    document.querySelector(buttonOfLSP).selectedIndex = lsp;
    // 自动点击登录按钮
    window.setTimeout(function () { document.querySelector(buttonOfLogin).click() }, 200);
}


(function () {
    'use strict';
    // Your code here..
    window.setTimeout(function () {
        //判断输入框是否存在
        if ($(boxOfLogin).length > 0) {
            console.log("登录框存在");
            login();
            window.setTimeout(function () {
                //有返回按钮存在
                if (document.querySelector(buttonOfBack).value == "返回") {
                    document.querySelector(buttonOfBack).click()
                    console.log("存在返回按钮，立即返回，并执行登录操作")
                    login();
                };
                console.log("登录成功")
                let res = confirm("登录成功")
                console.log(res)
            }, 1000);
        }
        else {
            //输入框不存在
            window.setTimeout(function () {
                console.log("登录框不存在");
                //判断注销按钮是否存在
                if (document.querySelector(buttonOfLogout).value == "注  销") {
                    console.log("注销按钮存在")
                    window.setTimeout(function () { alert("似乎已经登录过了，不需要再进行登录哦") })
                } else {
                    var choose = confirm("登录框似乎不存在，是否刷新页面重试？");
                    window.setTimeout(function () {
                        if (choose) {
                            console.log("刷新页面")
                            window.setTimeout(function () {
                                location.reload();
                            }, 1000)
                        }
                        else {
                            console.log("用户取消了刷新")
                        };
                    }, 3000);
                    console.log(choose);
                };
            }, 1000)
        };
    }, 300)
})();
