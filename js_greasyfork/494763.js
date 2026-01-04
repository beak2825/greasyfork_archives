// ==UserScript==
// @name         芯位教育自动展示答案
// @namespace    https://github.com/Hu-xiaojiao/xinwei-getAnswer
// @version      2024-05-13
// @description  这是一个能够自动获取芯位平台作业答案的脚本
// @author       Huxiaojiao233
// @match        https://www.51xinwei.com/student/
// @icon         https://www.51xinwei.com/student/logo.svg
// @run-at       document-stop
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/494763/%E8%8A%AF%E4%BD%8D%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%B1%95%E7%A4%BA%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/494763/%E8%8A%AF%E4%BD%8D%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%B1%95%E7%A4%BA%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==



$("body").append(`<div id='questions' style='left: 10px;
    bottom: 10px;
    background: #1a59b7;
    color:#ffffff;
    overflow: hidden;
    z-index: 9999;
    position: fixed;
    padding:5px;
    text-align:left;
    width: 175px;
    height: auto;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;'>本考核点的答案如下：
    </div>`); // 悬浮窗

const target_div = document.getElementById("questions");

(function (open) {
    XMLHttpRequest.prototype.open = function (XMLHttpRequest) {
        var self = this;
        this.addEventListener("readystatechange", function () {
            if (this.responseText.length > 0 &&
                this.readyState == 4 &&
                this.responseURL.indexOf('www.51xinwei.com/api/learning-service') >= 0) { // 芯位教育接口
                self.response = 'updated value'

                console.log(self.responseURL);
                if (self.responseURL == 'https://www.51xinwei.com/api/learning-service/admin/studentHomeWork/getHomeworkList') {
                    target_div.innerHTML = '本考核点的答案如下：'
                }

                var jsonResponse = JSON.parse(self.responseText);
                var question_json = jsonResponse.data
                if (!question_json.questionAndAnswerList) {
                    var question_array = question_json.homeworkTopicList
                } else {
                    var question_array = question_json.questionAndAnswerList
                }
                for (var i = 0; i < question_array.length; i++) {
                    var a = question_array[i].topicType
                    var question_answer = [];
                    for (var j = 0; j < question_array[i].topicQuestionCoreDtoList.length; j++) {
                        if (question_array[i].topicQuestionCoreDtoList[j].isAnswer) {
                            question_answer.push(question_array[i].topicQuestionCoreDtoList[j].index)
                        }
                    }
                    target_div.innerHTML = `${target_div.innerHTML}<br>第${question_array[i].topicOrder}题：${question_answer}`
                }
            }
        }, false);
        open.apply(this, arguments);
    };
})(XMLHttpRequest.prototype.open);