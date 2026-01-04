// ==UserScript==
// @icon            http://passport.ouchn.cn/assets/images/logo.png
// @name            FSZYPT
// @namespace       [url=mailto:1152673513@qq.com]1152673513@qq.com[/url]
// @author          沈华
// @description     fszypttools
// @match           *://*.open.com.cn/*
// @require         http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @version         1.2.9
// @grant           GM_addStyle
// @run-at          document-end
// @grant           unsafeWindow
// @grant           GM_xmlhttpRequest
// @connect         *
// @grant           GM_setValue
// @grant           GM_getValue
// @grant           GM_setClipboard
// @license         MIT
// @downloadURL https://update.greasyfork.org/scripts/457021/FSZYPT.user.js
// @updateURL https://update.greasyfork.org/scripts/457021/FSZYPT.meta.js
// ==/UserScript==
(function () {
    'use strict';
function fszypt(){

  function add(question,answer){
        //var data = 'timu='+question+'&daan='+answer+'';
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','https://uptk.shen668.cn/wkapiadd.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("timu="+window.encodeURIComponent(question)+"&daan="+window.encodeURIComponent(answer)+"");//发送请求 将情头体写在send中
        /**
 * 获取数据后的处理程序
 */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var addres = JSON.parse(json).ad
                console.log("服务器返回录入结果："+addres+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
            }}
    };
  function search(question,da){
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','https://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("tm="+window.encodeURIComponent(question));//发送请求 将情头体写在send中
        /**
 * 获取数据后的处理程序
 */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var srhtimu = JSON.parse(json).tm
                var srhdaan = JSON.parse(json).answer
                console.log("服务器返回题目："+srhtimu);

                if(srhdaan.includes("题库未收录该题")&&da!=undefined&&da!=""&&da!=null){
                        add(srhtimu,da)
                        console.log("服务器返回答案："+srhdaan);
                }else{
                        console.log("服务器返回答案："+srhdaan+"\n\r----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------");
                }

            }}
     };
  function dosearch(question,xxs){
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','https://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("tm="+window.encodeURIComponent(question));//发送请求 将情头体写在send中
        /**
 * 获取数据后的处理程序
 */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var srhtimu = JSON.parse(json).tm
                var srhdaan = JSON.parse(json).answer
                console.log("服务器返回题目："+srhtimu);

                if(srhdaan.includes("题库未收录该题")){
                        console.log("题库未收录该题,请前往录题界面收录该题！");
                        xxs.children().each(function(){
                            var xs = $(this).children().eq(0).text().replace(/\s*/g,"")+"";
                            if($(this)[0].getAttribute("class").indexOf("Choosed")!=-1){
                                         console.log("本题统一选项：" + $(this).children().eq(0).text().replace(/\s*/g,""));
                            }else{
                                if(xs=="B"){
                                    $(this).children().eq(0).click();
                                    $(this).append("---(本题选项非正确答案，为了方便提交默认选择此选项)");
                                    $(this)[0].setAttribute("style", "background-color:#da2b3f;");
                                }
                            }
                        })
                }else{
                        console.log("服务器返回答案："+srhdaan);
                        var da = "";
                        xxs.children().each(function(){
                            var xs = $(this).children().eq(0).text().replace(/\s*/g,"")+"";
                            if(srhdaan.indexOf("#")!=-1){
                                  var len = srhdaan.split("#").length;
                                  var ds = srhdaan.split("#");
                                  for(var a = 0;a<len;a++){
                                      if($(this).text().split(xs)[1].replace(/\s*/g,"")==ds[a]){
                                         if($(this)[0].getAttribute("class").indexOf("Choosed")!=-1){
                                             console.log("本题已选了选项：" + $(this).children().eq(0).text().replace(/\s*/g,""));
                                         }else{
                                             $(this).children().eq(0).click();
                                         }
                                      }
                                  }
                            }else{
                                if($(this).text().split(xs)[1].replace(/\s*/g,"")==srhdaan){
                                    if($(this)[0].getAttribute("class").indexOf("Choosed")!=-1){
                                         console.log("本题已选了选项：" + $(this).children().eq(0).text().replace(/\s*/g,""));
                                    }else{
                                         $(this).children().eq(0).click();
                                    }
                                }
                            }
                        })
                }
            }}
     };
  function fszyptAdd(){//非英语科目 录题界面
        //.replace(/\s*/g,"")
      console.log("当前为录题界面!");
      $(".Subject-Description").each(function(){
            var tm = $(this).children().eq(1).children(".Subject-Title").text().replace(/\s*/g,"");
            var xxs = $(this).children().eq(1).children(".Subject-Options");
            var xx = "";
            var da = "";
            var das = $(this).children().eq(1).children(".Answer-Box").text().split("正确答案：")[1].replace(/\s*/g,"");
            xxs.children().each(function(){
                var xs = $(this).children().eq(0).text().replace(/\s*/g,"")+"";
                xx += xs + "."+ $(this).text().split(xs)[1].replace(/\s*/g,"");
                if(das.indexOf(xs)!=-1){
                   if(da==""){
                       da = $(this).text().split(xs)[1].replace(/\s*/g,"");
                   }else{
                       da = da + "#"+ $(this).text().split(xs)[1].replace(/\s*/g,"");
                   }
                }
            })
            tm = tm + xx;
            if(tm.indexOf("*'")!=-1){
                tm = tm.split("*'")[1];
            }else if(tm.indexOf("*")!=-1){
                tm = tm.split("*")[1];
            }
            console.log("网页题目："+tm);
            console.log("网页答案："+da);
            search(tm,da);
        })
    };
  function fszyptDo(){//非英语科目 答题题界面
     console.log("当前为答题界面!");
      $(".Subject-Description").each(function(){
            var tm = $(this).children().eq(1).children(".Subject-Title").text().replace(/\s*/g,"");
            var xxs = $(this).children().eq(1).children(".Subject-Options");
            var xx = "";
            xxs.children().each(function(){
                var xs = $(this).children().eq(0).text().replace(/\s*/g,"")+"";
                xx += xs + "."+ $(this).text().split(xs)[1].replace(/\s*/g,"");
            })
            tm = tm + xx;
            if(tm.indexOf("*'")!=-1){
                tm = tm.split("*'")[1];
            }else if(tm.indexOf("*")!=-1){
                tm = tm.split("*")[1];
            }
            console.log("网页题目："+tm);
            dosearch(tm,xxs);
        })
  };
  if($(".Test-Info-Right").text().replace(/\s*/g,"")=="答题中" && $(".Test-Info-Right").text().replace(/\s*/g,"")!=""){
         fszyptDo();//答题
  }else if($(".Test-Info-Right").text().replace(/\s*/g,"")!="答题中" && $(".Test-Info-Right").text().replace(/\s*/g,"")!=""){
         fszyptAdd();//录题
  }

}
setTimeout(function(){
    fszypt();
},3600);
})();