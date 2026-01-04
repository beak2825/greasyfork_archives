// ==UserScript==
// @name         高职教师培训视频自动连播
// @namespace    http://tampermonkey.net/
// @version      1.0.6
// @description  try to take over the world!
// @author       You
// @match        http://hbgs.study.gspxonline.com/resource/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/506587/%E9%AB%98%E8%81%8C%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/506587/%E9%AB%98%E8%81%8C%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E8%BF%9E%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    function func(){

        var timeOut2=setTimeout(function(){
            var playerFather=document.getElementById("aliplayer")
            var player=document.getElementsByTagName("video")[0]
            console.log(player)
            player.play()

        },1000)
        var allSection=document.getElementsByClassName("section")
        var allVideo=[]
        for(let i=0;i<allSection.length;i++){
            console.log(allSection[i])
            for(let y=0;y<allSection[i].children[1].childElementCount;y++){
                allVideo.push(allSection[i].children[1].children[y])
            }
        }
        var nowVideo=document.getElementsByClassName("active")[1]
        var nextVideo=null
        for(let i=0;i<allVideo.length;i++){
            if(nowVideo===allVideo[i]&& i<allVideo.length-2){
                nextVideo=allVideo[i+1]
            }
        }
        console.log(nextVideo)
        var timer2=setTimeout(function(){
            var player=document.getElementsByTagName("video")[0]
            console.log('设置监听')

            var time4=setInterval(function(){
                if(player.currentTime>=player.duration-1){
                    nextVideo.click()
                    var timer3=setTimeout(function(){
                        func()
                    },2000)
                    }
            },5000)
            /*             player.addEventListener('ended',function(e){



                }) */
            },2000)

        }
    var start = setTimeout(function(){
        var allTitle=document.getElementsByClassName("title section-name")
        // 点开每一章
        for(let i=0;i<allTitle.length;i++){
            if(allTitle[i].childElementCount>=1){
                allTitle[i].click()
            }
        }
        var timeOut=setTimeout(function(){
            func()

        },1000)


        },1000)

    // Your code here...
    })();