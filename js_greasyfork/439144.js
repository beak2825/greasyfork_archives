// ==UserScript==
// @name         gdysxh_com_exam_list
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  药师培训_远程协会_考试系统_答案提示
// @author       You
// @match        https://www.gdysxh.com/my_classes/exam/exam_list/*
// @icon         https://www.google.com/s2/favicons?domain=gdysxh.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/439144/gdysxh_com_exam_list.user.js
// @updateURL https://update.greasyfork.org/scripts/439144/gdysxh_com_exam_list.meta.js
// ==/UserScript==

/*
* 插入题目要求，插入的题目可以允许有空格和换行，和中英文逗号、冒号和括号区别，但是标点符号和文字部分要一一对应
* */
var answerItems = [{
    'title': '测试title',
    'answer': ['测试']
}, {
    'title': '常见药物治疗相关问题描述错误的是( )',
    'answer': ['测试2']
}];
window.onload = (function () {
    function format_of_my(str) {
        //此部分替换函数可根据需求，依据案例添加替换字符
        str = str.replace(/\s/g, "").replace(/[\r\n]/g, "");
        str = str.replace("）", ")");
        str = str.replace("（", "(");
        str = str.replace("：", ":");
        str = str.replace("，", ",");
        return str;
    }

    function search_ans(ques_text) {
        for (const answerItem of answerItems) {
            let title_text = format_of_my(answerItem.title);
            if (format_of_my(ques_text) === title_text) {
                return answerItem.answer;
            }
        }
        return '没找到这个题目'
    }


    function insert_tips() {
        let question_list = $(".swiper-slide .qes_title")
        for (let i = 0; i < question_list.length; i++) {
            let ques_text = $(question_list[i]).text();
            ques_text = format_of_my(ques_text)
            ques_text = ques_text.replace(":", ">>");//替换第一个冒号，用于差分题号和题目内容
            ques_text = ques_text.split(">>").pop()
            let ques_ans = search_ans(ques_text);
            let par_ent = $(question_list[i]).parent();
            let ans_box = '<div style="margin: 30px;color: darkgreen;display: block;width: 90%;height: auto;font-size: 18px;">'
                + ques_text +
                '<br><span>提示：' + ques_ans + '</span>'
            '</div>';
            $(par_ent).append(ans_box);
        }
    }

    insert_tips();
})();