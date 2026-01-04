// ==UserScript==
// @name         自助提交2.0
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  临沂市政务服务平台
// @author       You
// @match        http://10.176.0.156:8380/enterprise/business/taskcentercontroller/index
// @match        http://10.176.0.156:8380/enterprise/business/todotaskcontroller/show?id*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469832/%E8%87%AA%E5%8A%A9%E6%8F%90%E4%BA%A420.user.js
// @updateURL https://update.greasyfork.org/scripts/469832/%E8%87%AA%E5%8A%A9%E6%8F%90%E4%BA%A420.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //window.onload = function(){
    var isJzStatus = false;
    var isTjStatus = false;
    var isSelectStatus = false;
    var isOkStatus = false;
    var isOver = true;
    var num = 1;
    if(localStorage==0){//初始化
        localStorage.setItem("num",1);
        localStorage.setItem("sStatus",false);
    }else if(localStorage.getItem("num")>1){//记录下次执行位置
        num= localStorage.getItem("num");
    }
    //*************************
    text1();
    if(!isOver){
        return;
    }
    function text1() {

        var printTime = "";
        printTime = "1635724800";//  11/1
        if (isOK(printTime, true)) {
            console.log("buchaoguo");
            //isOver = false;
        } else {
            console.log("超过");
            isOver = false;
        }

    }

    function isOK(timeStamp, isOK) {
        //通过比较传入的时间戳与当前时间戳，验证是否有效
        //var timeStamp = timeStamp;
        var nowTime = Math.round((new Date()).getTime() / 1000);
        if (isOK) {
            console.log("nowTime: ", nowTime, "\n传入时间-当前时间= ", timeStamp, " - ", nowTime, " = ", (timeStamp - nowTime));
        } else {
            console.log("未开启isOK日志");
        }
        // alert(islog);
        //与传入的时间戳对比大小
        if ((timeStamp - nowTime) >= 0) {
            //有效 未过期
            return true;
        } else {
            return false;
        }
    }



    //*************

    if(window.location.pathname=="/enterprise/business/todotaskcontroller/show"){
        ImportCss();

        startShow();
    }else if(window.location.pathname=="/enterprise/business/taskcentercontroller/index"){
        ImportCss();
        ImportDiv();
        document.getElementById("numDiv").textContent =(localStorage.getItem("num"));
        console.log("sStatus:",localStorage.getItem("sStatus"));
        if(localStorage.getItem("sStatus")=='true'){//循环  sStatus=true,  stop显示，start隐藏
            start();
            console.log("0000sStatus:",localStorage.getItem("sStatus"));
            document.getElementById("startDiv").style.display = "none";
            document.getElementById("stopDiv").style.display = "block";
        }else if(localStorage.getItem("sStatus")=='false'){//sStatus=false,  stop隐藏，start显示
            console.log("1111sStatus:",localStorage.getItem("sStatus"));
            document.getElementById("startDiv").style.display = "block";
            document.getElementById("stopDiv").style.display = "none";
        }

    }




    function ImportCss(){
        var myCss = document.createElement("style");
        myCss.type = "text/css";
        myCss.innerHTML = ".myDiv1{opacity:0.9 ;display: none;position: fixed;right: 5px;bottom: 50px;z-index: 2247483648;padding: 23px 5px;width: 50px;height: 20px;line-height: 20px;text-align: center;border: 1px solid;border-color: #888;border-radius: 50%;background: #efefef;cursor: pointer;font: 12px/1.5}.myDiv2{display: none;position: fixed;right: 5px;bottom: 120px;z-index: 2247483648;padding: 23px 5px;width: 50px;height: 20px;line-height: 20px;text-align: center;border: 1px solid;border-color: #888;border-radius: 50%;background: #efefef;cursor: pointer;font: 12px/1.5}";
        $("head")[0].appendChild(myCss);
        console.log("插入css");
    }

    function ImportDiv(){
        var numDiv = document.createElement("div");
        numDiv.id = "numDiv";
        numDiv.className = "myDiv1";
        numDiv.style.display = "block";
        numDiv.textContent = "";

        var startDiv = document.createElement("div");
        startDiv.id = "startDiv";
        startDiv.className = "myDiv2";
        //startDiv.style.display = "block";
        //             startDiv.textContent = "▶";
        startDiv.textContent = "开始";

        //             startDiv.style.display = "block";
        var stopDiv = document.createElement("div");
        stopDiv.id = "stopDiv";
        stopDiv.className = "myDiv2";
        //             stopDiv.textContent = "■";
        stopDiv.textContent = "停止";
        $("body")[0].appendChild(numDiv);
        $("body")[0].appendChild(startDiv);
        $("body")[0].appendChild(stopDiv);

        ChangeTransparency("numDiv");
        ChangeTransparency("startDiv");
        ChangeTransparency("stopDiv");

        //绑定点击事件
        numDiv.onclick = function(){
            var printNum = prompt("点击数据位置:"+parseInt(num)+",在此设置新的点击位置1-10:");
            if(printNum>0&&printNum<=10){
                printNum = parseInt(printNum);
                localStorage.setItem("num",printNum);
                num = printNum;
                document.getElementById("numDiv").textContent =(parseInt(printNum));
                alert("设置成功");
            }else if(printNum!=null){
                alert("请输入1-10范围内的数字");
            }

        }
        startDiv.onclick = function(){

            status = true;
            localStorage.setItem("sStatus",status);
            document.getElementById("startDiv").style.display = "none";
            document.getElementById("stopDiv").style.display = "block";


            start();
        }

        stopDiv.onclick = function(){
            document.getElementById("startDiv").style.display = "block";
            document.getElementById("stopDiv").style.display = "none";
            console.log("stop-status",localStorage.getItem("sStatus"));
            localStorage.setItem("sStatus",false);
            return;

        }

    }
    function start(){
        console.log("start-status",localStorage.getItem("sStatus"));
        if(localStorage.getItem("sStatus")=='true'){
            isJz();
        }
    }
    function startShow(){
        setTimeout(function(){
            isTj();
            setTimeout(function(){
                isSelect();
                setTimeout(function(){
                    isOk();
                    setTimeout(function(){
                        isClose();
                    },1000);
                },1000);
            },1000);
        },800);





    }
    function isClose(){
        //var closes = document.getElementsByClassName('ui-dialog-close')[0];
        var closes = document.getElementsByTagName('button')[9];
        if(closes&&isOkStatus){
            console.log("关闭弹窗");
            document.getElementsByTagName('button')[9].click();
        }else{
            concole.log("<");
            document.getElementsByTagName('button')[9];
            setTimeout(function(){
                isClose();
                console.log(new Date());
            },1000);
        }
    }
    function isOk(){
        var oks = document.getElementsByClassName('ui-dialog-autofocus')[0];
        if(oks&&isSelectStatus){
            console.log("提交意见");
            isOkStatus = true;
            document.getElementsByClassName('ui-dialog-autofocus')[0].click();//点击提交
        }else{
            concole.log(">");
            document.getElementsByClassName('ui-dialog-autofocus')[0];
            setTimeout(function(){
                isOk();
                console.log(new Date());
            },1000);
        }

    }
    function isSelect(){
        var selected = document.getElementById("jg");
        if(selected&&isTjStatus){//前提show表单加载完成，提交完成
            console.log("选择意见");
            document.getElementById("SEND_CONTENT").value="同意";
            document.getElementById("jg").options[1].selected = true;
            isSelectStatus = true;
        }else{
            console.log(">>");
            document.getElementById("jg");
            setTimeout(function(){
                isSelect();
                console.log(new Date());
            },1000);
        }
    }
    function isTj(){
        var tj = document.getElementsByClassName('btn btn-link text-link')[4];
        if(tj&&isTjStatus==false){
            console.log("show加载完成");
            isTjStatus = true;
            document.getElementsByClassName('btn btn-link text-link')[4].click();//点击目录
            console.log("点击提交");

        }else{
            console.log(">>>>");
            document.getElementsByClassName('btn btn-link text-link')[4];
            setTimeout(function(){
                isTj();
                console.log(new Date());
            },1000);
        }
    }
    function isJz() {//*********************************111111111111**********************

        var jiazai = document.getElementById(localStorage.getItem("num"));
        if (jiazai&&isJzStatus==false) {
            console.log("加载完成");
            //localStorage.setItem("sStatus",false);
            isJzStatus = true;
            document.getElementById(localStorage.getItem("num")).getElementsByTagName('a')[0].click();//点击目录
            console.log("点击目录");

        } else {
            console.log(">>>>>>>>>");
            jiazai = document.getElementById(localStorage.getItem("num"));
            setTimeout(function(){
                //isJz();
                start();
                console.log(new Date());
            },1000);
        }
        return isJzStatus;
    }
    function ChangeTransparency(idname){//改变透明度
        var obig  = document.getElementById(idname);
        bianse(100);
        obig.onmouseover = function()
        {
            bianse(50);
        }
        obig.onmouseout = function()
        {
            bianse(100);
        }
        function bianse(target)
        {
            var alpha=30;
            var speed='';
            clearInterval(timer);
            var timer = null;
            timer=setInterval(function()
                              {
                if(target<alpha)
                {
                    speed=-10;
                }
                else{
                    speed=10;
                }
                if(alpha==target)
                {
                    clearInterval(timer)
                }
                else{
                    alpha+=speed;
                    obig.style.filter='alpha(opacity='+speed+')';
                    obig.style.opacity=alpha/100;
                }
            } , 80);
        }
    }
    //}
})();