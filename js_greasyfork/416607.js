// ==UserScript==
// @name         国开随学随考报考
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202105251740
// @description  国家开放大学随学随考报考脚本
// @author       流浪的蛊惑
// @match        *://*.open.com.cn/*
// @match        *://*.openedu.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416607/%E5%9B%BD%E5%BC%80%E9%9A%8F%E5%AD%A6%E9%9A%8F%E8%80%83%E6%8A%A5%E8%80%83.user.js
// @updateURL https://update.greasyfork.org/scripts/416607/%E5%9B%BD%E5%BC%80%E9%9A%8F%E5%AD%A6%E9%9A%8F%E8%80%83%E6%8A%A5%E8%80%83.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0;
    var t,sjh;
    var asjh=function(){
        t=document.getElementsByClassName("collapseBar")[0].getElementsByTagName("tr")[0];
        t.innerHTML="格式{场次名称,试卷号}一行一个<br />多个场次请先按场次排序<br /><textarea id=\"sjh\" cols=\"20\" rows=\"10\"></textarea><input type=\"button\" value=\"确定\" onclick='var x=document.getElementById(\"sjh\").value;var jh=x.split(\"\\n\");localStorage.clear();var tmp=\"\";var tjh=\"\";for(i=0;i<jh.length;i++){if(jh[i].split(\",\")[0]==tjh){tmp+=\"|\"+jh[i].split(\",\")[1];}else{if(tjh!=\"\"){localStorage.setItem(tjh,tmp);};tjh=jh[i].split(\",\")[0];tmp=jh[i].split(\",\")[1];}}if(tjh!=\"\"){localStorage.setItem(tjh,tmp);}if(localStorage.getItem(document.getElementById(\"ctl00_CPHMain_FvwExamPlan_FvwExamScene_LblExamSceneName\").innerText)==null){alert(\"似乎没有当前考场卷号！\");}else{if(document.getElementById(\"ctl00_CPHMain_BtnAddDel\").value==\"删除\"){window.location.reload()}else{window.location.reload();}}' />";
    };//随学随考科目添加/删除
    switch (window.location.pathname) {
        case "/zyddkw/ExamPlan/SceneSubjectList.aspx": //随学随考科目添加/删除
            var x = document.getElementById("ctl00_CPHMain_BtnAddDel");
            if(x.value=="删除"){
                if(localStorage.length>0){
                    if(localStorage.getItem(document.getElementById("ctl00_CPHMain_FvwExamPlan_FvwExamScene_LblExamSceneName").innerText)!=null){
                        sjh=localStorage.getItem(document.getElementById("ctl00_CPHMain_FvwExamPlan_FvwExamScene_LblExamSceneName").innerText);
                        if(document.getElementsByClassName("OpenGridViewPagerRow").length>0){
                            document.getElementsByClassName("collapseBar")[0].getElementsByTagName("tr")[0].innerHTML="<td>本场次共："+sjh.split("|").length+" 个卷号&nbsp;<input type=\"button\" value=\"重新输入卷号\" onclick='localStorage.clear();window.location.reload();' />"+document.getElementsByClassName("OpenGridViewPagerRow")[0].outerHTML+document.getElementsByClassName("pageNavBar")[0].outerHTML+"</td>";
                            document.getElementsByClassName("OpenGridViewPagerRow")[1].outerHTML="";
                            document.getElementsByClassName("pageNavBar")[1].outerHTML="";
                        }else{
                            localStorage.setItem("操作","0");//首次进入科目设置
                            document.getElementById("ctl00_CPHMain_OhlAvailableSetSceneSubject").click();
                        }
                    }else{
                        asjh();
                    }
                }else{
                    asjh();
                }
            }else{
                if(localStorage.length>0){
                    if(localStorage.getItem(document.getElementById("ctl00_CPHMain_FvwExamPlan_FvwExamScene_LblExamSceneName").innerText)!=null){
                        if(localStorage.getItem("操作")=="0"){
                            localStorage.setItem("操作","1");//从最后一页开始操作
                            document.getElementsByClassName("OpenGridViewPagerNavigation")[0].getElementsByTagName("a")[3].click();
                        }else{
                            sjh=localStorage.getItem(document.getElementById("ctl00_CPHMain_FvwExamPlan_FvwExamScene_LblExamSceneName").innerText);
                            document.getElementsByClassName("collapseBar")[0].getElementsByTagName("tr")[0].innerHTML="<td>本场次共："+sjh.split("|").length+" 个卷号，请从最后一页倒起添加以免遗漏&nbsp;<input type=\"button\" value=\"重新输入卷号\" onclick='localStorage.clear();window.location.reload();' />"+document.getElementsByClassName("OpenGridViewPagerRow")[0].outerHTML+document.getElementsByClassName("pageNavBar")[0].outerHTML+"</td>";
                            document.getElementsByClassName("OpenGridViewPagerRow")[1].outerHTML="";
                            document.getElementsByClassName("pageNavBar")[1].outerHTML="";
                            t=document.getElementById("ctl00_CPHMain_GvwSubject").getElementsByTagName("tr");
                            var tj=false;
                            for(i=1;i<t.length-1;i++){
                                if(i>0){if(sjh.indexOf(t[i].getElementsByTagName("td")[1].innerText)>-1){t[i].getElementsByTagName("td")[0].getElementsByTagName("input")[0].setAttribute("checked","checked");tj=true;}}
                            }
                            if(tj){
                                document.getElementById("ctl00_CPHMain_BtnAddDel").click();
                            }else{
                                var syy= document.getElementsByClassName("OpenGridViewPagerNavigation")[0].getElementsByTagName("a")[1];
                                if(syy.outerHTML.indexOf("href")>-1){
                                    syy.click();
                                }else{
                                    localStorage.removeItem("操作");
                                    document.getElementById("ctl00_CPHMain_btnBack").click();
                                }
                            }
                        }
                    }else{
                        asjh();
                    }
                }else{
                    asjh();
                }
            }
            break;//随学随考科目添加/删除结束
        case "/zyddkw/ExamPlan/AppointSceneList.aspx": //随学随考场次添加
            if(document.getElementsByClassName("OpenGridViewPagerRow").length>0){
                document.getElementsByClassName("collapseBar")[0].getElementsByTagName("tr")[0].innerHTML="<td>如设置错误请停用插件删除后再启用插件"+document.getElementsByClassName("OpenGridViewPagerRow")[0].outerHTML+document.getElementsByClassName("pageNavBar")[0].outerHTML+"</td>";
                document.getElementsByClassName("OpenGridViewPagerRow")[1].outerHTML="";
                document.getElementsByClassName("pageNavBar")[1].outerHTML="";
            }
            if(document.getElementsByClassName("icon-formrun").length>0){
                document.getElementsByClassName("icon-formrun")[0].click();//自动启用未启用项
            }else{
                t=document.getElementById("ctl00_CPHMain_GvwExamScene").getElementsByTagName("tr");//自动设置未设置资源
                for(i=1;i<t.length-1;i++){
                    if(t[i].getElementsByTagName("td")[4].innerText=="0"){
                        t[i].getElementsByTagName("td")[6].getElementsByClassName("icon-sureroom")[0].click();
                        break;
                    }
                }
            }
            break;//随学随考场次添加结束
        case "/zyddkw/ExamPlan/AppointAssignExamRoomByScene.aspx"://随学随考场次资源设置
            document.getElementById("ctl00_CPHMain_OGridExamRoomList_ctl02_chkSelect").click();
            document.getElementById("ctl00_CPHMain_ChkAgree").click();
            document.getElementById("ctl00_CPHMain_BtnOK").click();
            break;//随学随考场次资源设置结束
    }
})();