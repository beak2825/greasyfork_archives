// ==UserScript==
// @name         问卷星自动答题脚本
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  自动填写问卷星考试题目，需要事先准备好题库Excel文件。
// @author       YaphetS
// @match        *://kaoshi.wjx.top/vm/*
// @match        *://ks.wjx.top/vm/*
// @match        *://ks.wjx.com/vm/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://code.jquery.com/jquery-3.x-git.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js
// @grant        none
// @license      仅供内部考试使用
// @downloadURL https://update.greasyfork.org/scripts/477516/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/477516/%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log("脚本运行中...");

    // 动态加载XLSX库
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.src = "https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js";
    $("html").append(script);

    // 添加按钮和文件输入框
    $("body").append("<button id='uploadExecl' style='position:absolute;top:0;left:0;z-index:999'>上传题库文件</button>");
    $("body").append("<input type='file' id='inputExcl' style='display:none'></input>");
    $("body").append("<button id='startAnswer' style='position:absolute;top:0;left:100px;z-index:999'>开始答题</button>");
    $("body").append("<button id='submitAnswer' style='position:absolute;top:0;left:200px;z-index:999'>提交答案</button>");

    // 点击上传按钮触发文件选择
    $("#uploadExecl").click(() => {
        $("#inputExcl").trigger("click");
    });

    // 点击提交答案按钮
    $("#submitAnswer").click(() => {
        $("#ctlNext").click(); // 触发提交按钮点击事件
        console.log("已点击提交按钮");
    });

    var workbook;
    var requestdata = [];

    // 监听文件选择变化事件
    $("#inputExcl").change((e) => {
        var files = e.target.files;
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            try {
                var data = e.target.result;
                workbook = XLSX.read(data, { type: "binary" });
                requestdata = XLSX.utils.sheet_to_json(workbook.Sheets["Sheet1"]); // 修改为正确的Sheet名称
            } catch (e) {
                alert("文件类型不正确或解析错误");
                console.error("文件解析错误：", e);
                return;
            }
            console.log("题库数据：", requestdata);
        };
        fileReader.readAsBinaryString(files[0]);
    });

    // 点击开始答题按钮触发自动答题
    $("#startAnswer").click(() => {
        if (requestdata.length === 0) {
            alert("请先上传题库文件");
            return;
        }

        $(".field").each((index, item) => {
            var questionNumber = parseInt($(item).find('.topicnumber').text().trim()); // 获取题目序号
            console.log(`处理题目${questionNumber}`);

            if (questionNumber >= 1 && questionNumber <= 22) {
                singleChoose(item, questionNumber);
            } else if (questionNumber >= 23 && questionNumber <= 42) {
                multiChoose(item, questionNumber);
            } else if (questionNumber >= 43 && questionNumber <= 52) {
                trueFalse(item, questionNumber);
            } else if (questionNumber >= 53 && questionNumber <= 60) {
                fillInFillBlanks(item, questionNumber);
            }
        });
    });

    // 单选题处理函数
    function singleChoose(item, questionNumber) {
        var questionText = $(item).find('.topichtml').text().trim().replace(/^\d+、/, ''); // 获取题目文本
        var answer = findAnswerByTextAndType(questionText, '单选题');
        console.log(`题目${questionNumber} ${questionText}`);

        if (answer) {
            var correctAnswer = String(answer["正确答案"]).trim(); // 获取正确答案并强制转换为字符串格式
            var options = ["A", "B", "C", "D", "E"];

            for (let i = 0; i < options.length; i++) {
                var value = options[i];
                if (correctAnswer === value || correctAnswer === value + "、") {
                    $(item).find(".label").eq(i).click(); // 触发点击事件
                    console.log('正确答案：' + correctAnswer);
                    break;
                }
            }
        } else {
            //console.log('未找到匹配的答案：' + questionText);
        }
    }

    // 多选题处理函数
    function multiChoose(item, questionNumber) {
        var questionText = $(item).find('.topichtml').text().trim().replace('【多选题】','').replace(/^\d+、/, ''); // 获取题目文本
        var answer = findAnswerByTextAndType(questionText, '多选题');
        console.log(`题目${questionNumber} ${questionText}`);

        if (answer) {
            var correctAnswer = String(answer["正确答案"]).trim(); // 获取正确答案并强制转换为字符串格式
            var options = ["A", "B", "C", "D", "E"];
            var correctOptions = correctAnswer.split(""); // 将正确答案拆分为选项数组

            for (let i = 0; i < options.length; i++) {
                var value = options[i];
                if (correctOptions.includes(value)) {
                    $(item).find(".label").eq(i).click(); // 触发点击事件
                }
            }
            console.log('正确答案：' + correctAnswer);
        } else {
            //console.log('未找到匹配的答案：' + questionText);
        }
    }

    // 判断题处理函数
    function trueFalse(item, questionNumber) {
        var questionText = $(item).find('.topichtml').text().trim().replace(/^\d+、/, ''); // 获取题目文本
        var answer = findAnswerByTextAndType(questionText, '判断题');
        console.log(`题目${questionNumber} ${questionText}`);

        if (answer) {
            var correctAnswer = String(answer["正确答案"]).trim(); // 获取正确答案并强制转换为字符串格式

            if (correctAnswer === "A") {
                $(item).find(".label[dit='%e5%af%b9']").click(); // 选择“对”
            } else if (correctAnswer === "B") {
                $(item).find(".label[dit='%e9%94%99']").click(); // 选择“错”
            }
            console.log('正确答案：' + correctAnswer);
        } else {
            //console.log('未找到匹配的答案：' + questionText);
        }
    }

    // 填空题处理函数
    function fillInFillBlanks(item, questionNumber) {
        var questionText = $(item).find('.topictext').text().trim().replace('。','').replace('*','').replace(/^\d+、/, ''); // 获取题目文本
        console.log(`题目${questionNumber} ${questionText}`);

        var answer = findAnswerByTextAndType(questionText, '填空题');
        if (answer) {
            var fillAnswer = String(answer["正确答案"]).trim(); // 获取正确答案并强制转换为字符串格式

            // 获取填空题的所有可编辑文本区域
            var editableFields = $(item).find('.textCont[contenteditable="true"]');
            if (editableFields.length > 0) {
                // 如果存在多个可编辑区域，按竖线分隔的答案填入各个区域
                var fillAnswers = fillAnswer.split('、');
                editableFields.each(function(index) {
                    if (index < fillAnswers.length) {
                        $(this).text(fillAnswers[index]); // 填写文本内容

                        // 触发输入事件
                        var inputEvent = new InputEvent('input', {
                            bubbles: true,
                            cancelable: true,
                        });
                        this.dispatchEvent(inputEvent);
                    }
                });
            } else {
                console.log('未找到可编辑的填空区域');
            }

            console.log('正确答案：' + fillAnswer);
        } else {
            //console.log('未找到匹配的答案：' + questionText);
        }
    }

    // 根据题目文本和类型查找答案
    function findAnswerByTextAndType(text, type) {
        console.log(`寻找类型为${type}的题目：${text}`);
        for (let i = 0; i < requestdata.length; i++) {
            if (requestdata[i]["题目类型"] === type && requestdata[i]["题目"].includes(text)) {
                return requestdata[i];
            }
        }
        return null;
    }
})();
