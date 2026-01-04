// ==UserScript==
// @name         方正教务系统评价
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  方正教务系统自动评价
// @author       yydny
// @match        http://jwgl.cdnu.edu.cn/xs_main.aspx?xh=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461080/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E4%BB%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/461080/%E6%96%B9%E6%AD%A3%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%AF%84%E4%BB%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

var answer_id = ["DataGrid1_JS1_", "DataGrid1_JS2_"];
var pj_value = ["对待教学认真负责，语言生动，条理清晰，举例充分恰当。",
    "老师授课的方式非常适合我们，他根据本课程知识结构的特点，重点突出，层次分明。",
    "老师讲课十分认真投入，条理性很强，而且特别善于举例，让同学理论联系实际，学习起来十分轻松。",
    "老师授课认真，细致，能充分利用时间，对重点知识的讲解十分清晰易懂，使同学们对知识易与理解。",
    "老师治学严谨，对学生严格要求。课堂中，他循循善诱，强调独立思考，引导学生进行启发是思维。"];
var op_value = ["优秀", "良好", "一般"];
var iframe;
var d_structure;
var row_num;
var col_num;
var sub_num;

iframe = window.top.document.getElementById('iframeautoheight').contentWindow;

var get_message = setInterval(() => {
    while (iframe.document.querySelector('#pjxx') != null) {
        d_structure = iframe.document.querySelectorAll("tbody").length;
        row_num = iframe.document.querySelectorAll("tbody")[1].children.length - 1;
        col_num = iframe.document.querySelectorAll("tbody")[1].children[0].children.length;
        sub_num = iframe.document.getElementById('pjkc').children.length - 1;
        clearInterval(get_message);
        break;
    }
}, 2000);


var interval = setInterval(() => {
    if (iframe.document.getElementById('pjkc')[sub_num].selected && iframe.document.getElementById("pjxx").value != '') {
        clearInterval(interval);
    } else {
        try {
            if (col_num > 4) {
                w_answer(answer_id[0]);
                w_answer(answer_id[1]);
            } else {
                w_answer(answer_id[0]);
            }
            var index = Math.floor(Math.random() * 4);
            console.log("填写成功");
        } catch (error) {
            console.log("网页结构可能已经改变");
        }
    }
}, 1000);


function w_answer(name) {
    for (var i = 0; i < row_num; i++) {
        var answer_tag = name + i;
        var selectName = iframe.document.getElementById(answer_tag);
        var index = Math.floor(Math.random() * 2);
        selectName.value = op_value[index];
    }
    if (iframe.document.getElementById("dgPjc_jc1_0")) {
        iframe.document.getElementById("dgPjc_jc1_0").value = "优秀";
    } else {
        console.log("无教材评价")
    }
    iframe.document.getElementById("pjxx").value = pj_value[index];
    is_LAnswer();
}


function is_LAnswer() {
    var Ans_num = iframe.document.querySelector('#pjkc').children.length;
    if (iframe.document.querySelector('#pjkc').children[Ans_num - 1].selected) {
        iframe.document.getElementById("Button1").disabled = false
        iframe.document.getElementById("Button1").click();
        iframe.document.querySelector('#Button2').click();
    } else {
        iframe.document.getElementById("Button1").disabled = false
        iframe.document.getElementById("Button1").click();
    }
}
})();