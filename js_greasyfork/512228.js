// ==UserScript==
// @name         青书学堂作业自动化
// @namespace    http://tampermonkey.net/
// @author       ligoregress
// @version      1.0.2
// @description  青书学堂作业点击自动完成作业填写
// @match        https://*.qingshuxuetang.com/*/Student/ExercisePaper*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512228/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/512228/%E9%9D%92%E4%B9%A6%E5%AD%A6%E5%A0%82%E4%BD%9C%E4%B8%9A%E8%87%AA%E5%8A%A8%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const html = '<div id="start_answering" style="position: fixed; top: 50vh; right: 10px; background-color: aqua; padding: 5px 12px; color: #fff; z-index: 9999999; white-space: revert;"><div>开</div><div>始</div><div>答</div><div>题</div></div>';

    $('body').on('click', '#start_answering', function(){
        run();
    });

    // 获取学院
    function getSchool() {
        var path = new URL(location.href).pathname;
        var match = path.match(/^\/(.+)\/Student\/ExercisePaper$/);
        if (match && match[1]) {
            return match[1];
        } else {
            return "";
        }
    }

    // 获取quizId
    function getQuizId() {
        const url = location.href;
        const reg = /(\w+)=([^&]+)/g;
        let match;
        while ((match = reg.exec(url)) !== null) {
            if (match[1] == 'quizId') {
                return match[2];
            }
        }
        return "";
    }

    // 单选题
    function danxuan(question) {
        let id = question.questionId + "_" + question.solution;
        $("#" + id).click();
    }

    // 多选题
    function duoxuan(question) {
        let daan = question.solution.split("");
        $('input[type="checkbox"][name="'+question.questionId+'"]:checked').prop('checked', false);
        for (let i in daan) {
            let id = question.questionId + "_" + daan[i];
            let dom = $("#" + id);
            dom.parent().click();
        }
    }

    // 问答题
    function wenda(question, num) {
        CKEDITOR.instances["editor" + num].setData(question.solution);
        $("#cke_"+num+"_contents div").html(question.solution);
    }

    // 启动
    function run() {
        let quizId = getQuizId();
        if (quizId == "") {
            console.error("获取quizId参数失败");
            return;
        }
        let schoole = getSchool();
        if (schoole == "") {
            console.error("获取学院失败");
            return;
        }
        $.get(`https://degree.qingshuxuetang.com/${schoole}/Student/DetailData?quizId=${quizId}`, function(res) {
            if (res.message == "成功") {
                console.log("获取答案成功")
                let questions = res.data.paperDetail.questions;
                let wendaNum = 1;
                let hasOtherType = false;
                for (let i in questions) {
                    document.getElementById("group-item-" + questions[i].sequence).click();
                    console.log("第" + questions[i].sequence +"题 = " + questions[i].solution);
                    if (questions[i].typeId == 1 || questions[i].typeId == 6) {
                        danxuan(questions[i]);
                    } else if (questions[i].typeId == 2) {
                        duoxuan(questions[i]);
                    } else if (questions[i].typeId == 3 || questions[i].typeId == 8) {
                        wenda(questions[i], wendaNum++);
                    } else {
                        hasOtherType = true;
                    }
                }
                if (hasOtherType) {
                    alert("发现未知分类,答题失败,请手动查看控制台进行答题");
                } else {
                    alert("题已打完,请手动交卷");
                }
            } else {
                console.error("获取答案失败:" + res.message)
            }
        })
    }

    $(document).ready(function() {
        let check = setInterval(function() {
            if ($(".question-detail-container").length > 0 && $(".group_item").length > 0) {
                clearInterval(check);
                $("body").append(html);
            } else {
                console.log("等待页面加载中...");
            }
        }, 1000);
    });

})();