// ==UserScript==
// @name         UESTC学分查看辅助2
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  本脚本旨在方便学生计划自己的学分。
// @description  只在“课程管理->我的计划中生效”。
// @description  灰色斜体字：已经修过并拿到学分的科目
// @description  黄色背景：本学期正在学习的科目
// @description  绿色背景：下学期可选科目
// @description  P.S: 本脚本以每年的2月1日和8月1日作为学期的分界线。
// @author       RobinEatCorn
// @match        http://eams.uestc.edu.cn/eams/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386403/UESTC%E5%AD%A6%E5%88%86%E6%9F%A5%E7%9C%8B%E8%BE%85%E5%8A%A92.user.js
// @updateURL https://update.greasyfork.org/scripts/386403/UESTC%E5%AD%A6%E5%88%86%E6%9F%A5%E7%9C%8B%E8%BE%85%E5%8A%A92.meta.js
// ==/UserScript==


function compareArrays(a,b){
    if(a.length!=b.length)return false;
    for(let i=0;i<a.length;i++){
        if(a[i]!=b[i])return false;
    }
    return true;
}

function matchCourses(txt,tbs){
    var flag=false;
    for(let i=0;i<tbs.length;i++){
        flag|=(txt.indexOf(tbs[i])!=-1);
    }
    return flag;
}

function setStyles(x){
    "使得x之后的5个格子都和x具有相同的样式"
    //console.log(x.nextElementSibling);
    var y;
    for(let i=0;i<5;i=i+1){
        y=x.nextElementSibling;
        y.style.color=x.style.color;
        y.style.fontStyle=x.style.fontStyle;
        y.style.fontWeight=x.style.fontWeight;
        y.style.fontSize=x.style.fontSize;
        y.bgColor=x.bgColor;
        x=y;
    }
}

function processPage(){
    var dt=new Date();
    var nextSemesterCourses=[];
    var courses=[];
    var ids=0;
    var XHR_ids=new XMLHttpRequest();
    var res;

    function getIds(){
        XHR_ids.onreadystatechange=()=>{
            if(XHR_ids.readyState==4&&XHR_ids.status==200){
                res=XHR_ids.response;
                var stt=res.indexOf("form,\"ids\",")+12;
                var ed=stt;
                while("0"<=res[ed]&&res[ed]<="9")ed++;
                ids=Number(res.substr(stt,ed-stt));
                console.log(`Get ids=${ids}`);
                checkSemester(0,processCheck,[]);
            }
        }
        XHR_ids.open("GET","/eams/courseTableForStd.action",true);
        XHR_ids.send();
    }

    function compareArrays(a,b){
        if(a.length!=b.length)return false;
        for(let i=0;i<a.length;i++){
            if(a[i]!=b[i])return false;
        }
        return true;
    }

    function matchCourses(txt,tbs){
        var flag=false;
        for(let i=0;i<tbs.length;i++){
            flag|=(txt.indexOf(tbs[i])!=-1);
        }
        return flag;
    }

    function setStyles(x){
        "使得x之后的5个格子都和x具有相同的样式"
        //console.log(x.nextElementSibling);
        var y;
        for(let i=0;i<5;i=i+1){
            y=x.nextElementSibling;
            y.style.color=x.style.color;
            y.style.fontStyle=x.style.fontStyle;
            y.style.fontWeight=x.style.fontWeight;
            y.style.fontSize=x.style.fontSize;
            y.bgColor=x.bgColor;
            x=y;
        }
    }


    var pInnerText=document.getElementsByTagName("p")[0].innerText;
    var pCut=pInnerText.indexOf("生效日期：")+5;
    var sttDate=Number(pInnerText.substr(pCut,4));

    currentSemester=2*(dt.getFullYear()-sttDate)-(dt.getMonth()<2)+(dt.getMonth()>8);
    var nextSemester=currentSemester+1;

    if(nextSemester<8){
        var table=document.getElementsByTagName("table")[3+2*nextSemester];
        var trs=table.getElementsByTagName("tr");
        for(let i=0;i<trs.length;i++){
            nextSemesterCourses.push(trs[i].children[1].innerText);
        }
    }

    if(courses.length==0){
        courses=document.getElementsByClassName("course");
    }
    for(let i=0;i<courses.length;i++){
        if(matchCourses(courses[i].innerText,nextSemesterCourses)){
            courses[i].bgColor="#00ff00";
            setStyles(courses[i]);
        }
    }


    var latestCourses=[];

    function checkSemester(s,callback,latch){
        "callback(s,currentCourses,latch)"
        var fd=new FormData();
        var XHR=new XMLHttpRequest();
        var currentCourses=[];
        var doc;

        fd.append("ignoreHead","1");
        fd.append("setting.kind","std");
        fd.append("startWeek","1");
        fd.append("project.id","1");
        fd.append("isEng","0");
        fd.append("semester.id",String(s));
        fd.append("ids",ids);

        XHR.addEventListener("load",()=>{console.log("Done");});
        XHR.addEventListener("error",()=>{alert("Error");});
        XHR.onreadystatechange=()=>{
            if(XHR.readyState==4&&XHR.status==200){
                var parser=new DOMParser();
                doc=parser.parseFromString(XHR.response,"text/html");
                var tbd=doc.getElementsByTagName("tbody")[1];
                trs=tbd.getElementsByTagName("tr");
                if(trs.length<=1){callback(s,currentCourses,latch);return;}
                for(let i=0;i<trs.length;i++){
                    currentCourses.push(trs[i].children[2].innerText);
                }

                callback(s,currentCourses,latch);

            }
        }

        XHR.open("POST","/eams/courseTableForStd!courseTable.action",true);
        XHR.send(fd);
    }

    function processCheck(s,currentCourses,latch){
        if(currentCourses.length==0){
            //此时latch中是目前最新的课表
            currentCourses=latch;
            latestCourses=latch;
            if(courses.length==0){
                courses=document.getElementsByClassName("course");
            }
            for(let i=0;i<courses.length;i++){
                if(matchCourses(courses[i].innerText,currentCourses)){
                    courses[i].bgColor="#ffff00";
                    setStyles(courses[i]);
                }
            }

        } else {
            console.log(s);
            checkSemester(s+20,processCheck,currentCourses);
        }
    }

    //checkSemester(0,processCheck,[]);
    getIds();

    var xhttp=new XMLHttpRequest();
    var doc;
    var coursesName=[];
    var currentSemester=0;


    xhttp.onreadystatechange=()=>{
        if(xhttp.readyState==4&&xhttp.status==200){
            //处理xhttp带来的网页
            var parser=new DOMParser();
            doc=parser.parseFromString(xhttp.response,"text/html");
            var tds=doc.getElementsByTagName("td");
            for(let i=63;i<tds.length;i++){
                if(tds[i].colSpan==4&&tds[i].innerText.length>1){
                    coursesName.push(tds[i].innerText);
                    var smst=Number(tds[i].previousElementSibling.innerText);
                    currentSemester=(smst>currentSemester)?smst:currentSemester;
                    //console.log(tds[i]);
                }
            }
            currentSemester++;
            //匹配课程

            if(courses.length==0){
                courses=document.getElementsByClassName("course");
            }
            for(let i=0;i<courses.length;i++){
                if(matchCourses(courses[i].innerText,coursesName)){
                    courses[i].style.color="gray";
                    courses[i].style.fontStyle="italic";
                    //console.log(courses[i]);
                    setStyles(courses[i]);
                }
            }

        }
    }
    xhttp.open("GET","/eams/teach/grade/transcript/stdFinal.action",true);
    xhttp.send();




}

function checkAndProcess(){
    if(location.href.indexOf("http://eams.uestc.edu.cn/eams/programDoc!info.action")!=-1){
        processPage();
    }
}

(function() {
    'use strict';

    document.addEventListener("click",()=>{
        setTimeout(checkAndProcess,1000);
    });

    window.onload=()=>{
        setTimeout(checkAndProcess,1000);
    }
})();