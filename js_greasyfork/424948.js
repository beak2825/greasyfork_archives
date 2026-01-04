// ==UserScript==
// @name         哈尔滨工程大学成绩查询Pro_test
// @namespace    Devour
// @version      4.1
// @description  кто знает,кто знает.
// @author       Devour
// @match        *://*.edu.cn/*
// @match        https://edusys.wvpn.hrbeu.edu.cn/jsxsd/kscj/cjcx_list
// @match        https://edusys.wvpn.hrbeu.edu.cn/*
// @match        http://edusys.hrbeu.edu.cn/jsxsd/kscj/cjcx_list
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/424948/%E5%93%88%E5%B0%94%E6%BB%A8%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2Pro_test.user.js
// @updateURL https://update.greasyfork.org/scripts/424948/%E5%93%88%E5%B0%94%E6%BB%A8%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6%E6%88%90%E7%BB%A9%E6%9F%A5%E8%AF%A2Pro_test.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var no_border_table_class = document.querySelector("#kscjQueryForm > table > tbody");
    var pjxt_url = "http://pjcs.hrbeu.edu.cn/static/html/main/mycollege/index.html";
    if (no_border_table_class != undefined) {
        var button_teacher_comment_html = document.createElement("tr");
        button_teacher_comment_html.innerHTML = "<td colspan='3' align='center'><input type='button' value='前往评教' style='width:60px;height:30px;color:#FF6666;background:#FFCCCC' onclick='window.location.href=\""+pjxt_url+"\"' class='button'></td>";
        no_border_table_class.appendChild(button_teacher_comment_html);
    }
    if (window.location.href == pjxt_url) {
        var script_section = document.createElement("script");
        script_section.innerHTML = 'setInterval("aaaa();",1000);function aaaa(){var li_list = document.getElementsByTagName("li");\
                                    if(li_list.length != 0){\
                                        li_list[0].click()\
                                    }else{\
                                        window.location.href="https://edusys.wvpn.hrbeu.edu.cn/jsxsd/kscj/cjcx_list";\
                                    }}';
        document.querySelector("body").appendChild(script_section);
    } else if (window.location.href.indexOf("teaching/course_evaluate_l.html?") != -1) {
        var script_section_pj_run = document.createElement("script");
        script_section_pj_run.innerHTML = 'setInterval("aaaa();",1000);function aaaa(){var data_comment = ["老师在教室上教得东西我当时就能记住，老师举例生动形象，老师能够锻炼我们举一反三的能力。",\
                                            "整堂课思路清晰，环节紧凑，重难点突出，设计合理。学生的课堂习惯非常好，每个人都能积极的参与到课堂中，课堂效果较好。",\
                                            "学生们上课的积极性和参与率极高，特别是老师能抓住儿童的心理特点，创设一定的情境。老师并提供了丰富的内容，在整个教学过程中给予了学生比较充分的自主探究机会，让学生在活动中学习、提升。",\
                                            "老师能从学生特点出发，让学生在玩活动过程中探究新知识、理解新知，人整体上来看，效果确实不错，值得学习。",\
                                            "感谢老师谆谆教诲，老师的课堂活泼有趣，同学们听的津津有味，老师常引人入胜，我们总是身临其境。",\
                                            "老师与同学们互动，使课堂效率达到高点。老师还平易近人，总是和同学们一起讨论难问题，谢谢老师的教诲。"];\
                                        var data_list = document.getElementsByClassName("mui-input-row mui-radio mui-left");\
                                        for (var i = 0; i < data_list.length; i++) {\
                                            if (data_list[i].innerText == \'非常满意\') {\
                                                data_list[i].getElementsByTagName("input")[0].setAttribute("checked", "checked")\
                                            }\
                                        }\
                                        document.getElementsByTagName("textarea")[0].value = data_comment[Math.round(Math.random() * 10) % 6];\
                                        validate();\
                                        window.location.href = "http://pjcs.hrbeu.edu.cn/static/html/main/mycollege/index.html";}';
        document.querySelector("body").appendChild(script_section_pj_run);
    }

    if(window.location.href.indexOf("/jsxsd/kscj/cjcx_list") != -1){
        if (document.getElementById("dataList").rows[1].cells[0].innerText == "未查询到数据") {
            alert("未查询到数据!!");
            return 0;
        }
        function Add_th(th_HTML, width = 120) {
            let var_th = document.createElement("th");
            var_th.innerHTML = th_HTML;
            var_th.setAttribute("class", "Nsb_r_list_thb");
            var_th.setAttribute("style", "width: " + width.toString() + "px;");
            document.getElementById("dataList").rows[0].appendChild(var_th);
        }
        function PC_Credit_Calc(CourseType, Credit) {
            if (document.getElementById("Top1_divLoginName").innerHTML.split("(")[1].split(")")[0].substring(0, 4) < 2019) {
                switch (CourseType) {
                    case "中外历史与文化": PC_A_Credit += Credit; break;
                    case "语言与文学": PC_B_Credit += Credit; break;
                    case "哲学人生与社会科学": PC_C_Credit += Credit; break;
                    case "艺术修养与审美": PC_D_Credit += Credit; break;
                    case "自然科学与人类文明": PC_E_Credit += Credit; break;
                    case "国防文化与船海史话": PC_F_Credit += Credit; break;
                    case "中华传统文化": PC_G_Credit += Credit; break;
                    case "新生研讨类": PCCategory_2 += Credit; break;
                    case "专业拓展类": PCCategory_3 += Credit; break;
                    case "创新创业类": PCCategory_4 += Credit; break;
                }
            } else {
                if (Course_name_2019[CourseType] == undefined) {
                    Course_name_2019[CourseType] = Credit;
                    console.log(Course_name_2019[CourseType]);
                } else {
                    Course_name_2019[CourseType] += Credit;
                    console.log(Course_name_2019[CourseType]);
                }

            }
        }

        function AVG_Grade_Color_Control(let_grade) {
            if (let_grade < 60) return "#E6E6FA";
            else if (let_grade < 70) return "#00AA00";
            else if (let_grade < 80) return "#BB5500";
            else if (let_grade < 85) return "#FF0088";
            else if (let_grade < 90) return "#FF0000";
            else if (let_grade < 95) return "#B22222";
            else return "#880000";
        }

        function Grade_Detail_Color_control(let_grade) {
            let result = new Array(2);
            if (let_grade < 60 || let_grade == '不及格') {
                result[0] = "#880000";
                result[1] = "┗( T﹏T )┛";
            } else if (let_grade < 70 || let_grade == '及格') {
                result[0] = "#66DD00";
                result[1] = "…(⊙_⊙;)…";
            } else if (let_grade < 80 || let_grade == '中等') {
                result[0] = "#CC6600";
                result[1] = "(=￣ω￣=)";
            } else if (let_grade < 90 || let_grade == '良好') {
                result[0] = "#00DDDD";
                result[1] = "(●'◡'●)";
            } else {
                result[0] = "#FF359A";
                result[1] = "(✿◕‿◕✿)";
            }
            return result;
        }

        function div_create_parent(width, height) {
            var divOB = "<div id='StudentInfo' ";
            divOB += "style='left: 5px;";
            divOB += "bottom: 50px;";
            divOB += "background: #FFB6C1;";
            divOB += "overflow: hidden;";
            divOB += "z-index: 9999;";
            divOB += "position: fixed;";
            divOB += "padding:5px;";
            divOB += "text-align:center;";
            divOB += "width: " + width + "px;";
            divOB += "height: " + height + "px;";
            divOB += "border-bottom-left-radius: 4px;";
            divOB += "border-bottom-right-radius: 4px;";
            divOB += "border-top-left-radius: 4px;";
            divOB += "border-top-right-radius: 4px;";
            divOB += "'> </div>";
            $("body").append(divOB);

            let var_add_br = document.createElement('br');
            document.getElementById("StudentInfo").appendChild(var_add_br);

            let button_credit_func = document.createElement("input");
            button_credit_func.setAttribute("type", "button");
            button_credit_func.setAttribute("value", "统计学分");
            button_credit_func.setAttribute("onclick", "Count_Credit_GradeAVG()");
            document.getElementById("StudentInfo").appendChild(button_credit_func);

            document.getElementById("StudentInfo").appendChild(var_add_br);
            document.getElementById("StudentInfo").appendChild(var_add_br);

            let Checkbox_group_setting = document.createElement("p");
            Checkbox_group_setting.innerHTML = '必修:<input id="checkbox_bx" name="all_checkbox" type="checkbox" checked="checked">\
                专选:<input id="checkbox_zx" name="all_checkbox" type="checkbox" checked="checked">\
                公选:<input id="checkbox_gx" name="all_checkbox" type="checkbox" ">\
                挂科:<input id="checkbox_np" name="all_checkbox" type="checkbox" ">\
                自主考试:<input id="checkbox_zz" name="all_checkbox" type="checkbox" "><br>\
                自由选择:<input id="checkbox_free" name="free_checkbox" type="checkbox" ">\
                ';
            Checkbox_group_setting.style.fontSize = "125%";
            document.getElementById("StudentInfo").appendChild(Checkbox_group_setting);

            var Grade_Avg = document.createElement("p");
            let Grade_Avg_color = AVG_Grade_Color_Control(GradeAvg);
            Grade_Avg.innerHTML = "平均分：<strong style='color:" + Grade_Avg_color + "'>" + GradeAvg.toString() + "</strong>";
            Grade_Avg.setAttribute("id", "Grade_AVG");
            Grade_Avg.style.fontSize = "150%";
            document.getElementById("StudentInfo").appendChild(Grade_Avg);

            var ECC = document.createElement("p");
            ECC.innerHTML = "专业选修课已修：" + ElectiveCourseCredit.toString() + "分";
            ECC.style.fontSize = "150%";
            document.getElementById("StudentInfo").appendChild(ECC);

        }
        function student_level_2018_detail() {
            var Graph = document.getElementById("StudentInfo");

            var GEC = document.createElement("p");
            GEC.innerHTML = "通识教育选修课程已修：" + GeneralEducationCredit.toString() + "分<br>其中：";
            GEC.style.fontSize = "150%";
            Graph.appendChild(GEC);

            var GEC_D = document.createElement("p");
            GEC_D.innerHTML += "新生研讨类已修：" + PCCategory_2.toString() + "分";
            GEC_D.innerHTML += "<br>专业拓展类已修：" + PCCategory_3.toString() + "分";
            GEC_D.innerHTML += "<br>创新创业类已修：" + PCCategory_4.toString() + "分";
            GEC_D.innerHTML += "<br>文化素质教育类已修：" + PCCategory_1.toString() + "分<br>其中：";
            GEC_D.style.fontSize = "120%";
            Graph.appendChild(GEC_D);

            var GEC_D_A = document.createElement("ol");
            GEC_D_A.innerHTML += "<li>中外文明与历史：" + PC_A_Credit.toString() + "分</li>";
            GEC_D_A.innerHTML += "<li>语言与文学：" + PC_B_Credit.toString() + "分</li>";
            GEC_D_A.innerHTML += "<li>哲学人生与社会科学：" + PC_C_Credit.toString() + "分</li>";
            GEC_D_A.innerHTML += "<li>艺术修养与审美：" + PC_D_Credit.toString() + "分</li>";
            GEC_D_A.innerHTML += "<li>自然科学与人类文明：" + PC_E_Credit.toString() + "分</li>";
            GEC_D_A.innerHTML += "<li>国防文化与船海史话：" + PC_F_Credit.toString() + "分</li>";
            GEC_D_A.innerHTML += "<li>中华优秀传统文化：" + PC_G_Credit.toString() + "分</li>";
            GEC_D_A.style.fontSize = "100";
            Graph.appendChild(GEC_D_A);
        }

        function student_level_2019_detail() {
            var Graph = document.getElementById("StudentInfo");

            let let_text_haed = document.createElement("p");
            let count_credit = 0;

            var Course_And_Credit = document.createElement("ol");
            for (let key in Course_name_2019) {
                Course_And_Credit.innerHTML += "<li style='fontSize:120%'>" + key + "：" + Course_name_2019[key] + "分</li>";
                count_credit += Course_name_2019[key];
            }

            let_text_haed.innerHTML += "<br>公选课已修：" + count_credit.toString() + "分<br>其中：";
            let_text_haed.style.fontSize = "150%";
            Graph.appendChild(let_text_haed);
            Graph.appendChild(Course_And_Credit);

        }

        function Count_Credit_GradeAVG_text() {
            var CCGA_text = document.createElement("script");
            CCGA_text.innerHTML = 'function Count_Credit_GradeAVG() {\
                var GradeList = document.getElementById("dataList");\
                var CourseGradeSum = 0, CreditSum = 0, GradeAvg = 0;\
                for (var i = 1; i < GradeList.rows.length; i++) {\
                    var Course = GradeList.rows[i];\
                    var Grade, Credit;\
                    if (Course.cells[4].getElementsByTagName("a")[0] == undefined) Grade = Course.cells[4].innerHTML;\
                    else Grade = Course.cells[4].getElementsByTagName("a")[0].innerHTML;\
                    Credit = parseFloat(Course.cells[5].innerHTML);\
                    let checkbox_id = "checkbox" + i.toString();\
                    if (!document.getElementById("checkbox_free").checked){\
                        if (Course.cells[9].innerHTML == "必修") {\
                            document.getElementById(checkbox_id).checked = document.getElementById("checkbox_bx").checked;\
                        } else if (Course.cells[9].innerHTML == "公选") {\
                            document.getElementById(checkbox_id).checked = document.getElementById("checkbox_gx").checked;\
                        } else {\
                            document.getElementById(checkbox_id).checked = document.getElementById("checkbox_zx").checked;\
                        }\
                        if (Course.cells[8].innerHTML == "自主考试") {\
                            document.getElementById(checkbox_id).checked = document.getElementById("checkbox_zz").checked;\
                        }\
                        if (Grade == "不及格" || Grade < 60) {\
                            document.getElementById(checkbox_id).checked = document.getElementById("checkbox_np").checked;\
                        }\
                    }\
                    if (Grade == "---" || !document.getElementById(checkbox_id).checked) {document.getElementById(checkbox_id).checked=false;continue;}\
                    switch (Grade) {\
                        case "优秀": Grade = 95; break;\
                        case "良好": Grade = 85; break;\
                        case "中等": Grade = 75; break;\
                        case "及格": Grade = 65; break;\
                        case "不及格": Grade = 30; break;\
                    }\
                    CourseGradeSum += Grade * Credit;\
                    CreditSum += Credit;\
                }\
                if (CreditSum == 0) {\
                    let_text = "Error!";\
                    document.getElementById("Grade_AVG").getElementsByTagName("strong")[0].innerText = let_text;\
                } else {\
                    GradeAvg = CourseGradeSum / CreditSum;\
                    GradeAvg = GradeAvg.toFixed(2);\
                    document.getElementById("Grade_AVG").getElementsByTagName("strong")[0].innerText = GradeAvg;\
                }\
            }';

            document.getElementById("Footer1_divCopyright").appendChild(CCGA_text);
        }

        var function_text = document.createElement("script");
        function_text.innerHTML = "function all_checkbox_function(checkbox_status){";
        function_text.innerHTML += "let checkbox_list = document.getElementsByName('all_checkbox');";
        function_text.innerHTML += "for(let i=0; i<checkbox_list.length;i++){";
        function_text.innerHTML += "if(checkbox_status == 0)checkbox_list[i].checked = true;";
        function_text.innerHTML += "else if(checkbox_status == 1)checkbox_list[i].checked = false;";
        function_text.innerHTML += "else checkbox_list[i].checked = !checkbox_list[i].checked;";
        function_text.innerHTML += "}";
        function_text.innerHTML += "}";
        document.getElementById("Footer1_divCopyright").appendChild(function_text);

        var Checkbox_noPass_func_text = document.createElement("script");
        Checkbox_noPass_func_text.innerHTML = '\
        function Checkbox_noPass(){\
            let course_list = document.getElementById("dataList");\
            for (let i = 1; i < course_list.rows.length; i++) {\
                let Course = course_list.rows[i];\
                let Grade;\
                if (Course.cells[4].getElementsByTagName("a")[0] == undefined) Grade = Course.cells[4].innerHTML;\
                else Grade = Course.cells[4].getElementsByTagName("a")[0].innerHTML;\
                if(Grade == "不及格"||Grade<60||Grade=="---"){\
                    let checkbox_id = "checkbox"+i.toString();\
                    document.getElementById(checkbox_id).checked = false;\
                }\
            }\
        }';
        document.getElementById("Footer1_divCopyright").appendChild(Checkbox_noPass_func_text);

        document.getElementById("TopTheme").click()
        document.getElementById("theme_purple").click()

        Add_th("成绩详情");
        let add_th_text = "均分组成 <br><input style='background:#D2A2CC' type='button' value='全选' onclick='all_checkbox_function(0)'>";
        add_th_text += "        <input style='background:#D2A2CC' type='button' value='全不选' onclick='all_checkbox_function(1)'>";
        add_th_text += "        <input style='background:#D2A2CC' type='button' value='反选' onclick='all_checkbox_function(2)'>";
        Add_th(add_th_text, 200);

        var GradeList = document.getElementById("dataList");
        var GradeAvg = 0, CourseGradeSum = 0, CreditSum = 0;
        var GeneralEducationCredit = 0, PCCategory_1 = 0, PCCategory_2 = 0, PCCategory_3 = 0, PCCategory_4 = 0;
        var PC_A_Credit = 0, PC_B_Credit = 0, PC_C_Credit = 0, PC_D_Credit = 0, PC_E_Credit = 0;
        var PC_F_Credit = 0, PC_G_Credit = 0;
        var ElectiveCourseCredit = 0;
        var Correction = 0;


        var Course_name_2019 = {};


        for (var i = 1; i < GradeList.rows.length; i++) {
            var Course = GradeList.rows[i];
            var Grade, Credit, course_detail_href;
            if (Course.cells[4].getElementsByTagName("a")[0] == undefined) Grade = Course.cells[4].innerHTML;
            else Grade = Course.cells[4].getElementsByTagName("a")[0].innerHTML;
            Credit = parseFloat(Course.cells[5].innerHTML);

            let var_td_grade_detail = document.createElement("td");
            if (Grade == "---") {
                var_td_grade_detail.innerHTML = "X﹏X";
                var_td_grade_detail.setAttribute("style", "width: 120px;color: #CE0000");
            } else {
                course_detail_href = 'http://edusys.hrbeu.edu.cn';
                course_detail_href += Course.cells[4].getElementsByTagName("a")[0].href.split("'")[1];

                let let_var_color_ico = Grade_Detail_Color_control(Grade);
                var_td_grade_detail.innerHTML = "<a style='color:" + let_var_color_ico[0] + "' href=" + course_detail_href + ">" + let_var_color_ico[1] + "</a>";
                var_td_grade_detail.setAttribute("style", "width: 120px;");
            }
            document.getElementById("dataList").rows[i].appendChild(var_td_grade_detail);

            function create_course_checkbox(statusCode) {
                let var_td_checked = document.createElement("td");
                let checkbox_id = "checkbox" + i.toString();
                let all_checkbox_name = "all_checkbox";
                if (statusCode == 1) {
                    var_td_checked.innerHTML = "<input id='" + checkbox_id + "'name='" + all_checkbox_name + "'type='checkbox' checked='checked'>";
                } else {
                    var_td_checked.innerHTML = "<input id='" + checkbox_id + "'name='" + all_checkbox_name + "'type='checkbox'>";
                }
                document.getElementById("dataList").rows[i].appendChild(var_td_checked);
            }


            if (Grade == "---" || Course.cells[8].innerHTML == "自主考试") {
                create_course_checkbox(0);
                continue;
            }

            if (Course.cells[9].innerHTML == "公选" && Grade != "不及格") {
                PC_Credit_Calc(Course.cells[10].innerHTML, Credit);
                create_course_checkbox(0);
                continue;
            }

            if (Course.cells[9].innerHTML != "必修" && Grade != "不及格" && Course.cells[9].innerHTML != "公选") {
                ElectiveCourseCredit += Credit;
            }

            if (Course.cells[9].innerHTML != "必修" && Grade == "不及格") {
                create_course_checkbox(0);
                continue;
            }

            if (Course.cells[8].innerText == "补考") {
                create_course_checkbox(0);
                continue;
            }
            create_course_checkbox(1);

            switch (Grade) {
                case "优秀": Grade = 95; break;
                case "良好": Grade = 85; break;
                case "中等": Grade = 75; break;
                case "及格": Grade = 65; break;
                case "不及格": Grade = 30; break;
            }

            CourseGradeSum += Grade * Credit;
            CreditSum += Credit;
        }
        PCCategory_1 = PC_A_Credit + PC_B_Credit + PC_C_Credit + PC_D_Credit + PC_E_Credit + PC_F_Credit + PC_G_Credit;
        GeneralEducationCredit = PCCategory_1 + PCCategory_2 + PCCategory_3 + PCCategory_4;
        GradeAvg = CourseGradeSum / CreditSum + Correction;
        GradeAvg = GradeAvg.toFixed(2);

        let student_level = document.getElementById("Top1_divLoginName").innerHTML.split("(")[1].split(")")[0].substring(0, 4);

        Count_Credit_GradeAVG_text();

        if (parseInt(student_level) < 2019) {
            div_create_parent(300, 400);
            student_level_2018_detail();
        } else {
            div_create_parent(300, 400);
            student_level_2019_detail();
        }
    }
})();