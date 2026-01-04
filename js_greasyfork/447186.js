// ==UserScript==
// @name         CNZXDZY
// @namespace    http://tampermonkey.net/
// @version          1.1.9
// @description  cnzxdzytools
// @author       shenhua
// @match      *://*.cnzx.info/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @require      http://cdn.bootcss.com/jquery/1.8.3/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447186/CNZXDZY.user.js
// @updateURL https://update.greasyfork.org/scripts/447186/CNZXDZY.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if($("#txtPassword")){
        $("#txtUserName").val("");//账号
        $("#txtPassword").val("");//密码
        if($("#txtPassword").val()!=""){
            $("#btnLogin").click();
        }
    }
    if($(".submit")&&$(".submit").text()=="开始考试"){
        setTimeout(function(){
            $(".submit").click();
        },3000)
    }
    var model = "默认模式";
    var dear;
    var page = $("#BiaoTi").text();
    if(page.indexOf("练习题")!=-1){
        cnlx();
    }else{
        cnzx(model);
    }
    setTimeout(function(){
        cnzx("精确模式");//submit bg-exam_0601     bg-exam_0602 submit
    },3000)
    $(document).keydown(function (event) {
        if (event.keyCode == 36) {
            model = "精确模式";
            cnzx(model);
            clearInterval(dear);
        }
    });
    var next=true;
    $(document).keydown(function (event) {
        if (event.keyCode == 35) {
            next = false;
        }
    });
    dear = setInterval(function(){
        if($("button[class='submit']").attr("class")=="submit bg-exam_0601"){
            clearInterval(dear);
        }else if(next){
            $("#form1 > div.paper_body > div.pages > div > div > ul > li.paginationjs-next.J-paginationjs-next").click();
        }
    },150000)
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
    function cnzx(model){
        var tmoff="";
        $(".question").each(function(){
            var enSu = false;
            var testTm;
            var isydlj = false;
            var iswxtk = false;
            var currentResult;
            var currentChildResult;
            currentResult = $(this).children(".analysis").children(".result").children(".chioce").text();
            $(this).children(".wenti").children("ul").children("li").each(function(){
                currentChildResult = $(this).children(".wenti").children(".analysis").children(".result").children(".chioce").text();
                if(currentChildResult&&currentChildResult!=""){
                    for(var cur=0;cur<currentChildResult.length;cur++){
                        if(currentChildResult[cur]=="A"){
                            if($(this).children(".wenti").children(".answer").children("li").eq(0).children('label').children('input').prop("checked")){
                                console.log("已经选择:A");
                            }else{
                                $(this).children(".wenti").children(".answer").children("li").eq(0).children('label').children('input').attr("checked","checked");
                            }
                        }else if(currentChildResult[cur]=="B"){
                            if($(this).children(".wenti").children(".answer").children("li").eq(1).children('label').children('input').prop("checked")){
                                console.log("已经选择:B");
                            }else{
                                $(this).children(".wenti").children(".answer").children("li").eq(1).children('label').children('input').attr("checked","checked");
                            }
                        }else if(currentChildResult[cur]=="C"){
                            if($(this).children(".wenti").children(".answer").children("li").eq(2).children('label').children('input').prop("checked")){
                                console.log("已经选择:C");
                            }else{
                                $(this).children(".wenti").children(".answer").children("li").eq(2).children('label').children('input').attr("checked","checked");
                            }
                        }else if(currentChildResult[cur]=="D"){
                            if($(this).children(".wenti").children(".answer").children("li").eq(3).children('label').children('input').prop("checked")){
                                console.log("已经选择:D");
                            }else{
                                $(this).children(".wenti").children(".answer").children("li").eq(3).children('label').children('input').attr("checked","checked");
                            }
                        }else if(currentChildResult[cur]=="E"){
                            if($(this).children(".wenti").children(".answer").children("li").eq(4).children('label').children('input').prop("checked")){
                                console.log("已经选择:E");
                            }else{
                                $(this).children(".wenti").children(".answer").children("li").eq(4).children('label').children('input').attr("checked","checked");
                            }
                        }else if(currentChildResult[cur]=="F"){
                            if($(this).children(".wenti").children(".answer").children("li").eq(5).children('label').children('input').prop("checked")){
                                console.log("已经选择:F");
                            }else{
                                $(this).children(".wenti").children(".answer").children("li").eq(5).children('label').children('input').attr("checked","checked");
                            }
                        }else if(currentChildResult[cur]=="G"){
                            if($(this).children(".wenti").children(".answer").children("li").eq(6).children('label').children('input').prop("checked")){
                                console.log("已经选择:G");
                            }else{
                                $(this).children(".wenti").children(".answer").children("li").eq(6).children('label').children('input').attr("checked","checked");
                            }
                        }else if(currentChildResult[cur]=="H"){
                            if($(this).children(".wenti").children(".answer").children("li").eq(7).children('label').children('input').prop("checked")){
                                console.log("已经选择:H");
                            }else{
                                $(this).children(".wenti").children(".answer").children("li").eq(7).children('label').children('input').attr("checked","checked");
                            }
                        }

                    }
                }
            })
            if(currentResult&&currentResult!=""){
                for(var cur=0;cur<currentResult.length;cur++){
                    if(currentResult[cur]=="A"){
                        if($(this).children(".wenti").children(".answer").children("li").eq(0).children('label').children('input').prop("checked")){
                            console.log("已经选择:A");
                        }else{
                            $(this).children(".wenti").children(".answer").children("li").eq(0).children('label').children('input').attr("checked","checked");
                        }
                    }else if(currentResult[cur]=="B"){
                        if($(this).children(".wenti").children(".answer").children("li").eq(1).children('label').children('input').prop("checked")){
                            console.log("已经选择:B");
                        }else{
                            $(this).children(".wenti").children(".answer").children("li").eq(1).children('label').children('input').attr("checked","checked");
                        }
                    }else if(currentResult[cur]=="C"){
                        if($(this).children(".wenti").children(".answer").children("li").eq(2).children('label').children('input').prop("checked")){
                            console.log("已经选择:C");
                        }else{
                            $(this).children(".wenti").children(".answer").children("li").eq(2).children('label').children('input').attr("checked","checked");
                        }
                    }else if(currentResult[cur]=="D"){
                        if($(this).children(".wenti").children(".answer").children("li").eq(3).children('label').children('input').prop("checked")){
                            console.log("已经选择:D");
                        }else{
                            $(this).children(".wenti").children(".answer").children("li").eq(3).children('label').children('input').attr("checked","checked");
                        }
                    }else if(currentResult[cur]=="E"){
                        if($(this).children(".wenti").children(".answer").children("li").eq(4).children('label').children('input').prop("checked")){
                            console.log("已经选择:E");
                        }else{
                            $(this).children(".wenti").children(".answer").children("li").eq(4).children('label').children('input').attr("checked","checked");
                        }
                    }else if(currentResult[cur]=="F"){
                        if($(this).children(".wenti").children(".answer").children("li").eq(5).children('label').children('input').prop("checked")){
                            console.log("已经选择:F");
                        }else{
                            $(this).children(".wenti").children(".answer").children("li").eq(5).children('label').children('input').attr("checked","checked");
                        }
                    }else if(currentResult[cur]=="G"){
                        if($(this).children(".wenti").children(".answer").children("li").eq(6).children('label').children('input').prop("checked")){
                            console.log("已经选择:G");
                        }else{
                            $(this).children(".wenti").children(".answer").children("li").eq(6).children('label').children('input').attr("checked","checked");
                        }
                    }else if(currentResult[cur]=="H"){
                        if($(this).children(".wenti").children(".answer").children("li").eq(7).children('label').children('input').prop("checked")){
                            console.log("已经选择:H");
                        }else{
                            $(this).children(".wenti").children(".answer").children("li").eq(7).children('label').children('input').attr("checked","checked");
                        }
                    }

                }
            }
            var tmstr = $(this).children('.wenti').children('.stem').text();
            if(/.*[\u4e00-\u9fa5]+.*$/.test(tmstr.replace("一","").replace("_","").substring(1,25))) {
                enSu = true;
                console.log("当前随机题目中含有中文非全英文");
            }
            var op="";
            var ops;
            var jdt;
            if(enSu){
                if(tmstr==""){
                    $(this).children('.wenti').children('p').each(function(){
                        if($(this).text()!=""&&$(this).text().replace(/\s*/g,"")!="—."){
                            tmstr = tmstr + $(this).text().replace(/\s*/g,"");
                        }
                    })
                }
                tmstr = tmstr.replace(/\s*/g,"")
                ops = $(this).children('.wenti').children('.answer');
                jdt = $(this).children('.wenti').children('label').children('.DaAn');
                ops.children('li').each(function(i){
                    if(i==0){
                        op = op +"A."+ $(this).text().replace(/\s*/g,"");
                    }else if(i==1){
                        op = op +"B."+ $(this).text().replace(/\s*/g,"");
                    }else if(i==2){
                        op = op +"C."+ $(this).text().replace(/\s*/g,"");
                    }else if(i==3){
                        op = op +"D."+ $(this).text().replace(/\s*/g,"");
                    }else if(i==4){
                        op = op +"E."+ $(this).text().replace(/\s*/g,"");
                    }else if(i==5){
                        op = op +"F."+ $(this).text().replace(/\s*/g,"");
                    }else if(i==6){
                        op = op +"G."+ $(this).text().replace(/\s*/g,"");
                    }else if(i==7){
                        op = op +"H."+ $(this).text().replace(/\s*/g,"");
                    }
                })
                tmstr = tmstr.replace(/\s*/g,"") + op.replace(/\s*/g,"")
                console.log("网页题目："+tmstr);


            }else{///////////////阅读理解
                var typesu = $(".question_head").text().indexOf("阅读理解");
                var iswxtkdo = $(".question_head").text().indexOf("完型填空");
                if(typesu!=-1){
                    iswxtk = true;
                }
                if(typesu!=-1){
                    if(tmstr==""){
                        $(this).children('.wenti').children('p').each(function(){
                            if($(this).text()!=""&&$(this).text().replace(/\s*/g,"")!="—."){
                                tmstr = tmstr + $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                            }
                        })
                    }
                }else {
                    if(tmstr==""){
                        $(this).children('.wenti').children('p').each(function(){
                            if($(this).text()!=""&&$(this).text().replace(/\s*/g,"")!="—."){
                                tmstr = tmstr + $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                            }
                        })
                    }
                }

                if(iswxtkdo!=-1&&tmstr.length>100){
                    tmoff = tmstr;
                }
                tmstr = tmoff + tmstr.replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '')

                ops = $(this).children('.wenti').children('.answer');
                jdt = $(this).children('.wenti').children('label').children('.DaAn');
                ops.children('li').each(function(i){

                    if(i==0){
                        op = op +"A."+ $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                    }else if(i==1){
                        op = op +"B."+ $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                    }else if(i==2){
                        op = op +"C."+ $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                    }else if(i==3){
                        op = op +"D."+ $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                    }else if(i==4){
                        op = op +"E."+ $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                    }else if(i==5){
                        op = op +"F."+ $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                    }else if(i==6){
                        op = op +"G."+ $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                    }else if(i==7){
                        op = op +"H."+ $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                    }

                })
                //录题打开，做题关闭
                tmstr = tmstr.replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '')+ op.replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '')
                console.log("网页题目："+tmstr);
            }

            //console.log("网页选项："+op);
            function search(tmstr,ops,jdt,enSu,isydlj,prfu){//prfu表示答题模式，pr表示精确模式：需要按Home键盘，fu表示模糊模式，不需要按任何键，默认执行
                var srhtimu;
                var srhdaan;
                var tmstrchoose;
                if(prfu=="精确模式"){
                    tmstrchoose = tmstr;
                }else{
                    tmstrchoose = tmstr.split("A.")[0];
                }
                //tmstr = window.encodeURIComponent(tmstr);
                var httpRequest = new XMLHttpRequest();//第一步：创建需要的对象
                httpRequest.open('POST','https://byg.shen668.cn/wkapisql.php', true); //第二步：打开连接
                httpRequest.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=utf-8");//设置请求头 注：post方式必须设置请求头（在建立连接后设置请求头）
                httpRequest.send("tm="+tmstrchoose);
                //httpRequest.send("tm="+tmstr.split("A.")[0]);
                //发送请求 将情头体写在send中 //录题：tmstr 做题：tmstr.split("A.")[0]
                //console.log("重定向"+tmstr)
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
                        var das;
                        var da;
                        var daslen;
                        var checked;
                        var datype;
                        if(srhdaan.indexOf("题库未收录该题")!==-1){
                            console.log("当前题库未收录该题,请选择正确答案后按HOME键录入！")

                            if(enSu){

                                ops.children('li').each(function(i){
                                    checked = $(this).children('label').children('input').prop("checked")
                                    if(checked){
                                        if(das==undefined){
                                            das = $(this).text().replace(/\s*/g,"");
                                        }else{
                                            das = das + "#" + $(this).text().replace(/\s*/g,"");
                                        }
                                    }
                                })
                                if(das==undefined){
                                    console.log("未选择答案或识别答题结果失败请检查！");
                                }else{
                                    console.log("待录入题目："+ tmstr+"\n待录入答案："+ das);
                                    addTM(tmstr,das);
                                }
                            }else{
                                ops.children('li').each(function(i){
                                    checked = $(this).children('label').children('input').prop("checked")
                                    if(checked){
                                        if(das==undefined){
                                            das = $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                                        }else{
                                            das = das + "#" + $(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '');
                                        }
                                    }
                                })
                                if(das==undefined){
                                    console.log("未选择答案或识别答题结果失败请检查！");
                                }else{
                                    console.log("待录入题目："+ tmstr+"\n待录入答案："+ das);
                                    if(iswxtk){
                                        //console.log("暂时不支持完形填空！");
                                        addTM(tmstr,das);
                                    }else{
                                        addTM(tmstr,das);
                                    }
                                }
                            }

                        }else{
                            if(!enSu){
                                if(srhdaan.indexOf("#")!=-1){
                                    das = srhdaan.split("#");
                                    datype = true;
                                }else{
                                    das = srhdaan;
                                    datype = false;
                                    if(jdt.text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '')==""){
                                        if($(".question_head").text().indexOf("主观题")!=-1&&!enSu){
                                            jdt.text(srhdaan.replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, ''));
                                        }else{
                                            jdt.text(srhdaan.replace(/\s*/g,""));
                                        }
                                        console.log("为您的题目："+srhtimu+"\n填入了正确的答案："+srhdaan);
                                        ops.children('li').each(function(){
                                            checked = $(this).children('label').children('input').prop("checked");
                                            if($(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '')== srhdaan){
                                                if(checked){
                                                    console.log("您已经选择了正确的答案！");
                                                }else{
                                                    $(this).children('label').children('input').click();
                                                    console.log("为您的题目："+srhtimu+"\n填入了正确的答案："+srhdaan);
                                                }
                                            }
                                        })
                                    }else if(jdt.text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '')==srhdaan.replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '')){
                                        console.log("您已经填入了正确的答案！");
                                    }
                                }

                                ops.children('li').each(function(){
                                    checked = $(this).children('label').children('input').prop("checked");
                                    if(datype){
                                        for(var d =0;d<das.length;d++){
                                            if($(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '') == das[d]){
                                                if(checked){
                                                    console.log("您已经选择了正确的答案！");
                                                }else{
                                                    $(this).children('label').children('input').click();
                                                    console.log("为您的题目："+srhtimu+"\n选择了正确的答案之一："+das[d]);
                                                }
                                            }
                                        }
                                    }else{
                                        if($(this).text().replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, '') == das){
                                            if(checked){
                                                console.log("您已经选择了正确的答案！");
                                            }else{
                                                $(this).children('label').children('input').click();
                                                console.log("为您的题目："+srhtimu+"\n选择了正确的答案："+das);
                                            }
                                        }
                                    }

                                })
                            }else{

                                if(srhdaan.indexOf("#")!=-1){
                                    das = srhdaan.split("#");
                                    datype = true;
                                }else{
                                    das = srhdaan;
                                    datype = false;
                                    if(jdt.text().replace(/\s*/g,"")==""){
                                        if($(".question_head").text().indexOf("主观题")!=-1&&!enSu){
                                            jdt.text(srhdaan.replace(/(^\s*)|(\s*$)/g, "").replace(/'/g, ''));
                                        }else{
                                            jdt.text(srhdaan.replace(/\s*/g,""));
                                        }
                                        console.log("为您的题目："+srhtimu+"\n填入了正确的答案："+srhdaan);
                                    }else if(jdt.text().replace(/\s*/g,"")==srhdaan.replace(/\s*/g,"")){
                                        console.log("您已经填入了正确的答案！");
                                    }
                                }

                                ops.children('li').each(function(){
                                    checked = $(this).children('label').children('input').prop("checked");
                                    if(datype){
                                        for(var d =0;d<das.length;d++){
                                            if($(this).text().replace(/\s*/g,"") == das[d].replace(/\s*/g,"")){
                                                if(checked){
                                                    console.log("您已经选择了正确的答案！");
                                                }else{
                                                    $(this).children('label').children('input').click();
                                                    console.log("为您的题目："+srhtimu+"\n选择了正确的答案之一："+das[d]);
                                                }
                                            }
                                        }

                                    }else{
                                        if($(this).text().replace(/\s*/g,"") == das.replace(/\s*/g,"")){
                                            if(checked){
                                                console.log("您已经选择了正确的答案！");
                                            }else{
                                                $(this).children('label').children('input').click();
                                                console.log("为您的题目："+srhtimu+"\n选择了正确的答案："+das);
                                            }
                                        }
                                    }

                                })
                            }


                        }
                    }
                }
            }
            search(tmstr,ops,jdt,enSu,iswxtk,model);
        })
    }
    function cnlx(){
        var i = 1;
        $(".ShiTiMiaoShu").each(function(){
            var tm = $(this).text().split(""+i+".")[1].replace(/^\s+|\s+$/g,'');
            var da = "";
            var xx = "";

            $(this).next().children().eq(0).children().each(function(){
                var xxx = $(this).text();
                var xxs = $(this).text();
                if(xxx.indexOf("A.")!=-1){
                    xxx = xxx.split("A.")[1].replace(/^\s+|\s+$/g,'');
                    xxs = "A."+xxs.split("A.")[1].replace(/^\s+|\s+$/g,'');
                }
                if(xxx.indexOf("B.")!=-1){
                    xxx = xxx.split("B.")[1].replace(/^\s+|\s+$/g,'');
                    xxs = "B."+xxs.split("B.")[1].replace(/^\s+|\s+$/g,'');
                }
                if(xxx.indexOf("C.")!=-1){
                    xxx = xxx.split("C.")[1].replace(/^\s+|\s+$/g,'');
                    xxs = "C."+xxs.split("C.")[1].replace(/^\s+|\s+$/g,'');
                }
                if(xxx.indexOf("D.")!=-1){
                    xxx = xxx.split("D.")[1].replace(/^\s+|\s+$/g,'');
                    xxs = "D."+xxs.split("D.")[1].replace(/^\s+|\s+$/g,'');
                }
                if(xxx.indexOf("E.")!=-1){
                    xxx = xxx.split("E.")[1].replace(/^\s+|\s+$/g,'');
                    xxs = "E."+xxs.split("E.")[1].replace(/^\s+|\s+$/g,'');
                }
                if(xxx.indexOf("F.")!=-1){
                    xxx = xxx.split("F.")[1].replace(/^\s+|\s+$/g,'');
                    xxs = "F."+xxs.split("F.")[1].replace(/^\s+|\s+$/g,'');
                }
                xx += xxs;
                if($(this).attr("daan")=="hide"){
                    if(da == ""){
                        da = xxx;
                    }else{
                        da = da +"#"+ xxx;
                    }
                }
            })
            //console.log("tm:"+tm)
            //console.log("xx:"+xx)
            //console.log("da:"+da)
           //************************************
            var isEnglise = false;//是否为英语题,默认不是
           //************************************
            if(isEnglise){
                tm = tm + xx;//去除两端空格版
            }else{
                tm = tm.replace(/\s+/g,'') + xx.replace(/\s+/g,'');//去除所有空格版
                da = da.replace(/\s+/g,'');
            }
            console.log("网页题目："+tm)
            console.log("网页答案："+da)
            searches(tm,da);
            i = i + 1;

        })
    }
})();