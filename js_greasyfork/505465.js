// ==UserScript==
// @name         中行纪念币
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      2024.08.28.0245
// @description  中行纪念币自动填写信息
// @author       BNDou
// @match        https://cmcoins.boc.cn/BOC15_CoinSeller/welcome.html
// @icon         https://cmcoins.boc.cn/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      GPL Licence
// @downloadURL https://update.greasyfork.org/scripts/505465/%E4%B8%AD%E8%A1%8C%E7%BA%AA%E5%BF%B5%E5%B8%81.user.js
// @updateURL https://update.greasyfork.org/scripts/505465/%E4%B8%AD%E8%A1%8C%E7%BA%AA%E5%BF%B5%E5%B8%81.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 获取用户信息
    var user_data = GM_getValue("user_data", []);
    var user = {}
    GM_registerMenuCommand('▶️ 执行当前用户', all_Run, 'r');
    if (user_data.length > 0) {
        user_data.forEach(function (element, index) {
            GM_registerMenuCommand('🙍🏻‍♂️ ' + index + ' ' + element.name + '👉快捷键', () => { user = user_data[index] }, String(index));
        });
    }
    else {
        alert("❌ 请先设置用户列表！");
        GM_setValue("user_data", []);
    }

    // 显示当前用户
    function showName() {
        waitElement("#initPage > div.bu-header.clearfix.ariaskiptheme > span", () => {
            document.querySelector("#initPage > div.bu-header.clearfix.ariaskiptheme > span").textContent = '🙍🏻‍♂️ 当前用户：' + user.name;
        });
    }

    // 设置快捷键
    window.onkeydown = function(event){
        var e = event || window.event;
        var k = e.keyCode || e.which;
        switch(k) {
            case 82:
                // alert('按下了 R\n\n▶️ 执行当前用户');
                all_Run();
                break;
            case 48:
                // alert('按下了 0\n\n🙍🏻‍♂️ 用户0');
                user = user_data[0];
                showName();
                break;
            case 49:
                // alert('按下了 1');
                user = user_data[1];
                showName();
                break;
            case 50:
                // alert('按下了 2');
                user = user_data[2];
                showName();
                break;
            case 51:
                // alert('按下了 3');
                user = user_data[3];
                showName();
                break;
            case 52:
                // alert('按下了 4');
                user = user_data[4];
                showName();
                break;
            case 53:
                // alert('按下了 5');
                user = user_data[5];
                showName();
                break;
            case 54:
                // alert('按下了 6');
                user = user_data[6];
                showName();
                break;
            case 55:
                // alert('按下了 7');
                user = user_data[7];
                showName();
                break;
            case 56:
                // alert('按下了 8');
                user = user_data[8];
                showName();
                break;
            case 57:
                // alert('按下了 9');
                user = user_data[9];
                showName();
                break;
        }
        return false;
    }

    function all_Run() {
        if (Object.keys(user).length > 0) {
            // 重新预约
            reset();
            // 立即预约
            btn_r_new();
            // 同意并继续预约
            btn_Confirm();
            // 我已阅读并同意
            protocal_checkbox();
            // 填写客户姓名
            txt_name(user.name);
            // 填写手机号码
            txt_mobile(user.phone_num);
            // 填写证件号码
            txt_identitynumber(user.id_num);
            // 选择网点
            btn_change();
            // 兑换日期
            date_picker();
            // 图形验证码
            captcha();
            // 获取手机验证码
            get_sms_input();
        }
        else {
            if (user_data.length > 0) {
                alert("❌ 请先选择用户！")
            }
            else {
                alert("❌ 请先设置用户列表！");
            }
        }
    }

    //添加菜单
    // GM_registerMenuCommand('⭕ 立即预约', btn_r_new);
    function btn_r_new() {
        waitElement("#\\30 -0", () => {
            document.querySelector("#\\30 -0").click();
        });
    }
    // GM_registerMenuCommand('⭕ 同意并继续预约', btn_Confirm);
    function btn_Confirm() {
        waitElement("#btn_Confirm_20191128", () => {
            document.querySelector("#btn_Confirm_20191128").click();
        });
    }
    // GM_registerMenuCommand('⭕ 我已阅读并同意', protocal_checkbox);
    function protocal_checkbox() {
        waitElement("#protocal_checkbox", () => {
            document.querySelector("#protocal_checkbox").click();
        });
    }
    // GM_registerMenuCommand('⭕ 客户姓名', txt_name);
    function txt_name(name) {
        waitElement("#txt_name_1956714", () => {
            document.querySelector("#txt_name_1956714").value = name;
        });
    }
    // GM_registerMenuCommand('⭕ 手机号码', txt_mobile);
    function txt_mobile(phone_num) {
        waitElement("#txt_mobile_1956715", () => {
            document.querySelector("#txt_mobile_1956715").value = phone_num;
        });
    }
    // GM_registerMenuCommand('⭕ 证件号码', txt_identitynumber);
    function txt_identitynumber(id_num) {
        waitElement("#txt_identitynumber_1956717", () => {
            document.querySelector("#txt_identitynumber_1956717").value = id_num;
        });
    }
    // GM_registerMenuCommand('⭕ 选择网点', btn_change);
    function btn_change() {
        waitElement("#btn_change__1383915", () => {
            document.querySelector("#btn_change__1383915").click();
        });
        // 山西
        waitElement("#sel_province > ul > li:nth-child(1) > a", () => {
            document.querySelector("#sel_province > ul > li:nth-child(1) > a").click();
        });
        // 忻州
        waitElement("#sel_city > ul > li:nth-child(9) > a", () => {
            document.querySelector("#sel_city > ul > li:nth-child(9) > a").click();
        });
        // 搜索
        waitElement("#sel_city > ul > li:nth-child(9) > a", () => {
            document.querySelector("#btn_branch_name").click();
        });
        // // 点击网点
        // document.querySelector("a.chBranch").click();
        // 关闭
        waitElement("#btn_close_6830", () => {
            document.querySelector("#btn_close_6830").click();
        });
    }
    // GM_registerMenuCommand('⭕ 兑换日期', date_picker);
    function date_picker() {
        waitElement("#date-picker", () => {
            document.querySelector("#date-picker").click();
        });
        setTimeout(waitElement("#btn_Confirm", () => {
            document.querySelector("#btn_Confirm").click();
        }), 1000);
    }
    // GM_registerMenuCommand('⭕ 图形验证码', captcha);
    function captcha() {
        waitElement("#captcha", () => {
            document.querySelector("#captcha").click();
        });
    }
    // GM_registerMenuCommand('⭕ 获取手机验证码', get_sms_input);
    function get_sms_input() {
        waitElement("#get-sms-input", () => {
            document.querySelector("#get-sms-input").click();
        });
        setTimeout(waitElement("#hideMsgBox", () => {
            document.querySelector("#hideMsgBox").click();
        }), 1000);
    }
    // GM_registerMenuCommand('⭕ 重新预约', reset);
    function reset() {
        waitElement("#reserveQuery", () => {
            document.querySelector("#reserveQuery").click();
        });
        waitElement("#reserveQuery", () => {
            document.querySelector("#getCoinInfo").click();
        });
    }

    // 等待元素出现再执行任务
    function waitElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback();
        }
        else {
            setTimeout(() => {
                waitElement(selector, callback);
            }, 500);
        }
    }
})();