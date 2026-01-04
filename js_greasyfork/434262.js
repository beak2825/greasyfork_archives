// ==UserScript==
// @name         基金从业再教育2.0
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  真是个惊喜!
// @match        https://peixun.amac.org.cn/*
// @author       zhangxc0427
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434262/%E5%9F%BA%E9%87%91%E4%BB%8E%E4%B8%9A%E5%86%8D%E6%95%99%E8%82%B220.user.js
// @updateURL https://update.greasyfork.org/scripts/434262/%E5%9F%BA%E9%87%91%E4%BB%8E%E4%B8%9A%E5%86%8D%E6%95%99%E8%82%B220.meta.js
// ==/UserScript==

(function() {
    'use strict';
//////一键完成的div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var wcbutton,wctag;
    wcbutton = document.createElement("div");
    wctag = document.querySelector(".catalog-content.module");
    wctag.appendChild(wcbutton);
    wcbutton.id = "wcbtid";
    wcbutton.innerHTML = "一键完成本次视频";
    wcbutton.title = "还要啥子说明!";
    wcbutton.style = "position:relative;float:left;width:125px;height:60px;background:black;opacity:0.75;color:white;text-align:center;line-height:60px;cursor:pointer;";
//////解锁焦点的div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var jsbutton,jstag;
    jsbutton = document.createElement("div");
    jstag = document.querySelector(".catalog-content.module");
    jstag.appendChild(jsbutton);
    jsbutton.id = "jsbtid";
    jsbutton.innerHTML = "解锁视频焦点";
    jsbutton.title = "解锁后可以后台播放视频啦!";
    jsbutton.style = "margin-left:2px;float:left;width:100px;height:60px;background:black;opacity:0.75;color:white;text-align:center;line-height:60px;cursor:pointer;";
//////16X的div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var bsbutton,bstag;
    bsbutton = document.createElement("div");
    bstag = document.querySelector(".catalog-content.module");
    bstag.appendChild(bsbutton);
    bsbutton.id = "bsbtid";
    bsbutton.innerHTML = "16x速度";
    bsbutton.title = "速度飞起";
    bsbutton.style = "margin-left:2px;float:left;width:90px;height:60px;background:black;opacity:0.75;color:white;text-align:center;line-height:60px;cursor:pointer;";
//////还原的div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var hybutton,hytag;
    hybutton = document.createElement("div");
    hytag = document.querySelector(".catalog-content.module");
    hytag.appendChild(hybutton);
    hybutton.id = "hybtid";
    hybutton.innerHTML = "还原速度";
    hybutton.title = "快翻车了,休息一下";
    hybutton.style = "visibility:hidden";
//////还原的div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var dadiv,datag;
    dadiv = document.createElement("div");
    datag = document.querySelector(".test");
    datag.appendChild(dadiv);
    dadiv.id = "dadiv";
    dadiv.style = "margin-right:1px;margin-top:2px;width:400px;height:80px;background:White;opacity:0.75;color:Black;font-size:24px;text-align:left;line-height:60px;cursor:pointer;visibility:visible";
//////核心代码1------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    wcbutton.onclick = function(){
        $("body").attr('palyLast',document.getElementsByTagName('video')[0].duration);
        document.getElementsByTagName('video')[0].currentTime = document.getElementsByTagName('video')[0].duration;
        tiper("你果然深思熟虑！");
    };
   //////
    jsbutton.onclick = function(){
        window.onblur = function(){console.log('离开')};
        tiper("后台挂机去吧");
    };
   //////
    bsbutton.onclick = function(){
        document.getElementsByTagName('video')[0].playbackRate=16;
        hybutton.style =  "margin-right:1px;margin-top:2px;float:right;width:90px;height:60px;background:black;opacity:0.75;color:white;text-align:center;line-height:60px;cursor:pointer;visibility:visible";
        tiper("老司机上线");
    };
   //////
    hybutton.onclick = function(){
        document.getElementsByTagName('video')[0].playbackRate=1;
        hybutton.style = "visibility:hidden";
        tiper("慢慢看");
    };
//////核心代码2------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    setInterval(function(){
       function mapAnswer(answer){
         var str = document.querySelector('.xuanxiang').attributes.answer.nodeValue
             let answerArr = str.toString().split(',');
             let newArr = answerArr.map(item => {
                 return String.fromCharCode(64 + parseInt(item));
         })
        return newArr.join(',')
       }
        dadiv.innerHTML = "参考答案：" + mapAnswer()
    },100);
    // Your code here...
})();