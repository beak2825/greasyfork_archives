// ==UserScript==
// @name         永硕E盘 自动登录
// @namespace    Pzwboy
// @version      1.21
// @description  安装此脚本后请自行编辑信息 原作者waecy
// @author       waecy
// @match       *://*.ysepan.com/*
// @match       *://*.cccpan.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/492475/%E6%B0%B8%E7%A1%95E%E7%9B%98%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/492475/%E6%B0%B8%E7%A1%95E%E7%9B%98%20%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
$(document).ready(function() {
    // 判断是否有登陆按钮
    // 输入E盘域名
    if (window.location.host == "永硕E盘用户名.ysepan.com" || "永硕E盘用户名.cccpan.com") {
        // 判断是否未登录
        if ($('#glyq2').attr('style')) {
            // 点击进入管理
            $('#ysmenu > div').eq(3).click()
                // 判断是否登录,没登录,自动登录
            if ($('#glyq2').attr('style') == "display: none;") {
                // 填写密码
                $('#bdglymm').val('永硕E盘密码');
                // 提交
                $('#sutjgl').click();
                console.log('登录成功');
                // 隐藏登录提示
                window.setTimeout(function() {
                    $('#ck_glts_html').hide();
                    console.log('500毫秒之后执行了');
                }, 500)
            }
        }
    }
});