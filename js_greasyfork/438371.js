// ==UserScript==
// @name         绘梦测试05版本
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  绘梦测试功能版本05版本
// @author       You
// @match        *://*.swust.net.cn/*
// @match        *://*.onmooc.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438371/%E7%BB%98%E6%A2%A6%E6%B5%8B%E8%AF%9505%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/438371/%E7%BB%98%E6%A2%A6%E6%B5%8B%E8%AF%9505%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

//$(document).keydown(function (event) {
// if (event.keyCode == 36) {

    var addres;
    var srhtimu;
    var srhdaan;

    function add(question,answer){
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','http://uptk.shen668.cn/wkapiadd.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("timu="+question+"&daan="+answer+"");//发送请求 将情头体写在send中
        /**
           * 获取数据后的处理程序
          */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var addres = JSON.parse(json).ad
                console.log("服务器返回录入结果："+addres);
            }}
    };


  var tmck = $(".test_item")
  var len = tmck.length
  var into = false;
  var right = $(".test_right")
  var wrong = $(".test_wrong")
  var tlen = right.length + wrong.length
  var rwres = "";
  //var qs =[];
  for(var a = 0;a<tlen;a++){
      rwres += right.eq(a).text() + wrong.eq(a).text()
  }
  if(rwres!=""){
     into = true
     console.log("====================================================================当前处于查看答案界面=================================================================================================================================")
  }else{
     console.log("====================================================================当前处于答题界面或者非查看答案界面=====================================================================================================================")
  }

function search(question,da,xs,ds){

        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','http://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("tm="+question);//发送请求 将情头体写在send中
        /**
 * 获取数据后的处理程序
 */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                srhtimu = JSON.parse(json).tm
                srhdaan = JSON.parse(json).answer
                console.log("服务器返回题目："+srhtimu);
                console.log("服务器返回答案："+srhdaan);
                if(into){
                     if(srhdaan.includes("题库未收录该题")){
                         //console.log("当前为录题界面！")
                         add(srhtimu,da)
                     }
                 }else{

                   for(var x =0;x<xs.length + 1;x++){
                         var g = x + 1
                        if(xs.eq(x).text().includes(srhdaan)){
                            console.log("单选题"+g+"："+xs.eq(x).text())
                            xs.eq(x).children().children().eq(0).attr("checked",true);
                        }else if(ds.eq(x).text().includes(srhdaan)){
                           if(ds.eq(x).text().includes("对") || ds.eq(x).text().includes("错")){
                               console.log("判断题"+g+"："+ds.eq(x).text())
                               ds.eq(x).children().eq(0).attr("checked",true);
                           }
                        }else if(srhdaan!=undefined&&srhdaan.includes(xs.eq(x).text().replace(/\s*/g,"").substring(0,1))){
                            if(xs.eq(x).text().replace(/\s*/g,"").substring(0,1)!=""){
                                console.log("多选题"+g+"："+xs.eq(x).text().replace(/\s*/g,"").substring(0,1))
                                xs.eq(x).children().children().eq(0).attr("checked",true);
                            }
                        }
                    }
                 }
            }}
 };


  for(var i =0;i<len;i++){
     var ck = tmck.eq(i).find(".test_item_tit")
     var ds = tmck.eq(i).find(".test_item_theme").children()
     var xs = tmck.eq(i).find(".test_item_theme").children().eq(0).children()
     var xx = tmck.eq(i).find(".test_item_theme").children().eq(0)
     var das = tmck.eq(i).find(".test_item_theme").children().eq(1)
     var len1 = ck.length
     var xxs = xx.text().replace(/\s*/g,"")

     var tmstr = ck.text().replace(/\s*/g,"")
     var da = das.text().replace(/\s*/g,"")

    if(tmstr){
       if(tmstr.includes("该题未做")){
         tmstr = tmstr.split("该题未做")[0]
     }}


    if(tmstr.indexOf("．")!==-1){

        tmstr = tmstr.substring(tmstr.indexOf("．")+1,tmstr.length).replace(/\s*/g,"")

    }else if(tmstr.indexOf(".")!==-1){

        tmstr = tmstr.substring(tmstr.indexOf(".")+1,tmstr.length).replace(/\s*/g,"")

    }

    if(xx.text().includes("我的答案：")){
       xx = tmck.eq(i).children().eq(1)
       xxs = xx.text().split("我的答案：")[0].replace(/\s*/g,"")
    }
    tmstr = tmstr + xxs
    if(da==""){
        das = tmck.eq(i).find(".test_item_theme")
        da = das.text().replace(/\s*/g,"")
    }

    if(tmstr.includes("我的答案：")){
        da = tmstr
        tmstr = tmstr.split("我的答案：")[0]
        da = da.split("参考答案：")[1].split("答案")[0]
    }

    if(da.includes("参考答案：")){
      da = da.split("参考答案：")[1].split("答案")[0]
    }
    tmstr = tmstr.replace(/\s*/g,"")
    da = da.replace(/\s*/g,"")

    if(tmstr&&da&&tmstr!=""&&da!=""){
       if(into){
           console.log("网页题目："+tmstr)
           console.log("网页答案："+da)
       }else{
           if(tmstr.substring(tmstr.length-1,tmstr.length).includes("对")){
               tmstr = tmstr + "错";
           }
       }
       search(tmstr,da,xs,ds)
         }
       }




//     }
// });


})();
