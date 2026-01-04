// ==UserScript==
// @name         学习强国答题2
// @namespace    Ragvivsw.
// @version      5.01
// @description  自动答题，提取答案，填空题需要按空格键，再确定。希望高手解决提取答案后无法提交的问题，系统认为没有做答，所以要输入空格再提交。
// @author       Ragvivsw，Mike
// @match        https://pc.xuexi.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410959/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%AD%94%E9%A2%982.user.js
// @updateURL https://update.greasyfork.org/scripts/410959/%E5%AD%A6%E4%B9%A0%E5%BC%BA%E5%9B%BD%E7%AD%94%E9%A2%982.meta.js
// ==/UserScript==

//定义函数-页面加载
var loadFunc = function(func){
    if (document.addEventListener) {
        window.addEventListener("load", func, false);
    }
    else if (document.attachEvent) {
        window.attachEvent("onload", func);
    }
}
var dianjitishi = function(){

    let dianji = document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-footer > span")
    switch (dianji.className.length) {
        case 4:
            document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.question > div.q-footer > span").click();
            // alert("1");
    var daan1 = document.querySelector("#body-body > div > div > div.ant-popover > div.ant-popover-content >div.ant-popover-inner > div > div.ant-popover-inner-content > div.line-feed");
    var btnall = document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-header")
    btnall.style.width="400px";
    btnall.style.height="36px";
    btnall.style.marginRight="300px";
    btnall.style.border="medium double #0000FF";
        var daan1 = document.querySelector("#body-body > div > div > div.ant-popover > div.ant-popover-content >div.ant-popover-inner > div > div.ant-popover-inner-content > div.line-feed");
        daan1.style.display="none";
        var daan=daan1.children[0].innerText;
        var queding4 = document.querySelector("#app > div > div.layout-body > div > div.detail-body > div.action-row > button");
        if (btnall.innerText.substr(0,1)=="填"){   
        var kong = document.querySelector("#app > div > div.layout-body > div > div > div.question > div.q-body > div > input.blank");      
        kong.value=daan;  
        var daan2=daan1.children[1].innerText;
        if(daan2!="undefined"){
         var ns=kong.nextSibling;
          if (ns.innerText==""){
             ns.value=daan2;
          }else{
             var ns2=ns.nextSibling;
             ns2.value=daan2;
          }
         
        }
        queding4.style.height = "100px";
        queding4.style.width = "400px";
        queding4.style.marginRight = "400px";
         queding4.disabled=false;  
         queding4.click(); 
        }
        else if (btnall.innerText.substr(0,1)=="单"){
            var xuan=document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(1)");
            var xuan2=document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(2)");
            var xuan3=document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(3)");
            if(xuan.innerText.indexOf(daan) != -1){
              xuan.click();
            }
            else if(xuan2.innerText.indexOf(daan) != -1){
              xuan2.click();
            }else if(xuan3.innerText.indexOf(daan) != -1){
              xuan3.click();
            }else{
             document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(4)").click();
            }  
          queding4.style.height = "100px";
        queding4.style.width = "400px";
        queding4.style.marginRight = "400px";
         queding4.disabled=false; 
             queding4.click();
        }else{
 
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(1)").click();
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(2)").click();
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(3)").click();
        document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers > div:nth-child(4)").click();
             if(daan1.children.length==document.querySelector("#app > div > div > div > div.detail-body > div.question > div.q-answers").children.length){
            queding4.click();}
          }      
    }
}
//移除顶部
var dingbu = document.querySelector("#app > div > div.layout-header")
if (dingbu != null){
    dingbu.parentNode.removeChild(dingbu);
}
//移除底部
var dibu = document.querySelector("#app > div > div.layout-footer")
if (dibu != null){
    dibu.parentNode.removeChild(dibu);
}
//点击提示-重复执行
setInterval(dianjitishi,1000);