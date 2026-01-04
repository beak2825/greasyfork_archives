// ==UserScript==
// @name         家客网开系统退单
// @namespace    [url=mailto:552397723@qq.com]552397723@qq.com[/url]
// @version      0.5.0
// @description [四川移动][家客网开][自动退单]
// @author       潘宇_QQ552397723_TEL18380123411
// @match        http://10.101.58.238:8130/om/plugins/main/index/login.ilf
/*关闭页面 */
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379903/%E5%AE%B6%E5%AE%A2%E7%BD%91%E5%BC%80%E7%B3%BB%E7%BB%9F%E9%80%80%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/379903/%E5%AE%B6%E5%AE%A2%E7%BD%91%E5%BC%80%E7%B3%BB%E7%BB%9F%E9%80%80%E5%8D%95.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

var Oder_Number;//当前页面工单数
var ReturnInfo;//去激活系统返回信息
var Refresh_timer;//去激活系统返回信息
var QueryTimes;//当前页面查询次数
var Oder_Sum//工单总页数
var Oder_Count//处理工单数
var Oder_Stop_Times//当前工单等待次数

(function() {
    'use strict';
    setTimeout(function () {
        var DeactiveMsg;
        var EMS_NAME;
        document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("iconfont icon-gongdandiaozheng")[0].click();//点击拆除页面
        setTimeout(function () {//随机换页
            Oder_Sum=document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByClassName("layui-laypage-last")[0].text;
            document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByClassName("layui-input")[0].value=parseInt(Oder_Sum/(Math.random()*10+1));
            document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByClassName("layui-laypage-btn")[0].click()//换页
        },2000);
        Oder_Number=0;//当前工单置位0
        Oder_Count=0;//当前处理工单计数0
        Oder_Stop_Times=0;//当前页面查询次数0
        console.log("5S后启动脚本")
        setInterval(function () {//
            if(typeof(document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByClassName("layui-layer-ico layui-layer-close layui-layer-close1")[0])=='undefined')
            {//当前无处理页面
                Oder_Count=Oder_Count+1;//处理工单数+1
                Oder_Stop_Times=0//当前页面等待次数置为0
                setTimeout(function () {
                    document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByClassName("col-md-12 app-grid-title ng-binding")[Oder_Number].click()//点击工单
                    setTimeout(function () {
                        document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("btn btn-info btn-sm")[0].click()//点击去激活
                        setTimeout(function () {
                            DeactiveMsg=document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("layui-layer-content")[0].innerText;
                            console.log(DeactiveMsg);
                            EMS_NAME=document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("form-control ng-pristine ng-valid")[4].value;
                            if(DeactiveMsg.indexOf("铁通") > -1){
                                document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("btn btn-info btn-flow")[0].click();//提交工单
                                console.log("已直接提交工单");
                                console.log("当前页面工单位置:"+(Oder_Number+1));
                            }else if(EMS_NAME==""
                            ){
                                console.log('可直接提交工单');
                                document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("btn btn-info btn-flow")[0].click();//提交工单
                                console.log("已直接提交工单");
                                console.log("当前页面工单位置:"+(Oder_Number+1));
                            }else{
                                QueryTimes=0
                                DealResult();
                            }
                        },1000);
                    },1000);
                },1000);
            }
            else{
                console.log("当前页面未处理完毕,等待继续处理")
                Oder_Stop_Times=Oder_Stop_Times+1;
                if (Oder_Stop_Times==30){
                    console.log("已处理"+Oder_Count+"单，当前页面卡单,即将刷新页面！")
                    setTimeout(function () {
                        window.location.href=window.location.href;
                    },10000);
                }
            }
        },5000);
    },3000);

    // Your code here...
})();



function DealResult() {
    QueryTimes=QueryTimes+1
    setTimeout(function () {
        document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("btn btn-info btn-sm")[1].click()//点击刷新
        setTimeout(function () {
            ReturnInfo=document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByTagName("textarea")[0].value//获取激活结果
            console.log("第"+QueryTimes+"次查询，当前去激活结果"+ReturnInfo);
            if(ReturnInfo.indexOf("SUCCESS") > -1)
            { setTimeout(function () {
                console.log("当前页面工单位置:"+(Oder_Number+1)+" 去激活成功！已提交工单！");
                document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("btn btn-info btn-flow")[0].click();//提交工单
            },1000);
            }
            else if(ReturnInfo.indexOf("接口调用成功") > -1){
                setTimeout(function () {
                    DealResult();
                },3000);
            }
            else if(ReturnInfo.indexOf("失败") > -1){
                document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByClassName("layui-layer-ico layui-layer-close layui-layer-close1")[0].click()//关闭页面
                Oder_Number=Oder_Number+1;//工单号加1
                console.log("去激活失败,开始处理下一个工单，当前页面工单位置:"+(Oder_Number+1));
                if(Oder_Number==10){//换页
                    Oder_Number=0
                    document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByClassName("layui-input")[0].value=parseInt(Oder_Sum/(Math.random()*10+1));
                    setTimeout(function () {
                        console.log("开始换页");
                        document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByClassName("layui-laypage-btn")[0].click()//换页
                    },1000);
                }
            }
            else
            {//如果其他情况
                document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByClassName("layui-layer-ico layui-layer-close layui-layer-close1")[0].click()//关闭页面
                Oder_Number=Oder_Number+1;//工单号加1
                console.log("去激活失败,开始处理下一个工单，当前页面工单位置:"+(Oder_Number+1));
                if(Oder_Number==10){//换页
                    Oder_Number=0
                    document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByClassName("layui-input")[0].value=parseInt(Oder_Sum/(Math.random()*10+1))
                    setTimeout(function () {
                        console.log("开始换页");
                        document.getElementsByTagName("iframe")[0].contentDocument.getElementsByClassName("app-frame")[0].contentDocument.getElementsByClassName("layui-laypage-btn")[0].click()//换页
                    },1000);
                }
            }
        },1000);
    },2000);//去激活等待
}