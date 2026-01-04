// ==UserScript==
// @name         zjooc在浙学刷课
// @namespace    GAEE
// @version      1.2.0
// @description  网页端/安卓端 一键刷课
// @match        https://www.zjooc.cn/*
// @grant        unsafeWindow
// @license      none
// @require      https://cdn.staticfile.org/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/436125/zjooc%E5%9C%A8%E6%B5%99%E5%AD%A6%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/436125/zjooc%E5%9C%A8%E6%B5%99%E5%AD%A6%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==
var APP_Version = "1.2.5";

//
// 由于网页脚本维护不便，无法及时更新请见谅。
// 如需获得更好体验请移步介绍页下载安卓脚本
//

var startTime = 5000;   //刷课间隔时间 //若超过该时间页面还未加载则自动跳过
var IntervalTime = 2000;//监测时长
var Video_muted = true; //开启静音
var Video_speed = 4;    //倍速设置 最大16

(function() {
    'use strict';
    const urls = {'course':'https://www.zjooc.cn/ucenter/student/course/study/[A-Za-z0-9]+/plan/detail/[A-Za-z0-9]+'};

    var ListStudy_main = [];
    var ListStudy_view = [];

    var ListStudy_main_now;
    var ListStudy_view_now;

    var Interval;
    var LN = 0;
    var MN = 0;


    var url = unsafeWindow.location.href;
    var href = new RegExp(urls.course);
    CONSOLE();
    LOG(href.test(url));
    if(href.test(url)){
        unsafeWindow.setTimeout(function(){
            LOG("=========== 开始执行脚本 =========");
            for(var i=0;i<document.querySelectorAll('.el-submenu__title').length;i++){if(i>0)document.querySelectorAll('.el-submenu__title')[i].click()}
            GET_MAIN_LIST();
            LOG("------------");
            GET_VIEW_LIST();
            LOG("------------");
            //LOG(ListStudy_main);
            //LOG(ListStudy_view);
            if(ListStudy_main == ""){
                LOG("全部完成");
            }else{
                ListStudy_main_now.click();
                if(ListStudy_view == ""){
                    LOG("当前小节已完成");
                    NEXT_MAIN();
                }else{
                    ListStudy_view_now.click();
                    unsafeWindow.setTimeout(AUTO_COURSE,startTime);
                }
            }
        },startTime);
    }

    function AUTO_COURSE(){
        if(Interval){
            unsafeWindow.clearInterval(Interval);
        }
        LOG("============= 开始刷课 ===========");
        LOG("当前课时:"+ListStudy_view_now.innerText);
        if(document.querySelector('iframe')){
            LOG("类型【文档】");
            var document_ok = document.querySelector('.contain-bottom').querySelectorAll('button.el-button.el-button--default');
            LOG("文档按钮"+document_ok);
            if(document_ok){
                for(var i=0;i<document_ok.length;i++) document_ok[i].click();
                LOG("正在执行文档程序");
            }
            LOG("============= 结束刷课 ===========");
            NEXT_VIEW();
        }else{
            LOG("类型【视频】");
            var video = document.querySelector('video');
            LOG("[寻找VIDEO]"+video);
            if(video){
                video.autoplay = "autoplay";
                video.muted = Video_muted;
                video.playbackRate = Video_speed;
                var p = document.querySelector('video');
                if(p)p.click();
                Interval = unsafeWindow.setInterval(VIDEO_OK,IntervalTime);
            }
        }
    }

    function VIDEO_OK(){
        try{
            var video=document.querySelector('video');
            var bar = video.parentNode.children[2];
            var processBar = bar.children[7];
            var times = processBar.innerText.split('/');
            var now = times[0].trim();
            var end = times[1].trim();
            LOG(times);
            if(now==end){
                if(Interval){
                    unsafeWindow.clearInterval(Interval);
                }
                LOG("============= 结束刷课 ===========");
                unsafeWindow.setTimeout(NEXT_VIEW,startTime);
            }
        }catch(err) {
            LOG("[ERROR] "+err);
            if(Interval){
                unsafeWindow.clearInterval(Interval);
            }
            unsafeWindow.setTimeout(NEXT_VIEW,startTime);
        }
    }

    function NEXT_MAIN(){
        MN += 1;
        if(MN >= ListStudy_main.length){
            LOG("全部完成");
            alert("🎉 本课程学习完毕");
        }else{
            ListStudy_main_now = ListStudy_main[MN];
            ListStudy_main_now.click();
            LOG("正在切换下一章节");
            unsafeWindow.setTimeout(function(){
                GET_VIEW_LIST();
                if(ListStudy_view == ""){
                    LOG("当前小节已完成");
                    NEXT_MAIN();
                }else{
                    ListStudy_view_now.click();
                    unsafeWindow.setTimeout(function(){AUTO_COURSE()},startTime);
                }
            },startTime);
        }
    }

    function NEXT_VIEW(){
        LN += 1;
        if(LN >= ListStudy_view.length){
            LOG("当前小节已完成");
            NEXT_MAIN();
        }else{
            ListStudy_view_now = ListStudy_view[LN];
            ListStudy_view_now.click();
            //LOG("当前课时:"+ListStudy_view_now.innerText);
            //LOG("下一课时:"+ListStudy_view_now.nextSibling.innerText);
            unsafeWindow.setTimeout(AUTO_COURSE,startTime);
        }
    }

    function GET_MAIN_LIST(){
        ListStudy_main = [];
        MN = 0;
        LOG("[学习章节]");
        LOG("-------------");
        //get main list
        var main_list = document.querySelector('.base-asider ul[role="menubar"]');
        for(var a=0; a<main_list.childElementCount; a++){
            var sec_list = main_list.children[a].children[1];
            for(var b=0; b<sec_list.childElementCount; b++){
                var _e = sec_list.children[b];
                //if(_e.getAttribute('tabindex')=='0')//-1 unfinish 0 finish
                //{
                //    LOG("finished");
                //}else{
                LOG(_e.innerText);
                ListStudy_main.push(_e);
                //}
            }
        }
        //end
        ListStudy_main_now = ListStudy_main[0];
        ListStudy_main_now.click();
        LOG("-------------");
    }

    function GET_VIEW_LIST(){
        ListStudy_view = [];
        LN = 0;
        LOG("[学习小节]");
        LOG("-------------");
        var list = document.querySelector('.plan-detailvideo div[role="tablist"]');
        for(var i=0; i<list.childElementCount; i++){
            var e = list.children[i];
            if(e.querySelector('i').classList.contains('complete'))//finished
            {
                LOG("finished");
            }else{
                LOG(e.innerText);
                ListStudy_view.push(e);
            }
        }
        ListStudy_view_now = ListStudy_view[0];
        LOG("-------------");
    }

    function LOG(info){
        console.log(info);
        $('#console').append('<div class="" style="marginLeft:10px;"><span id="">'+info+'</span></div>');
        $('#console').scrollTop(10000000);
    }

    function CONSOLE(){
        unsafeWindow.onload = function(){
            var box = '<div class="CONSOLE" style="border: 2px dashed rgb(0, 85, 68);width: 330px; position: fixed; top: 0; right: 0; z-index: 99999;background-color: #e8e8e8; overflow-x: auto;"><button id="close_console">隐藏控制台</button><div class="console_box" id="console" style="height:360px;background:#fff;margin:10px auto 0;overflow:auto;"><div class="info"><div class="time"></div></div></div></div>';
            $('body').append(box);
            document.getElementById("close_console").onclick = function(){
                var b = document.getElementById("console");
                if(document.getElementById("close_console").innerText == '隐藏控制台'){
                    b.style.display = "none";
                    document.getElementById("close_console").innerText = "显示控制台";
                }
                else{
                    b.style.display = "";
                    document.getElementById("close_console").innerText = "隐藏控制台";
                }
            }
        }
    }

})();
