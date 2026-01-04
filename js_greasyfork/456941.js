// ==UserScript==
// @icon            http://passport.ouchn.cn/assets/images/logo.png
// @name            GK国开形考题测试
// @namespace       [url=mailto:1152673513@qq.com]1152673513@qq.com[/url]
// @author          沈华
// @description     GK国开形考题测试工具
// @match           *://*.ouchn.cn/*
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
// @downloadURL https://update.greasyfork.org/scripts/456941/GK%E5%9B%BD%E5%BC%80%E5%BD%A2%E8%80%83%E9%A2%98%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/456941/GK%E5%9B%BD%E5%BC%80%E5%BD%A2%E8%80%83%E9%A2%98%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==
(function () {
    'use strict';
    function addTM(question,answer){
        //var data = 'timu='+question+'&daan='+answer+'';
        //question = window.encodeURIComponent(question);若题目中出现+或者其他符号，会被替换成空格，要解决这个问题就加上这句代码
        answer = window.encodeURIComponent(answer);
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
                console.log("服务器返回录入结果："+addres);
            }else{
                // console.log("录入失败,请检查！");
            }
        }
    }
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
                    addTM(question,da)
                    //console.log("服务器返回答案："+srhdaan);
                }else{
                    console.log("服务器返回答案："+srhdaan+"");
                }
            }}
    };
    function dosearches(question,op){
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
                if(srhdaan.includes("题库未收录该题")){
                    console.log("服务器未收录该题，请前往录题界面录入该题！");
                }else{
                    console.log("服务器返回答案："+srhdaan+"");
                    op.each(function(){
                        if(srhdaan.indexOf("#")!=-1){
                            var len = srhdaan.split("#").length;
                            var dasp = srhdaan.split("#");
                            for(var i =0;i<len;i++){
                                  if($(this).children().children().eq(1).children().text().replace(/\s*/g,"")==dasp[i]){
                                          if($(this).children().children().eq(0).children().eq(0)[0].getAttribute("checked")!="checked"){
                                              $(this).children().children().eq(0).children().eq(0).click();
                                              $(this).children().children().eq(0).children().eq(0)[0].setAttribute("checked","checked");
                                          }
                                  }
                            }
                        }else{
                            if($(this).children().children().eq(1).children().text().replace(/\s*/g,"")==srhdaan){
                                if($(this).children().children().eq(0).children().eq(0)[0].getAttribute("checked")!="checked"){
                                    $(this).children().children().eq(0).children().eq(0).click();
                                    $(this).children().children().eq(0).children().eq(0)[0].setAttribute("checked","checked");
                                }
                            }
                        }
                    })
                }
            }}
    };
    function looktm(){
            $(".exam-subjects").children().children().each(function(){
                var ytm="";
                var xx="";
                var tm="";
                var zf="";
                var df="";
                ytm = $(this).children().children().eq(0).children().eq(0).children().eq(1).text().replace(/\s*/g,"");
                xx = $(this).children().children().eq(1).text().replace(/\s*/g,"");
                tm = ytm.split("．")[1] + xx;
                zf = ($(this).children().children().eq(0).children().eq(1).children().children().eq(1).children().eq(0).text()+$(this).children().children().eq(0).children().eq(1).children().children().eq(1).children().eq(1).text()).replace(/\s*/g,"")+"";
                df = $(this).children().children().eq(0).children().eq(1).children().children().eq(1).children().eq(2).text().replace(/\s*/g,"")+"";
                console.log("题目："+tm);
                console.log("选项："+xx);
                console.log("总分："+zf);
                console.log("得分："+df);
                if(zf==df){
                    var rda="";
                    $(this).children().children().eq(1).children().children().each(function(){
                        if($(this).children().children().eq(0).children().eq(0)[0].getAttribute("checked")=="checked"){
                            if(rda==""){
                                rda = $(this).children().children().eq(1).children().text().replace(/\s*/g,"");
                            }else{
                                rda = rda + "#"+ $(this).children().children().eq(1).children().text().replace(/\s*/g,"");
                            }
                        };
                    })
                    console.log("本题正确！");
                    console.log("正确答案为："+rda);
                    searches(tm,rda);
                }else{
                    console.log("本题错误！");
                }
            })
    }
    function dotm(){
            $(".exam-subjects").children().children().each(function(){
                var ytm="";
                var xx="";
                var tm="";
                var zf="";
                var df="";
                ytm = $(this).children().children().eq(0).children().eq(0).children().eq(1).text().replace(/\s*/g,"");
                xx = $(this).children().children().eq(1).text().replace(/\s*/g,"");
                tm = ytm.split("．")[1] + xx;
                console.log("题目："+tm);
                console.log("选项："+xx);
                var op = $(this).children().children().eq(1).children().children();
                dosearches(tm,op);
            })
    }
    setTimeout(function(){
     var lt = $("span.submit-label").text();
     var dt = $("a.full-screen-header-button").text();
        if(lt.indexOf("试卷得分")!=-1){
            setTimeout(function(){
                console.log("录题界面");
                looktm();
            },2000)
        }else if(dt.indexOf("交卷")!=-1){
            setTimeout(function(){
                console.log("答题界面");
                dotm();
            },2000)
        }
    },5000)
})();