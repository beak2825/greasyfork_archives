// ==UserScript==
// @name         教学点平台辅助
// @namespace    https://greasyfork.org/zh-CN/users/707063-genexy
// @version      202106041030
// @description  四川开放大学,教学点平台辅助,现有模块：1、毕业申请辅助
// @author       流浪的蛊惑
// @match        *://zkjw.scrtvu.net*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416763/%E6%95%99%E5%AD%A6%E7%82%B9%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/416763/%E6%95%99%E5%AD%A6%E7%82%B9%E5%B9%B3%E5%8F%B0%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var i=0;
    var td;
    var tmp;
    switch(window.location.pathname){
        case "/StationWeb/pages/common/frameset.jsp"://首页跳到菜单上
            location.href="/StationWeb/pages/common/navigation.jsp";
            break;
        case "/StationWeb/pages/graduate/auditgraduate.htm"://审批毕业申请
            location.href="/StationWeb/pages/graduate/auditgraduatebar.jsp";
            break;
        case "/StationWeb/pages/graduate/wholeapplygraduate.jsp"://教学点毕业申请
            td=document.getElementsByClassName("TableTitle");
            if(td.length>0){
                tmp="格式{学号,不申请毕业,不申请学位}<br /><textarea id=\"sqsj\" rows=\"6\" cols=\"50\"></textarea>";//毕业申请数据
                tmp+="<br /><input type=\"button\" value=\"开始批量申请\" ";
                tmp+="onclick=\"var s=document.getElementById('sqsj').value.split('\\n');localStorage.clear();for(i=0;i<s.length;i++)";
                tmp+="{if(s[i].split(',').length==3){var q=s[i].split(',');localStorage.setItem(q[0],q[1]+','+q[2]);";
                tmp+="if(i==0){document.getElementsByName('stunum')[0].value=q[0];}";
                tmp+="}}document.getElementsByName('method')[0].click();\" />";
                td[0].innerHTML=tmp;
            }
            break;
        case "/StationWeb/wholeApplyGraduateAction.do"://毕业申请操作
            tmp=localStorage.getItem(document.getElementsByName('stunum')[0].value);
            if(tmp!=null){
                document.getElementsByName("bybz[1]")[0].value=tmp.split(",")[0]=="申请毕业"?1:0;
                document.getElementsByName("xwbz[1]")[0].value=tmp.split(",")[1]=="申请国开学位"?3:tmp.split(",")[1]=="申请合作高校学位"?1:0;
                localStorage.removeItem(document.getElementsByName('stunum')[0].value);
                document.getElementsByName("method")[0].click();
            }else{
                if(localStorage.length>0){
                    document.getElementsByName("stunum")[0].value=localStorage.key(0);
                    tmp=localStorage.getItem(document.getElementsByName("stunum")[0].value);
                    var q=document.getElementsByName("stunum")[0].value.split(",");
                    document.getElementsByName("stunum")[0].value=q[0];
                    document.getElementsByName("method")[document.getElementsByName("method").length-1].click();
                }else{
                    location.href="/StationWeb/pages/graduate/wholeapplygraduate.jsp";
                }
            }
            break;
    }
})();