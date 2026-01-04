// ==UserScript==
// @name         HEU_SCORE
// @namespace    Xiuchen
// @version      0.3
// @description  used to calculate average scores for HEU students
// @author       Xiuchen
// @match        https://edusys.wvpn.hrbeu.edu.cn/jsxsd/kscj/cjcx_list
// @match        http://edusys.hrbeu.edu.cn/jsxsd/kscj/cjcx_list
// @grant        none
// @require      https://cdn.staticfile.org/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/424514/HEU_SCORE.user.js
// @updateURL https://update.greasyfork.org/scripts/424514/HEU_SCORE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert("正在计算均分");
    var list = document.getElementById("dataList");
    var avg = 0, cnt = 0;
    if(list.rows.length > 1 && list.rows[1].cells[0].innerHTML != "未查询到数据"){
        var sum_score = 0, sum_cre = 0;
        for(var i = 1; i < list.rows.length; i++){
            var tmp = list.rows[i];
            var sc;
            if(tmp.cells[4].getElementsByTagName("a")[0] == undefined) sc = tmp.cells[4].innerHTML;
            else sc = tmp.cells[4].getElementsByTagName("a")[0].innerHTML;
            var cre = parseFloat(tmp.cells[5].innerHTML);
            if(sc == "---"){
                cnt++;
                continue;
            }
            else if(sc == "优秀") sc = 95;
            else if(sc == "良好") sc = 85;
            else if(sc == "中等") sc = 75;
            else if(sc == "及格") sc = 65;
            else if(sc == "不及格"){
                cnt++;
                continue;
            }
            else if(sc < 60){
                cnt++;
                continue;
            }
            sum_score += sc * cre;
            sum_cre += cre;
        }
        avg = sum_score / sum_cre;
        avg = avg.toFixed(2);
    }
    $("body").append(" <div id='avg_score' style='left: 10px;bottom: 10px;background: #e5f2ff;overflow: hidden;z-index: 9999;position: fixed;padding:5px;text-align:center;width: 200px;height: 200px;border-bottom-left-radius: 4px;border-bottom-right-radius: 4px;border-top-left-radius: 4px;border-top-right-radius: 4px;'> </div>");
    var by = document.getElementById("avg_score");
    //添加label ，存放指标名称

    //姓名学号
    var lab_name = document.createElement("p");
    lab_name.innerText = "姓名：" + document.getElementById("Top1_divLoginName").innerHTML;
    lab_name.style.fontSize = "150%";
    by.appendChild(lab_name);

    //成绩
    var lab_score = document.createElement("p");
    lab_score.innerText = "平均分：" + avg.toString();
    lab_score.style.fontSize = "200%";
    by.appendChild(lab_score);

    //挂科门数
    var lab_fail = document.createElement("p");
    lab_fail.innerHTML = "您有 " + "<strong style='font-size:22px; color:red'>" +cnt.toString() + "</strong>" + " 门挂科，挂科成绩未计入均分。如果之后通过了考试，通过考试的分数计入了均分。";
    lab_fail.style.fontSize = "15px";
    by.appendChild(lab_fail);
    // Your code here...
})();