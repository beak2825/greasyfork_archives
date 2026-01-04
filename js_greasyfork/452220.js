// ==UserScript==
// @name         北工大每日打卡（校内）
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  打开网页等待几秒之后自动完成打卡，可以配合快捷指令及safari扩展userscript食用
// @author       You
// @match        https://yqfk.bjut.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bjut.edu.cn
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/452220/%E5%8C%97%E5%B7%A5%E5%A4%A7%E6%AF%8F%E6%97%A5%E6%89%93%E5%8D%A1%EF%BC%88%E6%A0%A1%E5%86%85%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/452220/%E5%8C%97%E5%B7%A5%E5%A4%A7%E6%AF%8F%E6%97%A5%E6%89%93%E5%8D%A1%EF%BC%88%E6%A0%A1%E5%86%85%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
        let check = setInterval(() => {
            console.log("引入中")
            if (document.getElementsByClassName("u-icon__icon uicon-checkbox-mark u-iconfont")[1]) {
    
                clearInterval(check);

                console.log("引入完成");

                setTimeout(() => {

                    var u_label = document.getElementsByClassName("u-radio__label");

                    var label = new Array(u_label.length);

                    for (let j = 0; j < u_label.length; j++) {
                        label[j] = u_label[j].innerText;
                    }

                    var dian = document.getElementsByClassName("u-icon__icon uicon-checkbox-mark u-iconfont");

                    var choice = new Array();
                    choice[0] = 0;
                    var j;
                    var no = "否（No）";
                    var jing = "京内校内（on-campus in Beijing）";
                    var yi = "无异常情况（Nothing abnormal）";
                    var normal = "正常（Normal）";
                    var negative = "阴性（Negative）";
                    var covid = "1天（day 1）";
                    var area = "常态化防控区域（Normalized prevention and control area）";
                    var test = "今日在校内做核酸检测（I have done the test in school today）";

                    for (let i = 0; i < u_label.length; i++) {
                        if (label[i] == no || label[i] == jing || label[i] == yi || label[i] == normal || 
                            label[i] == negative || label[i] == covid || label[i] == area || label[i] == test){
                            j = choice.length;
                            choice[j] = i;
                            console.log(label[i]);
                        }
                    }

                    for (let i = 0; i < choice.length; i++) {
                        var n = choice[i];
                        console.log("点击",label[n]);
                        dian[n].click();
                    }

                    setTimeout(() => {
                        document.getElementsByClassName("u-input__right-icon u-flex")[3].click()//位置信息
                    }, 1000);

                    let check_submit = setInterval(() => {

                        console.log("加载中")

                        if (document.getElementsByClassName("uni-toast").length == 0) {

                            clearInterval(check_submit);

                            dian[8].click();

                            setTimeout(() => {
                            document.getElementsByClassName("btn")[0].click();
                            }, 500);

                            console.log("执行完成");
                        }

                    }, 1500);

                }, 1000);
            }
        }, 500);


})();