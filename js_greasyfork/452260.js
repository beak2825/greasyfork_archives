// ==UserScript==
// @name         独立开窗
// @namespace    http://tampermonkey.net/
// @version      2024-11-29
// @description  try to take over the world!
// @author       You
// @match        *://www.gxela.gov.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gxela.gov.cn
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/452260/%E7%8B%AC%E7%AB%8B%E5%BC%80%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/452260/%E7%8B%AC%E7%AB%8B%E5%BC%80%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //超找按钮并点击
    function findAndClick(text){
        console.log(text,'split')
        var tpe = ['span','a','li','button','div']
        text = text.split("|");
        var find = false;
        for(var i = 0;i<tpe.length;i++){
            $(tpe[i]).each(function(){
                if(text.includes(keepOnlyChinese($(this).text()))){
                    console.log($(this))
                    $(this)[0].click();
                    find = true;
                    return false;
                }
            });
            if(find){
                console.log("找到按钮:"+text);
                break;
            }
        }
        return find;
    }
    //只保留中文
    function keepOnlyChinese(str) {
        return str.replace(/[^\u4e00-\u9fa5]/g, '');
    }
    //查找需要开始的课程
    function FindAndStartLesson(nextPath){
        var nextLesson = findAndClick('未开始|进行中|开始学习');
        console.log(nextLesson ? '找到课程' : '未找到课程');
        if(nextLesson){
            //找到课程后退出
            return true;
        }
        //当页没有课程，进入下一页
        var pages = $(".el-pager").children('li');
        var nextPage = false;
        var currentPage = 0;
        if(pages.length > 0){
            pages.each(function(){
                console.log($(this).hasClass('is-active'),$(this).text())
                currentPage++;
                if($(this).hasClass('is-active') && currentPage < pages.length){
                    nextPage = true;
                    return true;
                }
                if(nextPage){
                    $(this)[0].click();
                    return false;
                }
            });
        }
        if(nextPage){
            return;
        }
        //全部页面跳转完，跳转下一栏目
        var category = $(".categoryTop-item");
        var nextCat = false;
        if(category.length > 0){
            category.each(function(){
                if($(this).children(".active").length > 0){
                    return true;
                }
                nextCat = true;
                $(this)[0].click();
                return false;
            });
        }
        if(!nextCat){
            goto(nextPath)
        }
    }

    //跳转到指定页面的方法
    function goto(path,i,nextPath=[]){
        console.log(path)
        var p = path[i].split("|")
        if(p[1] == 'test'){
            if( $('.el-progress__text').text() == '100%'){
                console.log( path[i],$('.el-progress__text').text())
                goto(nextPath,0);
                return;
            }
        }
        findAndClick(p[0])
        setTimeout(()=>{
            goto(path,++i,nextPath)
        },2000);
    }
    //检测登录
    function TestLogin(){
        if($(".content-left-top-desc-name").length > 0 || $(".user-msg-name").length > 0){
            return true;
        }else{
            return false;
        }
    }
    //检测是否存在视频播放器，
    function TestAndPlay(){
        if($("#videoCont").length > 0 && !play){
            $("#videoCont").click();
            return true;
        }else{
            return false;
        }
    }

    //选修课路径
    var path = ['首页','学习中心','我的课程','选修课'];
    //班级路径
    var path1 = ['首页','学习中心','我的班级','正在开班',"进入班级|test"];
    var jumping = false;
    var play = false;//当前是否在播放视频
    var login = false;//是否登录
    var begin = false;//是否进入学习流程
    var t = 0;
    var t1;

    var tip = $("<div style='width:200px;height:100px;position:fixed;top:0px;left:0px;z-index:1000;display: flex;justify-content: center;align-items: center;background-color:white;border:1px solid gray;border-radius:5px;flex-wrap:wrap'><span>选完课程后，点击开始！开始后，请耐心等待，不要做任何操作。</span><button id='begin' class='el-button el-button--primary el-button--default res-resgiter'>开始</button></div>");
    $(document).ready(function(){
        $('body').prepend(tip);
        setTimeout(function(){
            $('#begin').on('click',function(){
                if(begin){
                    begin = false;
                    $('#begin').text(begin?'暂停':'开始');
                    console.log('停止')
                    clearInterval(t1);
                    
                }else{
                    $('#begin').text('约20s后开启');
                    goto(['首页'],0);
                    setTimeout(()=>{
                        //检测是否登录,登录前不执行任何程序
                        if(TestLogin() && !login){
                            login = true;
                        }
                        goto(path1,0,path);
                    },2*1000)
                    t1 = setInterval(()=>{main()},20*1000);
                    setTimeout(()=>{
                        begin = true;
                        console.log('begin',begin)
                        $('#begin').text(begin?'暂停':'开始');
                    },20*1000)
                }
            })
        },2000)
    });


    //定义一个定时器，负责每一步操作
   function main(){
       console.log('正在检测',begin,play,t++)
       if(!begin){return;}
       if(!login){console.log('未登录！');return;}
       //检测页面是否存在播放器，有则启动播放
       if($("#videoCont").length > 0 && !play){
           $("#videoCont").click();
           play = true;
       }
       //检测视频是否播放完成，播放完成退出当前课程
       if($(".time-current").text() == $(".time-duration").text() && $(".xgplayer-replay").length > 0){
           play = false;
           window.history.back();
           setTimeout(function(){
               if($(".el-dialog__title").text() == '课程评价'){
                   window.history.back();
                   goto(path,0)
               }
           },2000)
       }

       if(!play){FindAndStartLesson();}
       //console.log('begin',begin)

    }

    // Your code here...
})();