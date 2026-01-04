// ==UserScript==
// @name         国开自动刷课
// @namespace    ry版
// @version      202310081507
// @description  国家开放大学自动刷课，登陆后进入学习空间“我的课程”自动开始学习
// @author       流浪的蛊惑
// @match        *://lms.ouchn.cn/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416433/%E5%9B%BD%E5%BC%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/416433/%E5%9B%BD%E5%BC%80%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
var ginfo=document.getElementsByClassName("teaching-class-header card")[0],gpro=0,st=0;
function GetSemesters(){//获取学期列表
    $.ajax({
        method:"GET",
        url:"/api/my-semesters",
        success:function(j){
            GetCourses(j.semesters[0].id);
        }
    });
}
function GetCourses(semester_id){//获取课程列表
    $.ajax({
        method:"GET",
        url:"/api/my-courses?conditions=%7B%22semester_id%22:%5B%22"+semester_id+"%22%5D,\"status\":%5B\"ongoing\"%5D,\"keyword\":\"\"%7D&fields=id,name,course_code,department(id,name),grade(id,name),klass(id,name),course_type,cover,small_cover,start_date,end_date,is_started,is_closed,academic_year_id,semester_id,credit,compulsory,second_name,display_name,created_user(id,name),org(is_enterprise_or_organization),org_id,public_scope,course_attributes(teaching_class_name,copy_status,tip,data),audit_status,audit_remark,can_withdraw_course,imported_from,allow_clone,is_instructor,is_team_teaching,academic_year(id,name),semester(id,name),instructors(id,name,email,avatar_small_url),is_master,is_child,has_synchronized,master_course(name)&page=1&page_size=50",
        success:function(j){
            for(let i=0;i<j.courses.length;i++){
                st += 500 + Math.floor(Math.random() * 1000);
                setTimeout(()=>{GetCompleteness(j.courses[i].id)},st);
            }
        }
    });
}
function GetCompleteness(id){//获取已完成列表
    $.ajax({
        method:"GET",
        url:"/api/course/"+id+"/my-completeness",
        success:function(j){
            GetModules(id,j.completed_result.completed.learning_activity);
        }
    });
}
function GetModules(id,ywc){//获取模块列表
    $.ajax({
        method:"GET",
        url:"/api/courses/"+id+"/modules",
        success:function(j){
            for(let i=0;i<j.modules.length;i++){
                GetActivities(id,j.modules[i].id,ywc);
            }
        }
    });
}
function GetActivities(kid,id,ywc){//获取模块列表
    $.ajax({
        method:"GET",
        url:"/api/course/"+kid+"/all-activities?module_ids=["+id+"]&activity_types=learning_activities,exams,classrooms,live_records,rollcalls&no-loading-animation=true",
        success:function(j){
            for(let i=0;i<j.learning_activities.length;i++){
                if(ywc.join(",").indexOf(j.learning_activities[i].id)==-1){
                    st += 3000 + Math.floor(Math.random() * 2000);
                    gpro++;
                    setTimeout(()=>{PostActivities(j.learning_activities[i].uploads,j.learning_activities[i].id)},st);
                }
            }
        }
    });
}
function PostActivities(uploads,id){//获取模块列表
    let str="{}";
    if(uploads.length>0){
        if(uploads[0].videos.length>0){
            str="{\"start\":0,\"end\":"+uploads[0].videos[0].duration+"}"
        }
    }
    $.ajax({
        method:"POST",
        url:"/api/course/activities-read/"+id,
        data:str,
        contentType:"application/json",
        dataType:"json",
        success:function(j){
            gpro--;
            ginfo.innerHTML="<span style=\"color:blue;\"> 学习剩余数："+gpro+"</span>";
            console.log(str+"="+j.completeness);
        }
    });
}
(function() {
    'use strict';
    if(location.href.indexOf("/user/courses")>-1){
        ginfo.innerHTML="<span style=\"color:red;\">学习初始化中(请等待2分钟左右)……</span>";
        GetSemesters();
    }
})();