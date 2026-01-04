// ==UserScript==
// @name         《计量标准核准》自助受理
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  计量标准核准
// @author       大魔王
// @match        https://www.sojson.com/yasuo.html
// @icon         https://www.google.com/s2/favicons?domain=sojson.com
// @match        http://10.176.0.157:8880/approval/business/accept/add?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/469835/%E3%80%8A%E8%AE%A1%E9%87%8F%E6%A0%87%E5%87%86%E6%A0%B8%E5%87%86%E3%80%8B%E8%87%AA%E5%8A%A9%E5%8F%97%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/469835/%E3%80%8A%E8%AE%A1%E9%87%8F%E6%A0%87%E5%87%86%E6%A0%B8%E5%87%86%E3%80%8B%E8%87%AA%E5%8A%A9%E5%8F%97%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
        //*****************初始化*****************************
        /*
        http://10.176.0.157:8880/main
        http://10.176.0.157:8880/approval/business/accept/add?itemId=5c18340b-28df-42f5-b59e-aca189eec307&type=XK&flag=accept&orgCode=371312SPJ&itemCode=841246&itemName=%E8%AE%A1%E9%87%8F%E6%A0%87%E5%87%86%E5%99%A8%E5%85%B7%E6%A0%B8%E5%87%86&showType=H&assort=2&itemRegionCode=371312000000&itemOrgName=%E6%B2%B3%E4%B8%9C%E5%8C%BA%E8%A1%8C%E6%94%BF%E5%AE%A1%E6%89%B9%E6%9C%8D%E5%8A%A1%E5%B1%80&itemRegionName=%E6%B2%B3%E4%B8%9C%E5%8C%BA&isExsitScene=0&qrInfo=
        https://www.sojson.com/yasuo.html
        hdqspj_dzzzdy4      !QAZ2wsx
        ="'"&A1&"'"&","
        */
        var name = ['孙建校','付怀贵'];
        var idcard = ['330621196309085777','371312198609085757'];
        var num = 0;//计数运行的次数，定位
        var status = true;//运行停止标志
        var isOver = true;


        var pathname = "/approval/business/accept/add";
        var url = "http://10.176.0.157:8880/approval/business/accept/add?itemId=5c18340b-28df-42f5-b59e-aca189eec307&type=XK&flag=accept&orgCode=371312SPJ&itemCode=841246&itemName=%E8%AE%A1%E9%87%8F%E6%A0%87%E5%87%86%E5%99%A8%E5%85%B7%E6%A0%B8%E5%87%86&showType=H&assort=2&itemRegionCode=371312000000&itemOrgName=%E6%B2%B3%E4%B8%9C%E5%8C%BA%E8%A1%8C%E6%94%BF%E5%AE%A1%E6%89%B9%E6%9C%8D%E5%8A%A1%E5%B1%80&itemRegionName=%E6%B2%B3%E4%B8%9C%E5%8C%BA&isExsitScene=0&qrInfo=";
        //btnDiaprrroval   不予许可按钮出现说明页面加载完成


        if(localStorage.length==0||localStorage==0){//初始化
            localStorage.setItem("num",0);
            localStorage.setItem("sStatus",false);
        }else if(localStorage.getItem("num")>0){//记录下次执行位置
            num= localStorage.getItem("num");
        }




        //*************************************************
        //*************************
    text1();
    if(!isOver){
        return;
    }
    function text1() {

        var printTime = "";
        printTime = "1638288000";//  12/1
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


        //********************函数*****************************
        function addDate(){//填写数据
            console.log(num);
            setTimeout(function(){
                //
                //
                document.getElementById("idcardNo").focus();//获取焦点
                setTimeout(function(){
                    document.getElementById("idcardNo").value = idcard[num];
                    setTimeout(function(){
                        document.getElementById("name").focus();
                        setTimeout(function(){
                            document.getElementById("name").value = name[num];
                            setTimeout(function(){
                                document.getElementById("linkPhone").focus();
                                setTimeout(function(){
                                    document.getElementById("linkPhone").value = phone[num];
                                    document.getElementById("name").focus();
                                    console.log("数据填写完毕");

                                    setTimeout(function(){
                                        console.log("点击受理按钮：",document.getElementById('btnAccept'));
                                        document.getElementById('btnAccept').click();//点击受理按钮
                                        setTimeout(function(){
                                            num = 1 + parseInt(num);
                                            localStorage.setItem("num",num);
                                            console.log("提交成功，跳转网页");
                                            setTimeout(function(){
                                                window.location.href=url;
                                            },500);

                                        },500);
                                    },500);
                                },300);
                            },300);
                        },300);
                    },300);
                },300);
            },300);

            if(idcard[num][16]%2==1){//男
                document.getElementsByName('sex')[0].checked = true;
            }else{
                document.getElementsByName('sex')[1].checked = true;
            }
            document.getElementsByName('paperChkApply')[0].click();
            document.getElementsByName('paperChkApply')[1].click();
            document.getElementsByName('paperChkApply')[2].click();

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
/*         function getElements(attr,value,num){//验证数据填写是否成功或操作是否完成
            var isElements = null;
            var isElementsStatus;
            if (!attr || !value) {
                console.log("参数错误  attr:",attr, "    value:", value);
                return;
            }
            setTimeout(function(){
                if(attr=="class"){
                    if(!num){
                        isElements = document.getElementsByClassName(value);
                    }else{
                        isElements = document.getElementsByClassName(value)[num];
                    }
                }else if(attr == "id"){
                    isElements = document.getElementById(value);
                }
                console.log("getElements：",isElements);
                if(isElements != undefined || isElements != null||isElements){
                    isElementsStatus = true;
                }else{
                    isElementsStatus = false;
                }
            },800);
            return isElementsStatus;
        } */

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
                setTimeout(function(){
                    addDate();//填写数据，1秒后验证

                },500);


                //********************************************************
                //                  setTimeout(function(){
                //                     // if(document.getElementsByClassName('Validform_checktip Validform_right').length==9){//数据填写完毕并且通过验证
                //                     console.log("准备受理:",getElements("id","btnAccept",null));
                //                     if(getElements("id","btnAccept",null)||getElements("id","btnAccept",null)=='true'){
                //                         document.getElementById("btnAccept").click();/*调用受理按钮*/
                //                         console.log("点击受理按钮:",getElements("id","btnAccept",null));
                //                         if(getElements("class","aui_state_highlight",0)||getElements("class","aui_state_highlight",0)=='true'){
                //                             console.log("执行完毕",num,"    ",name[num]);
                //                             num = 1 + parseInt(num);
                //                             console.log("提交成功，跳转网页");
                //                             window.location.href=url;
                //                         }else{
                //                             console.log("等待提交成功……");
                //                             getElements("class","aui_state_highlight",0)
                //                         }
                //                     }else{
                //                         console.log("等待受理按钮……");
                //                         getElements("id","btnAccept",null);
                //                     }
                //                     // }else{
                //                     //     start();
                //                     // }
                //                 },1000);
                //********************************************************
                //                  addDate();
                //                 console.log("数据填写完成",num);
                //                 setTimeout(function(){
                //                     document.getElementById("btnAccept").click();/*调用受理按钮*/
                //                     console.log("点击受理按钮");
                //                     setTimeout(function(){
                //                         var qd_button = document.getElementsByClassName('ui-dialog-autofocus')[0];
                //                         console.log("尝试获取弹窗1");
                //                         setTimeout(function(){
                //                             qd_button.click();/*调用确定按钮*/
                //                             console.log("点击确定按钮");
                //                             setTimeout(function(){

                //                                 console.log("执行完毕",num,"    ",name[num]);
                //                                 num = 1 + parseInt(num);
                //                                 localStorage.setItem("num",num);//记录下次执行位置
                //                                 console.log(window.location.search);
                //                                 if(window.location.search == search1){
                //                                     console.log("跳转公积金缴存");
                //                                     window.location.href=url1;
                //                                 }else if(window.location.search == search2){
                //                                     window.location.href=url2;
                //                                     console.log("跳转就业登记");
                //                                 }

                //                             },800);

                //                         },500);
                //                     },500);
                //                 },1000);



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

        //***********************************************

    }
})();