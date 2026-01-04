// ==UserScript==
// @name         无证明城市-综合科
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  无证明城市
// @author       大魔王
// @match        http://111.16.49.176:8088/lyzwfw/rzzwfw/pages/wzmcity/zmproject/wzmcitysearchzmresult?zmtaskguid=aa9e50ff-a1e0-48c0-b65e-339ebe274d76&_dialogId_=10F11CC0-BEBB-486B-B832-2695B2E86FD4&_winid=w9357&_t=440570

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469834/%E6%97%A0%E8%AF%81%E6%98%8E%E5%9F%8E%E5%B8%82-%E7%BB%BC%E5%90%88%E7%A7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/469834/%E6%97%A0%E8%AF%81%E6%98%8E%E5%9F%8E%E5%B8%82-%E7%BB%BC%E5%90%88%E7%A7%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //  window.onload = function(){
    //*****************初始化*****************************http://111.16.49.176:8088/lyzwfw/rzzwfw/pages/wzmcity/zmproject/wzmcityzmprojectSQlist.html
    var num = 0;//计数运行的次数，定位
    var status = true;//运行停止标志
    var overtime = 20000*1000;//查询超时时间ms
    let errcount = 0;//查询报错次数，超过N次直接跳过
    let retrycount = 1;//尝试重新查询次数，超过次数直接跳过
    var setTimeoutId,setTimeoutId_1,setTimeoutId_2;
    //1-3万
    var name = [];
    var idcard = [];
    var name1 = name;
    //3-6万
   
    if(localStorage.length==0){//初始化
        localStorage.setItem("num",0);
        localStorage.setItem("sStatus",false);
    }else if(localStorage.getItem("num")>0){//记录下次执行位置
        num= localStorage.getItem("num");
    }



    //*************************************************


    //********************函数*****************************


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
            //clearTimeout(setTimeoutId);
            // clearTimeout(setTimeoutId_1);
            // clearTimeout(setTimeoutId_2);
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
        }  }

    function start1(){

        if(localStorage.getItem("sStatus")=='true'){
            let name = document.getElementById('xm$text')
            ,userid = document.getElementById('certnum$text')
            ,idtype = document.getElementsByClassName('mini-list-icon mini-icon')[0]
            ,serchButton = document.getElementById('btnSearchRecord');
            //console.log(serchButton)

                idtype.click();
                console.log($('#xm'));



                setTimeout(function(){

                    num= localStorage.getItem("num");
                    console.log(num);
                    console.log(name1[num]);
                    console.log(idcard[num]);
                    name.value = name1[num];
                    //填充数据后接回车或空格，即可通过验证
                    var evt = $.Event('keydown',{keyCode:13}); //定义模拟按键
                    name.focus();
                    setTimeout(function(){
                        //执行模拟案按键
                        $(name).trigger(evt);
                        userid.value = idcard[num];
                        userid.focus();
                        setTimeout(function(){
                            $(userid).trigger(evt);
                            localStorage.setItem("num",num);
                            setTimeout(function(){
                                serchButton.click();//查询

                                //循环判断查询成功或失败，overtime/1000秒超时时间
                                let i = 0;

                                setTimeout(function succcess(){//mini-23$number$4   查询失败  因省级系统网络原因导致无法获取数据，请稍后再试

                                    let isSucccess = document.querySelectorAll('div.mini-grid-cell-inner')[1];//查询结束的表格元素
                                    let errMsg = document.getElementsByClassName('mini-panel mini-corner-all mini-window mini-window-drag mini-messagebox')[0];//系统错误弹窗   【系统出现了一点故障，请联系系统管理员进行检修处理!】
                                    i = i + 1;


                                    if(isSucccess == undefined && i <= overtime/1000){//等待查询结束，或者检查系统是否出错
                                        if(errMsg == undefined){
                                            isSucccess = document.querySelectorAll('div.mini-grid-cell-inner')[1];
                                            console.log("查询中",i,"/",overtime/1000,isSucccess);
                                            setTimeout(function(){
                                                succcess();//调用自身
                                            },1000);
                                        }else{
                                            console.log("系统出现了一点故障，请联系系统管理员进行检修处理!",errcount);//关闭弹窗，并刷新重试- //***2022年8月22日16:33:02 疑似有些身份证会报错，重试几次次不行跳过
                                            document.getElementsByClassName('mini-button-text')[5].click();
                                            if(errcount < retrycount){
                                                errcount++;
                                                setTimeout(function(){

                                                    start();
                                                    //window.location.reload();

                                                },5000);
                                            }else{//超过次数，直接跳过
                                                num++;
                                                localStorage.setItem("num",num);
                                                console.log("疑似身份证无效，跳过");
                                                setTimeout(function(){
                                                    window.location.reload();
                                                },1000)//刷新页面
                                            }


                                        }



                                    }else{
                                        //查询结束，不管成功或者失败
                                        num++;
                                        localStorage.setItem("num",num);
                                        console.log("查询完毕");
                                        setTimeout(function(){
                                            window.location.reload();
                                        },1000)//刷新页面
                                        // }
                                    }

                                },1000)

                            },1000);
                        },500);


                    },500);


                },400)




        }



    }
    function start(){

        if(localStorage.getItem("sStatus")=='true'){
            let name = document.getElementById('xm$text')
            ,userid = document.getElementById('certnum$text')
            ,idtype = document.getElementsByClassName('mini-list-icon mini-icon')[0]
            ,serchButton = document.getElementById('btnSearchRecord');
            //console.log(serchButton)
            if(!idtype){
                setTimeout(function(){
                    console.log("等待页面加载");
                    start();
                    return ;
                },2000);
            }else{
                idtype.click();
                console.log($('#xm'));



                setTimeout(function(){

                    num= localStorage.getItem("num");
                    console.log(num);
                    console.log(name1[num]);
                    console.log(idcard[num]);
                    name.value = name1[num];
                    //填充数据后接回车或空格，即可通过验证
                    var evt = $.Event('keydown',{keyCode:13}); //定义模拟按键
                    name.focus();
                    setTimeout(function(){
                        //执行模拟案按键
                        $(name).trigger(evt);
                        userid.value = idcard[num];
                        userid.focus();
                        setTimeout(function(){
                            $(userid).trigger(evt);
                            localStorage.setItem("num",num);
                            setTimeout(function(){
                                serchButton.click();//查询

                                //循环判断查询成功或失败，overtime/1000秒超时时间
                                let i = 0;

                                setTimeout(function succcess(){//mini-23$number$4   查询失败  因省级系统网络原因导致无法获取数据，请稍后再试

                                    let isSucccess = document.querySelectorAll('div.mini-grid-cell-inner')[1];//查询结束的表格元素
                                    let errMsg = document.getElementsByClassName('mini-panel mini-corner-all mini-window mini-window-drag mini-messagebox')[0];//系统错误弹窗   【系统出现了一点故障，请联系系统管理员进行检修处理!】
                                    i = i + 1;


                                    if(isSucccess == undefined && i <= overtime/1000){//等待查询结束，或者检查系统是否出错
                                        if(errMsg == undefined){
                                            isSucccess = document.querySelectorAll('div.mini-grid-cell-inner')[1];
                                            console.log("查询中",i,"/",overtime/1000,isSucccess);
                                            setTimeout(function(){
                                                succcess();//调用自身
                                            },1000);
                                        }else{
                                            console.log("系统出现了一点故障，请联系系统管理员进行检修处理!",errcount);//关闭弹窗，并刷新重试- //***2022年8月22日16:33:02 疑似有些身份证会报错，重试几次次不行跳过
                                            document.getElementsByClassName('mini-button-text')[5].click();
                                            if(errcount < retrycount){
                                                errcount++;
                                                setTimeout(function(){

                                                    start();
                                                    //window.location.reload();

                                                },5000);
                                            }else{//超过次数，直接跳过
                                                num++;
                                                localStorage.setItem("num",num);
                                                console.log("疑似身份证无效，跳过");
                                                setTimeout(function(){
                                                    window.location.reload();
                                                },1000)//刷新页面
                                            }


                                        }



                                    }else{
                                        //查询结束，不管成功或者失败
                                        num++;
                                        localStorage.setItem("num",num);
                                        console.log("查询完毕");
                                        setTimeout(function(){
                                            window.location.reload();
                                        },1000)//刷新页面
                                        // }
                                    }

                                },1000)

                            },1000);
                        },500);


                    },500);


                },400)
            }



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
    setTimeout(function(){start();},1300);




    //***********************************************

    // }
})();