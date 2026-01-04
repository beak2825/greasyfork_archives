// ==UserScript==
// @name         文库签到比较懒
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在 必应添加按钮 实现稍微懒惰地签到 https://wenku.baidu.com/task/browse/daily 需要安装https://greasyfork.org/zh-CN/scripts/37821-%E7%99%BE%E5%BA%A6%E6%96%87%E5%BA%93%E7%82%B9%E5%87%BB%E7%AD%BE%E5%88%B0 <br/> 感谢 相关代码 https://blog.csdn.net/jayandchuxu/article/details/79113755#%E7%AC%AC-2-%E7%AB%A0-%E7%BC%96%E5%86%99%E7%AC%AC%E4%B8%80%E4%B8%AA%E7%94%A8%E6%88%B7%E8%84%9A%E6%9C%AC
// @author       px
// @include      https://cn.bing.com/
// @match        https://cn.bing.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393228/%E6%96%87%E5%BA%93%E7%AD%BE%E5%88%B0%E6%AF%94%E8%BE%83%E6%87%92.user.js
// @updateURL https://update.greasyfork.org/scripts/393228/%E6%96%87%E5%BA%93%E7%AD%BE%E5%88%B0%E6%AF%94%E8%BE%83%E6%87%92.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var button = document.createElement("input"); //创建一个input对象（提示框按钮）
    button.setAttribute("type", "button");
    button.setAttribute("value", "文库签到");
    //button.style.width = "60px";
   // button.style.align = "center";
    //button.style.marginLeft = "250px";
   // button.style.marginBottom = "10px";
    button.style.background = "#b46300";
   // button.style.border = "1px solid " + "#b46300";//52
    button.style.color = "white";
    var x = document.getElementById("sbox");
    x.appendChild(button);
    console.log("百度懒惰签到运行中");
    button.onclick=function(){
          window.open("https://wenku.baidu.com/task/browse/daily","_self");
    };
})();