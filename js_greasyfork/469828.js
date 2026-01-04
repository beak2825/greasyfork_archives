// ==UserScript==
// @name         一件事一次办审批系统（我们与之有着不共戴天之仇）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  我们与之有着不共戴天之仇!
// @author       大魔王
// @match        https://www.sojson.com/yasuo.html
// @icon         https://www.google.com/s2/favicons?domain=sojson.com
// @match        http://10.176.0.156:8380/enterprise/business/commonreceive/receive?id=9B826C68E192451CADE8FBB89AFA73F7&from=1
// @match        http://10.176.0.156:8380/enterprise/business/commonreceive/index
// @match        http://10.176.0.156:8380/enterprise/business/commonreceive/receive?id=5D8DF3C5475E44AD912BC07199F7629B&from=1

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469828/%E4%B8%80%E4%BB%B6%E4%BA%8B%E4%B8%80%E6%AC%A1%E5%8A%9E%E5%AE%A1%E6%89%B9%E7%B3%BB%E7%BB%9F%EF%BC%88%E6%88%91%E4%BB%AC%E4%B8%8E%E4%B9%8B%E6%9C%89%E7%9D%80%E4%B8%8D%E5%85%B1%E6%88%B4%E5%A4%A9%E4%B9%8B%E4%BB%87%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/469828/%E4%B8%80%E4%BB%B6%E4%BA%8B%E4%B8%80%E6%AC%A1%E5%8A%9E%E5%AE%A1%E6%89%B9%E7%B3%BB%E7%BB%9F%EF%BC%88%E6%88%91%E4%BB%AC%E4%B8%8E%E4%B9%8B%E6%9C%89%E7%9D%80%E4%B8%8D%E5%85%B1%E6%88%B4%E5%A4%A9%E4%B9%8B%E4%BB%87%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        //*****************初始化*****************************
        /*
        http://10.176.0.156:8380/
        http://10.176.0.156:8380/enterprise/business/commonreceive/receive?id=9B826C68E192451CADE8FBB89AFA73F7&from=1
        https://www.sojson.com/yasuo.html
        hdqgjjylbl      !QAZ2wsx
        ="'"&A1&"'"&","
        */
        var name = [];
        var idcard = [];
        var phone = [];
        var num = 0;//计数运行的次数，定位
        var status = true;//运行停止标志

        var pathname = "/enterprise/business/commonreceive/receive";
        //公积金缴存
        var url1="http://10.176.0.156:8380/enterprise/business/commonreceive/receive?id=9B826C68E192451CADE8FBB89AFA73F7&from=1";
        var search1 = "?id=9B826C68E192451CADE8FBB89AFA73F7&from=1";
        //我要办理就业登记
        var url2 = "http://10.176.0.156:8380/enterprise/business/commonreceive/receive?id=5D8DF3C5475E44AD912BC07199F7629B&from=1";
        var search2 = "?id=5D8DF3C5475E44AD912BC07199F7629B&from=1";




        var tj_button = document.getElementsByClassName('btn btn-link')[4];//提交按钮
        if(localStorage==0){//初始化
            localStorage.setItem("num",0);
            localStorage.setItem("sStatus",false);
        }else if(localStorage.getItem("num")>0){//记录下次执行位置
            num= localStorage.getItem("num");
        }



        //*************************************************


        //********************函数*****************************
        function addDate(){//填写数据
            console.log(num);
            document.getElementById("name").value = name[num];
            document.getElementById("idcard_no").value = idcard[num];
            document.getElementById("link_phone").value = phone[num];
            //   num = 1 + parseInt(num);

            //    localStorage.setItem("num",num);
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
            // startDiv.style.display = "block";
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
                var printNum = prompt("当前录入位置:"+(parseInt(num)+1)+" ["+name[num]+"],在此设置新的录入位置1-"+name.length+"：");
                if(printNum>0&&printNum<=name.length){
                    printNum = parseInt(printNum)-1;
                    localStorage.setItem("num",printNum);
                    num = printNum;
                    document.getElementById("numDiv").textContent =(parseInt(printNum)+1)+"["+name[printNum]+"]";
                    alert("设置成功");
                }else if(printNum!=null){
                    alert("请输入1-"+name.length+"范围内的数字");
                }

            }
            startDiv.onclick = function(){

                status = true;
                localStorage.setItem("sStatus",status);
                document.getElementById("startDiv").style.display = "none";
                document.getElementById("stopDiv").style.display = "block";

                //statr_test();
                start();
            }

            stopDiv.onclick = function(){
                // document.getElementById("startDiv").style.display = "block";
                // document.getElementById("stopDiv").style.display = "none";
                document.getElementById("stopDiv").setAttribute("disabled", true);//设置不可点击
                document.getElementById("stopDiv").textContent = "本次执行完毕后停止";
                status = false;
                localStorage.setItem("sStatus",status);

            }

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
                timer=setInterval(function(){
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
            }  }

        function start(){
            if(window.location.pathname==pathname&&localStorage.getItem("sStatus")=='true'){
                if(localStorage.getItem("num")>=name.length){
                    localStorage.setItem("sStatus",false);
                    document.getElementById("startDiv").style.display = "block";
                    document.getElementById("stopDiv").style.display = "none";
                    alert("全部数据录入完毕");
                    return;
                }
                console.log(window.location.pathname);
                addDate();
                console.log("数据填写完成",num);
                setTimeout(function(){
                    tj_button.click();/*调用提交按钮*/
                    console.log("点击提交按钮");
                    setTimeout(function(){
                        var qd_button = document.getElementsByClassName('ui-dialog-autofocus')[0];
                        console.log("尝试获取弹窗1");
                        setTimeout(function(){
                            qd_button.click();/*调用确定按钮*/
                            console.log("点击确定按钮");
                            setTimeout(function(){

                                console.log("执行完毕",num,"    ",name[num]);
                                num = 1 + parseInt(num);
                                localStorage.setItem("num",num);//记录下次执行位置
                                console.log(window.location.search);
                                if(window.location.search == search1){
                                    console.log("跳转公积金缴存");
                                    window.location.href=url1;
                                }else if(window.location.search == search2){
                                    window.location.href=url2;
                                    console.log("跳转就业登记");
                                }

                            },800);

                        },500);
                    },500);
                },1000);



            }else{
                /*                 console.log(window.location.pathname);
                setTimeout(function(){
                    console.log("跳转目标网页");
                    window.location.href="http://10.176.0.156:8380/enterprise/business/commonreceive/receive?id=9B826C68E192451CADE8FBB89AFA73F7&from=1";
                },1000); */
                //            setTimeout(function(){window.location.href="http://10.176.0.156:8380/enterprise/business/commonreceive/receive?id=9B826C68E192451CADE8FBB89AFA73F7&from=1";},1000);
            }

        }

        //*************************************************

        //********************调用***************************
        ImportCss();
        ImportDiv();
        document.getElementById("numDiv").textContent =(parseInt(num)+1)+"["+name[num]+"]";
        if(localStorage.getItem("sStatus")=='true'){
            document.getElementById("startDiv").style.display = "none";
            document.getElementById("stopDiv").style.display = "block";
        }else{
            document.getElementById("startDiv").style.display = "block";
            document.getElementById("stopDiv").style.display = "none";
        }
        start();
        //statr_test();
        /*         var i = 0;
        function statr_test(){
            if(localStorage.getItem("sStatus")=='true'){
                setTimeout(function(){//接收id用于停止
                    console.log(i);
                    document.getElementById("numDiv").textContent=(parseInt(num)+1)+"["+name[num]+"]正在执行："+i;
                    i++;
                    setTimeout(function(){

                        window.location.href="https://www.baidu.com/";
                    },3000);
                    statr_test();
                },1000);
            }
        }
 */
        //***********************************************

    }
})();