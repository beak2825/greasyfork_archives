// ==UserScript==
// @name 【报价】
// @namespace Violentmonkey Scripts
// @match https://baojia.sd2000.com/Home/Calculate
// @grant none
// @version 1.0.1
// @author cine
// @description 2024/3/6 15:06:26
// @license MIT
// @homepageURL 
// @downloadURL https://update.greasyfork.org/scripts/489292/%E3%80%90%E6%8A%A5%E4%BB%B7%E3%80%91.user.js
// @updateURL https://update.greasyfork.org/scripts/489292/%E3%80%90%E6%8A%A5%E4%BB%B7%E3%80%91.meta.js
// ==/UserScript==

//变量


        //判断类别
        var urlname;   //当前页面的类别是PVCg还是画册等等,从链接上获取
        if(window.location.href.search(/=(.*?$)/)!=-1){
            urlname=RegExp.$1;
            if(urlname.search(/(.*?)&.*/)>-1){
                urlname=RegExp.$1;
            }     
        }



window.onload=function(){

    var theTextForm = document.createElement('div');
    theTextForm.innerHTML= '<input type="text" style="margin-top:3px;color:red;display: none;" class="form-control" id="theTextForm" placeholder="[优化命名]" autocomplete="off" style="font-weight:bold">';
    theTextForm = document.querySelector("#txtResult").parentNode.append(theTextForm);
    theTextForm = document.querySelector("#theTextForm");

    //给计算添加事件
    document.querySelector("#btnCalculate").addEventListener("click",function(){
        theTextForm.value="";
        var counter = 0;
        var maxNum = 20;
        var intervalId = setInterval(function(){
            theTextForm.value=document.querySelector("#txtResult").value;
            counter++;
            if(counter == maxNum || theTextForm.value != ""){
                switch(urlname){
                    case "JIAOYINBUGANJIAO":
                        theTextForm.value = theTextForm.value.replace(/铜版纸/,"");
                        theTextForm.value = theTextForm.value.slice(0,theTextForm.value.search(/款-/)+1)
                        theTextForm.style.display = "block";
                    break;
                  default:
                    theTextForm.value="";
                    break;
                }
                clearInterval(intervalId);
            }
        }, 100);
    },false)
    
}


