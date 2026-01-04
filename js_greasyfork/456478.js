// ==UserScript==
// @name         慧教育-教师培训平台
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Autoplay
// @author       Hui
// @match        https://jspx.dgjy.net/train/trainee/courseware.action?*
// @match        https://jspx.dgjy.net/train/trainee/doTest.action?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dgjy.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456478/%E6%85%A7%E6%95%99%E8%82%B2-%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/456478/%E6%85%A7%E6%95%99%E8%82%B2-%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var href
    var class_href=setInterval(function(){
        href=window.location.href
    if(href.includes("https://jspx.dgjy.net/train/trainee/courseware.action?")){
        class_video();clearInterval(class_href);}
    if(href.includes("https://jspx.dgjy.net/train/trainee/doTest.action")){
        class_text();clearInterval(class_href);}},2000)

    function class_video(){
    var video=setInterval(function(){
        document.querySelector("video")
        if(video){
            document.querySelector("video").play()
            document.querySelector('video').muted=true
            clearInterval(video)
        }},2000)}

    function class_text(){
           var class_text1=setInterval(function(){
               var class_name=document.querySelector("#singleChoiceDiv > div:nth-child(2) > div.job-item-q")
               if(class_name!=null){
                   clearInterval(class_text1)
               var class_answer_name=document.querySelector("#singleChoiceDiv > div:nth-child(2) > div.job-item-q").innerText
                   var data={
                "1.前进道路上，必须牢牢把握坚持以（          ）为中心的发展思想。": [
                    "C","C","D","C","C",
                    "D","D","B","D","A",
                    "D","C","D","C","B",
                    "B","C","C","C","C",
                    "A","C","B","A","C",
                    "D","D","B","B","C",
                    "ABCD","BCD","ABC","ABCDE","ACDE",
                    "BCDE","ABCD","ABCDE","ABCD","ABC",
                    "BCD","AB","ABC","ABCD","AB",
                    "ABC","ABC","AC","AB","AB",
                    "√","√","√","√","√",
                    "√","√","√","√","√",
                    "√","√","√","√","√",
                    "√","√","√","√","√",
                    "√","√","√","√","√",
                    "√","√","√","√","√",
                    "√","√","√","√","√",
                    "√","√","√","√","√"
                ]}
           var answer=data[class_answer_name]
           var map = {'A':0,'B':1,'C':2,'D':3,'E':4,'√':0};
            $('.job-item-a').each(function(index, queEle){
                answer[index].split('').forEach(ol =>{
                    $(queEle).find('input')[map[ol]].click()
                })
            })
        clearInterval(class_text1)
        }},2000)
        }
    // Your code here...
})();