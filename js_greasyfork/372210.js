// ==UserScript==
// @name         资管订单回访
// @namespace    [url=mailto:552397723@qq.com]552397723@qq.com[/url]
// @version      0.1.1
// @description [四川移动][资管][订单回访自动退单]
// @author       潘宇_QQ552397723_TEL18380123411
// @match        http://10.101.58.224:5018/irms/login.ilf
// @name        订单回访  
// @grant           GM_getValue
// @grant           GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/372210/%E8%B5%84%E7%AE%A1%E8%AE%A2%E5%8D%95%E5%9B%9E%E8%AE%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/372210/%E8%B5%84%E7%AE%A1%E8%AE%A2%E5%8D%95%E5%9B%9E%E8%AE%BF.meta.js
// ==/UserScript==
// 1127修正工单堆积问题，加快处理速度。
//
(function() {
    'use strict';
     run();
    GM_setValue("工单分类", 1);//1.开通2.撤销3.调整
    // Your code here...
})();

// 在此放置代码!
function Load(wait_times) {
    console.log("页面加载中..");
    if (document.getElementsByClassName("x-panel x-panel-noborder")[3].getElementsByTagName('*')[2].contentDocument.getElementById("submitbtn")) {
                setTimeout(function () {
                    console.log("成功回单！");
                    document.getElementsByClassName("x-panel x-panel-noborder")[3].getElementsByTagName('*')[2].contentDocument.getElementById("submitbtn").click();
                    setTimeout(function () {
                    OderProcessing = "Next Oder";
                        OderNumber = OderNumber + 1;
                    Next = true;
                    console.clear();
                }, 3000);
                }, 1000);
                return;
    }
    else {
        if (wait_times < 10) {
            console.log("工单页面加载中，已等待:" + wait_times + "S");
            setTimeout(function () { Load(wait_times); }, 1000);
        }
        else {
            console.log("工单加载超过10秒,加载超时,退出。");
            while(document.getElementsByClassName("x-tab-strip-closable x-tab-strip-active")[0])
           {
            document.getElementsByClassName("x-tab-strip-closable x-tab-strip-active")[0].getElementsByClassName("x-tab-strip-close")[0].click();
                }
            Next = true;
            OderNumber = OderNumber + 1;
            return;
        }
        wait_times = wait_times + 1;
    }
    //如果激活信息存在
}
function CheckFlow(i) {
    if (document.getElementsByClassName("x-panel x-panel-noborder")[3].getElementsByTagName('*')[2].contentDocument.getElementById("ext-gen33")) {
        console.log("查看流转信息");
        //点击流转信息
        document.getElementsByClassName("x-panel x-panel-noborder")[3].getElementsByTagName('*')[2].contentDocument.getElementById("ext-gen33").click();
        document.getElementsByClassName("x-panel x-panel-noborder")[3].getElementsByTagName('*')[2].contentDocument.getElementById("ext-gen33").click();
        //点击现场开通
        var j = 1;
        CheckReturnInfo(j);

    }
    else {
        if (i < 5) {
            console.log("流转页面加载中，已等待:" + i + "秒");
            setTimeout(function () { CheckFlow(i); }, 1000);
        }
        else {
            console.log("加载超过10秒,加载超时,退出。");
            while(document.getElementsByClassName("x-tab-strip-closable x-tab-strip-active")[0])
           {
            document.getElementsByClassName("x-tab-strip-closable x-tab-strip-active")[0].getElementsByClassName("x-tab-strip-close")[0].click();
                }
            Next = true;
            OderNumber = OderNumber + 1;
            return;
        }
        i = i + 1;
    }
}


var Next = true; //是否可以开始新工单标记
var OderNumber = 0 ; //当前页面执行工单编号
var OderProcessing = "Next";//当前页面执行工单名称
var PageNumber = 1; //当前巡检所在工单页
var RepeatNumber=0; //当前卡单判断
var LaseOderNumber=0;//前一工单号
var PageTotalNumber = 1000; //当前页面总数

var socket;
var host = "ws://117.174.115.250:9000/";
var Oder_Info;
////////数据库记录字段
var FASJ_Time=0;
var DDSL_Times=0;
var SJZZ_Times=0;
var XCKT_Times=0;
//////
function run() {
    //如果存在工单
     console.log("1分钟后启动巡检");
     setTimeout(function () {
                            //点击查询详情
                            document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementById("ext-gen10").click();
                                 setTimeout(function () {
                                     //业务开通
                                     document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementById("formType").options.selectedIndex = 1;
                                      //添加小区宽带选项
                                     document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementsByName("formModel")[0].innerHTML='\"<option value=\"\">请选择</option><option value=\"com.inspur.app.scapp.sc_family.process.personband\">四川小区宽带</option><option value=\"com.inspur.app.scapp.familydelete.process.familyDelete\">小区宽带撤销</option><option value=\"com.inspur.app.scapp.familyAdjust.process.familyAdjust\">小区宽带调整</option><option value=\"com.inspur.app.scapp.imsDelete.process.imsDelete\">政企IMS拆除</option><option value=\"com.inspur.app.scapp.ims.process.ims\">政企IMS开通</option><option value=\"com.inspur.app.scapp.imsAdjust.process.imsAdjust\">政企IMS调整</option><option value=\"com.inspur.app.scapp.newfamily.process.newfamily\">不派单小区短流程</option>\"';
                                     setTimeout(function () {
                                       //选择 小区宽带
                                         document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementById("formModel").options.selectedIndex = 1;
                                         //点击查询
                                         document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementById("ext-gen38").click();
                                         setTimeout(function () {
                                             //排序
                                             document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementsByClassName("x-grid3-hd-inner x-grid3-hd-6")[0].click();
                                             setTimeout(function () {
                                             //随机页面编号
                                                 var pagenumber=parseInt(Math.random()*Number(document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementById("ext-comp-1011").textContent.replace(/[^0-9]/ig, "")));
                                                 document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementById("ext-comp-1010").value=1;
                                             //翻页，待增加
                                             //随机工单号
                                                 OderNumber=parseInt(Math.random()*9);
                                                 document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementById("ext-gen10").click();
                                             }, 20000);
                                         }, 20000);
                                     }, 1000);
                                 }, 1000);
                        }, 20000);
     setTimeout(function () {
    if (document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementsByClassName("x-grid3-col x-grid3-cell x-grid3-td-3")) {
        //获取工单总页数
        PageTotalNumber = Number(document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementById("ext-comp-1011").textContent.replace(/[^0-9]/ig, ""));
        //如果当前还存在工单，继续监控
        var Flag = setInterval(function () {

            //检查上一工单是否处理完毕
            if (OderNumber==LaseOderNumber){
                RepeatNumber=  RepeatNumber+1;
                if(RepeatNumber>10){
                    location.reload();
                }
            }
            else{
                LaseOderNumber=OderNumber;
                RepeatNumber=0;
            }

            console.log("+++++++++++++++++++++++开始处理当前页面第" + (OderNumber + 1) + "个工单+++++++++++++++++++++++");
            if (OderNumber < document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementsByClassName("x-grid3-col x-grid3-cell x-grid3-td-3").length) {
                if (document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementsByClassName("x-grid3-col x-grid3-cell x-grid3-td-3")[OderNumber].textContent !== OderProcessing) {
                    //如果可以开始下一个工单
                    if (Next) {
                        //设置抢占标识
                        Next = false;
                        //获取处理工单名
                        OderProcessing = document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementsByClassName("x-grid3-col x-grid3-cell x-grid3-td-3")[OderNumber].textContent;
                        console.log("当前处理工单名称:" + OderProcessing);
                        setTimeout(function () {
                        Oder_Info="订单受理|"+document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementsByClassName("x-grid3-cell-inner x-grid3-col-2")[OderNumber].textContent+"|";

                           //点击页面第N个工单
                            document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementsByClassName("x-grid3-col x-grid3-cell x-grid3-td-3")[OderNumber].click();
                            var i = 1;
                            Load(i);
                        }, 1000);
                    }
                }
            }
            else if (OderNumber >= document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementsByClassName("x-grid3-col x-grid3-cell x-grid3-td-3").length) {
                console.log("当前页面工单处理完毕！");
                //获取下一页页码
                PageNumber = Number(document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementById("ext-comp-1010").value) + 1;
                PageTotalNumber= Number(document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementById("ext-comp-1011").textContent.replace(/[^0-9]/ig, ""));
                //如果没有超过最大页数
                if (PageNumber <= PageTotalNumber) {
                    //点击下一页
                    console.log("正在等待加载下一页...");
                    setTimeout(function () {
                        //点击第一个工单
                        document.getElementsByClassName("x-panel x-panel-noborder")[2].getElementsByTagName('*')[2].contentDocument.getElementById("ext-gen64").click();
                        Next = true;
                        OderNumber = 0;
                    }, 1000);
                }
                else {
                    console.log("所有工单巡检完毕！");
                    clearInterval(Flag);
                    Next = true;
                    OderNumber = 0;
                    Next = true; //是否可以开始新工单标记;
                    OderNumber = 0;  //当前页面执行工单编号;
                    OderProcessing = "";//当前页面执行工单名称;
                    // PageNumber = 1 //当前巡检所在工单页
                    //   PageTotalNumber = 1000 //当前页面总数
                }
            }

        }, 13000);
    }
    else {
        console.log("当前无工单,监控程序已退出1分钟");
        setTimeout(function () {run(); }, 60000);
         }
    }, 30000+Math.random()*6000);
}

   function connect() {
            socket = new WebSocket("ws://117.174.115.250:9000/");
            try {
                socket.onopen = function (msg) {
                    console.log("数据库连接成功！");
                };
                socket.onmessage = function (msg) {
                    if (typeof msg.data == "string") {
                        displayContent(msg.data);
                    }
                    else {
                        console.log("非文本消息");
                    }
                };
                socket.onclose = function (msg) { log("socket closed!"); };
            }
            catch (ex) {
                log(ex);
            }
        }




