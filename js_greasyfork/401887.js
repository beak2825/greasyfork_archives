// ==UserScript==
// @name         刷课全国高校教师网络培训中心
// @namespace   onlinenew.enetedu.com
// @version      0.2
// @description  对全国高校教师网络培训中心的各课程进行刷课，并自动填写作业，快速完成学业获取证书。
// @author       tailwind
// @match        http://onlinenew.enetedu.com/lnemc/MyTrainCourse/*
// @require      https://cdn.staticfile.org/jquery-cookie/1.4.1/jquery.cookie.min.js
// @run-at document-end
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/401887/%E5%88%B7%E8%AF%BE%E5%85%A8%E5%9B%BD%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83.user.js
// @updateURL https://update.greasyfork.org/scripts/401887/%E5%88%B7%E8%AF%BE%E5%85%A8%E5%9B%BD%E9%AB%98%E6%A0%A1%E6%95%99%E5%B8%88%E7%BD%91%E7%BB%9C%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if( $("div.classcenter-chapter").length>0){
        //刷课
        refreshClass();
    }
    else if( $("#homework_title").length>0){
        //自动填写作业内容
        writeHomework();
    }



    //刷课，同时获取课程名称并保存到数组
    function refreshClass(){
        var className=$("p.class-header2.ellipsis").attr("title");  //课程名称
        var classwareName=new Array(className);

        //在课件每章节前加刷课按钮
        var lis=$(".classcenter-chapter2.right1>ul li");

        lis.each(function(index,element){
            classwareName.push($(element).text()); //保存课件名
            var attribString=$(element).attr('onclick');
            var vars=attribString.substring(attribString.indexOf("?")+1,attribString.length-1).split("&");
            var courseid=0; //课程号
            var coursewareid=0; //课件号
            //coursetype=3&orderid=0&id=555&coursewareid=7066
            for (var i = 0; i < vars.length; i++) {
                var vs = vars[i].split("=");
                if(vs[0]=="id"){
                    courseid=vs[1];
                }
                if(vs[0]=="coursewareid"){
                    coursewareid=vs[1];
                }
            }

            var span="";
            if($(element).css("color")=="rgb(0, 128, 0)"){
                span=$("<span style='line-height:36px;height:36px;float:left;color:gray;'>已完成</span>");
            }
            else{
                if(getCookie("enet_studentCourseWareLearn" + courseid + coursewareid)==""){
                    span=$("<span style='line-height:36px;height:36px;float:left;color:gray;'>先播放</span>");
                }
                else{
                    span=$("<span style='line-height:36px;height:36px;float:left;color:blue;cursor:pointer;' onclick='passClass(this," + courseid + "," + coursewareid  + ",\"" + $(element).text() + "\")' title=课程号'" + courseid + ",课件号" + coursewareid + "'>刷课</span>");
                }
            }

            $(element).before(span);
        });

        GM_setValue("classwareName", classwareName);
    }


    unsafeWindow.passClass=function( obj, courseid , coursewareid, title){
        //获取本课程信息
        var iPlaySec = 0;
        var coursewave_percent;
        var finished;
        var learn;
        var course_id;
        var duration;
        var subject_id;
        var key;
        var courseware_id;
        var student_id;

        var cookieString=getCookie("enet_studentCourseWareLearn" + courseid + coursewareid);

        var enet_studentCourseWareLearn =cookieString.split("&");

        /*enet_studentCourseWareLearn5557080=
            coursewave_percent=0.50&
            course_id=555&
            subject_id=12&
            courseware_id=7080&
            student_id=666666&
            key=ab35255cde4142e2&
            finished=1&
            learn=0,181|182,361|&
            iPlaySec=0&
            duration=706;
        */

        for (var j = 0; j < enet_studentCourseWareLearn.length; j++) {

            var learnCookie = enet_studentCourseWareLearn[j].split("=");
            //console.log(learnCookie[0],learnCookie[1]);
            if (learnCookie[0] == "coursewave_percent") {
                coursewave_percent = learnCookie[1];
            }
            else if (learnCookie[0] == "course_id") {
                course_id = learnCookie[1];
            }
            else if (learnCookie[0] == "subject_id") {
                subject_id = learnCookie[1];
            }
            else if (learnCookie[0] == "courseware_id") {
                courseware_id = learnCookie[1];
            }
            else if (learnCookie[0] == "student_id") {
                student_id = learnCookie[1];
            }
            else if (learnCookie[0] == "key") {
                key = learnCookie[1];
            }
            else if (learnCookie[0] == "finished") {
                finished = learnCookie[1];
            }
            else if (learnCookie[0] == "learn") { //learn=0,181|182,361|362,541|  或者learn=
                learn = learnCookie[1].split("|");
            }
            else if (learnCookie[0] == "iPlaySec") {
                iPlaySec = parseInt(learnCookie[1]);
            }
            else if (learnCookie[0] == "duration") {
                duration = learnCookie[1];
            }
        }
        if (finished != "1") {
            if(confirm("确定刷本节课《" + title + "》吗?")){
                //改cookies值: learn=0,duration的值   ，iPlaySec=duration的值
                //enet_studentCourseWareLearn5557080=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7080&student_id=666666&key=ab35255cde4142e2&finished=1&learn=0,181|182,361|&iPlaySec=0&duration=706;

                //var newCookieString=cookieString.replace(/&learn=.*?&/,"&learn=0,"+ duration + "&");         //正则等价 var newCookieString=cookieString.replace(/&learn=(\d|,|\|)*&/,"&learn=0,"+ duration + "&");
                //newCookieString=newCookieString.replace(/&iPlaySec=\d*&/,"&iPlaySec=" + duration + "&");

                //更新cookie
                // $.cookie("enet_studentCourseWareLearn" + courseid + coursewareid  , newCookieString );

                //改url参数  courseware_id=当前课件号 timestamp=当前时间戳  end=duration的值&start=0
                iPlaySec = duration;
                var url = '/lnemc/VideoPlay/StudyRecode';
                $.get(url,
                      {
                    orderid:0,
                    student_id:student_id,
                    course_id:course_id,
                    courseware_id:courseware_id,
                    is_elective:0,
                    timestamp:new Date().getTime(),
                    end:duration,
                    start:0
                },
                      function(data) {
                    //刷课成功后自动跳转到下一个没有完成的课件
                    var urlString=$(obj).nextAll("li").eq(1).attr('onclick');

                    if(typeof(urlString) != "undefined"){
                        url=urlString.substring(urlString.indexOf("href='")+6,urlString.length-1);
                        location.href=url;
                    }
                    else{
                        var returnUrlString=$('.buttonmore-red').attr('onclick');
                        var returnUrl=returnUrlString.substring(returnUrlString.indexOf("href='")+6,returnUrlString.length-1);
                        location.href=returnUrl;
                    }
                }
                     );
            }
        }
    };



    //获取本课件cookie
    function getCookie(c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "="); //enet_studentCourseWareLearn112316676
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                return unescape(document.cookie.substring(c_start, c_end));
            }
        }
        return "";
    }


    function writeHomework(){
        if($('#homework_title').length>0){
            if($('#homework_title').val().length<3) {
                $('#homework_title').val('培训总结') ;
            }
            if($('#editorContentSet').val().length<10){
                var content='<p>&nbsp;&nbsp;&nbsp;&nbsp;为了提高自己的专业能力和理论修养，我特意选择了这门课程《' + GM_getValue("classwareName")[0] + '》，认真观看了视频录像。</p> ';
                content+= "<p>&nbsp;&nbsp;&nbsp;&nbsp;老师讲得很好，内容切合实际，我听取学习了如下章节：</p><ol>";
                for(var i=1;i<GM_getValue("classwareName").length;i++){
                    content+="<li>" + GM_getValue("classwareName")[i] + '</li>';
                }
                content+='</ol><p>&nbsp;&nbsp;&nbsp;&nbsp;这次课程学习后自己感觉受益非浅，在理论知识和实践经验方面都取得了一定的提高。谢谢！</p>';
                $('#editorContentSet').val(content);
            }
        }
    }



    /*
以下为调试用临时数据，备份留存
=====================================================================================
方法
1.先访问课程章节初始化
2.（不做此步也可成功）改cookies值: learn=0,duration的值   ，iPlaySec=duration的值
enet_studentCourseWareLearn5557085=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=0&learn=0,4203|&iPlaySec=4203&duration=4203; path=/
3.改url参数  courseware_id=当前课件号 timestamp=当前时间戳  end=duration的值&start=0
   然后直接访问 http://onlinenew.enetedu.com/lnemc/VideoPlay/StudyRecode?orderid=0&student_id=666666&course_id=555&courseware_id=7083&is_elective=0&timestamp=1587628104555&end=991&start=0


========================================================================================
问题前
coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=0&learn=361,542|&iPlaySec=360&duration=4203
问题后
coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=0&learn=361,542|&iPlaySec=360&duration=4203
快进：
coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=0&learn=361,542|543,722|&iPlaySec=360&duration=4203
刷新：
coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=0&learn=&iPlaySec=766&duration=4203


初始进入：
http://onlinenew.enetedu.com/lnemc/MyTrainCourse/OnlineCourse?coursetype=3&orderid=0&id=555&coursewareid=7085
request:
GET /lnemc/MyTrainCourse/OnlineCourse?coursetype=3&orderid=0&id=555&coursewareid=7085 HTTP/1.1
Host: onlinenew.enetedu.com
Connection: keep-alive
Upgrade-Insecure-Requests: 1
DNT: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,* ;q=0.8,application/signed-exchange;v=b3;q=0.9
Referer: http://onlinenew.enetedu.com/lnemc/MyTrainCourse/OnlineCourse?coursetype=3&orderid=0&id=555&coursewareid=7083
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: LoginUrl=login_url=%2fIndex%2fFindPassWord; safedog-flow-item=5A4DBABA9292E32AD2E00786FE9F5D71; enet_studentname=id=666666; School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; LOGIN_VALIDATE_CODE_ONLINE=code=1971; USER_INFO_SESSION_FRONTlnemc=id=666666&userclass=&userclass_disp=&username=&usermyname=%e5%86%af%e6%b6%9b&useremail=receivebox%40yeah.net&userschooldepartment=%e4%bf%a1%e6%81%af%e5%b7%a5%e7%a8%8b%e7%b3%bb&userschoolname=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&usersheng=&userface=&userPwdIsSimple=&EndTime=2020%2f4%2f21+22%3a30%3a01; scovalnemc=resval=6607ef4ff3f4a95c; Hm_lvt_61b06f0f5f937c411fb603f6b3f26d5a=1587377242,1587427704,1587441022,1587610859; ASP.NET_SessionId=lsi4oofo4i42e1dwhtqdwn0s; enet_studentCourseWareLearn5557067=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7067&student_id=666666&key=c34980024a6c13b7&finished=1&learn=&duration=0&iPlaySec=0;
         enet_studentCourseWareLearn5557080=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7080&student_id=666666&key=ab35255cde4142e2&finished=1&learn=0,181|182,361|&iPlaySec=0&duration=706; enet_studentCourseWareLearn5557079=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7079&student_id=666666&key=2e5a018b178d447c&finished=1&learn=&iPlaySec=0&duration=0; enet_studentCourseWareLearn5557082=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7082&student_id=666666&key=63bd6c5c15f5f12e&finished=1&learn=&iPlaySec=0&duration=0; enet_studentCourseWareLearn5557081=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7081&student_id=666666&key=dac814410523c3b0&finished=1&learn=&iPlaySec=0&duration=0; Hm_lpvt_61b06f0f5f937c411fb603f6b3f26d5a=1587623268; enet_studentCourseWareLearn5557083=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7083&student_id=666666&key=5c03525108a3c848&finished=0&learn=0,11|248,265|&iPlaySec=0&duration=991
response:
HTTP/1.1 200 OK
Cache-Control: private
Content-Length: 13285
Content-Type: text/html; charset=utf-8
Server: Microsoft-IIS/8.5
X-AspNet-Version: 4.0.30319
X-AspNetMvc-Version: 4.0
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 06:33:03 GMT; path=/
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 06:33:03 GMT; path=/
Set-Cookie: enet_studentname=id=666666; expires=Fri, 24-Apr-2020 06:33:03 GMT; path=/
         Set-Cookie: enet_studentCourseWareLearn5557085=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=2&learn=&iPlaySec=0&duration=4203; path=/
X-Powered-By: ASP.NET
X-UA-Compatible: IE=EmulateIE7
X-frame-options: SAMEORIGIN
Date: Thu, 23 Apr 2020 06:33:03 GMT

http://onlinenew.enetedu.com/lnemc/Common/VideoPlay?id=7085&orderid=0&courseid=555
GET /lnemc/Common/VideoPlay?id=7085&orderid=0&courseid=555 HTTP/1.1
Host: onlinenew.enetedu.com
Connection: keep-alive
Upgrade-Insecure-Requests: 1
DNT: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*;q=0.8,application/signed-exchange;v=b3;q=0.9
Referer: http://onlinenew.enetedu.com/lnemc/MyTrainCourse/OnlineCourse?coursetype=3&orderid=0&id=555&coursewareid=7085
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: LoginUrl=login_url=%2fIndex%2fFindPassWord; safedog-flow-item=5A4DBABA9292E32AD2E00786FE9F5D71; enet_studentname=id=666666; School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; LOGIN_VALIDATE_CODE_ONLINE=code=1971; USER_INFO_SESSION_FRONTlnemc=id=666666&userclass=&userclass_disp=&username=&usermyname=%e5%86%af%e6%b6%9b&useremail=receivebox%40yeah.net&userschooldepartment=%e4%bf%a1%e6%81%af%e5%b7%a5%e7%a8%8b%e7%b3%bb&userschoolname=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&usersheng=&userface=&userPwdIsSimple=&EndTime=2020%2f4%2f21+22%3a30%3a01; scovalnemc=resval=6607ef4ff3f4a95c; Hm_lvt_61b06f0f5f937c411fb603f6b3f26d5a=1587377242,1587427704,1587441022,1587610859; ASP.NET_SessionId=lsi4oofo4i42e1dwhtqdwn0s; enet_studentCourseWareLearn5557067=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7067&student_id=666666&key=c34980024a6c13b7&finished=1&learn=&duration=0&iPlaySec=0;
          enet_studentCourseWareLearn5557080=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7080&student_id=666666&key=ab35255cde4142e2&finished=1&learn=0,181|182,361|&iPlaySec=0&duration=706; enet_studentCourseWareLearn5557079=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7079&student_id=666666&key=2e5a018b178d447c&finished=1&learn=&iPlaySec=0&duration=0; enet_studentCourseWareLearn5557082=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7082&student_id=666666&key=63bd6c5c15f5f12e&finished=1&learn=&iPlaySec=0&duration=0; enet_studentCourseWareLearn5557081=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7081&student_id=666666&key=dac814410523c3b0&finished=1&learn=&iPlaySec=0&duration=0; Hm_lpvt_61b06f0f5f937c411fb603f6b3f26d5a=1587623268; enet_studentCourseWareLearn5557083=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7083&student_id=666666&key=5c03525108a3c848&finished=0&learn=0,11|248,265|&iPlaySec=0&duration=991; enet_studentCourseWareLearn5557085=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=2&learn=&iPlaySec=0&duration=4203

response:
HTTP/1.1 200 OK
Cache-Control: private
Content-Length: 8567
Content-Type: text/html; charset=utf-8
Server: Microsoft-IIS/8.5
X-AspNet-Version: 4.0.30319
X-AspNetMvc-Version: 4.0
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 06:33:03 GMT; path=/
X-Powered-By: ASP.NET
X-UA-Compatible: IE=EmulateIE7
X-frame-options: SAMEORIGIN
Date: Thu, 23 Apr 2020 06:33:03 GMT

http://onlinenew.enetedu.com/lnemc/VideoPLay/IndexNew?0&coursewareid=7085&courseid=555&orderid=0&is_elective=0&1587623461762
GET /lnemc/VideoPLay/IndexNew?0&coursewareid=7085&courseid=555&orderid=0&is_elective=0&1587623461762 HTTP/1.1
Host: onlinenew.enetedu.com
Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36
DNT: 1
Accept: *
X-Requested-With: ShockwaveFlash/32.0.0.363
Referer: http://onlinenew.enetedu.com/lnemc/Common/VideoPlay?id=7085&orderid=0&courseid=555
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: LoginUrl=login_url=%2fIndex%2fFindPassWord; safedog-flow-item=5A4DBABA9292E32AD2E00786FE9F5D71; enet_studentname=id=666666; School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; LOGIN_VALIDATE_CODE_ONLINE=code=1971; USER_INFO_SESSION_FRONTlnemc=id=666666&userclass=&userclass_disp=&username=&usermyname=%e5%86%af%e6%b6%9b&useremail=receivebox%40yeah.net&userschooldepartment=%e4%bf%a1%e6%81%af%e5%b7%a5%e7%a8%8b%e7%b3%bb&userschoolname=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&usersheng=&userface=&userPwdIsSimple=&EndTime=2020%2f4%2f21+22%3a30%3a01; scovalnemc=resval=6607ef4ff3f4a95c; Hm_lvt_61b06f0f5f937c411fb603f6b3f26d5a=1587377242,1587427704,1587441022,1587610859; ASP.NET_SessionId=lsi4oofo4i42e1dwhtqdwn0s;
         enet_studentCourseWareLearn5557067=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7067&student_id=666666&key=c34980024a6c13b7&finished=1&learn=&duration=0&iPlaySec=0; enet_studentCourseWareLearn5557080=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7080&student_id=666666&key=ab35255cde4142e2&finished=1&learn=0,181|182,361|&iPlaySec=0&duration=706; enet_studentCourseWareLearn5557079=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7079&student_id=666666&key=2e5a018b178d447c&finished=1&learn=&iPlaySec=0&duration=0; enet_studentCourseWareLearn5557082=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7082&student_id=666666&key=63bd6c5c15f5f12e&finished=1&learn=&iPlaySec=0&duration=0; enet_studentCourseWareLearn5557081=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7081&student_id=666666&key=dac814410523c3b0&finished=1&learn=&iPlaySec=0&duration=0; enet_studentCourseWareLearn5557083=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7083&student_id=666666&key=5c03525108a3c848&finished=0&learn=0,11|248,265|&iPlaySec=0&duration=991; enet_studentCourseWareLearn5557085=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=2&learn=&iPlaySec=0&duration=4203; Hm_lpvt_61b06f0f5f937c411fb603f6b3f26d5a=1587623461

response:
HTTP/1.1 200 OK
Cache-Control: private
Content-Length: 1515
Content-Type: text/xml; charset=utf-8
Server: Microsoft-IIS/8.5
X-AspNet-Version: 4.0.30319
X-AspNetMvc-Version: 4.0
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 06:33:05 GMT; path=/
X-Powered-By: ASP.NET
X-UA-Compatible: IE=EmulateIE7
X-frame-options: SAMEORIGIN
Date: Thu, 23 Apr 2020 06:33:05 GMT

===========================================================================================
flash每3分钟自动发送
response:
6分钟时，2020.4.23 13：18 网络请求(cookies:learn 0,181|182,361       1587619073942=2020-04-23 13:17:53 |)
http://onlinenew.enetedu.com/lnemc/VideoPlay/StudyRecode?orderid=0&student_id=666666&course_id=555&courseware_id=7085&is_elective=0&timestamp=1587626692293&end=1311&start=1130
HTTP/1.1 200 OK
Cache-Control: private
Content-Length: 0
Server: Microsoft-IIS/8.5
X-AspNet-Version: 4.0.30319
X-AspNetMvc-Version: 4.0
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 07:26:55 GMT; path=/
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 07:26:55 GMT; path=/
Set-Cookie: enet_studentCourseWareLearn5557085=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=0&learn=1130,1311|&iPlaySec=1126&duration=4203; path=/
X-Powered-By: ASP.NET
X-UA-Compatible: IE=EmulateIE7
X-frame-options: SAMEORIGIN
Date: Thu, 23 Apr 2020 07:26:55 GMT



http://onlinenew.enetedu.com/lnemc/VideoPlay/StudyRecode?orderid=0&student_id=666666&course_id=555&courseware_id=7080&is_elective=0&timestamp=1587619073942&end=361&start=182
request heads:
GET /lnemc/VideoPlay/StudyRecode?orderid=0&student_id=666666&course_id=555&courseware_id=7080&is_elective=0&timestamp=1587619073942&end=361&start=182 HTTP/1.1
Host: onlinenew.enetedu.com
Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36
DNT: 1
Accept: *
X-Requested-With: ShockwaveFlash/32.0.0.363
Referer: http://onlinenew.enetedu.com/lnemc/Common/VideoPlay?id=7080&orderid=0&courseid=555
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: LoginUrl=login_url=%2fIndex%2fFindPassWord; safedog-flow-item=5A4DBABA9292E32AD2E00786FE9F5D71; enet_studentname=id=666666; School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; LOGIN_VALIDATE_CODE_ONLINE=code=1971; USER_INFO_SESSION_FRONTlnemc=id=666666&userclass=&userclass_disp=&username=&usermyname=%e5%86%af%e6%b6%9b&useremail=receivebox%40yeah.net&userschooldepartment=%e4%bf%a1%e6%81%af%e5%b7%a5%e7%a8%8b%e7%b3%bb&userschoolname=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&usersheng=&userface=&userPwdIsSimple=&EndTime=2020%2f4%2f21+22%3a30%3a01; scovalnemc=resval=6607ef4ff3f4a95c; Hm_lvt_61b06f0f5f937c411fb603f6b3f26d5a=1587377242,1587427704,1587441022,1587610859; ASP.NET_SessionId=lsi4oofo4i42e1dwhtqdwn0s;
enet_studentCourseWareLearn5557067=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7067&student_id=666666&key=c34980024a6c13b7&finished=1&learn=&duration=0&iPlaySec=0;
enet_studentCourseWareLearn5557079=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7079&student_id=666666&key=2e5a018b178d447c&finished=1&learn=0,181|182,361|&iPlaySec=0&duration=475;
Hm_lpvt_61b06f0f5f937c411fb603f6b3f26d5a=1587618711;
enet_studentCourseWareLearn5557080=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7080&student_id=666666&key=ab35255cde4142e2&finished=0&learn=0,181|&iPlaySec=0&duration=706

response heads:
HTTP/1.1 200 OK
Cache-Control: private
Content-Length: 0
Server: Microsoft-IIS/8.5
X-AspNet-Version: 4.0.30319
X-AspNetMvc-Version: 4.0
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 05:19:57 GMT; path=/
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 05:19:57 GMT; path=/
Set-Cookie: enet_studentCourseWareLearn5557080=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7080&student_id=666666&key=ab35255cde4142e2&finished=1&learn=0,181|182,361|&iPlaySec=0&duration=706; path=/
X-Powered-By: ASP.NET
X-UA-Compatible: IE=EmulateIE7
X-frame-options: SAMEORIGIN
Date: Thu, 23 Apr 2020 05:19:57 GMT

response:
data:text/plain,

=================================================================================
播放6：18后，response结果：
HTTP/1.1 200 OK
Cache-Control: private
Content-Length: 0
Server: Microsoft-IIS/8.5
X-AspNet-Version: 4.0.30319
X-AspNetMvc-Version: 4.0
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 06:50:30 GMT; path=/
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 06:50:30 GMT; path=/
       Set-Cookie: enet_studentCourseWareLearn5557085=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=0&learn=0,181|182,361|&iPlaySec=0&duration=4203; path=/
X-Powered-By: ASP.NET
X-UA-Compatible: IE=EmulateIE7
X-frame-options: SAMEORIGIN
Date: Thu, 23 Apr 2020 06:50:29 GMT
刷新后结果：
http://onlinenew.enetedu.com/lnemc/MyTrainCourse/OnlineCourse?coursetype=3&orderid=0&id=555&coursewareid=7085
GET /lnemc/MyTrainCourse/OnlineCourse?coursetype=3&orderid=0&id=555&coursewareid=7085 HTTP/1.1
Host: onlinenew.enetedu.com
Connection: keep-alive
Cache-Control: max-age=0
DNT: 1
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*;q=0.8,application/signed-exchange;v=b3;q=0.9
Referer: http://onlinenew.enetedu.com/lnemc/MyTrainCourse/OnlineCourse?coursetype=3&orderid=0&id=555&coursewareid=7083
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: LoginUrl=login_url=%2fIndex%2fFindPassWord; safedog-flow-item=5A4DBABA9292E32AD2E00786FE9F5D71;      enet_studentname=id=666666; School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; LOGIN_VALIDATE_CODE_ONLINE=code=1971; USER_INFO_SESSION_FRONTlnemc=id=666666&userclass=&userclass_disp=&username=&usermyname=%e5%86%af%e6%b6%9b&useremail=receivebox%40yeah.net&userschooldepartment=%e4%bf%a1%e6%81%af%e5%b7%a5%e7%a8%8b%e7%b3%bb&userschoolname=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&usersheng=&userface=&userPwdIsSimple=&EndTime=2020%2f4%2f21+22%3a30%3a01; scovalnemc=resval=6607ef4ff3f4a95c; Hm_lvt_61b06f0f5f937c411fb603f6b3f26d5a=1587377242,1587427704,1587441022,1587610859; ASP.NET_SessionId=lsi4oofo4i42e1dwhtqdwn0s;
        enet_studentCourseWareLearn5557067=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7067&student_id=666666&key=c34980024a6c13b7&finished=1&learn=&duration=0&iPlaySec=0;
        enet_studentCourseWareLearn5557080=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7080&student_id=666666&key=ab35255cde4142e2&finished=1&learn=0,181|182,361|&iPlaySec=0&duration=706;
        enet_studentCourseWareLearn5557079=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7079&student_id=666666&key=2e5a018b178d447c&finished=1&learn=&iPlaySec=0&duration=0;
        enet_studentCourseWareLearn5557082=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7082&student_id=666666&key=63bd6c5c15f5f12e&finished=1&learn=&iPlaySec=0&duration=0;
        enet_studentCourseWareLearn5557081=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7081&student_id=666666&key=dac814410523c3b0&finished=1&learn=&iPlaySec=0&duration=0;
        enet_studentCourseWareLearn5557083=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7083&student_id=666666&key=5c03525108a3c848&finished=0&learn=0,11|248,265|&iPlaySec=0&duration=991;
       Hm_lpvt_61b06f0f5f937c411fb603f6b3f26d5a=1587623461;
            enet_studentCourseWareLearn5557085=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=0&learn=0,181|182,361|&iPlaySec=0&duration=4203

response heads:
HTTP/1.1 200 OK
Cache-Control: private
Content-Length: 13297
Content-Type: text/html; charset=utf-8
Server: Microsoft-IIS/8.5
X-AspNet-Version: 4.0.30319
X-AspNetMvc-Version: 4.0
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 06:53:26 GMT; path=/
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 06:53:26 GMT; path=/
Set-Cookie: enet_studentname=id=666666; expires=Fri, 24-Apr-2020 06:53:26 GMT; path=/
         Set-Cookie: enet_studentCourseWareLearn5557085=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7085&student_id=666666&key=b8774914d995d9e3&finished=0&learn=&iPlaySec=360&duration=4203; path=/
X-Powered-By: ASP.NET
X-UA-Compatible: IE=EmulateIE7
X-frame-options: SAMEORIGIN
Date: Thu, 23 Apr 2020 06:53:26 GMT
===================================================================================
手动跳转
http://onlinenew.enetedu.com/lnemc/VideoPlay/StudyRecode?orderid=0&student_id=666666&course_id=555&courseware_id=7083&is_elective=0&timestamp=1587623296161&end=265&start=248
request heads:
GET /lnemc/VideoPlay/StudyRecode?orderid=0&student_id=666666&course_id=555&courseware_id=7083&is_elective=0&timestamp=1587623296161&end=265&start=248 HTTP/1.1
Host: onlinenew.enetedu.com
Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36
DNT: 1
Accept: /*
X-Requested-With: ShockwaveFlash/32.0.0.363
Referer: http://onlinenew.enetedu.com/lnemc/Common/VideoPlay?id=7083&orderid=0&courseid=555
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: LoginUrl=login_url=%2fIndex%2fFindPassWord; safedog-flow-item=5A4DBABA9292E32AD2E00786FE9F5D71; enet_studentname=id=666666; School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; LOGIN_VALIDATE_CODE_ONLINE=code=1971; USER_INFO_SESSION_FRONTlnemc=id=666666&userclass=&userclass_disp=&username=&usermyname=%e5%86%af%e6%b6%9b&useremail=receivebox%40yeah.net&userschooldepartment=%e4%bf%a1%e6%81%af%e5%b7%a5%e7%a8%8b%e7%b3%bb&userschoolname=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&usersheng=&userface=&userPwdIsSimple=&EndTime=2020%2f4%2f21+22%3a30%3a01; scovalnemc=resval=6607ef4ff3f4a95c; Hm_lvt_61b06f0f5f937c411fb603f6b3f26d5a=1587377242,1587427704,1587441022,1587610859; ASP.NET_SessionId=lsi4oofo4i42e1dwhtqdwn0s; enet_studentCourseWareLearn5557067=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7067&student_id=666666&key=c34980024a6c13b7&finished=1&learn=&duration=0&iPlaySec=0; enet_studentCourseWareLearn5557080=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7080&student_id=666666&key=ab35255cde4142e2&finished=1&learn=0,181|182,361|&iPlaySec=0&duration=706; enet_studentCourseWareLearn5557079=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7079&student_id=666666&key=2e5a018b178d447c&finished=1&learn=&iPlaySec=0&duration=0; enet_studentCourseWareLearn5557082=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7082&student_id=666666&key=63bd6c5c15f5f12e&finished=1&learn=&iPlaySec=0&duration=0; enet_studentCourseWareLearn5557081=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7081&student_id=666666&key=dac814410523c3b0&finished=1&learn=&iPlaySec=0&duration=0; Hm_lpvt_61b06f0f5f937c411fb603f6b3f26d5a=1587623268; enet_studentCourseWareLearn5557083=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7083&student_id=666666&key=5c03525108a3c848&finished=0&learn=0,11|&iPlaySec=0&duration=991

response heads:
HTTP/1.1 200 OK
Cache-Control: private
Content-Length: 0
Server: Microsoft-IIS/8.5
X-AspNet-Version: 4.0.30319
X-AspNetMvc-Version: 4.0
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 06:30:19 GMT; path=/
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 06:30:19 GMT; path=/
Set-Cookie: enet_studentCourseWareLearn5557083=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7083&student_id=666666&key=5c03525108a3c848&finished=0&learn=0,11|248,265|&iPlaySec=0&duration=991; path=/
X-Powered-By: ASP.NET
X-UA-Compatible: IE=EmulateIE7
X-frame-options: SAMEORIGIN
Date: Thu, 23 Apr 2020 06:30:19 GMT

====================================================================================
提交问题后：
http://onlinenew.enetedu.com/lnemc/VideoPlay/AddStudentQuestion?orderid=0&student_id=666666&course_id=555&courseware_id=7082&is_elective=0&qid=1&qnum=&qtext=   (10分钟后的第1个问题)
http://onlinenew.enetedu.com/lnemc/VideoPlay/AddStudentQuestion?orderid=0&student_id=666666&course_id=555&courseware_id=7082&is_elective=0&qid=2&qnum=&qtext=   (20分钟后的第2个问题)
http://onlinenew.enetedu.com/lnemc/VideoPlay/AddStudentQuestion?orderid=0&student_id=666666&course_id=555&courseware_id=7082&is_elective=0&qid=3&qnum=&qtext=   (30分钟后的第3个问题)
request heads:
GET /lnemc/VideoPlay/AddStudentQuestion?orderid=0&student_id=666666&course_id=555&courseware_id=7082&is_elective=0&qid=1&qnum=&qtext= HTTP/1.1
Host: onlinenew.enetedu.com
Connection: keep-alive
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36
DNT: 1
Accept: *
X-Requested-With: ShockwaveFlash/32.0.0.363
Referer: http://onlinenew.enetedu.com/lnemc/Common/VideoPlay?id=7082&orderid=0&courseid=555
Accept-Encoding: gzip, deflate
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Cookie: LoginUrl=login_url=%2fIndex%2fFindPassWord; safedog-flow-item=5A4DBABA9292E32AD2E00786FE9F5D71; enet_studentname=id=666666; School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; LOGIN_VALIDATE_CODE_ONLINE=code=1971; USER_INFO_SESSION_FRONTlnemc=id=666666&userclass=&userclass_disp=&username=&usermyname=%e5%86%af%e6%b6%9b&useremail=receivebox%40yeah.net&userschooldepartment=%e4%bf%a1%e6%81%af%e5%b7%a5%e7%a8%8b%e7%b3%bb&userschoolname=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&usersheng=&userface=&userPwdIsSimple=&EndTime=2020%2f4%2f21+22%3a30%3a01; scovalnemc=resval=6607ef4ff3f4a95c; Hm_lvt_61b06f0f5f937c411fb603f6b3f26d5a=1587377242,1587427704,1587441022,1587610859; ASP.NET_SessionId=lsi4oofo4i42e1dwhtqdwn0s; enet_studentCourseWareLearn5557067=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7067&student_id=666666&key=c34980024a6c13b7&finished=1&learn=&duration=0&iPlaySec=0; enet_studentCourseWareLearn5557080=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7080&student_id=666666&key=ab35255cde4142e2&finished=1&learn=0,181|182,361|&iPlaySec=0&duration=706; enet_studentCourseWareLearn5557079=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7079&student_id=666666&key=2e5a018b178d447c&finished=1&learn=&iPlaySec=0&duration=0; enet_studentCourseWareLearn5557082=coursewave_percent=0.50&course_id=555&subject_id=12&courseware_id=7082&student_id=666666&key=63bd6c5c15f5f12e&finished=0&learn=&iPlaySec=540&duration=2636; Hm_lpvt_61b06f0f5f937c411fb603f6b3f26d5a=1587619688

response heads:
HTTP/1.1 200 OK
Cache-Control: private
Content-Length: 0
Server: Microsoft-IIS/8.5
X-AspNet-Version: 4.0.30319
X-AspNetMvc-Version: 4.0
Set-Cookie: School_INFO_COOKIE_FRONTlnemc=id=198091&page_end=2020&logo_img_url=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002170826226574%2f3bc7d7bec8b9462a8d276c06f0903ac8.png&is_ip_astrict=1&school_name=%e8%be%bd%e5%ae%81%e7%bb%8f%e6%b5%8e%e7%ae%a1%e7%90%86%e5%b9%b2%e9%83%a8%e5%ad%a6%e9%99%a2&small_log=http%3a%2f%2fresfile.enetedu.com%2fuploadFile%2f12%2f202002%2f202002160738176398%2f354da089707341cda9eee6793bae129e.png&school_id=0&credit_max=10&approvaled_type=1&certificate_max_school=0&certificate_max_individual=0&page_end_2=%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_3=%e5%8c%97%e4%ba%ac%e5%b8%82%e8%a5%bf%e5%9f%8e%e5%8c%ba%e5%be%b7%e5%a4%96%e5%a4%a7%e8%a1%974%e5%8f%b7%e5%85%a8%e5%9b%bd%e9%ab%98%e6%a0%a1%e6%95%99%e5%b8%88%e7%bd%91%e7%bb%9c%e5%9f%b9%e8%ae%ad%e4%b8%ad%e5%bf%83&page_end_4=400-6699-800&page_end_5=peixun%40enetedu.com&isalow_or_forbidden=0&department_name=&school_teacheronline=%e9%99%a2%e6%a0%a1%e5%ad%a6%e4%b9%a0%e4%b8%ad%e5%bf%83&web_url=onlinenew.enetedu.com%2flnemc&credit_type=1&is_departmentmanage=0&if_special_course=0&is_gangqian=0&theme_style=2&customproject_ids=&roles_arr=1%2c2%2c3%2c4&print_type=2&is_college=0&is_addmodule=0; expires=Fri, 24-Apr-2020 05:32:35 GMT; path=/
X-Powered-By: ASP.NET
X-UA-Compatible: IE=EmulateIE7
X-frame-options: SAMEORIGIN
Date: Thu, 23 Apr 2020 05:32:34 GMT

response:
data:text/plain,

================================================================================================

flash :
http://onlinenew.enetedu.com/lnemc/VideoPLay/IndexNew?0&coursewareid=7090&courseid=555&orderid=0&is_elective=0&1587471171600

<r>
<times> </times>
<data>
<trackData sec="180"/>
<trackUrl>
/lnemc/VideoPlay/StudyRecode?orderid=0&student_id=666666&course_id=555&courseware_id=7090&is_elective=0
</trackUrl>
<questionsUrl>
/lnemc/VideoPlay/AddStudentQuestion?orderid=0&student_id=666666&course_id=555&courseware_id=7090&is_elective=0
</questionsUrl>
<videoRate> </videoRate>
<videoData>
<i iid="gx25132" lastSec="0" url="http://hapi.enetedu.com/hep/list/iid?dl_link&[HI]"/>
</videoData>
<questionsData>
<i type="button" t="是否还在学习？" answered="0" sec="600" id="1" ct="0" righta="1" diy="0">
<item v="1">是</item>
</i>
<i type="button" t="是否还在学习？" answered="0" sec="1200" id="2" ct="0" righta="1" diy="0">
<item v="1">是</item>
</i>
</questionsData>
</data>
</r>

===================================================================================================


location.href='/lnemc/MyTrainCourse/OnlineCourse?coursetype=3&orderid=0&id=555&coursewareid=7067'

在脚本中定义函数function abc(){ alert("helloWorld"); },注入onclick事件<a id="a" onclick="abc();">HelloWorld</a>。 爆出函数未定义的错误Function is not defined。
在mozillazine了解到Tampermonkey的js脚本是在sandbox中的，在html中访问不到。 使用下面的例子可以完成这个功能
unsafeWindow.abc = function(msg) {
  alert(msg);
};
document.getElementById("a").onclick = "window.abc('helloWorld')";

推荐的一些可能会常用的模块
Github	BootCDN	用途
jquery-pjax	Link	为页面添加 pjax 支持
jquery-mousewheel	Link	为 jQuery 添加鼠标滚轮事件的支持
FileSaver.js	Link	另存为任意 blob 为文件
jszip	Link	读写创建压缩文件
gif.js	Link	制作 gif，支持 worker 方式
clipboard.js	Link	虽然油猴提供剪贴板 API，但该模块可以提供一些扩展功能，例如 tooltips 反馈等
dragula	Link	提供页面元素的拖拽调序功能
toastr	Link	方便的显示页内通知
*/



})();