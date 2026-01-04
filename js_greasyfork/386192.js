// ==UserScript==
// @name         博学谷自动反馈
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动提交反馈
// @author       658
// @match        *://*.boxuegu.com/**
// @grant        none
// @icon         https://s2.ax1x.com/2019/06/07/V0vkVI.png
// @downloadURL https://update.greasyfork.org/scripts/386192/%E5%8D%9A%E5%AD%A6%E8%B0%B7%E8%87%AA%E5%8A%A8%E5%8F%8D%E9%A6%88.user.js
// @updateURL https://update.greasyfork.org/scripts/386192/%E5%8D%9A%E5%AD%A6%E8%B0%B7%E8%87%AA%E5%8A%A8%E5%8F%8D%E9%A6%88.meta.js
// ==/UserScript==
(function () {

    setTimeout(function () {

        let feedbackURL = /learngoalpaper/;
        let indexURL = /index/;
        let URL = window.location.href;
        let list;
        let flag = true;

        if (indexURL.test(URL)){
            let btn = document.querySelectorAll(".redD1 span")[0];
            btn ?
                btn.click():
            console.log("反馈未开启")
        }

        if (feedbackURL.test(URL)){
            switch(prompt("请输入你的选择ABCD")){
                case "A":
                case "a":
                    list = document.querySelectorAll(".el-radio:nth-child(4n-3)");
                    break;
                case "B":
                case "b":
                    list = document.querySelectorAll(".el-radio:nth-child(4n-2)");
                    break;
                case "C":
                case "c":
                    list = document.querySelectorAll(".el-radio:nth-child(4n-1)");
                    break;
                case "D":
                case "d":
                    list = document.querySelectorAll(".el-radio:nth-child(4n");
                    break;
                default:
                    flag = false;
                    break;
            }
            if(flag){
                list.forEach(e => {
                    e.click();
                });
                setTimeout(() =>{
                    if (confirm("确定选择提交吗")) {
                        document.querySelector(".sub a").click();
                    }
                },100)
            }
        }
    }, 600)

})();