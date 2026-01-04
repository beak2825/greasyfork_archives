// ==UserScript==
// @name         fuck nyist
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  请勿传播
// @author       xxx
// @match        http://61.163.231.198:8088/student/*
// @grant        none
// @require http://code.jquery.com/jquery-3.5.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/406164/fuck%20nyist.user.js
// @updateURL https://update.greasyfork.org/scripts/406164/fuck%20nyist.meta.js
// ==/UserScript==

window.nop=function(){return true;}
$(window).blur(function () {window.isleave=false;});
document.onselectstart=nop;
document.oncopy=nop;
document.onpaste=nop;
document.oncontextmenu=nop;
document.onmousedown=function(){
    $("iframe").each(function(n,v){
        v.contentWindow.document.onpaste=nop;
        v.contentWindow.document.oncontextmenu=nop;
    })
}
window.examheadhtml=`<head id="Head1"><title>
	测试考试
</title><link href="http://61.163.231.198:8088/LayUi/css/layui.css" rel="stylesheet">
    <style type="text/css">
        #selectcard button {
            margin-bottom: 3px;
        }

        .logo {
            color: #fff;
            float: left;
            line-height: 60px;
            font-size: 20px;
            padding: 0 25px;
            text-align: center;
            margin-right: 15px;
        }
    </style>
<link id="layuicss-layer" rel="stylesheet" href="http://61.163.231.198:8088/LayUi/css/modules/layer/default/layer.css?v=3.1.1" media="all"><link id="layuicss-laydate" rel="stylesheet" href="http://61.163.231.198:8088/LayUi/css/modules/laydate/default/laydate.css?v=5.0.9" media="all"></head>`;
window.examhtml = `
<form class="layui-form">
        <div class="layui-layout layui-layout-admin">
            <div class="layui-header header">
                <a href="#" id="examname" class="logo">What the fuck</a>
                <!-- 顶部左侧菜单 -->
                <ul class="layui-nav layui-layout-right">

                    <li class="layui-nav-item">
                        <a href="javascript:;">
                            <img src="../images/user.png" class="layui-circle" width="35" height="35" />
                            <cite id="username">^.^</cite>
                        </a>

                    </li>
                </ul>
            </div>
            <div class="layui-collapse" id="papercontent" style="margin-top: 3px;">
            </div>
            <div id="footer" class="layui-footer" style="left: 0px">
                开始时间:<span id="ksrq"></span>  总时长:<span id="sj"></span>  剩余时间: <span id="kssj">-.-</span>
                <button type="button" style="float: right; margin-top: 10px; margin-left: 10px;" class="layui-btn layui-btn-xs layui-btn-norma" id="btnshow">展开</button>
                <button type="button" style="float: right; margin-top: 10px; margin-left: 10px" id="btnsubmit" class="layui-btn layui-btn-xs layui-btn-norma">交卷</button>
            </div>

        </div>
        <div class="layui-card" style="position: fixed; width: 200px; top: 150px; right: 20px">
            <div class="layui-card-header">题目选择卡</div>
            <div class="layui-card-body" id="selectcard">
            </div>
        </div>
    </form>`;
var showit=`<li class="layui-nav-item showNotice">
    <a href="javascript:;" onclick="getdata_();"><i class="iconfont icon-gonggao"></i><cite>先看看题？</cite></a>
 </li>`
var showElem = $("#showNotice")[0];
if(showElem){
$(showElem).after($(showit));
}
function start(ksid){
    $.ajax({
        url: "/student/exam.aspx",
        type: "POST",
        data: "ksid=" + ksid,
        success:function(data){
            let document = window.document;
            document.head.innerHTML=examheadhtml;
            document.body.innerHTML=examhtml;
            //eval(/var submithandle;.*var \$;/.exec(data)[0]);
            let scriptElem = document.createElement('script');
            //console.log( /var submithandle;.*var \$;/.exec(data));
            scriptElem.innerHTML = /var submithandle;.*var \$;/s.exec(data)[0];
            document.body.appendChild(scriptElem);
            let scriptElem_ = document.createElement('script');
            scriptElem_.src="http://218.62.32.195:88/cas/js/jquery-1.7.3.min.js";
            document.body.appendChild(scriptElem_);
        }
    })
}
var tempdata;
window.getdata_=function()
            {
    var student = document.getElementById("frame1").contentWindow.student;
                 $.ajax({
                    url: "doaction.ashx",
                    dataType: "json",
                    cache: false,
                    type: "POST",
                    data: "classname="+student.CLASS+"&action=getexambystuclass&stuid="+student.STUID,
                    success: function (data) {
                    if(data.msg=="1")
                        {
                            tempdata = data.data;

                            initdata_();
                        }
                    }
                });
            }
window.initdata_=function(){
    var xn="";
    var xq="";
    var html="";
    for(let i=0;i<tempdata.length;i++)
                {
                     var state="";
                     if(tempdata[i].JSBJ=="0")
                     {
                        state="<b style='float:right'><a href='javascript:void(0)' style='color:blue;z-index:100' onclick='start_exam(\""+tempdata[i].KSID+"\")'>未开始，想先看看</a></b>";
                     }
                     else if(tempdata[i].JSBJ=="1")
                           state="<i style='float:right'>已结束</i>";
                     else if(tempdata[i].JSBJ=="2")
                           state="<b style='float:right'><a href='javascript:void(0)' style='color:blue;z-index:100' onclick='exam(\""+tempdata[i].KSID+"\")'>正在考试,进入考场</a></b>";
                    html+=' <div class="layui-col-md3"><div class="layui-card"><div class="layui-card-header">'+tempdata[i].Kname+state+'</div>';
                    var content="任课教师:"+tempdata[i].Teacher+"<br>";
                    content+="考试方式:"+tempdata[i].ksfs+"<br>";
                    content+="考试时长:"+ tempdata[i].sj+"分钟<br>";
                    html+=' <div class="layui-card-body">'+content+'</div></div></div>';
                }
    $("#frame1").contents().find("#content").html(html);
}
window.start_exam=start;
