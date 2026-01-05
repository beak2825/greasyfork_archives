// ==UserScript==
// @name         今目标自动考勤
// @namespace    https://web.jingoal.com/
// @version      0.12
// @description  今目标考勤系统PC端自动打卡
// @author       Mcoder
// @match         http*://*.jingoal.com/*
// @match         http*://sso.jingoal.com/#/login
// @match         http*://web.jingoal.com/attendance/attendance/web/index.jsp?locale=zh_CN
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/27745/%E4%BB%8A%E7%9B%AE%E6%A0%87%E8%87%AA%E5%8A%A8%E8%80%83%E5%8B%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/27745/%E4%BB%8A%E7%9B%AE%E6%A0%87%E8%87%AA%E5%8A%A8%E8%80%83%E5%8B%A4.meta.js
// ==/UserScript==

// jQuery：<script src="//cdn.bootcss.com/jquery/1.7.2/jquery.min.js"></script>
// 登录：https://sso.jingoal.com/#/login
// 考勤：https://web.jingoal.com/attendance/attendance/web/index.jsp?locale=zh_CN
// 登录后自动跳转：https://web.jingoal.com/#/?_k=svlba5

(function() {
    'use strict';
    var url = location.href;
    var host = location.hostname;
    var uname = '用户名',upwd = '密码';
    var regIndex = /http(s)?:\/\/www.jingoal.com\/(index.html)?/g;
    //currentUserId = currentUserId || "";

    // 嵌入 jQuery
    if(!window.jQuery) {
        var jqScript = document.createElement('script');
        jqScript.setAttribute('src', '//cdn.bootcss.com/jquery/1.7.2/jquery.min.js');
        document.body.appendChild(jqScript);
    }

    setTimeout(function() {
        console.log('开始运行....');

        // 登录
        // https://sso.jingoal.com/#/login
        if(location.href.indexOf('login') > 0 && location.hostname.split('.')[0] == 'sso') {
            jmbLogin(uname, upwd);
        }

        if(location.href.indexOf('web.jingoal.com/#/') > 0) {
            urlJump('https://web.jingoal.com/attendance/attendance/web/index.jsp?locale=zh_CN', 1000);
        }
        if(regIndex.test(location.href)) {
            urlJump('https://sso.jingoal.com/#/login', 1000);
        }
        if(location.href.indexOf('web.jingoal.com/#/login') > 0) {
            urlJump('https://web.jingoal.com');
        }

        // 打卡
        setInterval(function() {
            var week = new Date().getDay();
            if(week == 0 || week == 6) return;  // 周末不打卡
            
            var $btn = $('.clockbtn_0_0');
            var $btnText = $('.clockbtn_0_0').find('.text1').html();
            var now = Date.now();
            var today = new Date().toLocaleDateString();
            var am01 = getDayTime(today, '05:11:01');
            var am02 = getDayTime(today, '05:35:02');
            var am1 = getDayTime(today, '09:33:58');
            var am2 = getDayTime(today, '09:56:59');
            var pm1 = getDayTime(today, '19:21:58');
            var pm2 = getDayTime(today, '19:45:59');
            if(now > am1 && now < am2 && $btnText == "签到") {
                    $btn.trigger('click');
                    console.log('签到成功');
                    setTimeout(function(){window.location.reload();},1000);
                    //return;
            }
            if(now > pm1 && now < pm2 && $btnText == "签退") {
                $btn.trigger('click');
                console.log('签退成功');
                setTimeout(function(){window.location.reload();},1000);
                //return;
            }
            if(now < am1 || now > pm2) {
                location.href = 'http://www.jingoal.com/';
                //setTimeout(function(){window.location.reload();},500);
            }
            console.log('am: '+ am1 + ' pm:'+ pm1);
        }, 600000); // 1000*60*12   600000

    }, 3000);


})();

/**
 * 用户登录
 * @param  {[type]} name [用户名]
 * @param  {[type]} pwd  [密码]
 * @return {[type]}      [description]
 */
function jmbLogin(name, pwd) {
    getId('email').value = name;
    getId('password').value = pwd;

    var result = {
        username: name,
        password: sha1(pwd),
        identify: false,
    };
    $.ajax({
        url: location.protocol + "//" + location.hostname + location.pathname + location.search,
        type: 'POST',
        dataType: 'json',
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        data: result,
        success: function(data) {
            console.log('登录成功...');
            // location.href = 'https://web.jingoal.com/attendance/attendance/web/index.jsp?locale=zh_CN'; //直接跳转到页面会报 currentId错误
            urlJump('https://web.jingoal.com/', 2000);
        },
        fail: function() {
            console.log('登录失败...');
            urlJump('https://sso.jingoal.com/#/login', 2000);
        }
    });
}
/**
 * 获取某天某个时间戳
 * @param  {[type]} date [日期 yyyy/MM/dd]
 * @param  {[type]} time [时间 hh:mm:ss]
 * @return {[type]}      [description]
 */
function getDayTime(date, time) {
    return new Date(date +' '+ time).getTime();
}
/**
 * url 地址跳转
 * @param  {[type]} url  [url地址]
 * @param  {[type]} time [延时时间]
 * @return {[type]}      [description]
 */
function urlJump(url, time) {
    if(time) {
        setTimeout(function() {
            window.location.href = url;
        }, time);
    } else {
        window.location.href = url;
    }
}
// 获取 id元素
var getId = function(name) {return document.getElementById(name);};
// 获取 元素
var getEl = function(name) {return document.querySelector(name);};
// 获取 所有同元素
var getEls = function(name) {return document.querySelectorAll(name);};