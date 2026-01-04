// ==UserScript==
// @name         UESTC学分检查
// @namespace    https://dking.online/
// @version      0.1
// @description  UESTC 教务系统->培养计划
// @author       DKing
// @match        http://eams.uestc.edu.cn/eams/myPlan.action
// @grant        none
// @run-at      document-end
// @require    https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/372135/UESTC%E5%AD%A6%E5%88%86%E6%A3%80%E6%9F%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/372135/UESTC%E5%AD%A6%E5%88%86%E6%A3%80%E6%9F%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $.get('http://eams.uestc.edu.cn/eams/teach/grade/course/person!historyCourseGrade.action?projectType=MAJOR', function(data, status){
        var response = $('<html />').html(data);
        var gradelist = response.find('.gridtable').last().children().last().children();
        //console.log(gradelist);

        function find_in_gradelist(course_code){
            for (var gi=0; gi<gradelist.length; gi++ ){
                var grade = $(gradelist[gi]).children();
                if (grade[1].innerText == course_code)
                    return grade;
            }
            return null;
        }

        var planlist = $('.planTable').first().children().last().children().each(function(){
            var courseid = $(this).children().first();
            while(courseid.hasClass('group')) courseid = courseid.next();
            if (!courseid.hasClass('summary') && courseid.text().length == 8)
            {
                var course_code = courseid.text();
                var grade = find_in_gradelist(course_code);
                var color = '';
                if (grade){
                    if(parseInt(grade[8].innerText) >= 60){
                        color = 'green';
                    }else
                    {
                        color = 'red';
                    }
                    courseid.css({'background-color': color});
                }
            }
        });
    });


})();