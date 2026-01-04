// ==UserScript==
// @name         SFDXKS
// @namespace    http://tampermonkey.net/
// @version      1.3.6
// @description  THIS IS A SFDXK TOOLS!
// @author       SH
// @match        *://*.chaoxing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456062/SFDXKS.user.js
// @updateURL https://update.greasyfork.org/scripts/456062/SFDXKS.meta.js
// ==/UserScript==

(function() {
    'use strict';
function sfdxks(){
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
    }
  function search(question,da,yxx,ytm){
        question = window.encodeURIComponent(question);
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','https://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("tm="+ytm);//发送请求 将情头体写在send中
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
                        var len1 = yxx.length;
                        for(var b= 0;b<len1;b++){
                              var cxx = yxx.eq(b).text().replace(/(^\s*)|(\s*$)/g, "").replace(/[\r\n]/g,"");
                                if(cxx.indexOf("A            ")!=-1){
                                    cxx = cxx.split("A            ")[1];
                                }else if(cxx.indexOf("A        ")!=-1){
                                    cxx = cxx.split("A        ")[1];
                                }
                                if(cxx.indexOf("B            ")!=-1){
                                    cxx = cxx.split("B            ")[1];
                                }else if(cxx.indexOf("B        ")!=-1){
                                    cxx = cxx.split("B        ")[1];
                                }
                                if(cxx.indexOf("C            ")!=-1){
                                    cxx = cxx.split("C            ")[1];
                                }
                                if(cxx.indexOf("D            ")!=-1){
                                    cxx = cxx.split("D            ")[1];
                                }
                                if(cxx.indexOf("E            ")!=-1){
                                    cxx = cxx.split("E            ")[1];
                                }
                                if(cxx.indexOf("F            ")!=-1){
                                    cxx = cxx.split("F            ")[1];
                                }
                                if(srhdaan.indexOf("#")!=-1){
                                    var len2 = srhdaan.split("#").length;
                                    for(var c=0;c<len2;c++){
                                        if(srhdaan.split("#")[c]==cxx){
                                            if(yxx.eq(b).children().eq(0)[0].getAttribute("class").indexOf("check_answer")!=-1){
                                                console.log("已经选了");
                                            }else{
                                                yxx.eq(b).click();  
                                            }
                                        }
                                    }
                                }else{
                                        if(cxx==srhdaan){
                                            if(yxx.eq(b).children().eq(0)[0].getAttribute("class").indexOf("check_answer")!=-1){
                                                console.log("已经选了");
                                            }else{
                                                yxx.eq(b).click();  
                                            }
                                        }
                                }
                        }

                }

            }}
     }

    setTimeout(function(){
        $(".singleQuesId").each(function(){
            var tm =  $(this).children().eq(0).children().eq(1).text().replace(/(^\s*)|(\s*$)/g, "").replace(/[\r\n]/g,"")
            var yxx = $(this).children().eq(1).children().eq(5).children()
            var xx = "";
            var res = "";
            var ytm = "";
            var len = yxx.length
            //目：公文的格式具有固定性、稳定性、规范性的要求。()A        对B        错答案：A        对
            for(var a = 0;a<len;a++){
                 var cxx = yxx.eq(a).text().replace(/(^\s*)|(\s*$)/g, "").replace(/[\r\n]/g,"");
                    if(cxx.indexOf("A            ")!=-1){
                         cxx = "A."+cxx.split("A            ")[1];
                    }else if(cxx.indexOf("A        ")!=-1){
                         cxx = "A."+cxx.split("A        ")[1];
                    }
                    if(cxx.indexOf("B            ")!=-1){
                         cxx = "B."+cxx.split("B            ")[1];
                    }else if(cxx.indexOf("B        ")!=-1){
                         cxx = "B."+cxx.split("B        ")[1];
                    }
                    if(cxx.indexOf("C            ")!=-1){
                         cxx = "C."+cxx.split("C            ")[1];
                    }
                    if(cxx.indexOf("D            ")!=-1){
                         cxx = "D."+cxx.split("D            ")[1];
                    }
                    if(cxx.indexOf("E            ")!=-1){
                         cxx = "E."+cxx.split("E            ")[1];
                    }
                    if(cxx.indexOf("F            ")!=-1){
                         cxx = "F."+cxx.split("F            ")[1];
                    }
                 xx +=  cxx;
                 if(yxx.eq(a).children().eq(0)[0].getAttribute("class").indexOf("check_answer")!=-1){
                         if(cxx.indexOf("A.")!=-1){
                                cxx = cxx.split("A.")[1];
                            }
                            if(cxx.indexOf("B.")!=-1){
                                cxx = cxx.split("B.")[1];
                            }
                            if(cxx.indexOf("C.")!=-1){
                                cxx = cxx.split("C.")[1];
                            }
                            if(cxx.indexOf("D.")!=-1){
                                cxx = cxx.split("D.")[1];
                            }
                            if(cxx.indexOf("E.")!=-1){
                                cxx = cxx.split("E.")[1];
                            }
                            if(cxx.indexOf("F.")!=-1){
                                cxx = cxx.split("F.")[1];
                            }
                         if(res==""){
                             res = cxx;
                         }else{
                             res = res+"#"+ cxx;
                         }
                 }
                 
            }
            console.log("题目"+tm)
            ytm = tm;
            tm = tm + xx;
            //alert("题目："+tm+"答案："+res);
            search(tm,res,yxx,ytm);
            })
        },3000)

    }

function sfdxkses(){
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
    }
  function searches(question,da,yxx){
        question = window.encodeURIComponent(question);
        var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
        httpRequest.open('POST','https://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
        httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
        httpRequest.send("tm="+da);//发送请求 将情头体写在send中
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
                        var len1 = yxx.length;
                        for(var b= 0;b<len1;b++){
                              var cxx = yxx.eq(b).text().replace(/(^\s*)|(\s*$)/g, "").replace(/[\r\n]/g,"");
                                if(cxx.indexOf("A            ")!=-1){
                                    cxx = cxx.split("A            ")[1];
                                }else if(cxx.indexOf("A        ")!=-1){
                                    cxx = cxx.split("A        ")[1];
                                }
                                if(cxx.indexOf("B            ")!=-1){
                                    cxx = cxx.split("B            ")[1];
                                }else if(cxx.indexOf("B        ")!=-1){
                                    cxx = cxx.split("B        ")[1];
                                }
                                if(cxx.indexOf("C            ")!=-1){
                                    cxx = cxx.split("C            ")[1];
                                }
                                if(cxx.indexOf("D            ")!=-1){
                                    cxx = cxx.split("D            ")[1];
                                }
                                if(cxx.indexOf("E            ")!=-1){
                                    cxx = cxx.split("E            ")[1];
                                }
                                if(cxx.indexOf("F            ")!=-1){
                                    cxx = cxx.split("F            ")[1];
                                }
                                if(srhdaan.indexOf("#")!=-1){
                                    var len2 = srhdaan.split("#").length;
                                    for(var c=0;c<len2;c++){
                                        if(srhdaan.split("#")[c]==cxx){
                                            if(yxx.eq(b).children().eq(0)[0].getAttribute("class").indexOf("check_answer")!=-1){
                                                console.log("已经选了");
                                            }else{
                                                yxx.eq(b).click();  
                                            }
                                        }
                                    }
                                }else{
                                        if(cxx==srhdaan){
                                            if(yxx.eq(b).children().eq(0)[0].getAttribute("class").indexOf("check_answer")!=-1){
                                                console.log("已经选了");
                                            }else{
                                                yxx.eq(b).click();  
                                            }
                                        }
                                }
                        }

                }

            }}
     }

    setTimeout(function(){
        $(".singleQuesId").each(function(){
            var tm =  $(this).children().eq(0).children().eq(1).text().replace(/(^\s*)|(\s*$)/g, "").replace(/[\r\n]/g,"")
            var yxx = $(this).children().eq(1).children().eq(5).children()
            var xx = "";
            var res = "";
            var len = yxx.length
            //目：公文的格式具有固定性、稳定性、规范性的要求。()A        对B        错答案：A        对
            for(var a = 0;a<len;a++){
                 var cxx = yxx.eq(a).text().replace(/(^\s*)|(\s*$)/g, "").replace(/[\r\n]/g,"");
                    if(cxx.indexOf("A            ")!=-1){
                         cxx = "A."+cxx.split("A            ")[1];
                    }else if(cxx.indexOf("A        ")!=-1){
                         cxx = "A."+cxx.split("A        ")[1];
                    }
                    if(cxx.indexOf("B            ")!=-1){
                         cxx = "B."+cxx.split("B            ")[1];
                    }else if(cxx.indexOf("B        ")!=-1){
                         cxx = "B."+cxx.split("B        ")[1];
                    }
                    if(cxx.indexOf("C            ")!=-1){
                         cxx = "C."+cxx.split("C            ")[1];
                    }
                    if(cxx.indexOf("D            ")!=-1){
                         cxx = "D."+cxx.split("D            ")[1];
                    }
                    if(cxx.indexOf("E            ")!=-1){
                         cxx = "E."+cxx.split("E            ")[1];
                    }
                    if(cxx.indexOf("F            ")!=-1){
                         cxx = "F."+cxx.split("F            ")[1];
                    }
                 xx +=  cxx;
                 if(yxx.eq(a).children().eq(0)[0].getAttribute("class").indexOf("check_answer")!=-1){
                         if(cxx.indexOf("A.")!=-1){
                                cxx = cxx.split("A.")[1];
                            }
                            if(cxx.indexOf("B.")!=-1){
                                cxx = cxx.split("B.")[1];
                            }
                            if(cxx.indexOf("C.")!=-1){
                                cxx = cxx.split("C.")[1];
                            }
                            if(cxx.indexOf("D.")!=-1){
                                cxx = cxx.split("D.")[1];
                            }
                            if(cxx.indexOf("E.")!=-1){
                                cxx = cxx.split("E.")[1];
                            }
                            if(cxx.indexOf("F.")!=-1){
                                cxx = cxx.split("F.")[1];
                            }
                         if(res==""){
                             res = cxx;
                         }else{
                             res = res+"#"+ cxx;
                         }
                 }
                 
            }
            console.log("题目"+tm)
            tm = tm + xx;
            //alert("题目："+tm+"答案："+res);
            searches(tm,res,yxx);
            })
        },3000)

    }
    sfdxks();//默认模糊模式
    //sfdxkses();//精确模式模式
setTimeout(function(){
    sfdxkses();
},6000)
})();