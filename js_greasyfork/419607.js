

// ==UserScript==
// @name         陕西干部网络学院刷课脚本
// @namespace    www.tuziang.com/combat/2562.html
// @version      0.4
// @description  一个 青海干部网络学院 的小脚本
// @author       Tuziang
// @match        *://*.sqgj.gov.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419607/%E9%99%95%E8%A5%BF%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/419607/%E9%99%95%E8%A5%BF%E5%B9%B2%E9%83%A8%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%88%B7%E8%AF%BE%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


var href = location.href
var i
var text
var cou_length
//课程页面
if(href=="http://www.gxela.gov.cn/app/lms/student/Userdashboardinfo/show.do"){
    var cou_length=document.getElementsByClassName("cou-kscp").length
    for(i=0;i<cou_length;i++){
        text=document.getElementsByClassName("cou-kscp")[i].innerText
        if(text="开始学习"){
            document.getElementsByClassName("cou-kscp")[i].click()
            break;
        }
    }
    
}

//一键选课
if(href.indexOf("selectLessonlistEx.do")!=-1){
    var xuanke 
    xuanke = document.createElement("a")
    xuanke.innerText="一键选课"
    document.getElementsByClassName("width-small sx")[0].appendChild(xuanke)
    xuanke.style.cursor = "pointer";

    xuanke.onclick=function(){
        cou_length=document.getElementsByClassName(" nr-item-yxk").length
        for(i=0;i<cou_length;i++){
            document.getElementsByClassName(" nr-item-yxk")[i].click()
        }
    }
}
