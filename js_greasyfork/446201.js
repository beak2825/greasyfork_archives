// ==UserScript==
// @name         SCLECBLD
// @namespace    http://tampermonkey.net/
// @version          3.9
// @description  sclecbldtools
// @author       shenhua
// @match      *://*.sclecb.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/446201/SCLECBLD.user.js
// @updateURL https://update.greasyfork.org/scripts/446201/SCLECBLD.meta.js
// ==/UserScript==

(function() {
    'use strict';
setTimeout(function(){
          sclecb();
 },10000)
$(document).keydown(function (event) {
    if (event.keyCode == 36) {
        sclecb();
    }
});
function sclecb(){
     const pattern=/[']/g;
     function add(question,answer){
        question = window.encodeURIComponent(question);
        answer = window.encodeURIComponent(answer);
        //var data = 'timu='+question+'&daan='+answer+'';
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','https://uptk.shen668.cn/wkapiadd.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("timu="+question+"&daan="+answer+"");//发送请求 将情头体写在send中
        /**
 * 获取数据后的处理程序
 */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var addres = JSON.parse(json).ad
                console.log("服务器返回录入结果："+addres+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
            }}
    };

 function search(question,da){
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','https://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("tm="+window.encodeURIComponent(question));//发送请求 将情头体写在send中
        /**
 * 获取数据后的处理程序
 */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var srhtimu = JSON.parse(json).tm
                var srhdaan = JSON.parse(json).answer
                console.log("服务器返回题目："+srhtimu);

                if(srhdaan.includes("题库未收录该题")&&da!=undefined&&da!=""&&da!=null){
                        add(srhtimu,da)
                        console.log("服务器返回答案："+srhdaan);
                }else{
                        console.log("服务器返回答案："+srhdaan+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                }

            }}
     };

 function doSearch(question,opA,opB,opC,opD,opE,sub){
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','https://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("tm="+window.encodeURIComponent(question));//发送请求 将情头体写在send中
        /**
 * 获取数据后的处理程序
 */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var srhtimu;
                var srhdaan;
                srhtimu = JSON.parse(json).tm
                srhdaan = JSON.parse(json).answer
                var len = srhdaan.split("#").length;
                if(sub=="英语"){
                    srhdaan = srhdaan.replace(pattern, "")
                    if(len==1){
                        if(opA!=undefined){
                            if(opA.text().split("A")[1]!=undefined){//.replace(/(^\s*)|(\s*$)/g, "")
                                if(srhdaan.indexOf(opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, ""))!=-1&&srhdaan==opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")){
                                if(opA.attr("class")!="Hover"){
                                    opA.children().eq(0).children().click();
                                     if(opA.attr("class")!="Hover"){
                                         opA.children().eq(0).children().eq(1).click();
                                     }
                                }
                            }}}
                    if(opB!=undefined){
                        if(opB.text().split("B")[1]!=undefined){
                            if(srhdaan.indexOf(opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, ""))!=-1&&srhdaan==opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")){
                                if(opB.attr("class")!="Hover"){
                                    opB.children().eq(0).children().click();
                                    if(opB.attr("class")!="Hover"){
                                         opB.children().eq(0).children().eq(1).click();
                                     }
                                }
                            }}}
                    if(opC!=undefined){
                        if(opC.text().split("C")[1]!=undefined){
                            if(srhdaan.indexOf(opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, ""))!=-1&&srhdaan==opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")){
                                if(opC.attr("class")!="Hover"){
                                    opC.children().eq(0).children().click();
                                    if(opC.attr("class")!="Hover"){
                                         opC.children().eq(0).children().eq(1).click();
                                    }
                                }
                            }}}
                    if(opD!=undefined){
                        if(opD.text().split("D")[1]!=undefined){
                            if(srhdaan.indexOf(opD.text().split("D")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, ""))!=-1&&srhdaan==opD.text().split("D")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")){
                                if(opD.attr("class")!="Hover"){
                                    opD.children().eq(0).children().click();
                                    if(opD.attr("class")!="Hover"){
                                         opD.children().eq(0).children().eq(1).click();
                                    }
                                }
                            }}}
                    if(opE!=undefined){
                        if(opE.text().split("E")[1]!=undefined){
                            if(srhdaan.indexOf(opE.text().split("E")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, ""))!=-1&&srhdaan==opE.text().split("E")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")){
                                if(opE.attr("class")!="Hover"){
                                    opE.children().eq(0).children().click();
                                    if(opE.attr("class")!="Hover"){
                                         opE.children().eq(0).children().eq(1).click();
                                    }
                                }
                            }}}
                }else if(len>=2){
                    if(opA!=undefined){
                        if(opA.text().split("A")[1]!=undefined){
                            if(("A"+srhdaan.split("#")[4])==opA.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("A"+srhdaan.split("#")[3])==opA.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("A"+srhdaan.split("#")[2])==opA.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("A"+srhdaan.split("#")[1])==opA.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("A"+srhdaan.split("#")[0])==opA.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[0]==opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[1]==opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[2]==opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[3]==opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[4]==opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")){
                                if(opA.attr("class")!="Hover"){
                                    opA.children().eq(0).children().click();
                                    if(opA.attr("class")!="Hover"){
                                         opA.children().eq(0).children().eq(1).click();
                                    }
                                }
                            }}}
                    if(opB!=undefined){
                        if(opB.text().split("B")[1]!=undefined){
                            if(("B"+srhdaan.split("#")[4])==opB.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("B"+srhdaan.split("#")[3])==opB.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("B"+srhdaan.split("#")[2])==opB.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("B"+srhdaan.split("#")[1])==opB.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("B"+srhdaan.split("#")[0])==opB.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[0]==opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[1]==opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[2]==opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[3]==opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[4]==opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")){
                                if(opB.attr("class")!="Hover"){
                                    opB.children().eq(0).children().click();
                                    if(opB.attr("class")!="Hover"){
                                         opB.children().eq(0).children().eq(1).click();
                                    }
                                }
                            }}}
                    if(opC!=undefined){
                        if(opC.text().split("C")[1]!=undefined){
                            if(("C"+srhdaan.split("#")[4])==opC.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("C"+srhdaan.split("#")[3])==opC.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("C"+srhdaan.split("#")[2])==opC.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("C"+srhdaan.split("#")[1])==opC.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("C"+srhdaan.split("#")[0])==opC.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[0]==opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[1]==opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[2]==opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "")||srhdaan.split("#")[3]==opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "").replace(pattern, "")||srhdaan.split("#")[4]==opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")){
                                if(opC.attr("class")!="Hover"){
                                    opC.children().eq(0).children().click();
                                    if(opC.attr("class")!="Hover"){
                                         opC.children().eq(0).children().eq(1).click();
                                    }
                                }
                            }}}
                if(opD!=undefined){
                   if(opD.text().split("D")[1]!=undefined){
                    if(("D"+srhdaan.split("#")[4])==opD.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("D"+srhdaan.split("#")[3])==opD.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("D"+srhdaan.split("#")[2])==opD.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("D"+srhdaan.split("#")[1])==opD.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("D"+srhdaan.split("#")[0])==opD.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[0]==opD.text().split("D")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[1]==opD.text().split("D")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[2]==opD.text().split("D")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[3]==opD.text().split("D")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[4]==opD.text().split("D")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")){
                                if(opD.attr("class")!="Hover"){
                                    opD.children().eq(0).children().click();
                                    if(opD.attr("class")!="Hover"){
                                         opD.children().eq(0).children().eq(1).click();
                                    }
                                }
                            }}}
                    if(opE!=undefined){
                        if(opE.text().split("E")[1]!=undefined){
                            if(("E"+srhdaan.split("#")[4])==opE.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("E"+srhdaan.split("#")[3])==opE.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("E"+srhdaan.split("#")[2])==opE.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("E"+srhdaan.split("#")[1])==opE.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||("E"+srhdaan.split("#")[0])==opE.text().replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[0]==opE.text().split("E")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[1]==opE.text().split("E")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[2]==opE.text().split("E")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[3]==opE.text().split("E")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")||srhdaan.split("#")[4]==opE.text().split("E")[1].replace(/(^\s*)|(\s*$)/g, "").replace(pattern, "")){
                                if(opE.attr("class")!="Hover"){
                                    opE.children().eq(0).children().click();
                                    if(opE.attr("class")!="Hover"){
                                         opE.children().eq(0).children().eq(1).click();
                                     }
                                }
                            }}}
                      }
                }else if(sub=="非英语"){///////////////////////////////////////////////////////////////////////////////////////////////////////////////
                   // console.log(len);
                    if(len==1){
                        if(opA!=undefined){
                            if(opA.text().split("A.")[1]!=undefined){//.replace(/(^\s*)|(\s*$)/g, "")
                                if(srhdaan.indexOf(opA.text().split("A.")[1].replace(/(^\s*)|(\s*$)/g,""))!=-1&&srhdaan==opA.text().split("A.")[1].replace(/(^\s*)|(\s*$)/g,"")){
                                if(opA.attr("checked")!="checked"){
                                    opA.attr("checked","checked");
                                    opA.children().children().eq(0).children().eq(1).click();
                                }
                            }}}
                    if(opB!=undefined){
                        if(opB.text().split("B.")[1]!=undefined){
                            if(srhdaan.indexOf(opB.text().split("B.")[1].replace(/(^\s*)|(\s*$)/g,""))!=-1&&srhdaan==opB.text().split("B.")[1].replace(/(^\s*)|(\s*$)/g,"")){
                                if(opB.attr("checked")!="checked"){
                                    opB.attr("checked","checked");
                                    opB.children().children().eq(0).children().eq(1).click();
                                }
                            }}}
                    if(opC!=undefined){
                        if(opC.text().split("C.")[1]!=undefined){
                            if(srhdaan.indexOf(opC.text().split("C.")[1].replace(/(^\s*)|(\s*$)/g,""))!=-1&&srhdaan==opC.text().split("C.")[1].replace(/(^\s*)|(\s*$)/g,"")){
                                if(opC.attr("checked")!="checked"){
                                    opC.attr("checked","checked");
                                    opC.children().children().eq(0).children().eq(1).click();
                                }
                            }}}
                    if(opD!=undefined){
                        if(opD.text().split("D.")[1]!=undefined){
                            if(srhdaan.indexOf(opD.text().split("D.")[1].replace(/(^\s*)|(\s*$)/g,""))!=-1&&srhdaan==opD.text().split("D.")[1].replace(/(^\s*)|(\s*$)/g,"")){
                                if(opD.attr("checked")!="checked"){
                                    opD.attr("checked","checked");
                                    opD.children().children().eq(0).children().eq(1).click();
                                }
                            }}}
                    if(opE!=undefined){
                        if(opE.text().split("E.")[1]!=undefined){
                            if(srhdaan.indexOf(opE.text().split("E.")[1].replace(/(^\s*)|(\s*$)/g,""))!=-1&&srhdaan==opE.text().split("E.")[1].replace(/(^\s*)|(\s*$)/g,"")){
                                if(opE.attr("class")!="checked"){
                                    opE.attr("checked","checked");
                                    opE.children().children().eq(0).children().eq(1).click();
                                }
                            }}}
                }else if(len>=2){
                    if(opA!=undefined){
                        if(opA.text().split("A.")[1]!=undefined){
                            if(("A."+srhdaan.split("#")[4])==opA.text().replace(/(^\s*)|(\s*$)/g,"")||("A."+srhdaan.split("#")[3])==opA.text().replace(/(^\s*)|(\s*$)/g,"")||("A."+srhdaan.split("#")[2])==opA.text().replace(/(^\s*)|(\s*$)/g,"")||("A."+srhdaan.split("#")[1])==opA.text().replace(/(^\s*)|(\s*$)/g,"")||("A."+srhdaan.split("#")[0])==opA.text().replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[0]==opA.text().split("A.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[1]==opA.text().split("A.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[2]==opA.text().split("A.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[3]==opA.text().split("A.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[4]==opA.text().split("A.")[1].replace(/(^\s*)|(\s*$)/g,"")){
                                if(opA.attr("checked")!="checked"){
                                   setTimeout(function(){
                                         opA.attr("checked","checked");
                                         opA.children().eq(0).children().eq(0).children().eq(1).click();
                                   },500)
                                }
                            }}}
                    if(opB!=undefined){
                        if(opB.text().split("B.")[1]!=undefined){
                            if(("B."+srhdaan.split("#")[4])==opB.text().replace(/(^\s*)|(\s*$)/g,"")||("B."+srhdaan.split("#")[3])==opB.text().replace(/(^\s*)|(\s*$)/g,"")||("B."+srhdaan.split("#")[2])==opB.text().replace(/(^\s*)|(\s*$)/g,"")||("B."+srhdaan.split("#")[1])==opB.text().replace(/(^\s*)|(\s*$)/g,"")||("B."+srhdaan.split("#")[0])==opB.text().replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[0]==opB.text().split("B.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[1]==opB.text().split("B.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[2]==opB.text().split("B.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[3]==opB.text().split("B.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[4]==opB.text().split("B.")[1].replace(/(^\s*)|(\s*$)/g,"")){
                               if(opB.attr("checked")!="checked"){
                                setTimeout(function(){
                                    opB.attr("checked","checked");
                                    opB.children().eq(0).children().eq(0).children().eq(1).click();
                                },500)
                              }
                            }}}
                    if(opC!=undefined){
                        if(opC.text().split("C.")[1]!=undefined){
                            if(("C."+srhdaan.split("#")[4])==opC.text().replace(/(^\s*)|(\s*$)/g,"")||("C"+srhdaan.split("#")[3])==opC.text().replace(/(^\s*)|(\s*$)/g,"")||("C."+srhdaan.split("#")[2])==opC.text().replace(/(^\s*)|(\s*$)/g,"")||("C."+srhdaan.split("#")[1])==opC.text().replace(/(^\s*)|(\s*$)/g,"")||("C."+srhdaan.split("#")[0])==opC.text().replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[0]==opC.text().split("C.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[1]==opC.text().split("C.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[2]==opC.text().split("C.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[3]==opC.text().split("C.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[4]==opC.text().split("C.")[1].replace(/(^\s*)|(\s*$)/g,"")){
                                if(opC.attr("checked")!="checked"){
                                    setTimeout(function(){
                                        opC.attr("checked","checked");
                                        opC.children().eq(0).children().eq(0).children().eq(1).click();
                                      },500)
                                }
                            }}}
                    if(opD!=undefined){
                        if(opD.text().split("D.")[1]!=undefined){
                            if(("D."+srhdaan.split("#")[4])==opD.text().replace(/(^\s*)|(\s*$)/g,"")||("D."+srhdaan.split("#")[3])==opD.text().replace(/(^\s*)|(\s*$)/g,"")||("D."+srhdaan.split("#")[2])==opD.text().replace(/(^\s*)|(\s*$)/g,"")||("D."+srhdaan.split("#")[1])==opD.text().replace(/(^\s*)|(\s*$)/g,"")||("D."+srhdaan.split("#")[0])==opD.text().replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[0]==opD.text().split("D.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[1]==opD.text().split("D.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[2]==opD.text().split("D.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[3]==opD.text().split("D.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[4]==opD.text().split("D.")[1].replace(/(^\s*)|(\s*$)/g,"")){
                               if(opD.attr("checked")!="checked"){
                                   setTimeout(function(){
                                       opD.attr("checked","checked");
                                       opD.children().eq(0).children().eq(0).children().eq(1).click();
                                   },500)
                               }
                            }}}
                    if(opE!=undefined){
                        if(opE.text().split("E.")[1]!=undefined){
                            if(("E."+srhdaan.split("#")[4])==opE.text().replace(/(^\s*)|(\s*$)/g,"")||("E."+srhdaan.split("#")[3])==opE.text().replace(/(^\s*)|(\s*$)/g,"")||("E."+srhdaan.split("#")[2])==opE.text().replace(/(^\s*)|(\s*$)/g,"")||("E."+srhdaan.split("#")[1])==opE.text().replace(/(^\s*)|(\s*$)/g,"")||("E."+srhdaan.split("#")[0])==opE.text().replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[0]==opE.text().split("E.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[1]==opE.text().split("E.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[2]==opE.text().split("E.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[3]==opE.text().split("E.")[1].replace(/(^\s*)|(\s*$)/g,"")||srhdaan.split("#")[4]==opE.text().split("E.")[1].replace(/(^\s*)|(\s*$)/g,"")){
                                if(opE.attr("checked")!="checked"){
                                    setTimeout(function(){
                                        opE.attr("checked","checked");
                                        opE.children().eq(0).children().eq(0).children().eq(1).click();
                                    },500)
                                }
                            }}}
                      }
                }
                if(srhdaan.indexOf("正确")!=-1&&srhdaan=="正确"){
                          if(opA.attr("checked")!="checked"){
                            opA.attr("checked","checked");
                            opA.children().children().eq(0).children().eq(1).click();
                              //if(opA.attr("class")!="Hover"){
                                        // opA.children().eq(0).children().eq(1).click();
                             //}
                          }
                }
                if(srhdaan.indexOf("错误")!=-1&&srhdaan=="错误"){
                           if(opB.attr("checked")!="checked"){
                               opB.attr("checked","checked");
                               opB.children().children().eq(0).children().eq(1).click();
                               //if(opB.attr("class")!="Hover"){
                                         //opB.children().eq(0).children().eq(1).click();
                                //}
                          }
                }
                console.log("服务器返回题目："+srhtimu);
                console.log("服务器返回答案："+srhdaan);
                if(srhdaan!=undefined){
                    if(srhdaan.includes("题库未收录该题")){
                        console.log("由于题库未收录该题，当前为做题界面，请前往录题界面录入该题！\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
                    }else{
                        console.log("已经为本题选择了正确的答案！\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------")
                         }
                }

          }}
     };

     var TiMu;
     var option;
     var len;
     var lenc;
     var opA;
     var opB;
     var opC;
     var opD;
     var opE;
     var das;
     var da;
     var ln;
     var da1;
     var da2;
     var da3;
     var da4;
     var da5;
     var timu;
     var sub;

     var menu = $(".ta-c").text();//录题界面
     var domenu = $(".ta-c").text();//答题界面

     console.log(domenu);
     var subject = $(".ft18").text().replace(/(^\s*)|(\s*$)/g,"");
    if(subject.indexOf("英语")!=-1){
            sub = "英语";
            if(menu.indexOf("倒计时")!=-1){
     console.log("WARING：当前位于录题界面！");
     $(".TiMu").each(function(i){
           TiMu = $(".TiMu").eq(i).children().eq(0).children().eq(1).text().replace(/(^\s*)|(\s*$)/g, "");
           len = $(".TiMu").eq(i).children().eq(1).children('li').length;
           console.log("网页题目："+ TiMu);
           if(len==4){
                opA = $(".TiMu").eq(i).children().eq(1).children().eq(0);
                opB = $(".TiMu").eq(i).children().eq(1).children().eq(1);
                opC = $(".TiMu").eq(i).children().eq(1).children().eq(2);
                opD = $(".TiMu").eq(i).children().eq(1).children().eq(3);
                option = opA.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opB.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opC.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opD.text().replace(/(^\s*)|(\s*$)/g, "")+"\n";
                console.log("网页选项：\n"+option);
                das = $(".TiMu").eq(i).children().eq(2).text().split("正确答案：")[1].split("我的答案：")[0].replace(/(^\s*)|(\s*$)/g, "");
                ln = das.length;//ABD
                if(ln==1){
                        if(opA.text().indexOf(das)!=-1){
                              da = opA.text().split("A、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }else if(opB.text().indexOf(das)!=-1){
                              da = opB.text().split("B、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }else if(opC.text().indexOf(das)!=-1){
                              da = opC.text().split("C、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }else if(opD.text().indexOf(das)!=-1){
                              da = opD.text().split("D、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }
                }else{
                         if(das.indexOf(opA.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da1 = opA.text().split("A、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da1 = ""
                         }
                         if(das.indexOf(opB.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da2 = opB.text().split("B、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da2 = ""
                         }
                         if(das.indexOf(opC.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da3 = opC.text().split("C、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da3 = ""
                         }
                         if(das.indexOf(opD.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da4 = opD.text().split("D、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da4 = ""
                         }
                         da = da1 + da2 + da3 + da4;
                         da = da.substring(0,da.length-1).replace(/(^\s*)|(\s*$)/g, "");
                }
                 timu = (TiMu + opA.text().replace(/(^\s*)|(\s*$)/g, "")+opB.text().replace(/(^\s*)|(\s*$)/g, "")+opC.text().replace(/(^\s*)|(\s*$)/g, "")+opD.text().replace(/(^\s*)|(\s*$)/g, "")).replace(/(^\s*)|(\s*$)/g, "");
                console.log("待录入题目："+ timu.replace(pattern, ""));
                console.log("网页答案："+ da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                search(timu.replace(pattern, ""),da.replace(pattern, ""));
           }else if(len==3){
                opA = $(".TiMu").eq(i).children().eq(1).children().eq(0);
                opB = $(".TiMu").eq(i).children().eq(1).children().eq(1);
                opC = $(".TiMu").eq(i).children().eq(1).children().eq(2);
                option = opA.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opB.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opC.text().replace(/(^\s*)|(\s*$)/g, "")+"\n";
                console.log("网页选项：\n"+option);
                das = $(".TiMu").eq(i).children().eq(2).text().split("正确答案：")[1].split("我的答案：")[0].replace(/(^\s*)|(\s*$)/g, "");
                ln = das.length;//ABD
                if(ln==1){
                        if(opA.text().indexOf(das)!=-1){
                              da = opA.text().split("A、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }else if(opB.text().indexOf(das)!=-1){
                              da = opB.text().split("B、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }else if(opC.text().indexOf(das)!=-1){
                              da = opC.text().split("C、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }
                }else{
                         if(das.indexOf(opA.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da1 = opA.text().split("A、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da1 = ""
                         }
                         if(das.indexOf(opB.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da2 = opB.text().split("B、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da2 = ""
                         }
                         if(das.indexOf(opC.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da3 = opC.text().split("C、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da3 = ""
                         }
                         da = da1 + da2 + da3;
                         da = da.substring(0,da.length-1).replace(/(^\s*)|(\s*$)/g, "");
                }
                 timu = (TiMu + opA.text().replace(/(^\s*)|(\s*$)/g, "")+opB.text().replace(/(^\s*)|(\s*$)/g, "")+opC.text().replace(/(^\s*)|(\s*$)/g, "")).replace(/(^\s*)|(\s*$)/g, "");
                console.log("待录入题目："+ timu.replace(pattern, ""));
                console.log("网页答案："+ da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                search(timu.replace(pattern, ""),da.replace(pattern, ""));
           }else if(len==2){
                opA = $(".TiMu").eq(i).children().eq(1).children().eq(0);
                opB = $(".TiMu").eq(i).children().eq(1).children().eq(1);
                option = opA.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opB.text().replace(/(^\s*)|(\s*$)/g, "")+"\n";
                console.log("网页选项：\n"+option);
                das = $(".TiMu").eq(i).children().eq(2).text().split("正确答案：")[1].split("我的答案：")[0].replace(/(^\s*)|(\s*$)/g, "");
                ln = das.length;//ABD
                if(ln==1){
                        if(opA.text().indexOf(das)!=-1){
                              da = opA.text().split("A、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }else if(opB.text().indexOf(das)!=-1){
                              da = opB.text().split("B、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }
                }else{
                         if(das.indexOf(opA.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da1 = opA.text().split("A、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da1 = ""
                         }
                         if(das.indexOf(opB.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da2 = opB.text().split("B、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da2 = ""
                         }
                         da = da1 + da2;
                         da = da.substring(0,da.length-1).replace(/(^\s*)|(\s*$)/g, "");
                }
                 timu = (TiMu + opA.text().replace(/(^\s*)|(\s*$)/g, "")+opB.text().replace(/(^\s*)|(\s*$)/g, "")).replace(/(^\s*)|(\s*$)/g, "");
                console.log("待录入题目："+ timu.replace(pattern, ""));
                console.log("网页答案："+ da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                search(timu.replace(pattern, ""),da.replace(pattern, ""));
           }else if(len==5){
                opA = $(".TiMu").eq(i).children().eq(1).children().eq(0);
                opB = $(".TiMu").eq(i).children().eq(1).children().eq(1);
                opC = $(".TiMu").eq(i).children().eq(1).children().eq(2);
                opD = $(".TiMu").eq(i).children().eq(1).children().eq(3);
                opE = $(".TiMu").eq(i).children().eq(1).children().eq(4);
                option = opA.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opB.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opC.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opD.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opE.text().replace(/(^\s*)|(\s*$)/g, "")+"\n";
                console.log("网页选项：\n"+option);
                das = $(".TiMu").eq(i).children().eq(2).text().split("正确答案：")[1].split("我的答案：")[0].replace(/(^\s*)|(\s*$)/g, "");
                ln = das.length;//ABD
                if(ln==1){
                        if(opA.text().indexOf(das)!=-1){
                              da = opA.text().split("A、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }else if(opB.text().indexOf(das)!=-1){
                              da = opB.text().split("B、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }else if(opC.text().indexOf(das)!=-1){
                              da = opC.text().split("C、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }else if(opD.text().indexOf(das)!=-1){
                              da = opD.text().split("D、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }else if(opE.text().indexOf(das)!=-1){
                              da = opE.text().split("E、")[1].replace(/(^\s*)|(\s*$)/g, "");
                        }
                }else{
                         if(das.indexOf(opA.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da1 = opA.text().split("A、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da1 = ""
                         }
                         if(das.indexOf(opB.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da2 = opB.text().split("B、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da2 = ""
                         }
                         if(das.indexOf(opC.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da3 = opC.text().split("C、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da3 = ""
                         }
                         if(das.indexOf(opD.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da4 = opD.text().split("D、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da4 = ""
                         }
                         if(das.indexOf(opE.text().replace(/(^\s*)|(\s*$)/g, "").split("、")[0])!=-1){
                              da5 = opE.text().split("E、")[1].replace(/(^\s*)|(\s*$)/g, "") + "#";
                         }else{
                              da5 = ""
                         }
                         da = da1 + da2 + da3 + da4 + da5;
                         da = da.substring(0,da.length-1).replace(/(^\s*)|(\s*$)/g, "");
                }
                 timu = (TiMu + opA.text().replace(/(^\s*)|(\s*$)/g, "")+opB.text().replace(/(^\s*)|(\s*$)/g, "")+opC.text().replace(/(^\s*)|(\s*$)/g, "")+opD.text().replace(/(^\s*)|(\s*$)/g, "")+opE.text().replace(/(^\s*)|(\s*$)/g, "")).replace(/(^\s*)|(\s*$)/g, "");
                console.log("待录入题目："+ timu.replace(pattern, ""));
                console.log("网页答案："+ da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                search(timu.replace(pattern, ""),da.replace(pattern, ""));
           }else if(len==0){
                opA = "A、正确";
                opB = "B、错误";
                option = opA.replace(/(^\s*)|(\s*$)/g, "")+"\n"+opB.replace(/(^\s*)|(\s*$)/g, "")+"\n";
                if($(".TiMu").eq(i).children().eq(1).text().split("正确答案：")[1]!=undefined){
                    console.log("网页选项：\n"+option);
                    timu = (TiMu + opA.replace(/(^\s*)|(\s*$)/g, "")+opB.replace(/(^\s*)|(\s*$)/g, "")).replace(/(^\s*)|(\s*$)/g, "");
                    das = $(".TiMu").eq(i).children().eq(1).text().split("正确答案：")[1].split("我的答案：")[0].replace(/(^\s*)|(\s*$)/g, "");
                    if(das=="√"){
                        da = "正确";
                    }else if(das=="×"){
                        da = "错误";
                    }
                    search(timu.replace(pattern, ""),da.replace(pattern, ""));
                    console.log("网页答案："+da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                }else{
                      var lenmin =  $(".readCompreHensionItem").length;
                       $(".readCompreHensionItem").each(function(n){
                           timu = $(".readCompreHensionItem").eq(n).children().eq(0).children().eq(1).text().replace(/(^\s*)|(\s*$)/g, "");
                           das = $(".readCompreHensionItem").eq(n).children().eq(1).text().split("正确答案：")[1].split("我的答案：")[0].replace(/(^\s*)|(\s*$)/g, "");
                           if(das=="√"){
                               da = "正确";
                           }else if(das=="×"){
                               da = "错误";
                           }
                            search(timu.replace(pattern, ""),da.replace(pattern, ""));
                            console.log("网页答案："+da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                       });
                }
                console.log("待录入题目："+ timu.replace(pattern, ""));
           }
         })
     }else if(domenu.indexOf("满分")!=-1){
          console.log("WARING：当前位于答题界面！");
          $(".TiMu").each(function(i){
              TiMu = $(".TiMu").eq(i).children().eq(0).children().eq(1).text().replace(/(^\s*)|(\s*$)/g, "");
              console.log("网页题目："+ TiMu);
              len = $(".TiMu").eq(i).children().eq(1).children().eq(0).children('li').length;
              if(len==4){
                  opA = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(0);
                  opB = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(1);
                  opC = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(2);
                  opD = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(3);
                  option = opA.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opB.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opC.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opD.text().replace(/(^\s*)|(\s*$)/g, "")+"\n";
                  option = "A、"+opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "")+"\nB、"+opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "")+"\nC、"+opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "")+"\nD、"+opD.text().split("D")[1].replace(/(^\s*)|(\s*$)/g, "");
                  timu = TiMu +"A、"+opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "")+"B、"+opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "")+"C、"+opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "")+"D、"+opD.text().split("D")[1].replace(/(^\s*)|(\s*$)/g, "");
                  console.log("处理后题目：\n"+timu.replace(pattern, ""));
                  console.log("网页选项：\n"+option);
                  doSearch(timu.replace(pattern, ""),opA,opB,opC,opD,opE,sub);
              }else if(len==3){
                  opA = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(0);
                  opB = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(1);
                  opC = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(2);
                  option = opA.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opB.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opC.text().replace(/(^\s*)|(\s*$)/g, "")+"\n";
                  option = "A、"+opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "")+"\nB、"+opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "")+"\nC、"+opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "");
                  timu = TiMu +"A、"+opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "")+"B、"+opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "")+"C、"+opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "");
                  console.log("处理后题目：\n"+timu.replace(pattern, ""));
                  console.log("网页选项：\n"+option);
                  doSearch(timu.replace(pattern, ""),opA,opB,opC,opD,opE,sub);
              }else if(len==2){
                  opA = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(0);
                  opB = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(1);
                  option = opA.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opB.text().replace(/(^\s*)|(\s*$)/g, "")+"\n";
                  option = "A、"+opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "")+"\nB、"+opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "");
                  timu = TiMu +"A、"+opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "")+"B、"+opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "");
                  console.log("处理后题目：\n"+timu.replace(pattern, ""));
                  console.log("网页选项：\n"+option);
                  doSearch(timu.replace(pattern, ""),opA,opB,opC,opD,opE,sub);
              }else if(len==5){
                  opA = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(0);
                  opB = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(1);
                  opC = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(2);
                  opD = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(3);
                  opE = $(".TiMu").eq(i).children().eq(1).children().eq(0).children().eq(4);
                  option = opA.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opB.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opC.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opD.text().replace(/(^\s*)|(\s*$)/g, "")+"\n"+opE.text().replace(/(^\s*)|(\s*$)/g, "")+"\n";
                  option = "A、"+opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "")+"\nB、"+opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "")+"\nC、"+opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "")+"\nD、"+opD.text().split("D")[1].replace(/(^\s*)|(\s*$)/g, "")+"\nE、"+opE.text().split("E")[1].replace(/(^\s*)|(\s*$)/g, "");
                  timu = TiMu +"A、"+opA.text().split("A")[1].replace(/(^\s*)|(\s*$)/g, "")+"B、"+opB.text().split("B")[1].replace(/(^\s*)|(\s*$)/g, "")+"C、"+opC.text().split("C")[1].replace(/(^\s*)|(\s*$)/g, "")+"D、"+opD.text().split("D")[1].replace(/(^\s*)|(\s*$)/g, "")+"E、"+opE.text().split("E")[1].replace(/(^\s*)|(\s*$)/g, "");
                  console.log("处理后题目：\n"+timu.replace(pattern, ""));
                  console.log("网页选项：\n"+option);
                  doSearch(timu.replace(pattern, ""),opA,opB,opC,opD,opE,sub);
              }else if(len==0){
                  opA = $(".TiMu").eq(i).children().eq(1).children().eq(0);
                  opB = $(".TiMu").eq(i).children().eq(1).children().eq(1);
                  option = "A、正确\nB、错误\n";
                  console.log("处理后题目：\n"+timu.replace(pattern, ""));
                  console.log("网页选项：\n"+option);
                   if($(".TiMu").eq(i).children().eq(1).text().indexOf("[判断题]")==-1){
                       timu = (TiMu + opA.replace(/(^\s*)|(\s*$)/g, "")+opB.replace(/(^\s*)|(\s*$)/g, "")).replace(/(^\s*)|(\s*$)/g, "");
                       doSearch(timu.replace(pattern, ""),opA,opB,opC,opD,opE,sub);
                   }else{
                         $(".readCompreHensionItem").each(function(n){
                             timu = $(".readCompreHensionItem").eq(n).children().eq(2).children().eq(1).text().replace(/(^\s*)|(\s*$)/g, "");
                             opA = $(".readCompreHensionItem").eq(n).children().eq(3).children().eq(0);
                             opB = $(".readCompreHensionItem").eq(n).children().eq(3).children().eq(1);
                             doSearch(timu.replace(pattern, ""),opA,opB,opC,opD,opE,sub);
                       });
                   }
              }
          });
       }
    }else{//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
     sub = "非英语";
     if(menu.indexOf("成绩")!=-1){
     console.log("WARING：当前位于录题界面！");
     $(".questiono-item").each(function(i){
           TiMu = $(".questiono-item").eq(i).children().eq(0).children().eq(1).text().replace(/\s*/g,"");
           len = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.common_test_option').length;
           console.log("网页题目："+ TiMu);
           //console.log("len:"+len);
           if(len==4){
                opA = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0);
                opB = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(1);
                opC = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(2);
                opD = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(3);
                option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n"+opC.text().replace(/\s*/g,"")+"\n"+opD.text().replace(/\s*/g,"")+"\n";
                console.log("网页选项：\n"+option);
                timu = TiMu +"A"+opA.text().replace(/\s*/g,"").split("A")[1]+"B"+opB.text().replace(/\s*/g,"").split("B")[1]+"C"+opC.text().replace(/\s*/g,"").split("C")[1]+"D"+opD.text().replace(/\s*/g,"").split("D")[1];
                console.log("搜索题目："+ timu);
                //console.log("本题总分："+$(".questiono-item").eq(i).children().eq(0).children().eq(2).text().split("分")[0].replace(/(^\s*)|(\s*$)/g,""));
                //console.log("本题得分："+$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(4).children().children().eq(1).children().eq(1).text().replace(/(^\s*)|(\s*$)/g,""));
                if($(".questiono-item").eq(i).children().eq(0).children().eq(2).text().split("分")[0].replace(/\s*/g,"")==$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(4).children().children().eq(1).children().eq(1).text().replace(/\s*/g,"")){
                        $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').each(function(j){
                                     if(j==0){
                                         if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("A.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("A.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("B.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("B.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("C.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("C.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("D.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("D.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("E.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("E.")[1].replace(/\s*/g,"")
                                         }
                                     }else{
                                         if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("A.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("A.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("B.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("B.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("C.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("C.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("D.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("D.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("E.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("E.")[1].replace(/\s*/g,"")
                                         }
                                         
                                     }
                        })
                  da = das;
                //console.log("待录入题目："+ timu);
                console.log("当前题正确可以录入网页答案："+ da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                search(timu,da);
                }else{
                        console.log("当前题错误不可以录入\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                }
           }else if(len==5){
                opA = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0);
                opB = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(1);
                opC = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(2);
                opD = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(3);
                opE = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(4);
                option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n"+opC.text().replace(/\s*/g,"")+"\n"+opD.text().replace(/\s*/g,"")+"\n"+opE.text().replace(/\s*/g,"")+"\n";
                console.log("网页选项：\n"+option);
                timu = TiMu +"A"+opA.text().replace(/\s*/g,"").split("A")[1]+"B"+opB.text().replace(/\s*/g,"").split("B")[1]+"C"+opC.text().replace(/\s*/g,"").split("C")[1]+"D"+opD.text().replace(/\s*/g,"").split("D")[1]+"E"+opE.text().replace(/\s*/g,"").split("E")[1];
                console.log("搜索题目："+ timu);
                //console.log("本题总分："+$(".questiono-item").eq(i).children().eq(0).children().eq(2).text().split("分")[0].replace(/(^\s*)|(\s*$)/g,""));
                //console.log("本题得分："+$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(5).children().children().eq(1).children().eq(1).text().replace(/(^\s*)|(\s*$)/g,""));
                if($(".questiono-item").eq(i).children().eq(0).children().eq(2).text().split("分")[0].replace(/\s*/g,"")==$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(5).children().children().eq(1).children().eq(1).text().replace(/\s*/g,"")){
                        $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').each(function(j){
                                     if(j==0){
                                         if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("A.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("A.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("B.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("B.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("C.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("C.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("D.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("D.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("E.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("E.")[1].replace(/\s*/g,"")
                                         }
                                     }else{
                                         if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("A.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("A.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("B.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("B.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("C.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("C.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("D.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("D.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().indexOf("E.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split("E.")[1].replace(/\s*/g,"")
                                         }

                                     }
                        })
                  da = das;
                //console.log("待录入题目："+ timu);
                console.log("当前题正确可以录入网页答案："+ da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                search(timu,da);
                }else{
                        console.log("当前题错误不可以录入\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                }
           }else if(len==3){
                opA = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0);
                opB = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(1);
                opC = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(2);
                option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n"+opC.text().replace(/\s*/g,"")+"\n";
                console.log("网页选项：\n"+option);
                timu = TiMu +"A"+opA.text().replace(/\s*/g,"").split("A")[1]+"B"+opB.text().replace(/\s*/g,"").split("B")[1]+"C"+opC.text().replace(/\s*/g,"").split("C")[1];
                console.log("搜索题目："+ timu);
                if($(".questiono-item").eq(i).children().eq(0).children().eq(2).text().split("分")[0].replace(/\s*/g,"")==$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(3).children().children().eq(1).children().eq(1).text().replace(/\s*/g,"")){
                        $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').each(function(j){
                                     if(j==0){
                                         das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split(".")[1].replace(/\s*/g,"")
                                     }else{
                                         das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().split(".")[1].replace(/\s*/g,"")
                                     }
                        })
                        da = das;
                //console.log("待录入题目："+ timu);
                console.log("当前题正确可以录入网页答案："+ da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                //search(timu,da);
                }else{
                        console.log("当前题错误不可以录入\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                }
           }else if(len==2){
                opA = $(".questiono-item").eq(i).children().eq(1).children().children().eq(0);
                opB = $(".questiono-item").eq(i).children().eq(1).children().children().eq(1);
                option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n";
                console.log("网页选项：\n"+option);
                timu = TiMu +"A."+opA.text().replace(/\s*/g,"")+"B."+opB.text().replace(/\s*/g,"");
                console.log("搜索题目："+ timu);
                //console.log("本题总分："+$(".questiono-item").eq(i).children().eq(0).children().eq(2).text().split("分")[0].replace(/(^\s*)|(\s*$)/g,""));
                //console.log("本题得分："+$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(2).children().eq(1).children().eq(1).text().replace(/(^\s*)|(\s*$)/g,""));
                //console.log("判断"+$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(2).children().eq(1).children().eq(1).text().replace(/(^\s*)|(\s*$)/g,""));
                if($(".questiono-item").eq(i).children().eq(0).children().eq(2).text().split("分")[0].replace(/\s*/g,"")==$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(2).children().eq(1).children().eq(1).text().replace(/\s*/g,"")){
                        $(".questiono-item").eq(i).children().eq(1).children().children('.correct').each(function(j){
                                     if(j==0){
                                         das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().replace(/\s*/g,"")
                                     }else{
                                         das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.correct').eq(j).text().replace(/\s*/g,"")
                                     }
                        })
                        da = das;
                //console.log("待录入题目："+ timu);
                console.log("当前题正确可以录入网页答案："+ da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                search(timu,da);
                }else{
                        console.log("当前题错误不可以录入\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                }
           }else if(len==0){
                lenc = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.common_test_option').length;
                //console.log("真实长度："+lenc);
                if(lenc==4){

                opA = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(0);
                opB = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(1);
                opC = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(2);
                opD = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(3);

                option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n"+opC.text().replace(/\s*/g,"")+"\n"+opD.text().replace(/\s*/g,"")+"\n";
                console.log("网页选项：\n"+option);
                timu = TiMu +"A"+opA.text().replace(/\s*/g,"").split("A")[1]+"B"+opB.text().replace(/\s*/g,"").split("B")[1]+"C"+opC.text().replace(/\s*/g,"").split("C")[1]+"D"+opD.text().replace(/\s*/g,"").split("D")[1];
                console.log("搜索题目："+ timu);
                //console.log("本题总分："+$(".questiono-item").eq(i).children().eq(0).children().eq(2).text().split("分")[0].replace(/(^\s*)|(\s*$)/g,""));
                //console.log("本题得分："+$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(1).children().eq(1).children().eq(1).text().replace(/(^\s*)|(\s*$)/g,""));
                if($(".questiono-item").eq(i).children().eq(0).children().eq(2).text().split("分")[0].replace(/\s*/g,"")==$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(1).children().eq(1).children().eq(1).text().replace(/\s*/g,"")){
                        $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').each(function(j){
                                     if(j==0){
                                         if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("A.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("A.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("B.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("B.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("C.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("C.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("D.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("D.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("E.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("E.")[1].replace(/\s*/g,"")
                                         }
                                     }else{
                                         if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("A.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("A.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("B.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("B.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("C.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("C.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("D.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("D.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("E.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("E.")[1].replace(/\s*/g,"")
                                         }
                                        
                                     }
                        })
                        da = das;
                //console.log("待录入题目："+ timu);
                console.log("当前题正确可以录入网页答案："+ da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                search(timu,da);
                }else{
                        console.log("当前题错误不可以录入\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                }
               }else if(lenc==5){
                opA = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(0);
                opB = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(1);
                opC = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(2);
                opD = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(3);
                opE = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(4);
                option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n"+opC.text().replace(/\s*/g,"")+"\n"+opD.text().replace(/\s*/g,"")+"\n"+opE.text().replace(/\s*/g,"")+"\n";
                console.log("网页选项：\n"+option);
                timu = TiMu +"A"+opA.text().replace(/\s*/g,"").split("A")[1]+"B"+opB.text().replace(/\s*/g,"").split("B")[1]+"C"+opC.text().replace(/\s*/g,"").split("C")[1]+"D"+opD.text().replace(/\s*/g,"").split("D")[1]+"E"+opE.text().replace(/\s*/g,"").split("E")[1];
                console.log("搜索题目："+ timu);
                //console.log("本题总分："+$(".questiono-item").eq(i).children().eq(0).children().eq(2).text().split("分")[0].replace(/(^\s*)|(\s*$)/g,""));
                //console.log("本题得分："+$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(1).children().eq(1).children().eq(1).text().replace(/(^\s*)|(\s*$)/g,""));
                if($(".questiono-item").eq(i).children().eq(0).children().eq(2).text().split("分")[0].replace(/\s*/g,"")==$(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(1).children().eq(1).children().eq(1).text().replace(/\s*/g,"")){
                        $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').each(function(j){
                                     if(j==0){
                                         if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("A.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("A.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("B.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("B.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("C.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("C.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("D.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("D.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("E.")!=-1){
                                             das = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("E.")[1].replace(/\s*/g,"")
                                         }
                                     }else{
                                         if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("A.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("A.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("B.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("B.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("C.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("C.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("D.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("D.")[1].replace(/\s*/g,"")
                                         }else if($(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().indexOf("E.")!=-1){
                                             das = das +"#"+ $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.correct').eq(j).text().split("E.")[1].replace(/\s*/g,"")
                                         }
                                     }
                        })
                        da = das;
                //console.log("待录入题目："+ timu);
                console.log("当前题正确可以录入网页答案："+ da+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                search(timu,da);
                }else{
                        console.log("当前题错误不可以录入\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                }
              }
           }
         });
         $(".common_look_header_button").children().eq(0).text("完成");
     }else if(domenu.indexOf("倒计时")!=-1){
          console.log("WARING：当前位于答题界面！");
          $(".questiono-item").each(function(i){
              TiMu = $(".questiono-item").eq(i).children().eq(0).children().eq(1).text().replace(/\s*/g,"");
              console.log("网页题目："+ TiMu);
              len = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children('.common_test_option').length;
              if(len==4){
                  opA = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0);
                  opB = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(1);
                  opC = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(2);
                  opD = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(3);
                  option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n"+opC.text().replace(/\s*/g,"")+"\n"+opD.text().replace(/\s*/g,"")+"\n";
                  console.log("网页选项：\n"+option);
                  timu = TiMu +"A"+opA.text().replace(/\s*/g,"").split("A")[1]+"B"+opB.text().replace(/\s*/g,"").split("B")[1]+"C"+opC.text().replace(/\s*/g,"").split("C")[1]+"D"+opD.text().replace(/\s*/g,"").split("D")[1];
                  doSearch(timu,opA,opB,opC,opD,opE,sub);
                  console.log("录入题目："+ timu);
              }else if(len==5){
                  opA = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0);
                  opB = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(1);
                  opC = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(2);
                  opD = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(3);
                  opE = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(4);
                  option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n"+opC.text().replace(/\s*/g,"")+"\n"+opD.text().replace(/\s*/g,"")+"\n"+opE.text().replace(/\s*/g,"")+"\n";
                  console.log("网页选项：\n"+option);
                  timu = TiMu +"A"+opA.text().replace(/\s*/g,"").split("A")[1]+"B"+opB.text().replace(/\s*/g,"").split("B")[1]+"C"+opC.text().replace(/\s*/g,"").split("C")[1]+"D"+opD.text().replace(/\s*/g,"").split("D")[1]+"E"+opE.text().replace(/\s*/g,"").split("E")[1];
                  doSearch(timu,opA,opB,opC,opD,opE,sub);
                  console.log("录入题目："+ timu);
              }else if(len==3){
                  opA = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0);
                  opB = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(1);
                  opC = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(2);
                  option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n"+opC.text().replace(/\s*/g,"")+"\n";
                  console.log("网页选项：\n"+option);
                  timu = TiMu +"A"+opA.text().split("A")[1].replace(/\s*/g,"")+"B"+opB.text().replace(/\s*/g,"").split("B")[1]+"C"+opC.text().replace(/\s*/g,"").split("C")[1];
                  doSearch(timu,opA,opB,opC,opD,opE,sub);
                  console.log("录入题目："+ timu);
              }else if(len==2){
                  opA = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0);
                  opB = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(1);
                  option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n";
                  console.log("网页选项：\n"+option);
                  timu = TiMu +"A."+opA.text().replace(/\s*/g,"")+"B."+opB.text().replace(/\s*/g,"");
                  doSearch(timu,opA,opB,opC,opD,opE,sub);
                  console.log("录入题目："+ timu);
              }else if(len==0){
                  lenc = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children('.common_test_option').length;
                  if(lenc==4){
                      opA = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(0);
                      opB = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(1);
                      opC = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(2);
                      opD = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(3);
                      option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n"+opC.text().replace(/\s*/g,"")+"\n"+opD.text().replace(/\s*/g,"")+"\n";
                      console.log("网页选项：\n"+option);
                      timu = TiMu +"A"+opA.text().replace(/\s*/g,"").split("A")[1]+"B"+opB.text().replace(/\s*/g,"").split("B")[1]+"C"+opC.text().replace(/\s*/g,"").split("C")[1]+"D"+opD.text().replace(/\s*/g,"").split("D")[1];
                      doSearch(timu,opA,opB,opC,opD,opE,sub);
                      console.log("录入题目："+ timu);
                  }else if(lenc==5){
                      opA = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(0);
                      opB = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(1);
                      opC = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(2);
                      opD = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(3);
                      opE = $(".questiono-item").eq(i).children().eq(1).children().eq(0).children().eq(0).children().eq(4);
                      option = opA.text().replace(/\s*/g,"")+"\n"+opB.text().replace(/\s*/g,"")+"\n"+opC.text().replace(/\s*/g,"")+"\n"+opD.text().replace(/\s*/g,"")+"\n"+opE.text().replace(/\s*/g,"")+"\n";
                      console.log("网页选项：\n"+option);
                      timu = TiMu +"A"+opA.text().replace(/\s*/g,"").split("A")[1]+"B"+opB.text().replace(/\s*/g,"").split("B")[1]+"C"+opC.text().replace(/\s*/g,"").split("C")[1]+"D"+opD.text().replace(/\s*/g,"").split("D")[1]+"E"+opE.text().replace(/\s*/g,"").split("E")[1];
                      doSearch(timu,opA,opB,opC,opD,opE,sub);
                      console.log("录入题目："+ timu);
                  }
              }
          });
         $(".common_look_header_button").children().eq(0).text("完成");
       }
    }

   }
})();
