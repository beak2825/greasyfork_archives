// ==UserScript==
// @name         2023安徽省国培计划农村骨干线上专项培训项目自动点击
// @namespace    http://tampermonkey.net/
// @version      0.108
//  @description  🔥功能介绍🔥：🎉 1、2023安徽省国培计划农村骨干线上专项培训项目自动点击插件；🎉 2、2023安徽省国培计划农村骨干线上专项培训项目自动点击插件；🎉 3、2023安徽省国培计划农村骨干线上专项培训项目自动点击插件取；🎉；
// @author       小楼夜听春雨
// @match       http://cas.study.yanxiu.jsyxsq.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/480939/2023%E5%AE%89%E5%BE%BD%E7%9C%81%E5%9B%BD%E5%9F%B9%E8%AE%A1%E5%88%92%E5%86%9C%E6%9D%91%E9%AA%A8%E5%B9%B2%E7%BA%BF%E4%B8%8A%E4%B8%93%E9%A1%B9%E5%9F%B9%E8%AE%AD%E9%A1%B9%E7%9B%AE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/480939/2023%E5%AE%89%E5%BE%BD%E7%9C%81%E5%9B%BD%E5%9F%B9%E8%AE%A1%E5%88%92%E5%86%9C%E6%9D%91%E9%AA%A8%E5%B9%B2%E7%BA%BF%E4%B8%8A%E4%B8%93%E9%A1%B9%E5%9F%B9%E8%AE%AD%E9%A1%B9%E7%9B%AE%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB.meta.js
// ==/UserScript==

window.onload = function () {
    window.alert = function () {
        return true;
        console.log("自动点击了");
    }
    var int = self.setInterval(function clock() {
        var spanlist = document.querySelectorAll('.introduce_list span');
        if (spanlist.length > 0) {
            for (var i = 0; i < spanlist.length; i++) {
                if (spanlist[3].outerText == '课程时长：') {
                    console.log(spanlist[3].parentElement.outerText);
                    var kechshch = spanlist[3].parentElement.outerText;
                    var shuzi = kechshch.split('课程时长：')[1].split('分钟')[0].trim(); //获得课程时长的数字
                }
            }
        }
        if (document.querySelector('#benci') != null && document.querySelector('#benci') != undefined) {
            var benci = document.querySelector('#benci').outerText.split('分')[0].trim(); //获取本次学习时间
        }
        if (document.querySelector('#zonggong') != null && document.querySelector('#zonggong') != undefined) {
            var leij = document.querySelector('#zonggong').outerText.split('分钟')[0].trim(); //获取累计学习时间
        }


        var zonggong = parseInt(benci) + parseInt(leij);//总共学习时间
        if (zonggong >= shuzi) {
            console.log('时间够了');

            if (document.querySelector('#exit_study_btn') != null && document.querySelector('#exit_study_btn') != undefined) {
                document.querySelector('#exit_study_btn').onclick();
                document.querySelector('#exit_study_btn').alert = function () { return true; }
            }

        } else {
            console.log('时间不够')
        }
    }, 5000);

}