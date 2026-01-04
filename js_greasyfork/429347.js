// ==UserScript==
// @name         AHNU平均绩点查看
// @namespace    3hex
// @version      0.1.5
// @description  安徽师范大学-教务网-培养方案完成情况-查看平均绩点
// @author       3hex
// @match        http://jw.ahnu.edu.cn/student/for-std/program-completion-preview/info*
// @match        https://jw.ahnu.edu.cn/student/for-std/program-completion-preview/info*
// @icon         http://t12.baidu.com/it/u=516966630,3245333137&fm=179&app=42&f=JPEG?w=120&h=120&s=8020FC16729173F55B8109840300B060
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @require https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/429347/AHNU%E5%B9%B3%E5%9D%87%E7%BB%A9%E7%82%B9%E6%9F%A5%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/429347/AHNU%E5%B9%B3%E5%9D%87%E7%BB%A9%E7%82%B9%E6%9F%A5%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0;
    var score_sum = 0;
    var grade_sum = 0;
    var all_5 = 0;
    var all_4 = 0;
    var all_3 = 0;
    var all_2 = 0;
    var gpa_class = new Array();
    var res = "";
    var class_info = new Array("A","A-","B+","B","B-","C+","C","C-","D","F");
    var info = $('.table-field tbody tr');

    for(i=0;i<10;i++){
      gpa_class[i] = 0;
    }

    for(i=0;i<info.length;i++){
        if($($(info[i]).children()[7]).text() == "通过"){
            //console.log($($(info[i]).children()[0]).text());
            score_sum += parseFloat($($(info[i]).children()[4]).text());
            grade_sum += parseFloat($($(info[i]).children()[4]).text() * $($(info[i]).children()[6]).text());

            res = calc(parseInt($($(info[i]).children()[5]).text()));
            res = $($(info[i]).children()[5]).text() + "("+res + ")";
            $($(info[i]).children()[5]).text(res);

            //console.log(parseFloat($($(info[i]).children()[4]).text()), parseFloat($($(info[i]).children()[6]).text()));
            switch(parseInt($($(info[i]).children()[6]).text())){
                case 5: $($(info[i]).children()[6]).css("background-color","darkgreen").css("color","#fff");  all_5++; break;
                case 4: $($(info[i]).children()[6]).css("background-color","green").css("color","#fff");  all_4++;  break;
                case 3: $($(info[i]).children()[6]).css("background-color","mediumseagreen").css("color","#fff");   all_3++; break;
                case 2: $($(info[i]).children()[6]).css("background-color","mediumaquamarine").css("color","#fff");  all_2++;  break;
                default: $($(info[i]).children()[6]).css("background-color","red").css("color","#fff");   break; break;
            }
            $($(info[i]).children()[0]).css("background-color","palegreen");
        }else{
            $($(info[i]).children()[0]).css("background-color","navajowhite");
        }
    }

    console.log("不统计计划外：",score_sum.toFixed(2), grade_sum.toFixed(2), (grade_sum/score_sum).toFixed(2));

    var txt=$("<p style='color:black;font-size:20px;' title='GPA=∑课程学分绩点　÷　∑课程学分\n绩点采用5分制度：（成绩-60）/10+1.0'></p>").text("1.平均绩点（不统计计划外）：" + (grade_sum/score_sum).toFixed(2));
    $(".course-modules").append(txt);

    info = $('.outer-course-table tbody tr');
    for(i=0;i<info.length;i++){
        if($($(info[i]).children()[7]).text() == "通过"){
            //console.log($($(info[i]).children()[0]).text());
            score_sum += parseFloat($($(info[i]).children()[4]).text());
            grade_sum += parseFloat($($(info[i]).children()[4]).text() * $($(info[i]).children()[6]).text());

            res = calc(parseInt($($(info[i]).children()[5]).text()));
            res = $($(info[i]).children()[5]).text() + "("+res + ")";
            $($(info[i]).children()[5]).text(res);

            switch(parseInt($($(info[i]).children()[6]).text())){
                case 5: $($(info[i]).children()[6]).css("background-color","darkgreen");  break;
                case 4: $($(info[i]).children()[6]).css("background-color","green");  break;
                case 3: $($(info[i]).children()[6]).css("background-color","lime");  break;
                case 2: $($(info[i]).children()[6]).css("background-color","Orange");  break;
                default: $($(info[i]).children()[6]).css("background-color","red");  break; break;
            }
            $($(info[i]).children()[0]).css("background-color","palegreen");
        }else{
            $($(info[i]).children()[0]).css("background-color","navajowhite");
        }
    }
   console.log("：",score_sum.toFixed(2), grade_sum.toFixed(2), (grade_sum/score_sum).toFixed(2));

    txt=$("<p style='color:black;font-size:20px;' title='GPA=∑课程学分绩点　÷　∑课程学分\n绩点采用5分制度：（成绩-60）/10+1.0'></p>").text("2.平均绩点（统计计划外）：" + (grade_sum/score_sum).toFixed(2));
    $(".course-modules").append(txt);

    res = "";
    for(i=0;i<10;i++){
      if(gpa_class[i]!=0){
         res += class_info[i] + "("+ gpa_class[i] +")  ";
      }
    }
    txt=$("<span style='color:black;font-size:20px;' title='成绩 等级\n 90-100 A \n 85-89 A- \n 82-84 B+ \n 78-81 B \n 75-77 B- \n 71-74 C+ \n 66-70 C \n 62-65 C- \n 60-61 D \n 补考60 D- \n 60以下 F'></span>").text("3.成绩等级汇总(全部)："+res);
    $(".course-modules").append(txt);

    function calc(grade){
        if(grade>=90&&grade<=100) {
            gpa_class[0] += 1;
            return "A";
        }
        else if(grade>=85&&grade<=89) {
            gpa_class[1] += 1;
            return "A-";
        }
        else if(grade>=82&&grade<=84) {
            gpa_class[2] += 1;
            return "B+";
        }
        else if(grade>=78&&grade<=81) {
            gpa_class[3] += 1;
            return "B";
        }
        else if(grade>=75&&grade<=77) {
            gpa_class[4] += 1;
            return "B-";
        }
        else if(grade>=71&&grade<=74) {
            gpa_class[5] += 1;
            return "C+";
        }
        else if(grade>=66&&grade<=70) {
            gpa_class[6] += 1;
            return "C";
        }
        else if(grade>=62&&grade<=65) {
            gpa_class[7] += 1;
            return "C-";
        }
        else if(grade>=60&&grade<=61) {
            gpa_class[8] += 1;
            return "D";
        }
        else if(grade>=0&&grade<=60) {
            gpa_class[9] += 1;
            return "F";
        }
    }
})();