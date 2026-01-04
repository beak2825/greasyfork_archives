// ==UserScript==
// @name         STU AIquestion
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include        https://info.stu.edu.tw/aca/student/CoStuAns/*
// @match        https://info.stu.edu.tw/ACA/*
// @match        https://info.stu.edu.tw/aca/*
// @match        https://info.stu.edu.tw/SAO/COC_Student/TeacherReview/teacher_comm.asp
// @match        https://info.stu.edu.tw/SAO/COC_Student/TeacherReview/prompt.asp
// @grant        none
// @require http://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/393887/STU%20AIquestion.user.js
// @updateURL https://update.greasyfork.org/scripts/393887/STU%20AIquestion.meta.js
// ==/UserScript==
(function(){
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function submitInput(){
        var d = document;
        var a = d.getElementsByTagName('input');
        var b = d.getElementsByTagName('font');
        var i = 0;
        for (i = 0; i < b.length; i++) {
            if (b[i].innerHTML.indexOf('老師上課不依照進度進行') != -1) {
                b = b[i].id;
                b = b.replace('I', 'R');
                break;
            }
        }
        for (i = 0; i < a.length; i++){
            if (a[i].value == 5) a[i].checked = true;
        }
        var w = d.getElementsByName(b);
        for (i = 0; i < w.length; i++){
            if (w[i].value == 1) w[i].checked = true;
        }

    }

    if(location.href.endsWith("loginAction.asp")){
        console.log("loginAction.asp");
        document.getElementsByName("goQ")[0].click();
    }

    if(location.href.endsWith("stuSurvey.asp")){
        console.log("stuSurvey.asp");
        submitInput();

        document.getElementById("sendData").click();
        //window.location.href = "https://info.stu.edu.tw/ACA/student/CoStuAns/StuOpinion.asp";
    }

    if(location.href.endsWith("teacher_comm.asp")){
        submitInput();
        document.getElementById("InsDa").click();
        //window.location.href = "https://info.stu.edu.tw/ACA/student/CoStuAns/StuOpinion.asp";
    }


    if(location.href.endsWith("prompt.asp")){
        window.close();
    }

    if(location.href.startsWith("https://info.stu.edu.tw/aca/student/CoStuAns/listQuestionView.asp") || location.href.startsWith("https://info.stu.edu.tw/ACA/student/CoStuAns/listQuestionView.asp")){
        submitInput();
        var d = document;
        var a = d.getElementsByTagName('input');
        a[0].checked = true;
        a[6].checked = true;
        a[11].checked = true;
        a[16].checked = true;
        a[19].checked = true;
        a[24].checked = true;

        document.getElementById("upset1").click();
        //window.location.href = "https://info.stu.edu.tw/ACA/student/CoStuAns/StuOpinion.asp?loginset=193";
    }

    if(location.href.startsWith("https://info.stu.edu.tw/ACA/student/CoStuAns/StuOpinion.asp") || location.href.startsWith("https://info.stu.edu.tw/aca/student/CoStuAns/StuOpinion.asp")){
        var numberOfCourses = document.getElementsByTagName('tr').length;
        console.log(numberOfCourses);

        try {
            (async function () {
                for (var count = 0; count < numberOfCourses; count++) {
                    try{
                        console.log(document.getElementsByTagName('tr')[count]);
                        if(document.getElementsByTagName('tr')[6].children[4].children[0].innerHTML == "必填"){
                            document.getElementsByTagName('tr')[count].click();
                        }


                        d.forms.Qform.submit();
                        await sleep(1500);
                        d = document.getElementById('contentFrame').contentWindow.document;
                        await sleep(1500);
                        document.querySelectorAll("p>a")[0].click();
                        await sleep(3000);
                    }catch(e){}
                    //alert(count);
                }
            })();
        } catch (e) {
            console.log(e);
        } finally {
            d = document;
            sleep(1500);
            document.querySelectorAll("p>a")[0].click();
            sleep(1500);
        }
    }
})();