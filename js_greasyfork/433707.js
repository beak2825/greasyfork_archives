// ==UserScript==
// @name         南昌大学校园网自动连接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  南昌大学校园网自动连接并关闭（适用NCU-2.4G、NCU-5G、NCUWLAN）只需要在下面输入你的信息即可
/*
* 注意：如果是FireFox浏览器，可能不能正常关闭页面，你需要按如下设置
* FireFox需要设置:
* 在Firefox地址栏里输入 about:config
* 在配置列表中找到 dom.allow_scripts_to_close_windows
* 点右键的选切换把上面的false修改为true即可。
* 注：默认是false，是为了防止脚本乱关窗口
* */
// @author       dundun
// @match        http://222.204.3.154/*
// @match        http://222.204.3.221/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433707/%E5%8D%97%E6%98%8C%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/433707/%E5%8D%97%E6%98%8C%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // *************   在单引号中输入你的信息   *************
    // 输入你的学号
    let username = '';
    // 输入你的密码
    let password = '';
    // 选择你的运营商(校园网、移动、联通、电信)
    let operator = '';
    // *************   在单引号中输入你的信息   *************


    if (window.location.pathname === "/srun_portal_success") {
        window.open("about:blank","_self").close();
    }

    let Username = document.querySelector('#username');
    let Password = document.querySelector('#password');
    let Operator = document.querySelector('#domain');

    Username.value = username;
    Password.value = password;

    if (window.location.host === '222.204.3.221') {
        if (Username.value && Password.value) {
            // 如果信息输全，则触发登录按钮
            document.querySelector('.btn').click();
        } else {
            alert('你的信息没有填全');
            return false;
        }
    } else if (window.location.host === '222.204.3.154') {
        switch (operator) {
            case "移动":
                Operator.value = "@cmcc";
                break;
            case "校园网":
                Operator.value = "@ncu";
                break;
            case "联通":
                Operator.value = "@unicom";
                break;
            case "电信":
                Operator.value = "@ndcard";
                break;
            default:
                alert('看看运营商有没有写错');
                return false;
        }
        if (Username.value && Password.value && Operator.value) {
            // 如果信息输全，则触发登录按钮
            document.querySelector('.btn').click();
        } else {
            alert('你的信息没有填全');
            return false;
        }
    }
})();