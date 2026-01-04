// ==UserScript==
// @icon            http://passport.ouchn.cn/assets/images/logo.png
// @name            绘梦娱乐脚本测试版本20211225
// @namespace       [url=mailto:1152673513@qq.com]1152673513@qq.com[/url]
// @author          Mrs'Shen
// @description     绘梦娱乐脚本测试版本202112252038
// @match           *://*.ouchn.cn/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @homepageURL     https://greasyfork.org/zh-CN
// @version         1.1.5
// @grant           GM_addStyle
// @run-at          document-end
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_setClipboard
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/437557/%E7%BB%98%E6%A2%A6%E5%A8%B1%E4%B9%90%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95%E7%89%88%E6%9C%AC20211225.user.js
// @updateURL https://update.greasyfork.org/scripts/437557/%E7%BB%98%E6%A2%A6%E5%A8%B1%E4%B9%90%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95%E7%89%88%E6%9C%AC20211225.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var tm;
    var da;
    var len = $(".deferredfeedback").length
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

for(var i = 0;i<len;i++){
      tm = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).text().split("试题正文")[1]
      da = $(".deferredfeedback").eq(i).children().eq(1).children().eq(1).text().split("反馈")[1]

       if(tm.substr(0,6).includes("．")){

           tm = tm.substr(tm.indexOf("．")+1,tm.length)

       }else if(tm.substr(0,6).includes(".")){

           tm = tm.substr(tm.indexOf(".")+1,tm.length)

       }

      if(tm!=null&&da!=null&&tm!=undefined&&da!=undefined&&tm!=""&&da!=""){

          //选择题区域
          if(da.includes("正确答案是：")){
              da = da.split("正确答案是：")[1]
              console.log("第"+(i+1)+"题题目：\n"+tm+"\n\n"+"答案："+da)
              search(tm.replace(/\s*/g,""),da);
          }else if(da.includes("答案：")){
             da = da.split("答案：")[1]
             console.log("第"+(i+1)+"题题目：\n"+tm+"\n\n"+"答案："+da)
             search(tm.replace(/\s*/g,""),da);
          }else if(da.includes("正确答案是")){
             da = da.split("正确答案是")[1]
             console.log("第"+(i+1)+"题题目：\n"+tm+"\n\n"+"答案："+da)
             search(tm.replace(/\s*/g,""),da);
          }else if(da=="你的回答正确"){

              var da1 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(0).attr("class")
              var da2 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(1).attr("class")
              var da3 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(2).attr("class")
              var da4 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(3).attr("class")
              var da5 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(4).attr("class")

              if(da1 ==undefined){
                   da1 = ""
              }else if(da1.includes("correct")){
                   da1 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(0).text()
              }else{
                   da1 = ""
              }

              if(da2 ==undefined){
                   da2 = ""
              }else if(da2.includes("correct")){
                   da2 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(1).text()
              }else{
                   da2 = ""
              }

              if(da3 ==undefined){
                   da3 = ""
              }else if(da3.includes("correct")){
                   da3 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(2).text()
              }else{
                   da3 = ""
              }

              if(da4 ==undefined){
                   da4 = ""

              }else if(da4.includes("correct")){
                   da4 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(3).text()
              }else{
                   da4 = ""
              }

              if(da5 ==undefined){
                   da5 = ""
              }else if(da5.includes("correct")){
                   da5 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(4).text()
              }else{
                   da5 = ""
              }

              da = da1 + da2 + da3 + da4 + da5

              if(da.replace(/\s*/g,"")!=""){
                  console.log("第"+(i+1)+"题题目：\n"+tm+"\n\n"+"答案："+da)
                  search(tm.replace(/\s*/g,""),da);
              }
          }

      }else if(da==undefined){

              //判断题区域
              var pd1 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(0).attr("class")
              var title1 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(0).children().eq(2).attr("title")
              var pd2 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(1).attr("class")
              var title2 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(1).children().eq(2).attr("title")

              if(pd1 ==undefined){
                  pd1 = ""
              }if(pd1.includes("correct")&&title1=="正确"){
                  pd1 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(0).text()
              }else{
                  pd1 = ""
              }

              if(pd2 ==undefined){
                  pd2 = ""
              }else if(pd2.includes("correct")&&title2=="正确"){
                  pd2 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(3).children().eq(1).children().eq(1).text()
              }else{
                  pd2 = ""
              }


              //填空题区域
              var pd3 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(0).children().eq(1).attr("class")
              var title3 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(0).children().eq(2).attr("title")
              var tk3 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(0).children().eq(3).text()

              var pd4 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(1).children().eq(1).attr("class")
              var title4 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(1).children().eq(2).attr("title")
              var tk4 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(1).children().eq(3).text()

              var pd5 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(2).children().eq(1).attr("class")
              var title5 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(2).children().eq(2).attr("title")
              var tk5 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(2).children().eq(3).text()

              var pd6 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(3).children().eq(1).attr("class")
              var title6 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(3).children().eq(2).attr("title")
              var tk6 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(3).children().eq(3).text()

              var pd7 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(4).children().eq(1).attr("class")
              var title7 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(4).children().eq(2).attr("title")
              var tk7 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(4).children().eq(3).text()

              var pd8 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(5).children().eq(1).attr("class")
              var title8 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(5).children().eq(2).attr("title")
              var tk8 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(5).children().eq(3).text()

              var pd9 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(6).children().eq(1).attr("class")
              var title9 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(6).children().eq(2).attr("title")
              var tk9 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(6).children().eq(3).text()

              if(pd3==undefined){
                   pd3 = ""
              }else if(pd3.includes("correct")&&title3=="正确"){
                  pd3 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(0).children().eq(1).val()

              }else if(tk3==undefined||tk3==""){
                  pd3 = ""
              }else if(tk3.includes("正确答案是：")){
                   pd3 = tk3.split("正确答案是：")[1].split("得分")[0]
              }else{
                   pd3 = ""
              }

              if(pd4==undefined){
                   pd4 = ""
              }else if(pd4.includes("correct")&&title4=="正确"){
                 pd4 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(1).children().eq(1).val()
              }else if(tk4==undefined||tk4==""){
                  pd4 = ""
              }else if(tk4.includes("正确答案是：")){
                   pd4 = tk4.split("正确答案是：")[1].split("得分")[0]
              }else{
                   pd4 = ""
              }

              if(pd5==undefined){
                   pd5 = ""
              }else if(pd5.includes("correct")&&title5=="正确"){
                 pd5 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(2).children().eq(1).val()
              }else if(tk5==undefined||tk5==""){
                  pd5 = ""
              }else if(tk5.includes("正确答案是：")){
                   pd5 = tk5.split("正确答案是：")[1].split("得分")[0]
              }else{
                   pd5 = ""
              }

              if(pd6==undefined){
                   pd6 = ""
              }else if(pd6.includes("correct")&&title6=="正确"){
                 pd6 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(3).children().eq(1).val()
              }else if(tk6==undefined||tk6==""){
                  pd6 = ""
              }else if(tk6.includes("正确答案是：")){
                   pd6 = tk6.split("正确答案是：")[1].split("得分")[0]
              }else{
                   pd6 = ""
              }

              if(pd7==undefined){
                   pd7 = ""
              }else if(pd7.includes("correct")&&title7=="正确"){
                 pd7 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(4).children().eq(1).val()
              }else if(tk7==undefined||tk7==""){
                  pd7 = ""
              }else if(tk7.includes("正确答案是：")){
                   pd7 = tk7.split("正确答案是：")[1].split("得分")[0]
              }else{
                   pd7 = ""
              }

              if(pd8==undefined){
                   pd8 = ""
              }else if(pd8.includes("correct")&&title8=="正确"){
                 pd8 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(5).children().eq(1).val()
              }else if(tk8==undefined||tk8==""){
                  pd8 = ""
              }else if(tk8.includes("正确答案是：")){
                   pd8 = tk8.split("正确答案是：")[1].split("得分")[0]
              }else{
                   pd8 = ""
              }

              if(pd9==undefined){
                   pd9 = ""
              }else if(pd9.includes("correct")&&title9=="正确"){
                 pd9 = $(".deferredfeedback").eq(i).children().eq(1).children().eq(0).children().eq(4).children().eq(6).children().eq(1).val()
              }else if(tk9==undefined||tk9==""){
                  pd9 = ""
              }else if(tk9.includes("正确答案是：")){
                   pd9 = tk9.split("正确答案是：")[1].split("得分")[0]
              }else{
                   pd9 = ""
              }

              da = pd1 + pd2 + pd3 +" "+ pd4 +" "+ pd5 +" "+ pd6 +" "+ pd7 +" "+ pd8 +" "+ pd9

              if(da.replace(/\s*/g,"")!=""){
                  console.log("第"+(i+1)+"题题目：\n"+tm+"\n\n"+"答案："+da)
                  add(tm.replace(/\s*/g,""),da);
              }

          }

 };

})();

