// ==UserScript==
// @name         金科院自动健康打卡
// @namespace    Ramos
// @version      1.5
// @description  金科院每日健康打卡自动脚本。
// @author       Ramos
// @match        *://*.jit.edu.cn/*
// @match        *://*.dk.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455307/%E9%87%91%E7%A7%91%E9%99%A2%E8%87%AA%E5%8A%A8%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/455307/%E9%87%91%E7%A7%91%E9%99%A2%E8%87%AA%E5%8A%A8%E5%81%A5%E5%BA%B7%E6%89%93%E5%8D%A1.meta.js
// ==/UserScript==
// 打卡网址：dk.com
// 打卡网址：http://ehallapp.jit.edu.cn/qljfwapp/sys/lwJitHealthInfoDailyClock/index.do

(function () {
    'use strict';

    var data ={              //所有信息需要填写在单引号之间！
        username:         '',//金科院登录账户（学号/工号）
        password:         '',//金科院登录密码
        phone:            '',//手机号码（选填）
        Province:         '320000',//明日所在省份   江苏
        City:             '320100',//明日所在城市   南京
        District:         '320115',//明日所在区域   江宁
        TomorrowPosition: '001',//明日所在位置      001:江宁校区 002:幕府校区 011:白下校区 003:南京内 004:江苏内 005:江苏外
        CurrentSituation: '015',//今日状态          002:校内工作 012:校内公务 015:校内学习 017:校外非公务
        Exceptions:       '001',//异常情况          001:无       026:低风险   032:中风险   033:高风险
        AcidTestResults:  '011',//今日核酸检测情况  001:今日不检 002:今日检测 011:48h阴性  012:阳性(快跑)
        VaccinationStatus:'004',//今日疫苗接种情况  001:0针      002:1针      003:2针      004:3针
        HealthCodeColour: '001',//今日健康码        001:绿码     002:黄码     003:红码(快跑)
        HomeAddress:      '004',//家庭住址（多选）  003:南京中高风险区   004:南京非风险区
        RoamingPlace:     '320115'//14天漫游地      320115:江宁
    };

    var pattern_dk = new RegExp('dk.com');
    var pattern_login = new RegExp('authserver.jit.edu.cn');
    var pattern_app = new RegExp('ehallapp.jit.edu.cn');

    if (pattern_dk.test(window.location.href)){
        window.location.replace("http://ehallapp.jit.edu.cn/qljfwapp/sys/lwJitHealthInfoDailyClock/index.do");}

    setTimeout(function () {
        if (pattern_login.test(window.location.href)) {
            if(data.username!=''&data.password != ''){
                //统一登陆
                if (window.screen.width < 950) {
                    //Mobile
                    mobileUsername.value = data.username;
                    mobilePassword.value = data.password;
                } else if (window.screen.width > 950) {
                    //PC
                    username.value = data.username;
                    password.value = data.password;
                }
                $.ajax("needCaptcha.html", {
                    data: {
                        username: username.value
                    },
                    cache: false,
                    dataType: "text",
                    success: function(data) {
                        if (data.indexOf("true") > -1)
                            window.alert("此次登陆需要图形验证码。");
                        else
                            casLoginForm.submit();
                    }
                })
            }
        } else if (pattern_app.test(window.location.href)) {
            //新建打卡
            setTimeout(function () {
                document.getElementsByClassName("bh-btn-primary")[2].click();
                //判断已经打卡
                if (document.getElementsByClassName("bh-pop bh-card bh-card-lv4 bh-dialog-con").length == 1) {
                    //window.alert("Checkin Already!");
                }else
                    setTimeout(function () {
                        document.getElementsByClassName("bh-btn bh-btn-primary bh-pull-right")[0].removeAttribute("disabled");
                        document.getElementsByClassName("bh-btn bh-btn-primary bh-pull-right")[0].click();
                        //修改数据
                        setTimeout(function () {
                            if (data.phone.length != 0) {
                                document.getElementsByClassName("bh-form-block bh-mb-36")[1].children[4].children[0].children[1].children[1].value = data.phone; //手机号码
                            }
                            document.getElementsByClassName("bh-form-block bh-mb-36")[2].children[0].children[0].children[1].children[1].children[1].value = data.Province;
                            document.getElementsByClassName("bh-form-block bh-mb-36")[2].children[1].children[0].children[1].children[1].children[1].value = data.City;
                            document.getElementsByClassName("bh-form-block bh-mb-36")[2].children[2].children[0].children[1].children[1].children[1].value = data.District;
                            document.getElementsByClassName("bh-form-block bh-mb-36")[2].children[3].children[0].children[1].children[1].children[1].value = data.TomorrowPosition;
                            document.getElementsByClassName("bh-form-block bh-mb-36")[2].children[4].children[0].children[1].children[1].children[1].value = data.CurrentSituation;
                            document.getElementsByClassName("bh-form-block bh-mb-36")[2].children[5].children[0].children[1].children[1].children[1].value = data.Exceptions;
                            document.getElementsByClassName("bh-form-block bh-mb-36")[2].children[6].children[0].children[1].children[1].children[1].value = data.AcidTestResults;
                            document.getElementsByClassName("bh-form-block bh-mb-36")[2].children[7].children[0].children[1].children[1].children[1].value = data.VaccinationStatus;
                            document.getElementsByClassName("bh-form-block bh-mb-36")[2].children[8].children[0].children[1].children[1].children[1].value = data.HealthCodeColour;
                            document.getElementsByClassName("bh-form-block bh-mb-36")[2].children[9].children[0].children[1].children[1].children[1].value = data.HomeAddress;
                            document.getElementsByClassName("bh-form-block bh-mb-36")[2].children[10].children[0].children[1].children[1].children[1].value = data.RoamingPlace;
                            //提交数据
                            setTimeout(function () {
                                document.getElementById("save").click();
                                setTimeout(function () {
                                    document.getElementsByClassName("bh-dialog-btn bh-bg-primary bh-color-primary-5")[0].click();
                                }, 200);
                            }, 100);
                        }, 1000);
                    }, 300);
            }, 1500);
        }
    }, 50);
})();

// The MIT License (MIT)
// Copyright (c) 2022 Ramos
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice (including the next paragraph) shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.