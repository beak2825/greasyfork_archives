// ==UserScript==
// @name         正方教育系统自动完成教学质量评价（杭电可用）
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  自动完成教学质量评价
// @author       You
// @match        *://*.hdu.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425671/%E6%AD%A3%E6%96%B9%E6%95%99%E8%82%B2%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%AF%84%E4%BB%B7%EF%BC%88%E6%9D%AD%E7%94%B5%E5%8F%AF%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/425671/%E6%AD%A3%E6%96%B9%E6%95%99%E8%82%B2%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E5%AE%8C%E6%88%90%E6%95%99%E5%AD%A6%E8%B4%A8%E9%87%8F%E8%AF%84%E4%BB%B7%EF%BC%88%E6%9D%AD%E7%94%B5%E5%8F%AF%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==
(function() {
    var myEvaluate = {
    simpleMode: function(){
        /*****************
        默认使用第16行代码，如果浏览器报错，则应改为第17行代码
         *****************/
        document.querySelector("#iframeautoheight").sandbox = "allow-scripts allow-forms allow-pointer-lock allow-same-origin";
        //document.querySelector("#iframeautoheight").sandbox = "allow-scripts allow-forms allow-pointer-lock allow-same-origin allow-modals";
        var iframe = document.getElementsByTagName("iframe")[0];
        iframe.onload = function(){
            if(iframe.contentDocument.getElementsByTagName('select')[0].selectedIndex <= iframe.contentDocument
            .getElementsByTagName('select').length+2){
                myEvaluate.simpleMode();
            }
            else{
                console.log(myEvaluate.author);
                console.log(myEvaluate.website);
                console.log("输入myEvaluate.help以查看帮助");
                myEvaluate.simpleMode= function(){return false;}
            }
        }
        var x = document.getElementsByTagName("iframe")[0].contentDocument
        .getElementsByTagName('select');
        var btn = document.getElementsByTagName("iframe")[0].contentDocument
        .getElementById("Button1");
        var i = 0;
        var flag = 0;
        var option = ["A（非常满意）","B（满意）","C（基本满意）"]
        for(i = 1; i <= x.length-1; i++){
            if(Math.ceil(Math.random()*100) >= 15){
                x[i].value = option[0];
                flag++;
            }
            else{
                x[i].value = option[1];
            }
        }
        if(flag == 10){
            x[3].value = option[1];
        }
        if(flag == 0){
            myEvaluate.simpleMode();
        }
        btn.click();
    },
    angryMode: function(){
        var x = document.getElementsByTagName("iframe")[0].contentDocument
        .getElementsByTagName('select');
        var btn = document.getElementsByTagName("iframe")[0].contentDocument
        .getElementById("Button1");
        var i = 0;
        var flagA = 0,flagB = 0,flagC = 0;
        var option = ["A（非常满意）","B（满意）","C（基本满意）"]
        for(i = 1; i <= x.length-1; i++){
            var rand = Math.ceil(Math.random()*100);
            if(rand >= 99){
                x[i].value = option[0];
                flagA++;
            }
            else if(rand > 20 && rand < 99){
                x[i].value = option[1];
                flagB++;
            }
            else{
                x[i].value = option[2];
                flagC++;
            }
        }
        if(flagA == 10){
            x[3].value = option[1];
        }
        if(flagB == 10 || flagC == 10){
            this.angryMode();
        }
        btn.click();
    },
    customizeMode: function(a, b, c){
        /****************************************************************************
         自定义模式，格式:myEvaluate.customizeMode(A的几率， B的几率);100与AB的差就是C的概率
         例如要使A的几率为50 ， B为30， C为20 则myEvaluate.customizeMode(50， 30)
         *****************************************************************************/
        var x = document.getElementsByTagName("iframe")[0].contentDocument
        .getElementsByTagName('select');
        var btn = document.getElementsByTagName("iframe")[0].contentDocument
        .getElementById("Button1");
        var i = 0;
        var flagA = 0,flagB = 0,flagC = 0;
        var option = ["A（非常满意）","B（满意）","C（基本满意）"]
        for(i = 1; i <= x.length-1; i++){
            var rand = Math.ceil(Math.random()*100);
            if(rand >= 100-a){
                x[i].value = option[0];
            }
            else if(rand > 100-a-b && rand < 100-a){
                x[i].value = option[1];
            }
            else{
                x[i].value = option[2];
            }
        }
        if(flagA == 10){
            x[3].value = option[1];
        }
        if(flagB == 10 || flagC == 10){
            this.customizeMode(a, b, c);
        }
        btn.click();
    },
    author: "HDU-Nbsp",
    from: "HelloWorld - Web",
    website: "http://helloworld.hdu.edu.cn/",
    help: "使用步骤 -> 复制代码粘贴到控制台后，可以选择三种评分模式：普通评分模式（A - 15%， B - 85%）极端愤怒模式（A - 1%， B - 79%， C - 20%）以及自定义模式格式:myEvaluate.customizeMode(A的几率， B的几率);100与AB的差就是C的概率。例如要使A的几率为50 ， B为30， C为20 则myEvaluate.customizeMode(50， 30)，三种模式代码分别是myEvaluate.simpleMode();myEvalute.angryMode();myEvaluate.customizeMode(a, b, c);切换页面后再次粘贴任意模式代码即可。最后需要点击一下 提交 按钮.入myEvaluate.help即可查看帮助"
}
myEvaluate.simpleMode();
})();

