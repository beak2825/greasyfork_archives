// ==UserScript==
// @name         基金从业再教育3.0
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  真是个惊喜!
// @match        https://peixun.amac.org.cn/*
// @author       zhangxc0427
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448754/%E5%9F%BA%E9%87%91%E4%BB%8E%E4%B8%9A%E5%86%8D%E6%95%99%E8%82%B230.user.js
// @updateURL https://update.greasyfork.org/scripts/448754/%E5%9F%BA%E9%87%91%E4%BB%8E%E4%B8%9A%E5%86%8D%E6%95%99%E8%82%B230.meta.js
// ==/UserScript==

(function() {
    'use strict';
//////按钮div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var hugebutton,hugetag;
    hugebutton = document.createElement("div");
    hugetag = document.querySelector(".cont-wrap");
    hugetag.appendChild(hugebutton);
    hugebutton.id = "hugebtid";
    hugebutton.style = "position:absolute;z-index:9999999;top:80%;right:10%;float:left;";
//////一键完成的div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var wcbutton,wctag;
    wcbutton = document.createElement("div");
    wctag = document.querySelector("#hugebtid");
    wctag.appendChild(wcbutton);
    wcbutton.id = "wcbtid";
    wcbutton.innerHTML = "一键完成本次视频";
    wcbutton.title = "还要啥子说明!";
    wcbutton.style = "margin-left:0px;z-index:9999999;float:left;width:125px;height:60px;background-color:white;border:2px solid red;border-radius:5px;opacity:0.75;color:rgb(233, 104, 107);text-align:center;line-height:60px;cursor:pointer;";
    $("#wcbtid").hover(function(){$("#wcbtid").css("background-color","rgb(233, 104, 107)");},function(){$("#wcbtid").css("background-color","white");});
    $("#wcbtid").hover(function(){$("#wcbtid").css("color","white");},function(){$("#wcbtid").css("color","rgb(233, 104, 107)");});

//////解锁焦点的div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var jsbutton,jstag;
    jsbutton = document.createElement("div");
    jstag = document.querySelector("#hugebtid");
    jstag.appendChild(jsbutton);
    jsbutton.id = "jsbtid";
    jsbutton.innerHTML = "解锁视频焦点";
    jsbutton.title = "解锁后可以后台播放视频啦!";
    jsbutton.style = "margin-left:2px;z-index:9999999;float:left;width:100px;height:60px;background-color:white;border:2px solid red;border-radius:5px;opacity:0.75;color:rgb(233, 104, 107);text-align:center;line-height:60px;cursor:pointer;";
    $("#jsbtid").hover(function(){$("#jsbtid").css("background-color","rgb(233, 104, 107)");},function(){$("#jsbtid").css("background-color","white");});
    $("#jsbtid").hover(function(){$("#jsbtid").css("color","white");},function(){$("#jsbtid").css("color","rgb(233, 104, 107)");});

//////16X的div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var bsbutton,bstag;
    bsbutton = document.createElement("div");
    bstag = document.querySelector("#hugebtid");
    bstag.appendChild(bsbutton);
    bsbutton.id = "bsbtid";
    bsbutton.innerHTML = "16x速度";
    bsbutton.title = "速度飞起";
    bsbutton.style = "margin-left:2px;z-index:9999999;float:left;width:90px;height:60px;background-color:white;border:2px solid red;border-radius:5px;opacity:0.75;color:rgb(233, 104, 107);text-align:center;line-height:60px;cursor:pointer;";
    $("#bsbtid").hover(function(){$("#bsbtid").css("background-color","rgb(233, 104, 107)");},function(){$("#bsbtid").css("background-color","white");});
    $("#bsbtid").hover(function(){$("#bsbtid").css("color","white");},function(){$("#bsbtid").css("color","rgb(233, 104, 107)");});

//////还原的div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var hybutton,hytag;
    hybutton = document.createElement("div");
    hytag = document.querySelector("#hugebtid");
    hytag.appendChild(hybutton);
    hybutton.id = "hybtid";
    hybutton.innerHTML = "还原速度";
    hybutton.title = "快翻车了,休息一下";
    hybutton.style = "display:none;";
    $("#hybtid").hover(function(){$("#hybtid").css("background-color","rgb(233, 104, 107)");},function(){$("#hybtid").css("background-color","white");});
    $("#hybtid").hover(function(){$("#hybtid").css("color","white");},function(){$("#hybtid").css("color","rgb(233, 104, 107)");});

//////答案的div------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    var dadiv,datag;
    dadiv = document.createElement("div");
    datag = document.querySelector(".test");
    datag.appendChild(dadiv);
    dadiv.id = "dadiv";
    dadiv.style = "margin-right:1px;margin-top:2px;z-index:999;width:400px;height:80px;background:White;opacity:0.75;color:Black;font-size:24px;text-align:left;line-height:60px;cursor:pointer;visibility:visible";
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
        hybutton.style = "margin-left:2px;z-index:9999999;float:left;width:90px;height:60px;background-color:white;border:2px solid red;border-radius:5px;opacity:0.75;color:rgb(233, 104, 107);text-align:center;line-height:60px;cursor:pointer;";
        bsbutton.style = "display:none;";
        tiper("老司机上线");
    };
   //////
    hybutton.onclick = function(){
        document.getElementsByTagName('video')[0].playbackRate=1;
        hybutton.style = "display:none;";
        bsbutton.style = "margin-left:2px;z-index:9999999;float:left;width:90px;height:60px;background-color:white;border:2px solid red;border-radius:5px;opacity:0.75;color:rgb(233, 104, 107);text-align:center;line-height:60px;cursor:pointer;";
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