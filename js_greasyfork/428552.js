// ==UserScript==
// @name         LT网上学院刷课
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  进入专题准备选课的时候自动开始。关闭其他标签页刷新
// @author       You
// @match        http://wsxy.chinaunicom.cn/learner/subject/*
// @match        http://wsxy.chinaunicom.cn/learner/course/detail/*
// @match        http://wsxy.chinaunicom.cn/learner/play/course/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @icon         http://wsxy.chinaunicom.cn/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/428552/LT%E7%BD%91%E4%B8%8A%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/428552/LT%E7%BD%91%E4%B8%8A%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var reg1 = /learner\/subject/g
    var subjectCount = 0
    GM_setValue("jumpFlag",false)
    //持续检测网址，以便监测网址变化
    setInterval(function(){
        console.log("新测试进行中:" + GM_getValue("url"))
        //保存当前地址“url”到脚本，以便检测变化
        GM_setValue("url",location.href)
        //需要加入选课界面卡住刷新机制
        if(reg1.test(location.href)){
            console.log("卡【选课界面】计数："+subjectCount)
            subjectCount++
            if(subjectCount>10){ // >10是10秒的意思
                //刷新当前页面
                location.reload()
            }
        }
    },1000)
    //监听url变化
    GM_addValueChangeListener("url",function(){
        console.log("url发生了变化！！！" + GM_getValue("url"))
        if(getInterface()==1){
            //console.log("【选课界面】")
            //保存根地址到全局变量
            GM_setValue("rootUrl",location.href)
            console.log("已保存根地址【" + GM_getValue("rootUrl") + "】到【rootUrl】")
            //alert("请【关闭】其他网上学院的页面（没有就直接点【确定】），并自动继续")
            var t1 = setInterval(function(){
                if(findClass("single-course")){
                    //加载完成
                    clearInterval(t1)
                    setAll_parent()
                    //执行学习function
                    //study()
                }
            },200)
        }else if(getInterface()==2){
            //
            console.log("【大纲界面】")
            //alert("标志位为：" + GM_getValue("jumpFlag"))
            //检测跳转标志位
            if(GM_getValue("jumpFlag")){
                //alert("if")
                GM_setValue("jumpFlag",false)
                //跳转到选课界面
                location.assign(GM_getValue("rootUrl"))
            }else{
                //alert("else")
                clickStartStudy()
            }
        }else if(getInterface()==3){
            //
            console.log("【播放界面】")
            //倒计时：秒
            var countDown = 200
            var t2 = setInterval(function(){
                countDown--
                document.getElementsByClassName("player-name ")[0].innerText="【"+countDown+"】秒后自动刷新"
                if(countDown<0){
                    //倒计时到了
                    clearInterval(t2)
                    //设置需要跳转的标志位，后退后取标志位再跳转一次
                    GM_setValue("jumpFlag",true)
                    //先点保存记录
                    //save-logout-box ant-btn ant-btn-primary
                    document.getElementsByClassName("save-logout-box ant-btn ant-btn-primary")[0].click()

                    //点击左上角后退
                    document.getElementsByClassName("back-course")[0].click()
                 }// if(countDown<0)
            },1000) //var t2 = setInterval
        } //else if(getInterface()==3)
    }) //GM_addValueChangeListener


    window.onload = function(){
        //防止选课界面刷新不能从当前窗口打开
        if(getInterface()==1){
            //console.log("【选课界面】")
            GM_setValue("rootUrl",location.href)
            console.log("已保存根地址【" + GM_getValue("rootUrl") + "】到【rootUrl】")
            //alert("请【关闭】其他网上学院的页面（没有就直接点【确定】），并自动继续")
            var t1 = setInterval(function(){
                if(findClass("single-course")){
                    //加载完成
                    clearInterval(t1)
                    setAll_parent()
                    //执行学习function
                    study()
                }//if(findClass("single-course"))
            },200)//var t1 = setInterval(function()
        }//if(getInterface()==1)
    }//onload完

    function setTitle(text){
        //
        document.getElementsByTagName("title")[0].innerText = text
    }

 
    function getInterface(){
        var reg1 = /learner\/subject/g
        var reg2 = /learner\/course/g
        var reg3 = /learner\/play/g
        if(reg1.test(location.href)){
            //console.log("【选课界面】")
            return 1
        }else if(reg2.test(location.href)){
            //console.log("【大纲界面】")
            return 2
        }else if(reg3.test(location.href)){
            //console.log("【播放界面】")
            return 3
        }
    }

    function study(){
        //先点未完成
        document.getElementsByClassName("right")[1].children[6].click()
        var t1 = setInterval(function(){
            if(findClass("single-course")){
                //有【未完成】
                clearInterval(t1)
                //设置当前窗口打开
                setAll_parent()
                console.log("【未完成】YES: "+document.getElementsByClassName("single-course")[0].children[0].children[1].children[0].innerText)
                //点击第一个课程
                document.getElementsByClassName("single-course")[0].children[0].click()
            }else if(findClass("default-box")){
                //没有【未完成】
                clearInterval(t1)
                console.log("【未完成】NO")
                //点击【未学习】
                document.getElementsByClassName("right")[1].children[2].click()
                var t2 = setInterval(function(){
                    if(findClass("single-course")){
                        //没有【未完成】-有【未学习】
                        clearInterval(t2)
                        //设置当前窗口打开
                        setAll_parent()
                        console.log("【未学习】YES: "+document.getElementsByClassName("single-course")[0].children[0].children[1].children[0].innerText)
                        //点击第一个课程
                        document.getElementsByClassName("single-course")[0].children[0].click()
                    }else if(findClass("default-box")){
                        //没有【未完成】-也没有【未学习】
                        clearInterval(t2)
                        //alert("已完成全部课程")
                        study()
                    }
                },1000)
            }
        },1000)




    }
    function clickStartStudy(){
        var t2 = setInterval(function(){
            if(findClass("course-button ant-btn ant-btn-default")){
                console.log("【大纲界面】-加载完成")
                clearInterval(t2)
                document.getElementsByClassName("course-button ant-btn ant-btn-default")[0].click()
            }else{
                console.log("【大纲界面】-加载中...")
            }
        },200)
    }
    function setAll_parent(){
        //全改当前窗口打开
        console.log("全改成当前窗口打开")
        var n = document.getElementsByClassName("single-course").length
        for (var i=0;i<n;i++){
            document.getElementsByClassName("single-course")[i].children[0].target="_parent"
        }
    }


    function findClass(className){
        if(document.getElementsByClassName(className).length>0){
            return true
        }else{
            return false
        }
    }
    
})();