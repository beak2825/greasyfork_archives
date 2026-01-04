// ==UserScript==
// @name         绘梦测试02版
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  绘梦测试脚本02版本
// @author       You
// @match        *://xk.scrtvu.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/438302/%E7%BB%98%E6%A2%A6%E6%B5%8B%E8%AF%9502%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/438302/%E7%BB%98%E6%A2%A6%E6%B5%8B%E8%AF%9502%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function add(question,answer){
        //var data = 'timu='+question+'&daan='+answer+'';
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


  function search(question,da){

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
                var srhtimu = JSON.parse(json).tm
                var srhdaan = JSON.parse(json).answer
                console.log("服务器返回题目："+srhtimu);
                console.log("服务器返回答案："+srhdaan);
                if(srhdaan.includes("题库未收录该题")){
                         //console.log("当前为录题界面！")
                         add(srhtimu,da)
                }

            }}
     };


  var tmck = $(".ReviewItemBody")
  var len = tmck.length
  for(var i =0;i<len;i++){
     var ck = tmck.eq(i).find(".ReviewSingleOptionBody")
     var len1 = ck.length
     var tmstr = tmck.eq(i).text()
     var tm;
     var reg = false;

      //console.log(ck.text())
     //console.log("原题目："+ tmstr)
     var pd1 = tmstr.split("满分：")[1]
     var mf = pd1.split("得分：")[0]
     var df = pd1.split("得分：")[1]
     //console.log(mf + df)
     if(Number(df) == Number(mf)){
       reg = true;
     }

    if(tmstr.split("A.")[1]==undefined){
        tm = tmstr.split("A．")[1]
    }else{
        tm = tmstr.split("A.")[1]
    }
    tm = tm.split("满分：")[0]
    tm = "A." + tm
    tm = tm.split("q")[0]

    tmstr = tmstr.split("q")[0]

    // tmstr = tmstr

    if(tmstr.indexOf("．")!==-1){

        tmstr = tmstr.substring(tmstr.indexOf("．")+1,tmstr.length).replace(/\s*/g,"")

    }else if(tmstr.indexOf(".")!==-1){

        tmstr = tmstr.substring(tmstr.indexOf(".")+1,tmstr.length).replace(/\s*/g,"")

    }

    // if(tm.split("q")[0].indexOf("A. B. C. D.       ")!==-1){
    //     console.log("选项为空！")
    // }else{
    //     tmstr = tmstr + tm
    // }

    if(tmstr.split("A.")[1]==undefined && tmstr.split("A．")[1]==undefined){
        tmstr = tmstr + tm
    }

    if(tmstr.indexOf("A. B")!==-1 ){
        tmstr = tmstr.split("A. B")[0]
    }else if(tmstr.indexOf("A.B")!==-1){
        tmstr = tmstr.split("A.B")[0]
    }

    tmstr = tmstr.replace(/\s*/g,"")

    if(tmstr.indexOf("满分：")!==-1){
        tmstr = tmstr.split("满分：")[0]
    }

    if(reg){
       console.log("网页题目："+tmstr)
    }

    var sl = 0;
    var re;
    var re2;
    var res ="";
    for(var n =0;n<len1;n++){
       var red = ck.eq(n).children().attr("checked")
       if(red){
          sl = sl + 1
          re = ck.eq(n).children().text()
          re2 = ck.eq(n).text()
          if(res ==""){
             if(re!=""){
                 res = ck.eq(n).children().text().replace(/\s*/g,"")
             }else if(re2!=""){
                 res = ck.eq(n).text().replace(/\s*/g,"")
             }
          }else{
             if(re!=""){
                 res = res +"、"+ ck.eq(n).children().text().replace(/\s*/g,"");
             }else if(re2!=""){
                 res = res +"、"+ ck.eq(n).text().replace(/\s*/g,"");
             }
          }
       }

    }

    if(reg){
       //console.log("本题为满分！")//A.x1、B.x2、C.x3、D.x4
       var x1="";
       var x2="";
       var x3="";
       var x4="";
       if(res.replace(/\s*/g,"").indexOf("A.")!=-1){//A.x1、B.x2、C.x3、D.x4
           res = res.replace(/\s*/g,"").split("A.")[1];//x1、B.x2、C.x3、D.x4
       }else if(res.replace(/\s*/g,"").indexOf("B.")!=-1){//x1、B.x2、C.x3、D.x4
           res = res.replace(/\s*/g,"").split("B.")[1];//x2、C.x3、D.x4
           x1 = res.replace(/\s*/g,"").split("B.")[0];//x1、
            if(x1==undefined){
                 x1="";
           }
       }else if(res.replace(/\s*/g,"").indexOf("C.")!=-1){//x2、C.x3、D.x4
           res = res.replace(/\s*/g,"").split("C.")[1];//x3、D.x4
           x2 = res.replace(/\s*/g,"").split("C.")[0];//x2、
           if(x2==undefined){
                 x2="";
           }
       }else if(res.replace(/\s*/g,"").indexOf("D.")!=-1){//x3、D.x4
           res = res.replace(/\s*/g,"").split("D.")[1];//x4
           x3 = res.replace(/\s*/g,"").split("D.")[0];//x3、
           if(x3==undefined){
                 x3="";
           }
           x4 = res.replace(/\s*/g,"").split("D.")[1];//x4
            if(x4==undefined){
                 x4="";
           }
       }else{
           res = res.replace(/\s*/g,"");
       }
       if(x1!=""||x2!=""||x3!=""||x4!=""){
           res = x1+x2+x3+x4;
           res = res.replace(/\s*/g,"");
       }
       if(sl==1){
              console.log("网页答案："+res)
              search(tmstr.replace(/\s*/g,""),res);
       }else if(sl>=2){
               console.log("网页答案："+res)
               search(tmstr.replace(/\s*/g,""),res);
       }
    }
  }

})();
