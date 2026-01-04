// ==UserScript==
// @name         Auto Finish
// @namespace    http://tampermonkey.net/
// @version      0.1.8
// @description  try to take over the world!
// @author       You
// @match        http://*.ouchn.cn/*
// @grant        none
// @run-at       document-idle
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/402605/Auto%20Finish.user.js
// @updateURL https://update.greasyfork.org/scripts/402605/Auto%20Finish.meta.js
// ==/UserScript==



(function() {
    'use strict';

    // Your code here...
    var cur_page_url = location.href;
    window.start = false;
window.startTask = function(){
    //$("#some-tip").show();
    $("#btn-start").hide();
    document.querySelectorAll(".btn.bg-primary")[0].click();
    window.start = true;
}

        var tip_html = "<div id='some-tip' style='z-index:9999;position: fixed;background: red;color: white;font-size: 50px;top: 0;display:none;'>正在自动学习中，请勿关闭此页面(<span id='course_progress'><span>)</div>";
        var ctrl_html = '<div style="z-index: 9999;position: absolute;top: 100px;background: black;color: red;font-size: 37px;">' +
    '<p id="oper-tip">点击下方按钮，开始自动学习，请勿关闭自动开启的页面</p>' +
    '<button id="btn-start" type="button" style="' +
    'margin: 30px 140px;' +
    'cursor: pointer;' +
'" onclick="startTask()">开始自动学习</button>' +
    '<br>总课程数：<span id="total-task"></span>' +

    '<br>' +
    '当前学习任务完成情况：<span id="progress"></span>' +
'</div>';

    var audio = document.createElement('audio');
    audio.src = 'http://downsc.chinaz.net/Files/DownLoad/sound1/202003/12681.mp3';
    audio.loop = "loop";
    //document.body.appendChild(audio);
        $("body").append(tip_html);
    //$("body").append(audio_html);

    setTimeout(function(){
        cur_page_url = location.href;
        console.log(cur_page_url)
        if (cur_page_url.indexOf('home') >= 0 && cur_page_url.indexOf('student') >= 0){
            $("body").append(ctrl_html);
            var arr_total_course = document.querySelectorAll(".btn.bg-primary");
            if (arr_total_course.length > 0){
                $('#total-task').html("1/" + arr_total_course.length);
            }
            var course_index = 0;
            Cookie.erase("currentTask");
            Cookie.erase("finish");

            //check current task condition
            setInterval(function(){
                var currentTask = Cookie.get("currentTask");
                var task_status = Cookie.get('finish');
                console.log(currentTask);
                if (!window.start){
                    return;
                }
                if (currentTask){
                    $("#progress").html(currentTask);
                }
                if (task_status == 'true'){
                    course_index++;
                    if (course_index >= arr_total_course.length){
                        audio.play();
                        $("#oper-tip").html("全部课程学习完成！！！");
                        return;
                    }
                    arr_total_course[course_index].click();
                }
            }, 4000);
        }
    }, 3000);


    var Cookie =
        {
            set: function(name, value, days)
            {
                var domain, domainParts, date, expires, host;

                if (days)
                {
                    date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    expires = "; expires="+date.toGMTString();
                }
                else
                {
                    expires = "";
                }

                host = location.host;
                if (host.split('.').length === 1)
                {
                    // no "." in a domain - it's localhost or something similar
                    document.cookie = name+"="+value+expires+"; path=/";
                }
                else
                {
                    // Remember the cookie on all subdomains.
                    //
                    // Start with trying to set cookie to the top domain.
                    // (example: if user is on foo.com, try to set
                    //  cookie to domain ".com")
                    //
                    // If the cookie will not be set, it means ".com"
                    // is a top level domain and we need to
                    // set the cookie to ".foo.com"
                    domainParts = host.split('.');
                    domainParts.shift();
                    domain = '.'+domainParts.join('.');

                    document.cookie = name+"="+value+expires+"; path=/; domain="+domain;

                    // check if cookie was successfuly set to the given domain
                    // (otherwise it was a Top-Level Domain)
                    if (Cookie.get(name) == null || Cookie.get(name) != value)
                    {
                        // append "." to current domain
                        domain = '.'+host;
                        document.cookie = name+"="+value+expires+"; path=/; domain="+domain;
                    }
                }
            },
            get: function(name)
            {
                var nameEQ = name + "=";
                var ca = document.cookie.split(';');
                for (var i=0; i < ca.length; i++)
                {
                    var c = ca[i];
                    while (c.charAt(0)==' ')
                    {
                        c = c.substring(1,c.length);
                    }

                    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
                }
                return null;
            },

            erase: function(name)
            {
                Cookie.set(name, '', -1);
            }
        }
    
    var course_page = "http://hubei.ouchn.cn/course/view.php";
    var all_href = [];
    var contain_video = false;
    if (cur_page_url.indexOf(course_page) >= 0){
        $("#some-tip").show();
        var list_course_url = []//document.querySelectorAll(".section.main.aft a");
        var inner_course_list = Array.from(document.querySelectorAll(".section-title a"));

        for (var i = 0; i < list_course_url.length; ++i){
        //for (var i = 0; i < 0; ++i){
            var course_ele = list_course_url[i];
            console.log(i, course_ele.href);
            all_href.push(course_ele.href);
            //$.get("http://hubei.ouchn.cn/mod/url/view.php?id=555869", function(res){
            //    console.log(res)
            //})
            //completed_course(course_ele.href);
        }
        var url_outer = document.querySelectorAll(".mod-indent-outer");
        list_course_url = document.querySelectorAll(".mod-indent-outer a");
        if (url_outer.length > list_course_url.length){//must learn by order
            console.log(url_outer.length, list_course_url.length);
        }
        for (var j = 0; j < list_course_url.length; ++j){
        //for (var j = 0; j < 5; ++j){
            var course_ele1 = list_course_url[j];
            console.log(j, course_ele1.href);
            //if (course_ele1.href.indexOf('resource') >= 0){
            //    console.log("resource file, skip");
            //    continue;
            //}
            if (course_ele1.parentElement.tagName == "STRONG"){
                console.log("contain unfinished video");
                contain_video = true;
                continue;
            }
            if (course_ele1.parentElement.nextElementSibling && course_ele1.parentElement.nextElementSibling.outerHTML.indexOf("已完成") < 0){
                if (course_ele1.parentElement.nextElementSibling.outerHTML.indexOf("视频") >= 0){
                    console.log("contain unfinished video");
                    contain_video = true;
                    if (course_ele1.href.indexOf('forum') >= 0){
                        console.log("It's a forum course!");
                        contain_video = false;
                    }
                }

                all_href.push(course_ele1.href);
                console.log("未完成")
            }
            
            //completed_course(course_ele1.href);
        }

        if (inner_course_list.length > 0){
            $("#some-tip").html("本课程不支持自动学习");
            Cookie.set('finish', 'true');
            return;
            var timer1 = setInterval(function(){
                if (inner_course_list.length < 1){window.clearInterval(timer1);return;}
                var item = inner_course_list.shift();
                window.open(item.href);
            },3000);
            return;
        }

        var unfinished_num = localStorage.getItem("LastUnfinished");//get last unfinished task,if after refresh ,the num still the same,means some course can not be set to finish!
        var all_task_len = all_href.length;
        if (!contain_video && unfinished_num == all_task_len){
            console.log("ALL TASK FINISHED!!!--------------------------------------------------------------------ready to close!!!!");
            $("#some-tip").html("本课程已学习完成，可以关闭此窗口");
            Cookie.set('finish', 'true');
            //window.close();
            return;
        }
        Cookie.set('finish', 'false');
        console.log(all_task_len + " task left!!!!!!!!!!");
        localStorage.setItem("LastUnfinished", all_task_len);

        if (all_href.length > 0){
            all_task_len = list_course_url.length;
            var timer = setInterval(function(){
                if (all_href.length < 1){window.clearInterval(timer);console.log("ALL TASK FINISHED!!!refresh");location.reload();return;}
                var a = all_href.shift();
                Cookie.set('currentTask', (all_task_len - all_href.length) + ' / ' + all_task_len);
                $("#course_progress").html((all_task_len - all_href.length) + ' / ' + all_task_len);
                Cookie.set('finish', 'false');
                console.log("======", a);

                completed_course(a);
            }, 10000);
        }



        function GetQueryString(url, name)
        {
            if (url.split('?').length != 2){
                return null;
            }
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");

            var r = url.split('?')[1].match(reg);
            if(r!=null)return unescape(r[2]); return null;
        }


        function completed_course(url){
            if (url.indexOf('quiz') >= 0)
            {
                var win = window.open(url);
setTimeout (function () {  //定时器
    if (win.closed) {
        console.log("创建的窗口已经关闭。");
    } else {
        win.close();
    }
}, 2000);
                return;//some file cause page dead
             }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.onload = function () {
                console.log(xhr.responseURL);
                var redirect_url = xhr.responseURL;
                var redirect_param = redirect_url.split('&');
                if (redirect_param.length == 3){
                    var cmid = GetQueryString(redirect_url, 'mid');
                    var id = GetQueryString(redirect_url, 'id');
                    var sectionid = GetQueryString(redirect_url, 'sectionid');
                    if (cmid == null || id == null || sectionid == null){
                        return;
                    }
                    $.get("http://hubei.ouchn.cn/theme/blueonionre/modulesCompletion.php",{cmid:cmid,id:id,sectionid:sectionid},function(res){console.log("request completion return: ",res)})
                }
            };
            xhr.send()
        }
    }







})();