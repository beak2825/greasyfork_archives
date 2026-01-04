// ==UserScript==
// @name         施工调度系统退单
// @namespace    [url=mailto:552397723@qq.com]552397723@qq.com[/url]
// @version      0.1.5
// @description [四川移动][施工调度][自动退单]
// @author       潘宇_QQ552397723_TEL18380123411
// @match        http://223.86.3.36:7060/WebRoot/installBaseAction.action?method=toOver
/*查询页面 */
// @match        http://223.86.3.36:7060/WebRoot/installBaseAction.do?method=over&ifId=*
/*操作页面 */
// @match        http://223.86.3.36:7060/WebRoot/installBaseAction.action?method=take
/*关闭页面 */
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371011/%E6%96%BD%E5%B7%A5%E8%B0%83%E5%BA%A6%E7%B3%BB%E7%BB%9F%E9%80%80%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/371011/%E6%96%BD%E5%B7%A5%E8%B0%83%E5%BA%A6%E7%B3%BB%E7%BB%9F%E9%80%80%E5%8D%95.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var SQL_Server_Add;
var socket;
var Oder_Info;
var ReturnInfo;
var PageURL;
var Refresh_timer;
var Title;

(function() {
    SQL_Server_Add='10.40.123.41:9001';
    run();
})();
//////
function run() {
    //如果存在工单
    PageURL= window.location.href;
    if(PageURL.indexOf("http://223.86.3.36:7060/WebRoot/installBaseAction.action?method=toOver") > -1){
         Query();
    }
    else if(PageURL.indexOf("http://223.86.3.36:7060/WebRoot/installBaseAction.do?method=over&ifId=") > -1){
        PageHandle();
    }
        else if(PageURL.indexOf("http://223.86.3.36:7060/WebRoot/installBaseAction.action?method=take") > -1){
            PageClose();
        }
}
//查询页
function Query() {
    connect();
    setTimeout(function () {
        if(document.getElementsByClassName("odd")[0]) {//如果查询到结果，则等待1秒后打开查询结果
            setTimeout(function () {
                window.open( document.getElementsByClassName("odd")[0].children[1].children[3].href);
                setTimeout(function () {// 打开之后开始查询下一个
                    console.log("服开退单取数据");
                    socket.send("服开退单取数据|0");
                    setTimeout(function () {
                        document.getElementsByName("stateCode")[0].options.selectedIndex=0;//重置为查询待装
                        document.getElementsByName("newLogo")[0].value=ReturnInfo.split("|")[0];
                        document.getElementsByName("Input")[0].click();
                    },1000);
                }, 10000);
            },1000);
        }else {//如果没查询到结果   ，立即查询下一个'
            if ( document.getElementsByName("stateCode")[0].value=='\'b\'')
            {
                document.getElementsByName("stateCode")[0].options.selectedIndex=1;
                     setTimeout(function () {
                    document.getElementsByName("Input")[0].click();
                },1000);
            }else{
            setTimeout(function () {
                console.log("服开退单取数据");
                socket.send("服开退单取数据|0");
                setTimeout(function () {
                    document.getElementsByName("stateCode")[0].options.selectedIndex=0//重置为查询待装
                    document.getElementsByName("newLogo")[0].value=ReturnInfo.split("|")[0];
                    document.getElementsByName("Input")[0].click();
                },1000);
            }, 500);
        }
        }
    },1000);
}
//回单页面关闭
function PageClose() {
     setTimeout(function () {
    window.close();
                         },3000);
    // Your code here...
}
//回单填写
function PageHandle() {
    Title=document.title;
    Refresh_timer=60;
    dis_stuck();
    connect();
    setTimeout(function () {
        var returninfo = document.getElementsByTagName("tr")[3].children[3].innerText.replace(" ","");
        socket.send("服开指定查询|"+returninfo+"|");
        document.getElementById("backtopboss").click();//点击退回BOSS
        window.scrollBy(10,10000);
        setTimeout(function () {//一级原因细分
            if(ReturnInfo.split("|")[2].substring(0,3)=="400"&&document.getElementsByName("backTache")[0]){
                document.getElementsByName("backTache")[0].options.selectedIndex=1;
            }else if(document.getElementsByName("backTache")[0]&&ReturnInfo.split("|")[2].substring(0,3)=="401"){
                document.getElementsByName("backTache")[0].options.selectedIndex=2;
            }else if(document.getElementsByName("backTache")[0]&&ReturnInfo.split("|")[2].substring(0,3)=="402"){
                document.getElementsByName("backTache")[0].options.selectedIndex=3;
            }else if(document.getElementsByName("backTache")[0]&&ReturnInfo.split("|")[2].substring(0,3)=="403"){
                document.getElementsByName("backTache")[0].options.selectedIndex=4;
            }else if(document.getElementsByName("backTache")[0]&&ReturnInfo.split("|")[2].substring(0,3)=="404"){
                document.getElementsByName("backTache")[0].options.selectedIndex=5;
            }else if(document.getElementsByName("backTache")[0]&&ReturnInfo.split("|")[2].substring(0,3)=="405"){
                document.getElementsByName("backTache")[0].options.selectedIndex=6;
            }
            if(document.getElementsByName("backTache")[0]){//更新一级原因选项
                document.getElementsByName("backTache")[0].onchange();
            }
            setTimeout(function () {//二级原因细分
                if(document.getElementsByName("backReason")[0]&&(ReturnInfo.split("|")[3]=="40001"||ReturnInfo.split("|")[3]=="40101"||ReturnInfo.split("|")[3]=="40201"||ReturnInfo.split("|")[3]=="40301"||ReturnInfo.split("|")[3]=="40401"||ReturnInfo.split("|")[3]=="40502"))
                {
                    document.getElementsByName("backReason")[0].options.selectedIndex=1;
                }
                else if(document.getElementsByName("backReason")[0]&&(ReturnInfo.split("|")[3]=="40102"||ReturnInfo.split("|")[3]=="40203"||ReturnInfo.split("|")[3]=="40302"||ReturnInfo.split("|")[3]=="40404"))
                {
                    document.getElementsByName("backReason")[0].options.selectedIndex=2;
                }
                else if(document.getElementsByName("backReason")[0]&&(ReturnInfo.split("|")[3]=="40103"||ReturnInfo.split("|")[3]=="40204"||ReturnInfo.split("|")[3]=="40303"))
                {
                    document.getElementsByName("backReason")[0].options.selectedIndex=3;
                }
                else if(document.getElementsByName("backReason")[0]&&(ReturnInfo.split("|")[3]=="40104"||ReturnInfo.split("|")[3]=="40205"))
                {
                    document.getElementsByName("backReason")[0].options.selectedIndex=4;
                }
                else if(document.getElementsByName("backReason")[0]&&ReturnInfo.split("|")[3]=="40106")
                {
                    document.getElementsByName("backReason")[0].options.selectedIndex=5;
                }
                else if(document.getElementsByName("backReason")[0]&&ReturnInfo.split("|")[3]=="40107")
                {
                    document.getElementsByName("backReason")[0].options.selectedIndex=6;
                }
                setTimeout(function () {
                    document.getElementById("disRemark") .value=ReturnInfo.split("|")[1];
                    socket.send("服开退单记录|"+returninfo+"|正常退单|");
                    setTimeout(function () {
                        document.getElementsByClassName("btn")[3].click();
                    },500);
                },1000);
            },1000);
        },500);
    },1000);
}


    function dis_stuck() {
        document.title = "[" + Refresh_timer+ "s] " + Title;
        if (Refresh_timer === 0) {
            location.reload();
            return;
        }
        Refresh_timer--;
        setTimeout(function () {dis_stuck();}, 1000);
    }

//数据库连接
function connect() {
    socket = new WebSocket("ws://"+SQL_Server_Add+"/");
    try {
        socket.onopen = function (msg) {
            console.log("数据库连接成功！");
        };
        socket.onmessage = function (msg) {
            if (typeof msg.data == "string") {
                console.log("数据库查询结果"+msg.data);
                ReturnInfo=msg.data; // 返回查询结果
                //displayContent(msg.data);
            }
            else {
                console.log("非文本消息");
            }
        };
        socket.onclose = function (msg) { console.log("socket closed!"); };
    }
    catch (ex) {
        console.log(ex);
    }
}
