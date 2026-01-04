// ==UserScript==
// @name         宁夏禁毒平台自动完成
// @namespace    http://foolplay.houtu.top/
// @version      0.2
// @description  接管你的浏览器来自动完成禁毒平台作业
// @author       Foolplay
// @match        http://www.626-class.com/*
// @match        https://www.626-class.com/*
// @match        http://study.626-class.com/*
// @match        https://study.626-class.com/*
// @match        http://exam.626-class.com/*
// @match        https://exam.626-class.com/*
// @match        http://resource.626-class.com/*
// @match        https://resource.626-class.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423772/%E5%AE%81%E5%A4%8F%E7%A6%81%E6%AF%92%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/423772/%E5%AE%81%E5%A4%8F%E7%A6%81%E6%AF%92%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90.meta.js
// ==/UserScript==

(function() {
    const resPagesPerfix = "https://resource.626-class.com/front/viewRes/";
    const resPageList = [62936,62943,62919,62787,62073,62123,62112,61182,61091,61092,61089,60790];
    //工具函数：等待一段时间
    function sleep(time) {
        return new Promise(function (done) {
            setTimeout(done, time);
        });
        return null;
    }
    var isRun = false;

    //工具函数：在匹配指定网址的时候执行。
    function match(regexp,fn){
        if(!isRun && location.href.search(regexp) > 0){
            fn();
            isRun = true;
        }
    }

    function onload (){
        var $ = window.jQuery;

        //学生主页面：检查是否有任务未完成。
        match("www.626-class.com/xuesheng/student.html",function(){
            var $taskList = $(".xfgz");
            //检查任务
            for(var i = 0; i <= 2; i++){
                if($taskList.eq(i).text().indexOf("100%") == -1){
                    $taskList.eq(i).find(".btna")[0].click();
                    return;
                }
            }
        });

        //学习课程页面：点击以进一步进入学习
        match("study.626-class.com/home/course_info.html",function(){
            $("#study").click();
        });

        //视频播放页面：强制快进至最后并灌水
        match("/uc/play/",function(){
            var tid = setInterval(function(){
                try{
                    var $remark = $("#cStar").closest(".dialogWrap");
                    $remark.find("a")[5].click();
                    $remark.find("#commentContent").val("很好，从这个课程我学到了很多。真心的。")[0].oninput();
                    $remark.find("a").eq(-1)[0].click();
                }catch(e){}
                if($("video")[0].paused){
                    return;
                }
                $("video")[0].currentTime = $("video")[0].duration;
            },100);
        });

        //考试页面：利用网站错误API得到试卷答案，并且提交
        match("front/ajax/getPaperHtml",function(){
            $( document ).ajaxSuccess(function(event, xhr, settings){
                if(settings.url.indexOf("/front/ajax/getPaper") != -1){
                    //自动化答卷
                    var data = JSON.parse(xhr.responseText).entity.map(function(e){
                        return e.examOption.rightAnswer;
                    });
                    data.forEach(function(ans,id){
                        id = id + 1;
                        $(`#shiti-${id}-${ans} input`)[0].click();
                        $(`#shiti-${id}-${ans}`)[0].onclick();
                    });
                    //网页代码：交卷
                    window.jiaojuan();
                    //点击确认：延时以防止服务器“挂掉”。
                    setTimeout(function(){$(".layui-layer-btn0")[0].click();},1000);
                }
            });
            window.getShiti();
        });

        //学习资源：打开一个页面并等5秒
        match("home/resource_list.html",async function(){
            var pid;
            localStorage.pid = 0;
            window.location = resPagesPerfix + resPageList[0];
        });

        //资源查看：8秒后自动返回
        match("resource.626-class.com/front/viewRes/",function(){
            setTimeout(function(){
                var pid = parseInt(localStorage.pid) + 1;
                if(pid != pid){
                    pid = 1;
                }
                localStorage.pid = pid;
                if(resPageList[pid]){
                    window.location = resPagesPerfix + resPageList[pid];
                }else{
                    window.location = "https://www.626-class.com/xuesheng/student.html";
                }
            },8000)
        });
    }
    //保证在任何情况任何糟糕的脚本管理器下都能加载。
    window.addEventListener("load",onload);
    setTimeout(onload,4000);
})();