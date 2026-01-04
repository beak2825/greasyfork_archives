// ==UserScript==
// @name         教务系统学分与GPA
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  武汉大学教务系统成绩页面各学分与GPA计算器
// @author       Arichy
// @match        http://210.42.121.132/stu/stu_index.jsp
// @match        http://210.42.121.133/stu/stu_index.jsp
// @match        http://210.42.121.134/stu/stu_index.jsp
// @match        http://210.42.121.241/stu/stu_index.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38707/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%AD%A6%E5%88%86%E4%B8%8EGPA.user.js
// @updateURL https://update.greasyfork.org/scripts/38707/%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E5%AD%A6%E5%88%86%E4%B8%8EGPA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function calculate(courseArr){
        var gpSum = 0;//所有课程的绩点*学分的和
        var creditSum = 0;//所有课程学分的和

        var score;//每个课程的分数
        var credit;//每个课程的学分
        var gp;//每个课程的学分绩
        var course;//每个课程

        var credit0 = 0;//公选
        var credit1 = 0;//公必
        var credit2 = 0;//专选
        var credit3 = 0;//专必
        var gpa = 0;

        for(var i=0;i<courseArr.length;i++){
            course = courseArr[i];
            score = parseFloat(course.score);
            credit = parseFloat(course.credit);

            if(score>=90){
                gp = 4.0;
            }
            else if(score>=85){
                gp = 3.7;
            }
            else if(score>=82){
                gp = 3.3;
            }
            else if(score>=78){
                gp = 3.0;
            }
            else if(score>=75){
                gp = 2.7;
            }
            else if(score>=72){
                gp = 2.3;
            }
            else if(score>=68){
                gp = 2.0;
            }
            else if(score>=64){
                gp = 1.5;
            }
            else if(score>=60){
                gp = 1.0;
            }
            else{
                gp = 0.0;
            }

            switch(course.type){
                case 0: credit0 += credit; break;
                case 1: credit1 += credit; break;
                case 2: credit2 += credit; break;
                case 3: credit3 += credit; break;
            }

            creditSum += credit;
            gpSum += (credit*gp);
        }

        gpSum = parseFloat(gpSum.toFixed(4));
        gpa = gpSum/creditSum;

        return {
            '公共选修':credit0,
            '公共必修':credit1,
            '专业选修':credit2,
            '专业必修':credit3,
            '总学分':creditSum,
            'GPA':gpa.toFixed(3)
        };
    }

    var typeMap = {
        '公共选修':0,
        '公共必修':1,
        '专业选修':2,
        '专业必修':3
    };

    var btn = document.getElementById('btn3');

    var frame1,frame2,frame3;
    var j=0;
    btn.addEventListener('click',function(){

        frame1 = document.getElementById('page_iframe').contentWindow;
        frame3 = document.getElementById('bar_iframe').contentWindow;

        var timer = setInterval(function (){

            if(frame1.document.getElementById('iframe0')){//frame1已经加载完毕，此时可以获取成绩表格的frame2
                frame2 = frame1.document.getElementById('iframe0').contentWindow;

                if(frame2.document.getElementsByClassName('listTable')[0] && frame3.document.getElementById('listContent')){

                    var listContent = frame3.document.getElementById('listContent');
                    var resultTable = listContent.getElementsByClassName('listTable')[0];//右边结果的表格

                    var title = listContent.getElementsByClassName('listTitle')[0].innerHTML;

                    if(title=='学分和GPA统计'){
                        j++;
                        if(j>=8){//如果已经在成绩页面，此时点击成绩按钮，会由于js执行快于dom加载，js改变了dom之后，dom却刷新了。所以用j来多获取几次dom，目的是获取刷新之后的dom
                            j=0;
                            clearInterval(timer);

                            var gradeTable = frame2.document.getElementsByClassName('listTable')[0];//成绩的表格

                            var trs;
                            var tds;
                            var i;

                            trs = gradeTable.getElementsByTagName('tr');//成绩表格的每一行

                            var courseArr = [];

                            for(i=0;i<trs.length;i++){
                                tds = trs[i].getElementsByTagName('td');

                                if(tds[9] && tds[9].innerHTML){
                                    var course = {};
                                    course.name = tds[1].innerHTML;
                                    course.credit = tds[3].innerHTML;
                                    course.score = tds[9].innerHTML;
                                    course.type = typeMap[tds[2].innerHTML];

                                    courseArr.push(course);
                                }
                            }
                            var result = calculate(courseArr);


                            trs = resultTable.getElementsByTagName('tr');
                            console.log(trs);

                            for(i=1;i<trs.length;i++){
                                tds = trs[i].getElementsByTagName('td');
                                var key = tds[0].innerHTML;
                                if(result[key]!=null){
                                    tds[1].innerHTML = result[key];
                                }
                            }
                        }
                    }

                //按钮部分，由于没什么用所以暂时不做了
                /*var wraptr = document.createElement('tr');
                var wraptd = document.createElement('td');
                var calBtn = document.createElement('button');

                wraptd.setAttribute('colspan',2);

                calBtn.innerHTML = '计算学分和GPA';
                calBtn.onclick = function(e){
                    e.preventDefault();
                    e.returnValue = false;
                };
                var css = "padding:4px;margin:3px;border:1px solid black;border-radius:5px;cursor:pointer";
                calBtn.setAttribute('style',css);

                wraptr.appendChild(wraptd);
                wraptd.appendChild(calBtn);

                document.getElementById('bar_iframe').contentWindow.document.getElementById('listContent').getElementsByTagName('tbody')[0].appendChild(wraptr);*/
                }
            }
        },20);

    });
})();