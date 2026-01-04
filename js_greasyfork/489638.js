// ==UserScript==
// @name         【挂机助手】西南交通大学网络教育
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  挂机看西南交通大学网络教育
// @author       kakasearch
// @match        https://e-learning.swjtu.edu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=xnjd.cn
// @require      https://greasyfork.org/scripts/425166-elegant-alert-%E5%BA%93/code/elegant%20alert()%E5%BA%93.js?version=922763
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489638/%E3%80%90%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B%E3%80%91%E8%A5%BF%E5%8D%97%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/489638/%E3%80%90%E6%8C%82%E6%9C%BA%E5%8A%A9%E6%89%8B%E3%80%91%E8%A5%BF%E5%8D%97%E4%BA%A4%E9%80%9A%E5%A4%A7%E5%AD%A6%E7%BD%91%E7%BB%9C%E6%95%99%E8%82%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function click_course(){
        //查找并点击需要学习的课程
        for(let i of document.querySelectorAll(".list-item")){
            let status = i.querySelector(".tag").innerText
            let name = i.querySelector(".name").innerText.replace(/\(\d\d:\d\d:\d\d\)/,"").trim()
            if(/(继续学习)|(未学习)/.test(status)){
                GM_setValue("doing",{"name":name,"time":new Date().getTime(),"status":status})
                i.click()
                return true
            }
        }
        return false
    }
    function do_homework(ans_list){
        for(let ans_item of ans_list){
            let answers = ans_item.answers
            let id_ = ans_item.id
            if(answers){
                for(let ans of answers.split(",")){
                    document.querySelector("#list-item-"+id_).querySelector("input[value="+ans+"]").click()
                }
            }
        }
    }
    if(/CourseLearning\/CourseInfo/.test(window.location.href)){
        // 课程主页，在当前页面实现控制做哪些课程
        new ElegantAlertBox("即将开始>__<")
        let init = setInterval(function(){
            if(document.querySelectorAll(".list-item").length){
                clearInterval(init)
            }else{return}
            let num = 0
            for(let i of document.querySelectorAll(".list-item")){
                if(!i.querySelector(".tag")) break
                let status = i.querySelector(".tag").innerText
                let name = i.querySelector(".name").innerText.replace(/\(\d\d:\d\d:\d\d\)/,"").trim()
                if(/(继续学习)|(未学习)/.test(status)){
                    GM_setValue("doing",{"name":name,"time":new Date().getTime(),"status":status})
                    setTimeout(function(){i.click()},5000*num)
                    num +=1
                    if(num>=3){break}
                }
            }
            if(num == 0){setInterval(function(){ new ElegantAlertBox("已学完>__<")  },3000)}
            setTimeout(function(){window.location.reload()},20000)
        },3000)
        }else if(/CourseLearning\/video/.test(window.location.href)){
            //视频播放页，做完后给主页一个标志，结束标签页
            new ElegantAlertBox("即将开始看课>__<")
            let init = setInterval(function(){
                new ElegantAlertBox("正在检查>__<")
                let name = document.querySelector("div.title")
                if(name){
                    name = name.innerText.trim()
                    clearInterval(init)
                }else{return}
                document.querySelector("video").muted="muted"
                document.querySelector("video").play() //开始播放的按钮
                setTimeout(function(){
                    new ElegantAlertBox("学习完>__<")
                    window.close()
                },20000)
            },5000)
            }else if(/CourseLearning\/doc/.test(window.location.href)){
                //视频播放页，做完后给主页一个标志，结束标签页
                new ElegantAlertBox("即将开始看课>__<")
                let init = setInterval(function(){
                    new ElegantAlertBox("正在检查>__<")
                    let name = document.querySelector("div.title")
                    if(name){
                        name = name.innerText.trim()
                        clearInterval(init)
                    }else{return}
                    setTimeout(function(){
                        new ElegantAlertBox("学习完>__<")
                        window.close()
                    },20000)
                },5000)
                }else if(/OnlineJob\/working/.test(window.location.href)){
                    new ElegantAlertBox("即将开始做题>__<")
                    setTimeout(function(){
                        GM_xmlhttpRequest({
                            method: 'GET',
                            url: "https://elearning.xnjd.cn/api/study/homework/info/previewHomeworkInfo?homework_id="+/id=(.*?)&/.exec(window.location.href)[1],
                            dataType: "json",
                            onload: function(xhr) {
                                let data = JSON.parse(xhr.responseText)
                                console.log(data)
                                do_homework(data.datas.exercises)
                            },
                            onerror:function(){ console.log("no answer")}
                        });
                         },5000)
                    }
                    // Your code here...
                })();