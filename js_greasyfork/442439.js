// ==UserScript==
// @name         TGU自动输入登录信息
// @namespace    limonene0x
// @version      0.9.1
// @description  自动在天津工业大学(TGU)系统中输入登录信息
// @author       Limonene0x
// @match        *://*.tiangong.edu.cn/*
// @homepage     https://github.com/limonene0x/AutoTGUSystems/
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442439/TGU%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E7%99%BB%E5%BD%95%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/442439/TGU%E8%87%AA%E5%8A%A8%E8%BE%93%E5%85%A5%E7%99%BB%E5%BD%95%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

// ==功能开启选择==
var course = false; // 教务系统：开启请将 false 改为 true
var jobs = false; // 就业系统：开启请将 false 改为 true
var real = false; // 实践教学管理系统：开启请将 false 改为 true
// ==/功能开启选择==

// ==用户信息输入区域==
var stu_num = '' // 学号（请在单引号内填写）
var course_pwd = '' // 教务系统密码（请在单引号内填写）
var jobs_pwd = '' // 就业系统密码（请在单引号内填写）
var real_pwd = '' // 实践教学系统密码（请在单引号内填写）
// ==/用户信息输入区域==

if (course) {
    try {
        if (window.location.href.indexOf("https://jwxs.tiangong.edu.cn/login?errorCode=") > -1 ||window.location.href.indexOf("http://jwxs.tiangong.edu.cn/login?errorCode=") > -1 || window.location.href == "https://jwxs.tiangong.edu.cn/login" || window.location.href == "http://jwxs.tiangong.edu.cn/login") {
            if (stu_num == '' || course_pwd == '') {
                alert('请在脚本中输入学号或教务系统密码！');

            } else {
                document.querySelector('#input_username').value = stu_num;
                document.querySelector('#input_password').value = course_pwd;
            }
        }
    } catch (e) {
        console.error(e);
    }
}

if (jobs) {
    try {
        if (window.location.href == "https://jobs.tiangong.edu.cn/system/login/login.html" || window.location.href == "http://jobs.tiangong.edu.cn/system/login/login.html") {
            if (stu_num == '' || jobs_pwd == '') {
                alert('请在脚本中输入学号或就业系统密码！');
            } else {
                document.getElementById('login_con_box_std').getElementsByClassName('login_input1').username.setAttribute("onfocus", "if(this.value=='请输入学号'){this.value=''}");
                document.getElementById('login_con_box_std').getElementsByClassName('login_input1').username.value = stu_num;

                let tag = document.getElementById('login_con_box_std').getElementsByClassName('login_input1').password1;
                tag.parentNode.removeChild(tag);

                document.getElementById('login_con_box_std').getElementsByClassName('login_input1').password2.setAttribute("style", "display:block");
                document.getElementById('login_con_box_std').getElementsByClassName('login_input1').password2.value = jobs_pwd;

                document.getElementById('login_con_box_std').getElementsByClassName('login_input1').password2.setAttribute("onfocus", "if(this.value=='请输入密码'){this.value='';this.type='password'}");
                document.getElementById('login_con_box_std').getElementsByClassName('login_input1').password2.setAttribute("onblur", "if(this.value==''){this.value='请输入密码';this.type='text'}");
            }
        }
    } catch (e) {
        console.error(e);
    }
}

if (real) {
    try {
        if (window.location.href.indexOf("http://bsgl.tiangong.edu.cn/aexp/") > -1 || window.location.href.indexOf("https://bsgl.tiangong.edu.cn/aexp/") > -1) {
            if (stu_num == '' || real_pwd == '') {
                alert('请在脚本中输入学号或实践教学系统密码！');
            } else {
                document.querySelector('.juese').value = '2';
                document.loginForm.username.value = stu_num;
                document.loginForm.password.value = real_pwd;
            }
        }
    } catch (e) {
        console.error(e);
    }
}