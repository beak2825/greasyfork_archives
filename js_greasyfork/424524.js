// ==UserScript==
// @name         关闭B站自动播放下一个视频(自动切集）
// @namespace    https://www.tampermonkey.net/
// @version      2.3
// @description  解决B站恼人的单个视频自动播放问题，只对HTML5播放器生效。如果是视频集则自动播放，如果是单个视频则不自动播放。
// @author       ProDark
// @match        https://www.bilibili.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/424524/%E5%85%B3%E9%97%ADB%E7%AB%99%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91%28%E8%87%AA%E5%8A%A8%E5%88%87%E9%9B%86%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/424524/%E5%85%B3%E9%97%ADB%E7%AB%99%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91%28%E8%87%AA%E5%8A%A8%E5%88%87%E9%9B%86%EF%BC%89.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...






    function ClickButton(Target){
        var e = document.createEvent("MouseEvents");
        e.initMouseEvent("click", true, false);
        Target.dispatchEvent(e);
    };
    function pageAcive(){
        //后台打开的页面没有播放器载入，主要功能失效。这个用于判断页面处于后台还是前台。
        //console.log(document.hidden);
        if(document.hidden){
            // 如果当前页面在后台打开
            return false;
        }
        else
        {
            return true;
        }
    };

    //-------------------------------------------------------------------------------------------
    function check_videoplayer_ready(){
        //squirtle-progress-wrap squirtle-progress-common ease
        try
        {
            var tempLists = document.getElementsByTagName("div");
            for(var i=0;i<tempLists.length;i++){
                //console.log(i,tempLists[i].getAttribute("aria-label"));
                if( tempLists[i].getAttribute("aria-label")=='哔哩哔哩播放器' )
                {
                    return true;
                }

                var theAttrClass = tempLists[i].getAttribute("class");
                if( theAttrClass == "bilibili-player-video-progress-slider bui bui-slider" || theAttrClass == "squirtle-controller   squirtle-pgc")
                {//检查播放器是否准备完毕 // 有两种播放器
                    return true;
                }

            }
            //console.log(" check_videoplayer_ready() == false ");
            return false;
        }
        catch(err)
        {
            console.log("Error : 查找播放器Error");
            console.log(err);
            return false;
        }
    };
    function Need_to_make_Off(){
        var divs = document.getElementsByTagName("p");
        for(var i=0;i<divs.length;i++){
            if( divs[i].getAttribute("class") == "rec-title")
            {
                return true;
            }
        }
        return false
    };

    function AutoNextON_inVideo(){
        try
        {
            var tempLists = document.getElementsByTagName("div");
            for(var i in tempLists){
                var theAttrClass = tempLists[i].innerText;
                if( tempLists[i].innerText == "自动切集")
                {
                    ClickButton(tempLists[i])
                    return true;
                }
            }
            console.log("Error : AutoNextON_inVideo");
            return false;
        }
        catch(err)
        {
            console.log("Error : AutoNextON_inVideo");
            return false;
        }
    };
    function AutoNextButtonOFF(){

        var divs = document.getElementsByTagName("span");
        for(var i=0;i<divs.length;i++){
            if( divs[i].getAttribute("class") == "switch-button on")
            {
                ClickButton(divs[i]);
                return true;
            }
        }
        return false
    };
    function AutoNextButtonON(){

        var divs = document.getElementsByTagName("span");
        for(var i=0;i<divs.length;i++){
            if( divs[i].getAttribute("class") == "switch-button")
            {
                ClickButton(divs[i]);
                return true;
            }
        }
        return false
    };

    function Switch_button_type_check(){
        var divs = document.getElementsByTagName("span");
        for(var i=0;i<divs.length;i++){
            if( divs[i].getAttribute("class") == "switch-button")
            {
                return "播完暂停";
            }
            if( divs[i].getAttribute("class") == "switch-button on")
            {
                return "自动切集";
            }
        }
        return "没有找到该按钮";
    };
    function CheckActiveType_inVideoPlayer(){
        var tempDIVs = document.getElementsByTagName("div");
        for(var i in tempDIVs)
        {
            var current_CLASS = "temp_________"
            if( tempDIVs[i].innerText == "自动切集" ){
                current_CLASS = tempDIVs[i].getAttribute("class");
                console.log("自动切集 active : ",current_CLASS.indexOf("active"));
                if ( current_CLASS.indexOf("active") > 0 )
                {
                    return "自动切集"; //---------------------------
                }

            }
            if( tempDIVs[i].innerText == "播完暂停" ){
                current_CLASS = tempDIVs[i].getAttribute("class");
                console.log("播完暂停 active : ",current_CLASS.indexOf("active"));
                if( current_CLASS.indexOf("active") > 0 )
                {
                    return "播完暂停"; //---------------------------
                }
            }
        }
        console.log("error : 没有找到播放器内的按钮" );
        return "CheckActiveType error";
    };

    var AutoNextButton_Set_OFF_Task = "nil";
    var AutoNextButton_Set_ON_Task = "nil";
    var falure_num = 0;
    function MainProcess(){

        var ret = false;
        if(Need_to_make_Off())
        {
            ret = AutoNextButtonOFF();
            console.log("尝试关闭自动切集");
            if(AutoNextButton_Set_OFF_Task == "nil")
            {
                AutoNextButton_Set_OFF_Task = setInterval(function(){
                    if( Switch_button_type_check() == "播完暂停"|| CheckActiveType_inVideoPlayer() == "播完暂停" )
                    {
                        console.log("关闭自动切集【成功】");
                        clearInterval(AutoNextButton_Set_OFF_Task);
                    }else{
                        falure_num ++;
                        if( falure_num < 25 )
                        {
                            console.log("关闭自动切集【失败】，稍后重复执行：",falure_num);
                            MainProcess();
                        }else{
                            console.log("关闭自动切集【失败】，超时，任务终止：");
                            clearInterval(AutoNextButton_Set_OFF_Task);
                        }
                    }
                },3000);
            }


        }else{
            ret = AutoNextON_inVideo();
            if(ret == false){
                ret = AutoNextButtonON();
            }
            console.log("尝试启动自动切集");
            if(AutoNextButton_Set_ON_Task == "nil"){
                AutoNextButton_Set_ON_Task = setInterval(function(){
                    if( CheckActiveType_inVideoPlayer() == "自动切集" || Switch_button_type_check() == "自动切集" )
                    {
                        console.log("启动自动切集【成功】");
                        clearInterval(AutoNextButton_Set_ON_Task);
                    }else{
                        falure_num ++;
                        if( falure_num < 25 )
                        {
                            console.log("启动自动切集【失败】，稍后重复执行:",falure_num);
                            MainProcess();
                        }else{
                            console.log("启动自动切集【失败】，超时，任务终止");
                            clearInterval(AutoNextButton_Set_ON_Task);
                        }
                    }
                },3000);
            }
        }

        return true;
    };

    //-------------------------------------------------------------------------------------------

    var TaskTimeOutNum = 20;
    var MainPrecess_Timer = "nil";
    function MainTimeOut_2(){
       if( MainPrecess_Timer == "nil" ){
           MainPrecess_Timer = setInterval(function(){
               if( pageAcive() == false ){
                   //MainTimeOut_2();
                   return;
               }
               TaskTimeOutNum -- ;
               if(TaskTimeOutNum < 0){
                   console.log("TaskTimeOutNum < 0");
                   clearInterval(MainPrecess_Timer)
                   return;
               }else{
                   if(check_videoplayer_ready() == true)
                   {
                       console.log("这个页面成功找到H5播放器");
                       clearInterval(MainPrecess_Timer)
                       MainProcess();

                   }else{
                       console.log("ERROR: 这个页面没找到H5播放器");
                       //MainTimeOut_2();
                   }

               }

           },2000);
       }

    };


    /*
    window.onload = function(){
        MainTimeOut();
    }

    //------ 奇怪遭遇，window.onload 会在B站某些页面执行两次.... 属于油猴脚本多次执行(至少2次）

    document.onreadystatechange = function(){
        if( document.readyState == "complete"){
            document.onreadystatechange = function(){console.log("test-0066");};
            MainTimeOut_2();
        }
    };
    */


    window.addEventListener("load", init22, false);
    function init22(){
        //alert("task start");
        var tempTask_onload = setInterval(function(){
                if(document.readyState == "complete"){
                    clearInterval(tempTask_onload);
                    MainTimeOut_2()
                }
            },3000);
    };


    // Code end before here
    //---------------------------------------------------------------------------------


})();