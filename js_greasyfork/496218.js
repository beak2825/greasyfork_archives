// ==UserScript==
// @name         鸡毛侠model3
// @namespace    http://tampermonkey.net/
// @version      1.7.4
// @description  tongxunketang 可跳出 答案查看
// @author       linxiang.chen
// @match        https://txxt.cmeconf.com/train/pc/
// @match        https://txxt.tongxunjiaoyu.com/pc/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.pornhub.com
// @grant GM_xmlhttpRequest
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/496218/%E9%B8%A1%E6%AF%9B%E4%BE%A0model3.user.js
// @updateURL https://update.greasyfork.org/scripts/496218/%E9%B8%A1%E6%AF%9B%E4%BE%A0model3.meta.js
// ==/UserScript==
function toggleAnswerHelper() {
    const answerHelper = document.getElementById('answerHelper');
    answerHelper.style.display = answerHelper.style.display === 'none' ? 'block' : 'none';
}
(function () {
    'use strict';
    if (window) {
        console.log(window)
        //禁用事件
        delete window.onblur;
        if ('onblur' in window) {
            window.onblur = undefined;
        }
        if ('onfocus' in window) {
            window.onfocus = undefined;
        }
        // 阻止事件
        for (let event_name of ["visibilitychange", "webkitvisibilitychange", "blur"]) {
            window.addEventListener(event_name, function(event) {
                event.stopImmediatePropagation(); event.preventDefault();
                console.log(`${event_name} event prevented`)
            }, true);
        }

        // 移除事件监听器
        //document.removeEventListener('copy');
    }
    const button = document.createElement("button")
    const buttonCss = "position: fixed;bottom: 2%;right: 5%;background-color: #f00;color: #fff;border: none;padding: 4px 8px;cursor: pointer;z-index: 999;opacity: 10%;"
    button.style.cssText = buttonCss
    button.onclick = toggleAnswerHelper
    button.innerHTML += "答"
    document.body.appendChild(button)
    const modal = document.createElement("div")
    const modalCss = "overflow:auto;z-index:99;position:fixed;width:400px;height:250px;background-color:white;bottom:5%;right:5%;font-size: 14px;padding: 4px;color: black;border: 1px dotted lightgray;opacity: 0.6;line-height:2;display:none"
    modal.id = 'answerHelper'
    modal.style.cssText = modalCss
    modal.innerHTML += "答题助手<br/>"
    document.body.appendChild(modal)

    function modalMessage(message) {
        modal.innerHTML += message.join(" ") + "<br/>"
        //modal.scrollTop = modal.scrollHeight
    }
    var count = 1
    //用户信息
    var token = JSON.parse(localStorage.getItem("userInfo")).token
    var tenantCode = localStorage.getItem("tenantCode")
    var examId = getUrlParameter("paperId")
    var answerArray = []

    // 发送GET请求并添加自定义请求头
    GM_xmlhttpRequest({
        method: "POST",
        url: 'https://txxt.tongxunjiaoyu.com/train/student-frontend/api//api/tmsQuestion/queryQuestionLimit', // 替换为你要请求的URL
        headers: {
            "Content-Type": "application/json;charset=UTF-8",
            "Token":"Bearer " + token, // 添加自定义请求头
            "tenant":tenantCode // 添加其他自定义请求头
        }, data: JSON.stringify({"paperId":603,"pageNum":1,"pageSize":999,"bankId":138}),
        onload: function(response) {
            answerArray =[]
            // 处理返回值
            // 解析JSON数据
            const data = JSON.parse(response.responseText);
            // 在控制台打印解析后的数据
            var questionList = data.data.records
            console.log(data.data)
            questionList.forEach((item,index) => {
                var qid = item.questionId
                 GM_xmlhttpRequest({
        method: "GET",
        url: 'https://txxt.tongxunjiaoyu.com/train/student-frontend/api//api/tmsQuestion/queryQuestionDetail?questionId='+qid, // 替换为你要请求的URL
        headers: {
            "Token":"Bearer " + token, // 添加自定义请求头
            "tenant":tenantCode // 添加其他自定义请求头
        },
                    onload: function(response) {
                        const qdata = JSON.parse(response.responseText);
                        var qitem = qdata.data
                            answerArray.push(index+1+':'+qitem.content)
                            answerArray.push('<br>')
                            answerArray.push("答:【"+ qitem.answer+"】")
                            answerArray.push('<br>')
                                 answerArray.push('选:'+qitem.questionOptionList.map(item => `${item.optionAnswer}：${item.optionDesc}`).join(', '))
                            answerArray.push('<br>')
                    }
                })


            })
                     // 延迟2秒执行后续代码
            setTimeout(() => { modalMessage(answerArray) }, 2000);

        },
        onerror: function(error) {
            // 处理错误
            console.error("Request failed:", error);
        }
    });


    function getUrlParameter(parameterName) {
        parameterName = parameterName.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + parameterName + '(=([^&#]*)|&|#|$)');
        var results = regex.exec(window.location);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

})();