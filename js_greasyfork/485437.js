// ==UserScript==
// @name         中建网络学院_挂机
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  挂机看知学云网课，已适配中建网络学院
// @author       kakasearch
// @match        https://e-cscec.zhixueyun.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cscec1b.zhixueyun.com
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/485437/%E4%B8%AD%E5%BB%BA%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2_%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/485437/%E4%B8%AD%E5%BB%BA%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2_%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(!GM_getValue("doing")){
        //init
        GM_setValue("doing",{"name":"","time":1,"status":""})
    }
    function click_course(){
        //查找并点击需要学习的课程
        for(let i of document.querySelector("#paasIframe").contentWindow.document.querySelectorAll(".activeContent")){
            let status = i.querySelector("button").innerText
            let name = i.querySelector(".bname").innerText
            if(/(继续学习)|(开始学习)/.test(status)){
                GM_setValue("doing",{"name":name,"time":new Date().getTime(),"status":status})
                i.querySelector("button").click()
                return true
            }
        }
        return false
    }
    if(/container/.test(window.location.href)){
        // 课程主页，在当前页面实现控制做哪些课程
        setInterval(function(){
            let doing_item = GM_getValue("doing")
            let next_flag = false
            if(new Date().getTime()-doing_item.time>1000*20){
                //超过20s没有更新状态视为过期
                next_flag = true
                new ElegantAlertBox("准备开始新的课程>__<")
            }else{
                next_flag = false
                new ElegantAlertBox("有课程正在学习中，请等待>__<")
            }

            if (next_flag){
                if(click_course() ){
                    //有需要做的课程，已经点击
                    new ElegantAlertBox("已打开新的学习页面学习>__<")
                }else{
                    new ElegantAlertBox("找不到需要学习的内容>__<")
                }
            }
        },5000)
    }else if(/study\/course\/detail/.test(window.location.href)){
        //视频播放页，做完后给主页一个标志，结束标签页
        setInterval(function(){
            let name = document.querySelector("div.course-title>div")
            if(name){
                name = name.innerText
            }else{return}
            GM_setValue("doing",{"name":name,"time":new Date().getTime(),"status":"学习中"})
            //检查是否学习完
            let state = document.querySelector(".chapter-list-box.focus").querySelector(" div:nth-child(4)")?false:true
            if(state){
                new ElegantAlertBox("下一个视频 >__<")
                let found = false
                let courses = document.querySelectorAll("dl")
                for(let i of courses){
                    if(i.querySelectorAll(".item.pointer.item22").length>1){
                       i.click()
                        return
                    }
                }
                 new ElegantAlertBox("全部学习完>__<")
                GM_setValue("doing",{"name":name,"time":new Date().getTime()-1000*30,"status":"已完成"})
                GM_setValue(name,{"name":name,"time":new Date().getTime()-1000*30,"status":"已完成"})
                setTimeout(function(){window.close()},3000)
            }else{
                new ElegantAlertBox("还没有学习完 >__<")
                if(document.querySelector(".register-mask-layer") && 'display: none;' != document.querySelector(".register-mask-layer").getAttribute("style")){
                    document.querySelector("#D210registerMask").click()
                }
                document.querySelector("video").play()
            }

        },5000)
    }

    // Your code here...
})();