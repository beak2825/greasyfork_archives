// ==UserScript==

// @name         CUMT_教务系统自动填充账户密码

// @namespace    http://tampermonkey.net/

// @version      2.0

// @description  自动填充用户名和密码

// @author       Feng

// @match        http://jwxk1.cumt.edu.cn/jwglxt/*

// @match        http://jwxk2.cumt.edu.cn/jwglxt/*

// @match        http://jwxt.cumt.edu.cn/jwglxt/*

// @grant        GM_setValue

// @grant        GM_getValue

// @grant        GM_registerMenuCommand

// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/522519/CUMT_%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E6%88%B7%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/522519/CUMT_%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85%E8%B4%A6%E6%88%B7%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {

    'use strict';

    // 检查是否已经保存了账号和密码

    var stu_num = GM_getValue('stu_num');

    var stu_pwd = GM_getValue('stu_pwd');

    // 如果没有保存，则提示用户输入

    if (!stu_num || !stu_pwd) {

        var userInput = prompt('请输入您的学号：');

        var userPass = prompt('请输入您的密码：');

        if (userInput && userPass) {

            GM_setValue('stu_num', userInput);

            GM_setValue('stu_pwd', userPass);

        } else {

            alert("未输入账号或密码，脚本将停止运行。");

            return;

        }

    }

    // 自动填充用户名和密码

    if (document.querySelector('#yhm') && document.querySelector('#mm')) {

        document.querySelector('#yhm').value = stu_num;

        document.querySelector('#mm').value = stu_pwd;

    }

    // 添加菜单项以允许用户修改账号和密码

    GM_registerMenuCommand('修改登录信息', function() {

        var newStuNum = prompt('请输入新的学号（留空以保持不变）：', stu_num);

        var newStuPwd = prompt('请输入新的密码（留空以保持不变）：', stu_pwd);

        if (newStuNum || newStuPwd) {

            if (newStuNum) GM_setValue('stu_num', newStuNum);

            if (newStuPwd) GM_setValue('stu_pwd', newStuPwd);

        }

    });

})();