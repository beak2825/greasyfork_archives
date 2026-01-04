// ==UserScript==
// @name         斗鱼原神直播打卡里程碑任务,抢原石
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description   斗鱼原神，打卡里程碑任务,到点秒抢原石
// @author       yutou
// @match        *://*.douyu.com/topic/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/452018/%E6%96%97%E9%B1%BC%E5%8E%9F%E7%A5%9E%E7%9B%B4%E6%92%AD%E6%89%93%E5%8D%A1%E9%87%8C%E7%A8%8B%E7%A2%91%E4%BB%BB%E5%8A%A1%2C%E6%8A%A2%E5%8E%9F%E7%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/452018/%E6%96%97%E9%B1%BC%E5%8E%9F%E7%A5%9E%E7%9B%B4%E6%92%AD%E6%89%93%E5%8D%A1%E9%87%8C%E7%A8%8B%E7%A2%91%E4%BB%BB%E5%8A%A1%2C%E6%8A%A2%E5%8E%9F%E7%9F%B3.meta.js
// ==/UserScript==

var aday ="3天" //界面参数改这些
var bday ="5天"
var cday ="10天"
var dday ="18天"
var eday ="26天"
var fday ="35天"

var a= "119095" //提交参数改这些
var b="119096"
var c="119097"
var d="119098"
var e="119099"
var f="119103"

var url ="https://www.douyu.com/japi/carnival/nc/roomTask/getPrize"  //提交的网址

/* 以下参数别动*/
let elscript= document.createElement('script');
elscript.setAttribute('type', 'text/javascript');
elscript.src = "https://unpkg.com/layui@2.6.8/dist/layui.js";
document.documentElement.appendChild(elscript);

GM_setValue('day',aday)//默认3天
var day =GM_getValue("day")
GM_setValue('sudu',"1000")//默认1秒
var sudu =GM_getValue("sudu")

GM_addStyle(`
  #textArea{
    width: 399px;
    height: 438px;
    border-radius: 10px;
    font-size: 25px;
    font-weight: 700;
    color: black;
    background-color:transparent;
    margin-bottom: -50px;
  }
  .input{    position: fixed;
    font-weight: 700;
    padding-left: 10px;
    margin-left: 90%;
    width: 150px;
    border-style: double;
    background: #fff no-repeat center;
    height: 100px;
    z-index: 100000;
    overflow-x: hidden;
    transition: 0.5s;
    padding-top: 10px; }
    .input2{
    font-weight: 700;
    padding-left: 10px;
    background: #fff no-repeat center;
    height: 160px;
    padding-top: 10px;
  }
.inp {
    border-style: double;
    font-weight: 700;
    position: fixed;
    bottom: 10vh;
    z-index: 9999999999;
    background: #fff no-repeat center;
    height: 100px;
    right: 5vh;
    width: 200px;
}
  `
           )


var backgrounda = document.createElement("div")
backgrounda.id="backgrounda"
backgrounda.innerHTML = "<link rel='stylesheet' href='https://unpkg.com/layui@2.6.8/dist/css/layui.css'><boby style='border-style:double;background:#ffffff; width:300px;height:500px;position: fixed;z-index: 100000;overflow-x: hidden;transition: 0.5s;box-shadow:0px 1px 10px rgba(0,0,0,0.3);bottom:1vh;'>"+
"<table  class='layui-table'><thead>"+
"<th style='padding-left: 30%;font-weight:600'>斗鱼原神直播任务脚本</th></thead></table>"+
"<div class='input2' > <div  width:100% '> "+
" <button  id ='one' class='layui-btn layui-btn-lg layui-btn-normal'>启动</button>"+
 "<button id='two' class='layui-btn layui-btn-lg layui-btn-normal'>停止</button>"+
 "<button id='three' class='layui-btn layui-btn-lg layui-btn-normal'>速率</button>   </div>"+
   " <div style='padding-top:15px '>"+
    "<button id='daya' class='layui-btn layui-btn-danger'>"+aday+"</button>"+
    "<button id='dayb' class='layui-btn  layui-btn-danger'>"+bday+"</button>"+
   " <button id='dayc' class='layui-btn  layui-btn-danger'>"+cday+"</button> </div>  "+
        "<div style='padding-top:15px '>"+
    "<button id='dayd'class='layui-btn layui-btn-danger'>"+dday+"</button>"+
    "<button id='daye' class='layui-btn  layui-btn-danger'>"+eday+"</button>"+
    "<button id='dayf'class='layui-btn layui-btn-danger'>"+fday+"</button> "+
   " </div> </div> "+
" <div id='diy'></div></boby>"+
backgrounda.setAttribute("style","position:fixed;bottom:1vh;z-index: 9999999999;  float:right;  ");

document.body.appendChild(backgrounda)

var logs = document.createElement("div")
logs.id="logs"
logs.innerHTML = "​<div class='inp' > <div id='dayid'>当前天数:"+day+"</div><div id='suduid' >当前速度:"+sudu+"毫秒</div><div id='jieguo' ></div><div id='diy2'></div> "
logs.setAttribute("style","position:fixed;bottom:1vh;z-index: 9999999999;  float:right;  ");

document.body.appendChild(logs)

fetch("https://hn216.api.yesapi.cn/?s=App.Table.GetOneDataByOneField&return_data=1&model_name=yesapi_framework_log&field_name=id&field_value=2&select=dyhtml,get_data&app_key=75B19A5C1828145CE6847B0E4466571D").then((data) => {
            return data.json();
        }).then((data) => {
            var html =data.data.dyhtml
            var htmla=data.data.get_data
         document.getElementById("diy").innerHTML=html;
    //document.getElementById("diy2").innerHTML=htmla;
        })
document.getElementById('three').addEventListener('click',function(){
    var sudu =	prompt('请输入抢原石的速度/单位:毫秒/1000=1秒', "");
    GM_setValue('sudu',sudu)
    layer.msg("已设置"+GM_getValue("sudu")+"毫秒");
    document. getElementById("suduid").innerHTML='<div >当前速度:'+sudu+'毫秒</div>'
})

document.getElementById('daya').addEventListener('click',function(){
    GM_setValue('day',"3天")
    GM_setValue('taskId',a)
    console.log(GM_getValue("day"))
    document. getElementById("dayid").innerHTML='<div >当前天数:'+GM_getValue("day")+'</div>'
    layer.msg(aday);
})
document.getElementById('dayb').addEventListener('click',function(){
    GM_setValue('taskId',b)
    GM_setValue('day',"5天")
    console.log(GM_getValue("day"))
    layer.msg(bday);
    document. getElementById("dayid").innerHTML='<div >当前天数:'+GM_getValue("day")+'</div>'
})
document.getElementById('dayc').addEventListener('click',function(){
    GM_setValue('taskId',c)
    GM_setValue('day',"10天")
    console.log(GM_getValue("day"))
    layer.msg(cday);
    document. getElementById("dayid").innerHTML='<div >当前天数:'+GM_getValue("day")+'</div>'
})
document.getElementById('dayd').addEventListener('click',function(){
    GM_setValue('taskId',d)
    GM_setValue('day',"18天")
    console.log(GM_getValue("day"))
    layer.msg(dday);
    document. getElementById("dayid").innerHTML='<div >当前天数:'+GM_getValue("day")+'</div>'
})

document.getElementById('daye').addEventListener('click',function(){
    GM_setValue('taskId',e)
    GM_setValue('day',"26天")
    console.log(GM_getValue("day"))
    layer.msg(eday);
})

document.getElementById('dayf').addEventListener('click',function(){
    GM_setValue('taskId',f)
    console.log(GM_getValue("day"))
    GM_setValue('day',"35天")
    document. getElementById("dayid").innerHTML='<div >当前天数:'+GM_getValue("day")+'</div>'
    layer.msg(fday);
})

var timer = null;
document.getElementById('one').addEventListener('click', function() {
    var sudu =GM_getValue("sudu")
    var  taskId =GM_getValue("taskId")
    timer = setInterval(function() {
        GM_xmlhttpRequest({
            url:url,
            method :"POST",
            data:"taskId="+taskId,
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            onload:function(xhr){
                console.log(xhr.responseText);
                var data = JSON.parse(xhr.responseText)
                var aa =data.msg
                /* layer.msg("执行中");*/
                console.log(aa)
                document. getElementById("jieguo").innerHTML='<text>已启动</text><div >结果：'+aa+'</div>'
            }
        });
    }, sudu)
})
document.getElementById('two').addEventListener('click',function(){
    clearInterval(timer);
    layer.msg("已停止");
    document. getElementById("jieguo").innerHTML='<text>已停止</text>'
})


