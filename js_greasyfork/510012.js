// ==UserScript==
// @name         Jshw
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @license 
// @description  Extract homework questions and save them as .xlsx file format.
// @author       逝水年华
// @match        http://xuexi.jsou.cn/jxpt-web/student/newHomework/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.17.4/xlsx.full.min.js
// @downloadURL https://update.greasyfork.org/scripts/510012/Jshw.user.js
// @updateURL https://update.greasyfork.org/scripts/510012/Jshw.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 清理HTML标签及转码
    function sanitizeHTML(str) {
        if (!str) return "";
        return decodeHTMLEntities(str.replace(/<[^>]*>?/gm, ''));
    }

    // 处理多项选择题答案，删除 "<multi:dc>" 并合并成单个字符串
    function sanitizeAnswer(answer) {
        if (!answer) return "";
        return answer.replace(/＜multi:dc＞/gi, '').trim().toUpperCase(); // 删除特殊符号，格式化为大写
    }

    // 解析HTML实体
    function decodeHTMLEntities(str) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = str;
        return textarea.value;
    }

    // 解析题目内容并格式化
    function parseQuestion(question, parentTitle = "") {
        let options = question.options || [];

        // 如果是判断题，手动添加选项 A: 正确, B: 错误
        if (question.type === 7) { // type 7 是判断题
            options = [{ title: '正确' }, { title: '错误' }];
        }

        // 合并主标题和子标题，不添加空格和连字符
        const fullTitle = parentTitle ? `${sanitizeHTML(parentTitle)}${sanitizeHTML(question.title)}` : sanitizeHTML(question.title);

        // 处理答案，简答题答案中直接保留 <br> 标签，并去除多余的 &nbsp; 和 <p> 标签
        let answer = question.studentAnswer || "";
        if (question.type === 5) { // type 5 是简答题
            // 清理多余的 &nbsp; 和 <p> 标签，并保留 <br> 标签
            answer = answer.replace(/<p>/gi, '')  // 去除 <p> 标签
                .replace(/<\/p>/gi, '') // 去除 </p> 标签
                .replace(/&nbsp;/gi, '') // 去除 &nbsp;
                .replace(/<br\s*\/?>/gi, "<BR>") // 保留 <br> 标签
                + "<BR><BR>"; // 添加额外换行
        } else {
            answer = sanitizeAnswer(answer);
        }
        return {
            title: fullTitle,
            type: question.type,
            options: options.map(opt => sanitizeHTML(opt.title)),
            answer: answer, // 使用处理过的答案
            htmlType: getHtmlType(question.type)
        };
    }


    // 提取问题并处理类型和答案
    function extractQuestions() {
        var questions = [];
        try {
            if (window.homework && window.homework.questions) {
                window.homework.questions.forEach(function(question) {
                    // 对于非综合题，直接解析题目
                    if (question.type !== 9) {
                        questions.push(parseQuestion(question));
                    } else {
                        // 对于综合题，首先添加主问题，再处理每个子问题
                        questions.push(parseQuestion(question)); // 主题目

                        if (question.simpleQuestions) {
                            question.simpleQuestions.forEach(subQuestion => {
                                // 对子问题传递主标题
                                questions.push(parseQuestion(subQuestion, question.title));
                            });
                        }
                    }
                });
            } else {
                console.error("No question data found.");
            }
        } catch (error) {
            console.error("Error while extracting questions:", error);
        }
        return questions;
    }

    // 题型转换为中文描述
    function getHtmlType(type) {
        const types = {
            1: "单选题",
            2: "多选题",
            3: "填空题",
            5: "简答题",
            7: "判断题",
            8: "听力题",
            9: "综合题"
        };
        return types[type] || "未知题型";
    }

    // 保存提取问题到 Excel 文件
    function saveToExcel(questions) {
        try {
            var wb = XLSX.utils.book_new();
            var ws_data = [["标题", "题型", "选项1", "选项2", "选项3", "选项4", "答案"]];

            questions.forEach(function(question) {
                var row = [question.title, question.htmlType];
                // 添加选项，如果没有则留空
                if (question.options.length > 0) {
                    row.push(question.options[0] || "");
                    row.push(question.options[1] || "");
                    row.push(question.options[2] || "");
                    row.push(question.options[3] || "");
                } else {
                    row.push(""); // 非选择题没有选项
                    row.push("");
                    row.push("");
                    row.push("");
                }
                row.push(question.answer);
                ws_data.push(row);
            });

            var ws = XLSX.utils.aoa_to_sheet(ws_data);
            XLSX.utils.book_append_sheet(wb, ws, "Homework Questions");
            XLSX.writeFile(wb, "homework_questions.xlsx");
        } catch (error) {
            console.error("Error while saving to Excel:", error);
        }
    }

    // 创建按钮并绑定事件
    function createButton() {
        try {
            var button = document.createElement("button");
            button.innerHTML = "提取题目信息并保存";
            button.style.position = "fixed";
            button.style.top = "20px";
            button.style.left = "20px";
            button.style.zIndex = "9999";
            button.addEventListener("click", function() {
                var questions = extractQuestions();
                saveToExcel(questions);
            });
            document.body.appendChild(button);
        } catch (error) {
            console.error("Error while creating button:", error);
        }
    }

    window.addEventListener("load", function() {
        createButton();
    });
})();