// ==UserScript==
// @name         UPC中国石油大学（华东）教务系统自动评教
// @version      0.1
// @description  适用于UPC中国石油大学（华东）教务系统（强智教务），自动打分，随机生成教学评价。
// @author       Ttowwa
// @match      *://jwxt.upc.edu.cn/jsxsd/xspj/*
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @namespace https://greasyfork.org/users/843119
// @downloadURL https://update.greasyfork.org/scripts/482570/UPC%E4%B8%AD%E5%9B%BD%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%EF%BC%88%E5%8D%8E%E4%B8%9C%EF%BC%89%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/482570/UPC%E4%B8%AD%E5%9B%BD%E7%9F%B3%E6%B2%B9%E5%A4%A7%E5%AD%A6%EF%BC%88%E5%8D%8E%E4%B8%9C%EF%BC%89%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    var now_url = window.location.href;
    var flag;
    var isEdit;
    var scoreRate = 0.2
    if(now_url.indexOf("xspj_list.do")!=-1)
    {
        alert("使用说明：进入评价后点击评价即可自动提交。Author: Ttowwa 2023");
    }
    window.onload = function auto_click_manyi(){
        if(now_url.indexOf("xspj_edit.do")!=-1)
        {
            isEdit = document.getElementById("tj");
            if(isEdit!=null)
            {
                document.getElementById("pj0601id_1_"+(Math.random()>scoreRate?"1":"2")).click();
                document.getElementById("pj0601id_2_"+(Math.random()>scoreRate?"1":"2")).click();
                document.getElementById("pj0601id_3_"+(Math.random()>scoreRate?"1":"2")).click();
                document.getElementById("pj0601id_4_"+(Math.random()>scoreRate?"1":"2")).click();
                document.getElementById("pj0601id_5_"+(Math.random()>scoreRate?"1":"2")).click();
                document.getElementById("pj0601id_6_"+(Math.random()>scoreRate?"1":"2")).click();
                document.getElementById("pj0601id_7_"+(Math.random()>scoreRate?"1":"2")).click();
                document.getElementById("pj0601id_8_"+(Math.random()>scoreRate?"1":"2")).click();
                if(document.getElementById("pj0601id_9_1")!=null) document.getElementById("pj0601id_9_"+(Math.random()>scoreRate?"1":"2")).click();
                if(document.getElementById("pj0601id_10_1")!=null) document.getElementById("pj0601id_10_"+(Math.random()>scoreRate?"1":"2")).click();

                document.getElementById("pjbfb").value = Math.random()>0.5?"98":"97";
                var suggestions = [
                    "课堂气氛活跃，引导学生积极参与。",
                    "教学内容丰富，理论与实践相结合。",
                    "对学生的问题耐心解答，鼓励学生提问。",
                    "教学方法新颖，能吸引学生的注意力。",
                    "作业布置得当，有助于巩固课堂知识。",
                    "对学生的表现给予及时反馈，有助于学生的进步。",
                    "教学进度适中，既不快也不慢。",
                    "课堂上能充分调动学生的积极性。",
                    "对学生的学习情况有深入的了解。",
                    "能根据学生的学习情况灵活调整教学计划。",
                    "课堂上的互动环节设计得很好。",
                    "对学生的表扬和批评都很中肯。",
                    "能激发学生的学习兴趣。",
                    "对待学生公正无私，给学生以公平的评价。",
                    "教学态度认真，对待学生友善。",
                    "对教学内容有深入的理解和掌握。",
                    "能用生动的语言讲解复杂的概念。",
                    "对学生的学习困难给予及时的帮助。",
                    "能用实例来解释抽象的理论。",
                    "课堂上的教学活动设计得有趣而富有挑战性。",
                    "对学生的学习成绩给予充分的肯定。",
                    "能激发学生的创新思维。",
                    "教学材料准备充分，有助于学生的理解。",
                    "能引导学生进行自主学习。",
                    "对学生的学习进步给予充分的鼓励。",
                    "能用生动的案例来解释理论知识。",
                    "对学生的学习困难给予耐心的指导。",
                    "能引导学生进行批判性思考。",
                    "对学生的学习成绩给予公正的评价。",
                    "能激发学生的学习热情。",
                    "对待学生尊重，能理解学生的需求。",
                    "能引导学生进行团队合作。",
                    "对学生的学习进步给予充分的肯定。",
                    "能引导学生进行自我评价。",
                    "对学生的学习困难给予及时的帮助。",
                    "能引导学生进行深度学习。",
                    "对学生的学习成绩给予公正的评价。",
                    "能激发学生的学习兴趣。",
                    "对待学生尊重，能理解学生的需求。",
                    "能引导学生进行团队合作。",
                    "对学生的学习进步给予充分的肯定。",
                    "能引导学生进行自我评价。",
                    "对学生的学习困难给予及时的帮助。",
                    "能引导学生进行深度学习。",
                    "对学生的学习成绩给予公正的评价。",
                    "能激发学生的学习兴趣。",
                    "对待学生尊重，能理解学生的需求。",
                    "能引导学生进行团队合作。",
                    "对学生的学习进步给予充分的肯定。",
                    "能引导学生进行自我评价。"
                ];

                let randomSuggestions = [];
                for (let i = 0; i < Math.floor(Math.random() * 2) + 2; i++) {
                    let randomIndex = Math.floor(Math.random() * suggestions.length);
                    randomSuggestions.push(suggestions[randomIndex]);
                    suggestions.splice(randomIndex, 1);
                }
                document.getElementById("jynr").value = randomSuggestions.join(' ');
                document.getElementById("issubmit").value = "1";
                document.getElementById("Form1").submit();
            }
        }
    }})();