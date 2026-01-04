// ==UserScript==
// @name         chhGreenStyle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  给基友论坛加上原谅套餐
// @author       mz-soft
// @match        http://*.chiphell.com/**
// @match        https://*.chiphell.com/**
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532008/chhGreenStyle.user.js
// @updateURL https://update.greasyfork.org/scripts/532008/chhGreenStyle.meta.js
// ==/UserScript==


function fuckGreen(){
//(function() {
    //https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js
    //https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
    // https://code.jquery.com/jquery-2.1.4.min.js
    'use strict';

        //初版原谅绿
        var colorTransMapGreen = [
        //几个不同的红色，后面设置了不同的绿色，可根据自己喜欢，自行调整颜色值。
          ["rgb(255, 0, 0)","rgb(0,255,0)"],
          ["rgb(153, 0, 0)", "rgb(0,153,0)"],
          ["rgb(166, 31, 36)", "rgb(31,166,36)"],
          ["rgb(169, 0, 0)", "rgb(0,200,0)"],
        ];



        //深一点的绿
        var colorTransMapGreen1 = [
            //几个不同的红色，后面设置了不同的绿色，可根据自己喜欢，自行调整颜色值。
            ["rgb(255, 0, 0)","rgb(0,189,0)"],
            ["rgb(153, 0, 0)", "rgb(0,55,0)"],
            ["rgb(166, 31, 36)", "rgb(31,100,36)"],
            ["rgb(169, 0, 0)", "rgb(0,120,0)"],
        ];

        //基佬紫
        var colorTransMapGay = [
            //几个不同的红色，后面设置了不同的绿色，可根据自己喜欢，自行调整颜色值。
            ["rgb(255, 0, 0)","rgb(189,0,189)"],
            ["rgb(153, 0, 0)", "rgb(55,0,55)"],
            ["rgb(166, 31, 36)", "rgb(100,31,100)"],
            ["rgb(169, 0, 0)", "rgb(120,0,120)"],
        ];

        //灰色
        var colorTransMapGray = [
            //几个不同的红色，后面设置了不同的绿色，可根据自己喜欢，自行调整颜色值。
            ["rgb(255, 0, 0)","rgb(192,192,192)"],
            ["rgb(153, 0, 0)", "rgb(55,55,55)"],
            ["rgb(166, 31, 36)", "rgb(100,100,100)"],
            ["rgb(169, 0, 0)", "rgb(120,120,120)"],
        ];

      //基于色盘旋转多少度 对应的颜色
      var green =" filter: hue-rotate(120deg);";
      var gay =" filter: hue-rotate(280deg);";
        var gray =" filter: grayscale(100%);";

    //可参考上面的格式自己改着玩。


     //主体色
     var colorTransMap = colorTransMapGray;
    //logo色
     var logoTrans = gray;




    document.querySelectorAll("*").forEach(function (e) {
      let s = getComputedStyle(e);
        colorTransMap.forEach(function (item){
        //标题背景红图
        e.style.background =
        s.background && s.background.replace("url(\"https://www.chiphell.com/static/image/common/nv.png\")", "");


        e.style.color =
        s.color && s.color.replace(item[0], item[1]);
        e.style.background =
        s.background && s.background.replace(item[0], item[1]);

        e.style.borderBottom =
        s.borderBottom && s.borderBottom.replace(item[0], item[1]);
        e.style.borderColor =
        s.borderColor && s.borderColor.replace(item[0], item[1]);
        e.style.borderBottomColor =
        s.borderBottomColor && s.borderBottomColor.replace(item[0], item[1]);

        e.style.borderLeft =
        s.borderLeft && s.borderLeft.replace(item[0], item[1]);

        e.setAttribute("style", e.getAttribute("style").replace(item[0], item[1]))
       });
    });
    //logo改色蒙版
document.querySelector("#boardlogo").setAttribute("style", document.querySelector("#boardlogo").getAttribute("style")+" "+ logoTrans)
    console.log("green")

    // Your code here...
//})();
}
      fuckGreen();
if (document.readyState === "loading") {
 window.requestAnimationFrame(fuckGreen());
        fuckGreen();
  // 此时加载尚未完成 原谅色
  window.onload = function () {
    fuckGreen();
  };
     window.onload = function () {
    fuckGreen();
  };
} else {
  // 页面加载已经完成
  fuckGreen();
}