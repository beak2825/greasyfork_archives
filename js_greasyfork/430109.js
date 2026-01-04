// ==UserScript==
// @name         Discuz论坛自动设置主题
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Discuz论坛自动设置黄色主题和新窗口打开，支持hostloc、HomeAssistant论坛。
// @author       maypu
// @match        https://hostloc.com/*
// @match        https://bbs.hassbian.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/430109/Discuz%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E4%B8%BB%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/430109/Discuz%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E8%AE%BE%E7%BD%AE%E4%B8%BB%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let cookie_prefix_list = {
        "hostloc": "hkCM",
        "hassbian": "gXRl"
    }
    let hostname = window.location.hostname
    let cookie_prefix = ''
    for (let url in cookie_prefix_list) {
        if (hostname.indexOf(url)>-1) {
            cookie_prefix = cookie_prefix_list[url]
            break;
        }
    }
    console.log(cookie_prefix);
    if (cookie_prefix == '') {
        return false;
    }
    //获取cookie
    let getCookie = function (name) {
        //获取当前所有cookie
        let strCookies = document.cookie;
        //截取变成cookie数组
        let array = strCookies.split(';');
        //循环每个cookie
        for (let i = 0; i < array.length; i++) {
            //将cookie截取成两部分
            let item = array[i].split("=");
            //判断cookie的name 是否相等
            if (item[0] == name) {
                return item[1];
            }
        }
        return null;
    }

    //添加cookie
    let addCookie = function (name, value, time) {
        let strSec = getSec(time);
        let exp = new Date();
        exp.setTime(exp.getTime() + strSec * 1);
        //设置cookie的名称、值、失效时间
        document.cookie = name + "=" + value + ";expires="+ exp.toGMTString();
    }

    //获取时间的秒数（参数：d，h,m,s） 12m
    var getSec = function(str){
        var str1 = str.substr(0, str.length - 1);  //时间数值
        var str2 = str.substr(str.length-1, 1);    //时间单位
        if (str2 == "s") {
            return str1 * 1000;
        }
        else if (str2 == "m") {
            return str1 * 60 * 1000;
        }
        else if (str2 == "h") {
            return str1 * 60 * 60 * 1000;
        }
        else if (str2 == "d") {
            return str1 * 24 * 60 * 60 * 1000;
        }
    }

    let themeCookie = getCookie(' ' + cookie_prefix + '_2132_extstyle');
    if (!themeCookie) {
        addCookie(cookie_prefix + '_2132_extstyle','./template/default/style/t3','30d');
        setTimeout(function() {
            window.location.reload();
        },200);
    }

    //自动设置新窗打开
    let newPanel = document.getElementById('atarget');
    if (newPanel.getAttribute('class').indexOf('atarget_1') < 0) {
        newPanel.click();
    }

})();