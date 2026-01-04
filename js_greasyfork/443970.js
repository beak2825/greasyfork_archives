// ==UserScript==
// @name         健康上报自动确认
// @namespace    http://zzw2000.tpddns.cn/
// @version      1.0
// @description  这是关于盐工健康上报系统自动确认的
// @author       Foolzzw
// @match        https://health.xiamin.tech/user/profile/
// @match        https://health.xiamin.tech/system/registry/
// @icon         https://health.xiamin.tech/user/profile/favicon.ico
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443970/%E5%81%A5%E5%BA%B7%E4%B8%8A%E6%8A%A5%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/443970/%E5%81%A5%E5%BA%B7%E4%B8%8A%E6%8A%A5%E8%87%AA%E5%8A%A8%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //设置NOW时间
    var p = document.createElement("a");
    p.id="demo";
    var k = document.createElement("p");
    k.id="kemo";


    function myTimer(){
        var d=new Date();
        var t=d.toLocaleTimeString();
        document.getElementById("demo").innerHTML="NOW时间:"+t;
    }
    function closePage(){
        if(navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1){
            window.location.href = "about:blank";
            window.close();
        }else{
            window.opener = null;
            window.open("", "_self");
            window.close();
        }
    }
    var st;
    var z;
    function myLeft(){
        z = z-1;
        document.getElementById("kemo").innerHTML="今日已完成上报，"+z+"\t秒后自动关闭本页面";
        if(z>0){
            st = setTimeout(() =>myLeft(),1000);
        }else{
            //self.opener=null;
            //self.close();
            //open(location, '_self').close();
            closePage();
    }
    }
    //设置按钮
    var buton = document.createElement("button"); //创建一个按钮
    buton.id = "buton_upload";
    buton.onclick = myStartFunction;
    //buton.style.display = "none";
    buton.textContent = "启用零时自动上报"; //按钮内容
    buton.style.width = "158px"; //按钮宽度
    buton.style.height = "38px"; //按钮高度
    buton.style.align = "center"; //文本居中
    buton.style.color = "white"; //按钮文字颜色
    buton.style.background = "#59d05d"; //按钮底色
    buton.style.border = "1px solid #c8e6c6"; //边框属性
    buton.style.borderRadius = "4px"; //按钮四个角弧度
    buton.style.marginLeft="5px"; //左边距

    var btn_stop = document.createElement("button");
    btn_stop.id = "buton_stop";
    btn_stop.textContent = "停止自动关闭"; //按钮内容
    btn_stop.onclick = myStoption;
    btn_stop.style.width = "120px"; //按钮宽度
    btn_stop.style.height = "38px"; //按钮高度
    btn_stop.style.align = "center"; //文本居中
    btn_stop.style.color = "white"; //按钮文字颜色
    btn_stop.style.background = "#cc0033"; //按钮底色
    btn_stop.style.border = "1px solid #cc0033"; //边框属性
    btn_stop.style.borderRadius = "4px"; //按钮四个角弧度
    btn_stop.style.marginLeft="5px"; //左边距

    let midTime = "10:00:00"
    let startTime = "00:00:05"
    var tm;
    var TIME=1*1000; //时间间隔1h
    var buttons = document.getElementsByTagName("button");
    var button = document.getElementById("regist_button");
    if(buttons.length == 7){
        var button2 = buttons[6];
        button2.click();
    }//点击OK
    else if(buttons.length == 4){
        var button1 = buttons[3];
        button1.click();
    }//点击确认是
    else if(button.disabled == false){
        button.click();
    }//点击进行上报
    var myVar=setInterval(function(){myTimer()},1000);
    function myclose(){
        window.close();
    }
    function myStartFunction(){
        conEdit1();
        tm = setInterval(starts,TIME);
    function starts(){
        var hours=new Date().getHours();//小时
        var minutes=new Date().getMinutes();//分
        var seconds=new Date().getSeconds();//秒
        if (hours < 10) hours = "0" + hours;
        if (minutes < 10) minutes = "0" + minutes;
        if (seconds < 10) seconds = "0" + seconds;

        console.log("当前：%d:%d:%d",hours,minutes,seconds);
        let nowTime = hours+':'+minutes+':'+seconds
        if(nowTime <= midTime) {
            console.log(2)
            location.replace("https://health.xiamin.tech/system/registry/");
            //setTimeout(()=>location.replace("https://health.xiamin.tech/system/registry/"),1000)
            //conEdit();

            }//刷新页面

    }
    }

    function myStopFunction(){
        clearInterval(tm);
    }
    function myStoption(){
        clearTimeout(st);
        var se = document.getElementById("buton_stop").innerHTML="5s后自动关闭";
        btn_stop.style.background = "#59d05d"; //按钮改为绿色
        btn_stop.style.border = "1px solid #c8e6c6"; //边框属性
        btn_stop.onclick = conEdit;
    }
    function myStoption1(){
        myStopFunction();
        var se1 = document.getElementById("buton_upload").innerHTML="启用零时自动上报";
        buton.style.background = "#59d05d"; //按钮改为绿色
        buton.style.border = "1px solid #c8e6c6"; //边框属性
        buton.onclick = myStartFunction;
    }
    function conEdit(){
        z = 6;
        myLeft();
        var se = document.getElementById("buton_stop").innerHTML="停止自动关闭"
        btn_stop.style.background = "#cc0033"; //按钮改为红底色
        btn_stop.style.border = "1px solid #cc0033"; //边框属性
        btn_stop.onclick = myStoption;
    }
    function conEdit1(){
        var se1 = document.getElementById("buton_upload").innerHTML="已启用零时自动上报"
        buton.style.background = "#c8e6c6"; //按钮底色
        buton.style.border = "1px solid #c8e6c6"; //边框属性
        buton.onclick = myStoption1;
    }
    //设备关机
    function shut_down(){
        myStoption();
        alert("别想了，还没这功能！");

    }
    // 试试差不多了


    //将按钮绑定到页面
    var page=document.getElementsByClassName("card-action")[0];
    if(page!=null){
        page.appendChild(p);
        page.appendChild(buton);
        page.appendChild(btn_stop);
        page.appendChild(k);
    }
    z = 6;
    var M = myLeft();
    var hours=new Date().getHours();//小时
    var minutes=new Date().getMinutes();//分
    var seconds=new Date().getSeconds();//秒
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    console.log("当前：%d:%d:%d",hours,minutes,seconds);
    let nowTime = hours+':'+minutes+':'+seconds
    if(nowTime > midTime) {
        myStoption();
    }
})();