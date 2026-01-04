// ==UserScript==
// @name         医博士网站自动练一练提交答案
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  try to take over the world!
// @author       Lvhailong
// @match        http://www.yiboshi.com/usercenter/index
// @icon         https://lovbe-lvyiclub.oss-cn-beijing.aliyuncs.com/pic/c.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428589/%E5%8C%BB%E5%8D%9A%E5%A3%AB%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%BB%83%E4%B8%80%E7%BB%83%E6%8F%90%E4%BA%A4%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/428589/%E5%8C%BB%E5%8D%9A%E5%A3%AB%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%BB%83%E4%B8%80%E7%BB%83%E6%8F%90%E4%BA%A4%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    var jqueryScript=document.createElement('script');//创建script标签节点
    jqueryScript.setAttribute('type','text/javascript');//设置script类型
    jqueryScript.setAttribute('src','http://libs.baidu.com/jquery/2.0.0/jquery.min.js');//设置js地址
    document.body.appendChild(jqueryScript);//将js追加为body的子标签

    //判断jqueryScript是否加载成功
    jqueryScript.onload=jqueryScript.onreadystatechange=function(){
        //如果jqueryScript加载成功则创建script2引入，这样就不会由于后面的js依赖前面的js导致后面的js先加载而导致程序报错
        if(!this.readyState||this.readyState=='loaded'||this.readyState=='complete'){
            $(document).ready(function(){
                //alert("你好");
                // 刷新页面或重新加载时先清除缓存信息
                window.sessionStorage.clear();
                // 先从sessionStorage中获取用户信息，如果没有则发起异步请求
                var userId = window.sessionStorage.getItem("userId");
                var token = "";
                // 获取我的课程计划分类,同样先从缓存中取
                var subList = JSON.parse(window.sessionStorage.getItem("subList"));
                // 定义当前分类训练的id和name
                var curTrainId = "";
                var curTrainName = "";
                var projectList;
                if(userId === undefined || userId === null || userId.length === 0){
                    // 说明没有缓存，进行异步请求然后放进缓存中
                    // 从localStorage中获取用户的token信息
                    var tokenString = window.localStorage.getItem("www_5HGGWrXN_token");
                    // 去掉两头的双引号然后再拼接OAuth2.0认证的token类型Bearer
                    token = tokenString.substring(0,tokenString.length-1);
                    token = tokenString.substring(1,tokenString.length);
                    token = "Bearer " + token;
                    $.ajax
                    ({
                        type: "POST",
                        async: false,
                        url: "https://apicloud.yiboshi.com/gw/v1/authorizations/jwt",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization',token);
                        },
                        success: function(data) {
                            userId = data.userInfo.id;
                            // 同时放进缓存中
                            window.sessionStorage.setItem("userId",userId);
                            // 如果课程分类在缓存中获取不到继续ajax请求获取
                            if(subList === undefined || subList === null || subject.length === 0){
                                getSubList();
                            }
                        }
                    });
                }


                /**
                 *   定义提交分数的方法
                 */
                window.submitScore = function (courseName){
                    // 先利用projectName获取到具体的projectId和courseId
                    for(var i = 0;i < projectList.length; i++){
                        var project = projectList[i];
                        for(var j = 0;j < project.courseList.length; j++){
                            var course = (project.courseList)[j];
                            if(course.name === courseName){
                                // 找到正主，发送ajax请求直接保存分数
                                // 判断下是否已经看了检测到异常
                                if(course.ybsCourseState === undefined || course.ybsCourseState.courseState == 0){
                                   alert("请先看完视频再提交练习分数");
                                   return false;
                                }
                                $.ajax
                                ({
                                    type: "GET",
                                    async: false,
                                    url: "https://api.yiboshi.com/api/WebApp/commitCoursePracticeScore?" +
                                    "trainingId="+ curTrainId +
                                    "&projectId="+ project.id +
                                    "&userId="+ userId +
                                    "&courseId="+ course.id +
                                    "&score=100&versionId=3.1&courseFieldId="+ course.courseFieldID +
                                    "&examStartTime="+ new Date().getTime() +
                                    "&questionNum=10&correctQuestionNum=0",
                                    beforeSend: function (xhr) {
                                        xhr.setRequestHeader('Authorization',token);
                                    },
                                    success: function(data) {
                                        alert("提交成功，刷新即可显示最新结果");
                                    }
                                });
                                return false;
                            }
                        }
                    }
                }
                /**
                 *   定义获取课程分类列表的ajax请求
                 */
                function getSubList(){
                    $.ajax
                    ({
                        type: "GET",
                        async: false,
                        url: "https://api.yiboshi.com/api/study/student/listStudentTrainingApp?userId="+userId+"&excludeExpire=true&trainingWay=1",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader('Authorization',token);
                        },
                        success: function(data) {
                            subList = data.data.list;
                            // 放进缓存,这一这里需要序列化
                            var subListstr = JSON.stringify(subList);
                            window.sessionStorage.setItem("subList",subListstr);
                        }
                    });
                }
                /**
                 *  方法定义
                 *  当选择不同的课程分类时自动触发选择当前的课程分类id，然后异步查询当前课程分类下的所有课程列表
                 *  数据同样放到缓存中
                 */
                function onChoseSub(){
                    curTrainName = $("div[class='nupt_main'] a[class='nupt_main_sel']").html();
                    // 遍历课程分类，找出对应的trainId
                    for(var i = 0;i < subList.length; i++){
                        if(subList[i].name === curTrainName){
                            curTrainId = subList[i].id;
                            break;
                        }
                    }
                    // 这里先判断当前分类的课程有没有存进缓存，如果没有再进行ajax请求
                    projectList = JSON.parse(window.sessionStorage.getItem("projectList" + curTrainId));
                    if(projectList === undefined || projectList === null || projectList.length === 0){
                        $.ajax
                        ({
                            type: "GET",
                            async: false,
                            url: "https://api.yiboshi.com/api/study/student/listStudentProjCourseInfoAndStatus?userId=" + userId + "&trainingId=" + curTrainId + "&courseState=&compulsory=&keyword=",
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader('Authorization',token);
                            },
                            success: function(data) {
                                projectList = data.data.list;
                                // 放进缓存,先进行序列化
                                var projectListstr = JSON.stringify(projectList);
                                window.sessionStorage.setItem("projectList" + curTrainId, projectListstr);
                            }
                        });
                    }
                    // 遍历DOM树，添加自动练一练
                    var projectTR = $("tbody tr:not(:first-child)");
                    for(var x = 0;x < projectTR.length;x++){
                        // 为每一个tr元素添加自动练一练按钮
                        var curprojectTR = projectTR[x];
                        var curprojectTD = curprojectTR.children[4];
                        if(curprojectTD.innerHTML === "课程状态"){
                            continue;
                        }
                        var curProjectName = curprojectTR.children[1].innerText;
                        // 先创建td标签，然后再内嵌a标签，然后再给td标签设置一个点击事件
                        //var newTD = document.createElement("td");
                        //var a = document.createElement("a");
                        //var text = document.createTextNode(curprojectTD.innerHTML);
                        //a.appendChild(text);
                        //newTD.appendChild(a);
                        curprojectTD.setAttribute("title","快速练一练");
                        curprojectTD.setAttribute("style","background:rgba(73, 199, 185, 0.85);");
                        curprojectTD.setAttribute("onclick","submitScore('"+ curProjectName +"')");
                        //curprojectTR.replaceChild(newTD ,curprojectTD);
                    }
                };
                // 这里页面进来默认调用一次，获取课程列表
                //onChoseSub();
                setTimeout(() => {
                    onChoseSub();
                }, 5000)
                // 给课程分类元素绑定点击事件，自动更新当前课程分类和名称以及课程列表
                $("div[class='nupt_main']").on("click", "a", function() {
                    // 这里需要延时等待页面加载完成，要不然获取不到当前课程分类的dom元素，如果依然不能生成快速练一练按钮，可将这里的时间调大一点
                    setTimeout(function () {
                        projectList = undefined;
                        onChoseSub();
                    }, 800);
                });
            });
        }
    }
})();