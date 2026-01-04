// ==UserScript==
// @name         WEBTRN
// @namespace    http://tampermonkey.net/
// @version      1.3.5
// @description  THIS IS A WEBTRN TOOLS!
// @author       SH
// @match        *://*.webtrn.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456061/WEBTRN.user.js
// @updateURL https://update.greasyfork.org/scripts/456061/WEBTRN.meta.js
// ==/UserScript==

(function() {
    'use strict';
if($(".submit_solid").text().indexOf("开始作答")!=-1){
          $(".submit_solid").click();
    setTimeout(function(){$(".submit_solid").click();},2000)
}
//console.log($("#enter8a86816f83373e5c018343fd9cd806bc > a").text())
function webtrn(){
  function add(question,answer){
        question = window.encodeURIComponent(question);
        answer = window.encodeURIComponent(answer);
        //var data = 'timu='+question+'&daan='+answer+'';
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','https://uptk.shen668.cn/wkapiadd.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("timu="+question+"&daan="+answer+"");//发送请求 将情头体写在send中
        /**
 * 获取数据后的处理程序
 */
        httpRequest.onreadystatechange = function () {//请求后的回调接口，可将请求成功后要执行的程序写在其中
            if (httpRequest.readyState == 4 && httpRequest.status == 200) {//验证请求是否发送成功
                var json = httpRequest.responseText;//获取到服务端返回的数据
                var addres = JSON.parse(json).ad
                console.log("服务器返回录入结果："+addres+"");
            }}
    };
  function search(question,da,cxx){
        question = window.encodeURIComponent(question);
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','https://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
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

                if(srhdaan.includes("题库未收录该题")&&da!=undefined&&da!=""&&da!=null){
                        add(srhtimu,da)
                        console.log("服务器返回答案："+srhdaan);
                }else{
                        console.log("服务器返回答案："+srhdaan+"");
                        var len1 = cxx.length;
                        for(var b= 0;b<len1;b++){
                              var doda = cxx.eq(b).children().eq(1);
                              var daa = cxx.eq(b).children().eq(1).text().replace(/\s*/g,"")
                              if(daa.indexOf("A．")!=-1){
                                  daa = daa.split("A．")[1];
                              }
                            if(daa.indexOf("B．")!=-1){
                                daa = daa.split("B．")[1];
                            }
                            if(daa.indexOf("C．")!=-1){
                                daa = daa.split("C．")[1];
                            }
                            if(daa.indexOf("D．")!=-1){
                                daa = daa.split("D．")[1];
                            }
                            if(daa.indexOf("E．")!=-1){
                                daa = daa.split("E．")[1];
                            }
                            if(daa.indexOf("F．")!=-1){
                                daa = daa.split("F．")[1];
                            }
                            if(srhdaan.indexOf("#")!=-1){
                                var len2 = srhdaan.split("#").length;
                                for(var c=0;c<len2;c++){
                                    if(daa==srhdaan.split("#")[c]){
                                        if(doda[0].getAttribute("class")!="radio_on" && doda[0].getAttribute("class")!="checkbox_on"){
                                            doda.click();
                                        }
                                    }
                                }
                            }else{
                               if(daa==srhdaan){
                                   if(doda[0].getAttribute("class")!="radio_on" && doda[0].getAttribute("class")!="checkbox_on"){
                                            doda.click();
                                   }
                               }
                            }
                        }

                }

            }}
     };
  function searches(question,da){
        question = window.encodeURIComponent(question);
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','https://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
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
                if(srhdaan.includes("题库未收录该题")&&da!=undefined&&da!=""&&da!=null){
                        add(srhtimu,da)
                        console.log("服务器返回答案："+srhdaan);
                }else{
                        console.log("服务器返回答案："+srhdaan+"");
                }
            }}
     };
  function dotm(){
        var i = 1;
        $(".q_content").each(function(){
        var tm="";
        var da="";
        var xx ="";
        var bh = 1;
        bh = $(this).children().eq(0).children().eq(0).text().replace(/\s*/g,"");
        tm = $(this).children().eq(0).text().replace(/\s*/g,"").split("（5分）")[0].split(bh+"、")[1];
        //console.log("题目："+tm)
        var len = 0;
        var cxx = $(this).children().eq(1).children();
        len = cxx.length;
        for(var a = 0;a<len;a++){
                xx += $(this).children().eq(1).children().eq(a).children().eq(1).text().replace(/\s*/g,"")
                if($(this).children().eq(1).children().eq(a).children().eq(1)[0]!=undefined){
                if($(this).children().eq(1).children().eq(a).children().eq(1)[0].getAttribute("class")=="radio_on"||$(this).children().eq(1).children().eq(a).children().eq(1)[0].getAttribute("class")=="checkbox_on"){
                    var curda = $(this).children().eq(1).children().eq(a).children().eq(1).text().replace(/\s*/g,"");
                    if(curda.indexOf("A．")!=-1){
                         curda = curda.split("A．")[1];
                    }
                    if(curda.indexOf("B．")!=-1){
                         curda = curda.split("B．")[1];
                    }
                    if(curda.indexOf("C．")!=-1){
                         curda = curda.split("C．")[1];
                    }
                    if(curda.indexOf("D．")!=-1){
                         curda = curda.split("D．")[1];
                    }
                    if(curda.indexOf("E．")!=-1){
                         curda = curda.split("E．")[1];
                    }
                    if(curda.indexOf("F．")!=-1){
                         curda = curda.split("F．")[1];
                    }
                    if(da==""){
                        da = curda;
                    }else{
                       da = da + "#"+curda;
                    }
                }
                }
       }
        if(xx=="正确错误"){
            xx = "A.正确B.错误"
        }
        tm = tm + xx;
        console.log("网页题目："+tm);
        console.log("网页答案："+da);

        search(tm.replace(/\s*/g,""),da.replace(/\s*/g,""),cxx);

        i = i + 1;
        })
  }
  function looktm(){
       $(".q_content").each(function(){
           var bh = 1;
           var tm="";
           var da="";
           var xx=""
           var res=""
           bh = $(this).children().eq(0).children().eq(0).text().replace(/\s*/g,"");
           tm = $(this).children().eq(0).text().replace(/\s*/g,"").split("（5分）")[0].split(bh+"、")[1];
           var len = 0;
           var cxx = $(this).children().eq(1).children();
           len = cxx.length-1;
           da = $(this).children().eq(1).children().eq(len).children().eq(1).children().eq(1).text().split("参考答案：")[1].replace(/\s*/g,"")
           for(var d = 0;d<len;d++){
               xx += $(this).children().eq(1).children().eq(d).children().eq(0).text().replace(/\s*/g,"")
               var dalen = da.length;
               for(var e = 0;e<dalen;e++){
                   if($(this).children().eq(1).children().eq(d).children().eq(0).text().replace(/\s*/g,"").indexOf(da[e])!=-1&&$(this).children().eq(1).children().eq(d).children().eq(0).text().replace(/\s*/g,"").split("．")[0]==da[e]){
                      var resda = $(this).children().eq(1).children().eq(d).children().eq(0).text().replace(/\s*/g,"");
                       if(resda.indexOf("A．")!=-1){
                              resda = resda.split("A．")[1];
                       }
                       if(resda.indexOf("B．")!=-1){
                           resda = resda.split("B．")[1];
                       }
                       if(resda.indexOf("C．")!=-1){
                           resda = resda.split("C．")[1];
                       }
                       if(resda.indexOf("D．")!=-1){
                           resda = resda.split("D．")[1];
                       }
                       if(resda.indexOf("E．")!=-1){
                           resda = resda.split("E．")[1];
                       }
                       if(resda.indexOf("F．")!=-1){
                           resda = resda.split("F．")[1];
                       }
                       if(res==""){
                           res = resda;
                       }else{
                           res = res + "#"+ resda;
                       }
                   }
               }
           }
           if(xx=="正确错误"){
               xx = "A.正确B.错误"
               res = da
           }
           tm = tm + xx;
           console.log("网页题目："+tm);
           console.log("本题默认答案："+da)
           console.log("本题录入答案："+res)
           searches(tm.replace(/\s*/g,""),res.replace(/\s*/g,""));
       })
  }
  var coure = $(".tit").text();
  //console.log(coure);
  if(coure==""){
      console.log("当前位于答题界面！");
      setTimeout(function(){
        dotm();
        setTimeout(function(){
            //document.querySelector("#paperFooter > div > a.btn_mid_solid.btn_bordered.paging_next").click();
            if(document.querySelector("#paperFooter > div > a.btn_mid_solid.btn_bordered.paging_next").getAttribute("style")!="display: none;"){
                    document.querySelector("#paperFooter > div > a.btn_mid_solid.btn_bordered.paging_next").click();
            }
            setTimeout(function(){ dotm();},2000)
            setTimeout(function(){
                if(document.querySelector("#paperFooter > div > a.btn_mid_solid.btn_bordered.paging_next").getAttribute("style")!="display: none;"){
                    document.querySelector("#paperFooter > div > a.btn_mid_solid.btn_bordered.paging_next").click();
                }
                setTimeout(function(){
                    dotm();
                    setTimeout(function(){
                    $("#submitPaper").click();
                    document.querySelector("#submitConfirmWin > div > div.win_foot > a.win_btn1").click();
                    //$(".TB_command_btn").click();
                    setTimeout(function(){
                        $(".TB_command_btn").click();
                    },2500)
                },4500)
               },2500)
            },4500)
        },2500)
      },2500)
  }else{
      console.log("当前位于录题界面！");
      setTimeout(function(){
        looktm();
      },2000)
  }
}
webtrn();//document.querySelector("#submitPaper")
$(document).keydown(function(event){
      if(event.keyCode == 36){
           webtrn();
      }
  });
$(document).keydown(function(event){
      if(event.keyCode == 35){
           setTimeout(function(){
              $("#submitPaper").click();
               console.log("======================================================================>");
               document.querySelector("#submitConfirmWin > div > div.win_foot > a.win_btn1").click();
               console.log("=======================================================================>");
               console.log("=======================================================================>");
               //$(".TB_command_btn").click();
               setTimeout(function(){
                   $(".TB_command_btn").click();
               },3000)
           },3000)
      }
  });
})();