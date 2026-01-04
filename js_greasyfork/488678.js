// ==UserScript==
// @name         鸡毛虾的令箭
// @namespace    http://tampermonkey.net/
// @version      2024-04-18-2
// @description  鸡毛哥哥我爱你
// @author       You
// @match        https://train2.cmeconf.com/student/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cmeconf.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488678/%E9%B8%A1%E6%AF%9B%E8%99%BE%E7%9A%84%E4%BB%A4%E7%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/488678/%E9%B8%A1%E6%AF%9B%E8%99%BE%E7%9A%84%E4%BB%A4%E7%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //添加按钮
    var fillAnswerButton = document.createElement('div');
    fillAnswerButton.style.margin = "0px 10px";
    fillAnswerButton.style.opacity = "1";
    fillAnswerButton.innerHTML =`<div><img src="data:image/png;base64,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" alt="" style="width: 30px; height: 30px;"></div> <div data-v-03557f6a="">一键答题</div>`;
    var rightTool = document.querySelector("#app > div.router > div > div:nth-child(1) > div.firstLine > div:nth-child(2)");
    rightTool.prepend(fillAnswerButton)
    fillAnswerButton.addEventListener('click',function() {
         xhr.send(); // 发送请求
    });
    //用户信息
    var token = JSON.parse(localStorage.getItem("userInfo")).token
    var tenantCode = localStorage.getItem("tenantCode")
    var examId = getUrlParameter("examId")

    var xhr = new XMLHttpRequest(); // 创建XMLHttpRequest对象
    xhr.open('GET', 'https://train2.cmeconf.com/train/student-frontend/api/api/eduExam/queryExamQuestion?examId=e14d991b9c9d444abdfc9afb7cf88bcf&examVersion=1'); // 设置请求类型和URL地址
    xhr.setRequestHeader("Token","Bearer " + token,);
    xhr.setRequestHeader("tenant",tenantCode);
    xhr.setRequestHeader("Authorization","Basic bGFtcF93ZWI6bGFtcF93ZWJfc2VjcmV0");

    xhr.onreadystatechange = function() { // 定义状态改变时的处理函数
        if (xhr.responseText) {
             var responseData = JSON.parse(xhr.responseText); // 将服务器返回的JSON字符串转换为对象或其他格式
            responseData.data.forEach((single,index) => {
                var answerRete = formatZimu(single.answer)
                var buttonGorups = []
                if (document.getElementById(single.questionId).getElementsByClassName("el-radio-group").length === 0) {
                    buttonGorups = document.getElementById(single.questionId).getElementsByClassName("el-checkbox-group")[0].getElementsByTagName("input")

                } else {
                    buttonGorups = document.getElementById(single.questionId).getElementsByClassName("el-radio-group")[0].getElementsByTagName("input")
                }
                answerRete.forEach(num => {
                    setTimeout(() => {
                        buttonGorups[num].focus()
                        buttonGorups[num].click()
                    }, num * 100);
                })
            })
        }
    };

    var formatZimu= function(str) {
        if (str === "正确") {
            return [0]
        } else if (str === "错误") {
            return [1]
        } else {
            let stringArr = []
            str= str.split("");
            str.forEach(single => {
                switch (single) {
                    case 'A':
                        stringArr.push(0)
                        break
                    case 'B':
                        stringArr.push(1)
                        break
                    case 'C':
                        stringArr.push(2)
                        break
                    case 'D':
                        stringArr.push(3)
                        break

                }
            })
            return stringArr
        }

    }
    function getUrlParameter(parameterName) {
        parameterName = parameterName.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + parameterName + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(window.location);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }
})();