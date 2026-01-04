// ==UserScript==
// @name         河北教师全员培训
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  油猴挺好用，借此机会，推荐给同行。全员培训，极速学过，省电。大家有兴趣学学javascript之类的东西，做出适合自己使用的工具。应该不局限于河北教师全员培训吧，enetedu.com，高等教育出版社。
// @homepage     没有网站
// @supportURL   也不提供支持
// @author       暴躁老铁匠
// @match        https://qy18.gpa.enetedu.com/MyCourse/Process*
// @match        https://qy18.gpa.enetedu.com/Event/CourseWare?courseID=*
// @match        https://qy18.gpa.enetedu.com/Event/MyjoinEvent*
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/408954/%E6%B2%B3%E5%8C%97%E6%95%99%E5%B8%88%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/408954/%E6%B2%B3%E5%8C%97%E6%95%99%E5%B8%88%E5%85%A8%E5%91%98%E5%9F%B9%E8%AE%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var myPlay= "https://qy18.gpa.enetedu.com/MyCourse/Process";
    var myMenu="https://qy18.gpa.enetedu.com/Event/CourseWare?courseID=";
   var myJob="https://qy18.gpa.enetedu.com/Event/MyjoinEvent"
    function getQueryStringByName(name) {
        var result = location.search.match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
        if (result == null || result.length < 1) {
            return "";
        }
        return result[1];
    }


    function myRecord()
    {
        var coursewave_percent;
        var IS_FINISHED;
        var zjcourseid;
        var type;
        var COURSE_ID12;
        var DURATION = 0;
        var COURSEWARE_ID12;
        var learn;
        var ID12;
        var key123;
        var subject_id;
        var iPlaySec = parseInt("0");
        var enet_studentCourseWareLearn = decodeURIComponent(getCookie('enet_studentCourseWareLearn'+getQueryStringByName('courseware_id')+'1')).split("&");
        for (var j = 0; j < enet_studentCourseWareLearn.length; j++) {
            var learnCookie = enet_studentCourseWareLearn[j].split("=");
            if (learnCookie[0] == "coursewave_percent") {
                coursewave_percent = learnCookie[1];
            }
            else if (learnCookie[0] == "course_id") {
                COURSE_ID12 = learnCookie[1];
            }
            else if (learnCookie[0] == "course_type") {
                type = learnCookie[1];
            }
            else if (learnCookie[0] == "courseware_id") {
                COURSEWARE_ID12 = learnCookie[1];
            }
            else if (learnCookie[0] == "student_id") {
                ID12 = learnCookie[1];
            }
            else if (learnCookie[0] == "key") {
                key123 = learnCookie[1];

            }
            else if (learnCookie[0] == "finished") {
                IS_FINISHED = learnCookie[1];
            }
            else if (learnCookie[0] == "learn") {
                learn = learnCookie[1].split("|");
            }
            else if (learnCookie[0] == "iPlaySec") {
                iPlaySec = parseInt(learnCookie[1]);
            }
            else if (learnCookie[0] == "duration") {
                DURATION = learnCookie[1];
            }
            else if (learnCookie[0] == "subject_id") {
                subject_id = parseInt(learnCookie[1]);
            }
        }

        //alert(IS_FINISHED);
        if (IS_FINISHED != "1") {
            var iStart = 0;
            var iEnd = 0;
            for (var i = 0; i < learn.length - 1; i++) {
                var study = learn[i].split(",");
                var studyStart = parseInt(study['0']);
                //alert(studyStart);
                var studyEnd = parseInt(study['1']);
                //alert(studyEnd);
                if (i == 0) {
                    iStart = studyStart;
                    iEnd = studyEnd;
                }
                if (studyStart > iEnd) {
                    iPlaySec = iPlaySec + (iEnd - iStart);
                    iStart = studyStart;
                    iEnd = studyEnd;
                }
                else if (studyEnd > iEnd) {
                    iEnd = studyEnd;
                }
                if (i == learn.length - 2) {
                    iPlaySec = iPlaySec + (iEnd - iStart);
                }
            }
            iPlaySec=DURATION;
            if (iPlaySec / DURATION >= coursewave_percent) {
                if (iPlaySec > DURATION) {
                    iPlaySec = DURATION;
                }
                var url = "/VideoPlay2/updateStudyStatue2";
                $.post(url,
                       {
                    subject_id: subject_id,
                    course_id: COURSE_ID12,
                    courseware_id: COURSEWARE_ID12,
                    student_id: ID12,
                    course_type: type,
                    wordkey: key123,
                    iPlaySec: iPlaySec,
                    playSec: iEnd - iStart
                },
                       function(data) {

                }
                      );
            }
        }
    }


    //alert('abc');
    function NextPage() {
        var myUrl=$.cookie('myJob');
        if(myUrl)
        {
            //  alert(myUrl);
            a .href= myUrl;
        }
        if($("a.tishivalju").length==0)
        {
            a.click();
        }
        else if($("a.tishivalju").length==2)
        {
            $("a.tishivalju")[1].click();
        }
        else
        {
            if($("span.tishivalhui:last").text()=="下一篇：")//说明还有下一篇
            {
                $("a.tishivalju")[0].click();
            }
            else
            {
                a.click();
            }
        }
    }
    var a=document.createElement("a");
    a.appendChild(document.createTextNode("请单击第一个链接，开始快速推进本页课程"));
    a.id="mybutton";
    a.style="width: 320px; height: 29px;border: 1px solid gray;background:red;"
    $(".menu").after(a);

    //alert(document.URL);

    if(document.URL.indexOf(myPlay)==0)
    {

        window.setTimeout(myRecord, 3000);
        window.setTimeout(NextPage, 6000);

    }
    if(document.URL.indexOf(myMenu)==0)
    {
        $.cookie('myMenu',document.URL, { expires: 7, path: '/' });
        a.href=myJob;
    }
  if(document.URL.indexOf(myJob)==0)
    {
        $.cookie('myJob',document.URL, { expires: 7, path: '/' });
        a.href="https://qy18.gpa.enetedu.com/MyCourse/MyEventList";
    }


    // Your code here...
})();