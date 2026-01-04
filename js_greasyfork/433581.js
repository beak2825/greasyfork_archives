// ==UserScript==
// @name         dailyReport Automator
// @name:zh      健康打卡自动化
// @name:zh-CN   健康打卡自动化
// @namespace    http://stu3.zstu.edu.cn/webroot/decision
// @version      0.04
// @description  Automatically completes the health daily report
// @description:zh-cn 每日健康打卡自动化
// @author       Chaos4Yarn
// @match        http://stu3.zstu.edu.cn/webroot/decision/*
// @match        http://stu3.zstu.edu.cn/webroot/decision
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433581/dailyReport%20Automator.user.js
// @updateURL https://update.greasyfork.org/scripts/433581/dailyReport%20Automator.meta.js
// ==/UserScript==

//======================CONFIG======================
// Credentials for auto-login
    var username = "username";
    var password = "password";
//==================================================

    function $(id){
        return document.getElementById(id);
    }
    function $$(classname){
        return document.getElementsByClassName(classname);
    }
    function $$$(name){
        return document.getElementsByName(name);
    }


(function() {
    'use strict';
    window.onload = function() {
        if(username=="username"){
            // username check
            alert("Please edit the script and set your username & password! \n请编辑脚本，指定你的用户名和密码！");
            alert("The script will now terminate. \n脚本执行中断。");
            return false;
        }
        if(window.location.pathname === "/webroot/decision/login"){
            // 账号密码
            $$("bi-input")[0].value = username;
            $$("bi-input")[1].value = password;
            // 登录按钮点击
            var clickevt = document.createEvent("MouseEvents");
            clickevt.initEvent("click", true, true);
            $$("login-button")[0].dispatchEvent(clickevt);

        } else {
            // 打开 健康申报标签栏
            var open = document.createEvent("Event");
            open.initEvent("click", true, true);
            $$("bi-expander")[0].dispatchEvent(open);
            setTimeout(function() {
                $$("dec-frame-platform-list-item-active")[0].dispatchEvent(open);
            }, 0);
            // 定时器，加载完毕，打开健康申报页面
            var timer;
            timer = setInterval(function() {
                if ($$("bi-iframe bi-card")[1].contentWindow.document.getElementsByClassName("linkspan").length) {
                    // 避免重复打卡
                    var node = $$("bi-iframe bi-card")[1].contentWindow.document.getElementsByClassName("linkspan")[0]
                    if (node.parentNode.parentNode.style.display === "none") {
                        alert("今日已打卡");
                        clearInterval(timer);
                        return
                    }
                    node.dispatchEvent(open);
                    clearInterval(timer);
                    // 自动填充数据
                    var timer2;
                    timer2 = setInterval(function() {
                        var el = dataFormat("x-text");
                        if (el.length) {
                            clearInterval(timer2);
                            // 自动填充数据
                            autoFillData();
                        }
                    },500)
                }
            },500)
            function dataFormat(className) {
                return $$("bi-iframe bi-card")[1].contentWindow.document.getElementsByClassName(className);
            }
            function tdDataFormat(id) {
                return $$("bi-iframe bi-card")[1].contentWindow.document.getElementById(id);
            }
            // 自动填充数据
            function autoFillData() {
                // 省市区
                dataFormat("fr-trigger-texteditor")[0].value = "浙江省"
                tdDataFormat("D9-0-0").setAttribute("cv", "浙江省")
                dataFormat("fr-trigger-texteditor")[1].value = "杭州市"
                tdDataFormat("E9-0-0").setAttribute("cv", "杭州市")
                dataFormat("fr-trigger-texteditor")[2].value = "江干区"
                tdDataFormat("F9-0-0").setAttribute("cv", "江干区")
                dataFormat("fr-texteditor")[0].value = "浙江理工大学"
                tdDataFormat("D10-0-0").setAttribute("cv", "浙江理工大学")
                // radio
                // 是否离校 0：是，1：否
                // dataFormat("x-text")[1].classList.remove("fr-radio-radiooff")
                // dataFormat("x-text")[1].classList.add("fr-radio-radioon")
                // 身体状况 2：正常，3：不是
                dataFormat("x-text")[2].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[2].classList.add("fr-radio-radioon")
                tdDataFormat("D18-0-0").setAttribute("cv", "正常")
                // 今日上午测量体温 8：37度以下，9：37-37.2度，10：37.3度以上
                dataFormat("x-text")[8].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[8].classList.add("fr-radio-radioon")
                tdDataFormat("D20-0-0").setAttribute("cv", "37度以下")
                // 昨日下午测量体温 11：37度以下，12：37-37.2度，13：37.3度以上
                dataFormat("x-text")[11].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[11].classList.add("fr-radio-radioon")
                tdDataFormat("D21-0-0").setAttribute("cv", "37度以下")
                // 是否接种新冠疫苗 21：是 全部，22：是 第一次，23：否
                // dataFormat("x-text")[23].classList.remove("fr-radio-radiooff")
                // dataFormat("x-text")[23].classList.add("fr-radio-radioon")
                // 1.杭州健康码 24：绿色
                dataFormat("x-text")[24].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[24].classList.add("fr-radio-radioon")
                tdDataFormat("F28-0-0").setAttribute("cv", "绿色")
                // 2.通信大数据行程卡 29：绿色
                dataFormat("x-text")[29].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[29].classList.add("fr-radio-radioon")
                tdDataFormat("F29-0-0").setAttribute("cv", "绿色")
                // 3.是否属于近28日内境返回人员 34：是，35：否
                dataFormat("x-text")[35].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[35].classList.add("fr-radio-radioon")
                tdDataFormat("F30-0-0").setAttribute("cv", "否")
                // 4.学生及同住家庭成员是否存在确诊/疑似病例 36：是，37：否
                dataFormat("x-text")[37].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[37].classList.add("fr-radio-radioon")
                tdDataFormat("F31-0-0").setAttribute("cv", "否")
                // 5.学生及同住家庭成员：近14天是否到过中高风险地区 38：是，39：否
                dataFormat("x-text")[39].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[39].classList.add("fr-radio-radioon")
                tdDataFormat("F32-0-0").setAttribute("cv", "否")
                // 6.学生及同住家庭成员：近十四天是否接触中高风险地区返回人员 40：是，41：否
                dataFormat("x-text")[41].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[41].classList.add("fr-radio-radioon")
                tdDataFormat("F34-0-0").setAttribute("cv", "否")
                // 7.近14天内是否做过核酸检测 42：否，43：阴性，44：阳性
                dataFormat("x-text")[42].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[42].classList.add("fr-radio-radioon")
                tdDataFormat("F36-0-0").setAttribute("cv", "否")
                // 家人/同住人员是否有出现发热、干咳等症状 45：是，46：否
                dataFormat("x-text")[46].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[46].classList.add("fr-radio-radioon")
                tdDataFormat("F38-0-0").setAttribute("cv", "否")
                // 是否曾离开所居住城市 47：是，48：否
                dataFormat("x-text")[48].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[48].classList.add("fr-radio-radioon")
                tdDataFormat("F40-0-0").setAttribute("cv", "否")
                // 是否属于近14天内从福建省厦门市、泉州市、莆田市、晋江市，哈尔滨市返回？ 49：是，50：否
                dataFormat("x-text")[50].classList.remove("fr-radio-radiooff")
                dataFormat("x-text")[50].classList.add("fr-radio-radioon")
                tdDataFormat("F42-0-0").setAttribute("cv", "否")
                // 提交数据（自动，可选择打开）
                var submit = document.createEvent("Event");
                submit.initEvent("click", true, true);
                dataFormat("fr-btn-up  fr-btn-noicon")[0].dispatchEvent(submit);
            }
        }
    }
})();