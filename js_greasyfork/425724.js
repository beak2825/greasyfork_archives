// ==UserScript==
// @name         SCAU OJ提交倒计时显示工具
// @namespace    YelloooBlue_SCAU_OJ_TimerTool
// @version      0.3
// @description  适用于：SCAU华南农业大学OJ平台;   使用说明：OJ平台有提交频率限制（60s一次），但提交后看不到剩余秒数；在某种情况下需要连续提交时，若在60s内再次提交会被打回，导致时间浪费，通过该插件可以显示剩余的时间。
// @author       YelloooBlue
// @match        *://172.26.14.60:8000/uoj/mainMenu.html
// @match        *://acm.scau.edu.cn:8000/uoj/mainMenu.html
// @grant
// @downloadURL https://update.greasyfork.org/scripts/425724/SCAU%20OJ%E6%8F%90%E4%BA%A4%E5%80%92%E8%AE%A1%E6%97%B6%E6%98%BE%E7%A4%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/425724/SCAU%20OJ%E6%8F%90%E4%BA%A4%E5%80%92%E8%AE%A1%E6%97%B6%E6%98%BE%E7%A4%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==


var timeS = 60;//倒计时时间，可修改


//初始化div
var div = document.createElement("div");
div.style.cssText = "top: 15px;background: #044599;color:#ffffff;overflow: hidden;z-index: 99999999;margin:10px;text-align:center;width: 250px;height: 50px;";
div.title = "插件制作：Copyright©YelloooBlue\n 联系方式：YelloooBlue@qq.com";
$("#top").append(div);


(function () {
    'use strict';
    var flag = 0; //0为正在检测提交界面  1为当前处于提交界面  2为正在倒计时
    setDivContent("<p>初始化完成 - 等待切换到提交页面</p>");

    function ready(form) {

        div.style.backgroundColor = "green"
        setDivContent("<p>可提交 - 准备就绪</p>");

        form.submit(function (e) {
            flag =2;
            div.style.backgroundColor = "OrangeRed"

            var sec=timeS;
            //计时函数
            var timer = setInterval(function () {
                sec--;

                setDivContent("<p>不可提交 - 剩余秒数：" + sec + "</p>");

                //倒计时结束
                if (!sec) {

                    div.style.backgroundColor = "#044599"
                    setDivContent("<p>可提交 - 等待切换到提交页面</p>");


                    sec = timeS;
                    flag = 0;
                    clearInterval(timer);
                }
            }, 1000);
        })
    }

    function setDivContent(content) {
        div.innerHTML = "<p>OJ 提交倒计时显示插件</p>" + content;
    }


    //检测提交页面
    setInterval(function () {
        var form = $('#rightMain').contents().find("iframe").contents().find('#form1');//提交表单
        var formT = $('#rightMain').contents().find('#form1');//考试表单

        if (form.length) {
            if(flag==0){
                flag = 1;
                ready(form);
            }
        }
        else if (formT.length) {
            if(flag==0){
                flag = 1;
                ready(formT);
            }
        }
        else{
            if(flag==1){
                flag=0;
                div.style.backgroundColor = "#044599"
                setDivContent("<p>可提交 - 等待切换到提交页面</p>");
            }
        }

    }, 1000);
}
)();

