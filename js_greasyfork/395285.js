// ==UserScript==
// @name         WhuGPACalculator
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://bkjw.whu.edu.cn/stu/stu_index.jsp
// @match        http://bkjw.whu.edu.cn/stu/stu_score_parent.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/395285/WhuGPACalculator.user.js
// @updateURL https://update.greasyfork.org/scripts/395285/WhuGPACalculator.meta.js
// ==/UserScript==


(function(){

    //var btn3 = document.getElementById("btn3")
    var scoreTable;
    var digit = 4;
    var btn9 = document.getElementById("btn9");

    var totalGpaBtn = document.createElement("button");
    var semeGpaBtn = document.createElement("button");

    var courseList = [];

    window.onload= function(){
        courseList = getCourseList();


        totalGpaBtn.textContent = "获取总绩点";
        semeGpaBtn.textContent = "获取学期绩点";



        totalGpaBtn.addEventListener("click", dispTotalGPA);
        semeGpaBtn.addEventListener("click", dispSemeGPA);

        btn9.insertAdjacentElement("afterend",semeGpaBtn);
        btn9.insertAdjacentElement("afterend",totalGpaBtn);
    }




function getCourseList(){
    //获取成绩框架scoreTable
    var scoreIfram0 = document.getElementById("page_iframe").contentWindow;
    var scoreIfram = scoreIfram0.document.getElementById("iframe0").contentWindow;

    //获取成绩框架中的成绩表scoreTable
    scoreTable = scoreIfram.document.getElementsByClassName("listTable");
    //var scoreTable = document.getElementsByClassName("listTable");
    //获取成绩表格中的每一列数据scoreLines
    var scoreLines = scoreTable[0].getElementsByTagName("tr");
    //在每一行中获取课程信息course
    var i = 0;
    var scoreInfo;

    var courseList = [];
    for(i = 1; i < scoreLines.length; i++){
        scoreInfo = scoreLines[i].getElementsByTagName("td");;
        var course = {};
        var name = scoreInfo[0].innerHTML;
        var year = scoreInfo[8].innerHTML;
        var seme = scoreInfo[9].innerHTML;
        var credit = scoreInfo[4].innerHTML;
        var mark = parseFloat(scoreInfo[10].innerHTML);
        var gpa;
        if(mark >= 90){
            gpa = 4.0;
        }
        else if(mark >= 85){
            gpa = 3.7;
        }
        else if(mark >= 83){
            gpa = 3.3;
        }
        else if(mark >= 79){
            gpa = 3.0;
        }
        else if(mark >= 75){
            gpa = 2.7;
        }
        else if(mark >= 72){
            gpa = 2.3;
        }
        else if(mark >= 68){
            gpa = 2.0;
        }
        else if(mark >= 64){
            gpa = 1.5;
        }
        else if(mark >= 60){
            gpa = 1.0;
        }
        else{
            gpa = 0.0;
        }
        if(!isNaN(mark)){
            course.name = name;
            course.credit = credit;
            course.gpa = gpa;
            course.year = year;
            course.seme = seme;
            courseList.push(course);
        }

    }
    return courseList;

}
    function dispTotalGPA(){

        //var courseList = getCourseList();
        var results = calculateTotalGPA(courseList);
        // here is checked, run well
        //addElement(scoreTable, gpa);
        addElement(scoreTable, results);


    }

    function dispSemeGPA(){
        //var courseList = getCourseList();
        //alert(courseList.length);
        var results = CalculateSemeGPA(courseList);
        addElement(scoreTable, results);
    }

    function addElement(scoreTable, results){
        var i = 0;
        for(i = 0; i < results.length; i++){
            //alert("add a new line");
            if(isNaN(results[i].gpa)){

            }
            else{
                //添加一行

                var newLine = document.createElement('tr');
                var newItem0 = document.createElement('td');
                var newItem1 = document.createElement('td');
                newItem0.textContent = results[i].type;
                newItem1.textContent = results[i].gpa;
                newLine.appendChild(newItem0);
                newLine.appendChild(newItem1);
                scoreTable[0].insertAdjacentElement('afterbegin', newLine);
            }
        }
    }


    function calculateTotalGPA(courseList){
        var i = 0;
        var totalgpa = 0.0;
        var totalCredits = 0.0;
        var gpa = 0.0;
        for(i = 0; i < courseList.length; i++){
            totalCredits += parseFloat(courseList[i].credit);
            totalgpa += parseFloat(courseList[i].gpa * courseList[i].credit);
        }
        gpa = totalgpa / totalCredits;
        var result = {type:'总绩点', gpa: gpa.toPrecision(digit),};
        var results = [];
        results.push(result);
        return results;

    }

    function CalculateSemeGPA(courseList){
        var semes = [];
        var results = [];

        var i = 0;
        for(i = 0; i < courseList.length; i++){
            var currentSeme = {};
            currentSeme.year = courseList[i].year;
            currentSeme.seme = courseList[i].seme;
            var j = 0;

            //查看有多少学期
            if(semes.length == 0){
                semes.push(currentSeme);
                 //alert("semes is only one");
            }
            else{
                //alert("semes is no longer one");
                for(j = 0; j < semes.length; j++){
                    if(semes[j].year == currentSeme.year && semes[j].seme == currentSeme.seme){
                        j = 9999;
                        break;
                    }
                }
                if(j != 9999){
                    semes.push(currentSeme);
                }

            }
        }

        //对每个学期分别计算gpa,写入results中
        //alert("semes");
        //alert(semes.length);
        for(i = 0; i < semes.length; i++){

            var totalCredits = 0.0;
            var totalgpa = 0.0;
            for(j = 0; j < courseList.length; j ++){
                //对每个学期计算gpa

                if(courseList[j].year == semes[i].year && courseList[j].seme == semes[i].seme){
                    totalCredits += parseFloat(courseList[j].credit);
                    totalgpa += parseFloat(courseList[j].credit) * parseFloat(courseList[j].gpa);
                }
            }

            var gpa = 0;
            gpa = totalgpa / totalCredits;

            var result = {};
            result.gpa = gpa.toPrecision(digit);
            result.year = parseInt(semes[i].year);
            result.seme = parseInt(semes[i].seme);

            result.type = semes[i].year + "年第" + semes[i].seme + "学期";

            //alert(result.type);
            results.push(result);
        }
        results.sort(function(b, a){
            if(a.year == b.year){
                return a.seme - b.seme;
            }
            else{
                return a.year - b.year;
            }
        });

        return results;


        }




})();