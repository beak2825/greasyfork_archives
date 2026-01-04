// ==UserScript==
// @name         training_sac
// @namespace    http://training.sac.net.cn
// @version      0.2
// @description  try to take over the world!
// @author       You
// @include      http://training.sac.net.cn/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/389425/training_sac.user.js
// @updateURL https://update.greasyfork.org/scripts/389425/training_sac.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = window.location.href;
    console.log("url------"+url);
    if(url.indexOf('newLeft.jsp')>-1){
        openList();
    }else if(url.indexOf('entity/workspaceStudent/studentWorkspace_toLearningCourses.action')>-1){
        setTimeout(goToStudy());
    }else if(url.indexOf('learnspace/learn/learn/blue/content_video.action')>-1 ){
        setTimeout(function(){
            var video = window.top.$("#mainContent").contents().find('#mainFrame').contents().find('video')[0];
            video.addEventListener("ended",function(){
                setTimeout(function(){
                    GM_setValue('auto',true);
                    getVideoList();
                },1*1000);
            })
        },10000);
    }else if(url.indexOf('learnspace/course/test/coursewareTest_intoTestPage.action')>-1){
        if($('.test_DNS_txt').text().indexOf('您还有未完成的课程节点')>-1){
            getVideoList();
        }else{
            window.top.close('ok');
        }
    }


    //获取该科创视频列表
    function getVideoList(){
        console.log("getVoideList");
        var videoLists =parent.$("#dumaScrollAreaId_3 li");
        console.log(videoLists);
        videoLists.each(function(i,val){
            var spanClassName = $(this).children('span').attr('class');
            if(spanClassName=='done'){
                console.log('done:'+$(this).children('a')["0"].text);
                return true;
            }else if(spanClassName=='doing'){
                //完成一半标签
                console.log('doing:'+$(this).children('a')["0"].text);
                if(window.top.$("#mainContent").contents().find("#dumaScrollAreaId_3 li")[i].parentNode.parentNode.previousElementSibling.children[0].className=='v1'){
                    window.top.$("#mainContent").contents().find("#dumaScrollAreaId_3 li")[i].parentNode.parentNode.previousElementSibling.click();
                }
                $(this).children('a')["0"].click();
                GM_setValue('auto',true);
                $(this).children('span').attr('class','done');
                return false;
            }else if(spanClassName=='undo'){
                //未完成标签
                //如果是课后检测
                if($(this).children('a')["0"].text.indexOf('课后测验')>-1){
                    window.top.$("#mainContent").contents().find("#dumaScrollAreaId_3 li")[i].parentNode.parentNode.previousElementSibling.click();
                    return false;;
                }else{
                    console.log('undo:'+$(this).children('a')["0"].text);
                    if(window.top.$("#mainContent").contents().find("#dumaScrollAreaId_3 li")[i].parentNode.parentNode.previousElementSibling.children[0].className=='v1'){
                        window.top.$("#mainContent").contents().find("#dumaScrollAreaId_3 li")[i].parentNode.parentNode.previousElementSibling.click();
                    }
                    $(this).children('a')["0"].click();
                    GM_setValue('auto',true);
                    $(this).children('span').attr('class','done');
                    return false;
                }
            }
        });
    }

    //点击正在学习的课程按钮
    function openList(){
        console.log("openList");
        var list_form = $('a[onclick="top.openPage(\'/entity/workspaceStudent/studentWorkspace_toLearningCourses.action\')"]');
        console.log(list_form);
        if(list_form){
            list_form.click();
        }
    }
    //进入学习页面
    function goToStudy(){
        console.log("goToStudy");
        var goButton = $('a[onclick^="checkGoStudy("]');
        console.log(goButton);
        goButton[0].click();
    }
    // Your code here...

})();