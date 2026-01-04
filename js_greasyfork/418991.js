// ==UserScript==
// @name         干部网络学院刷课脚本
// @namespace    https://www.tuziang.com/combat/2390.html
// @version      0.3
// @description  一个用于广东干部网络学院刷课 的脚本。
// @author       兔子
// @include      http://*
// @include      https://*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418991/%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/418991/%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==
 
    function shuake(){
        var i
        //第一行是表头，所以从第二行开始找
        for(i = 1; i < document.getElementsByTagName("tr").length; i++){
            var jindu = document.getElementsByTagName("tr")[i].getElementsByTagName("span")[1].innerText
            //只要进度不是100，那就继续开始看它
            if(jindu.indexOf("100")==-1){
                document.getElementsByTagName("tr")[i].getElementsByTagName("a")[0].click()
                break;
            }
        }
    }
    var href = window.location.href
    if(href.indexOf("course!list.action")!=-1){
        var shuake_anniu
        shuake_anniu=document.createElement("div")
        shuake_anniu.style="line-height:21px;padding-right: 10px;font-size:21px;cursor:pointer;"
        shuake_anniu.innerHTML="<a >开始刷课</a>"
        shuake_anniu.onclick=shuake
        document.getElementsByTagName("caption")[0].appendChild(shuake_anniu)
    }


    if(href.indexOf("course!playNew.action?userCourse.id")!=-1){
        var frame = document.getElementById("content").contentWindow.document;
        if(frame.getElementsByClassName("_o2-3").length>0){
            frame.getElementsByClassName("_o2-3")[0].getElementsByTagName("a")[0].click()
        }
        //进入课程
        if(frame.getElementsByClassName("learn").length>0){
            frame.getElementsByClassName("learn")[0].click()
        }
        if(frame.getElementsByTagName("video").length>0){
            document.getElementsByTagName("video")[0].click()
        }
        //自动点击 继续学习
        setInterval(function () {
            if(document.getElementById("confirm").length>0){
                document.getElementById("confirm").click()            
            }
        }, 1000)
    }
